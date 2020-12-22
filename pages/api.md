# API

## Define

The `define()` function registers your Custom Element.

### Syntax

```js
define(tagName, factory, template);
```

### Parameters

- `tagName` Name for the new custom element. Note that custom element names must contain a hyphen.

- `factory` A Factory function that returns a plain JavaScript object that will provide the data for your element.

- `template` (optional) Either an HTML string or a `<template>` element. If omitted, synergy expects your document to include a Template element with an id matching `tagName`.

## Render

The `render()` method combines an HTML template with a JavaScript object and then mounts the rendered HTML into an existing DOM node.

### Syntax

```js
let view = synergy.render(targetNode, viewmodel, template);
```

### Parameters

- `targetNode` An existing HTML element node where the rendered HTML should be mounted.

- `viewmodel` A plain JavaScript object that contains the data for your view.

- `template` Either an HTML string or a `<template>` node.

### Return value

A proxied version of your JavaScript object that will automatically update the UI whenever any of its values change

```js
let view = synergy.render(
  document.getElementById('app'),
  { message: 'Hello World!' },
  `<p>{{ message }}</p>`
);

view.message = '¡Hola Mundo!';
```

In the example above, we initialise the view with a paragraph that reads "Hello World!". We then change the value of message to '¡Hola Mundo!' and Synergy updates the DOM automatically.
