function Canvas (canvasEl, width, height) {
  this.canvas = canvasEl
  this.canvas.width = width
  this.canvas.height = height
  this.isPainting = false
  this.ctx = this.canvas.getContext('2d')
  this.clearCanvas()
  return this.canvas
}

Canvas.prototype.clearCanvas = function () {
  var canvas = this.canvas
  var ctx = this.ctx
  ctx.save()
  ctx.strokeStyle = "black"
  ctx.lineWidth = 3

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

