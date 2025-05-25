document.addEventListener('DOMContentLoaded', () => {
            // Set current year in footer
            document.getElementById('currentYear').textContent = new Date().getFullYear();

            const loginForm = document.getElementById('loginForm');
            const errorMessageDiv = document.getElementById('errorMessage');

            // Get the submit button to disable/enable it during check
            const submitButton = loginForm.querySelector('button[type="submit"]');

            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission
                errorMessageDiv.classList.add('hidden'); // Hide previous errors
                errorMessageDiv.textContent = '';
                submitButton.disabled = true; // Disable button during check
                submitButton.textContent = 'Checking...';

                const password = document.getElementById('password').value;

                // --- Simple Frontend Password Check ---
                const requiredPhrase = 'swimmingTreeCricket99#';

                // Add a small delay to simulate checking (optional, makes UX slightly better)
                await new Promise(resolve => setTimeout(resolve, 300));

                if (password === requiredPhrase) {
                    // Password matches! Redirect to home.html
                    console.log('Password matched. Redirecting...');
                    window.location.href = 'home.html';
                    // No need to re-enable button as we are navigating away
                } else {
                    // Password does not match. Show error.
                    console.log('Password mismatch.');
                    errorMessageDiv.textContent = 'Invalid password.';
                    errorMessageDiv.classList.remove('hidden');
                    // Re-enable the button
                    submitButton.disabled = false;
                    submitButton.textContent = 'Sign in';
                }
            });
        });