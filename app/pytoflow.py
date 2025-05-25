# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS # For handling Cross-Origin Resource Sharing
import ast
import astunparse # For unparsing AST nodes back to code strings (pip install astunparse)
import logging

app = Flask(__name__)
CORS(app) # Enable CORS for all routes
logging.basicConfig(level=logging.DEBUG) # For more detailed server logs

class MermaidASTVisitor(ast.NodeVisitor):
    def __init__(self):
        self.mermaid_string = "graph TD\n" # TD for Top-Down
        self.node_counter = 0
        self.node_stack = [] 
        self.current_link_label = None 

    def _get_node_id(self):
        self.node_counter += 1
        return f"N{self.node_counter}"

    def _add_node_definition(self, node_id, label, shape="rectangle"):
        safe_label = label.replace('"', '#quot;').replace("'", "#apos;").replace("\n", "<br/>")
        
        if shape == "rectangle": 
            self.mermaid_string += f'    {node_id}["{safe_label}"]\n'
        elif shape == "diamond": 
            self.mermaid_string += f'    {node_id}{{"{safe_label}"}}\n'
        elif shape == "parallelogram": 
            self.mermaid_string += f'    {node_id}[/"{safe_label}"/]\n'
        elif shape == "oval": 
            self.mermaid_string += f'    {node_id}(("{safe_label}"))\n'
        app.logger.debug(f"Defined node: {node_id}[{safe_label}]")

    def _add_link(self, from_node_id, to_node_id, label=""):
        safe_label = label.replace('"', '#quot;').replace("'", "#apos;")
        if safe_label:
            self.mermaid_string += f"    {from_node_id} -- {safe_label} --> {to_node_id}\n"
        else:
            self.mermaid_string += f"    {from_node_id} --> {to_node_id}\n"
        app.logger.debug(f"Linked: {from_node_id} --{safe_label}--> {to_node_id}")

    def _create_and_link_node(self, new_node_id, label_for_new_node, shape_for_new_node):
        self._add_node_definition(new_node_id, label_for_new_node, shape_for_new_node)
        
        predecessors_to_link_from = []
        while self.node_stack: 
            predecessors_to_link_from.append(self.node_stack.pop())
        
        if not predecessors_to_link_from and label_for_new_node != "Start":
            app.logger.warning(f"Node '{label_for_new_node}' ({new_node_id}) created with no predecessors on stack.")

        processed_first_simple_pred_for_current_link_label = False 
        for pred_info in reversed(predecessors_to_link_from): 
            actual_label_for_this_link = ""
            source_node_for_this_link = ""

            if isinstance(pred_info, dict): 
                source_node_for_this_link = pred_info["from"]
                actual_label_for_this_link = pred_info["label"]
            else: 
                source_node_for_this_link = pred_info
                if not processed_first_simple_pred_for_current_link_label and self.current_link_label is not None:
                    actual_label_for_this_link = self.current_link_label
                    self.current_link_label = None 
                    processed_first_simple_pred_for_current_link_label = True
            
            if source_node_for_this_link:
                 self._add_link(source_node_for_this_link, new_node_id, actual_label_for_this_link)
            else:
                app.logger.error(f"Attempted to link from an invalid predecessor info: {pred_info}")

        self.node_stack.append(new_node_id)

    def visit(self, node):
        method = 'visit_' + node.__class__.__name__
        visitor = getattr(self, method, self.generic_visit)
        return visitor(node)

    def visit_Module(self, node):
        start_node_id = self._get_node_id()
        self._add_node_definition(start_node_id, "Start", "oval")
        self.node_stack.append(start_node_id)

        for stmt in node.body:
            self.visit(stmt)

        end_node_id = self._get_node_id()
        self._create_and_link_node(end_node_id, "End", "oval")
        
        self.node_stack.clear() 
        self.current_link_label = None


    def _handle_simple_statement(self, label, shape):
        node_id = self._get_node_id()
        self._create_and_link_node(node_id, label, shape)
    
    def _process_branch(self, source_node_id_for_branch, branch_body_nodes, first_link_label_for_branch):
        if not branch_body_nodes: 
            return [] 

        original_global_stack = list(self.node_stack) 
        original_current_link_label = self.current_link_label

        self.node_stack = [source_node_id_for_branch] 
        self.current_link_label = first_link_label_for_branch 

        for i, stmt in enumerate(branch_body_nodes):
            self.visit(stmt) 
            if i == 0: 
                self.current_link_label = None 
        
        loose_ends_of_branch = list(self.node_stack) 
        
        self.node_stack = original_global_stack
        self.current_link_label = original_current_link_label
        
        return loose_ends_of_branch

    def visit_Assign(self, node):
        targets = ", ".join([astunparse.unparse(t).strip() for t in node.targets])
        value = astunparse.unparse(node.value).strip()
        self._handle_simple_statement(f"{targets} = {value}", "rectangle")

    def visit_Expr(self, node):
        if isinstance(node.value, ast.Call):
            call_node = node.value
            if isinstance(call_node.func, ast.Name):
                func_name = call_node.func.id
                args_str = ", ".join([astunparse.unparse(arg).strip() for arg in call_node.args])
                if func_name == "print":
                    self._handle_simple_statement(f"Output: {args_str}", "parallelogram")
                    return
                elif func_name == "input":
                    prompt = astunparse.unparse(call_node.args[0]).strip() if call_node.args else ""
                    self._handle_simple_statement(f"Input: {prompt}", "parallelogram")
                    return
                else:
                    self._handle_simple_statement(f"Call: {func_name}({args_str})", "rectangle")
                    return
            else: 
                call_str = astunparse.unparse(call_node).strip()
                self._handle_simple_statement(f"Call: {call_str}", "rectangle")
                return
        
        expr_str = astunparse.unparse(node).strip()
        if not (isinstance(node.value, ast.Constant) and isinstance(node.value.value, str) and self.is_docstring(node)):
             self._handle_simple_statement(expr_str, "rectangle")

    def is_docstring(self, node):
        if isinstance(node, ast.Expr) and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
            return False 
        return False

    def visit_If(self, node):
        condition = astunparse.unparse(node.test).strip()
        
        decision_node_id = self._get_node_id()
        self._add_node_definition(decision_node_id, condition, "diamond")

        prev_flow_node = self.node_stack.pop() if self.node_stack else None
        if prev_flow_node:
            label_to_decision = self.current_link_label if self.current_link_label is not None else ""
            self._add_link(prev_flow_node, decision_node_id, label_to_decision)
            self.current_link_label = None 
        else:
            app.logger.warning(f"IF_VISIT: Node stack empty when linking to decision node {decision_node_id} for condition '{condition}'.")
            
        pending_predecessors_for_statement_after_if = []

        if node.body: 
            loose_ends_true_branch = self._process_branch(decision_node_id, node.body, "True")
            if loose_ends_true_branch:
                pending_predecessors_for_statement_after_if.extend(loose_ends_true_branch)
            else: 
                pending_predecessors_for_statement_after_if.append({"from": decision_node_id, "label": "True (empty/unhandled branch)"})
        else: 
            pending_predecessors_for_statement_after_if.append({"from": decision_node_id, "label": "True"})

        if node.orelse: 
            loose_ends_false_branch = self._process_branch(decision_node_id, node.orelse, "False")
            if loose_ends_false_branch:
                pending_predecessors_for_statement_after_if.extend(loose_ends_false_branch)
            else: 
                 pending_predecessors_for_statement_after_if.append({"from": decision_node_id, "label": "False (empty/unhandled branch)"})
        else: 
            pending_predecessors_for_statement_after_if.append({"from": decision_node_id, "label": "False"})
        
        self.node_stack.clear()
        self.node_stack.extend(pending_predecessors_for_statement_after_if)


    def visit_While(self, node):
        condition = astunparse.unparse(node.test).strip()
        
        loop_condition_node_id = self._get_node_id()
        self._add_node_definition(loop_condition_node_id, condition, "diamond")

        prev_flow_node = self.node_stack.pop() if self.node_stack else None
        if prev_flow_node:
            label_to_loop_cond = self.current_link_label if self.current_link_label is not None else ""
            self._add_link(prev_flow_node, loop_condition_node_id, label_to_loop_cond)
            self.current_link_label = None
        else:
             app.logger.warning(f"WHILE_VISIT: Node stack empty when linking to loop condition {loop_condition_node_id}.")

        if node.body:
            loose_ends_of_loop_body = self._process_branch(loop_condition_node_id, node.body, "True")
            if loose_ends_of_loop_body:
                for end_node in loose_ends_of_loop_body: 
                     if isinstance(end_node, str): 
                        self._add_link(end_node, loop_condition_node_id) 
            elif node.body: 
                 self._add_link(loop_condition_node_id, loop_condition_node_id, "True (empty/unhandled body)")
        else: 
            self._add_link(loop_condition_node_id, loop_condition_node_id, "True (empty body)")

        self.node_stack.append(loop_condition_node_id) 
        self.current_link_label = "False" 


    def visit_For(self, node):
        target_var_name = astunparse.unparse(node.target).strip()
        is_simple_range_loop = False
        range_args_values = []

        # Check for 'for x in range(...)' with literal integer arguments
        if isinstance(node.iter, ast.Call) and \
           isinstance(node.iter.func, ast.Name) and \
           node.iter.func.id == 'range':
            
            all_args_are_literals = True
            for arg_node in node.iter.args:
                if isinstance(arg_node, ast.Constant) and isinstance(arg_node.value, int):
                    range_args_values.append(arg_node.value)
                elif isinstance(arg_node, ast.UnaryOp) and \
                     isinstance(arg_node.op, ast.USub) and \
                     isinstance(arg_node.operand, ast.Constant) and \
                     isinstance(arg_node.operand.value, int):
                    range_args_values.append(-arg_node.operand.value) # Handle negative literals like -5
                else:
                    all_args_are_literals = False
                    break
            if all_args_are_literals and (1 <= len(range_args_values) <= 3):
                is_simple_range_loop = True

        # Link from previous statement to the start of the for loop processing
        prev_flow_node = self.node_stack.pop() if self.node_stack else None
        
        # This label applies to the link leading INTO the for loop structure
        label_to_for_structure = self.current_link_label if self.current_link_label is not None else ""
        self.current_link_label = None # Consume it

        if is_simple_range_loop:
            start_val = 0
            stop_val = 0
            step_val = 1

            if len(range_args_values) == 1:
                stop_val = range_args_values[0]
            elif len(range_args_values) == 2:
                start_val = range_args_values[0]
                stop_val = range_args_values[1]
            else: # len is 3
                start_val = range_args_values[0]
                stop_val = range_args_values[1]
                step_val = range_args_values[2]
            
            if step_val == 0: # range() step cannot be zero, fallback
                is_simple_range_loop = False 

            if is_simple_range_loop:
                # 1. Initialization Node
                init_label = f"{target_var_name} = {start_val}"
                init_node_id = self._get_node_id()
                self._add_node_definition(init_node_id, init_label, "rectangle")
                if prev_flow_node:
                    self._add_link(prev_flow_node, init_node_id, label_to_for_structure)
                
                # 2. Condition Node
                condition_op = "<" if step_val > 0 else ">"
                condition_label = f"{target_var_name} {condition_op} {stop_val}"
                condition_node_id = self._get_node_id()
                self._add_node_definition(condition_node_id, condition_label, "diamond")
                self._add_link(init_node_id, condition_node_id) # Link init to condition

                # 3. Loop Body (True path from condition)
                if node.body:
                    loose_ends_of_loop_body = self._process_branch(condition_node_id, node.body, "True")
                    
                    if loose_ends_of_loop_body:
                        # 4. Increment/Decrement Node
                        op_char = "+" if step_val >= 0 else "" # Handles positive and negative steps
                        inc_label = f"{target_var_name} = {target_var_name} {op_char} {step_val}"
                        inc_node_id = self._get_node_id()
                        self._add_node_definition(inc_node_id, inc_label, "rectangle")
                        
                        for end_node_body in loose_ends_of_loop_body:
                            if isinstance(end_node_body, str):
                                self._add_link(end_node_body, inc_node_id)
                        
                        # 5. Link Increment back to Condition
                        self._add_link(inc_node_id, condition_node_id) 
                    elif node.body: # Body existed but was empty/unhandled
                        self._add_link(condition_node_id, condition_node_id, "True (empty/unhandled body)")
                else: # Empty loop body
                    self._add_link(condition_node_id, condition_node_id, "True (empty body)")

                # 6. Exit Path (False path from condition)
                self.node_stack.append(condition_node_id) 
                self.current_link_label = "False" 
                return # Handled this specific for-range case

        # Fallback for non-range 'for' loops or if range parsing failed
        iter_str = astunparse.unparse(node.iter).strip()
        generic_for_label = f"For each {target_var_name} in {iter_str}"
        
        generic_loop_node_id = self._get_node_id()
        self._add_node_definition(generic_loop_node_id, generic_for_label, "diamond")
        if prev_flow_node:
            self._add_link(prev_flow_node, generic_loop_node_id, label_to_for_structure)
        
        if node.body:
            loose_ends_generic_body = self._process_branch(generic_loop_node_id, node.body, "Loop")
            if loose_ends_generic_body:
                for end_node in loose_ends_generic_body:
                    if isinstance(end_node, str):
                        self._add_link(end_node, generic_loop_node_id) 
            elif node.body:
                 self._add_link(generic_loop_node_id, generic_loop_node_id, "Loop (empty/unhandled body)")
        else: 
            self._add_link(generic_loop_node_id, generic_loop_node_id, "Loop (empty body)")

        self.node_stack.append(generic_loop_node_id)
        self.current_link_label = "End Loop"


    def visit_Pass(self, node):
        self._handle_simple_statement("Pass", "rectangle")

    def generic_visit(self, node):
        app.logger.warning(f"Unhandled AST node type: {type(node).__name__}. Node: {ast.dump(node)}. Skipping.")
        pass


@app.route('/generate_flowchart', methods=['POST'])
def generate_flowchart_route():
    data = request.get_json()
    if not data or 'code' not in data:
        return jsonify({"error": "No code provided"}), 400

    python_code = data['code']
    try:
        if not python_code.strip() or all(line.strip().startswith('#') or not line.strip() for line in python_code.splitlines()):
             pass

        parsed_ast = ast.parse(python_code)
        visitor = MermaidASTVisitor()
        visitor.visit(parsed_ast)
        mermaid_code = visitor.mermaid_string
        app.logger.debug("Generated Mermaid Code:\n%s", mermaid_code)
        return jsonify({"mermaid_code": mermaid_code})
    except SyntaxError as e:
        app.logger.error(f"Syntax Error: {e.msg} at line {e.lineno}, offset {e.offset}", exc_info=True)
        return jsonify({"error": f"Syntax Error in Python code: {e.msg} at line {e.lineno}, offset {e.offset}", "details": str(e)}), 400
    except Exception as e:
        app.logger.error(f"Error generating flowchart: {e}", exc_info=True) 
        return jsonify({"error": "An unexpected error occurred while generating the flowchart. " + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
