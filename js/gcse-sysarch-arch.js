let score = 0; // For Task 6 Quiz
        let questionsAnswered = 0; // For Task 6 Quiz
        let scenarioScores = { 'Scenario 1': null, 'Scenario 2': null, 'Scenario 3': null }; // Track scenario answers

        // Flashcard Data for Tooltips
        const flashcardData = {
            "architecture": "The design of a computer, including the way its components are organised and the rules that make them work together. Von Neumann invented a type of this.",
            "von neumann architecture": "Basic design of most modern computers. Consists of a CPU, Memory (where instructions and data are held), I/O, and uses buses for communication. Key idea: Stored Program Concept.",
            "stored program concept": "Instructions and data are both stored within memory during execution. Von Neumann architecture uses this - both instructions and data are stored in the same memory system.",
            "instructions": "A single operation, one of these is executed each time the CPU performs the fetch-execute cycle.",
            "main memory": "Also known as RAM or Primary Storage, this is where data and instructions are stored in the Von Neumann architecture.",
             "ram": "Random Access Memory (Main memory). Volatile storage where currently running programs and data are held for the CPU.",
             "memory": "Usually refers to RAM (Main Memory), where data and instructions are stored for the CPU to access quickly.",
            "cpu": "Central Processing Unit: This component repeatedly fetches, decodes and executes instructions. Often abbreviated to CPU.",
            "buses": "Any of three communication pathways between the CPU and RAM in the Von Neumann architecture. There is one for addresses (Address Bus), one for data (Data Bus) and one for control signals (Control Bus).",
             "data bus": "The bus used to transfer actual data and instructions between the CPU and RAM.",
             "address bus": "The bus used by the CPU to specify the memory address it wants to access.",
             "control bus": "The bus used to send control signals between the CPU and other components (e.g., memory read/write signals).",
             "i/o": "Input/Output devices connected to the computer system (e.g., keyboard, mouse, monitor).",
             "input/output": "Input/Output devices connected to the computer system (e.g., keyboard, mouse, monitor).",
            "control unit": "Component of the CPU which controls the flow of data around the CPU, communication between the CPU and input/output devices, decodes and executes instructions.",
            "decoding": "This phase of the instruction cycle determines what task the CPU must perform. The Control unit looks up the instruction in its instruction set. e.g., how to carry out a LOAD 5 instruction.",
            "execute": "The phase of the instruction cycle where the task is carried out, which could be an arithmetic, shift, logic or memory operation.",
            "alu": "Arithmetic Logic Unit: Performs mathematical operations (ADD, SUBTRACT, shifts) and logical comparisons (AND, OR, NOT, >, <, ==) in the CPU.",
            "accumulator": "A register used with the ALU that stores the intermediate results of calculations.",
             "acc": "Accumulator: A register used with the ALU that stores the intermediate results of calculations.",
             "cir": "Current Instruction Register: Holds the instruction currently being decoded or executed.",
            "cache": "A small amount of very fast memory built on or very close to the CPU. Stores frequently used instructions and data, making access much faster than fetching from RAM.",
            "registers": "The collection of tiny areas of extremely fast memory located *inside* the CPU, each with a specific purpose, where data or control information is stored temporarily. Examples: MAR, MDR, PC, Accumulator.",
            "program counter (pc)": "A register that holds the memory address of the *next* instruction to be fetched from RAM.",
             "pc": "Program Counter: Holds the address of the next instruction to be fetched.",
            "memory address register (mar)": "A register that stores the memory address where data will be fetched from or written to.",
             "mar": "Memory Address Register: Holds the address of the memory location being accessed.",
            "memory data register (mdr)": "A register that temporarily stores the data or instruction being transferred to or from memory.",
             "mdr": "Memory Data Register: Temporarily holds data or instructions transferred to/from memory.",
            "accumulator (acc)": "A register used with the ALU that stores the intermediate results of calculations.",
            "fetch-decode-execute cycle": "Also known as the instruction cycle, the complete process of retrieving an instruction from store, decoding it and carrying it out.",
            "fetch": "The phase of the instruction cycle that retrieves an instruction from main memory.",
             "clock speed": "The number of FDE cycles a CPU can perform per second (measured in Hz, typically GHz).",
             "cores": "An individual processing unit within a CPU. Multi-core CPUs have more than one.",
             "embedded systems": "A computer system with a dedicated function within a larger mechanical or electrical system. Often includes hardware and software together."
        };

         // Quiz Data
        const quizData = [
             { question: "What is the main principle of the Von Neumann architecture regarding instructions and data?", options: ["They are stored in separate memory locations", "Only instructions are stored in memory", "Instructions and data are stored in the same memory", "Data is processed directly from input devices"], correctAnswer: "Instructions and data are stored in the same memory", feedbackCorrect: "Correct! This is the Stored Program Concept.", feedbackIncorrect: "Incorrect. The key idea is that instructions and data share the same memory space (RAM)." },
            { question: "Which CPU component decodes instructions?", options: ["ALU", "Cache", "Register", "Control Unit (CU)"], correctAnswer: "Control Unit (CU)", feedbackCorrect: "Correct! The CU interprets instructions.", feedbackIncorrect: "Incorrect. The Control Unit (CU) decodes instructions." },
            { question: "Which register holds the address of the *next* instruction?", options: ["MAR", "MDR", "Accumulator", "Program Counter (PC)"], correctAnswer: "Program Counter (PC)", feedbackCorrect: "Correct! The PC always points to the next instruction.", feedbackIncorrect: "Incorrect. The Program Counter (PC) holds the address of the next instruction." },
            { question: "Which register holds data being transferred between the CPU and RAM?", options: ["PC", "MAR", "MDR", "Accumulator"], correctAnswer: "MDR", feedbackCorrect: "Correct! MDR is the buffer for data/instructions to/from RAM.", feedbackIncorrect: "Incorrect. The Memory Data Register (MDR) holds the data/instruction." },
            { question: "Where are the results of ALU calculations often stored temporarily?", options: ["MAR", "Cache", "PC", "Accumulator"], correctAnswer: "Accumulator", feedbackCorrect: "Correct! The Accumulator holds intermediate results.", feedbackIncorrect: "Incorrect. The Accumulator is commonly used to store results from the ALU." },
            { question: "What is the role of the MAR?", options: ["Hold the instruction being decoded", "Hold the address of the memory location being accessed", "Hold the result of an ALU operation", "Store frequently used data"], correctAnswer: "Hold the address of the memory location being accessed", feedbackCorrect: "Correct! The MAR holds the specific address in RAM for the current fetch or store operation.", feedbackIncorrect: "Incorrect. The Memory Address Register (MAR) holds the memory address the CPU wants to read/write." },
             { question: "True or False: The ALU, CU and Registers are all located within the CPU.", options: ["True", "False"], correctAnswer: "True", feedbackCorrect: "Correct! These are the core internal components of the CPU.", feedbackIncorrect: "Incorrect. The CU, ALU, and Registers are key parts located inside the CPU." },
              { question: "The pathway used to send memory addresses from the CPU to RAM is the...", options: ["Data Bus", "Control Bus", "Address Bus", "System Clock"], correctAnswer: "Address Bus", feedbackCorrect: "Correct! Addresses travel on the Address Bus.", feedbackIncorrect: "Incorrect. Memory addresses are sent via the Address Bus." }
        ];
        const totalQuestions = quizData.length;

        // --- Task 1: Drag & Drop ---
        function allowDrop(ev) {
          ev.preventDefault();
          if (ev.target.classList.contains('drop-zone') || ev.target.id === 'label-bank') {
             ev.target.classList.add('over');
          }
        }

        function dragLabel(ev) {
          ev.dataTransfer.setData("text/plain", ev.target.id);
           ev.dataTransfer.setData("text/label-name", ev.target.dataset.label);
           ev.dataTransfer.effectAllowed = "move";
           ev.target.classList.add('dragging');
        }

        function dropLabel(ev) {
          ev.preventDefault();
          const draggedId = ev.dataTransfer.getData("text/plain");
          const draggedElement = document.getElementById(draggedId);
          let dropTarget = ev.target;

           if (dropTarget.classList.contains('draggable-label') && dropTarget.parentElement.classList.contains('drop-zone')) {
               dropTarget = dropTarget.parentElement;
           }

          if (dropTarget.classList.contains('drop-zone') || dropTarget.id === 'label-bank') {
             dropTarget.classList.remove('over');

             if (dropTarget.classList.contains('drop-zone') && dropTarget.children.length > 0 && dropTarget.firstChild !== draggedElement) {
                 const existingLabel = dropTarget.firstChild;
                 document.getElementById('label-bank').appendChild(existingLabel);
                 existingLabel.classList.remove('dropped');
             }

             if (dropTarget.id === 'label-bank' || (dropTarget.classList.contains('drop-zone') && dropTarget.children.length === 0)) {
                 dropTarget.appendChild(draggedElement);
                 if (dropTarget.id === 'label-bank') {
                     draggedElement.classList.remove('dropped');
                 } else {
                      draggedElement.classList.add('dropped');
                 }
             } else if (dropTarget.classList.contains('drop-zone') && dropTarget.children.length > 0 && dropTarget.firstChild === draggedElement) {
                 // No action needed if dropping same element back
             }
          }
          if (draggedElement) {
              draggedElement.classList.remove('dragging');
          }
        }

        function handleDragLeave(ev) {
             if (ev.target.classList.contains('drop-zone') || ev.target.id === 'label-bank') {
                ev.target.classList.remove('over');
            }
        }

        function handleDragEnd(ev) {
            ev.target.classList.remove('dragging');
            if (ev.dataTransfer.dropEffect === 'none' || !ev.target.parentElement || !ev.target.parentElement.classList.contains('drop-zone')) {
                 document.getElementById('label-bank').appendChild(ev.target);
                 ev.target.classList.remove('dropped');
            } else if (!ev.target.parentElement) {
                 document.getElementById('label-bank').appendChild(ev.target);
                 ev.target.classList.remove('dropped');
            }
        }


        function checkDragDropLabels() {
            const feedbackElement = document.getElementById('dragdrop-feedback');
            // Select only the drop zones that represent a main component title
            const mainTitleDropZones = document.querySelectorAll('#drop-registers-title, #drop-memory-title, #drop-alu-title, #drop-cu-title, #drop-acc-title');
            const registerDropZones = document.querySelectorAll('.register-zone'); // Select all individual register drop zones

            let allCorrect = true;
            let correctCount = 0;
            const totalMainCheckZones = mainTitleDropZones.length;
            let feedbackHtml = "<ul>";

            // Check main component title labels
            mainTitleDropZones.forEach(zone => {
                zone.classList.remove('correct-drop', 'incorrect-drop');
                const expectedLabel = zone.dataset.correct;
                const droppedLabelElement = zone.querySelector('.draggable-label');

                if (droppedLabelElement) {
                    const droppedLabel = droppedLabelElement.dataset.label;
                    if (droppedLabel === expectedLabel) {
                        feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-2"></i>'${droppedLabelElement.textContent}' is placed correctly!</li>`;
                        zone.classList.add('correct-drop');
                        correctCount++;
                    } else {
                        feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-2"></i>'${droppedLabelElement.textContent}' is in the wrong place (Zone expects: ${expectedLabel}).</li>`;
                        zone.classList.add('incorrect-drop');
                        allCorrect = false;
                    }
                } else {
                    feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-2"></i>Drop zone for '${expectedLabel}' is empty.</li>`;
                    zone.classList.add('incorrect-drop');
                    allCorrect = false;
                }
            });

            // Check individual registers inside the Registers box (order doesn't matter)
            const expectedRegisters = ['pc', 'mar', 'mdr', 'cir'];
            const droppedRegisterLabels = [];
            let registerBoxContentsCorrect = true;

            registerDropZones.forEach(zone => {
                 zone.classList.remove('correct-drop', 'incorrect-drop');
                 const droppedLabelElement = zone.querySelector('.draggable-label');
                 if (droppedLabelElement) {
                     const droppedLabel = droppedLabelElement.dataset.label;
                     if (expectedRegisters.includes(droppedLabel)) {
                         droppedRegisterLabels.push(droppedLabel);
                     } else {
                         // Label dropped here doesn't belong in Registers box
                         feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-2"></i>'${droppedLabelElement.textContent}' does not belong in the Registers box.</li>`;
                         zone.classList.add('incorrect-drop');
                         registerBoxContentsCorrect = false;
                     }
                 } else {
                     // An empty zone inside registers means it's not fully correct
                     registerBoxContentsCorrect = false;
                     zone.classList.add('incorrect-drop');
                 }
            });

            // Check if all expected registers are present and no duplicates
            if (droppedRegisterLabels.length !== expectedRegisters.length || new Set(droppedRegisterLabels).size !== expectedRegisters.length) {
                registerBoxContentsCorrect = false;
            } else {
                // Double check if all expected are included
                expectedRegisters.forEach(reg => {
                    if (!droppedRegisterLabels.includes(reg)) { registerBoxContentsCorrect = false; }
                });
            }

            if (registerBoxContentsCorrect) {
                 feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-2"></i>All individual registers (PC, MAR, MDR, CIR) are placed correctly within the Registers box!</li>`;
                 registerDropZones.forEach(zone => zone.classList.add('correct-drop'));
                 correctCount++; // Increment correct count for the register group
            } else {
                 allCorrect = false; // Overall incorrect if register group is wrong
                 feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-2"></i>Incorrect labels within the Registers box. Ensure only PC, MAR, MDR, and CIR are placed inside, one per zone.</li>`;
                 // Mark only the specifically wrong/empty zones red
                 registerDropZones.forEach(zone => {
                      const droppedEl = zone.querySelector('.draggable-label');
                      // A zone is correct if it has a label AND that label is one of the expected ones AND it's not a duplicate within the dropped set
                      const isZoneCorrect = droppedEl &&
                                            expectedRegisters.includes(droppedEl.dataset.label) &&
                                            droppedRegisterLabels.filter(l => l === droppedEl.dataset.label).length === 1;
                      if (!isZoneCorrect) { zone.classList.add('incorrect-drop'); }
                      else { zone.classList.add('correct-drop'); }
                 });
            }


            feedbackHtml += "</ul>";
             if(allCorrect) {
                 feedbackHtml = `<p class="correct-feedback font-semibold"><i class="fas fa-check mr-2"></i>All labels placed correctly!</p>`;
             } else {
                 // +1 for the register group check
                 feedbackHtml = `<p class="incorrect-feedback font-semibold"><i class="fas fa-times mr-2"></i>Some labels are incorrect or missing. You got ${correctCount}/${mainTitleDropZones.length + 1} sections correct.</p>` + feedbackHtml;
             }
            feedbackElement.innerHTML = feedbackHtml;
            feedbackElement.classList.add('show');
        }


         function resetDragDropTask1() {
            const labelBank = document.getElementById('label-bank');
            const dropZones = document.querySelectorAll('.drop-zone');
            const feedbackElement = document.getElementById('dragdrop-feedback');

            dropZones.forEach(zone => {
                 const label = zone.querySelector('.draggable-label');
                 if (label) {
                     label.classList.remove('dropped');
                     labelBank.appendChild(label);
                 }
                 zone.classList.remove('correct-drop', 'incorrect-drop', 'over');
            });

             if (feedbackElement) {
                 feedbackElement.classList.remove('show');
                 feedbackElement.innerHTML = '';
             }
             document.querySelectorAll('#label-bank .draggable-label').forEach(label => {
                 label.draggable = true;
                 label.classList.remove('dropped');
             });
         }

        function setupDragDropListeners() {
             document.querySelectorAll('.draggable-label').forEach(label => {
                 label.draggable = true;
                 label.addEventListener('dragstart', dragLabel);
                 label.addEventListener('dragend', handleDragEnd);
             });
             document.querySelectorAll('.drop-zone').forEach(zone => {
                 zone.addEventListener('dragover', allowDrop);
                 zone.addEventListener('drop', dropLabel);
                 zone.addEventListener('dragleave', handleDragLeave);
             });
             const labelBank = document.getElementById('label-bank');
             if (labelBank) {
                 labelBank.addEventListener('dragover', allowDrop);
                 labelBank.addEventListener('drop', dropLabel);
                 labelBank.addEventListener('dragleave', handleDragLeave);
             }
         }

        // --- Task 2: Matching ---
        let selectedName = null;
        let selectedDesc = null;
        let matchesMade = {};

        function setupMatching() {
            const namesList = document.getElementById('matching-names');
            const descsList = document.getElementById('matching-descs');
            if (!namesList || !descsList) return;
            const nameItems = namesList.querySelectorAll('.matching-item');
            const descItems = descsList.querySelectorAll('.matching-item');
            matchesMade = {};

             nameItems.forEach(item => { const newItem = item.cloneNode(true); item.parentNode.replaceChild(newItem, item); });
             descItems.forEach(item => { const newItem = item.cloneNode(true); item.parentNode.replaceChild(newItem, item); });

             const newNameItems = namesList.querySelectorAll('.matching-item');
             const newDescItems = descsList.querySelectorAll('.matching-item');

             shuffleList(descsList);

             newNameItems.forEach(item => { item.classList.remove('selected', 'matched-correct', 'matched-incorrect'); item.addEventListener('click', () => handleMatchClick(item, 'name')); });
             newDescItems.forEach(item => { item.classList.remove('selected', 'matched-correct', 'matched-incorrect'); item.addEventListener('click', () => handleMatchClick(item, 'desc')); });

             const feedbackElement = document.getElementById('matching-feedback');
             if (feedbackElement) feedbackElement.classList.remove('show');
        }

         function shuffleList(ul) { for (let i = ul.children.length; i >= 0; i--) { ul.appendChild(ul.children[Math.random() * i | 0]); } }

        function handleMatchClick(item, type) {
            if (item.classList.contains('matched-correct') || item.classList.contains('matched-incorrect')) return;
            if (type === 'name') { if (selectedName) selectedName.classList.remove('selected'); selectedName = item; item.classList.add('selected'); }
            else { if (selectedDesc) selectedDesc.classList.remove('selected'); selectedDesc = item; item.classList.add('selected'); }
            if (selectedName && selectedDesc) { attemptMatch(); }
        }

        function attemptMatch() {
            const nameMatchId = selectedName.dataset.match;
            const descMatchId = selectedDesc.dataset.match;
            selectedName.classList.remove('selected'); selectedDesc.classList.remove('selected');
            if (nameMatchId === descMatchId) {
                selectedName.classList.add('matched-correct'); selectedDesc.classList.add('matched-correct');
                matchesMade[nameMatchId] = true; selectedName = null; selectedDesc = null;
            } else {
                selectedName.classList.add('matched-incorrect'); selectedDesc.classList.add('matched-incorrect');
                setTimeout(() => {
                    if (selectedName) selectedName.classList.remove('matched-incorrect');
                    if (selectedDesc) selectedDesc.classList.remove('matched-incorrect');
                    selectedName = null; selectedDesc = null;
                }, 800);
            }
        }

        function checkMatching() {
             const feedbackElement = document.getElementById('matching-feedback');
             const nameItems = document.querySelectorAll('#matching-names .matching-item');
             const totalItems = nameItems.length;
             const correctCount = Object.keys(matchesMade).length;
             let feedbackHtml = ""; let allAttempted = true;
             document.querySelectorAll('.matching-item').forEach(item => {
                 item.classList.remove('selected'); const matchId = item.dataset.match;
                 if (!matchesMade[matchId] && !item.classList.contains('matched-correct')) {
                     item.classList.add('matched-incorrect');
                     if (!item.classList.contains('matched-correct') && !item.classList.contains('matched-incorrect')) { allAttempted = false; }
                 }
             });
             if (correctCount === totalItems) { feedbackHtml = `<p class="correct-feedback font-semibold"><i class="fas fa-check mr-2"></i>Excellent! All items matched correctly.</p>`; }
             else {
                  feedbackHtml = `<p class="incorrect-feedback font-semibold"><i class="fas fa-times mr-2"></i>You matched ${correctCount} out of ${totalItems} correctly. Incorrect or unmatched items are highlighted in red.</p>`;
                  feedbackHtml += "<p class='mt-2 text-sm incorrect-feedback'>Items needing correction: ";
                  let missing = []; nameItems.forEach(item => { if (!matchesMade[item.dataset.match]) { missing.push(item.textContent); }});
                  feedbackHtml += missing.join(', ') + "</p>";
             }
             feedbackElement.innerHTML = feedbackHtml; feedbackElement.classList.add('show');
         }

        // --- Task 3: Interactive Register Explorer ---
         const registerInfo = {
             pc: { name: "Program Counter (PC)", purpose: flashcardData['pc'] },
             mar: { name: "Memory Address Register (MAR)", purpose: flashcardData['mar'] },
             mdr: { name: "Memory Data Register (MDR)", purpose: flashcardData['mdr'] },
             cir: { name: "Current Instruction Register (CIR)", purpose: flashcardData['cir'] },
             acc: { name: "Accumulator (ACC)", purpose: flashcardData['acc'] }
         };

         function showRegisterInfo(registerKey) {
             const infoPanel = document.getElementById('register-info-panel');
             const buttons = document.querySelectorAll('.register-button');
             const info = registerInfo[registerKey];

             buttons.forEach(btn => btn.classList.remove('selected'));
             document.querySelector(`.register-button[data-register="${registerKey}"]`).classList.add('selected');

             if (info) {
                 infoPanel.innerHTML = `
                     <h4>${info.name}</h4>
                     <p>${info.purpose}</p>
                 `;
             } else {
                 infoPanel.innerHTML = 'Select a register above.';
             }
         }
          function resetRegisterExplorer() {
             const infoPanel = document.getElementById('register-info-panel');
             const buttons = document.querySelectorAll('.register-button');
             buttons.forEach(btn => btn.classList.remove('selected'));
             infoPanel.innerHTML = 'Click a register button above to see its details.';
         }


        // --- Task 4: Bus Simulation ---
        let busTimeout;
        function simulateBus(operation) {
            clearTimeout(busTimeout);
            const addrPacket = document.getElementById('bus-packet-address');
            const dataPacket = document.getElementById('bus-packet-data');
            const ctrlPacket = document.getElementById('bus-packet-control');
            const description = document.getElementById('bus-sim-description');
            const addrBusLine = document.querySelector('.bus-sim-address');
            const dataBusLine = document.querySelector('.bus-sim-data');
            const ctrlBusLine = document.querySelector('.bus-sim-control');

            [addrPacket, dataPacket, ctrlPacket].forEach(p => p.className = `bus-sim-packet ${p.classList.contains('address') ? 'address' : p.classList.contains('data') ? 'data' : 'control'}`);
            [addrBusLine, dataBusLine, ctrlBusLine].forEach(l => l.classList.remove('active'));
            description.textContent = "Starting simulation...";

            if (operation === 'read') {
                addrPacket.textContent = 'Addr: 5'; ctrlPacket.textContent = 'Read'; dataPacket.textContent = 'Data: 12';
                description.textContent = "1. CPU places address 5 on Address Bus."; addrBusLine.classList.add('active'); addrPacket.classList.add('show');
                busTimeout = setTimeout(() => { addrPacket.classList.add('move-right'); description.textContent = "2. Address 5 travels to RAM."; // Further increased delay
                busTimeout = setTimeout(() => { addrBusLine.classList.remove('active'); description.textContent = "3. CPU sends 'Read' signal on Control Bus."; ctrlBusLine.classList.add('active'); ctrlPacket.classList.add('show', 'move-right'); // Further increased delay
                busTimeout = setTimeout(() => { ctrlBusLine.classList.remove('active'); description.textContent = "4. RAM places data (12) on Data Bus."; dataPacket.style.left = 'calc(100% - 160px)'; dataBusLine.classList.add('active'); dataPacket.classList.add('show'); // Further increased delay
                busTimeout = setTimeout(() => { description.textContent = "5. Data (12) travels back to CPU."; dataPacket.classList.add('move-left'); // Further increased delay
                busTimeout = setTimeout(() => { dataBusLine.classList.remove('active'); description.textContent = "Read cycle complete."; }, 2000); }, 600); }, 2000); }, 2000); }, 600);
            } else if (operation === 'write') {
                addrPacket.textContent = 'Addr: 7'; ctrlPacket.textContent = 'Write'; dataPacket.textContent = 'Data: 99';
                description.textContent = "1. CPU places address 7 on Address Bus."; addrBusLine.classList.add('active'); addrPacket.classList.add('show');
                 busTimeout = setTimeout(() => { addrPacket.classList.add('move-right'); description.textContent = "2. Address 7 travels to RAM."; // Further increased delay
                 busTimeout = setTimeout(() => { addrBusLine.classList.remove('active'); description.textContent = "3. CPU places data (99) on Data Bus."; dataBusLine.classList.add('active'); dataPacket.classList.add('show'); // Further increased delay
                 busTimeout = setTimeout(() => { dataPacket.classList.add('move-right'); description.textContent = "4. Data (99) travels to RAM."; // Further increased delay
                 busTimeout = setTimeout(() => { dataBusLine.classList.remove('active'); description.textContent = "5. CPU sends 'Write' signal on Control Bus."; ctrlBusLine.classList.add('active'); ctrlPacket.classList.add('show', 'move-right'); // Further increased delay
                 busTimeout = setTimeout(() => { ctrlBusLine.classList.remove('active'); description.textContent = "Write cycle complete."; }, 2000); }, 2000); }, 600); }, 2000); }, 600);
            }
        }
        function resetBusSimulation() {
             clearTimeout(busTimeout);
             const addrPacket = document.getElementById('bus-packet-address');
             const dataPacket = document.getElementById('bus-packet-data');
             const ctrlPacket = document.getElementById('bus-packet-control');
             const description = document.getElementById('bus-sim-description');
             const addrBusLine = document.querySelector('.bus-sim-address');
             const dataBusLine = document.querySelector('.bus-sim-data');
             const ctrlBusLine = document.querySelector('.bus-sim-control');

             [addrPacket, dataPacket, ctrlPacket].forEach(p => p.className = `bus-sim-packet ${p.classList.contains('address') ? 'address' : p.classList.contains('data') ? 'data' : 'control'}`);
             [addrBusLine, dataBusLine, ctrlBusLine].forEach(l => l.classList.remove('active'));
             description.textContent = "Click a button to start the simulation.";
         }


        // --- Task 5: Register Role Play Scenarios ---
        function checkScenarioAnswer(buttonElement, correctAnswer) {
            const scenarioDiv = buttonElement.closest('.scenario-question');
            const feedbackElement = scenarioDiv.querySelector('.scenario-feedback');
            const buttons = scenarioDiv.querySelectorAll('button');
            const selectedAnswerText = buttonElement.textContent.trim();
            let selectedAcronym = '';
            const match = selectedAnswerText.match(/\(([^)]+)\)/);
            if (match && match[1]) { selectedAcronym = match[1]; }
            else { selectedAcronym = selectedAnswerText; }

            buttons.forEach(btn => { btn.disabled = true; btn.classList.remove('correct', 'incorrect'); const icon = btn.querySelector('.feedback-icon'); if(icon) icon.remove(); });
            feedbackElement.classList.remove('correct', 'incorrect', 'show');

            if (selectedAcronym === correctAnswer) {
                buttonElement.classList.add('correct');
                feedbackElement.textContent = `Correct! The ${correctAnswer} is primarily involved here.`;
                feedbackElement.classList.add('correct');
                scenarioDiv.dataset.answeredCorrectly = "true";
            } else {
                buttonElement.classList.add('incorrect');
                feedbackElement.textContent = `Incorrect. The correct register is the ${correctAnswer}. Think about its specific role.`;
                feedbackElement.classList.add('incorrect');
                scenarioDiv.dataset.answeredCorrectly = "false";
                 buttons.forEach(btn => {
                     const btnText = btn.textContent.trim(); const btnMatch = btnText.match(/\(([^)]+)\)/);
                     if (btnMatch && btnMatch[1] === correctAnswer) { btn.classList.add('correct'); const iconSpan = document.createElement('span'); iconSpan.className = 'feedback-icon'; btn.appendChild(iconSpan); }
                 });
            }
             const iconSpan = document.createElement('span'); iconSpan.className = 'feedback-icon'; buttonElement.appendChild(iconSpan);
             feedbackElement.classList.add('show');
        }
         function resetScenarios() {
            document.querySelectorAll('.scenario-question').forEach(scenarioDiv => {
                const feedbackElement = scenarioDiv.querySelector('.scenario-feedback');
                const buttons = scenarioDiv.querySelectorAll('button');
                buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.classList.remove('correct', 'incorrect');
                    const icon = btn.querySelector('.feedback-icon');
                    if(icon) icon.remove();
                });
                if(feedbackElement) feedbackElement.classList.remove('show', 'correct', 'incorrect');
                scenarioDiv.dataset.answeredCorrectly = "false";
            });
         }


        // --- Task 6: Fill Blanks ---
         const fillBlanksAnswers = { "fill-1": ["control unit", "cu"], "fill-2": ["alu", "arithmetic logic unit"], "fill-3": ["mar", "memory address register"], "fill-4": ["mdr", "memory data register"], "fill-5": ["stored program concept"], "fill-6": ["pc", "program counter"] };
         function checkFillBlanksTask4() {
             const feedbackElement = document.getElementById('fill-blanks-feedback'); let allCorrect = true; let feedbackHtml = "<ul>";
             for (const id in fillBlanksAnswers) {
                 const span = document.getElementById(id); const userAnswer = span.textContent.trim().toLowerCase().replace(/\.$/, '');
                 const placeholderText = '[' + span.getAttribute('data-placeholder') + ']'; const actualAnswer = (userAnswer === placeholderText.toLowerCase() || userAnswer === '') ? '' : userAnswer;
                 span.classList.remove('correct-blank', 'incorrect-blank'); const correctAnswers = fillBlanksAnswers[id];
                 if (correctAnswers.includes(actualAnswer)) {
                     feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-2"></i>Blank ${id.split('-')[1]} is correct!</li>`; span.classList.add('correct-blank');
                 } else {
                     feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-2"></i>Blank ${id.split('-')[1]} is incorrect. (Expected: '${correctAnswers[0]}')</li>`; span.classList.add('incorrect-blank'); allCorrect = false;
                      if(span.textContent.trim() === '' || span.textContent === placeholderText) span.textContent = placeholderText;
                 }
             }
             feedbackHtml += "</ul>";
             if(allCorrect) { feedbackHtml = `<p class="correct-feedback font-semibold"><i class="fas fa-check mr-2"></i>All blanks filled correctly!</p>`; }
             else { feedbackHtml = `<p class="incorrect-feedback font-semibold"><i class="fas fa-times mr-2"></i>Some blanks are incorrect. Check the highlighted fields.</p>` + feedbackHtml; }
             feedbackElement.innerHTML = feedbackHtml; feedbackElement.classList.add('show');
         }
         function resetFillBlanksTask4() {
             const feedbackElement = document.getElementById('fill-blanks-feedback');
             document.querySelectorAll('.fill-blank').forEach(span => {
                 const placeholder = '[' + span.getAttribute('data-placeholder') + ']';
                 span.textContent = placeholder;
                 span.classList.remove('correct-blank', 'incorrect-blank');
             });
             if (feedbackElement) feedbackElement.classList.remove('show');
         }


        // --- Task 7: Quiz ---
        function checkAnswer(buttonElement, questionIndex) {
            const selectedAnswer = buttonElement.textContent; const questionData = quizData[questionIndex]; const isCorrect = selectedAnswer === questionData.correctAnswer;
            const questionDiv = buttonElement.closest('.quiz-question-container'); const feedbackElement = questionDiv.querySelector('.quiz-feedback'); const buttons = questionDiv.querySelectorAll('button');
            buttons.forEach(btn => btn.disabled = true);
             if (!feedbackElement) { console.error("Feedback element not found for question:", questionIndex); return; }
            feedbackElement.classList.remove('hidden', 'correct', 'incorrect', 'text-green-600', 'text-red-600');
            if (isCorrect) {
                buttonElement.classList.add('correct'); feedbackElement.textContent = questionData.feedbackCorrect; feedbackElement.classList.add('correct'); score++;
                // Ensure score is only incremented if not already answered correctly
                const questionContainer = buttonElement.closest('.quiz-question-container');
                if (!questionContainer.dataset.answeredCorrectly) {
                    // score++; // Score is already incremented above, this would double count.
                               // The original score++ is fine if resetQuiz clears answeredCorrectly states.
                               // For now, let's assume score++ above is the single point of increment.
                               // If quiz can be re-attempted without full reset, this logic needs refinement.
                    questionContainer.dataset.answeredCorrectly = "true"; // Mark as answered
                }
            } else {
                buttonElement.classList.add('incorrect'); feedbackElement.textContent = questionData.feedbackIncorrect; feedbackElement.classList.add('incorrect');
                buttons.forEach(btn => { if (btn.textContent === questionData.correctAnswer) { btn.classList.add('correct'); }});
            }
            if (!buttonElement.querySelector('.feedback-icon')) { const iconSpan = document.createElement('span'); iconSpan.className = 'feedback-icon'; buttonElement.appendChild(iconSpan); }
            feedbackElement.classList.add('show'); questionsAnswered++; updateScore();
            const resetQuizButton = document.getElementById('reset-quiz-btn');
            if (questionsAnswered === totalQuestions && resetQuizButton) { 
                resetQuizButton.classList.remove('hidden'); 
            }
        }

        function updateScore() { document.getElementById('score').textContent = score; }

        function loadQuiz() {
            const quizContainer = document.getElementById('quiz-questions'); if (!quizContainer) return; quizContainer.innerHTML = ''; score = 0; questionsAnswered = 0;
            document.getElementById('total-questions').textContent = totalQuestions; updateScore(); const resetButton = document.getElementById('reset-quiz-btn'); if (resetButton) resetButton.classList.add('hidden');
            // Clear answeredCorrectly dataset from previous quiz attempts
            quizData.forEach((q, index) => {
                // When creating questionElement, ensure data-answered-correctly is reset if it exists
                const questionElement = document.createElement('div'); questionElement.className = 'mb-6 quiz-question-container'; const questionText = document.createElement('p');
                questionText.className = 'font-semibold mb-3 text-lg text-gray-800'; questionText.textContent = `${index + 1}. ${q.question}`; questionElement.appendChild(questionText);
                const optionsDiv = document.createElement('div'); optionsDiv.className = 'space-y-2';
                q.options.forEach(option => {
                    const button = document.createElement('button'); button.className = 'quiz-option block w-full text-left p-3 border rounded-md bg-white border-gray-300 hover:border-blue-400';
                    button.textContent = option; button.onclick = () => checkAnswer(button, index); optionsDiv.appendChild(button);
                });
                questionElement.appendChild(optionsDiv); const feedbackPara = document.createElement('p'); feedbackPara.className = 'quiz-feedback hidden'; questionElement.appendChild(feedbackPara);
                quizContainer.appendChild(questionElement);
            });
        }

        // --- Task 8: Exam Practice ---
        const CHARS_PER_MARK_THRESHOLD = 20; // User needs to type this many chars per mark

        function handleExamAnswerInput(event) {
            const textarea = event.target;
            const questionDiv = textarea.closest('.exam-question');
            if (!questionDiv) return;

            const marksText = questionDiv.dataset.marks;
            if (marksText === undefined) {
                console.warn("Exam question div is missing 'data-marks' attribute:", questionDiv);
                return;
            }
            const marks = parseInt(marksText, 10);
            const markSchemeButton = questionDiv.querySelector('.toggle-mark-scheme-btn');

            if (isNaN(marks) || !markSchemeButton) {
                console.error("Could not parse marks or find mark scheme button for an exam question.", questionDiv);
                return;
            }

            const requiredLength = marks * CHARS_PER_MARK_THRESHOLD;
            const currentLength = textarea.value.trim().length;

            if (currentLength >= requiredLength) {
                markSchemeButton.disabled = false;
                markSchemeButton.title = "Show the mark scheme";
            } else {
                markSchemeButton.disabled = true;
                markSchemeButton.title = `Type at least ${requiredLength - currentLength} more characters to unlock. (${currentLength}/${requiredLength})`;
            }
        }

         function toggleMarkScheme(markSchemeId) {
            const markSchemeDiv = document.getElementById(markSchemeId);
            if (markSchemeDiv) {
                markSchemeDiv.classList.toggle('show');
                markSchemeDiv.classList.toggle('hidden');
            }
        }

        function resetTask8() {
            document.querySelectorAll('#task8-exam-practice .exam-question').forEach(questionDiv => {
                const textarea = questionDiv.querySelector('.exam-answer-area');
                if (textarea) {
                    textarea.value = '';
                    // Trigger input handler to reset button state and title
                    handleExamAnswerInput({ target: textarea });
                }
                const selfAssessInput = questionDiv.querySelector('.self-assess-input');
                if (selfAssessInput) selfAssessInput.value = '';
                const markSchemeButton = questionDiv.querySelector('.toggle-mark-scheme-btn');
                const markScheme = markSchemeButton ? document.getElementById(markSchemeButton.dataset.markSchemeId) : null;
                if (markScheme) { markScheme.classList.add('hidden'); markScheme.classList.remove('show');}
            });
        }
         // --- Final Score Calculation & Reset ---
         const MAX_SCORE_DRAGDROP = 6; // 5 main components + 1 for register group
         const MAX_SCORE_MATCHING = 8; // 8 pairs
         const MAX_SCORE_SCENARIOS = 3; // 3 scenarios
         const MAX_SCORE_FILLBLANKS = 6; // 6 blanks
         const MAX_SCORE_QUIZ = totalQuestions;
         const TOTAL_MAX_SCORE = MAX_SCORE_DRAGDROP + MAX_SCORE_MATCHING + MAX_SCORE_SCENARIOS + MAX_SCORE_FILLBLANKS + MAX_SCORE_QUIZ;

         function getDragDropScore() {
             let currentScore = 0;
             const mainDropZones = document.querySelectorAll('#drop-memory-title, #drop-alu-title, #drop-cu-title, #drop-acc-title, #drop-registers-title');
             const registerDropZones = document.querySelectorAll('.register-zone');
             mainDropZones.forEach(zone => {
                 const expected = zone.dataset.correct;
                 const dropped = zone.querySelector('.draggable-label');
                 if (dropped && dropped.dataset.label === expected) {
                     currentScore++;
                 }
             });
             const expectedRegisters = ['pc', 'mar', 'mdr', 'cir'];
             const droppedRegisterLabels = [];
             let registerGroupCorrect = true;
             registerDropZones.forEach(zone => {
                 const dropped = zone.querySelector('.draggable-label');
                 if (dropped && expectedRegisters.includes(dropped.dataset.label)) {
                     droppedRegisterLabels.push(dropped.dataset.label);
                 } else {
                     registerGroupCorrect = false;
                 }
             });
             if (droppedRegisterLabels.length !== expectedRegisters.length || new Set(droppedRegisterLabels).size !== expectedRegisters.length) {
                 registerGroupCorrect = false;
             }
             if(registerGroupCorrect) currentScore++;
             return currentScore;
         }

         function getMatchingScore() {
             return Object.keys(matchesMade).length;
         }

         function getScenarioScore() {
             let currentScore = 0;
             document.querySelectorAll('.scenario-question').forEach(q => {
                 if (q.dataset.answeredCorrectly === "true") {
                     currentScore++;
                 }
             });
             return currentScore;
         }

         function getFillBlanksScore() {
             let currentScore = 0;
              for (const id in fillBlanksAnswers) {
                 const span = document.getElementById(id);
                 const userAnswer = span.textContent.trim().toLowerCase().replace(/\.$/, '');
                 const placeholderText = '[' + span.getAttribute('data-placeholder') + ']';
                 const actualAnswer = (userAnswer === placeholderText.toLowerCase() || userAnswer === '') ? '' : userAnswer;
                 const correctAnswers = fillBlanksAnswers[id];
                 if (correctAnswers.includes(actualAnswer)) {
                    currentScore++;
                 }
             }
             return currentScore;
         }

         function calculateTotalScore() {
             const dragDropScore = getDragDropScore();
             const matchingScore = getMatchingScore();
             const scenarioScore = getScenarioScore();
             const fillBlanksScore = getFillBlanksScore();
             const quizScore = score;

             const totalScore = dragDropScore + matchingScore + scenarioScore + fillBlanksScore + quizScore;

             const scoreDisplay = document.getElementById('final-score-display');
             const feedbackDisplay = document.getElementById('final-score-feedback');
             const scoreArea = document.getElementById('final-score-area');

             scoreDisplay.textContent = `Your Score: ${totalScore} / ${TOTAL_MAX_SCORE}`;

             let feedbackMessage = "";
             const percentage = (totalScore / TOTAL_MAX_SCORE) * 100;
             if (percentage === 100) {
                 feedbackMessage = "Excellent! You got full marks!";
             } else if (percentage >= 80) {
                 feedbackMessage = "Great job! You have a strong understanding.";
             } else if (percentage >= 60) {
                 feedbackMessage = "Good effort! Review the tasks you didn't get full marks on.";
             } else {
                 feedbackMessage = "Keep practicing! Review the tasks and definitions to improve your score.";
             }
             feedbackDisplay.textContent = feedbackMessage;
             scoreArea.style.display = 'block';
         }

         function resetAllTasks() {
             resetDragDropTask1();
             setupMatching();
             resetScenarios();
             resetFillBlanksTask4();
             loadQuiz();
             resetTask8(); // Reset Task 8 specific elements
             resetBusSimulation(); // Reset bus simulation too
             resetRegisterExplorer(); // Reset register explorer

             // Removed logic to hide takeaways on reset
             const scoreArea = document.getElementById('final-score-area');
             scoreArea.style.display = 'none';
             document.getElementById('final-score-display').textContent = '';
             document.getElementById('final-score-feedback').textContent = '';

             document.querySelectorAll('.feedback-area').forEach(el => el.classList.remove('show'));
             document.querySelectorAll('.mark-scheme').forEach(el => { el.classList.remove('show'); el.classList.add('hidden');});
             // Reset scenario feedback visibility
             document.querySelectorAll('.scenario-feedback').forEach(el => el.classList.remove('show', 'correct', 'incorrect'));

         }
         function exportToPDF() {
            const element = document.querySelector('.max-w-4xl.mx-auto.bg-white');
            if (!element) {
                alert("Could not find the content to export.");
                return;
            }

            window.scrollTo(0, 0);

            // Store original styles, including padding
            const originalElementStyle = {
                overflow: element.style.overflow,
                height: element.style.height,
                maxHeight: element.style.maxHeight,
                paddingBottom: element.style.paddingBottom // Store original paddingBottom
            };
            const originalBodyStyle = {
                overflow: document.body.style.overflow,
                height: document.body.style.height
            };
            const originalHtmlStyle = {
                overflow: document.documentElement.style.overflow,
                height: document.documentElement.style.height
            };

            // Temporarily modify styles
            element.style.overflow = 'visible';
            element.style.height = 'auto';
            element.style.maxHeight = 'none';
            // Add massive temporary bottom padding
            const tempPaddingBottom = '4000px'; // Massively increased temporary padding
            element.style.paddingBottom = tempPaddingBottom;

            document.body.style.overflow = 'visible';
            document.body.style.height = 'auto';
            document.documentElement.style.overflow = 'visible';
            document.documentElement.style.height = 'auto';

            // Force a reflow after all style changes, including the new padding
            void element.offsetHeight;
            // Log the scrollHeight here to check its value in the console:
            console.log("Element scrollHeight after padding:", element.scrollHeight);

            // Calculate height (scrollHeight will now include the temp padding) and add a very large buffer
            const calculatedHeight = element.scrollHeight + 1800; // Massively increased buffer

            const opt = {
                margin:       [0.5, 0.5, 0.5, 0.5],
                filename:     'gcse-cs-cpu-worksheet.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  {
                    scale: 2,
                    logging: true,
                    useCORS: true,
                    scrollY: 0, // Capture the element from its own top
                    height: calculatedHeight, // Explicit height for the canvas
                    windowHeight: 0 // Tell html2canvas to use the full window height
                },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
            };

            const exportButton = document.getElementById('export-pdf-btn');
            const resetButton = document.getElementById('reset-all-btn');
            if(exportButton) exportButton.disabled = true;
            if(resetButton) resetButton.disabled = true;

            setTimeout(() => {
                html2pdf().from(element).set(opt).save().then(function() {
                    // Revert styles, including paddingBottom
                    element.style.overflow = originalElementStyle.overflow;
                    element.style.height = originalElementStyle.height;
                    element.style.maxHeight = originalElementStyle.maxHeight;
                    element.style.paddingBottom = originalElementStyle.paddingBottom; // Restore padding
                    document.body.style.overflow = originalBodyStyle.overflow;
                    document.body.style.height = originalBodyStyle.height;
                    document.documentElement.style.overflow = originalHtmlStyle.overflow;
                    document.documentElement.style.height = originalHtmlStyle.height;

                    if(exportButton) exportButton.disabled = false;
                    if(resetButton) resetButton.disabled = false;
                }).catch(function(error) {
                    console.error("Error during PDF generation:", error);
                    // Revert styles even on error
                    element.style.overflow = originalElementStyle.overflow;
                    element.style.height = originalElementStyle.height;
                    element.style.maxHeight = originalElementStyle.maxHeight;
                    element.style.paddingBottom = originalElementStyle.paddingBottom; // Restore padding
                    document.body.style.overflow = originalBodyStyle.overflow;
                    document.body.style.height = originalBodyStyle.height;
                    document.documentElement.style.overflow = originalHtmlStyle.overflow;
                    document.documentElement.style.height = originalHtmlStyle.height;

                    if(exportButton) exportButton.disabled = false;
                    if(resetButton) resetButton.disabled = false;
                });
            }, 900); // Further increased delay
        }



         // Function to add tooltips dynamically
        function addTooltips() {
             document.querySelectorAll('.keyword').forEach(span => {
                 const keywordText = span.textContent.trim().toLowerCase();
                 if (flashcardData[keywordText]) {
                     const tooltip = document.createElement('span');
                     tooltip.className = 'tooltip';
                     tooltip.textContent = flashcardData[keywordText];
                     span.appendChild(tooltip);
                 }
             });
         }

        // --- Generic Reveal Toggle ---
        // Generic toggle function for reveal sections (like starter answers, key takeaways etc.)
        function toggleReveal(contentId, buttonElement, revealText, hideText) {
            const content = document.getElementById(contentId);
            if (!content) {
                console.error("Element with ID not found:", contentId);
                return;
            }
            content.classList.toggle('show'); // Assumes CSS handles the transition based on .show
            if (buttonElement) {
                buttonElement.textContent = content.classList.contains('show') ? hideText : revealText;
            }
        }

        // Initial setup
        document.addEventListener('DOMContentLoaded', () => {
            addTooltips(); loadQuiz(); setupMatching(); setupDragDropListeners(); resetBusSimulation(); resetRegisterExplorer();
            const resetButton = document.getElementById('reset-quiz-btn');
            if(resetButton) resetButton.addEventListener('click', loadQuiz);
             document.querySelectorAll('.fill-blank').forEach(span => {
                 const placeholder = '[' + span.getAttribute('data-placeholder') + ']'; span.textContent = placeholder;
                 span.addEventListener('focus', () => { if(span.textContent === placeholder) span.textContent = ''; span.classList.remove('correct-blank', 'incorrect-blank'); });
                 span.addEventListener('blur', () => { if(span.textContent.trim() === '') span.textContent = placeholder; });
             });

            // Setup for Task 8 Exam Practice
            document.querySelectorAll('#task8-exam-practice .exam-answer-area').forEach(textarea => {
                textarea.addEventListener('input', handleExamAnswerInput);
                // Initial check to set button state and title correctly on page load
                handleExamAnswerInput({ target: textarea });
            });

            document.querySelectorAll('#task8-exam-practice .toggle-mark-scheme-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const markSchemeId = button.dataset.markSchemeId;
                    if (markSchemeId) {
                        toggleMarkScheme(markSchemeId);
                    }
                });
            });
            
            document.querySelectorAll('#task8-exam-practice .exam-question').forEach(questionDiv => {
                const marksText = questionDiv.dataset.marks;
                if (marksText === undefined) return;
                const marks = parseInt(marksText, 10);
                const selfAssessInput = questionDiv.querySelector('.self-assess-input');
                if (!isNaN(marks) && selfAssessInput) selfAssessInput.max = marks;
            });
        });