// --- Polyfills and Libraries ---
import 'regenerator-runtime/runtime'; // For async/await
import Chart from 'chart.js/auto'; // Chart.js

// --- Styles ---
import '../styles/main.css';
import '../styles/components.css';

// --- Services ---
import { initFirebase, auth } from './services/firebase.js';
import * as promptService from './services/promptService.js';
import { generateReversePrompt } from './services/aiService.js';

// --- UI Components ---
import { OpportunityChart } from './components/charts/OpportunityChart.js';
import { PromptLibrary } from './components/prompts/PromptLibrary.js';
import { MyLibrary } from './components/prompts/MyLibrary.js';
import { PromptBuilder } from './components/prompts/PromptBuilder.js';
import { ReversePrompt } from './components/prompts/ReversePrompt.js';
import { ScenarioSimulator } from './components/simulators/ScenarioSimulator.js';
import { MyDaySimulator } from './components/simulators/MyDaySimulator.js';
import { CaseStudies } from './components/ui/CaseStudies.js';
import { TeamLeadership } from './components/ui/TeamLeadership.js';
import { BackToTop } from './components/common/BackToTop.js';

// --- Data ---
import { opportunityData } from './data/opportunityData.js';

// --- GLOBAL STATE ---
let userLibrary = [];

// --- MAIN APP INITIALIZATION ---
const main = async () => {
    try {
        await initFirebase();

        // Once Firebase is ready, load user-specific data
        promptService.loadUserLibrary((library) => {
            userLibrary = library;
            // Notify components that the library has been updated
            document.dispatchEvent(new CustomEvent('userLibraryUpdated', { detail: { userLibrary } }));
        });

        // Initialize all components
        initComponents();

        // Setup routing and other global UI handlers
        setupGlobalUI();

    } catch (error) {
        console.error("Failed to initialize the application:", error);
        // Optionally, display an error message to the user on the page
    }
};

// --- COMPONENT INITIALIZATION ---
function initComponents() {
    const handleFavorite = (promptId) => {
        const existingFavorite = userLibrary.find(p => p.type === 'favorite' && p.originalId === promptId);
        if (existingFavorite) {
            promptService.removePromptFromLibrary(existingFavorite.id);
        } else {
            promptService.addPromptToLibrary({ type: 'favorite', originalId: promptId });
        }
    };

    new OpportunityChart('opportunityChart', opportunityData);
    new PromptLibrary('prompt-library', '.prompt-filter-btn', userLibrary, handleFavorite);
    new MyLibrary('my-custom-prompts-list', 'my-favorite-prompts-list', 'no-custom-prompts', 'no-favorite-prompts', userLibrary);
    new PromptBuilder('builder', promptService.addPromptToLibrary);
    new ReversePrompt('reverse-prompt', generateReversePrompt);
    new ScenarioSimulator('simulator-container');
    new MyDaySimulator('my-day-container');
    new CaseStudies('case-study-container');
    new TeamLeadership('team-leadership');
    new BackToTop('back-to-top');
}

// --- GLOBAL UI HANDLERS ---
function setupGlobalUI() {
    // SPA Routing
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const toolsDropdownBtn = document.getElementById('tools-dropdown-btn');

    const updateSectionVisibility = () => {
        const hash = window.location.hash || '#why'; // Default to #why

        sections.forEach(section => {
            section.classList.toggle('hidden', `#${section.id}` !== hash);
            if (`#${section.id}` === hash) {
                section.classList.add('fade-in');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });

        const toolHashes = ['#what', '#builder', '#my-library', '#simulator', '#reverse-prompt', '#my-day'];
        if (toolsDropdownBtn) {
            toolsDropdownBtn.classList.toggle('active', toolHashes.includes(hash));
        }
    };

    window.addEventListener('hashchange', updateSectionVisibility);
    updateSectionVisibility(); // Initial call

    // Dropdown Menu Logic
    const toolsDropdown = document.getElementById('tools-dropdown');
    if (toolsDropdown) {
        const menu = document.getElementById('tools-dropdown-menu');
        toolsDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        });
        document.addEventListener('click', () => menu.classList.add('hidden'));
        menu.addEventListener('click', (e) => e.stopPropagation());
    }

    // Animated Subtitle
    const animatedSubtitleEl = document.getElementById('animated-subtitle');
    if (animatedSubtitleEl) {
        const subtitles = ["Automate Tedious Reports...", "Summarize Long Meetings...", "Draft Professional Emails..."];
        let subtitleIndex = 0;
        setInterval(() => {
            subtitleIndex = (subtitleIndex + 1) % subtitles.length;
            animatedSubtitleEl.textContent = subtitles[subtitleIndex];
        }, 4000);
    }

    // Event listeners that need to call a service function
    document.addEventListener('click', (e) => {
        if (e.target.matches('.unfavorite-btn')) {
            promptService.removePromptFromLibrary(e.target.dataset.id);
        }
        if (e.target.matches('.remove-custom-btn')) {
            promptService.removePromptFromLibrary(e.target.dataset.id);
        }
    });
}


// --- START THE APP ---
document.addEventListener('DOMContentLoaded', main);
