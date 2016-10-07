var Canvas = function (canvasEl, width, height) {
  this.canvas = canvasEl !== undefined ? canvasEl : document.getElementsByTagName('canvas')[0]
  this.width = width !== undefined ? width : 500
  this.height = height !== undefined ? height : 300

  this.e = null
}

Object.defineProperties(Canvas.prototype, {
  x: {
    get: function () {
      return this.e.pageX - this.canvas.offsetLeft
    }
  },
  y: {
    get: function () {
      return this.e.pageY - this.canvas.offsetTop
    }
  }
})

Canvas.prototype.init = function () {
  var canvas = this.canvas
  canvas.width = this.width
  canvas.height = this.height
  this.ctx = this.canvas.getContext('2d')
  var _this = this
  addEvent(canvas, 'mousemove', function (e) {
    _this.e = e
  })
}

Canvas.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

Canvas.prototype.drawCanvasBorder = function (lineWidth, lineColor) {
  var canvas = this.canvas
  var ctx = this.ctx
  ctx.save()
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = lineColor

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, this.height)
  ctx.lineTo(this.width, this.height)
  ctx.lineTo(this.width, 0)
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}