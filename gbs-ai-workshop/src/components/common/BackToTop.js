export class BackToTop {
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        if (!this.button) return;

        this.init();
    }

    init() {
        // Show button on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        });

        // Scroll to top on click
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
