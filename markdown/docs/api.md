# API

Synergy exposes the `define` function that you can use to create a new custom element.

## define

The `define()` function registers a new Custom Element.

### Syntax

```js
define(tagName, factory, template, options);
```

### Parameters

- `tagName` (string) - Name for the new custom element. As per the Custom Element
  spec, an elements name must include a hyphen.

- `factory` (function) - A factory function that will be called whenever a new instance of your custom element is created. It will be provided with two arguments:
  1. An object of key/value pairs sourced from the elements attributes or properties (in that order)
  2. The element node itself.

Returns a plain JavaScript object to provide the model for your custom element.

- `template` (HTMLTemplateElement|string) - The HTML for your view.

- `options` (object) - The available options are:

  - `shadow` ("open" | "closed") - A string representing the shadow _mode_. If this option is omitted, then Shadow DOM is not used and `<slot>` functionality is polyfilled.

### factory

Your custom elements initial attribute and property names and values are passed to your factory function when a new instance of the element is created.

```js
const fooFactory = ({ name = '', disabled }) => {
  return {
    name,
    disabled,
  };
};
```

These values are provided by the author of the document so there's no guarantee as to what you will receive, so you should _always_ destructure the initial properties to get only the values you want (as opposed to spreading everything into your model).

When destructuring your elements initial attributes...

- **_Do_** provide default values for non-boolean properties to ensure that your element has what it needs in case nothing is provided.

- **_Don't_** provide default values for boolean attributes, - if it's not present on the element then it _should be falsy_.

> The properties you read from your factory functions object argument are automagically initialised as reactive properties and attributes so that, whenever they change on the Custom Element instance, your model will be updated automatically.

### Lifecycle Callbacks

This section lists all of the lifecycle callbacks that you can define on your model.

```js
({
  connectedCallback(model) {
    /* Invoked each time the custom 
    element is appended into a document-
    connected element */
  },
  updatedCallback(model, previousState) {
    /* Invoked each time the model is 
    updated. This method is not called 
    after the initial render. prevState is 
    an object representing the state of 
    the model prior to the last update */
  },
  disconnectedCallback() {
    /* Invoked each time the custom 
    element is disconnected from the 
    DOM */
  },
});
```
