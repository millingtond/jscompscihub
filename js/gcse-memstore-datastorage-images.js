// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "pixel": "A bitmap image is broken up into a grid of these, it's short for \"picture element\". Each one has a single colour which is encoded in binary.",
            "pixels": "A bitmap image is broken up into a grid of these, it's short for \"picture element\". Each one has a single colour which is encoded in binary.",
            "bitmap": "An image made of pixels, it blurs when scaled up, used for photos",
            "resolution": "The number of pixels in an image, higher value means a more detailed image but higher file size. The area is defined by the image width and height in pixels e.g. 1920x1080.",
            "image resolution": "The number of pixels in an image, higher value means a more detailed image but higher file size. The area is defined by the image width and height in pixels e.g. 1920x1080.",
            "colour depth": "The number of bits used to store the colour for each pixel, a higher number means more variety of colours.",
            "bit depth": "The number of bits used to store the colour for each pixel, a higher number means more variety of colours.",
            "metadata": "Data about data, such as image dimensions, resolution, colour depth, date created, file type.",
            "file size": "This goes up if we make the quality better by increasing the colour depth or resolution, meaning we need more storage",
            "quality": "Increasing the colour depth or resolution will make this better",
            "binary": "A base-2 number system using only 0s and 1s.",
            "bit": "The smallest unit of data, a 0 or 1.",
            "byte": "8 bits.",
            "vector graphics": "Images defined by mathematical equations for points, lines, curves, and shapes. Scalable without loss of quality."
        };

        // --- Global Variables for Scoring ---
        let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;

        // --- Helper: Add Keyword Tooltips ---
        function addTooltips() {
            document.querySelectorAll('.keyword').forEach(span => {
                const keywordText = span.textContent.trim().toLowerCase().replace(/[().,]/g, ''); // Clean text
                if (!span.querySelector('.tooltip')) { // Add tooltip only if one doesn't exist
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
                if (item.dataset.answeredCorrectly !== 'true') {
                    allCorrectInTask = false;
                }
                // A quiz item is considered attempted if it has the 'answered' dataset property
                // or if any of its option buttons are disabled (meaning an answer was clicked)
                const optionsDisabled = Array.from(item.querySelectorAll('.option-button')).some(btn => btn.disabled);
                if (!item.dataset.answered && !optionsDisabled && !item.querySelector('input.fill-blank, textarea')?.value.trim()) {
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


        // --- Starter Activity Logic (Task 0) ---
        const starterQ2Input = document.getElementById('starter-q2');
        if (starterQ2Input) {
            starterQ2Input.addEventListener('input', () => {
                const val = starterQ2Input.value.trim();
                starterQ2Input.classList.remove('correct', 'incorrect');
                if (val === "2") {
                    starterQ2Input.classList.add('correct');
                } else if (val !== "") {
                    starterQ2Input.classList.add('incorrect');
                }
            });
        }


        // --- Task 1: Pixel Art Explorer ---
        const pixelArtGrid = document.getElementById('pixel-art-grid');
        const colorPalette = document.getElementById('color-palette');
        const binaryDataOutput = document.getElementById('binary-data-output');
        let selectedColorIndex = 0;
        const PIXEL_GRID_SIZE = 5;
        const pixelColors = Array(PIXEL_GRID_SIZE * PIXEL_GRID_SIZE).fill(0);

        function initializePixelArt() {
            if (!pixelArtGrid || !colorPalette || !binaryDataOutput) return;
            pixelArtGrid.innerHTML = '';
            pixelColors.fill(0); 
            for (let i = 0; i < PIXEL_GRID_SIZE * PIXEL_GRID_SIZE; i++) {
                const pixel = document.createElement('div');
                pixel.classList.add('pixel', `color-${pixelColors[i]}`);
                pixel.dataset.index = i;
                pixel.addEventListener('click', () => {
                    pixelColors[i] = selectedColorIndex;
                    pixel.className = `pixel color-${selectedColorIndex}`;
                    updateBinaryOutput();
                });
                pixelArtGrid.appendChild(pixel);
            }
            updateBinaryOutput();

            colorPalette.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', () => {
                    const currentSelected = colorPalette.querySelector('.selected-color');
                    if (currentSelected) currentSelected.classList.remove('selected-color');
                    button.classList.add('selected-color');
                    selectedColorIndex = parseInt(button.dataset.colorIndex);
                });
            });
            const firstColorButton = colorPalette.querySelector('button');
            if (firstColorButton && !colorPalette.querySelector('.selected-color')) {
                firstColorButton.classList.add('selected-color');
                selectedColorIndex = parseInt(firstColorButton.dataset.colorIndex);
            }
        }

        function updateBinaryOutput() {
            if (!binaryDataOutput) return;
            let binaryString = "";
            for (let r = 0; r < PIXEL_GRID_SIZE; r++) {
                for (let c = 0; c < PIXEL_GRID_SIZE; c++) {
                    const index = r * PIXEL_GRID_SIZE + c;
                    binaryString += pixelColors[index].toString(2).padStart(3, '0') + " ";
                }
                binaryString += "\n"; 
            }
            binaryDataOutput.textContent = binaryString.trim();
        }

        function resetPixelArt() {
            initializePixelArt();
        }

        // --- Task 2: Resolution & Colour Depth Simulator ---
        const resSlider = document.getElementById('res-slider');
        const depthSlider = document.getElementById('depth-slider');
        const imageQualitySimGrid = document.getElementById('image-quality-sim-grid');
        const resValueDisplay = document.getElementById('res-value');
        const depthValueDisplay = document.getElementById('depth-value');
        const numColorsDisplay = document.getElementById('num-colors-display');
        const conceptualFileSizeDisplay = document.getElementById('conceptual-file-size');

        function updateImageSim() {
            if (!resSlider || !depthSlider || !imageQualitySimGrid || !resValueDisplay || !depthValueDisplay || !numColorsDisplay || !conceptualFileSizeDisplay) return;

            const resolution = parseInt(resSlider.value);
            const bitDepth = parseInt(depthSlider.value);

            resValueDisplay.textContent = `${resolution}x${resolution}`;
            depthValueDisplay.textContent = `${bitDepth} bit${bitDepth > 1 ? 's' : ''}`;
            const numColors = Math.pow(2, bitDepth);
            numColorsDisplay.textContent = `${numColors.toLocaleString()}`;

            imageQualitySimGrid.innerHTML = '';
            imageQualitySimGrid.style.gridTemplateColumns = `repeat(${resolution}, 1fr)`;
            imageQualitySimGrid.style.gridTemplateRows = `repeat(${resolution}, 1fr)`;
            
            const totalPixels = resolution * resolution;
            const totalBits = totalPixels * bitDepth;
            conceptualFileSizeDisplay.textContent = `${totalBits.toLocaleString()} bits`;

            const pixelSize = 200 / resolution; 

            for (let i = 0; i < totalPixels; i++) {
                const pixel = document.createElement('div');
                pixel.classList.add('pixel');
                pixel.style.width = `${pixelSize}px`;
                pixel.style.height = `${pixelSize}px`;
                const randomColorValue = Math.floor(Math.random() * numColors);
                const grayScale = numColors > 1 ? Math.floor((randomColorValue / (numColors -1)) * 255) : (randomColorValue === 0 ? 0 : 255) ; // Handle 1-bit case (2 colors)
                pixel.style.backgroundColor = `rgb(${grayScale},${grayScale},${grayScale})`;
                 pixel.style.border = resolution > 15 ? 'none' : '1px solid #f0f0f0';
                imageQualitySimGrid.appendChild(pixel);
            }
        }
        function resetImageSim() {
            if(resSlider) resSlider.value = 10;
            if(depthSlider) depthSlider.value = 1;
            updateImageSim();
        }


        // --- Task 3: File Size Calculator ---
        const calcQuestionsContainer = document.getElementById('file-size-calc-questions');
        const calcQuestionsData = [
            { id: 1, width: 20, height: 20, colors: 8, bitsPerPixel: 3 },
            { id: 2, width: 10, height: 10, colors: 8, bitsPerPixel: 3 },
            { id: 3, width: 20, height: 20, colors: 4, bitsPerPixel: 2 },
            { id: 4, width: 600, height: 400, colors: 256, bitsPerPixel: 8 },
            { id: 5, width: 1920, height: 1080, colors: 16777216, bitsPerPixel: 24 }
        ];

        function createFileCalcQuestionHTML(qData) {
            const totalPixelsCorrect = qData.width * qData.height;
            const fileSizeBitsCorrect = totalPixelsCorrect * qData.bitsPerPixel;
            const fileSizeBytesCorrect = fileSizeBitsCorrect / 8;

            return `
                <div class="quiz-item bg-white p-4 rounded border border-gray-200 shadow-sm" data-points="3" data-id="calc-q${qData.id}">
                    <p class="font-semibold mb-2">Image ${qData.id}: Resolution ${qData.width}x${qData.height}, ${qData.colors.toLocaleString()} Colours (${qData.bitsPerPixel}-bit colour depth)</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                            <label for="calc-q${qData.id}-pixels" class="block text-gray-700">Total Pixels:</label>
                            <input type="number" id="calc-q${qData.id}-pixels" data-correct="${totalPixelsCorrect}" class="fill-blank w-full mt-1">
                        </div>
                        <div>
                            <label for="calc-q${qData.id}-filesize-bits" class="block text-gray-700">File Size (bits):</label>
                            <input type="number" id="calc-q${qData.id}-filesize-bits" data-correct="${fileSizeBitsCorrect}" class="fill-blank w-full mt-1">
                        </div>
                        <div>
                            <label for="calc-q${qData.id}-filesize-bytes" class="block text-gray-700">File Size (Bytes):</label>
                            <input type="number" id="calc-q${qData.id}-filesize-bytes" data-correct="${fileSizeBytesCorrect}" class="fill-blank w-full mt-1">
                        </div>
                    </div>
                    <div id="feedback-calc-q${qData.id}" class="feedback-area mt-2"></div>
                </div>
            `;
        }

        function loadFileCalcQuestions() {
            if (!calcQuestionsContainer) return;
            calcQuestionsContainer.innerHTML = '';
            calcQuestionsData.forEach(q => {
                calcQuestionsContainer.innerHTML += createFileCalcQuestionHTML(q);
            });
        }

        function checkSingleCalculation(questionId) {
            const questionDiv = document.querySelector(`.quiz-item[data-id="calc-q${questionId}"]`);
            if (!questionDiv) return false;

            const pixelsInput = document.getElementById(`calc-q${questionId}-pixels`);
            const bitsInput = document.getElementById(`calc-q${questionId}-filesize-bits`);
            const bytesInput = document.getElementById(`calc-q${questionId}-filesize-bytes`);
            const feedbackDiv = document.getElementById(`feedback-calc-q${questionId}`);

            let correctCount = 0;
            const inputsToCheck = [pixelsInput, bitsInput, bytesInput];
            let feedbackText = "<ul>";
            let attempted = false;

            inputsToCheck.forEach(input => {
                const userAnswer = parseFloat(input.value);
                const correctAnswer = parseFloat(input.dataset.correct);
                input.classList.remove('correct', 'incorrect');
                if (input.value.trim() !== "") attempted = true;

                if (!isNaN(userAnswer) && Math.abs(userAnswer - correctAnswer) < 0.01) { 
                    input.classList.add('correct');
                    correctCount++;
                    feedbackText += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>${input.previousElementSibling.textContent} Correct.</li>`;
                } else if (input.value.trim() !== "") {
                    input.classList.add('incorrect');
                    feedbackText += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>${input.previousElementSibling.textContent} Incorrect (Expected: ${correctAnswer.toLocaleString()}).</li>`;
                } else {
                     feedbackText += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>${input.previousElementSibling.textContent} Not answered. (Expected: ${correctAnswer.toLocaleString()}).</li>`;
                }
            });
            feedbackText += "</ul>";
            feedbackDiv.innerHTML = feedbackText;
            feedbackDiv.classList.add('show');

            const allPartsCorrect = correctCount === inputsToCheck.length;
            questionDiv.dataset.answeredCorrectly = allPartsCorrect.toString();
            if(attempted) questionDiv.dataset.answered = "true";
            return allPartsCorrect;
        }

        function checkAllCalculations() {
            let allQuestionsCorrect = true;
            let anyAttempted = false;
            calcQuestionsData.forEach(qData => {
                const qDiv = document.querySelector(`.quiz-item[data-id="calc-q${qData.id}"]`);
                if(qDiv.querySelector('input[value]:not([value=""])')) anyAttempted = true;

                if (!checkSingleCalculation(qData.id)) {
                    allQuestionsCorrect = false;
                }
            });
            if (!anyAttempted) {
                 alert("Please attempt at least one calculation before checking.");
                 return;
            }
            const overallFeedback = document.getElementById('file-size-overall-feedback');
            if (allQuestionsCorrect) {
                overallFeedback.innerHTML = '<p class="correct-feedback font-semibold">All calculations are correct!</p>';
            } else {
                overallFeedback.innerHTML = '<p class="incorrect-feedback font-semibold">Some calculations are incorrect. Please review the highlighted fields.</p>';
            }
            overallFeedback.classList.add('show');
            checkTaskCompletion('task3-file-size-calculator');
             if (scoreCalculated) calculateScore();
        }
        function resetAllCalculations() {
            calcQuestionsData.forEach(qData => {
                document.getElementById(`calc-q${qData.id}-pixels`).value = '';
                document.getElementById(`calc-q${qData.id}-filesize-bits`).value = '';
                document.getElementById(`calc-q${qData.id}-filesize-bytes`).value = '';
                document.getElementById(`calc-q${qData.id}-pixels`).classList.remove('correct', 'incorrect');
                document.getElementById(`calc-q${qData.id}-filesize-bits`).classList.remove('correct', 'incorrect');
                document.getElementById(`calc-q${qData.id}-filesize-bytes`).classList.remove('correct', 'incorrect');
                const feedbackDiv = document.getElementById(`feedback-calc-q${qData.id}`);
                if(feedbackDiv) feedbackDiv.classList.remove('show');
                const questionDiv = document.querySelector(`.quiz-item[data-id="calc-q${qData.id}"]`);
                if(questionDiv) {
                    questionDiv.dataset.answeredCorrectly = 'false';
                    delete questionDiv.dataset.answered;
                }
            });
            const overallFeedback = document.getElementById('file-size-overall-feedback');
            if(overallFeedback) overallFeedback.classList.remove('show');
            checkTaskCompletion('task3-file-size-calculator');
            if (scoreCalculated) calculateScore();
        }


        // --- Task 4: Metadata ---
        const metadataOptions = document.querySelectorAll('#metadata-options .multi-select');
        metadataOptions.forEach(button => {
            button.addEventListener('click', () => {
                const quizItem = button.closest('.quiz-item');
                if (!quizItem.dataset.answered) { 
                    button.classList.toggle('selected');
                }
            });
        });

        function checkMetadataSelection() {
            const feedbackDiv = document.getElementById('metadata-feedback');
            const quizItem = feedbackDiv.closest('.quiz-item');
            let correctSelections = 0;
            let incorrectSelections = 0;
            const totalCorrectOptions = Array.from(metadataOptions).filter(opt => opt.dataset.correct === 'true').length;
            let attempted = false;

            metadataOptions.forEach(button => {
                const isCorrect = button.dataset.correct === 'true';
                const isSelected = button.classList.contains('selected');
                button.classList.remove('correct', 'incorrect'); 

                if (isSelected) {
                    attempted = true;
                    if (isCorrect) {
                        button.classList.add('correct');
                        correctSelections++;
                    } else {
                        button.classList.add('incorrect');
                        incorrectSelections++;
                    }
                } else {
                    if (isCorrect) { 
                        button.classList.add('incorrect'); 
                    }
                }
            });

            if (!attempted && metadataOptions.length > 0) {
                alert("Please select at least one option for the metadata question.");
                return;
            }
            
            quizItem.dataset.answered = "true"; // Mark as attempted

            const pointsAwarded = Math.max(0, Math.min(parseInt(quizItem.dataset.points), correctSelections - incorrectSelections));
            quizItem.dataset.currentScore = pointsAwarded; 
            quizItem.dataset.answeredCorrectly = (pointsAwarded === parseInt(quizItem.dataset.points) && incorrectSelections === 0).toString();


            if (pointsAwarded === parseInt(quizItem.dataset.points) && incorrectSelections === 0) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">Excellent! You identified all correct metadata examples and no incorrect ones. (+${pointsAwarded} points)</p>`;
            } else {
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">You identified ${correctSelections} correct examples, but also made ${incorrectSelections} incorrect selections, or missed some. Review the highlighted options. (+${pointsAwarded} points)</p>`;
            }
            feedbackDiv.classList.add('show');
            checkTaskCompletion('task4-metadata');
            if (scoreCalculated) calculateScore();
        }

        function resetMetadataTask() {
            metadataOptions.forEach(button => {
                button.classList.remove('selected', 'correct', 'incorrect');
                button.disabled = false;
            });
            const feedbackDiv = document.getElementById('metadata-feedback');
            if (feedbackDiv) feedbackDiv.classList.remove('show');
            const quizItem = document.querySelector('#task4-metadata .quiz-item[data-points="3"]'); // Target the multi-select quiz item
            if (quizItem) {
                quizItem.dataset.answeredCorrectly = 'false';
                delete quizItem.dataset.answered;
                delete quizItem.dataset.currentScore;
            }
            document.getElementById('metadata-importance').value = '';
            const importanceAnswerDiv = document.getElementById('metadata-importance-answer');
            const importanceButton = importanceAnswerDiv.previousElementSibling; // The reveal button
            if (importanceAnswerDiv.classList.contains('show')) {
                toggleReveal('metadata-importance-answer', importanceButton, 'Show Example Answer', 'Hide Example Answer');
            }
             const researchQuizItem = document.querySelector('#task4-metadata .quiz-item[data-points="1"]'); // Target the research question quiz item
            if (researchQuizItem) {
                delete researchQuizItem.dataset.answered; // Reset its answered state too
                researchQuizItem.dataset.answeredCorrectly = 'false';
            }

            checkTaskCompletion('task4-metadata');
            if (scoreCalculated) calculateScore();
        }


        // --- Exam Practice Question Logic ---
        function checkThenToggleMarkScheme(textareaId, markschemeId, buttonElement, minLength = 10) {
            const textarea = document.getElementById(textareaId);
            const markscheme = document.getElementById(markschemeId);
            // No specific feedback div for this version, using alert for simplicity if needed.

            if (!textarea || !markscheme) return;

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
                if (item.closest('#starter-activity') || item.closest('#exam-practice') || item.closest('#task1-pixel-explorer') || item.closest('#task2-resolution-colordepth')) return;

                const points = parseInt(item.dataset.points || 0);
                totalPossibleScore += points;

                if (item.dataset.answeredCorrectly === 'true') {
                    if (item.dataset.currentScore) { 
                        currentScore += parseInt(item.dataset.currentScore);
                    } else {
                        currentScore += points;
                    }
                }
            });

            const scoreDisplay = document.getElementById('current-score-value'); // Updated ID
            const totalDisplay = document.getElementById('total-possible-score-value'); // Updated ID
            const feedbackDisplay = document.getElementById('final-score-feedback');
            const scoreArea = document.getElementById('final-score-area');

            if(scoreDisplay) scoreDisplay.textContent = currentScore;
            if(totalDisplay) totalDisplay.textContent = totalPossibleScore;

            let percentage = totalPossibleScore > 0 ? (currentScore / totalPossibleScore) * 100 : 0;
            let feedbackMessage = "";

            if (percentage === 100) feedbackMessage = "Excellent! Full marks on interactive tasks!";
            else if (percentage >= 80) feedbackMessage = "Great job! Strong understanding of image representation.";
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
            document.getElementById('starter-q1').value = '';
            document.getElementById('starter-q2').value = '';
            document.getElementById('starter-q3').value = '';
            const starterFeedback = document.getElementById('starter-answers-feedback');
            if (starterFeedback.classList.contains('show')) {
                toggleReveal('starter-answers-feedback', starterFeedback.previousElementSibling, 'Reveal Example Answers', 'Hide Example Answers');
            }
             if(starterQ2Input) starterQ2Input.classList.remove('correct', 'incorrect');


            // Reset Task 1
            resetPixelArt();
            // Reset Task 2
            resetImageSim();
            // Reset Task 3
            resetAllCalculations();
            // Reset Task 4
            resetMetadataTask();

            // Reset Exam Practice
            document.querySelectorAll('#exam-practice textarea').forEach(ta => ta.value = '');
            document.querySelectorAll('#exam-practice .mark-scheme').forEach(ms => {
                if (ms.classList.contains('show')) {
                    const button = ms.previousElementSibling; // Assuming button is right before mark scheme
                    toggleReveal(ms.id, button, 'Show Mark Scheme', 'Hide Mark Scheme');
                }
            });
             document.querySelectorAll('#exam-practice .mark-scheme-button').forEach(btn => btn.textContent = 'Show Mark Scheme');


            // Reset Read Checkboxes
            document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);

            // Reset Final Score
            currentScore = 0;
            scoreCalculated = false;
            document.getElementById('final-score-area').style.display = 'none';
            const currentScoreValEl = document.getElementById('current-score-value');
            const totalPossibleScoreValEl = document.getElementById('total-possible-score-value');
            if(currentScoreValEl) currentScoreValEl.textContent = '0';
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore; // Keep total updated
            document.getElementById('final-score-feedback').textContent = '';

            // Update task completion indicators
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
                filename:     'gcse-cs-images-worksheet.pdf',
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
            initializePixelArt();
            if(resSlider && depthSlider) updateImageSim(); 
            loadFileCalcQuestions();

            document.querySelectorAll('.read-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    console.log(`Section read status changed for: ${event.target.closest('section').id}`);
                });
            });
            
            totalPossibleScore = 0; // Recalculate on load
            document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#starter-activity') || item.closest('#exam-practice') || item.closest('#task1-pixel-explorer') || item.closest('#task2-resolution-colordepth')) return;
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            const totalPossibleScoreValEl = document.getElementById('total-possible-score-value');
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore;


            // Comment out canvas initializations for non-existent canvases in this lesson
            // initializeCanvas('exam2-canvas-task4');
            // initializeCanvas('exam3-canvas-task4');


            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf').addEventListener('click', exportToPDF);
        });