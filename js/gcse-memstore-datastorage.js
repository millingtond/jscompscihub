let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;
        let youtubePlayer; // Variable to hold the YouTube player instance
        let playerCheckInterval; // Interval timer for checking player state

        // --- Quiz Data (Task 5) ---
        const quizData = [
            { question: "How many Megabytes (MB) are in 3.5 Gigabytes (GB)?", options: ["350", "3500", "35", "0.0035"], correctAnswer: "3500", points: 1 },
            { question: "Which storage device typically has the largest capacity?", options: ["CD-ROM", "DVD", "USB Flash Drive", "HDD"], correctAnswer: "HDD", points: 1 },
            { question: "What is the result of the binary addition 0110 + 0011?", options: ["1001", "1000", "0111", "1010"], correctAnswer: "1001", points: 1 },
            { question: "Which character set uses more bits per character, allowing for more characters?", options: ["ASCII", "Binary", "Unicode", "Hexadecimal"], correctAnswer: "Unicode", points: 1 },
            { question: "Increasing the sample rate when recording sound generally leads to:", options: ["Smaller file size, lower quality", "Smaller file size, higher quality", "Larger file size, lower quality", "Larger file size, higher quality"], correctAnswer: "Larger file size, higher quality", points: 1 }
        ];
        let quizScore = 0;
        let quizQuestionsAnswered = 0;
        const quizTotalQuestions = quizData.length;


        // --- Task Completion Check ---
        function checkTaskCompletion(sectionId) {
            const section = document.getElementById(sectionId);
            if (!section) return;
            const indicator = section.querySelector('.task-completion-indicator');
            // Skip check if it's an extension or other non-scored sections without indicators
            const nonScoredSections = [
                'extension-optical-sim',
                'extension-video',
                'task3-binary-addition',
                'task4-exam-practice', // Original exam practice
                'task6-exam-practice'  // Renumbered exam practice
            ];
            if (!indicator && nonScoredSections.includes(section.id)) return;

            // Special check for Task 5 (Quiz)
            if (section.id === 'task5-quiz') {
                 if (indicator) {
                     const allQuizCorrect = quizScore === quizTotalQuestions && quizQuestionsAnswered === quizTotalQuestions;
                     indicator.innerHTML = allQuizCorrect ? '<i class="fas fa-check-circle"></i>' : '';
                     indicator.classList.toggle('completed', allQuizCorrect);
                 }
                 return; // Handled separately
            }

            if (!indicator) return; // General skip if no indicator

            const quizItems = section.querySelectorAll('.quiz-item');
             // If there are no quiz items in a section with an indicator, treat as incomplete visually
            if (quizItems.length === 0) { if (indicator) { indicator.classList.remove('completed'); indicator.innerHTML = ''; } return; }

            let allCorrect = true;
            quizItems.forEach(item => { if (item.dataset.answeredCorrectly !== 'true') { allCorrect = false; } });
            if (allCorrect) { indicator.innerHTML = '<i class="fas fa-check-circle"></i>'; indicator.classList.add('completed'); }
            else { if (indicator) { indicator.innerHTML = ''; indicator.classList.remove('completed'); } }
        }

        // --- Generic Handler for Simple Quiz Items (like Starter) ---
        document.querySelectorAll('#task0-starter .option-button').forEach(button => {
            button.addEventListener('click', () => {
                const quizItem = button.closest('.quiz-item');
                if (quizItem && !quizItem.querySelector('.option-button:disabled')) { handleGenericOptionClick(button, quizItem); } // Use generic handler
            });
        });

        // --- Generic Reveal Toggle ---
        function toggleReveal(contentId, buttonElement, revealText, hideText) {
            const content = document.getElementById(contentId);
            if(content) {
                content.classList.toggle('show');
                buttonElement.textContent = content.classList.contains('show') ? hideText : revealText;
            }
        }

        // --- Task 2: Capacity Calculation ---
        const requiredSizeGB = 5.325; // 500KB=0.0005GB + 25MB=0.025GB + 4.5GB + 800MB=0.8GB = 5.325 GB

        function checkTotalSize() {
            const input = document.getElementById('total-size-gb');
            const feedback = document.getElementById('total-size-feedback');
            const quizItem = input.closest('.quiz-item');
            const userAnswer = parseFloat(input.value);

            if (isNaN(userAnswer)) {
                 input.classList.add('incorrect'); input.classList.remove('correct');
                 feedback.textContent = `Please enter a number.`; feedback.className = 'feedback incorrect inline-block ml-2';
                 quizItem.dataset.answeredCorrectly = 'false';
                 return; // Exit if not a number
            }

            if (Math.abs(userAnswer - requiredSizeGB) < 0.01) { // Allow for minor rounding diffs
                input.classList.add('correct'); input.classList.remove('incorrect');
                feedback.textContent = 'Correct!'; feedback.className = 'feedback correct inline-block ml-2';
                quizItem.dataset.answeredCorrectly = 'true';
            } else {
                input.classList.add('incorrect'); input.classList.remove('correct');
                feedback.textContent = `Incorrect (Expected ~${requiredSizeGB.toFixed(3)} GB)`; feedback.className = 'feedback incorrect inline-block ml-2';
                quizItem.dataset.answeredCorrectly = 'false';
            }
            checkTaskCompletion('task2-capacity-calc');
            if (scoreCalculated) calculateScore();
        }

        function checkDeviceSelection() {
            const buttons = document.querySelectorAll('#task2-capacity-calc .option-button');
            const feedbackDiv = document.getElementById('device-select-feedback');
            const quizItem = feedbackDiv.closest('.quiz-item');
            let allCorrect = true;
            let correctSelectionsMade = 0;
            const correctDevicesCount = 3; // SD Card (8GB), SSD (128GB), HDD (1TB) are correct

            buttons.forEach(button => {
                const capacity = parseFloat(button.dataset.capacityGb);
                const isSelected = button.classList.contains('selected');
                const shouldBeSelected = capacity >= requiredSizeGB;

                button.classList.remove('correct', 'incorrect'); // Clear previous

                if (isSelected) {
                    if (shouldBeSelected) {
                        button.classList.add('correct');
                        correctSelectionsMade++;
                    } else {
                        button.classList.add('incorrect');
                        allCorrect = false;
                    }
                } else {
                    if (shouldBeSelected) {
                        // Mark as incorrect *only if* it should have been selected but wasn't
                        button.classList.add('incorrect');
                        allCorrect = false;
                    } else {
                        // Correctly not selected - no visual feedback needed unless checking
                    }
                }
                button.disabled = true; // Disable after checking
            });

            // Final check and feedback
            if (allCorrect && correctSelectionsMade === correctDevicesCount) {
                feedbackDiv.innerHTML = '<p class="correct-feedback font-semibold">Correct! You selected all suitable devices.</p>';
                quizItem.dataset.answeredCorrectly = 'true';
            } else {
                 let errorMsg = '<p class="incorrect-feedback font-semibold">Incorrect. ';
                 if (!allCorrect && correctSelectionsMade < correctDevicesCount) {
                     errorMsg += 'You missed some suitable devices or selected unsuitable ones. ';
                 } else if (!allCorrect) {
                     errorMsg += 'You selected some unsuitable devices. ';
                 } else { // allCorrect is true but correctSelectionsMade != correctDevicesCount (shouldn't happen with current logic but good failsafe)
                     errorMsg += 'Check your selections. ';
                 }
                 errorMsg += 'Remember to select ALL devices large enough.</p>';
                 feedbackDiv.innerHTML = errorMsg;
                quizItem.dataset.answeredCorrectly = 'false';
            }
            feedbackDiv.classList.add('show');
            checkTaskCompletion('task2-capacity-calc');
            if (scoreCalculated) calculateScore();
        }

        // --- Task 1: Device Capacity Drag & Drop ---
        let draggedDeviceCapacityItem = null; // Keep track of the item being dragged

        function initializeDeviceCapacityDragDrop() {
            const draggables = document.querySelectorAll('#task1-devices .draggable');
            const dropzones = document.querySelectorAll('#task1-devices .dropzone');
            const pool = document.getElementById('device-capacity-pool');

            // Add drag event listeners to draggable items
            draggables.forEach(draggable => {
                draggable.addEventListener('dragstart', handleDeviceCapacityDragStart);
                draggable.addEventListener('dragend', handleDeviceCapacityDragEnd);
            });

            // Add dragover listeners to allow dropping
            dropzones.forEach(zone => {
                zone.addEventListener('dragover', handleDeviceCapacityDragOver);
                zone.addEventListener('dragleave', handleDeviceCapacityDragLeave);
                zone.addEventListener('drop', handleDeviceCapacityDrop);
            });

            // Add listeners to the pool as well
            pool.addEventListener('dragover', handleDeviceCapacityDragOver);
            pool.addEventListener('dragleave', handleDeviceCapacityDragLeave);
            pool.addEventListener('drop', handleDeviceCapacityDrop);
        }

        function handleDeviceCapacityDragStart(e) {
            draggedDeviceCapacityItem = e.target; // Store the element being dragged
            e.dataTransfer.setData('text/plain', draggedDeviceCapacityItem.id); // Set data for transfer (ID is useful)
            e.dataTransfer.effectAllowed = "move"; // Indicate the type of drag operation
            // Add styling to the dragged item (slight delay to ensure it's applied)
            setTimeout(() => {
                if(draggedDeviceCapacityItem) draggedDeviceCapacityItem.classList.add('dragging');
            }, 0);
            clearDeviceCapacityFeedback(); // Clear feedback when starting a new drag
        }

        function handleDeviceCapacityDragEnd() {
            // Remove styling when drag ends
            if (draggedDeviceCapacityItem) {
                draggedDeviceCapacityItem.classList.remove('dragging');
            }
            draggedDeviceCapacityItem = null; // Clear the stored dragged item
            // Remove dragover styles from all potential zones
             document.querySelectorAll('#task1-devices .dropzone, #device-capacity-pool').forEach(zone => {
                zone.classList.remove('dragover');
            });
        }

        function handleDeviceCapacityDragOver(e) {
            e.preventDefault(); // Necessary to allow dropping
            const targetZone = e.currentTarget; // The zone being dragged over

            // Allow drop only if it's the pool OR an empty dropzone
            const isPool = targetZone.id === 'device-capacity-pool';
            // Check if it's a dropzone and has only the h4 element or less (i.e., empty)
            const isEmptyDropzone = targetZone.classList.contains('dropzone') && targetZone.querySelectorAll(':scope > *').length <= 1;


            if (isPool || isEmptyDropzone) {
                targetZone.classList.add('dragover'); // Add visual feedback
                e.dataTransfer.dropEffect = "move";
            } else {
                 e.dataTransfer.dropEffect = "none"; // Indicate drop not allowed
                 targetZone.classList.remove('dragover'); // Ensure no highlight if not allowed
            }
        }

        function handleDeviceCapacityDragLeave(e) {
            e.currentTarget.classList.remove('dragover'); // Remove visual feedback when leaving
        }

        function handleDeviceCapacityDrop(e) {
            e.preventDefault(); // Prevent default browser behavior
            const targetZone = e.currentTarget;
            targetZone.classList.remove('dragover'); // Remove visual feedback

            // Check if the drop target is valid (pool or empty dropzone)
            const isPool = targetZone.id === 'device-capacity-pool';
            const isEmptyDropzone = targetZone.classList.contains('dropzone') && targetZone.querySelectorAll(':scope > *').length <= 1;

            if (draggedDeviceCapacityItem && (isPool || isEmptyDropzone)) {
                // Append the dragged item to the target zone
                // Ensure the item being dropped is the one we started dragging
                const id = e.dataTransfer.getData('text/plain');
                const draggableElement = document.getElementById(id);

                if (draggableElement === draggedDeviceCapacityItem) {
                     // Check if the target zone already contains a draggable element (shouldn't happen with current dragOver logic, but good check)
                     if (!isPool && targetZone.querySelector('.draggable')) {
                         // Optionally move existing item back to pool or handle differently
                         console.warn("Dropzone already occupied.");
                         return;
                     }
                     // Remove item from its original parent before appending
                     if (draggableElement.parentNode) {
                        draggableElement.parentNode.removeChild(draggableElement);
                     }
                     targetZone.appendChild(draggableElement);
                }
            }
        }


        function clearDeviceCapacityFeedback() {
            const feedbackElement = document.getElementById('device-feedback');
            if (feedbackElement) {
                feedbackElement.classList.remove('show');
                feedbackElement.innerHTML = ''; // Clear content
            }
            // Remove visual correctness indicators from items
            document.querySelectorAll('#task1-devices .draggable').forEach(item => {
                item.classList.remove('correct', 'incorrect');
            });
            // Reset the answered status for scoring
            const quizItem = document.querySelector('#task1-devices .quiz-item');
            if (quizItem) quizItem.dataset.answeredCorrectly = 'false';
            checkTaskCompletion('task1-devices'); // Update task completion icon
        }

        function checkDeviceCapacityDragDrop() {
            clearDeviceCapacityFeedback(); // Start fresh
            const feedbackElement = document.getElementById('device-feedback');
            const quizItem = document.querySelector('#task1-devices .quiz-item');
            let allCorrect = true;
            let itemsPlacedCorrectly = 0;
            const totalItems = 5; // Total number of draggable devices in Task 1

            document.querySelectorAll('#task1-devices .dropzone[data-accept]').forEach(zone => {
                const item = zone.querySelector('.draggable'); // Get the draggable item inside this zone
                if (item) {
                    // Check if the item's data-capacity matches the zone's data-accept
                    if (item.dataset.capacity === zone.dataset.accept) {
                        item.classList.add('correct');
                        itemsPlacedCorrectly++;
                    } else {
                        item.classList.add('incorrect');
                        allCorrect = false; // Mark as incorrect if any item is misplaced
                    }
                } else {
                    // If a dropzone is empty, the task isn't correctly completed
                    allCorrect = false;
                }
            });

            const itemsInPool = document.getElementById('device-capacity-pool').querySelectorAll('.draggable').length;

            // Final check and feedback
            if (itemsInPool > 0) {
                allCorrect = false; // Not complete if items are left in the pool
                feedbackElement.innerHTML = `<p class="incorrect-feedback font-semibold">Please place all items from the pool into the capacity boxes.</p>`;
            } else if (allCorrect && itemsPlacedCorrectly === totalItems) {
                feedbackElement.innerHTML = `<p class="correct-feedback font-semibold">Correct! All devices matched to their typical capacity.</p>`;
            } else {
                // This covers cases where all zones are filled, but some are wrong
                feedbackElement.innerHTML = `<p class="incorrect-feedback font-semibold">Some devices are in the wrong capacity box. Check the red highlighted items.</p>`;
            }

            feedbackElement.classList.add('show');
            // Update score status only if all items are placed correctly
            if (quizItem) quizItem.dataset.answeredCorrectly = (allCorrect && itemsInPool === 0).toString();
            checkTaskCompletion('task1-devices'); // Update the checkmark indicator
            if (scoreCalculated) calculateScore(); // Recalculate score if already calculated once
        }

        function resetDeviceCapacityDragDrop() {
            clearDeviceCapacityFeedback(); // Clear feedback and styles
            const pool = document.getElementById('device-capacity-pool');
            // Move all draggable items back to the pool
            document.querySelectorAll('#task1-devices .dropzone .draggable').forEach(item => {
                pool.appendChild(item); // Appending automatically removes from old parent
            });
            // Ensure the task completion status is reset
            checkTaskCompletion('task1-devices');
            if (scoreCalculated) calculateScore(); // Recalculate score
        }

        // --- YouTube Player API ---
        // Load the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // This function creates an <iframe> (and YouTube player)
        // after the API code downloads.
        function onYouTubeIframeAPIReady() {
            youtubePlayer = new YT.Player('youtube-player', {
                height: '360', // These might be overridden by aspect-video CSS
                width: '640',  // These might be overridden by aspect-video CSS
                videoId: 'H-jxTzFrnpg', // Correct Video ID for "How Does a CD Work?"
                playerVars: {
                    'playsinline': 1, // Plays inline on mobile devices
                    'start': 24,      // Start time in seconds
                    'end': 61,        // End time in seconds
                    'controls': 1,    // Show player controls
                    'rel': 0          // Do not show related videos at the end
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        // The API will call this function when the video player is ready.
        function onPlayerReady(event) {
            // Player is ready (optional: could auto-play here if desired, but controls are shown)
            // event.target.playVideo();
        }

        // The API calls this function when the player's state changes.
        function onPlayerStateChange(event) {
            // Optional: Add extra check to stop video exactly at the end time
            // The 'end' parameter usually handles this, but this is a fallback.
            if (event.data == YT.PlayerState.PLAYING) {
                const endTime = 61; // The desired end time in seconds
                // Clear any existing interval
                if (playerCheckInterval) {
                    clearInterval(playerCheckInterval);
                }
                // Set an interval to check the current time
                playerCheckInterval = setInterval(() => {
                    if (youtubePlayer && youtubePlayer.getCurrentTime) {
                        const currentTime = youtubePlayer.getCurrentTime();
                        if (currentTime >= endTime) {
                            youtubePlayer.stopVideo();
                            clearInterval(playerCheckInterval); // Stop checking
                        }
                    } else {
                         clearInterval(playerCheckInterval); // Stop if player is not available
                    }
                }, 250); // Check every 250ms
            } else {
                 // If video is paused, stopped, ended, etc., clear the interval
                 if (playerCheckInterval) {
                    clearInterval(playerCheckInterval);
                 }
            }
        }

        // --- Task 5: Quiz Functions ---
        function loadQuiz() {
            const quizContainer = document.getElementById('quiz-questions');
            if (!quizContainer) return;
            quizContainer.innerHTML = '';
            quizScore = 0;
            quizQuestionsAnswered = 0;
            document.getElementById('quiz-total-questions').textContent = quizTotalQuestions;
            updateQuizScoreDisplay();
            const resetButton = document.getElementById('reset-quiz-btn');
            if (resetButton) resetButton.classList.add('hidden');

            quizData.forEach((q, index) => {
                const questionElement = document.createElement('div');
                questionElement.className = 'mb-6 quiz-item'; // Added quiz-item class
                questionElement.dataset.points = q.points.toString(); // Store points
                questionElement.dataset.answeredCorrectly = "false"; // Initial state

                const questionText = document.createElement('p');
                questionText.className = 'font-semibold mb-3 text-lg text-gray-800';
                questionText.textContent = `${index + 1}. ${q.question}`;
                questionElement.appendChild(questionText);

                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'flex flex-wrap gap-2'; // Use flex-wrap for options
                q.options.forEach(option => {
                    const button = document.createElement('button');
                    // Use option-button class for styling
                    button.className = 'option-button px-3 py-1 border rounded-md';
                    button.textContent = option;
                    button.dataset.answer = option; // Store answer value
                    button.onclick = () => checkQuizAnswer(button, index);
                    optionsDiv.appendChild(button);
                });
                questionElement.appendChild(optionsDiv);

                const feedbackPara = document.createElement('p');
                feedbackPara.className = 'feedback mt-2'; // Use feedback class
                questionElement.appendChild(feedbackPara);

                quizContainer.appendChild(questionElement);
            });
            checkTaskCompletion('task5-quiz'); // Update completion status
        }

        function checkQuizAnswer(buttonElement, questionIndex) {
            const selectedAnswer = buttonElement.dataset.answer;
            const questionData = quizData[questionIndex];
            const quizItem = buttonElement.closest('.quiz-item');
            const feedbackElement = quizItem.querySelector('.feedback');
            const buttons = quizItem.querySelectorAll('.option-button');

            buttons.forEach(btn => btn.disabled = true);
            buttonElement.classList.add('selected');

            if (selectedAnswer === questionData.correctAnswer) {
                buttonElement.classList.add('correct');
                feedbackElement.textContent = 'Correct!';
                feedbackElement.className = 'feedback correct';
                quizScore += questionData.points;
                quizItem.dataset.answeredCorrectly = 'true';
            } else {
                buttonElement.classList.add('incorrect');
                feedbackElement.textContent = `Incorrect. The answer is ${questionData.correctAnswer}.`;
                feedbackElement.className = 'feedback incorrect';
                quizItem.dataset.answeredCorrectly = 'false';
                // Highlight the correct answer
                buttons.forEach(btn => {
                    if (btn.dataset.answer === questionData.correctAnswer) {
                        btn.classList.add('correct');
                    }
                });
            }

            quizQuestionsAnswered++;
            updateQuizScoreDisplay();
            checkTaskCompletion('task5-quiz'); // Update completion status
            if (quizQuestionsAnswered === quizTotalQuestions) {
                document.getElementById('reset-quiz-btn').classList.remove('hidden');
            }
            if (scoreCalculated) calculateScore(); // Recalculate overall score
        }

        function updateQuizScoreDisplay() {
            document.getElementById('quiz-score').textContent = quizScore;
        }

        // --- Generic Option Click Handler (for Starter and potentially others) ---
        function handleGenericOptionClick(buttonElement, quizItem) {
            const selectedAnswer = buttonElement.dataset.answer;
            const correctAnswer = quizItem.dataset.correct;
            const feedbackElement = quizItem.querySelector('.feedback');
            const buttons = quizItem.querySelectorAll('.option-button');

            buttons.forEach(btn => btn.disabled = true);
            buttonElement.classList.add('selected');

            if (selectedAnswer === correctAnswer) {
                buttonElement.classList.add('correct');
                feedbackElement.textContent = 'Correct!';
                feedbackElement.className = 'feedback correct';
                // No score update for starter task (points=0)
            } else {
                buttonElement.classList.add('incorrect');
                feedbackElement.textContent = `Incorrect. The answer is "${correctAnswer.replace('_', ' ')}".`; // Make answer more readable
                feedbackElement.className = 'feedback incorrect';
                buttons.forEach(btn => { if (btn.dataset.answer === correctAnswer) { btn.classList.add('correct'); } });
            }
        }

        // --- Score Calculation ---
        function calculateScore() {
            currentScore = 0; totalPossibleScore = 0; scoreCalculated = true;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 // Exclude non-scored sections (Starter, Binary Addition, Exam Practice, Sim Extension, Video Extension)
                 const nonScoredParents = ['#task0-starter', '#task3-binary-addition', '#task4-exam-practice', '#task6-exam-practice', '#extension-optical-sim', '#extension-video'];
                 if (nonScoredParents.some(selector => item.closest(selector))) return;

                const points = parseInt(item.dataset.points || 0);
                totalPossibleScore += points;
                if (item.dataset.answeredCorrectly === 'true') {
                    currentScore += points;
                }
            });
            document.getElementById('current-score').textContent = currentScore;
            document.getElementById('total-possible-score').textContent = totalPossibleScore;
            // Update completion indicators for all relevant tasks after score calculation
            document.querySelectorAll('section[id^="task"]').forEach(section => {
                 // Check if the section should be scored (has a quiz item and is not explicitly excluded)
                  if (section.querySelector('.quiz-item') && section.id !== 'task0-starter' && section.id !== 'task3-binary-addition' && section.id !== 'task4-exam-practice' && section.id !== 'task6-exam-practice') {
                       checkTaskCompletion(section.id);
                  }
            });
        }

        // --- Initial Load ---
        window.addEventListener('load', () => {
            // Initialize Task 1 Drag & Drop
            initializeDeviceCapacityDragDrop();

            // Add click listener for device selection buttons (Task 2)
            document.querySelectorAll('#task2-capacity-calc .option-button').forEach(button => {
                button.addEventListener('click', () => {
                    if (!button.disabled) {
                        button.classList.toggle('selected');
                    }
                });
            });

            // --- Exam Practice Feedback Toggle (Ensure this runs correctly) ---
            const examPracticeSection = document.getElementById('task6-exam-practice');
            if (examPracticeSection) {
                examPracticeSection.querySelectorAll('.mark-scheme-button').forEach(button => {
                    // Remove potential duplicate listeners if script re-runs
                    button.replaceWith(button.cloneNode(true));
                });
                // Re-select buttons after cloning and attach listener
                examPracticeSection.querySelectorAll('.mark-scheme-button').forEach(button => {
                    button.addEventListener('click', toggleExamFeedback);
                });
            }
            // Also attach listener to the original exam practice section (Task 4) if it exists
            const examPracticeSection4 = document.getElementById('task4-quiz');
            if (examPracticeSection4) {
                examPracticeSection4.querySelectorAll('.mark-scheme-button').forEach(button => {
                    button.replaceWith(button.cloneNode(true));
                });
                examPracticeSection4.querySelectorAll('.mark-scheme-button').forEach(button => {
                    button.addEventListener('click', toggleExamFeedback);
                });
            }

            // Calculate initial total possible score (excluding non-scored tasks)
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 const nonScoredParents = ['#task0-starter', '#task3-binary-addition', '#task4-exam-practice', '#task6-exam-practice', '#extension-optical-sim', '#extension-video'];
                 if (nonScoredParents.some(selector => item.closest(selector))) return; // Skip non-scored
                 totalPossibleScore += parseInt(item.dataset.points || 0);
             });
            document.getElementById('total-possible-score').textContent = totalPossibleScore;

            // Set initial completion status (likely all incomplete)
            document.querySelectorAll('section[id^="task"]').forEach(section => checkTaskCompletion(section.id));

            // Load the quiz
            loadQuiz();
            document.getElementById('reset-quiz-btn').addEventListener('click', loadQuiz);
            // resetOpticalSim(); // Removed as optical sim is not present


            // Set current year in footer
            const currentYearSpan = document.getElementById('currentYear');
            if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

            // Add listener for the final score calculation button
            document.getElementById('calculate-score-btn').addEventListener('click', calculateScore);

            // Initialize Canvases
            initializeCanvas('exam2-canvas-task4');
            initializeCanvas('exam3-canvas-task4');
            initializeCanvas('exam2-canvas-task6');
            initializeCanvas('exam3-canvas-task6');

            // Add tooltips
            const flashcardData = {
                "cd": "Optical storage, a laser reads and writes the 700MB capacity optical disks. Disks are cheap and portable.",
                "dvd": "Optical storage, a laser reads and writes the 4.7GB capacity optical disks which are cheap and portable, but a bit more expensive than CDs.",
                "usb drive": "A solid state storage removable storage device which is very portable, comes in capacities from 1GB up to 512GB",
                "ssd": "No moving parts means this high capacity, fast, durable, low power and reliable secondary storage device is good for laptops but it's expensive",
                "hdd": "High capacity magnetic secondary storage device. It has spinning platters so it wears out, making it less reliable and portable than SSD."
            };
            // Add tooltips (if keywords are added dynamically later)
            // document.querySelectorAll('.keyword').forEach(span => { ... });
        });

        // --- Separate function for toggling exam feedback ---
        function toggleExamFeedback(event) {
            const button = event.target;
            const feedbackId = button.dataset.feedbackId;
            const feedbackDiv = document.getElementById(feedbackId);
            if (feedbackDiv) {
                feedbackDiv.classList.toggle('hidden');
                button.textContent = feedbackDiv.classList.contains('hidden') ? 'Show Mark Scheme' : 'Hide Mark Scheme';
            }
        }

        // --- Canvas Drawing Functions ---
        function initializeCanvas(canvasId) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let drawing = false;

            // Set drawing style
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#374151'; // Dark gray

            function getCoords(event) {
                const rect = canvas.getBoundingClientRect();
                let x, y;
                if (event.touches && event.touches.length > 0) {
                    x = event.touches[0].clientX - rect.left;
                    y = event.touches[0].clientY - rect.top;
                } else {
                    x = event.clientX - rect.left;
                    y = event.clientY - rect.top;
                }
                return { x, y };
            }

            function startDrawing(event) { drawing = true; draw(event); } // Start path on down/touch
            function stopDrawing() { drawing = false; ctx.beginPath(); } // Reset path on up/leave

            function draw(event) {
                if (!drawing) return;
                event.preventDefault(); // Prevent scrolling on touch devices
                const { x, y } = getCoords(event);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath(); // Start new path segment for smoother lines
                ctx.moveTo(x, y);
            }

            // Event Listeners
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseleave', stopDrawing); // Stop if mouse leaves canvas
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('touchstart', startDrawing, { passive: false }); // Use passive: false to allow preventDefault
            canvas.addEventListener('touchend', stopDrawing);
            canvas.addEventListener('touchmove', draw, { passive: false });
        }

        function clearCanvas(canvasId) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

                // --- Canvas Drawing Functions ---
                function initializeCanvas(canvasId) {
                    const canvas = document.getElementById(canvasId);
                    if (!canvas) return;
                    const ctx = canvas.getContext('2d');
                    let drawing = false;
        
                    // Set drawing style
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctx.strokeStyle = '#374151'; // Dark gray
        
                    function getCoords(event) {
                        const rect = canvas.getBoundingClientRect();
                        let x, y;
                        if (event.touches && event.touches.length > 0) {
                            x = event.touches[0].clientX - rect.left;
                            y = event.touches[0].clientY - rect.top;
                        } else {
                            x = event.clientX - rect.left;
                            y = event.clientY - rect.top;
                        }
                        return { x, y };
                    }
        
                    function startDrawing(event) { drawing = true; draw(event); } // Start path on down/touch
                    function stopDrawing() { drawing = false; ctx.beginPath(); } // Reset path on up/leave
        
                    function draw(event) {
                        if (!drawing) return;
                        event.preventDefault(); // Prevent scrolling on touch devices
                        const { x, y } = getCoords(event);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        ctx.beginPath(); // Start new path segment for smoother lines
                        ctx.moveTo(x, y);
                    }
        
                    // Event Listeners
                    canvas.addEventListener('mousedown', startDrawing);
                    canvas.addEventListener('mouseup', stopDrawing);
                    canvas.addEventListener('mouseleave', stopDrawing); // Stop if mouse leaves canvas
                    canvas.addEventListener('mousemove', draw);
                    canvas.addEventListener('touchstart', startDrawing, { passive: false }); // Use passive: false to allow preventDefault
                    canvas.addEventListener('touchend', stopDrawing);
                    canvas.addEventListener('touchmove', draw, { passive: false });
                }
        
                function clearCanvas(canvasId) {
                    const canvas = document.getElementById(canvasId);
                    if (!canvas) return;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
        
                // --- Initial Load ---
                window.addEventListener('load', () => {
                    // ... (existing load code) ...
        
                    // Initialize Canvases
                    initializeCanvas('exam2-canvas-task4');
                    initializeCanvas('exam3-canvas-task4');
                    initializeCanvas('exam2-canvas-task6');
                    initializeCanvas('exam3-canvas-task6');
        
                    // ... (rest of existing load code) ...
                });