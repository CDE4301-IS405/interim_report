class ChartComponent extends HTMLElement {
  static get observedAttributes() {
    return ["tag", "subtitle"];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, _, newValue) {
    this[name] = newValue;
    if (name === 'tag') {
      this.id = newValue;
    }
  }

  render() {
    if (this.tag) {
      this.id = this.tag;
    }

    const div = document.createElement("div");
    div.className = "chart-wrapper";
    div.innerHTML = `
      <div id="${this.tag}-chart" class="chart-container"></div>
      ${this.subtitle ? `<sub>${this.subtitle}</sub>` : ''}
      <style>
        .chart-wrapper {
          display: block;
          text-align: center;
          margin: 2rem auto;
          max-width: 900px;
        }

        .chart-container {
          width: 100%;
          min-height: 500px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 20px;
        }

        sub {
          display: block;
          margin-top: 15px;
          font-size: 1rem;
          font-style: italic;
          color: #666;
        }
      </style>
    `;

    this.appendChild(div);
  }

  createChart(data, layout, config = {}) {
    const chartDiv = this.querySelector(`#${this.tag}-chart`);
    if (chartDiv) {
      const defaultConfig = {
        responsive: true,
        displayModeBar: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        ...config
      };
      Plotly.newPlot(chartDiv, data, layout, defaultConfig);
    }
  }
}

customElements.define("chart-component", ChartComponent);