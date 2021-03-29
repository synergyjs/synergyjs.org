# Class & Style

## Multiple classes with Array

Model:

```js
{
  classes: ['w32', 'h32', 'rounded-full', 'mx-auto'];
}
```

Template:

```html
<img class="{{ classes }}" />
```

Output:

```html
<img class="w32 h32 rounded-full mx-auto" />
```

## Static Conditional Classes with Object

Model:

```js
{
    classes: {
        'mx-auto': true,
        'has-error': false
    }
}
```

Template:

```html
<div class="{{ classes }}"></div>
```

Output:

```html
<div class="mx-auto"></div>
```

## Dynamic Conditional Classes with Getter + Object

Model:

```js
{
    hasErrors: true,
    get classes() {
        return {
            errors: this.hasErrors
        }
    }
}
```

Template:

```html
<form class="{{ classes }}"></form>
```

Output:

```html
<form class="errors"></form>
```

## Inline Styles

Model:

```js
{
    //...
   styles: {
        display: "inline-block",
        borderRadius: "3px",
        background: primary ? "white" : "transparent",
        color: primary ? "black" : "white",
        border: "2px solid white",
    }
}
```

Template:

```html
<button primary style="{{ styles }}"></button>
```

Output:

```html
<button
  primary
  style="
    display: inline-block; 
    border-radius: 3px; 
    background: white; 
    color: black; 
    border: 2px solid white;"
></button>
```
