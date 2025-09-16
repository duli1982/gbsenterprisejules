/* globals Chart */
import { opportunityDetailsData } from '../../data/opportunityData.js';

export class OpportunityChart {
    constructor(chartId, opportunityData, sliders, values, totalPercentageEl) {
        this.chartId = chartId;
        this.opportunityData = opportunityData;
        this.sliders = sliders;
        this.values = values;
        this.totalPercentageEl = totalPercentageEl;
        this.chart = null;

        this.init();
    }

    init() {
        const ctx = document.getElementById(this.chartId)?.getContext('2d');
        if (!ctx) {
            console.error('Chart canvas element not found');
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: this.opportunityData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 20, font: { size: 14 } }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#4A4A4A',
                        titleFont: { size: 16, weight: 'bold' },
                        bodyFont: { size: 14 },
                        padding: 12
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const i = elements[0].index;
                        const category = this.opportunityData.labels[i];
                        this.showOpportunityDetails(category);
                    }
                }
            }
        });

        this.setupSliderListeners();
        this.updateChartAndValues();
    }

    showOpportunityDetails(category) {
        const details = opportunityDetailsData[category];
        if (!details) return;

        document.getElementById('opportunity-intro').classList.add('hidden');
        const detailsContainer = document.getElementById('opportunity-details');
        detailsContainer.classList.remove('hidden');
        detailsContainer.classList.add('fade-in');

        document.getElementById('opportunity-title').textContent = details.title;
        document.getElementById('opportunity-description').textContent = details.description;
        const examplesList = document.getElementById('opportunity-examples');
        examplesList.innerHTML = '';
        details.examples.forEach(ex => {
            const li = document.createElement('li');
            li.textContent = ex;
            examplesList.appendChild(li);
        });
    }

    setupSliderListeners() {
        for (const key in this.sliders) {
            if (this.sliders[key]) {
                this.sliders[key].addEventListener('input', () => this.updateChartAndValues());
            }
        }
    }

    updateChartAndValues() {
        const newValues = Object.keys(this.sliders).map(key => parseInt(this.sliders[key].value));

        this.chart.data.datasets[0].data = newValues;
        this.chart.update();

        Object.keys(this.values).forEach((key, index) => {
            this.values[key].textContent = `${newValues[index]}%`;
        });

        const total = newValues.reduce((sum, val) => sum + val, 0);
        this.totalPercentageEl.textContent = `${total}%`;
        this.totalPercentageEl.classList.toggle('text-red-500', total !== 100);
        this.totalPercentageEl.classList.toggle('text-green-600', total === 100);
    }
}
