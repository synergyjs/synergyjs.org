## templates

Synergy's main purpose is _data binding_; taking
your HTML template and replacing the "tokens"
inside it with data from your JavaScript object,
then updating your UI whenever that data changes.

In a Synergy template, a **token** is identified
by surrounding it with double curly braces.

### Text

Let's take a look at how token replacement works
with some simple text.

View:

```js
{
  name: 'Ericka';
}
```

Template:

```html
<p>hello {{ name }}!</p>
```

Output:

```html
<p>hello Ericka!</p>
```

### Attributes

You can use tokens in the same way for both text
and attribute nodes.

View:

```js
{
  textColor: 'gold',
};
```

Template:

```html
<p style="color: {{ textColor }}">ok</p>
```

Output:

```html
<p style="color: gold;">ok</p>
```

### Boolean attributes

Some HTML attributes are known as boolean
attributes, which means that they're considered to
be _true_ if present, or _false_ if absent.

Boolean values can be toggled by binding to a
boolean value.

View:

```js
{
  hidden: true;
}
```

Template:

```html
<div hidden="{{ hidden }}"></div>
```

Output:

```html
<div hidden></div>
```

### ARIA attributes

Some ARIA attribute values can be "true" or
"false". You can also bind these to a boolean
value and Synergy will treat them accordingly.

View:

```js
{
  title: 'more information';
  expanded: false;
}
```

Template:

```html
<button aria-expanded="{{ expanded }}">
  {{ title }}
</button>
<div hidden="{{ !expanded }}"></div>
```

Output:

```html
<button aria-expanded="false">{{ title }}</button>
<div hidden></div>
```

> Note how a value can be negated by prefixing it
> with the `!` character.
