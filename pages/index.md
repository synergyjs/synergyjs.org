## The tiny runtime library for building web user interfaces.

### Declarative

Express your UI simply in terms of data (JS) and
templates (HTML & CSS), then let Synergy bind them
together so that your UI updates efficiently
whenever your data changes.

### Component-driven

Build encapsulated and reusable custom elements
and then compose them together to make complex
UIs.

### Interoperable

Synergy is a lightweight abstraction over standard
Custom Elements, giving you all the power to
extend HTML in the browser. Just like built-in
HTML elements, your custom elements may expose
their "API" through their attributes, making them
interoperable with any other library.

---

### A Simple Custom Element

```html
<script type="module">
  import define from 'https://unpkg.com/synergy@1.5.0';

  define('hello-world', ({ name }) => ({ name }));
</script>
<template id="hello-world">
  <p>Hello {{ name }}</p>
</template>
```

Now that your custom element is defined, you can
use it anywhere inside the document...

```html
<hello-world name="kimberley"></hello-world>
```
