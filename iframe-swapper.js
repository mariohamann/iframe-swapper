class IframeSwapper extends HTMLElement {
  constructor() {
    super();
    this.observer = new MutationObserver(this.handleIframes.bind(this));
    this.lastIframeScrollY = 0;
  }

  connectedCallback() {
    this.observer.observe(this, { childList: true });
    this.swapDelay = this.getAttribute('swap-delay') || 100;
    this.customEventName = this.getAttribute('listen-for');
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  handleIframes(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'IFRAME') {
            this.emitEvent('iframe-added', node);
            this.setupIframeLoadListener(node);
          }
        });
      }
    }
  }

  setupIframeLoadListener(iframe) {
    if (this.customEventName) {
      const messageHandler = (event) => {
        if (event.source === iframe.contentWindow && event.data.type === this.customEventName) {
          this.onIframeEvent(iframe);
          window.removeEventListener('message', messageHandler);
        }
      };
      window.addEventListener('message', messageHandler);
    } else {
      iframe.onload = () => {
        this.onIframeEvent(iframe);
      };
    }
  }

  onIframeEvent(iframe) {
    const disableScroll = this.hasAttribute('disable-scroll');
    if (!disableScroll) {
      this.lastIframeScrollY = this.querySelector('iframe:first-of-type')?.contentWindow?.scrollY || 0;
    }

    this.emitEvent('iframe-loaded', iframe);
    setTimeout(() => this.updateIframeDisplay(), this.swapDelay);
  }

  updateIframeDisplay() {
    const iframes = this.querySelectorAll('iframe');
    iframes.forEach((iframe, index) => {
      if (index === iframes.length - 1) {
        iframe.style.display = 'block';
        if (!this.hasAttribute('disable-scroll') && this.lastIframeScrollY) {
          iframe.contentWindow?.scrollTo(0, this.lastIframeScrollY);
        }
      } else {
        iframe.remove();
        this.emitEvent('iframe-swapped', iframe);
      }
    });
  }

  emitEvent(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  /**
   * Adds a new iframe to the component.
   * @param {Object} options - Attributes to set on the new iframe element.
   */
  addIframe(options = {}) {
    const iframe = document.createElement('iframe');
    Object.entries(options).forEach(([key, value]) => {
      iframe.setAttribute(key, value);
    });
    this.appendChild(iframe);
  }
}

customElements.define('iframe-swapper', IframeSwapper);
