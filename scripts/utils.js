function addEvent (el, event, handler) {
  if (el.addEventListener) {
    el.addEventListener(event, handler, false)
  } else if (el.attachEvent) {
    el.attachEvent(event, handler)
  }
}