var Draw = function (canvasEl, width, height, layouts) {
  Canvas.call(this, canvasEl, width, height)
  this.layouts = Draw.formatLayoutData(layouts)

  this._isPainting = false
}

extend(Draw, Canvas)

Draw.prototype.init = function () {
  Draw.uber.init.apply(this, arguments)

  var _this = this
  var canvas = _this.canvas
  var ctx = _this.ctx

  this.layout()

  this.drawZones()

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

Draw.formatLayoutData = function (layouts) {
  var zones = layouts.zones

  // get unit width && height
  if (isNaN(layouts.row) || isNaN(layouts.column)) {
    throw TypeError('row && column is required and they are numbers')
  } else {
    if (layouts.row < 1) throw Error('invalid row number, it must be not less than 1')
    if (layouts.column < 1) throw Error('invalid column number, it must be not less than 1')
    layouts.row = Math.floor(layouts.row)
    layouts.column = Math.floor(layouts.column)
  }

  function formatRow (row) {
    if (isNaN(row)) {
      throw TypeError('row number:' + row + 'must be a number')
    } else if (row < 1 || row > layouts.row){
      throw TypeError('row number:' + row + 'is not in range [1, ' + layouts.row + ']')
    } else {
      return Math.floor(row)
    }
  }

  function formatColumn (column) {
    if (isNaN(column)) {
      throw TypeError('column number:' + column + 'must be a number')
    } else if (column < 1 || column > layouts.column){
      throw TypeError('column number:' + column + 'is not in range [1, ' + layouts.column + ']')
    } else {
      return Math.floor(column)
    }
  }

  // format zones data
  zones.forEach(function (zone) {
    zone.rows = zone.rows.map(function (row) {
      return formatRow(row)
    }).sort(function (a, b) {
      return a - b
    })
    zone.columns = zone.columns.map(function (column) {
      return formatColumn(column)
    }).sort(function (a, b) {
      return a - b
    })
  })

  return layouts
}

Draw.prototype.layout = function () {
  var unitWidth
  var unitHeight
  var layouts = this.layouts
  var zones = layouts.zones
  var zonesArray = []

  // define the validator for check zones conflict
  function checkZoneIsValidate (zone) {
    return zonesArray.every(function (v) {
      return (v.fromX >= zone.toX || v.fromY >= zone.toY) || (v.toX <= zone.fromX || v.toY <= zone.fromY)
    })
  }

  this.clearCanvas()

  // get unit width && height
  unitWidth = Math.round(this.width / layouts.column, 2)
  unitHeight = Math.round(this.height / layouts.row, 2)

  // register zones
  zones.forEach(function (zone) {
    var _zone = {
      fromX : (zone.columns[0] - 1) * unitWidth,
      toX   : zone.columns[1] * unitWidth,
      fromY : (zone.rows[0] - 1) * unitHeight,
      toY   : zone.rows[1] * unitHeight,
      type  : zone.type
    }
    if (!checkZoneIsValidate(_zone)) throw Error('custom zone:' + zone + 'conflicts with other zones')
    zonesArray.push(_zone)
  })

  this.zones = zonesArray
}

Draw.prototype.drawZones = function () {
  if (this.zones === undefined) throw Error('no zones to draw')

  var zones = this.zones
  var ctx = this.ctx
  zones.forEach(function (zone) {
    if (zone.type === 'painting') {
      console.log(zone)
      ctx.save()
      ctx.rect(zone.fromX, zone.fromY, zone.toX - zone.fromX, zone.toY - zone.fromY)
      ctx.stroke()
      ctx.restore()
    }
  })
}

Draw.prototype.reset = function () {
  this.clearCanvas()
  this.drawCanvasBorder(3, 'black')
}