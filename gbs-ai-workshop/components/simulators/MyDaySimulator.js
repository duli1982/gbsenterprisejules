import { myDayEvents } from '../../data/myDayEvents.js';

export class MyDaySimulator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.currentIndex = 0;
        this.init();
    }

    init() {
        // Use a MutationObserver to initialize when the section becomes visible
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!this.container.parentElement.classList.contains('hidden')) {
                        // The section is now visible, load the first event
                        this.loadEvent(this.currentIndex);
                    }
                }
            }
        });

        observer.observe(this.container.parentElement, { attributes: true });

        this.container.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        const optionEl = e.target.closest('.scenario-option');
        const nextBtn = e.target.id === 'nextDayEventBtn';
        const restartBtn = e.target.id === 'restartDayBtn';

        if (optionEl && !optionEl.classList.contains('selected')) {
            this.handleOptionSelection(optionEl);
        } else if (nextBtn) {
            this.currentIndex++;
            this.loadEvent(this.currentIndex);
        } else if (restartBtn) {
            this.currentIndex = 0;
            this.loadEvent(this.currentIndex);
        }
    }

    loadEvent(index) {
        if (index >= myDayEvents.length) {
            this.container.innerHTML = `
                <p class="text-center text-gray-600 text-2xl font-bold">You've completed your day!</p>
                <p class="text-center text-gray-500 mt-4">You've seen how a few smart prompts can save hours of work. You're ready to start integrating AI into your real workflow.</p>
                <div class="mt-6 text-center">
                    <button id="restartDayBtn" class="bg-gray-600 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-700 transition-colors">Start Day Over</button>
                </div>
            `;
            return;
        }

        const event = myDayEvents[index];
        let optionsHtml = event.options.map((opt, i) => `
            <div class="scenario-option p-4 rounded-lg cursor-pointer border border-gray-200 hover:border-[#4A90E2] transition-colors" data-index="${i}">
                <p class="font-semibold">${opt.text}</p>
                <div class="feedback mt-2 text-sm hidden p-4 bg-green-100 text-green-800 rounded-lg"></div>
            </div>
        `).join('');

        this.container.innerHTML = `
             <div class="mb-4">
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">${event.time}</span>
             </div>
            <p class="text-gray-600 mb-6 text-lg">${event.task}</p>
            <div class="space-y-4">${optionsHtml}</div>
            <div class="mt-6 text-right">
                <button id="nextDayEventBtn" class="hidden bg-[#4A90E2] text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors">Continue Day &rarr;</button>
            </div>
        `;
    }

    handleOptionSelection(optionEl) {
        const selectedIndex = parseInt(optionEl.dataset.index);
        const event = myDayEvents[this.currentIndex];
        const selectedOption = event.options[selectedIndex];

        const allOptions = this.container.querySelectorAll('.scenario-option');
        allOptions.forEach(opt => opt.classList.add('selected'));

        const feedbackEl = optionEl.querySelector('.feedback');
        feedbackEl.textContent = selectedOption.outcome;
        feedbackEl.classList.remove('hidden');
        optionEl.classList.add('correct', 'border-green-500');

        this.container.querySelector('#nextDayEventBtn').classList.remove('hidden');
    }
}
