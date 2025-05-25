// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "operating system (os)": "Software that manages computer hardware and software resources, and provides common services for computer programs.",
            "systems software": "Software designed to provide a platform for other software (includes OS and Utility Programs).",
            "user interface (ui)": "The means by which the user and a computer system interact, in particular the use of input devices and software.",
            "graphical user interface (gui)": "A type of user interface that allows users to interact with electronic devices through graphical icons and visual indicators. Uses WIMP (Windows, Icons, Menus, Pointers).",
            "command line interface (cli)": "A text-based user interface used to view and manage computer files and run programs by typing commands.",
            "menu-driven interface": "A user interface that presents a series of predefined options (menus) to the user to navigate and make selections.",
            "natural language interface": "A user interface that allows users to interact with a computer using everyday human language (spoken or typed).",
            "memory management": "The process of controlling and coordinating computer memory, assigning portions called blocks to various running programs to optimize overall system performance.",
            "multitasking": "The ability of an operating system to allow multiple software processes to run concurrently.",
            "peripheral management": "The OS process of controlling communication between the computer and its connected peripheral devices (e.g., printers, keyboards, mice).",
            "driver": "A software program that enables the operating system to communicate with and control a specific hardware device.",
            "drivers": "A software program that enables the operating system to communicate with and control a specific hardware device.",
            "user management": "The OS function of creating/managing user accounts, setting permissions, and ensuring security between different users.",
            "file management": "The OS process of organizing and keeping track of files and folders, including their storage, retrieval, naming, sharing, and protection.",
            "utility software": "System software designed to help analyse, configure, optimise or maintain a computer.",
            "permissions": "Access rights granted to users or groups, dictating what actions they can perform on files, folders, or system resources.",
            "ram": "Random Access Memory: Volatile memory that stores currently running programs and data.",
            "volatile": "Data is lost when the power is turned off.",
            "non-volatile": "Data is retained even when the power is turned off."
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

        // --- Helper: Check Task Completion (Placeholder) ---
        // This would visually update a checkmark next to task titles if all parts are correct
        function checkTaskCompletion(sectionId) {
            // console.log("Checking completion for:", sectionId);
            // Implementation depends on how individual task correctness is tracked
        }

        // --- Starter Activity Logic ---
        // Simple reveal for answers.

        // --- Task 1: Fill in the Blanks ---
        function checkTask1FillBlanks() {
            const answers = {
                "blank-os-type": "system software",
                "blank-os-manages": "hardware",
                "blank-os-interface": "user interface"
            };
            let correctCount = 0;
            const feedbackDiv = document.getElementById('task1-feedback');
            let feedbackHtml = "<ul>";
            const quizItem = document.querySelector('#task1-fill-blanks .quiz-item');

            for (const id in answers) {
                const inputEl = document.getElementById(id);
                const userAnswer = inputEl.value.trim().toLowerCase();
                inputEl.classList.remove('correct', 'incorrect');
                if (userAnswer === answers[id] || (answers[id].includes('/') && answers[id].split('/').map(s => s.trim()).includes(userAnswer))) {
                    inputEl.classList.add('correct');
                    feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Blank for "${answers[id]}" is correct!</li>`;
                    correctCount++;
                } else {
                    inputEl.classList.add('incorrect');
                    feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Blank for "${answers[id]}" is incorrect. You wrote: "${userAnswer || 'nothing'}". Expected: "${answers[id]}".</li>`;
                }
            }
            feedbackHtml += "</ul>";
            if (correctCount === Object.keys(answers).length) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">All blanks correct!</p>${feedbackHtml}`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Some blanks are incorrect. You got ${correctCount}/${Object.keys(answers).length}.</p>${feedbackHtml}`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            feedbackDiv.classList.add('show');
            quizItem.dataset.answered = "true";
            if (scoreCalculated) calculateScore();
        }
        function resetTask1FillBlanks() {
            ['blank-os-type', 'blank-os-manages', 'blank-os-interface'].forEach(id => {
                const el = document.getElementById(id);
                el.value = '';
                el.classList.remove('correct', 'incorrect');
            });
            document.getElementById('task1-feedback').classList.remove('show');
            const quizItem = document.querySelector('#task1-fill-blanks .quiz-item');
            quizItem.dataset.answeredCorrectly = "false";
            delete quizItem.dataset.answered;
            if (scoreCalculated) calculateScore();
        }


        // --- Task 2: OS Functions Match Up (Drag & Drop) ---
        let draggedFunctionItem = null;
        const functionPool = document.getElementById('function-pool');
        const functionDropzones = document.querySelectorAll('#task2-os-functions-match .function-dropzone');

        function setupOSFunctionsDragDrop() {
            if(!functionPool) return;
            functionPool.querySelectorAll('.os-function-item').forEach(item => {
                item.draggable = true;
                item.addEventListener('dragstart', e => {
                    draggedFunctionItem = e.target;
                    setTimeout(() => e.target.classList.add('dragging'), 0);
                });
                item.addEventListener('dragend', e => {
                    setTimeout(() => e.target.classList.remove('dragging'), 0);
                    draggedFunctionItem = null;
                });
            });

            functionDropzones.forEach(zone => {
                zone.addEventListener('dragover', e => { e.preventDefault(); if(zone.children.length === 0) zone.classList.add('dragover'); });
                zone.addEventListener('dragleave', e => zone.classList.remove('dragover'));
                zone.addEventListener('drop', e => {
                    e.preventDefault();
                    zone.classList.remove('dragover');
                    if (draggedFunctionItem && zone.children.length === 0) { // Only drop if zone is empty
                        zone.appendChild(draggedFunctionItem);
                        draggedFunctionItem.classList.remove('correct', 'incorrect');
                    }
                });
            });
            functionPool.addEventListener('dragover', e => e.preventDefault());
            functionPool.addEventListener('drop', e => {
                e.preventDefault();
                if (draggedFunctionItem) {
                    functionPool.appendChild(draggedFunctionItem);
                    draggedFunctionItem.classList.remove('correct', 'incorrect');
                }
            });
        }

        function checkOSFunctionsMatch() {
            const feedbackDiv = document.getElementById('task2-feedback');
            const quizItem = document.querySelector('#task2-os-functions-match .quiz-item');
            let correctMatches = 0;
            let feedbackHtml = "<ul>";
            let allAttempted = true;

            functionDropzones.forEach(zone => {
                const item = zone.querySelector('.os-function-item');
                zone.classList.remove('correct', 'incorrect'); // Clear zone border
                if (item) {
                    item.classList.remove('correct', 'incorrect');
                    if (item.dataset.function === zone.dataset.accept) {
                        item.classList.add('correct');
                        feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>"${item.textContent}" matched correctly to its description.</li>`;
                        correctMatches++;
                    } else {
                        item.classList.add('incorrect');
                        feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>"${item.textContent}" is mismatched. (Expected: ${zone.dataset.accept})</li>`;
                    }
                } else {
                    allAttempted = false; // An empty dropzone means not all attempted
                    feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Dropzone for "${zone.dataset.accept}" is empty.</li>`;
                }
            });
            feedbackHtml += "</ul>";
            
            if (functionPool.children.length > 0) { // Items still in pool
                allAttempted = false;
                feedbackHtml += `<p class="incorrect-feedback font-semibold mt-2">Some functions are still in the pool!</p>`;
            }

            if (!allAttempted) {
                 feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Please drag all functions to a description box.</p>${feedbackHtml}`;
                 quizItem.dataset.answeredCorrectly = "false";
            } else if (correctMatches === functionDropzones.length) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">All functions matched correctly!</p>${feedbackHtml}`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Some functions are mismatched. You got ${correctMatches}/${functionDropzones.length}.</p>${feedbackHtml}`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            feedbackDiv.classList.add('show');
            quizItem.dataset.answered = "true";
            if (scoreCalculated) calculateScore();
        }

        function resetOSFunctionsMatch() {
            functionDropzones.forEach(zone => {
                const item = zone.querySelector('.os-function-item');
                if (item) {
                    item.classList.remove('correct', 'incorrect');
                    functionPool.appendChild(item);
                }
                zone.classList.remove('correct', 'incorrect');
            });
            document.getElementById('task2-feedback').classList.remove('show');
            const quizItem = document.querySelector('#task2-os-functions-match .quiz-item');
            quizItem.dataset.answeredCorrectly = "false";
            delete quizItem.dataset.answered;
            if (scoreCalculated) calculateScore();
        }

        // --- Task 4: Memory Management Simulation ---
        const ramDisplay = document.getElementById('ram-display');
        const memoryStatus = document.getElementById('memory-status');
        const MAX_RAM_MB = 10;
        let usedRamMB = 0;
        let loadedPrograms = {}; // To track { progId: { size: X, color: Y, element: Z } }

        function toggleProgram(progId, sizeMB, color) {
            if (loadedPrograms[progId]) { // Program is loaded, so close it
                ramDisplay.removeChild(loadedPrograms[progId].element);
                usedRamMB -= loadedPrograms[progId].size;
                delete loadedPrograms[progId];
                document.querySelector(`button[onclick*="${progId}"]`).classList.remove('bg-red-500', 'hover:bg-red-600');
                document.querySelector(`button[onclick*="${progId}"]`).classList.add('sim-button');

            } else { // Program not loaded, try to load it
                if (usedRamMB + sizeMB <= MAX_RAM_MB) {
                    usedRamMB += sizeMB;
                    const block = document.createElement('div');
                    block.className = 'memory-block';
                    block.style.height = `${(sizeMB / MAX_RAM_MB) * 100}%`;
                    block.style.backgroundColor = color;
                    block.textContent = progId.replace('-', ' ');
                    ramDisplay.appendChild(block);
                    loadedPrograms[progId] = { size: sizeMB, color: color, element: block };
                    document.querySelector(`button[onclick*="${progId}"]`).classList.add('bg-red-500', 'hover:bg-red-600');
                    document.querySelector(`button[onclick*="${progId}"]`).classList.remove('sim-button');
                } else {
                    memoryStatus.textContent = `Not enough RAM to load ${progId.replace('-', ' ')}! Available: ${MAX_RAM_MB - usedRamMB}MB.`;
                    return; // Exit without updating status further if load fails
                }
            }
            memoryStatus.textContent = `Total RAM: ${MAX_RAM_MB}MB. Used: ${usedRamMB}MB. Available: ${MAX_RAM_MB - usedRamMB}MB.`;
        }
        function resetMemorySim() {
            ramDisplay.innerHTML = '';
            usedRamMB = 0;
            loadedPrograms = {};
            memoryStatus.textContent = `Total RAM: ${MAX_RAM_MB}MB. Available: ${MAX_RAM_MB}MB.`;
            document.querySelectorAll('#task4-memory-management-sim button.sim-button, #task4-memory-management-sim button.bg-red-500').forEach(btn => {
                btn.classList.remove('bg-red-500', 'hover:bg-red-600');
                if(!btn.classList.contains('reset-button')) btn.classList.add('sim-button');
            });
        }

        // --- Task 5: OS Roles Quiz ---
        const osRolesAnswers = {
            q1: "peripheral", q2: "file", q3: "user", q4: "memory"
        };

        function checkTask5OSRoles() {
            let correctCount = 0;
            const quizItemContainer = document.querySelector('#task5-os-roles-quiz .quiz-item'); // Assuming one quiz-item wraps all questions
            
            document.querySelectorAll('#task5-os-roles-quiz .quiz-question').forEach((questionDiv, index) => {
                const questionNum = index + 1;
                const selectedButton = questionDiv.querySelector('.option-button.selected');
                const feedbackEl = questionDiv.querySelector('.feedback');
                const correctAnswer = osRolesAnswers[`q${questionNum}`];
                
                questionDiv.querySelectorAll('.option-button').forEach(opt => opt.disabled = true);

                if (selectedButton) {
                    const userAnswer = selectedButton.dataset.answer;
                    if (userAnswer === correctAnswer) {
                        selectedButton.classList.add('correct');
                        feedbackEl.textContent = 'Correct!';
                        feedbackEl.className = 'feedback correct';
                        correctCount++;
                    } else {
                        selectedButton.classList.add('incorrect');
                        feedbackEl.textContent = `Incorrect. (Hint: ${correctAnswer.replace(/([A-Z])/g, ' $1').trim()})`;
                        feedbackEl.className = 'feedback incorrect';
                        questionDiv.querySelectorAll('.option-button').forEach(opt => {
                            if (opt.dataset.answer === correctAnswer) opt.classList.add('correct');
                        });
                    }
                } else {
                    feedbackEl.textContent = `No answer selected. (Hint: ${correctAnswer.replace(/([A-Z])/g, ' $1').trim()})`;
                    feedbackEl.className = 'feedback incorrect';
                }
            });

            quizItemContainer.dataset.answered = "true";
            quizItemContainer.dataset.answeredCorrectly = (correctCount === Object.keys(osRolesAnswers).length).toString();
            if (scoreCalculated) calculateScore();
        }

        function resetTask5OSRoles() {
            document.querySelectorAll('#task5-os-roles-quiz .quiz-question').forEach(questionDiv => {
                questionDiv.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = false;
                });
                questionDiv.querySelector('.feedback').textContent = '';
            });
            const quizItemContainer = document.querySelector('#task5-os-roles-quiz .quiz-item');
            quizItemContainer.dataset.answeredCorrectly = "false";
            delete quizItemContainer.dataset.answered;
            if (scoreCalculated) calculateScore();
        }

        // --- Exam Practice Question Logic ---
        function toggleMarkScheme(markSchemeId, textareaId, minLength = 10) {
            const markSchemeDiv = document.getElementById(markSchemeId);
            const textarea = document.getElementById(textareaId);
            const buttonElement = event.target; // The button that was clicked

            if (!markSchemeDiv) return;

            if (!markSchemeDiv.classList.contains('show')) { // If trying to show
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
                // Exclude non-scored tasks
                if (item.closest('#starter-activity') || item.closest('#task3-ui-deep-dive') || item.closest('#task4-memory-management-sim') || item.closest('#exam-practice-os')) return;

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
            feedbackDisplay.className = percentage >= 75 ? "text-green-600" : (percentage >= 50 ? "text-yellow-600" : "text-red-600");
            scoreArea.style.display = 'block';
            scoreArea.scrollIntoView({ behavior: 'smooth' });
        }

        // --- Reset All Tasks ---
        function resetAllTasks() {
            if (!confirm("Are you sure you want to reset all tasks? Your progress will be lost.")) return;
            // Reset Starter
            ['starter-q1', 'starter-q2', 'starter-q4'].forEach(id => document.getElementById(id).value = '');
            document.querySelectorAll('input[name="software-category"]').forEach(radio => radio.checked = false);
            const starterRevealBtn = document.querySelector("button[onclick*='starter-answers-feedback']");
            const starterFeedbackDiv = document.getElementById('starter-answers-feedback');
            if (starterFeedbackDiv.classList.contains('show')) toggleReveal('starter-answers-feedback', starterRevealBtn, 'Reveal Example Answers', 'Hide Example Answers');
            
            // Reset Tasks
            resetTask1FillBlanks();
            resetOSFunctionsMatch();
            // Task 3 (UI Deep Dive) is self-assessment with guidance, reset textareas
            ['gui-features', 'gui-adv', 'gui-disadv', 'cli-features', 'cli-adv', 'cli-disadv', 'menu-features', 'menu-adv', 'menu-disadv', 'nli-features', 'nli-adv', 'nli-disadv'].forEach(id => document.getElementById(id).value = '');
            const task3GuidanceBtn = document.querySelector("button[onclick*='task3-guidance']");
            const task3GuidanceDiv = document.getElementById('task3-guidance');
            if (task3GuidanceDiv.classList.contains('show')) toggleReveal('task3-guidance', task3GuidanceBtn, 'Show Guidance Points', 'Hide Guidance Points');

            resetMemorySim();
            resetTask5OSRoles();

            // Reset Exam Practice
            ['exam-q1-os', 'exam-q2-os', 'exam-q3-os'].forEach(id => document.getElementById(id).value = '');
            ['ms-exam-q1-os', 'ms-exam-q2-os', 'ms-exam-q3-os'].forEach(id => {
                const msDiv = document.getElementById(id);
                const msButton = document.querySelector(`button[onclick*="'${id}'"]`);
                if (msDiv.classList.contains('show')) toggleReveal(id, msButton, 'Show Mark Scheme', 'Hide Mark Scheme');
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
                margin:       [0.5, 0.5, 0.7, 0.5], // top, left, bottom, right (inches)
                filename:     'gcse-os-lesson-part1.pdf',
                image:        { type: 'jpeg', quality: 0.95 },
                html2canvas:  { scale: 2, logging: false, useCORS: true, scrollY: -window.scrollY }, // Try to capture current scroll
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };
            
            // Temporarily show all revealable content for PDF
            const revealableElements = document.querySelectorAll('.feedback-area, .quiz-feedback, .mark-scheme, .reveal-content');
            const initiallyHidden = [];
            revealableElements.forEach(el => {
                if (!el.classList.contains('show')) {
                    initiallyHidden.push(el);
                    el.classList.add('show');
                }
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
            setupOSFunctionsDragDrop();
            resetMemorySim(); // Initialize memory sim

            // Calculate initial total possible score
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#task3-ui-deep-dive') || item.closest('#task4-memory-management-sim') || item.closest('#exam-practice-os')) return;
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;


            document.querySelectorAll('.quiz-item .option-button').forEach(button => {
                button.addEventListener('click', () => {
                    const quizItem = button.closest('.quiz-item');
                    if (quizItem && !quizItem.closest('#task2-os-functions-match') && !quizItem.querySelector('.option-button:disabled')) { // Exclude drag-drop task
                        handleOptionClick(button, quizItem);
                    }
                });
            });

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
        });