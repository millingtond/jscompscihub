// --- Flashcard Data for Keywords ---
const flashcardData = {
    "computational thinking": "A problem solving process using abstraction, decomposition and algorithmic thinking. Results in an algorithm we can code for a computer.",
    "abstraction": "Removing/hiding unnecessary detail and focusing on the important details that are necessary to solve a problem. Simplifies the problem and reduces complexity making it easier to solve/understand.",
    "decomposition": "Breaking a problem down into smaller steps in order to solve it. A CT skill.",
    "algorithmic thinking": "Defining the steps needed to solve a problem using sequence, selection and iteration. A CT skill.",
    "algorithm": "A finite sequence of well-defined, computer-implementable instructions, typically to solve a class of specific problems or to perform a computation."
};

// --- Global Variables for Scoring ---
let totalPossibleScore = 0;
let currentScore = 0;
let scoreCalculated = false;

// --- Helper: Add Keyword Tooltips ---
function addTooltips() {
    document.querySelectorAll('.keyword').forEach(span => {
        const keywordText = span.textContent.trim().toLowerCase().replace(/[().,]/g, '');
        if (!span.querySelector('.tooltip')) {
            const tooltipDefinition = flashcardData[keywordText];
            if (tooltipDefinition) {
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipDefinition;
                span.appendChild(tooltip);
            }
        }
    });
}

// --- Helper: Toggle Reveal ---
function toggleReveal(contentId, buttonElement, revealText, hideText) {
    const content = document.getElementById(contentId);
    if (!content) return;
    content.classList.toggle('show');
    if (buttonElement) {
        buttonElement.textContent = content.classList.contains('show') ? hideText : revealText;
    }
}

// --- Task 1.1: Abstraction Examples ---
function checkAbstractionExamples() {
    const quizItem = document.getElementById('task-abstraction-examples');
    const feedbackEl = quizItem.querySelector('.feedback');
    let correctCount = 0;
    const answers = [
        { id: 'abs-q1', keywords: ['calculation', 'route', 'map data', 'satellite', 'gps signal'] },
        { id: 'abs-q2', keywords: ['file format', 'decoding', 'streaming', 'server communication', 'digital to analog'] },
        { id: 'abs-q3', keywords: ['gears', 'linkages', 'power assist', 'axle', 'mechanical'] }
    ];
    let feedbackHtml = "<ul>";

    answers.forEach(ans => {
        const inputEl = document.getElementById(ans.id);
        const userAnswer = inputEl.value.toLowerCase();
        if (ans.keywords.some(kw => userAnswer.includes(kw)) && userAnswer.length > 5) {
            feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>${inputEl.previousElementSibling.textContent} Good point!</li>`;
            correctCount++;
        } else if (userAnswer.length > 0) {
            feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>${inputEl.previousElementSibling.textContent} Think about the complex details hidden from the user.</li>`;
        } else {
             feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>${inputEl.previousElementSibling.textContent} Please provide an answer.</li>`;
        }
    });
    feedbackHtml += "</ul>";
    
    quizItem.dataset.answeredCorrectly = (correctCount >= 2).toString(); // Mark as correct if at least 2 are good
    quizItem.dataset.answered = "true";
    feedbackEl.innerHTML = `<p class="${correctCount >=2 ? 'correct-feedback' : 'incorrect-feedback'} font-semibold">You identified ${correctCount}/${answers.length} good examples of hidden complexity.</p>${feedbackHtml}`;
    if(scoreCalculated) calculateScore();
}

// --- Task 2.1: Decomposition Task ---
function checkDecompositionTask() {
    const quizItem = document.getElementById('task-decomposition-problem');
    const feedbackEl = quizItem.querySelector('.feedback');
    let validSteps = 0;
    const inputs = [
        document.getElementById('decomp-step1').value.trim(),
        document.getElementById('decomp-step2').value.trim(),
        document.getElementById('decomp-step3').value.trim(),
        document.getElementById('decomp-step4').value.trim(),
        document.getElementById('decomp-step5').value.trim()
    ];
    inputs.forEach(step => { if (step.length > 3) validSteps++; }); // Simple check for non-empty, somewhat descriptive steps

    if (validSteps >= 3) {
        feedbackEl.innerHTML = `<span class="correct-feedback">Good job! You've broken down the task into ${validSteps} steps. (+${quizItem.dataset.points} points)</span>`;
        quizItem.dataset.answeredCorrectly = "true";
    } else {
        feedbackEl.innerHTML = `<span class="incorrect-feedback">Please provide at least 3 distinct sub-tasks for making tea. You provided ${validSteps}.</span>`;
        quizItem.dataset.answeredCorrectly = "false";
    }
    quizItem.dataset.answered = "true";
    if(scoreCalculated) calculateScore();
}

// --- Task 3.1: Algorithmic Thinking Sorter ---
let draggedAlgoStep = null;
const algoStepsPool = document.getElementById('algo-steps-pool');
const algoOrderedSteps = document.getElementById('algo-ordered-steps');
const correctAlgoOrder = ["toast-step-insert", "toast-step-start", "toast-step-wait", "toast-step-remove", "toast-step-butter"];

function setupAlgorithmSorter() {
    if(!algoStepsPool || !algoOrderedSteps) return;
    algoStepsPool.querySelectorAll('.algo-step').forEach(step => {
        step.draggable = true;
        step.addEventListener('dragstart', e => {
            draggedAlgoStep = e.target;
            setTimeout(() => e.target.classList.add('dragging'), 0);
        });
        step.addEventListener('dragend', e => {
            setTimeout(() => e.target.classList.remove('dragging'), 0);
            draggedAlgoStep = null;
        });
    });

    algoOrderedSteps.addEventListener('dragover', e => { e.preventDefault(); algoOrderedSteps.classList.add('dragover'); });
    algoOrderedSteps.addEventListener('dragleave', e => algoOrderedSteps.classList.remove('dragover'));
    algoOrderedSteps.addEventListener('drop', e => {
        e.preventDefault();
        algoOrderedSteps.classList.remove('dragover');
        if (draggedAlgoStep) {
            // Allow dropping into specific position or append
            const target = e.target.closest('.algo-step') || e.target.closest('.algo-dropzone > div'); // find placeholder or existing step
            if(target && target.parentElement === algoOrderedSteps && target !== draggedAlgoStep) {
                algoOrderedSteps.insertBefore(draggedAlgoStep, target);
            } else {
                const placeholder = algoOrderedSteps.querySelector('.h-10.text-gray-400');
                if (placeholder) {
                    algoOrderedSteps.insertBefore(draggedAlgoStep, placeholder);
                    placeholder.remove();
                } else {
                     algoOrderedSteps.appendChild(draggedAlgoStep);
                }
            }
        }
    });
    algoStepsPool.addEventListener('dragover', e => e.preventDefault());
    algoStepsPool.addEventListener('drop', e => {
        e.preventDefault();
        if (draggedAlgoStep) {
            algoStepsPool.appendChild(draggedAlgoStep);
            draggedAlgoStep.classList.remove('correct', 'incorrect');
        }
    });
}

function checkAlgorithmOrder() {
    const feedbackDiv = document.querySelector('#task-algorithmic-order .feedback');
    const quizItem = algoOrderedSteps.closest('.quiz-item');
    if(!algoOrderedSteps || !feedbackDiv || !quizItem) return;

    const placedSteps = Array.from(algoOrderedSteps.querySelectorAll('.algo-step'));
    let correctOrderCount = 0;
    
    if (algoStepsPool.children.length > 1) { // 1 for the H4 title
        alert("Please drag all steps from the pool to the 'Making Toast - Algorithm' box.");
        return;
    }
    
    if (placedSteps.length !== correctAlgoOrder.length) {
         feedbackDiv.innerHTML = `<span class="incorrect-feedback">Please place all ${correctAlgoOrder.length} steps in order.</span>`;
         quizItem.dataset.answeredCorrectly = "false";
         quizItem.dataset.answered = "true";
         if(scoreCalculated) calculateScore();
         return;
    }

    placedSteps.forEach((step, index) => {
        step.classList.remove('correct', 'incorrect');
        if (index < correctAlgoOrder.length && step.id === correctAlgoOrder[index]) {
            step.classList.add('correct');
            correctOrderCount++;
        } else {
            step.classList.add('incorrect');
        }
    });

    quizItem.dataset.answered = "true";
    if (correctOrderCount === correctAlgoOrder.length) {
        feedbackDiv.innerHTML = `<span class="correct-feedback">Correct order! Well done! (+${quizItem.dataset.points} points)</span>`;
        quizItem.dataset.answeredCorrectly = "true";
    } else {
        feedbackDiv.innerHTML = `<span class="incorrect-feedback">Not quite the right order. You got ${correctOrderCount}/${correctAlgoOrder.length} steps correct. Review the red items.</span>`;
        quizItem.dataset.answeredCorrectly = "false";
    }
    if(scoreCalculated) calculateScore();
}

function resetAlgorithmSorter() {
    if(!algoStepsPool || !algoOrderedSteps) return;
    algoOrderedSteps.querySelectorAll('.algo-step').forEach(step => {
        step.classList.remove('correct', 'incorrect');
        algoStepsPool.appendChild(step);
    });
    algoOrderedSteps.innerHTML = ` 
        <div class="h-10 text-gray-400 italic flex items-center justify-center">1. First...</div>
        <div class="h-10 text-gray-400 italic flex items-center justify-center">2. Then...</div>
        <div class="h-10 text-gray-400 italic flex items-center justify-center">3. Then...</div>
        <div class="h-10 text-gray-400 italic flex items-center justify-center">4. Then...</div>
        <div class="h-10 text-gray-400 italic flex items-center justify-center">5. Finally...</div>`;
    const feedbackDiv = document.querySelector('#task-algorithmic-order .feedback');
    if(feedbackDiv) feedbackDiv.textContent = '';
    const quizItem = algoOrderedSteps.closest('.quiz-item');
    if(quizItem) {quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered;}
    if(scoreCalculated) calculateScore();
}


// --- Exam Practice Question Logic ---
function toggleMarkScheme(markSchemeId, textareaId, minLength = 10) {
    const markSchemeDiv = document.getElementById(markSchemeId);
    const textarea = document.getElementById(textareaId);
    const buttonElement = event.target; 

    if (!markSchemeDiv) return;

    if (!markSchemeDiv.classList.contains('show')) { 
        if (textarea && textarea.value.trim().length < minLength) {
            alert(`Please attempt a more detailed answer (at least ${minLength} characters) before viewing the mark scheme.`);
            return;
        }
    }
    toggleReveal(markSchemeId, buttonElement, 'Show Mark Scheme', 'Hide Mark Scheme');
}

// --- Final Score Calculation ---
function calculateScore() {
    currentScore = 0;
    totalPossibleScore = 0;
    scoreCalculated = true;

    document.querySelectorAll('.quiz-item').forEach(item => {
        if (item.closest('#starter-activity') || item.closest('#exam-practice-ct') ) return; 

        const points = parseInt(item.dataset.points || 0);
        totalPossibleScore += points;
        if (item.dataset.answeredCorrectly === 'true') {
            currentScore += points;
        }
    });

    const scoreDisplayEl = document.getElementById('final-score-display');
    const feedbackDisplay = document.getElementById('final-score-feedback');
    const scoreArea = document.getElementById('final-score-area');

    scoreDisplayEl.textContent = `Your interactive task score: ${currentScore} / ${totalPossibleScore}`;
    let percentage = totalPossibleScore > 0 ? (currentScore / totalPossibleScore) * 100 : 0;
    let feedbackMessage = "";

    if (percentage === 100) feedbackMessage = "Excellent! Full marks on interactive tasks!";
    else if (percentage >= 75) feedbackMessage = "Great job! You have a strong understanding.";
    else if (percentage >= 50) feedbackMessage = "Good effort! Review any tasks you found tricky.";
    else feedbackMessage = "Keep practicing! Revisit the tasks and explanations to improve.";

    feedbackDisplay.textContent = feedbackMessage;
    feedbackDisplay.className = `text-purple-600 ${percentage >= 75 ? 'font-semibold' : ''}`;
    scoreArea.style.display = 'block';
    scoreArea.scrollIntoView({ behavior: 'smooth' });
}

// --- Reset All Tasks ---
function resetAllTasks() {
    if (!confirm("Are you sure you want to reset all tasks? Your progress will be lost.")) return;
    // Reset Starter
    ['starter-q1-problem', 'starter-q2-simplify', 'starter-q3-instructions'].forEach(id => document.getElementById(id).value = '');
    const starterRevealBtn = document.querySelector("button[onclick*='starter-answers-feedback']");
    const starterFeedbackDiv = document.getElementById('starter-answers-feedback');
    if (starterFeedbackDiv.classList.contains('show')) toggleReveal('starter-answers-feedback', starterRevealBtn, 'Reveal Discussion Points', 'Hide Discussion Points');
    
    // Reset Tasks
    // Task 1.1 Abstraction
    ['abs-q1', 'abs-q2', 'abs-q3'].forEach(id => document.getElementById(id).value = '');
    document.querySelector('#task-abstraction-examples .feedback').innerHTML = '';
    document.getElementById('task-abstraction-examples').dataset.answeredCorrectly = "false"; delete document.getElementById('task-abstraction-examples').dataset.answered;
    // Task 2.1 Decomposition
    ['decomp-step1', 'decomp-step2', 'decomp-step3', 'decomp-step4', 'decomp-step5'].forEach(id => document.getElementById(id).value = '');
    document.querySelector('#task-decomposition-problem .feedback').innerHTML = '';
    document.getElementById('task-decomposition-problem').dataset.answeredCorrectly = "false"; delete document.getElementById('task-decomposition-problem').dataset.answered;
    // Task 3.1 Algorithmic Thinking
    resetAlgorithmSorter();


    // Reset Exam Practice
    ['exam-q1-ct', 'exam-q2-ct'].forEach(id => { 
        const el = document.getElementById(id); if(el) el.value = '';
    });
    ['ms-exam-q1-ct', 'ms-exam-q2-ct'].forEach(id => {
        const msDiv = document.getElementById(id);
        const msButton = document.querySelector(`button[onclick*="'${id}'"]`);
        if (msDiv && msDiv.classList.contains('show') && msButton) {
             toggleReveal(id, msButton, 'Show Mark Scheme', 'Hide Mark Scheme');
        } else if (msDiv && msDiv.classList.contains('show')) {
            msDiv.classList.remove('show');
        }
    });
    
    // Reset Read Checkboxes
    document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);
    // Reset Final Score
    currentScore = 0; scoreCalculated = false;
    document.getElementById('final-score-area').style.display = 'none';
    document.getElementById('final-score-display').textContent = 'Your score: 0 / 0';
    document.getElementById('final-score-feedback').textContent = '';

    alert("All tasks have been reset.");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- PDF Export ---
function exportToPDF() {
    alert("Preparing PDF. This might take a moment. Please ensure pop-ups are allowed. Interactive elements might not be fully captured in their current state.");
    const element = document.querySelector('.max-w-4xl.mx-auto.bg-white'); 
    const opt = {
        margin:       [0.5, 0.5, 0.7, 0.5], 
        filename:     'gcse-computational-thinking-lesson.pdf',
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 2, logging: false, useCORS: true, scrollY: -window.scrollY },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    const revealableElements = document.querySelectorAll('.feedback-area, .quiz-feedback, .mark-scheme, .reveal-content');
    const initiallyHidden = [];
    revealableElements.forEach(el => {
        if (!el.classList.contains('show')) { initiallyHidden.push(el); el.classList.add('show'); }
    });
    const finalScoreArea = document.getElementById('final-score-area');
    const finalScoreWasHidden = finalScoreArea.style.display === 'none';
    if (finalScoreWasHidden) finalScoreArea.style.display = 'block';

    const exportButton = document.getElementById('export-pdf-button');
    const resetButton = document.getElementById('reset-all-tasks');
    const calcScoreButton = document.getElementById('calculate-final-score');
    if(exportButton) exportButton.disabled = true;
    if(resetButton) resetButton.disabled = true;
    if(calcScoreButton) calcScoreButton.disabled = true;

    html2pdf().from(element).set(opt).save().then(function() {
        initiallyHidden.forEach(el => el.classList.remove('show'));
        if (finalScoreWasHidden) finalScoreArea.style.display = 'none';
        if(exportButton) exportButton.disabled = false;
        if(resetButton) resetButton.disabled = false;
        if(calcScoreButton) calcScoreButton.disabled = false;
    }).catch(function(error){
        console.error("Error generating PDF:", error);
        initiallyHidden.forEach(el => el.classList.remove('show'));
        if (finalScoreWasHidden) finalScoreArea.style.display = 'none';
        if(exportButton) exportButton.disabled = false;
        if(resetButton) resetButton.disabled = false;
        if(calcScoreButton) calcScoreButton.disabled = false;
    });
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    addTooltips();
    setupAlgorithmSorter();
    
    // Calculate initial total possible score
    totalPossibleScore = 0;
    document.querySelectorAll('.quiz-item').forEach(item => {
        if (item.closest('#starter-activity') || item.closest('#exam-practice-ct') ) return; 
        totalPossibleScore += parseInt(item.dataset.points || 0);
    });
    document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

    document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
    document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
    document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
});