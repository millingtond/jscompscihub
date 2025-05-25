// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "linear search": "A searching algorithm which looks at every element in turn until it finds the target, it is slow but works even on unsorted data.",
            "binary search": "A searching algorithm that divides the search space in half each time until it finds the target. Requires the array to be sorted.",
            "search space": "The set of data or range of values within which a search algorithm looks for a target item.",
            "sorted list": "A list or array where elements are arranged in a specific order (e.g., ascending or descending). Essential for binary search.",
            "sorted array": "A list or array where elements are arranged in a specific order (e.g., ascending or descending). Essential for binary search.",
            "pointer": "A variable or index that indicates a specific position or element within a data structure (like a list or array) during a search.",
            "comparison": "The act of checking if a data item matches the target value or determining its relative order (greater than, less than).",
            "efficiency": "A measure of how well an algorithm performs in terms of time (speed) and space (memory usage). Binary search is generally more efficient than linear search for large, sorted lists.",
            "algorithm": "A finite sequence of well-defined, computer-implementable instructions, typically to solve a class of specific problems or to perform a computation.",
            "computational thinking": "A problem solving process using abstraction, decomposition and algorithmic thinking. Results in an algorithm we can code for a computer.",
            "abstraction": "Removing/hiding unnecessary detail and focusing on the important details that are necessary to solve a problem. Simplifies the problem and reduces complexity making it easier to solve/understand.",
            "decomposition": "Breaking a problem down into smaller steps in order to solve it. A CT skill.",
            "algorithmic thinking": "Defining the steps needed to solve a problem using sequence, selection and iteration. A CT skill."
        };

        // --- Global Variables for Scoring ---
        let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;

        // --- Helper: Add Keyword Tooltips ---
        function addTooltips() {
            document.querySelectorAll('.keyword').forEach(span => {
                const keywordText = span.textContent.trim().toLowerCase().replace(/[().,]/g, '');
                if (!span.querySelector('.tooltip')) { // Add tooltip only if one doesn't exist
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
        
        // --- Helper: Check Task Completion (visual only) ---
        function checkTaskCompletion(sectionId) {
            // This function can be expanded if individual task completion indicators are added.
            // For now, it's a placeholder.
        }

        // --- Starter Activity Logic ---
        // Simple reveal for answers.

        // --- Linear Search Simulation (Task 1) ---
        const linearSearchArray = [17, 3, 42, 8, 25, 11, 30, 19];
        const linearSearchContainer = document.getElementById('linear-search-array-container');
        const linearSearchFeedback = document.getElementById('linear-search-feedback');
        let linearSearchTimeout;

        function displayLinearArray(highlightIndex = -1, foundIndex = -1) {
            if (!linearSearchContainer) return;
            linearSearchContainer.innerHTML = '';
            linearSearchArray.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'search-array-item';
                div.textContent = item;
                if (index === highlightIndex) div.classList.add('highlight-compare');
                if (index === foundIndex) div.classList.add('highlight-found');
                linearSearchContainer.appendChild(div);
            });
        }

        function startLinearSearch() {
            if (!linearSearchFeedback || !linearSearchContainer) return;
            clearTimeout(linearSearchTimeout);
            const target = parseInt(document.getElementById('linear-target').value);
            if (isNaN(target)) {
                linearSearchFeedback.textContent = "Please enter a valid number to search.";
                return;
            }
            linearSearchFeedback.textContent = `Searching for ${target}...`;
            let comparisons = 0;
            let currentIndex = 0;
            displayLinearArray(); // Reset display

            function step() {
                if (currentIndex >= linearSearchArray.length) {
                    linearSearchFeedback.textContent = `${target} not found after ${comparisons} comparisons.`;
                    displayLinearArray(-1, -1);
                    return;
                }
                displayLinearArray(currentIndex);
                comparisons++;
                if (linearSearchArray[currentIndex] === target) {
                    linearSearchFeedback.textContent = `${target} found at index ${currentIndex} after ${comparisons} comparisons!`;
                    displayLinearArray(currentIndex, currentIndex);
                } else {
                    currentIndex++;
                    linearSearchTimeout = setTimeout(step, 700);
                }
            }
            step();
        }
        function resetLinearSearch() {
            if (!linearSearchFeedback || !linearSearchContainer) return;
            clearTimeout(linearSearchTimeout);
            document.getElementById('linear-target').value = '';
            displayLinearArray();
            linearSearchFeedback.textContent = "Enter a number and click Search.";
            document.getElementById('linear-q1-comparisons').value = '';
            document.getElementById('linear-q1-comparisons').classList.remove('correct', 'incorrect');
            document.getElementById('linear-q1-comparisons').nextElementSibling.textContent = '';
            document.getElementById('linear-q2-max-comparisons').value = '';
            document.getElementById('linear-q2-max-comparisons').classList.remove('correct', 'incorrect');
            document.getElementById('linear-q2-max-comparisons').nextElementSibling.textContent = '';
            const quizItem = document.querySelector('#task-linear-search-sim');
            if(quizItem) { quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered; }
        }

        function checkLinearSearchQuestions() {
            const quizItem = document.querySelector('#task-linear-search-sim');
            let correctCount = 0;
            const q1Input = document.getElementById('linear-q1-comparisons');
            const q1Answer = parseInt(q1Input.value);
            const q1Feedback = q1Input.nextElementSibling;
            if (q1Answer === 7) { // 30 is the 7th item (index 6), so 7 comparisons
                q1Input.classList.add('correct'); q1Input.classList.remove('incorrect');
                q1Feedback.textContent = 'Correct!'; q1Feedback.className = 'feedback correct';
                correctCount++;
            } else {
                q1Input.classList.add('incorrect'); q1Input.classList.remove('correct');
                q1Feedback.textContent = 'Incorrect (Hint: 30 is at index 6).'; q1Feedback.className = 'feedback incorrect';
            }

            const q2Input = document.getElementById('linear-q2-max-comparisons');
            const q2Answer = parseInt(q2Input.value);
            const q2Feedback = q2Input.nextElementSibling;
            if (q2Answer === linearSearchArray.length) {
                q2Input.classList.add('correct'); q2Input.classList.remove('incorrect');
                q2Feedback.textContent = 'Correct!'; q2Feedback.className = 'feedback correct';
                correctCount++;
            } else {
                q2Input.classList.add('incorrect'); q2Input.classList.remove('correct');
                q2Feedback.textContent = `Incorrect (Max is ${linearSearchArray.length}).`; q2Feedback.className = 'feedback incorrect';
            }
            quizItem.dataset.answeredCorrectly = (correctCount === 2).toString();
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }


        // --- Binary Search Simulation (Task 2) ---
        const binarySearchArray = [3, 8, 11, 17, 19, 23, 25, 30, 38, 42, 45, 50];
        const binarySearchContainer = document.getElementById('binary-search-array-container');
        const binarySearchFeedback = document.getElementById('binary-search-feedback');
        const binaryStepBtn = document.getElementById('binary-step-btn');
        let bsLow, bsHigh, bsMid, bsTarget, bsComparisons, bsFound, bsCurrentStep;

        function displayBinaryArray() {
            if (!binarySearchContainer) return;
            binarySearchContainer.innerHTML = '';
            binarySearchArray.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'search-array-item';
                div.textContent = item;
                if (bsFound && index === bsMid && binarySearchArray[bsMid] === bsTarget) {
                    div.classList.add('highlight-found');
                } else if (index < bsLow || index > bsHigh) {
                    div.classList.add('discarded');
                } else if (index === bsMid && !bsFound) {
                     div.classList.add('highlight-compare');
                }
                
                let pointerHTML = "";
                if (index === bsLow) pointerHTML += '<span class="pointer-text">Low</span>';
                if (index === bsHigh) pointerHTML += `<span class="pointer-text" style="bottom: ${index === bsLow ? '-35px' : '-20px'};">High</span>`; // Adjust if low and high overlap
                if (index === bsMid && !bsFound) pointerHTML += `<span class="pointer-text" style="bottom: ${(index === bsLow || index === bsHigh) ? '-50px' : '-20px'}; color: #4f46e5;">Mid</span>`;
                div.innerHTML += pointerHTML;

                binarySearchContainer.appendChild(div);
            });
        }

        function startBinarySearch() {
            if (!binarySearchFeedback || !binarySearchContainer || !binaryStepBtn) return;
            bsTarget = parseInt(document.getElementById('binary-target').value);
            if (isNaN(bsTarget)) {
                binarySearchFeedback.textContent = "Please enter a valid number to search.";
                return;
            }
            bsLow = 0;
            bsHigh = binarySearchArray.length - 1;
            bsComparisons = 0;
            bsFound = false;
            bsCurrentStep = 0;
            binaryStepBtn.disabled = false;
            binarySearchFeedback.textContent = `Searching for ${bsTarget}. Click 'Next Step'.`;
            bsMid = -1; // Ensure mid is not pointing initially
            displayBinaryArray();
        }

        function stepBinarySearch() {
            if (bsFound || bsLow > bsHigh) {
                binaryStepBtn.disabled = true;
                return;
            }
            bsCurrentStep++;
            bsMid = Math.floor((bsLow + bsHigh) / 2);
            bsComparisons++;
            displayBinaryArray(); // Show current mid being compared

            const midVal = binarySearchArray[bsMid];
            let feedbackMsg = `Step ${bsCurrentStep}: Low=${bsLow}, High=${bsHigh}, Mid=${bsMid} (value: ${midVal}). Comparing ${midVal} with ${bsTarget}. `;

            if (midVal === bsTarget) {
                bsFound = true;
                feedbackMsg += `${bsTarget} found at index ${bsMid} after ${bsComparisons} comparisons!`;
                binaryStepBtn.disabled = true;
            } else if (midVal < bsTarget) {
                feedbackMsg += `${midVal} < ${bsTarget}. Discarding lower half. New Low = ${bsMid + 1}.`;
                bsLow = bsMid + 1;
            } else { // midVal > bsTarget
                feedbackMsg += `${midVal} > ${bsTarget}. Discarding upper half. New High = ${bsMid - 1}.`;
                bsHigh = bsMid - 1;
            }
            
            binarySearchFeedback.textContent = feedbackMsg;

            // Second display update to show discarded section for next step
            setTimeout(() => {
                if (!bsFound && bsLow <= bsHigh) {
                    displayBinaryArray(); // Update to show new low/high and discarded parts
                    binarySearchFeedback.textContent += " Ready for next step.";
                } else if (!bsFound && bsLow > bsHigh) {
                    binarySearchFeedback.textContent = `${bsTarget} not found after ${bsComparisons} comparisons. Search space exhausted.`;
                    displayBinaryArray(); // Show final discarded state
                    binaryStepBtn.disabled = true;
                } else if (bsFound) {
                    displayBinaryArray(); // Final display for found item
                }
            }, 700); // Delay to allow user to see the comparison before discard
        }
        
        function resetBinarySearch() {
            if (!binarySearchFeedback || !binarySearchContainer || !binaryStepBtn) return;
            document.getElementById('binary-target').value = '';
            binarySearchContainer.innerHTML = '';
            binarySearchFeedback.textContent = "Enter a number and click Start Search.";
            binaryStepBtn.disabled = true;
            bsLow = 0; bsHigh = 0; bsMid = -1; bsFound = false; bsComparisons = 0; bsCurrentStep = 0;
            document.getElementById('binary-q1-prerequisite').value = '';
            document.getElementById('binary-q1-prerequisite').classList.remove('correct', 'incorrect');
            document.getElementById('binary-q1-prerequisite').nextElementSibling.textContent = '';
            document.getElementById('binary-q2-discard').value = '';
            document.getElementById('binary-q2-discard').classList.remove('correct', 'incorrect');
            document.getElementById('binary-q2-discard').nextElementSibling.textContent = '';
            const quizItem = document.querySelector('#task-binary-search-sim');
            if(quizItem) { quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered; }
        }
        if(binaryStepBtn) binaryStepBtn.addEventListener('click', stepBinarySearch);
        if(document.getElementById('binary-search-list-display')) document.getElementById('binary-search-list-display').textContent = `[${binarySearchArray.join(', ')}]`;

        function checkBinarySearchQuestions() {
            const quizItem = document.querySelector('#task-binary-search-sim');
            let correctCount = 0;
            const q1Input = document.getElementById('binary-q1-prerequisite');
            const q1Answer = q1Input.value.toLowerCase().trim();
            const q1Feedback = q1Input.nextElementSibling;
            if (q1Answer.includes("sort") || q1Answer.includes("order")) {
                q1Input.classList.add('correct'); q1Input.classList.remove('incorrect');
                q1Feedback.textContent = 'Correct!'; q1Feedback.className = 'feedback correct';
                correctCount++;
            } else {
                q1Input.classList.add('incorrect'); q1Input.classList.remove('correct');
                q1Feedback.textContent = 'Incorrect (Hint: The list must be...).'; q1Feedback.className = 'feedback incorrect';
            }

            const q2Select = document.getElementById('binary-q2-discard');
            const q2Answer = q2Select.value;
            const q2Feedback = q2Select.nextElementSibling;
            // Mid of [3, 8, 11, 17, 19, 23, 25, 30, 38, 42, 45, 50] is index 5 (value 23). Target is 23.
            // If target was 24, mid=23, 23 < 24, so discard lower.
            // If target was 23, it's found.
            // For the question, let's assume the general case if it wasn't found at mid.
            // If target is 23, mid is 23. Found.
            // If target is 24, mid is 23. 23 < 24 -> low = mid + 1. Discard lower.
            // The question asks about searching for 23. The list is [3, 8, 11, 17, 19, 23, 25, 30, 38, 42, 45, 50]. Length 12.
            // low=0, high=11. mid = floor((0+11)/2) = floor(5.5) = 5. Array[5] = 23.
            // So, it's found on the first try.
            if (q2Answer === "none") {
                q2Select.classList.add('correct'); q2Select.classList.remove('incorrect');
                q2Feedback.textContent = 'Correct! (23 is the middle element in the first check).'; q2Feedback.className = 'feedback correct';
                correctCount++;
            } else {
                q2Select.classList.add('incorrect'); q2Select.classList.remove('correct');
                q2Feedback.textContent = 'Incorrect (Hint: Where is 23 relative to the first middle element?).'; q2Feedback.className = 'feedback incorrect';
            }
            quizItem.dataset.answeredCorrectly = (correctCount === 2).toString();
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }


        // --- Comparison Quiz (Task 3) ---
        function checkComparisonQuiz() {
            const quizItem = document.querySelector('#comparison-section .quiz-item');
            let correctCount = 0;
            const questions = quizItem.querySelectorAll('.quiz-question');
            
            const q1Selected = questions[0].querySelector('.option-button.selected');
            const q1Feedback = questions[0].querySelector('.feedback');
            if (q1Selected && q1Selected.dataset.answer === "linear") { // Small unsorted list
                q1Selected.classList.add('correct'); q1Selected.classList.remove('incorrect');
                q1Feedback.textContent = 'Correct!'; q1Feedback.className = 'feedback correct';
                correctCount++;
            } else if (q1Selected) {
                q1Selected.classList.add('incorrect'); q1Selected.classList.remove('correct');
                q1Feedback.textContent = 'Incorrect.'; q1Feedback.className = 'feedback incorrect';
            } else { q1Feedback.textContent = 'Please select an answer.'; q1Feedback.className = 'feedback incorrect'; }

            const q2Selected = questions[1].querySelector('.option-button.selected');
            const q2Feedback = questions[1].querySelector('.feedback');
            if (q2Selected && q2Selected.dataset.answer === "binary") { // Large sorted dictionary
                q2Selected.classList.add('correct'); q2Selected.classList.remove('incorrect');
                q2Feedback.textContent = 'Correct!'; q2Feedback.className = 'feedback correct';
                correctCount++;
            } else if (q2Selected) {
                q2Selected.classList.add('incorrect'); q2Selected.classList.remove('correct');
                q2Feedback.textContent = 'Incorrect.'; q2Feedback.className = 'feedback incorrect';
            } else { q2Feedback.textContent = 'Please select an answer.'; q2Feedback.className = 'feedback incorrect'; }

            quizItem.dataset.answeredCorrectly = (correctCount === 2).toString();
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }


        // --- Exam Practice Question Logic ---
        function toggleMarkScheme(markSchemeId, textareaId, minLength = 10) {
            const markSchemeDiv = document.getElementById(markSchemeId);
            const textarea = document.getElementById(textareaId); // Not strictly needed for just toggling MS
            const buttonElement = event.target; 

            if (!markSchemeDiv) return;

            // If trying to show, check if textarea has enough content (optional)
            // if (!markSchemeDiv.classList.contains('show') && textarea && textarea.value.trim().length < minLength) {
            //     alert(`Please attempt a more detailed answer (at least ${minLength} characters) before viewing the mark scheme.`);
            //     return;
            // }
            toggleReveal(markSchemeId, buttonElement, 'Show Mark Scheme', 'Hide Mark Scheme');
        }

        // --- Final Score Calculation ---
        function calculateScore() {
            currentScore = 0;
            totalPossibleScore = 0; // Recalculate total each time
            scoreCalculated = true;

            document.querySelectorAll('.quiz-item').forEach(item => {
                // Exclude non-scored tasks or sections
                if (item.closest('#starter-activity') || item.closest('#exam-practice-search')) return;

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
            
            resetLinearSearch();
            resetBinarySearch();
            
            // Reset Comparison Quiz (Task 3)
            const comparisonQuiz = document.querySelector('#comparison-section .quiz-item');
            if(comparisonQuiz) {
                comparisonQuiz.querySelectorAll('.option-button').forEach(btn => {btn.classList.remove('selected', 'correct', 'incorrect'); btn.disabled = false;});
                comparisonQuiz.querySelectorAll('.feedback').forEach(fb => fb.textContent = '');
                comparisonQuiz.dataset.answeredCorrectly = "false"; delete comparisonQuiz.dataset.answered;
            }

            // Reset Exam Practice
            ['exam-q1-search', 'exam-q2-search', 'exam-q3-search'].forEach(id => { 
                const el = document.getElementById(id); if(el) el.value = '';
            });
            ['ms-exam-q1-search', 'ms-exam-q2-search', 'ms-exam-q3-search'].forEach(id => {
                const msDiv = document.getElementById(id);
                const msButton = document.querySelector(`button[onclick*="'${id}'"]`);
                if (msDiv && msDiv.classList.contains('show') && msButton) {
                     toggleReveal(id, msButton, 'Show Mark Scheme', 'Hide Mark Scheme');
                } else if (msDiv && msDiv.classList.contains('show')) { // Failsafe if button not found
                    msDiv.classList.remove('show');
                }
            });
            
            // Reset Read Checkboxes
            document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);
            // Reset Final Score
            currentScore = 0; scoreCalculated = false;
            document.getElementById('final-score-area').style.display = 'none';
            document.getElementById('final-score-display').textContent = 'Your score: 0 / 0'; // Reset display too
            document.getElementById('final-score-feedback').textContent = '';

            alert("All tasks have been reset.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- PDF Export ---
        function exportToPDF() {
            alert("Preparing PDF. This might take a moment. Please ensure pop-ups are allowed. Interactive elements might not be fully captured in their current state.");
            const element = document.querySelector('.max-w-4xl.mx-auto.bg-white'); 
            const opt = {
                margin:       [0.5, 0.5, 0.7, 0.5], // top, left, bottom, right (inches)
                filename:     'gcse-searching-algorithms-lesson.pdf',
                image:        { type: 'jpeg', quality: 0.95 },
                html2canvas:  { scale: 2, logging: false, useCORS: true, scrollY: -window.scrollY },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };
            
            // Temporarily show all revealable content for PDF
            const revealableElements = document.querySelectorAll('.feedback-area, .quiz-feedback, .mark-scheme, .reveal-content');
            const initiallyHidden = [];
            revealableElements.forEach(el => {
                if (!el.classList.contains('show')) { initiallyHidden.push(el); el.classList.add('show'); }
            });
            const finalScoreArea = document.getElementById('final-score-area');
            const finalScoreWasHidden = finalScoreArea.style.display === 'none';
            if (finalScoreWasHidden) finalScoreArea.style.display = 'block'; // Show score if calculated

            const exportButton = document.getElementById('export-pdf-button');
            const resetButton = document.getElementById('reset-all-tasks');
            const calcScoreButton = document.getElementById('calculate-final-score');
            if(exportButton) exportButton.disabled = true;
            if(resetButton) resetButton.disabled = true;
            if(calcScoreButton) calcScoreButton.disabled = true;

            html2pdf().from(element).set(opt).save().then(function() {
                // Restore original state
                initiallyHidden.forEach(el => el.classList.remove('show'));
                if (finalScoreWasHidden) finalScoreArea.style.display = 'none';
                
                if(exportButton) exportButton.disabled = false;
                if(resetButton) resetButton.disabled = false;
                if(calcScoreButton) calcScoreButton.disabled = false;
            }).catch(function(error){
                console.error("Error generating PDF:", error);
                 // Restore original state on error too
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
            displayLinearArray(); // Initial display for linear search
            resetBinarySearch();  // Initial setup for binary search sim
            
            // Setup for simple quiz option buttons (Task 3 Comparison Quiz)
            document.querySelectorAll('#task-comparison-quiz .quiz-question .option-button').forEach(button => {
                button.addEventListener('click', () => {
                    const quizQuestionDiv = button.closest('.quiz-question');
                    if (quizQuestionDiv.dataset.answered === 'true') return;

                    quizQuestionDiv.querySelectorAll('.option-button').forEach(opt => {opt.classList.remove('selected'); opt.disabled = true;});
                    button.classList.add('selected');
                    // Feedback logic for comparison quiz will be handled by checkComparisonQuiz
                });
            });
            
            // Calculate initial total possible score
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#exam-practice-search')) return;
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;


            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
        });