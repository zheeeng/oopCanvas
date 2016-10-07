var Canvas = function (canvasEl, layout) {
  this.canvas = isCanvasElement(canvasEl) ? canvasEl : document.getElementsByTagName('canvas')[0]
  this.layout = Canvas.formatLayoutData(layout)

  this.ctx = this.canvas.getContext('2d')

  this._e = null
}

Canvas.formatLayoutData = function (layout) {
  var width = layout.width
  var height = layout.height
  var row = layout.row
  var column = layout.column
  var zones = layout.zones

  // format width && height
  if (isNaN(width) || isNaN(height)) {
    throw TypeError('The width and the height of layout are required and they are numbers')
  } else {
    layout.width = +width
    layout.height = +height
  }

  // format row && column
  if (isNaN(row) || isNaN(column)) {
    throw TypeError('The row -- ' + row + ', and the column -- ' + column + ', of canvas grid are required and they are must be numbers.')
  } else {
    if (row < 1) throw Error('Invalid canvas grid row number -- ' + row + ', it must be not less than 1.')
    if (column < 1) throw Error('Invalid canvas grid column number -- ' + column + ', it must be not less than 1.')
    layout.row = Math.floor(row)
    layout.column = Math.floor(column)
  }

  // The row && column number must be integer and in range [1, grid max row/column]
  function formatRow (row) {
    if (isNaN(row)) {
      throw TypeError('The canvas grid row number: ' + row + ' must be a number')
    } else if (row < 1 || row > layout.row){
      throw TypeError('The canvas grid row number: ' + row + ' is not in range [1, ' + layout.row + ']')
    } else {
      return Math.floor(row)
    }
  }

  function formatColumn (column) {
    if (isNaN(column)) {
      throw TypeError('The canvas grid column number: ' + column + ' must be a number')
    } else if (column < 1 || column > layout.column){
      throw TypeError('The canvas grid column number: ' + column + ' is not in range [1, ' + layout.column + ']')
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

  return layout
}

Canvas.prototype.init = function () {
  var canvas = this.canvas
  var layout = this.layout

  // set canvas attributes
  canvas.width = layout.width
  canvas.height = layout.height

  // record the cursor position in canvas
  var _this = this
  addEvent(canvas, 'mousemove', function (e) {
    _this._e = e
  })

  Object.defineProperties(Canvas.prototype, {
    x: {
      get: function () {
        return this._e.pageX - this.canvas.offsetLeft
      }
    },
    y: {
      get: function () {
        return this._e.pageY - this.canvas.offsetTop
      }
    }
  })

  // store zones from layout option
  this._zones = Canvas.getZones(this.layout)

}

/*
 * Get zones array, require layout { Number width, Number height, Array zones [ Number Array[2] columns, Number Array[2] rows, Object props ] }
 * @para layout
 * @return zonesArray
 */
Canvas.getZones = function (layout) {
  var unitWidth
  var unitHeight
  var zones = layout.zones
  var zonesArray = []

  // define the validator for check zones conflict
  function isZoneValidate (zone) {
    return zonesArray.every(function (v) {
      return (v.fromX >= zone.toX || v.fromY >= zone.toY) || (v.toX <= zone.fromX || v.toY <= zone.fromY)
    })
  }

  // get unit width && height
  unitWidth = Math.round(layout.width / layout.column, 2)
  unitHeight = Math.round(layout.height / layout.row, 2)

  // register zones
  zones.forEach(function (zone) {
    var _zone = {
      fromX : (zone.columns[0] - 1) * unitWidth,
      toX   : zone.columns[1] * unitWidth,
      fromY : (zone.rows[0] - 1) * unitHeight,
      toY   : zone.rows[1] * unitHeight,
      props  : zone.props
    }
    if (!isZoneValidate(_zone)) throw Error('custom zone: ' + JSON.stringify(zone) + ' conflicts with other zones')
    zonesArray.push(_zone)
  })

  return zonesArray
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