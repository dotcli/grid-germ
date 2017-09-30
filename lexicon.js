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

module.exports = {
  // simple square filling the grid 
  drawSquare: (column, row, size, strokeColor, strokeWidth, fillColor) => {
    let style = {
      strokeColor,
      strokeWidth,
      fillColor,
    }
    const rightStyle = Object.assign({
      point: [
        VIEW_SIZE / 2 + column * GRID_SIZE,
        row * GRID_SIZE,
      ],
      size: [size, size],
    }, style)
    const leftStyle = Object.assign({
      point: [
        VIEW_SIZE / 2 - (column + 1) * GRID_SIZE,
        row * GRID_SIZE,
      ],
      size: [size, size],
    }, style)
    new Path.Rectangle(rightStyle)
    new Path.Rectangle(leftStyle)
  },

  drawCircle: (column, row, size, strokeColor, strokeWidth, fillColor) => {
    let style = {
      strokeColor,
      strokeWidth,
      fillColor,
    }
    const rightStyle = Object.assign({
      center: [
        VIEW_SIZE / 2 + (column + 0.5) * GRID_SIZE,
        (row + 0.5) * GRID_SIZE,
      ],
      radius: size / 2,
    }, style)
    const leftStyle = Object.assign({
      center: [
        VIEW_SIZE / 2 - (column + 0.5) * GRID_SIZE,
        (row + 0.5) * GRID_SIZE,
      ],
      radius: size / 2,
    }, style)
    new Path.Circle(rightStyle)
    new Path.Circle(leftStyle)
  },
}