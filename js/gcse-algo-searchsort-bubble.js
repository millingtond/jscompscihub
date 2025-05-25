// --- Flashcard Data for Keywords ---
const flashcardData = {
    "bubble sort": "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The passes through the list are repeated until no swaps are needed.",
    "pass": "One full iteration through the list (or the unsorted portion of the list) during a bubble sort, where adjacent elements are compared and potentially swapped.",
    "comparison (sorting)": "The act of comparing two adjacent elements in a list to determine if they are in the correct order.",
    "swap": "Exchanging the positions of two elements in a list if they are found to be in the wrong order during a comparison.",
    "sorted portion": "The part of the list (usually at the end after each pass of bubble sort) that contains elements that are in their final sorted positions.",
    "time complexity (bubble sort)": "Worst-case and average-case O(n²), best-case O(n) if the list is already sorted and an optimization is used to stop early.",
    "space complexity (bubble sort)": "O(1) as it's an in-place sort.",
    "in-place sort": "A sorting algorithm that sorts the elements within the original array or list, using only a constant amount of extra storage space (or a very small, logarithmic amount).",
    "algorithm": "A finite sequence of well-defined, computer-implementable instructions, typically to solve a class of specific problems or to perform a computation."
};

// --- Global Variables for Scoring ---
let totalPossibleScore = 0;
let currentScore = 0;
let scoreCalculated = false;

// --- Bubble Sort Simulation Variables ---
let bubbleSortArray = [];
let bubbleSortCurrentPass = 0;
let bubbleSortCurrentComparisonIndex = 0;
let bubbleSortSwapsInPass = 0;
let bubbleSortSortedCount = 0; // How many items are in their final sorted position at the end
let bubbleSortInterval;
const bubbleSortVisualizationArea = document.getElementById('bubble-sort-visualization-area');
const bubbleSortStatus = document.getElementById('bubble-sort-status');
const bubbleSortStepBtn = document.getElementById('bubble-sort-step-btn');

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

// --- Task 1: Bubble Sort Trace ---
function checkBubbleSortTrace() {
    const quizItem = document.getElementById('task-bubblesort-trace');
    const answerTextarea = document.getElementById('bubblesort-trace-answer');
    const feedbackEl = quizItem.querySelector('.feedback');
    const answer = answerTextarea.value.toLowerCase().trim();
    let points = 0;
    const minLength = 50; // Expect a decent trace

    if (answer.length < minLength) {
        feedbackEl.innerHTML = `<span class="incorrect-feedback">Please provide a more detailed trace for the first pass (at least ${minLength} characters).</span>`;
    } else {
        // Check for key states/actions in the first pass of [4, 1, 3, 2]
        let pass1Correct = 0;
        if (answer.includes("[1, 4, 3, 2]") || answer.includes("1 4 3 2")) pass1Correct++; // After 4,1 swap
        if (answer.includes("[1, 3, 4, 2]") || answer.includes("1 3 4 2")) pass1Correct++; // After 4,3 swap
        if (answer.includes("[1, 3, 2, 4]") || answer.includes("1 3 2 4")) pass1Correct++; // After 4,2 swap
        if (answer.includes("compare 4 and 1") && answer.includes("swap")) pass1Correct++;
        if (answer.includes("compare 4 and 3") && answer.includes("swap")) pass1Correct++;
        if (answer.includes("compare 4 and 2") && answer.includes("swap")) pass1Correct++;
        
        points = Math.min(4, Math.floor(pass1Correct / 1.5)); // Heuristic scoring for trace

        if (points >= 3) { // Need to show most of the first pass correctly
            feedbackEl.innerHTML = `<span class="correct-feedback">Good trace of the first pass! (+${points} points)</span>`;
            quizItem.dataset.answeredCorrectly = "true";
        } else {
            feedbackEl.innerHTML = `<span class="incorrect-feedback">Your trace of the first pass could be more accurate or complete. Remember to show the list after each comparison/swap. (+${points} points)</span>`;
            quizItem.dataset.answeredCorrectly = "false";
        }
    }
    quizItem.dataset.answered = "true";
    if(scoreCalculated) calculateScore();
}

// --- Bubble Sort Simulation Logic ---
function setupBubbleSortVisual() {
    const inputStr = document.getElementById('bubble-sort-input').value;
    bubbleSortArray = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

    if (bubbleSortArray.length === 0) {
        bubbleSortStatus.textContent = "Please enter a valid list of numbers.";
        return;
    }
     if (bubbleSortArray.length > 10) { // Limit size for better visualization
        bubbleSortStatus.textContent = "List too long for visualization (max 10 numbers recommended).";
        // return; // Allow longer lists but they might look cramped
    }


    bubbleSortCurrentPass = 0;
    bubbleSortCurrentComparisonIndex = 0;
    bubbleSortSwapsInPass = 0;
    bubbleSortSortedCount = 0;
    
    bubbleSortStepBtn.disabled = false;
    bubbleSortStatus.textContent = "List loaded. Click 'Next Step' to begin Pass 1.";
    renderBubbleSortArray();
}

function renderBubbleSortArray(comparingIndices = [], swappingIndices = []) {
    if (!bubbleSortVisualizationArea) return;
    bubbleSortVisualizationArea.innerHTML = '';
    bubbleSortArray.forEach((val, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'sort-array-item';
        itemDiv.textContent = val;
        if (comparingIndices.includes(index)) itemDiv.classList.add('comparing');
        if (swappingIndices.includes(index)) itemDiv.classList.add('swapping');
        if (index >= bubbleSortArray.length - bubbleSortSortedCount) itemDiv.classList.add('sorted');
        bubbleSortVisualizationArea.appendChild(itemDiv);
    });
}

function nextBubbleSortStep() {
    if (!bubbleSortArray.length) return;

    // Check if sorting is complete
    if (bubbleSortCurrentPass > 0 && bubbleSortSwapsInPass === 0 && bubbleSortCurrentComparisonIndex === 0) {
        bubbleSortStatus.textContent = `Sorting complete after ${bubbleSortCurrentPass} passes! No swaps in the last pass. Final list: [${bubbleSortArray.join(', ')}]`;
        renderBubbleSortArray([], []); // Render final state
        bubbleSortStepBtn.disabled = true;
        // Mark the simulation task as 'correctly answered' conceptually if it reaches completion
        const simQuizItem = document.getElementById('bubblesort-simulation-section').querySelector('.quiz-item') || document.getElementById('bubblesort-simulation-section'); // Fallback to section if no specific quiz item
        if(simQuizItem) { simQuizItem.dataset.answeredCorrectly = "true"; simQuizItem.dataset.answered = "true"; }
        if(scoreCalculated) calculateScore();
        return;
    }
    
    // Start new pass or reset comparison index
    if (bubbleSortCurrentComparisonIndex >= bubbleSortArray.length - 1 - bubbleSortSortedCount) {
        if (bubbleSortCurrentPass > 0 && bubbleSortSwapsInPass === 0) { // Already checked above, but good failsafe
            // This state means the previous pass had no swaps, so list is sorted.
            bubbleSortStatus.textContent = `List sorted! No swaps in Pass ${bubbleSortCurrentPass}. Final list: [${bubbleSortArray.join(', ')}]`;
            renderBubbleSortArray([], []);
            bubbleSortStepBtn.disabled = true;
            const simQuizItem = document.getElementById('bubblesort-simulation-section').querySelector('.quiz-item') || document.getElementById('bubblesort-simulation-section');
            if(simQuizItem) { simQuizItem.dataset.answeredCorrectly = "true"; simQuizItem.dataset.answered = "true"; }
            if(scoreCalculated) calculateScore();
            return;
        }
        bubbleSortSortedCount++; // One more item is in its final place
        bubbleSortCurrentPass++;
        bubbleSortCurrentComparisonIndex = 0;
        bubbleSortSwapsInPass = 0;
        if (bubbleSortArray.length - bubbleSortSortedCount <=1) { // List is sorted if only 0 or 1 unsorted items left
             bubbleSortStatus.textContent = `Sorting complete! Final list: [${bubbleSortArray.join(', ')}]`;
             renderBubbleSortArray([], []);
             bubbleSortStepBtn.disabled = true;
             const simQuizItem = document.getElementById('bubblesort-simulation-section').querySelector('.quiz-item') || document.getElementById('bubblesort-simulation-section');
             if(simQuizItem) { simQuizItem.dataset.answeredCorrectly = "true"; simQuizItem.dataset.answered = "true"; }
             if(scoreCalculated) calculateScore();
             return;
        }
        bubbleSortStatus.textContent = `Starting Pass ${bubbleSortCurrentPass + 1}. Comparing items up to index ${bubbleSortArray.length - 1 - bubbleSortSortedCount -1}.`;
        renderBubbleSortArray();
        return; // Return to allow user to click for first comparison of new pass
    }

    // Perform comparison
    const i = bubbleSortCurrentComparisonIndex;
    renderBubbleSortArray([i, i + 1]); // Highlight comparing pair
    bubbleSortStatus.textContent = `Pass ${bubbleSortCurrentPass + 1}, Comparison ${i + 1}: Comparing ${bubbleSortArray[i]} and ${bubbleSortArray[i + 1]}.`;

    if (bubbleSortArray[i] > bubbleSortArray[i + 1]) {
        bubbleSortStatus.textContent += ` Swapping ${bubbleSortArray[i]} and ${bubbleSortArray[i+1]}.`;
        // Visual cue for swap
        setTimeout(() => {
            renderBubbleSortArray([], [i, i + 1]); // Highlight swapping pair
            setTimeout(() => {
                // Perform swap
                [bubbleSortArray[i], bubbleSortArray[i + 1]] = [bubbleSortArray[i + 1], bubbleSortArray[i]];
                bubbleSortSwapsInPass++;
                renderBubbleSortArray(); // Show array after swap
                bubbleSortCurrentComparisonIndex++;
                 bubbleSortStatus.textContent += ` Next: Compare items at index ${bubbleSortCurrentComparisonIndex} and ${bubbleSortCurrentComparisonIndex+1} or end pass.`;
            }, 600); // Duration of swap highlight
        }, 600); // Delay before showing swap highlight
    } else {
        bubbleSortStatus.textContent += ` No swap needed.`;
        bubbleSortCurrentComparisonIndex++;
         setTimeout(() => { // Add a small delay even if no swap for better step-through
            renderBubbleSortArray(); // Re-render to remove comparison highlight
            bubbleSortStatus.textContent += ` Next: Compare items at index ${bubbleSortCurrentComparisonIndex} and ${bubbleSortCurrentComparisonIndex+1} or end pass.`;
        }, 600);
    }
}


function resetBubbleSortVisual() {
    document.getElementById('bubble-sort-input').value = "5, 1, 4, 2, 8";
    if(bubbleSortVisualizationArea) bubbleSortVisualizationArea.innerHTML = '';
    if(bubbleSortStatus) bubbleSortStatus.textContent = "Load a list to begin.";
    if(bubbleSortStepBtn) bubbleSortStepBtn.disabled = true;
    bubbleSortArray = [];
    bubbleSortCurrentPass = 0;
    bubbleSortCurrentComparisonIndex = 0;
    bubbleSortSwapsInPass = 0;
    bubbleSortSortedCount = 0;
    clearTimeout(bubbleSortInterval);

    const traceAnswer = document.getElementById('bubblesort-trace-answer');
    const traceFeedback = traceAnswer.closest('.quiz-item').querySelector('.feedback');
    traceAnswer.value = '';
    traceFeedback.innerHTML = '';
    traceAnswer.closest('.quiz-item').dataset.answeredCorrectly = "false";
    delete traceAnswer.closest('.quiz-item').dataset.answered;
}

if(bubbleSortStepBtn) bubbleSortStepBtn.addEventListener('click', nextBubbleSortStep);


// --- Exam Practice Question Logic ---
function toggleMarkScheme(markSchemeId, textareaId, minLength = 10) {
    const markSchemeDiv = document.getElementById(markSchemeId);
    const textarea = document.getElementById(textareaId); 
    const buttonElement = event.target; 

    if (!markSchemeDiv) return;
    toggleReveal(markSchemeId, buttonElement, 'Show Mark Scheme', 'Hide Mark Scheme');
}

// --- Final Score Calculation ---
function calculateScore() {
    currentScore = 0;
    totalPossibleScore = 0; 
    scoreCalculated = true;

    document.querySelectorAll('.quiz-item').forEach(item => {
        if (item.closest('#starter-activity') || item.closest('#exam-practice-bubblesort') || item.closest('#bubblesort-simulation-section .quiz-item:not(#task-bubblesort-trace)')) return; 

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
    
    resetBubbleSortVisual(); // Resets the simulation and the trace question
    
    // Reset Exam Practice
    ['exam-q1-bubblesort', 'exam-q2-bubblesort'].forEach(id => { 
        const el = document.getElementById(id); if(el) el.value = '';
    });
    ['ms-exam-q1-bubblesort', 'ms-exam-q2-bubblesort'].forEach(id => {
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
        filename:     'gcse-bubblesort-lesson.pdf',
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
    resetBubbleSortVisual(); // Initialize sim display
    
    // Calculate initial total possible score
    totalPossibleScore = 0;
    document.querySelectorAll('.quiz-item').forEach(item => {
        if (item.closest('#starter-activity') || item.closest('#exam-practice-bubblesort')) return;
         if (item.id === 'task-bubblesort-trace') { 
            totalPossibleScore += parseInt(item.dataset.points || 0);
        }
        // Add other specific quiz items here if they are not standard button quizzes
    });
    document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

    document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
    document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
    document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
});