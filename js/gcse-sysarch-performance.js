// Global score variables for the entire worksheet
let currentWorksheetScore = 0;
let maxWorksheetScore = 0;

// Quiz specific score variables (as per original structure)
let score = 0; // For the quiz in Task 4
let questionsAnswered = 0; // For the quiz in Task 4

const MIN_INPUT_LENGTH = 10; // General minimum length for a "decent" short answer

// Quiz Data (Task 4)
const quizData = [
    { question: "What does CPU stand for?", options: ["Computer Processing Unit", "Central Processing Unit", "Control Processing Unit", "Central Power Unit"], correctAnswer: "Central Processing Unit", feedbackCorrect: "Correct! It's the Central Processing Unit.", feedbackIncorrect: "Incorrect. CPU stands for Central Processing Unit, the 'brain' of the computer." },
    { question: "Which FDE stage involves interpreting an instruction?", options: ["Fetch", "Decode", "Execute", "Store"], correctAnswer: "Decode", feedbackCorrect: "Correct! The Decode stage interprets the instruction.", feedbackIncorrect: "Incorrect. The Decode stage is where the instruction is interpreted." },
    { question: "True or False: The Fetch-Decode-Execute cycle repeats continuously while the computer is running.", options: ["True", "False"], correctAnswer: "True", feedbackCorrect: "Correct! The FDE cycle is the fundamental, ongoing process of the CPU.", feedbackIncorrect: "Incorrect. The FDE cycle is the core process and runs continuously." },
    { question: "Where does the CPU fetch instructions from?", options: ["Hard Drive", "ALU", "RAM (Main Memory)", "Cache (primarily, but RAM is the source)"], correctAnswer: "RAM (Main Memory)", feedbackCorrect: "Correct! Instructions are fetched from RAM (though cache speeds this up).", feedbackIncorrect: "Incorrect. Instructions are stored in RAM (main memory) and fetched from there by the CPU (often via cache)." },
    { question: "Which FDE stage involves performing calculations?", options: ["Fetch", "Decode", "Execute", "Store"], correctAnswer: "Execute", feedbackCorrect: "Correct! Calculations are done during the Execute stage.", feedbackIncorrect: "Incorrect. The Execute stage is where the instruction is carried out, often involving calculations." },
    { question: "What is the 'Stored Program Concept' related to?", options: ["Storing backups", "Instructions and data stored together in memory", "CPU speed", "Network security"], correctAnswer: "Instructions and data stored together in memory", feedbackCorrect: "Correct! This is a key part of the Von Neumann architecture.", feedbackIncorrect: "Incorrect. The Stored Program Concept means instructions and data reside in the same memory (RAM)." }
];
const totalQuestions = quizData.length; // For Task 4 quiz

// --- FDE Animation Logic (Simplified) ---
let simpleFdeCurrentStep = 0;
const simpleFdeSteps = [
    { stage: 'Initial', description: "Click 'Next Step' to begin the Fetch-Decode-Execute cycle.", highlight: null, instructionClass: 'state-start' },
    { stage: 'Fetch', description: "<strong>FETCH:</strong> The instruction is fetched from RAM to the CPU.", highlight: 'fde-ram-simple', instructionClass: 'state-fetch' },
    { stage: 'Process', description: "<strong>DECODE/EXECUTE:</strong> The CPU processes the instruction.", highlight: 'fde-cpu-simple', instructionClass: 'state-process' },
    { stage: 'Cycle End', description: "Cycle complete. Ready for the next instruction. Click 'Reset' to start again.", highlight: null, instructionClass: 'state-end' }
];
const simpleFdeInstruction = document.getElementById('fde-instruction-simple');
const simpleFdeDescription = document.getElementById('fde-description-simple');
const simpleFdeNextBtn = document.getElementById('fde-next-btn-simple');
const simpleFdeResetBtn = document.getElementById('fde-reset-btn-simple');
const simpleFdeRam = document.getElementById('fde-ram-simple');
const simpleFdeCpu = document.getElementById('fde-cpu-simple');

function updateSimpleFdeDisplay() {
    if (!simpleFdeDescription || !simpleFdeInstruction || !simpleFdeNextBtn || !simpleFdeResetBtn || !simpleFdeRam || !simpleFdeCpu) {
        // console.warn("FDE elements not found, skipping FDE update.");
        return;
    }
    const step = simpleFdeSteps[simpleFdeCurrentStep];
    simpleFdeDescription.innerHTML = step.description;
    if (step.stage === 'Fetch') {
        simpleFdeInstruction.style.left = '150px';
        simpleFdeInstruction.style.opacity = '1';
        simpleFdeInstruction.style.transform = 'translateY(-50%)';
        simpleFdeInstruction.style.backgroundColor = '#f87171';
        simpleFdeInstruction.innerHTML = 'Instruction';
    } else if (step.stage === 'Process') {
        simpleFdeCpu.appendChild(simpleFdeInstruction);
        simpleFdeInstruction.style.left = '50%';
        simpleFdeInstruction.style.top = '50%';
        simpleFdeInstruction.style.transform = 'translate(-50%, -50%)';
        simpleFdeInstruction.style.opacity = '1';
        simpleFdeInstruction.style.backgroundColor = '#facc15';
        simpleFdeInstruction.innerHTML = '<i class="fas fa-cog fa-spin mr-1"></i> Proc...';
    } else if (step.stage === 'Cycle End') {
        simpleFdeInstruction.style.opacity = '0';
    } else {
        simpleFdeRam.appendChild(simpleFdeInstruction);
        simpleFdeInstruction.style.left = '50%';
        simpleFdeInstruction.style.top = '50%';
        simpleFdeInstruction.style.transform = 'translate(-50%, -50%)';
        simpleFdeInstruction.style.opacity = '1';
        simpleFdeInstruction.style.backgroundColor = '#f87171';
        simpleFdeInstruction.innerHTML = 'Instruction';
    }
    [simpleFdeRam, simpleFdeCpu].forEach(el => el.classList.remove('highlight'));
    if (step.highlight) {
        const elToHighlight = document.getElementById(step.highlight);
        if (elToHighlight) elToHighlight.classList.add('highlight');
    }
    simpleFdeNextBtn.disabled = (simpleFdeCurrentStep === simpleFdeSteps.length - 1);
    simpleFdeResetBtn.disabled = (simpleFdeCurrentStep === 0);
}

function nextSimpleFdeStep() {
    if (simpleFdeCurrentStep < simpleFdeSteps.length - 1) {
        simpleFdeCurrentStep++;
        updateSimpleFdeDisplay();
    }
}

function resetSimpleFdeAnimation() {
    simpleFdeCurrentStep = 0;
    updateSimpleFdeDisplay();
}

// --- Performance Visualisation Logic ---
function startClockRace() {
    const bar30 = document.getElementById('bar-30');
    const bar35 = document.getElementById('bar-35');
    if (!bar30 || !bar35) return;
    bar30.style.transition = 'none'; bar35.style.transition = 'none';
    bar30.style.width = '0%'; bar35.style.width = '0%';
    void bar30.offsetWidth; void bar35.offsetWidth; // Trigger reflow
    bar30.style.transition = 'width 2s linear'; bar35.style.transition = 'width 1.5s linear';
    bar30.style.width = '100%'; bar35.style.width = '100%';
}

let singleCoreTimeout; let quadCoreTimeout;
function simulateCores(type) {
    clearTimeout(singleCoreTimeout); clearTimeout(quadCoreTimeout);
    const singleTasks = document.querySelectorAll('#single-core-tasks .task-block');
    const quadTasks = document.querySelectorAll('#quad-core-tasks .task-block');
    if (singleTasks.length === 0 && quadTasks.length === 0) return;

    singleTasks.forEach(t => t.className = 'task-block');
    quadTasks.forEach(t => t.className = 'task-block');

    if (type === 'single') {
        let delay = 0;
        singleTasks.forEach((task) => {
            singleCoreTimeout = setTimeout(() => task.classList.add('processing'), delay);
            delay += 500;
            singleCoreTimeout = setTimeout(() => { task.classList.remove('processing'); task.classList.add('done'); }, delay);
            delay += 100;
        });
    } else {
        let delay = 0;
        quadCoreTimeout = setTimeout(() => quadTasks.forEach(task => task.classList.add('processing')), delay);
        delay += 700;
        quadCoreTimeout = setTimeout(() => quadTasks.forEach(task => { task.classList.remove('processing'); task.classList.add('done'); }), delay);
    }
}

let cacheTimeout;
function simulateCache(type) {
    clearTimeout(cacheTimeout);
    const packet = document.getElementById('cache-data-packet');
    const explanationDiv = document.getElementById('cache-sim-explanation');
    if (!packet || !explanationDiv) return;

    packet.className = 'cache-data'; // Reset
    explanationDiv.textContent = '';

    if (type === 'miss') {
        packet.classList.add('req-ram');
        explanationDiv.textContent = "Cache Miss: The requested data isn't in the cache. Must fetch from slower RAM.";
        cacheTimeout = setTimeout(() => { packet.classList.add('goto-ram');
        cacheTimeout = setTimeout(() => { packet.classList.add('ret-ram');
        cacheTimeout = setTimeout(() => { packet.classList.add('goto-cache');
        cacheTimeout = setTimeout(() => { packet.classList.add('ret-cache');
        cacheTimeout = setTimeout(() => { packet.classList.add('end'); }, 550); }, 550); }, 1550); }, 1550); }, 100);
    } else { // Hit
        packet.classList.add('req-cache');
        explanationDiv.textContent = "Cache Hit: The requested data is found in the cache! Faster access.";
        cacheTimeout = setTimeout(() => { packet.classList.add('hit-cache');
        cacheTimeout = setTimeout(() => { packet.classList.add('ret-hit');
        cacheTimeout = setTimeout(() => { packet.classList.add('end'); }, 550); }, 550); }, 100);
    }
}

// --- Mark Calculation and Display Functions ---
function calculateMaxWorksheetScore() {
    maxWorksheetScore = 0;
    // Quiz marks (Task 4)
    maxWorksheetScore += quizData.length; // Assuming 1 mark per quiz question

    // Exam practice marks (Task 6)
    document.querySelectorAll('#exam-practice .exam-question').forEach(questionDiv => {
        const marks = parseInt(questionDiv.dataset.marks);
        if (!isNaN(marks)) {
            maxWorksheetScore += marks;
        }
    });
    
    // Optional: Add marks for Task 5 performance explanations if you decide to score them
    // document.querySelectorAll('#performance-factors .perf-explanation textarea').forEach(() => {
    //     maxWorksheetScore += 1; // Example: 1 mark each
    // });

    const totalPossibleDisplay = document.getElementById('total-possible-worksheet-marks-display');
    if (totalPossibleDisplay) {
        totalPossibleDisplay.textContent = maxWorksheetScore;
    }
}

function updateTotalWorksheetScoreDisplay() {
    const currentScoreDisplay = document.getElementById('current-worksheet-score-display');
    if (currentScoreDisplay) {
        currentScoreDisplay.textContent = currentWorksheetScore;
    }
    // Update the specific quiz score display (Task 4)
    const quizScoreDisplay = document.getElementById('score');
    if (quizScoreDisplay) {
        quizScoreDisplay.textContent = score;
    }
}


// --- Quiz Logic (Task 4) ---
function checkAnswer(buttonElement, questionIndex) {
    const selectedAnswer = buttonElement.textContent;
    const questionData = quizData[questionIndex];
    const isCorrect = selectedAnswer === questionData.correctAnswer;
    const questionDiv = buttonElement.closest('.quiz-question-container');
    const feedbackElement = questionDiv.querySelector('.feedback');
    const buttons = questionDiv.querySelectorAll('button.quiz-option');

    buttons.forEach(btn => btn.disabled = true); // Disable all options for this question

    feedbackElement.classList.remove('hidden', 'text-green-600', 'text-red-600');
    if (isCorrect) {
        if (!buttonElement.dataset.alreadyAwarded) { // Check if already awarded for this attempt
            score++; // Quiz-specific score
            currentWorksheetScore++; // Overall worksheet score
            buttonElement.dataset.alreadyAwarded = 'true';
        }
        buttonElement.classList.add('correct');
        feedbackElement.textContent = questionData.feedbackCorrect;
        feedbackElement.classList.add('text-green-600');
    } else {
        buttonElement.classList.add('incorrect');
        feedbackElement.textContent = questionData.feedbackIncorrect;
        feedbackElement.classList.add('text-red-600');
        buttons.forEach(btn => {
            if (btn.textContent === questionData.correctAnswer) {
                btn.classList.add('correct'); // Highlight the correct answer
            }
        });
    }

    const iconSpan = document.createElement('span');
    iconSpan.className = 'feedback-icon'; // Will be styled by CSS for correct/incorrect
    buttonElement.appendChild(iconSpan);

    if (!questionDiv.dataset.answeredThisAttempt) {
        questionsAnswered++;
        questionDiv.dataset.answeredThisAttempt = 'true';
    }
    
    updateTotalWorksheetScoreDisplay(); // Updates both quiz and overall worksheet score displays

    if (questionsAnswered === totalQuestions) {
        const resetQuizBtn = document.getElementById('reset-quiz-btn');
        if(resetQuizBtn) resetQuizBtn.classList.remove('hidden');
    }
}

function loadQuiz() {
    const quizContainer = document.getElementById('quiz-questions');
    if (!quizContainer) return;

    // Subtract old quiz score from total worksheet score before resetting
    currentWorksheetScore -= score;
    currentWorksheetScore = Math.max(0, currentWorksheetScore); // Ensure it doesn't go negative

    quizContainer.innerHTML = '';
    score = 0; // Reset quiz-specific score
    questionsAnswered = 0;

    const totalQuestionsDisplay = document.getElementById('total-questions');
    if (totalQuestionsDisplay) totalQuestionsDisplay.textContent = totalQuestions;
    
    updateTotalWorksheetScoreDisplay(); // Update displays

    const resetQuizBtn = document.getElementById('reset-quiz-btn');
    if(resetQuizBtn) resetQuizBtn.classList.add('hidden');

    quizData.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'mb-6 quiz-question-container';
        // No need for questionDiv.dataset.answeredThisAttempt here, will be set on answer

        const questionText = document.createElement('p');
        questionText.className = 'font-semibold mb-3 text-lg text-gray-800';
        questionText.textContent = `${index + 1}. ${q.question}`;
        questionElement.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'space-y-2';
        q.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'quiz-option block w-full text-left p-3 border rounded-md bg-white border-gray-300 hover:border-blue-400';
            button.textContent = option;
            button.onclick = () => checkAnswer(button, index);
            // Clear dataset.alreadyAwarded when recreating buttons
            if(button.dataset.alreadyAwarded) delete button.dataset.alreadyAwarded;
            optionsDiv.appendChild(button);
        });
        questionElement.appendChild(optionsDiv);

        const feedback = document.createElement('p');
        feedback.className = 'text-sm mt-2 feedback hidden';
        questionElement.appendChild(feedback);
        quizContainer.appendChild(questionElement);
    });
}


// --- Performance Explanations (Task 5) ---
function checkPerfExplanation(feedbackId, textareaId, keywords) {
    const feedbackElement = document.getElementById(feedbackId);
    const textarea = document.getElementById(textareaId);
    if (!feedbackElement || !textarea) return;

    const explanation = textarea.value.toLowerCase().trim();
    const checkButton = document.getElementById(textarea.dataset.buttonId);
    let feedbackText = "";
    let mentionedConcepts = [];
    let missingConcepts = [];

    if (explanation === '') {
        feedbackText = "Please type your explanation in the box above first.";
        if (checkButton) checkButton.title = "Please type an answer before checking.";
        feedbackElement.textContent = feedbackText;
        feedbackElement.classList.add('show');
        return;
    }

    const concepts = {
        'clock-explanation': { 'cycles_per_second': ['cycle', 'second', 'ghz', 'hertz', 'speed'], 'more_instructions': ['more instruction', 'more operation', 'faster process', 'more work'] },
        'cores-explanation': { 'multiple_tasks': ['multiple task', 'several task', 'many task', 'different program'], 'simultaneously': ['same time', 'simultaneous', 'parallel', 'concurrent'] },
        'cache-explanation': { 'faster_access': ['faster', 'quick', 'speed', 'reduce time', 'wait less'], 'avoids_ram': ['ram', 'main memory', 'fetch less', 'avoid fetch'], 'stores_frequent': ['frequent', 'common', 'often used', 'repeated'] }
    };
    const currentConcepts = concepts[textareaId];

    if (!currentConcepts) {
        feedbackText = "Error: Could not determine concepts for this explanation.";
    } else {
        for (const conceptName in currentConcepts) {
            if (currentConcepts[conceptName].some(kw => explanation.includes(kw))) {
                mentionedConcepts.push(conceptName);
            } else {
                missingConcepts.push(conceptName);
            }
        }
        if (mentionedConcepts.length === Object.keys(currentConcepts).length) {
            feedbackText = "Excellent! You've covered the key concepts.";
        } else if (mentionedConcepts.length > 0) {
            feedbackText = "Good start! You've mentioned some key ideas. ";
            if (missingConcepts.includes('cycles_per_second')) feedbackText += "Think about *how* clock speed is measured (cycles per second). ";
            if (missingConcepts.includes('more_instructions')) feedbackText += "How does more cycles per second lead to faster processing? ";
            if (missingConcepts.includes('multiple_tasks')) feedbackText += "What can multiple cores handle? ";
            if (missingConcepts.includes('simultaneously')) feedbackText += "How do multiple cores handle tasks differently from a single core? ";
            if (missingConcepts.includes('faster_access')) feedbackText += "How does cache compare to RAM in terms of speed? ";
            if (missingConcepts.includes('avoids_ram')) feedbackText += "What does using cache help the CPU avoid doing? ";
            if (missingConcepts.includes('stores_frequent')) feedbackText += "What kind of data/instructions does cache typically store? ";
        } else {
            feedbackText = "Try to explain the concept more clearly. ";
            if (textareaId === 'clock-explanation') feedbackText += "Think about what clock speed measures (cycles per second) and how that relates to processing instructions.";
            else if (textareaId === 'cores-explanation') feedbackText += "Consider how multiple cores handle multiple tasks compared to a single core.";
            else if (textareaId === 'cache-explanation') feedbackText += "Think about where cache is, how fast it is compared to RAM, and what it stores.";
        }
    }
    
    // Optional Scoring for Performance Explanations (Uncomment and adapt if needed)
    /*
    const perfExplanationDiv = textarea.closest('.perf-explanation'); // Or a more reliable parent
    let marksForThisPerfExplanation = 0;
    const minLengthForPerf = MIN_CHARS_FOR_REVEAL[textareaId] || 20;

    if (explanation.length >= minLengthForPerf && mentionedConcepts.length >= 1) { // Example: 1 mark if decent length and at least one concept
        marksForThisPerfExplanation = 1;
    }

    let previousMarksForThis = 0;
    if (perfExplanationDiv && perfExplanationDiv.dataset.marksAwardedPerf) {
        previousMarksForThis = parseInt(perfExplanationDiv.dataset.marksAwardedPerf);
    } else if (perfExplanationDiv) {
       perfExplanationDiv.dataset.marksAwardedPerf = "0";
    }

    if (perfExplanationDiv) {
       currentWorksheetScore -= previousMarksForThis;
       currentWorksheetScore += marksForThisPerfExplanation;
       currentWorksheetScore = Math.max(0, currentWorksheetScore);
       perfExplanationDiv.dataset.marksAwardedPerf = marksForThisPerfExplanation.toString();
       feedbackText += `<br><strong>Mark: ${marksForThisPerfExplanation}/1</strong> (based on effort)`;
    }
    updateTotalWorksheetScoreDisplay();
    */

    feedbackElement.innerHTML = feedbackText; // Use innerHTML if feedbackText contains HTML like <strong>
    feedbackElement.classList.add('show');
    if (checkButton) checkButton.title = "Check your explanation.";
}


// --- Exam Practice Questions (Task 6) ---
function checkFillBlanks(blankIds, feedbackId) {
    const feedbackElement = document.getElementById(feedbackId);
    if (!feedbackElement) return;

    const correctAnswers = ["central processing unit", "instructions", "ram"]; // Ensure these match your HTML blank IDs
    const altAnswers = [null, ["programs", "code"], ["memory", "main memory"]]; // Alternate acceptable answers
    let marksAwardedForThisQuestion = 0;
    const checkButton = document.getElementById('check-exam-q1-btn'); // Specific button for this question
    const questionDiv = checkButton ? checkButton.closest('.exam-question') : null;
    const maxMarksForThisQuestion = questionDiv ? (parseInt(questionDiv.dataset.marks) || 0) : 0;
    let feedbackHtml = "<ul>";

    let previousMarksForThis = 0;
    if (questionDiv && questionDiv.dataset.marksAwardedFill) {
        previousMarksForThis = parseInt(questionDiv.dataset.marksAwardedFill);
    } else if (questionDiv) {
        questionDiv.dataset.marksAwardedFill = "0"; // Initialize if not present
    }

    blankIds.forEach((id, index) => {
        const span = document.getElementById(id);
        if (!span) return;
        const userAnswer = span.textContent.trim().toLowerCase().replace(/\.$/, '');
        span.classList.remove('correct-blank', 'incorrect-blank');

        let isThisBlankCorrect = userAnswer === correctAnswers[index];
        if (!isThisBlankCorrect && altAnswers[index]) {
            isThisBlankCorrect = altAnswers[index].includes(userAnswer);
        }

        if (isThisBlankCorrect) {
            feedbackHtml += `<li class="text-green-700"><i class="fas fa-check mr-2"></i>Blank ${index + 1}: Correct!</li>`;
            span.classList.add('correct-blank');
            marksAwardedForThisQuestion++;
        } else {
            feedbackHtml += `<li class="text-red-700"><i class="fas fa-times mr-2"></i>Blank ${index + 1}: Incorrect. (Expected: '${correctAnswers[index]}' ${altAnswers[index] ? 'or similar' : ''})</li>`;
            span.classList.add('incorrect-blank');
        }
    });

    marksAwardedForThisQuestion = Math.min(marksAwardedForThisQuestion, maxMarksForThisQuestion);

    if (questionDiv) {
        currentWorksheetScore -= previousMarksForThis;
        currentWorksheetScore += marksAwardedForThisQuestion;
        currentWorksheetScore = Math.max(0, currentWorksheetScore); // Prevent negative scores
        questionDiv.dataset.marksAwardedFill = marksAwardedForThisQuestion.toString();
    }

    feedbackHtml += `</ul><p style="font-weight:bold; margin-top:10px;">Marks for this part: ${marksAwardedForThisQuestion}/${maxMarksForThisQuestion}</p>`;
    feedbackElement.innerHTML = feedbackHtml;
    if (checkButton) checkButton.title = "Check your fill-in-the-blanks answers.";
    feedbackElement.classList.add('show');
    updateTotalWorksheetScoreDisplay();
}

function checkLongAnswer(textareaId, feedbackId, keywords) {
    const feedbackElement = document.getElementById(feedbackId);
    const textarea = document.getElementById(textareaId);
    if (!feedbackElement || !textarea) return;

    const explanation = textarea.value.toLowerCase();
    const checkButton = document.getElementById(textarea.dataset.buttonId);
    const questionDiv = textarea.closest('.exam-question');
    const maxMarksForThisQuestion = questionDiv ? (parseInt(questionDiv.dataset.marks) || 0) : 0;

    let pointsMentioned = 0;
    keywords.forEach(keyword => {
        if (explanation.includes(keyword)) {
            pointsMentioned++;
        }
    });

    let marksAwardedForThisQuestion = 0;
    if (maxMarksForThisQuestion === 2) { // For 2-mark questions
        if (pointsMentioned >= 2) marksAwardedForThisQuestion = 2; // Need at least 2 distinct points/keywords for full marks
        else if (pointsMentioned >= 1) marksAwardedForThisQuestion = 1;
    } else if (maxMarksForThisQuestion === 1) { // For 1-mark questions
        if (pointsMentioned >= 1) marksAwardedForThisQuestion = 1;
    } // Add more sophisticated logic if needed for other mark schemes

    let previousMarksForThis = 0;
    if (questionDiv && questionDiv.dataset.marksAwardedLong) {
        previousMarksForThis = parseInt(questionDiv.dataset.marksAwardedLong);
    } else if (questionDiv) {
        questionDiv.dataset.marksAwardedLong = "0";
    }

    if (questionDiv) {
        currentWorksheetScore -= previousMarksForThis;
        currentWorksheetScore += marksAwardedForThisQuestion;
        currentWorksheetScore = Math.max(0, currentWorksheetScore);
        questionDiv.dataset.marksAwardedLong = marksAwardedForThisQuestion.toString();
    }
    
    let feedbackText = "";
    let missingKeywordsForFeedback = keywords.filter(kw => !explanation.includes(kw));
    let consolidatedMissing = [];

    if (feedbackId.includes('exam-feedback-2')) { // Dual Core
        if (missingKeywordsForFeedback.some(kw => ['core', 'multiple'].includes(kw))) consolidatedMissing.push("mentioning multiple cores");
        if (missingKeywordsForFeedback.some(kw => ['tasks', 'same time', 'simultaneous', 'parallel', 'multitasking'].includes(kw))) consolidatedMissing.push("processing multiple tasks/instructions simultaneously/in parallel");
    } else if (feedbackId.includes('exam-feedback-3')) { // Cache
        if (missingKeywordsForFeedback.some(kw => ['faster', 'speed', 'access'].includes(kw))) consolidatedMissing.push("faster access to data/instructions");
        if (missingKeywordsForFeedback.some(kw => ['frequently', 'instructions', 'data'].includes(kw))) consolidatedMissing.push("storing frequently used data/instructions");
        if (missingKeywordsForFeedback.some(kw => ['ram', 'fetch'].includes(kw))) consolidatedMissing.push("reducing the need to fetch from slower RAM");
        if (missingKeywordsForFeedback.some(kw => ['store more'].includes(kw))) consolidatedMissing.push("larger cache stores more");
    }
    consolidatedMissing = [...new Set(consolidatedMissing)];

    if (marksAwardedForThisQuestion === maxMarksForThisQuestion && maxMarksForThisQuestion > 0) {
        feedbackText = "Excellent explanation, all key points covered! ";
    } else if (marksAwardedForThisQuestion > 0) {
        feedbackText = "Good start! You've mentioned some important aspects. ";
        if (consolidatedMissing.length > 0) feedbackText += "To get full marks, also consider: " + consolidatedMissing.join(', ') + ".";
    } else {
        feedbackText = "Try to add more detail. Think about: " + (consolidatedMissing.length > 0 ? consolidatedMissing.join(', ') : "the key concepts related to the question") + ".";
    }

    feedbackElement.innerHTML = feedbackText + `<br><strong style="margin-top:10px; display:block;">Marks for this part: ${marksAwardedForThisQuestion}/${maxMarksForThisQuestion}</strong> (based on keyword match)`;
    if (checkButton) checkButton.title = "Check your answer.";
    feedbackElement.classList.add('show');
    updateTotalWorksheetScoreDisplay();
}


// --- Toggle Reveal and Conditional Button Logic ---
function toggleReveal(contentId, buttonElement, revealText, hideText) {
    const content = document.getElementById(contentId);
    if (!content) return;
    content.classList.toggle('show');
    if (buttonElement) {
        buttonElement.textContent = content.classList.contains('show') ? hideText : revealText;
    }
}

function toggleStarterAnswers(contentId, buttonElement, revealText, hideText) {
    const content = document.getElementById(contentId);
    const encourageMsg = document.getElementById('starter-encourage-msg');
    if (!content) return;

    if (!content.classList.contains('show')) {
        const starterInputs = document.querySelectorAll('#starter-recap input[type="text"]');
        let filledCount = 0;
        starterInputs.forEach(input => { if (input.value.trim() !== '') filledCount++; });
        if (filledCount < 2) {
            if (encourageMsg) {
                encourageMsg.textContent = "Try answering a couple of questions yourself first!";
                setTimeout(() => { if(encourageMsg) encourageMsg.textContent = ''; }, 3000);
            }
            return;
        }
    }
    toggleReveal(contentId, buttonElement, revealText, hideText);
}

const MIN_CHARS_FOR_REVEAL = { default: 20, f1_factors: 30, "clock-explanation": 25, "cores-explanation": 25, "cache-explanation": 25, "exam-q2-answer": 25, "exam-q3-answer": 25 };
const MIN_FILLED_FOR_GROUP = { "starter-inputs": 2, "research-inputs": 3, "exam-q1-inputs": 2 }; // exam-q1-inputs is the div around the fill blanks

function updateConditionalButton(button) {
    if (!button) return;
    let enable = false;
    const inputIdsStr = button.dataset.inputIds; // For single textareas/inputs
    const inputGroupId = button.dataset.inputGroup; // For groups of inputs (e.g., research)
    const fillBlanksGroupId = button.dataset.fillBlanksGroup; // For fill-in-the-blanks group

    if (inputIdsStr) {
        const primaryInputId = inputIdsStr.split(',')[0];
        const inputElement = document.getElementById(primaryInputId);
        if (inputElement) {
            const requiredLength = parseInt(button.dataset.minLength) || MIN_CHARS_FOR_REVEAL[primaryInputId] || MIN_CHARS_FOR_REVEAL.default;
            if (inputElement.value.trim().length >= requiredLength) enable = true;
        }
    } else if (inputGroupId) {
        const inputs = document.querySelectorAll(`#${inputGroupId} input[type="text"]`);
        let filledCount = 0;
        inputs.forEach(input => { if (input.value.trim() !== '') filledCount++; });
        if (filledCount >= (MIN_FILLED_FOR_GROUP[inputGroupId] || 1)) enable = true;
    } else if (fillBlanksGroupId) { // Specific handling for fill-in-the-blanks using contenteditable spans
        const spans = document.querySelectorAll(`#${fillBlanksGroupId} span.fill-blank`);
        let filledCount = 0;
        spans.forEach(span => {
            if (span.textContent.trim() !== '' && span.textContent.trim() !== '[Type here]') { // Check against placeholder
                filledCount++;
            }
        });
        if (filledCount >= (MIN_FILLED_FOR_GROUP[fillBlanksGroupId] || 1)) {
            enable = true;
        }
    }


    button.disabled = !enable;
    if (button.disabled) {
        if (inputGroupId && MIN_FILLED_FOR_GROUP[inputGroupId]) {
            button.title = `Please fill at least ${MIN_FILLED_FOR_GROUP[inputGroupId]} fields.`;
        } else if (fillBlanksGroupId && MIN_FILLED_FOR_GROUP[fillBlanksGroupId]) {
            button.title = `Please fill at least ${MIN_FILLED_FOR_GROUP[fillBlanksGroupId]} blanks.`;
        } else if (inputIdsStr) {
            const primaryInputId = inputIdsStr.split(',')[0];
            const reqLength = parseInt(button.dataset.minLength) || MIN_CHARS_FOR_REVEAL[primaryInputId] || MIN_CHARS_FOR_REVEAL.default;
            button.title = `Please type at least ${reqLength} characters.`;
        } else {
            button.title = `Please complete the required input(s).`;
        }
    } else {
        button.title = "";
    }
}


// --- Overclocking Simulation Logic ---
let ocState = { speed: 3.8, voltage: 1.20, heatLevel: 0, stability: 'stable', power: 65, maxSpeed: 4.8, maxVoltage: 1.40, coolerType: 'stock' };

function updateOverclockDisplay() {
    const speedEl = document.getElementById('oc-speed-value');
    const voltageEl = document.getElementById('oc-voltage-value');
    const mercuryEl = document.getElementById('thermometer-mercury');
    const stabilityEl = document.getElementById('oc-stability-indicator');
    const powerEl = document.getElementById('oc-power-value');
    const benchmarkEl = document.getElementById('oc-benchmark-score');
    const statusEl = document.getElementById('oc-status');
    const overclockBtn = document.getElementById('overclock-btn');

    if (!speedEl || !voltageEl || !mercuryEl || !stabilityEl || !powerEl || !benchmarkEl || !statusEl || !overclockBtn) return;

    speedEl.textContent = ocState.speed.toFixed(1) + ' GHz';
    voltageEl.textContent = ocState.voltage.toFixed(2) + ' V';
    powerEl.textContent = ocState.power + ' W';

    const maxHeat = 5;
    const heatPercentage = Math.min(100, (ocState.heatLevel / maxHeat) * 100);
    mercuryEl.style.height = `${Math.max(10, heatPercentage)}%`;
    mercuryEl.classList.remove('warm', 'hot');
    if (ocState.heatLevel >= maxHeat * 0.7) mercuryEl.classList.add('hot');
    else if (ocState.heatLevel >= maxHeat * 0.4) mercuryEl.classList.add('warm');

    stabilityEl.className = 'overclock-stability';
    stabilityEl.innerHTML = ocState.stability === 'unstable' ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-check-circle"></i>';
    if(ocState.stability === 'unstable') stabilityEl.classList.add('unstable');


    benchmarkEl.classList.remove('error');
    if (ocState.stability === 'stable') {
        benchmarkEl.textContent = Math.round(1000 * (ocState.speed / 3.8));
    } else {
        benchmarkEl.textContent = 'Error';
        benchmarkEl.classList.add('error');
    }
    overclockBtn.disabled = (ocState.stability === 'unstable' || ocState.speed >= ocState.maxSpeed);
    statusEl.textContent = ocState.stability === 'unstable' ? "System unstable! (Heat or Voltage too high)" : (ocState.speed >= ocState.maxSpeed ? "Maximum safe overclock reached." : "");
}

function overclock() {
    if (ocState.stability === 'stable' && ocState.speed < ocState.maxSpeed) {
        let heatIncrease = ocState.coolerType === 'liquid' ? 0.5 : (ocState.coolerType === 'air' ? 0.7 : 1);
        ocState.speed += 0.2;
        ocState.voltage += 0.05;
        ocState.heatLevel += heatIncrease;
        ocState.power += 15 + (ocState.heatLevel * 5);
        const heatThreshold = ocState.coolerType === 'liquid' ? 4.5 : (ocState.coolerType === 'air' ? 3.0 : 2.0);
        const voltageThreshold = ocState.coolerType === 'liquid' ? 1.45 : 1.40;
        if (ocState.heatLevel >= heatThreshold || ocState.voltage >= voltageThreshold) ocState.stability = 'unstable';
        updateOverclockDisplay();
    }
}

function resetOverclockSim() {
    ocState = { speed: 3.8, voltage: 1.20, heatLevel: 0, stability: 'stable', power: 65, maxSpeed: 4.8, maxVoltage: 1.40, coolerType: 'stock' };
    const stockCoolerRadio = document.querySelector('input[name="cooler"][value="stock"]');
    if (stockCoolerRadio) stockCoolerRadio.checked = true;
    updateOverclockDisplay();
}

function setCooler(coolerValue) {
    ocState.coolerType = coolerValue;
}

// --- Reset and Export Functions ---
function resetAllPerformanceTasks() {
    if (!window.confirm("Are you sure you want to reset all tasks on this page? Your progress will be lost.")) return;

    // Reset overall worksheet score
    currentWorksheetScore = 0;
    
    // Reset Quiz (Task 4) - this also handles its contribution to currentWorksheetScore
    loadQuiz();

    // Reset FDE Animation (Task 3)
    resetSimpleFdeAnimation();

    // Reset Performance Visualisations (Task 5)
    startClockRace();
    simulateCores('single'); simulateCores('quad');
    clearTimeout(cacheTimeout);
    const cachePacket = document.getElementById('cache-data-packet');
    if(cachePacket) cachePacket.className = 'cache-data';
    const cacheSimExplanation = document.getElementById('cache-sim-explanation');
    if(cacheSimExplanation) cacheSimExplanation.textContent = '';

    // Reset Performance Explanations (Task 5)
    ['clock-explanation', 'cores-explanation', 'cache-explanation'].forEach(id => {
        const textarea = document.getElementById(id);
        // const perfExplanationDiv = textarea ? textarea.closest('.perf-explanation') : null; // Or a more reliable parent
        // if (perfExplanationDiv && perfExplanationDiv.dataset.marksAwardedPerf) {
        //     delete perfExplanationDiv.dataset.marksAwardedPerf; // Remove stored mark if any
        // }
        if (textarea) textarea.value = '';
        const feedbackEl = document.getElementById(id + '-feedback');
        if (feedbackEl) feedbackEl.classList.remove('show');
    });

    // Reset Exam Practice Questions (Task 6)
    document.querySelectorAll('#exam-practice .exam-question').forEach(questionDiv => {
        questionDiv.querySelectorAll('span.fill-blank').forEach(span => {
            span.textContent = '[Type here]';
            span.classList.remove('correct-blank', 'incorrect-blank');
        });
        questionDiv.querySelectorAll('textarea').forEach(ta => ta.value = '');
        questionDiv.querySelectorAll('.exam-feedback').forEach(fb => fb.classList.remove('show'));
        if (questionDiv.dataset.marksAwardedFill) delete questionDiv.dataset.marksAwardedFill;
        if (questionDiv.dataset.marksAwardedLong) delete questionDiv.dataset.marksAwardedLong;
    });
    
    // Reset self-assessment inputs
    document.querySelectorAll('#exam-practice .self-assess-input').forEach(input => {
        input.value = '';
    });

    // Reset Overclocking Sim
    resetOverclockSim();

    // Reset Starter Activity inputs
    ['starter-ram-use', 'starter-storage-use', 'starter-input-use', 'starter-output-use'].forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) inputEl.value = '';
    });
    const starterAnswers = document.getElementById('starter-answers');
    if (starterAnswers && starterAnswers.classList.contains('show')) {
        toggleStarterAnswers('starter-answers', document.getElementById('reveal-starter-btn'), 'Reveal Answers', 'Hide Answers');
    }
    const starterEncourage = document.getElementById('starter-encourage-msg');
    if(starterEncourage) starterEncourage.textContent = '';


    // Reset Research inputs (Task 2)
    ['cores', 'threads', 'base-clock', 'boost-clock', 'cache', 'unlocked', 'tdp'].forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) inputEl.value = '';
    });
    const researchAnswers = document.getElementById('research-answers');
    if (researchAnswers && researchAnswers.classList.contains('show')) {
        toggleReveal('research-answers', document.getElementById('reveal-research-btn'), 'Reveal Answers', 'Hide Answers');
    }
    const researchEncourage = document.getElementById('research-encourage-msg');
    if(researchEncourage) researchEncourage.textContent = '';


    // Reset Analogy textarea (Task 1)
    const f1Factors = document.getElementById('f1-factors');
    if(f1Factors) f1Factors.value = '';
    const analogyReveal = document.getElementById('analogy-reveal-content');
    if(analogyReveal && analogyReveal.classList.contains('show')) {
        toggleReveal('analogy-reveal-content', document.getElementById('reveal-analogy-btn'), 'Reveal Some Ideas', 'Hide Ideas');
    }


    // Re-calculate max score and update display
    calculateMaxWorksheetScore(); // Should be accurate now as it sums defined marks
    updateTotalWorksheetScoreDisplay(); // Display 0 / max

    // Re-disable and update titles for conditional buttons
    setupConditionalButtons();

    alert("All interactive tasks on this page have been reset.");
}

function exportAnswersToPDF() {
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'pdf-summary-content';
    summaryContainer.style.fontFamily = 'Arial, sans-serif';
    summaryContainer.style.padding = '25px';
    summaryContainer.style.maxWidth = '780px';
    summaryContainer.style.margin = 'auto';
    summaryContainer.style.lineHeight = '1.6';

    let htmlContent = `
        <h1 style="text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Worksheet Answers Summary</h1>
        <h2 style="color: #3498db; margin-top: 25px; margin-bottom: 10px;">GCSE CS - CPU Performance</h2>
        <div style="text-align:center; font-size: 1.2em; font-weight:bold; background-color:#f0f8ff; padding:10px; border-radius:5px; margin-bottom:20px;">
            Overall Worksheet Score: ${currentWorksheetScore} / ${maxWorksheetScore}
        </div>
    `;

    const getValue = (selector, type = 'value', isContentEditable = false) => {
        const el = document.querySelector(selector);
        if (!el) return '[Element not found]';
        if (isContentEditable) {
            const text = el.textContent.trim();
            return text === '[Type here]' || text === '' ? '[Not answered]' : text;
        }
        return type === 'textContent' ? (el.textContent.trim() || '[Not answered]') : (el.value.trim() || '[Not answered]');
    };
    
    const addSection = (title, contentArray) => {
        htmlContent += `<h3 style="color: #2980b9; margin-top: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">${title}</h3>`;
        contentArray.forEach(item => {
            htmlContent += `<div style="margin-left: 10px; margin-bottom: 10px;"><strong>${item.label}:</strong><br>`;
            htmlContent += `<div style="background: #ecf0f1; padding: 8px; border: 1px solid #dde0e1; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; margin-top: 5px; font-family: Consolas, 'Courier New', monospace;">${item.value}</div></div>`;
            if (item.marksInfo) { // Add marks info if provided
                htmlContent += `<p style="margin-left: 10px; font-size: 0.9em; color: #7f8c8d;"><em>Marks: ${item.marksInfo}</em></p>`;
            }
        });
    };
    
    const addRawHtmlSection = (title, rawHtml) => {
        htmlContent += `<h3 style="color: #2980b9; margin-top: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">${title}</h3>`;
        htmlContent += rawHtml;
    };

    addSection('Starter Activity: How Components Interact', [
        { label: '1. CPU gets instructions/data from during processing', value: getValue('#starter-ram-use') },
        { label: '2. Programs/data stored when power is off', value: getValue('#starter-storage-use') },
        { label: '3. How user gives commands/data to computer', value: getValue('#starter-input-use') },
        { label: '4. How computer shows results to user', value: getValue('#starter-output-use') }
    ]);

    addSection('Task 1: Thinking About Performance: An Analogy', [
        { label: 'Factors affecting F1 car performance', value: getValue('#f1-factors') }
    ]);

    addSection('Task 2: Exploring CPU Specifications: A Case Study', [
        { label: 'How many CPU cores', value: getValue('#cores') },
        { label: 'How many threads', value: getValue('#threads') },
        { label: 'Base clock speed', value: getValue('#base-clock') },
        { label: 'Boost clock speed', value: getValue('#boost-clock') },
        { label: 'L2 and L3 cache size', value: getValue('#cache') },
        { label: 'Meaning of "unlocked"', value: getValue('#unlocked') },
        { label: 'Meaning of TDP', value: getValue('#tdp') }
    ]);

    let quizHtml = `<p style="margin-left: 10px;"><strong>Quiz Score: ${score} / ${totalQuestions}</strong></p>`;
    quizData.forEach((q, index) => {
        quizHtml += `<div style="margin-bottom: 12px; padding-left: 15px; border-left: 3px solid #ecf0f1; margin-top:10px;">`;
        quizHtml += `<p><strong>Q${index + 1}: ${q.question}</strong></p>`;
        const questionContainer = document.querySelectorAll('#quiz-questions .quiz-question-container')[index];
        let userAnswerText = '[Not attempted]';
        let correctness = '';
        if (questionContainer) {
            const buttons = questionContainer.querySelectorAll('button.quiz-option');
            let answered = false;
            buttons.forEach(btn => {
                if (btn.classList.contains('correct') || btn.classList.contains('incorrect')) {
                    answered = true;
                    if (btn.classList.contains('correct')) {
                        userAnswerText = btn.textContent.trim();
                        correctness = '<span style="color: green;">(Correct)</span>';
                    } else if (btn.classList.contains('incorrect') && btn.disabled) { // Check if it was the selected incorrect one
                         userAnswerText = btn.textContent.trim();
                         correctness = '<span style="color: red;">(Incorrect)</span>';
                         // Find and show the actual correct answer
                         buttons.forEach(bCorrect => {
                             if (bCorrect.textContent === q.correctAnswer) {
                                 correctness += ` - Correct Answer: ${q.correctAnswer}`;
                             }
                         });
                    }
                }
            });
             if (!answered) { // If no button is marked correct/incorrect, find the selected one if any (might not have been checked yet)
                buttons.forEach(btn => {
                    if (btn.classList.contains('selected')) { // Assuming a 'selected' class is added on click before checking
                        userAnswerText = btn.textContent.trim() + " (Selection not checked)";
                    }
                });
            }
        }
        quizHtml += `<p style="font-style: italic;">Selected Answer: ${userAnswerText} ${correctness}</p>`;
        quizHtml += `</div>`;
    });
    addRawHtmlSection('Task 4: Check Your Understanding (Quiz)', quizHtml);
    
    addSection('Task 5: How CPU Features Affect Performance (Explanations)', [
        { label: 'Explain why higher clock speed is generally faster', value: getValue('#clock-explanation') },
        { label: 'Explain why more cores improve performance for multitasking', value: getValue('#cores-explanation') },
        { label: 'Explain how cache improves performance', value: getValue('#cache-explanation') }
    ]);

    let examHtml = '<div style="margin-left: 10px;">';
    const q1Div = document.getElementById('blank-1') ? document.getElementById('blank-1').closest('.exam-question') : null;
    const q1MarksAwarded = q1Div && q1Div.dataset.marksAwardedFill ? q1Div.dataset.marksAwardedFill : '0';
    const q1MaxMarks = q1Div && q1Div.dataset.marks ? q1Div.dataset.marks : '0';
    examHtml += `<p><strong>i. Complete the sentences:</strong> (Marks: ${q1MarksAwarded}/${q1MaxMarks})</p>`;
    examHtml += `<p style="margin-left: 15px;">CPU stands for <u style="font-family: Consolas, 'Courier New', monospace; background: #f9f9f9; padding: 2px 4px;">${getValue('#blank-1', 'textContent', true)}</u>.</p>`;
    examHtml += `<p style="margin-left: 15px;">It is the part of the computer that fetches and executes the <u style="font-family: Consolas, 'Courier New', monospace; background: #f9f9f9; padding: 2px 4px;">${getValue('#blank-2', 'textContent', true)}</u> that are stored in <u style="font-family: Consolas, 'Courier New', monospace; background: #f9f9f9; padding: 2px 4px;">${getValue('#blank-3', 'textContent', true)}</u>.</p>`;
    
    const q2Div = document.getElementById('exam-q2-answer') ? document.getElementById('exam-q2-answer').closest('.exam-question') : null;
    const q2MarksAwarded = q2Div && q2Div.dataset.marksAwardedLong ? q2Div.dataset.marksAwardedLong : '0';
    const q2MaxMarks = q2Div && q2Div.dataset.marks ? q2Div.dataset.marks : '0';
    examHtml += `<p style="margin-top: 10px;"><strong>ii. Why dual core might improve performance:</strong> (Marks: ${q2MarksAwarded}/${q2MaxMarks})<br>`;
    examHtml += `<div style="background: #ecf0f1; padding: 8px; border: 1px solid #dde0e1; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; margin-top: 5px; font-family: Consolas, 'Courier New', monospace;">${getValue('#exam-q2-answer')}</div></p>`;
    
    const q3Div = document.getElementById('exam-q3-answer') ? document.getElementById('exam-q3-answer').closest('.exam-question') : null;
    const q3MarksAwarded = q3Div && q3Div.dataset.marksAwardedLong ? q3Div.dataset.marksAwardedLong : '0';
    const q3MaxMarks = q3Div && q3Div.dataset.marks ? q3Div.dataset.marks : '0';
    examHtml += `<p style="margin-top: 10px;"><strong>iii. How cache size can affect CPU performance:</strong> (Marks: ${q3MarksAwarded}/${q3MaxMarks})<br>`;
    examHtml += `<div style="background: #ecf0f1; padding: 8px; border: 1px solid #dde0e1; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; margin-top: 5px; font-family: Consolas, 'Courier New', monospace;">${getValue('#exam-q3-answer')}</div></p>`;
    examHtml += `</div>`;
    addRawHtmlSection('Task 6: Exam Practice Questions', examHtml);

    addSection('Extension Activity: Overclocking Investigation', [
        { label: 'Research findings on CPU overclocking', value: getValue('#overclocking-research') }
    ]);

    summaryContainer.innerHTML = htmlContent;

    const opt = {
        margin: [0.7, 0.7, 0.7, 0.7], filename: 'gcse-cs-cpu-performance-answers.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, logging: false, useCORS: true, scrollY: 0, windowWidth: summaryContainer.scrollWidth, windowHeight: summaryContainer.scrollHeight },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    const exportAnswersButton = document.getElementById('export-answers-btn');
    const resetButton = document.getElementById('reset-all-btn');
    if(exportAnswersButton) exportAnswersButton.disabled = true;
    if(resetButton) resetButton.disabled = true;
    
    document.body.appendChild(summaryContainer);
    html2pdf().from(summaryContainer).set(opt).save().then(() => {
        if(exportAnswersButton) exportAnswersButton.disabled = false;
        if(resetButton) resetButton.disabled = false;
        document.body.removeChild(summaryContainer);
    }).catch((error) => {
        console.error("Error during answers PDF generation:", error);
        if(exportAnswersButton) exportAnswersButton.disabled = false;
        if(resetButton) resetButton.disabled = false;
        if (document.body.contains(summaryContainer)) document.body.removeChild(summaryContainer);
    });
}


// --- DOMContentLoaded Initializer ---
document.addEventListener('DOMContentLoaded', () => {
    loadQuiz(); // Load Task 4 Quiz
    resetSimpleFdeAnimation(); // Initialize Task 3 FDE animation
    resetOverclockSim(); // Initialize Overclocking Sim in Extension

    // Initialize conditional buttons
    document.querySelectorAll('button[data-input-ids], button[data-input-group], button[data-fill-blanks-group]').forEach(button => {
        updateConditionalButton(button);
    });

    // Add input listeners for textareas/inputs linked to conditional buttons
    document.querySelectorAll('textarea[data-button-id], input[type="text"][data-button-id]').forEach(inputEl => {
        const button = document.getElementById(inputEl.dataset.buttonId);
        if (button) {
            inputEl.addEventListener('input', () => updateConditionalButton(button));
        }
    });
    
    // Add input listeners for grouped inputs
    const starterInputs = document.querySelectorAll('#starter-recap input[type="text"]');
    const revealStarterBtn = document.getElementById('reveal-starter-btn');
    if (revealStarterBtn) {
       starterInputs.forEach(input => input.addEventListener('input', () => updateConditionalButton(revealStarterBtn)));
    }

    const researchInputs = document.querySelectorAll('#cpu-factors-research input[type="text"]');
    const revealResearchBtn = document.getElementById('reveal-research-btn');
    if (revealResearchBtn) {
       researchInputs.forEach(input => input.addEventListener('input', () => updateConditionalButton(revealResearchBtn)));
    }
    
    // Add input listeners for fill-in-the-blanks (Task 6 Exam Q1)
    const examQ1InputsDiv = document.getElementById('exam-q1-inputs'); // The div that has the data-button-id
    if (examQ1InputsDiv) {
        const checkExamQ1Btn = document.getElementById(examQ1InputsDiv.dataset.buttonId);
        if (checkExamQ1Btn) {
            examQ1InputsDiv.querySelectorAll('span.fill-blank').forEach(span => {
                span.addEventListener('input', () => updateConditionalButton(checkExamQ1Btn));
            });
        }
    }
    
    // Setup for contenteditable placeholders
    document.querySelectorAll('.fill-blank[contenteditable="true"]').forEach(span => {
        const placeholderText = span.textContent;
        span.addEventListener('focus', () => { if (span.textContent === placeholderText) span.textContent = ''; span.classList.remove('correct-blank', 'incorrect-blank'); });
        span.addEventListener('blur', () => { if (span.textContent.trim() === '') span.textContent = placeholderText; });
    });

    // Setup self-assessment max values
    document.querySelectorAll('#exam-practice .exam-question').forEach(questionDiv => {
        const marksText = questionDiv.dataset.marks;
        if (marksText === undefined) return;
        const marks = parseInt(marksText, 10);
        const selfAssessInput = questionDiv.querySelector('.self-assess-input');
        if (!isNaN(marks) && selfAssessInput) selfAssessInput.max = marks;
    });
    
    // Clear any stored marks on page load
    document.querySelectorAll('#exam-practice .exam-question').forEach(questionDiv => {
        if(questionDiv.dataset.marksAwardedFill) delete questionDiv.dataset.marksAwardedFill;
        if(questionDiv.dataset.marksAwardedLong) delete questionDiv.dataset.marksAwardedLong;
    });
    // document.querySelectorAll('#performance-factors .perf-explanation').forEach(perfDiv => {
    //    if(perfDiv.dataset.marksAwardedPerf) delete perfDiv.dataset.marksAwardedPerf;
    // });


    // Initialize scores and display
    calculateMaxWorksheetScore();
    updateTotalWorksheetScoreDisplay();
});
