class InteractiveImage extends HTMLElement {
  static get observedAttributes() {
    return ["tag", "source", "subtitle"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.hotspots = [];
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

  addHotspot(x, y, title, description) {
    this.hotspots.push({ x, y, title, description, isOpen: false });
    this.render();
  }

  render() {
    if (this.tag) {
      this.id = this.tag;
    }

    const div = document.createElement("div");
    div.innerHTML = `
      <div class="interactive-container">
        <div class="image-wrapper">
          <img src="${this.source}" alt="${this.subtitle}">
          ${this.hotspots.map((hotspot, index) => `
            <button class="hotspot-button" 
                    style="left: ${hotspot.x}%; top: ${hotspot.y}%;"
                    data-index="${index}">
              <sl-icon name="plus-circle-fill"></sl-icon>
            </button>
            <div class="hotspot-content ${hotspot.isOpen ? 'open' : ''}" 
                 style="left: ${hotspot.x}%; top: ${hotspot.y + 5}%;"
                 data-index="${index}">
              <div class="hotspot-header">
                <strong>${hotspot.title}</strong>
                <button class="close-button" data-index="${index}">
                  <sl-icon name="x"></sl-icon>
                </button>
              </div>
              <p>${hotspot.description}</p>
            </div>
          `).join('')}
        </div>
        <sub>${this.subtitle}</sub>
      </div>
      <style>
        :host {
          display: block;
          text-align: center;
          margin: 2rem 0;
        }

        .interactive-container {
          max-width: var(--image-max-width, 100%);
          margin: 0 auto;
        }

        .image-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 8px;
        }

        .hotspot-button {
          position: absolute;
          transform: translate(-50%, -50%);
          background: rgba(59, 130, 246, 0.9);
          border: 2px solid white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
          padding: 0;
        }

        .hotspot-button:hover {
          background: rgba(37, 99, 235, 1);
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
        }

        .hotspot-button sl-icon {
          font-size: 20px;
          color: white;
        }

        .hotspot-content {
          position: absolute;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 16px;
          min-width: 250px;
          max-width: 350px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 20;
          display: none;
          animation: fadeIn 0.3s ease;
        }

        .hotspot-content.open {
          display: block;
        }

        .hotspot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 8px;
        }

        .hotspot-header strong {
          color: #1f2937;
          font-size: 14px;
        }

        .close-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #1f2937;
        }

        .close-button sl-icon {
          font-size: 18px;
        }

        .hotspot-content p {
          margin: 0;
          color: #4b5563;
          font-size: 13px;
          line-height: 1.5;
          text-align: left;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        sub {
          display: block;
          margin-top: 10px;
          font-size: 1rem;
          font-style: italic;
          color: #666;
        }

        @media (max-width: 768px) {
          .hotspot-content {
            min-width: 200px;
            max-width: 280px;
            font-size: 12px;
          }

          .hotspot-button {
            width: 28px;
            height: 28px;
          }

          .hotspot-button sl-icon {
            font-size: 18px;
          }
        }
      </style>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(div);

    // Add event listeners
    this.shadowRoot.querySelectorAll('.hotspot-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.toggleHotspot(index);
      });
    });

    this.shadowRoot.querySelectorAll('.close-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.currentTarget.dataset.index);
        this.closeHotspot(index);
      });
    });
  }

  toggleHotspot(index) {
    // Close all other hotspots
    this.hotspots.forEach((hotspot, i) => {
      if (i !== index) hotspot.isOpen = false;
    });
    // Toggle current hotspot
    this.hotspots[index].isOpen = !this.hotspots[index].isOpen;
    this.render();
  }

  closeHotspot(index) {
    this.hotspots[index].isOpen = false;
    this.render();
  }
}

customElements.define("interactive-image", InteractiveImage);