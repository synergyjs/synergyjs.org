---
title: API
---

# API

Synergy exports the `define` function that you can use to create a new Custom Element.

## define

The `define()` function registers a new Custom Element.

### Syntax

```js
define(tagName, factory, template, options)
```

### Parameters

- `tagName` (string) - Name for the new Custom Element. As per the Custom Element
  spec, an elements name must include a hyphen.

- `factory` (function) - A factory function that will be called whenever a new instance of your Custom Element is created. It will be provided with one argument which is the Custom Element node itself. The factory function returns a plain object or a Promise that resolves to a plain object to provide the data for your Custom Element.

- `template` (HTMLTemplateElement | string) - The HTML for your view.

- `options` (object) - The available options are:

  - `shadow` ("open" | "closed") - A string representing the shadow _mode_. If this option is omitted then Shadow DOM is not used and `<slot>` functionality is polyfilled.

### factory

The object you return from your factory function provides the data for your view. Whenever any of the values on this object change, your view will be rerendered automatically to reflect those changes.

```js
const fooFactory = () => {
  return {
    name: "",
    disabled: false,
  }
}
```

If you want any of your properties to be reflected to/from your Custom Element instance via its attributes and/or properties, then simply prefix those property names with `$`.

```js
const fooFactory = () => {
  return {
    $name: "",
    disabled: false,
  }
}
```

Properties use camel case whereas attributes use kebab case. Always use camel case properties on your view model and Synergy will translate these accordingly to/from your Custom Element attributes.

### Lifecycle Callbacks

This section lists all of the lifecycle callbacks that you can define on your model.

```js
{
  connectedCallback() {
    /**
     * Invoked each time the custom element is appended into a
     * document-connected element
     */
  },
  updatedCallback(previousState) {
    /**
     * Invoked each time the view is updated. This method is not called after the initial render. previousState is an object representing the model state prior to the last update
     */
  },
  disconnectedCallback() {
    /**
     * Invoked each time the custom element is disconnected from the document
     */
  },
}
```
