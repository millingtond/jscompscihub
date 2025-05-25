// GCSE Testing & Maintainability - gcse-testing-maintainability.js

document.addEventListener('DOMContentLoaded', function () {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // --- Helper: Enable button if any related input/textarea has content ---
    function enableButtonOnAttempt(inputs, button) {
        if (!button) {
            // console.warn("enableButtonOnAttempt: Button not found for inputs:", inputs.map(i => i ? i.id : 'null'));
            return;
        }
        const check = () => {
            const attempted = Array.from(inputs).some(input => input && input.value.trim() !== '');
            button.disabled = !attempted;
            if (attempted) button.classList.add('attempted');
            else button.classList.remove('attempted');
        };
        inputs.forEach(input => { 
            if (input) {
                input.addEventListener('input', check); 
            }
        });
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
    const starterCheckBtn = document.getElementById('starter-check-answers');
    const starterResetBtn = document.getElementById('starter-reset');
    const starterFeedbackDiv = document.getElementById('starter-answers-feedback');

    if (starterQ1 && starterCheckBtn) enableButtonOnAttempt([starterQ1], starterCheckBtn);
    if (starterCheckBtn && starterFeedbackDiv) {
        starterCheckBtn.addEventListener('click', () => {
            starterFeedbackDiv.classList.toggle('hidden');
            starterCheckBtn.textContent = starterFeedbackDiv.classList.contains('hidden') ? 'Show Suggested Reasons' : 'Hide Suggested Reasons';
        });
    }
    if (starterResetBtn) {
        starterResetBtn.addEventListener('click', () => {
            if(starterQ1) starterQ1.value = '';
            if (starterFeedbackDiv) starterFeedbackDiv.classList.add('hidden');
            if (starterCheckBtn) {
                starterCheckBtn.textContent = 'Show Suggested Reasons';
                starterCheckBtn.disabled = true;
                starterCheckBtn.classList.remove('attempted');
            }
        });
    }

    // --- Task 1 (was Task 0): Identifying Errors ---
    const syntaxErrorDesc = document.getElementById('syntax-error-desc');
    const showSyntaxAnswerBtn = document.getElementById('show-syntax-answer');
    const syntaxErrorSolution = document.getElementById('syntax-error-solution');
    const logicErrorDesc = document.getElementById('logic-error-desc');
    const showLogicAnswerBtn = document.getElementById('show-logic-answer');
    const logicErrorSolution = document.getElementById('logic-error-solution');
    const task1ErrorResetBtn = document.getElementById('task1-error-reset'); 

    if(syntaxErrorDesc && showSyntaxAnswerBtn) enableButtonOnAttempt([syntaxErrorDesc], showSyntaxAnswerBtn);
    setupShowAnswerButton('show-syntax-answer', 'syntax-error-solution', 'Show Syntax Error Answer', 'Hide Syntax Error Answer');
    if(logicErrorDesc && showLogicAnswerBtn) enableButtonOnAttempt([logicErrorDesc], showLogicAnswerBtn);
    setupShowAnswerButton('show-logic-answer', 'logic-error-solution', 'Show Logic Error Answer', 'Hide Logic Error Answer');

    if(task1ErrorResetBtn) { 
        task1ErrorResetBtn.addEventListener('click', () => {
            if(syntaxErrorDesc) syntaxErrorDesc.value = '';
            if(syntaxErrorSolution) syntaxErrorSolution.classList.add('solution-code');
            if(showSyntaxAnswerBtn) { showSyntaxAnswerBtn.textContent = 'Show Syntax Error Answer'; showSyntaxAnswerBtn.disabled = true; showSyntaxAnswerBtn.classList.remove('attempted');}
            if(logicErrorDesc) logicErrorDesc.value = '';
            if(logicErrorSolution) logicErrorSolution.classList.add('solution-code');
            if(showLogicAnswerBtn) { showLogicAnswerBtn.textContent = 'Show Logic Error Answer'; showLogicAnswerBtn.disabled = true; showLogicAnswerBtn.classList.remove('attempted');}
        });
    }

    // --- Task 2 (was Task 1): Types of Testing & Bug Hunter Simulation ---
    const task2Discussion = document.getElementById('task2-discussion'); 
    const extWhiteBox = document.getElementById('ext-white-box');
    const extBlackBox = document.getElementById('ext-black-box');
    const extAlpha = document.getElementById('ext-alpha-testing');
    const extBeta = document.getElementById('ext-beta-testing');
    const showExtensionAnswersBtn = document.getElementById('show-extension-answers');
    const extensionAnswersFeedback = document.getElementById('extension-answers-feedback');
    
    const task2ExtensionInputs = [extWhiteBox, extBlackBox, extAlpha, extBeta].filter(el => el); 
    if(showExtensionAnswersBtn && task2ExtensionInputs.length > 0) enableButtonOnAttempt(task2ExtensionInputs, showExtensionAnswersBtn);
    setupShowAnswerButton('show-extension-answers', 'extension-answers-feedback', 'Show Suggested Descriptions', 'Hide Suggested Descriptions');

    // Bug Hunter Simulation (Task 2b)
    const module1Div = document.getElementById('bug-hunter-module1');
    const module2Div = document.getElementById('bug-hunter-module2');
    const testModule1Btn = document.getElementById('test-module1-btn');
    const testModule2Btn = document.getElementById('test-module2-btn');
    const module1Feedback = document.getElementById('module1-feedback');
    const module2Feedback = document.getElementById('module2-feedback');
    const module1FixOptions = document.getElementById('module1-fix-options');
    const module2FixOptions = document.getElementById('module2-fix-options');
    const bugHunterSummary = document.getElementById('bug-hunter-summary');
    let module1Fixed = false;
    let module2Fixed = false;

    const originalModule1Code = '<code>\ndef get_price():\n    price_str = input("Enter item price: ")\n    price = float(price_str) # Potential bug if not a number\n    if price < 0 # Potential bug: missing colon\n        print("Price cannot be negative.")\n        return -1 # Indicate error\n    return price\n                </code>';
    const fixedModule1Code = '<code>\ndef get_price():\n    price_str = input("Enter item price: ")\n    try: # Added try-except for robustness\n        price = float(price_str) \n    except ValueError:\n        print("Invalid input. Not a number.")\n        return -1 \n    if price < 0: # Corrected line\n        print("Price cannot be negative.")\n        return -1 \n    return price\n                    </code>';
    const originalModule2Code = '<code>\ndef calculate_final_price(original_price, is_member):\n    if is_member == "True": # Potential bug: comparing boolean to string\n        discount = original_price * 0.10\n        return original_price - discount\n    else:\n        return original_price\n                </code>';
    const fixedModule2Code = '<code>\ndef calculate_final_price(original_price, is_member):\n    if is_member: # Corrected line (or is_member == True)\n        discount = original_price * 0.10\n        return original_price - discount\n    else:\n        return original_price\n                </code>';

    if (testModule1Btn && module1Feedback && module1FixOptions && module2Div) {
        testModule1Btn.addEventListener('click', () => {
            if (!module1Fixed) {
                module1Feedback.innerHTML = '<span class="text-red-600 font-semibold">Test Failed!</span> Input "-5": Expected error message and -1, but code has a syntax error (<code class="error-highlight">if price < 0</code> missing colon).';
                module1FixOptions.classList.remove('hidden');
            } else {
                module1Feedback.innerHTML = '<span class="text-green-600 font-semibold">Test Passed!</span> Module 1 seems to handle negative prices correctly now.';
                module1FixOptions.classList.add('hidden');
                module2Div.classList.remove('hidden'); 
            }
        });
    }

    if (module1FixOptions && module1Feedback) {
        module1FixOptions.querySelectorAll('.bug-fix-option').forEach(button => {
            button.addEventListener('click', (e) => {
                if (e.target.dataset.fix === "correct") {
                    module1Fixed = true;
                    module1Feedback.innerHTML = '<span class="text-green-600 font-semibold">Bug Fixed!</span> The line is now <code>if price < 0:</code>. The `try-except` block was also added for robustness. Try testing Module 1 again.';
                    const m1CodeDisplay = document.getElementById('module1-code-display');
                    if(m1CodeDisplay) m1CodeDisplay.innerHTML = fixedModule1Code;
                } else {
                    module1Feedback.innerHTML = '<span class="text-red-600">That\'s not the right fix for the syntax error. The issue is a missing colon.</span>';
                }
                module1FixOptions.classList.add('hidden');
            });
        });
    }

    if (testModule2Btn && module2Feedback && module2FixOptions && bugHunterSummary) {
        testModule2Btn.addEventListener('click', () => {
            if (!module2Fixed) {
                module2Feedback.innerHTML = '<span class="text-red-600 font-semibold">Test Failed!</span> Price 100, Member True: Expected 90.0. Actual: 100.0. The condition <code class="error-highlight">is_member == "True"</code> compares a boolean to a string.';
                module2FixOptions.classList.remove('hidden');
            } else {
                module2Feedback.innerHTML = '<span class="text-green-600 font-semibold">Test Passed!</span> Module 2 calculates discounts correctly now.';
                module2FixOptions.classList.add('hidden');
                bugHunterSummary.classList.remove('hidden');
            }
        });
    }
    
    if (module2FixOptions && module2Feedback) {
        module2FixOptions.querySelectorAll('.bug-fix-option').forEach(button => {
            button.addEventListener('click', (e) => {
                if (e.target.dataset.fix === "correct") {
                    module2Fixed = true;
                    module2Feedback.innerHTML = '<span class="text-green-600 font-semibold">Bug Fixed!</span> The condition is now <code>if is_member:</code>. Try testing Module 2 again.';
                    const m2CodeDisplay = document.getElementById('module2-code-display');
                    if(m2CodeDisplay) m2CodeDisplay.innerHTML = fixedModule2Code;
                } else {
                    module2Feedback.innerHTML = '<span class="text-red-600">That\'s not the right fix. The issue is comparing a boolean to a string.</span>';
                }
                module2FixOptions.classList.add('hidden');
            });
        });
    }

    const task2TestingTypeResetBtn = document.getElementById('task2-testingtype-reset'); 
    if (task2TestingTypeResetBtn) {
        task2TestingTypeResetBtn.addEventListener('click', () => {
            if(task2Discussion) task2Discussion.value = ''; 
            task2ExtensionInputs.forEach(input => {if(input) input.value = '';});
            if(extensionAnswersFeedback) extensionAnswersFeedback.classList.add('solution-code');
            if(showExtensionAnswersBtn) {
                showExtensionAnswersBtn.textContent = 'Show Suggested Descriptions';
                showExtensionAnswersBtn.disabled = true;
                showExtensionAnswersBtn.classList.remove('attempted');
            }
            module1Fixed = false; module2Fixed = false;
            if(module1Feedback) module1Feedback.innerHTML = '';
            if(module2Feedback) module2Feedback.innerHTML = '';
            if(module1FixOptions) module1FixOptions.classList.add('hidden');
            if(module2FixOptions) module2FixOptions.classList.add('hidden');
            if(module2Div) module2Div.classList.add('hidden');
            if(bugHunterSummary) bugHunterSummary.classList.add('hidden');
            const m1Code = document.getElementById('module1-code-display');
            if (m1Code) m1Code.innerHTML = originalModule1Code;
            const m2Code = document.getElementById('module2-code-display');
            if(m2Code) m2Code.innerHTML = originalModule2Code;
        });
    }

    // --- Task 3 (was Task 2): Maintainability & Code Refactor Challenge ---
    const task3Readability = document.getElementById('task3-readability'); 
    const task3Comments = document.getElementById('task3-comments'); 
    const task3Subprograms = document.getElementById('task3-subprograms'); 
    const refactorSubprograms = document.getElementById('refactor-subprograms');
    const refactorVariables = document.getElementById('refactor-variables');
    const refactorComments = document.getElementById('refactor-comments');
    const showRefactorSolutionBtn = document.getElementById('show-refactor-solution');
    const refactorSolutionDiv = document.getElementById('refactor-solution');
    const refactorInputs = [refactorSubprograms, refactorVariables, refactorComments].filter(el => el);

    if(showRefactorSolutionBtn && refactorInputs.length > 0) enableButtonOnAttempt(refactorInputs, showRefactorSolutionBtn);
    setupShowAnswerButton('show-refactor-solution', 'refactor-solution', 'Show Suggested Refactoring', 'Hide Suggested Refactoring');

    const task3MaintainResetBtn = document.getElementById('task3-maintain-reset'); 
    if (task3MaintainResetBtn) {
        task3MaintainResetBtn.addEventListener('click', () => {
            if(task3Readability) task3Readability.value = ''; 
            if(task3Comments) task3Comments.value = ''; 
            if(task3Subprograms) task3Subprograms.value = ''; 
            refactorInputs.forEach(input => {if(input) input.value = '';});
            if(refactorSolutionDiv) refactorSolutionDiv.classList.add('solution-code');
            if(showRefactorSolutionBtn) {
                showRefactorSolutionBtn.textContent = 'Show Suggested Refactoring';
                showRefactorSolutionBtn.disabled = true;
                showRefactorSolutionBtn.classList.remove('attempted');
            }
        });
    }
    
    // --- Task 4 (was Task 3): Test Data & Program Robustness ---
    const testRequirementInput = document.getElementById('test-requirement');
    const dataNormalInput = document.getElementById('data-normal-input');
    const dataBoundaryInput = document.getElementById('data-boundary-input');
    const dataInvalidInput = document.getElementById('data-invalid-input');
    const dataErroneousInput = document.getElementById('data-erroneous-input');
    const checkMyTestDataBtn = document.getElementById('check-my-test-data-btn');
    const feedbackNormalDiv = document.getElementById('feedback-normal');
    const feedbackBoundaryDiv = document.getElementById('feedback-boundary');
    const feedbackInvalidDiv = document.getElementById('feedback-invalid');
    const feedbackErroneousDiv = document.getElementById('feedback-erroneous');
    const task4Robustness = document.getElementById('task4-robustness'); 
    const task4aInputs = [testRequirementInput, dataNormalInput, dataBoundaryInput, dataInvalidInput, dataErroneousInput].filter(el => el); 

    if (checkMyTestDataBtn && task4aInputs.length === 5) { // Ensure all 5 inputs are present
        enableButtonOnAttempt(task4aInputs, checkMyTestDataBtn); 
        checkMyTestDataBtn.addEventListener('click', () => {
            const requirement = testRequirementInput.value.trim();
            if (!requirement) { alert("Please describe the input requirement first."); return; }
            
            const normalData = dataNormalInput.value.trim();
            const boundaryData = dataBoundaryInput.value.trim();
            const invalidData = dataInvalidInput.value.trim();
            const erroneousData = dataErroneousInput.value.trim();

            feedbackNormalDiv.innerHTML = normalData ? "<strong>Normal Data:</strong> Consider if '<code>" + normalData + "</code>' represents typical, valid inputs that your program should process without issues for the requirement: \"<em>" + requirement + "</em>\"." : "What are some typical valid inputs?";
            feedbackNormalDiv.className = "feedback-text-sm " + (normalData ? 'positive' : 'neutral');
            
            feedbackBoundaryDiv.innerHTML = boundaryData ? "<strong>Boundary Data:</strong> Think about values at the exact edges of valid and invalid ranges for \"<em>" + requirement + "</em>\". Is '<code>" + boundaryData + "</code>' one of these?" : "What inputs test the limits?";
            feedbackBoundaryDiv.className = "feedback-text-sm " + (boundaryData ? 'positive' : 'neutral');

            feedbackInvalidDiv.innerHTML = invalidData ? "<strong>Invalid Data:</strong> This data should be the correct type but fall outside acceptable limits for \"<em>" + requirement + "</em>\". Does '<code>" + invalidData + "</code>' fit this?" : "What valid-type data should be rejected?";
            feedbackInvalidDiv.className = "feedback-text-sm " + (invalidData ? 'positive' : 'neutral');
            
            feedbackErroneousDiv.innerHTML = erroneousData ? "<strong>Erroneous Data:</strong> This data should be of a completely wrong type for \"<em>" + requirement + "</em>\" (e.g., text instead of a number). Does '<code>" + erroneousData + "</code>' fit this?" : "What wrong-type data could be entered?";
            feedbackErroneousDiv.className = "feedback-text-sm " + (erroneousData ? 'positive' : 'neutral');
        });
    }
    const task4TestDataResetBtn = document.getElementById('task4-testdata-reset'); 
    if (task4TestDataResetBtn) {
        task4TestDataResetBtn.addEventListener('click', () => {
            task4aInputs.forEach(input => {if(input) input.value = '';}); 
            [feedbackNormalDiv, feedbackBoundaryDiv, feedbackInvalidDiv, feedbackErroneousDiv].forEach(div => {if(div) {div.innerHTML = ''; div.className='feedback-text-sm';}});
            if(checkMyTestDataBtn) { checkMyTestDataBtn.disabled = true; checkMyTestDataBtn.classList.remove('attempted'); }
            if(task4Robustness) task4Robustness.value = ''; 
        });
    }

    // --- Task 5 (was Task 4): Creating a Test Plan (Interactive) ---
    const addTestCaseBtn = document.getElementById('add-test-case-btn');
    const testPlanBody = document.getElementById('test-plan-body');
    let testCaseIdCounter = 0;

    function addTestCaseRow() {
        if (!testPlanBody) return;
        testCaseIdCounter++;
        const row = testPlanBody.insertRow();
        row.innerHTML = `
            <td><input type="text" value="TC${String(testCaseIdCounter).padStart(3, '0')}" class="bg-gray-100" readonly></td>
            <td><input type="text" placeholder="e.g., Price=100, Member=True"></td>
            <td><input type="text" placeholder="e.g., 90.0"></td>
            <td><input type="text" placeholder="Actual result after running"></td>
            <td><select><option value="">Select</option><option value="Pass">Pass</option><option value="Fail">Fail</option></select></td>
            <td><button class="remove-test-case-btn text-red-500 hover:text-red-700 text-xs p-1">Remove</button></td>
        `;
        const removeBtn = row.querySelector('.remove-test-case-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() { this.closest('tr').remove(); });
        }
    }

    if (addTestCaseBtn) { 
        addTestCaseBtn.addEventListener('click', addTestCaseRow); 
        // Add initial rows only if testPlanBody is empty to avoid duplication on script re-runs
        if (testPlanBody && testPlanBody.children.length === 0) {
            addTestCaseRow(); 
            addTestCaseRow();
        }
    }
    const task5TestPlanResetBtn = document.getElementById('task5-testplan-reset'); 
    if (task5TestPlanResetBtn) {
        task5TestPlanResetBtn.addEventListener('click', () => {
            if(testPlanBody) testPlanBody.innerHTML = ''; 
            testCaseIdCounter = 0; 
            addTestCaseRow(); 
            addTestCaseRow();
        });
    }

    // --- Task 6 (was Task 5): Exam Practice Questions Reset & Button Logic ---
    const task6ExamResetBtn = document.getElementById('task6-exam-reset'); 
    if (task6ExamResetBtn) {
        task6ExamResetBtn.addEventListener('click', () => {
            document.querySelectorAll('#exam-practice textarea.exam-answer-area, #exam-practice input.self-assess-input').forEach(input => {if(input)input.value = '';});
            document.querySelectorAll('#exam-practice div.mark-scheme').forEach(ms => {if(ms)ms.classList.add('hidden');});
            document.querySelectorAll('#exam-practice button.toggle-mark-scheme-btn').forEach(btn => {if(btn)btn.disabled = true;});
        });
    }
     document.querySelectorAll('.exam-question').forEach(question => {
        const predictedMarkInput = question.querySelector('.self-assess-input');
        const toggleBtn = question.querySelector('.toggle-mark-scheme-btn');
        const answerArea = question.querySelector('.exam-answer-area');

        function checkExamAttempt() {
            if (!predictedMarkInput || !toggleBtn || !answerArea) return;
            const mainAnswerAttempted = answerArea.value.trim() !== '';
            const markEntered = predictedMarkInput.value.trim() !== '' && 
                                !isNaN(parseInt(predictedMarkInput.value)) &&
                                parseInt(predictedMarkInput.value) >= 0 &&
                                parseInt(predictedMarkInput.value) <= parseInt(predictedMarkInput.max);
            toggleBtn.disabled = !(mainAnswerAttempted && markEntered);
        }
        if (predictedMarkInput) predictedMarkInput.addEventListener('input', checkExamAttempt);
        if (answerArea) answerArea.addEventListener('input', checkExamAttempt);
        if (toggleBtn) checkExamAttempt(); 
    });

    // --- Reset All Tasks ---
    const resetAllBtnTesting = document.getElementById('reset-all-btn');
    if (resetAllBtnTesting) {
        resetAllBtnTesting.addEventListener('click', () => {
            if (starterResetBtn) starterResetBtn.click();
            if (task1ErrorResetBtn) task1ErrorResetBtn.click(); 
            if (task2TestingTypeResetBtn) task2TestingTypeResetBtn.click();
            if (task3MaintainResetBtn) task3MaintainResetBtn.click();
            if (task4TestDataResetBtn) task4TestDataResetBtn.click();
            if (task5TestPlanResetBtn) task5TestPlanResetBtn.click();
            if (task6ExamResetBtn) task6ExamResetBtn.click(); 
            
            const finalScoreDisplay = document.getElementById('final-score-display'); if (finalScoreDisplay) finalScoreDisplay.textContent = "";
            const finalScoreFeedback = document.getElementById('final-score-feedback'); if (finalScoreFeedback) finalScoreFeedback.textContent = "";
        });
    }

    // Initial setup for disabled buttons, ensuring all elements are checked.
    if (starterCheckBtn && starterQ1) enableButtonOnAttempt([starterQ1], starterCheckBtn);
    if (showExtensionAnswersBtn && task2ExtensionInputs.length > 0) enableButtonOnAttempt(task2ExtensionInputs, showExtensionAnswersBtn);
    if(syntaxErrorDesc && showSyntaxAnswerBtn) enableButtonOnAttempt([syntaxErrorDesc], showSyntaxAnswerBtn);
    if(logicErrorDesc && showLogicAnswerBtn) enableButtonOnAttempt([logicErrorDesc], showLogicAnswerBtn);
    if(checkMyTestDataBtn && task4aInputs.length === 5) enableButtonOnAttempt(task4aInputs, checkMyTestDataBtn); 
    if(showRefactorSolutionBtn && refactorInputs.length > 0) enableButtonOnAttempt(refactorInputs, showRefactorSolutionBtn);
});
