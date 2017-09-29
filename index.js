const paper = require('paper')

const lexicon = require('./lexicon')

const VIEW_SIZE = 640
paper.install(window)
paper.setup('myCanvas')
view.viewSize.set(VIEW_SIZE, VIEW_SIZE)

function paintBG() {
  var rect = new Path.Rectangle({
    point: [0, 0],
    size: [VIEW_SIZE, VIEW_SIZE],
  });
  rect.sendToBack();
  rect.fillColor = 'black';
}

const GRID_SIZE = 20
const STROKE_WIDTH = 0.5
const STROKE_COLOR = 'white'
// const STROKE_COLOR = null
// const FILL_COLOR = 'white'
const FILL_COLOR = null
// put half of all possible grids into memory
// when drawing, half is reflected
const NUM_ROW = VIEW_SIZE / GRID_SIZE
const NUM_COL = VIEW_SIZE / GRID_SIZE

function createRecord(){
  const r = new Array(NUM_ROW)
  for(let rI = 0; rI < NUM_ROW; rI++) {
    r[rI] = -1
  }
  return r
}

let record = createRecord()

function getAllAdjacents() {
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
  lexicon.drawSquare(0, middleRow, GRID_SIZE, STROKE_COLOR, STROKE_WIDTH, FILL_COLOR)
}

const DRAWING_PROBABILITY = 0.4
const STEP_LIMIT = 150
let stepsTaken = 0

function step() {
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
  lexicon.drawSquare(column, row, GRID_SIZE, STROKE_COLOR, STROKE_WIDTH, FILL_COLOR)
  lexicon.drawCircle(column, row, GRID_SIZE, STROKE_COLOR, STROKE_WIDTH, FILL_COLOR)
}

function updateRecord(column, row) {
  if (column > NUM_COL / 2 - 1) return; // stop if column maxes out
  record[row] = Math.max(record[row], column)
}

const STEPS_EACH_FRAME = 10

function multiStep() {
  if (stepsTaken > STEP_LIMIT) return;
  stepsTaken += STEPS_EACH_FRAME

  for(let i = 0; i < STEPS_EACH_FRAME; i ++) {
    step()
  }
  requestAnimationFrame(multiStep)
}

paintBG()
init()
window.requestAnimationFrame(multiStep)

window.addEventListener('keydown', () => {
  paper.project.clear()
  paintBG()
  stepsTaken = 0
  record = createRecord()
  init()
  requestAnimationFrame(multiStep)
})