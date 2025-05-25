let totalPossibleScore = 0;
        let currentScore = 0;
        let scoreCalculated = false;

        function handleOptionClick(button, quizItem) {
            const correctAnswer = quizItem.dataset.correct;
            const selectedAnswer = button.dataset.answer;
            const feedbackEl = quizItem.querySelector('.feedback:not(.inline-feedback)');
            const options = quizItem.querySelectorAll('.option-button');
            const points = parseInt(quizItem.dataset.points || 0);

            options.forEach(opt => opt.disabled = true);
            button.classList.add('selected');

            if (selectedAnswer === correctAnswer) {
                button.classList.add('correct');
                if (feedbackEl) feedbackEl.textContent = 'Correct!';
                if (feedbackEl) feedbackEl.className = 'feedback correct';
                if (!quizItem.dataset.answeredCorrectly) {
                    quizItem.dataset.answeredCorrectly = 'true';
                }
            } else {
                button.classList.add('incorrect');
                let correctAnswerText = correctAnswer;
                options.forEach(opt => {
                    if (opt.dataset.answer === correctAnswer) {
                        correctAnswerText = `"${opt.textContent.trim() || opt.innerText.trim()}"`;
                    }
                });
                 if (feedbackEl) feedbackEl.textContent = `Incorrect. The correct answer was ${correctAnswerText}.`;
                 if (feedbackEl) feedbackEl.className = 'feedback incorrect';
                quizItem.dataset.answeredCorrectly = 'false';
                options.forEach(opt => {
                    if (opt.dataset.answer === correctAnswer) {
                        opt.classList.add('correct');
                        opt.classList.remove('selected');
                    }
                });
            }
            if (scoreCalculated) { calculateScore(); }
        }

        document.querySelectorAll('.quiz-item .option-button').forEach(button => {
            button.addEventListener('click', () => {
                const quizItem = button.closest('.quiz-item');
                if (quizItem && !button.closest('#characteristics-sort') && !button.closest('#capacity-sort') && !quizItem.querySelector('.option-button:disabled')) {
                    handleOptionClick(button, quizItem);
                }
            });
        });

        let draggedItem = null;

        function initializeDraggables() {
            document.querySelectorAll('.draggable').forEach(draggable => {
                draggable.removeEventListener('dragstart', handleDragStart);
                draggable.removeEventListener('dragend', handleDragEnd);
                draggable.addEventListener('dragstart', handleDragStart);
                draggable.addEventListener('dragend', handleDragEnd);
            });
        }

        function handleDragStart(e) {
            draggedItem = e.target.classList.contains('draggable') ? e.target : e.target.closest('.draggable');
            if (!draggedItem) return;
            try {
                 e.dataTransfer.setData('text/plain', draggedItem.id);
                 e.dataTransfer.effectAllowed = "move";
            } catch (error) {
                 console.error("Error setting drag data:", error);
            }
            setTimeout(() => { if(draggedItem) draggedItem.classList.add('dragging'); }, 0);
        }

        function handleDragEnd() {
             if (draggedItem) { draggedItem.classList.remove('dragging'); }
            draggedItem = null;
        }

        document.querySelectorAll('.dropzone').forEach(zone => {
            zone.addEventListener('dragover', e => {
                e.preventDefault();
                let allowDrop = true;
                if (zone.classList.contains('characteristics-column') && zone.querySelectorAll('.characteristics-item').length > 0) {
                    allowDrop = false;
                }
                if (zone.classList.contains('capacity-slot') && zone.querySelectorAll('.capacity-item').length > 0) {
                     allowDrop = false;
                }

                if (allowDrop) {
                     e.dataTransfer.dropEffect = 'move';
                     zone.classList.add('dragover');
                } else {
                     e.dataTransfer.dropEffect = 'none';
                     zone.classList.remove('dragover');
                }
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('dragover');
            });
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('dragover');
                const droppedItemId = e.dataTransfer.getData('text/plain');
                const localDraggedItem = document.getElementById(droppedItemId);

                if (localDraggedItem) {
                    const taskSection = zone.closest('section');
                    // Allow drop only if item and zone are in the same task section
                    if (!taskSection || !localDraggedItem.closest('section') || taskSection.id !== localDraggedItem.closest('section').id) {
                        console.log("Item dropped in wrong task section.");
                        draggedItem = null;
                        return;
                    }

                    if (taskSection.id === 'characteristics-sort') {
                        if (zone.classList.contains('characteristics-column')) {
                            if (zone.querySelectorAll('.characteristics-item').length === 0) {
                                zone.appendChild(localDraggedItem);
                                clearCharacteristicsFeedback();
                                const quizItem = zone.closest('.quiz-item');
                                if(quizItem) quizItem.dataset.answeredCorrectly = 'pending';
                            }
                        } else if (zone.id === 'characteristics-pool') {
                            zone.appendChild(localDraggedItem);
                            clearCharacteristicsFeedback();
                            document.querySelectorAll('#characteristics-sort .characteristics-column').forEach(colZone => {
                                const quizItem = colZone.closest('.quiz-item');
                                if (quizItem) quizItem.dataset.answeredCorrectly = 'pending';
                            });
                        }
                    }
                    else if (taskSection.id === 'capacity-sort') {
                         if (zone.classList.contains('capacity-slot')) {
                             if (zone.querySelectorAll('.capacity-item').length === 0) {
                                 zone.appendChild(localDraggedItem);
                                 clearCapacitySortFeedback();
                                 const quizItem = zone.closest('.quiz-item');
                                 if(quizItem) quizItem.dataset.answeredCorrectly = 'pending';
                             }
                         } else if (zone.id === 'capacity-pool') {
                              zone.appendChild(localDraggedItem);
                              clearCapacitySortFeedback();
                              const quizItem = zone.closest('.quiz-item');
                              if(quizItem) quizItem.dataset.answeredCorrectly = 'pending';
                         }
                    }
                }
                 draggedItem = null;
            });
        });


        function clearCharacteristicsFeedback() {
             document.querySelectorAll('#characteristics-sort .feedback').forEach(fb => { fb.textContent = ''; fb.className = 'feedback'; });
             document.querySelectorAll('#characteristics-sort .characteristics-item').forEach(item => { item.classList.remove('correct', 'incorrect'); });
             document.querySelectorAll('#characteristics-sort .characteristics-column').forEach(zone => {
                 const quizItem = zone.closest('.quiz-item');
                 if (quizItem) delete quizItem.dataset.answeredCorrectly;
             });
        }
        function checkCharacteristicsSort() {
            clearCharacteristicsFeedback();
            let overallCorrect = true;
            const pool = document.getElementById('characteristics-pool');
            const itemsInPool = pool.querySelectorAll('.characteristics-item').length;

            document.querySelectorAll('#characteristics-sort .characteristics-column').forEach(zone => {
                const feedbackEl = zone.querySelector('.feedback');
                const quizItem = zone.closest('.quiz-item');
                const acceptedType = zone.dataset.accept;
                const itemsInZone = zone.querySelectorAll('.characteristics-item');
                let isCorrect = false;

                if (itemsInZone.length === 1) {
                    const item = itemsInZone[0];
                    if (item.dataset.type === acceptedType) {
                        item.classList.add('correct');
                        feedbackEl.textContent = 'Correct!';
                        feedbackEl.className = 'feedback correct';
                        isCorrect = true;
                    } else {
                        item.classList.add('incorrect');
                        feedbackEl.textContent = 'Incorrect definition.';
                        feedbackEl.className = 'feedback incorrect';
                        overallCorrect = false;
                    }
                } else if (itemsInZone.length > 1) {
                    feedbackEl.textContent = 'Too many definitions here.';
                    feedbackEl.className = 'feedback incorrect';
                    itemsInZone.forEach(item => item.classList.add('incorrect'));
                    overallCorrect = false;
                } else {
                    feedbackEl.textContent = 'Missing definition.';
                    feedbackEl.className = 'feedback incorrect';
                     overallCorrect = false;
                }
                 if(quizItem) quizItem.dataset.answeredCorrectly = isCorrect.toString();
            });

             if (itemsInPool > 0) {
                 overallCorrect = false;
                 document.querySelectorAll('#characteristics-sort .characteristics-column .feedback').forEach(fb => {
                     if (!fb.textContent || fb.classList.contains('correct')) {
                         fb.textContent = `Correct! (${itemsInPool} left in pool)`;
                     } else if (!fb.textContent.includes('left in pool')) {
                          fb.textContent += ` (${itemsInPool} left in pool)`;
                     }
                     fb.className = 'feedback incorrect';
                     const quizItem = fb.closest('.quiz-item');
                     if (quizItem) quizItem.dataset.answeredCorrectly = 'false';
                 });
             }
            if (scoreCalculated) { calculateScore(); }
        }
        function resetCharacteristicsSort() {
            clearCharacteristicsFeedback();
            const pool = document.getElementById('characteristics-pool');
            const zones = document.querySelectorAll('#characteristics-sort .characteristics-column');
            zones.forEach(zone => {
                const items = Array.from(zone.querySelectorAll('.characteristics-item'));
                items.forEach(item => {
                    pool.appendChild(item);
                    item.classList.remove('correct', 'incorrect');
                });
                const quizItem = zone.closest('.quiz-item');
                 if (quizItem) delete quizItem.dataset.answeredCorrectly;
            });
            if (scoreCalculated) { calculateScore(); }
        }

        function clearCapacitySortFeedback() {
            document.getElementById('capacity-sort-feedback').textContent = '';
            document.getElementById('capacity-sort-feedback').className = 'feedback text-center';
            document.querySelectorAll('#capacity-sort .capacity-item').forEach(item => {
                item.classList.remove('correct', 'incorrect');
            });
             const quizItem = document.getElementById('capacity-sort').querySelector('.quiz-item');
             if (quizItem) delete quizItem.dataset.answeredCorrectly;
        }
        function checkCapacitySort() {
            clearCapacitySortFeedback();
            const pool = document.getElementById('capacity-pool');
            const slots = document.querySelectorAll('#capacity-sort .capacity-slot');
            const feedbackEl = document.getElementById('capacity-sort-feedback');
            const quizItem = document.getElementById('capacity-sort').querySelector('.quiz-item');
            let isCorrect = true;
            let allSlotsFilled = true;

            if (pool.querySelectorAll('.capacity-item').length > 0) {
                feedbackEl.textContent = 'Please drag all items into the drop slots first.';
                feedbackEl.className = 'feedback text-center incorrect';
                isCorrect = false;
                allSlotsFilled = false;
            } else {
                 slots.forEach((slot, index) => {
                     const itemsInSlot = slot.querySelectorAll('.capacity-item');
                     const expectedOrder = index;

                     if (itemsInSlot.length === 1) {
                         const item = itemsInSlot[0];
                         const currentOrder = parseInt(item.dataset.sortOrder);
                         if (currentOrder === expectedOrder) {
                             item.classList.add('correct');
                         } else {
                             item.classList.add('incorrect');
                             isCorrect = false;
                         }
                     } else {
                          isCorrect = false;
                          allSlotsFilled = false;
                     }
                 });

                 if (!allSlotsFilled && isCorrect) {
                     feedbackEl.textContent = 'Please fill all the slots.';
                     feedbackEl.className = 'feedback text-center incorrect';
                     isCorrect = false;
                 } else if (isCorrect) {
                    feedbackEl.textContent = 'Order is correct!';
                    feedbackEl.className = 'feedback text-center correct';
                 } else {
                    feedbackEl.textContent = 'Incorrect order. Check the typical capacities.';
                    feedbackEl.className = 'feedback text-center incorrect';
                 }
            }

             if(quizItem) quizItem.dataset.answeredCorrectly = isCorrect.toString();
             if (scoreCalculated) { calculateScore(); }
        }
        function resetCapacitySort() {
            clearCapacitySortFeedback();
            const pool = document.getElementById('capacity-pool');
            const slots = document.querySelectorAll('#capacity-sort .capacity-slot');
            slots.forEach(slot => {
                const items = Array.from(slot.querySelectorAll('.capacity-item'));
                items.forEach(item => {
                    pool.appendChild(item);
                    item.classList.remove('correct', 'incorrect');
                });
            });
            const quizItem = document.getElementById('capacity-sort').querySelector('.quiz-item');
             if (quizItem) delete quizItem.dataset.answeredCorrectly;
            if (scoreCalculated) { calculateScore(); }
        }


         function levenshteinDistance(s1, s2) {
             s1 = String(s1).toLowerCase(); s2 = String(s2).toLowerCase();
             const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
             for (let i = 0; i <= s1.length; i += 1) { track[0][i] = i; }
             for (let j = 0; j <= s2.length; j += 1) { track[j][0] = j; }
             for (let j = 1; j <= s2.length; j += 1) {
                 for (let i = 1; i <= s1.length; i += 1) {
                     const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
                     track[j][i] = Math.min(track[j][i - 1] + 1, track[j - 1][i] + 1, track[j - 1][i - 1] + indicator);
                 }
             }
             return track[s2.length][s1.length];
         }


        function checkBenefitsDrawbacks() {
            let sectionCorrect = true;
            const container = document.getElementById('benefits-drawbacks-container');
            const inputs = container.querySelectorAll('input.fill-blank');
            const overallFeedbackDiv = document.getElementById('benefits-drawbacks-feedback');

            inputs.forEach(input => {
                const userAnswer = input.value.trim();
                const correctAnswer = input.dataset.answer;
                const feedbackElId = `bd-feedback-${input.id.replace('bd-blank','')}`;
                const feedbackEl = container.querySelector(`#${feedbackElId}`);
                const quizItem = input.closest('.quiz-item');

                if (!quizItem.hasOwnProperty('blanksCorrect')) { quizItem.blanksCorrect = true; }

                const distance = levenshteinDistance(userAnswer, correctAnswer);
                const threshold = correctAnswer.length <= 5 ? 1 : 2;

                input.classList.remove('correct', 'incorrect', 'close-enough');
                if (feedbackEl) feedbackEl.className = 'feedback inline-feedback';

                if (distance === 0) {
                    input.classList.add('correct');
                    if (feedbackEl) { feedbackEl.innerHTML = '<i class="fas fa-check text-emerald-500"></i>'; feedbackEl.classList.add('correct'); }
                } else if (distance <= threshold) {
                     input.classList.add('close-enough');
                     if (feedbackEl) { feedbackEl.innerHTML = `<i class="fas fa-check text-amber-500 mr-1"></i> <span class="text-xs text-amber-600">(Close spelling: ${input.dataset.answer})</span>`; feedbackEl.classList.add('close-enough'); }
                } else {
                    input.classList.add('incorrect');
                    if (feedbackEl) { feedbackEl.innerHTML = `<i class="fas fa-times text-red-500 mr-1"></i> <span class="text-xs text-red-600">(Ans: ${input.dataset.answer})</span>`; feedbackEl.classList.add('incorrect'); }
                    sectionCorrect = false; quizItem.blanksCorrect = false;
                }
            });

             container.querySelectorAll('.quiz-item').forEach(item => {
                  if (item.hasOwnProperty('blanksCorrect')) { item.dataset.answeredCorrectly = item.blanksCorrect.toString(); delete item.blanksCorrect; }
                  else { item.dataset.answeredCorrectly = 'false'; }
             });

            overallFeedbackDiv.textContent = sectionCorrect ? 'All checked answers are correct (or close enough)!' : 'Some answers are incorrect. See details above.';
            overallFeedbackDiv.className = sectionCorrect ? 'mt-3 text-center feedback correct' : 'mt-3 text-center feedback incorrect';

            if (scoreCalculated) { calculateScore(); }
        }
        function resetBenefitsDrawbacks() {
            const container = document.getElementById('benefits-drawbacks-container');
            const inputs = container.querySelectorAll('input.fill-blank');
            const overallFeedbackDiv = document.getElementById('benefits-drawbacks-feedback');

            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('correct', 'incorrect', 'close-enough');
                const feedbackElId = `bd-feedback-${input.id.replace('bd-blank','')}`;
                const feedbackEl = container.querySelector(`#${feedbackElId}`);
                if (feedbackEl) { feedbackEl.innerHTML = ''; feedbackEl.className = 'feedback inline-feedback'; }
            });

            overallFeedbackDiv.textContent = '';
            overallFeedbackDiv.className = 'mt-3 text-center feedback';

            container.querySelectorAll('.quiz-item').forEach(item => { delete item.dataset.answeredCorrectly; });
            if (scoreCalculated) { calculateScore(); }
        }

        const MIN_EXAM_ATTEMPT_LENGTH = 10; // Minimum characters for a "reasonable attempt"

        document.querySelectorAll('.show-feedback-btn').forEach(button => {
            button.addEventListener('click', () => {
                const feedbackId = button.dataset.feedbackId;
                const textareaId = button.dataset.textareaId;
                const marks = button.dataset.marks || 'N'; // Default to 'N' if not set

                const feedbackDiv = document.getElementById(feedbackId);
                const textarea = textareaId ? document.getElementById(textareaId) : null;

                if (!feedbackDiv) {
                    console.error("Feedback div not found:", feedbackId);
                    return;
                }

                const showText = `Show Mark Scheme (${marks} marks)`;
                const hideText = `Hide Mark Scheme (${marks} marks)`;

                if (textarea) {
                    const answer = textarea.value.trim();
                    if (answer.length < MIN_EXAM_ATTEMPT_LENGTH) {
                        alert(`Please write a more detailed answer (at least ${MIN_EXAM_ATTEMPT_LENGTH} characters) before viewing the mark scheme.`);
                        feedbackDiv.classList.add('hidden'); // Ensure it's hidden
                        button.textContent = showText;
                        return;
                    }
                }

                // Toggle feedback visibility
                feedbackDiv.classList.toggle('hidden');
                button.textContent = feedbackDiv.classList.contains('hidden') ? showText : hideText;
            });
        });

        const dataStream = document.getElementById('data-stream');
        const speedSimFeedback = document.getElementById('speed-sim-feedback');
        const btnOptical = document.getElementById('btn-optical');
        const btnMagnetic = document.getElementById('btn-magnetic');
        const btnSsd = document.getElementById('btn-ssd');
        const simContainer = document.querySelector('#speed-simulation .sim-container');
        let simTimeout = null;

        function runSpeedAnimation(speedClass, feedbackText, startIconId) {
            if (simTimeout) clearTimeout(simTimeout);

            const startIcon = document.getElementById(startIconId);
            if (!startIcon || !dataStream || !simContainer) {
                console.error("Simulation elements not found!");
                return;
            }

            const containerRect = simContainer.getBoundingClientRect();
            const iconRect = startIcon.getBoundingClientRect();
            const startTop = iconRect.top + (iconRect.height / 2) - containerRect.top;

            dataStream.classList.remove('move-slow', 'move-medium', 'move-fast');
            dataStream.style.animation = 'none';
            dataStream.style.opacity = 0;
            void dataStream.offsetWidth;

            dataStream.style.top = `${startTop}px`;
            dataStream.style.animation = '';

            dataStream.classList.add(speedClass);
            speedSimFeedback.textContent = feedbackText;

            btnOptical.disabled = true;
            btnMagnetic.disabled = true;
            btnSsd.disabled = true;

            let duration = 1000;
            if (speedClass === 'move-slow') duration = 4000;
            else if (speedClass === 'move-medium') duration = 2000;
            else if (speedClass === 'move-fast') duration = 800;

            simTimeout = setTimeout(() => {
                 btnOptical.disabled = false;
                 btnMagnetic.disabled = false;
                 btnSsd.disabled = false;
                 dataStream.classList.remove('move-slow', 'move-medium', 'move-fast');
                 dataStream.style.opacity = 0;
                 speedSimFeedback.textContent = 'Simulation complete. Click again.';
            }, duration);
        }

        btnOptical.addEventListener('click', () => runSpeedAnimation('move-slow', 'Optical: Slowest access speed.', 'icon-optical'));
        btnMagnetic.addEventListener('click', () => runSpeedAnimation('move-medium', 'Magnetic (HDD): Medium access speed.', 'icon-magnetic'));
        btnSsd.addEventListener('click', () => runSpeedAnimation('move-fast', 'Solid State (SSD): Fastest access speed!', 'icon-ssd'));


        function calculateScore() {
            currentScore = 0;
            totalPossibleScore = 0;
            scoreCalculated = true;

            document.querySelectorAll('.quiz-item').forEach(item => {
                if (item.closest('#exam-practice') || item.closest('#speed-simulation') || item.closest('#extension-activities')) { return; }

                const points = parseInt(item.dataset.points || 0);
                totalPossibleScore += points;

                if (item.dataset.answeredCorrectly === 'true') {
                    if (item.classList.contains('dropzone') && item.closest('#characteristics-sort')) {
                         let correctCount = item.querySelectorAll('.characteristics-item.correct').length;
                         currentScore += (correctCount === 1 ? points : 0);
                    }
                    else if (item.closest('#capacity-sort')) {
                         const feedbackEl = document.getElementById('capacity-sort-feedback');
                         if(feedbackEl && feedbackEl.classList.contains('correct')) {
                             currentScore += points;
                         }
                    }
                    else if (item.classList.contains('fill-blanks-item') && item.closest('#task-benefits-drawbacks')) {
                         currentScore += points;
                    }
                     else {
                         currentScore += points;
                    }
                }
            });

            document.getElementById('current-score').textContent = currentScore;
            document.getElementById('total-possible-score').textContent = totalPossibleScore;
        }

         window.addEventListener('load', () => {
             totalPossibleScore = 0;
             document.querySelectorAll('.quiz-item').forEach(item => {
                 if (item.closest('#exam-practice') || item.closest('#speed-simulation') || item.closest('#extension-activities')) return;
                 totalPossibleScore += parseInt(item.dataset.points || 0);
             });
             document.getElementById('total-possible-score').textContent = totalPossibleScore;
             initializeDraggables();
             // Removed logic to hide takeaways on load

        });

        document.getElementById('calculate-score-btn').addEventListener('click', calculateScore);