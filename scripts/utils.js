function addEvent (el, event, handler) {
  if (el.addEventListener) {
    el.addEventListener(event, handler, false)
  } else if (el.attachEvent) {
    el.attachEvent(event, handler)
  }
}

function extend (Child, Parent) {
  var F = function () {}
  F.prototype = Parent.prototype
  Child.prototype = new F()
  Child.prototype.constructor = Child
  Child.uber = Parent.prototype
}

function isCanvasElement(o){
  return typeof HTMLElement === 'object' ? o instanceof HTMLElement && o.tagName === 'CANVAS' : o && typeof o === 'object' && o !== null && o.nodeType === 1 && o.tagName === 'CANVAS'
}