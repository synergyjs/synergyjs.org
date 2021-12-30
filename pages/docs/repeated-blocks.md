# Repeated Blocks

Repeated blocks work with Arrays and Objects.

Repeat a block of HTML for each item in a collection using a template element together with the `each` attribute.

Model:

```js
{
  names: ["kate", "kevin", "randall"]
}
```

Template:

```html
<ul>
  <li each="name in names">Hello {{ name }}</li>
</ul>
```

You can use parentheses to access both the key and the value.

Template:

```html
<ul>
  <li each="(index, todo) in todos">
    todo {{ index }} of {{ todos.length }}
  </li>
</ul>
```

Property access via the identifier is optional, you can also access directly like so...

Model:

```js
{
  bars: [
    {
      x: 0,
      y: 0,
      width: 32,
      height: 16,
      fill: "hsl(100, 50%, 50%)",
    },
    {
      x: 0,
      y: 16,
      width: 64,
      height: 16,
      fill: "hsl(200, 50%, 50%)",
    },
    //...
  ]
}
```

Template:

```html
<svg
  viewBox="0 0 128 128"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    each="bars"
    :x
    :y
    :width
    :height
    :fill
    class="bar"
  />
</svg>
```

...when accessing properties in this way, Synergy will first check to see if the property is defined on the current item within the iteration, and will otherwise try the same property against the viewmodel itself.

## Keyed Arrays

Keys help Synergy identify which items in an collection of objects
have changed.

Using keys improves performance and
avoids unexpected behaviour when re-rendering so it's always best to use them.

By default, Synergy assumes the `id` property (if there is one) to be the key.

If you need to nominate another property then you can do so with the `key` attribute. The best way to pick a key is to use a primitive value that is unique to that item within the array.

```html
<ul>
  <template each="person in people" key="foo">
    <li>Hello {{ person.name }}</li>
  </template>
</ul>
```
