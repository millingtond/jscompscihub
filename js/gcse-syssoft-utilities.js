// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "utility program": "A program that performs a specific task required for the operation of a computer system.",
            "systems software": "Software designed to provide a platform for other software (includes OS and Utility Programs).",
            "defragmentation software": "A utility that reduces the amount of separation of files and free space on disk by physically organising the contents of the disk to store the pieces of each file and free space together. This improves the speed of retrieval of files from the disk as the read/write head does not have to travel as far.",
            "fragmented": "When a single file is stored in non-contiguous (separate) blocks on a storage disk.",
            "improves file access speed": "Defragmentation makes reading files faster because the read/write head on an HDD doesn't need to move as much.",
            "encryption software": "Software that uses an algorithm to scramble plaintext data into unreadable ciphertext, requiring a key for decryption. Protects data confidentiality.",
            "plaintext": "Original, readable data before encryption.",
            "ciphertext": "Data that has been encrypted and is unreadable without the correct decryption key.",
            "key": "A piece of secret information (e.g., a password or a digital certificate) used by an encryption algorithm to transform plaintext into ciphertext and vice-versa.",
            "algorithm": "A set of rules or steps followed to perform a calculation or solve a problem. In encryption, it defines how plaintext is transformed into ciphertext using a key.",
            "compression software": "Software that reduces the size of files so they take up less disk space and are quicker to download/transmit. Can be lossy or lossless.",
            "lossy compression": "Reduction of file size by removing certain, redundant information from the file. The eliminated data is unrecoverable. Tries to recreate a file without the omitted data. Much smaller file sizes but there will be some loss of quality.",
            "lossless compression": "Every bit of the original data can be recovered from the compressed file. The uncompressed image will be the same as the original with no loss of data. Works by looking for patterns in the data. Larger compressed file sizes than lossy. e.g. Run-length encoding.",
            "run length encoding (rle)": "Lossless compression technique that summarises consecutive patterns of the same data. Works well with image and sound data where data could be repeated many times.",
            "backup software": "Software that creates copies of data that can be used to restore the original after a data loss event (e.g., hardware failure, deletion, malware).",
            "full backup": "A backup that copies all selected data, regardless of when it was last backed up. Slow to create, fast to restore.",
            "incremental backup": "A backup that copies only the data that has changed since the last backup (either full or incremental). Fast to create, potentially slow to restore as it requires the last full backup and all subsequent incrementals."
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
        
        // --- Defragmentation Grid Logic (Task 1) ---
        const defragGrid = document.getElementById('defrag-disk-grid');
        const defragMessage = document.getElementById('defrag-message');
        const initialDiskState = [
            1,1,1,1,1,1,2,2,2,
            2,2,2,2,2,0,0,0,3,
            3,3,3,3,3,3,3,3,3,
            0,0,0,0,4,4,4,4,4,
            4,4,5,5,5,5,5,5,0,
            0,0,0,0,0,0,0,0,0
        ];
        let currentDiskState = [...initialDiskState];
        let sectorsToPlace = 0;
        let currentFileAdding = 0;
        let currentFileAddingClass = '';

        function initializeDefragGrid() {
            currentDiskState = [...initialDiskState];
            renderDefragGrid();
            if(defragMessage) defragMessage.textContent = "Grid reset. Click 'Add File' buttons.";
            const quizItem = document.querySelector('#task1-defragmentation .quiz-item');
            if (quizItem) {
                 quizItem.dataset.answeredCorrectly = "false";
                 delete quizItem.dataset.answered;
            }
        }

        function renderDefragGrid() {
            if(!defragGrid) return;
            defragGrid.innerHTML = '';
            currentDiskState.forEach((sectorValue, index) => {
                const sectorDiv = document.createElement('div');
                sectorDiv.classList.add('defrag-sector');
                if (sectorValue === 0) {
                    sectorDiv.classList.add('empty');
                    sectorDiv.onclick = () => placeSectorInDefragGrid(index);
                } else {
                    sectorDiv.textContent = sectorValue;
                    sectorDiv.classList.add(`file-${sectorValue}`);
                }
                defragGrid.appendChild(sectorDiv);
            });
        }
        
        function addFileToDefragGrid(fileId, numSectors, fileClass, fileName) {
            if (!defragMessage) return;
            if (sectorsToPlace > 0) {
                defragMessage.textContent = `Please finish placing File ${currentFileAdding} (${fileName}) first. ${sectorsToPlace} sectors remaining.`;
                return;
            }
            sectorsToPlace = numSectors;
            currentFileAdding = fileId;
            currentFileAddingClass = fileClass;
            defragMessage.textContent = `Adding File ${fileId} (${fileName}). Click ${sectorsToPlace} empty sectors.`;
        }

        function placeSectorInDefragGrid(index) {
            if (!defragMessage || !defragGrid) return;
            if (sectorsToPlace > 0 && currentDiskState[index] === 0) {
                currentDiskState[index] = currentFileAdding;
                const sectorDiv = defragGrid.children[index];
                sectorDiv.textContent = currentFileAdding;
                sectorDiv.classList.remove('empty');
                sectorDiv.classList.add(currentFileAddingClass);
                sectorDiv.onclick = null; 
                sectorsToPlace--;
                defragMessage.textContent = `File ${currentFileAdding}: ${sectorsToPlace} sectors remaining.`;
                if (sectorsToPlace === 0) {
                    defragMessage.textContent = `File ${currentFileAdding} placed. You can add another or run defragmenter.`;
                    currentFileAdding = 0; 
                }
            } else if (sectorsToPlace <= 0) {
                defragMessage.textContent = "Select a file to add first.";
            } else if (currentDiskState[index] !== 0) {
                defragMessage.textContent = "Sector already occupied. Choose an empty one.";
            }
        }

        function runDefragmenter() {
            if (!defragMessage) return;
            if (sectorsToPlace > 0) {
                defragMessage.textContent = `Please finish placing File ${currentFileAdding} first. ${sectorsToPlace} sectors remaining.`;
                return;
            }
            const files = {}; 
            currentDiskState.forEach((val, idx) => {
                if (val !== 0) {
                    if (!files[val]) files[val] = { count: 0, originalClass: document.querySelector(`.file-${val}`)?.classList[1] || `file-${val}` };
                    files[val].count++;
                }
            });

            const newDiskState = Array(currentDiskState.length).fill(0);
            let currentNewIndex = 0;
            const sortedFileIds = Object.keys(files).map(Number).sort((a, b) => a - b);

            sortedFileIds.forEach(fileId => {
                for (let i = 0; i < files[fileId].count; i++) {
                    if (currentNewIndex < newDiskState.length) {
                        newDiskState[currentNewIndex] = fileId;
                        currentNewIndex++;
                    }
                }
            });
            currentDiskState = newDiskState;
            renderDefragGrid(); 
            
            currentDiskState.forEach((sectorValue, index) => {
                if (sectorValue !== 0 && defragGrid && defragGrid.children[index]) {
                    const sectorDiv = defragGrid.children[index];
                    let fileSpecificClass = files[sectorValue] ? files[sectorValue].originalClass : `file-${sectorValue}`;
                    if (fileSpecificClass) sectorDiv.classList.add(fileSpecificClass);
                }
            });
            defragMessage.textContent = "Disk defragmented! Files are now contiguous and free space is consolidated.";
        }

        function checkDefragAnswers() {
            const feedbackDiv = document.getElementById('task1-feedback');
            const quizItem = document.querySelector('#task1-defragmentation .quiz-item');
            let correctCount = 0;
            let feedbackHtml = "<ul>";

            const q1Answer = document.getElementById('defrag-q1').value.toLowerCase();
            if (q1Answer.includes("split") || q1Answer.includes("fragment") || q1Answer.includes("separate") || (q1Answer.includes("not enough") && q1Answer.includes("space"))) {
                feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q1: Good explanation of fragmentation.</li>`; correctCount++;
            } else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q1: Explain that files had to be split due to lack of large enough contiguous free space.</li>`; }

            const q2Answer = document.getElementById('defrag-q2').value.toLowerCase();
            if (q2Answer.includes("head") && (q2Answer.includes("move") || q2Answer.includes("travel") || q2Answer.includes("seek")) && (q2Answer.includes("more") || q2Answer.includes("further"))) {
                feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q2: Correct, the read/write head has to move more.</li>`; correctCount++;
            } else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q2: Focus on the increased movement of the HDD's read/write head.</li>`; }
            
            const q3Answer = document.getElementById('defrag-q3').value.toLowerCase();
            if (q3Answer.includes("no") && (q3Answer.includes("same amount") || q3Answer.includes("reorganizes") || q3Answer.includes("doesn't delete"))) {
                feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q3: Correct, it reorganizes, doesn't create more space.</li>`; correctCount++;
            } else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q3: Defragmentation doesn't create more free space, it consolidates it.</li>`; }

            const q4Answer = document.getElementById('defrag-q4').value.toLowerCase();
            if ((q4Answer.includes("no") || q4Answer.includes("not necessary") || q4Answer.includes("not recommended")) && (q4Answer.includes("ssd") || q4Answer.includes("solid state")) && (q4Answer.includes("no moving parts") || q4Answer.includes("flash memory") || q4Answer.includes("wear") || q4Answer.includes("limited write cycles"))) {
                feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q4: Correct, SSDs don't need it and it can reduce their lifespan.</li>`; correctCount++;
            } else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q4: Explain that SSDs have no moving parts, so fragmentation isn't an issue, and defragging can cause unnecessary wear.</li>`; }

            feedbackHtml += "</ul>";
            quizItem.dataset.answeredCorrectly = (correctCount === 4).toString();
            quizItem.dataset.answered = "true";
            feedbackDiv.innerHTML = `<p class="${correctCount === 4 ? 'correct-feedback' : 'incorrect-feedback'} font-semibold">You got ${correctCount}/4 questions correct.</p>${feedbackHtml}`;
            feedbackDiv.classList.add('show');
            if (scoreCalculated) calculateScore();
        }
        function resetDefragTask() {
            initializeDefragGrid();
            ['defrag-q1', 'defrag-q2', 'defrag-q3', 'defrag-q4'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('task1-feedback').classList.remove('show');
            const quizItem = document.querySelector('#task1-defragmentation .quiz-item');
            quizItem.dataset.answeredCorrectly = "false";
            delete quizItem.dataset.answered;
            if (scoreCalculated) calculateScore();
        }


        // --- Task 2: Encryption ---
        function runCaesarCipher(mode) {
            const plaintextEl = document.getElementById('caesar-plaintext');
            const ciphertextEl = document.getElementById('caesar-ciphertext');
            const key = parseInt(document.getElementById('caesar-key').value);
            const outputEl = document.getElementById('caesar-output');
            outputEl.textContent = '';

            if (isNaN(key) || key < 1 || key > 25) {
                outputEl.textContent = "Invalid key (must be 1-25)."; return;
            }

            const textToProcess = (mode === 'encrypt') ? plaintextEl.value.toUpperCase() : ciphertextEl.value.toUpperCase();
            if (!/^[A-Z\s]*$/.test(textToProcess)) { // Allow spaces, ignore them in processing
                outputEl.textContent = "Invalid input (A-Z and spaces only)."; return;
            }
            
            let result = "";
            for (let i = 0; i < textToProcess.length; i++) {
                let char = textToProcess[i];
                if (char === ' ') { result += ' '; continue; } // Preserve spaces
                let code = char.charCodeAt(0);
                let shiftedCode;
                if (mode === 'encrypt') {
                    shiftedCode = ((code - 65 + key) % 26) + 65;
                } else { // decrypt
                    shiftedCode = ((code - 65 - key + 26) % 26) + 65; // +26 to handle negative results from modulo
                }
                result += String.fromCharCode(shiftedCode);
            }

            if (mode === 'encrypt') {
                ciphertextEl.value = result;
                outputEl.textContent = `Encryption complete. Ciphertext: ${result}`;
            } else {
                plaintextEl.value = result;
                outputEl.textContent = `Decryption complete. Plaintext: ${result}`;
            }
        }
        function checkEncryptionAnswers() {
            const feedbackDiv = document.getElementById('task2-feedback');
            const quizItemFill = document.querySelector('#task2-encryption .quiz-item[data-points="3"]');
            const quizItemExplain = document.querySelector('#task2-encryption .quiz-item[data-points="2"]');
            let fillCorrectCount = 0;
            let feedbackHtml = "<ul>";

            const blanks = { "enc-blank1": "plaintext", "enc-blank2": "ciphertext", "enc-blank3": "algorithm", "enc-blank4": "key" };
            for (const id in blanks) {
                const inputEl = document.getElementById(id);
                const userAnswer = inputEl.value.trim().toLowerCase();
                inputEl.classList.remove('correct', 'incorrect');
                if (userAnswer === blanks[id]) {
                    inputEl.classList.add('correct'); fillCorrectCount++;
                } else { inputEl.classList.add('incorrect'); }
            }
            let fillPoints = 0;
            if (fillCorrectCount === 4) fillPoints = 3;
            else if (fillCorrectCount === 3) fillPoints = 2;
            else if (fillCorrectCount >= 2) fillPoints = 1;

            if (fillPoints === 3) feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Fill-in-the-blanks: All correct! (+3 points)</li>`;
            else feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Fill-in-the-blanks: ${fillCorrectCount}/4 correct. (Expected: plaintext, ciphertext, algorithm, key). (+${fillPoints} points)</li>`;
            quizItemFill.dataset.answeredCorrectly = (fillPoints === 3).toString();
            quizItemFill.dataset.answered = "true";


            const explanation = document.getElementById('encryption-explanation').value.toLowerCase();
            let explainPoints = 0;
            const explainKeywords = {
                "scrambles": ["scramble", "mix up", "jumble", "unreadable", "indecipherable"],
                "key_needed": ["key", "password", "secret code", "unlock", "decrypt"]
            };
            if (explainKeywords.scrambles.some(kw => explanation.includes(kw))) explainPoints++;
            if (explainKeywords.key_needed.some(kw => explanation.includes(kw))) explainPoints++;
            
            if (explainPoints === 2) feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Explanation: Good! You covered scrambling and the need for a key. (+2 points)</li>`;
            else if (explainPoints === 1) feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Explanation: Partially correct. Ensure you mention both how data is made unreadable AND the role of a key. (+1 point)</li>`;
            else feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Explanation: Needs more detail. Explain that data is scrambled and requires a key to be read. (+0 points)</li>`;
            quizItemExplain.dataset.answeredCorrectly = (explainPoints === 2).toString();
            quizItemExplain.dataset.answered = "true";

            feedbackHtml += "</ul>";
            feedbackDiv.innerHTML = feedbackHtml;
            feedbackDiv.classList.add('show');
            if (scoreCalculated) calculateScore();
        }
        function resetEncryptionTask() {
            ['enc-blank1', 'enc-blank2', 'enc-blank3', 'enc-blank4', 'encryption-explanation', 'caesar-plaintext', 'caesar-ciphertext'].forEach(id => {
                const el = document.getElementById(id);
                el.value = '';
                if(el.classList.contains('fill-blank')) el.classList.remove('correct', 'incorrect');
            });
            document.getElementById('caesar-key').value = "3";
            document.getElementById('caesar-output').textContent = '';
            document.getElementById('task2-feedback').classList.remove('show');
            document.querySelectorAll('#task2-encryption .quiz-item').forEach(item => {
                item.dataset.answeredCorrectly = "false";
                delete item.dataset.answered;
            });
            if (scoreCalculated) calculateScore();
        }

        // --- Task 3: Compression ---
        function runRLECompression() {
            const input = document.getElementById('rle-input').value;
            const outputEl = document.getElementById('rle-output');
            if (!input) { outputEl.textContent = "Please enter a string."; return; }
            let encoded = "";
            let count = 1;
            for (let i = 0; i < input.length; i++) {
                if (i + 1 < input.length && input[i] === input[i+1]) {
                    count++;
                } else {
                    encoded += count + input[i];
                    count = 1;
                }
            }
            outputEl.textContent = encoded;
        }
        function checkCompressionAnswers() {
            const feedbackDiv = document.getElementById('task3-feedback');
            const quizItem = document.querySelector('#task3-compression .quiz-item');
            let correctCount = 0;
            let feedbackHtml = "<ul>";

            const q1 = document.getElementById('compression-q1').value.trim().toLowerCase();
            if (q1 === "lossless") { feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q1: Correct!</li>`; correctCount++; }
            else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q1: Incorrect. RLE is lossless.</li>`; }

            const q2 = document.getElementById('compression-q2').value.trim().toLowerCase();
            if (q2.includes("repeating") || q2.includes("repetition") || q2.includes("consecutive") || q2.includes("patterns")) {
                feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q2: Correct!</li>`; correctCount++;
            } else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q2: Incorrect. RLE works best with data containing sequences of repeating values.</li>`; }

            const q3 = document.getElementById('compression-q3').value.trim().toLowerCase();
            if (q3.includes("smaller") || q3.includes("less space") || q3.includes("faster load") || q3.includes("quicker transfer") || q3.includes("reduce bandwidth")) {
                feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q3: Correct!</li>`; correctCount++;
            } else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q3: Incorrect. Benefits include smaller file size for storage or faster web loading.</li>`; }
            
            feedbackHtml += "</ul>";
            quizItem.dataset.answeredCorrectly = (correctCount === 3).toString();
            quizItem.dataset.answered = "true";
            feedbackDiv.innerHTML = `<p class="${correctCount === 3 ? 'correct-feedback' : 'incorrect-feedback'} font-semibold">You got ${correctCount}/3 questions correct.</p>${feedbackHtml}`;
            feedbackDiv.classList.add('show');
            if (scoreCalculated) calculateScore();
        }
        function resetCompressionTask() {
            ['rle-input', 'compression-q1', 'compression-q2', 'compression-q3'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('rle-output').textContent = '';
            document.getElementById('task3-feedback').classList.remove('show');
            const quizItem = document.querySelector('#task3-compression .quiz-item');
            quizItem.dataset.answeredCorrectly = "false";
            delete quizItem.dataset.answered;
            if (scoreCalculated) calculateScore();
        }

        // --- Task 4: Backup ---
        function checkBackupAnswers() {
            const feedbackDiv = document.getElementById('task4-feedback');
            const quizItem = document.querySelector('#task4-backup .quiz-item');
            let correctCount = 0;
            let feedbackHtml = "<ul>";

            const s1Answer = document.querySelector('input[name="backup-s1"]:checked');
            if (s1Answer && s1Answer.value === "full") { feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Scenario 1: Correct!</li>`; correctCount++; }
            else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Scenario 1: Incorrect. Full backup is best for fastest restore.</li>`; }

            const s2Answer = document.querySelector('input[name="backup-s2"]:checked');
            if (s2Answer && s2Answer.value === "incremental") { feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Scenario 2: Correct!</li>`; correctCount++; }
            else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Scenario 2: Incorrect. Incremental is quick for daily small changes.</li>`; }

            const q1 = document.getElementById('backup-q1').value.trim().toLowerCase();
            if (q1.includes("loss") || q1.includes("failure") || q1.includes("recover") || q1.includes("accident")) { feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q3: Correct!</li>`; correctCount++; }
            else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q3: Incorrect. Think about preventing data loss.</li>`; }

            const q2 = document.getElementById('backup-q2').value.trim().toLowerCase();
            if (q2.includes("all") && (q2.includes("incrementals") || q2.includes("previous")) && (q2.includes("restore") || q2.includes("recover"))) { feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Q4: Correct!</li>`; correctCount++; }
            else { feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Q4: Incorrect. Restoring requires the last full backup AND all subsequent incrementals.</li>`; }

            feedbackHtml += "</ul>";
            quizItem.dataset.answeredCorrectly = (correctCount === 4).toString();
            quizItem.dataset.answered = "true";
            feedbackDiv.innerHTML = `<p class="${correctCount === 4 ? 'correct-feedback' : 'incorrect-feedback'} font-semibold">You got ${correctCount}/4 questions correct.</p>${feedbackHtml}`;
            feedbackDiv.classList.add('show');
            if (scoreCalculated) calculateScore();
        }
        function resetBackupTask() {
            document.querySelectorAll('input[name="backup-s1"], input[name="backup-s2"]').forEach(radio => radio.checked = false);
            document.getElementById('backup-q1').value = '';
            document.getElementById('backup-q2').value = '';
            document.getElementById('task4-feedback').classList.remove('show');
            const quizItem = document.querySelector('#task4-backup .quiz-item');
            quizItem.dataset.answeredCorrectly = "false";
            delete quizItem.dataset.answered;
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
                if (item.closest('#starter-activity') || item.closest('#exam-practice-utilities') || item.closest('#task1-defragmentation textarea') /* exclude textareas in defrag */) return;

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
            // Reset Starter
            ['starter-q1-utility', 'starter-q2-examples', 'starter-q3-why'].forEach(id => document.getElementById(id).value = '');
            const starterRevealBtn = document.querySelector("button[onclick*='starter-answers-feedback']");
            const starterFeedbackDiv = document.getElementById('starter-answers-feedback');
            if (starterFeedbackDiv.classList.contains('show')) toggleReveal('starter-answers-feedback', starterRevealBtn, 'Reveal Example Answers', 'Hide Example Answers');
            
            // Reset Tasks
            resetDefragTask();
            resetEncryptionTask();
            resetCompressionTask();
            resetBackupTask();

            // Reset Exam Practice
            ['exam-q1-util', 'exam-q2-util', 'exam-q3-util'].forEach(id => { 
                const el = document.getElementById(id); if(el) el.value = '';
            });
            ['ms-exam-q1-util', 'ms-exam-q2-util', 'ms-exam-q3-util'].forEach(id => {
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
                margin:       [0.5, 0.5, 0.7, 0.5], // top, left, bottom, right (inches)
                filename:     'gcse-utility-programs-lesson.pdf',
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
            initializeDefragGrid();
            // Calculate initial total possible score
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#exam-practice-utilities') ) return; // Exclude non-scored
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

            document.querySelectorAll('.quiz-item .option-button').forEach(button => {
                button.addEventListener('click', () => {
                    const quizItem = button.closest('.quiz-item');
                    // Ensure this generic handler doesn't interfere with more specific task handlers
                    if (quizItem && 
                        !quizItem.closest('#task1-defragmentation') && 
                        !quizItem.closest('#task2-encryption .quiz-item[data-points=\"3\"]') && 
                        !quizItem.closest('#task3-compression .quiz-item[data-points=\"3\"]') && 
                        !quizItem.closest('#task4-backup .quiz-item[data-points=\"4\"]') && 
                        !quizItem.querySelector('.option-button:disabled')) {
                        // This generic handler might not be needed if all tasks have specific handlers
                    }
                });
            });

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
        });