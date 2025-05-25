// --- Flashcard Data for Keywords ---
        const flashcardData = {
            "facial recognition technology (frt)": "Technology capable of identifying or verifying a person from a digital image or a video frame from a video source.",
            "privacy": "The right of individuals to keep their personal information from being disclosed. FRT can enable mass surveillance, eroding privacy.",
            "bias": "Systematic error in AI systems, often stemming from biased training data, leading to unfair or inaccurate outcomes for certain demographic groups.",
            "identification": "Determining who a person is (one-to-many matching against a database).",
            "verification": "Confirming a person's claimed identity (one-to-one matching).",
            "artificial intelligence (ai)": "The theory and development of computer systems able to perform tasks normally requiring human intelligence, such as visual perception, speech recognition, decision-making, and translation between languages.",
            "job displacement": "The loss of jobs due to automation or technological advancements, where AI or robots can perform tasks previously done by humans.",
            "algorithmic bias": "When an AI system reflects the implicit values of the humans who created it or the data it was trained on, leading to unfair or discriminatory outcomes.",
            "transparency": "In AI, the extent to which the decision-making process of an AI system can be understood by humans. Lack of transparency (black box problem) can make it hard to identify or correct errors and biases.",
            "explainability": "Similar to transparency, the ability to explain in human terms why an AI made a particular decision or prediction.",
            "black box ai": "The difficulty in understanding how complex AI models, like deep neural networks, arrive at their decisions, making them a 'black box'.",
            "deepfakes": "Synthetic media in which a person in an existing image or video is replaced with someone else's likeness using AI, often for malicious purposes or misinformation."
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
        
        // --- Task 1.1: FRT Uses Quiz ---
        function checkFRTUsesQuiz() {
            const quizItem = document.getElementById('task-frt-uses-quiz');
            const feedbackEl = quizItem.querySelector('.feedback');
            const selectedOptions = quizItem.querySelectorAll('.option-button.selected');
            let correctSelections = 0;
            let incorrectSelections = 0;
            const totalCorrectAnswers = 2; // Two options are correct

            quizItem.querySelectorAll('.option-button').forEach(btn => {
                btn.disabled = true; // Disable after checking
                btn.classList.remove('correct', 'incorrect'); // Clear previous
                const isCorrectData = btn.dataset.correct === 'true';
                if (btn.classList.contains('selected')) {
                    if (isCorrectData) {
                        btn.classList.add('correct');
                        correctSelections++;
                    } else {
                        btn.classList.add('incorrect');
                        incorrectSelections++;
                    }
                } else {
                    if (isCorrectData) { // Highlight correct answers user missed
                        btn.classList.add('correct'); // Could style differently for "missed correct"
                    }
                }
            });
            
            // Score: 1 point per correct selection, minus 1 per incorrect, min 0, max 2
            const pointsAwarded = Math.max(0, Math.min(totalCorrectAnswers, correctSelections - incorrectSelections));
            quizItem.dataset.answeredCorrectly = (pointsAwarded === totalCorrectAnswers && incorrectSelections === 0).toString();
            quizItem.dataset.answered = "true";
            
            if (pointsAwarded === totalCorrectAnswers && incorrectSelections === 0) {
                feedbackEl.innerHTML = `<span class="correct-feedback">Correct! You identified the common uses. (+${pointsAwarded} points)</span>`;
            } else {
                feedbackEl.innerHTML = `<span class="incorrect-feedback">You selected ${correctSelections} correct and ${incorrectSelections} incorrect options. Review the highlighted answers. (+${pointsAwarded} points)</span>`;
            }
            if(scoreCalculated) calculateScore();
        }

        // --- Task 1.2: FRT Scenario Analysis ---
        function checkFRTScenario() {
            const answerTextarea = document.getElementById('frt-scenario-answer');
            const feedbackEl = answerTextarea.nextElementSibling.nextElementSibling; // Assuming feedback div is after reveal button
            const quizItem = answerTextarea.closest('.quiz-item');
            const answer = answerTextarea.value.toLowerCase().trim();
            let points = 0;
            const minLength = 25; // Require some decent attempt

            if (answer.length < minLength) {
                feedbackEl.innerHTML = `<span class="incorrect-feedback">Please provide a more detailed discussion (at least ${minLength} characters).</span>`;
            } else {
                let benefitMentioned = false;
                let concern1Mentioned = false;
                let concern2Mentioned = false;

                // Simple keyword checks for demonstration
                if (answer.includes("safety") || answer.includes("identify criminal") || answer.includes("deter")) benefitMentioned = true;
                if (answer.includes("privacy") || answer.includes("surveillance") || answer.includes("consent")) concern1Mentioned = true;
                if (answer.includes("bias") || answer.includes("error") || answer.includes("misidentify") || answer.includes("false positive") || answer.includes("accuracy")) concern2Mentioned = true;
                
                // More refined check for two distinct concerns
                if (concern1Mentioned && concern2Mentioned && 
                    !( (answer.includes("privacy") || answer.includes("surveillance")) && answer.includes("consent") && !(answer.includes("bias") || answer.includes("error") || answer.includes("misidentify")) ) && // Avoid double counting privacy+consent as two
                    !( (answer.includes("bias") || answer.includes("error")) && answer.includes("misidentify") && !(answer.includes("privacy") || answer.includes("surveillance")) ) // Avoid double counting bias+misidentification as two
                ) {
                    // This logic is a bit complex for simple keyword check, might need more robust NLP for real grading
                }


                if (benefitMentioned) points++;
                if (concern1Mentioned) points++;
                if (concern2Mentioned && ( (answer.includes("bias") || answer.includes("error")) !== (answer.includes("privacy") || answer.includes("surveillance")) ) ) {
                     // Check if the second concern is distinct from the first type of concern
                    if (concern1Mentioned) { // if first concern was privacy related
                        if (answer.includes("bias") || answer.includes("error") || answer.includes("misidentify")) points++;
                    } else if (concern1Mentioned && (answer.includes("bias") || answer.includes("error"))) { // if first was bias related
                         if (answer.includes("privacy") || answer.includes("surveillance") || answer.includes("consent")) points++;
                    } else if (!concern1Mentioned && (answer.includes("bias") || answer.includes("error"))) { // if only one concern type mentioned for concern1, and it was bias
                        // this path means concern1Mentioned was false, but concern2Mentioned is true.
                        // This is tricky. Let's simplify: if two distinct *categories* of concern are hit.
                    }
                }
                 // Simplified: if two different concern keywords are present, likely two concerns.
                let distinctConcerns = 0;
                const concernKeywords = ["privacy", "surveillance", "consent", "bias", "error", "misidentify", "false positive", "accuracy", "chilling effect", "discrimination"];
                let mentionedConcernKeywords = [];
                concernKeywords.forEach(kw => {
                    if (answer.includes(kw) && !mentionedConcernKeywords.some(mk => kw.includes(mk) || mk.includes(kw))) { // Avoid counting sub-strings as distinct
                        distinctConcerns++;
                        mentionedConcernKeywords.push(kw);
                    }
                });
                if (distinctConcerns >= 2) points = Math.min(2, distinctConcerns) + (benefitMentioned ? 1 : 0); // Max 2 for concerns
                else if (distinctConcerns === 1) points = 1 + (benefitMentioned ? 1 : 0);
                else points = (benefitMentioned ? 1 : 0);


                points = Math.min(3, points); // Cap at 3 points for the question

                if (points >= 2) { // Needs at least one benefit and one concern, or two good concerns.
                    feedbackEl.innerHTML = `<span class="correct-feedback">Good analysis! You've identified key ethical points. (+${points} points)</span>`;
                    quizItem.dataset.answeredCorrectly = "true";
                } else {
                    feedbackEl.innerHTML = `<span class="incorrect-feedback">Your discussion could be more comprehensive. Ensure you cover one benefit and two distinct concerns clearly. (+${points} points)</span>`;
                    quizItem.dataset.answeredCorrectly = "false";
                }
            }
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }

        // --- Task 2.1: AI Applications Match ---
        let selectedAIAppTerm = null;
        let selectedAIAppDef = null;
        let aiAppMatchesMade = {};

        function setupAIApplicationsMatch() {
            const termList = document.getElementById('ai-app-term-list');
            const defList = document.getElementById('ai-app-definition-list');
            const feedbackEl = document.querySelector('#task-ai-applications-quiz .feedback');
            if (!termList || !defList) return;

            selectedAIAppTerm = null; selectedAIAppDef = null; aiAppMatchesMade = {};
            termList.querySelectorAll('.matching-item').forEach(item => { 
                item.classList.remove('selected', 'correct', 'incorrect', 'disabled'); 
                item.disabled = false; 
                item.onclick = () => handleAIAppMatchClick(item, 'term'); 
            });
            defList.querySelectorAll('.matching-item').forEach(item => { 
                item.classList.remove('selected', 'correct', 'incorrect', 'disabled'); 
                item.disabled = false; 
                item.onclick = () => handleAIAppMatchClick(item, 'definition'); 
            });
            
            for (let i = defList.children.length; i >= 0; i--) { // Shuffle definitions
                defList.appendChild(defList.children[Math.random() * i | 0]);
            }

            if(feedbackEl) feedbackEl.textContent = ''; // Clear feedback
            const quizItem = termList.closest('.quiz-item');
            if(quizItem) { quizItem.dataset.answeredCorrectly = "false"; delete quizItem.dataset.answered; }
        }
        function handleAIAppMatchClick(item, type) {
            if (item.disabled) return;
            if (type === 'term') {
                if (selectedAIAppTerm) selectedAIAppTerm.classList.remove('selected');
                selectedAIAppTerm = item; item.classList.add('selected');
            } else {
                if (selectedAIAppDef) selectedAIAppDef.classList.remove('selected');
                selectedAIAppDef = item; item.classList.add('selected');
            }
            if (selectedAIAppTerm && selectedAIAppDef) attemptAIAppMatch();
        }
        function attemptAIAppMatch() {
            const termMatchId = selectedAIAppTerm.dataset.match;
            const defMatchId = selectedAIAppDef.dataset.match;

            selectedAIAppTerm.classList.remove('selected'); selectedAIAppDef.classList.remove('selected');

            if (termMatchId === defMatchId) {
                selectedAIAppTerm.classList.add('correct'); selectedAIAppDef.classList.add('correct');
                selectedAIAppTerm.disabled = true; selectedAIAppDef.disabled = true;
                aiAppMatchesMade[termMatchId] = true;
            } else {
                selectedAIAppTerm.classList.add('incorrect'); selectedAIAppDef.classList.add('incorrect');
                setTimeout(() => {
                    if (selectedAIAppTerm && !selectedAIAppTerm.classList.contains('correct')) selectedAIAppTerm.classList.remove('incorrect');
                    if (selectedAIAppDef && !selectedAIAppDef.classList.contains('correct')) selectedAIAppDef.classList.remove('incorrect');
                }, 800);
            }
            selectedAIAppTerm = null; selectedAIAppDef = null;
        }
        function checkAIApplicationsMatch() {
            const feedbackEl = document.querySelector('#task-ai-applications-quiz .feedback');
            const termListEl = document.getElementById('ai-app-term-list');
            if (!termListEl || !feedbackEl) return;

            const totalPairs = termListEl.children.length;
            const correctMatches = Object.keys(aiAppMatchesMade).length;
             let allAttempted = true;
            termListEl.querySelectorAll('.matching-item').forEach(term => {
                if(!term.disabled) allAttempted = false;
                if (!term.classList.contains('correct') && term.disabled === false) term.classList.add('incorrect');
            });
             document.getElementById('ai-app-definition-list').querySelectorAll('.matching-item').forEach(def => {
                if (!def.classList.contains('correct') && def.disabled === false) def.classList.add('incorrect');
            });
            
            if (!allAttempted && totalPairs > 0) {
                alert("Please attempt to match all AI applications before checking.");
                return;
            }

            const quizItem = termListEl.closest('.quiz-item');
            if (correctMatches === totalPairs) {
                feedbackEl.innerHTML = `<span class="correct-feedback">All applications matched correctly! (+${quizItem.dataset.points} points)</span>`;
                quizItem.dataset.answeredCorrectly = "true";
            } else {
                feedbackEl.innerHTML = `<span class="incorrect-feedback">Some applications are mismatched. You got ${correctMatches}/${totalPairs} correct.</span>`;
                quizItem.dataset.answeredCorrectly = "false";
            }
            quizItem.dataset.answered = "true";
            if(scoreCalculated) calculateScore();
        }

        // --- Task 2.2: AI Hiring Dilemma ---
        function checkAIHiringDilemma() {
            const answerTextarea = document.getElementById('ai-hiring-dilemma-answer');
            const feedbackEl = answerTextarea.nextElementSibling.nextElementSibling; // Assuming feedback div is after reveal button
            const quizItem = answerTextarea.closest('.quiz-item');
            const answer = answerTextarea.value.toLowerCase().trim();
            let points = 0;
            const minLength = 25;

            if (answer.length < minLength) {
                feedbackEl.innerHTML = `<span class="incorrect-feedback">Please provide a more detailed discussion (at least ${minLength} characters).</span>`;
            } else {
                let issuesFound = 0;
                if (answer.includes("bias") || answer.includes("discriminat")) issuesFound++;
                if (answer.includes("transparent") || answer.includes("explain") || answer.includes("black box")) issuesFound++;
                if (answer.includes("accountab") || answer.includes("responsible") || answer.includes("blame")) issuesFound++;
                if (answer.includes("dehumaniz") || answer.includes("nuance") || answer.includes("overlook")) issuesFound++;
                if (answer.includes("error") || answer.includes("inaccura") || answer.includes("filter out qualified")) issuesFound++;
                
                points = Math.min(3, issuesFound); // Max 3 points

                if (points >= 2) {
                    feedbackEl.innerHTML = `<span class="correct-feedback">Good! You've identified ${points} potential ethical issues. (+${points} points)</span>`;
                    quizItem.dataset.answeredCorrectly = "true";
                } else {
                    feedbackEl.innerHTML = `<span class="incorrect-feedback">Try to identify at least two distinct ethical issues from the guidance, such as bias, lack of transparency, or accountability. You identified ${points}. (+${points} points)</span>`;
                    quizItem.dataset.answeredCorrectly = "false";
                }
            }
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
                if (item.closest('#starter-activity') || item.closest('#exam-practice-ethics') ) return; 

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
            ['starter-q1-facial', 'starter-q2-ai'].forEach(id => document.getElementById(id).value = '');
            const starterRevealBtn = document.querySelector("button[onclick*='starter-answers-feedback']");
            const starterFeedbackDiv = document.getElementById('starter-answers-feedback');
            if (starterFeedbackDiv.classList.contains('show')) toggleReveal('starter-answers-feedback', starterRevealBtn, 'Reveal Discussion Points', 'Hide Discussion Points');
            
            // Reset Tasks
            // Task 1.1 FRT Uses
            const frtUsesQuiz = document.getElementById('task-frt-uses-quiz');
            frtUsesQuiz.querySelectorAll('.option-button').forEach(btn => {btn.classList.remove('selected', 'correct', 'incorrect'); btn.disabled = false;});
            frtUsesQuiz.querySelector('.feedback').textContent = '';
            frtUsesQuiz.dataset.answeredCorrectly = "false"; delete frtUsesQuiz.dataset.answered;

            // Task 1.2 FRT Scenario
            document.getElementById('frt-scenario-answer').value = '';
            const frtScenarioFeedback = document.getElementById('frt-scenario-answer').nextElementSibling.nextElementSibling;
            frtScenarioFeedback.textContent = '';
            const frtGuidanceBtn = document.querySelector("button[onclick*='frt-scenario-guidance']");
            const frtGuidanceDiv = document.getElementById('frt-scenario-guidance');
            if(frtGuidanceDiv.classList.contains('show')) toggleReveal('frt-scenario-guidance', frtGuidanceBtn, 'Show Guidance', 'Hide Guidance');
            document.getElementById('task-frt-scenario').dataset.answeredCorrectly = "false"; delete document.getElementById('task-frt-scenario').dataset.answered;
            
            // Task 2.1 AI Applications
            resetAIApplicationsMatch();

            // Task 2.2 AI Hiring Dilemma
            document.getElementById('ai-hiring-dilemma-answer').value = '';
            const aiHiringFeedback = document.getElementById('ai-hiring-dilemma-answer').nextElementSibling.nextElementSibling;
            aiHiringFeedback.textContent = '';
            const aiGuidanceBtn = document.querySelector("button[onclick*='ai-hiring-dilemma-guidance']");
            const aiGuidanceDiv = document.getElementById('ai-hiring-dilemma-guidance');
            if(aiGuidanceDiv.classList.contains('show')) toggleReveal('ai-hiring-dilemma-guidance', aiGuidanceBtn, 'Show Guidance', 'Hide Guidance');
            document.getElementById('task-ai-dilemma').dataset.answeredCorrectly = "false"; delete document.getElementById('task-ai-dilemma').dataset.answered;


            // Reset Exam Practice
            ['exam-q1-ethics', 'exam-q2-ethics'].forEach(id => { 
                const el = document.getElementById(id); if(el) el.value = '';
            });
            ['ms-exam-q1-ethics', 'ms-exam-q2-ethics'].forEach(id => {
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
        function resetAIApplicationsMatch() { // Specific reset for AI App matching
            setupAIApplicationsMatch();
            if(scoreCalculated) calculateScore();
        }


        // --- PDF Export ---
        function exportToPDF() {
            alert("Preparing PDF. This might take a moment. Please ensure pop-ups are allowed. Interactive elements might not be fully captured in their current state.");
            const element = document.querySelector('.max-w-4xl.mx-auto.bg-white'); 
            const opt = {
                margin:       [0.5, 0.5, 0.7, 0.5], 
                filename:     'gcse-ethics-ai-frt-lesson.pdf',
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
            setupAIApplicationsMatch(); // For Task 2.1
            // Calculate initial total possible score
            totalPossibleScore = 0;
            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#starter-activity') || item.closest('#exam-practice-ethics') ) return; 
                totalPossibleScore += parseInt(item.dataset.points || 0);
            });
            document.getElementById('final-score-display').textContent = `Your score: 0 / ${totalPossibleScore}`;

            document.getElementById('calculate-final-score').addEventListener('click', calculateScore);
            document.getElementById('reset-all-tasks').addEventListener('click', resetAllTasks);
            document.getElementById('export-pdf-button').addEventListener('click', exportToPDF);

            // Event listener for FRT Uses multi-select options
            document.querySelectorAll('#task-frt-uses-quiz .option-button.multi-select').forEach(button => {
                button.addEventListener('click', () => {
                    const quizItem = button.closest('.quiz-item');
                    if (!quizItem.dataset.answered) { // Only allow selection if not yet checked
                         button.classList.toggle('selected');
                    }
                });
            });
        });