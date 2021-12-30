# hello world!

All you need to try Synergy out is a code editor and a browser.

1. start by creating an HTML file and add a script so that you can import the Synergy library.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Synergy - Hello World</title>
  </head>
  <body>
    <script type="module">
      import { define } from "https://unpkg.com/synergy@7.0.0"
    </script>
  </body>
</html>
```

> You can also install Synergy as a project dependency using NPM or Yarn. For the purposes of this tutorial however we're just going to load Synergy directly from a CDN.

The `define` function accepts four arguments, but for now, we'll just concentrate on the first three...

```js
define(/*name, factory, template*/)
```

As per the Custom Element specification, the name of a Custom Element must always include a hyphen in order to differentiate Custom Elements from standard built-in elements like the `<a>` or `<p>` tags. Our example is the Synergy version of "hello world", so let's go ahead and name our Custom Element `hello-world`.

```js
let name = "hello-world"
```

The second argument is a _factory function_, which is simply a function that returns an object to provide the data for our view.

```js
let factory = () => ({ name: "world" })
```

The third argument is the HTML template for our view. This can be a string, or an HTMLTemplateElement node. Let's just use a string for this example...

```js
let template = "<p>Hello {{ name }}!</p>"
```

Now we can go ahead an pass those arguments to the `define` function in order to register our new Custom Element with the document.

```js
define(name, factory, template)
```

You won't see anything on the page just yet, but we can now use our new Custom Element anywhere within the document body, just like any built-in HTML element.

Let's give it a try by adding a `hello-world` element to the start of our document body.

```html
<body>
  <hello-world></hello-world>
  <script type="module">
    import { define } from "https://unpkg.com/synergy@7.0.0"
    define(
      "hello-world",
      () => ({ name: "world" }),
      "<p>Hello {{ name }}!</p>"
    )
  </script>
</body>
```

If you have followed the steps above, you should see that our Custom Element renders "Hello world!" inside its paragraph element.

A Custom Element is very much like a standard HTML element in that it can be configured via its attributes and properties. Let's give that a try now by passing in a new name to our Custom Element.

```html
<hello-world name="you"></hello-world>
```

Once you've added the name attribute, save the file and refresh the page in your browser and you will see that our Custom Element now renders "Hello you!".

Great job! That's it for the first lesson. There will be more lessons coming very soon!

> **Help is available:** If you get stuck, or have any ideas or feedback that you would like to share then you can reach out on [Github Discussions](https://github.com/defx/synergy/discussions/)
