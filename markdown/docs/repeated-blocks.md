# Repeated Blocks

Repeat a block of HTML for each item in an array using a template element together with the `each` attribute.

Model:

```js
{
  names: ['kate', 'kevin', 'randall'];
}
```

Template:

```html
<ul>
  <template each="name in names">
    <li>Hello {{ name }}</li>
  </template>
</ul>
```

You can also provide a second argument for the index of the current item.

```html
<ul>
  <template each="(todo, i) in todos">
    <li>todo {{ i }} of {{ todos.length }}</li>
  </template>
</ul>
```

## Keyed Arrays

Keys help Synergy identify which items in an array of objects
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
