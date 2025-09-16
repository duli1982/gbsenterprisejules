import { prompts } from '../../data/prompts.js';

export class MyLibrary {
    constructor(
        customContainerId,
        favoriteContainerId,
        noCustomMsgId,
        noFavoriteMsgId,
        userLibrary
    ) {
        this.customContainer = document.getElementById(customContainerId);
        this.favoriteContainer = document.getElementById(favoriteContainerId);
        this.noCustomMsg = document.getElementById(noCustomMsgId);
        this.noFavoriteMsg = document.getElementById(noFavoriteMsgId);
        this.userLibrary = userLibrary;

        this.init();
    }

    init() {
        if (!this.customContainer || !this.favoriteContainer) {
            // Not on the "My Library" page, so do nothing.
            return;
        }
        this.render();

        // Listen for external updates to the user library
        document.addEventListener('userLibraryUpdated', (e) => {
            this.userLibrary = e.detail.userLibrary;
            this.render();
        });
    }

    createCard(prompt, isCustom) {
        const card = document.createElement('div');
        card.className = 'prompt-card bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between';

        let buttonsHtml = '';
        if (isCustom) {
            buttonsHtml = `<button data-id="${prompt.id}" class="remove-custom-btn text-red-500 hover:text-red-700 text-xs font-semibold">Remove</button>`;
        } else {
            buttonsHtml = `<button data-id="${prompt.libraryId}" class="unfavorite-btn text-red-500 hover:text-red-700 text-xs font-semibold">Unfavorite</button>`;
        }

        card.innerHTML = `
            <div>
                <h4 class="font-bold text-lg mb-2 text-[#4A90E2]">${prompt.title}</h4>
                <p class="text-gray-600 text-sm">${prompt.content}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end items-center">
                ${buttonsHtml}
            </div>
        `;
        return card;
    }

    render() {
        if (!this.customContainer || !this.favoriteContainer) return;

        this.customContainer.innerHTML = '';
        this.favoriteContainer.innerHTML = '';

        const customPrompts = this.userLibrary.filter(p => p.type === 'custom');
        const favoritePrompts = this.userLibrary.filter(p => p.type === 'favorite');

        // Render Custom Prompts
        if (customPrompts.length > 0) {
            this.noCustomMsg.classList.add('hidden');
            this.customContainer.classList.remove('hidden');
            customPrompts.forEach(prompt => {
                const card = this.createCard(prompt, true);
                this.customContainer.appendChild(card);
            });
        } else {
            this.noCustomMsg.classList.remove('hidden');
            this.customContainer.classList.add('hidden');
        }

        // Render Favorite Prompts
        if (favoritePrompts.length > 0) {
            this.noFavoriteMsg.classList.add('hidden');
            this.favoriteContainer.classList.remove('hidden');
            favoritePrompts.forEach(prompt => {
                const originalPrompt = prompts.find(p => p.id === prompt.originalId);
                if (originalPrompt) {
                    const card = this.createCard({ ...originalPrompt, libraryId: prompt.id }, false);
                    this.favoriteContainer.appendChild(card);
                }
            });
        } else {
            this.noFavoriteMsg.classList.remove('hidden');
            this.favoriteContainer.classList.add('hidden');
        }
    }
}
