// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "analogue": "A signal that is continuous and can take any value within a range. Sound waves are analogue.",
            "digital": "A signal that is discrete, meaning it can only take on specific, separate values (usually represented by binary 0s and 1s).",
            "sampling": "Recording the amplitude (height) of a sound wave at regular intervals.",
            "sample rate": "The frequency (rate) at which samples are measured per second. Sample rate is usually measured in Hertz (Hz). 1Hz = 1 sample per second.",
            "bit depth": "Also known as sample resolution. The number of bits used to record each measurement (sample). More bits allow for more accurate representation of the amplitude.",
            "sample resolution": "Also known as bit depth. The number of bits used to record each measurement (sample). More bits allow for more accurate representation of the amplitude.",
            "quality": "Increasing the sample rate and bit depth generally improves sound quality.",
            "file size": "Higher sample rates, bit depths, and longer durations all increase audio file size.",
            "hertz": "The unit of frequency, often used to measure sample rate (samples per second)."
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
        // Simple reveal, no auto-scoring for textareas.

        // --- Task 1: Key Sound Concepts ---
        function checkTask1SoundConcepts() {
            const q1Textarea = document.getElementById('q1-samplerate');
            const q2Textarea = document.getElementById('q2-bitdepth-desc');
            const q3Input = document.getElementById('q3-bitdepth-6bit');
            const q4Textarea = document.getElementById('q4-bitdepth-effect');

            const feedbackQ1 = document.getElementById('feedback-q1-samplerate');
            const feedbackQ2 = document.getElementById('feedback-q2-bitdepth-desc');
            const feedbackQ3 = document.getElementById('feedback-q3-bitdepth-6bit');
            const feedbackQ4 = document.getElementById('feedback-q4-bitdepth-effect');

            let task1CorrectCount = 0;
            const task1TotalQuestions = 4; // 4 parts to this task

            // Question 1: Sample Rate
            const q1Answer = q1Textarea.value.toLowerCase();
            let q1Correct = false;
            if (q1Answer.includes("samples") && (q1Answer.includes("second") || q1Answer.includes("time")) && (q1Answer.includes("hertz") || q1Answer.includes("hz"))) {
                feedbackQ1.innerHTML = `<p class="correct-feedback"><i class="fas fa-check mr-1"></i>Correct! Sample rate is how often the sound wave is measured per second, typically in Hz.</p>`;
                q1Textarea.classList.add('correct'); q1Textarea.classList.remove('incorrect');
                task1CorrectCount++;
                q1Correct = true;
            } else {
                feedbackQ1.innerHTML = `<p class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Not quite. Sample rate is the number of samples (measurements) of the sound wave taken per second, measured in Hertz (Hz).</p>`;
                q1Textarea.classList.add('incorrect'); q1Textarea.classList.remove('correct');
            }
            feedbackQ1.classList.add('show');
            q1Textarea.closest('.quiz-item').dataset.answeredCorrectly = q1Correct.toString();
            q1Textarea.closest('.quiz-item').dataset.answered = "true";


            // Question 2: Bit Depth Description
            const q2Answer = q2Textarea.value.toLowerCase();
            let q2Correct = false;
            if (q2Answer.includes("bits") && (q2Answer.includes("sample") || q2Answer.includes("measurement")) && (q2Answer.includes("store") || q2Answer.includes("represent") || q2Answer.includes("record")) && (q2Answer.includes("amplitude") || q2Answer.includes("level") || q2Answer.includes("height"))) {
                feedbackQ2.innerHTML = `<p class="correct-feedback"><i class="fas fa-check mr-1"></i>Correct! 4-bit depth means 4 bits are used to store the value of each sample's amplitude.</p>`;
                q2Textarea.classList.add('correct'); q2Textarea.classList.remove('incorrect');
                task1CorrectCount++;
                q2Correct = true;
            } else {
                feedbackQ2.innerHTML = `<p class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Not quite. 4-bit depth means each sample's amplitude is represented by a 4-bit binary number, allowing for 2<sup>4</sup> = 16 different levels.</p>`;
                q2Textarea.classList.add('incorrect'); q2Textarea.classList.remove('correct');
            }
            feedbackQ2.classList.add('show');
            q2Textarea.closest('.quiz-item').dataset.answeredCorrectly = q2Correct.toString();
            q2Textarea.closest('.quiz-item').dataset.answered = "true";

            // Question 3: 6-bit levels
            const q3Answer = parseInt(q3Input.value);
            const q3CorrectVal = Math.pow(2, 6); // 64
            let q3Correct = false;
            if (q3Answer === q3CorrectVal) {
                feedbackQ3.innerHTML = `<p class="correct-feedback"><i class="fas fa-check mr-1"></i>Correct! 2<sup>6</sup> = 64 levels.</p>`;
                q3Input.classList.add('correct'); q3Input.classList.remove('incorrect');
                task1CorrectCount++;
                q3Correct = true;
            } else {
                feedbackQ3.innerHTML = `<p class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Incorrect. With 6 bits, you can represent 2<sup>6</sup> = 64 different levels. You put ${q3Input.value || 'nothing'}.</p>`;
                q3Input.classList.add('incorrect'); q3Input.classList.remove('correct');
            }
            feedbackQ3.classList.add('show');
            q3Input.closest('.quiz-item').dataset.answeredCorrectly = q3Correct.toString();
            q3Input.closest('.quiz-item').dataset.answered = "true";

            // Question 4: Effect of increasing bit depth
            const q4Answer = q4Textarea.value.toLowerCase();
            let q4Correct = false;
            if ((q4Answer.includes("quality") && (q4Answer.includes("increase") || q4Answer.includes("better") || q4Answer.includes("improve"))) &&
                (q4Answer.includes("file size") && (q4Answer.includes("increase") || q4Answer.includes("larger") || q4Answer.includes("bigger")))) {
                feedbackQ4.innerHTML = `<p class="correct-feedback"><i class="fas fa-check mr-1"></i>Correct! Increasing bit depth improves audio quality (more accurate amplitude representation) and increases file size (more bits per sample).</p>`;
                q4Textarea.classList.add('correct'); q4Textarea.classList.remove('incorrect');
                task1CorrectCount++;
                q4Correct = true;
            } else {
                feedbackQ4.innerHTML = `<p class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Not quite. Increasing bit depth generally improves audio quality (more accurate amplitude representation) AND increases the file size (because more bits are used to store each sample).</p>`;
                q4Textarea.classList.add('incorrect'); q4Textarea.classList.remove('correct');
            }
            feedbackQ4.classList.add('show');
            q4Textarea.closest('.quiz-item').dataset.answeredCorrectly = q4Correct.toString();
            q4Textarea.closest('.quiz-item').dataset.answered = "true";

            checkTaskCompletion('task1-key-concepts');
            if (scoreCalculated) calculateScore();
        }

        function resetTask1SoundConcepts() {
            document.getElementById('q1-samplerate').value = '';
            document.getElementById('q2-bitdepth-desc').value = '';
            document.getElementById('q3-bitdepth-6bit').value = '';
            document.getElementById('q4-bitdepth-effect').value = '';
            ['q1-samplerate', 'q2-bitdepth-desc', 'q3-bitdepth-6bit', 'q4-bitdepth-effect'].forEach(id => {
                document.getElementById(id).classList.remove('correct', 'incorrect');
                const feedbackEl = document.getElementById(`feedback-${id}`);
                if (feedbackEl) feedbackEl.classList.remove('show');
                const quizItem = document.getElementById(id).closest('.quiz-item');
                if (quizItem) {
                     quizItem.dataset.answeredCorrectly = 'false';
                     delete quizItem.dataset.answered;
                }
            });
            checkTaskCompletion('task1-key-concepts');
            if (scoreCalculated) calculateScore();
        }

        // --- Task 2: Waveform Simulator ---
        const canvas = document.getElementById('waveform-canvas');
        const sampleRateSlider = document.getElementById('sample-rate-slider');
        const bitDepthSlider = document.getElementById('bit-depth-slider');
        const sampleRateValue = document.getElementById('sample-rate-value');
        const bitDepthValue = document.getElementById('bit-depth-value');
        const levelsValue = document.getElementById('levels-value');
        const soundFileSizeSim = document.getElementById('sound-file-size-sim');
        let ctx;

        function drawWaveform() {
            if (!canvas || !ctx) return;

            const width = canvas.width;
            const height = canvas.height;
            const midHeight = height / 2;
            const amplitude = height * 0.4; // Max amplitude of the wave
            const frequency = 2; // How many full waves to draw

            ctx.clearRect(0, 0, width, height);

            // 1. Draw original analogue wave (red)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red
            ctx.lineWidth = 2;
            for (let x = 0; x < width; x++) {
                const y = midHeight - Math.sin((x / width) * frequency * 2 * Math.PI) * amplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // 2. Get simulator values
            const currentSampleRate = parseInt(sampleRateSlider.value);
            const currentBitDepth = parseInt(bitDepthSlider.value);
            const numLevels = Math.pow(2, currentBitDepth);

            sampleRateValue.textContent = `${currentSampleRate} Hz (samples/sec)`;
            bitDepthValue.textContent = `${currentBitDepth} bit${currentBitDepth > 1 ? 's' : ''}`;
            levelsValue.textContent = `${numLevels} levels`;

            // 3. Draw sampled wave (blue steps)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(59, 130, 246, 1)'; // Blue
            ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; // Light blue fill for steps
            ctx.lineWidth = 2;

            const sampleInterval = width / currentSampleRate;
            let lastY = midHeight;

            for (let i = 0; i <= currentSampleRate; i++) {
                const xSample = i * sampleInterval;
                const analogueY = midHeight - Math.sin((xSample / width) * frequency * 2 * Math.PI) * amplitude;

                // Quantize the analogueY to one of the discrete levels
                // Map analogueY (0 to height) to a level (0 to numLevels-1)
                const normalizedY = (analogueY / height) * numLevels;
                const level = Math.round(normalizedY); // Round to nearest level
                const quantizedY = (level / numLevels) * height; // Convert level back to canvas Y

                if (i === 0) {
                    ctx.moveTo(xSample, quantizedY);
                    lastY = quantizedY;
                } else {
                    ctx.lineTo(xSample, lastY); // Horizontal line from previous sample's Y
                    ctx.lineTo(xSample, quantizedY); // Vertical line to current sample's Y
                    lastY = quantizedY;
                }
                // Draw sample points
                ctx.beginPath();
                ctx.arc(xSample, quantizedY, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(29, 78, 216, 1)'; // Darker blue for points
                ctx.fill();
                ctx.strokeStyle = 'rgba(59, 130, 246, 1)'; // Reset for lines
                 ctx.lineWidth = 2;
            }
            ctx.stroke(); // Draw the step lines

            // Calculate conceptual file size (assuming 1 second duration for this visual)
            const conceptualBits = currentSampleRate * 1 * currentBitDepth;
            soundFileSizeSim.textContent = `${conceptualBits.toLocaleString()} bits (for 1 sec)`;
        }
        
        function redrawWaveform() { // Separate function for button click
            drawWaveform();
        }


        // --- Task 3: Sound File Size Calculator ---
        const soundFileSizeQuestionsContainer = document.getElementById('sound-file-size-questions');
        const soundCalcQuestionsData = [
            { id: 1, rate: 44100, duration: 3, depth: 16, unit: "KB" }, // CD quality snippet
            { id: 2, rate: 8000, duration: 10, depth: 8, unit: "Bytes" },  // Basic voice
            { id: 3, rate: 22050, duration: 60, depth: 16, unit: "MB" }   // Decent quality, 1 min
        ];
        function createSoundCalcQuestionHTML(qData) { /* ... standard implementation ... */ }
        function loadSoundFileCalcQuestions() { /* ... standard implementation ... */ }
        function checkSingleSoundCalculation(questionId) { /* ... standard implementation ... */ }
        function checkAllSoundCalculations() { /* ... standard implementation ... */ }
        function resetAllSoundCalculations() { /* ... standard implementation ... */ }


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
            if (canvas) { // Check if canvas element exists
                ctx = canvas.getContext('2d');
                drawWaveform(); // Initial draw
                if(sampleRateSlider) sampleRateSlider.addEventListener('input', drawWaveform);
                if(bitDepthSlider) bitDepthSlider.addEventListener('input', drawWaveform);
            }

            loadSoundFileCalcQuestions();

            document.querySelectorAll('.read-checkbox').forEach(checkbox => { /* ... */ });
            
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#starter-activity') || item.closest('#exam-practice') || item.closest('#task2-waveform-sim') ) return;
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            const totalPossibleScoreValEl = document.getElementById('total-possible-score-value');
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf').addEventListener('click', exportToPDF);
        });

        // --- Implementations for Task 3 ---
        function createSoundCalcQuestionHTML(qData) {
            const correctBits = qData.rate * qData.duration * qData.depth;
            let correctConverted;
            if (qData.unit === "Bytes") correctConverted = correctBits / 8;
            else if (qData.unit === "KB") correctConverted = correctBits / 8 / 1000;
            else if (qData.unit === "MB") correctConverted = correctBits / 8 / 1000 / 1000;
            else correctConverted = correctBits; // Default to bits if unit unknown

            return `
                <div class="quiz-item bg-white p-4 rounded border border-gray-200 shadow-sm" data-points="3" data-id="sound-calc-q${qData.id}">
                    <p class="font-semibold mb-2">Audio File ${qData.id}: Sample Rate ${qData.rate.toLocaleString()} Hz, Duration ${qData.duration}s, Bit Depth ${qData.depth}-bit.</p>
                    <p class="text-sm text-gray-600 mb-2">Calculate the file size in ${qData.unit}.</p>
                    <div>
                        <label for="sound-calc-q${qData.id}-bits" class="block text-gray-700 text-sm">Working - Size in bits:</label>
                        <input type="number" id="sound-calc-q${qData.id}-bits" data-correct="${correctBits}" class="fill-blank w-full md:w-1/2 mt-1" placeholder="e.g., 1764000">
                    </div>
                    <div class="mt-2">
                        <label for="sound-calc-q${qData.id}-final" class="block text-gray-700 text-sm">Final Answer (in ${qData.unit}):</label>
                        <input type="number" step="any" id="sound-calc-q${qData.id}-final" data-correct="${correctConverted}" class="fill-blank w-full md:w-1/2 mt-1" placeholder="e.g., 220.5">
                    </div>
                    <div id="feedback-sound-calc-q${qData.id}" class="feedback-area mt-2"></div>
                </div>
            `;
        }

        function loadSoundFileCalcQuestions() {
            if (!soundFileSizeQuestionsContainer) return;
            soundFileSizeQuestionsContainer.innerHTML = '';
            soundCalcQuestionsData.forEach(q => {
                soundFileSizeQuestionsContainer.innerHTML += createSoundCalcQuestionHTML(q);
            });
        }

        function checkSingleSoundCalculation(questionId) {
            const questionDiv = document.querySelector(`.quiz-item[data-id="sound-calc-q${questionId}"]`);
            if (!questionDiv) return false;

            const bitsInput = document.getElementById(`sound-calc-q${questionId}-bits`);
            const finalInput = document.getElementById(`sound-calc-q${questionId}-final`);
            const feedbackDiv = document.getElementById(`feedback-sound-calc-q${questionId}`);

            let correctParts = 0;
            let feedbackText = "<ul>";
            let attempted = false;

            // Check bits calculation
            const userBits = parseFloat(bitsInput.value);
            const correctBits = parseFloat(bitsInput.dataset.correct);
            bitsInput.classList.remove('correct', 'incorrect');
            if (bitsInput.value.trim() !== "") attempted = true;

            if (!isNaN(userBits) && Math.abs(userBits - correctBits) < 0.01) {
                bitsInput.classList.add('correct');
                correctParts++;
                feedbackText += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Size in bits: Correct.</li>`;
            } else if (bitsInput.value.trim() !== "") {
                bitsInput.classList.add('incorrect');
                feedbackText += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Size in bits: Incorrect (Expected: ${correctBits.toLocaleString()}).</li>`;
            } else {
                 feedbackText += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Size in bits: Not answered. (Expected: ${correctBits.toLocaleString()}).</li>`;
            }

            // Check final converted answer
            const userFinal = parseFloat(finalInput.value);
            const correctFinal = parseFloat(finalInput.dataset.correct);
            finalInput.classList.remove('correct', 'incorrect');
             if (finalInput.value.trim() !== "") attempted = true;

            if (!isNaN(userFinal) && Math.abs(userFinal - correctFinal) < 0.01) {
                finalInput.classList.add('correct');
                correctParts++;
                 feedbackText += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>Final Answer: Correct.</li>`;
            } else if (finalInput.value.trim() !== "") {
                finalInput.classList.add('incorrect');
                feedbackText += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Final Answer: Incorrect (Expected: ${correctFinal.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 3})}).</li>`;
            } else {
                 feedbackText += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Final Answer: Not answered. (Expected: ${correctFinal.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 3})}).</li>`;
            }
            
            // Add a point if working for bits is shown and correct, even if final conversion is off.
            // And a point if final answer is correct. Max 2 for the calculation part, plus 1 for showing working (implicit if bits is correct)
            // The data-points="3" on quiz-item means 3 points if all is perfect.
            // Let's simplify: 1 for bits, 1 for final, 1 if both are right.
            let pointsForThisQ = 0;
            if (!isNaN(userBits) && Math.abs(userBits - correctBits) < 0.01) pointsForThisQ++;
            if (!isNaN(userFinal) && Math.abs(userFinal - correctFinal) < 0.01) pointsForThisQ++;
            if (pointsForThisQ === 2) pointsForThisQ = 3; // Full marks if both steps are good.

            feedbackText += "</ul>";
            feedbackDiv.innerHTML = feedbackText;
            feedbackDiv.classList.add('show');

            questionDiv.dataset.currentScore = pointsForThisQ; // Store actual points for this item
            questionDiv.dataset.answeredCorrectly = (pointsForThisQ === 3).toString();
            if(attempted) questionDiv.dataset.answered = "true";
            return pointsForThisQ === 3;
        }

        function checkAllSoundCalculations() {
            let allQuestionsPerfect = true;
            let anyAttempted = false;
            soundCalcQuestionsData.forEach(qData => {
                const qDiv = document.querySelector(`.quiz-item[data-id="sound-calc-q${qData.id}"]`);
                if(qDiv.querySelector('input[value]:not([value=""])')) anyAttempted = true;
                if (!checkSingleSoundCalculation(qData.id)) {
                    allQuestionsPerfect = false;
                }
            });
             if (!anyAttempted) {
                 alert("Please attempt at least one calculation before checking.");
                 return;
            }
            const overallFeedback = document.getElementById('sound-file-size-overall-feedback');
            if (allQuestionsPerfect) {
                overallFeedback.innerHTML = '<p class="correct-feedback font-semibold">All calculations are correct!</p>';
            } else {
                overallFeedback.innerHTML = '<p class="incorrect-feedback font-semibold">Some calculations are incorrect or incomplete. Please review.</p>';
            }
            overallFeedback.classList.add('show');
            checkTaskCompletion('task3-file-size-calc');
             if (scoreCalculated) calculateScore();
        }

        function resetAllSoundCalculations() {
            soundCalcQuestionsData.forEach(qData => {
                document.getElementById(`sound-calc-q${qData.id}-bits`).value = '';
                document.getElementById(`sound-calc-q${qData.id}-final`).value = '';
                document.getElementById(`sound-calc-q${qData.id}-bits`).classList.remove('correct', 'incorrect');
                document.getElementById(`sound-calc-q${qData.id}-final`).classList.remove('correct', 'incorrect');
                const feedbackDiv = document.getElementById(`feedback-sound-calc-q${qData.id}`);
                if(feedbackDiv) feedbackDiv.classList.remove('show');
                const questionDiv = document.querySelector(`.quiz-item[data-id="sound-calc-q${qData.id}"]`);
                if(questionDiv) {
                    questionDiv.dataset.answeredCorrectly = 'false';
                    delete questionDiv.dataset.answered;
                    delete questionDiv.dataset.currentScore;
                }
            });
            const overallFeedback = document.getElementById('sound-file-size-overall-feedback');
            if(overallFeedback) overallFeedback.classList.remove('show');
            checkTaskCompletion('task3-file-size-calc');
            if (scoreCalculated) calculateScore();
        }