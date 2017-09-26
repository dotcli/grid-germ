const paper = require('paper')

const VIEW_SIZE = 640
paper.install(window)
paper.setup('myCanvas')
view.viewSize.set(VIEW_SIZE, VIEW_SIZE)
var rect = new Path.Rectangle({
  point: [0, 0],
  size: [VIEW_SIZE, VIEW_SIZE],
});
rect.sendToBack();
rect.fillColor = 'black';

const GRID_SIZE = 20
const STROKE_WIDTH = 0.5
const STROKE_COLOR = 'grey'
// put half of all possible grids into memory
// when drawing, half is reflected
const NUM_ROW = VIEW_SIZE / GRID_SIZE
const NUM_COL = VIEW_SIZE / GRID_SIZE

// NOTE memory is obsolete;
// tracking with record which tracks only the end
// maybe this will be usefil in the future

// const memory = new Array(NUM_ROW)
// // fill them with falsehood
// for(let rI = 0; rI < NUM_ROW; rI++) {
//   memory[rI] = []
//   for(let cI = 0; cI < NUM_COL / 2; cI++) {
//     memory[rI].push(false)
//   }
// }

const record = new Array(NUM_ROW)
for(let rI = 0; rI < NUM_ROW; rI++) {
  record[rI] = -1
}

function getAllAdjacents() {
  // NOTE obsolete for now
  // for(let rI = 0; rI < NUM_ROW; rI++) {
  //   let lastColI = -1
  //   for(let cI = 0; cI < NUM_COL / 2; cI++) {
  //     if ( memory[rI][cI] ) lastColI = cI
  //   }
  //   record[rI] = lastColI
  // }

  const allAdjacents = []

  for(let rI = 0; rI < NUM_ROW; rI++) {
    // if it's next to vacant rows, no adjacent for this row.
    if (isNextToVacantRows(rI)) continue;
    // the one next to it is adjacent
    let inadequacy = 1
    // compare itself with surrounding rows to get more adjacent
    if (rI === 0) {
      const diffBelow = record[rI + 1] - record[rI]
      inadequacy = Math.max(inadequacy, diffBelow)
    } else if (rI === record.length - 1) {
      const diffAbove = record[rI - 1] - record[rI]
      inadequacy = Math.max(inadequacy, diffAbove)
    } else {
      const diffBelow = record[rI + 1] - record[rI]
      const diffAbove = record[rI - 1] - record[rI]
      inadequacy = Math.max(inadequacy, diffAbove, diffBelow)
    }

    for (let aI = 0; aI < inadequacy; aI++) {
      allAdjacents.push(
        [ record[rI] + aI + 1, rI ]
      );
    }
  }
  return allAdjacents
}

function isNextToVacantRows(rI) {
  let isAboveVacant, isBelowVacant;
  if (rI === 0) {
    isAboveVacant = true;
    isBelowVacant = (record[rI+1] === -1)
  } else if (rI === record.length - 1) {
    isAboveVacant = (record[rI-1] === -1)
    isBelowVacant = true;
  } else {
    isAboveVacant = (record[rI-1] === -1)
    isBelowVacant = (record[rI+1] === -1)
  }
  return (isAboveVacant && isBelowVacant)
}

// seed the middle
function init() {
  const middleRow = Math.floor((record.length - 1) / 2)
  record[middleRow] = 0
  new Path.Rectangle({
    point: [
      view.size.width / 2 + (record[middleRow]) * GRID_SIZE,
      middleRow * GRID_SIZE,
    ],
    size: [GRID_SIZE, GRID_SIZE],
    strokeColor: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
  })
  // symmetry
  new Path.Rectangle({
    point: [
      view.size.width / 2 - (record[middleRow] + 1) * GRID_SIZE,
      middleRow * GRID_SIZE,
    ],
    size: [GRID_SIZE, GRID_SIZE],
    strokeColor: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
  })

}

const DRAWING_PROBABILITY = 0.4
const STEP_LIMIT = 200
let stepsTaken = 0

function step() {
  if (stepsTaken > STEP_LIMIT) return;
  stepsTaken += 1
  // paper.project.clear()
  const allAdjacents = getAllAdjacents()
  const randAdjacent = allAdjacents[Math.floor(Math.random() * allAdjacents.length)]
  // draw
  const column = randAdjacent[0]
  const row = randAdjacent[1]
  // respect canvas border
  if (column === NUM_COL / 2 || row === NUM_ROW) return;
  // update record
  updateRecord(column, row)
  // graph that shit
  if (Math.random() > (1 - DRAWING_PROBABILITY)) draw(column, row)
}

function draw(column, row) {
  new Path.Rectangle({
    point: [
      view.size.width / 2 + column * GRID_SIZE,
      row * GRID_SIZE,
    ],
    size: [GRID_SIZE, GRID_SIZE],
    strokeColor: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
  })
  // symmetry
  new Path.Rectangle({
    point: [
      view.size.width / 2 - (column + 1) * GRID_SIZE,
      row * GRID_SIZE,
    ],
    size: [GRID_SIZE, GRID_SIZE],
    strokeColor: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
  })
}

function updateRecord(column, row) {
  if (column > NUM_COL / 2 - 1) return; // stop if column maxes out
  record[row] = Math.max(record[row], column)
}

init()
setInterval(step, 1)