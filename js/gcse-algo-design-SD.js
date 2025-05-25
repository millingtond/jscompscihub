// js/gcse-algo-design-SD.js
const flashcardData = {
    "structure diagram": "A diagram that shows how a system or program is broken down into smaller, hierarchical modules or sub-systems.",
    "module": "A distinct part of a larger system or program that performs a specific function or set of related functions.",
    "modules": "Distinct parts of a larger system or program that perform specific functions or sets of related functions.",
    "sub-system": "A smaller, self-contained system that is part of a larger system.",
    "sub-systems": "Smaller, self-contained systems that are part of a larger system.",
    "hierarchy": "The arrangement of modules in a system from the most general (top) to the most specific (bottom), showing levels of decomposition.",
    "decomposition": "Breaking a problem down into smaller, more manageable parts. A key principle in computational thinking and system design.",
    "top-down design": "A design approach where a system is broken down from a high-level overview into progressively smaller and more detailed sub-systems or modules.",
    "flowchart": "A diagram that represents an algorithm, workflow or process, showing the steps as boxes of various kinds, and their order by connecting them with arrows.",
    "pseudocode": "A plain language description of the steps in an algorithm or another system. Pseudocode often uses structural conventions of a normal programming language, but is intended for human reading rather than machine reading."
};

let totalPossibleScore = 0;
let currentScore = 0;
let scoreCalculated = false;

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

function toggleReveal(contentId, buttonElement, revealText, hideText) {
    const content = document.getElementById(contentId);
    if (!content) return;
    content.classList.toggle('show');
    if (buttonElement) {
        buttonElement.textContent = content.classList.contains('show') ? hideText : revealText;
    }
}

function checkSatNavDiagram() {
    const quizItem = document.getElementById('task1-satnav');
    const feedbackEl = quizItem.querySelector('.feedback');
    let correctSelections = 0;
    const expected = {
        "satnav-box1": "output directions", 
        "satnav-box2": "new destination",   
        "satnav-box3": "saved destinations" 
    };
    
    const inputsToStyle = [];

    for (const boxId in expected) {
        const selectEl = document.getElementById(boxId);
        const userAnswer = selectEl.value;
        inputsToStyle.push(selectEl);
        selectEl.classList.remove('border-green-500', 'bg-green-50', 'border-red-500', 'bg-red-50'); 
        if (userAnswer === expected[boxId]) {
            correctSelections++;
            selectEl.classList.add('border-green-500', 'bg-green-50');
        } else {
            selectEl.classList.add('border-red-500', 'bg-red-50');
        }
    }

    let pointsAwarded = 0;
    if (correctSelections === 3) pointsAwarded = 2;
    else if (correctSelections === 2) pointsAwarded = 1;
    
    quizItem.dataset.currentScore = pointsAwarded; 

    if (pointsAwarded === 2) {
        feedbackEl.innerHTML = `<span class="correct-feedback">All correct! (+2 points)</span>`;
        quizItem.dataset.answeredCorrectly = "true";
    } else if (pointsAwarded === 1) {
        feedbackEl.innerHTML = `<span class="incorrect-feedback">Partially correct. You got ${correctSelections}/3. Check highlighted boxes. (+${pointsAwarded} point)</span>`;
        quizItem.dataset.answeredCorrectly = "false";
    } else {
        feedbackEl.innerHTML = `<span class="incorrect-feedback">Incorrect. Expected: Top-Right='Output Directions', Bottom-Left 1='New Destination', Bottom-Left 2='Saved Destinations'.</span>`;
        quizItem.dataset.answeredCorrectly = "false";
    }
    quizItem.dataset.answered = "true";
    if(scoreCalculated) calculateScore();
}

function checkMobileAppDiagram() {
    const quizItem = document.getElementById('task2-mobileapp');
    const feedbackEl = quizItem.querySelector('.feedback');
    let correctCount = 0;
    const expectedAnswers = {
        "mobile-box1": "C", 
        "mobile-box2": "A", 
        "mobile-box3": "D", 
        "mobile-box4": "F"  
    };

    for (const selectId in expectedAnswers) {
        const selectEl = document.getElementById(selectId);
        selectEl.classList.remove('border-green-500', 'bg-green-50', 'border-red-500', 'bg-red-50'); 
        if (selectEl.value === expectedAnswers[selectId]) {
            correctCount++;
            selectEl.classList.add('border-green-500', 'bg-green-50');
        } else {
            selectEl.classList.add('border-red-500', 'bg-red-50');
        }
    }

    if (correctCount === 4) {
        feedbackEl.innerHTML = `<span class="correct-feedback">All correct! (+4 points)</span>`;
        quizItem.dataset.answeredCorrectly = "true";
    } else {
        feedbackEl.innerHTML = `<span class="incorrect-feedback">You got ${correctCount} out of 4 correct. Check highlighted boxes. Correct Answers (by image position): Top-Right (L2) = C, Mid-Left (L3) = A, Bottom-Left (L4) = D, Bottom-Right (L4) = F.</span>`;
        quizItem.dataset.answeredCorrectly = "false";
    }
    quizItem.dataset.answered = "true";
    if(scoreCalculated) calculateScore();
}

document.querySelectorAll('#task3-truefalse .option-button').forEach(button => {
    button.addEventListener('click', () => {
        const parentDiv = button.closest('div[data-correct]');
        if (parentDiv.dataset.answered === 'true') return;
        parentDiv.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

function checkTrueFalseStructure() {
    const quizItem = document.getElementById('task3-truefalse');
    let correctAnswers = 0;
    const questions = quizItem.querySelectorAll('div[data-correct]');
    
    questions.forEach(qDiv => {
        const selectedButton = qDiv.querySelector('.option-button.selected');
        const feedbackSpan = qDiv.querySelector('.feedback');
        qDiv.dataset.answered = "true";
        feedbackSpan.innerHTML = ''; 

        if (selectedButton) {
            const isCorrect = selectedButton.dataset.answer === qDiv.dataset.correct;
            if (isCorrect) {
                correctAnswers++;
                selectedButton.classList.add('correct');
                feedbackSpan.innerHTML = `<span class="correct-feedback"><i class="fas fa-check"></i> Correct</span>`;
            } else {
                selectedButton.classList.add('incorrect');
                feedbackSpan.innerHTML = `<span class="incorrect-feedback"><i class="fas fa-times"></i> Incorrect</span>`;
                 qDiv.querySelector(`.option-button[data-answer="${qDiv.dataset.correct}"]`).classList.add('correct');
            }
        } else {
            feedbackSpan.innerHTML = `<span class="incorrect-feedback">No answer selected.</span>`;
        }
    });
    const finalScoreForTask = correctAnswers * 0.5;
    quizItem.dataset.currentScore = finalScoreForTask; 
    quizItem.dataset.answeredCorrectly = (correctAnswers === questions.length).toString();
    
     const overallFeedbackEl = quizItem.querySelector('.check-button + .feedback') || document.createElement('div'); 
     if(!overallFeedbackEl.classList.contains('feedback')) {
        overallFeedbackEl.className = 'feedback text-center mt-2';
        quizItem.querySelector('.check-button').insertAdjacentElement('afterend', overallFeedbackEl);
     }
    overallFeedbackEl.innerHTML = `You answered ${correctAnswers} out of ${questions.length} correctly. (+${finalScoreForTask} points)`;
    overallFeedbackEl.classList.add('show');

    if(scoreCalculated) calculateScore();
}

function toggleMarkScheme(markSchemeId, textareaId, minLength = 10) {
    const markSchemeDiv = document.getElementById(markSchemeId);
    // const buttonElement = event.target; // event is not defined here, should be passed or accessed globally if needed
    const buttonElement = document.querySelector(`button[onclick*="${markSchemeId}"]`); // A way to get the button
    if (!markSchemeDiv) return;
    toggleReveal(markSchemeId, buttonElement, 'Show Mark Scheme', 'Hide Mark Scheme');
}

function calculateScore() {
    currentScore = 0;
    totalPossibleScore = 0; 
    scoreCalculated = true;

    document.querySelectorAll('.quiz-item').forEach(item => {
        if (item.closest('#starter-activity') || item.closest('#exam-practice-sd')) return; 

        const points = parseInt(item.dataset.points || 0);
        totalPossibleScore += points;
        if (item.id === 'task3-truefalse' && item.dataset.answered === 'true') { 
            currentScore += parseFloat(item.dataset.currentScore || 0);
        } else if (item.dataset.answeredCorrectly === 'true') {
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

function resetAllTasks() {
    if (!confirm("Are you sure you want to reset all tasks? Your progress will be lost.")) return;
    
    ['satnav-box1', 'satnav-box2', 'satnav-box3'].forEach(id => {
        const el = document.getElementById(id);
        if(el) { el.value = ''; el.className = 'm-0'; } // Resetting class might be too aggressive, depends on initial state
        if(el && el.tagName === 'SELECT') { 
            el.classList.remove('border-green-500', 'bg-green-50', 'border-red-500', 'bg-red-50', 'border-yellow-500', 'bg-yellow-50');
        }
    });
    const task1Feedback = document.querySelector('#task1-satnav .feedback');
    if(task1Feedback) task1Feedback.innerHTML = '';
    const task1QuizItem = document.getElementById('task1-satnav');
    if(task1QuizItem) {delete task1QuizItem.dataset.answered; delete task1QuizItem.dataset.answeredCorrectly; delete task1QuizItem.dataset.currentScore;}

    ['mobile-box1', 'mobile-box2', 'mobile-box3', 'mobile-box4'].forEach(id => {
        const el = document.getElementById(id);
        if(el) { el.value = ''; el.className = 'm-0'; } // Similar to above, class reset
    });
    const task2Feedback = document.querySelector('#task2-mobileapp .feedback');
    if(task2Feedback) task2Feedback.innerHTML = '';
    const task2QuizItem = document.getElementById('task2-mobileapp');
    if(task2QuizItem) {delete task2QuizItem.dataset.answered; delete task2QuizItem.dataset.answeredCorrectly;}

    document.querySelectorAll('#task3-truefalse .option-button').forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
    });
    document.querySelectorAll('#task3-truefalse .feedback').forEach(fb => fb.innerHTML = '');
    document.querySelectorAll('#task3-truefalse div[data-correct]').forEach(qDiv => delete qDiv.dataset.answered);
    const task3QuizItem = document.getElementById('task3-truefalse');
    if(task3QuizItem) {delete task3QuizItem.dataset.answered; delete task3QuizItem.dataset.answeredCorrectly; delete task3QuizItem.dataset.currentScore;}
    const task3OverallFeedback = task3QuizItem.querySelector('.check-button + .feedback');
    if(task3OverallFeedback) task3OverallFeedback.classList.remove('show');

    ['vending-design-input', 'pacman-modules-input', 'pupil-system-modules-input', 'exam-q1-sd', 'exam-q2-sd'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = '';
    });
    ['vending-example-diagram', 'pacman-example-sd', 'pupil-system-example-sd', 'ms-exam-q1-sd', 'ms-exam-q2-sd'].forEach(id => {
        const revealDiv = document.getElementById(id);
        const revealButton = document.querySelector(`button[onclick*="'${id}'"]`);
        if (revealDiv && revealDiv.classList.contains('show') && revealButton) {
             toggleReveal(id, revealButton, revealButton.textContent.replace('Hide','Show'), revealButton.textContent.replace('Show','Hide'));
        } else if (revealDiv && revealDiv.classList.contains('show')) { 
            revealDiv.classList.remove('show');
        }
    });
    
    document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);
    currentScore = 0; scoreCalculated = false;
    document.getElementById('final-score-area').style.display = 'none';
    document.getElementById('final-score-display').textContent = 'Your score: 0 / 0';
    document.getElementById('final-score-feedback').textContent = '';

    alert("All tasks have been reset.");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function exportToPDF() {
    alert("Preparing PDF. This might take a moment. Please ensure pop-ups are allowed. Interactive elements might not be fully captured in their current state. Replace placeholder image URLs if necessary before printing for best results.");
    const element = document.querySelector('.max-w-4xl.mx-auto.bg-white'); 
    const opt = {
        margin:       [0.5, 0.5, 0.7, 0.5], 
        filename:     'gcse-structure-diagrams-lesson.pdf',
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 2, logging: false, useCORS: true, scrollY: -window.scrollY, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight },
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
    if (finalScoreWasHidden && scoreCalculated) finalScoreArea.style.display = 'block';

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

document.addEventListener('DOMContentLoaded', () => {
    addTooltips();
    
    totalPossibleScore = 0;
    document.querySelectorAll('.quiz-item').forEach(item => {
        if (item.closest('#starter-activity') || item.closest('#exam-practice-sd')) return;
        totalPossibleScore += parseInt(item.dataset.points || 0);
    });
     document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

    document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
    document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
    document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
});