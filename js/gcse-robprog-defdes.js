// GCSE Defensive Design - gcse-robprog-defdes.js

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide Icons if used
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // --- Helper Function: Enable/Disable Button Based on Input/Interaction ---
    function enableButtonOnAttempt(inputs, button) {
        if (!button) return;
        const check = () => {
            const isAttempted = Array.from(inputs).some(input => {
                if (!input) return false;
                if (input.type === 'checkbox' || input.type === 'radio') {
                    return input.dataset.interacted === 'true';
                }
                return input.value.trim() !== '';
            });
            button.disabled = !isAttempted;
            if (isAttempted) {
                button.classList.add('attempted');
            } else {
                button.classList.remove('attempted');
            }
        };

        inputs.forEach(input => {
            if (input) {
                const eventType = (input.type === 'checkbox' || input.type === 'radio') ? 'change' : 'input';
                input.addEventListener(eventType, () => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.dataset.interacted = 'true';
                    }
                    check();
                });
            }
        });
        check(); // Initial check
    }

    // --- Section: Starter Activity ---
    const starterMisuse = document.getElementById('starter-misuse');
    const starterValidation = document.getElementById('starter-validation');
    const starterAuth = document.getElementById('starter-auth');
    const starterMaintain = document.getElementById('starter-maintain');
    const starterInputs = [starterMisuse, starterValidation, starterAuth, starterMaintain].filter(Boolean);
    const starterResetBtn = document.getElementById('starter-reset-btn');
    const starterFeedbackDiv = document.getElementById('starter-feedback'); 

    if (starterResetBtn && starterInputs.length > 0) {
        starterResetBtn.addEventListener('click', () => {
            starterInputs.forEach(input => { if (input) input.value = ''; });
            if (starterFeedbackDiv) { 
                starterFeedbackDiv.classList.add('hidden');
            }
        });
    }

    // --- Section: Task 1 (Anticipating Misuse) ---
    const misuse1Problem = document.getElementById('misuse1-problem');
    const misuse1Solution = document.getElementById('misuse1-solution');
    const misuse2Problem = document.getElementById('misuse2-problem');
    const misuse2Solution = document.getElementById('misuse2-solution');
    const misuse3Problem = document.getElementById('misuse3-problem');
    const misuse3Solution = document.getElementById('misuse3-solution');
    const task1TextareaInputs = [misuse1Problem, misuse1Solution, misuse2Problem, misuse2Solution, misuse3Problem, misuse3Solution].filter(Boolean);
    const task1ResetBtn = document.getElementById('task1-reset-btn');
    const task1Feedback = document.getElementById('task1-feedback');

    if (task1ResetBtn && task1TextareaInputs.length > 0 && task1Feedback) {
        task1ResetBtn.addEventListener('click', () => {
            task1TextareaInputs.forEach(input => { if (input) input.value = ''; });
            task1Feedback.classList.add('hidden');
        });
    }

    // --- Section: Task 2 (Input Validation Simulator) ---
    const validationDataInput = document.getElementById('validation-data');
    const validationTypeSelect = document.getElementById('validation-type');
    const runValidationSimBtn = document.getElementById('run-validation-sim-btn');
    const resetValidationSimBtn = document.getElementById('reset-validation-sim-btn');
    const validationSimOutput = document.getElementById('validation-sim-output');

    if (runValidationSimBtn && validationDataInput && validationTypeSelect && validationSimOutput) {
        runValidationSimBtn.addEventListener('click', () => {
            const data = validationDataInput.value;
            const type = validationTypeSelect.value;
            let result = { isValid: false, message: "Validation not run." };

            switch (type) {
                case 'presence':
                    result = (data.trim() !== "") ?
                        { isValid: true, message: "Input provided. Presence check passed." } :
                        { isValid: false, message: "Input required. Presence check failed." };
                    break;
                case 'type': 
                    if (data.trim() === '') result = { isValid: false, message: "Input is empty. Type check cannot be performed." };
                    else result = /^-?\d+$/.test(data.trim()) && Number.isInteger(Number(data.trim())) ?
                        { isValid: true, message: `"${data}" is a valid integer.` } :
                        { isValid: false, message: `"${data}" is not a whole number (integer).` };
                    break;
                case 'range': 
                    if (data.trim() === '') result = { isValid: false, message: "Input is empty. Range check cannot be performed." };
                    else {
                        const numData = Number(data.trim());
                        if (isNaN(numData) || !Number.isInteger(numData)) result = { isValid: false, message: `"${data}" is not a valid whole number for range check.` };
                        else result = (numData >= 1 && numData <= 120) ?
                            { isValid: true, message: `Number ${numData} is within range (1-120).` } :
                            { isValid: false, message: `Number ${numData} is outside range (1-120).` };
                    }
                    break;
                case 'length': 
                    const len = data.length;
                    result = (len >= 8 && len <= 16) ?
                        { isValid: true, message: `Input length (${len}) is valid (8-16 characters).` } :
                        { isValid: false, message: `Input length (${len}) is invalid. Must be 8-16 characters.` };
                    break;
                case 'format': 
                    const email = data.trim();
                    if (email === '') result = { isValid: false, message: "Email is empty. Format check cannot be performed." };
                    else {
                        const atIndex = email.indexOf('@');
                        const dotIndex = email.lastIndexOf('.');
                        result = (atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1 && email.indexOf(' ') === -1) ?
                            { isValid: true, message: `"${email}" has a basic valid email format.` } :
                            { isValid: false, message: `"${email}" has an invalid email format (e.g., missing @, domain, or contains spaces).` };
                    }
                    break;
            }
            validationSimOutput.textContent = result.message;
            validationSimOutput.className = `mt-4 p-3 rounded border text-center min-h-[50px] ${result.isValid ? 'text-green-700 border-green-300 bg-green-50' : 'text-red-700 border-red-300 bg-red-50'}`;
        });
    }
    if (resetValidationSimBtn && validationDataInput && validationSimOutput) {
        resetValidationSimBtn.addEventListener('click', () => {
            if (validationDataInput) validationDataInput.value = '';
            if (validationSimOutput) {
                validationSimOutput.textContent = 'Validation result will appear here.';
                validationSimOutput.className = 'mt-4 p-3 bg-indigo-100 rounded border border-indigo-200 text-center min-h-[50px]';
            }
        });
    }

    // --- Task 3: Authentication Exploration ---
    const authMethodsList = document.getElementById('auth-methods');
    const authDescsList = document.getElementById('auth-descs');
    const checkAuthMatchingBtn = document.getElementById('check-auth-matching-btn');
    const resetAuthMatchingBtn = document.getElementById('reset-auth-matching-btn');
    const authMatchingFeedback = document.getElementById('auth-matching-feedback');
    let selectedAuthMethod = null;
    let selectedAuthDesc = null;

    function clearAuthSelections() {
        if (authMethodsList) authMethodsList.querySelectorAll('.matching-item').forEach(item => item.classList.remove('selected', 'correct', 'incorrect'));
        if (authDescsList) authDescsList.querySelectorAll('.matching-item').forEach(item => item.classList.remove('selected', 'correct', 'incorrect'));
        selectedAuthMethod = null;
        selectedAuthDesc = null;
        if (authMatchingFeedback) {
            authMatchingFeedback.classList.add('hidden');
            authMatchingFeedback.textContent = "Feedback for matching will appear here.";
            authMatchingFeedback.className = "feedback-area hidden";
        }
        if (checkAuthMatchingBtn) {
            checkAuthMatchingBtn.disabled = true;
            checkAuthMatchingBtn.classList.remove('attempted');
        }
    }

    function updateAuthCheckButtonState() {
        if (checkAuthMatchingBtn) {
            const enabled = selectedAuthMethod && selectedAuthDesc;
            checkAuthMatchingBtn.disabled = !enabled;
            if (enabled) {
                checkAuthMatchingBtn.classList.add('attempted');
            } else {
                checkAuthMatchingBtn.classList.remove('attempted');
            }
        }
    }

    if (authMethodsList && authDescsList) {
        authMethodsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('matching-item') && !e.target.classList.contains('correct')) {
                authMethodsList.querySelectorAll('.matching-item:not(.correct)').forEach(item => item.classList.remove('selected', 'incorrect'));
                e.target.classList.add('selected');
                selectedAuthMethod = e.target;
                updateAuthCheckButtonState();
            }
        });
        authDescsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('matching-item') && !e.target.classList.contains('correct')) {
                authDescsList.querySelectorAll('.matching-item:not(.correct)').forEach(item => item.classList.remove('selected', 'incorrect'));
                e.target.classList.add('selected');
                selectedAuthDesc = e.target;
                updateAuthCheckButtonState();
            }
        });
    }

    if (checkAuthMatchingBtn && authMatchingFeedback) {
        checkAuthMatchingBtn.disabled = true; 
        checkAuthMatchingBtn.addEventListener('click', () => {
            authMatchingFeedback.classList.remove('hidden');
            if (selectedAuthMethod && selectedAuthDesc) {
                selectedAuthMethod.classList.remove('incorrect'); 
                selectedAuthDesc.classList.remove('incorrect');

                if (selectedAuthMethod.dataset.match === selectedAuthDesc.dataset.match) {
                    authMatchingFeedback.textContent = "Correct Match!";
                    authMatchingFeedback.className = "feedback-area show text-green-700 p-2 bg-green-50 border border-green-200 rounded";
                    selectedAuthMethod.classList.add('correct');
                    selectedAuthMethod.classList.remove('selected');
                    selectedAuthDesc.classList.add('correct');
                    selectedAuthDesc.classList.remove('selected');
                    selectedAuthMethod = null; 
                    selectedAuthDesc = null;
                    updateAuthCheckButtonState(); 
                } else {
                    authMatchingFeedback.textContent = "Incorrect Match. Try again.";
                    authMatchingFeedback.className = "feedback-area show text-red-700 p-2 bg-red-50 border border-red-200 rounded";
                    selectedAuthMethod.classList.add('incorrect');
                    selectedAuthDesc.classList.add('incorrect');
                }
            } else {
                authMatchingFeedback.textContent = "Please select one item from each column.";
                authMatchingFeedback.className = "feedback-area show text-yellow-700 p-2 bg-yellow-50 border border-yellow-200 rounded";
            }
        });
    }
    if (resetAuthMatchingBtn) {
        resetAuthMatchingBtn.addEventListener('click', clearAuthSelections);
    }
    if (checkAuthMatchingBtn) { 
        updateAuthCheckButtonState(); 
    }

    const authQ1 = document.getElementById('auth-q1');
    const authQ2 = document.getElementById('auth-q2');
    const authScenarioInputs = [authQ1, authQ2].filter(Boolean);
    const resetAuthScenariosBtn = document.getElementById('reset-auth-scenarios-btn');
    const authScenariosFeedback = document.getElementById('auth-scenarios-feedback'); 

    if (resetAuthScenariosBtn && authScenarioInputs.length > 0 && authScenariosFeedback) {
        resetAuthScenariosBtn.addEventListener('click', () => {
            authScenarioInputs.forEach(input => { if (input) input.value = ''; });
            authScenariosFeedback.classList.add('hidden');
        });
    }

    // --- Task 4: Maintainability ---
    const maintainIssue1 = document.getElementById('maintain-issue1');
    const maintainIssue2 = document.getElementById('maintain-issue2');
    const maintainIssue3 = document.getElementById('maintain-issue3');
    const maintainAIssuesInputs = [maintainIssue1, maintainIssue2, maintainIssue3].filter(Boolean);
    const resetMaintainabilityABtn = document.getElementById('reset-maintainability-a-btn');
    const maintainabilityFeedbackA = document.getElementById('maintainability-feedback-a'); 

    if (resetMaintainabilityABtn && maintainAIssuesInputs.length > 0 && maintainabilityFeedbackA) {
        resetMaintainabilityABtn.addEventListener('click', () => {
            maintainAIssuesInputs.forEach(input => { if (input) input.value = ''; });
            maintainabilityFeedbackA.classList.add('hidden');
        });
    }

    const maintainB1 = document.getElementById('maintain-b1');
    const maintainB2 = document.getElementById('maintain-b2');
    const maintainB3 = document.getElementById('maintain-b3');
    const maintainB4 = document.getElementById('maintain-b4');
    const maintainBInputs = [maintainB1, maintainB2, maintainB3, maintainB4].filter(Boolean);
    const resetMaintainabilityBBtn = document.getElementById('reset-maintainability-b-btn');
    const maintainabilityFeedbackB = document.getElementById('maintainability-feedback-b');

    if (resetMaintainabilityBBtn && maintainBInputs.length > 0 && maintainabilityFeedbackB) {
        resetMaintainabilityBBtn.addEventListener('click', () => {
            maintainBInputs.forEach(input => { if (input) input.value = ''; });
            maintainabilityFeedbackB.classList.add('hidden');
        });
    }

    // --- Task 5: Coding Challenges (Email Validator) ---
    const emailValidatorCode = document.getElementById('email-validator-code');
    const emailValidatorSolutionDiv = document.getElementById('email-validator-solution'); 
    const task5CodingResetBtn = document.getElementById('task5-coding-reset-btn');

    if (task5CodingResetBtn && emailValidatorCode) { 
        task5CodingResetBtn.addEventListener('click', () => {
            emailValidatorCode.value = `def is_valid_email(email_string):
    # Your Python code here
    return False # Placeholder`;
            if (emailValidatorSolutionDiv) { 
                emailValidatorSolutionDiv.style.display = 'none';
            }
        });
    }

    // --- Task 6: Exam Practice Questions Reset & Button Logic ---
    const task6ExamResetBtn = document.getElementById('task6-exam-reset-btn');
    if (task6ExamResetBtn) {
        task6ExamResetBtn.addEventListener('click', () => {
            document.querySelectorAll('#task6-exam-practice textarea.exam-answer-area').forEach(area => { if (area) area.value = ''; });
            document.querySelectorAll('#task6-exam-practice input.self-assess-input').forEach(input => { if (input) input.value = ''; });
            document.querySelectorAll('#task6-exam-practice div.mark-scheme').forEach(ms => { 
                if (ms) {
                    ms.classList.add('hidden');
                    ms.style.display = ''; // Reset any direct style manipulation
                }
            });
            
            document.querySelectorAll('#task6-exam-practice .exam-question').forEach(question => {
                const toggleBtn = question.querySelector('.toggle-mark-scheme-btn');
                if (toggleBtn) {
                    toggleBtn.textContent = 'Show Mark Scheme';
                    const predictedMarkInput = question.querySelector('.self-assess-input');
                    const answerArea = question.querySelector('.exam-answer-area');
                    if (predictedMarkInput && answerArea) { 
                         const mainAnswerAttempted = answerArea.value.trim() !== '';
                         const markEntered = predictedMarkInput.value.trim() !== '' &&
                             !isNaN(parseInt(predictedMarkInput.value)) &&
                             parseInt(predictedMarkInput.value) >= 0 &&
                             parseInt(predictedMarkInput.value) <= parseInt(predictedMarkInput.max);
                         const enabled = mainAnswerAttempted && markEntered;
                         toggleBtn.disabled = !enabled;
                         if (enabled) {
                             toggleBtn.classList.add('attempted');
                         } else {
                             toggleBtn.classList.remove('attempted');
                         }
                    } else { 
                        toggleBtn.disabled = true;
                        toggleBtn.classList.remove('attempted');
                    }
                }
            });
        });
    }

    document.querySelectorAll('#task6-exam-practice .exam-question').forEach(question => {
        const predictedMarkInput = question.querySelector('.self-assess-input');
        const toggleBtn = question.querySelector('.toggle-mark-scheme-btn');
        const answerArea = question.querySelector('.exam-answer-area');
        
        function checkExamAttemptAndSetupListener() {
            if (!predictedMarkInput || !toggleBtn || !answerArea) {
                console.warn("Mark Scheme button: Missing one or more elements for an exam question. Button ID:", toggleBtn ? toggleBtn.id : "Unknown", "Question context:", question);
                if(toggleBtn) toggleBtn.disabled = true; // Disable if setup is incomplete
                return;
            }
            
            const markSchemeId = toggleBtn.dataset.markSchemeId;
            const markSchemeDiv = markSchemeId ? document.getElementById(markSchemeId) : null;

            if (!markSchemeDiv) {
                console.warn(`Mark Scheme button: Target div with ID '${markSchemeId}' not found for button '${toggleBtn.id}'. Button disabled.`);
                toggleBtn.disabled = true; 
                return;
            }

            const check = () => {
                const mainAnswerAttempted = answerArea.value.trim() !== '';
                const markEntered = predictedMarkInput.value.trim() !== '' &&
                    !isNaN(parseInt(predictedMarkInput.value)) &&
                    parseInt(predictedMarkInput.value) >= 0 &&
                    parseInt(predictedMarkInput.value) <= parseInt(predictedMarkInput.max);

                const enabled = mainAnswerAttempted && markEntered;
                toggleBtn.disabled = !enabled;
                if (enabled) {
                    toggleBtn.classList.add('attempted');
                } else {
                    toggleBtn.classList.remove('attempted');
                }
            };

            predictedMarkInput.addEventListener('input', check);
            answerArea.addEventListener('input', check);
            
            toggleBtn.addEventListener('click', () => {
                console.log(`Button clicked: ${toggleBtn.id}, targeting: ${markSchemeId}`);
                const currentMarkSchemeDiv = document.getElementById(markSchemeId); 
                if (currentMarkSchemeDiv) {
                    // Check current visibility based on class OR explicit style
                    const isCurrentlyHidden = currentMarkSchemeDiv.classList.contains('hidden') || currentMarkSchemeDiv.style.display === 'none';
                    
                    if (isCurrentlyHidden) {
                        console.log(`Showing mark scheme: ${markSchemeId}`);
                        currentMarkSchemeDiv.classList.remove('hidden');
                        currentMarkSchemeDiv.style.display = 'block'; // Force display
                        toggleBtn.textContent = 'Hide Mark Scheme';
                    } else {
                        console.log(`Hiding mark scheme: ${markSchemeId}`);
                        currentMarkSchemeDiv.classList.add('hidden');
                        currentMarkSchemeDiv.style.display = 'none'; // Force display none
                        toggleBtn.textContent = 'Show Mark Scheme';
                    }
                    console.log(`Mark scheme ${markSchemeId} classList:`, currentMarkSchemeDiv.classList);
                    console.log(`Mark scheme ${markSchemeId} style.display:`, currentMarkSchemeDiv.style.display);

                } else {
                    console.error("Mark scheme div not found on click for button:", toggleBtn.id, "targetting", markSchemeId);
                }
            });
            check(); // Initial check
        }
        checkExamAttemptAndSetupListener();
    });


    // --- Final Actions Section ---
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn && typeof html2pdf !== 'undefined') {
        exportPdfBtn.addEventListener('click', () => {
            const mainContentElement = document.querySelector('.max-w-4xl.mx-auto.bg-white');
            if (mainContentElement) {
                const opt = {
                    margin: [0.5, 0.5, 0.5, 0.5],
                    filename: 'gcse-defensive-design-summary.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, scrollY: -window.scrollY, windowWidth: mainContentElement.scrollWidth, windowHeight: mainContentElement.scrollHeight },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                };
                
                const hiddenElementsToRestore = [];
                // Make sure to show elements for PDF export
                document.querySelectorAll('.mark-scheme, .feedback-area').forEach(el => {
                    const wasHiddenByClass = el.classList.contains('hidden');
                    const wasHiddenByStyle = el.style.display === 'none';
                    
                    if (wasHiddenByClass) {
                        el.classList.remove('hidden');
                        hiddenElementsToRestore.push({el: el, type: 'class'});
                    }
                    if (wasHiddenByStyle) {
                        el.style.display = 'block'; // Or appropriate display type
                        hiddenElementsToRestore.push({el: el, type: 'style', originalDisplay: 'none'});
                    } else if (wasHiddenByClass && !wasHiddenByStyle) { 
                        // If hidden by class but style.display was not 'none', store current style.display
                         hiddenElementsToRestore.push({el: el, type: 'style', originalDisplay: el.style.display || ''});
                         el.style.display = 'block'; // Ensure it's visible
                    }
                });

                const emailSolDiv = document.getElementById('email-validator-solution');
                if (emailSolDiv && (emailSolDiv.style.display === 'none' || emailSolDiv.style.display === '')) {
                     emailSolDiv.style.display = 'block';
                     hiddenElementsToRestore.push({el: emailSolDiv, type: 'style', originalDisplay: 'none'});
                }

                html2pdf().from(mainContentElement).set(opt).save().then(() => {
                    hiddenElementsToRestore.forEach(item => {
                        if (item.type === 'style') {
                            item.el.style.display = item.originalDisplay;
                        } else if (item.type === 'class') {
                            item.el.classList.add('hidden');
                        }
                    });
                }).catch(err => {
                    console.error("PDF generation error:", err);
                    hiddenElementsToRestore.forEach(item => { 
                        if (item.type === 'style') {
                            item.el.style.display = item.originalDisplay;
                        } else if (item.type === 'class') {
                            item.el.classList.add('hidden');
                        }
                    });
                });
            } else {
                alert("Could not find content to export.");
            }
        });
    } else if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            alert("PDF Exporter (html2pdf.js) is not loaded correctly. Cannot export.");
        });
    }

    // --- Reset All Tasks (Global Function for HTML onclick) ---
    window.resetAllTasks = function() {
        if (starterResetBtn) starterResetBtn.click();
        if (task1ResetBtn) task1ResetBtn.click();
        if (resetValidationSimBtn) resetValidationSimBtn.click();
        if (resetAuthMatchingBtn) resetAuthMatchingBtn.click();
        if (resetAuthScenariosBtn) resetAuthScenariosBtn.click(); 
        if (resetMaintainabilityABtn) resetMaintainabilityABtn.click(); 
        if (resetMaintainabilityBBtn) resetMaintainabilityBBtn.click(); 
        if (task5CodingResetBtn) task5CodingResetBtn.click(); 
        if (task6ExamResetBtn) task6ExamResetBtn.click();

        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log("All interactive tasks have been reset.");
    };

});
