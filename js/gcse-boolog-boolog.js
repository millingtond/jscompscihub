// GCSE Boolean Logic - gcse-boolean-logic.js

document.addEventListener('DOMContentLoaded', function () {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Helper: Enable button if any related input/textarea has content ---
    function enableButtonOnAttempt(inputs, button) {
        if (!button) return;
        const check = () => {
            const attempted = Array.from(inputs).some(input => input && input.value.trim() !== '');
            button.disabled = !attempted;
            if (attempted) button.classList.add('attempted');
            else button.classList.remove('attempted');
        };
        inputs.forEach(input => { if (input) input.addEventListener('input', check); });
        check();
    }

    // --- Helper: Toggle solution visibility ---
    function setupShowAnswerButton(buttonId, contentId, defaultShowText = 'Show Suggested Answer', defaultHideText = 'Hide Suggested Answer') {
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);
        if (button && content) {
            button.addEventListener('click', () => {
                content.classList.toggle('solution-code');
                button.textContent = content.classList.contains('solution-code') ? defaultShowText : defaultHideText;
            });
        }
    }

    // --- Starter Activity ---
    const starterQ1 = document.getElementById('starter-q1');
    const starterQ2 = document.getElementById('starter-q2');
    const starterQ3 = document.getElementById('starter-q3');
    const starterInputs = [starterQ1, starterQ2, starterQ3].filter(el => el);
    const starterCheckBtn = document.getElementById('starter-check-answers');
    const starterResetBtn = document.getElementById('starter-reset');
    const starterFeedbackDiv = document.getElementById('starter-answers-feedback');

    if (starterCheckBtn && starterInputs.length > 0) enableButtonOnAttempt(starterInputs, starterCheckBtn);
    if (starterCheckBtn && starterFeedbackDiv) {
        starterCheckBtn.addEventListener('click', () => {
            starterFeedbackDiv.classList.toggle('hidden');
            starterCheckBtn.textContent = starterFeedbackDiv.classList.contains('hidden') ? 'Show Suggested Answers' : 'Hide Suggested Answers';
        });
    }
    if (starterResetBtn) {
        starterResetBtn.addEventListener('click', () => {
            starterInputs.forEach(input => { if(input) input.value = '';});
            if (starterFeedbackDiv) starterFeedbackDiv.classList.add('hidden');
            if (starterCheckBtn) {
                starterCheckBtn.textContent = 'Show Suggested Answers';
                starterCheckBtn.disabled = true;
                starterCheckBtn.classList.remove('attempted');
            }
        });
    }

    // --- Task 1: Basic Logic Gates ---
    function checkTruthTable(tableId, feedbackId, gateType) {
        const table = document.getElementById(tableId);
        const feedbackDiv = document.getElementById(feedbackId);
        if (!table || !feedbackDiv) return 0;
        let correctCount = 0;
        const inputs = table.querySelectorAll('tbody input[type="text"]');
        inputs.forEach(input => {
            const userVal = input.value.trim();
            const correctVal = input.dataset.correct;
            if (userVal === correctVal) {
                input.classList.remove('border-red-500'); input.classList.add('border-green-500'); correctCount++;
            } else {
                input.classList.remove('border-green-500'); input.classList.add('border-red-500');
            }
        });
        feedbackDiv.textContent = `You got ${correctCount} out of ${inputs.length} correct for the ${gateType} table.`;
        return correctCount;
    }

    ['not-truth-table', 'and-truth-table', 'or-truth-table'].forEach(tableId => {
        const table = document.getElementById(tableId);
        const buttonId = tableId.replace('-truth-table', '-check-table');
        const button = document.getElementById(buttonId);
        if (table && button) {
            const inputs = table.querySelectorAll('tbody input[type="text"]');
            enableButtonOnAttempt(inputs, button);
        }
    });

    document.getElementById('check-not-table')?.addEventListener('click', () => checkTruthTable('not-truth-table', 'not-table-feedback', 'NOT'));
    document.getElementById('check-and-table')?.addEventListener('click', () => checkTruthTable('and-truth-table', 'and-table-feedback', 'AND'));
    document.getElementById('check-or-table')?.addEventListener('click', () => checkTruthTable('or-truth-table', 'or-table-feedback', 'OR'));

    // Interactive Gate Toggles
    function setupInteractiveGate(gatePrefix, logicFn) {
        const inputs = [];
        if (document.getElementById(`${gatePrefix}-interactive-input-a`)) { // For AND, OR
            inputs.push(document.getElementById(`${gatePrefix}-interactive-input-a`));
            inputs.push(document.getElementById(`${gatePrefix}-interactive-input-b`));
            document.getElementById(`${gatePrefix}-toggle-a-0`)?.addEventListener('click', () => { inputs[0].textContent = '0'; logicFn(); });
            document.getElementById(`${gatePrefix}-toggle-a-1`)?.addEventListener('click', () => { inputs[0].textContent = '1'; logicFn(); });
            document.getElementById(`${gatePrefix}-toggle-b-0`)?.addEventListener('click', () => { inputs[1].textContent = '0'; logicFn(); });
            document.getElementById(`${gatePrefix}-toggle-b-1`)?.addEventListener('click', () => { inputs[1].textContent = '1'; logicFn(); });
        } else { // For NOT
            inputs.push(document.getElementById(`${gatePrefix}-interactive-input-a`)); // This was the span for NOT
            document.getElementById(`${gatePrefix}-toggle-a`)?.addEventListener('click', () => { inputs[0].textContent = '0'; logicFn(); }); // Button for 0
            document.getElementById(`${gatePrefix}-toggle-a-1`)?.addEventListener('click', () => { inputs[0].textContent = '1'; logicFn(); }); // Button for 1
        }
        logicFn(); // Initial update
    }

    setupInteractiveGate('not', () => {
        const inputAEl = document.getElementById('not-interactive-input-a');
        const outputQEl = document.getElementById('not-interactive-output-q');
        if(inputAEl && outputQEl) {
            const a = parseInt(inputAEl.textContent);
            outputQEl.textContent = a === 0 ? '1' : '0';
        }
    });
    setupInteractiveGate('and', () => {
        const inputAEl = document.getElementById('and-interactive-input-a');
        const inputBEl = document.getElementById('and-interactive-input-b');
        const outputQEl = document.getElementById('and-interactive-output-q');
        if(inputAEl && inputBEl && outputQEl) {
            const a = parseInt(inputAEl.textContent);
            const b = parseInt(inputBEl.textContent);
            outputQEl.textContent = (a === 1 && b === 1) ? '1' : '0';
        }
    });
    setupInteractiveGate('or', () => {
        const inputAEl = document.getElementById('or-interactive-input-a');
        const inputBEl = document.getElementById('or-interactive-input-b');
        const outputQEl = document.getElementById('or-interactive-output-q');
         if(inputAEl && inputBEl && outputQEl) {
            const a = parseInt(inputAEl.textContent);
            const b = parseInt(inputBEl.textContent);
            outputQEl.textContent = (a === 1 || b === 1) ? '1' : '0';
        }
    });


    // 1d. Gate Symbol Match-up
    const draggables = document.querySelectorAll('.gate-draggable');
    const dropzones = document.querySelectorAll('.gate-dropzone');
    const checkGateMatchBtn = document.getElementById('check-gate-match');
    const gateMatchFeedback = document.getElementById('gate-match-feedback');
    let droppedGates = { "dropzone-and": null, "dropzone-or": null, "dropzone-not": null };

    function checkGateMatchAttempt() {
        const attempted = Object.values(droppedGates).some(val => val !== null);
        if(checkGateMatchBtn) {
            checkGateMatchBtn.disabled = !attempted;
            if(attempted) checkGateMatchBtn.classList.add('attempted');
            else checkGateMatchBtn.classList.remove('attempted');
        }
    }

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', e.target.id); e.target.classList.add('opacity-50'); });
        draggable.addEventListener('dragend', (e) => { e.target.classList.remove('opacity-50'); });
    });
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('bg-blue-100'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('bg-blue-100'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault(); dropzone.classList.remove('bg-blue-100');
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedEl = document.getElementById(draggedId);
            if (draggedEl) {
                if (dropzone.firstChild && dropzone.firstChild.classList?.contains('gate-draggable')) {
                    document.getElementById('gate-name-bank').appendChild(dropzone.firstChild);
                }
                dropzone.innerHTML = ''; dropzone.appendChild(draggedEl.cloneNode(true));
                droppedGates[dropzone.id] = draggedEl.dataset.gate;
                checkGateMatchAttempt();
            }
        });
    });
    if (checkGateMatchBtn) {
        checkGateMatchBtn.addEventListener('click', () => {
            let correctMatches = 0;
            dropzones.forEach(dz => {
                if (droppedGates[dz.id] === dz.dataset.correctGate) {
                    correctMatches++; dz.classList.add('border-green-500'); dz.classList.remove('border-red-500');
                } else {
                    dz.classList.add('border-red-500'); dz.classList.remove('border-green-500');
                }
            });
            if(gateMatchFeedback) gateMatchFeedback.textContent = `You got ${correctMatches} out of ${dropzones.length} matches correct.`;
        });
    }
    
    const task1ResetBtn = document.getElementById('task1-reset');
    if (task1ResetBtn) {
        task1ResetBtn.addEventListener('click', () => {
            ['not-truth-table', 'and-truth-table', 'or-truth-table'].forEach(id => {
                document.querySelectorAll(`#${id} input[type="text"]`).forEach(input => {
                    input.value = ''; input.classList.remove('border-green-500', 'border-red-500');
                });
            });
            ['not-table-feedback', 'and-table-feedback', 'or-table-feedback', 'gate-match-feedback'].forEach(id => {
                const el = document.getElementById(id); if (el) el.textContent = '';
            });
            ['check-not-table', 'check-and-table', 'check-or-table', 'check-gate-match'].forEach(id => {
                 const btn = document.getElementById(id); if(btn) { btn.disabled = true; btn.classList.remove('attempted');}
            });
            dropzones.forEach(dz => {
                dz.innerHTML = `Drop ${dz.dataset.correctGate} here`;
                dz.classList.remove('border-green-500', 'border-red-500');
            });
            droppedGates = { "dropzone-and": null, "dropzone-or": null, "dropzone-not": null };
            // Reset interactive gate toggles
            setupInteractiveGate('not', () => { /* same logic */ });
            setupInteractiveGate('and', () => { /* same logic */ });
            setupInteractiveGate('or', () => { /* same logic */ });
        });
    }

    // --- Task 2: Combining Logic Gates ---
    const comboTable = document.getElementById('combo-truth-table');
    const checkComboTableBtn = document.getElementById('check-combo-table');
    if (comboTable && checkComboTableBtn) {
        const comboInputs = comboTable.querySelectorAll('tbody input[type="text"]');
        enableButtonOnAttempt(comboInputs, checkComboTableBtn);
        checkComboTableBtn.addEventListener('click', () => checkTruthTable('combo-truth-table', 'combo-table-feedback', 'Combined Logic'));
    }

    const exprFromTableInput = document.getElementById('expr-from-table');
    const showExprAnswerBtn = document.getElementById('show-expr-answer');
    if(exprFromTableInput && showExprAnswerBtn) enableButtonOnAttempt([exprFromTableInput], showExprAnswerBtn);
    setupShowAnswerButton('show-expr-answer', 'expr-answer', 'Show Suggested Expression', 'Hide Suggested Expression');

    // 2a. Interactive Circuit Simulator for Q = (A AND B) OR (NOT B)
    const circuitInputA = document.getElementById('circuit-input-a');
    const circuitInputB = document.getElementById('circuit-input-b');
    const nodeA = document.getElementById('node-a');
    const nodeB = document.getElementById('node-b');
    const nodeNotB = document.getElementById('node-not-b');
    const nodeAndAB = document.getElementById('node-and-ab');
    const nodeQFinal = document.getElementById('node-q-final');

    function updateCircuitSim() {
        if (!circuitInputA || !circuitInputB || !nodeA || !nodeB || !nodeNotB || !nodeAndAB || !nodeQFinal) return;
        const a = circuitInputA.checked ? 1 : 0;
        const b = circuitInputB.checked ? 1 : 0;

        const not_b_val = (b === 0) ? 1 : 0;
        const a_and_b_val = (a === 1 && b === 1) ? 1 : 0;
        const q_final_val = (a_and_b_val === 1 || not_b_val === 1) ? 1 : 0;

        nodeA.textContent = a; nodeA.className = `logic-circuit-node ${a ? 'active' : 'inactive'}`;
        nodeB.textContent = b; nodeB.className = `logic-circuit-node ${b ? 'active' : 'inactive'}`;
        nodeNotB.textContent = not_b_val; nodeNotB.className = `logic-circuit-node ${not_b_val ? 'active' : 'inactive'}`;
        nodeAndAB.textContent = a_and_b_val; nodeAndAB.className = `logic-circuit-node ${a_and_b_val ? 'active' : 'inactive'}`;
        nodeQFinal.textContent = q_final_val; nodeQFinal.className = `logic-circuit-node ${q_final_val ? 'active' : 'inactive'}`;
    }
    if (circuitInputA) circuitInputA.addEventListener('change', updateCircuitSim);
    if (circuitInputB) circuitInputB.addEventListener('change', updateCircuitSim);
    if (circuitInputA) updateCircuitSim(); // Initial state

    // 2c. Boolean Expression Evaluator
    const evalExpressionInput = document.getElementById('eval-expression');
    const evalInputA = document.getElementById('eval-input-a');
    const evalInputB = document.getElementById('eval-input-b');
    const evalResultSpan = document.getElementById('eval-result');
    const evalFeedback = document.getElementById('eval-feedback');

    function evaluateBooleanExpression() {
        if (!evalExpressionInput || !evalInputA || !evalInputB || !evalResultSpan || !evalFeedback) return;
        const expr = evalExpressionInput.value.toUpperCase();
        const a = evalInputA.checked; // true or false
        const b = evalInputB.checked; // true or false

        try {
            // Basic parser - very limited for safety, only A, B, AND, OR, NOT, ()
            // Replace keywords with JS equivalents, be careful with this approach for complex scenarios
            let jsExpr = expr.replace(/\bAND\b/g, '&&')
                             .replace(/\bOR\b/g, '||')
                             .replace(/\bNOT\b/g, '!')
                             .replace(/\bA\b/g, a)
                             .replace(/\bB\b/g, b);
            
            // Validate for allowed characters to prevent arbitrary code execution
            if (/[^A-Z&|! ()]/.test(expr.replace(/\s/g, ''))) { // Check original expression for safety
                 if (expr.trim() !== "" && !/^(A|B|NOT|AND|OR|\(|\)|\s)+$/i.test(expr)) {
                    throw new Error("Invalid characters in expression. Only A, B, AND, OR, NOT, () allowed.");
                 }
            }
            
            const result = new Function(`return ${jsExpr}`)();
            evalResultSpan.textContent = result ? '1 (True)' : '0 (False)';
            evalResultSpan.className = `eval-output ${result ? 'text-green-600' : 'text-red-600'}`;
            evalFeedback.textContent = '';
        } catch (e) {
            evalResultSpan.textContent = 'Error';
            evalResultSpan.className = 'eval-output text-red-600';
            evalFeedback.textContent = "Error: " + e.message;
        }
    }
    if (evalExpressionInput) evalExpressionInput.addEventListener('input', evaluateBooleanExpression);
    if (evalInputA) evalInputA.addEventListener('change', evaluateBooleanExpression);
    if (evalInputB) evalInputB.addEventListener('change', evaluateBooleanExpression);
    if (evalExpressionInput) evaluateBooleanExpression(); // Initial call

    const task2ResetBtn = document.getElementById('task2-reset');
    if (task2ResetBtn) {
        task2ResetBtn.addEventListener('click', () => {
            document.querySelectorAll('#combo-truth-table input[type="text"]').forEach(input => {
                input.value = ''; input.classList.remove('border-green-500', 'border-red-500');
            });
            const ctf = document.getElementById('combo-table-feedback'); if (ctf) ctf.textContent = '';
            if (checkComboTableBtn) { checkComboTableBtn.disabled = true; checkComboTableBtn.classList.remove('attempted');}

            if (exprFromTableInput) exprFromTableInput.value = '';
            const ea = document.getElementById('expr-answer'); if (ea) ea.classList.add('solution-code');
            if (showExprAnswerBtn) { showExprAnswerBtn.textContent = 'Show Suggested Expression'; showExprAnswerBtn.disabled = true; showExprAnswerBtn.classList.remove('attempted');}
            
            if (circuitInputA) circuitInputA.checked = false;
            if (circuitInputB) circuitInputB.checked = false;
            updateCircuitSim();

            if(evalExpressionInput) evalExpressionInput.value = "A AND B";
            if(evalInputA) evalInputA.checked = false;
            if(evalInputB) evalInputB.checked = false;
            evaluateBooleanExpression();
        });
    }

    // --- Task 3: Applying Logic ---
    const alarmExpressionInput = document.getElementById('alarm-expression'); // Though not used for check, part of the task
    const alarmTable = document.getElementById('alarm-truth-table');
    const checkAlarmSystemBtn = document.getElementById('check-alarm-system');
    const alarmExprSolutionDiv = document.getElementById('alarm-expr-solution'); // For showing expression

    // Interactive Alarm Simulation
    const alarmInputA = document.getElementById('alarm-input-a');
    const alarmInputB = document.getElementById('alarm-input-b');
    const alarmInputC = document.getElementById('alarm-input-c');
    const alarmNodeA = document.getElementById('alarm-node-a');
    const alarmNodeB = document.getElementById('alarm-node-b');
    const alarmNodeC = document.getElementById('alarm-node-c');
    const alarmNodeAB = document.getElementById('alarm-node-ab');
    const alarmNodeCB = document.getElementById('alarm-node-cb');
    const alarmOutputX = document.getElementById('alarm-output-x');

    function updateAlarmSim() {
        if(!alarmInputA || !alarmInputB || !alarmInputC || !alarmNodeA || !alarmNodeB || !alarmNodeC || !alarmNodeAB || !alarmNodeCB || !alarmOutputX) return;
        const a = alarmInputA.checked ? 1 : 0;
        const b = alarmInputB.checked ? 1 : 0;
        const c = alarmInputC.checked ? 1 : 0;

        const ab_val = (a === 1 && b === 1) ? 1 : 0;
        const cb_val = (c === 1 && b === 1) ? 1 : 0;
        const x_val = (ab_val === 1 || cb_val === 1) ? 1 : 0;

        alarmNodeA.textContent = a; alarmNodeA.className = `logic-circuit-node ${a ? 'active' : 'inactive'}`;
        alarmNodeB.textContent = b; alarmNodeB.className = `logic-circuit-node ${b ? 'active' : 'inactive'}`;
        alarmNodeC.textContent = c; alarmNodeC.className = `logic-circuit-node ${c ? 'active' : 'inactive'}`;
        alarmNodeAB.textContent = ab_val; alarmNodeAB.className = `logic-circuit-node ${ab_val ? 'active' : 'inactive'}`;
        alarmNodeCB.textContent = cb_val; alarmNodeCB.className = `logic-circuit-node ${cb_val ? 'active' : 'inactive'}`;
        
        alarmOutputX.textContent = x_val ? "ALARM!" : "SAFE";
        alarmOutputX.className = x_val ? 'alarm-status-triggered' : 'alarm-status-safe';
    }
    if(alarmInputA) alarmInputA.addEventListener('change', updateAlarmSim);
    if(alarmInputB) alarmInputB.addEventListener('change', updateAlarmSim);
    if(alarmInputC) alarmInputC.addEventListener('change', updateAlarmSim);
    if(alarmInputA) updateAlarmSim(); // Initial state


    if (alarmTable && checkAlarmSystemBtn) {
        const alarmTruthTableInputs = alarmTable.querySelectorAll('tbody input[type="text"]');
        let allInputsForCheck = Array.from(alarmTruthTableInputs);
        if (alarmExpressionInput) allInputsForCheck.push(alarmExpressionInput); // Include expression input for enabling button

        enableButtonOnAttempt(allInputsForCheck, checkAlarmSystemBtn);

        checkAlarmSystemBtn.addEventListener('click', () => {
            checkTruthTable('alarm-truth-table', 'alarm-system-feedback', 'Alarm System Truth Table');
            if (alarmExpressionInput && alarmExpressionInput.value.trim() !== '' && alarmExprSolutionDiv) {
                alarmExprSolutionDiv.classList.remove('solution-code'); // Show expression solution if attempted
            }
        });
    }
    
    const task3ResetBtn = document.getElementById('task3-reset');
    if (task3ResetBtn) {
        task3ResetBtn.addEventListener('click', () => {
            if(alarmExpressionInput) alarmExpressionInput.value = '';
            document.querySelectorAll('#alarm-truth-table input[type="text"]').forEach(input => {
                input.value = ''; input.classList.remove('border-green-500', 'border-red-500');
            });
            const asf = document.getElementById('alarm-system-feedback'); if (asf) asf.textContent = '';
            if (alarmExprSolutionDiv) alarmExprSolutionDiv.classList.add('solution-code');
            if (checkAlarmSystemBtn) { checkAlarmSystemBtn.disabled = true; checkAlarmSystemBtn.classList.remove('attempted');}
            // Reset alarm sim inputs
            if(alarmInputA) alarmInputA.checked = false;
            if(alarmInputB) alarmInputB.checked = false;
            if(alarmInputC) alarmInputC.checked = false;
            updateAlarmSim();
        });
    }

    // --- Exam Practice Reset (Task 4) & Button Logic ---
    const task4ExamResetBtn = document.getElementById('task4-exam-reset');
    if (task4ExamResetBtn) {
        task4ExamResetBtn.addEventListener('click', () => {
            document.querySelectorAll('#exam-practice textarea.exam-answer-area, #exam-practice input.self-assess-input').forEach(input => input.value = '');
            document.querySelectorAll('#exam-practice input[type="text"]').forEach(input => { // For truth table in exam Q
                input.value = '';
                input.classList.remove('border-green-500', 'border-red-500');
            });
            document.querySelectorAll('#exam-practice div.mark-scheme').forEach(ms => ms.classList.add('hidden'));
            document.querySelectorAll('#exam-practice button.toggle-mark-scheme-btn').forEach(btn => btn.disabled = true);
        });
    }
    
    document.querySelectorAll('.exam-question').forEach(question => {
        const predictedMarkInput = question.querySelector('.self-assess-input');
        const toggleBtn = question.querySelector('.toggle-mark-scheme-btn');
        const answerAreas = question.querySelectorAll('.exam-answer-area, .truth-table input[type="text"]');

        function checkExamAttempt() {
            if (!predictedMarkInput || !toggleBtn) return;
            let mainAnswerAttempted = false;
            answerAreas.forEach(area => {
                if (area.value.trim() !== '') mainAnswerAttempted = true;
            });
            const markEntered = predictedMarkInput.value.trim() !== '' && 
                                !isNaN(parseInt(predictedMarkInput.value)) &&
                                parseInt(predictedMarkInput.value) >= 0 &&
                                parseInt(predictedMarkInput.value) <= parseInt(predictedMarkInput.max);
            toggleBtn.disabled = !(mainAnswerAttempted && markEntered);
        }
        if (predictedMarkInput) predictedMarkInput.addEventListener('input', checkExamAttempt);
        answerAreas.forEach(area => area.addEventListener('input', checkExamAttempt));
        if (toggleBtn) checkExamAttempt(); // Initial check
    });

    // --- Reset All Tasks ---
    const resetAllBtnLogic = document.getElementById('reset-all-btn');
    if (resetAllBtnLogic) {
        resetAllBtnLogic.addEventListener('click', () => {
            if (starterResetBtn) starterResetBtn.click();
            if (task1ResetBtn) task1ResetBtn.click();
            if (task2ResetBtn) task2ResetBtn.click();
            if (task3ResetBtn) task3ResetBtn.click();
            if (task4ExamResetBtn) task4ExamResetBtn.click();
            
            const finalScoreDisplay = document.getElementById('final-score-display');
            if (finalScoreDisplay) finalScoreDisplay.textContent = "";
            const finalScoreFeedback = document.getElementById('final-score-feedback');
            if (finalScoreFeedback) finalScoreFeedback.textContent = "";
        });
    }

    // Initial setup for disabled buttons
    if (starterCheckBtn && starterInputs.length > 0) enableButtonOnAttempt(starterInputs, starterCheckBtn);
});
