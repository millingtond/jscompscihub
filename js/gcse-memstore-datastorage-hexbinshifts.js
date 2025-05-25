// --- Flashcard Data for Tooltips ---
        const flashcardData = {
            "hexadecimal": "A base-16 number system using digits 0-9 and A-F. Often used as a shorthand for binary because 1 hex digit = 4 bits.",
            "binary": "A base-2 number system using only 0s and 1s. The fundamental language of computers.",
            "binary shifts": "An operation that moves all bits in a binary number to the left or right. Used for quick multiplication or division by powers of 2.",
            "nibble": "A group of 4 binary bits. One hexadecimal digit represents one nibble.",
            "overflow": "An error that occurs when the result of a calculation (like a binary shift left) is too large to fit in the available number of bits.",
            "integer division": "Division where any fractional part (remainder) is discarded. E.g., 7 / 2 = 3 in integer division. This applies to binary right shifts.",
            "representation": "How data is shown or interpreted. Hexadecimal is a representation of binary data."
        };

        // --- Global Variables for Scoring ---
        let task1Score = 0; const MAX_TASK1_SCORE = 8; // 2 for base/bits, 6 for hex digits
        let task2Score = 0; const MAX_TASK2_SCORE = 1; // 1 if conversion attempted and output shown
        let task3Score = 0; const MAX_TASK3_SCORE = 1;
        let task4Score = 0; const MAX_TASK4_SCORE = 1;
        let task5Score = 0; const MAX_TASK5_SCORE = 1;
        // Task 6 & 7 (simulations) are for understanding, not directly scored in this simple model
        let task8Score = 0; const MAX_TASK8_SCORE = 3; // 3 questions in practice
        // Exam questions are self-assessed via mark scheme

        // --- Data for Shift Detective Task ---
        const shiftDetectiveProblems = [
            {
                id: 'detective-q1',
                explanationTextareaId: 'detective-q1-explanation',
                keywords: ['overflow', 'lost', 'bit shifted out', '1 shifted out', 'denary incorrect', 'not 404', 'value too large', 'msb'],
                correctExplanation: "Mistake: Overflow occurred. The leading '1' from 11001010 was shifted out and lost. The resulting binary 10010100 is denary 148, not 404. The multiplication by 2 rule doesn't apply simply if overflow happens."
            },
            {
                id: 'detective-q2',
                explanationTextareaId: 'detective-q2-explanation',
                keywords: ['integer division', 'fraction', 'decimal', 'lost', 'discarded', 'remainder', 'not 6.5', 'whole number', 'no decimals'],
                correctExplanation: "Mistake: Binary right shifts perform integer division. The fractional part (0.5) is lost/discarded. The denary result of shifting 00001101 (13) right by 1 is 00000110, which is denary 6, not 6.5."
            }
        ];
        let shiftDetectiveScore = 0; // Not currently used for total score, but can be tracked
        const MAX_SHIFT_DETECTIVE_SCORE = shiftDetectiveProblems.length;

        // --- Hex Color Mixer/Matcher ---
        let currentTargetHex = "#000000";
        let colorMatcherQuestionNumber = 0;
        const TOTAL_COLOR_MATCHER_QUESTIONS = 5;
        let colorMatcherScore = 0;
        const COLOR_DISTANCE_THRESHOLD = 75; // Lower is stricter. Max distance is ~441.
        let colorMatchGameActive = false;

        // --- Helper Functions ---
        function getById(id) { return document.getElementById(id); }

        function denaryToHexDigit(den) {
            if (den < 10) return den.toString();
            return String.fromCharCode('A'.charCodeAt(0) + den - 10);
        }

        function hexDigitToDenary(hex) {
            hex = hex.toUpperCase();
            if (hex >= '0' && hex <= '9') return parseInt(hex);
            if (hex >= 'A' && hex <= 'F') return hex.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
            return NaN; // Invalid hex digit
        }

        function hexComponentToDenary(hexComp) { // e.g., "FF" -> 255
            if (!/^[0-9A-F]{2}$/i.test(hexComp)) return NaN;
            return parseInt(hexComp, 16);
        }

        function denaryToBinary(den, bits = 8) {
            if (isNaN(den) || den < 0 || den > 255 && bits === 8) return "Invalid";
            return den.toString(2).padStart(bits, '0');
        }

        function binaryToDenary(bin) {
            if (!/^[01]+$/.test(bin)) return NaN;
            return parseInt(bin, 2);
        }

        // --- Starter Activity ---
        function revealStarterAnswers() {
            const feedbackDiv = getById('starter-answers-feedback');
            feedbackDiv.classList.toggle('show');
        }

        // --- Task 1: Hex Basics ---
        function checkTask1HexBasics() {
            task1Score = 0;
            const feedback = getById('task1-feedback');
            let html = "<ul>";
            let allCorrect = true;

            // Base
            const baseAnswer = getById('hex-base-answer').value.trim();
            if (baseAnswer === "16") {
                html += "<li class='correct-feedback'>a) Hex base is 16 - Correct!</li>";
                task1Score++;
            } else {
                html += `<li class='incorrect-feedback'>a) Hex base is 16, you put ${baseAnswer || 'nothing'}.</li>`;
                allCorrect = false;
            }

            // Bits
            const bitsAnswer = getById('hex-bits-answer').value.trim();
            if (bitsAnswer === "4") {
                html += "<li class='correct-feedback'>b) One hex digit is 4 bits - Correct!</li>";
                task1Score++;
            } else {
                html += `<li class='incorrect-feedback'>b) One hex digit is 4 bits, you put ${bitsAnswer || 'nothing'}.</li>`;
                allCorrect = false;
            }

            // Hex digits
            const hexDigits = { 'A': "10", 'B': "11", 'C': "12", 'D': "13", 'E': "14", 'F': "15" };
            let correctDigits = 0;
            for (const hex in hexDigits) {
                const userAnswer = getById('hex-' + hex).value.trim();
                if (userAnswer === hexDigits[hex]) {
                    correctDigits++;
                } else {
                    allCorrect = false;
                }
            }
            if (correctDigits === Object.keys(hexDigits).length) {
                html += "<li class='correct-feedback'>c) All hex digit denary values are correct!</li>";
                task1Score += correctDigits;
            } else {
                html += `<li class='incorrect-feedback'>c) Some hex digit denary values are incorrect. (A=10, B=11, C=12, D=13, E=14, F=15). You got ${correctDigits}/${Object.keys(hexDigits).length}.</li>`;
                task1Score += correctDigits; // Partial score
                allCorrect = false;
            }

            html += "</ul>";
            if (allCorrect) {
                feedback.innerHTML = "<p class='correct-feedback font-semibold'>Task 1 All Correct!</p>" + html;
            } else {
                feedback.innerHTML = "<p class='incorrect-feedback font-semibold'>Task 1 - Some answers need review.</p>" + html;
            }
            feedback.className = allCorrect ? 'feedback-area show correct-feedback' : 'feedback-area show incorrect-feedback';
        }

        // --- Task 2: Denary to Hex ---
        function convertDenToHex() {
            const denInput = parseInt(getById('den-to-hex-input').value);
            const outputEl = getById('den-to-hex-output');
            const stepsEl = getById('den-to-hex-steps');
            stepsEl.innerHTML = "";

            if (isNaN(denInput) || denInput < 0 || denInput > 255) {
                outputEl.textContent = "Invalid input (0-255)";
                task2Score = 0;
                return;
            }

            let num = denInput;
            let hexString = "";
            let stepsHtml = "<p><strong>Steps:</strong></p>";

            if (num === 0) {
                hexString = "00"; // Or just "0" if preferred for single 0
                stepsHtml += `<p>0 / 16 = 0 remainder 0</p>`;
            } else {
                // First division for the second hex digit
                let remainder = num % 16;
                let quotient = Math.floor(num / 16);
                stepsHtml += `<p>${num} / 16 = ${quotient} remainder ${remainder} (Hex: ${denaryToHexDigit(remainder)})</p>`;
                hexString = denaryToHexDigit(remainder) + hexString;
                num = quotient;

                // Second division for the first hex digit (if num > 0)
                remainder = num % 16;
                quotient = Math.floor(num / 16); // Should be 0 now
                stepsHtml += `<p>${num} / 16 = ${quotient} remainder ${remainder} (Hex: ${denaryToHexDigit(remainder)})</p>`;
                hexString = denaryToHexDigit(remainder) + hexString;
            }
            
            outputEl.textContent = hexString.padStart(2, '0'); // Ensure 2 digits for 0-255 range
            stepsEl.innerHTML = stepsHtml + `<p>Reading remainders bottom-up: ${hexString.padStart(2, '0')}</p>`;
            task2Score = 1;
        }

        // --- Task 3: Hex to Denary ---
        function convertHexToDen() {
            const hexInput = getById('hex-to-den-input').value.toUpperCase();
            const outputEl = getById('hex-to-den-output');
            const stepsEl = getById('hex-to-den-steps');
            stepsEl.innerHTML = "";

            if (hexInput.length === 0 || hexInput.length > 2 || !/^[0-9A-F]+$/.test(hexInput)) {
                outputEl.textContent = "Invalid Hex (1-2 digits, 0-9, A-F)";
                task3Score = 0;
                return;
            }

            let denaryValue = 0;
            let stepsHtml = "<p><strong>Steps:</strong></p>";

            if (hexInput.length === 1) {
                const d0 = hexDigitToDenary(hexInput[0]);
                denaryValue = d0;
                stepsHtml += `<p>'${hexInput[0]}' (denary ${d0}) = ${d0}</p>`;
            } else { // length is 2
                const d1 = hexDigitToDenary(hexInput[0]); // Most significant digit
                const d0 = hexDigitToDenary(hexInput[1]); // Least significant digit
                if (isNaN(d1) || isNaN(d0)) {
                     outputEl.textContent = "Invalid Hex Digit"; task3Score = 0; return;
                }
                denaryValue = (d1 * 16) + d0;
                stepsHtml += `<p>First digit '${hexInput[0]}' (denary ${d1}): ${d1} * 16 = ${d1 * 16}</p>`;
                stepsHtml += `<p>Second digit '${hexInput[1]}' (denary ${d0}): ${d0} * 1 = ${d0}</p>`;
                stepsHtml += `<p>Total: ${d1 * 16} + ${d0} = ${denaryValue}</p>`;
            }

            outputEl.textContent = denaryValue;
            stepsEl.innerHTML = stepsHtml;
            task3Score = 1;
        }

        // --- Task 4: Binary to Hex ---
        function convertBinToHex() {
            const binInput = getById('bin-to-hex-input').value;
            const outputEl = getById('bin-to-hex-output');
            const stepsEl = getById('bin-to-hex-steps');
            stepsEl.innerHTML = "";

            if (binInput.length !== 8 || !/^[01]{8}$/.test(binInput)) {
                outputEl.textContent = "Invalid 8-bit binary";
                task4Score = 0;
                return;
            }

            const nibble1_bin = binInput.substring(0, 4);
            const nibble2_bin = binInput.substring(4, 8);

            const nibble1_den = binaryToDenary(nibble1_bin);
            const nibble2_den = binaryToDenary(nibble2_bin);

            const hex1 = denaryToHexDigit(nibble1_den);
            const hex2 = denaryToHexDigit(nibble2_den);

            outputEl.textContent = hex1 + hex2;
            stepsEl.innerHTML = `
                <p><strong>Steps:</strong></p>
                <p>Split into nibbles: <span class='hex-digit-group'>${nibble1_bin}</span> <span class='hex-digit-group'>${nibble2_bin}</span></p>
                <p>First nibble <code>${nibble1_bin}</code> = denary ${nibble1_den} = hex <strong>${hex1}</strong></p>
                <p>Second nibble <code>${nibble2_bin}</code> = denary ${nibble2_den} = hex <strong>${hex2}</strong></p>
                <p>Combined: ${hex1}${hex2}</p>
            `;
            task4Score = 1;
        }

        // --- Task 5: Hex to Binary ---
        function convertHexToBin() {
            const hexInput = getById('hex-to-bin-input').value.toUpperCase();
            const outputEl = getById('hex-to-bin-output');
            const stepsEl = getById('hex-to-bin-steps');
            stepsEl.innerHTML = "";

            if (hexInput.length === 0 || hexInput.length > 2 || !/^[0-9A-F]+$/.test(hexInput)) {
                outputEl.textContent = "Invalid Hex (1-2 digits)";
                task5Score = 0;
                return;
            }
            
            let fullHexInput = hexInput.padStart(2, '0'); // Pad if single digit for consistency

            const hex1 = fullHexInput[0];
            const hex2 = fullHexInput[1];

            const den1 = hexDigitToDenary(hex1);
            const den2 = hexDigitToDenary(hex2);

            if (isNaN(den1) || isNaN(den2)) {
                outputEl.textContent = "Invalid hex digit"; task5Score = 0; return;
            }

            const bin1 = denaryToBinary(den1, 4);
            const bin2 = denaryToBinary(den2, 4);

            outputEl.textContent = bin1 + bin2;
            stepsEl.innerHTML = `
                <p><strong>Steps:</strong></p>
                <p>First hex digit '${hex1}' = denary ${den1} = 4-bit binary <strong>${bin1}</strong></p>
                <p>Second hex digit '${hex2}' = denary ${den2} = 4-bit binary <strong>${bin2}</strong></p>
                <p>Combined: ${bin1}${bin2}</p>
            `;
            task5Score = 1;
        }

        // --- Task 6: Binary Shift Left ---
        function simulateShiftLeft() {
            const binaryInput = getById('shift-left-binary-input').value;
            const places = parseInt(getById('shift-left-places').value);
            const originalDenEl = getById('shift-left-original-den');
            const resultBinEl = getById('shift-left-result-binary');
            const resultDenEl = getById('shift-left-result-den');
            const overflowEl = getById('shift-left-overflow');
            const stepsEl = getById('shift-left-steps');
            stepsEl.innerHTML = "";
            overflowEl.textContent = "";

            if (binaryInput.length !== 8 || !/^[01]{8}$/.test(binaryInput) || isNaN(places) || places < 1 || places > 7) {
                originalDenEl.textContent = "Invalid input";
                resultBinEl.textContent = "N/A";
                resultDenEl.textContent = "N/A";
                return;
            }

            const originalDen = binaryToDenary(binaryInput);
            originalDenEl.textContent = originalDen;

            let shiftedBinary = binaryInput;
            let stepsHtml = "<p><strong>Steps:</strong></p>";
            stepsHtml += `<p>Original: ${binaryInput} (Denary: ${originalDen})</p>`;

            for (let i = 0; i < places; i++) {
                let bitShiftedOut = shiftedBinary[0];
                shiftedBinary = shiftedBinary.substring(1) + '0';
                stepsHtml += `<p>Shift left ${i+1}: <span class='binary-string-vis'><span class='shifted-out'>${bitShiftedOut}</span>${shiftedBinary.substring(0, 7)}<span class='shifted-in'>0</span></span> (Bit '${bitShiftedOut}' shifted out)</p>`;
                if (bitShiftedOut === '1') {
                    overflowEl.textContent = "OVERFLOW occurred! A '1' was shifted out.";
                }
            }

            resultBinEl.innerHTML = `<span class='binary-string-vis'>${shiftedBinary}</span>`;
            const shiftedDen = binaryToDenary(shiftedBinary);
            resultDenEl.textContent = shiftedDen;
            stepsHtml += `<p>Final Result: ${shiftedBinary} (Denary: ${shiftedDen})</p>`;
            stepsEl.innerHTML = stepsHtml;
        }

        // --- Task 7: Binary Shift Right ---
        function simulateShiftRight() {
            const binaryInput = getById('shift-right-binary-input').value;
            const places = parseInt(getById('shift-right-places').value);
            const originalDenEl = getById('shift-right-original-den');
            const resultBinEl = getById('shift-right-result-binary');
            const resultDenEl = getById('shift-right-result-den');
            const stepsEl = getById('shift-right-steps');
            stepsEl.innerHTML = "";

            if (binaryInput.length !== 8 || !/^[01]{8}$/.test(binaryInput) || isNaN(places) || places < 1 || places > 7) {
                originalDenEl.textContent = "Invalid input";
                resultBinEl.textContent = "N/A";
                resultDenEl.textContent = "N/A";
                return;
            }

            const originalDen = binaryToDenary(binaryInput);
            originalDenEl.textContent = originalDen;

            let shiftedBinary = binaryInput;
            let stepsHtml = "<p><strong>Steps:</strong></p>";
            stepsHtml += `<p>Original: ${binaryInput} (Denary: ${originalDen})</p>`;

            for (let i = 0; i < places; i++) {
                let bitShiftedOut = shiftedBinary[7];
                shiftedBinary = '0' + shiftedBinary.substring(0, 7);
                stepsHtml += `<p>Shift right ${i+1}: <span class='binary-string-vis'><span class='shifted-in'>0</span>${shiftedBinary.substring(1,8)}<span class='shifted-out'>${bitShiftedOut}</span></span> (Bit '${bitShiftedOut}' shifted out)</p>`;
            }

            resultBinEl.innerHTML = `<span class='binary-string-vis'>${shiftedBinary}</span>`;
            const shiftedDen = binaryToDenary(shiftedBinary);
            resultDenEl.textContent = shiftedDen;
            stepsHtml += `<p>Final Result: ${shiftedBinary} (Denary: ${shiftedDen})</p>`;
            stepsEl.innerHTML = stepsHtml;
        }

        // --- Task 8: Binary Shift Practice ---
        function checkTask8ShiftPractice() {
            task8Score = 0;
            const feedback = getById('task8-feedback');
            let html = "<ul>";
            let allCorrect = true;

            const q1Bin = getById('shift-q1-bin').value.trim();
            const q1Den = getById('shift-q1-den').value.trim();
            if (q1Bin === "10110000" && q1Den === "176") {
                html += "<li class='correct-feedback'>1. Correct! 00101100 (44) shifted left by 2 is 10110000 (176).</li>";
                task8Score++;
            } else {
                html += `<li class='incorrect-feedback'>1. Incorrect. 00101100 (44) shifted left by 2 is 10110000 (176). You put Bin: ${q1Bin}, Den: ${q1Den}.</li>`;
                allCorrect = false;
            }

            const q2Bin = getById('shift-q2-bin').value.trim();
            const q2Den = getById('shift-q2-den').value.trim();
            if (q2Bin === "00011100" && q2Den === "28") {
                html += "<li class='correct-feedback'>2. Correct! 11100000 (224) shifted right by 3 is 00011100 (28).</li>";
                task8Score++;
            } else {
                html += `<li class='incorrect-feedback'>2. Incorrect. 11100000 (224) shifted right by 3 is 00011100 (28). You put Bin: ${q2Bin}, Den: ${q2Den}.</li>`;
                allCorrect = false;
            }

            const q3Bin = getById('shift-q3-bin').value.trim();
            const q3Issue = getById('shift-q3-issue').value.trim().toLowerCase();
            if (q3Bin === "00000010" && (q3Issue.includes("overflow") || q3Issue.includes("loss of data"))) {
                html += "<li class='correct-feedback'>3. Correct! 10000001 (129) shifted left by 1 is 00000010 (2) due to overflow.</li>";
                task8Score++;
            } else {
                html += `<li class='incorrect-feedback'>3. Incorrect. 10000001 (129) shifted left by 1 results in 00000010 (2) because the leading '1' is lost (overflow). You put Bin: ${q3Bin}, Issue: ${q3Issue}.</li>`;
                allCorrect = false;
            }

            html += "</ul>";
            if (allCorrect) {
                feedback.innerHTML = "<p class='correct-feedback font-semibold'>Task 8 All Correct!</p>" + html;
            } else {
                feedback.innerHTML = "<p class='incorrect-feedback font-semibold'>Task 8 - Some answers need review.</p>" + html;
            }
            feedback.className = allCorrect ? 'feedback-area show correct-feedback' : 'feedback-area show incorrect-feedback';
        }

        // --- Binary Shift Detective ---
        function checkShiftDetectiveAnswers() {
            shiftDetectiveScore = 0;
            const feedbackEl = getById('shift-detective-feedback');
            let html = "<ul>";
            let allCorrectlyExplained = true;

            shiftDetectiveProblems.forEach((problem, index) => {
                const userAnswer = getById(problem.explanationTextareaId).value.trim().toLowerCase();
                let foundKeyword = false;
                for (const keyword of problem.keywords) {
                    if (userAnswer.includes(keyword)) {
                        foundKeyword = true;
                        break;
                    }
                }

                if (foundKeyword && userAnswer.length > 15) { // Basic check for some effort and keyword
                    html += `<li class='correct-feedback'>Problem ${index + 1} Explanation: Good insight! You've likely spotted the issue. <br><span class="text-xs italic">Key idea: ${problem.correctExplanation}</span></li>`;
                    shiftDetectiveScore++;
                } else {
                    html += `<li class='incorrect-feedback'>Problem ${index + 1} Explanation: Your explanation might be missing the key point or is too brief. <br><span class="text-xs italic">Consider: ${problem.correctExplanation}</span></li>`;
                    allCorrectlyExplained = false;
                }
            });

            html += "</ul>";
            feedbackEl.innerHTML = `<p class='${allCorrectlyExplained ? "correct-feedback" : "incorrect-feedback"} font-semibold'>Shift Detective Review:</p>${html}`;
            feedbackEl.className = `feedback-area show ${allCorrectlyExplained ? "correct-feedback" : "incorrect-feedback"}`;
            feedbackEl.classList.add('show');
        }

        // --- Hex Color Mixer/Matcher Functions ---
        function isValidHexComponent(hex) {
            return /^[0-9A-F]{2}$/i.test(hex); // Case-insensitive check for 2 hex digits
        }

        function updateUserColor() {
            const rInput = getById('hex-color-r');
            const gInput = getById('hex-color-g');
            const bInput = getById('hex-color-b');

            // Function to sanitize and limit input: uppercase, hex chars only, max 2 length
            const sanitizeHexInput = (value) => {
                return value.toUpperCase().replace(/[^0-9A-F]/g, '').substring(0, 2);
            };

            let r_processed = sanitizeHexInput(rInput.value);
            let g_processed = sanitizeHexInput(gInput.value);
            let b_processed = sanitizeHexInput(bInput.value);

            // Update input fields with their sanitized values if they changed.
            // This allows typing 'A', 'AF'. 'AG' becomes 'A'. 'AFF' becomes 'AF'.
            if (rInput.value !== r_processed) {
                rInput.value = r_processed;
            }
            if (gInput.value !== g_processed) {
                gInput.value = g_processed;
            }
            if (bInput.value !== b_processed) {
                bInput.value = b_processed;
            }
            
            // Determine values for the color swatch. Use "00" if not a complete 2-digit hex.
            const r_for_swatch = isValidHexComponent(r_processed) ? r_processed : "00";
            const g_for_swatch = isValidHexComponent(g_processed) ? g_processed : "00";
            const b_for_swatch = isValidHexComponent(b_processed) ? b_processed : "00";
            
            const swatchHexColor = `#${r_for_swatch}${g_for_swatch}${b_for_swatch}`;
            getById('user-color-swatch').style.backgroundColor = swatchHexColor;

            // Update the text display of the user's hex code (e.g., #AA_F_0)
            const formatForHexDisplay = (val) => {
                if (val.length === 0) return '__';
                if (val.length === 1) return val + '_';
                return val; // length is 2
            };
            getById('user-hex-code-display').textContent = 
                `#${formatForHexDisplay(r_processed)}${formatForHexDisplay(g_processed)}${formatForHexDisplay(b_processed)}`;
            
            return swatchHexColor; // Return the hex used for the swatch, for comparison logic
        }

        function updateColorMatchGameStatus() {
            const statusEl = getById('color-match-game-status');
            if (colorMatchGameActive) {
                statusEl.innerHTML = `Question: ${colorMatcherQuestionNumber} / ${TOTAL_COLOR_MATCHER_QUESTIONS} <br> Score: ${colorMatcherScore}`;
            } else {
                statusEl.innerHTML = '';
            }
        }

        function startColorMatchGame() {
            colorMatchGameActive = true;
            colorMatcherQuestionNumber = 0; // Will be incremented to 1 by generateNewTargetColor
            colorMatcherScore = 0;
            generateNewTargetColor(); // This will set up the first question
            getById('start-color-match-game-btn').textContent = "Restart Color Match Game";
            getById('check-color-match-btn').style.display = 'inline-block'; // Ensure check button is visible
        }

        function generateRandomHexByte() {
            return Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
        }

        function generateNewTargetColor() {
            const r = generateRandomHexByte();
            const g = generateRandomHexByte();
            const b = generateRandomHexByte();
            currentTargetHex = `#${r}${g}${b}`;

            if (colorMatchGameActive) {
                colorMatcherQuestionNumber++;
                if (colorMatcherQuestionNumber > TOTAL_COLOR_MATCHER_QUESTIONS) {
                    // Game Over
                    colorMatchGameActive = false;
                    const feedbackEl = getById('color-match-feedback');
                    feedbackEl.innerHTML = `<p class="font-semibold">Game Over! Your final score: ${colorMatcherScore} / ${TOTAL_COLOR_MATCHER_QUESTIONS}</p>`;
                    feedbackEl.className = 'feedback-area show correct-feedback'; // Use correct for final score
                    getById('start-color-match-game-btn').textContent = "Play Again?";
                    // Optionally hide the "Check My Guess" button if game is over
                    // getById('check-color-match-btn').style.display = 'none'; 
                    updateColorMatchGameStatus(); // Update to show final state or clear
                    return; // Don't set a new target if game is over
                }
            }

            getById('target-color-swatch').style.backgroundColor = currentTargetHex;
            getById('target-hex-code-display-visible').textContent = "(Hidden)"; // Keep it hidden or reveal on check
            const feedbackEl = getById('color-match-feedback');
            feedbackEl.classList.remove('show', 'correct-feedback', 'incorrect-feedback');
            feedbackEl.textContent = '';
            updateColorMatchGameStatus();
        }

        function checkColorMatch() {
            if (!colorMatchGameActive) {
                alert("Please start the game first!");
                return;
            }

            const userHex = updateUserColor().toUpperCase(); // Ensure user color is updated and fetched
            const feedbackEl = getById('color-match-feedback');
            
            getById('target-hex-code-display-visible').textContent = currentTargetHex; // Reveal target

            // Calculate color distance
            const rUser = hexComponentToDenary(userHex.substring(1, 3));
            const gUser = hexComponentToDenary(userHex.substring(3, 5));
            const bUser = hexComponentToDenary(userHex.substring(5, 7));

            const rTarget = hexComponentToDenary(currentTargetHex.substring(1, 3));
            const gTarget = hexComponentToDenary(currentTargetHex.substring(3, 5));
            const bTarget = hexComponentToDenary(currentTargetHex.substring(5, 7));

            let distance = Infinity;
            if (![rUser, gUser, bUser, rTarget, gTarget, bTarget].some(isNaN)) {
                 distance = Math.sqrt(
                    Math.pow(rUser - rTarget, 2) +
                    Math.pow(gUser - gTarget, 2) +
                    Math.pow(bUser - bTarget, 2)
                );
            }

            if (distance === 0) { // Exact match
                feedbackEl.innerHTML = `<span class="correct-feedback"><i class="fas fa-check-circle mr-1"></i>Perfect Match! +1 Point. Distance: ${distance.toFixed(0)}</span>`;
                feedbackEl.className = 'feedback-area show correct-feedback';
                colorMatcherScore++;
            } else if (distance <= COLOR_DISTANCE_THRESHOLD) {
                feedbackEl.innerHTML = `<span class="correct-feedback"><i class="fas fa-thumbs-up mr-1"></i>Close Enough! +1 Point. Distance: ${distance.toFixed(0)}</span>`;
                feedbackEl.className = 'feedback-area show correct-feedback'; // Still "correct" for close enough
                colorMatcherScore++;
            } else {
                feedbackEl.innerHTML = `<span class="incorrect-feedback"><i class="fas fa-times-circle mr-1"></i>Not quite. Your color ${userHex}. Target: ${currentTargetHex}. Distance: ${distance.toFixed(0)}.</span>`;
                feedbackEl.className = 'feedback-area show incorrect-feedback';
            }
            feedbackEl.classList.add('show');
            updateColorMatchGameStatus(); // Update score display
            
            // Automatically move to the next question or end game
            setTimeout(generateNewTargetColor, 2000); // Delay before showing next target
        }

        document.addEventListener('DOMContentLoaded', () => {
            ['hex-color-r', 'hex-color-g', 'hex-color-b'].forEach(id => getById(id).addEventListener('input', updateUserColor));
        });

        // --- Exam Practice ---
        function toggleMarkScheme(markSchemeId) {
            const markSchemeDiv = getById(markSchemeId);
            if (markSchemeDiv) {
                markSchemeDiv.classList.toggle('show');
            }
        }

        // --- Final Score & Reset ---
        function calculateTotalScore() {
            const totalAchievableScore = MAX_TASK1_SCORE + MAX_TASK2_SCORE + MAX_TASK3_SCORE + MAX_TASK4_SCORE + MAX_TASK5_SCORE + MAX_TASK8_SCORE;
            const currentTotalScore = task1Score + task2Score + task3Score + task4Score + task5Score + task8Score;

            const scoreDisplay = getById('final-score-display');
            const feedbackDisplay = getById('final-score-feedback');
            const scoreArea = getById('final-score-area');

            scoreDisplay.textContent = `Your Score: ${currentTotalScore} / ${totalAchievableScore}`;
            let feedbackMessage = "";
            const percentage = totalAchievableScore > 0 ? (currentTotalScore / totalAchievableScore) * 100 : 0;

            if (percentage === 100) feedbackMessage = "Excellent! Full marks!";
            else if (percentage >= 80) feedbackMessage = "Great job! Strong understanding.";
            else if (percentage >= 60) feedbackMessage = "Good effort! Review the tasks for improvement.";
            else feedbackMessage = "Keep practicing! Review the tasks and definitions.";

            feedbackDisplay.textContent = feedbackMessage;
            scoreArea.style.display = 'block';
        }

        function resetAllTasks() {
            if (!confirm("Are you sure you want to reset all tasks? Your progress will be lost.")) return;

            // Reset Task 1
            ['hex-base-answer', 'hex-bits-answer', 'hex-A', 'hex-B', 'hex-C', 'hex-D', 'hex-E', 'hex-F'].forEach(id => getById(id).value = '');
            getById('task1-feedback').classList.remove('show');
            task1Score = 0;

            // Reset Task 2-5 (Conversion tools)
            ['den-to-hex-input', 'hex-to-den-input', 'bin-to-hex-input', 'hex-to-bin-input'].forEach(id => getById(id).value = '');
            ['den-to-hex-output', 'den-to-hex-steps', 'hex-to-den-output', 'hex-to-den-steps', 
             'bin-to-hex-output', 'bin-to-hex-steps', 'hex-to-bin-output', 'hex-to-bin-steps'].forEach(id => getById(id).innerHTML = '');
            task2Score = 0; task3Score = 0; task4Score = 0; task5Score = 0;

            // Reset Task 6 & 7 (Shift tools)
            getById('shift-left-binary-input').value = "00011010"; getById('shift-left-places').value = "1";
            getById('shift-left-original-den').textContent = ''; getById('shift-left-result-binary').innerHTML = '';
            getById('shift-left-result-den').textContent = ''; getById('shift-left-overflow').textContent = ''; getById('shift-left-steps').innerHTML = '';
            getById('shift-right-binary-input').value = "11010100"; getById('shift-right-places').value = "1";
            getById('shift-right-original-den').textContent = ''; getById('shift-right-result-binary').innerHTML = '';
            getById('shift-right-result-den').textContent = ''; getById('shift-right-steps').innerHTML = '';

            // Reset Task 8
            ['shift-q1-bin', 'shift-q1-den', 'shift-q2-bin', 'shift-q2-den', 'shift-q3-bin', 'shift-q3-issue'].forEach(id => getById(id).value = '');
            getById('task8-feedback').classList.remove('show');
            task8Score = 0;

            // Reset Hex Color Mixer/Matcher
            getById('hex-color-r').value = "00";
            getById('hex-color-g').value = "00";
            getById('hex-color-b').value = "00";
            updateUserColor(); // Update swatch and display
            // Reset game state
            colorMatchGameActive = false;
            colorMatcherQuestionNumber = 0;
            colorMatcherScore = 0;
            getById('color-match-feedback').classList.remove('show');
            getById('start-color-match-game-btn').textContent = "Start Color Match Game";
            updateColorMatchGameStatus(); // Clear status

            // Reset Shift Detective
            ['detective-q1-explanation', 'detective-q2-explanation'].forEach(id => {
                const el = getById(id); if(el) el.value = '';
            });
            if (getById('shift-detective-feedback')) getById('shift-detective-feedback').classList.remove('show');
            shiftDetectiveScore = 0;

            // Reset Exam Practice (clear textareas, hide mark schemes)
            ['exam-q1-answer', 'exam-q2-answer', 'exam-q3i-answer', 'exam-q3ii-answer', 'exam-q3iii-answer', 'exam-q4-answer', 'exam-q5-answer', 'exam-q6i-answer', 'exam-q6ii-answer', 'exam-q7-answer'].forEach(id => {
                const el = getById(id); if(el) el.value = '';
            });
            ['ms-q1', 'ms-q2', 'ms-q3', 'ms-q4', 'ms-q5', 'ms-q6', 'ms-q7'].forEach(id => getById(id).classList.remove('show'));

            // Reset Final Score display
            getById('final-score-area').style.display = 'none';

            alert("All tasks have been reset.");
        }

        // --- PDF Export (Answers Summary) ---
        function exportAnswersToPDF() {
            const summaryContainer = document.createElement('div');
            summaryContainer.id = 'pdf-summary-content';
            summaryContainer.style.fontFamily = 'Arial, sans-serif';
            summaryContainer.style.padding = '25px';
            summaryContainer.style.maxWidth = '780px';
            summaryContainer.style.margin = 'auto';
            summaryContainer.style.lineHeight = '1.6';

            let htmlContent = `
                <h1 style="text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Worksheet Answers Summary</h1>
                <h2 style="color: #3498db; margin-top: 25px; margin-bottom: 10px;">GCSE CS - Hexadecimal & Binary Shifts</h2>
            `;

            const getInputValue = (id) => (getById(id) ? (getById(id).value.trim() || '[Not answered]') : '[Element not found]');
            
            const addSection = (title, contentArray) => {
                htmlContent += `<h3 style="color: #2980b9; margin-top: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">${title}</h3>`;
                contentArray.forEach(item => {
                    htmlContent += `<p style="margin-left: 10px;"><strong>${item.label}:</strong><br>`;
                    htmlContent += `<pre style="background: #ecf0f1; padding: 8px; border: 1px solid #dde0e1; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; margin-top: 5px; font-family: Consolas, 'Courier New', monospace;">${item.value}</pre></p>`;
                });
            };

            // Starter Activity
            addSection('Starter Activity', [
                { label: '1. What is binary? Why use it?', value: getInputValue('starter-q1') },
                { label: '2. Seen hex A5/FF? Where?', value: getInputValue('starter-q2') },
                { label: '3. Denary shift left (123 to 1230) effect?', value: getInputValue('starter-q3') }
            ]);

            // Task 1: Hex Basics
            let task1Html = `<p><strong>a) Hex Base:</strong> ${getInputValue('hex-base-answer')}</p>`;
            task1Html += `<p><strong>b) Bits per Hex Digit:</strong> ${getInputValue('hex-bits-answer')}</p>`;
            task1Html += `<p><strong>c) Hex Digits:</strong> A=${getInputValue('hex-A')}, B=${getInputValue('hex-B')}, C=${getInputValue('hex-C')}, D=${getInputValue('hex-D')}, E=${getInputValue('hex-E')}, F=${getInputValue('hex-F')}</p>`;
            htmlContent += `<h3 style="color: #2980b9; margin-top: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">Task 1: Hexadecimal Basics</h3>${task1Html}`;

            // Task 2-5: Conversions (just show input and output if attempted)
            const conversionTasks = [
                { title: 'Task 2: Denary to Hex', inputId: 'den-to-hex-input', outputId: 'den-to-hex-output' },
                { title: 'Task 3: Hex to Denary', inputId: 'hex-to-den-input', outputId: 'hex-to-den-output' },
                { title: 'Task 4: Binary to Hex', inputId: 'bin-to-hex-input', outputId: 'bin-to-hex-output' },
                { title: 'Task 5: Hex to Binary', inputId: 'hex-to-bin-input', outputId: 'hex-to-bin-output' }
            ];
            conversionTasks.forEach(task => {
                const inputVal = getInputValue(task.inputId);
                const outputVal = getById(task.outputId) ? (getById(task.outputId).textContent.trim() || '[Not attempted]') : '[Not attempted]';
                if (inputVal !== '[Not answered]' && inputVal !== '[Element not found]') {
                    addSection(task.title, [
                        { label: 'Input', value: inputVal },
                        { label: 'Output', value: outputVal }
                    ]);
                }
            });
            
            // Hex Color Mixer (just record the last input by user)
            const userR = getInputValue('hex-color-r');
            const userG = getInputValue('hex-color-g');
            const userB = getInputValue('hex-color-b');
            addSection('Task: Hex Color Mixer/Matcher', [
                { label: 'Your Last Color Input (RGB)', value: `R: ${userR}, G: ${userG}, B: ${userB}  => #${userR}${userG}${userB}` },
                { label: 'Last Target Color (if game played)', value: colorMatchGameActive || colorMatcherQuestionNumber > 0 ? currentTargetHex : '[Game not played/finished]' },
                { label: 'Color Match Game Score', value: `${colorMatcherScore} / ${TOTAL_COLOR_MATCHER_QUESTIONS} (if game played)`}
            ]);

            // Task 6 & 7: Binary Shifts (input and output if attempted)
            const shiftTasks = [
                { title: 'Task 6: Binary Shift Left', inputId: 'shift-left-binary-input', placesId: 'shift-left-places', outputId: 'shift-left-result-binary', denOutId: 'shift-left-result-den', overflowId: 'shift-left-overflow' },
                { title: 'Task 7: Binary Shift Right', inputId: 'shift-right-binary-input', placesId: 'shift-right-places', outputId: 'shift-right-result-binary', denOutId: 'shift-right-result-den' }
            ];
            shiftTasks.forEach(task => {
                const inputVal = getInputValue(task.inputId);
                const placesVal = getInputValue(task.placesId);
                const outputVal = getById(task.outputId) ? (getById(task.outputId).textContent.trim() || '[Not attempted]') : '[Not attempted]';
                const denOutVal = getById(task.denOutId) ? (getById(task.denOutId).textContent.trim() || '') : '';
                let overflowText = '';
                if (task.overflowId && getById(task.overflowId)) {
                    overflowText = getById(task.overflowId).textContent.trim();
                }

                if (inputVal !== '[Not answered]' && inputVal !== '[Element not found]') {
                     addSection(task.title, [
                        { label: `Input Binary (${inputVal}), Shift by ${placesVal}`, value: `Result: ${outputVal} (Denary: ${denOutVal}) ${overflowText ? ' - ' + overflowText : ''}` }
                    ]);
                }
            });

            // Task 8: Shift Practice
            addSection('Task 8: Binary Shift Practice', [
                { label: '1. 00101100 << 2: Binary', value: getInputValue('shift-q1-bin') + ", Denary: " + getInputValue('shift-q1-den') },
                { label: '2. 11100000 >> 3: Binary', value: getInputValue('shift-q2-bin') + ", Denary: " + getInputValue('shift-q2-den') },
                { label: '3. 10000001 << 1: Binary', value: getInputValue('shift-q3-bin') + ", Issue: " + getInputValue('shift-q3-issue') }
            ]);

            // Shift Detective Answers
            addSection('Binary Shift Detective: Spot the Mistake!', [
                { label: 'Problem 1 Explanation (11001010 << 1, Overflow)', value: getInputValue('detective-q1-explanation') },
                { label: 'Problem 2 Explanation (00001101 >> 1, Integer Division)', value: getInputValue('detective-q2-explanation') }
            ]);

            // Exam Practice
            addSection('Exam Practice Questions', [
                { label: '1. Denary 173 to Hex', value: getInputValue('exam-q1-answer') },
                { label: '2. Hex B4 to 8-bit Binary', value: getInputValue('exam-q2-answer') },
                { label: '3. (i) 00110101 << 2 (Binary)', value: getInputValue('exam-q3i-answer') },
                { label: '3. (ii) Original & Shifted Denary for Q3', value: getInputValue('exam-q3ii-answer') },
                { label: '3. (iii) Arithmetic effect of shift for Q3', value: getInputValue('exam-q3iii-answer') },
                { label: '4. Denary 97 to 8-bit Binary', value: getInputValue('exam-q4-answer') },
                { label: '5. Binary 11001010 to Denary', value: getInputValue('exam-q5-answer') },
                { label: '6. (i) 01011000 >> 3 (Binary)', value: getInputValue('exam-q6i-answer') },
                { label: '6. (ii) Arithmetic effect of shift for Q6', value: getInputValue('exam-q6ii-answer') },
                { label: '7. Why use Hexadecimal?', value: getInputValue('exam-q7-answer') }
            ]);

            // Extension Activities
            const ext1 = document.querySelector('#extension-activities textarea:nth-of-type(1)');
            const ext2 = document.querySelector('#extension-activities textarea:nth-of-type(2)');
            addSection('Extension Activities', [
                { label: '1. Hexadecimal Arithmetic Research', value: ext1 ? (ext1.value.trim() || '[Not answered]') : '[Element not found]' },
                { label: '2. Logical vs. Arithmetic Shifts Research', value: ext2 ? (ext2.value.trim() || '[Not answered]') : '[Element not found]' }
            ]);

            summaryContainer.innerHTML = htmlContent;

            const opt = {
                margin: [0.7, 0.7, 0.7, 0.7],
                filename: 'gcse-cs-hex-binaryshifts-answers.pdf',
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 2, logging: false, useCORS: true, scrollY: 0 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            const exportBtn = getById('export-answers-btn');
            const resetBtn = getById('reset-all-btn');
            if(exportBtn) exportBtn.disabled = true;
            if(resetBtn) resetBtn.disabled = true;
            
            document.body.appendChild(summaryContainer);
            html2pdf().from(summaryContainer).set(opt).save().then(() => {
                if(exportBtn) exportBtn.disabled = false;
                if(resetBtn) resetBtn.disabled = false;
                document.body.removeChild(summaryContainer);
            }).catch(error => {
                console.error("Error during PDF generation:", error);
                if(exportBtn) exportBtn.disabled = false;
                if(resetBtn) resetBtn.disabled = false;
                document.body.removeChild(summaryContainer);
            });
        }

        // --- Tooltip Functionality ---
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

        // --- DOMContentLoaded ---
        document.addEventListener('DOMContentLoaded', () => {
            addTooltips();
            // Initialize any default states for simulations if needed
            updateUserColor(); // Initialize user color swatch
            // generateNewTargetColor(); // Don't start game automatically, wait for button click
            updateColorMatchGameStatus(); // Initialize game status display
            getById('shift-left-binary-input').dispatchEvent(new Event('input')); // To calc initial denary for shifts
            getById('shift-right-binary-input').dispatchEvent(new Event('input'));
        });

        // Add event listeners to shift inputs to update denary in real-time (optional)
        getById('shift-left-binary-input').addEventListener('input', () => {
            const den = binaryToDenary(getById('shift-left-binary-input').value);
            getById('shift-left-original-den').textContent = isNaN(den) ? 'Invalid' : den;
        });
         getById('shift-right-binary-input').addEventListener('input', () => {
            const den = binaryToDenary(getById('shift-right-binary-input').value);
            getById('shift-right-original-den').textContent = isNaN(den) ? 'Invalid' : den;
        });