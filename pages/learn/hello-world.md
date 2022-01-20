# hello world!

All you need to try Synergy out is a code editor and a browser.

Let's start by creating an HTML file and add a script so that we can import Synergy into our document.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Synergy - Hello World</title>
  </head>
  <body>
    <script type="module">
      import { define } from "https://unpkg.com/synergy@7.0.2"
    </script>
  </body>
</html>
```

As you can see from the example above, Synergy exports the `define` function that we can use to create a new Custom Element.

The Custom Element API is a standard Web API that allows us to extend HTML with our very own Custom Elements. Synergy wraps around the Custom Element API to make it significantly easier to work with by allowing us to express our Custom Elements using a combination of declarative HTML templates and plain Javascript objects.

As per the Custom Element specification, the name of a Custom Element must always include a hyphen in order to differentiate Custom Elements from standard built-in elements like the `<a>` or `<p>` tags. A custom elements name is the first argument to the `define` function.

The second argument to `define` is a _factory function_, which is simply a function that returns a plain object to provide the data for our element. Once defined, there can be one or many instances of our new Custom Element on the page at any time, and the humble factory function provides the simplest of mechanisms for us to ensure that each element instance has its very own data object and isolated state to work with.

The third argument to `define` is the HTML template for our view. This can be provided as a string, or a `<template>` node. Using a template node has a few benefits, but the most immediate is the ability for us to harness our code editors built-in formatting and syntax highlighting capabilities by definining our HTML as HTML without any need for addition plugins.

Now let's go ahead and put all of this together in order to create a very simple Custom Element that will render "Hello World!".

```html
<body>
  <hello-world></hello-world>
  <script type="module">
    import { define } from "https://unpkg.com/synergy@7.0.3"
    define(
      "hello-world",
      () => ({ name: "world" }),
      "<p>Hello {{ name }}!</p>"
    )
  </script>
</body>
```

You will now see that our Custom Element renders "Hello world!" on the page.

Great job! We've created our first Custom Element using Synergy's `define` function, gave it a name, provided data for each instance of our new Custom Element via a factory function, and finally defined the markup for our Custom Element using a simple string template.

That's it for the first lesson. In the following lessons we will learn more about how Synergy works as we add more functionality to our `hello-world` Element.

> **Help is available:** If you get stuck, or have any ideas or feedback that you would like to share then you can reach out on [Github Discussions](https://github.com/defx/synergy/discussions/)
