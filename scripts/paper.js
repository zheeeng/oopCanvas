function Paper (canvasEl, width, height) {
  this.paper = canvasEl
  this.paper.width = width
  this.paper.height = height
  this.ctx = this.paper.getContext('2d')
  this.clearPaper()
  return this.paper
}

Paper.prototype.clearPaper = function () {
  var paper = this.paper
  var ctx = this.ctx
  ctx.save()
  ctx.strokeStyle = "black"
  ctx.lineWidth = 3

  ctx.clearRect(0, 0, paper.width, paper.height)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, paper.height)
  ctx.lineTo(paper.width, paper.height)
  ctx.lineTo(paper.width, 0)
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}