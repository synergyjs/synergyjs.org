# Events

Synergy assumes any attribute name prefixed with "on" to point to an event handler on your model.

Model:

```js
{
  sayHello: function() {
    alert("hi!");
  }
};
```

Template:

```html
<button :onclick="sayHello">Say hello</button>
```

## Function arguments

When triggering events from within repeated blocks it can be useful to pass data back into your model so that you have direct access to the relevant list item. You can do this using the function invocation syntax...

Model:

```js
{
  artists: [
    {
      name: 'pablo picasso',
      tags: [
        'painter',
        'sculptor',
        'printmaker',
        'ceramicist',
        'theatre designer',
      ],
    },
    {
      name: 'salvador dali',
      tags: [
        'painter',
        'sculptor',
        'photographer',
        'writer'
      ],
    },
  ],
  select(artist, tag) {
    //...
  },
}
```

Template:

```html
<article each="artist in artists">
  <h4>{{ artist.name }}</h4>
  <ul>
    <li
      each="tag in artist.tags"
      :onclick="select(artist, tag)"
    >
      {{ tag }}
    </li>
  </ul>
</article>
```

## Event object

You can access the native event object using the fat arrow syntax:

Model:

```html
<button :onclick="e => sayHello(e)">
  Say hello
</button>
```
