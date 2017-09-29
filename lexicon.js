/**
 * A collection of rendering methods
 */

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
        view.size.width / 2 + column * size,
        row * size,
      ],
      size: [size, size],
    }, style)
    const leftStyle = Object.assign({
      point: [
        view.size.width / 2 - (column + 1) * size,
        row * size,
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
        view.size.width / 2 + (column + 0.5) * size,
        (row + 0.5) * size,
      ],
      radius: size / 2,
    }, style)
    const leftStyle = Object.assign({
      center: [
        view.size.width / 2 - (column + 0.5) * size,
        (row + 0.5) * size,
      ],
      radius: size / 2,
    }, style)
    new Path.Circle(rightStyle)
    new Path.Circle(leftStyle)
  },
}