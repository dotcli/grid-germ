/**
 * A collection of rendering methods
 */

module.exports = {
  // simple square filling the grid 
  drawSquare: (column, row, size, strokeColor, strokeWidth, fillColor) => {
    new Path.Rectangle({
      point: [
        view.size.width / 2 + column * size,
        row * size,
      ],
      size: [size, size],
      strokeColor,
      strokeWidth,
      fillColor,
    })
    // symmetry
    new Path.Rectangle({
      point: [
        view.size.width / 2 - (column + 1) * size,
        row * size,
      ],
      size: [size, size],
      strokeColor,
      strokeWidth,
      fillColor,
    })
  },

}