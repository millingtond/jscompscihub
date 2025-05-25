// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "network": "Two or more computers/devices connected together to share resources, data, or communicate.",
            "lan": "Local Area Network: Computers are connected to each other and use MAC addresses to communicate. Restricted to a small geographical area / site / other suitable example. Hardware (routers,WAPs, switch) owned by the company/home owners.",
            "wan": "Wide Area Network: Network that spans a large geographical area. Communication medium (cables that connect networks together) is owned by telecommunications companies e.g. BT.",
            "nic": "Network Interface Card: A hardware component that connects a device to a computer network. Every networked device needs one, it has a unique MAC address.",
            "network interface card (nic)": "A hardware component that connects a device to a computer network. Every networked device needs one, it has a unique MAC address.",
            "switch": "Connects devices on a LAN, using MAC addresses to forward data packets only to their intended recipient. More efficient than a hub.",
            "router": "Connects different networks (e.g., a LAN to the Internet/WAN). Directs data packets between networks based on IP addresses. Receives packets from the internet. Has (public) IP address for LAN. Designates (private) IP addresses to network nodes. Maintain a routing table to identify efficient routes.",
            "wap": "Wireless Access Point: Network component which allows Wi-Fi enabled devices to connect to a network. Usually built into a router, and can be seen on the ceilings of schools and public buildings.",
            "wireless access point (wap)": "Network component which allows Wi-Fi enabled devices to connect to a network. Usually built into a router, and can be seen on the ceilings of schools and public buildings.",
            "transmission media": "The physical path between transmitter and receiver in a data transmission system, e.g., copper cables, fibre optic cables, wireless signals.",
            "copper cables": "The metal used inside standard data cables. Cheap to install and reliable but has more limited length and bandwidth. Needs repeaters to transmit signal further.",
            "fibre optic cables": "This transmission media is a cable that has a glass core. Data is sent as pulses of light. Higher bandwidth than copper. Suffer less interference than copper. More expensive.",
            "fibre optic": "This transmission media is a cable that has a glass core. Data is sent as pulses of light. Higher bandwidth than copper. Suffer less interference than copper. More expensive.",
            "fibre optic cable benefits": "Data transmission is faster - uses light. More secure. Difficult to intercept data. Less need for repeaters.",
            "repeater": "Receives and repeats a signal to extend its attenuation or range.",
            "hub": "This dumb network device has no means of storing MAC addresses so it sends all packets to all devices connected to it.",
            "mac address": "Unique identifier assigned to every NIC by the manufacturer. Switches use this to route packets. Short for Media Access Control Address. It can't be changed. Consists of six bytes written in hex, like this: A1:9E:13:7C:FF:04.",
            "modem": "Modulator-Demodulator: Converts digital signals from a computer to analogue signals for transmission over telephone lines, and vice-versa. Essential for DSL/cable internet."
        };

        // --- Global Variables for Scoring ---
        let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;

        // --- Helper: Add Keyword Tooltips ---
        function addTooltips() {
            // Basic keyword tooltips are primarily handled by CSS :hover using the .keyword and .tooltip classes.
            // This function could be expanded in the future for more advanced tooltip features,
            // such as dynamic positioning to avoid screen edges or ARIA attributes for accessibility.
            // For now, it serves as a placeholder if more complex JS-driven tooltip logic is needed.
            // Example:
            // document.querySelectorAll('.keyword').forEach(keywordEl => {
            //   const tooltipEl = keywordEl.querySelector('.tooltip');
            //   if (tooltipEl) {
            //     // Add event listeners for more complex interactions if needed
            //   }
            // });
        }

        // --- Helper: Toggle Reveal ---
        function toggleReveal(contentId, buttonElement, revealText, hideText) {
            const content = document.getElementById(contentId);
            if (!content || !buttonElement) {
                console.error("toggleReveal: Content or button element not found.", contentId, buttonElement);
                return;
            }

            if (content.classList.contains('show')) { // If currently shown, hide it
                content.classList.remove('show');
                buttonElement.textContent = revealText;
            } else { // If currently hidden, show it
                content.classList.add('show');
                buttonElement.textContent = hideText;
            }
        }

        // --- Helper: Check Task Completion ---
        function checkTaskCompletion(sectionId) {
            const section = document.getElementById(sectionId);
            if (!section) return;

            const match = sectionId.match(/^task(\d+)-/);
            if (!match) return; // Not a task section we're tracking this way

            const indicatorId = `task-${match[1]}-complete`;
            const indicator = document.getElementById(indicatorId);
            if (!indicator) return; // No indicator for this task (e.g. task 2 is exploratory)

            const quizItems = section.querySelectorAll('.quiz-item');
            if (quizItems.length === 0) {
                indicator.innerHTML = ''; // No quiz items to base completion on
                return;
            }

            let allAnswered = true;
            let allCorrect = true;
            let hasAttemptedItems = false;

            quizItems.forEach(item => {
                if (item.dataset.answered === 'true') {
                    hasAttemptedItems = true;
                    if (item.dataset.answeredCorrectly !== 'true') {
                        allCorrect = false;
                    }
                } else {
                    allAnswered = false;
                }
            });

            if (hasAttemptedItems) {
                if (allAnswered) {
                     indicator.innerHTML = allCorrect ? '<i class="fas fa-check-circle text-green-500 ml-2" title="Completed Correctly"></i>' : '<i class="fas fa-times-circle text-red-500 ml-2" title="Completed (some incorrect)"></i>';
                } else {
                    indicator.innerHTML = '<i class="fas fa-pencil-alt text-yellow-500 ml-2" title="In Progress"></i>';
                }
            } else {
                indicator.innerHTML = ''; // Not started or reset
            }
        }

        // --- Task 1: Hardware Matching ---
        let selectedHardwareTerm = null;
        let selectedHardwareDef = null;
        let hardwareMatchesMade = {};

        function setupHardwareMatching() {
            const termList = document.getElementById('hardware-term-list');
            const defList = document.getElementById('hardware-definition-list');
            const feedbackEl = document.getElementById('hardware-matching-feedback');
            if (!termList || !defList) return;

            selectedHardwareTerm = null; selectedHardwareDef = null; hardwareMatchesMade = {};
            termList.querySelectorAll('.matching-item').forEach(item => { item.classList.remove('selected', 'correct', 'incorrect', 'disabled'); item.disabled = false; item.onclick = () => handleHardwareMatchClick(item, 'term'); });
            defList.querySelectorAll('.matching-item').forEach(item => { item.classList.remove('selected', 'correct', 'incorrect', 'disabled'); item.disabled = false; item.onclick = () => handleHardwareMatchClick(item, 'definition'); });
            
            // Shuffle definitions
            for (let i = defList.children.length; i >= 0; i--) {
                defList.appendChild(defList.children[Math.random() * i | 0]);
            }

            if(feedbackEl) feedbackEl.classList.remove('show');
            const quizItem = termList.closest('.quiz-item');
            if(quizItem) { quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered; }
        }

        function handleHardwareMatchClick(item, type) {
            if (item.disabled) return;
            if (type === 'term') {
                if (selectedHardwareTerm) selectedHardwareTerm.classList.remove('selected');
                selectedHardwareTerm = item; item.classList.add('selected');
            } else {
                if (selectedHardwareDef) selectedHardwareDef.classList.remove('selected');
                selectedHardwareDef = item; item.classList.add('selected');
            }
            if (selectedHardwareTerm && selectedHardwareDef) attemptHardwareMatch();
        }

        function attemptHardwareMatch() {
            const termMatchId = selectedHardwareTerm.dataset.match;
            const defMatchId = selectedHardwareDef.dataset.match;

            selectedHardwareTerm.classList.remove('selected'); selectedHardwareDef.classList.remove('selected');

            if (termMatchId === defMatchId) {
                selectedHardwareTerm.classList.add('correct'); selectedHardwareDef.classList.add('correct');
                selectedHardwareTerm.disabled = true; selectedHardwareDef.disabled = true;
                hardwareMatchesMade[termMatchId] = true;
            } else {
                selectedHardwareTerm.classList.add('incorrect'); selectedHardwareDef.classList.add('incorrect');
                setTimeout(() => {
                    if (selectedHardwareTerm && !selectedHardwareTerm.classList.contains('correct')) selectedHardwareTerm.classList.remove('incorrect');
                    if (selectedHardwareDef && !selectedHardwareDef.classList.contains('correct')) selectedHardwareDef.classList.remove('incorrect');
                }, 800);
            }
            selectedHardwareTerm = null; selectedHardwareDef = null;
        }

        function checkHardwareMatches() {
            const feedbackEl = document.getElementById('hardware-matching-feedback');
            const termListEl = document.getElementById('hardware-term-list');
            if (!termListEl || !feedbackEl) return;

            const totalPairs = termListEl.children.length;
            const correctMatches = Object.keys(hardwareMatchesMade).length;
            let allAttempted = true;
            termListEl.querySelectorAll('.matching-item').forEach(term => {
                if(!term.disabled) allAttempted = false;
                if (!term.classList.contains('correct') && term.disabled === false) term.classList.add('incorrect'); // Mark unattempted as incorrect
            });
             document.getElementById('hardware-definition-list').querySelectorAll('.matching-item').forEach(def => {
                if (!def.classList.contains('correct') && def.disabled === false) def.classList.add('incorrect');
            });


            if (!allAttempted && totalPairs > 0) {
                alert("Please attempt to match all hardware components before checking.");
                return;
            }
            
            const quizItem = termListEl.closest('.quiz-item');
            if (correctMatches === totalPairs) {
                feedbackEl.innerHTML = `<p class="correct-feedback font-semibold">All components matched correctly! (+${quizItem.dataset.points} points)</p>`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                feedbackEl.innerHTML = `<p class="incorrect-feedback font-semibold">Some components are mismatched. You got ${correctMatches}/${totalPairs} correct. Check red items.</p>`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            feedbackEl.classList.add('show');
            quizItem.dataset.answered = "true";
            checkTaskCompletion('task1-hardware-matching');
            if(scoreCalculated) calculateScore();
        }
        function resetHardwareMatches() {
            setupHardwareMatching();
            checkTaskCompletion('task1-hardware-matching');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 2: LAN Diagram Builder ---
        const devicePalette = document.getElementById('device-palette');
        const lanCanvas = document.getElementById('lan-canvas');
        const connectionToggleBtn = document.getElementById('connection-type-toggle');
        let draggedDeviceElement = null;
        let isConnecting = false; // True when dragging a line between devices
        let firstDeviceForConnection = null; // The starting device for a new connection line
        let currentConnectionType = 'wired'; // 'wired' or 'wireless' for the line
        let tempLine = null; // The temporary line element shown during drag

        function setupLANDiagramBuilder() {
            if(!devicePalette || !lanCanvas || !connectionToggleBtn) return;

            devicePalette.querySelectorAll('.device-icon').forEach(icon => {
                icon.draggable = true;
                icon.addEventListener('dragstart', e => {
                    draggedDeviceElement = icon.cloneNode(true); // Clone to allow multiple drops
                    draggedDeviceElement.classList.remove('absolute'); // Ensure it's not absolutely positioned initially
                    e.dataTransfer.setData('text/plain', icon.dataset.type);
                    e.dataTransfer.effectAllowed = 'copy';
                });
            });

            lanCanvas.addEventListener('dragover', e => { e.preventDefault(); lanCanvas.classList.add('dragover'); e.dataTransfer.dropEffect = 'copy';});
            lanCanvas.addEventListener('dragleave', () => lanCanvas.classList.remove('dragover'));
            lanCanvas.addEventListener('drop', e => {
                e.preventDefault();
                lanCanvas.classList.remove('dragover');
                if (draggedDeviceElement) {
                    const newDevice = draggedDeviceElement.cloneNode(true); // Clone again for the canvas
                    newDevice.style.position = 'absolute';
                    const canvasRect = lanCanvas.getBoundingClientRect(); // Get canvas position and size

                    // Calculate mouse position relative to the canvas
                    const x = e.clientX - canvasRect.left; // Mouse X relative to canvas left edge
                    const y = e.clientY - canvasRect.top;  // Mouse Y relative to canvas top edge
                    newDevice.style.left = `${x - (newDevice.offsetWidth / 2)}px`; // Center icon horizontally
                    newDevice.style.top = `${y - (newDevice.offsetHeight / 2)}px`;  // Center icon vertically
                    newDevice.draggable = false; // Make it not draggable on canvas
                    newDevice.classList.add('on-canvas');
                    lanCanvas.appendChild(newDevice);
                    addConnectionPoints(newDevice);
                    // newDevice.addEventListener('click', handleCanvasDeviceClick); // This was for a two-click system, less relevant now
                }
            });

            connectionToggleBtn.addEventListener('click', () => {
                currentConnectionType = currentConnectionType === 'wired' ? 'wireless' : 'wired';
                connectionToggleBtn.textContent = `Line: ${currentConnectionType === 'wired' ? 'Wired (Solid)' : 'Wireless (Dashed)'}`;
            });
        }

        function addConnectionPoints(deviceEl) {
            const point = document.createElement('div');
            point.className = 'connection-point no-print';
            point.style.left = '50%';
            point.style.top = '50%';
            deviceEl.appendChild(point);
            point.addEventListener('mousedown', (event) => { // Changed from 'click'
                event.stopPropagation();
                event.preventDefault(); // Important to prevent default browser drag behaviors
                startConnectionDrag(deviceEl, event); // Pass the originating device and the mousedown event
            });
        }
        
        function startConnectionDrag(deviceElement, mousedownEvent) {
            if (isConnecting) return; // Already dragging a connection

            firstDeviceForConnection = deviceElement;
            isConnecting = true;
            lanCanvas.style.cursor = 'crosshair';

            tempLine = document.createElement('div');
            tempLine.className = `connection-line ${currentConnectionType}`;
            tempLine.style.position = 'absolute';
            tempLine.style.transformOrigin = '0 0';
            tempLine.style.pointerEvents = 'none'; // So it doesn't interfere with mouse events

            const canvasRect = lanCanvas.getBoundingClientRect();
            const rect1 = firstDeviceForConnection.getBoundingClientRect();
            const lineStartX = rect1.left + rect1.width / 2 - canvasRect.left + lanCanvas.scrollLeft;
            const lineStartY = rect1.top + rect1.height / 2 - canvasRect.top + lanCanvas.scrollTop;
            
            tempLine.style.left = `${lineStartX}px`;
            tempLine.style.top = `${lineStartY}px`;
            tempLine.style.width = '0px'; // Initial width, will be updated on mousemove
            lanCanvas.appendChild(tempLine);

            document.addEventListener('mousemove', handleConnectionDrag);
            document.addEventListener('mouseup', handleConnectionDrop);

            document.getElementById('diagram-instructions').textContent = "Drag to another device and release to connect.";
        }

        function handleConnectionDrag(e) {
            if (!isConnecting || !firstDeviceForConnection || !tempLine) return;
            e.preventDefault();

            const canvasRect = lanCanvas.getBoundingClientRect();
            const rect1 = firstDeviceForConnection.getBoundingClientRect();

            const lineStartX = rect1.left + rect1.width / 2 - canvasRect.left + lanCanvas.scrollLeft;
            const lineStartY = rect1.top + rect1.height / 2 - canvasRect.top + lanCanvas.scrollTop;

            const currentMouseX = e.clientX - canvasRect.left + lanCanvas.scrollLeft;
            const currentMouseY = e.clientY - canvasRect.top + lanCanvas.scrollTop;

            const dx = currentMouseX - lineStartX;
            const dy = currentMouseY - lineStartY;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            tempLine.style.width = `${length}px`;
            tempLine.style.transform = `rotate(${angle}deg)`;
        }

        function handleConnectionDrop(e) {
            if (!isConnecting) return;

            document.removeEventListener('mousemove', handleConnectionDrag);
            document.removeEventListener('mouseup', handleConnectionDrop);
            lanCanvas.style.cursor = 'default';

            if (tempLine) {
                tempLine.remove();
                tempLine = null;
            }

            let secondDeviceForConnection = null;
            const dropTarget = e.target.closest('.device-icon.on-canvas');
            if (dropTarget && dropTarget.classList.contains('on-canvas')) {
                secondDeviceForConnection = dropTarget;
            }
            
            if (firstDeviceForConnection && secondDeviceForConnection && firstDeviceForConnection !== secondDeviceForConnection) {
                drawConnectionLine(firstDeviceForConnection, secondDeviceForConnection, currentConnectionType);
            }

            isConnecting = false;
            firstDeviceForConnection = null;
            document.getElementById('diagram-instructions').textContent = "Drag devices. Click a device's connection point and drag to another to connect.";
        }

        function drawConnectionLine(device1, device2, type) {
            const line = document.createElement('div');
            line.className = `connection-line ${type}`; // Add no-print later if needed for PDF

            const rect1 = device1.getBoundingClientRect();
            const rect2 = device2.getBoundingClientRect();
            const canvasRect = lanCanvas.getBoundingClientRect();

            // Calculate center points relative to the canvas
            const x1 = rect1.left + rect1.width / 2 - canvasRect.left + lanCanvas.scrollLeft;
            const y1 = rect1.top + rect1.height / 2 - canvasRect.top + lanCanvas.scrollTop;
            const x2 = rect2.left + rect2.width / 2 - canvasRect.left + lanCanvas.scrollLeft;
            const y2 = rect2.top + rect2.height / 2 - canvasRect.top + lanCanvas.scrollTop;

            const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            line.style.width = `${length}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}deg)`;
            lanCanvas.appendChild(line);
        }


        function resetLANDiagram() {
            if(lanCanvas) lanCanvas.innerHTML = ''; // Clear canvas
            isConnecting = false;
            firstDeviceForConnection = null;
            if (tempLine && tempLine.parentNode) {
                tempLine.parentNode.removeChild(tempLine);
            }
            tempLine = null;
            // Clean up global listeners if they were active
            document.removeEventListener('mousemove', handleConnectionDrag);
            document.removeEventListener('mouseup', handleConnectionDrop);
            lanCanvas.style.cursor = 'default';
            
            if(document.getElementById('diagram-instructions')) document.getElementById('diagram-instructions').textContent = "Drag devices. Click a device's connection point and drag to another to connect.";
        }

        // --- Task 3: Transmission Media ---
        function checkTransmissionMedia() {
            const feedbackDiv = document.getElementById('transmission-media-feedback');
            if(!feedbackDiv) return;
            let allCorrect = true;
            const inputs = [
                { el: document.getElementById('copper-adv'), keywords: ["cheap", "cost", "easy install", "common"] },
                { el: document.getElementById('copper-disadv'), keywords: ["slower", "interference", "distance", "bandwidth limit", "less secure"] },
                { el: document.getElementById('fibre-adv'), keywords: ["fast", "bandwidth", "distance", "no interference", "secure"] },
                { el: document.getElementById('fibre-disadv'), keywords: ["expensive", "cost", "difficult install", "fragile"] }
            ];
            let feedbackHtml = "<ul>";
            let attemptedCount = 0;

            inputs.forEach(item => {
                item.el.classList.remove('correct', 'incorrect');
                const answer = item.el.value.toLowerCase().trim();
                if (answer === "") {
                    // Don't mark empty as incorrect immediately, wait for overall check
                } else {
                    attemptedCount++;
                    if (item.keywords.some(kw => answer.includes(kw))) {
                        item.el.classList.add('correct');
                        feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>${item.el.previousElementSibling.textContent} Good point.</li>`;
                    } else {
                        item.el.classList.add('incorrect');
                        feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>${item.el.previousElementSibling.textContent} Consider keywords like: ${item.keywords.slice(0,2).join('/')}.</li>`;
                        allCorrect = false;
                    }
                }
            });
             feedbackHtml += "</ul>";

            if (attemptedCount < inputs.length) {
                alert("Please attempt to fill in all advantage and disadvantage fields for transmission media.");
                return;
            }
            
            const quizItemCopper = document.getElementById('copper-adv').closest('.quiz-item');
            const quizItemFibre = document.getElementById('fibre-adv').closest('.quiz-item');

            if(quizItemCopper) {
                const copperAdvCorrect = document.getElementById('copper-adv').classList.contains('correct');
                const copperDisadvCorrect = document.getElementById('copper-disadv').classList.contains('correct');
                quizItemCopper.dataset.answeredCorrectly = (copperAdvCorrect && copperDisadvCorrect).toString();
                quizItemCopper.dataset.answered = "true";
            }
             if(quizItemFibre) {
                const fibreAdvCorrect = document.getElementById('fibre-adv').classList.contains('correct');
                const fibreDisadvCorrect = document.getElementById('fibre-disadv').classList.contains('correct');
                quizItemFibre.dataset.answeredCorrectly = (fibreAdvCorrect && fibreDisadvCorrect).toString();
                quizItemFibre.dataset.answered = "true";
            }


            if (allCorrect) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">All points seem relevant!</p>` + feedbackHtml;
            } else {
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Some points could be more specific. Check feedback.</p>` + feedbackHtml;
            }
            feedbackDiv.classList.add('show');
            checkTaskCompletion('task3-transmission-media');
            if(scoreCalculated) calculateScore();
        }
        function resetTransmissionMedia() {
            ['copper-adv', 'copper-disadv', 'fibre-adv', 'fibre-disadv'].forEach(id => {
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
            const feedbackDiv = document.getElementById('transmission-media-feedback');
            if(feedbackDiv) feedbackDiv.classList.remove('show');
            checkTaskCompletion('task3-transmission-media');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 4: Hardware Quiz ---
        document.querySelectorAll('#task4-hardware-quiz .option-button').forEach(button => {
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
                    feedbackEl.textContent = `Incorrect. The correct answer is more related to ${correctAnswer.replace(/_/g, ' ')}.`;
                    feedbackEl.className = 'feedback incorrect';
                    quizItem.dataset.answeredCorrectly = "false";
                    options.forEach(opt => { if (opt.dataset.answer === correctAnswer) opt.classList.add('correct'); });
                }
                checkTaskCompletion('task4-hardware-quiz');
                if(scoreCalculated) calculateScore();
            });
        });
        function resetTask4Quiz() {
             document.querySelectorAll('#task4-hardware-quiz .quiz-item').forEach(quizItem => {
                quizItem.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = false;
                });
                const feedbackEl = quizItem.querySelector('.feedback');
                if(feedbackEl) feedbackEl.textContent = '';
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            });
            checkTaskCompletion('task4-hardware-quiz');
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
                if (item.closest('#starter-activity') || item.closest('#exam-practice') || item.closest('#task2-lan-builder') || item.closest('#task3-network-simulation')) return; // Exclude non-scored

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
            else if (percentage >= 80) feedbackMessage = "Great job! Strong understanding of network hardware.";
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
            document.getElementById('starter-q1-lanwan').value = '';
            document.getElementById('starter-q2-topologies').value = '';
            document.getElementById('starter-q3-homeconnect').value = '';
            const starterFeedbackEl = document.getElementById('starter-hardware-answers-feedback');
            const starterRevealButton = document.querySelector("button[onclick*='starter-hardware-answers-feedback']");
            if (starterFeedbackEl) {
                starterFeedbackEl.classList.remove('show');
            }
            if (starterRevealButton) {
                starterRevealButton.textContent = 'Reveal Example Answers';
            }

            // Reset Task 1
            resetHardwareMatches();
            // Reset Task 2
            resetLANDiagram();
            // Reset Task 3
            resetTransmissionMedia();
            // Reset Task 4
            resetTask4Quiz();
            // Reset Task Completion Indicators for tasks 1, 3, 4
            checkTaskCompletion('task1-hardware-matching');
            checkTaskCompletion('task3-transmission-media');
            checkTaskCompletion('task4-hardware-quiz');

            // Reset Exam Practice
            document.querySelectorAll('#exam-practice textarea, #exam-practice input[type="text"]').forEach(ta => ta.value = '');
            document.querySelectorAll('#exam-practice .mark-scheme').forEach(ms => {
                if (ms.classList.contains('show')) {
                    const button = ms.previousElementSibling; 
                    if (button && button.classList.contains('mark-scheme-button')) {
                        // toggleReveal will set button to 'Show Mark Scheme'
                        toggleReveal(ms.id, button, 'Show Mark Scheme', 'Hide Mark Scheme'); 
                    }
                }
            });
             document.querySelectorAll('#exam-practice .mark-scheme-button').forEach(btn => btn.textContent = 'Show Mark Scheme'); // Ensure all are reset

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

            // Call checkTaskCompletion for relevant tasks again after full reset
            ['task1-hardware-matching', 'task3-transmission-media', 'task4-hardware-quiz'].forEach(taskId => {
                checkTaskCompletion(taskId);
            });

            alert("All tasks have been reset.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- PDF Export ---
        function exportToPDF() {
            const elementToExport = document.querySelector('.max-w-4xl.mx-auto.bg-white');
            if (!elementToExport) {
                console.error("PDF export target element not found.");
                alert("Could not find content to export.");
                return;
            }
            alert("Preparing PDF. This may take a moment. Please ensure pop-ups are allowed if your browser blocks the download.");

            // Temporarily show all revealable content for PDF
            const revealableElements = document.querySelectorAll('.feedback-area, .quiz-feedback, .mark-scheme, .explanation-feedback, .exam-feedback, .reveal-content');
            const initiallyHidden = [];
            revealableElements.forEach(el => {
                if (!el.classList.contains('show')) {
                    initiallyHidden.push(el);
                    el.classList.add('show');
                }
            });

            const pdfOptions = {
                margin:       [10, 10, 10, 10], // mm [top, left, bottom, right]
                filename:     'gcse-cs-network-hardware-lesson.pdf',
                image:        { type: 'jpeg', quality: 0.95 },
                html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: -window.scrollY },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } // 'css' respects page-break-inside etc.
            };

            html2pdf().from(elementToExport).set(pdfOptions).save().then(() => {
                initiallyHidden.forEach(el => el.classList.remove('show')); // Restore original state
            }).catch(err => {
                console.error("Error exporting PDF:", err);
                alert("An error occurred while exporting to PDF.");
                initiallyHidden.forEach(el => el.classList.remove('show')); // Restore original state on error too
            });
        }

        // --- DOMContentLoaded ---
        document.addEventListener('DOMContentLoaded', () => {
            addTooltips();
            setupHardwareMatching(); // For Task 1
            setupLANDiagramBuilder(); // For Task 2
            
            document.querySelectorAll('.read-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    console.log(`Section read status changed for: ${event.target.closest('section').id}`);
                });
            });
            
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#starter-activity') || item.closest('#exam-practice') || item.closest('#task2-lan-builder')) return;
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            const totalPossibleScoreValEl = document.getElementById('total-possible-score-value');
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf').addEventListener('click', exportToPDF);
        });