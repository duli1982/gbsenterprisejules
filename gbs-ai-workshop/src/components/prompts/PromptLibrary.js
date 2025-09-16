import { prompts } from '../../data/prompts.js';

export class PromptLibrary {
    constructor(containerId, filterBtnsSelector, userLibrary, onFavorite) {
        this.container = document.getElementById(containerId);
        this.filterBtns = document.querySelectorAll(filterBtnsSelector);
        this.userLibrary = userLibrary;
        this.onFavorite = onFavorite; // Callback function for favoriting
        this.currentFilter = 'All';

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('PromptLibrary container not found');
            return;
        }
        this.setupFilterListeners();
        this.render();

        // Listen for external updates to the user library
        document.addEventListener('userLibraryUpdated', (e) => {
            this.userLibrary = e.detail.userLibrary;
            this.render();
        });
    }

    setupFilterListeners() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-[#4A90E2]', 'text-white');
                    b.classList.add('bg-white', 'text-gray-700');
                });
                btn.classList.add('active', 'bg-[#4A90E2]', 'text-white');
                btn.classList.remove('bg-white', 'text-gray-700');

                this.currentFilter = btn.textContent;
                this.render();
            });
        });
    }

    createPromptCard(prompt) {
        const card = document.createElement('div');
        card.className = 'prompt-card bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between';

        const isFavorited = this.userLibrary.some(p => p.type === 'favorite' && p.originalId === prompt.id);

        const buttonsHtml = `
            <svg data-id="${prompt.id}" class="favorite-btn h-6 w-6 cursor-pointer ${isFavorited ? 'favorited' : ''}" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
        `;

        card.innerHTML = `
            <div>
                <h4 class="font-bold text-lg mb-2 text-[#4A90E2]">${prompt.title}</h4>
                <p class="text-gray-600 text-sm">${prompt.content}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end items-center">
                ${buttonsHtml}
            </div>
        `;

        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            const promptId = e.currentTarget.dataset.id;
            this.onFavorite(promptId);
        });

        return card;
    }

    render() {
        this.container.innerHTML = '';
        const filteredPrompts = (this.currentFilter === 'All')
            ? prompts
            : prompts.filter(p => p.category === this.currentFilter);

        filteredPrompts.forEach(prompt => {
            const card = this.createPromptCard(prompt);
            this.container.appendChild(card);
        });
    }
}
