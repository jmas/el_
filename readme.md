# El tool

Super lightweight tool for create DOM elements.

# Examples

* [ToDo app](https://github.com/jmas/el-todo)

# Quick code example

```
import {el, apply} from 'el_';

apply(document.body, apply(el(`
  <h1></h1>
  <form id="form">
    <input id="query" type="text" />
    <input type="submit" />
  </form>
`), {
  'h1': 'Hello, dude!',
  '#form': (el) => {
    el.onsubmit = (event) => {
      event.preventDefault();
      alert(el.querySelector('#query').value);
    };
  }
}));
```
