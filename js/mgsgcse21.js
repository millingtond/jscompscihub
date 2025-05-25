document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('currentYear').textContent = new Date().getFullYear();
            // Initialize Lucide icons after DOM is loaded
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                console.log("Lucide icons initialized.");
            } else {
                 console.error("Lucide library not loaded or failed to load.");
            }
        });