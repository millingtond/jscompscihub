let quizScore = 0;
        let questionsAnswered = 0;

        // Flashcard Data for Tooltips
        const flashcardData = {
            "embedded system": "Has a specific purpose / it only performs one/few tasks. Built within a larger device. Dedicated hardware/sensors. Has a microprocessor. Built-in operating system... and software (generally) all stored in ROM. … it's instructions does not change/update (generally)",
            "embedded system characteristics": "Dedicated function(s), Small, Cheap, Energy efficient",
            "general purpose computer": "A computer that can run many different programs (e.g. a smartphone). The opposite to an embedded system.",
            "general purpose computer characteristics": "Multitasking, Large memory, Can perform wide range of tasks, Expandability, Higher processing power",
            "dedicated": "Having a single purpose or function, not general purpose. Embedded systems are this.",
            "small": "The relative size of embedded systems, compared to general purpose computers.",
            "cheap": "The cost of an embedded system compared to a general purpose computer.",
            "control system": "An embedded system in traffic lights or a dishwasher manages the hardware, turning things on and off. We often use this two word phrase to describe such a computer.",
            "efficient": "Embedded systems are this, meaning they can use cheaper, low-spec CPUs and less RAM than general-purpose computers, because they are designed to do just one thing well. (Energy efficient)",
            "multitasking": "Running more than one program at once. General purpose computers can do this, embedded systems cannot.",
            "traffic lights": "Signals that instruct drivers to stop and go, they are controlled by an embedded system whose one function is to control the lights.",
            "dishwasher": "Home appliance to wash plates, the computer in this device has only one job, to control the valves and heaters in the machine.",
            "power": "Embedded systems consume a lot less of this, meaning they can run for a long time on batteries or solar energy.",
            "memory": "General purpose computers need a lot of this, because they are designed to run many different programs. Embedded systems don't need to store a lot of instructions or data so this can be small.",
            "rom": "Read-Only Memory. Non-volatile memory typically used to store firmware or boot instructions.",
            "clock speed": "The number of FDE cycles a CPU can perform per second (measured in Hz, typically GHz).",
             "cores": "An individual processing unit within a CPU. Multi-core CPUs have more than one.",
             "cache": "Small, fast memory located on or near the CPU to store frequently accessed data/instructions.",
        };

        // Constants for conditional button enabling
        const MIN_DRAGGED_ITEMS_TASK1 = 3; // For Task 1 Categorise
        const MIN_DRAGGED_ITEMS_TASK4 = 3; // For Task 4 Pros & Cons
        const MIN_CHARS_TASK3 = 20;       // For Task 3 Smartwatch textareas (each)
        const MIN_FILLED_BLANKS_TASK5 = 2; // For Task 5 Fill Blanks
        const CHARS_PER_MARK_THRESHOLD_TASK7 = 20; // For Task 7 Exam Practice

         // Quiz Data
        const quizData = [
            { question: "Which best describes an embedded system?", options: ["A computer that can run any software", "A system built into a larger device for a specific task", "The main circuit board of a PC", "A type of portable storage"], correctAnswer: "A system built into a larger device for a specific task", feedbackCorrect: "Correct! Embedded systems have a dedicated function within another device.", feedbackIncorrect: "Incorrect. Embedded systems are designed for specific tasks within larger devices." },
            { question: "Which is NOT a typical characteristic of an embedded system?", options: ["Low power consumption", "Expandable memory and peripherals", "Dedicated function", "Small size"], correctAnswer: "Expandable memory and peripherals", feedbackCorrect: "Correct! General-purpose computers are typically expandable, not embedded systems.", feedbackIncorrect: "Incorrect. Embedded systems usually have fixed hardware and are not easily expandable." },
            { question: "A modern smartphone is generally considered a:", options: ["Embedded System", "Control System", "General-Purpose Computer", "Microprocessor"], correctAnswer: "General-Purpose Computer", feedbackCorrect: "Correct! Smartphones can run many different apps.", feedbackIncorrect: "Incorrect. Because smartphones can run various apps, they are general-purpose." },
            { question: "Why are embedded systems often energy efficient?", options: ["They have large batteries", "They use powerful processors", "They are designed for specific, limited tasks", "They connect to the mains power"], correctAnswer: "They are designed for specific, limited tasks", feedbackCorrect: "Correct! Their dedicated nature allows for optimised, low-power components.", feedbackIncorrect: "Incorrect. Focusing on specific tasks allows them to use less powerful, more efficient components." },
            { question: "The software and OS in many embedded systems are stored in:", options: ["RAM", "Cache", "Hard Disk Drive", "ROM"], correctAnswer: "ROM", feedbackCorrect: "Correct! ROM (Read-Only Memory) is often used as the instructions don't typically change.", feedbackIncorrect: "Incorrect. ROM is commonly used because the software is fixed and doesn't need to be changed often." }
        ];
        const totalQuestions = quizData.length;

        // --- Task 1: Categorising (Drag & Drop) ---
        let draggedCategoryItem = null;

        function allowDrop(ev) {
            ev.preventDefault();
            if (ev.target.classList.contains('category-drop-zone') || ev.target.id === 'category-bank') {
                ev.target.classList.add('over');
            }
        }

        function dragCategoryItem(ev) {
            draggedCategoryItem = ev.target;
            ev.dataTransfer.setData("text/plain", ev.target.id);
            ev.dataTransfer.effectAllowed = "move";
            setTimeout(() => {
                if (draggedCategoryItem) draggedCategoryItem.classList.add('dragging');
            }, 0);
        }

        function dropCategoryItem(ev) {
            ev.preventDefault();
            let dropTarget = ev.target;
            // Allow dropping onto the zone even if it contains other items
            if (dropTarget.classList.contains('category-item')) {
                dropTarget = dropTarget.parentElement;
            }

            if ((dropTarget.classList.contains('category-drop-zone') || dropTarget.id === 'category-bank') && draggedCategoryItem) {
                dropTarget.appendChild(draggedCategoryItem); // Directly append
                dropTarget.classList.remove('over');
            }
            if (draggedCategoryItem) {
                draggedCategoryItem.classList.remove('dragging');
            }
            draggedCategoryItem = null;
        }

        function handleCategoryDragLeave(ev) {
             if (ev.target.classList.contains('category-drop-zone') || ev.target.id === 'category-bank') {
                ev.target.classList.remove('over');
            }
        }

        function handleCategoryDragEnd(ev) {
            if (draggedCategoryItem) {
                draggedCategoryItem.classList.remove('dragging');
                 // If drop was not successful (e.g., outside valid zone), return to bank
                 if (ev.dataTransfer.dropEffect !== 'move') {
                     document.getElementById('category-bank').appendChild(draggedCategoryItem);
                 }
            }
            draggedCategoryItem = null;
        }

        function checkCategories() {
            const feedbackElement = document.getElementById('category-feedback');
            const embeddedZone = document.getElementById('drop-embedded');
            const generalZone = document.getElementById('drop-general');
            let correctCount = 0; let incorrectCount = 0;
            const allItems = document.querySelectorAll('.category-item');

            allItems.forEach(item => item.classList.remove('correct-category', 'incorrect-category'));
            embeddedZone.classList.remove('correct-category', 'incorrect-category');
            generalZone.classList.remove('correct-category', 'incorrect-category');

            embeddedZone.querySelectorAll('.category-item').forEach(item => {
                if (item.dataset.correctCategory === 'embedded') { correctCount++; item.classList.add('correct-category'); }
                else { incorrectCount++; item.classList.add('incorrect-category'); }
            });
            generalZone.querySelectorAll('.category-item').forEach(item => {
                if (item.dataset.correctCategory === 'general') { correctCount++; item.classList.add('correct-category'); }
                else { incorrectCount++; item.classList.add('incorrect-category'); }
            });

            const itemsInBank = document.querySelectorAll('#category-bank .category-item').length;
            const totalItems = allItems.length;
            let feedbackHtml = "";
            if (incorrectCount === 0 && itemsInBank === 0) {
                 feedbackHtml = `<p class="correct-feedback font-semibold"><i class="fas fa-check mr-2"></i>All characteristics categorized correctly!</p>`;
                 embeddedZone.classList.add('correct-category'); generalZone.classList.add('correct-category');
            } else {
                 feedbackHtml = `<p class="incorrect-feedback font-semibold"><i class="fas fa-times mr-2"></i>Some characteristics are in the wrong category or still in the bank.</p>`;
                 feedbackHtml += `<p class="text-sm incorrect-feedback">You correctly placed ${correctCount} items. Check items highlighted in red or remaining in the bank.</p>`;
                  if (incorrectCount > 0) {
                      if (embeddedZone.querySelector('.incorrect-category')) embeddedZone.classList.add('incorrect-category');
                      if (generalZone.querySelector('.incorrect-category')) generalZone.classList.add('incorrect-category');
                  }
            }
             feedbackElement.innerHTML = feedbackHtml; feedbackElement.classList.add('show');
             updateConditionalButtonState(); // Re-check button state
        }
         function resetCategories() {
             const bank = document.getElementById('category-bank');
             const items = document.querySelectorAll('.category-item');
             items.forEach(item => { item.classList.remove('correct-category', 'incorrect-category'); bank.appendChild(item); });
             document.querySelectorAll('.category-drop-zone').forEach(zone => { zone.innerHTML = ''; zone.classList.remove('correct-category', 'incorrect-category', 'over'); });
             const feedback = document.getElementById('category-feedback'); if(feedback) feedback.classList.remove('show');
             updateConditionalButtonState();
         }

         function setupCategoryDragDropListeners() {
             document.querySelectorAll('.category-item').forEach(item => {
                 item.draggable = true;
                 item.addEventListener('dragstart', dragCategoryItem);
                 item.addEventListener('dragend', handleCategoryDragEnd);
             });
             document.querySelectorAll('.category-drop-zone, #category-bank').forEach(zone => {
                 zone.addEventListener('dragover', allowDrop);
                 zone.addEventListener('drop', dropCategoryItem);
                 zone.addEventListener('dragleave', handleCategoryDragLeave);
                 // Add listener to update button state after a drop
                 zone.addEventListener('drop', updateConditionalButtonState);
             });
         }


        // --- Task 2: Examples ---
        function checkExample(button, correctAnswer, explanation) {
            const container = button.closest('.example-option-container');
            const feedback = container.querySelector('.example-feedback');
            const buttons = container.querySelectorAll('button');
            const selectedAnswer = button.textContent.trim().toLowerCase().includes('embedded') ? 'embedded' : 'general';

            buttons.forEach(btn => btn.disabled = true);
            feedback.classList.remove('show', 'correct-feedback', 'incorrect-feedback');

            if (selectedAnswer === correctAnswer) {
                button.classList.add('correct');
                feedback.innerHTML = `<span class="correct-feedback"><i class="fas fa-check mr-1"></i>Correct! ${explanation}</span>`;
                feedback.classList.add('show', 'correct-feedback');
                container.dataset.answeredCorrectly = "true";
            } else {
                button.classList.add('incorrect');
                feedback.innerHTML = `<span class="incorrect-feedback"><i class="fas fa-times mr-1"></i>Incorrect. It's a ${correctAnswer} system because ${explanation}</span>`;
                feedback.classList.add('show', 'incorrect-feedback');
                container.dataset.answeredCorrectly = "false";
                buttons.forEach(btn => {
                     const btnType = btn.textContent.trim().toLowerCase().includes('embedded') ? 'embedded' : 'general';
                     if (btnType === correctAnswer) { btn.classList.add('correct'); }
                });
            }
        }
         function resetExamples() {
             document.querySelectorAll('.example-option-container').forEach(container => {
                 const feedback = container.querySelector('.example-feedback');
                 const buttons = container.querySelectorAll('button');
                 buttons.forEach(btn => { btn.disabled = false; btn.classList.remove('correct', 'incorrect'); });
                 if(feedback) feedback.classList.remove('show');
                 if(container) // Added null check
                  container.dataset.answeredCorrectly = "false";
             });
         }

         // --- Task 3: Smartwatch ---
         function toggleReveal(contentId, buttonElement, revealText, hideText) {
            const content = document.getElementById(contentId);
            content.classList.toggle('show');
            if (content.classList.contains('show')) { buttonElement.textContent = hideText; }
            else { buttonElement.textContent = revealText; }
            // No need to call updateConditionalButtonState here as this is a reveal, not a check
        }

        // --- Task 4: Pros & Cons Sorting ---
        let draggedProsConsItem = null;

        function allowDropProsCons(ev) {
            ev.preventDefault();
            if (ev.target.classList.contains('pros-cons-drop-zone') || ev.target.id === 'pros-cons-bank') {
                ev.target.classList.add('over');
            }
        }

        function dragProsConsItem(ev) {
            draggedProsConsItem = ev.target;
            ev.dataTransfer.setData("text/plain", ev.target.id);
            ev.dataTransfer.effectAllowed = "move";
            setTimeout(() => {
                if (draggedProsConsItem) draggedProsConsItem.classList.add('dragging');
            }, 0);
        }

        function dropProsConsItem(ev) {
            ev.preventDefault();
            let dropTarget = ev.target;
            if (dropTarget.classList.contains('pros-cons-item')) {
                dropTarget = dropTarget.parentElement;
            }

            if ((dropTarget.classList.contains('pros-cons-drop-zone') || dropTarget.id === 'pros-cons-bank') && draggedProsConsItem) {
                 let alreadyExists = false;
                 if (dropTarget.classList.contains('pros-cons-drop-zone')) {
                     for(let i=0; i < dropTarget.children.length; i++) {
                         if (dropTarget.children[i].id === draggedProsConsItem.id) {
                             alreadyExists = true;
                             break;
                         }
                     }
                 }
                 if (!alreadyExists || dropTarget.id === 'pros-cons-bank') {
                      dropTarget.appendChild(draggedProsConsItem);
                  }
                  dropTarget.classList.remove('over');
            }
             if (draggedProsConsItem) {
                 draggedProsConsItem.classList.remove('dragging');
             }
             draggedProsConsItem = null;
        }

        function handleProsConsDragLeave(ev) {
            if (ev.target.classList.contains('pros-cons-drop-zone') || ev.target.id === 'pros-cons-bank') {
                ev.target.classList.remove('over');
            }
        }

        function handleProsConsDragEnd(ev) {
             if (draggedProsConsItem) {
                draggedProsConsItem.classList.remove('dragging');
                 if (ev.dataTransfer.dropEffect !== 'move' || !draggedProsConsItem.parentElement || (!draggedProsConsItem.parentElement.classList.contains('pros-cons-drop-zone') && draggedProsConsItem.parentElement.id !== 'pros-cons-bank')) {
                     document.getElementById('pros-cons-bank').appendChild(draggedProsConsItem);
                 }
            }
            draggedProsConsItem = null;
        }

        function checkProsCons() {
             const feedbackElement = document.getElementById('proscons-feedback');
             const dropZones = document.querySelectorAll('.pros-cons-drop-zone');
             let correctCount = 0; let incorrectCount = 0;
             const allItems = document.querySelectorAll('.pros-cons-item');

             allItems.forEach(item => item.classList.remove('correct-proscons', 'incorrect-proscons'));
             dropZones.forEach(zone => zone.classList.remove('correct-proscons', 'incorrect-proscons'));

             dropZones.forEach(zone => {
                 const expectedCat = zone.dataset.category;
                 zone.querySelectorAll('.pros-cons-item').forEach(item => {
                     if (item.dataset.correctCategory === expectedCat) {
                         correctCount++;
                         item.classList.add('correct-proscons');
                     } else {
                         incorrectCount++;
                         item.classList.add('incorrect-proscons');
                     }
                 });
                 // Optionally style the zone itself based on content
                 if (zone.querySelector('.incorrect-proscons')) {
                     zone.classList.add('incorrect-proscons');
                 } else if (zone.children.length > 0) { // Only mark green if it has items and none are wrong
                     zone.classList.add('correct-proscons');
                 }
             });


            const itemsInBank = document.querySelectorAll('#pros-cons-bank .pros-cons-item').length;
            const totalItems = allItems.length;
            let feedbackHtml = "";

            if (incorrectCount === 0 && itemsInBank === 0) {
                 feedbackHtml = `<p class="correct-feedback font-semibold"><i class="fas fa-check mr-2"></i>All items categorized correctly!</p>`;
            } else {
                 feedbackHtml = `<p class="incorrect-feedback font-semibold"><i class="fas fa-times mr-2"></i>Some items are in the wrong category or still in the bank.</p>`;
                 feedbackHtml += `<p class="text-sm incorrect-feedback">You correctly placed ${correctCount} items. Check items highlighted in red or remaining in the bank.</p>`;
            }
             feedbackElement.innerHTML = feedbackHtml;
             feedbackElement.classList.add('show');
             updateConditionalButtonState(); // Re-check button state
        }

        function resetProsCons() {
             const bank = document.getElementById('pros-cons-bank');
             const items = document.querySelectorAll('.pros-cons-item');
             items.forEach(item => { item.classList.remove('correct-proscons', 'incorrect-proscons'); bank.appendChild(item); });
             document.querySelectorAll('.pros-cons-drop-zone').forEach(zone => { zone.innerHTML = ''; zone.classList.remove('correct-proscons', 'incorrect-proscons', 'over'); });
             const feedback = document.getElementById('proscons-feedback'); if(feedback) feedback.classList.remove('show');
             updateConditionalButtonState();
         }

         function setupProsConsDragDropListeners() {
             document.querySelectorAll('.pros-cons-item').forEach(item => {
                 item.draggable = true;
                 item.addEventListener('dragstart', dragProsConsItem);
                 item.addEventListener('dragend', handleProsConsDragEnd);
             });
             document.querySelectorAll('.pros-cons-drop-zone, #pros-cons-bank').forEach(zone => {
                 zone.addEventListener('dragover', allowDropProsCons);
                 zone.addEventListener('drop', dropProsConsItem);
                 zone.addEventListener('dragleave', handleProsConsDragLeave);
                 // Add listener to update button state after a drop
                 zone.addEventListener('drop', updateConditionalButtonState);
             });
         }


        // --- Task 5: Fill Blanks ---
        // Function to calculate Levenshtein distance (for spelling forgiveness)
        function levenshteinDistance(a, b) {
            if (a.length === 0) return b.length;
            if (b.length === 0) return a.length;

            const matrix = [];

            for (let i = 0; i <= b.length; i++) {
                matrix[i] = [i];
            }

            for (let j = 0; j <= a.length; j++) {
                matrix[0][j] = j;
            }

            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1, // substitution
                            matrix[i][j - 1] + 1,     // insertion
                            matrix[i - 1][j] + 1      // deletion
                        );
                    }
                }
            }
            return matrix[b.length][a.length];
        }

         const fillBlanksAnswers = { "fill-1": ["embedded"], "fill-2": ["general-purpose", "general purpose"], "fill-3": ["efficient"], "fill-4": ["multitasking"], "fill-5": ["rom", "read only memory"], "fill-6": ["control"] };
         function checkFillBlanksTask5() {
             const feedbackElement = document.getElementById('fill-blanks-feedback'); let allCorrect = true; let feedbackHtml = "<ul>";
             for (const id in fillBlanksAnswers) {
                 const span = document.getElementById(id); const userAnswer = span.textContent.trim().toLowerCase().replace(/\.$/, '');
                 const placeholderText = '[' + span.getAttribute('data-placeholder') + ']'; const actualAnswer = (userAnswer === placeholderText.toLowerCase() || userAnswer === '') ? '' : userAnswer;
                 span.classList.remove('correct-blank', 'incorrect-blank'); const correctAnswers = fillBlanksAnswers[id];

                 let isCorrect = correctAnswers.some(ans => {
                    if (actualAnswer.includes(ans) && ans.length > 0) { // User's answer contains the correct keyword
                        return true;
                    }
                    const distance = levenshteinDistance(actualAnswer, ans);
                    let tolerance = 0;
                    if (ans.length >= 8) { tolerance = 2; }
                    else if (ans.length >= 3) { tolerance = 1; }
                    return distance <= tolerance;
                 });

                 if (isCorrect) {
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
             updateConditionalButtonState(); // Re-check button state
         }
         function resetFillBlanksTask5() {
             const feedbackElement = document.getElementById('fill-blanks-feedback');
             document.querySelectorAll('.fill-blank').forEach(span => {
                 const placeholder = '[' + span.getAttribute('data-placeholder') + ']';
                 span.textContent = placeholder;
                 span.classList.remove('correct-blank', 'incorrect-blank');
             });
             if (feedbackElement) feedbackElement.classList.remove('show');
             updateConditionalButtonState();
         }


        // --- Task 6: Quiz ---
        function checkAnswer(buttonElement, questionIndex) {
            const selectedAnswer = buttonElement.textContent; const questionData = quizData[questionIndex]; const isCorrect = selectedAnswer === questionData.correctAnswer;
            const questionDiv = buttonElement.closest('.quiz-question-container');
            const feedbackElement = questionDiv.querySelector('.quiz-feedback');
            const buttons = questionDiv.querySelectorAll('button');

            // Check if this question has already been marked as answered
            const alreadyAnswered = questionDiv.dataset.answered === 'true';

            buttons.forEach(btn => btn.disabled = true);
             if (!feedbackElement) { console.error("Feedback element not found for question:", questionIndex); return; }
            feedbackElement.classList.remove('hidden', 'correct', 'incorrect', 'text-green-600', 'text-red-600');
            if (isCorrect) {
                buttonElement.classList.add('correct'); feedbackElement.textContent = questionData.feedbackCorrect; feedbackElement.classList.add('correct'); quizScore++;
            } else if (!alreadyAnswered) { // Only mark incorrect and show correct if first attempt was wrong
                buttonElement.classList.add('incorrect'); feedbackElement.textContent = questionData.feedbackIncorrect; feedbackElement.classList.add('incorrect');
                buttons.forEach(btn => { if (btn.textContent === questionData.correctAnswer) { btn.classList.add('correct'); }});
            }
            if (!buttonElement.querySelector('.feedback-icon')) { const iconSpan = document.createElement('span'); iconSpan.className = 'feedback-icon'; buttonElement.appendChild(iconSpan); }
            feedbackElement.classList.add('show');
            // Only increment if the question hasn't been answered before (check if any button is already marked)
            if (!questionDiv.querySelector('button.correct, button.incorrect')) { questionsAnswered++; }
            // Only increment questionsAnswered if it's the first time answering this specific question
            if (!alreadyAnswered) {
                questionsAnswered++;
                questionDiv.dataset.answered = 'true'; // Mark question as answered
            }
            updateScore(); // Update score display regardless
            if (questionsAnswered === totalQuestions) { document.getElementById('reset-quiz-btn').classList.remove('hidden'); } // Show reset when all questions attempted once
        }

        function updateScore() { document.getElementById('score').textContent = quizScore; }

        function loadQuiz() {
            const quizContainer = document.getElementById('quiz-questions'); if (!quizContainer) return; quizContainer.innerHTML = ''; quizScore = 0; questionsAnswered = 0;
            document.getElementById('total-questions').textContent = totalQuestions; updateScore(); const resetButton = document.getElementById('reset-quiz-btn'); if (resetButton) resetButton.classList.add('hidden');
            quizData.forEach((q, index) => {
                const questionElement = document.createElement('div'); questionElement.className = 'mb-6 quiz-question-container'; const questionText = document.createElement('p');
                questionText.className = 'font-semibold mb-3 text-lg text-gray-800';
                questionText.textContent = `${index + 1}. ${q.question}`;
                questionElement.appendChild(questionText);
                questionElement.dataset.answered = 'false'; // Initialize answered flag

                const optionsDiv = document.createElement('div'); optionsDiv.className = 'space-y-2';
                q.options.forEach(option => {
                    const button = document.createElement('button'); button.className = 'quiz-option block w-full text-left p-3 border rounded-md bg-white border-gray-300 hover:border-blue-400';
                    button.textContent = option; button.onclick = () => checkAnswer(button, index); optionsDiv.appendChild(button);
                });
                questionElement.appendChild(optionsDiv); const feedbackPara = document.createElement('p'); feedbackPara.className = 'quiz-feedback hidden'; questionElement.appendChild(feedbackPara);
                quizContainer.appendChild(questionElement);
            });
        }

        // --- Task 7: Exam Practice ---
        function handleExamAnswerInputTask7(event) {
            const textarea = event.target;
            const questionDiv = textarea.closest('.exam-question');
            if (!questionDiv) return;

            const marksText = questionDiv.dataset.marks;
            if (marksText === undefined) {
                console.warn("Exam question div is missing 'data-marks' attribute:", questionDiv);
                return;
            }
            const marks = parseInt(marksText, 10);
            const markSchemeButton = document.getElementById(textarea.dataset.buttonId); // Use data-button-id

            if (isNaN(marks) || !markSchemeButton) {
                console.error("Could not parse marks or find mark scheme button for an exam question.", questionDiv, textarea.dataset.buttonId);
                return;
            }

            const requiredLength = marks * CHARS_PER_MARK_THRESHOLD_TASK7;
            const currentLength = textarea.value.trim().length;

            if (currentLength >= requiredLength) {
                markSchemeButton.disabled = false;
                markSchemeButton.title = "Show the mark scheme";
            } else {
                markSchemeButton.disabled = true;
                markSchemeButton.title = `Type at least ${requiredLength - currentLength} more characters to unlock. (${currentLength}/${requiredLength})`;
            }
        }

        function toggleMarkScheme(markSchemeId) { // Renamed from toggleMarkSchemeTask7 for consistency
            const markSchemeDiv = document.getElementById(markSchemeId);
            if (markSchemeDiv) {
                markSchemeDiv.classList.toggle('show');
                markSchemeDiv.classList.toggle('hidden'); // For Tailwind
            }
        }




         // --- Final Score Calculation & Reset ---
         const MAX_SCORE_CATEGORIZE = 9;
         const MAX_SCORE_EXAMPLES = 6;
         const MAX_SCORE_PROSCONS = 10; // Added for Task 4
         const MAX_SCORE_FILLBLANKS = 6;
         const MAX_SCORE_QUIZ = totalQuestions;
         const TOTAL_MAX_SCORE = MAX_SCORE_CATEGORIZE + MAX_SCORE_EXAMPLES + MAX_SCORE_PROSCONS + MAX_SCORE_FILLBLANKS + MAX_SCORE_QUIZ;

         function getCategoryScore() {
             let score = 0;
             document.querySelectorAll('.category-drop-zone').forEach(zone => {
                 const expectedCat = zone.dataset.category;
                 zone.querySelectorAll('.category-item').forEach(item => {
                     if (item.dataset.correctCategory === expectedCat) { score++; }
                 });
             });
             return score;
         }

         function getExampleScore() {
             let score = 0;
             document.querySelectorAll('.example-option-container').forEach(container => {
                  if (container.dataset.answeredCorrectly === "true") { score++; }
             });
             return score;
         }

         function getProsConsScore() {
             let score = 0;
             document.querySelectorAll('.pros-cons-drop-zone').forEach(zone => {
                 const expectedCat = zone.dataset.category;
                 zone.querySelectorAll('.pros-cons-item').forEach(item => {
                     if (item.dataset.correctCategory === expectedCat) { score++; }
                 });
             });
             return score;
         }


         function getFillBlanksScore() {
             let currentScore = 0;
              for (const id in fillBlanksAnswers) {
                 const span = document.getElementById(id); const userAnswer = span.textContent.trim().toLowerCase().replace(/\.$/, '');
                 const placeholderText = '[' + span.getAttribute('data-placeholder') + ']';
                 const actualAnswer = (userAnswer === placeholderText.toLowerCase() || userAnswer === '') ? '' : userAnswer;
                 const correctAnswers = fillBlanksAnswers[id];
                 if (correctAnswers.includes(actualAnswer)) { currentScore++; }
             }
             return currentScore;
         }

         function calculateTotalScore() {
             const categoryScore = getCategoryScore();
             const exampleScore = getExampleScore();
             const prosConsScore = getProsConsScore();
             const fillBlanksScore = getFillBlanksScore();
             // quizScore is updated globally

             const totalScore = categoryScore + exampleScore + prosConsScore + fillBlanksScore + quizScore;

             const scoreDisplay = document.getElementById('final-score-display');
             const feedbackDisplay = document.getElementById('final-score-feedback');
             const scoreArea = document.getElementById('final-score-area');

             scoreDisplay.textContent = `Your Score: ${totalScore} / ${TOTAL_MAX_SCORE}`;

             let feedbackMessage = "";
             const percentage = (totalScore / TOTAL_MAX_SCORE) * 100;
             if (percentage === 100) { feedbackMessage = "Excellent! You got full marks!"; }
             else if (percentage >= 80) { feedbackMessage = "Great job! You have a strong understanding."; }
             else if (percentage >= 60) { feedbackMessage = "Good effort! Review the tasks you didn't get full marks on."; }
             else { feedbackMessage = "Keep practicing! Review the tasks and definitions to improve your score."; }
             feedbackDisplay.textContent = feedbackMessage;
             scoreArea.style.display = 'block';
         }

         function resetAllTasks() {
             resetCategories();
             resetExamples();
             resetProsCons(); // Added reset for new task
             document.getElementById('args-embedded').value = '';
             document.getElementById('args-general').value = '';
             const revealContent = document.getElementById('smartwatch-points');
             const revealButton = revealContent.previousElementSibling;
             if (revealContent && revealContent.classList.contains('show')) {
                 toggleReveal('smartwatch-points', revealButton, 'Show Comparison Points', 'Hide Comparison Points');
             }
             // Removed logic to hide takeaways on reset
             resetFillBlanksTask5();
             loadQuiz();

            // Reset Task 7 Exam Practice
            document.querySelectorAll('#task7-exam-practice .exam-question').forEach(questionDiv => {
                const textarea = questionDiv.querySelector('.exam-answer-textarea');
                if (textarea) {
                    textarea.value = '';
                    handleExamAnswerInputTask7({ target: textarea }); // Reset button state
                }
                const selfAssessInput = questionDiv.querySelector('.self-assess-input');
                if (selfAssessInput) selfAssessInput.value = '';
                const markSchemeButton = document.getElementById(textarea.dataset.buttonId);
                if (markSchemeButton) document.getElementById(markSchemeButton.dataset.markSchemeId)?.classList.add('hidden');
            });

             const scoreArea = document.getElementById('final-score-area');
             if (scoreArea) {
                 scoreArea.style.display = 'none';
                 document.getElementById('final-score-display').textContent = '';
                 document.getElementById('final-score-feedback').textContent = '';
             }

             document.querySelectorAll('.feedback-area').forEach(el => el.classList.remove('show'));
             document.querySelectorAll('.mark-scheme').forEach(el => {el.classList.remove('show'); el.classList.add('hidden');});
             document.querySelectorAll('.scenario-feedback').forEach(el => el.classList.remove('show', 'correct', 'incorrect'));
             document.querySelectorAll('.exam-question textarea').forEach(ta => ta.value = '');
             updateConditionalButtonState(); // Reset all conditional buttons
         }

        // --- Conditional Button Logic ---
        function updateConditionalButtonState() {
            // Task 1: Categorise
            const catBank = document.getElementById('category-bank');
            const totalCatItems = 9; // Hardcoded based on HTML
            const catBtn = document.getElementById('check-cat-btn');
            if (catBank && catBtn) {
                const itemsInBank = catBank.children.length;
                catBtn.disabled = (totalCatItems - itemsInBank) < MIN_DRAGGED_ITEMS_TASK1;
                catBtn.title = catBtn.disabled ? `Drag at least ${MIN_DRAGGED_ITEMS_TASK1} items out of the bank.` : "Check your categories.";
            }

            // Task 3: Smartwatch Debate
            const argsEmbedded = document.getElementById('args-embedded');
            const argsGeneral = document.getElementById('args-general');
            const smartwatchBtn = document.getElementById('reveal-smartwatch-btn');
            if (argsEmbedded && argsGeneral && smartwatchBtn) {
                const embeddedLength = argsEmbedded.value.trim().length;
                const generalLength = argsGeneral.value.trim().length;
                smartwatchBtn.disabled = (embeddedLength < MIN_CHARS_TASK3 || generalLength < MIN_CHARS_TASK3);
                smartwatchBtn.title = smartwatchBtn.disabled ? `Type at least ${MIN_CHARS_TASK3} characters in each box.` : "Show comparison points.";
            }

            // Task 4: Pros & Cons
            const prosConsBank = document.getElementById('pros-cons-bank');
            const totalProsConsItems = 10; // Hardcoded
            const prosConsBtn = document.getElementById('check-proscons-btn');
            if (prosConsBank && prosConsBtn) {
                const itemsInBank = prosConsBank.children.length;
                prosConsBtn.disabled = (totalProsConsItems - itemsInBank) < MIN_DRAGGED_ITEMS_TASK4;
                prosConsBtn.title = prosConsBtn.disabled ? `Drag at least ${MIN_DRAGGED_ITEMS_TASK4} items out of the bank.` : "Check your pros & cons.";
            }

            // Task 5: Fill Blanks
            const fillBlanksSpansT5 = document.querySelectorAll('#task5-fill-blanks .fill-blank');
            const fillBlanksBtnT5 = document.getElementById('check-fillblanks-t5-btn');
            if (fillBlanksSpansT5.length > 0 && fillBlanksBtnT5) {
                let filledCount = 0;
                fillBlanksSpansT5.forEach(span => {
                    const placeholder = '[' + span.getAttribute('data-placeholder') + ']';
                    if (span.textContent.trim() !== placeholder && span.textContent.trim() !== '') {
                        filledCount++;
                    }
                });
                fillBlanksBtnT5.disabled = filledCount < MIN_FILLED_BLANKS_TASK5;
                fillBlanksBtnT5.title = fillBlanksBtnT5.disabled ? `Fill at least ${MIN_FILLED_BLANKS_TASK5} blanks.` : "Check your answers.";
            }

            // Task 7: Exam Practice (already handled by handleExamAnswerInputTask7)
        }

        function exportToPDF() {
            const element = document.querySelector('.max-w-4xl.mx-auto.bg-white');
            if (!element) {
                alert("Could not find the content to export.");
                return;
            }
            window.scrollTo(0, 0);
            const originalElementStyle = { paddingBottom: element.style.paddingBottom };
            element.style.paddingBottom = '2000px'; // Add temporary padding

            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5], filename: 'gcse-cs-embedded-systems-worksheet.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: true, useCORS: true, scrollY: 0, height: element.scrollHeight + 500, windowHeight: element.scrollHeight },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };
            const exportButton = document.getElementById('export-pdf-btn');
            const resetButton = document.getElementById('reset-all-btn');
            if(exportButton) exportButton.disabled = true;
            if(resetButton) resetButton.disabled = true;

            html2pdf().from(element).set(opt).save().then(function() {
                element.style.paddingBottom = originalElementStyle.paddingBottom; // Restore padding
                if(exportButton) exportButton.disabled = false;
                if(resetButton) resetButton.disabled = false;
            }).catch(function(error) {
                console.error("Error during PDF generation:", error);
                element.style.paddingBottom = originalElementStyle.paddingBottom; // Restore padding
                if(exportButton) exportButton.disabled = false;
                if(resetButton) resetButton.disabled = false;
            });
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

        // --- NEW toggleStarterAnswers Function ---
        // Toggle function specifically for starter answers with encouragement
        function toggleStarterAnswers(contentId, buttonElement, revealText, hideText) {
            console.log("toggleStarterAnswers called for:", contentId); // DEBUG 1
            const content = document.getElementById(contentId);
            const encourageMsg = document.getElementById('starter-encourage-msg');

            // Check if content element exists
            if (!content) { console.error("Starter answers content element not found!"); return; }
            // Check if encouragement message element exists (optional)
            if (!encourageMsg) { console.warn("Starter encourage message element not found!"); }

            console.log("Content currently shown?", content.classList.contains('show')); // DEBUG

            // Check if answers are currently hidden and we should encourage first
            if (!content.classList.contains('show')) {
                const starterInputs = document.querySelectorAll('#starter-recap input[type="text"]');
                let filledCount = 0;
                starterInputs.forEach(input => { if (input.value.trim() !== '') { filledCount++; } });
                console.log("Filled input count:", filledCount); // DEBUG 2

                if (filledCount < 2) { // Encourage if less than 2 fields are filled
                    console.log("Encouraging user to answer first. Stopping reveal."); // DEBUG 3
                    if (encourageMsg) {
                        encourageMsg.textContent = "Try answering a couple of questions yourself first!";
                        setTimeout(() => { if(encourageMsg) encourageMsg.textContent = ''; }, 3000); // Clear message after 3s, added null check
                    }
                    return; // Stop before revealing
                }
            }
            console.log("Proceeding to call toggleReveal for starter"); // DEBUG 4
            // Call the generic toggle function (already exists below)
            toggleReveal(contentId, buttonElement, revealText, hideText);
         }
        // --- END NEW toggleStarterAnswers Function ---

        // Initial setup
        document.addEventListener('DOMContentLoaded', () => {
            addTooltips();
            loadQuiz();
            setupCategoryDragDropListeners(); // Setup listeners for Task 1
            setupProsConsDragDropListeners(); // Setup listeners for Task 4
            resetExamples();
            resetFillBlanksTask5();
            resetProsCons(); // Initial reset for the new task

            const resetButton = document.getElementById('reset-quiz-btn');
            if(resetButton) resetButton.addEventListener('click', loadQuiz);

             document.querySelectorAll('.fill-blank').forEach(span => {
                 const placeholder = '[' + span.getAttribute('data-placeholder') + ']'; span.textContent = placeholder;
                 span.addEventListener('focus', () => { if(span.textContent === placeholder) span.textContent = ''; span.classList.remove('correct-blank', 'incorrect-blank'); });
                 span.addEventListener('blur', () => { if(span.textContent.trim() === '') span.textContent = placeholder; });
                 span.addEventListener('input', updateConditionalButtonState); // For contenteditable
             });

            // Listeners for Task 3 textareas
            document.getElementById('args-embedded')?.addEventListener('input', updateConditionalButtonState);
            document.getElementById('args-general')?.addEventListener('input', updateConditionalButtonState);

            // Setup for Task 7 Exam Practice
            document.querySelectorAll('#task7-exam-practice .exam-answer-textarea').forEach(textarea => {
                textarea.addEventListener('input', handleExamAnswerInputTask7);
                handleExamAnswerInputTask7({ target: textarea }); // Initial check
            });
            document.querySelectorAll('#task7-exam-practice .toggle-mark-scheme-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const markSchemeId = button.dataset.markSchemeId;
                    if (markSchemeId) toggleMarkScheme(markSchemeId);
                });
            });
            document.querySelectorAll('#task7-exam-practice .exam-question').forEach(questionDiv => {
                const marksText = questionDiv.dataset.marks;
                if (marksText === undefined) return;
                const marks = parseInt(marksText, 10);
                const selfAssessInput = questionDiv.querySelector('.self-assess-input');
                if (!isNaN(marks) && selfAssessInput) selfAssessInput.max = marks;
            });

            updateConditionalButtonState(); // Initial check for all buttons
        });