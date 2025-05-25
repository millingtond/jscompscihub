// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "insertion sort": "A simple sorting algorithm that builds the final sorted list one item at a time. It iterates through an input list and for each element, inserts it into its correct position in an already sorted part of the list.",
            "sorted sub-list": "In insertion sort, this is the portion of the list (usually at the beginning) that is already in correct order. Each new element from the unsorted part is inserted into this sub-list.",
            "key (insertion sort)": "In insertion sort, the 'key' is the current element from the unsorted part of the list that is being compared and inserted into the sorted sub-list.",
            "nearly sorted": "If a list has only a few elements out of place, insertion sort can sort it very quickly, approaching O(n) time complexity.",
            "in-place sort": "A sorting algorithm that sorts the elements within the original array or list, using only a constant amount of extra storage space (or a very small, logarithmic amount).",
            "stable sort": "A sorting algorithm where two objects with equal keys appear in the same order in the sorted output as they appear in the input array to be sorted. Insertion sort is stable.",
            "online algorithms": "Algorithms that process input piece-by-piece in a serial fashion, without having the entire input available from the start. Insertion sort can easily sort data as it arrives.",
            "time complexity (insertion sort)": "Worst-case and average-case O(n²), best-case O(n) if the list is already sorted.",
            "algorithm": "A finite sequence of well-defined, computer-implementable instructions, typically to solve a class of specific problems or to perform a computation."
        };

        // --- Global Variables for Scoring ---
        let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;

        // --- Insertion Sort Simulation Variables ---
        let insertionSortArray = [];
        let insertionSortCurrentIndex = 1; // Starts from the second element
        let insertionSortKey = null;
        let insertionSortComparisonPos = -1; // Position in sorted sub-array being compared
        let insertionSortState = 'picking_key'; // 'picking_key', 'comparing_shifting', 'inserting', 'done'
        let insertionSortInterval;
        const insertionSortVisualizationArea = document.getElementById('insertion-sort-visualization-area');
        const insertionSortStatus = document.getElementById('insertion-sort-status');
        const insertionSortStepBtn = document.getElementById('insertion-sort-step-btn');

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
        
        // --- Task 1: Insertion Sort Trace ---
        function checkInsertionSortTrace() {
            const quizItem = document.getElementById('task-insertionsort-trace');
            const answerTextarea = document.getElementById('insertionsort-trace-answer');
            const feedbackEl = quizItem.querySelector('.feedback');
            const answer = answerTextarea.value.toLowerCase().trim();
            let points = 0;
            const minLength = 60; // Expect a decent trace for [5, 2, 4, 1]

            if (answer.length < minLength) {
                feedbackEl.innerHTML = `<span class="incorrect-feedback">Please provide a more detailed trace (at least ${minLength} characters), showing the list state after each key insertion.</span>`;
            } else {
                let traceCorrectness = 0;
                // Check for key states in the trace of [5, 2, 4, 1]
                if (answer.includes("pick 2") && (answer.includes("[2, 5, 4, 1]") || answer.includes("2 5 4 1"))) traceCorrectness++;
                if (answer.includes("pick 4") && (answer.includes("[2, 4, 5, 1]") || answer.includes("2 4 5 1"))) traceCorrectness++;
                if (answer.includes("pick 1") && (answer.includes("[1, 2, 4, 5]") || answer.includes("1 2 4 5"))) traceCorrectness++;
                if (answer.includes("compare") && answer.includes("shift")) traceCorrectness++; // General check for process words

                points = Math.min(4, traceCorrectness);

                if (points >= 3) {
                    feedbackEl.innerHTML = `<span class="correct-feedback">Good trace! You've shown the key steps of insertion. (+${points} points)</span>`;
                    quizItem.dataset.answeredCorrectly = "true";
                } else {
                    feedbackEl.innerHTML = `<span class="incorrect-feedback">Your trace could be more complete or accurate. Ensure you show the list after each element is inserted into the sorted portion. (+${points} points)</span>`;
                    quizItem.dataset.answeredCorrectly = "false";
                }
            }
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }

        // --- Insertion Sort Simulation Logic ---
        function setupInsertionSortVisual() {
            const inputStr = document.getElementById('insertion-sort-input').value;
            insertionSortArray = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

            if (insertionSortArray.length === 0) {
                insertionSortStatus.textContent = "Please enter a valid list of numbers.";
                return;
            }
            if (insertionSortArray.length > 10) {
                insertionSortStatus.textContent = "List too long for optimal visualization (max 10 numbers recommended).";
            }

            insertionSortCurrentIndex = 1; // Start with the second element as the first key
            insertionSortKey = null;
            insertionSortComparisonPos = -1;
            insertionSortState = 'picking_key';
            
            insertionSortStepBtn.disabled = false;
            insertionSortStatus.textContent = "List loaded. Click 'Next Step' to begin sorting.";
            renderInsertionSortArray();
        }

        function renderInsertionSortArray() {
            if (!insertionSortVisualizationArea) return;
            insertionSortVisualizationArea.innerHTML = '';
            insertionSortArray.forEach((val, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'sort-array-item';
                itemDiv.textContent = val;

                // Highlight sorted partition (elements before current_index)
                if (index < insertionSortCurrentIndex && insertionSortState !== 'done') {
                    itemDiv.classList.add('sorted-partition');
                }
                // Highlight the key element being processed
                if (insertionSortState !== 'picking_key' && insertionSortState !== 'done' && val === insertionSortKey && index === insertionSortComparisonPos + 1) { // Approximate position of key before insertion
                     itemDiv.classList.add('current-key');
                } else if (insertionSortState === 'picking_key' && index === insertionSortCurrentIndex) {
                    itemDiv.classList.add('current-key'); // Highlight next key to be picked
                }


                // Highlight element in sorted partition being compared with key
                if (insertionSortState === 'comparing_shifting' && index === insertionSortComparisonPos) {
                    itemDiv.classList.add('comparing-sorted');
                }
                // Highlight element that was just inserted
                if (insertionSortState === 'inserting' && index === insertionSortComparisonPos + 1 && val === insertionSortKey) {
                     itemDiv.classList.add('inserting');
                }
                // Highlight fully sorted array
                if (insertionSortState === 'done') {
                    itemDiv.classList.add('final-sorted');
                }

                insertionSortVisualizationArea.appendChild(itemDiv);
            });
        }
        
        function nextInsertionSortStep() {
            if (!insertionSortArray.length || insertionSortState === 'done') return;

            if (insertionSortState === 'picking_key') {
                if (insertionSortCurrentIndex >= insertionSortArray.length) {
                    insertionSortState = 'done';
                    insertionSortStatus.textContent = `Sorting complete! Final list: [${insertionSortArray.join(', ')}]`;
                    renderInsertionSortArray();
                    insertionSortStepBtn.disabled = true;
                    const simQuizItem = document.getElementById('insertionsort-simulation-section').querySelector('.quiz-item') || document.getElementById('insertionsort-simulation-section');
                    if(simQuizItem) { simQuizItem.dataset.answeredCorrectly = "true"; simQuizItem.dataset.answered = "true"; }
                    if(scoreCalculated) calculateScore();
                    return;
                }
                insertionSortKey = insertionSortArray[insertionSortCurrentIndex];
                insertionSortComparisonPos = insertionSortCurrentIndex - 1;
                insertionSortStatus.textContent = `Pass ${insertionSortCurrentIndex}: Picking key = ${insertionSortKey}. Comparing with sorted part.`;
                insertionSortState = 'comparing_shifting';
                renderInsertionSortArray();
            } else if (insertionSortState === 'comparing_shifting') {
                if (insertionSortComparisonPos >= 0 && insertionSortArray[insertionSortComparisonPos] > insertionSortKey) {
                    insertionSortStatus.textContent = `Comparing key ${insertionSortKey} with ${insertionSortArray[insertionSortComparisonPos]}. Since ${insertionSortArray[insertionSortComparisonPos]} > ${insertionSortKey}, shift ${insertionSortArray[insertionSortComparisonPos]} right.`;
                    insertionSortArray[insertionSortComparisonPos + 1] = insertionSortArray[insertionSortComparisonPos];
                    renderInsertionSortArray(); // Show shift
                     // Add a class to highlight the shifted element briefly
                    const shiftedElementVisual = insertionSortVisualizationArea.children[insertionSortComparisonPos + 1];
                    if(shiftedElementVisual) {
                        shiftedElementVisual.classList.add('shifting');
                        setTimeout(() => shiftedElementVisual.classList.remove('shifting'), 300);
                    }
                    insertionSortComparisonPos--;
                    // Stay in 'comparing_shifting' state for next comparison or insertion
                } else {
                    // Found correct position or reached beginning of sorted part
                    insertionSortStatus.textContent = `Found position for key ${insertionSortKey}. Inserting...`;
                    insertionSortState = 'inserting';
                    // Call next step immediately to perform insertion visual
                    setTimeout(nextInsertionSortStep, 300); 
                }
                 renderInsertionSortArray();
            } else if (insertionSortState === 'inserting') {
                insertionSortArray[insertionSortComparisonPos + 1] = insertionSortKey;
                insertionSortStatus.textContent = `Inserted ${insertionSortKey}. Sorted part: [${insertionSortArray.slice(0, insertionSortCurrentIndex + 1).join(', ')}]`;
                renderInsertionSortArray(); // Show key inserted
                const insertedElementVisual = insertionSortVisualizationArea.children[insertionSortComparisonPos + 1];
                 if(insertedElementVisual) {
                    insertedElementVisual.classList.add('inserting'); // Add inserting class
                    setTimeout(() => insertedElementVisual.classList.remove('inserting'), 500); // Remove after animation
                }
                insertionSortCurrentIndex++;
                insertionSortState = 'picking_key'; // Move to pick next key
                if (insertionSortCurrentIndex >= insertionSortArray.length) { // Check if done after this insertion
                    setTimeout(() => { // Delay final "done" message
                        insertionSortState = 'done';
                        insertionSortStatus.textContent = `Sorting complete! Final list: [${insertionSortArray.join(', ')}]`;
                        renderInsertionSortArray();
                        insertionSortStepBtn.disabled = true;
                         const simQuizItem = document.getElementById('insertionsort-simulation-section').querySelector('.quiz-item') || document.getElementById('insertionsort-simulation-section');
                         if(simQuizItem) { simQuizItem.dataset.answeredCorrectly = "true"; simQuizItem.dataset.answered = "true"; }
                         if(scoreCalculated) calculateScore();
                    }, 500);
                }
            }
            // renderInsertionSortArray(); // Render after each logical step change
        }


        function resetInsertionSortVisual() {
            document.getElementById('insertion-sort-input').value = "6, 1, 7, 3, 9, 4";
            if(insertionSortVisualizationArea) insertionSortVisualizationArea.innerHTML = '';
            if(insertionSortStatus) insertionSortStatus.textContent = "Load a list to begin.";
            if(insertionSortStepBtn) insertionSortStepBtn.disabled = true;
            insertionSortArray = [];
            insertionSortCurrentIndex = 1;
            insertionSortKey = null;
            insertionSortComparisonPos = -1;
            insertionSortState = 'picking_key';
            clearTimeout(insertionSortInterval);

            const traceAnswer = document.getElementById('insertionsort-trace-answer');
            const traceFeedback = traceAnswer.closest('.quiz-item').querySelector('.feedback');
            traceAnswer.value = '';
            traceFeedback.innerHTML = '';
            traceAnswer.closest('.quiz-item').dataset.answeredCorrectly = "false";
            delete traceAnswer.closest('.quiz-item').dataset.answered;
        }

        if(insertionSortStepBtn) insertionSortStepBtn.addEventListener('click', nextInsertionSortStep);


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
                if (item.closest('#starter-activity') || item.closest('#exam-practice-insertionsort') || item.closest('#insertionsort-simulation-section .quiz-item:not(#task-insertionsort-trace)')) return; 

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
            
            resetInsertionSortVisual(); // Resets the simulation and the trace question
            
            // Reset Exam Practice
            ['exam-q1-insertionsort', 'exam-q2-insertionsort'].forEach(id => { 
                const el = document.getElementById(id); if(el) el.value = '';
            });
            ['ms-exam-q1-insertionsort', 'ms-exam-q2-insertionsort'].forEach(id => {
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
                filename:     'gcse-insertionsort-lesson.pdf',
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
            resetInsertionSortVisual(); // Initialize sim display
            
            // Calculate initial total possible score
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#exam-practice-insertionsort')) return;
                 if (item.id === 'task-insertionsort-trace') { 
                    totalPossibleScore += parseInt(item.dataset.points || 0);
                }
            });
            document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
        });