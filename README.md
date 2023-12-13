# `iframe-swapper` Web Component

The `iframe-swapper` is a custom web component designed for dynamically managing iframes within a web application. It allows for adding, swapping, and removing iframes based on interactions and events.

## Features

-   Dynamically add iframes to the component.
-   Automatically swap iframes when a new one is added.
-   Preserve scroll position when swapping iframes.
-   Emit custom events for iframe addition, load, and swap.
-   Optional delay for iframe swap.
-   Option to listen for custom events from iframes.

## Usage

1. **Adding the Component to HTML:**

    `<iframe-swapper></iframe-swapper>`

2. **Adding an Iframe:**

    You can add an iframe either manually by appending it as a child to the `iframe-swapper` element or by using the `addIframe` method.

    a. **Manually:**

    ```html
    <iframe-swapper>
    	<iframe src="./path-to-content"></iframe>
    </iframe-swapper>
    ```

    b. **Using `addIframe` Method:**

    ```js
    const iframeSwapper = document.querySelector("iframe-swapper");
    iframeSwapper.addIframe({ src: "./path-to-content" });
    ```

3. **Listening to Events:**

    The component emits three types of events: `iframe-added`, `iframe-loaded`, and `iframe-swapped`.

    ```js
    const iframeSwapper = document.querySelector("iframe-swapper");
    iframeSwapper.addEventListener("iframe-added", (event) => {
    	console.log("Iframe added:", event.detail);
    });
    ```

## Attributes

-   `swap-delay`: Time in milliseconds to delay the swap of iframes.
-   `listen-for`: Custom event type to listen for from the iframe content.

## API

### `addIframe(options = {})`

Adds a new iframe to the `iframe-swapper` component.

**Parameters:**

-   `options`: An object containing attributes to set on the new iframe element. You can use [any of the attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) available on the `iframe` element.

**Example:**

```js
const iframeSwapper = document.querySelector("iframe-swapper");
iframeSwapper.addIframe({ src: "./new-content-path" });
```

You even can provide complete HTML as the `srcdoc` attribute.

**Example:**

```js
const iframeSwapper = document.querySelector("iframe-swapper");
iframeSwapper.addIframe({
	srcdoc: `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My New Content</title>
      </head>
      <body>
        <h1>My New Content</h1>
      </body>
    </html>
  `,
});
```

## Event Handling

The component emits the following events:

-   `iframe-added`: Emitted when a new iframe is added.
-   `iframe-loaded`: Emitted when an iframe has fully loaded.
-   `iframe-swapped`: Emitted when an old iframe is removed, and a new one is displayed.

**Example:**

```js
const iframeSwapper = document.querySelector("iframe-swapper");
iframeSwapper.addEventListener("iframe-loaded", (event) => {
	console.log("Iframe loaded:", event.detail);
});
```
