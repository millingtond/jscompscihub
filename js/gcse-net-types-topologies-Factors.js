// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "network": "Two or more computers/devices connected together to share resources, data, or communicate.",
            "bandwidth": "The maximum amount of data that can be transmitted over a network connection in a given amount of time, usually measured in bits per second (bps).",
            "latency": "The delay before a transfer of data begins following an instruction for its transfer. Often referred to as 'ping'.",
            "interference": "Disturbances that can corrupt or disrupt data signals during transmission, e.g., from other electronic devices or physical obstructions.",
            "error rate": "The frequency at which errors occur in data transmission over a communication channel.",
            "congestion": "A state where a network is carrying so much data that its quality of service deteriorates, leading to slowdowns and delays."
            // Add more keywords as needed for this lesson
        };

        // --- Global Variables for Scoring ---
        let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false; // To track if final score has been calculated

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
        
        // --- Helper: Check Task Completion ---
        function checkTaskCompletion(sectionId) {
            const section = document.getElementById(sectionId);
            if (!section) return;
            const indicator = section.querySelector('.task-completion-indicator');
            if (!indicator) return;

            const quizItems = section.querySelectorAll('.quiz-item');
            if (quizItems.length === 0) {
                indicator.classList.remove('completed');
                indicator.innerHTML = '';
                return;
            }
            let allCorrectInTask = true;
            let allAttemptedInTask = true;
            quizItems.forEach(item => {
                if (item.dataset.answeredCorrectly !== 'true') allCorrectInTask = false;
                const optionsDisabled = Array.from(item.querySelectorAll('.option-button')).some(btn => btn.disabled);
                const textareaFilled = item.querySelector('textarea') ? item.querySelector('textarea').value.trim() !== '' : false;
                const draggableFilled = item.querySelector('.media-dropzone') ? item.querySelector('.media-dropzone .media-card') !== null : false;

                if (!item.dataset.answered && !optionsDisabled && !textareaFilled && !draggableFilled) {
                    allAttemptedInTask = false;
                }
            });

            if (allAttemptedInTask && allCorrectInTask) {
                indicator.innerHTML = '<i class="fas fa-check-circle"></i>';
                indicator.classList.add('completed');
            } else {
                indicator.innerHTML = '';
                indicator.classList.remove('completed');
            }
        }

        // --- Starter Activity Logic ---
        // Simple reveal for answers.

        // --- Task 1: Key Terms Matching ---
        let selectedTermItem = null;
        let selectedDefItem = null;
        const termList = document.getElementById('term-list');
        const definitionList = document.getElementById('definition-list');
        const termMatchingFeedback = document.getElementById('term-matching-feedback');

        function setupTermMatching() {
            if (!termList || !definitionList) return;
            selectedTermItem = null;
            selectedDefItem = null;
            termList.querySelectorAll('.matching-item').forEach(item => {
                item.classList.remove('selected', 'correct', 'incorrect');
                item.disabled = false;
            });
            definitionList.querySelectorAll('.matching-item').forEach(item => {
                item.classList.remove('selected', 'correct', 'incorrect');
                item.disabled = false;
            });
            // Shuffle definitions for variety
            for (let i = definitionList.children.length; i >= 0; i--) {
                definitionList.appendChild(definitionList.children[Math.random() * i | 0]);
            }
            if(termMatchingFeedback) termMatchingFeedback.classList.remove('show');
            const quizItem = termList.closest('.quiz-item');
            if(quizItem) {
                quizItem.dataset.answeredCorrectly = "false"; // Reset correctness
                delete quizItem.dataset.answered; // Reset answered status
            }
        }

        function handleTermMatchClick(item, type) {
            if (item.disabled) return;
            if (type === 'term') {
                if (selectedTermItem) selectedTermItem.classList.remove('selected');
                selectedTermItem = item;
                item.classList.add('selected');
            } else { // type === 'definition'
                if (selectedDefItem) selectedDefItem.classList.remove('selected');
                selectedDefItem = item;
                item.classList.add('selected');
            }
            if (selectedTermItem && selectedDefItem) attemptTermMatch();
        }

        function attemptTermMatch() {
            if (selectedTermItem.dataset.match === selectedDefItem.dataset.match) {
                selectedTermItem.classList.add('correct'); selectedDefItem.classList.add('correct');
                selectedTermItem.disabled = true; selectedDefItem.disabled = true;
            } else {
                selectedTermItem.classList.add('incorrect'); selectedDefItem.classList.add('incorrect');
                setTimeout(() => {
                    selectedTermItem.classList.remove('incorrect'); selectedDefItem.classList.remove('incorrect');
                }, 800);
            }
            selectedTermItem.classList.remove('selected'); selectedDefItem.classList.remove('selected');
            selectedTermItem = null; selectedDefItem = null;
        }

        function checkTermMatches() {
            if (!termList || !definitionList || !termMatchingFeedback) return;
            let correctMatches = 0;
            const totalPairs = termList.children.length;
            let allAttempted = true;

            termList.querySelectorAll('.matching-item').forEach(term => {
                if (!term.disabled) allAttempted = false; // Not all have been attempted/paired
                if (term.classList.contains('correct')) correctMatches++;
            });
            
            if (!allAttempted && totalPairs > 0) {
                alert("Please attempt to match all terms before checking.");
                return;
            }

            const quizItem = termList.closest('.quiz-item');
            if (correctMatches === totalPairs) {
                termMatchingFeedback.innerHTML = `<p class="correct-feedback font-semibold">All terms matched correctly! (+${quizItem.dataset.points} points)</p>`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                termMatchingFeedback.innerHTML = `<p class="incorrect-feedback font-semibold">Some terms are mismatched. You got ${correctMatches}/${totalPairs} correct. Try again or reset.</p>`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            termMatchingFeedback.classList.add('show');
            quizItem.dataset.answered = "true";
            checkTaskCompletion('task1-keyterms-matching');
            if(scoreCalculated) calculateScore();
        }
        function resetTermMatches() {
            setupTermMatching();
            checkTaskCompletion('task1-keyterms-matching');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 2: Bandwidth Simulation ---
        const bandwidthSlider = document.getElementById('bandwidth-slider');
        const bandwidthPipe = document.getElementById('bandwidth-pipe');

        function updateBandwidthSim() {
            if (!bandwidthSlider || !bandwidthPipe) return;
            const value = parseInt(bandwidthSlider.value);
            bandwidthPipe.className = 'pipe'; // Reset
            bandwidthPipe.innerHTML = ''; // Clear old packets

            let numPackets = 0;
            let animationSpeedClass = '';

            if (value === 1) { // Narrow
                bandwidthPipe.classList.add('narrow');
                numPackets = 3;
                animationSpeedClass = 'narrow';
            } else if (value === 2) { // Medium
                numPackets = 5;
            } else { // Wide
                bandwidthPipe.classList.add('wide');
                numPackets = 8;
                animationSpeedClass = 'wide';
            }
            for (let i = 0; i < numPackets; i++) {
                const packet = document.createElement('div');
                packet.className = `data-packet ${animationSpeedClass}`;
                packet.style.left = `${Math.random() * 20 - 10}px`; // Stagger start slightly
                packet.style.animationDelay = `${Math.random() * 0.5}s`;
                bandwidthPipe.appendChild(packet);
            }
        }
        function resetBandwidthSim() {
            if(bandwidthSlider) bandwidthSlider.value = 2;
            updateBandwidthSim();
            const quizItem = document.querySelector('#task2-bandwidth-sim .quiz-item');
            if(quizItem) {
                quizItem.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = false;
                });
                const feedbackEl = quizItem.querySelector('.feedback');
                if(feedbackEl) feedbackEl.textContent = '';
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            }
            checkTaskCompletion('task2-bandwidth-sim');
            if(scoreCalculated) calculateScore();
        }


        // --- Task 3: Users & Congestion Simulation ---
        const usersSlider = document.getElementById('users-slider');
        const usersValueDisplay = document.getElementById('users-value');
        const userIconsContainer = document.getElementById('user-icons');
        const congestionStatus = document.getElementById('congestion-status');

        function updateUsersSim() {
            if(!usersSlider || !usersValueDisplay || !userIconsContainer || !congestionStatus) return;
            const numUsers = parseInt(usersSlider.value);
            usersValueDisplay.textContent = numUsers;
            userIconsContainer.innerHTML = '';
            for (let i = 0; i < numUsers; i++) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-user user-icon';
                userIconsContainer.appendChild(icon);
            }
            if (numUsers > 7) {
                congestionStatus.textContent = "High Congestion! Performance likely degraded.";
                congestionStatus.className = "text-center text-sm font-medium mt-2 text-red-600";
                userIconsContainer.querySelectorAll('.user-icon').forEach(icon => icon.classList.add('congested'));
            } else if (numUsers > 4) {
                congestionStatus.textContent = "Moderate Traffic. Some slowdown possible.";
                congestionStatus.className = "text-center text-sm font-medium mt-2 text-yellow-600";
                userIconsContainer.querySelectorAll('.user-icon').forEach(icon => icon.classList.remove('congested'));
            } else {
                congestionStatus.textContent = "Low Traffic. Smooth performance expected.";
                congestionStatus.className = "text-center text-sm font-medium mt-2 text-green-600";
                userIconsContainer.querySelectorAll('.user-icon').forEach(icon => icon.classList.remove('congested'));
            }
        }
        function resetUsersSim(){
            if(usersSlider) usersSlider.value = 1;
            updateUsersSim();
             const quizItem = document.querySelector('#task3-users-sim .quiz-item');
            if(quizItem) {
                quizItem.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = false;
                });
                const feedbackEl = quizItem.querySelector('.feedback');
                if(feedbackEl) feedbackEl.textContent = '';
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            }
            checkTaskCompletion('task3-users-sim');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 4: Transmission Media ---
        let draggedMediaItem = null;
        const mediaPool = document.getElementById('media-pool');
        const mediaDropzones = document.querySelectorAll('#task4-transmission-media .media-dropzone');
        const mediaSortFeedback = document.getElementById('media-sort-feedback');

        function setupMediaSort() {
            if(!mediaPool) return;
            mediaPool.querySelectorAll('.media-card').forEach(card => {
                card.draggable = true;
                card.addEventListener('dragstart', e => {
                    draggedMediaItem = e.target;
                    setTimeout(() => e.target.classList.add('dragging'), 0);
                });
                card.addEventListener('dragend', e => {
                    setTimeout(() => e.target.classList.remove('dragging'), 0);
                    draggedMediaItem = null;
                });
            });

            mediaDropzones.forEach(zone => {
                zone.addEventListener('dragover', e => {
                    e.preventDefault();
                    if (zone.children.length === 0) zone.classList.add('dragover'); // Only highlight if empty
                });
                zone.addEventListener('dragleave', e => zone.classList.remove('dragover'));
                zone.addEventListener('drop', e => {
                    e.preventDefault();
                    zone.classList.remove('dragover');
                    if (draggedMediaItem && zone.children.length === 0) { // Only drop if zone is empty
                        zone.appendChild(draggedMediaItem);
                        draggedMediaItem.classList.remove('correct', 'incorrect'); // Clear previous status
                    }
                });
            });
            mediaPool.addEventListener('dragover', e => e.preventDefault()); // Allow dropping back to pool
            mediaPool.addEventListener('drop', e => {
                e.preventDefault();
                if (draggedMediaItem) {
                    mediaPool.appendChild(draggedMediaItem);
                    draggedMediaItem.classList.remove('correct', 'incorrect');
                }
            });
        }
        function checkMediaSort() {
            if(!mediaSortFeedback) return;
            let correctCount = 0;
            const totalDropzones = mediaDropzones.length;
            let allAttempted = true;

            mediaDropzones.forEach(zone => {
                const card = zone.querySelector('.media-card');
                if (card) {
                    if (card.dataset.type === zone.dataset.accept) {
                        card.classList.add('correct'); card.classList.remove('incorrect');
                        correctCount++;
                    } else {
                        card.classList.add('incorrect'); card.classList.remove('correct');
                    }
                } else {
                    allAttempted = false; // A zone is empty
                }
            });
            
            if (mediaPool.children.length > 0) allAttempted = false; // Items still in pool

            const quizItem = mediaPool.closest('.quiz-item');
            if (!allAttempted && totalDropzones > 0) { // Check totalDropzones to avoid issues if HTML is broken
                alert("Please drag all media types to a description box.");
                quizItem.dataset.answeredCorrectly = "false";
                return;
            }

            if (correctCount === totalDropzones) {
                mediaSortFeedback.innerHTML = `<p class="correct-feedback font-semibold">All media types matched correctly! (+${quizItem.dataset.points} points)</p>`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                mediaSortFeedback.innerHTML = `<p class="incorrect-feedback font-semibold">Some media types are mismatched. You got ${correctCount}/${totalDropzones} correct. Check red items.</p>`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            mediaSortFeedback.classList.add('show');
            quizItem.dataset.answered = "true";
            checkTaskCompletion('task4-transmission-media');
            if(scoreCalculated) calculateScore();
        }
        function resetMediaSort() {
            if(!mediaPool || !mediaSortFeedback) return;
            mediaDropzones.forEach(zone => {
                const card = zone.querySelector('.media-card');
                if (card) {
                    card.classList.remove('correct', 'incorrect');
                    mediaPool.appendChild(card);
                }
            });
            mediaSortFeedback.classList.remove('show');
            const quizItem = mediaPool.closest('.quiz-item');
            if(quizItem) {
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            }
            checkTaskCompletion('task4-transmission-media');
            if(scoreCalculated) calculateScore();
        }


        // --- Task 5: Interference Scenario ---
        function checkInterferenceScenario() {
            const answerTextarea = document.getElementById('interference-scenario-answer');
            const feedbackDiv = document.getElementById('interference-scenario-feedback');
            const quizItem = answerTextarea.closest('.quiz-item');
            const answer = answerTextarea.value.toLowerCase();
            let isCorrect = false;

            if (answer.trim().length < 15) { // Check for minimal attempt
                alert("Please provide a more detailed answer for the interference scenario.");
                return;
            }

            const factorKeywords = ["interference", "microwave", "signal disruption", "obstruction"];
            const solutionKeywords = ["move router", "move device", "change channel", "wired connection", "ethernet", "reduce interference", "turn off microwave"];
            
            let factorMentioned = factorKeywords.some(kw => answer.includes(kw));
            let solutionMentioned = solutionKeywords.some(kw => answer.includes(kw));

            if (factorMentioned && solutionMentioned) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">Good! You identified interference (likely from the microwave) as the factor and suggested a valid solution (e.g., moving the router/device, using a wired connection, or changing Wi-Fi channel). (+${quizItem.dataset.points} points)</p>`;
                answerTextarea.classList.add('correct'); answerTextarea.classList.remove('incorrect');
                isCorrect = true;
            } else {
                let specificFeedback = "Consider these points: ";
                if (!factorMentioned) specificFeedback += "What is the specific network factor causing the problem (hint: microwave)? ";
                if (!solutionMentioned) specificFeedback += "What practical steps could Sarah take to fix it? ";
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Your explanation could be more precise. ${specificFeedback}</p>`;
                answerTextarea.classList.add('incorrect'); answerTextarea.classList.remove('correct');
            }
            feedbackDiv.classList.add('show');
            quizItem.dataset.answeredCorrectly = isCorrect.toString();
            quizItem.dataset.answered = "true";
            checkTaskCompletion('task5-interference-error');
            if(scoreCalculated) calculateScore();
        }
        function resetInterferenceScenario() {
            const answerTextarea = document.getElementById('interference-scenario-answer');
            const feedbackDiv = document.getElementById('interference-scenario-feedback');
            const quizItem = answerTextarea.closest('.quiz-item');
            answerTextarea.value = '';
            answerTextarea.classList.remove('correct', 'incorrect');
            if(feedbackDiv) feedbackDiv.classList.remove('show');
            if(quizItem) {
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            }
            checkTaskCompletion('task5-interference-error');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 6: Latency Explanation ---
        function checkLatencyExplanation() {
            const answerTextarea = document.getElementById('latency-explanation');
            const feedbackDiv = document.getElementById('latency-explanation-feedback');
            const quizItem = answerTextarea.closest('.quiz-item');
            const answer = answerTextarea.value.toLowerCase();
            let isCorrect = false;

            if (answer.trim().length < 15) {
                alert("Please provide a more detailed explanation for the latency question.");
                return;
            }

            const serverAKeywords = ["server a", "same city", "local", "closer"];
            const whyKeywords = ["distance", "shorter path", "fewer hops", "quicker travel"];

            let serverAMentioned = serverAKeywords.some(kw => answer.includes(kw));
            let whyMentioned = whyKeywords.some(kw => answer.includes(kw));

            if (serverAMentioned && whyMentioned) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">Correct! Server A (closer) would likely have lower latency due to shorter physical distance and fewer network hops for data to travel. (+${quizItem.dataset.points} points)</p>`;
                answerTextarea.classList.add('correct'); answerTextarea.classList.remove('incorrect');
                isCorrect = true;
            } else {
                let specificFeedback = "Think about: ";
                if (!serverAMentioned) specificFeedback += "Which server is closer? ";
                if (!whyMentioned) specificFeedback += "Why does distance matter for delay? ";
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Your explanation needs more detail. ${specificFeedback}</p>`;
                answerTextarea.classList.add('incorrect'); answerTextarea.classList.remove('correct');
            }
            feedbackDiv.classList.add('show');
            quizItem.dataset.answeredCorrectly = isCorrect.toString();
            quizItem.dataset.answered = "true";
            checkTaskCompletion('task6-latency');
            if(scoreCalculated) calculateScore();
        }
         function resetLatencyExplanation() {
            const answerTextarea = document.getElementById('latency-explanation');
            const feedbackDiv = document.getElementById('latency-explanation-feedback');
            const quizItem = answerTextarea.closest('.quiz-item');
            answerTextarea.value = '';
            answerTextarea.classList.remove('correct', 'incorrect');
            if(feedbackDiv) feedbackDiv.classList.remove('show');
             if(quizItem) {
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            }
            checkTaskCompletion('task6-latency');
            if(scoreCalculated) calculateScore();
        }


        // --- Exam Practice Question Logic ---
        function checkThenToggleMarkScheme(textareaId, markschemeId, buttonElement, minLength = 10) {
            const textarea = document.getElementById(textareaId);
            const markscheme = document.getElementById(markschemeId);
            if (!textarea || !markscheme || !buttonElement) return;

            if (!markscheme.classList.contains('show') && textarea.value.trim().length < minLength) {
                 alert(`Please attempt a more detailed answer (at least ${minLength} characters) before viewing the mark scheme.`);
                return;
            }
            toggleReveal(markschemeId, buttonElement, 'Show Mark Scheme', 'Hide Mark Scheme');
        }

        // --- Final Score Calculation ---
        function calculateScore() {
            currentScore = 0;
            totalPossibleScore = 0;
            scoreCalculated = true;

            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#exam-practice')) return;

                const points = parseInt(item.dataset.points || 0);
                totalPossibleScore += points;
                if (item.dataset.answeredCorrectly === 'true') {
                    currentScore += points;
                }
            });

            const scoreDisplayEl = document.getElementById('current-score-value');
            const totalDisplayEl = document.getElementById('total-possible-score-value');
            const feedbackDisplay = document.getElementById('final-score-feedback');
            const scoreArea = document.getElementById('final-score-area');

            if(scoreDisplayEl) scoreDisplayEl.textContent = currentScore;
            if(totalDisplayEl) totalDisplayEl.textContent = totalPossibleScore;

            let percentage = totalPossibleScore > 0 ? (currentScore / totalPossibleScore) * 100 : 0;
            let feedbackMessage = "";

            if (percentage === 100) feedbackMessage = "Excellent! Full marks on interactive tasks!";
            else if (percentage >= 80) feedbackMessage = "Great job! Strong understanding of network factors.";
            else if (percentage >= 60) feedbackMessage = "Good effort! Review any tasks you found tricky.";
            else feedbackMessage = "Keep practicing! Revisit the tasks and explanations to improve.";

            if(feedbackDisplay) feedbackDisplay.textContent = feedbackMessage;
            if(feedbackDisplay) feedbackDisplay.className = percentage >= 80 ? "text-green-600" : (percentage >= 60 ? "text-yellow-600" : "text-red-600");
            if(scoreArea) scoreArea.style.display = 'block';
            if(scoreArea) scoreArea.scrollIntoView({ behavior: 'smooth' });
        }

        // --- Reset All Tasks ---
        function resetAllTasks() {
            if (!confirm("Are you sure you want to reset all tasks? Your progress will be lost.")) return;
            // Reset Starter
            document.getElementById('starter-q1-network').value = '';
            document.getElementById('starter-q2-slow').value = '';
            document.getElementById('starter-download').value = '';
            document.getElementById('starter-upload').value = '';
            document.getElementById('starter-latency').value = '';
            document.getElementById('starter-q3-meaning').value = '';
            const starterFeedback = document.getElementById('starter-netfactors-answers-feedback');
            if (starterFeedback && starterFeedback.classList.contains('show')) {
                toggleReveal('starter-netfactors-answers-feedback', starterFeedback.previousElementSibling, 'Reveal Example Answers', 'Hide Example Answers');
            }
            // Reset Task 1
            resetTermMatches();
            // Reset Task 2
            resetBandwidthSim();
            // Reset Task 3
            resetUsersSim();
            // Reset Task 4
            resetMediaSort();
            // Reset Task 5
            resetInterferenceScenario();
            // Reset Task 6
            resetLatencyExplanation();

            // Reset Exam Practice
            document.querySelectorAll('#exam-practice textarea').forEach(ta => ta.value = '');
            document.querySelectorAll('#exam-practice .mark-scheme').forEach(ms => {
                if (ms.classList.contains('show')) {
                    const button = ms.previousElementSibling;
                    toggleReveal(ms.id, button, 'Show Mark Scheme', 'Hide Mark Scheme');
                }
            });
            document.querySelectorAll('#exam-practice .mark-scheme-button').forEach(btn => btn.textContent = 'Show Mark Scheme');

            // Reset Read Checkboxes
            document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);
            // Reset Final Score
            currentScore = 0; scoreCalculated = false;
            document.getElementById('final-score-area').style.display = 'none';
            const currentScoreValEl = document.getElementById('current-score-value');
            const totalPossibleScoreValEl = document.getElementById('total-possible-score-value');
            if(currentScoreValEl) currentScoreValEl.textContent = '0';
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore; // Keep total updated
            document.getElementById('final-score-feedback').textContent = '';

            document.querySelectorAll('section[id^="task"]').forEach(section => checkTaskCompletion(section.id));
            alert("All tasks have been reset.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- PDF Export ---
        function exportToPDF() { /* ... standard PDF export logic ... */ }

        // --- DOMContentLoaded ---
        document.addEventListener('DOMContentLoaded', () => {
            addTooltips();
            setupTermMatching();
            if(bandwidthSlider) bandwidthSlider.addEventListener('input', updateBandwidthSim); updateBandwidthSim();
            if(usersSlider) usersSlider.addEventListener('input', updateUsersSim); updateUsersSim();
            setupMediaSort();

            document.querySelectorAll('.quiz-item .option-button').forEach(button => {
                button.addEventListener('click', () => {
                    const quizItem = button.closest('.quiz-item');
                    if (quizItem && !quizItem.closest('#task1-keyterms-matching') && !quizItem.closest('#task4-transmission-media') && !quizItem.querySelector('.option-button:disabled')) {
                        // Generic handler for simple quiz questions in Task 2 & 3
                        const correctAnswer = quizItem.dataset.correct; // Assuming data-correct is set on quiz-item
                        const selectedAnswer = button.dataset.answer;
                        const feedbackEl = quizItem.querySelector('.feedback');
                        const options = quizItem.querySelectorAll('.option-button');

                        options.forEach(opt => opt.disabled = true);
                        button.classList.add('selected');

                        if (selectedAnswer === correctAnswer) {
                            button.classList.add('correct');
                            if(feedbackEl) { feedbackEl.textContent = 'Correct!'; feedbackEl.className = 'feedback correct';}
                            quizItem.dataset.answeredCorrectly = "true";
                        } else {
                            button.classList.add('incorrect');
                            if(feedbackEl) { feedbackEl.textContent = `Incorrect. The correct answer was ${correctAnswer}.`; feedbackEl.className = 'feedback incorrect';}
                            quizItem.dataset.answeredCorrectly = "false";
                            options.forEach(opt => { if (opt.dataset.answer === correctAnswer) opt.classList.add('correct'); });
                        }
                        quizItem.dataset.answered = "true";
                        const section = quizItem.closest('section');
                        if (section) checkTaskCompletion(section.id);
                        if(scoreCalculated) calculateScore();
                    }
                });
            });

            document.querySelectorAll('.read-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    console.log(`Section read status changed for: ${event.target.closest('section').id}`);
                });
            });
            
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#starter-activity') || item.closest('#exam-practice')) return;
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            const totalPossibleScoreValEl = document.getElementById('total-possible-score-value');
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf').addEventListener('click', exportToPDF);
        });