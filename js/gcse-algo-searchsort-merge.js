// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "merge sort": "A divide and conquer sorting algorithm that recursively divides a list into smaller sub-lists, sorts them, and then merges them back together.",
            "divide and conquer": "An algorithmic paradigm where a problem is recursively broken down into two or more sub-problems of the same or related type, until these become simple enough to be solved directly. The solutions to the sub-problems are then combined to give a solution to the original problem.",
            "recursion": "A process where a function calls itself directly or indirectly. Merge sort is often implemented recursively for the splitting phase.",
            "sub-list": "A smaller list created by dividing a larger list during the merge sort process.",
            "sub-lists": "Smaller lists created by dividing a larger list during the merge sort process.",
            "merge": "The process of combining two sorted sub-lists into a single sorted list.",
            "time complexity": "A measure of how the runtime of an algorithm scales with the input size. Merge Sort has an average and worst-case time complexity of O(n log n).",
            "space complexity": "A measure of the amount of memory an algorithm uses. Merge Sort typically requires O(n) auxiliary space.",
            "stable sort": "A sorting algorithm where two objects with equal keys appear in the same order in the sorted output as they appear in the input array to be sorted. Merge sort is stable.",
            "binary search": "A searching algorithm that divides the search space in half each time until it finds the target. Requires the array to be sorted.", // Added from previous context
            "decomposition": "Breaking a problem down into smaller steps in order to solve it. A CT skill.", // Added from previous context
            "algorithm": "A finite sequence of well-defined, computer-implementable instructions, typically to solve a class of specific problems or to perform a computation." // Added from previous context
        };

        // --- Global Variables for Scoring ---
        let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;

        // --- Merge Sort Simulation Variables ---
        let mergeSortOriginalArray = [];
        let mergeSortSteps = [];
        let currentMergeSortStepIndex = 0;
        const mergeSortVisualizationArea = document.getElementById('merge-sort-visualization-area');
        const mergeSortStatus = document.getElementById('merge-sort-status');
        const mergeSortStepBtn = document.getElementById('merge-sort-step-btn');

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
        
        // --- Task 1: Merge Sort Trace ---
        function checkMergeSortTrace() {
            const quizItem = document.getElementById('task-mergesort-trace');
            const answerTextarea = document.getElementById('mergesort-trace-answer');
            const feedbackEl = quizItem.querySelector('.feedback');
            const answer = answerTextarea.value.toLowerCase().trim();
            let points = 0;
            const minLength = 30; 

            if (answer.length < minLength) {
                feedbackEl.innerHTML = `<span class="incorrect-feedback">Please provide a more detailed trace (at least ${minLength} characters).</span>`;
            } else {
                let split1 = answer.includes("split") && (answer.includes("[6, 1]") || answer.includes("6,1")) && (answer.includes("[7, 3]") || answer.includes("7,3"));
                let split2 = (answer.includes("[6]") && answer.includes("[1]")) || (answer.includes("[7]") && answer.includes("[3]"));
                let merge1 = (answer.includes("merge") || answer.includes("combine")) && ((answer.includes("[1, 6]") || answer.includes("1,6")) || (answer.includes("[3, 7]") || answer.includes("3,7")));
                let merge2 = (answer.includes("merge") || answer.includes("combine")) && (answer.includes("[1, 3, 6, 7]") || answer.includes("1,3,6,7"));

                if(split1) points++;
                if(split2) points++; // Second split of either half
                if(merge1) points++; // First merge of either pair
                if(merge2 && points >=3) points++; // Final merge, only if previous steps somewhat correct

                points = Math.min(4, points); // Cap at 4

                if (points >= 3) {
                    feedbackEl.innerHTML = `<span class="correct-feedback">Good trace! You've captured the key splitting and merging steps. (+${points} points)</span>`;
                    quizItem.dataset.answeredCorrectly = "true";
                } else if (points > 0) {
                    feedbackEl.innerHTML = `<span class="incorrect-feedback">Partial trace. Ensure you show the recursive splits and the merging of sorted sub-lists. (+${points} points)</span>`;
                    quizItem.dataset.answeredCorrectly = "false";
                } else {
                     feedbackEl.innerHTML = `<span class="incorrect-feedback">Your trace needs more detail on splitting and merging. Refer to the example.</span>`;
                     quizItem.dataset.answeredCorrectly = "false";
                }
            }
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }


        // --- Merge Sort Simulation Logic ---
        function setupMergeSortVisual() {
            const inputStr = document.getElementById('merge-sort-input').value;
            mergeSortOriginalArray = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

            if (mergeSortOriginalArray.length === 0) {
                mergeSortStatus.textContent = "Please enter a valid list of numbers.";
                return;
            }
            if (mergeSortOriginalArray.length > 12) { // Limit size for better visualization
                mergeSortStatus.textContent = "List too long for visualization (max 12 numbers).";
                return;
            }

            mergeSortSteps = [];
            currentMergeSortStepIndex = 0;
            
            // Generate steps
            generateMergeSortSteps([...mergeSortOriginalArray]);

            mergeSortStepBtn.disabled = false;
            mergeSortStatus.textContent = "List loaded. Click 'Next Step' to begin sorting.";
            renderMergeSortStep();
        }

        function generateMergeSortSteps(arr) {
            // Initial state: display the full unsorted array
            addMergeSortStep({ type: 'initial', arrays: [[...arr]], message: "Initial unsorted list." });
            
            // Call the recursive sort function which will populate steps
            recursiveMergeSort(arr, 0);

            addMergeSortStep({ type: 'final', arrays: [arr], message: "List is sorted!" });
        }

        function recursiveMergeSort(arr, level) {
            const n = arr.length;
            if (n <= 1) {
                // Base case: array of 0 or 1 element is already sorted
                // The 'split' step will show this single-element array
                return arr;
            }

            const mid = Math.floor(n / 2);
            const leftHalf = arr.slice(0, mid);
            const rightHalf = arr.slice(mid);

            // Step: Show splitting
            addMergeSortStep({ 
                type: 'split', 
                parent: [...arr], 
                left: [...leftHalf], 
                right: [...rightHalf], 
                level: level,
                message: `Splitting [${arr.join(', ')}] into [${leftHalf.join(', ')}] and [${rightHalf.join(', ')}]`
            });

            const sortedLeft = recursiveMergeSort(leftHalf, level + 1);
            const sortedRight = recursiveMergeSort(rightHalf, level + 1);

            return mergeAndRecord(sortedLeft, sortedRight, level, [...arr]);
        }

        function mergeAndRecord(left, right, level, originalParent) {
            let mergedArray = [];
            let leftIndex = 0;
            let rightIndex = 0;

            // Step: Show sub-lists before merging
             addMergeSortStep({ 
                type: 'pre-merge', 
                left: [...left], 
                right: [...right], 
                level: level,
                originalParentForContext: [...originalParent], // Pass the parent this merge belongs to
                message: `Preparing to merge [${left.join(', ')}] and [${right.join(', ')}]`
            });

            while (leftIndex < left.length && rightIndex < right.length) {
                // Step: Show comparison
                addMergeSortStep({
                    type: 'compare',
                    left: [...left], right: [...right], merged: [...mergedArray],
                    compareLeftIdx: leftIndex, compareRightIdx: rightIndex,
                    level: level,
                    originalParentForContext: [...originalParent],
                    message: `Comparing ${left[leftIndex]} (from left) and ${right[rightIndex]} (from right)`
                });

                if (left[leftIndex] <= right[rightIndex]) {
                    mergedArray.push(left[leftIndex]);
                    leftIndex++;
                } else {
                    mergedArray.push(right[rightIndex]);
                    rightIndex++;
                }
                // Step: Show item moved to merged array
                addMergeSortStep({
                    type: 'merge-item',
                    left: [...left], right: [...right], merged: [...mergedArray],
                    leftHighlight: leftIndex, rightHighlight: rightIndex, // Next items to be considered
                    level: level,
                    originalParentForContext: [...originalParent],
                    message: `Moved ${mergedArray[mergedArray.length-1]} to merged list. Merged: [${mergedArray.join(', ')}]`
                });
            }

            // Append remaining elements
            while (leftIndex < left.length) {
                mergedArray.push(left[leftIndex]);
                leftIndex++;
                  addMergeSortStep({ type: 'merge-item', left: [...left], right: [...right], merged: [...mergedArray], leftHighlight: leftIndex, rightHighlight: rightIndex, level: level, originalParentForContext: [...originalParent], message: `Added remaining ${mergedArray[mergedArray.length-1]} from left. Merged: [${mergedArray.join(', ')}]`});
            }
            while (rightIndex < right.length) {
                mergedArray.push(right[rightIndex]);
                rightIndex++;
                addMergeSortStep({ type: 'merge-item', left: [...left], right: [...right], merged: [...mergedArray], leftHighlight: leftIndex, rightHighlight: rightIndex, level: level, originalParentForContext: [...originalParent], message: `Added remaining ${mergedArray[mergedArray.length-1]} from right. Merged: [${mergedArray.join(', ')}]`});
            }

            // Step: Show completed merge for this level
            addMergeSortStep({ 
                type: 'post-merge', 
                mergedResult: [...mergedArray], 
                originalLeft: [...left], 
                originalRight: [...right],
                level: level,
                originalParentForContext: [...originalParent],
                message: `Merged [${left.join(', ')}] and [${right.join(', ')}] into [${mergedArray.join(', ')}]`
            });
            
            // Update the original array segment (for recursive calls)
            for(let i=0; i < mergedArray.length; i++) {
                const parentIndex = originalParent.indexOf(left[0] !== undefined ? left[0] : (right[0] !== undefined ? right[0] : -1)); // Find where this sub-array starts in its parent
                // This is tricky. For the recursive sort, 'arr' needs to be modified or a new sorted array returned.
                // The current 'arr' in recursiveMergeSort is a slice.
            }
            // For the simulation, we primarily care about visualizing the steps.
            // The actual sorting happens as `mergedArray` is built and returned.
            // For the visualization, we need to replace the segment in the higher-level array display.
            // This is handled by `renderMergeSortStep` by replacing parent segments.

            return mergedArray;
        }


        function addMergeSortStep(stepData) {
            mergeSortSteps.push(stepData);
        }

        function renderMergeSortStep() {
            if (!mergeSortVisualizationArea || currentMergeSortStepIndex >= mergeSortSteps.length) return;

            const step = mergeSortSteps[currentMergeSortStepIndex];
            mergeSortVisualizationArea.innerHTML = ''; // Clear previous levels
            mergeSortStatus.textContent = step.message;

            // This is a simplified rendering. A more robust one would track levels and positions.
            // For now, we'll just display arrays involved in the current step.

            if (step.type === 'initial' || step.type === 'final') {
                const levelDiv = createArrayLevelDiv();
                levelDiv.appendChild(createSublistDiv(step.arrays[0], step.type === 'final' ? 'sorted-final' : ''));
                mergeSortVisualizationArea.appendChild(levelDiv);
            } else if (step.type === 'split') {
                const levelDiv = createArrayLevelDiv(`Level ${step.level} - Splitting`);
                // Show parent being split
                const parentDiv = createSublistDiv(step.parent, 'placeholder'); 
                parentDiv.style.borderStyle = 'dashed'; parentDiv.style.borderColor = '#a5b4fc';
                levelDiv.appendChild(parentDiv);
                mergeSortVisualizationArea.appendChild(levelDiv);

                const childrenLevelDiv = createArrayLevelDiv();
                childrenLevelDiv.appendChild(createSublistDiv(step.left));
                childrenLevelDiv.appendChild(createSublistDiv(step.right));
                mergeSortVisualizationArea.appendChild(childrenLevelDiv);

            } else if (step.type === 'pre-merge' || step.type === 'compare' || step.type === 'merge-item' || step.type === 'post-merge') {
                const levelDiv = createArrayLevelDiv(`Level ${step.level} - Merging`);
                 // Show original parent context for this merge operation
                if (step.originalParentForContext) {
                    const parentContextDiv = createSublistDiv(step.originalParentForContext, 'placeholder');
                    parentContextDiv.style.borderStyle = 'dotted'; parentContextDiv.style.borderColor = '#cbd5e1';
                    parentContextDiv.title = "Context: Parent list segment being reconstructed";
                    const parentLabel = document.createElement('p'); parentLabel.className = 'text-xs text-gray-500 mb-1 text-center w-full'; parentLabel.textContent = 'Parent Context:';
                    levelDiv.appendChild(parentLabel);
                    levelDiv.appendChild(parentContextDiv);
                }


                const sublistsDiv = createArrayLevelDiv();
                const leftSublist = createSublistDiv(step.left);
                const rightSublist = createSublistDiv(step.right);
                
                if (step.type === 'compare') {
                    if (step.left[step.compareLeftIdx] !== undefined) leftSublist.children[step.compareLeftIdx]?.classList.add('comparing');
                    if (step.right[step.compareRightIdx] !== undefined) rightSublist.children[step.compareRightIdx]?.classList.add('comparing');
                }
                
                sublistsDiv.appendChild(leftSublist);
                sublistsDiv.appendChild(rightSublist);
                levelDiv.appendChild(sublistsDiv);

                if (step.merged || step.mergedResult) {
                    const mergedLabel = document.createElement('p'); mergedLabel.className = 'text-xs text-gray-500 mt-2 mb-1 text-center w-full'; mergedLabel.textContent = 'Merging into:';
                    levelDiv.appendChild(mergedLabel);
                    const mergedDiv = createSublistDiv(step.merged || step.mergedResult, step.type === 'post-merge' ? 'merging-target' : '');
                    levelDiv.appendChild(mergedDiv);
                }
                mergeSortVisualizationArea.appendChild(levelDiv);
            }
        }

        function createArrayLevelDiv(label = '') {
            const div = document.createElement('div');
            div.className = 'merge-sort-array-level';
            if (label) {
                const p = document.createElement('p');
                p.className = 'text-xs text-gray-500 mb-1 text-center w-full';
                p.textContent = label;
                div.appendChild(p);
            }
            return div;
        }

        function createSublistDiv(arr, itemClass = '') {
            const container = document.createElement('div');
            container.className = 'merge-sort-sublist-container';
            arr.forEach(val => {
                const itemDiv = document.createElement('div');
                itemDiv.className = `merge-sort-item ${itemClass}`;
                itemDiv.textContent = val;
                container.appendChild(itemDiv);
            });
            return container;
        }
        
        function nextMergeSortStep() {
            if (currentMergeSortStepIndex < mergeSortSteps.length -1) {
                currentMergeSortStepIndex++;
                renderMergeSortStep();
            } else {
                mergeSortStatus.textContent = "Sorting complete!";
                mergeSortStepBtn.disabled = true;
            }
        }

        function resetMergeSortVisual() {
            document.getElementById('merge-sort-input').value = "7, 2, 9, 1, 5, 3, 8, 4";
            mergeSortVisualizationArea.innerHTML = '';
            mergeSortStatus.textContent = "Load a list to begin.";
            mergeSortStepBtn.disabled = true;
            mergeSortSteps = [];
            currentMergeSortStepIndex = 0;

            const traceAnswer = document.getElementById('mergesort-trace-answer');
            const traceFeedback = traceAnswer.closest('.quiz-item').querySelector('.feedback');
            traceAnswer.value = '';
            traceFeedback.innerHTML = '';
            traceAnswer.closest('.quiz-item').dataset.answeredCorrectly = "false";
            delete traceAnswer.closest('.quiz-item').dataset.answered;
        }

        if(mergeSortStepBtn) mergeSortStepBtn.addEventListener('click', nextMergeSortStep);


        // --- Exam Practice Question Logic ---
        function toggleMarkScheme(markSchemeId, textareaId, minLength = 10) {
            const markSchemeDiv = document.getElementById(markSchemeId);
            const textarea = document.getElementById(textareaId); // Not strictly needed for just toggling MS
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
                if (item.closest('#starter-activity') || item.closest('#exam-practice-mergesort') || item.closest('#mergesort-simulation-section .quiz-item:not(#task-mergesort-trace)')) return; // Exclude non-scored trace for now

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
            
            resetMergeSortVisual(); // Resets the simulation and the trace question
            
            // Reset Exam Practice
            ['exam-q1-mergesort', 'exam-q2-mergesort'].forEach(id => { 
                const el = document.getElementById(id); if(el) el.value = '';
            });
            ['ms-exam-q1-mergesort', 'ms-exam-q2-mergesort'].forEach(id => {
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
                filename:     'gcse-mergesort-lesson.pdf',
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
            resetMergeSortVisual(); // Initialize sim display
            
            // Calculate initial total possible score
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#exam-practice-mergesort')) return;
                 if (item.id === 'task-mergesort-trace') { // Specific handling for trace task
                    totalPossibleScore += parseInt(item.dataset.points || 0);
                }
                // Add other specific quiz items here if they are not standard button quizzes
            });
            document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
        });