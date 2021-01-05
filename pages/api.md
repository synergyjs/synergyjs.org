## API

The high-level Synergy API is comprised of just two functions, (`define` and
`render`). The `define` function is used to register new custom elements, the
reusable blocks that you will use to build your user interface. The lower-level
`render` function is used to bind directly to the DOM. It's used by `define`
under the hood, and you may also find this function useful for rendering the
main DOM tree that contains your custom elements.

In addition, the instances created by both `define` and `render` have a set of
lifecycle events available for you to hook into with your own custom handler
functions.

### define

The `define()` function registers a new Custom Element.

#### Syntax

```js
define(tagName, factory, options);
```

#### Parameters

- `tagName` (string) Name for the new custom element. As per the Custom Element
  spec, an elements name must include a hyphen.

- `factory` (function) A Factory function that accepts a single argument (an
  object containing the elements initial attribute name/value pairs) . Returns a
  plain JavaScript object to provide the viewmodel for your custom element.

- `template` (string|node) Either an HTML string or a `<template>` element node.

- `options` (object) The available options are:

  - `observedAttributes` (array) An array containing the element attributes that
    you want to observe.

#### Factory

Your custom elements initial attribute names and values will be passed to your
factory function as a single object argument during initialisation.

```js
const xElementFactory = ({
  name = "",
  disabled = false,
}) => {
  return {
    name,
    disabled,
  };
};
```

Remember that, because these values are provided by the author of the document,
there's no guarantee as to what you will receive, so you should _always_...

- destructure the initial properties to get only the values you want
- provide default values to ensure that your custom element still works or fails
  gracefully

#### Lifecycle Hooks

```js
({
  connectedCallback() {
    /* Invoked each time the custom 
    element is appended into a document-
    connected element */
  },
  postupdateCallback(prevState) {
    /* Invoked each time the view is 
    updated. This method is not called 
    after the initial render. prevState is 
    an object representing the state of 
    the viewmodel prior to the last update */
  },
  disconnectedCallback() {
    /* Invoked each time the custom 
    element is disconnected from the 
    DOM */
  },
  adoptedCallback() {
    /* Invoked each time the custom 
    element is moved to a new document */
  },
});
```

### render

The `render()` method combines an HTML template with a JavaScript object and
then appends the rendered HTML to an existing DOM element node.

#### Syntax

```js
let view = synergy.render(
  element,
  viewmodel,
  template
);
```

#### Parameters

- `element` (node) An existing DOM element node to which the rendered HTML
  should be appended.

- `viewmodel` (object) A plain JavaScript object that contains the data for your
  view.

- `template` (string|node) Either an HTML string or a `<template>` element node.

#### Return value

A proxied version of your JavaScript object that will automatically update the
UI whenever any of its values change

```js
let view = synergy.render(
  document.getElementById("app"),
  { message: "Hello World!" },
  `<p>{{ message }}</p>`
);

view.message = "¡Hola Mundo!";
```

In the example above, we initialise the view with a paragraph that reads "Hello
World!". We then change the value of message to '¡Hola Mundo!' and Synergy
updates the DOM automatically.
