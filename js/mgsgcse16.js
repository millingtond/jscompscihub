document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('currentYear').textContent = new Date().getFullYear();
            if (typeof lucide !== 'undefined') { lucide.createIcons(); }
        });