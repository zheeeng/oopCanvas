function Canvas (canvasEl, width, height) {
  this.canvas = canvasEl
  this.width = width
  this.height = height
  this.isPainting = false
  this.ctx = this.canvas.getContext('2d')
}

Canvas.prototype.init = function () {
  var canvas = this.canvas
  canvas.width = this.width
  canvas.height = this.height
  this.clearCanvas()
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