// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "network": "Two or more computers/devices connected together to share resources, data, or communicate.",
            "lan": "Local Area Network: Computers are connected to each other and use MAC addresses to communicate. Restricted to a small geographical area / site / other suitable example. Hardware (routers,WAPs, switch) owned by the company/home owners.",
            "wan": "Wide Area Network: Network that spans a large geographical area. Communication medium (cables that connect networks together) is owned by telecommunications companies e.g. BT.",
            "client-server": "A network model where client computers request services/resources from a central server computer. (Also: A network that uses central computers, known as servers to enable resource sharing and to facilitate communication between the other computers on the network.)",
            "client-server network": "A network that uses central computers, known as servers... to enable resource sharing.... and to facilitate communication between the other computers on the network.",
            "client-server benefits": "All files can be stored centrally so workers can access files from any computer. Backups are central, all data is backed up each time, individual computers do not need to backup their own data. Monitor clients to ensure they are working correctly. Upgrade software centrally so you do not have to install on each computer individually. Central security (antivirus / firewall) - do not need to install protection on all computers, easier to manage security and install security updates.",
            "peer-to-peer": "A network model where all computers have equal status and can share resources directly with each other without a central server. (Also: No server. Computers are directly connected to each other. Computers are independent. Computers will have software installed/updated individually... no central installation/updates. Computers will need own security // no central security. Computers will have their own files // no central file storage.)",
            "peer-to-peer network": "No server. Computers are directly connected to each other. Computers are independent. Computers will have software installed/updated individually... no central installation/updates. Computers will need own security // no central security. Computers will have their own files // no central file storage.",
            "peer to peer benefits": "No server required... Less initial cost. No specialist required to set up server and manage it. Easier to add new devices. If any device fails the network will not go down. Suitable for networks where need for sharing files is low."
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
                
                const optionsSelected = Array.from(item.querySelectorAll('.option-button.selected')).length > 0;
                const textareaFilled = item.querySelector('textarea') ? item.querySelector('textarea').value.trim() !== '' : false;
                const dropzoneFilled = item.querySelector('.model-dropzone') ? item.querySelector('.model-dropzone .model-characteristic') !== null : false;
                
                if (!item.dataset.answered && !optionsSelected && !textareaFilled && !dropzoneFilled) {
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

        // --- Task 1: LAN vs. WAN Quiz ---
        document.querySelectorAll('#task1-lan-wan-quiz .option-button').forEach(button => {
            button.addEventListener('click', () => {
                const quizItem = button.closest('.quiz-item');
                if (quizItem.dataset.answered === 'true') return;

                const options = quizItem.querySelectorAll('.option-button');
                options.forEach(opt => opt.disabled = true);
                button.classList.add('selected');
                quizItem.dataset.answered = "true";

                const correctAnswer = quizItem.dataset.correct;
                const selectedAnswer = button.dataset.answer;
                const feedbackEl = quizItem.querySelector('.feedback');

                if (selectedAnswer === correctAnswer) {
                    button.classList.add('correct');
                    feedbackEl.textContent = 'Correct!';
                    feedbackEl.className = 'feedback correct';
                    quizItem.dataset.answeredCorrectly = "true";
                } else {
                    button.classList.add('incorrect');
                    feedbackEl.textContent = `Incorrect. The correct answer involves thinking about ${correctAnswer.replace('_', ' ')}.`;
                    feedbackEl.className = 'feedback incorrect';
                    quizItem.dataset.answeredCorrectly = "false";
                    options.forEach(opt => { if (opt.dataset.answer === correctAnswer) opt.classList.add('correct'); });
                }
                checkTaskCompletion('task1-lan-wan-quiz');
                if(scoreCalculated) calculateScore();
            });
        });
        function resetTask1Quiz() {
            document.querySelectorAll('#task1-lan-wan-quiz .quiz-item').forEach(quizItem => {
                quizItem.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = false;
                });
                const feedbackEl = quizItem.querySelector('.feedback');
                if(feedbackEl) feedbackEl.textContent = '';
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            });
            checkTaskCompletion('task1-lan-wan-quiz');
            if(scoreCalculated) calculateScore();
        }
        
        // --- Task 2: Network Model Sorter ---
        let draggedModelItem = null;
        const modelBank = document.getElementById('model-bank');
        const modelDropzones = document.querySelectorAll('#task2-model-sorter .model-dropzone');
        const modelSortFeedback = document.getElementById('model-sort-feedback');

        function setupModelSorter() {
            if(!modelBank) return;
            modelBank.querySelectorAll('.model-characteristic').forEach(card => {
                card.draggable = true;
                card.addEventListener('dragstart', e => {
                    draggedModelItem = e.target;
                    setTimeout(() => e.target.classList.add('dragging'), 0);
                });
                card.addEventListener('dragend', e => {
                    setTimeout(() => e.target.classList.remove('dragging'), 0);
                    draggedModelItem = null;
                });
            });

            modelDropzones.forEach(zone => {
                zone.addEventListener('dragover', e => { e.preventDefault(); if(zone.children.length === 0) zone.classList.add('dragover'); }); // Only highlight if empty
                zone.addEventListener('dragleave', e => zone.classList.remove('dragover'));
                zone.addEventListener('drop', e => {
                    e.preventDefault();
                    zone.classList.remove('dragover');
                    if (draggedModelItem && zone.children.length === 0) { // Only drop if zone is empty
                        zone.appendChild(draggedModelItem);
                        draggedModelItem.classList.remove('correct', 'incorrect');
                    }
                });
            });
            modelBank.addEventListener('dragover', e => e.preventDefault());
            modelBank.addEventListener('drop', e => {
                e.preventDefault();
                if (draggedModelItem) {
                    modelBank.appendChild(draggedModelItem);
                    draggedModelItem.classList.remove('correct', 'incorrect');
                }
            });
        }
        function checkModelSort() {
            if(!modelSortFeedback || !modelBank) return;
            let correctCount = 0;
            const characteristics = document.querySelectorAll('#task2-model-sorter .model-characteristic');
            const totalCharacteristicsToPlace = characteristics.length - modelBank.children.length; 
            let allAttempted = modelBank.children.length === 0;


            modelDropzones.forEach(zone => {
                const modelType = zone.dataset.model;
                zone.querySelectorAll('.model-characteristic').forEach(char => {
                    char.classList.remove('correct', 'incorrect');
                    let isCorrectPlacement = false;
                    if (modelType === 'client-server' && ['char-central', 'char-backup', 'char-scalable'].includes(char.id)) {
                        isCorrectPlacement = true;
                    } else if (modelType === 'p2p' && ['char-equal', 'char-direct', 'char-cheaper'].includes(char.id)) {
                        isCorrectPlacement = true;
                    }

                    if (isCorrectPlacement) {
                        char.classList.add('correct');
                        correctCount++;
                    } else {
                        char.classList.add('incorrect');
                    }
                });
            });
            
            if (!allAttempted && totalCharacteristicsToPlace > 0) { 
                alert("Please drag all characteristics to a model type before checking.");
                return;
            }

            const quizItem = modelBank.closest('.quiz-item');
            if (correctCount === totalCharacteristicsToPlace && totalCharacteristicsToPlace > 0) { 
                modelSortFeedback.innerHTML = `<p class="correct-feedback font-semibold">All characteristics sorted correctly! (+${quizItem.dataset.points} points)</p>`;
                quizItem.dataset.answeredCorrectly = "true";
            } else if (totalCharacteristicsToPlace === 0 && modelBank.children.length > 0) { 
                 modelSortFeedback.innerHTML = `<p class="incorrect-feedback font-semibold">Please drag the characteristics to the model boxes.</p>`;
                 quizItem.dataset.answeredCorrectly = "false";
            }
            else {
                modelSortFeedback.innerHTML = `<p class="incorrect-feedback font-semibold">Some characteristics are mismatched. You got ${correctCount}/${totalCharacteristicsToPlace} correct. Check red items.</p>`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            modelSortFeedback.classList.add('show');
            quizItem.dataset.answered = "true";
            checkTaskCompletion('task2-model-sorter');
            if(scoreCalculated) calculateScore();
        }
        function resetModelSort() {
            if(!modelBank || !modelSortFeedback) return;
            modelDropzones.forEach(zone => {
                zone.querySelectorAll('.model-characteristic').forEach(card => {
                    card.classList.remove('correct', 'incorrect');
                    modelBank.appendChild(card);
                });
            });
            modelSortFeedback.classList.remove('show');
            const quizItem = modelBank.closest('.quiz-item');
            if(quizItem) {
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            }
            checkTaskCompletion('task2-model-sorter');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 3: Network Simulation ---
        const simContainer = document.querySelector('.network-sim-container');
        const simDescription = document.getElementById('sim-description');
        let simTimeout;

        function createNetworkDevice(id, type, label, iconClass) {
            const device = document.createElement('div');
            device.id = `sim-${id}`;
            device.className = `network-device ${type}`;
            device.innerHTML = `<i class="fas ${iconClass}"></i><span>${label}</span>`;
            return device;
        }

        function setupNetworkSim(modelType) {
            if(!simContainer) return;
            simContainer.innerHTML = ''; 
            if (modelType === 'client-server') {
                simContainer.appendChild(createNetworkDevice('client1', 'client', 'Client 1', 'fa-laptop'));
                simContainer.appendChild(createNetworkDevice('server', 'server', 'Server', 'fa-server'));
                simContainer.appendChild(createNetworkDevice('client2', 'client', 'Client 2', 'fa-desktop'));
            } else { // p2p
                simContainer.appendChild(createNetworkDevice('peer1', 'peer', 'Peer A', 'fa-tablet-alt'));
                simContainer.appendChild(createNetworkDevice('peer2', 'peer', 'Peer B', 'fa-mobile-alt'));
                simContainer.appendChild(createNetworkDevice('peer3', 'peer', 'Peer C', 'fa-laptop-house'));
            }
        }

        function animateDataFlow(fromId, toId, message) {
            if(!simContainer || !simDescription) return;
            clearTimeout(simTimeout);
            simDescription.textContent = message;

            const fromDevice = document.getElementById(fromId);
            const toDevice = document.getElementById(toId);
            if (!fromDevice || !toDevice) return;

            const dataPacket = document.createElement('div');
            dataPacket.className = 'data-flow';
            simContainer.appendChild(dataPacket);

            const fromRect = fromDevice.getBoundingClientRect();
            const toRect = toDevice.getBoundingClientRect();
            const containerRect = simContainer.getBoundingClientRect();

            const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
            const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
            const endX = toRect.left + toRect.width / 2 - containerRect.left;
            const endY = toRect.top + toRect.height / 2 - containerRect.top;
            
            dataPacket.style.left = `${startX}px`;
            dataPacket.style.top = `${startY}px`;
            dataPacket.style.width = `0px`;

            requestAnimationFrame(() => { 
                dataPacket.classList.add('active');
                dataPacket.style.transform = `rotate(${Math.atan2(endY - startY, endX - startX)}rad)`;
                dataPacket.style.width = `${Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))}px`;
            });

            simTimeout = setTimeout(() => {
                dataPacket.remove();
                simDescription.textContent = "Simulation complete.";
            }, 1500); 
        }

        function simulateNetwork(type) {
            setupNetworkSim(type);
            if (type === 'client-server') {
                animateDataFlow('sim-client1', 'sim-server', "Client 1 requests a file from the Server...");
                simTimeout = setTimeout(() => {
                    animateDataFlow('sim-server', 'sim-client1', "Server sends the file back to Client 1.");
                }, 2000);
            } else { // p2p
                animateDataFlow('sim-peer1', 'sim-peer2', "Peer A shares a file directly with Peer B...");
            }
        }
        function resetNetworkSimulation(){
            if(!simContainer || !simDescription) return;
            clearTimeout(simTimeout);
            simContainer.innerHTML = '';
            simDescription.textContent = "Click a button to start.";
        }


        // --- Task 4: Benefits & Drawbacks ---
        const csBenefitKeywords = ["central", "backup", "security", "manage", "update", "monitor", "access files"];
        const csDrawbackKeywords = ["server fail", "cost", "expensive", "specialist", "expert", "dependent"];
        const p2pBenefitKeywords = ["easy setup", "cheap", "no server cost", "no specialist", "if one fails", "resilient"];
        const p2pDrawbackKeywords = ["security weak", "no central backup", "difficult manage", "slower many users", "files scattered"];

        function checkBenefitsDrawbacks() {
            const feedbackDiv = document.getElementById('benefits-drawbacks-feedback');
            if(!feedbackDiv) return;
            let allSectionsAttempted = true;
            let totalPointsAwarded = 0;

            const sections = [
                { inputs: ['cs-benefit1', 'cs-benefit2'], keywords: csBenefitKeywords, type: 'Client-Server Benefits', points: 0, quizItem: document.getElementById('cs-benefit1').closest('.quiz-item') },
                { inputs: ['cs-drawback1', 'cs-drawback2'], keywords: csDrawbackKeywords, type: 'Client-Server Drawbacks', points: 0, quizItem: document.getElementById('cs-drawback1').closest('.quiz-item') },
                { inputs: ['p2p-benefit1', 'p2p-benefit2'], keywords: p2pBenefitKeywords, type: 'Peer-to-Peer Benefits', points: 0, quizItem: document.getElementById('p2p-benefit1').closest('.quiz-item') },
                { inputs: ['p2p-drawback1', 'p2p-drawback2'], keywords: p2pDrawbackKeywords, type: 'Peer-to-Peer Drawbacks', points: 0, quizItem: document.getElementById('p2p-drawback1').closest('.quiz-item') }
            ];
            
            let feedbackHtml = "<ul>";

            sections.forEach(section => {
                let sectionPoints = 0;
                let sectionAttempted = false;
                section.inputs.forEach(inputId => {
                    const inputEl = document.getElementById(inputId);
                    inputEl.classList.remove('correct', 'incorrect');
                    const answer = inputEl.value.toLowerCase().trim();
                    if (answer !== "") sectionAttempted = true;

                    if (answer === "") {
                        allSectionsAttempted = false;
                        inputEl.classList.add('incorrect'); 
                    } else if (section.keywords.some(kw => answer.includes(kw))) {
                        inputEl.classList.add('correct');
                        sectionPoints++;
                    } else {
                        inputEl.classList.add('incorrect');
                    }
                });
                section.points = Math.min(2, sectionPoints); 
                totalPointsAwarded += section.points;
                feedbackHtml += `<li>${section.type}: ${section.points}/2 points.</li>`;
                if(section.quizItem) {
                    section.quizItem.dataset.answeredCorrectly = (section.points === 2).toString(); 
                    if(sectionAttempted) section.quizItem.dataset.answered = "true";
                }
            });
            
            feedbackHtml += "</ul>";

            if (!allSectionsAttempted) {
                alert("Please attempt to fill in all benefit and drawback fields.");
                feedbackDiv.innerHTML = '<p class="incorrect-feedback font-semibold">Please attempt all fields.</p>';
                feedbackDiv.classList.add('show');
                return;
            }
            
            if (totalPointsAwarded === 8) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">All sections look good! (+${totalPointsAwarded} points)</p>` + feedbackHtml;
            } else {
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Some points need review. You scored ${totalPointsAwarded}/8. Check red inputs.</p>` + feedbackHtml;
            }
            feedbackDiv.classList.add('show');
            checkTaskCompletion('task4-benefits-drawbacks');
            if(scoreCalculated) calculateScore();
        }
        function resetBenefitsDrawbacks() {
            ['cs-benefit1', 'cs-benefit2', 'cs-drawback1', 'cs-drawback2', 'p2p-benefit1', 'p2p-benefit2', 'p2p-drawback1', 'p2p-drawback2'].forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    el.value = '';
                    el.classList.remove('correct', 'incorrect');
                    const quizItem = el.closest('.quiz-item');
                    if(quizItem) {
                        quizItem.dataset.answeredCorrectly = "false";
                        delete quizItem.dataset.answered;
                    }
                }
            });
            const feedbackDiv = document.getElementById('benefits-drawbacks-feedback');
            if(feedbackDiv) feedbackDiv.classList.remove('show');
            checkTaskCompletion('task4-benefits-drawbacks');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 5: Scenario Choice ---
        document.querySelectorAll('#task5-scenario-choice .option-button').forEach(button => {
            button.addEventListener('click', () => {
                const quizItem = button.closest('.quiz-item');
                if (quizItem.dataset.answered === 'true' && !button.closest('#task5-scenario-choice .check-button')) return; 
                
                quizItem.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
            });
        });

        function checkAllScenarios() {
            let allCorrectAndJustified = true;
            document.querySelectorAll('#task5-scenario-choice .quiz-item').forEach(quizItem => {
                const selectedButton = quizItem.querySelector('.option-button.selected');
                const justificationTextarea = quizItem.querySelector('textarea');
                const feedbackEl = quizItem.querySelector('.feedback');
                const correctAnswerModel = quizItem.dataset.correctModel;
                let justificationKeywords;

                if (correctAnswerModel === "p2p") {
                    justificationKeywords = ['small', 'simple', 'cheap', 'direct share', 'no central', 'easy setup', 'cost effective'];
                } else { // client-server
                    justificationKeywords = ['large', 'central', 'manage', 'security', 'backup', 'authentication', 'scalable', 'control'];
                }

                quizItem.dataset.answered = "true";
                let modelChoiceCorrect = false;
                let justificationSufficient = false;

                if (selectedButton) {
                    selectedButton.disabled = true; 
                    quizItem.querySelectorAll('.option-button:not(.selected)').forEach(btn => btn.disabled = true);

                    if (selectedButton.dataset.answer === correctAnswerModel) {
                        selectedButton.classList.add('correct');
                        modelChoiceCorrect = true;
                    } else {
                        selectedButton.classList.add('incorrect');
                        quizItem.querySelector(`.option-button[data-answer="${correctAnswerModel}"]`)?.classList.add('correct');
                        allCorrectAndJustified = false;
                    }
                } else {
                    allCorrectAndJustified = false; 
                }

                if (justificationTextarea) {
                     justificationTextarea.disabled = true; 
                    const userJustification = justificationTextarea.value.toLowerCase().trim();
                    if (userJustification.length < 10) { 
                        justificationSufficient = false;
                        allCorrectAndJustified = false;
                        justificationTextarea.classList.add('incorrect');
                    } else if (justificationKeywords.some(kw => userJustification.includes(kw))) {
                        justificationTextarea.classList.add('correct');
                        justificationSufficient = true;
                    } else {
                        justificationTextarea.classList.add('incorrect');
                        justificationSufficient = false;
                        allCorrectAndJustified = false;
                    }
                } else {
                    allCorrectAndJustified = false; 
                }
                
                quizItem.dataset.answeredCorrectly = (modelChoiceCorrect && justificationSufficient).toString();

                if (modelChoiceCorrect && justificationSufficient) {
                    feedbackEl.textContent = 'Correct model and good justification!';
                    feedbackEl.className = 'feedback correct';
                } else {
                    let fbText = "";
                    if (!selectedButton) fbText += "No model selected. ";
                    else if (!modelChoiceCorrect) fbText += `Incorrect model (should be ${correctAnswerModel}). `;
                    else fbText += "Correct model. ";

                    if (!justificationTextarea || justificationTextarea.value.trim().length < 10) fbText += "Justification is too short or missing. ";
                    else if (!justificationSufficient) fbText += "Justification needs more relevant keywords. ";
                    else fbText += "Justification looks okay. ";
                    
                    feedbackEl.textContent = fbText.trim();
                    feedbackEl.className = 'feedback incorrect';
                }
            });
            checkTaskCompletion('task5-scenario-choice');
            if(scoreCalculated) calculateScore();
        }

         function resetScenarioChoice() {
            document.querySelectorAll('#task5-scenario-choice .quiz-item').forEach(quizItem => {
                quizItem.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = false;
                });
                const textarea = quizItem.querySelector('textarea');
                if(textarea) {
                    textarea.value = '';
                    textarea.classList.remove('correct', 'incorrect');
                    textarea.disabled = false;
                }
                const feedbackEl = quizItem.querySelector('.feedback');
                if(feedbackEl) feedbackEl.textContent = '';
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            });
            checkTaskCompletion('task5-scenario-choice');
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
                if (item.closest('#starter-activity') || item.closest('#exam-practice') || item.closest('#task3-network-simulation')) return;

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
            else if (percentage >= 80) feedbackMessage = "Great job! Strong understanding of network models.";
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
            document.getElementById('starter-lan').value = '';
            document.getElementById('starter-wan').value = '';
            document.getElementById('starter-q2-area').value = '';
            document.getElementById('starter-q3-benefits').value = '';
            const starterFeedback = document.getElementById('starter-networkmodels-answers-feedback');
            if (starterFeedback && starterFeedback.classList.contains('show')) {
                toggleReveal('starter-networkmodels-answers-feedback', starterFeedback.previousElementSibling, 'Reveal Example Answers', 'Hide Example Answers');
            }
            // Reset Task 1
            resetTask1Quiz();
            // Reset Task 2
            resetModelSort();
            // Reset Task 3
            resetNetworkSimulation();
            // Reset Task 4
            resetBenefitsDrawbacks();
            // Reset Task 5
            resetScenarioChoice();


            // Reset Exam Practice
            document.querySelectorAll('#exam-practice textarea, #exam-practice input[type="text"]').forEach(ta => ta.value = '');
            document.querySelectorAll('#exam-practice .mark-scheme').forEach(ms => {
                if (ms.classList.contains('show')) {
                    const button = ms.previousElementSibling; 
                    if (button && button.classList.contains('mark-scheme-button')) {
                         toggleReveal(ms.id, button, 'Show Mark Scheme', 'Hide Mark Scheme');
                    } else { 
                        ms.classList.remove('show');
                        const btnForMs = document.querySelector(`.mark-scheme-button[onclick*="${ms.id}"]`);
                        if(btnForMs) btnForMs.textContent = 'Show Mark Scheme';
                    }
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
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore; 
            document.getElementById('final-score-feedback').textContent = '';

            document.querySelectorAll('section[id^="task"]').forEach(section => checkTaskCompletion(section.id));
            alert("All tasks have been reset.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- PDF Export ---
        function exportToPDF() {
            alert("Preparing PDF. This might take a moment. Please ensure pop-ups are allowed. Interactive elements might not be fully captured in their current state.");
            const element = document.querySelector('.max-w-4xl.mx-auto.bg-white'); 
            const opt = {
                margin:       [0.5, 0.5, 0.7, 0.5], 
                filename:     'gcse-cs-network-models-worksheet.pdf',
                image:        { type: 'jpeg', quality: 0.95 },
                html2canvas:  { scale: 2, logging: false, useCORS: true, scrollY: -window.scrollY },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };
            const exportButton = document.getElementById('export-pdf');
            const resetButton = document.getElementById('reset-all-tasks');
            const calcScoreButton = document.getElementById('calculate-final-score');

            if(exportButton) exportButton.disabled = true;
            if(resetButton) resetButton.disabled = true;
            if(calcScoreButton) calcScoreButton.disabled = true;

            html2pdf().from(element).set(opt).save().then(function() {
                if(exportButton) exportButton.disabled = false;
                if(resetButton) resetButton.disabled = false;
                if(calcScoreButton) calcScoreButton.disabled = false;
            }).catch(function(error){
                console.error("Error generating PDF:", error);
                if(exportButton) exportButton.disabled = false;
                if(resetButton) resetButton.disabled = false;
                if(calcScoreButton) calcScoreButton.disabled = false;
            });
        }

        // --- DOMContentLoaded ---
        document.addEventListener('DOMContentLoaded', () => {
            addTooltips();
            // Removed setupTermMatching as it's not part of this lesson's HTML
            setupModelSorter(); // For Task 2
            setupNetworkSim('client-server'); // Initial sim view for Task 3

            document.querySelectorAll('.read-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    console.log(`Section read status changed for: ${event.target.closest('section').id}`);
                });
            });
            
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#starter-activity') || item.closest('#exam-practice') || item.closest('#task3-network-simulation')) return;
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            const totalPossibleScoreValEl = document.getElementById('total-possible-score-value');
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf').addEventListener('click', exportToPDF);
        });