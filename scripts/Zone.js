var Zone = function (zoneOption) {
  this.fromX = zoneOption.fromX
  this.fromY = zoneOption.fromY
  this.toX = zoneOption.toX
  this.toY = zoneOption.toY
  this.props = zoneOption.props
}

// define the validator for check zones conflict
Zone.isZoneValidate = function (zones, zone) {
  return zones.every(function (v) {
    return (v.fromX >= zone.toX || v.fromY >= zone.toY) || (v.toX <= zone.fromX || v.toY <= zone.fromY)
  })
}

Zone.prototype.drawBorder = function (ctx, lineWidth, lineColor) {
  ctx.save()

  if (lineWidth) ctx.lineWidth = lineWidth
  if (lineColor) ctx.strokeStyle = lineColor

  ctx.rect(this.fromX, this.fromY, this.toX - this.fromX, this.toY - this.fromY)

  ctx.stroke()
  ctx.restore()
}