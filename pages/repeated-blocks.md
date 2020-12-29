## Repeated Blocks

Repeat a block of HTML for each item in an Array
by surrounding it with the `each` opening (`#`)
and closing (`/`) comments.

View:

```js
{
  names: ['kate', 'kevin', 'randall'];
}
```

Template:

```html
<ul>
  <!-- #each name in names -->
  <li>Hello {{ name }}</li>
  <!-- /each -->
</ul>
```

You can access the current index with the dot
character

```html
<ul>
  <!-- #each todo in todos -->
  <li>
    <p>todo {{ . }} of {{ todos.length }}</p>
  </li>
  <!-- /each -->
</ul>
```

### Keyed Arrays

Keys help Synergy identify which items in an Array
have changed. Using keys improves performance and
avoids unexpected behaviour when re-rendering.

The key can be any primitive value, as long as it
is unique to that item within the Array.

By default, if the Array item is an object, then
Synergy will look for an `id` property and assume
that to be the key if you haven't said otherwise.

Set the `key` parameter if you need to override
the default behaviour...

```html
<ul>
  <!-- #each person in people (key=foo) -->
  <li>Hello {{ person.name }}</li>
  <!-- /each -->
</ul>
```
