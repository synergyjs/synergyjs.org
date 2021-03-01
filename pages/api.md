## API

The high-level Synergy API is comprised of just two functions, (`define` and `render`). The `define` function is used to register new custom elements, the reusable blocks that you will use to build your user interface. The lower-level `render` function is used to bind directly to the DOM. It's used by `define` under the hood, and you may also find this function useful for rendering the
main DOM tree that contains your custom elements.

### define

The `define()` function registers a new Custom Element.

#### Syntax

```js
define(tagName, factory, template, options);
```

#### Parameters

- `tagName` (string) - Name for the new custom element. As per the Custom Element
  spec, an elements name must include a hyphen.

- `factory` (function) - A factory function that will be called whenever a new instance of your custom element is created. It will be provided with two arguments: an object representing the elements initial attribute name/value pairs, and the element node itself. Returns a plain JavaScript object to provide the viewmodel for your custom element.

- `template` (HTMLTemplateElement|string) - The HTML for your view.

- `options` (object) - The available options are:

  - `observe` (array) - An array containing the element attributes and properties that you want to observe.

  - `shadow` ("open" | "closed") - A string representing the shadow _mode_. If this option is omitted, then Shadow DOM is not used and `<slot>` functionality is polyfilled.

  - `lifecycle` (object) - An object containing one or more lifecycle hooks.

#### factory

Your custom elements initial attribute names and values are passed to your
factory function as the first argument when an instance of the element is created.

```js
const fooFactory = ({ name = "", disabled }) => {
  return {
    name,
    disabled,
  };
};
```

Remember that, because these values are provided by the author of the document, there's no guarantee as to what you will receive, so you should _always_ destructure the initial properties to get only the values you want (as opposed to spreading everything into your viewmodel).

When destructuring your elements initial attributes...

- **_Do_** provide default values for non-boolean properties to ensure that your element has what it needs, regardless of what it's provided with.

- **_Don't_** provide default values for boolean attributes, - if it's not present on the element then it _should_ be undefined.

### render

The `render()` method combines an HTML template with a JavaScript object and then appends the rendered HTML to an existing DOM element node.

#### Syntax

```js
let view = render(element, viewmodel, template);
```

#### Parameters

- `element` (node) An existing DOM element node to which the rendered HTML
  should be appended.

- `viewmodel` (object) A plain JavaScript object that contains the data for your
  view.

- `template` (HTMLTemplateElement|string) - The HTML for your view.

- `options` (object) - The available options are:

  - `lifecycle` (object) - An object containing one or more lifecycle hooks.

#### Return value

A proxied version of your JavaScript object that will automatically update the UI whenever any of its values change

```js
let view = render(
  document.getElementById("app"),
  { message: "Hello World!" },
  `<p>{{ message }}</p>`
);

view.message = "¡Hola Mundo!";
```

In the example above, we initialise the view with a paragraph that reads "Hello World!". We then change the value of message to '¡Hola Mundo!' and Synergy updates the DOM automatically.

#### Lifecycle Callbacks

This section lists all of the lifecycle callbacks tht you can define.

```js
({
  connectedCallback(viewmodel) {
    /* Invoked each time the custom 
    element is appended into a document-
    connected element */
  },
  updatedCallback(viewmodel, prevState) {
    /* Invoked each time the viewmodel is 
    updated. This method is not called 
    after the initial render. prevState is 
    an object representing the state of 
    the viewmodel prior to the last update */
  },
  disconnectedCallback(viewmodel) {
    /* Invoked each time the custom 
    element is disconnected from the 
    DOM */
  },
  adoptedCallback(viewmodel) {
    /* Invoked each time the custom 
    element is moved to a new document */
  },
});
```
