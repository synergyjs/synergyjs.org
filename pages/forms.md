## Forms

Named inputs are automatically bound to properties
of the same name on your data.

```html
<input name="color" type="color" />
```

```js
{
  color: '#4287f5';
}
```

### Submitting Form Data

By default, a HTML form will browse to a new page
when the user submits the form. Submission happens
when the user actives either a) an
input[type="submit"], or b) a
button[type="submit"].

> In some browsers, a button _without_ a [type]
> will be assumed to be [type="submit"] if it
> resides within a form element, so you should
> _always_ set a buttons `type` attribute when it
> lives within a form.

If you wish to override the browsers default
behaviour, perhaps to execute some JavaScript
before submitting the form data, then you would do
that by binding to the forms submit event, and
calling `preventDefault` on the event object
inside your handler function to stop the browser
from submitting the form.

```html
<form onsubmit="handleForm">
  <input name="formData.name" />
  <input name="formData.email" type="email" />
  <input type="submit" value="Submit" />
</form>
```

```js
{
  formData: {},
  handleForm: function(event) {
    console.log(this.formData);
    event.preventDefault();
  }
};
```

### Select

Simply name the `<select>`...

```html
<label for="pet-select">Choose a pet:</label>
<select name="pets" id="pet-select">
  <option value="">
    --Please choose an option--
  </option>
  <option value="dog">Dog</option>
  <option value="cat">Cat</option>
  <option value="hamster">Hamster</option>
  <option value="parrot">Parrot</option>
  <option value="spider">Spider</option>
  <option value="goldfish">Goldfish</option>
</select>
```

...and the value of the property will reflect the
value of the currently selected `<option>`:

```js
{
  pets: 'hamster';
}
```

The standard HTML `<select>` element also supports
the ability to select multiple options, using the
**multiple** attribute:

```html
<select
  name="pets"
  id="pet-select"
  multiple
></select>
```

A `<select>` with `[multiple]` binds to an Array
on your data:

```js
{
  pets: ['hamster', 'spider'];
}
```

### Radio Buttons

Add a name to each radio button to indicate which
_group_ it belongs to.

```html
<input
  type="radio"
  name="filter"
  value="all"
  id="filter.all"
/>
<input
  type="radio"
  name="filter"
  value="active"
  id="filter.active"
/>
<input
  type="radio"
  name="filter"
  value="complete"
  id="filter.complete"
/>
```

As with `<select>`, the value of the named
property will reflect the value of the selected
`<input type="radio">`.

```js
{
  filter: 'active';
}
```
