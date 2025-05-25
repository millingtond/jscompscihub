// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "data protection act (dpa)": "UK law governing the processing of personal data. It sets out principles for how organisations must handle individuals' information. (Often refers to DPA 2018 which incorporates GDPR).",
            "personal data": "Information relating to an identifiable living individual. Examples include name, address, email, medical records, online identifiers.",
            "data controller": "A person or organisation that determines the purposes and means of processing personal data.",
            "data processor": "A person or organisation that processes personal data on behalf of a data controller.",
            "ico (information commissioner's office)": "The UK's independent authority set up to uphold information rights in the public interest, promoting openness by public bodies and data privacy for individuals.",
            "computer misuse act (cma)": "UK law making it illegal to gain unauthorised access to computer systems, to computer material with intent to commit further offences, or to modify computer material without authorisation. Also covers making/supplying malware.",
            "unauthorised access": "Gaining access to a computer system, program, or data without permission from the owner or a legitimate user.",
            "hacking": "The act of gaining unauthorised access to computer systems or networks.",
            "malware": "Malicious software designed to disrupt, damage, or gain unauthorized access to a computer system (e.g., viruses, worms, ransomware, spyware).",
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
        
        // --- Task 1.1: DPA Scenarios ---
        const dpaScenarioAnswers = {
            scenarioA: "yes", // Selling data without consent
            scenarioB: "no",  // Secure storage, authorized access
            scenarioC: "yes", // Storing sensitive data insecurely
            scenarioD: "no"   // Fulfilling a subject access request
        };

        function checkDPAScenarios() {
            const quizItem = document.getElementById('task-dpa-scenarios');
            let correctCount = 0;
            let allAnswered = true;

            document.querySelectorAll('#task-dpa-scenarios .dpa-scenario-select').forEach((select, index) => {
                const scenarioKey = `scenario${String.fromCharCode(65 + index)}`; // A, B, C, D
                const userAnswer = select.value;
                const feedbackEl = select.nextElementSibling; // Assuming feedback div is next sibling
                select.classList.remove('correct', 'incorrect');
                feedbackEl.textContent = '';

                if (userAnswer === "") {
                    allAnswered = false;
                    feedbackEl.textContent = "Please select an answer.";
                    feedbackEl.className = "feedback incorrect-feedback";
                } else if (userAnswer === dpaScenarioAnswers[scenarioKey]) {
                    select.classList.add('correct');
                    feedbackEl.textContent = "Correct!";
                    feedbackEl.className = "feedback correct-feedback";
                    correctCount++;
                } else {
                    select.classList.add('incorrect');
                    feedbackEl.textContent = `Incorrect. (Correct: ${dpaScenarioAnswers[scenarioKey].toUpperCase()})`;
                    feedbackEl.className = "feedback incorrect-feedback";
                }
            });

            if (!allAnswered) {
                alert("Please answer all DPA scenarios before checking.");
                return;
            }
            quizItem.dataset.answeredCorrectly = (correctCount === Object.keys(dpaScenarioAnswers).length).toString();
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }

        // --- Task 2.1: CMA Scenarios ---
        const cmaScenarioAnswers = {
            scenarioA: "s1",
            scenarioB: "s3a", // Or s3, allow flexibility
            scenarioC: "s2",
            scenarioD: "s3a"
        };
        function checkCMAScenarios() {
            const quizItem = document.getElementById('task-cma-scenarios');
            let correctCount = 0;
            let allAnswered = true;

            document.querySelectorAll('#task-cma-scenarios .cma-scenario-select').forEach((select, index) => {
                const scenarioKey = `scenario${String.fromCharCode(65 + index)}`;
                const userAnswer = select.value;
                const feedbackEl = select.nextElementSibling;
                select.classList.remove('correct', 'incorrect');
                feedbackEl.textContent = '';

                if (userAnswer === "") {
                    allAnswered = false;
                    feedbackEl.textContent = "Please select an answer.";
                    feedbackEl.className = "feedback incorrect-feedback";
                } else {
                    // Allow flexibility for s3/s3a
                    let isCorrect = userAnswer === cmaScenarioAnswers[scenarioKey];
                    if (scenarioKey === 'scenarioB' && (userAnswer === 's3' || userAnswer === 's3a')) {
                        isCorrect = true; // Accept either s3 or s3a for scenario B
                    }

                    if (isCorrect) {
                        select.classList.add('correct');
                        feedbackEl.textContent = "Correct!";
                        feedbackEl.className = "feedback correct-feedback";
                        correctCount++;
                    } else {
                        select.classList.add('incorrect');
                        feedbackEl.textContent = `Incorrect. (Hint: ${cmaScenarioAnswers[scenarioKey].toUpperCase()})`;
                        feedbackEl.className = "feedback incorrect-feedback";
                    }
                }
            });
            if (!allAnswered) {
                alert("Please answer all CMA scenarios before checking.");
                return;
            }
            quizItem.dataset.answeredCorrectly = (correctCount === Object.keys(cmaScenarioAnswers).length).toString();
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }

        // --- Task 3.1: CDPA Scenarios ---
        const cdpaScenarioAnswers = {
            scenarioA: "yes", // Using image for logo without permission
            scenarioB: "yes", // Making copy for friend
            scenarioC: "no",  // Fair dealing for criticism/review
            scenarioD: "no"   // Creative Commons licensed
        };
         function checkCDPAScenarios() {
            const quizItem = document.getElementById('task-cdpa-scenarios');
            let correctCount = 0;
            let allAnswered = true;

            document.querySelectorAll('#task-cdpa-scenarios .cdpa-scenario-select').forEach((select, index) => {
                const scenarioKey = `scenario${String.fromCharCode(65 + index)}`;
                const userAnswer = select.value;
                const feedbackEl = select.nextElementSibling;
                select.classList.remove('correct', 'incorrect');
                feedbackEl.textContent = '';

                if (userAnswer === "") {
                    allAnswered = false;
                    feedbackEl.textContent = "Please select an answer.";
                    feedbackEl.className = "feedback incorrect-feedback";
                } else if (userAnswer === cdpaScenarioAnswers[scenarioKey]) {
                    select.classList.add('correct');
                    feedbackEl.textContent = "Correct!";
                    feedbackEl.className = "feedback correct-feedback";
                    correctCount++;
                } else {
                    select.classList.add('incorrect');
                    feedbackEl.textContent = `Incorrect. (Correct: ${cdpaScenarioAnswers[scenarioKey].toUpperCase()})`;
                    feedbackEl.className = "feedback incorrect-feedback";
                }
            });
             if (!allAnswered) {
                alert("Please answer all CDPA scenarios before checking.");
                return;
            }
            quizItem.dataset.answeredCorrectly = (correctCount === Object.keys(cdpaScenarioAnswers).length).toString();
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
                if (item.closest('#starter-activity') || item.closest('#exam-practice-legislation') ) return; 

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
            ['starter-q1-why-laws', 'starter-q2-protect', 'starter-q3-illegal'].forEach(id => document.getElementById(id).value = '');
            const starterRevealBtn = document.querySelector("button[onclick*='starter-answers-feedback']");
            const starterFeedbackDiv = document.getElementById('starter-answers-feedback');
            if (starterFeedbackDiv.classList.contains('show')) toggleReveal('starter-answers-feedback', starterRevealBtn, 'Reveal Discussion Points', 'Hide Discussion Points');
            
            // Reset Tasks
            document.querySelectorAll('.dpa-scenario-select, .cma-scenario-select, .cdpa-scenario-select').forEach(select => {
                select.value = "";
                select.classList.remove('correct', 'incorrect');
                if(select.nextElementSibling && select.nextElementSibling.classList.contains('feedback')) {
                    select.nextElementSibling.textContent = '';
                }
            });
            document.querySelectorAll('#dpa-section .quiz-item, #cma-section .quiz-item, #cdpa-section .quiz-item').forEach(item => {
                item.dataset.answeredCorrectly = "false"; delete item.dataset.answered;
            });


            // Reset Exam Practice
            ['exam-q1-leg', 'exam-q2-leg', 'exam-q3-leg'].forEach(id => { 
                const el = document.getElementById(id); if(el) el.value = '';
            });
            ['ms-exam-q1-leg', 'ms-exam-q2-leg', 'ms-exam-q3-leg'].forEach(id => {
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
                filename:     'gcse-ethics-legislation-lesson.pdf',
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
            // Calculate initial total possible score
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#exam-practice-legislation') ) return; 
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);
        });