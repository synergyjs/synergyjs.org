## The tiny runtime library for building web user interfaces.

### Declarative

Express your UI simply in terms of data (JS) and
templates (HTML & CSS) and Synergy will update
your UI efficiently whenever your data changes.

### Component-driven

Build encapsulated and reusable custom elements
and then compose them together to make complex
UIs.

### Interoperable

Create standalone components that will work
together with any other framework or library.

---

### A Simple Custom Element

```html
<script type="module">
  import synergy from 'https://unpkg.com/synergy@1.5.0';

  synergy.define('hello-world', ({ name }) => ({
    name,
  }));
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
