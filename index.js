const paper = require('paper')
paper.install(window)
const lexicon = require('./lexicon')
const config = require('./config')
const {
  VIEW_SIZE,
  GRID_SIZE,
  VIEW_COLOR,
  GRID_COLOR,
  GRID_MARGIN,
  GRID_WIDTH,
  STROKE_WIDTH,
  STROKE_COLOR,
  FILL_COLOR,
  DRAWING_PROBABILITY,
  STEP_LIMIT,
  STEPS_EACH_FRAME,
} = config
const NUM_ROW = VIEW_SIZE / GRID_SIZE
const NUM_COL = VIEW_SIZE / GRID_SIZE

const documentColor = new Color(STROKE_COLOR)
const b = new Color(0.1)
const r = documentColor.multiply(b)
document.body.style.backgroundColor = r.toCSS(true);

paper.setup('myCanvas')
view.viewSize.set(VIEW_SIZE, VIEW_SIZE)

function paintBG() {
  var rect = new Path.Rectangle({
    point: [0, 0],
    size: [VIEW_SIZE, VIEW_SIZE],
  });
  rect.sendToBack();
  rect.fillColor = VIEW_COLOR;
  // OPTIONAL paint it with grid
  for(let rI = 0; rI < NUM_ROW; rI++) {
    for(let cI = 0; cI < NUM_COL / 2; cI++) {
      lexicon.drawSquare(cI, rI, GRID_SIZE, GRID_COLOR, GRID_WIDTH, FILL_COLOR)
    }
  }
}

// put half of all possible grids into memory
// when drawing, half is reflected

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
}

let stepsTaken = 0

function step() {
  // paper.project.clear()
  const allAdjacents = getAllAdjacents()
  const randAdjacent = allAdjacents[Math.floor(Math.random() * allAdjacents.length)]
  // draw
  const column = randAdjacent[0]
  const row = randAdjacent[1]
  // respect canvas border & margin
  if (column === NUM_COL / 2 - GRID_MARGIN || 
    row === NUM_ROW - GRID_MARGIN || 
    row === GRID_MARGIN) return;
  // update record
  updateRecord(column, row)
  // graph that shit
  if (Math.random() < DRAWING_PROBABILITY) draw(column, row)
}

function draw(column, row) {
  lexicon.drawStroke(column, row, ['topInner', 'bottomInner', 'topOuter', 'topInner'])
  // lexicon.drawSquare(column, row, GRID_SIZE, STROKE_COLOR, STROKE_WIDTH, FILL_COLOR)
  // lexicon.drawCircle(column, row, GRID_SIZE * Math.sqrt(2), STROKE_COLOR, STROKE_WIDTH, FILL_COLOR)
}

function updateRecord(column, row) {
  if (column > NUM_COL / 2 - 1) return; // stop if column maxes out
  record[row] = Math.max(record[row], column)
}


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