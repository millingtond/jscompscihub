let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;

        // Flashcard Data for Tooltips
        const flashcardData = {
            "bit": "A single binary digit (a zero or a one) written with a lower case b",
            "nibble": "A group of 4 binary digits or half a byte",
            "byte": "A group of 8 binary digits or two nibbles, it can hold 256 unique values",
            "kilobyte": "Full name of the unit that represents 1000 bytes",
            "megabyte": "1000 Kilobytes, or 1 million bytes, its full name",
            "gigabyte": "1000 Megabytes, or 1 billion bytes, the full name",
            "terabyte": "1000 Gigabytes, or a million Megabytes, in full",
            "petabyte": "1000 Terabytes, or a million Gigabytes, the long name",
            "but now burger king makes great toasted paninis": "How to remember file size order: Bits, Nibbles, Bytes, Kilobytes, Megabytes, Gigabytes, Terabytes, Petabytes",
            "binary": "A number system using only two digits: 0 and 1.",
            "kb": "Abbreviation for the unit that means 1000 bytes",
            "mb": "Two-letter abbreviation for Megabyte",
            "gb": "A billion bytes, abbreviated to two letters",
            "tb": "A thousand GB is which unit, shortened to two letters?",
            "pb": "A Petabyte in two letters",
            "colour depth": "The number of bits used to represent the colour of a single pixel.",
            "sample rate": "The number of samples of audio recorded per second (measured in Hz).",
            "bit depth": "Also known as resolution. The number of bits used to store each audio sample."
        };

        // --- Task Completion Check ---
        function checkTaskCompletion(sectionId) {
            const section = document.getElementById(sectionId);
            if (!section) return;
            const indicator = section.querySelector('.task-completion-indicator');
            if (!indicator) return;
            const quizItems = section.querySelectorAll('.quiz-item');
            if (quizItems.length === 0) { indicator.classList.remove('completed'); indicator.innerHTML = ''; return; }
            let allCorrect = true;
            quizItems.forEach(item => { if (item.dataset.answeredCorrectly !== 'true') { allCorrect = false; } });
            if (allCorrect) { indicator.innerHTML = '<i class="fas fa-check-circle"></i>'; indicator.classList.add('completed'); }
            else { indicator.innerHTML = ''; indicator.classList.remove('completed'); }
        }

        // --- General Quiz Item Handler (for Task 3) ---
        function handleOptionClick(button, quizItem, isStarter = false) { // Added isStarter flag
            const correctAnswer = "b"; // Correct answer for Task 3
            const selectedAnswer = button.dataset.answer;
            const feedbackEl = quizItem.querySelector('.feedback');
            const options = quizItem.querySelectorAll('.option-button');
            options.forEach(opt => opt.disabled = true);
            button.classList.add('selected');
            if (selectedAnswer === correctAnswer) {
                button.classList.add('correct');
                feedbackEl.textContent = 'Correct! Reliability with two states is key.';
                feedbackEl.className = 'feedback correct';
                quizItem.dataset.answeredCorrectly = 'true';
            } else {
                button.classList.add('incorrect');
                feedbackEl.textContent = 'Incorrect. Think about the physical nature of circuits.';
                feedbackEl.className = 'feedback incorrect';
                quizItem.dataset.answeredCorrectly = 'false';
                options.forEach(opt => { if (opt.dataset.answer === correctAnswer) { opt.classList.add('correct'); } });
            }
            const section = quizItem.closest('section');
            if (section) checkTaskCompletion(section.id);
            if (scoreCalculated) calculateScore();
        }
        // --- General Quiz Item Handler (for Starter Task 0 and others) ---
        function handleGenericOptionClick(button, quizItem) {
            const correctAnswer = quizItem.dataset.correct;
            const selectedAnswer = button.dataset.answer;
            const feedbackEl = quizItem.querySelector('.feedback');
            const options = quizItem.querySelectorAll('.option-button');
            handleOptionClickLogic(button, selectedAnswer, correctAnswer, feedbackEl, options, quizItem); // Use helper
        }

        document.querySelectorAll('#task3-why-binary .option-button').forEach(button => {
            button.addEventListener('click', () => {
                const quizItem = button.closest('.quiz-item');
                if (quizItem && !quizItem.querySelector('.option-button:disabled')) {
                    handleOptionClick(button, quizItem); // Keep specific handler for Task 3 if needed
                } // Or switch to handleGenericOptionClick if Task 3 logic is simple enough
            });
        });

        // --- Task 1: Unit Ordering (Drag & Drop) ---
        let draggedUnit = null;
        function initializeUnitDraggables() {
            document.querySelectorAll('#unit-pool .draggable').forEach(draggable => {
                draggable.addEventListener('dragstart', handleUnitDragStart);
                draggable.addEventListener('dragend', handleUnitDragEnd);
            });
        }
        function handleUnitDragStart(e) {
            draggedUnit = e.target;
            e.dataTransfer.setData('text/plain', draggedUnit.id);
            e.dataTransfer.effectAllowed = "move";
            setTimeout(() => { if(draggedUnit) draggedUnit.classList.add('dragging'); }, 0);
        }
        function handleUnitDragEnd() {
            if (draggedUnit) draggedUnit.classList.remove('dragging');
            draggedUnit = null;
        }
        const unitOrderSlots = document.getElementById('unit-order-slots');
        const unitPool = document.getElementById('unit-pool');
        document.querySelectorAll('.dropzone, .unit-pool').forEach(zone => { // Include individual slots and pool
            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); e.dataTransfer.dropEffect = "move"; });
            zone.addEventListener('dragleave', () => { zone.classList.remove('dragover'); });
            zone.addEventListener('drop', e => {
                e.preventDefault(); zone.classList.remove('dragover');
                const id = e.dataTransfer.getData('text/plain');
                const draggableElement = document.getElementById(id);
                if (draggableElement && draggedUnit === draggableElement) { // Ensure it's the one being dragged
                    // If dropping into a slot, only allow one item
                    if (zone.classList.contains('drop-slot')) {
                        // Remove existing item in slot back to pool if necessary
                        const existingItem = zone.querySelector('.draggable');
                        if (existingItem) {
                            unitPool.appendChild(existingItem);
                            existingItem.classList.remove('correct', 'incorrect');
                        }
                        // Remove placeholder text if present
                        const placeholder = zone.querySelector('span');
                        if (placeholder) placeholder.style.display = 'none';
                    }
                    // If dropping into the pool, remove placeholder if it's the last item
                    if (zone.id === 'unit-pool' && zone.children.length === 0) {
                         // No placeholder needed for pool
                    }

                    zone.appendChild(draggableElement); // Add the dragged item

                    // Clear feedback if item moved
                    document.getElementById('unit-order-feedback').classList.remove('show');
                    document.querySelectorAll('#unit-order-slots .draggable').forEach(item => item.classList.remove('correct', 'incorrect'));
                    unitOrderSlots.dataset.answeredCorrectly = 'pending'; // Reset quiz item status
                }
                draggedUnit = null; // Reset dragged item after drop
            });
        });

        function checkUnitOrder() {
            const slots = document.querySelectorAll('#unit-order-slots .drop-slot');
            const feedbackDiv = document.getElementById('unit-order-feedback');
            let correctOrder = true;
            let placedItemsCount = 0;

            slots.forEach((slot, index) => {
                const item = slot.querySelector('.draggable');
                if (item) {
                    placedItemsCount++;
                    item.classList.remove('correct', 'incorrect');
                    if (parseInt(item.dataset.order) === index) { item.classList.add('correct'); }
                    else { item.classList.add('incorrect'); correctOrder = false; }
                } else {
                    correctOrder = false; // Slot is empty
                }
            });

            if (correctOrder && placedItemsCount === 8) {
                feedbackDiv.innerHTML = '<p class="correct-feedback font-semibold">Correct order!</p>';
                unitOrderSlots.dataset.answeredCorrectly = 'true';
            } else {
                feedbackDiv.innerHTML = '<p class="incorrect-feedback font-semibold">Incorrect order. Check the items highlighted in red.</p>';
                unitOrderSlots.dataset.answeredCorrectly = 'false';
            }
            feedbackDiv.classList.add('show');
            const section = unitOrderSlots.closest('section'); if(section) checkTaskCompletion(section.id);
            if (scoreCalculated) calculateScore();
        }

        function resetUnitOrder() {
            const pool = document.getElementById('unit-pool');
            const slots = document.querySelectorAll('#unit-order-slots .drop-slot');
            const items = Array.from(document.querySelectorAll('#unit-order-slots .draggable')); // Get all items from slots
            items.forEach(item => {
                item.classList.remove('correct', 'incorrect');
                pool.appendChild(item);
            });
            // Restore placeholder text in slots
            slots.forEach(slot => {
                const placeholder = slot.querySelector('span');
                if (placeholder) placeholder.style.display = 'inline';
            });
            document.getElementById('unit-order-feedback').classList.remove('show');
            unitOrderSlots.dataset.answeredCorrectly = 'false';
            const section = unitOrderSlots.closest('section'); if(section) checkTaskCompletion(section.id);
            if (scoreCalculated) calculateScore();
        }

        // --- Task 2: Definitions Matching ---
        let selectedUnit = null; let selectedDef = null; let definitionMatchesMade = {};
        function setupDefinitionsMatching() {
            const unitsList = document.getElementById('matching-units');
            const defsList = document.getElementById('matching-defs');
            if (!unitsList || !defsList) return;
            definitionMatchesMade = {};

            unitsList.querySelectorAll('.matching-item').forEach(item => { const newItem = item.cloneNode(true); item.parentNode.replaceChild(newItem, item); });
            defsList.querySelectorAll('.matching-item').forEach(item => { const newItem = item.cloneNode(true); item.parentNode.replaceChild(newItem, item); });

            shuffleList(defsList); // Shuffle definitions

            unitsList.querySelectorAll('.matching-item').forEach(item => { item.classList.remove('selected', 'correct', 'incorrect', 'disabled'); item.addEventListener('click', () => handleDefinitionMatchClick(item, 'unit')); });
            defsList.querySelectorAll('.matching-item').forEach(item => { item.classList.remove('selected', 'correct', 'incorrect', 'disabled'); item.addEventListener('click', () => handleDefinitionMatchClick(item, 'def')); });

            const feedbackElement = document.getElementById('definitions-feedback');
            if (feedbackElement) feedbackElement.classList.remove('show');
            unitsList.closest('.quiz-item').dataset.answeredCorrectly = 'false';
        }

        function shuffleList(ul) { for (let i = ul.children.length; i >= 0; i--) { ul.appendChild(ul.children[Math.random() * i | 0]); } }

        function handleDefinitionMatchClick(item, type) {
            if (item.classList.contains('correct') || item.classList.contains('incorrect') || item.classList.contains('disabled')) return;
            if (type === 'unit') { if (selectedUnit) selectedUnit.classList.remove('selected'); selectedUnit = item; item.classList.add('selected'); }
            else { if (selectedDef) selectedDef.classList.remove('selected'); selectedDef = item; item.classList.add('selected'); }
            if (selectedUnit && selectedDef) { attemptDefinitionMatch(); }
        }

        function attemptDefinitionMatch() {
            const unitMatchId = selectedUnit.dataset.match;
            const defMatchId = selectedDef.dataset.match;
            selectedUnit.classList.remove('selected'); selectedDef.classList.remove('selected');
            if (unitMatchId === defMatchId) {
                selectedUnit.classList.add('correct', 'disabled'); selectedDef.classList.add('correct', 'disabled');
                definitionMatchesMade[unitMatchId] = true;
            } else {
                selectedUnit.classList.add('incorrect'); selectedDef.classList.add('incorrect');
                setTimeout(() => {
                    if (selectedUnit && !selectedUnit.classList.contains('correct')) selectedUnit.classList.remove('incorrect');
                    if (selectedDef && !selectedDef.classList.contains('correct')) selectedDef.classList.remove('incorrect');
                }, 800);
            }
            selectedUnit = null; selectedDef = null;
            updateDefinitionQuizItemStatus();
        }

        function updateDefinitionQuizItemStatus() {
            const quizItem = document.querySelector('#task2-definitions .quiz-item');
            const totalItems = document.querySelectorAll('#matching-units .matching-item').length;
            const correctCount = Object.keys(definitionMatchesMade).length;
            if (quizItem) { quizItem.dataset.answeredCorrectly = (correctCount === totalItems).toString(); }
        }

        function checkDefinitions() {
            const feedbackElement = document.getElementById('definitions-feedback');
            const totalItems = document.querySelectorAll('#matching-units .matching-item').length;
            const correctCount = Object.keys(definitionMatchesMade).length;
            let feedbackHtml = "";

            document.querySelectorAll('#task2-definitions .matching-item').forEach(item => {
                item.classList.remove('selected');
                if (!item.classList.contains('correct') && !item.classList.contains('incorrect')) {
                    item.classList.add('incorrect'); // Mark unattempted as incorrect on check
                }
            });

            if (correctCount === totalItems) {
                feedbackHtml = `<p class="correct-feedback font-semibold"><i class="fas fa-check mr-2"></i>Excellent! All definitions matched correctly.</p>`;
            } else {
                feedbackHtml = `<p class="incorrect-feedback font-semibold"><i class="fas fa-times mr-2"></i>You matched ${correctCount} out of ${totalItems} correctly. Incorrect or unmatched items are highlighted in red.</p>`;
            }
            feedbackElement.innerHTML = feedbackHtml;
            feedbackElement.classList.add('show');
            const section = feedbackElement.closest('section'); if(section) checkTaskCompletion(section.id);
            if (scoreCalculated) calculateScore();
        }

        function resetDefinitions() { setupDefinitionsMatching(); }

        // --- Task 4: Conversions (Fill Blanks) ---
        function checkConversions() {
            let sectionCorrect = true;
            const inputs = document.querySelectorAll('#conversions-container input.fill-blank');
            const feedbackDiv = document.getElementById('conversions-feedback');

            inputs.forEach(input => {
                const userAnswer = input.value.trim();
                const correctAnswer = input.dataset.answer;
                const quizItem = input.closest('.quiz-item');
                const feedbackElId = `fb-feedback-${input.id.replace('conv', '')}`;
                const feedbackEl = quizItem ? quizItem.querySelector(`#${feedbackElId}`) : null;

                if (userAnswer === correctAnswer) {
                    input.classList.remove('incorrect'); input.classList.add('correct');
                    if (feedbackEl) { feedbackEl.textContent = 'Correct'; feedbackEl.className = 'feedback correct inline-block ml-2'; }
                    if (quizItem) quizItem.dataset.answeredCorrectly = 'true';
                } else {
                    input.classList.remove('correct'); input.classList.add('incorrect');
                    if (feedbackEl) { feedbackEl.textContent = `Incorrect (Ans: ${correctAnswer})`; feedbackEl.className = 'feedback incorrect inline-block ml-2'; }
                    sectionCorrect = false;
                    if (quizItem) quizItem.dataset.answeredCorrectly = 'false';
                }
            });

            feedbackDiv.innerHTML = sectionCorrect ? '<p class="correct-feedback font-semibold">All conversions correct!</p>' : '<p class="incorrect-feedback font-semibold">Some conversions are incorrect. See details.</p>';
            feedbackDiv.classList.add('show');

            const section = feedbackDiv.closest('section'); if(section) checkTaskCompletion(section.id);
            if (scoreCalculated) calculateScore();
        }
        // Add blur listener to check individual conversion inputs
        document.querySelectorAll('#conversions-container input.fill-blank').forEach(input => {
            input.addEventListener('blur', checkConversions);
        });

        // Wrapper function for the check button
        function checkConversionsTask() { checkConversions(); }

        // Reset function for Task 4
        function resetConversionsTask() {
            const inputs = document.querySelectorAll('#conversions-container input.fill-blank');
            const feedbackDiv = document.getElementById('conversions-feedback');

            inputs.forEach(input => {
                input.value = ''; // Clear input value
                input.classList.remove('correct', 'incorrect'); // Remove styling
                const quizItem = input.closest('.quiz-item');
                const feedbackElId = `fb-feedback-${input.id.replace('conv', '')}`;
                const feedbackEl = quizItem ? quizItem.querySelector(`#${feedbackElId}`) : null;
                if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.className = 'feedback'; } // Clear individual feedback
                if (quizItem) quizItem.dataset.answeredCorrectly = 'false'; // Reset item status
            });

            feedbackDiv.innerHTML = ''; // Clear overall feedback
            feedbackDiv.classList.remove('show');

            const section = feedbackDiv.closest('section'); if(section) checkTaskCompletion(section.id);
            if (scoreCalculated) calculateScore(); // Recalculate score if needed
        }

        // --- Task 8: Final Quiz (Renumbered) ---
        const quizQuestions = [
            { q: "Which is the smallest unit of data?", a: ["bit", "nibble", "Byte", "KB"], correct: "bit" },
            { q: "How many bits are typically in a Byte?", a: ["4", "8", "16", "1000"], correct: "8" },
            { q: "Which unit represents 1000 Bytes?", a: ["Megabyte", "Gigabyte", "Kilobyte", "Nibble"], correct: "Kilobyte" },
            { q: "What comes after Gigabyte (GB) in order of size?", a: ["Megabyte (MB)", "Petabyte (PB)", "Terabyte (TB)", "Kilobyte (KB)"], correct: "Terabyte (TB)" },
            { q: "Why is binary used in computers?", a: ["It's faster", "It's easier for humans", "Circuits reliably detect 2 states", "It uses less power"], correct: "Circuits reliably detect 2 states" }
        ];

        function loadQuiz() {
            const container = document.getElementById('quiz-container');
            container.innerHTML = ''; // Clear previous questions
            quizQuestions.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'quiz-item mb-6 pb-4 border-b border-gray-300';
                div.dataset.points = "1";
                div.dataset.answeredCorrectly = "false";
                div.innerHTML = `
                    <p class="font-medium text-gray-800 mb-3">${index + 1}. ${item.q}</p>
                    <div class="flex flex-wrap gap-2">
                        ${item.a.map(option => `<button class="option-button" data-answer="${option}">${option}</button>`).join('')}
                    </div>
                    <div class="feedback mt-2"></div>
                `;
                container.appendChild(div);
            });
            // Add event listeners to new buttons
            container.querySelectorAll('.option-button').forEach(button => {
                button.addEventListener('click', handleQuizOptionClick);
            });
            document.getElementById('quiz-feedback').classList.remove('show');
            const section = container.closest('section'); if(section) checkTaskCompletion(section.id);
        }

        function handleQuizOptionClick(event) {
            const button = event.target;
            const quizItem = button.closest('.quiz-item');
            const options = quizItem.querySelectorAll('.option-button');
            options.forEach(opt => opt.disabled = true);
            // Logic to check answer will be in checkQuiz()
            button.classList.add('selected'); // Mark as selected for checking
        }

        function checkQuiz() {
            let correctCount = 0;
            const quizItems = document.querySelectorAll('#quiz-container .quiz-item');
            quizItems.forEach((item, index) => {
                const selectedButton = item.querySelector('.option-button.selected');
                const feedbackEl = item.querySelector('.feedback');
                const correctAnswer = quizQuestions[index].correct;
                item.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('correct', 'incorrect')); // Clear previous visual feedback

                if (selectedButton) {
                    const selectedAnswer = selectedButton.dataset.answer;
                    if (selectedAnswer === correctAnswer) {
                        selectedButton.classList.add('correct');
                        feedbackEl.textContent = 'Correct!';
                        feedbackEl.className = 'feedback correct';
                        item.dataset.answeredCorrectly = 'true';
                        correctCount++;
                    } else {
                        selectedButton.classList.add('incorrect');
                        feedbackEl.textContent = `Incorrect. The answer is ${correctAnswer}.`;
                        feedbackEl.className = 'feedback incorrect';
                        item.dataset.answeredCorrectly = 'false';
                        // Highlight correct answer
                        item.querySelectorAll('.option-button').forEach(btn => {
                            if (btn.dataset.answer === correctAnswer) btn.classList.add('correct');
                        });
                    }
                } else {
                    // No answer selected
                    feedbackEl.textContent = `No answer selected. The answer is ${correctAnswer}.`;
                    feedbackEl.className = 'feedback incorrect';
                    item.dataset.answeredCorrectly = 'false';
                    item.querySelectorAll('.option-button').forEach(btn => {
                         if (btn.dataset.answer === correctAnswer) btn.classList.add('correct');
                    });
                }
            });

            const overallFeedback = document.getElementById('quiz-feedback');
            if (correctCount === quizQuestions.length) {
                overallFeedback.innerHTML = '<p class="correct-feedback font-semibold">All quiz answers correct!</p>';
            } else {
                overallFeedback.innerHTML = `<p class="incorrect-feedback font-semibold">You got ${correctCount} out of ${quizQuestions.length} correct. Review the incorrect answers above.</p>`;
            }
            overallFeedback.classList.add('show');
            const section = overallFeedback.closest('section'); if(section) checkTaskCompletion(section.id);
            if (scoreCalculated) calculateScore();
        }

        function resetQuiz() { loadQuiz(); }

        // --- Task 6: Build a File Simulation (Renumbered) ---
        let currentFileSizeBits = 0;
        const BITS_PER_BYTE = 8;
        const BYTES_PER_KB = 1000;
        const KB_PER_MB = 1000;
        const MB_PER_GB = 1000; // Not used in bar, but for context
        // const GB_PER_TB = 1000; // No longer needed for 500GB max

        const fileTypeSizes = { // Size in bits
            small_image: 50 * BYTES_PER_KB * BITS_PER_BYTE, // 50 KB
            large_image: 2 * KB_PER_MB * BYTES_PER_KB * BITS_PER_BYTE, // 2 MB
            audio: 1 * KB_PER_MB * BYTES_PER_KB * BITS_PER_BYTE, // 1 MB
            video_hd: 500 * KB_PER_MB * BYTES_PER_KB * BITS_PER_BYTE, // 500 MB
            movie_4k: 45 * MB_PER_GB * KB_PER_MB * BYTES_PER_KB * BITS_PER_BYTE, // 45 GB
            game_medium: 50 * MB_PER_GB * KB_PER_MB * BYTES_PER_KB * BITS_PER_BYTE, // 50 GB
            game_large: 100 * MB_PER_GB * KB_PER_MB * BYTES_PER_KB * BITS_PER_BYTE // 100 GB
        };

        const textContentInput = document.getElementById('text-content');
        const fileTypeSelect = document.getElementById('file-type-select');
        const addFileButton = document.getElementById('add-file-btn');
        const capacityFeedbackEl = document.getElementById('capacity-feedback');
        const textSizeInfoEl = document.getElementById('text-size-info');

        function updateSimulationDisplay() {
            const sizeBytes = currentFileSizeBits / BITS_PER_BYTE;
            const sizeKB = sizeBytes / BYTES_PER_KB;
            const sizeMB = sizeKB / KB_PER_MB;
            const sizeGB = sizeMB / MB_PER_GB;
            // const sizeTB = sizeGB / GB_PER_TB; // No longer needed

            document.getElementById('size-bits').textContent = formatNumber(currentFileSizeBits);
            document.getElementById('size-bytes').textContent = formatNumber(sizeBytes.toFixed(0));
            document.getElementById('size-kb').textContent = formatNumber(sizeKB.toFixed(2));
            document.getElementById('size-mb').textContent = formatNumber(sizeMB.toFixed(3));
            document.getElementById('size-gb').textContent = formatNumber(sizeGB.toFixed(4));
            document.getElementById('size-tb').textContent = '0.00000'; // Keep TB display but likely always 0
            
            // --- Update Bar Graph (Scaled to 500 GB) ---
            const bar = document.getElementById('file-size-bar');
            const MAX_BAR_GB = 500; // Set maximum for the bar in GB
            const maxBarBits = MAX_BAR_GB * MB_PER_GB * KB_PER_MB * BYTES_PER_KB * BITS_PER_BYTE;
            let barWidthPercent = 0;
            let barText = "";

            // Calculate width based on fixed max
            barWidthPercent = Math.min(100, (currentFileSizeBits / maxBarBits) * 100);

            // Determine best unit for display text in bar and set color (TB unlikely now)
            if (sizeGB >= 0.1) { barText = `${formatNumber(sizeGB.toFixed(2))} GB`; bar.style.backgroundColor = '#dc2626'; /* Red */ }
            else if (sizeMB >= 0.1) { barText = `${formatNumber(sizeMB.toFixed(2))} MB`; bar.style.backgroundColor = '#be185d'; /* Pinkish */ }
            else if (sizeKB >= 0.1) { barText = `${formatNumber(sizeKB.toFixed(1))} KB`; bar.style.backgroundColor = '#f59e0b'; /* Amber */ }
            else { barText = `${formatNumber(sizeBytes.toFixed(0))} B`; bar.style.backgroundColor = '#4f46e5'; /* Indigo */ }

            bar.style.width = `${barWidthPercent}%`;
            bar.textContent = barText;

            // --- Update Text Size Info ---
            if (fileTypeSelect.value === 'text') {
                const charCount = textContentInput.value.length;
                textSizeInfoEl.textContent = `${formatNumber(charCount)} characters ≈ ${formatNumber(charCount)} Bytes`;
            } else { textSizeInfoEl.textContent = ''; } // Hide if not in text mode

            // --- Update Comparison Text ---
            const comparisonArea = document.getElementById('comparison-area');
            const largeImageSizeBits = fileTypeSizes['large_image'];
            if (currentFileSizeBits > 0 && largeImageSizeBits > 0) {
                const equivalentImages = (currentFileSizeBits / largeImageSizeBits).toFixed(1);
                comparisonArea.textContent = `Approx. equivalent to ${formatNumber(equivalentImages)} large images (~2MB each).`;
            } else {
                comparisonArea.textContent = '';
            }
        }
        
        // --- Constants for Simulation ---
        const MAX_STORAGE_GB = 500;
        const MAX_STORAGE_BITS = MAX_STORAGE_GB * MB_PER_GB * KB_PER_MB * BYTES_PER_KB * BITS_PER_BYTE;


        function formatNumber(num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

        fileTypeSelect.addEventListener('change', () => {
            const selectedType = fileTypeSelect.value;
            textContentInput.disabled = (selectedType !== 'text');
            addFileButton.disabled = (selectedType === 'text');
            capacityFeedbackEl.textContent = ''; // Clear feedback on type change
            // Reset size only if switching TO text mode, otherwise keep accumulated size
            if (selectedType === 'text') { 
                currentFileSizeBits = textContentInput.value.length * BITS_PER_BYTE; // Recalc based on current text
            } 
            updateSimulationDisplay();
        });

        textContentInput.addEventListener('input', () => {
            if (fileTypeSelect.value === 'text') {
                const potentialBits = textContentInput.value.length * BITS_PER_BYTE;
                
                // Check capacity BEFORE updating the official size
                if (potentialBits > MAX_STORAGE_BITS) {
                    capacityFeedbackEl.textContent = `Storage full! Cannot add more text (Limit: ${MAX_STORAGE_GB} GB).`;
                    // Truncate text to fit capacity
                    const maxChars = Math.floor(MAX_STORAGE_BITS / BITS_PER_BYTE);
                    textContentInput.value = textContentInput.value.substring(0, maxChars);
                    currentFileSizeBits = maxChars * BITS_PER_BYTE; // Update size to max
                } else {
                    capacityFeedbackEl.textContent = ''; // Clear feedback
                    currentFileSizeBits = potentialBits; // Update size
                }
                updateSimulationDisplay();
            }
        });

        addFileButton.addEventListener('click', () => {
            const selectedType = fileTypeSelect.value;
            const bitsToAdd = fileTypeSizes[selectedType] || 0;

            if (selectedType !== 'text' && bitsToAdd > 0) {
                if (currentFileSizeBits + bitsToAdd <= MAX_STORAGE_BITS) { currentFileSizeBits += bitsToAdd; capacityFeedbackEl.textContent = ''; updateSimulationDisplay(); } 
                else { capacityFeedbackEl.textContent = `Not enough space! Adding this file would exceed the ${MAX_STORAGE_GB} GB limit.`; }
            }
        });

        function resetSimulation() { currentFileSizeBits = 0; textContentInput.value = ''; fileTypeSelect.value = 'text'; textContentInput.disabled = false; addFileButton.disabled = true; capacityFeedbackEl.textContent = ''; updateSimulationDisplay(); }

        // --- Task 5: Interactive Unit Converter (New) ---
        const converterValueInput = document.getElementById('converter-value');
        const converterFromUnitSelect = document.getElementById('converter-from-unit');
        const converterToUnitSelect = document.getElementById('converter-to-unit');
        const converterResultEl = document.getElementById('converter-result');
        const converterStepsEl = document.getElementById('converter-steps');

        // Define conversion factors relative to bits
        const factors = {
            bit: 1,
            nibble: 4,
            byte: 8,
            kb: 8 * 1000,
            mb: 8 * 1000 * 1000,
            gb: 8 * 1000 * 1000 * 1000,
            tb: 8 * 1000 * 1000 * 1000 * 1000,
            pb: 8 * 1000 * 1000 * 1000 * 1000 * 1000,
        };

        function calculateConversion() {
            try { // Add a try...catch block for robustness
                const value = parseFloat(converterValueInput.value);
                const fromUnit = converterFromUnitSelect.value;
                const toUnit = converterToUnitSelect.value;

                // Check if elements exist before proceeding
                if (!converterValueInput || !converterFromUnitSelect || !converterToUnitSelect || !converterResultEl) {
                     console.error("Converter elements not found!");
                     return;
                }

                if (isNaN(value) || value < 0) {
                    converterResultEl.textContent = "Invalid input value";
                    // converterStepsEl.textContent = ""; // Steps are commented out anyway
                    return;
                }

                const valueInBits = value * factors[fromUnit];
                const result = valueInBits / factors[toUnit];

                // Format result for readability
                let formattedResult;
                // ... (formatting logic remains the same) ...
                 if (result >= 10000 || (result > 0 && result < 0.001)) {
                    formattedResult = result.toExponential(4);
                } else if (result !== Math.floor(result)) {
                    formattedResult = result.toFixed(Math.max(2, (result.toString().split('.')[1] || '').length));
                     if (formattedResult.length > 15) formattedResult = parseFloat(formattedResult).toPrecision(10);
                } else {
                    formattedResult = formatNumber(result);
                }


                // Get selected option text for display
                const fromUnitText = converterFromUnitSelect.options[converterFromUnitSelect.selectedIndex].text;
                const toUnitText = converterToUnitSelect.options[converterToUnitSelect.selectedIndex].text;

                // Update result text content using selected option text
                converterResultEl.textContent = `${formatNumber(value)} ${fromUnitText} = ${formattedResult} ${toUnitText}`;


                // Show simple steps (optional) - Keep commented out
                /* ... */

            } catch (error) {
                console.error("Error during conversion calculation:", error);
                if(converterResultEl) converterResultEl.textContent = "Calculation Error";
            }
        }

        converterValueInput.addEventListener('input', calculateConversion);
        converterFromUnitSelect.addEventListener('change', calculateConversion);
        converterToUnitSelect.addEventListener('change', calculateConversion);
        // --- Generic Reveal Toggle ---
        function toggleReveal(contentId, buttonElement, revealText, hideText) {
            const content = document.getElementById(contentId);
            content.classList.toggle('show');
            buttonElement.textContent = content.classList.contains('show') ? hideText : revealText;
        }

        // --- Score Calculation ---
        function calculateScore() {
            currentScore = 0; totalPossibleScore = 0; scoreCalculated = true;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#task0-starter') || item.closest('#task5-unit-converter') || item.closest('#task6-build-file-sim') || item.closest('#task7-binary-practice') || item.closest('#task9-exam-practice')) return; // Skip unscored sections including starter
                const points = parseInt(item.dataset.points || 0);
                totalPossibleScore += points;
                if (item.dataset.answeredCorrectly === 'true') {
                    currentScore += points;
                }
            });
            document.getElementById('current-score').textContent = currentScore;
            document.getElementById('total-possible-score').textContent = totalPossibleScore;
            document.querySelectorAll('section[id]').forEach(section => { checkTaskCompletion(section.id); });
        }

        // --- Initial Load ---
        window.addEventListener('load', () => {
            initializeUnitDraggables();
            setupDefinitionsMatching();
            resetSimulation(); // Initialize simulation state

            // --- Exam Practice Feedback Toggle --- Moved Earlier ---
            document.querySelectorAll('.mark-scheme-button').forEach(button => {
                button.addEventListener('click', () => {
                    const feedbackId = button.dataset.feedbackId;
                    const feedbackDiv = document.getElementById(feedbackId);
                    if (feedbackDiv) {
                        feedbackDiv.classList.toggle('hidden');
                        button.textContent = feedbackDiv.classList.contains('hidden') ? 'Show Mark Scheme' : 'Hide Mark Scheme';
                    }
                });
            });

            calculateConversion(); // Initial calculation for converter
            loadQuiz(); // Load Task 8 quiz

            // Calculate initial total score *after* quiz is loaded
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#task0-starter') || item.closest('#task5-unit-converter') || item.closest('#task6-build-file-sim') || item.closest('#task7-binary-practice') || item.closest('#task9-exam-practice')) return; // Skip unscored sections including starter
                 totalPossibleScore += parseInt(item.dataset.points || 0);
             });
            document.getElementById('total-possible-score').textContent = totalPossibleScore;

            document.querySelectorAll('section[id]').forEach(section => checkTaskCompletion(section.id));
            const currentYearSpan = document.getElementById('currentYear');
            if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

            // Removed logic to hide takeaways on load

            // Add tooltips
            document.querySelectorAll('.keyword').forEach(span => {
                 const keywordText = span.textContent.trim().toLowerCase();
                 if (flashcardData[keywordText]) {
                     const tooltip = document.createElement('span');
                     tooltip.className = 'tooltip';
                     tooltip.textContent = flashcardData[keywordText];
                     span.appendChild(tooltip);
                 }
             });
        });

        // --- Helper for Option Click Logic ---
        function handleOptionClickLogic(button, selectedAnswer, correctAnswer, feedbackEl, options, quizItem) {
            options.forEach(opt => opt.disabled = true);
            button.classList.add('selected');
            if (selectedAnswer === correctAnswer) {
                button.classList.add('correct');
                feedbackEl.textContent = 'Correct!';
                feedbackEl.className = 'feedback correct';
                quizItem.dataset.answeredCorrectly = 'true';
            } else {
                button.classList.add('incorrect');
                feedbackEl.textContent = `Incorrect. The answer is ${correctAnswer}.`;
                feedbackEl.className = 'feedback incorrect';
                quizItem.dataset.answeredCorrectly = 'false';
                options.forEach(opt => { if (opt.dataset.answer === correctAnswer) { opt.classList.add('correct'); } });
            }
            const section = quizItem.closest('section');
            if (section) checkTaskCompletion(section.id);
            if (scoreCalculated) calculateScore();
        }
        // Add listener for starter task
        document.querySelectorAll('#task0-starter .option-button').forEach(button => {
             button.addEventListener('click', () => handleGenericOptionClick(button, button.closest('.quiz-item')));
         });

        document.getElementById('calculate-score-btn').addEventListener('click', calculateScore);