## Events

Synergy assumes any attribute name prefixed with "on" to point to an event handler on your viewmodel.

Viewmodel:

```js
{
  sayHello: function() {
    alert("hi!");
  }
};
```

Template:

```html
<button onclick="sayHello">Say hello</button>
```

### Function arguments

When triggering events from within repeated blocks it can be useful to pass data back into your viewmodel so that you have direct access to the relevant list item. You can do this using the function invocation syntax...

Viewmodel:

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
<template each="artist in artists">
  <article>
    <h4>{{ artist.name }}</h4>
    <ul>
      <template each="tag in artist.tags">
        <li onclick="select(artist, tag)">{{ tag }}</li>
      </template>
    </ul>
  </article>
</template>
```

### Event object

You can access the native event object using the fat arrow syntax:

Viewmodel:

```html
<button onclick="e => sayHello(e)">Say hello</button>
```
