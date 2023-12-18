import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import './iframe-swapper.js';

describe('iframe-swapper component tests', () => {
  let srcdoc = '<!DOCTYPE html><html><body style="height: 3000px; display: block;"><script>function emitEvent() { window.parent.postMessage({ type: "custom-load-event" }, "*"); } window.onload = emitEvent;</script></body></html>';

  function setupEventListeners(el) {
    const events = {
      iframeAdded: false,
      iframeLoaded: false,
      iframeSwapped: false,
    };
    el.addEventListener('iframe-added', () => { events.iframeAdded = true; });
    el.addEventListener('iframe-loaded', () => { events.iframeLoaded = true; });
    el.addEventListener('iframe-swapped', () => { events.iframeSwapped = true; });
    return events;
  }

  it('should add an iframe correctly via method', async () => {
    const el = await fixture(html`<iframe-swapper></iframe-swapper>`);

    // add iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => el.querySelectorAll('iframe').length === 1);
    expect(el.querySelectorAll('iframe').length).to.equal(1);
  });

  it('should add an iframe correctly and emit iframe-added and iframe-loaded events', async () => {
    const el = await fixture(html`<iframe-swapper></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add iframe
    el.addIframe({ srcdoc });

    await waitUntil(() => events.iframeAdded && events.iframeLoaded);
    expect(el.querySelectorAll('iframe').length).to.equal(1);
    expect(events.iframeAdded).to.be.true;
    expect(events.iframeLoaded).to.be.true;
    expect(events.iframeSwapped).to.be.false; // Ensure iframe-swapped event is not fired for the first iframe
  });

  it('should emit iframe-added and iframe-loaded when iframe is added manually', async () => {
    const el = await fixture(html`<iframe-swapper></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add iframe
    const iframe = document.createElement('iframe');
    iframe.srcdoc = srcdoc;
    el.appendChild(iframe);

    await waitUntil(() => events.iframeAdded && events.iframeLoaded);
    expect(el.querySelectorAll('iframe').length).to.equal(1);
    expect(events.iframeAdded).to.be.true;
    expect(events.iframeLoaded).to.be.true;
    expect(events.iframeSwapped).to.be.false; // Ensure iframe-swapped event is not fired for the first iframe
  });

  it('should emit iframe-added, iframe-loaded & iframe-swapped events for second iframe', async () => {
    const el = await fixture(html`<iframe-swapper></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add first iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeAdded && events.iframeLoaded);

    // reset events
    events.iframeAdded = false;
    events.iframeLoaded = false;

    // add second iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeAdded && events.iframeLoaded && events.iframeSwapped);
  });

  it('should emit iframe-added, iframe-loaded & iframe-swapped events when second iframe added manually', async () => {
    const el = await fixture(html`<iframe-swapper></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add first iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeAdded && events.iframeLoaded);

    // reset events
    events.iframeAdded = false;
    events.iframeLoaded = false;

    // add second iframe
    const iframe = document.createElement('iframe');
    iframe.srcdoc = srcdoc;
    el.appendChild(iframe);
    await waitUntil(() => events.iframeAdded && events.iframeLoaded && events.iframeSwapped);
  });


  it('should remove old iframe on iframe-loaded event', async () => {
    const el = await fixture(html`<iframe-swapper></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add first iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeAdded);

    // add second iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeSwapped);
  });

  it('should transfer scroll position to new iframe', async () => {
    const el = await fixture(html`<iframe-swapper></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add first iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeLoaded);
    const iframe = el.querySelector('iframe');
    iframe.contentWindow.scrollTo(0, 100);

    // add second iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeSwapped);
    await waitUntil(() => el.querySelector('iframe').contentWindow.scrollY === 100);
  });

  it('should have a default delay', async () => {
    const el = await fixture(html`<iframe-swapper></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add first iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeLoaded);

    // add second iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeLoaded);
    const startTime = performance.now();
    await waitUntil(() => events.iframeSwapped);
    const endTime = performance.now();

    // 60ms tolerance for the test to pass
    expect(endTime - startTime).to.be.at.within(40, 160);
  });

  it('should respect swap-delay attribute', async () => {
    const delay = 1000;
    const el = await fixture(html`<iframe-swapper swap-delay="${delay}"></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add first iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeLoaded);

    // add second iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeLoaded);
    const startTime = performance.now();
    await waitUntil(() => events.iframeSwapped);
    const endTime = performance.now();

    // 200ms tolerance for the test to pass
    expect(endTime - startTime).to.be.at.within(delay - 200, delay + 200);
  });

  it('should listen for custom event specified in listen-for attribute', async () => {
    const el = await fixture(html`<iframe-swapper listen-for="custom-load-event"></iframe-swapper>`);
    const events = setupEventListeners(el);

    // add iframe
    el.addIframe({ srcdoc });
    await waitUntil(() => events.iframeLoaded);
  });
});
