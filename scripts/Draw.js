var Draw = function (canvasEl, width, height, layout) {
  Canvas.call(this, canvasEl, width, height)
  this.layout = layout
  this.isPainting = false
}

extend(Draw, Canvas)

Draw.prototype.init = function () {
  Draw.uber.init.apply(this, arguments)

  var canvas = this.canvas
  var ctx = this.ctx
  var _this = this
  addEvent(canvas, 'mousedown', function (e) {
    _this.isPainting = true
    _this.lastX = _this.x
    _this.lastY = _this.y
  })
  addEvent(canvas, 'mouseup', function (e) {
    _this.isPainting = false
  })
  addEvent(canvas, 'mouseout', function (e) {
    _this.isPainting = false
  })
  addEvent(canvas, 'mousemove', function (e) {
    if (_this.isPainting === true) {
      ctx.beginPath()
      ctx.moveTo(_this.lastX, _this.lastY)
      ctx.lineTo(_this.x, _this.y)
      ctx.stroke()
      _this.lastX = _this.x
      _this.lastY = _this.y
    }
  })
}

Draw.prototype.reset = function () {
  this.clearCanvas()
  this.drawCanvasBorder(3, 'black')
}