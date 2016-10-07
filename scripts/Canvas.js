var Canvas = function (canvasEl, option) {
  // format
  option = Canvas.formatOption(option)

  // assign instance value
  this.canvas = isCanvasElement(canvasEl) ? canvasEl : document.getElementsByTagName('canvas')[0]
  this.ctx = this.canvas.getContext('2d')
  this.width = option.width
  this.height = option.height
  this.layout = option.layout

  // format layout data
  this['_' + this.layout] = Canvas.format(this.layout, option[this.layout])

  // private variables
  this._e = null
}

Canvas.layouts = ['grid']

Canvas.formatOption = function (option) {
  var width = option.width
  var height = option.height
  var layout = option.layout

  // check width && height
  if (isNaN(width) || isNaN(height)) throw TypeError('The width and the height of layout are required and they are must be numbers.')

  // check layout
  if (typeof layout !== 'string') throw TypeError('The layout must string type!')
  if (!~Canvas.layouts.indexOf(layout)) throw Error('Invalid layout, choose one from: ' + Canvas.layouts.join(' '))

  option.width = +width
  option.height = +height
  option.layout = layout

  return option
}

Canvas.format = function (layout, layoutData) {
  if (layout === 'grid' && typeof layoutData === 'object') {
    return Canvas.formatGrid(layoutData)
  }
}

Canvas.formatGrid = function (grid) {
  var rows = grid.rows
  var columns = grid.columns
  var zones = grid.zones

  // format row && column
  if (isNaN(rows) || isNaN(columns)) {
    throw TypeError('The rows -- ' + rows + ', and the columns -- ' + columns + ', of canvas grid are required and they are must be integers.')
  } else {
    if (rows < 1) throw Error('Invalid canvas grid row number -- ' + rows + ', it must be not less than 1.')
    if (columns < 1) throw Error('Invalid canvas grid column number -- ' + columns + ', it must be not less than 1.')
    rows = Math.floor(rows)
    columns = Math.floor(columns)
  }

  // The row && column number must be integer and in range [1, grid max row/column]
  function formatRow (r) {
    if (isNaN(r)) {
      throw TypeError('The canvas grid row number: ' + r + ' must be a number')
    } else if (r < 1 || r > rows){
      throw TypeError('The canvas grid row number: ' + r + ' is not in range [1, ' + rows + ']')
    } else {
      return Math.floor(r)
    }
  }

  function formatColumn (c) {
    if (isNaN(c)) {
      throw TypeError('The canvas grid column number: ' + c + ' must be a number')
    } else if (c < 1 || c > columns){
      throw TypeError('The canvas grid column number: ' + c + ' is not in range [1, ' + columns + ']')
    } else {
      return Math.floor(c)
    }
  }

  // format zones data
  zones.forEach(function (zone) {
    zone.rowSpan = zone.rowSpan.map(function (r) {
      return formatRow(r)
    }).sort(function (a, b) {
      return a - b
    })
    zone.columnSpan = zone.columnSpan.map(function (c) {
      return formatColumn(c)
    }).sort(function (a, b) {
      return a - b
    })
  })

  return grid
}

Canvas.prototype.init = function () {
  var canvas = this.canvas
  var width  = this.width
  var height  = this.height
  var layout = this.layout

  // set canvas attributes
  canvas.width = width
  canvas.height = height

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

  // apply layout
  this[this.layout]()
}

/*
 * Generate zones array, require layout { Number width, Number height, Array zones [ Number Array[2] columns, Number Array[2] rows, Object props ] }
 * @para layout
 * @return zonesArray
 */
Canvas.prototype.grid = function () {
  var grid = this._grid
  var width   = this.width
  var height  = this.height
  var rows    = grid.rows
  var columns = grid.columns
  var zones   = grid.zones
  var zonesArray = []

  // get unit width && height
  var unitWidth = Math.round(width / columns, 2)
  var unitHeight = Math.round(height / rows, 2)

  // register zones
  zones.forEach(function (zone) {
    var _zone = new Zone({
      fromX : (zone.columnSpan[0] - 1) * unitWidth,
      toX   : zone.columnSpan[1] * unitWidth,
      fromY : (zone.rowSpan[0] - 1) * unitHeight,
      toY   : zone.rowSpan[1] * unitHeight,
      props : zone.props
    })

    if (!Zone.isZoneValidate(zonesArray, _zone)) throw Error('custom zone: ' + JSON.stringify(zone) + ' conflicts with other zones')

    zonesArray.push(_zone)
  })

  this._grid._zones = zonesArray
}

Canvas.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

Canvas.prototype.drawBorder = function (lineWidth, lineColor) {
  var canvas = this.canvas
  var ctx = this.ctx
  ctx.save()

  if (lineWidth) ctx.lineWidth = lineWidth
  if (lineColor) ctx.strokeStyle = lineColor

  ctx.rect(0, 0, this.width, this.height)
  ctx.stroke()
  ctx.restore()
}