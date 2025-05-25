// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "internet": "A global network of interconnected networks connecting millions of computers, making it possible to exchange information. It is an example of a WAN.",
            "world wide web (www)": "Consists of a collection of resources (like web pages, images, videos) accessible over the internet using protocols like HTTP.",
            "dns (domain name server)": "A server that translates human-readable domain names (e.g., www.google.com) into numerical IP addresses that computers use to locate each other. (Also: DNS finds IP. If DNS cannot find the IP it passes request to higher DNS. If not found return error. IP address sent back to the browser/computer).",
            "hosting": "Storing website files on a web server, making them accessible via the Internet.",
            "web server": "A computer that stores website files and serves them to clients (browsers) upon request.",
            "client": "A device (e.g., computer, smartphone) or software (e.g., web browser) that requests services or resources from a server.",
            "the cloud": "Remote servers and data storage accessed over the Internet, providing services like file storage, software applications, and processing power.",
            "url (uniform resource locator)": "A location or address identifying where documents can be found on the Internet; a Web address. It includes the protocol and the domain name. For example: http:// specifies that the resource requires the http protocol i.e. a web page. www.sky.co.uk/index.html is the fully qualified domain name and the name of the page to be accessed (index.html). The URL is a combination of these http://www.sky.co.uk/index.html",
            "html": "Hypertext Markup Language: Used to create/develop webpages. Uses (opening and closing) tags to display/format content. Defines the structure.",
            "css": "Cascading Style Sheets: Used to describe the presentation (styling, layout, fonts, colours) of a document written in HTML.",
            "javascript": "A programming language commonly used to create interactive effects within web browsers (e.g., animations, form validation, dynamic content updates)."
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
                if (item.dataset.answeredCorrectly !== 'true') allCorrectInTask = false;
                
                const optionsSelected = Array.from(item.querySelectorAll('.option-button.selected')).length > 0;
                const textareaFilled = item.querySelector('textarea') ? item.querySelector('textarea').value.trim() !== '' : false;
                const dropzoneFilled = item.querySelector('.dns-dropzone') ? item.querySelector('.dns-dropzone .dns-step') !== null : false; // Adjusted for DNS sorter
                 const inputFilled = item.querySelector('input[type="text"]') ? item.querySelector('input[type="text"]').value.trim() !== '' : false;


                if (!item.dataset.answered && !optionsSelected && !textareaFilled && !dropzoneFilled && !inputFilled) {
                     allAttemptedInTask = false;
                }
            });

            if (allAttemptedInTask && allCorrectInTask) {
                indicator.innerHTML = '<i class="fas fa-check-circle text-green-500"></i>';
                indicator.classList.add('completed');
            } else {
                indicator.innerHTML = '';
                indicator.classList.remove('completed');
            }
        }
        
        // --- Starter Activity Logic ---
        // Simple reveal for answers.

        // --- Task 1: Define Key Internet Terms ---
        function checkTask1Definitions() {
            const definitions = [
                { id: 'def-isp', keywords: ["provides internet", "access", "connects to internet", "company", "service provider"], points: 1 },
                { id: 'def-webserver', keywords: ["stores website", "hosts files", "serves pages", "responds to requests", "http"], points: 1 },
                { id: 'def-dns', keywords: ["translates domain", "converts url", "ip address", "name to number", "phonebook"], points: 1 },
                { id: 'def-cloud', keywords: ["remote server", "internet storage", "online service", "data center", "access anywhere"], points: 1 }
            ];
            let taskScore = 0;
            let allAttempted = true;
            const feedbackDiv = document.getElementById('task1-feedback');
            let feedbackHtml = "<ul>";

            definitions.forEach(def => {
                const textarea = document.getElementById(def.id);
                const answer = textarea.value.toLowerCase().trim();
                textarea.classList.remove('correct', 'incorrect');
                const quizItem = textarea.closest('.quiz-item');
                if(quizItem) quizItem.dataset.answered = "true";


                if (answer === "") {
                    allAttempted = false;
                    textarea.classList.add('incorrect');
                    feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i><strong>${def.id.replace('def-', '').toUpperCase()}:</strong> Please provide a definition.</li>`;
                     if(quizItem) quizItem.dataset.answeredCorrectly = "false";
                } else if (def.keywords.some(kw => answer.includes(kw))) {
                    textarea.classList.add('correct');
                    feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i><strong>${def.id.replace('def-', '').toUpperCase()}:</strong> Good definition!</li>`;
                    taskScore += def.points;
                    if(quizItem) quizItem.dataset.answeredCorrectly = "true";
                } else {
                    textarea.classList.add('incorrect');
                    feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i><strong>${def.id.replace('def-', '').toUpperCase()}:</strong> Definition could be more accurate. Hint: include terms like '${def.keywords[0]}'.</li>`;
                    if(quizItem) quizItem.dataset.answeredCorrectly = "false";
                }
            });
            feedbackHtml += "</ul>";

            if (!allAttempted) {
                alert("Please attempt to define all terms before checking.");
                return;
            }
            
            feedbackDiv.innerHTML = `<p class="font-semibold ${taskScore === definitions.length ? 'correct-feedback' : 'incorrect-feedback'}">You scored ${taskScore}/${definitions.length} for definitions.</p>${feedbackHtml}`;
            feedbackDiv.classList.add('show');
            checkTaskCompletion('task1-definitions');
            if(scoreCalculated) calculateScore();
        }
        function resetTask1Definitions() {
            ['def-isp', 'def-webserver', 'def-dns', 'def-cloud'].forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    el.value = '';
                    el.classList.remove('correct', 'incorrect');
                    const quizItem = el.closest('.quiz-item');
                    if(quizItem) {quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered;}
                }
            });
            const feedbackDiv = document.getElementById('task1-feedback');
            if(feedbackDiv) feedbackDiv.classList.remove('show');
            checkTaskCompletion('task1-definitions');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 2: Web Page Journey (DNS Sorter) ---
        let draggedDnsStep = null;
        const dnsStepsPool = document.getElementById('dns-steps-pool');
        const dnsOrderedSteps = document.getElementById('dns-ordered-steps');
        const correctDnsOrder = ["step-type-url", "step-dns-lookup", "step-dns-returns-ip", "step-browser-requests", "step-server-processes", "step-server-sends", "step-browser-renders"];

        function setupDnsJourneySorter() {
            const pool = document.getElementById('dns-steps-pool');
            const orderedZone = document.getElementById('dns-ordered-steps');
            if(!pool || !orderedZone) return;

            pool.querySelectorAll('.dns-step').forEach(step => {
                step.draggable = true;
                step.addEventListener('dragstart', e => {
                    draggedDnsStep = e.target;
                    setTimeout(() => e.target.classList.add('dragging'), 0);
                });
                step.addEventListener('dragend', e => {
                    setTimeout(() => e.target.classList.remove('dragging'), 0);
                    draggedDnsStep = null;
                });
            });

            orderedZone.addEventListener('dragover', e => { e.preventDefault(); orderedZone.classList.add('dragover'); });
            orderedZone.addEventListener('dragleave', e => orderedZone.classList.remove('dragover'));
            orderedZone.addEventListener('drop', e => {
                e.preventDefault();
                orderedZone.classList.remove('dragover');
                if (draggedDnsStep) {
                    // Allow appending to the end of the ordered list
                    // Find the first placeholder and replace it, or append if no placeholders
                    const placeholder = orderedZone.querySelector('.h-10.text-gray-400');
                    if (placeholder) {
                        orderedZone.insertBefore(draggedDnsStep, placeholder);
                        placeholder.remove(); // Remove the placeholder that was just filled
                    } else {
                         orderedZone.appendChild(draggedDnsStep); // Append if no placeholders left
                    }
                }
            });
            // Allow dropping back to pool
            pool.addEventListener('dragover', e => e.preventDefault());
            pool.addEventListener('drop', e => {
                e.preventDefault();
                if (draggedDnsStep) {
                    pool.appendChild(draggedDnsStep);
                }
            });
        }

        function checkDnsJourney() {
            const orderedStepsContainer = document.getElementById('dns-ordered-steps');
            const feedbackDiv = document.getElementById('dns-journey-feedback');
            const quizItem = orderedStepsContainer.closest('.quiz-item');
            if(!orderedStepsContainer || !feedbackDiv || !quizItem) return;

            const placedSteps = Array.from(orderedStepsContainer.querySelectorAll('.dns-step'));
            let correctOrderCount = 0;
            
            // Check if all steps have been moved from the pool
            const pool = document.getElementById('dns-steps-pool');
            const stepsInPool = pool.querySelectorAll('.dns-step').length;
            if (stepsInPool > 0) {
                alert("Please drag all steps from the pool to the 'Correct Order' box before checking.");
                return;
            }
            
            let allAttempted = placedSteps.length === correctDnsOrder.length;


            placedSteps.forEach((step, index) => {
                step.classList.remove('correct', 'incorrect');
                if (index < correctDnsOrder.length && step.id === correctDnsOrder[index]) {
                    step.classList.add('correct');
                    correctOrderCount++;
                } else {
                    step.classList.add('incorrect');
                }
            });

            quizItem.dataset.answered = "true";
            if (correctOrderCount === correctDnsOrder.length && allAttempted) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">Correct order! Well done! (+${quizItem.dataset.points} points)</p>`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Not quite the right order. You got ${correctOrderCount}/${correctDnsOrder.length} steps correct. Review the red items and try again.</p>`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            feedbackDiv.classList.add('show');
            checkTaskCompletion('task2-webpage-journey');
            if(scoreCalculated) calculateScore();
        }

        function resetDnsJourney() {
            const pool = document.getElementById('dns-steps-pool');
            const orderedZone = document.getElementById('dns-ordered-steps');
            const feedbackDiv = document.getElementById('dns-journey-feedback');
            const quizItem = orderedZone.closest('.quiz-item');

            if(!pool || !orderedZone) return;

            // Move all steps back to the pool
            orderedZone.querySelectorAll('.dns-step').forEach(step => {
                step.classList.remove('correct', 'incorrect');
                pool.appendChild(step); // Append after the H4
            });
             // Restore placeholders in ordered zone
            orderedZone.innerHTML = ` 
                <div class="h-10 text-gray-400 italic flex items-center justify-center">Drop Step 1 here</div>
                <div class="h-10 text-gray-400 italic flex items-center justify-center">Drop Step 2 here</div>
                <div class="h-10 text-gray-400 italic flex items-center justify-center">Drop Step 3 here</div>
                <div class="h-10 text-gray-400 italic flex items-center justify-center">Drop Step 4 here</div>
                <div class="h-10 text-gray-400 italic flex items-center justify-center">Drop Step 5 here</div>
                <div class="h-10 text-gray-400 italic flex items-center justify-center">Drop Step 6 here</div>
                <div class="h-10 text-gray-400 italic flex items-center justify-center">Drop Step 7 here</div>`;

            if(feedbackDiv) feedbackDiv.classList.remove('show');
            if(quizItem) {quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered;}
            checkTaskCompletion('task2-webpage-journey');
            if(scoreCalculated) calculateScore();
        }

        // --- Task 3: URL Anatomy ---
        function checkURLAnatomy() {
            const feedbackDiv = document.getElementById('url-anatomy-feedback');
            const quizItem = feedbackDiv.closest('.quiz-item');
            let correctCount = 0;
            const answers = {
                "label-protocol": "protocol",
                "label-domain": "domain name", 
                "label-path": "path" 
            };
            let feedbackHtml = "<ul>";
            let allAttempted = true;

            for (const id in answers) {
                const inputEl = document.getElementById(id);
                const userAnswer = inputEl.value.toLowerCase().trim();
                inputEl.classList.remove('correct', 'incorrect');
                if (userAnswer === "") allAttempted = false;

                if (userAnswer.includes(answers[id].split(' ')[0])) { 
                    inputEl.classList.add('correct');
                    feedbackHtml += `<li class="correct-feedback"><i class="fas fa-check mr-1"></i>${id.replace('label-','').toUpperCase()}: Correct!</li>`;
                    correctCount++;
                } else if (userAnswer !== ""){
                    inputEl.classList.add('incorrect');
                    feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>${id.replace('label-','').toUpperCase()}: Incorrect. Expected something like '${answers[id]}'.</li>`;
                } else {
                     inputEl.classList.add('incorrect');
                     feedbackHtml += `<li class="incorrect-feedback"><i class="fas fa-times mr-1"></i>${id.replace('label-','').toUpperCase()}: Not answered. Expected something like '${answers[id]}'.</li>`;
                }
            }
            feedbackHtml += "</ul>";
            
            if (!allAttempted) {
                alert("Please attempt to label all parts of the URL.");
                return;
            }

            quizItem.dataset.answered = "true";
            if (correctCount === Object.keys(answers).length) {
                feedbackDiv.innerHTML = `<p class="correct-feedback font-semibold">All URL parts correctly labeled! (+${quizItem.dataset.points} points)</p>${feedbackHtml}`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                feedbackDiv.innerHTML = `<p class="incorrect-feedback font-semibold">Some labels are incorrect. You got ${correctCount}/${Object.keys(answers).length}.</p>${feedbackHtml}`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            feedbackDiv.classList.add('show');
            checkTaskCompletion('task3-url-anatomy');
            if(scoreCalculated) calculateScore();
        }
        function resetURLAnatomy() {
            ['label-protocol', 'label-domain', 'label-path'].forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    el.value = '';
                    el.classList.remove('correct', 'incorrect');
                }
            });
            const feedbackDiv = document.getElementById('url-anatomy-feedback');
            if(feedbackDiv) feedbackDiv.classList.remove('show');
            const quizItem = document.querySelector('#task3-url-anatomy .quiz-item');
            if(quizItem) {quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered;}
            checkTaskCompletion('task3-url-anatomy');
            if(scoreCalculated) calculateScore();
        }


        // --- Task 4: Web Page Components Matching ---
        let selectedWebTechTerm = null;
        let selectedWebTechDef = null;
        let webTechMatchesMade = {};
        
        function setupWebTechMatching() {
            const termList = document.getElementById('webtech-term-list');
            const defList = document.getElementById('webtech-definition-list');
            const feedbackEl = document.getElementById('webtech-matching-feedback');
            if (!termList || !defList) return;

            selectedWebTechTerm = null; selectedWebTechDef = null; webTechMatchesMade = {};
            
            // Clone and replace to remove old listeners, then re-add
            Array.from(termList.children).forEach(item => {
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                newItem.classList.remove('selected', 'correct', 'incorrect', 'disabled'); newItem.disabled = false; 
                newItem.addEventListener('click', () => handleWebTechMatchClick(newItem, 'term'));
            });
            Array.from(defList.children).forEach(item => {
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                newItem.classList.remove('selected', 'correct', 'incorrect', 'disabled'); newItem.disabled = false; 
                newItem.addEventListener('click', () => handleWebTechMatchClick(newItem, 'definition'));
            });
            
            for (let i = defList.children.length; i >= 0; i--) { // Shuffle definitions
                defList.appendChild(defList.children[Math.random() * i | 0]);
            }

            if(feedbackEl) feedbackEl.classList.remove('show');
            const quizItem = termList.closest('.quiz-item');
            if(quizItem) {quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered;}
        }

        function handleWebTechMatchClick(item, type) {
            if (item.disabled) return;
            if (type === 'term') {
                if (selectedWebTechTerm) selectedWebTechTerm.classList.remove('selected');
                selectedWebTechTerm = item; item.classList.add('selected');
            } else {
                if (selectedWebTechDef) selectedWebTechDef.classList.remove('selected');
                selectedWebTechDef = item; item.classList.add('selected');
            }
            if (selectedWebTechTerm && selectedWebTechDef) attemptWebTechMatch();
        }

        function attemptWebTechMatch() {
            const termMatchId = selectedWebTechTerm.dataset.match;
            const defMatchId = selectedWebTechDef.dataset.match;

            selectedWebTechTerm.classList.remove('selected'); selectedWebTechDef.classList.remove('selected');

            if (termMatchId === defMatchId) {
                selectedWebTechTerm.classList.add('correct'); selectedWebTechDef.classList.add('correct');
                selectedWebTechTerm.disabled = true; selectedWebTechDef.disabled = true;
                webTechMatchesMade[termMatchId] = true;
            } else {
                selectedWebTechTerm.classList.add('incorrect'); selectedWebTechDef.classList.add('incorrect');
                setTimeout(() => {
                    if (selectedWebTechTerm && !selectedWebTechTerm.classList.contains('correct')) selectedWebTechTerm.classList.remove('incorrect');
                    if (selectedWebTechDef && !selectedWebTechDef.classList.contains('correct')) selectedWebTechDef.classList.remove('incorrect');
                }, 800);
            }
            selectedWebTechTerm = null; selectedWebTechDef = null;
        }

        function checkWebTechMatches() {
            const feedbackEl = document.getElementById('webtech-matching-feedback');
            const termListEl = document.getElementById('webtech-term-list');
            if (!termListEl || !feedbackEl) return;

            const totalPairs = termListEl.children.length;
            const correctMatches = Object.keys(webTechMatchesMade).length;
             let allAttempted = true;
            termListEl.querySelectorAll('.matching-item').forEach(term => {
                if(!term.disabled) allAttempted = false;
                if (!term.classList.contains('correct') && term.disabled === false) term.classList.add('incorrect');
            });
            document.getElementById('webtech-definition-list').querySelectorAll('.matching-item').forEach(def => {
                if (!def.classList.contains('correct') && def.disabled === false) def.classList.add('incorrect');
            });

            if (!allAttempted && totalPairs > 0) {
                alert("Please attempt to match all web technologies before checking.");
                return;
            }

            const quizItem = termListEl.closest('.quiz-item');
            if (correctMatches === totalPairs) {
                feedbackEl.innerHTML = `<p class="correct-feedback font-semibold">All technologies matched correctly! (+${quizItem.dataset.points} points)</p>`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                feedbackEl.innerHTML = `<p class="incorrect-feedback font-semibold">Some technologies are mismatched. You got ${correctMatches}/${totalPairs} correct. Check red items.</p>`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            feedbackEl.classList.add('show');
            quizItem.dataset.answered = "true";
            checkTaskCompletion('task4-webpage-components');
            if(scoreCalculated) calculateScore();
        }
        function resetWebTechMatches() {
            setupWebTechMatching();
            checkTaskCompletion('task4-webpage-components');
             if(scoreCalculated) calculateScore();
        }

        // --- Task 5: Cloud Services Quiz ---
        document.querySelectorAll('#task5-cloud-services .option-button').forEach(button => {
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
                    feedbackEl.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
                    feedbackEl.className = 'feedback incorrect';
                    quizItem.dataset.answeredCorrectly = "false";
                    options.forEach(opt => { if (opt.dataset.answer === correctAnswer) opt.classList.add('correct'); });
                }
                checkTaskCompletion('task5-cloud-services');
                if(scoreCalculated) calculateScore();
            });
        });
        function resetCloudProsCons() {
            document.querySelectorAll('#task5-cloud-services .quiz-item').forEach(quizItem => {
                quizItem.querySelectorAll('.option-button').forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = false;
                });
                const feedbackEl = quizItem.querySelector('.feedback');
                if(feedbackEl) feedbackEl.textContent = '';
                quizItem.dataset.answeredCorrectly = "false";
                delete quizItem.dataset.answered;
            });
            checkTaskCompletion('task5-cloud-services');
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
                if (item.closest('#starter-activity') || item.closest('#exam-practice')) return;

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
            else if (percentage >= 80) feedbackMessage = "Great job! Strong understanding of internet concepts.";
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
            document.getElementById('starter-q1-internet').value = '';
            document.getElementById('starter-q2-www').value = '';
            document.getElementById('starter-q3-webprocess').value = '';
            const starterFeedback = document.getElementById('starter-internet-answers-feedback');
            if (starterFeedback && starterFeedback.classList.contains('show')) {
                toggleReveal('starter-internet-answers-feedback', starterFeedback.previousElementSibling, 'Reveal Example Answers', 'Hide Example Answers');
            }
            // Reset Tasks
            resetTask1Definitions();
            resetDnsJourney();
            resetURLAnatomy();
            resetWebTechMatches();
            resetCloudProsCons();

            // Reset Exam Practice
            document.querySelectorAll('#exam-practice textarea, #exam-practice input[type="text"]').forEach(ta => ta.value = '');
            document.querySelectorAll('#exam-practice .mark-scheme').forEach(ms => {
                if (ms.classList.contains('show')) {
                    const button = ms.previousElementSibling; 
                    if (button && button.classList.contains('mark-scheme-button')) {
                         toggleReveal(ms.id, button, 'Show Mark Scheme', 'Hide Mark Scheme');
                    } else { 
                        ms.classList.remove('show');
                        const btnForMs = document.querySelector(`.mark-scheme-button[onclick*="${ms.id}"]`);
                        if(btnForMs) btnForMs.textContent = 'Show Mark Scheme';
                    }
                }
            });
             document.querySelectorAll('#exam-practice .mark-scheme-button').forEach(btn => btn.textContent = 'Show Mark Scheme');

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
                filename:     'gcse-cs-internet-dns-cloud-worksheet.pdf',
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
            setupDnsJourneySorter(); // For Task 2
            setupWebTechMatching(); // For Task 4

            // Generic quiz handler for simple option buttons (Task 5 Cloud)
            document.querySelectorAll('.quiz-item .option-button').forEach(button => {
                if (!button.closest('#task2-webpage-journey .dns-step') && 
                    !button.closest('#task4-webpage-components .matching-item') 
                   ) {
                    button.addEventListener('click', () => {
                        const quizItem = button.closest('.quiz-item');
                        if (quizItem && quizItem.dataset.answered === 'true') return; 

                        const options = quizItem.querySelectorAll('.option-button');
                        options.forEach(opt => {
                            opt.classList.remove('selected'); 
                            opt.disabled = true; 
                        });
                        button.classList.add('selected');
                        quizItem.dataset.answered = "true";

                        const correctAnswer = quizItem.dataset.correct;
                        const selectedAnswer = button.dataset.answer;
                        const feedbackEl = quizItem.querySelector('.feedback');

                        if (selectedAnswer === correctAnswer) {
                            button.classList.add('correct');
                            if(feedbackEl) {feedbackEl.textContent = 'Correct!'; feedbackEl.className = 'feedback correct';}
                            quizItem.dataset.answeredCorrectly = "true";
                        } else {
                            button.classList.add('incorrect');
                            if(feedbackEl) {feedbackEl.textContent = `Incorrect.`; feedbackEl.className = 'feedback incorrect';} 
                            quizItem.dataset.answeredCorrectly = "false";
                            options.forEach(opt => { if (opt.dataset.answer === correctAnswer) opt.classList.add('correct'); });
                        }
                        const sectionId = quizItem.closest('section')?.id;
                        if(sectionId) checkTaskCompletion(sectionId);
                        if(scoreCalculated) calculateScore();
                    });
                }
            });
            
            document.querySelectorAll('.read-checkbox').forEach(checkbox => { 
                checkbox.addEventListener('change', (event) => {
                    console.log(`Section read status changed for: ${event.target.closest('section').id}`);
                });
            });
            
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#starter-activity') || item.closest('#exam-practice')) return;
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            const totalPossibleScoreValEl = document.getElementById('total-possible-score-value');
            if(totalPossibleScoreValEl) totalPossibleScoreValEl.textContent = totalPossibleScore;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf').addEventListener('click', exportToPDF);
        });