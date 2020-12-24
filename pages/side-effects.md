## Side Effects

### propertyChangedCallback

Synergy updates the DOM once per animation frame
if there are any changes in the viewmodel to
reflect.

If you implement a `propertyChangedCallback`
method on your viewmodel, then this method will be
invoked once for each property that has changed
since the last update.

```js
{
  todos: [],
  propertyChangedCallback(path) {
    if (path.match(/^todos.?/)) {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }
}
```
