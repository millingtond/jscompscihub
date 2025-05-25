// js/gcse-progfun-iteration-forloops.js

document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDropTask1();
    initializeTask2ButtonEnabling();
    initializeTask3Simulator();
    initializeTask4ButtonEnabling();
    initializeTask5StringIterator();
    initializeTask6ButtonEnabling();
    initializeTask7ButtonEnabling();

    setupAnswerButtonEnablingGeneral();
    setupToggleAnswerVisibility();
});

// --- Task 1: Anatomy of a For Loop (Drag and Drop) ---
let draggedItemTask1 = null;

function initializeDragAndDropTask1() {
    console.log("Task 1 D&D Initializing...");
    const labels = document.querySelectorAll('#label-bank-task1 .draggable-label');
    labels.forEach(label => {
        label.addEventListener('dragstart', event => {
            draggedItemTask1 = event.target;
            event.dataTransfer.setData('text/plain', event.target.dataset.label);
            console.log('Drag Start:', draggedItemTask1.dataset.label);
            setTimeout(() => { // Defer class change
                if (draggedItemTask1) draggedItemTask1.classList.add('dragging');
            }, 0);
        });

        label.addEventListener('dragend', event => {
            console.log('Drag End:', event.target.dataset.label);
            if (event.target.classList.contains('dragging')) { // Check if class was added
                event.target.classList.remove('dragging');
            }
            draggedItemTask1 = null; // Crucial to clear after operation
        });
    });

    const dropZones = document.querySelectorAll('#task1-forloop-anatomy .drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', event => {
            event.preventDefault();
            if (draggedItemTask1 && (zone.children.length === 0 || zone.children[0] !== draggedItemTask1)) {
                zone.classList.add('drag-over');
            }
        });
        zone.addEventListener('dragleave', event => {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', event => {
            event.preventDefault();
            const targetZone = event.currentTarget;
            targetZone.classList.remove('drag-over');
            console.log('Attempting Drop:', draggedItemTask1 ? draggedItemTask1.dataset.label : 'No dragged item', 'onto zone:', targetZone.id);

            if (draggedItemTask1) {
                const existingLabelInZone = targetZone.querySelector('.draggable-label');
                if (existingLabelInZone && existingLabelInZone !== draggedItemTask1) {
                    console.log('Moving existing label', existingLabelInZone.dataset.label, 'from zone', targetZone.id, 'to bank.');
                    existingLabelInZone.classList.remove('correct', 'incorrect');
                    document.getElementById('label-bank-task1').appendChild(existingLabelInZone);
                }

                // Remove from previous parent IF it's not the target zone itself (to avoid issues if re-dropping in same spot, though less likely here)
                if (draggedItemTask1.parentNode && draggedItemTask1.parentNode !== targetZone) {
                     draggedItemTask1.parentNode.removeChild(draggedItemTask1);
                }
                
                targetZone.innerHTML = ''; // Clear placeholder text
                targetZone.appendChild(draggedItemTask1);
                console.log('Dropped:', draggedItemTask1.dataset.label, 'into zone:', targetZone.id, 'Zone children count:', targetZone.children.length);
                // draggedItemTask1 will be nulled by its own 'dragend' event
            } else {
                console.log('Drop event fired but draggedItemTask1 is null.');
            }
        });
    });

    const labelBank = document.getElementById('label-bank-task1');
    if (labelBank) {
        labelBank.addEventListener('dragover', event => event.preventDefault());
        labelBank.addEventListener('drop', event => {
            event.preventDefault();
            const targetBank = event.currentTarget;
            console.log('Attempting Drop on Bank:', draggedItemTask1 ? draggedItemTask1.dataset.label : 'No dragged item');
            if (draggedItemTask1) {
                if (draggedItemTask1.parentNode && draggedItemTask1.parentNode !== targetBank) {
                    draggedItemTask1.parentNode.removeChild(draggedItemTask1);
                }
                targetBank.appendChild(draggedItemTask1);
                draggedItemTask1.classList.remove('correct', 'incorrect');
                console.log('Dropped:', draggedItemTask1.dataset.label, 'into bank.');
            }
        });
    }
    console.log("Task 1 D&D Initialized.");
}

function checkTask1ForLoopAnatomy() {
    console.log("Checking Task 1 Labels...");
    const feedbackEl = document.getElementById('task1-feedback');
    let correctCount = 0;
    const dropZones = document.querySelectorAll('#task1-forloop-anatomy .drop-zone');
    let labelsPlaced = 0;

    dropZones.forEach(zone => {
        const placedLabel = zone.querySelector('.draggable-label'); // Check for the appended label element
        if (placedLabel) {
            labelsPlaced++;
            const correctLabelValue = zone.dataset.correct;
            const placedLabelValue = placedLabel.dataset.label;
            console.log(`Zone: ${zone.id}, Placed: ${placedLabelValue}, Expected: ${correctLabelValue}`);
            placedLabel.classList.remove('correct', 'incorrect');
            if (placedLabelValue === correctLabelValue) {
                placedLabel.classList.add('correct');
                correctCount++;
            } else {
                placedLabel.classList.add('incorrect');
            }
        } else {
            console.log(`Zone: ${zone.id}, No label found.`);
        }
    });

    if (labelsPlaced === 0) {
        feedbackEl.innerHTML = '<p class="text-blue-600">Please drag labels to the diagram to check them.</p>';
        feedbackEl.className = 'feedback-area notice';
        console.log("No labels were found placed in drop zones.");
        return;
    }
    feedbackEl.innerHTML = `<p class="font-semibold">You placed ${correctCount} out of ${dropZones.length} labels correctly.</p>`;
    feedbackEl.className = correctCount === dropZones.length ? 'feedback-area correct' : 'feedback-area incorrect';
    console.log(`Check complete: ${correctCount} / ${dropZones.length} correct.`);
}

function resetTask1ForLoopAnatomy() {
    console.log("Resetting Task 1...");
    document.getElementById('task1-feedback').innerHTML = '';
    document.getElementById('task1-feedback').className = 'feedback-area';
    const dropZones = document.querySelectorAll('#task1-forloop-anatomy .drop-zone');
    const labelBank = document.getElementById('label-bank-task1');

    // Move all labels currently in drop zones back to the label bank
    dropZones.forEach(zone => {
        const placedLabel = zone.querySelector('.draggable-label');
        if (placedLabel) {
            placedLabel.classList.remove('correct', 'incorrect', 'dragging');
            labelBank.appendChild(placedLabel);
        }
    });

    // Restore original text to drop zones
    dropZones.forEach(zone => {
        if (zone.dataset.originalText) {
            zone.innerHTML = zone.dataset.originalText; // Use innerHTML if original text might contain formatting, else textContent
        } else {
            zone.innerHTML = ''; // If no original text, make it empty
        }
    });
    console.log("Task 1 Reset Complete.");
}


// --- Task 2: Predicting Loop Output ---
function initializeTask2ButtonEnabling() { /* Handled by setupAnswerButtonEnablingGeneral */ }
function resetTask2PredictOutput() {
    ['predict-q1-output', 'predict-q2-output', 'predict-q3-output'].forEach(id => document.getElementById(id).value = '');
    ['predict-q1-answer', 'predict-q2-answer', 'predict-q3-answer'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.querySelectorAll('#task2-predict-output .toggle-answer-btn').forEach(btn => btn.disabled = true);
}

// --- Task 3: For Loop Simulator ---
let simulationIntervalTask3;
let simulationStepsTask3 = [];
let currentStepTask3 = 0;

function initializeTask3Simulator() {
    const runButton = document.getElementById('run-simulator-btn');
    if (runButton) {
        runButton.addEventListener('click', prepareAndRunLoopSimulator);
    }
    resetTask3LoopSimulator(); 
}

function generateCodeSnippets(start, end, step) {
    const loopVar = "i"; 
    const ocrErlLines = [
        `// OCR ERL Code`,
        `for ${loopVar} = ${start} to ${end}${step !== 1 ? ` step ${step}` : ''}`,
        `    print(${loopVar})`,
        `next ${loopVar}`
    ];
    document.getElementById('ocr-erl-code-display').innerHTML = ocrErlLines.map((line, index) => `<div class="code-line" data-line-ocr="${index}">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`).join('');

    let pythonRangeEnd = end;
    if (step > 0) {
      pythonRangeEnd = end + 1; 
    } else if (step < 0) {
      pythonRangeEnd = end -1; 
      if (start < end && step < 0) pythonRangeEnd = start -1; 
    }

    const pythonLines = [
        `# Python Code`,
        `for ${loopVar} in range(${start}, ${pythonRangeEnd}${step !== 1 ? `, ${step}` : ''}):`,
        `    print(${loopVar})`
    ];
     document.getElementById('python-code-display').innerHTML = pythonLines.map((line, index) => `<div class="code-line" data-line-python="${index}">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`).join('');
}

function highlightLine(codeType, lineNumber) {
    const displayElementId = `${codeType}-code-display`; 
    document.querySelectorAll(`#${displayElementId} .code-line`).forEach(line => line.classList.remove('highlight-line'));
    const lineToHighlight = document.querySelector(`#${displayElementId} .code-line[data-line-${codeType.split('-')[0]}="${lineNumber}"]`); 
    if (lineToHighlight) {
        lineToHighlight.classList.add('highlight-line');
    }
}

function prepareAndRunLoopSimulator() {
    clearInterval(simulationIntervalTask3);
    currentStepTask3 = 0;
    simulationStepsTask3 = [];

    const startVal = parseInt(document.getElementById('sim-start').value);
    const endVal = parseInt(document.getElementById('sim-end').value);
    const stepVal = parseInt(document.getElementById('sim-step').value);
    const outputArea = document.getElementById('simulator-output-area');
    outputArea.innerHTML = ''; 

    generateCodeSnippets(startVal, endVal, stepVal); 

    if (isNaN(startVal) || isNaN(endVal) || isNaN(stepVal)) {
        outputArea.textContent = 'Error: Please enter valid numbers for start, end, and step values.';
        return;
    }
    if (stepVal === 0) {
        outputArea.textContent = 'Error: Step value cannot be zero.';
        return;
    }

    simulationStepsTask3.push({ type: 'highlight', ocr: 1, python: 1, message: `Starting loop: for i = ${startVal} to ${endVal} step ${stepVal}` });

    let iterations = 0;
    const maxIterations = 100;

    if (stepVal > 0) { 
        if (startVal > endVal) {
            simulationStepsTask3.push({ type: 'message', message: "Loop condition (start > end with positive step) not met. Loop doesn't run." });
        }
        for (let i = startVal; i <= endVal; i += stepVal) {
            if (++iterations > maxIterations) {
                simulationStepsTask3.push({ type: 'message', message: "Max iterations reached. Stopping." });
                break;
            }
            simulationStepsTask3.push({ type: 'highlight', ocr: 1, python: 1, message: `Iteration ${iterations}: Checking condition (i=${i} <= ${endVal})` });
            simulationStepsTask3.push({ type: 'highlight', ocr: 2, python: 2, message: `Executing loop body: print(${i})` });
            simulationStepsTask3.push({ type: 'output', value: i, message: `Output: ${i}` });
            simulationStepsTask3.push({ type: 'highlight', ocr: 3, python: 1, message: `Next i (i becomes ${i + stepVal})` }); 
        }
    } else { 
        if (startVal < endVal) {
            simulationStepsTask3.push({ type: 'message', message: "Loop condition (start < end with negative step) not met. Loop doesn't run." });
        }
        for (let i = startVal; i >= endVal; i += stepVal) { 
            if (++iterations > maxIterations) {
                simulationStepsTask3.push({ type: 'message', message: "Max iterations reached. Stopping." });
                break;
            }
            simulationStepsTask3.push({ type: 'highlight', ocr: 1, python: 1, message: `Iteration ${iterations}: Checking condition (i=${i} >= ${endVal})` });
            simulationStepsTask3.push({ type: 'highlight', ocr: 2, python: 2, message: `Executing loop body: print(${i})` });
            simulationStepsTask3.push({ type: 'output', value: i, message: `Output: ${i}` });
            simulationStepsTask3.push({ type: 'highlight', ocr: 3, python: 1, message: `Next i (i becomes ${i + stepVal})` });
        }
    }
    if (iterations === 0 && simulationStepsTask3.length <= 1) { 
        simulationStepsTask3.push({ type: 'message', message: "Loop did not execute any iterations based on conditions." });
    }
    simulationStepsTask3.push({ type: 'message', message: "Loop finished." });
    simulationStepsTask3.push({ type: 'highlight-clear' });


    document.getElementById('run-simulator-btn').disabled = true;
    executeNextStepTask3();
}

function executeNextStepTask3() {
    if (currentStepTask3 >= simulationStepsTask3.length) {
        document.getElementById('run-simulator-btn').disabled = false;
        return;
    }

    const step = simulationStepsTask3[currentStepTask3];
    const outputArea = document.getElementById('simulator-output-area');

    if (step.type === 'highlight') {
        highlightLine('ocr-erl', step.ocr); 
        highlightLine('python', step.python);   
        outputArea.innerHTML += `<div>${step.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    } else if (step.type === 'output') {
        outputArea.innerHTML += `<div class="font-bold text-green-600">${step.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    } else if (step.type === 'message') {
        outputArea.innerHTML += `<div class="italic text-gray-600">${step.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    } else if (step.type === 'highlight-clear') {
        document.querySelectorAll(`#ocr-erl-code-display .code-line, #python-code-display .code-line`).forEach(line => line.classList.remove('highlight-line'));
    }
    
    outputArea.scrollTop = outputArea.scrollHeight;


    currentStepTask3++;
    simulationIntervalTask3 = setTimeout(executeNextStepTask3, 1200); 
}

function resetTask3LoopSimulator() {
    clearInterval(simulationIntervalTask3);
    currentStepTask3 = 0;
    simulationStepsTask3 = [];
    document.getElementById('sim-start').value = '1';
    document.getElementById('sim-end').value = '3';
    document.getElementById('sim-step').value = '1';
    document.getElementById('simulator-output-area').innerHTML = 'Enter values and click "Run Simulation" to see results.';
    document.getElementById('ocr-erl-code-display').innerHTML = '// OCR ERL code will appear here';
    document.getElementById('python-code-display').innerHTML = '# Python code will appear here';
    document.querySelectorAll('.code-line').forEach(line => line.classList.remove('highlight-line'));
    document.getElementById('run-simulator-btn').disabled = false;
    generateCodeSnippets(1,3,1); 
}


// --- Task 4: Writing For Loops ---
function initializeTask4ButtonEnabling() { /* Handled by setupAnswerButtonEnablingGeneral */ }
function resetTask4WritingLoops() {
    const fillBlanks = ['write-q1-var', 'write-q1-start', 'write-q1-end', 'write-q1-output', 'write-q1-nextvar', 'write-q2-start', 'write-q2-stop', 'write-q2-step'];
    fillBlanks.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
    document.getElementById('write-q3-code').value = '';
    ['write-q1-answer', 'write-q2-answer', 'write-q3-answer'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.querySelectorAll('#task4-writing-loops .toggle-answer-btn').forEach(btn => btn.disabled = true);
}

// --- Task 5: Iterating Through a String ---
let stringIterationIntervalTask5;
let stringIterationStepsTask5 = [];
let currentStringStepTask5 = 0;

function initializeTask5StringIterator() {
    const runButton = document.getElementById('run-string-iteration-btn');
    if (runButton) {
        runButton.addEventListener('click', prepareAndRunStringIteration);
    }
    updateStringCodeDisplays(document.getElementById('string-input-task5').value);
}

function updateStringCodeDisplays(inputStr) {
    const erlCodeDisplay = document.getElementById('string-erl-code-display');
    const pythonCodeDisplay = document.getElementById('string-python-code-display');

    const erlLines = [
        `myString = "${inputStr}"`,
        `for i = 0 to myString.length - 1`,
        `    character = myString.substring(i, 1)`,
        `    print(character)`,
        `next i`
    ];
    erlCodeDisplay.innerHTML = erlLines.map((line, index) => `<div class="code-line" data-line-erl-string="${index}">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`).join('');
    
    const pythonLines = [
        `myString = "${inputStr}"`,
        `for char in myString:`,
        `    print(char)`
    ];
    pythonCodeDisplay.innerHTML = pythonLines.map((line, index) => `<div class="code-line" data-line-python-string="${index}">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`).join('');
}


function highlightStringLine(codeType, lineNumber) {
    const displayId = codeType === 'erl-string' ? 'string-erl-code-display' : 'string-python-code-display';
    document.querySelectorAll(`#${displayId} .code-line`).forEach(line => line.classList.remove('highlight-line'));
    const lineToHighlight = document.querySelector(`#${displayId} .code-line[data-line-${codeType}="${lineNumber}"]`);
    if (lineToHighlight) {
        lineToHighlight.classList.add('highlight-line');
    }
}


function prepareAndRunStringIteration() {
    clearInterval(stringIterationIntervalTask5);
    currentStringStepTask5 = 0;
    stringIterationStepsTask5 = [];

    const inputString = document.getElementById('string-input-task5').value;
    const outputArea = document.getElementById('string-iteration-output');
    outputArea.innerHTML = '';

    updateStringCodeDisplays(inputString);


    if (!inputString) {
        outputArea.textContent = 'Please enter a word.';
        return;
    }

    stringIterationStepsTask5.push({ type: 'message', message: `Iterating through "${inputString}"...` });
    stringIterationStepsTask5.push({ type: 'highlight', erl: 0, python: 0, message: `Assigning "${inputString}" to myString.` });


    if (inputString.length === 0) {
        stringIterationStepsTask5.push({ type: 'message', message: "String is empty, loop won't run." });
    } else {
        for (let i = 0; i < inputString.length; i++) {
            const character = inputString.charAt(i);
            stringIterationStepsTask5.push({ type: 'highlight', erl: 1, python: 1, message: `ERL: for i = ${i} to ${inputString.length - 1}. Python: for char in myString (current char: '${character}')` });
            stringIterationStepsTask5.push({ type: 'highlight', erl: 2, python: 1, message: `ERL: character = myString.substring(${i}, 1) -> '${character}'` });
            stringIterationStepsTask5.push({ type: 'highlight', erl: 3, python: 2, message: `print('${character}')` });
            stringIterationStepsTask5.push({ type: 'output', value: character });
            stringIterationStepsTask5.push({ type: 'highlight', erl: 4, python: 1, message: `ERL: next i. Python: (moves to next char)` });
        }
    }
    stringIterationStepsTask5.push({ type: 'message', message: "Iteration finished." });
    stringIterationStepsTask5.push({ type: 'highlight-clear' });


    document.getElementById('run-string-iteration-btn').disabled = true;
    executeNextStringStepTask5();
}

function executeNextStringStepTask5() {
    if (currentStringStepTask5 >= stringIterationStepsTask5.length) {
        document.getElementById('run-string-iteration-btn').disabled = false;
        return;
    }
    const step = stringIterationStepsTask5[currentStringStepTask5];
    const outputArea = document.getElementById('string-iteration-output');

    if (step.type === 'highlight') {
        highlightStringLine('erl-string', step.erl);
        highlightStringLine('python-string', step.python);
        outputArea.innerHTML += `<div>${step.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    } else if (step.type === 'output') {
        outputArea.innerHTML += `<div class="font-bold text-green-600">Output: '${step.value}'</div>`;
    } else if (step.type === 'message') {
        outputArea.innerHTML += `<div class="italic text-gray-600">${step.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    } else if (step.type === 'highlight-clear') {
         document.querySelectorAll(`#string-erl-code-display .code-line, #string-python-code-display .code-line`).forEach(line => line.classList.remove('highlight-line'));
    }
    
    outputArea.scrollTop = outputArea.scrollHeight;

    currentStringStepTask5++;
    stringIterationIntervalTask5 = setTimeout(executeNextStringStepTask5, 1000); 
}


function resetTask5StringIteration() {
    clearInterval(stringIterationIntervalTask5);
    currentStringStepTask5 = 0;
    stringIterationStepsTask5 = [];
    document.getElementById('string-input-task5').value = 'LOOP';
    document.getElementById('string-iteration-output').innerHTML = 'Enter a word and click "Iterate String" to see results.';
    updateStringCodeDisplays('LOOP'); 
    document.querySelectorAll('.code-line').forEach(line => line.classList.remove('highlight-line'));
    document.getElementById('run-string-iteration-btn').disabled = false;
}

// --- Task 6: Code Tracing Challenge ---
function initializeTask6ButtonEnabling() { /* Handled by setupAnswerButtonEnablingGeneral */ }
function resetTask6CodeTracing() {
    document.querySelectorAll('#trace-table-task6 .trace-input, #trace-final-output-task6').forEach(input => input.value = '');
    document.getElementById('task6-correct-trace').classList.add('hidden');
    const showTraceButton = document.querySelector('[data-answer-id="task6-correct-trace"]');
    if (showTraceButton) showTraceButton.disabled = true;
}

// --- Task 7: Exam Practice Questions ---
function initializeTask7ButtonEnabling() { /* Handled by setupAnswerButtonEnablingGeneral */ }
function resetTaskExamPractice() {
    ['exam-q1-forloop', 'exam-q2-definite-iteration', 'exam-q3-loop-error'].forEach(id => document.getElementById(id).value = '');
    ['self-assess-q1', 'self-assess-q2', 'self-assess-q3'].forEach(id => document.getElementById(id).value = '');
    ['ms-q1-forloop', 'ms-q2-definite-iteration', 'ms-q3-loop-error'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.querySelectorAll('#task7-exam-practice .toggle-mark-scheme-btn').forEach(btn => btn.disabled = true);
}

// --- Reset All Tasks ---
function resetAllTasks() {
    resetTask1ForLoopAnatomy();
    resetTask2PredictOutput();
    resetTask3LoopSimulator();
    resetTask4WritingLoops();
    resetTask5StringIteration();
    resetTask6CodeTracing();
    resetTaskExamPractice();

    document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);
    ['starter-daily-task', 'starter-print-hello', 'starter-iterate-meaning'].forEach(id => document.getElementById(id).value = '');
}

// --- General Setup Functions (Potentially from worksheet-common.js) ---
function setupAnswerButtonEnablingGeneral() {
    const inputsToWatch = document.querySelectorAll('.exam-answer-area, .trace-input, .fill-blank');
    
    inputsToWatch.forEach(input => {
        let buttonToEnable = null;
        if (input.closest('.predict-output-question')) {
            buttonToEnable = input.closest('.predict-output-question').querySelector('.toggle-answer-btn');
        } else if (input.closest('.writing-loops-question')) {
            buttonToEnable = input.closest('.writing-loops-question').querySelector('.toggle-answer-btn');
        } else if (input.closest('.exam-question')) {
            buttonToEnable = input.closest('.exam-question').querySelector('.toggle-mark-scheme-btn');
        } else if (input.closest('#task6-code-tracing')) {
            buttonToEnable = document.querySelector('[data-answer-id="task6-correct-trace"]');
        }
        else if (input.classList.contains('fill-blank')) {
            const q1Blanks = ['write-q1-var', 'write-q1-start', 'write-q1-end', 'write-q1-output', 'write-q1-nextvar'];
            const q2Blanks = ['write-q2-start', 'write-q2-stop', 'write-q2-step'];
            if (q1Blanks.includes(input.id)) {
                buttonToEnable = document.querySelector('[data-answer-id="write-q1-answer"]');
                input.addEventListener('input', () => {
                    const allFilled = q1Blanks.every(id => document.getElementById(id).textContent.trim() !== '');
                    if(buttonToEnable) buttonToEnable.disabled = !allFilled;
                });
                return; 
            } else if (q2Blanks.includes(input.id)) {
                 buttonToEnable = document.querySelector('[data-answer-id="write-q2-answer"]');
                 input.addEventListener('input', () => {
                    const allFilled = q2Blanks.every(id => document.getElementById(id).textContent.trim() !== '');
                    if(buttonToEnable) buttonToEnable.disabled = !allFilled;
                });
                return; 
            }
        }


        if (buttonToEnable) {
            buttonToEnable.disabled = true; 
            input.addEventListener('input', () => {
                let attemptMade = false;
                if (input.tagName.toLowerCase() === 'textarea' || input.type === 'text' || input.type === 'number') {
                    attemptMade = input.value.trim() !== '';
                } else if (input.isContentEditable) {
                    attemptMade = input.textContent.trim() !== '';
                }

                if (input.closest('#task6-code-tracing') && !input.id.includes('final-output')) { 
                    let allTableInputsFilled = true;
                    document.querySelectorAll('#trace-table-task6 .trace-input').forEach(ti => {
                        if(ti.value.trim() === '') allTableInputsFilled = false;
                    });
                     if(document.getElementById('trace-final-output-task6').value.trim() === '') allTableInputsFilled = false;
                    buttonToEnable.disabled = !allTableInputsFilled;
                } else {
                    buttonToEnable.disabled = !attemptMade;
                }
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
