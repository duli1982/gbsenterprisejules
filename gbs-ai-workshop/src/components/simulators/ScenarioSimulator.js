import { scenarios } from '../../data/scenarios.js';

export class ScenarioSimulator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.currentCategory = null;
        this.currentIndex = 0;

        this.init();
    }

    init() {
        // The component is initialized when the main script loads,
        // but it should only display something if its section is visible.
        // We will use a MutationObserver to detect when the section becomes visible.
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!this.container.parentElement.classList.contains('hidden')) {
                        // The section is now visible, display the category menu
                        if (!this.currentCategory) {
                             this.displayCategoryMenu();
                        }
                    }
                }
            }
        });

        observer.observe(this.container.parentElement, { attributes: true });

        this.container.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        const categoryEl = e.target.closest('.category-option');
        const optionEl = e.target.closest('.scenario-option');
        const backBtn = e.target.id === 'backToCategoriesBtn';
        const nextBtn = e.target.id === 'nextScenarioBtn';

        if (categoryEl) {
            this.currentCategory = categoryEl.dataset.category;
            this.currentIndex = 0;
            this.loadScenario();
        } else if (backBtn) {
            this.currentCategory = null;
            this.displayCategoryMenu();
        } else if (optionEl && !optionEl.classList.contains('selected')) {
            this.handleOptionSelection(optionEl);
        } else if (nextBtn) {
            this.currentIndex++;
            this.loadScenario();
        }
    }

    displayCategoryMenu() {
        let categoryHtml = Object.keys(scenarios).map(category => `
            <div class="category-option p-6 rounded-lg cursor-pointer text-center hover:bg-gray-100 transition-colors" data-category="${category}">
                <h3 class="font-bold text-xl text-[#4A90E2]">${category}</h3>
            </div>
        `).join('');

        this.container.innerHTML = `
            <h3 class="text-2xl font-bold text-center mb-6">Choose a Scenario Category</h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${categoryHtml}</div>
        `;
    }

    loadScenario() {
        const scenario = scenarios[this.currentCategory][this.currentIndex];

        if (!scenario) {
            this.container.innerHTML = `
                <p class="text-center text-gray-600 text-xl">You've completed all scenarios in this category!</p>
                <div class="mt-6 text-center">
                    <button id="backToCategoriesBtn" class="bg-gray-600 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-700 transition-colors">Back to Categories</button>
                </div>
            `;
            return;
        }

        let optionsHtml = scenario.prompts.map((p, i) => `
            <div class="scenario-option p-4 rounded-lg cursor-pointer border border-gray-200 hover:border-[#4A90E2] transition-colors" data-index="${i}">
                <p class="font-semibold">${p.text}</p>
                <div class="feedback mt-2 text-sm hidden p-3 rounded-lg"></div>
            </div>
        `).join('');

        this.container.innerHTML = `
             <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-bold text-[#4A90E2]">${scenario.title}</h3>
                <button id="backToCategoriesBtn" class="text-sm text-gray-500 hover:text-gray-800">&larr; Back to Categories</button>
            </div>
            <p class="text-gray-600 mb-6">${scenario.problem}</p>
            <div class="space-y-4">${optionsHtml}</div>
            <div class="mt-6 text-right">
                <button id="nextScenarioBtn" class="hidden bg-[#4A90E2] text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors">Next Scenario</button>
            </div>
        `;
    }

    handleOptionSelection(optionEl) {
        const selectedIndex = parseInt(optionEl.dataset.index);
        const scenario = scenarios[this.currentCategory][this.currentIndex];
        const selectedPrompt = scenario.prompts[selectedIndex];

        // Disable further clicks
        const allOptions = this.container.querySelectorAll('.scenario-option');
        allOptions.forEach(opt => opt.classList.add('selected'));

        // Show feedback
        const feedbackEl = optionEl.querySelector('.feedback');
        feedbackEl.textContent = selectedPrompt.feedback;
        feedbackEl.classList.remove('hidden');

        if (selectedPrompt.isCorrect) {
            optionEl.classList.add('correct', 'border-green-500');
            feedbackEl.classList.add('bg-green-100', 'text-green-800');
        } else {
            optionEl.classList.add('incorrect', 'border-red-500');
            feedbackEl.classList.add('bg-red-100', 'text-red-800');
            // Highlight the correct one
            const correctIndex = scenario.prompts.findIndex(p => p.isCorrect);
            const correctOptionEl = this.container.querySelector(`.scenario-option[data-index='${correctIndex}']`);
            correctOptionEl.classList.add('correct', 'border-green-500');
        }

        this.container.querySelector('#nextScenarioBtn').classList.remove('hidden');
    }
}
