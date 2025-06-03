// --- Helper: Toggle Reveal (for mark schemes, extension guidance, accordion etc.) ---
function toggleReveal(contentId, buttonElement, revealText, hideText) {
    const content = document.getElementById(contentId);
    if (!content) {
        if (buttonElement && buttonElement.classList.contains('accordion-button')) {
            const accordionContent = buttonElement.nextElementSibling;
            if (accordionContent && accordionContent.classList.contains('accordion-content')) {
                const icon = buttonElement.querySelector('.accordion-icon');
                const isOpening = !accordionContent.classList.contains('show');

                // Close other open accordions in the same container
                const container = buttonElement.closest('.accordion-container');
                if (isOpening && container) {
                    container.querySelectorAll('.accordion-content.show').forEach(openContent => {
                        if (openContent !== accordionContent) {
                            openContent.classList.remove('show');
                            openContent.style.maxHeight = null; // Reset for CSS transition
                            const openButton = openContent.previousElementSibling;
                            if(openButton) {
                                const openIcon = openButton.querySelector('.accordion-icon');
                                if (openIcon) openIcon.classList.remove('rotate-180');
                            }
                        }
                    });
                }
                
                // Toggle current accordion
                if (accordionContent.classList.contains('show')) {
                    accordionContent.classList.remove('show');
                    accordionContent.style.maxHeight = null; 
                    if (icon) icon.classList.remove('rotate-180');
                } else {
                    accordionContent.classList.add('show');
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                    if (icon) icon.classList.add('rotate-180');
                }
            }
        }
        return;
    }
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        content.style.maxHeight = null; 
        if (buttonElement && revealText) buttonElement.textContent = revealText;
    } else {
        content.classList.add('show');
        content.style.maxHeight = content.scrollHeight + "px";
        if (buttonElement && hideText) buttonElement.textContent = hideText;
    }
}
        
// --- Task 1: License Sorter Task ---
const licenseBankItems = [
    { id: "item1", text: "Source code distributed with software", category: "opensource" },
    { id: "item2", text: "Customer can modify source code", category: "opensource" },
    { id: "item3", text: "Customer can redistribute (often with same license terms)", category: "opensource" },
    { id: "item4", text: "Can be free of charge or paid (focus is on freedom/access)", category: "opensource" },
    { id: "item5", text: "Modifications made may need to be shared publicly", category: "opensource" },
    { id: "item6", text: "Often requires crediting previous contributors", category: "opensource" },
    { id: "item7", text: "Licence restricts copying, modifying, & distributing", category: "proprietary" },
    { id: "item8", text: "Source code is NOT made available (compiled code only)", category: "proprietary" }
];
let draggedLicenseItem = null;

function initializeLicenseSorter() {
    const bank = document.getElementById('license-bank');
    const proprietaryZone = document.getElementById('proprietary-dropzone');
    const opensourceZone = document.getElementById('opensource-dropzone');
    const feedbackEl = document.getElementById('license-sorter-feedback');

    if (!bank || !proprietaryZone || !opensourceZone) return;

    bank.innerHTML = ''; 
    licenseBankItems.sort(() => Math.random() - 0.5).forEach(item => {
        const div = document.createElement('div');
        div.id = item.id;
        div.textContent = item.text;
        div.className = 'sorter-item';
        div.draggable = true;
        div.dataset.category = item.category;
        div.addEventListener('dragstart', handleLicenseDragStart);
        bank.appendChild(div);
    });

    [proprietaryZone, opensourceZone, bank].forEach(zone => {
        zone.addEventListener('dragover', handleLicenseDragOver);
        zone.addEventListener('dragleave', handleLicenseDragLeave);
        zone.addEventListener('drop', handleLicenseDrop);
    });
    
    if(feedbackEl){
        feedbackEl.innerHTML = '';
        feedbackEl.classList.add('hidden');
        feedbackEl.classList.remove('show');
    }
}
function handleLicenseDragStart(e) {
    draggedLicenseItem = e.target;
    e.dataTransfer.setData('text/plain', e.target.id);
    draggedLicenseItem.classList.add('dragging');
}
function handleLicenseDragOver(e) {
    e.preventDefault();
    if (e.currentTarget.classList.contains('sorter-dropzone')) {
        e.currentTarget.classList.add('dragover');
    }
}
function handleLicenseDragLeave(e) {
    if (e.currentTarget.classList.contains('sorter-dropzone')) {
        e.currentTarget.classList.remove('dragover');
    }
}
function handleLicenseDrop(e) {
    e.preventDefault();
    if (e.currentTarget.classList.contains('sorter-dropzone') && draggedLicenseItem) {
        if (e.currentTarget === draggedLicenseItem.parentNode) {
            draggedLicenseItem.classList.remove('dragging');
            e.currentTarget.classList.remove('dragover');
            draggedLicenseItem = null;
            return;
        }
        e.currentTarget.appendChild(draggedLicenseItem);
        draggedLicenseItem.classList.remove('correct', 'incorrect'); 
    }
    if(e.currentTarget.classList.contains('sorter-dropzone')) e.currentTarget.classList.remove('dragover');
    if(draggedLicenseItem) draggedLicenseItem.classList.remove('dragging');
    draggedLicenseItem = null;
}
function checkLicenseSorter() {
    const proprietaryZone = document.getElementById('proprietary-dropzone');
    const opensourceZone = document.getElementById('opensource-dropzone');
    const bank = document.getElementById('license-bank');
    const feedbackEl = document.getElementById('license-sorter-feedback');
    let allCorrectInZones = true;
    let itemsInZones = 0;

    [proprietaryZone, opensourceZone].forEach(zone => {
        zone.querySelectorAll('.sorter-item').forEach(item => {
            itemsInZones++;
            item.classList.remove('correct', 'incorrect'); 
            const expectedCategory = zone.id.includes('proprietary') ? 'proprietary' : 'opensource';
            if (item.dataset.category === expectedCategory) {
                item.classList.add('correct');
            } else {
                item.classList.add('incorrect');
                allCorrectInZones = false;
            }
        });
    });

    if (bank.children.length > 0) {
        feedbackEl.innerHTML = '<p class="incorrect-feedback">Please drag all items from the bank to a category.</p>';
    } else if (itemsInZones < licenseBankItems.length) {
         feedbackEl.innerHTML = '<p class="incorrect-feedback">Not all items have been placed in a category yet.</p>';
    }
     else if (allCorrectInZones) {
        feedbackEl.innerHTML = '<p class="correct-feedback">All items sorted correctly! Well done.</p>';
    } else {
        feedbackEl.innerHTML = '<p class="incorrect-feedback">Some items are in the wrong category. Review the highlighted items.</p>';
    }
    feedbackEl.classList.remove('hidden');
    setTimeout(() => feedbackEl.classList.add('show'), 10);
}
function resetLicenseSorter() {
    initializeLicenseSorter(); 
}

// Accordion Quick Checks
function initializeAccordionQuickChecks() {
    document.querySelectorAll('.quick-check').forEach(qcContainer => {
        const buttons = qcContainer.querySelectorAll('.quick-check-btn');
        const feedbackEl = qcContainer.querySelector('.quick-check-feedback');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Clear previous button selections in this quick check
                buttons.forEach(btn => btn.classList.remove('selected', 'correct', 'incorrect'));
                button.classList.add('selected');

                const isCorrect = button.dataset.answer === 'true';
                if (isCorrect) {
                    button.classList.add('correct');
                    feedbackEl.textContent = "Correct!";
                    feedbackEl.className = "quick-check-feedback text-sm mt-1 correct-feedback";
                } else {
                    button.classList.add('incorrect');
                    feedbackEl.textContent = "Not quite. Think about the definition again.";
                    feedbackEl.className = "quick-check-feedback text-sm mt-1 incorrect-feedback";
                }
            });
        });
    });
}


// --- Task 2: Licence Compatibility Checker (Simplified) ---
function initializeCompatibilityChecker() {
    const projectTypeSelect = document.getElementById('project-type-select');
    const componentTypeSelect = document.getElementById('component-type-select');
    const checkBtn = document.getElementById('check-compatibility-btn');
    const feedbackDiv = document.getElementById('compatibility-feedback');

    const compatibilityRules = {
        proprietary: { // If Your Project is Proprietary
            component_proprietary: "Okay: You can usually use another proprietary component if you have purchased a valid licence that permits its use in your project.",
            component_os_sharealike: "Warning (High Risk!): Integrating this type of open source component (which requires derivatives to also be open source) usually means your ENTIRE proprietary project would also need to become open source under similar terms. This is generally not compatible with a proprietary model.",
            component_os_permissive: "Generally Okay: Permissive open source components can often be used in proprietary projects. You MUST still comply with their licence terms, which usually require keeping their original copyright notices and licence text.",
            component_public_domain: "Okay: Public domain code has no copyright restrictions and can be freely used in any type of project."
        },
        opensource_general: { // If Your Project is Open Source (general)
            component_proprietary: "Generally Not Allowed/Problematic: Including a proprietary, closed-source component in an open source project is often not possible or severely restricts how your open source project can be shared, unless the proprietary component's licence specifically allows this (which is rare).",
            component_os_sharealike: "Okay: This component fits well. If your project uses it, your whole project will also need to be licensed under similar open source terms that require sharing alike.",
            component_os_permissive: "Okay: This component can be easily included. Your open source project can maintain its chosen open source licence. Remember to include the component's copyright notices.",
            component_public_domain: "Okay: Public domain code can be freely used in your open source project."
        }
    };

    if (checkBtn && projectTypeSelect && componentTypeSelect && feedbackDiv) {
        checkBtn.addEventListener('click', () => {
            const projectType = projectTypeSelect.value;
            const componentType = componentTypeSelect.value;
            let message = "Select options to see compatibility feedback.";

            if (projectType && componentType && compatibilityRules[projectType] && compatibilityRules[projectType][componentType]) {
                message = compatibilityRules[projectType][componentType];
            }
            
            let messageClass = 'text-gray-700'; // Default
            if (message.includes('Warning') || message.includes('Not Allowed')) {
                messageClass = 'text-red-700';
            } else if (message.includes('Okay')) {
                messageClass = 'text-green-700';
            } else if (message.includes('Caution')) {
                messageClass = 'text-yellow-700';
            }

            feedbackDiv.innerHTML = `<p class="${messageClass}">${message}</p>`;
            feedbackDiv.classList.remove('hidden');
            setTimeout(() => feedbackDiv.classList.add('show'), 10);
        });
    }
}

// --- Task 3: Choosing the Right Path - Business Model --- (New Task)
function initializeBusinessModelChooser() {
    const suggestBtn = document.getElementById('suggest-business-model-btn');
    const suggestionDiv = document.getElementById('business-model-suggestion');

    if (suggestBtn && suggestionDiv) {
        suggestBtn.addEventListener('click', () => {
            const q1 = document.querySelector('input[name="bm-q1-revenue"]:checked');
            const q2 = document.querySelector('input[name="bm-q2-control"]:checked');
            const q3 = document.querySelector('input[name="bm-q3-sourcecode"]:checked');

            if (!q1 || !q2 || !q3) {
                alert("Please answer all questions to get a suggestion.");
                suggestionDiv.innerHTML = `<p class="incorrect-feedback">Please answer all questions.</p>`;
                suggestionDiv.classList.remove('hidden');
                setTimeout(() => suggestionDiv.classList.add('show'), 10);
                return;
            }

            let proprietaryScore = 0; let openSourceScore = 0;
            if (q1.value === 'direct_sales') proprietaryScore++; else openSourceScore++;
            if (q2.value === 'full_control') proprietaryScore++; else openSourceScore++;
            if (q3.value === 'secret_ip') proprietaryScore++; else openSourceScore++;

            let suggestionHTML = "";
            if (proprietaryScore > openSourceScore) {
                suggestionHTML = "<h5 class='font-semibold text-sky-700'>Suggestion: Lean towards a Proprietary Licence Model</h5>";
                suggestionHTML += "<p class='text-sm'>Your goals (e.g., maximizing direct sales, full control, secret IP) align well with a proprietary model. This allows you to directly charge for software use and maintain tight control over development and intellectual property.</p>";
                suggestionHTML += "<p class='text-xs mt-1'><strong>Consider:</strong> This can mean slower community growth and higher development costs initially.</p>";
            } else if (openSourceScore > proprietaryScore) {
                suggestionHTML = "<h5 class='font-semibold text-green-700'>Suggestion: Lean towards an Open Source Licence Model</h5>";
                suggestionHTML += "<p class='text-sm'>Your goals (e.g., rapid community building, collaborative development, transparency) fit well with an open source model. Revenue can come from support, services, or premium features.</p>";
                 suggestionHTML += "<p class='text-xs mt-1'><strong>Consider:</strong> You'll need to choose an appropriate open source licence (e.g., permissive like MIT or copyleft like GPL) which will define how others can use and contribute. Direct revenue from the software itself is less common.</p>";
            } else {
                suggestionHTML = "<h5 class='font-semibold text-purple-700'>Suggestion: Consider a Hybrid or Carefully Chosen Model</h5>";
                suggestionHTML += "<p class='text-sm'>Your goals have a mix of proprietary and open-source leanings. You might explore 'open core' models (core free, features paid), dual licensing, or a very permissive open source licence alongside paid services.</p>";
                 suggestionHTML += "<p class='text-xs mt-1'><strong>Consider:</strong> This requires careful strategic planning to balance openness with revenue or control objectives.</p>";
            }
            suggestionDiv.innerHTML = suggestionHTML;
            suggestionDiv.classList.remove('hidden');
            setTimeout(() => suggestionDiv.classList.add('show'), 10);
        });
    }
}

// --- Task 4 (was Task 3): Exam Practice Question Logic ---
// Renamed toggleMarkScheme to avoid conflicts.
function toggleLicenceMarkScheme(markSchemeId, textareaId, marksInputId, minLength = 10) {
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

// --- "Mark as Read" Progress ---
// ... (Keep existing initializeReadProgress and updateReadProgress functions)
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
// ... (Keep existing initializeExtensionActivities function)
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

// Accordion for "Main Licence Categories"
function initializeAccordions() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pass null for buttonElement, revealText, hideText to let toggleReveal handle content only
            toggleReveal(null, button, null, null);
        });
    });
}

// --- Reset All Tasks (Updated) ---
function resetAllTasks() {
    if (!confirm("Are you sure you want to reset all tasks? Your progress will be lost.")) return;
    
    ['starter-q1-free', 'starter-q2-rules'].forEach(id => { // starter-q3-example was removed based on content focus
        const el = document.getElementById(id); if (el) el.value = '';
    });
    
    resetLicenseSorter(); 

    // Reset Accordion Quick Checks
    document.querySelectorAll('.quick-check').forEach(qcContainer => {
        qcContainer.querySelectorAll('.quick-check-btn').forEach(btn => btn.classList.remove('selected', 'correct', 'incorrect'));
        const feedbackEl = qcContainer.querySelector('.quick-check-feedback');
        if (feedbackEl) feedbackEl.textContent = '';
    });
    // Close all accordions
    document.querySelectorAll('.accordion-content.show').forEach(openContent => {
        openContent.classList.remove('show');
        openContent.style.maxHeight = null;
        const openButton = openContent.previousElementSibling;
        if(openButton) {
           const openIcon = openButton.querySelector('.accordion-icon');
           if (openIcon) openIcon.classList.remove('rotate-180');
        }
    });

    // Reset Task 2: Licence Compatibility Checker
    if(document.getElementById('project-licence-type')) document.getElementById('project-licence-type').selectedIndex = 0;
    if(document.getElementById('component-licence-type')) document.getElementById('component-licence-type').selectedIndex = 0;
    const compatibilityFeedback = document.getElementById('compatibility-feedback');
    if(compatibilityFeedback) {compatibilityFeedback.innerHTML = ''; compatibilityFeedback.classList.add('hidden'); compatibilityFeedback.classList.remove('show');}

    // Reset Task 3: Business Model Chooser
    ['bm-q1-revenue', 'bm-q2-control', 'bm-q3-sourcecode'].forEach(name => {
        document.querySelectorAll(`input[name="${name}"]`).forEach(rb => rb.checked = false);
    });
    const businessModelSuggestion = document.getElementById('business-model-suggestion');
    if(businessModelSuggestion) {businessModelSuggestion.innerHTML = ''; businessModelSuggestion.classList.add('hidden'); businessModelSuggestion.classList.remove('show');}


    // Reset Exam Practice (Task 4)
    ['exam-q1-lic', 'exam-q2-lic'].forEach(id => { 
        const el = document.getElementById(id); if(el) el.value = '';
    });
    ['exam-q1-lic-marks', 'exam-q2-lic-marks'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    ['ms-exam-q1-lic', 'ms-exam-q2-lic'].forEach(id => {
        const msDiv = document.getElementById(id);
        const msButton = document.querySelector(`button[onclick*="'${id}'"]`);
        if (msDiv && msDiv.classList.contains('show')) {
             msDiv.classList.remove('show');  msDiv.classList.add('hidden');
             if(msButton) msButton.textContent = 'Show Mark Scheme'; 
        }
    });
    
    document.querySelectorAll('.read-checkbox').forEach(checkbox => checkbox.checked = false);
    sectionsRead = 0; 
    if (typeof updateReadProgress === "function") updateReadProgress();

    ['extension-eula-research', 'extension-gpl-research', 'extension-audit-research'].forEach(id => {
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
// ... (PDF Export function from previous response, ensure it handles new feedback area IDs if any) ...
function exportToPDF() {
    alert("Preparing PDF. This might take a moment. Please ensure pop-ups are allowed. Interactive elements might not be fully captured in their current state.");
    const element = document.querySelector('.max-w-4xl.mx-auto.bg-white'); 
    const opt = {
        margin:       [0.5, 0.5, 0.7, 0.5], 
        filename:     'gcse-ethics-licences-lesson.pdf',
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 2, logging: false, useCORS: true, scrollY: -window.scrollY, ignoreElements: (el) => el.classList.contains('no-print-pdf') },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } 
    };
    
    const revealableSelector = '.feedback-area, .mark-scheme, .extension-guidance, #license-sorter-feedback, .accordion-content, #compatibility-feedback, #business-model-suggestion, .quick-check-feedback';
    const revealableElements = document.querySelectorAll(revealableSelector);
    const initiallyHiddenOrShown = [];

    revealableElements.forEach(el => {
        const wasHidden = el.classList.contains('hidden') || !el.classList.contains('show') || el.style.maxHeight === '0px';
        initiallyHiddenOrShown.push({element: el, wasHidden: wasHidden, originalMaxHeight: el.style.maxHeight});
        
        el.classList.remove('hidden'); 
        el.classList.add('show');
        if (el.classList.contains('accordion-content') || el.classList.contains('feedback-area') || el.classList.contains('mark-scheme') || el.classList.contains('extension-guidance')) {
             el.style.maxHeight = el.scrollHeight + "px"; // Ensure full height for PDF
        }
    });
     document.querySelectorAll('.accordion-icon').forEach(icon => { // Show accordion icons as open
        if(!icon.classList.contains('rotate-180')) icon.classList.add('rotate-180');
     });
    
    const exportButton = document.getElementById('export-pdf-button');
    const resetButton = document.getElementById('reset-all-tasks');
    const readProgressElemForPdf = document.getElementById('read-progress');
    if (exportButton) exportButton.classList.add('no-print-pdf');
    if (resetButton) resetButton.classList.add('no-print-pdf');
    if (readProgressElemForPdf) readProgressElemForPdf.classList.add('no-print-pdf');

    html2pdf().from(element).set(opt).save().then(function() {
        initiallyHiddenOrShown.forEach(item => {
            if(item.wasHidden) { 
                item.element.classList.remove('show'); 
                item.element.classList.add('hidden');
                item.element.style.maxHeight = item.originalMaxHeight || null;
            }
        });
         document.querySelectorAll('.accordion-icon.rotate-180').forEach(icon => {
            const content = icon.closest('.accordion-button').nextElementSibling;
            const originalState = initiallyHiddenOrShown.find(item => item.element === content);
            if(originalState && originalState.wasHidden) { // Only revert if it was originally closed
                icon.classList.remove('rotate-180');
            }
        });
        if (exportButton) exportButton.classList.remove('no-print-pdf');
        if (resetButton) resetButton.classList.remove('no-print-pdf');
        if (readProgressElemForPdf) readProgressElemForPdf.classList.remove('no-print-pdf');
    }).catch(function(error){
        console.error("Error generating PDF:", error);
        initiallyHiddenOrShown.forEach(item => {
             if(item.wasHidden) { 
                item.element.classList.remove('show'); 
                item.element.classList.add('hidden');
                item.element.style.maxHeight = item.originalMaxHeight || null;
            }
        });
         document.querySelectorAll('.accordion-icon.rotate-180').forEach(icon => {
            const content = icon.closest('.accordion-button').nextElementSibling;
            const originalState = initiallyHiddenOrShown.find(item => item.element === content);
            if(originalState && originalState.wasHidden) {
                icon.classList.remove('rotate-180');
            }
        });
        if (exportButton) exportButton.classList.remove('no-print-pdf');
        if (resetButton) resetButton.classList.remove('no-print-pdf');
        if (readProgressElemForPdf) readProgressElemForPdf.classList.remove('no-print-pdf');
    });
}


// --- DOMContentLoaded (Updated) ---
document.addEventListener('DOMContentLoaded', () => {
    initializeLicenseSorter(); // Task 1
    
    const checkLicenseSortBtn = document.getElementById('check-license-sort-btn');
    if(checkLicenseSortBtn) checkLicenseSortBtn.addEventListener('click', checkLicenseSorter);
    const resetLicenseSortBtn = document.getElementById('reset-license-sort-btn');
    if(resetLicenseSortBtn) resetLicenseSortBtn.addEventListener('click', resetLicenseSorter);
    
    initializeAccordions(); // For Main Licence Concepts section
    initializeAccordionQuickChecks(); // For the T/F questions within accordions

    initializeCompatibilityChecker(); // New Task 2
    initializeBusinessModelChooser(); // New Task 3
    // Exam Practice is Task 4 now, its JS is toggleLicenceMarkScheme in HTML onclick.
    
    initializeExtensionActivities();
    initializeReadProgress();

    const resetAllTasksButton = document.getElementById('reset-all-tasks');
    if(resetAllTasksButton) resetAllTasksButton.addEventListener('click', resetAllTasks);

    const exportPdfButton = document.getElementById('export-pdf-button');
    if(exportPdfButton) exportPdfButton.addEventListener('click', exportToPDF);
});