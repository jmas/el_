const DEFAULT_TAG = 'div';
const requestAnimationFrame = (fn) => {
  if ('requestAnimationFrame' in window) {
    window.requestAnimationFrame(fn);
  } else {
    window.setTimeout(fn, 100);
  }
};

/**
 * Create or update DOM element.
 * If content is string - new HTMLElement will be created and string will be putted as HTML content of it.
 * If content is HTMLElement - attrs will be applyed to this HTMLElement.
 * If content is array - new HTMLElement will be created and each array item will be appended to it.
 * @param {null|array|string|HTMLElement} content Content can be: HTMLElement, array<HTMLElements>, array<string>, string
 * @param {null|object} attrs Element attributes. Special attributes `onclick #selector`, `find #selector`
 * @param {string} tag Element tag. By default is DIV
 * @returns {HTMLElement}
 */
function $el (content=null, attrs=null, tag=DEFAULT_TAG) {
  let _el = (content instanceof HTMLElement ? content: document.createElement(tag));
  if (!(content instanceof HTMLElement) && content) {
    if (content instanceof Array) {
      for (let i=0,ln=content.length; i<ln; i++) {
        if (typeof content[i]==='array' || typeof content[i]==='string') {
          _el.appendChild($el(content[i]));
        } else {
          _el.appendChild(content[i]);
        }
      }
    } else {
      _el.innerHTML = content;
    }
  }
  if (attrs) {
    let attrsNames = [];
    for (let attrName in attrs) if (attrs.hasOwnProperty(attrName)) {
      attrsNames.push(attrName);
    }
    // put `find` attrs to the top of list
    attrsNames = attrsNames.sort((a, b) => {
      let _ai = a.indexOf('find');
      let _bi = b.indexOf('find');
      return (_ai===-1 && _bi===-1 ? 0: (_ai!==-1 && _bi===-1 ? -1: 1));
    });
    for (let i=0,ln=attrsNames.length; i<ln; i++) {
      let attrName = attrsNames[i];
      if (attrName.indexOf('on')===0) {
        if (attrName.indexOf(' ')!==-1 && content) {
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
      } else if (attrName.indexOf('find')===0 && content) {
        let [ eventName, selector ] = attrName.split(' ');
        let _els = _el.querySelectorAll(selector);
        let _elsLength = _els.length;
        if (_elsLength>0) {
          for (let i=0; i<_elsLength; i++) {
            if (typeof attrs[attrName]==='function') {
              requestAnimationFrame(() => attrs[attrName](_els[i]));
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
