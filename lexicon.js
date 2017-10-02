/**
 * A collection of rendering methods
 */
const config = require('./config')
const {
  VIEW_SIZE,
  GRID_SIZE,
  STROKE_WIDTH,
  STROKE_COLOR,
  FILL_COLOR,
  DRAWING_PROBABILITY,
  STEP_LIMIT,
  STEPS_EACH_FRAME,
} = config

function getPoints(column, row, flip = false) {
  const flipSign = flip ? -1 : 1

  return {
    topInner: [
      VIEW_SIZE / 2 + column * GRID_SIZE * flipSign,
      row * GRID_SIZE,
    ],
    bottomInner: [
      VIEW_SIZE / 2 + column * GRID_SIZE * flipSign,
      (row + 1) * GRID_SIZE,
    ],
    topOuter: [
      VIEW_SIZE / 2 + (column + 1) * GRID_SIZE * flipSign,
      row * GRID_SIZE,
    ],
    bottomOuter: [
      VIEW_SIZE / 2 + (column + 1) * GRID_SIZE * flipSign,
      (row + 1) * GRID_SIZE,
    ],
    center: [
      VIEW_SIZE / 2 + (column + 0.5) * GRID_SIZE * flipSign,
      (row + 0.5) * GRID_SIZE,
    ],
  }
}

module.exports = {
  // simple square filling the grid 
  drawSquare: (column, row, size, strokeColor, strokeWidth, fillColor) => {
    const points = getPoints(column, row)
    const style = {
      strokeColor,
      strokeWidth,
      fillColor,
    }
    const rightStyle = Object.assign({
      point: getPoints(column, row).topInner,
      size: [size, size],
    }, style)
    const leftStyle = Object.assign({
      point: getPoints(column, row, true).topOuter,
      size: [size, size],
    }, style)
    new Path.Rectangle(rightStyle)
    new Path.Rectangle(leftStyle)
  },

  drawCircle: (column, row, size, strokeColor, strokeWidth, fillColor) => {
    const style = {
      strokeColor,
      strokeWidth,
      fillColor,
    }
    const rightStyle = Object.assign({
      center: getPoints(column, row).center,
      radius: size / 2,
    }, style)
    const leftStyle = Object.assign({
      center: getPoints(column, row, true).center,
      radius: size / 2,
    }, style)
    new Path.Circle(rightStyle)
    new Path.Circle(leftStyle)
  },

  /**
   * @param {string[]} points - array of points to draw. see getPoints
   */
  drawStroke: (column, row, points,
    size = GRID_SIZE,
    strokeColor = STROKE_COLOR,
    strokeWidth = STROKE_WIDTH,
    fillColor = FILL_COLOR,
  ) => {
    const style = { strokeColor, strokeWidth, fillColor }
    const rightPoints = getPoints(column, row)
    const leftPoints = getPoints(column, row, true)
    for (let i = 1; i < points.length; i++) {
      const rightStyle = Object.assign({
        from: rightPoints[points[i-1]],
        to: rightPoints[points[i]],
      }, style)
      const leftStyle = Object.assign({
        from: leftPoints[points[i-1]],
        to: leftPoints[points[i]],
      }, style)
      new Path.Line(rightStyle)
      new Path.Line(leftStyle)
    }
  }
}