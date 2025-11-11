class InteractiveImage extends HTMLElement {
  static get observedAttributes() {
    return ["tag", "source", "subtitle"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.hotspots = [];
    this.modals = [];
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

  addHotspot(x, y, title, content) {
    this.hotspots.push({ x, y, title, content });
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
          `).join('')}
        </div>
        <sub>${this.subtitle}</sub>
      </div>

      <!-- Modals -->
      ${this.hotspots.map((hotspot, index) => `
        <div class="modal-overlay" id="modal-${index}" data-index="${index}">
          <div class="modal-container">
            <div class="modal-header">
              <h2>${hotspot.title}</h2>
              <button class="modal-close-button" data-index="${index}">
                <sl-icon name="x-lg"></sl-icon>
              </button>
            </div>
            <div class="modal-body">
              ${hotspot.content}
            </div>
          </div>
        </div>
      `).join('')}

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

        /* Modal Styles */
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9999;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        .modal-overlay.open {
          display: flex;
        }

        .modal-container {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 900px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #1f2937;
        }

        .modal-close-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.2s;
          border-radius: 4px;
        }

        .modal-close-button:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .modal-close-button sl-icon {
          font-size: 24px;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          color: #374151;
          line-height: 1.6;
        }

        .modal-body p {
          margin: 0 0 1rem 0;
          text-align: left;
        }

        .modal-body h3 {
          margin: 1.5rem 0 0.75rem 0;
          color: #1f2937;
        }

        .modal-body img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .modal-body ul, .modal-body ol {
          margin: 0.5rem 0 1rem 1.5rem;
          text-align: left;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
          .modal-container {
            width: 95%;
            max-height: 90vh;
          }

          .modal-header {
            padding: 16px;
          }

          .modal-header h2 {
            font-size: 1.25rem;
          }

          .modal-body {
            padding: 16px;
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

    // Add event listeners for hotspot buttons
    this.shadowRoot.querySelectorAll('.hotspot-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.openModal(index);
      });
    });

    // Add event listeners for modal close buttons
    this.shadowRoot.querySelectorAll('.modal-close-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.closeModal(index);
      });
    });

    // Close modal when clicking overlay
    this.shadowRoot.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          const index = parseInt(overlay.dataset.index);
          this.closeModal(index);
        }
      });
    });
  }

  openModal(index) {
    const modal = this.shadowRoot.querySelector(`#modal-${index}`);
    if (modal) {
      modal.classList.add('open');
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(index) {
    const modal = this.shadowRoot.querySelector(`#modal-${index}`);
    if (modal) {
      modal.classList.remove('open');
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }
}

customElements.define("interactive-image", InteractiveImage);