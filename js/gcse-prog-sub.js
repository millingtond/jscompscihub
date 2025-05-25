// js/gcse-progfun-subroutines.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize specific tasks
    initializeTask1SubroutineType();
    initializeTask2SubroutineAnatomy(); // Handles both OCR ERL D&D and Python fill-in
    initializeTask3ParameterPassing();
    initializeTask4VariableScope();
    initializeTask5WritingSubroutines();
    initializeTask6PythonChallenge(); // New task for Python challenges
    initializeTask7BenefitsMatching(); // Renumbered
    initializeExamPracticeSubroutines();


    // General setup (these could be in worksheet-common.js)
    setupAnswerButtonEnablingGeneral(); 
    setupToggleAnswerVisibility();   
});

// --- Task 1: Identify Subroutine Type ---
function initializeTask1SubroutineType() {
    // Button enabling is handled by setupAnswerButtonEnablingGeneral based on .exam-answer-area
}
function resetTask1SubroutineType() {
    document.getElementById('type-a').value = '';
    document.getElementById('reason-a').value = '';
    document.getElementById('type-b').value = '';
    document.getElementById('reason-b').value = '';
    document.getElementById('answer-a').classList.add('hidden');
    document.getElementById('answer-b').classList.add('hidden');
    document.querySelectorAll('#task1-subroutine-type .toggle-answer-btn').forEach(btn => btn.disabled = true);
}

// --- Task 2: Anatomy of a Subroutine ---
// Part A: OCR ERL Drag and Drop
let draggedItemTask2 = null;
function initializeTask2SubroutineAnatomy() {
    // OCR ERL Drag and Drop
    const labels = document.querySelectorAll('#label-bank-task2 .draggable-label');
    labels.forEach(label => {
        label.addEventListener('dragstart', event => {
            draggedItemTask2 = event.target;
            event.dataTransfer.setData('text/plain', event.target.dataset.label);
            setTimeout(() => { if (draggedItemTask2) draggedItemTask2.classList.add('dragging'); }, 0);
        });
        label.addEventListener('dragend', event => {
            if (event.target.classList.contains('dragging')) event.target.classList.remove('dragging');
            draggedItemTask2 = null;
        });
    });

    const dropZones = document.querySelectorAll('#task2-subroutine-anatomy .drop-zone'); // Only ERL drop zones
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', event => {
            event.preventDefault();
            if (draggedItemTask2 && (zone.children.length === 0 || zone.children[0] !== draggedItemTask2)) {
                zone.classList.add('drag-over');
            }
        });
        zone.addEventListener('dragleave', event => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', event => {
            event.preventDefault();
            const targetZone = event.currentTarget;
            targetZone.classList.remove('drag-over');
            if (draggedItemTask2) {
                const existingLabel = targetZone.querySelector('.draggable-label');
                if (existingLabel && existingLabel !== draggedItemTask2) {
                    document.getElementById('label-bank-task2').appendChild(existingLabel);
                    existingLabel.classList.remove('correct', 'incorrect');
                }
                if (draggedItemTask2.parentNode) draggedItemTask2.parentNode.removeChild(draggedItemTask2);
                targetZone.innerHTML = ''; 
                targetZone.appendChild(draggedItemTask2);
            }
        });
    });
     const labelBank = document.getElementById('label-bank-task2');
    if (labelBank) {
        labelBank.addEventListener('dragover', event => event.preventDefault());
        labelBank.addEventListener('drop', event => {
            event.preventDefault();
            if (draggedItemTask2) {
                if (draggedItemTask2.parentNode) draggedItemTask2.parentNode.removeChild(draggedItemTask2);
                labelBank.appendChild(draggedItemTask2);
                draggedItemTask2.classList.remove('correct', 'incorrect');
            }
        });
    }
    // Python Anatomy button enabling handled by setupAnswerButtonEnablingGeneral
}

function checkTask2SubroutineAnatomy() { // Checks OCR ERL Part A
    const feedbackEl = document.getElementById('task2-feedback');
    let correctCount = 0;
    const dropZones = document.querySelectorAll('#task2-subroutine-anatomy .grid > div:first-child .drop-zone'); // Target only ERL drop zones
    let labelsPlaced = 0;
    dropZones.forEach(zone => {
        const placedLabel = zone.querySelector('.draggable-label');
        if (placedLabel) {
            labelsPlaced++;
            placedLabel.classList.remove('correct', 'incorrect');
            if (placedLabel.dataset.label === zone.dataset.correct) {
                placedLabel.classList.add('correct');
                correctCount++;
            } else {
                placedLabel.classList.add('incorrect');
            }
        }
    });
    if (labelsPlaced === 0) {
        feedbackEl.innerHTML = '<p class="text-blue-600">Please drag labels to the OCR ERL diagram parts.</p>';
        feedbackEl.className = 'feedback-area notice';
        return;
    }
    feedbackEl.innerHTML = `<p class="font-semibold">OCR ERL Anatomy: You placed ${correctCount} out of ${dropZones.length} labels correctly.</p>`;
    feedbackEl.className = correctCount === dropZones.length ? 'feedback-area correct' : 'feedback-area incorrect';
}

function checkTask2PythonAnatomy() {
    const feedbackEl = document.getElementById('task2-python-feedback');
    const answers = {
        'python-anatomy-1': "Function Definition Keyword",
        'python-anatomy-2': "Function Name",
        'python-anatomy-3': "Parameter(s)",
        'python-anatomy-4': "Function Body",
        'python-anatomy-5': "Return Statement",
        'python-anatomy-6': "Function Call",
        'python-anatomy-7': "Argument(s)"
    };
    let correctCount = 0;
    let attemptedCount = 0;
    Object.keys(answers).forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl.value.trim() !== "") {
            attemptedCount++;
            if (inputEl.value.trim().toLowerCase() === answers[id].toLowerCase()) {
                correctCount++;
                inputEl.classList.add('border-green-500');
                inputEl.classList.remove('border-red-500');
            } else {
                inputEl.classList.add('border-red-500');
                inputEl.classList.remove('border-green-500');
            }
        } else {
             inputEl.classList.remove('border-green-500', 'border-red-500');
        }
    });

    if (attemptedCount === 0) {
        feedbackEl.innerHTML = '<p class="text-blue-600">Please attempt to identify the Python anatomy parts.</p>';
        feedbackEl.className = 'feedback-area notice';
        return;
    }
    feedbackEl.innerHTML = `<p class="font-semibold">Python Anatomy: You identified ${correctCount} out of ${Object.keys(answers).length} parts correctly.</p>`;
    feedbackEl.className = correctCount === Object.keys(answers).length ? 'feedback-area correct' : 'feedback-area incorrect';
}


function resetTask2SubroutineAnatomy() {
    // OCR ERL Reset
    document.getElementById('task2-feedback').innerHTML = '';
    document.getElementById('task2-feedback').className = 'feedback-area';
    const dropZones = document.querySelectorAll('#task2-subroutine-anatomy .grid > div:first-child .drop-zone');
    const labelBank = document.getElementById('label-bank-task2');
    dropZones.forEach(zone => {
        const placedLabel = zone.querySelector('.draggable-label');
        if (placedLabel) {
            placedLabel.classList.remove('correct', 'incorrect');
            labelBank.appendChild(placedLabel);
        }
        zone.textContent = zone.dataset.originalText || ''; 
    });

    // Python Anatomy Reset
    document.getElementById('task2-python-feedback').innerHTML = '';
    document.getElementById('task2-python-feedback').className = 'feedback-area';
    const pythonInputs = ['python-anatomy-1', 'python-anatomy-2', 'python-anatomy-3', 'python-anatomy-4', 'python-anatomy-5', 'python-anatomy-6', 'python-anatomy-7'];
    pythonInputs.forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.classList.remove('border-green-500', 'border-red-500');
    });
}


// --- Task 3: Parameter Passing Simulator ---
let paramSimInterval;
let paramSimSteps = [];
let currentParamStep = 0;

function initializeTask3ParameterPassing() {
    document.getElementById('run-param-sim-btn').addEventListener('click', prepareAndRunParamSim);
    resetTask3ParameterPassing(); 
}

function generateParamSimCode(arg1, arg2) {
    const erlCodeArea = document.getElementById('param-sim-erl-code');
    const pythonCodeArea = document.getElementById('param-sim-python-code');

    const erlCode = [
        `procedure addAndPrint(<span class="parameter">numA</span>, <span class="parameter">numB</span>)`, // Line 0
        `    total = <span class="parameter">numA</span> + <span class="parameter">numB</span>`,            // Line 1
        `    print("Sum: " + total)`,        // Line 2
        `endprocedure`,                     // Line 3
        ``,                                 // Line 4 (blank)
        `// Calling the procedure`,          // Line 5
        `addAndPrint(<span class="argument">${arg1}</span>, <span class="argument">${arg2}</span>)`       // Line 6
    ];
    erlCodeArea.innerHTML = erlCode.map((line, i) => `<div class="code-line" data-line-param-erl="${i}">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`).join('');

    const pythonCode = [
        `<span class="python-keyword">def</span> add_and_print(<span class="parameter">a</span>, <span class="parameter">b</span>):`, // Line 0
        `    total = <span class="parameter">a</span> + <span class="parameter">b</span>`,         // Line 1
        `    print(f"Sum: {total}")`,     // Line 2
        ``,                                 // Line 3 (blank)
        `<span class="python-comment"># Calling the function</span>`,      // Line 4
        `add_and_print(<span class="argument">${arg1}</span>, <span class="argument">${arg2}</span>)`    // Line 5
    ];
    pythonCodeArea.innerHTML = pythonCode.map((line, i) => `<div class="code-line" data-line-param-python="${i}">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`).join('');
}

function highlightParamSimLine(codeType, lineNumber) {
    const displayId = `param-sim-${codeType}-code`;
    document.querySelectorAll(`#${displayId} .code-line`).forEach(l => l.classList.remove('highlight-line'));
    const lineEl = document.querySelector(`#${displayId} .code-line[data-line-param-${codeType}="${lineNumber}"]`);
    if (lineEl) lineEl.classList.add('highlight-line');
}

function prepareAndRunParamSim() {
    clearInterval(paramSimInterval);
    currentParamStep = 0;
    paramSimSteps = [];

    const arg1Val = document.getElementById('param-arg1').value;
    const arg2Val = document.getElementById('param-arg2').value;
    const outputArea = document.getElementById('param-sim-output');
    outputArea.innerHTML = '';

    const numA = parseInt(arg1Val);
    const numB = parseInt(arg2Val);

    if (isNaN(numA) || isNaN(numB)) {
        outputArea.textContent = "Please enter valid numbers for arguments.";
        return;
    }
    generateParamSimCode(numA, numB);

    paramSimSteps.push({ erl: 6, py: 5, message: `Main: Calling subroutine with arguments <span class="argument">${numA}</span> and <span class="argument">${numB}</span>.` });
    paramSimSteps.push({ erl: 0, py: 0, message: `Subroutine: Parameters <span class="parameter">numA</span>/<span class="parameter">a</span> = <span class="argument">${numA}</span>, <span class="parameter">numB</span>/<span class="parameter">b</span> = <span class="argument">${numB}</span>.` });
    paramSimSteps.push({ erl: 1, py: 1, message: `Subroutine: Calculating total = ${numA} + ${numB} = ${numA + numB}.` });
    paramSimSteps.push({ erl: 2, py: 2, message: `Subroutine: Printing sum.` });
    paramSimSteps.push({ type: 'output', value: `Sum: ${numA + numB}` });
    paramSimSteps.push({ erl: 3, py: 0, message: `Subroutine: Execution finished.` }); // Python implicitly finishes
    paramSimSteps.push({ erl: 6, py: 5, message: `Main: Returned to call site.` });
    paramSimSteps.push({ type: 'highlight-clear', message: 'Simulation complete.' });
    
    document.getElementById('run-param-sim-btn').disabled = true;
    executeNextParamStep();
}

function executeNextParamStep() {
    if (currentParamStep >= paramSimSteps.length) {
        document.getElementById('run-param-sim-btn').disabled = false;
        return;
    }
    const step = paramSimSteps[currentParamStep];
    const outputArea = document.getElementById('param-sim-output');
    
    highlightParamSimLine('erl', null); // Clear previous ERL
    highlightParamSimLine('python', null); // Clear previous Python

    if (step.type === 'output') {
        outputArea.innerHTML += `<div class="font-bold text-green-600">${step.value}</div>`;
    } else if (step.type === 'highlight-clear') {
         outputArea.innerHTML += `<div class="italic text-gray-600">${step.message}</div>`;
    } else {
        if (step.erl !== undefined) highlightParamSimLine('erl', step.erl);
        if (step.py !== undefined) highlightParamSimLine('python', step.py);
        outputArea.innerHTML += `<div>${step.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    }
    outputArea.scrollTop = outputArea.scrollHeight;
    currentParamStep++;
    paramSimInterval = setTimeout(executeNextParamStep, 1800); // Slightly slower for readability
}

function resetTask3ParameterPassing() {
    clearInterval(paramSimInterval);
    currentParamStep = 0;
    paramSimSteps = [];
    document.getElementById('param-arg1').value = '10';
    document.getElementById('param-arg2').value = '5';
    document.getElementById('param-sim-output').innerHTML = 'Enter arguments and click "Run Parameter Demo".';
    generateParamSimCode(10, 5); // Show initial code
    document.querySelectorAll('.code-line').forEach(l => l.classList.remove('highlight-line'));
    document.getElementById('run-param-sim-btn').disabled = false;
}


// --- Task 4: Spot the Scope! ---
function initializeTask4VariableScope() { /* Handled by setupAnswerButtonEnablingGeneral */ }
function resetTask4VariableScope() {
    const ids = ['erl-scope-output1', 'erl-scope-output2', 'erl-scope-output3', 'erl-scope-output4',
                 'py-scope-output1', 'py-scope-output2', 'py-scope-outputX', 'py-scope-output3', 'py-scope-output4'];
    ids.forEach(id => document.getElementById(id).value = '');
    document.getElementById('erl-scope-answers').classList.add('hidden');
    document.getElementById('py-scope-answers').classList.add('hidden');
    document.querySelectorAll('#task4-variable-scope .toggle-answer-btn').forEach(btn => btn.disabled = true);
}

// --- Task 5: Writing Subroutines ---
function initializeTask5WritingSubroutines() { /* Handled by setupAnswerButtonEnablingGeneral */ }
function resetTask5WritingSubroutines() {
    document.getElementById('write-proc1-erl').value = '';
    document.getElementById('write-proc1-py').value = '';
    document.getElementById('write-func1-erl').value = '';
    document.getElementById('write-func1-py').value = '';
    document.getElementById('write-proc1-answer').classList.add('hidden');
    document.getElementById('write-func1-answer').classList.add('hidden');
    document.querySelectorAll('#task5-writing-subroutines .toggle-answer-btn').forEach(btn => btn.disabled = true);
}

// --- Task 6: Python Subroutine Challenge ---
function initializeTask6PythonChallenge() { /* Handled by setupAnswerButtonEnablingGeneral */ }
function resetTask6PythonChallenge() {
    document.getElementById('python-chal1-code').value = '';
    document.getElementById('python-chal2-code').value = '';
    document.getElementById('python-chal1-answer').classList.add('hidden');
    document.getElementById('python-chal2-answer').classList.add('hidden');
    document.querySelectorAll('#task6-python-challenge .toggle-answer-btn').forEach(btn => btn.disabled = true);
}


// --- Task 7 (was 6): Benefits of Subroutines (Matching) ---
let selectedBenefitName = null;
let selectedBenefitDesc = null;

function initializeTask7BenefitsMatching() { // Renamed from initializeTask6...
    document.querySelectorAll('#matching-benefits-names .matching-item').forEach(item => {
        item.addEventListener('click', () => selectBenefitItem(item, 'name'));
    });
    document.querySelectorAll('#matching-benefits-descs .matching-item').forEach(item => {
        item.addEventListener('click', () => selectBenefitItem(item, 'desc'));
    });
    resetBenefitsMatching(); 
}

function selectBenefitItem(item, type) {
    const listId = type === 'name' ? 'matching-benefits-names' : 'matching-benefits-descs';
    document.querySelectorAll(`#${listId} .matching-item`).forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    if (type === 'name') selectedBenefitName = item;
    else selectedBenefitDesc = item;
}

function checkBenefitsMatching() {
    const feedbackEl = document.getElementById('benefits-matching-feedback');
    if (!selectedBenefitName || !selectedBenefitDesc) {
        feedbackEl.innerHTML = '<p class="text-blue-600">Please select one item from each list to match.</p>';
        feedbackEl.className = 'feedback-area notice';
        return;
    }
    if (selectedBenefitName.dataset.match === selectedBenefitDesc.dataset.match) {
        feedbackEl.innerHTML = '<p class="font-semibold text-green-700">Correct Match!</p>';
        feedbackEl.className = 'feedback-area correct';
        selectedBenefitName.classList.add('matched-correct');
        selectedBenefitDesc.classList.add('matched-correct');
        selectedBenefitName.classList.remove('selected');
        selectedBenefitDesc.classList.remove('selected');
        selectedBenefitName.style.pointerEvents = 'none';
        selectedBenefitDesc.style.pointerEvents = 'none';
    } else {
        feedbackEl.innerHTML = '<p class="font-semibold text-red-700">Incorrect Match. Try again.</p>';
        feedbackEl.className = 'feedback-area incorrect';
        selectedBenefitName.classList.add('matched-incorrect');
        selectedBenefitDesc.classList.add('matched-incorrect');
        setTimeout(() => {
            if (selectedBenefitName) selectedBenefitName.classList.remove('matched-incorrect', 'selected');
            if (selectedBenefitDesc) selectedBenefitDesc.classList.remove('matched-incorrect', 'selected');
        }, 1000);
    }
    selectedBenefitName = null;
    selectedBenefitDesc = null;

    const allMatched = document.querySelectorAll('#matching-benefits-names .matching-item:not(.matched-correct)').length === 0;
    if (allMatched) {
         feedbackEl.innerHTML += '<p class="font-semibold text-green-700 mt-2">All benefits matched correctly!</p>';
    }
}

function resetBenefitsMatching() { // Renamed from resetTask6...
    document.getElementById('benefits-matching-feedback').innerHTML = '';
    document.getElementById('benefits-matching-feedback').className = 'feedback-area';
    document.querySelectorAll('.matching-item').forEach(item => {
        item.classList.remove('selected', 'matched-correct', 'matched-incorrect');
        item.style.pointerEvents = 'auto';
    });
    selectedBenefitName = null;
    selectedBenefitDesc = null;
}

// --- Exam Practice ---
function initializeExamPracticeSubroutines() { /* Handled by setupAnswerButtonEnablingGeneral */ }
function resetExamPracticeSubroutines() {
    ['exam-q1-sub', 'exam-q2-sub', 'exam-q3-sub'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['ms-q1-sub', 'ms-q2-sub', 'ms-q3-sub'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    document.querySelectorAll('#exam-practice-subroutines .toggle-mark-scheme-btn').forEach(btn => btn.disabled = true);
}

// --- Reset All Tasks ---
function resetAllTasks() {
    resetTask1SubroutineType();
    resetTask2SubroutineAnatomy();
    resetTask3ParameterPassing();
    resetTask4VariableScope();
    resetTask5WritingSubroutines();
    resetTask6PythonChallenge();
    resetBenefitsMatching(); // Renamed from resetTask6...
    resetExamPracticeSubroutines();

    document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);
    ['starter-big-task', 'starter-reuse-instructions', 'starter-subroutine-guess'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

// --- General Setup Functions (Potentially from worksheet-common.js or similar) ---
function setupAnswerButtonEnablingGeneral() {
    const inputsToWatch = document.querySelectorAll('.exam-answer-area, .scope-input'); // Add other relevant input classes if needed
    
    inputsToWatch.forEach(input => {
        let buttonToEnable = null;
        const parentQuestionContainer = input.closest('.subroutine-id-question, .writing-sub-question, .exam-question, .bg-sky-50, .bg-lime-50, .python-challenge-question');
        
        if (parentQuestionContainer) {
            buttonToEnable = parentQuestionContainer.querySelector('.toggle-answer-btn, .toggle-mark-scheme-btn');
        }

        if (buttonToEnable) {
            buttonToEnable.disabled = true; 
            input.addEventListener('input', () => {
                let attemptMade = false;
                if (input.tagName.toLowerCase() === 'textarea' || input.type === 'text' || input.type === 'number' || input.tagName.toLowerCase() === 'select') {
                    attemptMade = input.value.trim() !== '';
                }
                
                // Special condition for scope task: enable if ALL inputs in that specific scope block (ERL or Python) are filled
                if (input.classList.contains('scope-input')) {
                    const scopeBlock = input.closest('.bg-sky-50, .bg-lime-50'); // Parent of a scope section
                    if (scopeBlock) {
                        const allScopeInputsInBlock = scopeBlock.querySelectorAll('.scope-input');
                        attemptMade = Array.from(allScopeInputsInBlock).every(si => si.value.trim() !== '');
                        // Re-target buttonToEnable specifically for this scope block's button
                        buttonToEnable = scopeBlock.querySelector('.toggle-answer-btn');
                    }
                }
                 if (buttonToEnable) buttonToEnable.disabled = !attemptMade;
            });
        }
    });
}

function setupToggleAnswerVisibility() {
    document.querySelectorAll('.toggle-answer-btn, .toggle-mark-scheme-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.answerId || this.dataset.markSchemeId;
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.classList.toggle('hidden');
                }
            }
        });
    });
}
