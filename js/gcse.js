// Wait for the HTML document to be fully loaded before running scripts
        document.addEventListener('DOMContentLoaded', function() {
            // Set current year in footer
            document.getElementById('currentYear').textContent = new Date().getFullYear();

            // Initialize Lucide icons (if needed for other icons)
            // Check if lucide object exists before calling createIcons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                console.log("Lucide icons initialized."); // Optional: for debugging
            } else {
                console.error("Lucide library failed to load.");
            }
        });