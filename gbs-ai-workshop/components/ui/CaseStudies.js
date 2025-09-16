import { caseStudies } from '../../data/caseStudies.js';

export class CaseStudies {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.tabsContainer = null;
        this.contentContainer = null;

        this.init();
    }

    init() {
        // Use a MutationObserver to initialize when the section becomes visible
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!this.container.parentElement.classList.contains('hidden') && !this.tabsContainer) {
                        // The section is now visible, and we haven't initialized yet
                        this.setupUI();
                        this.loadCaseStudy(Object.keys(caseStudies)[0]); // Load first case study by default
                    }
                }
            }
        });

        observer.observe(this.container.parentElement, { attributes: true });
    }

    setupUI() {
        const caseStudyTabs = document.createElement('nav');
        caseStudyTabs.id = 'case-study-tabs';
        caseStudyTabs.className = '-mb-px flex space-x-8 border-b border-gray-200';
        caseStudyTabs.setAttribute('aria-label', 'Tabs');
        this.tabsContainer = caseStudyTabs;

        const caseStudyContent = document.createElement('div');
        caseStudyContent.id = 'case-study-content';
        caseStudyContent.className = 'mt-8';
        this.contentContainer = caseStudyContent;

        this.container.innerHTML = '';
        this.container.appendChild(caseStudyTabs);
        this.container.appendChild(caseStudyContent);

        const categories = Object.keys(caseStudies);

        this.tabsContainer.innerHTML = categories.map((category, index) => `
            <button class="case-study-tab whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${index === 0 ? 'active' : ''}" data-category="${category}">${category}</button>
        `).join('');

        this.tabsContainer.addEventListener('click', e => {
            if (e.target.matches('.case-study-tab')) {
                const category = e.target.dataset.category;
                this.tabsContainer.querySelectorAll('.case-study-tab').forEach(tab => tab.classList.remove('active'));
                e.target.classList.add('active');
                this.loadCaseStudy(category);
            }
        });
    }

    loadCaseStudy(category) {
        if (!this.contentContainer) return;
        const studySteps = caseStudies[category];
        let stepsHtml = studySteps.map((step, index) => `
            <div class="timeline-step bg-white p-6 rounded-lg shadow-sm">
                <h4 class="font-bold text-lg text-[#4A90E2] mb-2">Step ${index + 1}: ${step.title}</h4>
                <p class="text-sm text-gray-500 italic mb-4">${step.description}</p>
                <div class="code-block text-xs">${step.prompt}</div>
            </div>
            ${index < studySteps.length - 1 ? '<div class="timeline-connector"></div>' : ''}
        `).join('');

        this.contentContainer.innerHTML = `<div class="timeline-container">${stepsHtml}</div>`;
    }
}
