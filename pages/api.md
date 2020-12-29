## API

The high-level Synergy API is comprised of just
two functions, (`define` and `render`). The
`define` function is used to register new custom
elements, the reusable blocks that you will use to
build your user interface. The lower-level
`render` function is used to bind directly to the
DOM. It's used by `define` under the hood, and you
may also find this function useful for rendering
the main DOM tree that contains your custom
elements.

In addition, the instances created by both
`define` and `render` have a set of lifecycle
events available for you to hook into with your
own custom handler functions.

### define

The `define()` function registers a new Custom
Element.

#### Syntax

```js
define(tagName, factory, template);
```

#### Parameters

- `tagName` (string) Name for the new custom
  element. As per the Custom Element spec, an
  elements name must include a hyphen.

- `factory` (function) A Factory function that
  accepts a single argument (an object containing
  the elements initial attribute name/value pairs)
  . Returns a plain JavaScript object to provide
  the viewmodel for your custom element.

- `template` (string|element) Either an HTML
  string or a `<template>` element. If omitted,
  synergy expects your document to include a
  Template element with an id matching `tagName`.

#### Factory

Your custom elements initial attribute names and
values will be passed to your factory function as
a single object argument during initialisation.

```js
const xElementFactory = ({
  name = '',
  disabled = false,
}) => {
  return {
    name,
    disabled,
  };
};
```

The properties you accept here form your custom
elements _observed attributes_ and your viewmodel
will be updated automatically whenever any of
those attributes change.

Remember that, because these values are provided
by the author of the document, there's no
guarantee as to what you will receive, so you
should _always_...

- destructure the initial properties to get only
  the values you want / expect
- provide default values to ensure that your
  custom element still works (or fails gracefully)

#### Lifecycle Hooks

```js
({
  connectedCallback() {
    /* Invoked each time the custom 
    element is appended into a document-
    connected element */
  },
  observedProperties: ['foo', 'bar'],
  propertyChangedCallback(name, value) {
    /* Invoked whenever any of the 
    properties declared in the 
    observedProperties array have 
    changed. */
  },
  disconnectedCallback() {
    /* Invoked each time the custom 
    element is disconnected from the 
    DOM */
  },
});
```

### render

The `render()` method combines an HTML template
with a JavaScript object and then appends the
rendered HTML to an existing DOM element node.

#### Syntax

```js
let view = synergy.render(
  element,
  viewmodel,
  template
);
```

#### Parameters

- `element` An existing DOM element node to which
  the rendered HTML should be appended.

- `viewmodel` A plain JavaScript object that
  contains the data for your view.

- `template` Either an HTML string or a
  `<template>` node.

#### Return value

A proxied version of your JavaScript object that
will automatically update the UI whenever any of
its values change

```js
let view = synergy.render(
  document.getElementById('app'),
  { message: 'Hello World!' },
  `<p>{{ message }}</p>`
);

view.message = '¡Hola Mundo!';
```

In the example above, we initialise the view with
a paragraph that reads "Hello World!". We then
change the value of message to '¡Hola Mundo!' and
Synergy updates the DOM automatically.
