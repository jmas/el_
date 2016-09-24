const DEFAULT_TAG = 'div';

/**
 * Create new element.
 * @param {null|array|string|HTMLElement} children Element children (HTMLElement, array of HTMLElements, string, HTML string, array of strings)
 * @param {null|object} attrs Element attributes. Special attributes `onclick #selector`, `find #selector`
 * @param {string} tag Element tag. By default is DIV
 * @returns {HTMLElement}
 */
function $el (children=null, attrs=null, tag=DEFAULT_TAG) {
  let _el = document.createElement(tag);
  if (children) {
    if (children instanceof Array) {
      for (let i=0,ln=children.length; i<ln; i++) {
        if (typeof children[i]==='array' || typeof children[i]==='string') {
          _el.appendChild(el(children[i]));
        } else {
          _el.appendChild(children[i]);
        }
      }
    } else if (children instanceof HTMLElement) {
      _el.appendChild(children);
    } else {
      _el.innerHTML = children;
    }
  }
  if (attrs) {
    for (let attrName in attrs) if (attrs.hasOwnProperty(attrName)) {
      if (attrName.indexOf('on')===0) {
        if (attrName.indexOf(' ')!==-1 && children) {
          let [ eventName, selector ] = attrName.split(' ');
          let _els = _el.querySelectorAll(selector);
          let _elsLength = _els.length;
          if (_elsLength>0) {
            for (let i=0; i<_elsLength; i++) {
              _els[i][eventName] = attrs[attrName].bind(null, _els[i]);
            }
          }
        } else {
          _el[attrName] = attrs[attrName].bind(null, _el);
        }
      } else if (attrName.indexOf('find')===0 && children) {
        let [ eventName, selector ] = attrName.split(' ');
        let _els = _el.querySelectorAll(selector);
        let _elsLength = _els.length;
        if (_elsLength>0) {
          for (let i=0; i<_elsLength; i++) {
            if (typeof attrs[attrName]==='function') {
              attrs[attrName](_els[i]);
            } else if (typeof attrs[attrName]==='string') {
              _els[i].innerHTML = attrs[attrName];
            } else if (attrs[attrName] instanceof HTMLElement) {
              _els[i].innerHTML = '';
              _els[i].appendChild(attrs[attrName]);
            } else {
              _els[i].innerHTML = '';
              _els[i].appendChild($el(attrs[attrName]));
            }
          }
        }
      } else {
        _el[attrName] = attrs[attrName];
      }
    }
  }
  return _el;
}

module.exports = { $el };
