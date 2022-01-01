# Templates

Synergy takes your HTML template and replaces the tokens inside it with data from your model, updating your UI whenever that data changes.

In a Synergy template, a **token** is identified by surrounding it with double curly braces.

## Text

Let's take a look at how token replacement works with some simple text.

Model:

```js
{
  name: "Kimberley"
}
```

Template:

```html
<p>hello {{ name }}!</p>
```

Output:

```html
<p>hello Kimberley!</p>
```

## Attributes

Attributes that you want to bind to properties of your viewmodel must be prefixed with the colon mark (`:`).

Model:

```js
{
  textColor: 'gold',
}
```

Template:

```html
<p :style="color: {{ textColor }}">ok</p>
```

Output:

```html
<p style="color: gold;">ok</p>
```

### Singular Named Property

If you only need to bind an attribute to a _single_ property of your viewmodel then you can simply reference that property by name, without the need for the curly braces.

Model:

```js
{
  classes: ["pt-6", "space-y-4"],
}
```

Template:

```html
<p id="foo" :class="classes">ok</p>
```

Output:

```html
<p id="foo" class="pt-6 space-y-4">ok</p>
```

### Shorthand / Same Name

If your property has the same name as the attribute you want to bind it to then you can use the shorthand notion.

Model:

```js
{
  width: "100%",
  height: "100%",
  fill: "black"
}
```

Template:

```html
<rect :width :height :fill />
```

Output:

```html
<rect width="100%" height="100%" fill="black" />
```

## Boolean attributes

Some HTML attributes are known as boolean attributes and they're considered to be _true_ if present or _false_ if absent.

Boolean values can be toggled by binding to a boolean value.

Model:

```js
{
  hidden: true
}
```

Template:

```html
<div :hidden></div>
```

Output:

```html
<div hidden></div>
```

## ARIA attributes

Some ARIA attributes accept the string values
"true" and "false". These aren't boolean
attributes but you can still bind them to booleans and Synergy will apply them as string values.

Model:

```js
{
  title: "more information",
  expanded: false
}
```

Template:

```html
<button :aria-expanded="expanded">{{ title }}</button>
<div :hidden="!expanded"></div>
```

Output:

```html
<button aria-expanded="false">{{ title }}</button>
<div hidden></div>
```

## Logical NOT (!)

As per the examples above, you can prefix boolean
properties with an exclamation mark to convert a
truthy value to a falsy value, and vice versa.

Model:

```js
{
  authenticated: true
}
```

Template:

```html
<div :hidden="authenticated">Log in</div>
<div :hidden="!authenticated">Log out</div>
```

Output:

```html
<span hidden>Log in</span><span>Log out</span>
```
