// --- DOM Element References ---
        const fileSizeInput = document.getElementById('file-size');
        const fileSizeUnitSelect = document.getElementById('file-size-unit');
        const customSpeedInput = document.getElementById('custom-speed');
        const customSpeedUnitSelect = document.getElementById('custom-speed-unit');
        const resetBtn = document.getElementById('reset-btn');
        const errorMsgDiv = document.getElementById('error-msg');
        const exampleButtons = document.querySelectorAll('.example-button');

        // Output Elements
        const time200MbpsOutput = document.getElementById('time-200mbps').querySelector('span');
        const time4gOutput = document.getElementById('time-4g').querySelector('span');
        const timeCustomOutput = document.getElementById('time-custom').querySelector('span');
        const timeDialupOutput = document.getElementById('time-dialup').querySelector('span');
        const allOutputBoxes = document.querySelectorAll('.output-box'); // For visual feedback

        // Progress Bar Elements
        const progress200Mbps = document.getElementById('progress-200mbps');
        const progress4g = document.getElementById('progress-4g');
        const progressCustom = document.getElementById('progress-custom');
        const progressDialup = document.getElementById('progress-dialup');
        const allProgressBars = document.querySelectorAll('.progress-bar-fill');

        // --- Constants ---
        const KILO_STORAGE = 1024; // For KB, MB, GB etc.
        const KILO_SPEED = 1000;   // For Kbps, Mbps, Gbps etc.
        const BASE_SPEED_UNIT = 'Mbps'; // Internal calculation unit for speed
        const BASE_SIZE_UNIT = 'MB';   // Internal calculation unit for size

        // Connection speeds in Mbps (fixed speeds)
        const speed200Mbps = 200;
        const speed4g = 23;
        const speedDialupMbps = 28.8 / KILO_SPEED; // Convert Kbps to Mbps

        let calculationTimeout = null; // For debouncing input

        // --- Core Calculation Logic ---

        /**
         * Converts file size from selected unit to Megabytes (MB).
         * @param {number} size - The file size value.
         * @param {string} unit - The unit (KB, MB, GB, TB).
         * @returns {number|null} Size in MB or null if invalid.
         */
        function convertSizeToMB(size, unit) {
            if (isNaN(size) || size < 0) return null;
            switch (unit) {
                case 'KB': return size / KILO_STORAGE;
                case 'MB': return size;
                case 'GB': return size * KILO_STORAGE;
                case 'TB': return size * KILO_STORAGE * KILO_STORAGE;
                default: return null;
            }
        }

        /**
         * Converts connection speed from selected unit to Megabits per second (Mbps).
         * @param {number} speed - The speed value.
         * @param {string} unit - The unit (Kbps, Mbps, Gbps).
         * @returns {number|null} Speed in Mbps or null if invalid.
         */
        function convertSpeedToMbps(speed, unit) {
             if (isNaN(speed) || speed <= 0) return null; // Speed must be positive
             switch (unit) {
                case 'Kbps': return speed / KILO_SPEED;
                case 'Mbps': return speed;
                case 'Gbps': return speed * KILO_SPEED;
                default: return null;
            }
        }


        /**
         * Calculates download time in seconds.
         * @param {number} fileSizeMB - File size in Megabytes.
         * @param {number} speedMbps - Connection speed in Megabits per second.
         * @returns {number|null} Download time in seconds, or null if inputs are invalid.
         */
        function calculateTime(fileSizeMB, speedMbps) {
            if (fileSizeMB === null || speedMbps === null || fileSizeMB < 0 || speedMbps <= 0) {
                return null; // Check for nulls from conversion and invalid values
            }
             if (speedMbps === 0) return Infinity; // Avoid division by zero
            const timeSeconds = (fileSizeMB * 8) / speedMbps;
            return timeSeconds;
        }

        /**
         * Formats the calculated time into appropriate units (seconds, minutes, hours, days).
         * @param {number|null} timeSeconds - Time in seconds or null.
         * @returns {string} Formatted time string.
         */
        function formatTime(timeSeconds) {
            if (timeSeconds === null || isNaN(timeSeconds) || timeSeconds < 0) {
                return "--"; // Placeholder for invalid/null input
            }
             if (timeSeconds === Infinity) {
                return "Instant*";
            }

            const secondsInMinute = 60;
            const secondsInHour = 3600;
            const secondsInDay = 86400;

            if (timeSeconds < 0.1) {
                return "< 0.1 s";
            } else if (timeSeconds < secondsInMinute) {
                return timeSeconds.toFixed(1) + " s";
            } else if (timeSeconds < secondsInHour) {
                const timeMinutes = timeSeconds / secondsInMinute;
                return timeMinutes.toFixed(1) + " min";
            } else if (timeSeconds < secondsInDay * 2) { // Show hours up to 2 days
                 const timeHours = timeSeconds / secondsInHour;
                return timeHours.toFixed(1) + " hr";
            } else {
                const timeDays = timeSeconds / secondsInDay;
                return timeDays.toFixed(1) + " days";
            }
        }

        // --- Main Calculation Trigger ---

        /**
         * Handles the calculation process, triggered by input or button.
         */
        function performCalculation() {
            // Visual feedback: Indicate calculation is happening
            allOutputBoxes.forEach(box => {
                box.classList.add('calculating');
                box.querySelector('span').classList.remove('visible'); // Hide text
            });
            // Reset progress bars immediately before starting calculation
            allProgressBars.forEach(bar => bar.style.width = '0%');
            errorMsgDiv.textContent = ''; // Clear previous errors

            // Get inputs
            const fileSize = parseFloat(fileSizeInput.value);
            const fileSizeUnit = fileSizeUnitSelect.value;
            const customSpeed = parseFloat(customSpeedInput.value);
            const customSpeedUnit = customSpeedUnitSelect.value;

            // Convert file size to MB
            const fileSizeMB = convertSizeToMB(fileSize, fileSizeUnit);

            // Validate file size
            if (fileSizeMB === null) {
                 if (fileSizeInput.value.trim() !== '') {
                    errorMsgDiv.textContent = 'Please enter a valid positive file size.';
                 }
                 resetOutputs(); // Clear outputs and progress bars
                 return;
            }

            // Convert custom speed to Mbps (if provided)
            let customSpeedMbps = null;
            if (!isNaN(customSpeed) && customSpeedInput.value.trim() !== '') {
                 customSpeedMbps = convertSpeedToMbps(customSpeed, customSpeedUnit);
                 if (customSpeedMbps === null) {
                     errorMsgDiv.textContent = 'Please enter a valid positive custom speed.';
                     // Reset only custom output and progress
                     timeCustomOutput.textContent = formatTime(null);
                     timeCustomOutput.classList.remove('visible');
                     progressCustom.style.width = '0%';
                     allOutputBoxes.forEach(box => box.classList.remove('calculating')); // Remove calculating flash
                     return;
                 }
            }

            // Calculate times for each speed
            const time200 = calculateTime(fileSizeMB, speed200Mbps);
            const time4g = calculateTime(fileSizeMB, speed4g);
            const timeDialup = calculateTime(fileSizeMB, speedDialupMbps);
            const timeCustom = calculateTime(fileSizeMB, customSpeedMbps);

            // --- Update Outputs and Trigger Animations ---
            // Use requestAnimationFrame to ensure styles are applied after reset/flash
            requestAnimationFrame(() => {
                // Update text content
                time200MbpsOutput.textContent = formatTime(time200);
                time4gOutput.textContent = formatTime(time4g);
                timeDialupOutput.textContent = formatTime(timeDialup);
                timeCustomOutput.textContent = formatTime(timeCustom);

                // Trigger fade-in for text
                allOutputBoxes.forEach(box => box.querySelector('span').classList.add('visible'));

                // Trigger progress bar animation (after a tiny delay for the transition)
                 setTimeout(() => {
                    if (time200 !== null) progress200Mbps.style.width = '100%';
                    if (time4g !== null) progress4g.style.width = '100%';
                    if (timeDialup !== null) progressDialup.style.width = '100%';
                    if (timeCustom !== null) progressCustom.style.width = '100%';
                }, 50); // Small delay to ensure transition catches

                // Remove calculating flash after text fade starts
                 setTimeout(() => {
                     allOutputBoxes.forEach(box => box.classList.remove('calculating'));
                 }, 150);
            });
        }

        /**
         * Saves the current state of inputs to sessionStorage.
         */
        function saveState() {
            try {
                sessionStorage.setItem('calcFileSize', fileSizeInput.value);
                sessionStorage.setItem('calcFileSizeUnit', fileSizeUnitSelect.value);
                sessionStorage.setItem('calcCustomSpeed', customSpeedInput.value);
                sessionStorage.setItem('calcCustomSpeedUnit', customSpeedUnitSelect.value);
            } catch (e) {
                console.error("Error saving state to sessionStorage:", e); // Handle potential storage errors (e.g., private browsing)
            }
        }

        // --- Reset Logic ---

        /**
         * Resets all input fields and output displays including progress bars.
         */
        function resetCalculator() {
            fileSizeInput.value = '';
            fileSizeUnitSelect.value = 'MB'; // Default unit
            customSpeedInput.value = '';
            customSpeedUnitSelect.value = 'Mbps'; // Default unit
            errorMsgDiv.textContent = '';
            // Clear stored state as well
            try {
                sessionStorage.removeItem('calcFileSize');
                sessionStorage.removeItem('calcFileSizeUnit');
                sessionStorage.removeItem('calcCustomSpeed');
                sessionStorage.removeItem('calcCustomSpeedUnit');
            } catch (e) { console.error("Error clearing sessionStorage:", e); }

            resetOutputs();
        }

        /**
        * Resets only the output fields and progress bars.
        */
        function resetOutputs() {
            allOutputBoxes.forEach(box => {
                box.querySelector('span').textContent = '--';
                box.querySelector('span').classList.remove('visible');
                box.classList.remove('calculating');
            });
             allProgressBars.forEach(bar => {
                 // Resetting requires removing transition temporarily for instant change
                 bar.style.transition = 'none'; // Disable transition
                 bar.style.width = '0%';
                 // Force reflow/repaint before re-enabling transition
                 void bar.offsetWidth;
                 bar.style.transition = 'width 0.8s ease-out'; // Re-enable transition
             });
        }


        // --- Event Listeners ---

        // Debounced calculation on input change
        const debounceDelay = 300; // milliseconds delay
        [fileSizeInput, fileSizeUnitSelect, customSpeedInput, customSpeedUnitSelect].forEach(element => {
            element.addEventListener('input', () => {
                clearTimeout(calculationTimeout); // Clear previous timeout
                // Show immediate calculating feedback
                allOutputBoxes.forEach(box => {
                    box.classList.add('calculating');
                    box.querySelector('span').classList.remove('visible'); // Hide text during flash
                });
                // Reset progress bars immediately on new input
                allProgressBars.forEach(bar => {
                     bar.style.transition = 'none';
                     bar.style.width = '0%';
                     void bar.offsetWidth;
                     bar.style.transition = 'width 0.8s ease-out';
                 });
                saveState(); // Save state after input changes (debounced)
                calculationTimeout = setTimeout(performCalculation, debounceDelay);
            });
        });

        // Reset button
        resetBtn.addEventListener('click', resetCalculator);

        // Example buttons
        exampleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const size = button.dataset.size;
                const unit = button.dataset.unit;
                fileSizeInput.value = size;
                fileSizeUnitSelect.value = unit;
                // Trigger calculation immediately after setting example
                 // Reset progress bars visually before calculation
                 allProgressBars.forEach(bar => {
                     bar.style.transition = 'none';
                     bar.style.width = '0%';
                     void bar.offsetWidth;
                     bar.style.transition = 'width 0.8s ease-out';
                 });
                saveState(); // Save state after setting example
                performCalculation();
                 // Scroll to the input field for better UX on mobile
                 fileSizeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });

        // Initial state reset
        // Load state from sessionStorage on page load
        function loadState() {
            try {
                const savedSize = sessionStorage.getItem('calcFileSize');
                const savedSizeUnit = sessionStorage.getItem('calcFileSizeUnit');
                const savedSpeed = sessionStorage.getItem('calcCustomSpeed');
                const savedSpeedUnit = sessionStorage.getItem('calcCustomSpeedUnit');

                if (savedSize !== null) fileSizeInput.value = savedSize;
                if (savedSizeUnit !== null) fileSizeUnitSelect.value = savedSizeUnit;
                if (savedSpeed !== null) customSpeedInput.value = savedSpeed;
                if (savedSpeedUnit !== null) customSpeedUnitSelect.value = savedSpeedUnit;

                // If any value was loaded, perform calculation immediately
                if (savedSize !== null || savedSpeed !== null) {
                    performCalculation();
                } else {
                    resetOutputs(); // Ensure outputs are reset if nothing loaded
                }
            } catch (e) { console.error("Error loading state from sessionStorage:", e); resetOutputs(); }
        }

        // Load state when the DOM is ready
        document.addEventListener('DOMContentLoaded', loadState);