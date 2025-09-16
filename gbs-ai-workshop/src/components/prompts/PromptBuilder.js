export class PromptBuilder {
    constructor(builderSectionId, addPromptCallback) {
        this.section = document.getElementById(builderSectionId);
        if (!this.section) return;

        this.goalSelect = this.section.querySelector('#promptGoal');
        this.audienceSelect = this.section.querySelector('#promptAudience');
        this.toneSelect = this.section.querySelector('#promptTone');
        this.formatSelect = this.section.querySelector('#promptFormat');
        this.contextArea = this.section.querySelector('#promptContext');
        this.generateBtn = this.section.querySelector('#generatePromptBtn');
        this.outputContainer = this.section.querySelector('#generatedPromptContainer');
        this.outputPre = this.section.querySelector('#generatedPromptOutput');
        this.saveBtn = this.section.querySelector('#saveToLibraryBtn');
        this.copyBtn = this.section.querySelector('#copyPromptBtn');

        this.addPromptCallback = addPromptCallback;

        this.init();
    }

    init() {
        if (!this.generateBtn) return;

        this.generateBtn.addEventListener('click', () => this.generatePrompt());
        this.saveBtn.addEventListener('click', () => this.savePrompt());
        this.copyBtn.addEventListener('click', () => this.copyPrompt());
    }

    generatePrompt() {
        const goal = this.goalSelect.value;
        const audience = this.audienceSelect.value;
        const tone = this.toneSelect.value;
        const format = this.formatSelect.value;
        const context = this.contextArea.value.trim();

        if (!context) {
            alert('Please provide some context for your prompt.');
            return;
        }

        const promptText = `Act as an expert GBS Manager. Your task is to ${goal.toLowerCase()}. The audience is ${audience.toLowerCase()}. The tone of the response should be ${tone.toLowerCase()} and the output must be in the format of ${format.toLowerCase()}.\n\nBased on these requirements, please process the following context:\n\n---\n${context}\n---`;

        this.outputPre.textContent = promptText;
        this.outputContainer.classList.remove('hidden');
    }

    savePrompt() {
        const content = this.outputPre.textContent;
        const title = this.goalSelect.value;

        if (content && this.addPromptCallback) {
            const newPrompt = {
                type: 'custom',
                title: `Custom: ${title}`,
                content: content,
                createdAt: new Date().toISOString()
            };
            this.addPromptCallback(newPrompt);
            this.saveBtn.textContent = 'Saved!';
            setTimeout(() => { this.saveBtn.textContent = 'Save'; }, 2000);
        }
    }

    copyPrompt() {
        const textToCopy = this.outputPre.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => { this.copyBtn.textContent = 'Copy'; }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}
