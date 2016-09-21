/**
 * Create new HTMLElement. By default is DIV.
 * @param {*} children Element childrend (HTMLElement, array of HTMLElements, string, HTML string, array of strings)
 * @param {object} attrs Element attributes
 * @param {string} tag Element tag. By default is DIV
 * @returns {HTMLElement}
 */
function el (children=null, attrs={}, tag='div') {
  let _el = document.createElement(tag);
  for (let attrName in attrs) {
    if (attrs.hasOwnProperty(attrName)) {
      _el[attrName] = (attrName.indexOf('on')===0 ? attrs[attrName].bind(null, _el): attrs[attrName]);
    }
  }
  if (children) {
    if (children instanceof Array) {
      for (let i=0,ln=children.length; i<ln; i++) {
        if (typeof children[i]==='array' || typeof children[i]==='string') {
          _el.appendChild(el(children[i]));
        } else {
          _el.appendChild(children[i]);
        }
      }
    } else if (typeof children==='string') {
      _el.innerHTML = children;
    } else {
      _el.appendChild(children);
    }
  }
  return _el;
}

/**
 * Apply a object of {selector: {function|string|HTMLElement}} to target element.
 * This function is searching for element of selector and replace content of found element.
 * If value is a function it will be called with argument that contain element that found by selector.
 * If value is a string it will be just inserted as a HTML content.
 * If value is an HTMLElement it will be appended as a child element.
 * @param {HTMLElement} An target element
 * @param {object} An object that contain {selector: {function|string|HTMLElement}}
 * @returns {HTMLElement}
 */
function apply (el, children) {
  if (children instanceof Array) {
    for (let i=0,ln=children.length; i<ln; i++) {
      apply(el, children[i]);
    }
    return el;
  }
  for (let key in children) {
    if (children.hasOwnProperty(key)) {
      let placeholderEl = el.querySelector(key);
      if (placeholderEl) {
        if (!children[key]) {
          throw new Error(`The right type of object property value is: 'function', 'string' or 'HTMLElement'. Got '${typeof children[key]}'.`);
        }
        if (typeof children[key]==='function') {
          children[key](placeholderEl);
        } else if (typeof children[key]==='string') {
          placeholderEl.innerHTML = children[key];
        } else {
          placeholderEl.innerHTML = '';
          placeholderEl.appendChild(children[key]);
        }
      } else {
        throw new Error(`Selector '${key}' is not found.`);
      }
    }
  }
  return el;
}

module.exports = {el, apply};
