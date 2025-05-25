// Basic Keyword Tooltip (assumes .keyword and .tooltip classes from styles.css)
        document.querySelectorAll('.keyword').forEach(keyword => {
            keyword.addEventListener('mouseenter', () => {
                const tooltip = keyword.querySelector('.tooltip');
                if (tooltip) tooltip.style.visibility = 'visible';
            });
            keyword.addEventListener('mouseleave', () => {
                const tooltip = keyword.querySelector('.tooltip');
                if (tooltip) tooltip.style.visibility = 'hidden';
            });
        });

        // --- Starter Activity ---
        const checkStarterBtn = document.getElementById('check-starter');
        const starterFeedback = document.getElementById('starter-feedback');
        checkStarterBtn.addEventListener('click', () => {
            const q2a = document.getElementById('starter-q2a').value.trim();
            const q2b = document.getElementById('starter-q2b').value.trim();
            const q2c = document.getElementById('starter-q2c').value.trim();
            let feedbackHtml = "<h4>Starter Feedback:</h4><ul>";
            feedbackHtml += "<li>Q1: Good effort thinking about character sets! It's about how computers map symbols to numbers.</li>";
            
            if (q2a === "2") feedbackHtml += "<li class='correct-feedback'>Q2a (1 bit): Correct! (2<sup>1</sup>=2)</li>";
            else feedbackHtml += `<li class='incorrect-feedback'>Q2a (1 bit): Not quite. 1 bit can be 0 or 1, so 2 possibilities. You put: ${q2a || 'nothing'}.</li>`;
            
            if (q2b === "4") feedbackHtml += "<li class='correct-feedback'>Q2b (2 bits): Correct! (2<sup>2</sup>=4)</li>";
            else feedbackHtml += `<li class='incorrect-feedback'>Q2b (2 bits): Not quite. 2 bits can be 00, 01, 10, 11, so 4 possibilities. You put: ${q2b || 'nothing'}.</li>`;

            if (q2c === "8") feedbackHtml += "<li class='correct-feedback'>Q2c (3 bits): Correct! (2<sup>3</sup>=8)</li>";
            else feedbackHtml += `<li class='incorrect-feedback'>Q2c (3 bits): Not quite. 3 bits allow 8 possibilities. You put: ${q2c || 'nothing'}.</li>`;
            
            feedbackHtml += "<li>Q3: If you mentioned something about the computer not knowing how to display the character, or using the wrong 'dictionary' (character set), you're on the right track! This is often due to character encoding mismatches.</li>";
            feedbackHtml += "</ul>";
            starterFeedback.innerHTML = feedbackHtml;
            starterFeedback.className = 'feedback-area show';
        });

        // --- Task 1: Reveal Formal Definition ---
        document.getElementById('reveal-formal-def-charset').addEventListener('click', function() {
            const feedbackDiv = document.getElementById('formal-def-charset-area');
            feedbackDiv.style.display = feedbackDiv.style.display === 'none' || feedbackDiv.style.display === '' ? 'block' : 'none';
            this.textContent = feedbackDiv.style.display === 'block' ? 'Hide Formal Definition' : 'Reveal Formal Definition';
        });

        // --- Task 2: Reveal ASCII Explanations ---
        document.getElementById('reveal-ascii-cab').addEventListener('click', function() {
            const feedbackDiv = document.getElementById('ascii-cab-explanation');
            feedbackDiv.style.display = feedbackDiv.style.display === 'none' || feedbackDiv.style.display === '' ? 'block' : 'none';
            this.textContent = feedbackDiv.style.display === 'block' ? 'Hide Explanation' : 'Reveal Explanation';
        });
        document.getElementById('reveal-ascii-limitations').addEventListener('click', function() {
            const feedbackDiv = document.getElementById('ascii-limitations-explanation');
            feedbackDiv.style.display = feedbackDiv.style.display === 'none' || feedbackDiv.style.display === '' ? 'block' : 'none';
            this.textContent = feedbackDiv.style.display === 'block' ? 'Hide Limitations' : 'Reveal Limitations';
        });

        // --- Task 3: Reveal Unicode Encoding Explanation ---
        document.getElementById('reveal-unicode-encodings').addEventListener('click', function() {
            const feedbackDiv = document.getElementById('unicode-encodings-explanation');
            feedbackDiv.style.display = feedbackDiv.style.display === 'none' || feedbackDiv.style.display === '' ? 'block' : 'none';
            this.textContent = feedbackDiv.style.display === 'block' ? 'Hide Explanation' : 'Reveal Explanation';
        });

        // Generic toggle for reveal buttons
        function toggleRevealButton(buttonElement, contentElement, showText, hideText) {
            contentElement.style.display = contentElement.style.display === 'none' || contentElement.style.display === '' ? 'block' : 'none';
            buttonElement.textContent = contentElement.style.display === 'block' ? hideText : showText;
        }

        // --- Task 2: ASCII Lookup & Conversion ---
        const charInput = document.getElementById('char-input');
        const lookupAsciiBtn = document.getElementById('lookup-ascii');
        const asciiResultDiv = document.getElementById('ascii-result');
        const textToBinaryInput = document.getElementById('text-to-binary-input');
        const convertToBinaryBtn = document.getElementById('convert-to-binary');
        const textToBinaryResultDiv = document.getElementById('text-to-binary-result');

        lookupAsciiBtn.addEventListener('click', () => {
            const char = charInput.value;
            if (char.length === 1) {
                const asciiValue = char.charCodeAt(0);
                if ((asciiValue >= 48 && asciiValue <= 57) || (asciiValue >= 65 && asciiValue <= 90) || (asciiValue >= 97 && asciiValue <= 122)) { // 0-9, A-Z, a-z
                    const binaryValue = asciiValue.toString(2).padStart(8, '0');
                    asciiResultDiv.innerHTML = `Character: '${char}'<br>ASCII Decimal: ${asciiValue}<br>ASCII Binary (8-bit): <code class="font-mono bg-gray-200 p-1 rounded">${binaryValue}</code>`;
                } else {
                    asciiResultDiv.innerHTML = `<span class="text-red-500">Please enter an alphanumeric character (A-Z, a-z, 0-9).</span>`;
                }
            } else {
                asciiResultDiv.innerHTML = `<span class="text-red-500">Please enter a single character.</span>`;
            }
        });

        convertToBinaryBtn.addEventListener('click', () => {
            const text = textToBinaryInput.value;
            if (text) {
                let binaryString = "";
                let textPreview = "";
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    const asciiValue = char.charCodeAt(0);
                     if ((asciiValue >= 32 && asciiValue <= 126)) { // Printable ASCII
                        binaryString += asciiValue.toString(2).padStart(8, '0') + " ";
                        textPreview += char;
                    } else {
                        textToBinaryResultDiv.innerHTML = `<span class="text-red-500">Input contains non-standard ASCII characters for this simple converter. Try A-Z, a-z, 0-9, common punctuation.</span>`;
                        return;
                    }
                }
                textToBinaryResultDiv.innerHTML = `Text: '${textPreview}'<br>ASCII Binary (8-bit per char):<br><code class="font-mono bg-gray-200 p-1 rounded">${binaryString.trim()}</code>`;
            } else {
                textToBinaryResultDiv.innerHTML = `<span class="text-red-500">Please enter some text.</span>`;
            }
        });

        // --- Task 4: ASCII vs Unicode Quiz ---
        const quizAnswers = { q1: "ASCII", q2: "Unicode", q3: "65536", q4: "Yes" };
        let quizScore = 0;
        const totalQuizQuestions = Object.keys(quizAnswers).length;

        document.querySelectorAll('#task4 .option-button').forEach(button => {
            button.addEventListener('click', () => {
                const question = button.dataset.question;
                // Allow re-clicking options before submission
                document.querySelectorAll(`#q${question}-options .option-button`).forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
            });
        });

        document.getElementById('check-quiz-charsets').addEventListener('click', () => {
            quizScore = 0;
            for (let i = 1; i <= totalQuizQuestions; i++) {
                const selectedOption = document.querySelector(`#q${i}-options .option-button.selected`);
                const feedbackDiv = document.getElementById(`q${i}-feedback`);
                if (selectedOption) {
                    const userAnswer = selectedOption.dataset.answer;
                    if (userAnswer === quizAnswers[`q${i}`]) {
                        feedbackDiv.innerHTML = `<span class="correct-feedback"><i class="fas fa-check-circle"></i> Correct!</span>`;
                        feedbackDiv.className = 'quiz-feedback show correct';
                        quizScore++;
                    } else {
                        feedbackDiv.innerHTML = `<span class="incorrect-feedback"><i class="fas fa-times-circle"></i> Incorrect. The correct answer is ${quizAnswers[`q${i}`]}.</span>`;
                        feedbackDiv.className = 'quiz-feedback show incorrect';
                    }
                    // Disable options for this question after checking
                    document.querySelectorAll(`#q${i}-options .option-button`).forEach(btn => btn.disabled = true);
                } else {
                    feedbackDiv.innerHTML = `<span class="incorrect-feedback">No answer selected for Q${i}.</span>`;
                    feedbackDiv.className = 'quiz-feedback show incorrect';
                }
            }
            const overallFeedback = document.getElementById('quiz-overall-feedback');
            overallFeedback.innerHTML = `You scored ${quizScore} out of ${totalQuizQuestions}.`;
            overallFeedback.className = quizScore === totalQuizQuestions ? 'feedback-area show correct-feedback' : 'feedback-area show incorrect-feedback';
            document.getElementById('check-quiz-charsets').disabled = true;
        });

        // --- Task 5: Binary to ASCII Character ---
        const binaryToCharInput = document.getElementById('binary-to-char-input');
        const convertBinaryToCharBtn = document.getElementById('convert-binary-to-char');
        const binaryToCharResultDiv = document.getElementById('binary-to-char-result');

        convertBinaryToCharBtn.addEventListener('click', () => {
            const binaryStr = binaryToCharInput.value.trim();
            if (binaryStr.length === 8 && /^[01]+$/.test(binaryStr)) {
                const decimalValue = parseInt(binaryStr, 2);
                const charValue = String.fromCharCode(decimalValue);
                if (decimalValue >= 32 && decimalValue <= 126) { // Printable ASCII
                    binaryToCharResultDiv.innerHTML = `Binary: <code class="font-mono bg-gray-200 p-1 rounded">${binaryStr}</code><br>Decimal: ${decimalValue}<br>Character: <span class="font-bold text-blue-600 text-3xl">'${charValue}'</span>`;
                } else if (decimalValue < 32 || decimalValue === 127) {
                     binaryToCharResultDiv.innerHTML = `Binary: <code class="font-mono bg-gray-200 p-1 rounded">${binaryStr}</code><br>Decimal: ${decimalValue}<br>Character: <span class="text-orange-600">(Non-printable control character)</span>`;
                }
                 else {
                     binaryToCharResultDiv.innerHTML = `Binary: <code class="font-mono bg-gray-200 p-1 rounded">${binaryStr}</code><br>Decimal: ${decimalValue}<br>Character: <span class="text-orange-600">(Extended ASCII / Potentially non-standard character: '${charValue}')</span>`;
                }
            } else {
                binaryToCharResultDiv.innerHTML = `<span class="text-red-500">Please enter a valid 8-bit binary number (e.g., 01000001).</span>`;
            }
        });

        // --- Task 6: Which Character Set is Needed? ---
        const snippetAnswers = { snippet1: "ASCII", snippet2: "Unicode", snippet3: "Unicode" };
        let snippetScore = 0;
        const totalSnippetQuestions = Object.keys(snippetAnswers).length;

        document.querySelectorAll('#task6 .option-button').forEach(button => {
            button.addEventListener('click', () => {
                const snippet = button.dataset.snippet;
                document.querySelectorAll(`#snippet${snippet}-options .option-button`).forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
            });
        });

        document.getElementById('check-snippets').addEventListener('click', () => {
            snippetScore = 0;
            for (let i = 1; i <= totalSnippetQuestions; i++) {
                const selectedOption = document.querySelector(`#snippet${i}-options .option-button.selected`);
                const feedbackDiv = document.getElementById(`snippet${i}-feedback`);
                if (selectedOption) {
                    const userAnswer = selectedOption.dataset.answer;
                    if (userAnswer === snippetAnswers[`snippet${i}`]) {
                        feedbackDiv.innerHTML = `<span class="correct-feedback"><i class="fas fa-check-circle"></i> Correct! ${snippetAnswers[`snippet${i}`]} is the best choice.</span>`;
                        feedbackDiv.className = 'quiz-feedback show correct';
                        snippetScore++;
                    } else {
                        feedbackDiv.innerHTML = `<span class="incorrect-feedback"><i class="fas fa-times-circle"></i> Not quite. ${snippetAnswers[`snippet${i}`]} would be needed here.</span>`;
                        feedbackDiv.className = 'quiz-feedback show incorrect';
                    }
                    document.querySelectorAll(`#snippet${i}-options .option-button`).forEach(btn => btn.disabled = true);
                } else {
                    feedbackDiv.innerHTML = `<span class="incorrect-feedback">No answer selected for Snippet ${i}.</span>`;
                    feedbackDiv.className = 'quiz-feedback show incorrect';
                }
            }
            const overallFeedback = document.getElementById('snippets-overall-feedback');
            overallFeedback.innerHTML = `You correctly identified ${snippetScore} out of ${totalSnippetQuestions} snippets.`;
            overallFeedback.className = snippetScore === totalSnippetQuestions ? 'feedback-area show correct-feedback' : 'feedback-area show incorrect-feedback';
            document.getElementById('check-snippets').disabled = true;
        });

        // --- Task 7: Storage Size Discussion ---
        document.getElementById('reveal-storage-discussion').addEventListener('click', function() {
            const feedbackDiv = document.getElementById('storage-discussion-feedback');
            feedbackDiv.style.display = feedbackDiv.style.display === 'none' || feedbackDiv.style.display === '' ? 'block' : 'none';
            this.textContent = feedbackDiv.style.display === 'block' ? 'Hide Discussion Points' : 'Reveal Discussion Points';
        });

        // --- Task 8: Interactive Character Code Explorer ---
        const charToCodeInput = document.getElementById('char-to-code-input');
        const charToCodeResultDiv = document.getElementById('char-to-code-result');
        const codeToCharInput = document.getElementById('code-to-char-input');
        const codeToCharResultDiv = document.getElementById('code-to-char-result');
        const stringToCodesInput = document.getElementById('string-to-codes-input');
        const stringToCodesResultDiv = document.getElementById('string-to-codes-result');

        charToCodeInput.addEventListener('input', () => {
            const char = charToCodeInput.value;
            if (char.length === 1) {
                const codePoint = char.charCodeAt(0); // or char.codePointAt(0) for full Unicode
                charToCodeResultDiv.innerHTML = `Decimal: ${codePoint}<br>Hex: U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
            } else if (char.length === 0) {
                charToCodeResultDiv.innerHTML = '';
            } else {
                charToCodeResultDiv.textContent = 'Please enter only one character.';
            }
        });

        codeToCharInput.addEventListener('input', () => {
            const codePointStr = codeToCharInput.value.trim();
            if (codePointStr === '') {
                codeToCharResultDiv.innerHTML = ''; return;
            }
            const codePoint = parseInt(codePointStr, 10);
            if (!isNaN(codePoint) && codePoint >= 0) {
                const controlCharName = controlCharMap[codePoint]; // Assuming controlCharMap is defined
                if ((codePoint >= 0 && codePoint <= 31) || codePoint === 127) {
                    codeToCharResultDiv.innerHTML = `<span class="text-orange-600 text-sm">(ASCII Control: ${controlCharName || 'Unknown'})</span>`;
                } else if (codePoint >= 128 && codePoint <= 159) {
                    codeToCharResultDiv.innerHTML = `<span class="text-orange-600 text-sm">(C1 Control: ${controlCharName || 'Reserved/Private Use'})</span>`;
                } else {
                    try { codeToCharResultDiv.innerHTML = `<span class="font-bold text-5xl">${String.fromCodePoint(codePoint)}</span>`; }
                    catch (e) { codeToCharResultDiv.innerHTML = `<span class="text-red-500 text-sm">(Invalid Unicode)</span>`; }
                }
            } else { codeToCharResultDiv.textContent = 'Valid decimal needed.'; }
        });

        stringToCodesInput.addEventListener('input', () => {
            const str = stringToCodesInput.value;
            let resultHTML = "";
            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                const codePoint = char.codePointAt(0); // Use codePointAt for full Unicode
                resultHTML += `'${char}' &rarr; ${codePoint} (U+${codePoint.toString(16).toUpperCase().padStart(4, '0')})<br>`;
            }
            stringToCodesResultDiv.innerHTML = resultHTML || 'Type a string to see character codes.';
        });

        // --- Extension Activity: Unicode Explorer ---
        const extCharInput = document.getElementById('ext-char-input');
        // const extGetCodepointBtn = document.getElementById('ext-get-codepoint'); // Button removed
        const extCodepointResultDiv = document.getElementById('ext-codepoint-result');
        const extCodepointInput = document.getElementById('ext-codepoint-input');
        // const extGetCharBtn = document.getElementById('ext-get-char'); // Button removed
        const extCharResultDiv = document.getElementById('ext-char-result');

        const controlCharMap = {
            0: "NUL (Null)", 1: "SOH (Start of Heading)", 2: "STX (Start of Text)", 3: "ETX (End of Text)",
            4: "EOT (End of Transmission)", 5: "ENQ (Enquiry)", 6: "ACK (Acknowledge)", 7: "BEL (Bell)",
            8: "BS (Backspace)", 9: "HT (Horizontal Tab)", 10: "LF (Line Feed / New Line)", 11: "VT (Vertical Tab)",
            12: "FF (Form Feed / New Page)", 13: "CR (Carriage Return)", 14: "SO (Shift Out)", 15: "SI (Shift In)",
            16: "DLE (Data Link Escape)", 17: "DC1 (Device Control 1)", 18: "DC2 (Device Control 2)", 19: "DC3 (Device Control 3)",
            20: "DC4 (Device Control 4)", 21: "NAK (Negative Acknowledge)", 22: "SYN (Synchronous Idle)", 23: "ETB (End of Transmission Block)",
            24: "CAN (Cancel)", 25: "EM (End of Medium)", 26: "SUB (Substitute)", 27: "ESC (Escape)",
            28: "FS (File Separator)", 29: "GS (Group Separator)", 30: "RS (Record Separator)", 31: "US (Unit Separator)",
            127: "DEL (Delete)",
            // C1 Control Codes (less commonly encountered directly by users, often for specific protocols)
            128: "PAD (Padding Character)", 129: "HOP (High Octet Preset)", 130: "BPH (Break Permitted Here)", 131: "NBH (No Break Here)",
            132: "IND (Index)", 133: "NEL (Next Line)", 134: "SSA (Start of Selected Area)", 135: "ESA (End of Selected Area)",
            136: "HTS (Horizontal Tabulation Set)", 137: "HTJ (Horizontal Tabulation with Justification)", 138: "VTS (Vertical Tabulation Set)",
            139: "PLD (Partial Line Down)", 140: "PLU (Partial Line Up)", 141: "RI (Reverse Index)", 142: "SS2 (Single Shift Two)",
            143: "SS3 (Single Shift Three)", 144: "DCS (Device Control String)", 145: "PU1 (Private Use One)", 146: "PU2 (Private Use Two)",
            147: "STS (Set Transmit State)", 148: "CCH (Cancel Character)", 149: "MW (Message Waiting)", 150: "SPA (Start of Guarded Area)",
            151: "EPA (End of Guarded Area)", 152: "SOS (Start of String)", 153: "SGC (Single Graphic Character Introducer)", // Changed from SCI to SGC as SCI is not standard
            154: "SCI (Single Character Introducer)", // Note: SCI is often used, but SGC is more formal for this position.
            155: "CSI (Control Sequence Introducer)", 156: "ST (String Terminator)", 157: "OSC (Operating System Command)",
            158: "PM (Privacy Message)", 159: "APC (Application Program Command)"
        };

        extCharInput.addEventListener('input', () => { // Changed from button click to input event
            const char = extCharInput.value;
            if (char.length === 1) {
                const codePoint = char.charCodeAt(0);
                extCodepointResultDiv.innerHTML = `Decimal: ${codePoint}<br>Hex: U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
            } else if (char.length === 0) {
                extCodepointResultDiv.innerHTML = ''; // Clear if input is empty
            } else {
                extCodepointResultDiv.textContent = 'Enter one character.';
            } // This was the original extCharInput listener
        });

        extCodepointInput.addEventListener('input', () => { // Changed from button click to input event
            const codePointStr = extCodepointInput.value.trim();
            if (codePointStr === '') {
                extCharResultDiv.innerHTML = ''; // Clear if input is empty
                return;
            }

            const codePoint = parseInt(codePointStr, 10);

            if (!isNaN(codePoint) && codePoint >= 0) {
                const controlCharName = controlCharMap[codePoint];

                if ((codePoint >= 0 && codePoint <= 31) || codePoint === 127) {
                    extCharResultDiv.innerHTML = `Character: <span class="text-orange-600 text-lg">(ASCII Control: ${controlCharName || 'Unknown'})</span>`;
                } else if (codePoint >= 128 && codePoint <= 159) {
                    extCharResultDiv.innerHTML = `Character: <span class="text-orange-600 text-lg">(C1 Control: ${controlCharName || 'Reserved'})</span>`;
                } else {
                    try {
                        extCharResultDiv.innerHTML = `Character: <span class="font-bold text-5xl">${String.fromCodePoint(codePoint)}</span>`;
                    } catch (e) { // Handles invalid code points if String.fromCodePoint throws an error
                        extCharResultDiv.innerHTML = `<span class="text-red-500 text-lg">(Invalid Unicode code point)</span>`;
                    } // This was the original extCodepointInput listener
                }
            } else {
                extCharResultDiv.textContent = 'Enter valid decimal.';
            }
        });

        // --- Exam Questions: Show Mark Scheme ---
        document.querySelectorAll('.mark-scheme-button').forEach(button => {
            button.addEventListener('click', () => {
                const questionId = button.dataset.question;
                const markSchemeDiv = document.getElementById(`mark-scheme-${questionId}`);
                markSchemeDiv.style.display = markSchemeDiv.style.display === 'none' || markSchemeDiv.style.display === '' ? 'block' : 'none';
            });
        });

        // --- Final Score, Reset, PDF ---
        const finalScoreArea = document.getElementById('final-score-area');
        const finalScoreDisplay = document.getElementById('final-score-display');
        const finalScoreFeedback = document.getElementById('final-score-feedback');

        document.getElementById('calculate-final-score').addEventListener('click', () => {
            let totalMarksAvailable = 0;
            let studentScore = 0;

            // Include scores from different tasks
            studentScore += quizScore; // from Task 4
            totalMarksAvailable += totalQuizQuestions; // from Task 4
            studentScore += snippetScore; // from Task 6
            totalMarksAvailable += totalSnippetQuestions;

            // Add exam question marks (assuming self-assessment or a simple check)
            // This is a placeholder; true auto-marking of text is complex.
            // We'll assume if they opened the mark scheme, they attempted it.
            document.querySelectorAll('.exam-question-item').forEach(item => {
                const msButton = item.querySelector('.mark-scheme-button');
                const marks = parseInt(msButton.dataset.marks);
                totalMarksAvailable += marks;
                // Simple: if mark scheme is visible, assume they tried and got some marks (e.g., half)
                // This is very basic and for demo purposes.
                const markSchemeDiv = document.getElementById(`mark-scheme-${msButton.dataset.question}`);
                if (markSchemeDiv.style.display === 'block') {
                     // For demo, let's give them half marks if they viewed the scheme
                    // studentScore += Math.ceil(marks / 2); 
                    // Or, for now, let's not auto-add exam Qs to score to keep it simpler
                }
            });

            finalScoreDisplay.textContent = `Your interactive task score: ${studentScore} / ${totalMarksAvailable}`;
            let percentage = totalMarksAvailable > 0 ? (studentScore / totalMarksAvailable) * 100 : 0;
            if (percentage >= 80) {
                finalScoreFeedback.textContent = "Excellent work! You have a strong understanding.";
                finalScoreFeedback.className = "text-green-600";
            } else if (percentage >= 60) {
                finalScoreFeedback.textContent = "Good job! Review any areas you found tricky.";
                finalScoreFeedback.className = "text-yellow-600";
            } else {
                finalScoreFeedback.textContent = "Keep practicing! Revisit the tasks and explanations.";
                finalScoreFeedback.className = "text-red-600";
            }
            finalScoreArea.style.display = 'block';
            finalScoreArea.scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('reset-all-tasks').addEventListener('click', () => {
            if (!confirm("Are you sure you want to reset all tasks and scores?")) return;

            // Reset starter
            document.getElementById('starter-q1').value = '';
            document.getElementById('starter-q2a').value = '';
            document.getElementById('starter-q2b').value = '';
            document.getElementById('starter-q2c').value = '';
            starterFeedback.className = 'feedback-area';
            starterFeedback.innerHTML = '';

            // Reset ASCII lookup
            charInput.value = '';
            asciiResultDiv.innerHTML = '';
            textToBinaryInput.value = '';
            textToBinaryResultDiv.innerHTML = '';
            // Reset Task 5 (Binary to Char)
            binaryToCharInput.value = '';
            binaryToCharResultDiv.innerHTML = '';

            // Reset Task 4 Quiz
            quizScore = 0;
            document.querySelectorAll('#task4 .option-button').forEach(button => {
                button.classList.remove('selected');
                button.disabled = false;
            });
            document.querySelectorAll('#task4 .quiz-feedback').forEach(fb => {
                fb.innerHTML = '';
                fb.className = 'quiz-feedback';
            });
            document.getElementById('quiz-overall-feedback').innerHTML = '';
            document.getElementById('quiz-overall-feedback').className = 'feedback-area';
            document.getElementById('check-quiz-charsets').disabled = false;

            // Reset Task 6 Snippets
            snippetScore = 0;
             document.querySelectorAll('#task6 .option-button').forEach(button => {
                button.classList.remove('selected');
                button.disabled = false;
            });
            document.querySelectorAll('#task6 .quiz-feedback').forEach(fb => {
                fb.innerHTML = '';
                fb.className = 'quiz-feedback';
            });
            document.getElementById('snippets-overall-feedback').innerHTML = '';
            document.getElementById('snippets-overall-feedback').className = 'feedback-area';
            document.getElementById('check-snippets').disabled = false;
            // Reset Task 7 Storage Discussion
            document.getElementById('storage-discussion-feedback').style.display = 'none';
            document.getElementById('reveal-storage-discussion').textContent = 'Reveal Discussion Points';
            // Reset Task 1, 2, 3 reveal states
            document.getElementById('formal-def-charset-area').style.display = 'none';
            document.getElementById('reveal-formal-def-charset').textContent = 'Reveal Formal Definition';
            document.getElementById('ascii-cab-explanation').style.display = 'none';
            document.getElementById('reveal-ascii-cab').textContent = 'Reveal Explanation';
            document.getElementById('ascii-limitations-explanation').style.display = 'none';
            document.getElementById('reveal-ascii-limitations').textContent = 'Reveal Limitations';
            document.getElementById('unicode-encodings-explanation').style.display = 'none';
            document.getElementById('reveal-unicode-encodings').textContent = 'Reveal Explanation';
            // Reset Task 8 (Interactive Char Code Explorer)
            if(charToCodeInput) charToCodeInput.value = '';
            if(charToCodeResultDiv) charToCodeResultDiv.innerHTML = '';
            if(codeToCharInput) codeToCharInput.value = '';
            if(codeToCharResultDiv) codeToCharResultDiv.innerHTML = '';
            if(stringToCodesInput) stringToCodesInput.value = '';
            if(stringToCodesResultDiv) stringToCodesResultDiv.innerHTML = '';
            // Reset Extension Activity
            if(extCharInput) extCharInput.value = '';
            if(extCodepointResultDiv) extCodepointResultDiv.innerHTML = '';
            if(extCodepointInput) extCodepointInput.value = '';
            if(extCharResultDiv) extCharResultDiv.innerHTML = '';

            // Reset "Read" checkboxes
            document.querySelectorAll('.read-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });

            // Reset exam questions
            document.querySelectorAll('.exam-question-item textarea, .exam-question-item input[type="text"]').forEach(input => input.value = '');
            document.querySelectorAll('.mark-scheme').forEach(ms => ms.style.display = 'none');

            // Hide final score
            finalScoreArea.style.display = 'none';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.getElementById('export-pdf').addEventListener('click', () => {
            alert("Preparing PDF. This might take a moment. Please ensure pop-ups are allowed for this site if the download doesn't start automatically. Any interactive elements like input fields might not be fully captured in their current state by this basic PDF export.");
            const element = document.body; // Or a specific main content wrapper
            const opt = {
                margin:       [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right (inches)
                filename:     'gcse-charsets-worksheet.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, logging: true, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: document.documentElement.offsetWidth, windowHeight: document.documentElement.offsetHeight },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            // Temporarily make all mark schemes visible for PDF export if they were opened
            const markSchemes = document.querySelectorAll('.mark-scheme');
            const initiallyVisibleMarkSchemes = [];
            markSchemes.forEach(ms => {
                if (ms.style.display === 'block') {
                    initiallyVisibleMarkSchemes.push(ms);
                } else {
                     // To ensure content is captured, briefly show then hide if not meant to be seen
                    // This is tricky; for best PDF, it's better if content is already laid out.
                    // For now, only export what's visibly 'block'.
                }
            });
            // Show final score if calculated
            const finalScoreVisible = finalScoreArea.style.display === 'block';

            html2pdf().from(element).set(opt).save().then(() => {
                // Restore visibility if needed, though for this basic export, it might not matter
                // if we are just printing the current view.
            }).catch(err => console.error("PDF Export Error:", err));
        });