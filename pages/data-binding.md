## Data binding

Use the double curly braces to bind named
properties from your JavaScript object to text or
attribute values within your HTML template.

```html
<p style="color: {{ primaryColor }}">
  {{ message }}
</p>
```

As far as text nodes are concerned, the values you
bind to them should always be primitives, and will
always be cast to strings unless the value is
`null` or `undefined`, in which case the text node
will be empty.

Attributes, on the other hand, support binding to
different data types in order to achieve different
goals...

### Attributes & Booleans

Any attribute that is bound to a boolean value
will be treated as a
[boolean attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#Boolean_Attributes),
unless it is an ARIA attribute, in which case the
boolean value will be cast to a string.

### CSS Classes

You can bind multiple values to an attribute with
an array.

```js
{
  classes: ['bg-white', 'rounded', 'p-6'];
}
```

```html
<section class="{{ classes }}">
  <!-- class="bg-white rounded p-6" -->
</section>
```

> You can use an array to bind multiple values to
> any attribute that accepts them

### Conditional Classes

You may wish to _conditionally_ apply CSS classes
to an element. You can do this by binding to a an
object. Only the keys with truthy values will be
applied.

```js
{
  classes: {
      'bg-white': true,
      'rounded', false,
      'p-6': true
    },
}
```

```html
<section class="{{ classes }}">
  <!-- class="bg-white p-6" -->
</section>
```

### Inline Styles

As well as binding the style attribute to a string
or an array, you can also bind this attribute to
an object representing a dictionary of CSS
properties and values.

```js
{
  goldenBox: {
    backgroundColor: 'gold',
    width: '100px',
    height: '100px'
  }
}
// -> "background-color: gold; width: 100px; height: 100px;"
```

### Getters

Define any property as a standard JavaScript
[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
in order to derive a value from _other_ values
within your viewmodel.

```js
{
  width: 100,
  height: 100,
  get styles() {
    return {
      backgroundColor: 'gold',
      color: 'tomato',
      width: this.width + 'px',
      height: this.height + 'px',
    }
  }
}
```

```html
<section style="{{ styles }}">
  <!-- ... -->
</section>
```
