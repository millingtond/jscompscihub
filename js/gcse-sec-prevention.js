// --- Global Score Variables ---
let currentScore = 0;
let totalPossibleScore = 0;
const scoreDisplay = document.getElementById('current-score');
const totalScoreDisplay = document.getElementById('total-possible-score');

 // --- Task 6: Firewall Simulation ---
 const firewallSimBtn = document.getElementById('run-firewall-sim');
 const firewallVisual = document.getElementById('firewall-visual');
 const firewallSimArea = document.querySelector('.firewall-sim');
 // Check if elements exist before adding event listeners
 if (firewallSimBtn && firewallVisual && firewallSimArea) {
     firewallSimBtn.addEventListener('click', () => {
         // Clear any existing packets
         firewallSimArea.querySelectorAll('.packet').forEach(p => p.remove());
         firewallVisual.classList.remove('active'); // Reset firewall visual state

         // Define packets for the simulation
         const packets = [
             { type: 'good', icon: 'fa-envelope', delay: 0 }, // Good packet
             { type: 'bad', icon: 'fa-skull-crossbones', delay: 200 }, // Bad packet
             { type: 'good', icon: 'fa-file-alt', delay: 400 }, // Good packet
             { type: 'bad', icon: 'fa-user-secret', delay: 600 }, // Bad packet
         ];

         // Create and append packet elements
         packets.forEach((p, index) => {
             const packetEl = document.createElement('div');
             packetEl.className = `packet ${p.type} start-left`;
             packetEl.style.top = `${20 + index * 20}%`; // Stagger packets vertically
             packetEl.innerHTML = `<i class="fas ${p.icon}"></i>`;
             packetEl.style.transitionDelay = `${p.delay}ms`; // Stagger animation start
             firewallSimArea.appendChild(packetEl);
         });

         // Activate firewall and move packets after a short delay
         setTimeout(() => {
             firewallVisual.classList.add('active'); // Show the firewall wall
             firewallSimArea.querySelectorAll('.packet').forEach(packetEl => {
                 if (packetEl.classList.contains('good')) {
                     packetEl.classList.add('move-right'); // Good packets pass through
                 } else {
                     packetEl.classList.add('blocked'); // Bad packets get blocked
                 }
             });
         }, 800); // Delay matches packet creation stagger

         // Disable button during simulation to prevent spamming
         firewallSimBtn.disabled = true;
         setTimeout(() => {
             firewallSimBtn.disabled = false; // Re-enable button after simulation ends
         }, 2500);
     });
 }

 // --- Task 2: Attack Matching ---
 const attackItems = document.querySelectorAll('#attack-list .match-item');
 const attackDescs = document.querySelectorAll('#attack-desc-list .match-desc');
 const checkAttacksBtn = document.getElementById('check-attacks-btn');
 const resetAttacksBtn = document.getElementById('reset-attacks');
 let selectedAttack = null; // Currently selected attack term
 let selectedAttackDesc = null; // Currently selected description
 let attackPairs = {}; // Stores matched pairs { attackId: descId }

 // Function to reset the attack matching activity
 function resetAttackMatching() {
     selectedAttack = null;
     selectedAttackDesc = null;
     attackPairs = {};
     // Reset styling and state for attack terms
     attackItems.forEach(i => {
         i.classList.remove('selected', 'correct', 'incorrect', 'opacity-70');
         const fb = i.querySelector('.feedback');
         if(fb) fb.textContent='';
         i.style.pointerEvents = 'auto'; // Make clickable again
         delete i.dataset.answered;
         delete i.dataset.answeredCorrectly;
     });
     // Reset styling and state for descriptions
     attackDescs.forEach(d => {
         d.classList.remove('selected', 'correct', 'incorrect', 'opacity-70');
         d.disabled = false; // Make clickable again
         d.style.pointerEvents = 'auto';
     });
     if(checkAttacksBtn) checkAttacksBtn.disabled = false; // Enable check button
     const feedbackEl = document.getElementById('attack-match-feedback');
     if (feedbackEl) feedbackEl.textContent = ''; // Clear overall feedback
 }

 // Add click listeners to attack terms
 attackItems.forEach(item => {
     item.addEventListener('click', () => {
         if (item.dataset.answered === 'true') return; // Ignore if already checked
         if (selectedAttack) selectedAttack.classList.remove('selected'); // Deselect previous
         selectedAttack = item;
         selectedAttack.classList.add('selected'); // Select current
         tryPairAttack(); // Attempt to pair with selected description
     });
 });

 // Add click listeners to descriptions
 attackDescs.forEach(desc => {
     desc.addEventListener('click', () => {
         if (desc.disabled) return; // Ignore if already paired
         if (selectedAttackDesc) selectedAttackDesc.classList.remove('selected'); // Deselect previous
         selectedAttackDesc = desc;
         selectedAttackDesc.classList.add('selected'); // Select current
         tryPairAttack(); // Attempt to pair with selected attack term
     });
 });

 // Function to try pairing the selected term and description
 function tryPairAttack() {
     if (selectedAttack && selectedAttackDesc) {
         const attackId = selectedAttack.dataset.match;
         const descId = selectedAttackDesc.dataset.answer;
         attackPairs[attackId] = descId; // Store the pair

         // Visually indicate the pair and disable them
         selectedAttackDesc.disabled = true;
         selectedAttack.style.pointerEvents = 'none';
         selectedAttack.classList.add('opacity-70');
         selectedAttackDesc.classList.add('opacity-70');

         // Deselect them
         selectedAttack.classList.remove('selected');
         selectedAttackDesc.classList.remove('selected');
         selectedAttack = null;
         selectedAttackDesc = null;
     }
 }

 // Add click listener to the "Check Matches" button
 if (checkAttacksBtn) {
     checkAttacksBtn.addEventListener('click', () => {
         let correctCount = 0;
         attackItems.forEach(item => {
             const attackId = item.dataset.match;
             const selectedDescId = attackPairs[attackId]; // Get the user's chosen description ID
             const feedbackDiv = item.querySelector('.feedback');
             item.style.pointerEvents = 'none'; // Disable after checking
             item.classList.remove('opacity-70'); // Remove temporary styling

             const correspondingDesc = document.querySelector(`.match-desc[data-answer="${selectedDescId}"]`);
             if(correspondingDesc) {
                 correspondingDesc.disabled = true; // Ensure paired description is disabled
                 correspondingDesc.classList.remove('opacity-70');
             }

             // Check if the match is correct
             if (attackId === selectedDescId) {
                 item.classList.add('correct');
                 if(correspondingDesc) correspondingDesc.classList.add('correct');
                 if(feedbackDiv) {
                     feedbackDiv.textContent = 'Correct!';
                     feedbackDiv.className = 'feedback correct fade-in text-xs';
                 }
                 item.dataset.answeredCorrectly = 'true';
                 correctCount++;
             } else {
                 item.classList.add('incorrect');
                 if(correspondingDesc) correspondingDesc.classList.add('incorrect');
                 if(feedbackDiv) {
                     feedbackDiv.textContent = 'Incorrect';
                     feedbackDiv.className = 'feedback incorrect fade-in text-xs';
                 }
                 item.dataset.answeredCorrectly = 'false';
                 // Highlight the correct description if the user was wrong
                 const correctDesc = document.querySelector(`.match-desc[data-answer="${attackId}"]`);
                 if(correctDesc) correctDesc.classList.add('correct');
             }
             item.dataset.answered = 'true'; // Mark as answered
         });
         const feedbackEl = document.getElementById('attack-match-feedback');
         if (feedbackEl) feedbackEl.textContent = `You matched ${correctCount} out of 6 correctly.`;
         checkAttacksBtn.disabled = true; // Disable check button after checking
     });
 }

 // Add click listener to the "Reset Matching" button
 if(resetAttacksBtn) resetAttacksBtn.addEventListener('click', resetAttackMatching);


// --- Task 3: DoS Attack Simulation ---
 const dosSimContainer = document.getElementById('dos-sim-container');
 const dosServer = document.getElementById('dos-server');
 const normalTrafficBtn = document.getElementById('run-normal-traffic');
 const dosAttackBtn = document.getElementById('run-dos-attack');
 let dosInterval = null; // Interval ID for packet generation

 // Function to clear existing DoS packets and reset server state
 function clearDoSPackets() {
     if (dosInterval) clearInterval(dosInterval); // Stop generating packets
     if(dosSimContainer) dosSimContainer.querySelectorAll('.dos-packet').forEach(p => p.remove()); // Remove visual packets
     if(dosServer) dosServer.classList.remove('overloaded'); // Reset server visual state
 }

 // Function to create a single packet element
 function createPacket(isAttack = false) {
     if (!dosSimContainer) return;
     const packet = document.createElement('div');
     packet.className = `dos-packet ${isAttack ? 'attack' : 'normal'}`;
     packet.innerHTML = `<i class="fas ${isAttack ? 'fa-bolt' : 'fa-paper-plane'}"></i>`; // Different icons for attack/normal
     packet.style.top = `${Math.random() * 80 + 10}%`; // Random vertical position
     dosSimContainer.appendChild(packet);

     // Animate packet movement
     setTimeout(() => { packet.classList.add('move'); }, 50); // Start moving right
     setTimeout(() => { packet.classList.add('hit'); setTimeout(() => packet.remove(), 500); }, 1050); // Fade out and remove after reaching target
 }

 // Event listener for "Simulate Normal Traffic" button
 if(normalTrafficBtn) {
     normalTrafficBtn.addEventListener('click', () => {
         clearDoSPackets(); // Clear previous simulation
         dosInterval = setInterval(() => createPacket(false), 500); // Generate normal packets at intervals
         setTimeout(clearDoSPackets, 5000); // Stop simulation after 5 seconds
     });
 }

 // Event listener for "Simulate DoS Attack" button
 if(dosAttackBtn) {
     dosAttackBtn.addEventListener('click', () => {
         clearDoSPackets(); // Clear previous simulation
         if(dosServer) dosServer.classList.add('overloaded'); // Make server look overloaded
         dosInterval = setInterval(() => createPacket(true), 50); // Generate attack packets frequently
         setTimeout(() => { clearDoSPackets(); }, 5000); // Stop simulation after 5 seconds
     });
 }


// --- Task 4: SQL Injection Challenge ---
const sqlChoices = document.querySelectorAll('.sql-choice');
sqlChoices.forEach(choice => {
    choice.addEventListener('click', () => {
        const parentItem = choice.closest('.quiz-item');
        if (!parentItem || parentItem.dataset.answered === 'true') return; // Ignore if already answered

        const buttons = parentItem.querySelectorAll('.sql-choice');
        buttons.forEach(btn => btn.disabled = true); // Disable both buttons

        const selectedAnswer = choice.dataset.answer;
        const correctAnswer = parentItem.dataset.correct;
        const feedbackDiv = parentItem.querySelector('.feedback');
        let explanation = ''; // To store explanation text

        if (selectedAnswer === correctAnswer) {
            // Correct answer selected
            feedbackDiv.textContent = 'Correct!';
            feedbackDiv.className = 'feedback correct fade-in w-full text-right text-xs mt-1';
            choice.classList.add('correct');
            parentItem.dataset.answeredCorrectly = 'true';
            // Get explanation based on whether it was dangerous or safe
            if (correctAnswer === 'dangerous' && parentItem.dataset.explanationDangerous) {
                explanation = parentItem.dataset.explanationDangerous;
            } else if (correctAnswer === 'safe' && parentItem.dataset.explanationSafe) {
                explanation = parentItem.dataset.explanationSafe;
            }
            // Append explanation if available
            if(explanation) feedbackDiv.innerHTML += `<span class='sql-explanation'> (${explanation})</span>`;
        } else {
            // Incorrect answer selected
            choice.classList.add('incorrect');
            parentItem.dataset.answeredCorrectly = 'false';
            // Highlight the correct button
            const correctButton = parentItem.querySelector(`.sql-choice[data-answer="${correctAnswer}"]`);
            if (correctButton) correctButton.classList.add('correct');
            // Get explanation for the correct answer
            if (correctAnswer === 'dangerous' && parentItem.dataset.explanationDangerous) {
                explanation = `Incorrect. This input is dangerous because: ${parentItem.dataset.explanationDangerous}`;
            } else if (correctAnswer === 'safe' && parentItem.dataset.explanationSafe) {
                explanation = `Incorrect. This input is safe. ${parentItem.dataset.explanationSafe}`;
            } else {
                explanation = `Incorrect. The correct answer is ${correctAnswer}.`; // Fallback explanation
            }
            feedbackDiv.textContent = explanation;
            feedbackDiv.className = 'feedback incorrect fade-in w-full text-right text-xs mt-1';
        }
        parentItem.dataset.answered = 'true'; // Mark as answered
    });
});

// --- Task 5: Phishing Email Analysis ---
const suspiciousElements = document.querySelectorAll('.phishing-email .suspicious');
const phishingFeedbackSummary = document.getElementById('phishing-feedback-summary');
let phishingFoundCount = 0; // Count of correctly identified items
const totalSuspicious = suspiciousElements.length; // Total number of suspicious items
const phishingTaskDiv = document.getElementById('phishing-sim'); // The main container for the task

suspiciousElements.forEach(el => {
    el.addEventListener('click', () => {
        if (el.classList.contains('clicked')) return; // Ignore if already clicked

        el.classList.add('clicked'); // Mark as clicked
        phishingFoundCount++;

        // Display the reason why it's suspicious
        const reason = el.dataset.reason;
        const reasonEl = document.createElement('span');
        reasonEl.className = 'suspicious-feedback block'; // Apply styling for the reason
        reasonEl.textContent = `(${reason})`;
        // Insert the reason after the clicked element
        el.parentNode.insertBefore(reasonEl, el.nextSibling);

        updatePhishingSummary(); // Update the summary text

        // Mark the element as answered correctly for scoring
        el.dataset.answered = 'true';
        el.dataset.answeredCorrectly = 'true'; // Mark individual item

        // If all items are found, mark the entire task container as answered (for score calculation logic)
        if(phishingFoundCount === totalSuspicious && phishingTaskDiv) {
            phishingTaskDiv.dataset.answered = 'true';
            // We don't set answeredCorrectly on the container, score calc relies on counting clicked items
        }
    });
});

// Function to update the summary feedback text
function updatePhishingSummary() {
    if(phishingFeedbackSummary) {
        phishingFeedbackSummary.textContent = `You found ${phishingFoundCount} out of ${totalSuspicious} suspicious items.`;
        // Add correct/incorrect class based on whether all items were found
        phishingFeedbackSummary.className = phishingFoundCount === totalSuspicious ? 'feedback correct' : 'feedback';
    }
}


// --- Task 8: Physical Security ---
const checkPhysicalBtn = document.getElementById('check-physical-btn');
const physicalOptions = document.querySelectorAll('#physical-security-quiz .multi-select-option');
const physicalFeedback = document.getElementById('physical-feedback');
const physicalQuizDiv = document.getElementById('physical-security-quiz'); // Container for scoring

// Add click listeners to toggle selection before checking
physicalOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Only allow toggling if the question hasn't been marked yet
        if (physicalQuizDiv && physicalQuizDiv.dataset.answered !== 'true') {
            option.classList.toggle('selected');
        }
    });
});

// Add click listener for the "Check Answers" button
if (checkPhysicalBtn && physicalQuizDiv) {
    checkPhysicalBtn.addEventListener('click', () => {
        let score = 0;
        const totalCorrectOptions = Array.from(physicalOptions).filter(opt => opt.dataset.correct === 'true').length;
        let correctSelections = 0; // Count of correctly selected options
        let incorrectSelections = 0; // Count of incorrectly selected options

        physicalOptions.forEach(option => {
            option.disabled = true; // Disable options after checking
            const isCorrect = option.dataset.correct === 'true';
            const isSelected = option.classList.contains('selected');

            if (isSelected && isCorrect) {
                option.classList.add('correct');
                correctSelections++;
            } else if (isSelected && !isCorrect) {
                option.classList.add('incorrect');
                incorrectSelections++;
            } else if (!isSelected && isCorrect) {
                // Highlight correct options the user missed
                option.classList.add('not-selected', 'correct');
            }
        });

        // Calculate score: correct selections minus incorrect selections (minimum 0)
        score = Math.max(0, correctSelections - incorrectSelections);
        const maxPoints = parseInt(physicalQuizDiv.dataset.points || 0, 10);
        score = Math.min(score, maxPoints); // Ensure score doesn't exceed max points

        // Store score and answered state on the container
        physicalQuizDiv.dataset.currentScore = score; // Store the calculated score
        physicalQuizDiv.dataset.answered = 'true';
        // Mark as fully correct only if all correct were selected and no incorrect were selected
        physicalQuizDiv.dataset.answeredCorrectly = (correctSelections === totalCorrectOptions && incorrectSelections === 0).toString();

        // Display feedback
        if (physicalFeedback) {
            physicalFeedback.textContent = `You correctly identified ${correctSelections} out of ${totalCorrectOptions} physical measures. ${incorrectSelections > 0 ? `(${incorrectSelections} incorrect selections)` : ''} Score: ${score}/${maxPoints}`;
            physicalFeedback.className = (correctSelections === totalCorrectOptions && incorrectSelections === 0) ? 'feedback correct' : 'feedback incorrect';
        }
        checkPhysicalBtn.disabled = true; // Disable check button
    });
}


 // --- Task 9: Authentication & Passwords - Password Strength ---
 const passwordInput = document.getElementById('password-input');
 const strengthBar = document.getElementById('strength-bar');
 const strengthText = document.getElementById('strength-text');
 // References to the checklist items
 const checkLength = document.getElementById('check-length');
 const checkUpper = document.getElementById('check-upper');
 const checkLower = document.getElementById('check-lower');
 const checkNumber = document.getElementById('check-number');
 const checkSymbol = document.getElementById('check-symbol');

 // Add input event listener to the password field
 if (passwordInput && strengthBar && strengthText && checkLength && checkUpper && checkLower && checkNumber && checkSymbol) {
     passwordInput.addEventListener('input', () => {
         const pass = passwordInput.value;
         let score = 0;
         let feedback = '';

         // Check password criteria
         const hasLength = pass.length >= 8;
         const hasUpper = /[A-Z]/.test(pass);
         const hasLower = /[a-z]/.test(pass);
         const hasNumber = /[0-9]/.test(pass);
         const hasSymbol = /[\W_]/.test(pass); // Matches non-word characters or underscore

         // Increment score for each met criterion
         if (hasLength) score++;
         if (hasUpper) score++;
         if (hasLower) score++;
         if (hasNumber) score++;
         if (hasSymbol) score++;

         // Update checklist visuals (strikethrough if met)
         checkLength.style.textDecoration = hasLength ? 'line-through' : 'none';
         checkUpper.style.textDecoration = hasUpper ? 'line-through' : 'none';
         checkLower.style.textDecoration = hasLower ? 'line-through' : 'none';
         checkNumber.style.textDecoration = hasNumber ? 'line-through' : 'none';
         checkSymbol.style.textDecoration = hasSymbol ? 'line-through' : 'none';

         // Update strength bar width and color based on score
         let widthPercent = (score / 5) * 100;
         strengthBar.style.width = `${widthPercent}%`;

         if (score <= 2) {
             feedback = 'Weak';
             strengthBar.style.backgroundColor = '#ef4444'; // Red
             strengthText.className = 'strength-text weak';
         } else if (score <= 4) {
             feedback = 'Medium';
             strengthBar.style.backgroundColor = '#f59e0b'; // Amber
             strengthText.className = 'strength-text medium';
         } else {
             feedback = 'Strong';
             strengthBar.style.backgroundColor = '#10b981'; // Green
             strengthText.className = 'strength-text strong';
         }
         // Update strength feedback text
         strengthText.textContent = `Strength: ${feedback}`;
     });
 }

// --- Task 11: Threat Prevention Grid ---
 const shieldIcon = document.querySelector('.shield-icon.draggable'); // Ensure we select the draggable one
 const gridDropZones = document.querySelectorAll('.threat-grid td.drop-zone');
 const checkGridBtn = document.getElementById('check-grid-btn');
 const gridFeedback = document.getElementById('grid-feedback');
 const resetGridBtn = document.getElementById('reset-grid-btn');
 let draggedShield = null; // Reference to the shield being dragged
 let gridAnswers = {}; // Stores user's placements { 'threat-prevention': true }
 const gridContainer = document.getElementById('threat-grid-task'); // Container for scoring
 const MAX_GRID_POINTS = document.querySelectorAll('.threat-grid td[data-correct="true"]').length; // Calculate max score

 // Add drag listeners to the draggable shield icon
 if (shieldIcon) {
     shieldIcon.addEventListener('dragstart', (e) => {
         draggedShield = e.target; // Store reference to the dragged element
         // Add dragging class for visual feedback (slight delay for browser rendering)
         setTimeout(() => e.target.classList.add('dragging'), 0);
         e.dataTransfer.effectAllowed = 'copy'; // Indicate copying is allowed
     });
     shieldIcon.addEventListener('dragend', () => {
         // Remove dragging class when drag ends (slight delay)
         setTimeout(() => {
             if(draggedShield) draggedShield.classList.remove('dragging');
             draggedShield = null; // Clear reference
         }, 0);
     });
 }

 // Add listeners to each drop zone (grid cell)
 gridDropZones.forEach(zone => {
     // Prevent default behavior to allow dropping
     zone.addEventListener('dragover', (e) => {
         e.preventDefault();
         // Add visual feedback when dragging over an available zone
         if (!zone.dataset.answered && zone.children.length === 0) { // Only highlight if not answered and empty
             zone.classList.add('drag-over');
             e.dataTransfer.dropEffect = 'copy'; // Set cursor effect
         } else {
             e.dataTransfer.dropEffect = 'none'; // Prevent dropping if answered or filled
         }
     });
     // Remove visual feedback when dragging leaves the zone
     zone.addEventListener('dragleave', () => {
         zone.classList.remove('drag-over');
     });
     // Handle the drop event
     zone.addEventListener('drop', (e) => {
         e.preventDefault();
         zone.classList.remove('drag-over');
         // Check if a shield is being dragged, the zone is empty, and not already answered
         if (draggedShield && zone.children.length === 0 && !zone.dataset.answered) {
             const newShield = shieldIcon.cloneNode(true); // Clone the shield icon
             newShield.classList.remove('dragging', 'draggable'); // Make it non-draggable
             newShield.draggable = false;
             newShield.style.cursor = 'default'; // Change cursor
             zone.appendChild(newShield); // Add the cloned shield to the cell
             // Record the placement
             const key = `${zone.dataset.threat}-${zone.dataset.prevention}`;
             gridAnswers[key] = true;
         }
     });
     // Allow clicking to remove a placed shield *before* checking answers
     zone.addEventListener('click', () => {
         if (zone.children.length > 0 && !zone.dataset.answered) {
             const key = `${zone.dataset.threat}-${zone.dataset.prevention}`;
             delete gridAnswers[key]; // Remove from answers
             zone.innerHTML = ''; // Remove the shield icon
         }
     });
 });

 // Add listener for the "Check Grid" button
 if (checkGridBtn && gridContainer) {
     checkGridBtn.addEventListener('click', () => {
         let correctPlacements = 0;
         let incorrectPlacements = 0;

         gridDropZones.forEach(zone => {
             zone.dataset.answered = 'true'; // Mark cell as answered
             const hasShield = zone.children.length > 0;
             const shouldHaveShield = zone.dataset.correct === 'true';
             const icon = zone.querySelector('i'); // Get the icon if present

             // Clear previous feedback classes
             zone.classList.remove('correct', 'incorrect', 'missed', 'drag-over');
             // Reset icon class if it exists
             if (icon) icon.className = 'fas fa-shield-alt text-blue-500';

             // Evaluate the placement
             if (hasShield && shouldHaveShield) {
                 // Correct placement
                 zone.classList.add('correct');
                 if(icon) icon.className = 'fas fa-check text-green-600'; // Change icon to checkmark
                 correctPlacements++;
                 zone.dataset.answeredCorrectly = 'true'; // Mark individual cell - might not be needed for score calc
             } else if (hasShield && !shouldHaveShield) {
                 // Incorrect placement
                 zone.classList.add('incorrect');
                 if(icon) icon.className = 'fas fa-times text-red-600'; // Change icon to cross
                 incorrectPlacements++;
                 zone.dataset.answeredCorrectly = 'false';
             } else if (!hasShield && shouldHaveShield) {
                 // Missed correct placement
                 zone.classList.add('missed');
                 zone.dataset.answeredCorrectly = 'false';
             } else {
                 // Correctly left empty
                 zone.dataset.answeredCorrectly = 'false';
             }
         });

         // Calculate score (correct - incorrect, min 0, max MAX_GRID_POINTS)
         const gridScore = Math.max(0, correctPlacements - incorrectPlacements);
         const finalGridScore = Math.min(gridScore, MAX_GRID_POINTS);

         // Store score and state on the container
         gridContainer.dataset.points = MAX_GRID_POINTS; // Store max points possible
         gridContainer.dataset.currentScore = finalGridScore; // Store calculated score
         gridContainer.dataset.answered = 'true';
         gridContainer.dataset.answeredCorrectly = (finalGridScore === MAX_GRID_POINTS && incorrectPlacements === 0).toString();

         // Display feedback
         if(gridFeedback) {
             gridFeedback.textContent = `You correctly placed ${correctPlacements} shields, with ${incorrectPlacements} incorrect placements. Score: ${finalGridScore}/${MAX_GRID_POINTS}`;
             gridFeedback.className = (finalGridScore === MAX_GRID_POINTS && incorrectPlacements === 0) ? 'feedback correct' : 'feedback incorrect';
         }

         // Disable check button, enable reset button
         checkGridBtn.disabled = true;
         if(resetGridBtn) resetGridBtn.disabled = false;
     });
 }

 // Add listener for the "Reset Grid" button
 if(resetGridBtn && gridContainer) {
     resetGridBtn.addEventListener('click', () => {
         gridDropZones.forEach(zone => {
             zone.innerHTML = ''; // Clear icons
             zone.classList.remove('correct', 'incorrect', 'drag-over', 'missed'); // Clear styles
             delete zone.dataset.answered; // Reset state
             delete zone.dataset.answeredCorrectly;
         });
         gridAnswers = {}; // Clear stored answers
         if(gridFeedback) gridFeedback.textContent = ''; // Clear feedback text
         if(checkGridBtn) checkGridBtn.disabled = false; // Enable check button
         resetGridBtn.disabled = true; // Disable reset button

         // Reset scoring attributes on container
         delete gridContainer.dataset.currentScore;
         delete gridContainer.dataset.answered;
         delete gridContainer.dataset.answeredCorrectly;
     });
     resetGridBtn.disabled = true; // Initially disabled
 }


 // --- Task 14: Key Definitions Matching ---
 const termItems = document.querySelectorAll('#term-list .match-item');
 const definitionItems = document.querySelectorAll('#definition-list .match-desc');
 const resetDefsBtn = document.getElementById('reset-definitions');
 const definitionFeedbackEl = document.getElementById('definition-match-feedback');
 let selectedTerm = null; // Currently selected term
 let selectedDef = null; // Currently selected definition
 let matchedDefsCount = 0; // Count of matched pairs

 // Function to reset the definition matching activity
 function resetDefinitionMatching() {
     selectedTerm = null;
     selectedDef = null;
     matchedDefsCount = 0;
     // Reset term items
     termItems.forEach(t => {
         t.classList.remove('selected', 'correct', 'incorrect');
         const fb = t.querySelector('.feedback');
         if(fb) fb.textContent='';
         t.style.pointerEvents = 'auto'; // Make clickable
         delete t.dataset.answered;
         delete t.dataset.answeredCorrectly;
     });
     // Reset definition items
     definitionItems.forEach(d => {
         d.classList.remove('selected', 'correct', 'incorrect');
         d.disabled = false; // Make clickable
     });
     if(definitionFeedbackEl) definitionFeedbackEl.textContent = ''; // Clear overall feedback
 }

 // Add click listeners to term items
 termItems.forEach(term => {
     term.addEventListener('click', () => {
         if (term.dataset.answered === 'true') return; // Ignore if already matched
         if (selectedTerm) selectedTerm.classList.remove('selected'); // Deselect previous
         selectedTerm = term;
         selectedTerm.classList.add('selected'); // Select current
         checkDefinitionMatch(); // Attempt to match
     });
 });

 // Add click listeners to definition items
 definitionItems.forEach(def => {
     def.addEventListener('click', () => {
         if (def.disabled) return; // Ignore if already matched
         if (selectedDef) selectedDef.classList.remove('selected'); // Deselect previous
         selectedDef = def;
         selectedDef.classList.add('selected'); // Select current
         checkDefinitionMatch(); // Attempt to match
     });
 });

 // Function to check if the selected term and definition match
 function checkDefinitionMatch() {
     if (selectedTerm && selectedDef) {
         const termId = selectedTerm.dataset.match;
         const defAnswer = selectedDef.dataset.answer;
         const isMatch = (termId === defAnswer); // Check if IDs match
         const feedbackDiv = selectedTerm.querySelector('.feedback');

         // Apply correct/incorrect styling
         selectedTerm.classList.add(isMatch ? 'correct' : 'incorrect');
         selectedDef.classList.add(isMatch ? 'correct' : 'incorrect');

         // Provide feedback on the term item
         if(feedbackDiv) {
             feedbackDiv.textContent = isMatch ? 'Correct!' : 'Incorrect';
             feedbackDiv.className = `feedback ${isMatch ? 'correct' : 'incorrect'} fade-in text-xs`;
         }

         // Mark term as answered and store correctness
         selectedTerm.dataset.answeredCorrectly = isMatch ? 'true' : 'false';
         selectedTerm.dataset.answered = 'true';

         // Disable both items after matching attempt
         selectedTerm.style.pointerEvents = 'none';
         selectedDef.disabled = true;

         // Increment match count if correct
         if (isMatch) matchedDefsCount++;

         // Update overall feedback if all are matched
         if (matchedDefsCount === termItems.length && definitionFeedbackEl) {
             definitionFeedbackEl.textContent = 'All definitions matched!';
             definitionFeedbackEl.className = 'feedback correct';
         }

         // Deselect both after a short delay
         const termToDeselect = selectedTerm;
         const defToDeselect = selectedDef;
         setTimeout(() => {
             termToDeselect?.classList.remove('selected');
             defToDeselect?.classList.remove('selected');
         }, 600);

         // Clear selection variables
         selectedTerm = null;
         selectedDef = null;
     }
 }

 // Add click listener to the "Reset Matching" button
 if(resetDefsBtn) resetDefsBtn.addEventListener('click', resetDefinitionMatching);

// --- Task 16: Exam Practice Questions ---
const feedbackButtons = document.querySelectorAll('.show-feedback-btn');
feedbackButtons.forEach(button => {
    button.addEventListener('click', () => {
        const feedbackId = button.dataset.feedbackId;
        const feedbackDiv = document.getElementById(feedbackId);
        if (feedbackDiv) {
            // Toggle visibility of the feedback div
            feedbackDiv.classList.toggle('hidden');
            // Change button text accordingly
            button.textContent = feedbackDiv.classList.contains('hidden') ? 'Show Feedback' : 'Hide Feedback';
        }
    });
});


// --- Function to handle general single-choice quiz item clicks ---
// (Excludes multi-select, matching, SQL injection which have custom handlers)
function handleGeneralQuizClick(quizItem) {
    // Ensure it's not part of a complex task already handled elsewhere
    if (quizItem.closest('#physical-security-quiz') ||
        quizItem.closest('#forms-of-attack') ||
        quizItem.closest('#definitions-match') ||
        quizItem.closest('#sql-injection-task') ||
        quizItem.closest('#threat-grid-task') ||
        quizItem.closest('#phishing-sim')) {
        return;
    }

    const options = quizItem.querySelectorAll('.option-button:not(.multi-select-option):not(.sql-choice)'); // Select only standard buttons
    const feedbackDiv = quizItem.querySelector('.feedback');
    const correctAnswer = quizItem.dataset.correct;

    if (!options.length || !feedbackDiv || !correctAnswer) return; // Exit if essential elements are missing

    options.forEach(option => {
        option.addEventListener('click', () => {
            if (quizItem.dataset.answered === 'true') return; // Ignore if already answered

            // Disable all options for this question
            options.forEach(opt => {
                opt.disabled = true;
                opt.classList.remove('selected'); // Remove selected class from others
            });

            const selectedAnswer = option.dataset.answer || option.dataset.type; // Get the answer value
            option.classList.add('selected'); // Mark the clicked option as selected

            // Check if the selected answer is correct
            if (selectedAnswer === correctAnswer) {
                feedbackDiv.textContent = 'Correct!';
                feedbackDiv.className = 'feedback correct fade-in';
                option.classList.add('correct');
                quizItem.dataset.answeredCorrectly = 'true';
            } else {
                // Incorrect answer
                let incorrectMsg = `Incorrect. The correct answer is ${correctAnswer.replace(/_/g, ' ').replace(/-/g, ' ')}.`; // Default incorrect message
                // Use custom feedback if provided
                if (quizItem.dataset.incorrectFeedback) {
                    incorrectMsg = quizItem.dataset.incorrectFeedback;
                }
                feedbackDiv.textContent = incorrectMsg;
                feedbackDiv.className = 'feedback incorrect fade-in';
                option.classList.add('incorrect');
                // Highlight the correct button
                const correctButton = quizItem.querySelector(`.option-button[data-answer="${correctAnswer}"], .option-button[data-type="${correctAnswer}"]`);
                if (correctButton) correctButton.classList.add('correct');
                quizItem.dataset.answeredCorrectly = 'false';
            }
            quizItem.dataset.answered = 'true'; // Mark the question as answered
        });
    });
}
 // Apply the general handler to all elements with class 'quiz-item'
 document.querySelectorAll('.quiz-item').forEach(handleGeneralQuizClick);


// --- Progress Summary ---
const calculateScoreBtn = document.getElementById('calculate-score-btn');

// Function to calculate the maximum possible score from all scorable items
function calculateMaxPossibleScore() {
    let total = 0;
    // Select all elements that contribute points (individual items or containers)
    const allScorableItems = document.querySelectorAll('[data-points]');
    allScorableItems.forEach(item => {
        // Special handling for phishing task container - points = number of suspicious elements
        if (item.id === 'phishing-sim') {
            total += item.querySelectorAll('.suspicious').length;
        }
        // Special handling for threat grid container - points = number of correct cells defined in HTML
        else if (item.id === 'threat-grid-task') {
             total += document.querySelectorAll('.threat-grid td[data-correct="true"]').length;
        }
        // Special handling for physical security container
        else if (item.id === 'physical-security-quiz') {
             total += parseInt(item.dataset.points || 0, 10); // Use the points defined on the container
        }
        // Standard items: add the value from data-points if it's not inside a container already counted
        else if (!item.closest('#phishing-sim') && !item.closest('#threat-grid-task') && !item.closest('#physical-security-quiz')) {
             total += parseInt(item.dataset.points || 0, 10);
        }
    });
    totalPossibleScore = total;
    if(totalScoreDisplay) totalScoreDisplay.textContent = totalPossibleScore; // Update display
}

// Function to calculate the user's current score based on answered items
function calculateCurrentScore() {
    currentScore = 0;

    // --- Handle Container Scores (Grid, Physical Security) ---
    const scoredContainers = document.querySelectorAll('#threat-grid-task[data-answered="true"], #physical-security-quiz[data-answered="true"]');
    scoredContainers.forEach(container => {
        currentScore += parseInt(container.dataset.currentScore || 0, 10);
    });

    // --- Handle Phishing Score ---
    const phishingContainer = document.getElementById('phishing-sim');
    if (phishingContainer) { // Check if the container exists
        const clickedSuspicious = phishingContainer.querySelectorAll('.suspicious.clicked').length;
        currentScore += clickedSuspicious; // Add 1 point per clicked item
    }

    // --- Handle Standard Quiz Items and Matching Items ---
    // Select items that are answered, marked correct, and have points defined
    // Exclude items within the containers already scored
    const individualCorrectItems = document.querySelectorAll('.quiz-item[data-answered-correctly="true"][data-points], .match-item[data-answered-correctly="true"][data-points]');
    individualCorrectItems.forEach(item => {
        // Ensure the item is not inside a container whose score was already added
        if (!item.closest('#threat-grid-task') && !item.closest('#physical-security-quiz') && !item.closest('#phishing-sim')) {
             currentScore += parseInt(item.dataset.points || 0, 10);
        }
    });


    // Ensure score doesn't exceed max possible (edge case safeguard)
    currentScore = Math.min(currentScore, totalPossibleScore);
    currentScore = Math.max(0, currentScore); // Ensure score is not negative

    // Update score display
    if(scoreDisplay) scoreDisplay.textContent = currentScore;
    if(totalScoreDisplay) totalScoreDisplay.textContent = totalPossibleScore; // Ensure total is also up-to-date
}


// Add event listener to the score calculation button
if (calculateScoreBtn) {
    calculateScoreBtn.addEventListener('click', calculateCurrentScore);
}

// Run initial calculations and setup when the page loads
document.addEventListener('DOMContentLoaded', () => {
    calculateMaxPossibleScore(); // Calculate the total possible score initially
    // Initialize matching states (reset visuals)
    if (typeof resetAttackMatching === 'function') resetAttackMatching();
    if (typeof resetDefinitionMatching === 'function') resetDefinitionMatching();
    // Reset grid if needed
    if (resetGridBtn && typeof resetGridBtn.click === 'function') resetGridBtn.click(); // Click reset to ensure clean state

    // Initialize AI marking buttons if marking-script.js is loaded and defines the function
    // Assumes marking-script.js defines initializeAiMarking()
    if (typeof initializeAiMarking === 'function') {
        initializeAiMarking();
    } else {
        console.warn("marking-script.js or initializeAiMarking function not found. AI marking buttons will not work.");
        // Optionally disable AI buttons if script fails to load
        document.querySelectorAll('[id^="mark_q"]').forEach(btn => {
            if(btn) { // Check if button exists before modifying
                btn.disabled = true;
                btn.title = "AI Marking script not loaded";
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        });
    }
    // Initial score calculation display
    calculateCurrentScore();
});
