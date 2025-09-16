export class ReversePrompt {
    constructor(sectionId, generateCallback) {
        this.section = document.getElementById(sectionId);
        if (!this.section) return;

        this.inputArea = this.section.querySelector('#reversePromptInput');
        this.generateBtn = this.section.querySelector('#generateReversePromptBtn');
        this.spinner = this.section.querySelector('#reverse-prompt-spinner');
        this.outputContainer = this.section.querySelector('#reverse-prompt-output-container');
        this.outputPre = this.section.querySelector('#reverse-prompt-output');
        this.explanationDiv = this.section.querySelector('#reverse-prompt-explanation');
        this.errorDiv = this.section.querySelector('#reverse-prompt-error');

        this.generateCallback = generateCallback;

        this.init();
    }

    init() {
        if (!this.generateBtn) return;
        this.generateBtn.addEventListener('click', () => this.generate());
    }

    async generate() {
        const inputText = this.inputArea.value.trim();
        if (!inputText) {
            this.showError('Please paste some text to analyze.');
            return;
        }

        this.showSpinner(true);
        this.hideError();
        this.outputContainer.classList.add('hidden');

        try {
            const result = await this.generateCallback(inputText);

            if (result.generated_prompt && result.explanation) {
                this.outputPre.textContent = result.generated_prompt;
                this.explanationDiv.textContent = result.explanation;
                this.outputContainer.classList.remove('hidden');
            } else {
                 throw new Error("Invalid response structure from the function.");
            }

        } catch (error) {
            console.error("Reverse prompt generation failed:", error);
            let errorMessage = "An unknown error occurred. Please try again.";
            if (error.code === 'unauthenticated') {
                errorMessage = "You must be signed in to use this feature.";
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            this.showError(errorMessage);
        } finally {
            this.showSpinner(false);
        }
    }

    showSpinner(show) {
        this.spinner.classList.toggle('hidden', !show);
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.classList.remove('hidden');
    }

    hideError() {
        this.errorDiv.classList.add('hidden');
    }
}
