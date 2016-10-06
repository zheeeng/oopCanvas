function Canvas (canvasEl, width, height, bgColor, lineWidth) {
  this.canvas = canvasEl !== undefined ? canvasEl : document.getElementsByTagName('canvas')[0]
  this.width = width !== undefined ? width : 500
  this.height = height !== undefined ? height : 300
  this.bgColor = bgColor !== undefined ? bgColor : 3
  this.lineWidth = lineWidth !== undefined ? lineWidth : 3

  this.isPainting = false
  this.e = null
  this.ctx = this.canvas.getContext('2d')
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
  this.clearCanvas()
  var _this = this
  addEvent(canvas, 'mousemove', function (e) {
    _this.e = e
  })
}

Canvas.prototype.clearCanvas = function () {
  var canvas = this.canvas
  var ctx = this.ctx
  ctx.save()
  ctx.strokeStyle = this.bgColor
  ctx.lineWidth = this.lineWidth

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, canvas.height)
  ctx.lineTo(canvas.width, canvas.height)
  ctx.lineTo(canvas.width, 0)
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

