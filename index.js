/**
 * Create new HTMLElement. By default is DIV.
 * @param {*} children Element childrend (HTMLElement, array of HTMLElements, string, HTML string, array of strings)
 * @param {object} attrs Element attributes
 * @param {string} tag Element tag. By default is DIV
 * @returns {HTMLElement}
 */
export default function el (children=null, attrs={}, tag='div') {
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
    } else if (typeof children==='object' && children.hasOwnProperty('nodeType')) {
      _el.appendChild(children);
    } else {
      _el.innerHTML = children;
    }
  }
  return _el;
}
