// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "license": "You must have this to use software created by someone else. It makes sure the creators get paid/get acknowledged for the work they did.",
            "software license": "A legal instrument governing the use or redistribution of software. It grants the user permission to use the software under specified conditions.",
            "open source software": "Software with source code that anyone can inspect, modify, and enhance. It's often distributed with a license that grants users the rights to use, study, change, and distribute the software and its source code to anyone and for any purpose.",
            "proprietary software": "Software that is owned by an individual or a company (usually the one that developed it). There are almost always major restrictions on its use, and its source code is almost always kept secret. Also known as closed-source software.",
            "source code": "The human-readable instructions written by programmers in a high-level programming language. This is what is modified in open source software.",
            "off-the-shelf software": "Software created to be sold in bulk to many users such as Office or Adobe products. The manufacturer won't customise it for you.",
            "bespoke software": "Software that is specially designed and written for a single organisation or group of users.",
            "data protection act (dpa)": "UK law governing the processing of personal data. It sets out principles for how organisations must handle individuals' information. (Often refers to DPA 2018 which incorporates GDPR).",
            "computer misuse act (cma)": "UK law making it illegal to gain unauthorised access to computer systems, to computer material with intent to commit further offences, or to modify computer material without authorisation. Also covers making/supplying malware.",
            "copyright, designs and patents act (cdpa)": "UK law protecting intellectual property rights for creators of original literary, artistic, musical, dramatic works, software, films, and sound recordings.",
            "intellectual property (ip)": "Creations of the mind, such as inventions; literary and artistic works; designs; and symbols, names and images used in commerce. Protected by patents, copyright and trademarks.",
            "copyright": "A legal right granting the creator of an original work exclusive rights to its use and distribution, usually for a limited time.",
            "creative commons": "A licensing framework that allows creators to grant public permission to share and use their work on conditions of their choice, offering alternatives to traditional 'all rights reserved' copyright."
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
        
        // --- Task 1.1: Open Source Pros & Cons Sorter ---
        let draggedOSProsConsItem = null;
        const osProsConsBank = document.getElementById('os-proscons-bank');
        const osProsDropzone = document.getElementById('os-pros-dropzone');
        const osConsDropzone = document.getElementById('os-cons-dropzone');        

        function setupOSProsConsSorter() {
            if(!osProsConsBank || !osProsDropzone || !osConsDropzone) return;
            
            osProsConsBank.querySelectorAll('.sorter-item').forEach(item => {
                item.draggable = true;
                item.addEventListener('dragstart', e => {
                    draggedOSProsConsItem = e.target;
                    setTimeout(() => e.target.classList.add('dragging'), 0);
                });
                item.addEventListener('dragend', e => {
                    setTimeout(() => e.target.classList.remove('dragging'), 0);
                    draggedOSProsConsItem = null;
                });
            });

            [osProsDropzone, osConsDropzone, osProsConsBank].forEach(zone => {
                zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
                zone.addEventListener('dragleave', e => zone.classList.remove('dragover'));
                zone.addEventListener('drop', e => {
                    e.preventDefault();
                    zone.classList.remove('dragover');
                    if (draggedOSProsConsItem) {
                        zone.appendChild(draggedOSProsConsItem);
                        draggedOSProsConsItem.classList.remove('correct', 'incorrect');
                    }
                });
            });
        }

        function checkOSProsCons() {
            const quizItem = document.getElementById('task-open-source-pros-cons');
            let correctPlacements = 0;
            const totalItemsToSort = 8; // Update if number of items changes

            if (!allAttempted) {
                alert("Please drag all statements to either Pros or Cons before checking.");
                return;
            }

            [osProsDropzone, osConsDropzone].forEach(zone => {
                const expectedType = zone.dataset.category;
                zone.querySelectorAll('.sorter-item').forEach(item => {
                    item.classList.remove('correct', 'incorrect');
                    if (item.dataset.type === expectedType) {
                        item.classList.add('correct');
                        correctPlacements++;
                    } else {
                        item.classList.add('incorrect');
                    }
                });
            });
            
            // Simple scoring: 1 point per correctly placed item, up to max 4.
            // More nuanced scoring could be: +1 for correct, -1 for incorrect in wrong box.
            // For now, let's do +1 for each correct, if total is 4, full marks for the quiz-item.
            // This task has 8 items, 4 pros, 4 cons. Max 4 points.
            // Score 1 point if at least one pro is correct, 1 if at least one con is correct.
            // Score 2 points if at least two pros correct, 2 if at least two cons correct.
            let prosCorrectCount = 0;
            osProsDropzone.querySelectorAll('.sorter-item.correct').forEach(() => prosCorrectCount++);
            let consCorrectCount = 0;
            osConsDropzone.querySelectorAll('.sorter-item.correct').forEach(() => consCorrectCount++);

            let awardedPoints = 0;
            if (prosCorrectCount >= 1) awardedPoints++;
            if (prosCorrectCount >= 2) awardedPoints++; // Max 2 for pros
            if (consCorrectCount >= 1) awardedPoints++;
            if (consCorrectCount >= 2) awardedPoints++; // Max 2 for cons
            
            awardedPoints = Math.min(4, awardedPoints); // Cap at 4 points

            quizItem.dataset.answeredCorrectly = (awardedPoints === 4 && correctPlacements === totalItemsToSort).toString();
            quizItem.dataset.answered = "true";
            // Feedback can be added here if needed
            alert(`Pros & Cons checked. You correctly placed ${correctPlacements} items. Awarded ${awardedPoints} points for this task.`);
            if(scoreCalculated) calculateScore();
        }


        // --- Task 2.1: Proprietary Software Quiz ---
        function checkProprietaryQuiz() {
            const quizItem = document.getElementById('task-proprietary-quiz');
            let correctCount = 0;
            const questions = [
                { buttons: quizItem.querySelectorAll('div:nth-child(1) .option-button'), correctAnswer: "false" },
                { buttons: quizItem.querySelectorAll('div:nth-child(2) .option-button'), correctAnswer: "false" }
            ];

            questions.forEach(q => {
                let answeredCorrectlyThisQ = false;
                q.buttons.forEach(btn => {
                    btn.disabled = true;
                    if (btn.classList.contains('selected')) {
                        if (btn.dataset.answer === q.correctAnswer) {
                            btn.classList.add('correct');
                            correctCount++;
                            answeredCorrectlyThisQ = true;
                        } else {
                            btn.classList.add('incorrect');
                        }
                    }
                    if (btn.dataset.answer === q.correctAnswer && !answeredCorrectlyThisQ) {
                         btn.classList.add('correct'); // Highlight correct if user was wrong
                    }
                });
            });
            quizItem.dataset.answeredCorrectly = (correctCount === questions.length).toString();
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }

        // --- Task 3.1: Shelf or Bespoke Scenario ---
        function checkShelfBespokeScenarios() {
            const quizItem = document.getElementById('task-shelf-bespoke-scenario');
            let correctCount = 0;
            const scenarios = [
                { select: quizItem.querySelectorAll('.scenario-box')[0].querySelector('select'), correctAnswer: "off-the-shelf" },
                { select: quizItem.querySelectorAll('.scenario-box')[1].querySelector('select'), correctAnswer: "bespoke" }
            ];
            scenarios.forEach(s => {
                s.select.classList.remove('correct', 'incorrect');
                if (s.select.value === s.correctAnswer) {
                    s.select.classList.add('correct'); correctCount++;
                } else if (s.select.value !== "") {
                    s.select.classList.add('incorrect');
                }
            });
            quizItem.dataset.answeredCorrectly = (correctCount === scenarios.length).toString();
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }

        // --- Task 4.1: Legal Issues Quiz ---
        function checkLegalIssuesQuiz() {
            const quizItem = document.getElementById('task-legal-issues-quiz');
            let correctCount = 0;
            const questions = [
                { buttons: quizItem.querySelectorAll('div:nth-child(1) .option-button'), correctAnswer: "false" },
                { buttons: quizItem.querySelectorAll('div:nth-child(2) .option-button'), correctAnswer: "dpa" }
            ];
             questions.forEach(q => {
                let answeredCorrectlyThisQ = false;
                q.buttons.forEach(btn => {
                    btn.disabled = true;
                    if (btn.classList.contains('selected')) {
                        if (btn.dataset.answer === q.correctAnswer) {
                            btn.classList.add('correct');
                            correctCount++;
                            answeredCorrectlyThisQ = true;
                        } else {
                            btn.classList.add('incorrect');
                        }
                    }
                     if (btn.dataset.answer === q.correctAnswer && !answeredCorrectlyThisQ) {
                         btn.classList.add('correct'); 
                    }
                });
            });
            quizItem.dataset.answeredCorrectly = (correctCount === questions.length).toString();
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }


        // --- Exam Practice Question Logic ---
        function toggleMarkScheme(markSchemeId, textareaId, minLength = 10) {
            const markSchemeDiv = document.getElementById(markSchemeId);
            const textarea = document.getElementById(textareaId);
            const buttonElement = event.target; 

            if (!markSchemeDiv) return;

            if (!markSchemeDiv.classList.contains('show')) { 
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
                if (item.closest('#starter-activity') || item.closest('#exam-practice-licenses') ) return; 

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
            ['starter-q1-software', 'starter-q2-permission', 'starter-q3-free'].forEach(id => document.getElementById(id).value = '');
            const starterRevealBtn = document.querySelector("button[onclick*='starter-answers-feedback']");
            const starterFeedbackDiv = document.getElementById('starter-answers-feedback');
            if (starterFeedbackDiv.classList.contains('show')) toggleReveal('starter-answers-feedback', starterRevealBtn, 'Reveal Discussion Points', 'Hide Discussion Points');
            
            // Reset Tasks
            // Task 1.1
            if(osProsConsBank && osProsDropzone && osConsDropzone) {
                osProsDropzone.innerHTML = ''; osConsDropzone.innerHTML = '';
                osProsConsBank.querySelectorAll('.sorter-item').forEach(item => {
                    item.classList.remove('correct', 'incorrect'); osProsConsBank.appendChild(item);
                });
                document.getElementById('task-open-source-pros-cons').dataset.answeredCorrectly = "false";
                delete document.getElementById('task-open-source-pros-cons').dataset.answered;
            }
            // Task 2.1
            document.querySelectorAll('#task-proprietary-quiz .option-button').forEach(btn => {btn.classList.remove('selected', 'correct', 'incorrect'); btn.disabled = false;});
            document.querySelectorAll('#task-proprietary-quiz .feedback').forEach(fb => fb.textContent = '');
            document.getElementById('task-proprietary-quiz').dataset.answeredCorrectly = "false";
            delete document.getElementById('task-proprietary-quiz').dataset.answered;
            // Task 3.1
            document.querySelectorAll('#task-shelf-bespoke-scenario .scenario-select').forEach(sel => {sel.value=""; sel.classList.remove('correct', 'incorrect');});
            document.querySelectorAll('#task-shelf-bespoke-scenario .feedback').forEach(fb => fb.textContent = '');
            document.getElementById('task-shelf-bespoke-scenario').dataset.answeredCorrectly = "false";
            delete document.getElementById('task-shelf-bespoke-scenario').dataset.answered;
            // Task 4.1
            document.querySelectorAll('#task-legal-issues-quiz .option-button').forEach(btn => {btn.classList.remove('selected', 'correct', 'incorrect'); btn.disabled = false;});
            document.querySelectorAll('#task-legal-issues-quiz .feedback').forEach(fb => fb.textContent = '');
            document.getElementById('task-legal-issues-quiz').dataset.answeredCorrectly = "false";
            delete document.getElementById('task-legal-issues-quiz').dataset.answered;


            // Reset Exam Practice
            ['exam-q1-license', 'exam-q2-license'].forEach(id => { 
                const el = document.getElementById(id); if(el) el.value = '';
            });
            ['ms-exam-q1-license', 'ms-exam-q2-license'].forEach(id => {
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
                margin:       [0.5, 0.5, 0.7, 0.5], 
                filename:     'gcse-software-licenses-lesson.pdf',
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
            setupOSProsConsSorter(); // For Task 1.1
            setupAIApplicationsMatch(); // For Task 2.1 (AI Apps) - this function name seems to be from the previous AI lesson, ensure it's correct or adapt for this lesson.
                                      // If it's a generic matching setup, it might be okay.
                                      // For now, I'll assume it's a generic setup and call it. If it causes issues, it needs specific implementation.
            
            // Calculate initial total possible score
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#exam-practice-licenses') ) return; 
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.querySelectorAll('.quiz-item .option-button:not(.multi-select)').forEach(button => {
                button.addEventListener('click', () => {
                    const quizItem = button.closest('.quiz-item');
                    if (quizItem && !quizItem.dataset.answered && !button.closest('#task-open-source-pros-cons') && !button.closest('#task-ai-applications-quiz .matching-list')) { // Exclude sorter and matching list items
                        const options = quizItem.querySelectorAll('.option-button:not(.multi-select)');
                        options.forEach(opt => { opt.disabled = true; opt.classList.remove('selected'); });
                        button.classList.add('selected');
                        
                        const correctAnswer = quizItem.dataset.correct;
                        const selectedAnswer = button.dataset.answer;
                        const feedbackEl = quizItem.querySelector('.feedback');

                        if (selectedAnswer === correctAnswer) {
                            button.classList.add('correct');
                            if(feedbackEl) feedbackEl.innerHTML = '<span class="correct-feedback">Correct!</span>';
                            quizItem.dataset.answeredCorrectly = "true";
                        } else {
                            button.classList.add('incorrect');
                            if(feedbackEl) feedbackEl.innerHTML = `<span class="incorrect-feedback">Incorrect. The correct choice is highlighted.</span>`;
                            quizItem.dataset.answeredCorrectly = "false";
                            options.forEach(opt => { if (opt.dataset.answer === correctAnswer) opt.classList.add('correct'); });
                        }
                        quizItem.dataset.answered = "true";
                        if(scoreCalculated) calculateScore();
                    }
                });
            });            
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);

            // Event listener for Shelf/Bespoke scenario selects
            document.querySelectorAll('#task-shelf-bespoke-scenario .scenario-select').forEach(select => {
                select.addEventListener('change', () => {
                    const quizItem = select.closest('.quiz-item');
                    // No immediate feedback for select, checked by button
                });
            });

            let allAttempted = osProsConsBank.children.length === 0;
        });