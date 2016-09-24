# El tool

Super lightweight tool for create DOM elements.

# Examples

* [ToDo app](https://github.com/jmas/el-todo)

# Quick code example

```js
import {$el} from 'el_';

document.body.appendChild($el(`
  <h1></h1>
  <form id="form">
    <input id="query" type="text" />
    <input type="submit" />
  </form>
`, {
  'onsubmit #form': (el, event) => {
    event.preventDefault();
    alert(el.querySelector('#query').value);
  },
  'find h1': 'Hello, dude!'
}));
```
