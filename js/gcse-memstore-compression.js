// Flashcard Data for Tooltips
        const flashcardData = {
            "compression": "A method or protocol for using fewer bits to represent the original information.",
            "lossy compression": "Reduction of file size by removing certain, redundant information from the file. The eliminated data is unrecoverable. Tries to recreate a file without the omitted data. Much smaller file sizes but there will be some loss of quality.",
            "lossless compression": "Every bit of the original data can be recovered from the compressed file. The uncompressed image will be the same as the original with no loss of data. Works by looking for patterns in the data. Larger compressed file sizes than lossy. e.g. Run-length encoding.",
            "lossy benefits": "Means the decompressed file is not identical to the original... ...the difference is unlikely to be noticed by humans. Lossy will decrease the file size ... so it can be sent via e-mail/sent quickly/uses less bandwidth.",
            "lossy image compression": "A compression algorithm is used. Permanently deleting some data // file cannot be restored to original. Colour depth / colour palette can be reduced. Resolution can be reduced // number of pixels can be reduced.",
            "lossy text compression": "File is compressed some detail / data / quality / is lost... ... would make the text file unreadable / lose meaning or comprehension.", // Note: Generally lossy is NOT used for text for this reason.
            "lossless image compression": "A compression algorithm is used. No data is removed in the compression process. An index/dictionary of pixels is created. The number of times a pixel is repeated in a row is stored. Run length encoding.",
            "reasons to compress data": "Download/buffering times decrease. Smaller files = fewer packets = faster transmission time. Reduces traffic over the Internet. Less chance of collisions or transmission errors. Data allowances do not run out as quickly = Saves money. Voice can be transmitted fast enough to keep up with speech in a video. Saves spending more money on data storage e.g. hard drives, cloud etc. Faster to back-up data.",
            "run length encoding (rle)": "Lossless compression technique that summarises consecutive patterns of the same data. Works well with image and sound data where data could be repeated many times.",
            "rle of sound": "Sound recordings can have many thousands of samples taken every second. The same sound or note played for a fraction of a second could result in hundreds of identical samples. RLE records one example of the sample and how many times it consecutively repeats.",
            "jpeg": "A commonly used file format that uses lossy compression for digital photography.",
            "mp3": "Lossy compressed audio file format.",
            "perceptual music shaping": "Refers to the process of removing inaudible sounds in order to make a file size smaller. e.g. Noises at frequencies that humans cannot hear. Quiet sounds that cannot be heard over louder sounds."
            // Add other relevant terms if needed
        };

        // --- Generic Reveal Toggle ---
        function toggleReveal(contentId, buttonElement, revealText, hideText) {
            const content = document.getElementById(contentId);
            if (!content) return;
            content.classList.toggle('show');
            if (buttonElement) { buttonElement.textContent = content.classList.contains('show') ? hideText : revealText; }
        }

        // --- Starter Task Reveal ---
        function toggleStarterAnswers(contentId, buttonElement, revealText, hideText) {
            const content = document.getElementById(contentId);
            const encourageMsg = document.getElementById('starter-encourage-msg');
            if (!content) return;

            if (!content.classList.contains('show')) {
                const inputs = document.querySelectorAll('#starter-recap input[type="text"]');
                let filledCount = 0;
                inputs.forEach(input => { if (input.value.trim() !== '') filledCount++; });

                if (filledCount < 1 && encourageMsg) { // Encourage if less than 1 filled
                    encourageMsg.textContent = "Try answering at least one question first!";
                    setTimeout(() => { if(encourageMsg) encourageMsg.textContent = ''; }, 3000);
                    return;
                }
            }
            toggleReveal(contentId, buttonElement, revealText, hideText);
        }

        // --- Tooltip Functionality ---
        function addTooltips() {
              document.querySelectorAll('.keyword').forEach(span => {
                  const keywordText = span.textContent.trim().toLowerCase().replace(/[().]/g, ''); // Clean text for lookup
                  // Check if a tooltip span already exists
                  if (!span.querySelector('.tooltip')) {
                      const tooltipDefinition = flashcardData[keywordText];
                      if (tooltipDefinition) {
                          const tooltip = document.createElement('span');
                          tooltip.className = 'tooltip';
                          tooltip.textContent = tooltipDefinition;
                          span.appendChild(tooltip);
                      } else {
                          // Optional: Log if a keyword doesn't have a definition
                          // console.warn(`No tooltip definition found for keyword: ${keywordText}`);
                      }
                  }
              });
           }

        // --- Initial setup ---
        document.addEventListener('DOMContentLoaded', () => {
            addTooltips();
            // Add event listeners or initial setup for any interactive tasks added later
        });

        // --- Task 2: Lossy/Lossless Table Check ---
        function checkLossyLosslessTable() {
            const feedbackElement = document.getElementById('lossy-lossless-feedback');
            const tableRows = document.querySelectorAll('#task2-lossy-lossless tbody tr');
            let correctCount = 0;
            let feedbackHtml = "<ul>";

            tableRows.forEach((row, index) => {
                const selectElement = row.querySelector('select');
                const inputElement = row.querySelector('input[type="text"]');
                const selectedType = selectElement.value;
                const reasonText = inputElement.value.trim().toLowerCase();
                const correctType = row.dataset.correctType;
                const keywords = row.dataset.correctKeywords.split(',');

                // Reset previous feedback styles
                selectElement.classList.remove('correct', 'incorrect');
                inputElement.classList.remove('correct', 'incorrect');

                let typeCorrect = selectedType === correctType;
                // Check if at least one keyword is present in the reason
                let reasonCorrect = keywords.some(kw => reasonText.includes(kw.trim()));

                if (typeCorrect && reasonCorrect) {
                    correctCount++;
                    selectElement.classList.add('correct');
                    inputElement.classList.add('correct');
                    feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-2"></i>Row ${index + 1}: Correct type and reason.</li>`;
                } else {
                    feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-2"></i>Row ${index + 1}: `;
                    if (!typeCorrect) {
                        selectElement.classList.add('incorrect');
                        feedbackHtml += `Incorrect type selected (should be ${correctType}). `;
                    } else {
                        selectElement.classList.add('correct'); // Type was right
                    }
                    if (!reasonCorrect) {
                        inputElement.classList.add('incorrect');
                        feedbackHtml += `Reason needs improvement (Hint: mention ${keywords[0]}).`;
                    } else {
                         inputElement.classList.add('correct'); // Reason was okay even if type was wrong
                    }
                    feedbackHtml += `</li>`;
                }
            });

            feedbackHtml += "</ul>";
            if (correctCount === tableRows.length) {
                feedbackHtml = `<p class="correct-feedback font-semibold"><i class="fas fa-check mr-2"></i>All rows answered correctly!</p>` + feedbackHtml;
            } else {
                 feedbackHtml = `<p class="incorrect-feedback font-semibold"><i class="fas fa-times mr-2"></i>Some answers need correction. Check feedback below.</p>` + feedbackHtml;
            }

            feedbackElement.innerHTML = feedbackHtml;
            feedbackElement.classList.add('show'); // Make feedback visible
        }

        function resetLossyLosslessTable() {
            const feedbackElement = document.getElementById('lossy-lossless-feedback');
            const tableRows = document.querySelectorAll('#task2-lossy-lossless tbody tr');
            tableRows.forEach(row => {
                row.querySelector('select').value = "";
                row.querySelector('input[type="text"]').value = "";
                row.querySelector('select').classList.remove('correct', 'incorrect');
                row.querySelector('input[type="text"]').classList.remove('correct', 'incorrect');
            });
            if (feedbackElement) {
                 feedbackElement.classList.remove('show'); // Hide feedback
                 feedbackElement.innerHTML = ''; // Clear content
            }
        }

        // --- Task 3: Line 1 Simulation ---
        let simulationTimeout = null; // To store the timeout ID

        function simulateLine1Decoding() {
            // Clear any existing simulation timeout
            if (simulationTimeout) {
                clearTimeout(simulationTimeout);
                simulationTimeout = null;
            }

            const outputDiv = document.getElementById('line1-simulation-output');
            const line1Codes = "1 2 3 2 3 4 5 0"; // Encoded sequence for line 1
            const codesArray = line1Codes.split(' ');
            // Dictionary mapping codes to their corresponding text parts
            const dictionary = {
                '1': 'H', '2': 'ickory,_', '3': 'd', '4': 'ock', '5': ',', '0': '' // Represent end-of-line as empty string
                 ,'6': 'The_', '7': 'mouse_', '8': 'ran_', '9': 'up_', '10': 'the_',
                 '11': 'cl', '12': '.', '13': '_struck_', '14': 'one,', '15': 'down.'
            };

            // Initial setup
            outputDiv.innerHTML = `<p class="font-mono text-lg text-blue-700 min-h-[1.5em]"></p>`; // Paragraph for decoded text
            const decodedTextParagraph = outputDiv.querySelector('p:last-child');
            let currentDecodedText = ""; // String to accumulate the decoded text
            let currentCodeIndex = 0;
            const delay = 350; // Delay in milliseconds (adjust as needed)

            function addNextWord() {
                if (currentCodeIndex < codesArray.length) {
                    const code = codesArray[currentCodeIndex];
                    let word = (dictionary[code] !== undefined ? dictionary[code] : '').replace(/_/g, ' '); // Replace underscore with space
                    currentDecodedText += word;
                    decodedTextParagraph.textContent = currentDecodedText;
                    currentCodeIndex++;
                    simulationTimeout = setTimeout(addNextWord, delay);
                } else {
                     decodedTextParagraph.classList.add('border-l-4', 'border-green-500', 'pl-2');
                }
            }
            addNextWord(); // Start the simulation
        }

        // --- Task 3: Text Compression Check ---
        const fullCorrectEncoding = "1 2 3 2 3 4 5 0 6 7 8 9 10 11 4 12 0 10 11 4 13 14 0 6 7 8 15 0 1 2 3 2 3 4 12";
        const correctCompressedSize = fullCorrectEncoding.split(' ').length;
        const correctLine2Encoding = "6 7 8 9 10 11 4 12 0";

        function checkTextEncodingLine2() {
            const userInputLine2 = document.getElementById('encoded-text-line2').value.trim().replace(/ +/g, ' ');
            const feedbackDiv = document.getElementById('encoding-feedback-line2');
            const inputElement = document.getElementById('encoded-text-line2');
            inputElement.classList.remove('correct', 'incorrect');

            if (userInputLine2 === correctLine2Encoding) {
                feedbackDiv.textContent = "Correct sequence for Line 2!";
                feedbackDiv.className = 'text-xs mt-1 text-green-600';
                inputElement.classList.add('correct');
            } else {
                feedbackDiv.textContent = "Sequence incorrect. Check carefully against the dictionary and text.";
                feedbackDiv.className = 'text-xs mt-1 text-red-600';
                 inputElement.classList.add('incorrect');
            }
        }

        function checkTextCalc() {
            const sizeInput = document.getElementById('compressed-size');
            const reductionInput = document.getElementById('percentage-reduction');
            const sizeFeedback = document.getElementById('size-feedback');
            const reductionFeedback = document.getElementById('reduction-feedback');
            let sizeCorrect = false;
            let reductionCorrect = false;

            sizeInput.classList.remove('correct', 'incorrect');
            reductionInput.classList.remove('correct', 'incorrect');
            sizeFeedback.textContent = '';
            reductionFeedback.textContent = '';

            const userSize = parseInt(sizeInput.value);
            if (!isNaN(userSize) && userSize === correctCompressedSize) {
                sizeFeedback.textContent = "Correct!";
                sizeFeedback.className = 'text-xs mt-1 inline-block ml-2 text-green-600';
                sizeInput.classList.add('correct');
                sizeCorrect = true;
            } else if (sizeInput.value !== '') {
                sizeFeedback.textContent = `Incorrect (Expected: ${correctCompressedSize})`;
                sizeFeedback.className = 'text-xs mt-1 inline-block ml-2 text-red-600';
                sizeInput.classList.add('incorrect');
            } else {
                 sizeFeedback.textContent = `Expected: ${correctCompressedSize}`;
                 sizeFeedback.className = 'text-xs mt-1 inline-block ml-2 text-gray-500';
            }

            const originalSize = 117;
            const correctReduction = ((originalSize - correctCompressedSize) / originalSize) * 100;
            const userReduction = parseFloat(reductionInput.value.replace('%', ''));

            if (!isNaN(userReduction) && Math.abs(userReduction - correctReduction) < 0.1) {
                reductionFeedback.textContent = `Correct! (${correctReduction.toFixed(1)}%)`;
                reductionFeedback.className = 'text-xs mt-1 inline-block ml-2 text-green-600';
                reductionInput.classList.add('correct');
                reductionCorrect = true;
            } else if (reductionInput.value !== '') {
                reductionFeedback.textContent = `Incorrect (Expected: ${correctReduction.toFixed(1)}%)`;
                reductionFeedback.className = 'text-xs mt-1 inline-block ml-2 text-red-600';
                reductionInput.classList.add('incorrect');
            } else {
                 reductionFeedback.textContent = `Expected: ${correctReduction.toFixed(1)}%`;
                 reductionFeedback.className = 'text-xs mt-1 inline-block ml-2 text-gray-500';
            }
        }

        function resetTextCompression() {
             if (simulationTimeout) clearTimeout(simulationTimeout);
             const simOutput = document.getElementById('line1-simulation-output');
             simOutput.innerHTML = 'Click \'Simulate\' to see Line 1 reconstructed.';
             simOutput.classList.remove('border-l-4', 'border-green-500', 'pl-2');

             document.getElementById('encoded-text-line2').value = "";
             document.getElementById('encoded-text-line2').classList.remove('correct', 'incorrect');
             document.getElementById('encoding-feedback-line2').textContent = '';

             document.getElementById('compressed-size').value = '';
             document.getElementById('compressed-size').classList.remove('correct', 'incorrect');
             document.getElementById('size-feedback').textContent = '';
             document.getElementById('size-feedback').className = 'text-xs mt-1 inline-block ml-2 min-h-[1em]';
             document.getElementById('percentage-reduction').value = '';
             document.getElementById('percentage-reduction').classList.remove('correct', 'incorrect');
             document.getElementById('reduction-feedback').textContent = '';
             document.getElementById('reduction-feedback').className = 'text-xs mt-1 inline-block ml-2 min-h-[1em]';
        }

        // --- NEW: Exam Question Toggle ---
        /**
         * Toggles the visibility of an exam question's mark scheme.
         * Requires a minimum answer length before revealing.
         * @param {string} markschemeId - The ID of the mark scheme div.
         * @param {string} answerId - The ID of the textarea element.
         * @param {string} feedbackId - The ID of the feedback message div.
         * @param {HTMLElement} buttonElement - The button element clicked.
         */
        function toggleExamAnswer(markschemeId, answerId, feedbackId, buttonElement) {
            const markschemeDiv = document.getElementById(markschemeId);
            const answerTextarea = document.getElementById(answerId);
            const feedbackDiv = document.getElementById(feedbackId);
            const minLength = 20; // Minimum characters required in answer

            if (!markschemeDiv || !answerTextarea || !feedbackDiv) {
                console.error("Could not find required elements for toggleExamAnswer");
                return;
            }

            const answerText = answerTextarea.value.trim();
            const isMarkSchemeVisible = markschemeDiv.classList.contains('show');

            // Clear previous feedback message immediately
            feedbackDiv.textContent = '';
            feedbackDiv.classList.remove('show');

            // Check length only if trying to reveal the mark scheme
            if (!isMarkSchemeVisible && answerText.length < minLength) {
                feedbackDiv.textContent = `Please write a more detailed answer (at least ${minLength} characters) before revealing the mark scheme.`;
                feedbackDiv.classList.add('show');
                // Optional: Hide message after a delay
                setTimeout(() => {
                     feedbackDiv.textContent = '';
                     feedbackDiv.classList.remove('show');
                }, 4000);
                return; // Stop the function here
            }

            // Toggle the mark scheme visibility using the generic function
            toggleReveal(markschemeId, buttonElement, 'Show Mark Scheme', 'Hide Mark Scheme');
        }