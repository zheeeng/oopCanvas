var Draw = function (canvasEl, option) {
  Canvas.call(this, canvasEl, option)

  this._isPainting = false
}

extend(Draw, Canvas)

Draw.prototype.init = function () {
  Draw.uber.init.apply(this, arguments)
  this.drawZones()
  this.active()
}

Draw.prototype.drawZones = function () {
  if (this._grid._zones === undefined) throw Error('no zones to draw')

  var zones = this._grid._zones
  var ctx = this.ctx
  zones.forEach(function (zone) {
    if (zone.props && zone.props.type === 'painting') {
      zone.drawBorder(ctx)
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
  this.drawBorder(3, 'black')
}