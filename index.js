const paper = require('paper')

paper.install(window);
paper.setup('myCanvas');
view.viewSize.set(1000, 1000)
var rect = new Path.Rectangle({
    point: [0, 0],
    size: [view.size.width, view.size.height],
});
rect.sendToBack();
rect.fillColor = 'black';

const CELL_SIZE = 10
const STROKE_WIDTH = 0.2
const STROKE_COLOR = 'white'
const memory = [
  [0, 0]
]
new Path.Rectangle({
  point: [
    view.size.width / 2 + memory[0][0],
    view.size.height / 2 + memory[0][1],
  ],
  size: [CELL_SIZE, CELL_SIZE],
  strokeColor: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
})

function step() {
  // pick adjacent unoccupied cell
  let allAdjacents = []
  for (let i = 0; i < memory.length; i++) {
    const adjacents = getAdjacents(memory[i])
    allAdjacents = allAdjacents.concat(adjacents)
  }
  
  let uniqueAdjacents = []
  for (let i = 0; i < allAdjacents.length; i++) {
    const pos = allAdjacents[i]
    const appearance = uniqueAdjacents.filter(el => el[0] === pos[0] && el[1] === pos[1])
    if (appearance.length === 0) {
      uniqueAdjacents.push(pos)
    }
  }
  
  let unchartedAdjacents = []
  for (let i = 0; i < uniqueAdjacents.length; i++) {
    const pos = uniqueAdjacents[i]
    const appearance = memory.filter(el => el[0] === pos[0] && el[1] === pos[1])
    if (appearance.length === 0) {
      unchartedAdjacents.push(pos)
    }
  }
  
  const cell = unchartedAdjacents[Math.floor(Math.random() * unchartedAdjacents.length)]

  // pick vertices from them
  // draw the thing
  new Path.Rectangle({
    point: [
      view.size.width / 2 + cell[0] * CELL_SIZE,
      view.size.height / 2 + cell[1] * CELL_SIZE,
    ],
    size: [CELL_SIZE, CELL_SIZE],
    strokeColor: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
  })
  // symmetry
  new Path.Rectangle({
    point: [
      view.size.width / 2 - cell[0] * CELL_SIZE,
      view.size.height / 2 + cell[1] * CELL_SIZE,
    ],
    size: [CELL_SIZE, CELL_SIZE],
    strokeColor: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
  })
  // remember
  memory.push(cell)
}
global.step = step

function getAdjacents(position) {
  // 0, 0
  const x = position[0]
  const y = position[1]
  return [
    [x+1, y  ], // 1, 0
    [x  , y+1], // 0, 1
    [x+1, y+1], // 1, 1
    [x  , y-1], // 0, -1
    [x+1, y-1], // 1, -1
  ]
}

// setInterval(step, 100)

view.onFrame = function(event) {
  step()
}
