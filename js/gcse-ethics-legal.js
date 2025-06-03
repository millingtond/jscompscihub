// --- Helper: Toggle Reveal (for mark schemes, extension guidance etc.) ---
function toggleReveal(contentId, buttonElement, revealText, hideText) {
    const content = document.getElementById(contentId);
    if (!content) return;
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        content.classList.add('hidden'); 
    } else {
        content.classList.remove('hidden'); 
        setTimeout(() => { content.classList.add('show'); }, 10); 
    }

    if (buttonElement) {
        buttonElement.textContent = content.classList.contains('show') ? hideText : revealText;
    }
}

// --- Task 1.1: DPA Scenarios ---
const dpaScenarioAnswers = {
    scenarioA: "yes", 
    scenarioB: "no",  
    scenarioC: "yes", 
    scenarioD: "no"   
};
function checkDPAScenarios() {
    let allAnswered = true;
    document.querySelectorAll('#task-dpa-scenarios .scenario-box').forEach((box, index) => {
        const scenarioKey = `scenario${String.fromCharCode(65 + index)}`;
        const select = box.querySelector('.dpa-scenario-select');
        const userAnswer = select.value;
        const feedbackEl = box.querySelector('.feedback');
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
        } else {
            select.classList.add('incorrect');
            feedbackEl.textContent = "Incorrect.";
            feedbackEl.className = "feedback incorrect-feedback";
        }
        feedbackEl.classList.remove('hidden');
        setTimeout(() => feedbackEl.classList.add('show'), 10);
    });
    if (!allAnswered) { alert("Please answer all DPA scenarios before checking."); return; }
}

// --- Task 2.1: CMA Scenarios ---
const cmaScenarioAnswers = {
    scenarioA: "s1",
    scenarioB: "s3a", 
    scenarioC: "s2",
    scenarioD: "s3a"
};
function checkCMAScenarios() {
    let allAnswered = true;
    document.querySelectorAll('#task-cma-scenarios .scenario-box').forEach((box, index) => {
        const scenarioKey = `scenario${String.fromCharCode(65 + index)}`;
        const select = box.querySelector('.cma-scenario-select');
        const userAnswer = select.value;
        const feedbackEl = box.querySelector('.feedback');
        select.classList.remove('correct', 'incorrect');
        feedbackEl.textContent = '';
        if (userAnswer === "") {
            allAnswered = false;
            feedbackEl.textContent = "Please select an answer.";
            feedbackEl.className = "feedback incorrect-feedback";
        } else {
            let isCorrect = userAnswer === cmaScenarioAnswers[scenarioKey];
            if (scenarioKey === 'scenarioB' && (userAnswer === 's3' || userAnswer === 's3a')) {
                isCorrect = true; 
            }
            if (isCorrect) {
                select.classList.add('correct');
                feedbackEl.textContent = "Correct!";
                feedbackEl.className = "feedback correct-feedback";
            } else {
                select.classList.add('incorrect');
                feedbackEl.textContent = "Incorrect.";
                feedbackEl.className = "feedback incorrect-feedback";
            }
        }
        feedbackEl.classList.remove('hidden');
        setTimeout(() => feedbackEl.classList.add('show'), 10);
    });
    if (!allAnswered) { alert("Please answer all CMA scenarios before checking."); return; }
}

// --- Task 3.1: CDPA Scenarios ---
const cdpaScenarioAnswers = {
    scenarioA: "yes", 
    scenarioB: "yes", 
    scenarioC: "no",  
    scenarioD: "no"   
};
 function checkCDPAScenarios() {
    let allAnswered = true;
    document.querySelectorAll('#task-cdpa-scenarios .scenario-box').forEach((box, index) => {
        const scenarioKey = `scenario${String.fromCharCode(65 + index)}`;
        const select = box.querySelector('.cdpa-scenario-select');
        const userAnswer = select.value;
        const feedbackEl = box.querySelector('.feedback');
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
        } else {
            select.classList.add('incorrect');
            feedbackEl.textContent = "Incorrect.";
            feedbackEl.className = "feedback incorrect-feedback";
        }
        feedbackEl.classList.remove('hidden');
        setTimeout(() => feedbackEl.classList.add('show'), 10);
    });
     if (!allAnswered) { alert("Please answer all CDPA scenarios before checking."); return; }
}

// --- Exam Practice Question Logic (Task 4) ---
function toggleMarkScheme(markSchemeId, textareaId, marksInputId, minLength = 10) {
    const markSchemeDiv = document.getElementById(markSchemeId);
    const textarea = document.getElementById(textareaId);
    const marksInput = document.getElementById(marksInputId);
    const buttonElement = event.target; 
    if (!markSchemeDiv || !marksInput) return;
    if (!markSchemeDiv.classList.contains('show')) { 
        if (marksInput.value.trim() === '') {
            alert(`Please enter your predicted marks before viewing the mark scheme.`); return;
        }
        if (textarea && textarea.value.trim().length < minLength) {
            alert(`Please attempt a more detailed answer (at least ${minLength} characters) for the question before viewing the mark scheme.`); return;
        }
    }
    toggleReveal(markSchemeId, buttonElement, 'Show Mark Scheme', 'Hide Mark Scheme');
}

// --- Task 5: Data Guardian Challenge (DPA) ---
function initializeDataGuardianChallenge() {
    const scenarios = [
        { idRoot: "dg-scenario1", name: "dg-scenario1", correctAnswer: "b", feedback: {
            a: "Incorrect. Charging for a subject access request is generally not allowed under DPA/GDPR, and the timeframe is usually one month.",
            b: "Correct! DPA/GDPR gives individuals the right to access their data (Right of Access), usually free of charge and within one month once identity is verified.",
            c: "Incorrect. Companies cannot refuse access to personal data without a valid exemption under DPA/GDPR."
        }},
        { idRoot: "dg-scenario2", name: "dg-scenario2", correctAnswer: "b", feedback: {
            a: "Incorrect. Sending marketing emails requires specific consent (opt-in). Registration alone is not sufficient consent for marketing under DPA/GDPR (Purpose Limitation, Lawfulness).",
            b: "Correct! This respects the DPA/GDPR requirement for explicit, opt-in consent for direct marketing.",
            c: "Incorrect. Using purchased lists without ensuring proper consent for your marketing is a breach of DPA/GDPR (Lawfulness, Consent)."
        }},
        { idRoot: "dg-scenario3", name: "dg-scenario3", correctAnswer: "c", feedback: {
            a: "Incorrect. This potentially violates the 'accuracy' and 'data minimisation' principles. Data should be accurate and not held if not needed.",
            b: "Partially correct on updating, but still collecting unnecessary full addresses might not align with 'data minimisation'.",
            c: "Correct! This addresses accuracy and actively considers 'data minimisation' by questioning the need for excessive data."
        }},
        { idRoot: "dg-scenario4", name: "dg-scenario4", correctAnswer: "b", feedback: {
            a: "Incorrect. The company is responsible for data security ('integrity and confidentiality'). Doing nothing is a severe breach.",
            b: "Correct! This demonstrates accountability. DPA mandates reporting serious breaches to the ICO and potentially affected individuals, and reviewing security policies.",
            c: "Incorrect. Failing to report a significant breach to the ICO and individuals (if high risk) is a violation of DPA obligations."
        }}
    ];

    const checkBtn = document.getElementById('check-data-guardian-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            let allScenariosAnswered = true;
            scenarios.forEach(scenario => {
                const selectedOption = document.querySelector(`input[name="${scenario.name}"]:checked`);
                const feedbackEl = document.getElementById(`${scenario.idRoot}-feedback`); // Corrected ID
                if (!selectedOption) {
                    allScenariosAnswered = false;
                    feedbackEl.innerHTML = `<p class="incorrect-feedback">Please select an answer for this scenario.</p>`;
                } else {
                    const userAnswer = selectedOption.value;
                    feedbackEl.innerHTML = `<p class="${userAnswer === scenario.correctAnswer ? 'correct-feedback' : 'incorrect-feedback'}">${scenario.feedback[userAnswer]}</p>`;
                }
                feedbackEl.classList.remove('hidden');
                setTimeout(() => feedbackEl.classList.add('show'), 10);
            });
            if (!allScenariosAnswered) {
                alert("Please answer all Data Guardian scenarios.");
            }
        });
    }
}

// --- Task 6: Legal Case Pathway Visualizer ---
function initializeCasePathwayVisualizer() {
    const scenarioSelect = document.getElementById('case-scenario-select');
    const displayDiv = document.getElementById('case-pathway-display');
    const pathways = { /* ... pathway data as before ... */ 
        software_piracy: [
            { stage: "Initial Act", detail: "User downloads and installs pirated software.", icon: "fas fa-download" },
            { stage: "Discovery", detail: "Software company identifies illegal use (e.g., audit, IP tracking).", icon: "fas fa-search" },
            { stage: "Legal Action", detail: "Cease and desist letter sent. Potential civil lawsuit for damages under CDPA.", icon: "fas fa-gavel" },
            { stage: "Outcome", detail: "Fines, legal costs. For large scale distribution, criminal charges possible.", icon: "fas fa-file-invoice-dollar" }
        ],
        hacking_profile: [
            { stage: "Initial Act", detail: "Attacker gains unauthorized access to a social media account (e.g., guesses password, phishing).", icon: "fas fa-user-secret" },
            { stage: "Report", detail: "Victim reports to platform and/or police.", icon: "fas fa-bullhorn" },
            { stage: "Investigation", detail: "Platform investigates. Police may investigate depending on severity (e.g., if further crimes committed).", icon: "fas fa-search-plus" },
            { stage: "Legal Action (CMA)", detail: "Potential charges under Computer Misuse Act (Section 1 for access, Section 2 if intent for further offence, Section 3 if data modified/deleted).", icon: "fas fa-balance-scale" },
            { stage: "Outcome", detail: "Warnings, fines, or imprisonment depending on severity and prior record.", icon: "fas fa-gavel" }
        ],
        data_breach_company: [
            { stage: "Incident", detail: "Company experiences a data breach (e.g., hacker, accidental disclosure). Personal data is exposed.", icon: "fas fa-exclamation-triangle" },
            { stage: "Notification", detail: "Under DPA/GDPR, company must notify the Information Commissioner's Office (ICO) within 72 hours if feasible, and affected individuals if high risk.", icon: "fas fa-bell" },
            { stage: "Investigation (ICO)", detail: "ICO investigates the cause, company's security measures, and response.", icon: "fas fa-microscope" },
            { stage: "Enforcement", detail: "ICO can issue warnings, reprimands, orders to comply, and significant fines (up to 4% of global turnover or £17.5 million, whichever is higher).", icon: "fas fa-file-signature" },
            { stage: "Other Consequences", detail: "Reputational damage, loss of customer trust, potential civil claims from affected individuals.", icon: "fas fa-users-slash" }
        ]
    };
    if (scenarioSelect && displayDiv) { // Ensure elements exist
        scenarioSelect.addEventListener('change', function() {
            const selectedPathway = pathways[this.value];
            displayDiv.innerHTML = ''; 
            if (selectedPathway) {
                const ol = document.createElement('ol');
                ol.className = 'list-decimal list-inside space-y-3 text-sm w-full';
                selectedPathway.forEach(step => {
                    const li = document.createElement('li');
                    li.className = 'p-2 bg-purple-100 border border-purple-200 rounded transition-all duration-300 hover:bg-purple-200';
                    li.innerHTML = `<strong class="text-purple-700 block mb-1"><i class="${step.icon} mr-2"></i>${step.stage}:</strong> ${step.detail}`;
                    ol.appendChild(li);
                });
                displayDiv.appendChild(ol);
            } else {
                displayDiv.innerHTML = '<p class="text-gray-500">Select a scenario to see the pathway.</p>';
            }
        });
    }
}

// --- Task 7: Legally Compliant App Design Sim ---
function initializeCompliantDesignSim() {
    const checkButton = document.getElementById('check-compliant-design-btn');
    const feedbackDiv = document.getElementById('compliant-design-feedback');
    
    const questionsConfig = [
        { name: "design-q1-privacy", correctAnswer: "c", laws: "DPA", impactScore: {a: 30, b: 15, c: 0}, feedback: {
            a: "Privacy Policy (DPA): Very High Risk! Collecting excessive data without clear policy and consent breaches DPA principles like data minimisation and transparency.",
            b: "Privacy Policy (DPA): Medium Risk. A hard-to-find policy isn't transparent. Default collection of location/contacts needs explicit, informed consent.",
            c: "Privacy Policy (DPA): Good! Follows data minimisation and transparency. Explicit consent for optional data is key."
        }},
        { name: "design-q2-copyright", correctAnswer: "b", laws: "CDPA", impactScore: {a: 30, b: 0, c: 10}, feedback: {
            a: "Image Use (CDPA): Very High Risk! Using web images without checking licenses is likely copyright infringement.",
            b: "Image Use (CDPA): Good! Respects copyright by using own/licensed content and provides a reporting mechanism.",
            c: "Image Use (CDPA): Medium Risk. Watermarking user's own original photos without their explicit agreement could be problematic. Focus on respecting user's copyright in their own uploads."
        }},
        { name: "design-q3-moderation", correctAnswer: "c", laws: "CMA/Online Safety", impactScore: {a: 25, b: 10, c: 0}, feedback: { // Online Safety Act is emerging, CMA for tools
            a: "Content Moderation (CMA/Safety): High Risk! Ignoring illegal content (e.g. tools for CMA offences, hate speech) can lead to legal issues and harm users.",
            b: "Content Moderation (CMA/Safety): Medium Risk. Reactive moderation is a start, but may not be sufficient for proactive duties under new online safety laws or preventing CMA tool sharing.",
            c: "Content Moderation (CMA/Safety): Good! A mix of proactive and reactive measures is best for tackling illegal/harmful content."
        }},
         { name: "design-q4-cookies", correctAnswer: "c", laws: "DPA/PECR", impactScore: {a: 25, b: 15, c: 0}, feedback: {
            a: "Cookie Usage (DPA/PECR): High Risk! Non-essential cookies require explicit, informed consent. Hiding this in ToS is not compliant.",
            b: "Cookie Usage (DPA/PECR): Medium Risk! 'Accept by using' is not valid consent. Users need clear choices for non-essential cookies.",
            c: "Cookie Usage (DPA/PECR): Good! Clear information and granular opt-in consent for non-essential cookies respects user choice and privacy laws."
        }}
    ];

    if (checkButton && feedbackDiv) {
        checkButton.addEventListener('click', () => {
            let allAnswered = true;
            let totalComplianceScore = 100; // Start with a perfect score
            let feedbackHTML = "<p class='font-semibold mb-2'>SnapShare App Compliance Assessment:</p><ul class='list-disc pl-5 space-y-2 text-sm'>";
            
            questionsConfig.forEach(qConfig => {
                const selectedOption = document.querySelector(`input[name="${qConfig.name}"]:checked`);
                if (!selectedOption) {
                    allAnswered = false;
                } else {
                    const userAnswer = selectedOption.value;
                    totalComplianceScore -= qConfig.impactScore[userAnswer];
                    const isBestPractice = userAnswer === qConfig.correctAnswer;
                    feedbackHTML += `<li class="${isBestPractice ? 'text-green-700' : 'text-red-700'}">${qConfig.feedback[userAnswer]}</li>`;
                }
            });

            if (!allAnswered) {
                alert("Please answer all design questions.");
                feedbackDiv.innerHTML = '<p class="incorrect-feedback">Please make a choice for all design aspects to assess compliance.</p>';
            } else {
                 totalComplianceScore = Math.max(0, totalComplianceScore); // Ensure score isn't negative
                 feedbackHTML += `</ul><p class="mt-3 font-semibold text-lg">Overall Conceptual Compliance Score: <span class="${totalComplianceScore > 70 ? 'text-green-600' : totalComplianceScore > 40 ? 'text-yellow-600' : 'text-red-600'}">${totalComplianceScore}/100</span></p>`;
                 if (totalComplianceScore <= 40) feedbackHTML += "<p class='text-red-700 text-sm'>This app design has significant legal compliance risks!</p>";
                 else if (totalComplianceScore <= 70) feedbackHTML += "<p class='text-yellow-700 text-sm'>This app design has some compliance risks to address.</p>";
                 else feedbackHTML += "<p class='text-green-700 text-sm'>This app design shows good attention to legal compliance, keep it up!</p>";
                 feedbackDiv.innerHTML = feedbackHTML;
            }
            feedbackDiv.classList.remove('hidden');
            setTimeout(() => feedbackDiv.classList.add('show'), 10);
        });
    }
}


// --- Task 8: "Is it Hacking?" Decision Tree (CMA) ---
function initializeHackingTree() {
    const displayNodeEl = document.getElementById('hacking-tree-node-display');
    const choicesEl = document.getElementById('hacking-tree-choices');
    const resetBtn = document.getElementById('reset-hacking-tree-btn');

    const tree = {
        start: { question: "Are you attempting to access or interact with a computer system, program, or data?", yes: "q_permission", no: "end_not_cma_related" },
        q_permission: { question: "Do you have explicit, clear, and provable authorisation (permission) from the system owner for THIS SPECIFIC action?", yes: "q_exceed_permission", no: "end_cma_s1_unauth" },
        q_exceed_permission: { question: "Are your actions strictly within the scope of the authorisation you were given?", yes: "q_intent_authorised", no: "end_cma_s1_exceed" },
        q_intent_authorised: { question: "Is your intent to commit or facilitate another crime (e.g., fraud, theft) using this authorised access?", yes: "end_other_laws", no: "q_modify_authorised" },
        q_modify_authorised: { question: "Are you modifying programs or data, or impairing system operation, in a way that was NOT explicitly authorised for that specific modification?", yes: "end_cma_s3_unauth_mod", no: "end_likely_ok_cma" },
        
        end_not_cma_related: { outcome: "This action might not primarily involve a Computer Misuse Act offence related to access. However, other laws or ethical considerations could still apply." },
        end_cma_s1_unauth: { outcome: "This sounds like potential **Unauthorised Access to Computer Material (Section 1 of CMA)**. Accessing without permission is illegal." },
        end_cma_s1_exceed: { outcome: "Exceeding your given authorisation could be **Unauthorised Access (Section 1 of CMA)** for the parts you weren't permitted to access/do." },
        end_other_laws: { outcome: "While your initial access might be 'authorised', using it to commit other crimes will involve other laws (fraud, theft etc.). If the *access itself* becomes unauthorised due to this intent, CMA Section 2 (access with further criminal intent) could apply." },
        end_cma_s3_unauth_mod: { outcome: "Making unauthorised modifications, impairing the system, or introducing malware is likely an offence under **Section 3 of CMA (Unauthorised acts with intent to impair)**." },
        end_likely_ok_cma: { outcome: "If you have full authorisation for your specific actions and no criminal intent, it's less likely to be a CMA offence. Always ensure clarity of permission." }
    };

    function renderNode(nodeKey) {
        const node = tree[nodeKey];
        if (!displayNodeEl || !choicesEl) return; // Exit if elements not found
        choicesEl.innerHTML = ''; 

        if (node.question) {
            displayNodeEl.innerHTML = `<p class="font-semibold text-gray-800">${node.question}</p>`;
            const yesBtn = document.createElement('button');
            yesBtn.textContent = "Yes";
            yesBtn.className = "check-button-alt no-print";
            yesBtn.onclick = () => renderNode(node.yes);
            
            const noBtn = document.createElement('button');
            noBtn.textContent = "No";
            noBtn.className = "check-button-alt no-print !bg-red-500 hover:!bg-red-600";
            noBtn.onclick = () => renderNode(node.no);

            choicesEl.appendChild(yesBtn);
            choicesEl.appendChild(noBtn);
        } else if (node.outcome) {
            displayNodeEl.innerHTML = `<p class="font-bold text-lg ${node.outcome.includes("CMA") ? 'text-red-700' : 'text-green-700'}">${node.outcome}</p>`;
        }
    }
    if(resetBtn && displayNodeEl && choicesEl) {
       resetBtn.addEventListener('click', () => renderNode('start'));
       renderNode('start'); 
    } else if (displayNodeEl) {
        renderNode('start'); // Fallback if reset button not found initially
    }
}

// --- Task 9: Data Security Risk Explorer (DPA) ---
function initializeSecurityRiskExplorer() {
    const passwordPolicySelect = document.getElementById('secrisk-password-policy');
    const encryptionSelect = document.getElementById('secrisk-encryption');
    const trainingSlider = document.getElementById('secrisk-staff-training');
    const trainingValueEl = document.getElementById('secrisk-staff-training-value');
    const firewallCheckbox = document.getElementById('secrisk-firewall-ids');

    const riskScoreTextEl = document.getElementById('security-risk-score-text');
    const riskMeterBarEl = document.getElementById('risk-meter-bar');
    const dpaComplianceEl = document.getElementById('security-dpa-compliance');
    const riskFeedbackEl = document.getElementById('security-risk-feedback');

    const baseRisk = 0; // Start with 0 risk
    const riskFactors = {
        password: { weak: 30, moderate: 15, strong: 0 }, // Risk points added
        encryption: { none: 30, basic: 15, strong: 0 }, // Risk points added
        trainingMaxRisk: 30, // Max risk points if training is 0%
        firewallPenalty: 10   // Risk points added if NO firewall/IDS
    };

    function updateSecurityRisk() {
        if (!passwordPolicySelect || !encryptionSelect || !trainingSlider || !firewallCheckbox || !riskScoreTextEl || !riskMeterBarEl || !dpaComplianceEl || !riskFeedbackEl) return;

        const passwordSetting = passwordPolicySelect.value;
        const encryptionSetting = encryptionSelect.value;
        const trainingLevel = parseInt(trainingSlider.value); 
        const hasFirewall = firewallCheckbox.checked;

        if(trainingValueEl) trainingValueEl.textContent = trainingLevel;

        let currentRisk = baseRisk;
        currentRisk += riskFactors.password[passwordSetting];
        currentRisk += riskFactors.encryption[encryptionSetting];
        currentRisk += Math.round(riskFactors.trainingMaxRisk * ((100 - trainingLevel) / 100));
        if (!hasFirewall) {
            currentRisk += riskFactors.firewallPenalty;
        }
        
        // Ensure risk is within 0-100
        currentRisk = Math.max(0, Math.min(100, currentRisk)); 

        let riskCategoryText = "";
        let dpaComplianceCategory = "";
        let meterColorClass = "bg-green-500";
        let feedbackMessages = [];

        if (currentRisk >= 67) {
            riskCategoryText = "High Risk";
            dpaComplianceCategory = "Low Compliance";
            meterColorClass = "bg-red-500";
            feedbackMessages.push("Significant vulnerabilities detected! Urgent action needed to protect data and ensure DPA compliance.");
            if(passwordSetting === 'weak') feedbackMessages.push("Weak password policy is a major issue.");
            if(encryptionSetting === 'none') feedbackMessages.push("Lack of data encryption is critical.");
            if(trainingLevel < 50) feedbackMessages.push("Low staff training increases human error risk.");
            if(!hasFirewall) feedbackMessages.push("Missing a firewall/IDS leaves systems exposed.");

        } else if (currentRisk >= 34) {
            riskCategoryText = "Medium Risk";
            dpaComplianceCategory = "Partial Compliance";
            meterColorClass = "bg-yellow-500";
            feedbackMessages.push("Some security gaps exist. Review and improve measures for better DPA alignment.");
             if(passwordSetting === 'moderate') feedbackMessages.push("Consider strengthening password policies.");
            if(encryptionSetting === 'basic') feedbackMessages.push("Evaluate if stronger encryption is needed for all sensitive data.");
             if(trainingLevel < 75 && trainingLevel >=50 ) feedbackMessages.push("Increasing staff training could further reduce risks.");
        } else {
            riskCategoryText = "Low Risk";
            dpaComplianceCategory = "Good Compliance";
            meterColorClass = "bg-green-500";
            feedbackMessages.push("Strong security posture observed, indicating good DPA 'Integrity & Confidentiality' practices.");
             if(passwordSetting === 'strong' && encryptionSetting === 'strong' && trainingLevel >= 75 && hasFirewall) {
                feedbackMessages.push("Excellent all-round security measures!");
            }
        }

        riskScoreTextEl.textContent = riskCategoryText;
        riskMeterBarEl.style.width = `${currentRisk}%`; // Use currentRisk directly for width after clamping
        riskMeterBarEl.className = `risk-meter-bar h-full rounded ${meterColorClass} transition-all duration-300`;
        dpaComplianceEl.textContent = dpaComplianceCategory;
        riskFeedbackEl.innerHTML = feedbackMessages.join("<br>");
    }
    
    [passwordPolicySelect, encryptionSelect, trainingSlider, firewallCheckbox].forEach(el => {
        if (el) el.addEventListener('change', updateSecurityRisk);
    });
    if(trainingSlider) trainingSlider.addEventListener('input', updateSecurityRisk);

    if (passwordPolicySelect) updateSecurityRisk(); // Initial calculation
}


// --- "Mark as Read" Progress ---
let totalReadableSections = 0; let sectionsRead = 0; let readProgressElement = null; let readCheckboxes = [];
function updateReadProgress() {
    if (readProgressElement && totalReadableSections > 0) {
        readProgressElement.textContent = `Sections Read: ${sectionsRead} / ${totalReadableSections}`;
        readProgressElement.classList.remove('opacity-0'); 
    } else if (readProgressElement) { readProgressElement.classList.add('opacity-0');}
}
function initializeReadProgress() {
    readCheckboxes = document.querySelectorAll('.read-checkbox');
    totalReadableSections = readCheckboxes.length;
    readProgressElement = document.getElementById('read-progress');
    sectionsRead = 0;
    readCheckboxes.forEach(cb => { if (cb.checked) sectionsRead++; });
    if (totalReadableSections > 0 && readProgressElement) {
        updateReadProgress();
        readCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                sectionsRead = 0;
                readCheckboxes.forEach(cb => { if (cb.checked) sectionsRead++; });
                updateReadProgress();
            });
        });
    } else if (readProgressElement) { readProgressElement.style.display = 'none'; }
}

// --- Extension Activity Self-Reflection ---
function initializeExtensionActivities() {
    document.querySelectorAll('.reveal-guidance-button').forEach(button => {
        button.addEventListener('click', function() {
            const guidanceDiv = this.nextElementSibling; 
            if (guidanceDiv && guidanceDiv.classList.contains('extension-guidance')) {
                if (!guidanceDiv.id) { guidanceDiv.id = `guidance-${Math.random().toString(36).substr(2, 9)}`; }
                toggleReveal(guidanceDiv.id, this, 'Reveal Key Considerations', 'Hide Key Considerations');
            }
        });
    });
}

// --- Reset All Tasks ---
function resetAllTasks() {
    if (!confirm("Are you sure you want to reset all tasks? Your progress will be lost.")) return;
    
    ['starter-q1-why-laws', 'starter-q2-protect', 'starter-q3-illegal'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    
    document.querySelectorAll('.dpa-scenario-select, .cma-scenario-select, .cdpa-scenario-select').forEach(select => {
        select.value = "";
        select.classList.remove('correct', 'incorrect');
        const scenarioBox = select.closest('.scenario-box');
        if (scenarioBox) {
            const feedbackEl = scenarioBox.querySelector('.feedback');
            if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.classList.remove('show'); feedbackEl.classList.add('hidden'); }
            const textareaEl = scenarioBox.querySelector('textarea');
            if (textareaEl) textareaEl.value = '';
        }
    });
    
    ['exam-q1-leg', 'exam-q2-leg', 'exam-q3-leg'].forEach(id => { 
        const el = document.getElementById(id); if(el) el.value = '';
    });
    ['exam-q1-leg-marks', 'exam-q2-leg-marks', 'exam-q3-leg-marks'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    ['ms-exam-q1-leg', 'ms-exam-q2-leg', 'ms-exam-q3-leg'].forEach(id => {
        const msDiv = document.getElementById(id);
        const msButton = document.querySelector(`button[onclick*="'${id}'"]`);
        if (msDiv && msDiv.classList.contains('show')) {
             msDiv.classList.remove('show');  msDiv.classList.add('hidden');
             if(msButton) msButton.textContent = 'Show Mark Scheme'; 
        }
    });

    // Reset Task 5: Data Guardian Challenge
    for(let i=1; i<=4; i++) { 
        document.querySelectorAll(`input[name="dg-scenario${i}"]`).forEach(rb => rb.checked = false);
        const feedbackEl = document.getElementById(`dg-scenario${i}-feedback`);
        if (feedbackEl) { feedbackEl.innerHTML = ''; feedbackEl.classList.add('hidden'); feedbackEl.classList.remove('show');}
    }

    // Reset Task 6: Case Pathway Visualizer
    if(document.getElementById('case-scenario-select')) document.getElementById('case-scenario-select').value = "";
    if(document.getElementById('case-pathway-display')) document.getElementById('case-pathway-display').innerHTML = '<p class="text-gray-500">Select a scenario to see the pathway.</p>';

    // Reset Task 7: Compliant Design Sim
    ['design-q1-privacy', 'design-q2-copyright', 'design-q3-moderation', 'design-q4-cookies'].forEach(name => {
         document.querySelectorAll(`input[name="${name}"]`).forEach(rb => rb.checked = false);
    });
    const compliantFeedback = document.getElementById('compliant-design-feedback');
    if(compliantFeedback) { compliantFeedback.innerHTML = ''; compliantFeedback.classList.add('hidden'); compliantFeedback.classList.remove('show'); }

    // Reset Task 8: Hacking Tree
    if (typeof initializeHackingTree === "function" && document.getElementById('hacking-tree-node-display')) {
        initializeHackingTree(); 
    }

    // Reset Task 9: Security Risk Explorer
    if(document.getElementById('secrisk-password-policy')) document.getElementById('secrisk-password-policy').value = "moderate";
    if(document.getElementById('secrisk-encryption')) document.getElementById('secrisk-encryption').value = "basic";
    const trainingSlider = document.getElementById('secrisk-staff-training');
    if(trainingSlider) trainingSlider.value = "50"; // Default value
    if(document.getElementById('secrisk-firewall-ids')) document.getElementById('secrisk-firewall-ids').checked = false;
    if (typeof initializeSecurityRiskExplorer === "function") initializeSecurityRiskExplorer(); 

    // Reflection textareas are removed, so no need to reset them.

    document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);
    sectionsRead = 0; 
    if (typeof updateReadProgress === "function") updateReadProgress();


    ['extension-q1-textarea', 'extension-q2-textarea', 'extension-q3-textarea'].forEach(id => {
        const textarea = document.getElementById(id); if (textarea) textarea.value = '';
    });
    document.querySelectorAll('.extension-guidance').forEach(div => {
        if (div.classList.contains('show')) {
            div.classList.remove('show'); div.classList.add('hidden');
            const button = div.previousElementSibling; 
            if (button && button.classList.contains('reveal-guidance-button')) {
                button.textContent = 'Reveal Key Considerations';
            }
        }
    });
    
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
        html2canvas:  { scale: 2, logging: false, useCORS: true, scrollY: -window.scrollY, ignoreElements: (el) => el.classList.contains('no-print-pdf') },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } 
    };
    const revealableSelector = '.feedback-area, .mark-scheme, .extension-guidance, #compliant-design-feedback, #dg-scenario1-feedback, #dg-scenario2-feedback, #dg-scenario3-feedback, #dg-scenario4-feedback, #case-pathway-display ol, #hacking-tree-node-display p, #security-risk-results';
    const revealableElements = document.querySelectorAll(revealableSelector);
    const initiallyHiddenOrShown = [];
    revealableElements.forEach(el => {
        const wasHidden = el.classList.contains('hidden') || !el.classList.contains('show');
        initiallyHiddenOrShown.push({element: el, wasHidden: wasHidden});
        if(el.closest('.task-container')){ 
            el.classList.remove('hidden'); 
            el.classList.add('show');    
        }
    });
    const exportButton = document.getElementById('export-pdf-button');
    const resetButton = document.getElementById('reset-all-tasks');
    const readProgressElemForPdf = document.getElementById('read-progress');
    if (exportButton) exportButton.classList.add('no-print-pdf');
    if (resetButton) resetButton.classList.add('no-print-pdf');
    if (readProgressElemForPdf) readProgressElemForPdf.classList.add('no-print-pdf');

    html2pdf().from(element).set(opt).save().then(function() {
        initiallyHiddenOrShown.forEach(item => {
            if(item.wasHidden) { item.element.classList.remove('show'); item.element.classList.add('hidden');}
        });
        if (exportButton) exportButton.classList.remove('no-print-pdf');
        if (resetButton) resetButton.classList.remove('no-print-pdf');
        if (readProgressElemForPdf) readProgressElemForPdf.classList.remove('no-print-pdf');
    }).catch(function(error){
        console.error("Error generating PDF:", error);
        initiallyHiddenOrShown.forEach(item => {
             if(item.wasHidden) { item.element.classList.remove('show'); item.element.classList.add('hidden');}
        });
        if (exportButton) exportButton.classList.remove('no-print-pdf');
        if (resetButton) resetButton.classList.remove('no-print-pdf');
        if (readProgressElemForPdf) readProgressElemForPdf.classList.remove('no-print-pdf');
    });
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    initializeExtensionActivities();
    initializeReadProgress(); 

    initializeDataGuardianChallenge();
    initializeCasePathwayVisualizer();
    initializeCompliantDesignSim();
    initializeHackingTree();
    initializeSecurityRiskExplorer();

    const resetAllTasksButton = document.getElementById('reset-all-tasks');
    if(resetAllTasksButton) resetAllTasksButton.addEventListener('click', resetAllTasks);

    const exportPdfButton = document.getElementById('export-pdf-button');
    if(exportPdfButton) exportPdfButton.addEventListener('click', exportToPDF);
});