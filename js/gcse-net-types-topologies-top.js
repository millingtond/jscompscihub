// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "network topology": "The physical or logical arrangement of nodes and connections within a network.",
            "star topology": "A LAN configuration in which a central node (e.g., a switch or hub) controls all message traffic. All devices connect directly to this central node.",
            "star topology benefits": "It is easy to add a new node or device to network... just connect to switch (or via WAP). Fewer data collisions can occur... Each device has a direct connection to switch. If a node or device fails it does not affect the rest of the network. A signal does not need to be transmitted to all computers in the network.",
            "mesh topology": "A network setup where devices are interconnected with many redundant interconnections between network nodes. In a full mesh, every node is connected to every other node.",
            "mesh network": "Nodes communicate with each other directly (rather than through switch). Nodes can act as both clients (devices that receive information) and servers (devices that provide information). No central point of control or failure. i.e. no switch. Often used in environments where traditional networks are impractical or unreliable e.g. disaster relief efforts or in outdoor/rural areas, festivals with limited connectivity. Can be wired or wireless, and can use a variety of protocols and technologies to communicate.",
            "mesh network benefits": "Resilience... If one node fails, the network can re-route traffic through other nodes. Scalability... highly scalable because new nodes can be added to the network easily. Cost-effective... more cost-effective because they do not require as much infrastructure (network hardware) or maintenance. Privacy and security... Can provide greater privacy and security than traditional networks because data is not routed through a central hub or router. Low latency... can provide low latency because data is transmitted directly between nodes.",
            "node": "A device connected to a network, such as a computer, printer, or server.",
            "switch": "A network device that connects devices on a LAN and uses MAC addresses to forward data intelligently to the intended recipient.",
            "hub": "This dumb network device has no means of storing MAC addresses so it sends all packets to all devices connected to it."
            // Add more keywords as needed
        };

        // --- Global Variables for Scoring ---
        let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;

        // --- Helper: Add Keyword Tooltips ---
        function addTooltips() { /* ... standard implementation ... */ }
        // --- Helper: Toggle Reveal ---
        function toggleReveal(contentId, buttonElement, revealText, hideText) { /* ... standard implementation ... */ }
        // --- Helper: Check Task Completion ---
        function checkTaskCompletion(sectionId) { /* ... standard implementation ... */ }
        
        // --- Starter Activity Logic ---
        // Simple reveal for answers.

        // --- Task 1 & 2: Star and Mesh Topology Descriptions and Quizzes ---
        function checkStarTopology() { /* ... JS for checking Star description and multi-select ... */ }
        function resetStarTopology() { /* ... JS for resetting Task 1 ... */ }
        function checkMeshTopology() { /* ... JS for checking Mesh description and multi-select ... */ }
        function resetMeshTopology() { /* ... JS for resetting Task 2 ... */ }
        
        // --- Task 3: Topology Diagram (Device Placement) ---
        let draggedTopologyDevice = null;
        function setupTopologyDiagramTask() {
            const paletteElement = document.getElementById('topology-device-palette');
            const dropzoneElement = document.getElementById('star-center-dropzone');
            if (!paletteElement || !dropzoneElement) return;

            // Make palette items draggable
            paletteElement.querySelectorAll('.topology-device-icon').forEach(icon => {
                icon.draggable = true; // Ensure draggable is true
                icon.addEventListener('dragstart', e => {
                    draggedTopologyDevice = e.target; // Store the actual element
                    e.dataTransfer.setData('text/id', e.target.id || e.target.dataset.device); // Use ID or data-device
                    e.dataTransfer.effectAllowed = 'move';
                    setTimeout(() => draggedTopologyDevice.classList.add('dragging'), 0);
                });
                icon.addEventListener('dragend', () => {
                    if (draggedTopologyDevice) draggedTopologyDevice.classList.remove('dragging');
                    draggedTopologyDevice = null;
                });
            });

            // Configure the main dropzone
            configureTopologyDropZone(dropzoneElement, paletteElement);

            // Configure the palette to also be a dropzone (for returning items)
            configureTopologyDropZone(paletteElement, paletteElement);
        }

        function configureTopologyDropZone(zoneElement, paletteElement) {
            zoneElement.addEventListener('dragover', e => {
                e.preventDefault();
                const isTargetDropzone = zoneElement.id === 'star-center-dropzone';
                const targetIsEmptyOrPlaceholder = !zoneElement.querySelector('.topology-device-icon') ||
                                               (zoneElement.children.length === 1 && zoneElement.firstElementChild.tagName === 'SPAN');

                if (zoneElement.id === 'topology-device-palette' || (isTargetDropzone && targetIsEmptyOrPlaceholder)) {
                    zoneElement.classList.add('dragover');
                    e.dataTransfer.dropEffect = 'move';
                } else {
                    zoneElement.classList.remove('dragover');
                    e.dataTransfer.dropEffect = 'none';
                }
            });

            zoneElement.addEventListener('dragleave', () => {
                zoneElement.classList.remove('dragover');
            });

            zoneElement.addEventListener('drop', e => {
                e.preventDefault();
                zoneElement.classList.remove('dragover');
                const draggedId = e.dataTransfer.getData('text/id');
                const itemToDrop = document.getElementById(draggedId) || document.querySelector(`.topology-device-icon[data-device="${draggedId}"]`);


                if (itemToDrop && draggedTopologyDevice === itemToDrop) {
                    const targetZoneId = zoneElement.id;

                    if (targetZoneId === 'star-center-dropzone') {
                        const existingDevice = zoneElement.querySelector('.topology-device-icon');
                        if (existingDevice && existingDevice !== itemToDrop) {
                            paletteElement.appendChild(existingDevice);
                            existingDevice.classList.remove('correct', 'incorrect');
                        }
                        zoneElement.innerHTML = ''; // Clear placeholder
                        zoneElement.appendChild(itemToDrop);
                        itemToDrop.classList.remove('correct', 'incorrect');
                        zoneElement.classList.add('filled');
                    } else if (targetZoneId === 'topology-device-palette') {
                        if (itemToDrop.parentElement && itemToDrop.parentElement.id === 'star-center-dropzone') {
                            const starZone = document.getElementById('star-center-dropzone');
                            starZone.innerHTML = '<span class="text-xs text-gray-400">Drop Central Device Here</span>';
                            starZone.classList.remove('filled');
                        }
                        paletteElement.appendChild(itemToDrop);
                        itemToDrop.classList.remove('correct', 'incorrect');
                    }
                }
                draggedTopologyDevice = null;
            });
        }
        function checkTopologyDevice() {
            const dropzone = document.getElementById('star-center-dropzone');
            const feedbackDiv = document.getElementById('topology-device-feedback');
            const quizItem = dropzone.closest('.quiz-item');
            if(!dropzone || !feedbackDiv || !quizItem) return;

            const placedDevice = dropzone.querySelector('.topology-device-icon');
            quizItem.dataset.answered = "true";

            if (placedDevice && placedDevice.dataset.device === dropzone.dataset.accept) {
                placedDevice.classList.add('correct'); placedDevice.classList.remove('incorrect');
                feedbackDiv.innerHTML = `<p class="correct-feedback">Correct! A switch (or hub) is the central device in a Star topology. (+1 point)</p>`;
                quizItem.dataset.answeredCorrectly = "true";
            } else if (placedDevice) {
                placedDevice.classList.add('incorrect'); placedDevice.classList.remove('correct');
                feedbackDiv.innerHTML = `<p class="incorrect-feedback">Incorrect device. A Star topology uses a central switch or hub.</p>`;
                quizItem.dataset.answeredCorrectly = "false";
            } else {
                feedbackDiv.innerHTML = `<p class="incorrect-feedback">No device placed in the central position.</p>`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            feedbackDiv.classList.add('show');
            checkTaskCompletion('task3-topology-diagram');
            if(scoreCalculated) calculateScore();
        }
        function resetTopologyDevice() {
            const dropzone = document.getElementById('star-center-dropzone');
            const palette = document.getElementById('topology-device-palette');
            const feedbackDiv = document.getElementById('topology-device-feedback');
            const quizItem = dropzone.closest('.quiz-item');

            if(dropzone && palette) {
                const placedDevice = dropzone.querySelector('.topology-device-icon');
                if(placedDevice) {
                    placedDevice.classList.remove('correct', 'incorrect'); // Clear visual status
                    palette.appendChild(placedDevice); // Move the actual device element back
                }
                dropzone.classList.remove('filled'); // Mark as not filled
                dropzone.innerHTML = '<span class="text-xs text-gray-400">Drop Central Device Here</span>'; // Restore placeholder
            }
            if(feedbackDiv) feedbackDiv.classList.remove('show');
            if(quizItem) {quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered;}
            checkTaskCompletion('task3-topology-diagram');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 4: Scenario Challenge ---
        function checkAllTopologyScenarios() { /* ... JS for checking scenario choices and justifications ... */ }
        function resetTopologyScenarios() { /* ... JS for resetting Task 4 ... */ }

        // --- Exam Practice Question Logic ---
        function checkThenToggleMarkScheme(textareaId, markschemeId, buttonElement, minLength = 10) { /* ... standard implementation ... */ }

        // --- Final Score Calculation ---
        function calculateScore() { /* ... standard implementation ... */ }

        // --- Reset All Tasks ---
        function resetAllTasks() { /* ... standard implementation ... */ }

        // --- PDF Export ---
        function exportToPDF() { /* ... standard PDF export logic ... */ }


        // --- DOMContentLoaded ---
        document.addEventListener('DOMContentLoaded', () => {
            addTooltips();
            setupTopologyDiagramTask(); // For Task 3

            // Generic quiz handler for simple option buttons (used in Task 1 & 2 for multi-select, and Task 4 for scenario choice)
            document.querySelectorAll('.quiz-item .option-button').forEach(button => {
                button.addEventListener('click', () => {
                    const quizItem = button.closest('.quiz-item');
                    if (!quizItem) return;
                    
                    if (button.classList.contains('multi-select')) {
                        if (!quizItem.dataset.answered) { 
                            button.classList.toggle('selected');
                        }
                    } 
                    else if (!quizItem.dataset.answered) { 
                        quizItem.querySelectorAll('.option-button').forEach(opt => opt.classList.remove('selected'));
                        button.classList.add('selected');
                    }
                });
            });
            
            document.querySelectorAll('.read-checkbox').forEach(checkbox => { /* ... */ });
            
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

        // --- Implementations for Task 1 & 2 ---
        function checkStarTopology() {
            const descTextarea = document.getElementById('star-desc');
            const quizItemDesc = descTextarea.closest('.quiz-item');
            const descAnswer = descTextarea.value.toLowerCase();
            let descCorrect = false;
            const descKeywords = ["node", "switch", "hub", "cable", "central", "connect"];
            if (descKeywords.every(kw => descAnswer.includes(kw))) {
                descTextarea.classList.add('correct'); descTextarea.classList.remove('incorrect');
                descCorrect = true;
            } else {
                descTextarea.classList.add('incorrect'); descTextarea.classList.remove('correct');
            }
            quizItemDesc.dataset.answered = "true";
            quizItemDesc.dataset.answeredCorrectly = descCorrect.toString();


            const multiSelectQuizItem = document.querySelector('#task1-star-topology .quiz-item[data-points="3"]');
            const selectedOptions = multiSelectQuizItem.querySelectorAll('.option-button.selected');
            const feedbackEl = multiSelectQuizItem.querySelector('.feedback');
            let correctSelections = 0;
            let incorrectSelections = 0;
            
            selectedOptions.forEach(opt => {
                opt.classList.remove('correct', 'incorrect'); // Clear previous
                if (opt.dataset.correct === "true") {
                    opt.classList.add('correct');
                    correctSelections++;
                } else {
                    opt.classList.add('incorrect');
                    incorrectSelections++;
                }
            });
            
            // Mark unselected correct answers as incorrect for feedback if "checked"
             multiSelectQuizItem.querySelectorAll('.option-button[data-correct="true"]:not(.selected)').forEach(opt => opt.classList.add('incorrect'));


            multiSelectQuizItem.dataset.answered = "true";
            // Award points: 1 per correct, minus 1 per incorrect, max 3, min 0
            const pointsAwarded = Math.max(0, Math.min(3, correctSelections - incorrectSelections));
             if (pointsAwarded === 3 && incorrectSelections === 0) { // Perfect score
                multiSelectQuizItem.dataset.answeredCorrectly = "true";
                feedbackEl.innerHTML = `<p class="correct-feedback">All advantages correctly identified! (+${pointsAwarded} points)</p>`;
            } else {
                multiSelectQuizItem.dataset.answeredCorrectly = "false";
                feedbackEl.innerHTML = `<p class="incorrect-feedback">You selected ${correctSelections} correct and ${incorrectSelections} incorrect advantages. Review the highlighted items. (+${pointsAwarded} points)</p>`;
            }
            feedbackEl.classList.add('show');
            checkTaskCompletion('task1-star-topology');
            if(scoreCalculated) calculateScore();
        }
        function resetStarTopology() {
            const descTextarea = document.getElementById('star-desc');
            descTextarea.value = ''; descTextarea.classList.remove('correct', 'incorrect');
            const descQI = descTextarea.closest('.quiz-item');
            if(descQI) { descQI.dataset.answeredCorrectly = "false"; delete descQI.dataset.answered; }
            document.getElementById('star-desc-answer').classList.remove('show');

            const multiSelectQuizItem = document.querySelector('#task1-star-topology .quiz-item[data-points="3"]');
            multiSelectQuizItem.querySelectorAll('.option-button').forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
                btn.disabled = false;
            });
            const feedbackEl = multiSelectQuizItem.querySelector('.feedback');
            if(feedbackEl) { feedbackEl.classList.remove('show'); feedbackEl.innerHTML = ''; }
            multiSelectQuizItem.dataset.answeredCorrectly = "false"; delete multiSelectQuizItem.dataset.answered;
            checkTaskCompletion('task1-star-topology');
            if(scoreCalculated) calculateScore();
        }

        function checkMeshTopology() {
            const descTextarea = document.getElementById('mesh-desc');
            const quizItemDesc = descTextarea.closest('.quiz-item');
            const descAnswer = descTextarea.value.toLowerCase();
            let descCorrect = false;
            const descKeywords = ["node", "direct", "connect", "every other", "multiple paths"];
             if (descKeywords.some(kw => descAnswer.includes(kw))) { // Changed to some for flexibility
                descTextarea.classList.add('correct'); descTextarea.classList.remove('incorrect');
                descCorrect = true;
            } else {
                descTextarea.classList.add('incorrect'); descTextarea.classList.remove('correct');
            }
            quizItemDesc.dataset.answered = "true";
            quizItemDesc.dataset.answeredCorrectly = descCorrect.toString();

            const multiSelectQuizItem = document.querySelector('#task2-mesh-topology .quiz-item[data-points="3"]');
            const selectedOptions = multiSelectQuizItem.querySelectorAll('.option-button.selected');
            const feedbackEl = multiSelectQuizItem.querySelector('.feedback');
            let correctSelections = 0;
            let incorrectSelections = 0;

            selectedOptions.forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
                if (opt.dataset.correct === "true") {
                    opt.classList.add('correct');
                    correctSelections++;
                } else {
                    opt.classList.add('incorrect');
                    incorrectSelections++;
                }
            });
             multiSelectQuizItem.querySelectorAll('.option-button[data-correct="true"]:not(.selected)').forEach(opt => opt.classList.add('incorrect'));

            multiSelectQuizItem.dataset.answered = "true";
            const pointsAwarded = Math.max(0, Math.min(3, correctSelections - incorrectSelections));
            if (pointsAwarded === 3 && incorrectSelections === 0) {
                multiSelectQuizItem.dataset.answeredCorrectly = "true";
                feedbackEl.innerHTML = `<p class="correct-feedback">All advantages correctly identified! (+${pointsAwarded} points)</p>`;
            } else {
                multiSelectQuizItem.dataset.answeredCorrectly = "false";
                feedbackEl.innerHTML = `<p class="incorrect-feedback">You selected ${correctSelections} correct and ${incorrectSelections} incorrect advantages. Review the highlighted items. (+${pointsAwarded} points)</p>`;
            }
            feedbackEl.classList.add('show');
            checkTaskCompletion('task2-mesh-topology');
            if(scoreCalculated) calculateScore();
        }
         function resetMeshTopology() {
            const descTextarea = document.getElementById('mesh-desc');
            descTextarea.value = ''; descTextarea.classList.remove('correct', 'incorrect');
             const descQI = descTextarea.closest('.quiz-item');
            if(descQI) { descQI.dataset.answeredCorrectly = "false"; delete descQI.dataset.answered; }
            document.getElementById('mesh-desc-answer').classList.remove('show');

            const multiSelectQuizItem = document.querySelector('#task2-mesh-topology .quiz-item[data-points="3"]');
            multiSelectQuizItem.querySelectorAll('.option-button').forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
                btn.disabled = false;
            });
            const feedbackEl = multiSelectQuizItem.querySelector('.feedback');
            if(feedbackEl) { feedbackEl.classList.remove('show'); feedbackEl.innerHTML = '';}
            multiSelectQuizItem.dataset.answeredCorrectly = "false"; delete multiSelectQuizItem.dataset.answered;
            checkTaskCompletion('task2-mesh-topology');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 4: Scenario Challenge ---
        function checkAllTopologyScenarios() {
            let allCorrectAndJustified = true;
            document.querySelectorAll('#task4-scenario-challenge .quiz-item').forEach(quizItem => {
                const selectedButton = quizItem.querySelector('.option-button.selected');
                const justificationTextarea = quizItem.querySelector('textarea');
                const feedbackEl = quizItem.querySelector('.feedback');
                const correctAnswerTopology = quizItem.dataset.correctTopology;
                let justificationKeywords;

                if (correctAnswerTopology === "star") {
                    justificationKeywords = ['central', 'easy add', 'manage', 'printer share', 'server access', 'isolate fault'];
                } else { // mesh
                    justificationKeywords = ['reliable', 'redundant', 'no single fail', 'multiple path', 'critical'];
                }

                quizItem.dataset.answered = "true";
                let modelChoiceCorrect = false;
                let justificationSufficient = false;

                if (selectedButton) {
                    if (selectedButton.dataset.answer === correctAnswerTopology) {
                        selectedButton.classList.add('correct'); modelChoiceCorrect = true;
                    } else {
                        selectedButton.classList.add('incorrect'); allCorrectAndJustified = false;
                        quizItem.querySelector(`.option-button[data-answer="${correctAnswerTopology}"]`)?.classList.add('correct');
                    }
                } else { allCorrectAndJustified = false; }

                if (justificationTextarea) {
                    const userJustification = justificationTextarea.value.toLowerCase().trim();
                    if (userJustification.length < 10) {
                        justificationSufficient = false; allCorrectAndJustified = false;
                        justificationTextarea.classList.add('incorrect');
                    } else if (justificationKeywords.some(kw => userJustification.includes(kw))) {
                        justificationTextarea.classList.add('correct'); justificationSufficient = true;
                    } else {
                        justificationTextarea.classList.add('incorrect'); justificationSufficient = false; allCorrectAndJustified = false;
                    }
                } else { allCorrectAndJustified = false; }
                
                quizItem.dataset.answeredCorrectly = (modelChoiceCorrect && justificationSufficient).toString();

                if (modelChoiceCorrect && justificationSufficient) {
                    feedbackEl.textContent = 'Correct topology and good justification!'; feedbackEl.className = 'feedback correct';
                } else {
                    let fbText = "";
                    if (!selectedButton) fbText += "No topology selected. ";
                    else if (!modelChoiceCorrect) fbText += `Incorrect topology (should be ${correctAnswerTopology}). `;
                    else fbText += "Correct topology. ";

                    if (!justificationTextarea || justificationTextarea.value.trim().length < 10) fbText += "Justification is too short or missing. ";
                    else if (!justificationSufficient) fbText += "Justification needs more relevant keywords. ";
                    else fbText += "Justification looks okay. ";
                    
                    feedbackEl.textContent = fbText.trim(); feedbackEl.className = 'feedback incorrect';
                }
            });
            checkTaskCompletion('task4-scenario-challenge');
            if(scoreCalculated) calculateScore();
        }
        function resetTopologyScenarios() {
            document.querySelectorAll('#task4-scenario-challenge .quiz-item').forEach(quizItem => {
                quizItem.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = false;
                });
                const textarea = quizItem.querySelector('textarea');
                if(textarea) { textarea.value = ''; textarea.classList.remove('correct', 'incorrect'); }
                const feedbackEl = quizItem.querySelector('.feedback');
                if(feedbackEl) feedbackEl.textContent = '';
                quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered;
            });
            checkTaskCompletion('task4-scenario-challenge');
            if(scoreCalculated) calculateScore();
        }