/**
 * A reusable component for a "Back to Top" button.
 * This implementation is based on the "10/10 Optimization Plan".
 */
export class BackToTop {
  /**
   * @param {number} [threshold=300] - The scroll distance (in px) after which the button appears.
   */
  constructor(threshold = 300) {
    this.btn = document.getElementById('back-to-top');
    if (!this.btn) {
      console.warn('BackToTop component could not find a #back-to-top element.');
      return;
    }

    this.threshold = threshold;
    this.toggle = this.toggle.bind(this);
    this.scrollUp = this.scrollUp.bind(this);

    this.init();
  }

  init() {
    this.btn.addEventListener('click', this.scrollUp);
    window.addEventListener('scroll', this.toggle);
    this.toggle(); // Check visibility on initial load
  }

  toggle() {
    this.btn.classList.toggle('visible', window.pageYOffset > this.threshold);
  }

  scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  destroy() {
    this.btn.removeEventListener('click', this.scrollUp);
    window.removeEventListener('scroll', this.toggle);
  }
}
