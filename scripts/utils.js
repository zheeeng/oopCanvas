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