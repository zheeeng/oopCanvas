var Draw = function (canvasEl, layouts) {
  Canvas.call(this, canvasEl, layouts)

  this._isPainting = false
}

extend(Draw, Canvas)

Draw.prototype.init = function () {
  Draw.uber.init.apply(this, arguments)
  this.drawZones()
  this.active()
}

Draw.prototype.drawZones = function () {
  if (this._zones === undefined) throw Error('no zones to draw')

  var zones = this._zones
  var ctx = this.ctx
  zones.forEach(function (zone) {
    if (zone.props && zone.props.type === 'painting') {
      ctx.save()
      ctx.rect(zone.fromX, zone.fromY, zone.toX - zone.fromX, zone.toY - zone.fromY)
      ctx.stroke()
      ctx.restore()
    } else if (zone.props && zone.props.type === 'tool') {
      console.log('draw tool zone')
    }
  })
}

Draw.prototype.active = function () {
  var canvas = this.canvas
  var ctx = this.ctx

  // Define mouse events
  var _this = this
  addEvent(canvas, 'mousedown', function (e) {
    _this._isPainting = true
    _this.lastX = _this.x
    _this.lastY = _this.y
  })
  addEvent(canvas, 'mouseup', function (e) {
    _this._isPainting = false
  })
  addEvent(canvas, 'mouseout', function (e) {
    _this._isPainting = false
  })
  addEvent(canvas, 'mousemove', function (e) {
    if (_this._isPainting === true) {
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