## Events

Synergy assumes any attribute name prefixed with
"on" to point to an event handler on your
viewmodel.

View:

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

The first argument to your event handler is always
a native DOM Event object

```js
{
  handleClick: function(event) {
    event.preventDefault();
    console.log("the link was clicked");
  }
};
```

If the target of the event is within a repeated
block, then the second argument to your handler
will be the datum for that particular item.

```js
{
  todos: [
    /* ... */
  ],
  todoClicked: function(event, todo) {
    /*... */
  };
}
```

```html
<ul>
  <!-- #each todo in todos -->
  <li>
    <h3 onclick="todoClicked">
      {{ todo.title }}
    </h3>
  </li>
  <!-- /each -->
</ul>
```
