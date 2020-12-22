# JavaScript Expressions

Synergy doesn't allow you to write arbitrary JavaScript expressions inside your templates. This helps to keep a clearer separation of concerns between your JavaScript and your HTML. That being said, there are a couple of simple expressions that are supported to make working with attributes a little easier...

## Logical Not ( ! )

You can prefix a property name with an exclamation mark in order to negate it.

```html
<h3>
  <button id="{{ id }}" aria-expanded="{{ expanded }}">{{ title }}</button>
</h3>
<div aria-labelledby="{{ id }}" hidden="{{ !expanded }}">
  <!-- ... -->
</div>
```

## Object Spread ( ... )

You can prefix a property name with an ellipsis to spread all of the keys and values of an object onto an element as individual attributes.

```js
      {
        slider: {
          name: 'slider',
          type: 'range',
          min: '0',
          max: '360',
        },
      }
```

```html
<input {{...slider}} />
```
