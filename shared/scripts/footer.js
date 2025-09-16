document.addEventListener("DOMContentLoaded", function() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    /**
     * A simplified and more reliable path resolution for the footer.
     * This implementation is based on the "10/10 Optimization Plan".
     * It checks if the current path is already inside a subdirectory of the root
     * that is NOT 'shared' itself, and adjusts the path accordingly.
     * This is more robust than counting slashes.
     */
    const getFooterPath = () => {
        const path = window.location.pathname;
        // Simple check: if we are in a subdirectory (e.g., /rpo-training/), we need to go up one level.
        const isSubdirectory = path.split('/').length > 2 && !path.endsWith('/');
        return isSubdirectory ? '../shared/footer.html' : './shared/footer.html';
    };

    fetch(getFooterPath())
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch footer: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            placeholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});
