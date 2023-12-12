/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _generateDOM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./generateDOM */ "./src/generateDOM.js");



const DELAY = 800;
class Game {
  constructor(player1, player2) {
    this.playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.PlayerBoard(player1);
    this.computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.ComputerBoard(player2);
    this.fillBoardPlayer();
    this.fillBoardComputer();
    (0,_generateDOM__WEBPACK_IMPORTED_MODULE_2__.fillPlayerBoardsDOM)(this.playerBoard);
  }
  reset() {
    this.playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.PlayerBoard(this.playerBoard.player);
    this.computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.ComputerBoard(this.computerBoard.player);
    this.fillBoardPlayer();
    this.fillBoardComputer();
    (0,_generateDOM__WEBPACK_IMPORTED_MODULE_2__.fillPlayerBoardsDOM)(this.playerBoard);
    const winerLabel = document.getElementsByClassName('winnerLabel')[0];
    winerLabel.textContent = '';
  }
  async start() {
    let turn = 'player';
    let winner = null;
    while (!winner) {
      if (turn === 'player') {
        // eslint-disable-next-line no-await-in-loop
        const hit = await this.playerShot();
        if (hit) {
          turn = 'computer';
        }
      } else if (turn === 'computer') {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => {
          setTimeout(resolve, DELAY);
        });
        const hit = this.computerShot();
        if (hit) {
          turn = 'player';
        }
      }
      winner = this.checkWinner();
    }
    const winerLabel = document.getElementsByClassName('winnerLabel')[0];
    winerLabel.textContent = `${winner} won the game!`;
  }
  fillBoardPlayer() {
    this.#randomGeneration(this.playerBoard);
  }
  fillBoardComputer() {
    this.#randomGeneration(this.computerBoard);
  }
  #randomGeneration(board) {
    const shipsLength = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    const dir = ['x', 'y'];
    while (shipsLength.length > 0) {
      const ship = shipsLength[0];
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const randomIndex = Math.floor(Math.random() * this.playerBoard.possibleShots.length);
        const coordinate = this.playerBoard.possibleShots[randomIndex];
        const [x, y] = coordinate;
        const randomDir = dir[Math.floor(Math.random() * 2)];
        if (board._checkConditions(ship, Number(x), Number(y), randomDir)) {
          board.placeShip(ship, Number(x), Number(y), randomDir);
          shipsLength.shift();
          placed = true;
        }
        attempts++;
      }
      if (!placed) {
        break;
      }
    }
  }
  computerShot() {
    const shot = (0,_player__WEBPACK_IMPORTED_MODULE_1__.playerComputer)(this.playerBoard);
    this.playerBoard.receiveAttack(shot);
    (0,_generateDOM__WEBPACK_IMPORTED_MODULE_2__.fillPlayerBoardsDOM)(this.playerBoard);
    const [x, y] = shot;
    if (this.playerBoard.map[x][y] === '☒') {
      this.playerBoard.isPreviousAttackHit = true;
      if (this.playerBoard.damagedShip === null) {
        this.playerBoard.firstHitCoord = shot;
      }
      this.playerBoard.lastHit = shot;
      this.playerBoard.getDamagedShip();
      return false;
    }
    this.playerBoard.isPreviousAttackHit = false;
    return true;
  }
  async playerShot() {
    const shot = await (0,_player__WEBPACK_IMPORTED_MODULE_1__.playerHuman)();
    this.computerBoard.receiveAttack(shot);
    (0,_generateDOM__WEBPACK_IMPORTED_MODULE_2__.playerShotDOM)(this.computerBoard, shot);
    const [x, y] = shot;
    if (this.computerBoard.map[x][y] === '☒') {
      return false;
    }
    return true;
  }
  checkWinner() {
    if (this.playerBoard.checkAllShipsSunk()) {
      return this.computerBoard.player;
    }
    if (this.computerBoard.checkAllShipsSunk()) {
      return this.playerBoard.player;
    }
    return null;
  }
}

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComputerBoard: () => (/* binding */ ComputerBoard),
/* harmony export */   Gameboard: () => (/* binding */ Gameboard),
/* harmony export */   HIT: () => (/* binding */ HIT),
/* harmony export */   MISS: () => (/* binding */ MISS),
/* harmony export */   PlayerBoard: () => (/* binding */ PlayerBoard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");

const SHIP_CELL = '☐';
const EMPTY_CELL = 'O';
const HIT = '☒';
const MISS = '·';
class Gameboard {
  constructor(player) {
    this.player = player;
  }
  listOfShips = new Map();
  map = [[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']];
  checkAllShipsSunk() {
    for (const ship of this.listOfShips.keys()) {
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  }
  placeShip(shipLength, xCell, yCell, dir) {
    if (!this._checkConditions(shipLength, xCell, yCell, dir)) {
      return `Измените ввод ${shipLength} ${xCell} ${yCell} ${dir}`;
    }
    const ship = new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(shipLength);
    const shipPosition = [];
    if (dir === 'x') {
      for (let i = 0; i < ship.length; i++) {
        this.map[xCell][yCell + i] = SHIP_CELL;
        shipPosition.push(`${xCell}${yCell + i}`);
      }
    } else if (dir === 'y') {
      for (let i = 0; i < ship.length; i++) {
        this.map[xCell + i][yCell] = SHIP_CELL;
        shipPosition.push(`${xCell + i}${yCell}`);
      }
    }
    this.#fillAdjacentCells(shipLength, xCell, yCell, dir);
    this.listOfShips.set(ship, shipPosition);
  }
  receiveAttack(coordinate) {
    const [x, y] = [...String(coordinate)];

    // eslint-disable-next-line no-unused-expressions
    this.map[x][y] === SHIP_CELL ? (this._hitShip(coordinate), this.map[x][y] = HIT) : this.map[x][y] = MISS;
  }
  _hitShip(coordinate) {
    let hit = false;
    for (const [ship, coords] of this.listOfShips) {
      if (coords.includes(coordinate)) {
        ship.hit();
        this.isSunkShip(ship, coords, coordinate);
        hit = true;
        break;
      }
    }
    return hit;
  }
  #fillAdjacentCells(size, xCell, yCell, direction) {
    const xStart = xCell - 1;
    const xEnd = direction === 'x' ? xCell + 1 : xCell + size;
    const yStart = yCell - 1;
    const yEnd = direction === 'y' ? yCell + 1 : yCell + size;
    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        if (x >= 0 && x < this.map.length && y >= 0 && y < this.map.length) {
          this.map[x][y] = this.map[x][y] === SHIP_CELL ? SHIP_CELL : EMPTY_CELL;
        }
      }
    }
  }
  _checkConditions(shipLength, xCell, yCell, dir) {
    if (this.#isCorrectCoordinate(shipLength, xCell, yCell, dir)) {
      return false;
    }
    if (this.listOfShips.size && this.#isShipCrossing(`${xCell}${yCell}`)) {
      return false;
    }
    if (this.listOfShips.size && this.#isAdjacentCrossing(shipLength, xCell, yCell, dir)) {
      return false;
    }
    return true;
  }
  #isCorrectCoordinate(length, x, y, dir) {
    return !(dir === 'x' ? length + y <= this.map.length && x < this.map.length : y < this.map.length && length + x <= this.map.length);
  }
  #isShipCrossing = cell => [...this.listOfShips].some(([, position]) => position.includes(cell));
  #isAdjacentCrossing(size, x, y, dir) {
    if (this.map[x][y] === EMPTY_CELL) {
      return true;
    }
    if (dir === 'x' && size > 1) {
      for (let i = 1; i < size; i++) {
        if (this.map[x][y + i] === SHIP_CELL || this.map[x][y + i] === EMPTY_CELL) {
          return true;
        }
      }
    } else if (dir === 'y' && size > 1) {
      for (let i = 1; i < size; i++) {
        if (this.map[x + i][y] === SHIP_CELL || this.map[x + i][y] === EMPTY_CELL) {
          return true;
        }
      }
    }
    return false;
  }
  fillCells(shipCoords, numberDesk) {
    for (const coor of shipCoords) {
      const [x, y] = coor;
      this.fillSingleCell(Number(x), Number(y), numberDesk);
    }
  }
  fillSingleCell(x, y, numberDesk) {
    let cell;
    const SIZE = this.map.length - 1;
    const offsets = [-1, 0, 1];
    for (const dx of offsets) {
      for (const dy of offsets) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX <= SIZE && newY >= 0 && newY <= SIZE && this.map[newX][newY] === EMPTY_CELL) {
          if (numberDesk === 0) {
            this.map[newX][newY] = MISS;
            const coor = this.possibleShots.indexOf(`${newX}${newY}`);
            this.possibleShots.splice(coor, 1);
          }
          cell = document.getElementsByClassName(`cell-${newX}${newY}`)[numberDesk];
          cell.textContent = MISS;
        }
      }
    }
  }
}
class PlayerBoard extends Gameboard {
  possibleShots = [];
  isPreviousAttackHit = false;
  previousCoord = ' ';
  firstHitCoord = ' ';
  damagedShip = null;
  lastHit = ' ';
  constructor(player) {
    super(player);
    this.fillPossibleShots();
  }
  getDamagedShip() {
    for (const [ship, coords] of this.listOfShips) {
      if (coords.includes(this.previousCoord) && !ship.isSunk()) {
        this.damagedShip = ship;
        break;
      } else if (coords.includes(this.firstHitCoord) && ship.isSunk()) {
        this.damagedShip = null;
        this.firstHitCoord = ' ';
      }
    }
  }
  fillPossibleShots() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.possibleShots.push(`${i}${j}`);
      }
    }
  }
  isSunkShip(ship, coords, hit) {
    const [x, y] = hit;
    let cell = document.getElementsByClassName(`cell-${x}${y}`)[0];
    cell.style.color = ship.isSunk() ? 'red' : 'purple';
    if (ship.isSunk()) {
      this.fillCells(coords, 0);
      for (const coor of coords) {
        const [x, y] = coor;
        cell = document.getElementsByClassName(`cell-${x}${y}`)[0];
        cell.style.color = 'red';
      }
    }
  }
}
class ComputerBoard extends Gameboard {
  hiddenMap = [[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']];
  receiveAttack(coordinate) {
    const [x, y] = [...String(coordinate)];
    if (this.map[x][y] === SHIP_CELL) {
      this._hitShip(coordinate);
      this.map[x][y] = HIT;
      this.hiddenMap[x][y] = HIT;
    } else {
      this.map[x][y] = MISS;
      this.hiddenMap[x][y] = MISS;
    }
  }
  isSunkShip(ship, coords, hit) {
    const [x, y] = hit;
    let cell = document.getElementsByClassName(`cell-${x}${y}`)[1];
    cell.style.color = ship.isSunk() ? 'red' : 'purple';
    if (ship.isSunk()) {
      this.fillCells(coords, 1);
      for (const coor of coords) {
        const [x, y] = coor;
        cell = document.getElementsByClassName(`cell-${x}${y}`)[1];
        cell.style.color = 'red';
      }
    }
  }
}

/***/ }),

/***/ "./src/generateDOM.js":
/*!****************************!*\
  !*** ./src/generateDOM.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cleanShell: () => (/* binding */ cleanShell),
/* harmony export */   fillPlayerBoardsDOM: () => (/* binding */ fillPlayerBoardsDOM),
/* harmony export */   generateShell: () => (/* binding */ generateShell),
/* harmony export */   playerShotDOM: () => (/* binding */ playerShotDOM)
/* harmony export */ });
const ROWS = 10;
const COLUMNS = 10;
function generateShell() {
  const body = document.getElementsByTagName('body')[0];
  createElement('h1', 'Battleship game', '', body);
  const labelContainer = createElement('div', '', 'labelContainer', body);
  const divButton = createElement('div', '', 'divButton', body);
  createElement('button', 'Start Game', 'button', divButton);
  createElement('h2', 'Player1 win', 'winnerLabel', divButton);
  createElement('p', 'You', 'label', labelContainer);
  createElement('p', 'Computer', 'label', labelContainer);
  const container = createElement('div', '', 'container', body);
  const leftContainer = createElement('div', '', 'leftContainer', container);
  const rightContainer = createElement('div', '', 'rightContainer', container);
  createElement('div', '', 'fake', leftContainer);
  createLetterLine(leftContainer);
  createNumberLine(leftContainer);
  createBoard(leftContainer);
  createElement('div', '', 'fake', rightContainer);
  createLetterLine(rightContainer);
  createNumberLine(rightContainer);
  createBoard(rightContainer);
}
function cleanShell(board, number) {
  for (const [i, row] of board.map.entries()) {
    for (const j of row.keys()) {
      const element = document.getElementsByClassName(`cell-${i}${j}`);
      element[number].textContent = '';
      element[number].style.color = 'black';
    }
  }
}
function fillPlayerBoardsDOM(board) {
  for (const [i, row] of board.map.entries()) {
    for (const [j, cell] of row.entries()) {
      const element = document.getElementsByClassName(`cell-${i}${j}`);
      element[0].textContent = cell === 'O' || cell === ' ' ? ' ' : cell;
    }
  }
}
function playerShotDOM(board, shot) {
  const [x, y] = shot;
  const element = document.getElementsByClassName(`cell-${x}${y}`);
  element[1].textContent = board.map[x][y];
}
function createElement(type, text, className, parent) {
  const element = document.createElement(type);
  element.textContent = text;
  if (className) {
    element.classList.add(className);
  }
  parent.appendChild(element);
  return element;
}
function createBoard(parent) {
  const board = createElement('div', '', 'board', parent);
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      const cell = createElement('div', '', 'cell', board);
      cell.classList.add(`cell-${i}${j}`);
    }
  }
  return board;
}
function createNumberLine(parent) {
  const numberLine = createElement('div', '', 'numberLine', parent);
  for (let i = 0; i < ROWS; i++) {
    createElement('div', i + 1, 'number', numberLine);
  }
  return numberLine;
}
function createLetterLine(parent) {
  const letterLine = createElement('div', '', 'letterLine', parent);
  for (let i = 0; i < COLUMNS; i++) {
    createElement('div', String.fromCharCode(65 + i), 'letter', letterLine);
  }
  return letterLine;
}

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   playerComputer: () => (/* binding */ playerComputer),
/* harmony export */   playerHuman: () => (/* binding */ playerHuman)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

function playerHuman() {
  startListeningPlayerTurn();
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (shotPlayer !== null) {
        resolve(shotPlayer);
        clearInterval(interval);
        shotPlayer = null;
      }
    }, 100);
  });
}
let shotPlayer = null;
function playerComputer(board) {
  let shot;
  const size = board.map.length - 1;
  if (board.isPreviousAttackHit || board.damagedShip !== null) {
    let [x, y] = board.lastHit;
    x = Number(x);
    y = Number(y);
    const conditions = [(x, y) => {
      if (y > 0 && board.map[x][y - 1] !== _gameboard__WEBPACK_IMPORTED_MODULE_0__.MISS && board.map[x][y - 1] !== _gameboard__WEBPACK_IMPORTED_MODULE_0__.HIT && board.possibleShots.indexOf(`${x}${y - 1}`) !== -1) {
        return `${x}${y - 1}`;
      }
    }, (x, y) => {
      if (x > 0 && board.map[x - 1][y] !== _gameboard__WEBPACK_IMPORTED_MODULE_0__.MISS && board.map[x - 1][y] !== _gameboard__WEBPACK_IMPORTED_MODULE_0__.HIT && board.possibleShots.indexOf(`${x - 1}${y}`) !== -1) {
        return `${x - 1}${y}`;
      }
    }, (x, y) => {
      if (y < size && board.map[x][y + 1] !== _gameboard__WEBPACK_IMPORTED_MODULE_0__.MISS && board.map[x][y + 1] !== _gameboard__WEBPACK_IMPORTED_MODULE_0__.HIT && board.possibleShots.indexOf(`${x}${y + 1}`) !== -1) {
        return `${x}${y + 1}`;
      }
    }, (x, y) => {
      if (x < size && board.map[x + 1][y] !== _gameboard__WEBPACK_IMPORTED_MODULE_0__.MISS && board.map[x + 1][y] !== _gameboard__WEBPACK_IMPORTED_MODULE_0__.HIT && board.possibleShots.indexOf(`${x + 1}${y}`) !== -1) {
        return `${x + 1}${y}`;
      }
    }];
    const shuffle = function (array) {
      let currentIndex = array.length;
      let randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    };
    for (const condition of shuffle(conditions)) {
      const result = condition(x, y);
      if (result !== undefined) {
        shot = result;
        break;
      }
    }
    if (shot === undefined && board.damagedShip !== null) {
      let [xS, yS] = board.firstHitCoord;
      xS = Number(xS);
      yS = Number(yS);
      for (const condition of shuffle(conditions)) {
        const result = condition(xS, yS);
        if (result !== undefined) {
          shot = result;
          break;
        }
      }
    }
    if (shot === undefined) {
      const random = Math.floor(Math.random() * board.possibleShots.length);
      shot = board.possibleShots[random];
    }
    const index = board.possibleShots.indexOf(shot);
    board.possibleShots.splice(index, 1);
  } else {
    const randomIndex = Math.floor(Math.random() * board.possibleShots.length);
    shot = board.possibleShots[randomIndex];
    board.possibleShots.splice(randomIndex, 1);
  }
  board.previousCoord = shot;
  return shot;
}
function startListeningPlayerTurn() {
  const field = document.getElementsByClassName('board')[1];
  field.addEventListener('click', handler);
  field.addEventListener('mouseover', backlight);
  field.addEventListener('mouseout', reset);
}
function handler(e) {
  const field = document.getElementsByClassName('board')[1];
  if (e.target.classList.contains('cell') && e.target.textContent === '') {
    shotPlayer = e.target.classList[1].slice(5);
    field.removeEventListener('click', handler);
  }
}
function backlight(e) {
  if (e.target.classList.contains('cell')) {
    e.target.style.transform = 'scale(1.05)';
    e.target.style.background = 'rgb(245, 245, 245)';
  }
}
function reset(e) {
  if (e.target.classList.contains('cell')) {
    e.target.style.transform = 'none';
    e.target.style.background = 'white';
  }
}

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }
  hit() {
    this.hits++;
  }
  isSunk() {
    return this.length === this.hits;
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./dist/css/style.css":
/*!******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./dist/css/style.css ***!
  \******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `* {
  margin: 0;
  padding: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

body {
  background: #f5f5dc;
  display: flex;
  flex-direction: column;
  align-items: center;
}
body h1 {
  font-family: "Courier New", Courier, monospace;
  font-size: 3rem;
  color: blue;
  margin: 1rem 0;
}

.labelContainer {
  display: flex;
  justify-content: space-evenly;
  width: 80vw;
  gap: 5rem;
}
.labelContainer .label {
  font-size: 2rem;
  font-family: "Courier New", Courier, monospace;
  color: #4d4d4d;
  font-weight: bold;
  width: 25vh;
  text-align: center;
}

.divButton {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.divButton .button {
  font-size: 2rem;
  border-radius: 10px;
  background-color: rgba(77, 77, 77, 0.568627451);
}
.divButton .winnerLabel {
  color: #115f13;
  font-size: 2rem;
  height: 2rem;
  margin-bottom: 2rem;
}

.container {
  height: auto;
  width: 70vw;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;
}
.container .leftContainer,
.container .rightContainer {
  display: grid;
  grid-template-columns: 10px 1fr;
  grid-template-rows: 10px 1fr;
  gap: 1rem;
  flex: 1;
}

.board {
  aspect-ratio: 1/1;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  grid-auto-flow: dense;
  background-color: white;
  border: 2px solid blue;
}
.board div {
  border: 2px solid blue;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vw;
  height: auto;
  width: auto;
  min-height: 0;
  min-width: 0;
}

.letterLine,
.numberLine {
  display: flex;
  font-weight: 900;
  font-size: 2rem;
  color: blue;
}

.letterLine {
  justify-content: space-around;
  align-items: flex-end;
}

.numberLine {
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.letter,
.number {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  height: auto;
  width: auto;
}

@media (max-width: 1100px) {
  .container {
    width: 95vw;
  }
}
@media (max-width: 810px) {
  h1 {
    text-align: center;
  }
  .container {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  .board div {
    font-size: 7vw;
  }
}/*# sourceMappingURL=style.css.map */`, "",{"version":3,"sources":["webpack://./src/style.scss","webpack://./dist/css/style.css"],"names":[],"mappings":"AAAA;EACC,SAAA;EACA,UAAA;EACA,yBAAA;EAEA,sBAAA;EAEA,iBAAA;ACCD;;ADYA;EACC,mBAXe;EAYf,aAAA;EACA,sBAAA;EACA,mBAAA;ACTD;ADWC;EACC,8CAZK;EAaL,eAZgB;EAahB,WAlBa;EAmBb,cAAA;ACTF;;ADaA;EACC,aAAA;EACA,6BAAA;EACA,WAAA;EACA,SAAA;ACVD;ADYC;EACC,eAxBe;EAyBf,8CA3BK;EA4BL,cA/BY;EAgCZ,iBAAA;EACA,WAAA;EACA,kBAAA;ACVF;;ADcA;EACC,aAAA;EACA,sBAAA;EACA,mBAAA;EACA,SAAA;ACXD;ADaC;EACC,eAxCe;EAyCf,mBAAA;EACA,+CA9Ca;ACmCf;ADcC;EACC,cAjDa;EAkDb,eA/Ce;EAgDf,YAhDe;EAiDf,mBAjDe;ACqCjB;;ADgBA;EACC,YAAA;EACA,WAAA;EACA,aAAA;EACA,8BAAA;EACA,uBAAA;EACA,SAAA;ACbD;ADeC;;EAEC,aAAA;EACA,+BAAA;EACA,4BAAA;EACA,SAAA;EACA,OAAA;ACbF;;ADiBA;EACC,iBAAA;EACA,aAAA;EACA,sCAAA;EACA,mCAAA;EACA,qBAAA;EACA,uBAAA;EACA,sBAAA;ACdD;ADgBC;EACC,sBAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,cAAA;EAEA,YAAA;EACA,WAAA;EACA,aAAA;EACA,YAAA;ACfF;;ADmBA;;EAEC,aAAA;EACA,gBAAA;EACA,eAlGgB;EAmGhB,WAzGc;ACyFf;;ADmBA;EACC,6BAAA;EACA,qBAAA;AChBD;;ADmBA;EACC,sBAAA;EACA,6BAAA;EACA,mBAAA;AChBD;;ADmBA;;EAEC,yBAAA;EAEA,sBAAA;EAEA,iBAAA;EACA,YAAA;EACA,WAAA;AChBD;;ADmBA;EACC;IACC,WAAA;EChBA;AACF;ADmBA;EAKC;IACC,kBAAA;ECrBA;EDwBD;IACC,8BAAA;IACA,oBAAA;ECtBA;EDyBD;IACC,cAAA;ECvBA;AACF,CAAA,oCAAA","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./dist/css/style.css":
/*!****************************!*\
  !*** ./dist/css/style.css ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./dist/css/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dist_css_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dist/css/style.css */ "./dist/css/style.css");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _generateDOM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./generateDOM */ "./src/generateDOM.js");



(0,_generateDOM__WEBPACK_IMPORTED_MODULE_2__.generateShell)();
const newGame = new _game__WEBPACK_IMPORTED_MODULE_1__.Game('Player', 'Computer');
const button = document.getElementsByClassName('button')[0];
newGame.start();
button.addEventListener('click', () => {
  // eslint-disable-next-line no-alert
  const ask = confirm('Start a new game?');
  if (ask) {
    (0,_generateDOM__WEBPACK_IMPORTED_MODULE_2__.cleanShell)(newGame.computerBoard, 1);
    (0,_generateDOM__WEBPACK_IMPORTED_MODULE_2__.cleanShell)(newGame.playerBoard, 0);
    newGame.reset();
    newGame.start();
  }
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQ2xEO0VBRURNLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ25CLEtBQUssTUFBTXhCLElBQUksSUFBSSxJQUFJLENBQUMrQixXQUFXLENBQUNFLElBQUksQ0FBQyxDQUFDLEVBQUU7TUFDM0MsSUFBSSxDQUFDakMsSUFBSSxDQUFDa0MsTUFBTSxDQUFDLENBQUMsRUFBRTtRQUNuQixPQUFPLEtBQUs7TUFDYjtJQUNEO0lBRUEsT0FBTyxJQUFJO0VBQ1o7RUFFQXBCLFNBQVNBLENBQUNxQixVQUFVLEVBQUVDLEtBQUssRUFBRUMsS0FBSyxFQUFFdkMsR0FBRyxFQUFFO0lBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUNjLGdCQUFnQixDQUFDdUIsVUFBVSxFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRXZDLEdBQUcsQ0FBQyxFQUFFO01BQzFELE9BQVEsaUJBQWdCcUMsVUFBVyxJQUFHQyxLQUFNLElBQUdDLEtBQU0sSUFBR3ZDLEdBQUksRUFBQztJQUM5RDtJQUVBLE1BQU1FLElBQUksR0FBRyxJQUFJeUIsdUNBQUksQ0FBQ1UsVUFBVSxDQUFDO0lBQ2pDLE1BQU1HLFlBQVksR0FBRyxFQUFFO0lBQ3ZCLElBQUl4QyxHQUFHLEtBQUssR0FBRyxFQUFFO01BQ2hCLEtBQUssSUFBSXlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3ZDLElBQUksQ0FBQ0QsTUFBTSxFQUFFd0MsQ0FBQyxFQUFFLEVBQUU7UUFDckMsSUFBSSxDQUFDckIsR0FBRyxDQUFDa0IsS0FBSyxDQUFDLENBQUNDLEtBQUssR0FBR0UsQ0FBQyxDQUFDLEdBQUdiLFNBQVM7UUFDdENZLFlBQVksQ0FBQ0UsSUFBSSxDQUFFLEdBQUVKLEtBQU0sR0FBRUMsS0FBSyxHQUFHRSxDQUFFLEVBQUMsQ0FBQztNQUMxQztJQUNELENBQUMsTUFBTSxJQUFJekMsR0FBRyxLQUFLLEdBQUcsRUFBRTtNQUN2QixLQUFLLElBQUl5QyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUd2QyxJQUFJLENBQUNELE1BQU0sRUFBRXdDLENBQUMsRUFBRSxFQUFFO1FBQ3JDLElBQUksQ0FBQ3JCLEdBQUcsQ0FBQ2tCLEtBQUssR0FBR0csQ0FBQyxDQUFDLENBQUNGLEtBQUssQ0FBQyxHQUFHWCxTQUFTO1FBQ3RDWSxZQUFZLENBQUNFLElBQUksQ0FBRSxHQUFFSixLQUFLLEdBQUdHLENBQUUsR0FBRUYsS0FBTSxFQUFDLENBQUM7TUFDMUM7SUFDRDtJQUVBLElBQUksQ0FBQyxDQUFDSSxpQkFBaUIsQ0FBQ04sVUFBVSxFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRXZDLEdBQUcsQ0FBQztJQUV0RCxJQUFJLENBQUNpQyxXQUFXLENBQUNXLEdBQUcsQ0FBQzFDLElBQUksRUFBRXNDLFlBQVksQ0FBQztFQUN6QztFQUVBckIsYUFBYUEsQ0FBQ1QsVUFBVSxFQUFFO0lBQ3pCLE1BQU0sQ0FBQ0MsQ0FBQyxFQUFFQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUdpQyxNQUFNLENBQUNuQyxVQUFVLENBQUMsQ0FBQzs7SUFFdEM7SUFDQSxJQUFJLENBQUNVLEdBQUcsQ0FBQ1QsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLZ0IsU0FBUyxJQUN4QixJQUFJLENBQUNrQixRQUFRLENBQUNwQyxVQUFVLENBQUMsRUFBRyxJQUFJLENBQUNVLEdBQUcsQ0FBQ1QsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxHQUFHa0IsR0FBSSxJQUNqRCxJQUFJLENBQUNWLEdBQUcsQ0FBQ1QsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxHQUFHbUIsSUFBSztFQUMzQjtFQUVBZSxRQUFRQSxDQUFDcEMsVUFBVSxFQUFFO0lBQ3BCLElBQUlyQixHQUFHLEdBQUcsS0FBSztJQUNmLEtBQUssTUFBTSxDQUFDYSxJQUFJLEVBQUU2QyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUNkLFdBQVcsRUFBRTtNQUM5QyxJQUFJYyxNQUFNLENBQUNDLFFBQVEsQ0FBQ3RDLFVBQVUsQ0FBQyxFQUFFO1FBQ2hDUixJQUFJLENBQUNiLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxDQUFDNEQsVUFBVSxDQUFDL0MsSUFBSSxFQUFFNkMsTUFBTSxFQUFFckMsVUFBVSxDQUFDO1FBQ3pDckIsR0FBRyxHQUFHLElBQUk7UUFDVjtNQUNEO0lBQ0Q7SUFFQSxPQUFPQSxHQUFHO0VBQ1g7RUFFQSxDQUFDc0QsaUJBQWlCTyxDQUFDQyxJQUFJLEVBQUViLEtBQUssRUFBRUMsS0FBSyxFQUFFYSxTQUFTLEVBQUU7SUFDakQsTUFBTUMsTUFBTSxHQUFHZixLQUFLLEdBQUcsQ0FBQztJQUN4QixNQUFNZ0IsSUFBSSxHQUFHRixTQUFTLEtBQUssR0FBRyxHQUFHZCxLQUFLLEdBQUcsQ0FBQyxHQUFHQSxLQUFLLEdBQUdhLElBQUk7SUFDekQsTUFBTUksTUFBTSxHQUFHaEIsS0FBSyxHQUFHLENBQUM7SUFDeEIsTUFBTWlCLElBQUksR0FBR0osU0FBUyxLQUFLLEdBQUcsR0FBR2IsS0FBSyxHQUFHLENBQUMsR0FBR0EsS0FBSyxHQUFHWSxJQUFJO0lBRXpELEtBQUssSUFBSXhDLENBQUMsR0FBRzBDLE1BQU0sRUFBRTFDLENBQUMsSUFBSTJDLElBQUksRUFBRTNDLENBQUMsRUFBRSxFQUFFO01BQ3BDLEtBQUssSUFBSUMsQ0FBQyxHQUFHMkMsTUFBTSxFQUFFM0MsQ0FBQyxJQUFJNEMsSUFBSSxFQUFFNUMsQ0FBQyxFQUFFLEVBQUU7UUFDcEMsSUFBSUQsQ0FBQyxJQUFJLENBQUMsSUFBSUEsQ0FBQyxHQUFHLElBQUksQ0FBQ1MsR0FBRyxDQUFDbkIsTUFBTSxJQUFJVyxDQUFDLElBQUksQ0FBQyxJQUFJQSxDQUFDLEdBQUcsSUFBSSxDQUFDUSxHQUFHLENBQUNuQixNQUFNLEVBQUU7VUFDbkUsSUFBSSxDQUFDbUIsR0FBRyxDQUFDVCxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEdBQ2IsSUFBSSxDQUFDUSxHQUFHLENBQUNULENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsS0FBS2dCLFNBQVMsR0FBR0EsU0FBUyxHQUFHQyxVQUFVO1FBQ3ZEO01BQ0Q7SUFDRDtFQUNEO0VBRUFmLGdCQUFnQkEsQ0FBQ3VCLFVBQVUsRUFBRUMsS0FBSyxFQUFFQyxLQUFLLEVBQUV2QyxHQUFHLEVBQUU7SUFDL0MsSUFBSSxJQUFJLENBQUMsQ0FBQ3lELG1CQUFtQixDQUFDcEIsVUFBVSxFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRXZDLEdBQUcsQ0FBQyxFQUFFO01BQzdELE9BQU8sS0FBSztJQUNiO0lBRUEsSUFBSSxJQUFJLENBQUNpQyxXQUFXLENBQUNrQixJQUFJLElBQUksSUFBSSxDQUFDLENBQUNPLGNBQWMsQ0FBRSxHQUFFcEIsS0FBTSxHQUFFQyxLQUFNLEVBQUMsQ0FBQyxFQUFFO01BQ3RFLE9BQU8sS0FBSztJQUNiO0lBRUEsSUFDQyxJQUFJLENBQUNOLFdBQVcsQ0FBQ2tCLElBQUksSUFDckIsSUFBSSxDQUFDLENBQUNRLGtCQUFrQixDQUFDdEIsVUFBVSxFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRXZDLEdBQUcsQ0FBQyxFQUN0RDtNQUNELE9BQU8sS0FBSztJQUNiO0lBRUEsT0FBTyxJQUFJO0VBQ1o7RUFFQSxDQUFDeUQsbUJBQW1CRyxDQUFDM0QsTUFBTSxFQUFFVSxDQUFDLEVBQUVDLENBQUMsRUFBRVosR0FBRyxFQUFFO0lBQ3ZDLE9BQU8sRUFBRUEsR0FBRyxLQUFLLEdBQUcsR0FDakJDLE1BQU0sR0FBR1csQ0FBQyxJQUFJLElBQUksQ0FBQ1EsR0FBRyxDQUFDbkIsTUFBTSxJQUFJVSxDQUFDLEdBQUcsSUFBSSxDQUFDUyxHQUFHLENBQUNuQixNQUFNLEdBQ3BEVyxDQUFDLEdBQUcsSUFBSSxDQUFDUSxHQUFHLENBQUNuQixNQUFNLElBQUlBLE1BQU0sR0FBR1UsQ0FBQyxJQUFJLElBQUksQ0FBQ1MsR0FBRyxDQUFDbkIsTUFBTSxDQUFDO0VBQ3pEO0VBRUEsQ0FBQ3lELGNBQWMsR0FBSUcsSUFBSSxJQUN0QixDQUFDLEdBQUcsSUFBSSxDQUFDNUIsV0FBVyxDQUFDLENBQUM2QixJQUFJLENBQUMsQ0FBQyxHQUFHQyxRQUFRLENBQUMsS0FBS0EsUUFBUSxDQUFDZixRQUFRLENBQUNhLElBQUksQ0FBQyxDQUFDO0VBRXRFLENBQUNGLGtCQUFrQkssQ0FBQ2IsSUFBSSxFQUFFeEMsQ0FBQyxFQUFFQyxDQUFDLEVBQUVaLEdBQUcsRUFBRTtJQUNwQyxJQUFJLElBQUksQ0FBQ29CLEdBQUcsQ0FBQ1QsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLaUIsVUFBVSxFQUFFO01BQ2xDLE9BQU8sSUFBSTtJQUNaO0lBRUEsSUFBSTdCLEdBQUcsS0FBSyxHQUFHLElBQUltRCxJQUFJLEdBQUcsQ0FBQyxFQUFFO01BQzVCLEtBQUssSUFBSVYsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHVSxJQUFJLEVBQUVWLENBQUMsRUFBRSxFQUFFO1FBQzlCLElBQ0MsSUFBSSxDQUFDckIsR0FBRyxDQUFDVCxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxHQUFHNkIsQ0FBQyxDQUFDLEtBQUtiLFNBQVMsSUFDaEMsSUFBSSxDQUFDUixHQUFHLENBQUNULENBQUMsQ0FBQyxDQUFDQyxDQUFDLEdBQUc2QixDQUFDLENBQUMsS0FBS1osVUFBVSxFQUNoQztVQUNELE9BQU8sSUFBSTtRQUNaO01BQ0Q7SUFDRCxDQUFDLE1BQU0sSUFBSTdCLEdBQUcsS0FBSyxHQUFHLElBQUltRCxJQUFJLEdBQUcsQ0FBQyxFQUFFO01BQ25DLEtBQUssSUFBSVYsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHVSxJQUFJLEVBQUVWLENBQUMsRUFBRSxFQUFFO1FBQzlCLElBQ0MsSUFBSSxDQUFDckIsR0FBRyxDQUFDVCxDQUFDLEdBQUc4QixDQUFDLENBQUMsQ0FBQzdCLENBQUMsQ0FBQyxLQUFLZ0IsU0FBUyxJQUNoQyxJQUFJLENBQUNSLEdBQUcsQ0FBQ1QsQ0FBQyxHQUFHOEIsQ0FBQyxDQUFDLENBQUM3QixDQUFDLENBQUMsS0FBS2lCLFVBQVUsRUFDaEM7VUFDRCxPQUFPLElBQUk7UUFDWjtNQUNEO0lBQ0Q7SUFFQSxPQUFPLEtBQUs7RUFDYjtFQUVBb0MsU0FBU0EsQ0FBQ0MsVUFBVSxFQUFFQyxVQUFVLEVBQUU7SUFDakMsS0FBSyxNQUFNQyxJQUFJLElBQUlGLFVBQVUsRUFBRTtNQUM5QixNQUFNLENBQUN2RCxDQUFDLEVBQUVDLENBQUMsQ0FBQyxHQUFHd0QsSUFBSTtNQUNuQixJQUFJLENBQUNDLGNBQWMsQ0FBQ3RELE1BQU0sQ0FBQ0osQ0FBQyxDQUFDLEVBQUVJLE1BQU0sQ0FBQ0gsQ0FBQyxDQUFDLEVBQUV1RCxVQUFVLENBQUM7SUFDdEQ7RUFDRDtFQUVBRSxjQUFjQSxDQUFDMUQsQ0FBQyxFQUFFQyxDQUFDLEVBQUV1RCxVQUFVLEVBQUU7SUFDaEMsSUFBSU4sSUFBSTtJQUNSLE1BQU1TLElBQUksR0FBRyxJQUFJLENBQUNsRCxHQUFHLENBQUNuQixNQUFNLEdBQUcsQ0FBQztJQUNoQyxNQUFNc0UsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQixLQUFLLE1BQU1DLEVBQUUsSUFBSUQsT0FBTyxFQUFFO01BQ3pCLEtBQUssTUFBTUUsRUFBRSxJQUFJRixPQUFPLEVBQUU7UUFDekIsSUFBSUMsRUFBRSxLQUFLLENBQUMsSUFBSUMsRUFBRSxLQUFLLENBQUMsRUFBRTtVQUN6QjtRQUNEO1FBRUEsTUFBTUMsSUFBSSxHQUFHL0QsQ0FBQyxHQUFHNkQsRUFBRTtRQUNuQixNQUFNRyxJQUFJLEdBQUcvRCxDQUFDLEdBQUc2RCxFQUFFO1FBQ25CLElBQ0NDLElBQUksSUFBSSxDQUFDLElBQ1RBLElBQUksSUFBSUosSUFBSSxJQUNaSyxJQUFJLElBQUksQ0FBQyxJQUNUQSxJQUFJLElBQUlMLElBQUksSUFDWixJQUFJLENBQUNsRCxHQUFHLENBQUNzRCxJQUFJLENBQUMsQ0FBQ0MsSUFBSSxDQUFDLEtBQUs5QyxVQUFVLEVBQ2xDO1VBQ0QsSUFBSXNDLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDL0MsR0FBRyxDQUFDc0QsSUFBSSxDQUFDLENBQUNDLElBQUksQ0FBQyxHQUFHNUMsSUFBSTtZQUMzQixNQUFNcUMsSUFBSSxHQUFHLElBQUksQ0FBQzNELGFBQWEsQ0FBQ21FLE9BQU8sQ0FBRSxHQUFFRixJQUFLLEdBQUVDLElBQUssRUFBQyxDQUFDO1lBQ3pELElBQUksQ0FBQ2xFLGFBQWEsQ0FBQ29FLE1BQU0sQ0FBQ1QsSUFBSSxFQUFFLENBQUMsQ0FBQztVQUNuQztVQUVBUCxJQUFJLEdBQUc5RSxRQUFRLENBQUNDLHNCQUFzQixDQUFFLFFBQU8wRixJQUFLLEdBQUVDLElBQUssRUFBQyxDQUFDLENBQzVEUixVQUFVLENBQ1Y7VUFDRE4sSUFBSSxDQUFDNUUsV0FBVyxHQUFHOEMsSUFBSTtRQUN4QjtNQUNEO0lBQ0Q7RUFDRDtBQUNEO0FBRU8sTUFBTWpFLFdBQVcsU0FBU2tFLFNBQVMsQ0FBQztFQUMxQ3ZCLGFBQWEsR0FBRyxFQUFFO0VBQ2xCWSxtQkFBbUIsR0FBRyxLQUFLO0VBQzNCeUQsYUFBYSxHQUFHLEdBQUc7RUFDbkJ2RCxhQUFhLEdBQUcsR0FBRztFQUNuQkQsV0FBVyxHQUFHLElBQUk7RUFDbEJFLE9BQU8sR0FBRyxHQUFHO0VBRWJuRCxXQUFXQSxDQUFDUSxNQUFNLEVBQUU7SUFDbkIsS0FBSyxDQUFDQSxNQUFNLENBQUM7SUFDYixJQUFJLENBQUNrRyxpQkFBaUIsQ0FBQyxDQUFDO0VBQ3pCO0VBRUF0RCxjQUFjQSxDQUFBLEVBQUc7SUFDaEIsS0FBSyxNQUFNLENBQUN2QixJQUFJLEVBQUU2QyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUNkLFdBQVcsRUFBRTtNQUM5QyxJQUFJYyxNQUFNLENBQUNDLFFBQVEsQ0FBQyxJQUFJLENBQUM4QixhQUFhLENBQUMsSUFBSSxDQUFDNUUsSUFBSSxDQUFDa0MsTUFBTSxDQUFDLENBQUMsRUFBRTtRQUMxRCxJQUFJLENBQUNkLFdBQVcsR0FBR3BCLElBQUk7UUFFdkI7TUFDRCxDQUFDLE1BQU0sSUFBSTZDLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDLElBQUksQ0FBQ3pCLGFBQWEsQ0FBQyxJQUFJckIsSUFBSSxDQUFDa0MsTUFBTSxDQUFDLENBQUMsRUFBRTtRQUNoRSxJQUFJLENBQUNkLFdBQVcsR0FBRyxJQUFJO1FBQ3ZCLElBQUksQ0FBQ0MsYUFBYSxHQUFHLEdBQUc7TUFDekI7SUFDRDtFQUNEO0VBRUF3RCxpQkFBaUJBLENBQUEsRUFBRztJQUNuQixLQUFLLElBQUl0QyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsRUFBRSxFQUFFQSxDQUFDLEVBQUUsRUFBRTtNQUM1QixLQUFLLElBQUl1QyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsRUFBRSxFQUFFQSxDQUFDLEVBQUUsRUFBRTtRQUM1QixJQUFJLENBQUN2RSxhQUFhLENBQUNpQyxJQUFJLENBQUUsR0FBRUQsQ0FBRSxHQUFFdUMsQ0FBRSxFQUFDLENBQUM7TUFDcEM7SUFDRDtFQUNEO0VBRUEvQixVQUFVQSxDQUFDL0MsSUFBSSxFQUFFNkMsTUFBTSxFQUFFMUQsR0FBRyxFQUFFO0lBQzdCLE1BQU0sQ0FBQ3NCLENBQUMsRUFBRUMsQ0FBQyxDQUFDLEdBQUd2QixHQUFHO0lBQ2xCLElBQUl3RSxJQUFJLEdBQUc5RSxRQUFRLENBQUNDLHNCQUFzQixDQUFFLFFBQU8yQixDQUFFLEdBQUVDLENBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlEaUQsSUFBSSxDQUFDb0IsS0FBSyxDQUFDQyxLQUFLLEdBQUdoRixJQUFJLENBQUNrQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxRQUFRO0lBQ25ELElBQUlsQyxJQUFJLENBQUNrQyxNQUFNLENBQUMsQ0FBQyxFQUFFO01BQ2xCLElBQUksQ0FBQzZCLFNBQVMsQ0FBQ2xCLE1BQU0sRUFBRSxDQUFDLENBQUM7TUFDekIsS0FBSyxNQUFNcUIsSUFBSSxJQUFJckIsTUFBTSxFQUFFO1FBQzFCLE1BQU0sQ0FBQ3BDLENBQUMsRUFBRUMsQ0FBQyxDQUFDLEdBQUd3RCxJQUFJO1FBQ25CUCxJQUFJLEdBQUc5RSxRQUFRLENBQUNDLHNCQUFzQixDQUFFLFFBQU8yQixDQUFFLEdBQUVDLENBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFEaUQsSUFBSSxDQUFDb0IsS0FBSyxDQUFDQyxLQUFLLEdBQUcsS0FBSztNQUN6QjtJQUNEO0VBQ0Q7QUFDRDtBQUVPLE1BQU1ySCxhQUFhLFNBQVNtRSxTQUFTLENBQUM7RUFDNUNtRCxTQUFTLEdBQUcsQ0FDWCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxF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SixNQUFNLENBQUNaLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0VBQ3RDO0VBQ0EsTUFBTWEsR0FBRyxHQUFHQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7RUFDeEMsSUFBSUQsR0FBRyxFQUFFO0lBQ1I1Qyx3REFBVSxDQUFDMEMsT0FBTyxDQUFDbkssYUFBYSxFQUFFLENBQUMsQ0FBQztJQUNwQ3lILHdEQUFVLENBQUMwQyxPQUFPLENBQUNwSyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDb0ssT0FBTyxDQUFDaEssS0FBSyxDQUFDLENBQUM7SUFDZmdLLE9BQU8sQ0FBQzFKLEtBQUssQ0FBQyxDQUFDO0VBQ2hCO0FBQ0QsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9nZW5lcmF0ZURPTS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL2Rpc3QvY3NzL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL2Rpc3QvY3NzL3N0eWxlLmNzcz9mMTZlIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wdXRlckJvYXJkLCBQbGF5ZXJCb2FyZH0gZnJvbSAnLi9nYW1lYm9hcmQnO1xuaW1wb3J0IHtwbGF5ZXJIdW1hbiwgcGxheWVyQ29tcHV0ZXJ9IGZyb20gJy4vcGxheWVyJztcbmltcG9ydCB7ZmlsbFBsYXllckJvYXJkc0RPTSwgcGxheWVyU2hvdERPTX0gZnJvbSAnLi9nZW5lcmF0ZURPTSc7XG5cbmNvbnN0IERFTEFZID0gODAwO1xuXG5leHBvcnQgY2xhc3MgR2FtZSB7XG5cdGNvbnN0cnVjdG9yKHBsYXllcjEsIHBsYXllcjIpIHtcblx0XHR0aGlzLnBsYXllckJvYXJkID0gbmV3IFBsYXllckJvYXJkKHBsYXllcjEpO1xuXHRcdHRoaXMuY29tcHV0ZXJCb2FyZCA9IG5ldyBDb21wdXRlckJvYXJkKHBsYXllcjIpO1xuXHRcdHRoaXMuZmlsbEJvYXJkUGxheWVyKCk7XG5cdFx0dGhpcy5maWxsQm9hcmRDb21wdXRlcigpO1xuXHRcdGZpbGxQbGF5ZXJCb2FyZHNET00odGhpcy5wbGF5ZXJCb2FyZCk7XG5cdH1cblxuXHRyZXNldCgpIHtcblx0XHR0aGlzLnBsYXllckJvYXJkID0gbmV3IFBsYXllckJvYXJkKHRoaXMucGxheWVyQm9hcmQucGxheWVyKTtcblx0XHR0aGlzLmNvbXB1dGVyQm9hcmQgPSBuZXcgQ29tcHV0ZXJCb2FyZCh0aGlzLmNvbXB1dGVyQm9hcmQucGxheWVyKTtcblx0XHR0aGlzLmZpbGxCb2FyZFBsYXllcigpO1xuXHRcdHRoaXMuZmlsbEJvYXJkQ29tcHV0ZXIoKTtcblx0XHRmaWxsUGxheWVyQm9hcmRzRE9NKHRoaXMucGxheWVyQm9hcmQpO1xuXHRcdGNvbnN0IHdpbmVyTGFiZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5uZXJMYWJlbCcpWzBdO1xuXHRcdHdpbmVyTGFiZWwudGV4dENvbnRlbnQgPSAnJztcblx0fVxuXG5cdGFzeW5jIHN0YXJ0KCkge1xuXHRcdGxldCB0dXJuID0gJ3BsYXllcic7XG5cdFx0bGV0IHdpbm5lciA9IG51bGw7XG5cdFx0d2hpbGUgKCF3aW5uZXIpIHtcblx0XHRcdGlmICh0dXJuID09PSAncGxheWVyJykge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuXHRcdFx0XHRjb25zdCBoaXQgPSBhd2FpdCB0aGlzLnBsYXllclNob3QoKTtcblx0XHRcdFx0aWYgKGhpdCkge1xuXHRcdFx0XHRcdHR1cm4gPSAnY29tcHV0ZXInO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHR1cm4gPT09ICdjb21wdXRlcicpIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3Bcblx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KHJlc29sdmUsIERFTEFZKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNvbnN0IGhpdCA9IHRoaXMuY29tcHV0ZXJTaG90KCk7XG5cblx0XHRcdFx0aWYgKGhpdCkge1xuXHRcdFx0XHRcdHR1cm4gPSAncGxheWVyJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR3aW5uZXIgPSB0aGlzLmNoZWNrV2lubmVyKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgd2luZXJMYWJlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbm5lckxhYmVsJylbMF07XG5cdFx0d2luZXJMYWJlbC50ZXh0Q29udGVudCA9IGAke3dpbm5lcn0gd29uIHRoZSBnYW1lIWA7XG5cdH1cblxuXHRmaWxsQm9hcmRQbGF5ZXIoKSB7XG5cdFx0dGhpcy4jcmFuZG9tR2VuZXJhdGlvbih0aGlzLnBsYXllckJvYXJkKTtcblx0fVxuXG5cdGZpbGxCb2FyZENvbXB1dGVyKCkge1xuXHRcdHRoaXMuI3JhbmRvbUdlbmVyYXRpb24odGhpcy5jb21wdXRlckJvYXJkKTtcblx0fVxuXG5cdCNyYW5kb21HZW5lcmF0aW9uKGJvYXJkKSB7XG5cdFx0Y29uc3Qgc2hpcHNMZW5ndGggPSBbNCwgMywgMywgMiwgMiwgMiwgMSwgMSwgMSwgMV07XG5cdFx0Y29uc3QgZGlyID0gWyd4JywgJ3knXTtcblx0XHR3aGlsZSAoc2hpcHNMZW5ndGgubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc3Qgc2hpcCA9IHNoaXBzTGVuZ3RoWzBdO1xuXHRcdFx0bGV0IHBsYWNlZCA9IGZhbHNlO1xuXHRcdFx0bGV0IGF0dGVtcHRzID0gMDtcblx0XHRcdHdoaWxlICghcGxhY2VkICYmIGF0dGVtcHRzIDwgMTAwKSB7XG5cdFx0XHRcdGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihcblx0XHRcdFx0XHRNYXRoLnJhbmRvbSgpICogdGhpcy5wbGF5ZXJCb2FyZC5wb3NzaWJsZVNob3RzLmxlbmd0aCxcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3QgY29vcmRpbmF0ZSA9IHRoaXMucGxheWVyQm9hcmQucG9zc2libGVTaG90c1tyYW5kb21JbmRleF07XG5cdFx0XHRcdGNvbnN0IFt4LCB5XSA9IGNvb3JkaW5hdGU7XG5cdFx0XHRcdGNvbnN0IHJhbmRvbURpciA9IGRpcltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKV07XG5cdFx0XHRcdGlmIChib2FyZC5fY2hlY2tDb25kaXRpb25zKHNoaXAsIE51bWJlcih4KSwgTnVtYmVyKHkpLCByYW5kb21EaXIpKSB7XG5cdFx0XHRcdFx0Ym9hcmQucGxhY2VTaGlwKHNoaXAsIE51bWJlcih4KSwgTnVtYmVyKHkpLCByYW5kb21EaXIpO1xuXHRcdFx0XHRcdHNoaXBzTGVuZ3RoLnNoaWZ0KCk7XG5cdFx0XHRcdFx0cGxhY2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGF0dGVtcHRzKys7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghcGxhY2VkKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbXB1dGVyU2hvdCgpIHtcblx0XHRjb25zdCBzaG90ID0gcGxheWVyQ29tcHV0ZXIodGhpcy5wbGF5ZXJCb2FyZCk7XG5cdFx0dGhpcy5wbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHNob3QpO1xuXHRcdGZpbGxQbGF5ZXJCb2FyZHNET00odGhpcy5wbGF5ZXJCb2FyZCk7XG5cdFx0Y29uc3QgW3gsIHldID0gc2hvdDtcblx0XHRpZiAodGhpcy5wbGF5ZXJCb2FyZC5tYXBbeF1beV0gPT09ICfimJInKSB7XG5cdFx0XHR0aGlzLnBsYXllckJvYXJkLmlzUHJldmlvdXNBdHRhY2tIaXQgPSB0cnVlO1xuXHRcdFx0aWYgKHRoaXMucGxheWVyQm9hcmQuZGFtYWdlZFNoaXAgPT09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5wbGF5ZXJCb2FyZC5maXJzdEhpdENvb3JkID0gc2hvdDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5wbGF5ZXJCb2FyZC5sYXN0SGl0ID0gc2hvdDtcblx0XHRcdHRoaXMucGxheWVyQm9hcmQuZ2V0RGFtYWdlZFNoaXAoKTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMucGxheWVyQm9hcmQuaXNQcmV2aW91c0F0dGFja0hpdCA9IGZhbHNlO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0YXN5bmMgcGxheWVyU2hvdCgpIHtcblx0XHRjb25zdCBzaG90ID0gYXdhaXQgcGxheWVySHVtYW4oKTtcblx0XHR0aGlzLmNvbXB1dGVyQm9hcmQucmVjZWl2ZUF0dGFjayhzaG90KTtcblx0XHRwbGF5ZXJTaG90RE9NKHRoaXMuY29tcHV0ZXJCb2FyZCwgc2hvdCk7XG5cdFx0Y29uc3QgW3gsIHldID0gc2hvdDtcblx0XHRpZiAodGhpcy5jb21wdXRlckJvYXJkLm1hcFt4XVt5XSA9PT0gJ+KYkicpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGNoZWNrV2lubmVyKCkge1xuXHRcdGlmICh0aGlzLnBsYXllckJvYXJkLmNoZWNrQWxsU2hpcHNTdW5rKCkpIHtcblx0XHRcdHJldHVybiB0aGlzLmNvbXB1dGVyQm9hcmQucGxheWVyO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmNvbXB1dGVyQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMucGxheWVyQm9hcmQucGxheWVyO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG4iLCJpbXBvcnQge1NoaXB9IGZyb20gJy4vc2hpcCc7XG5cbmNvbnN0IFNISVBfQ0VMTCA9ICfimJAnO1xuY29uc3QgRU1QVFlfQ0VMTCA9ICdPJztcbmV4cG9ydCBjb25zdCBISVQgPSAn4piSJztcbmV4cG9ydCBjb25zdCBNSVNTID0gJ8K3JztcblxuZXhwb3J0IGNsYXNzIEdhbWVib2FyZCB7XG5cdGNvbnN0cnVjdG9yKHBsYXllcikge1xuXHRcdHRoaXMucGxheWVyID0gcGxheWVyO1xuXHR9XG5cblx0bGlzdE9mU2hpcHMgPSBuZXcgTWFwKCk7XG5cblx0bWFwID0gW1xuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRdO1xuXG5cdGNoZWNrQWxsU2hpcHNTdW5rKCkge1xuXHRcdGZvciAoY29uc3Qgc2hpcCBvZiB0aGlzLmxpc3RPZlNoaXBzLmtleXMoKSkge1xuXHRcdFx0aWYgKCFzaGlwLmlzU3VuaygpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHBsYWNlU2hpcChzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcikge1xuXHRcdGlmICghdGhpcy5fY2hlY2tDb25kaXRpb25zKHNoaXBMZW5ndGgsIHhDZWxsLCB5Q2VsbCwgZGlyKSkge1xuXHRcdFx0cmV0dXJuIGDQmNC30LzQtdC90LjRgtC1INCy0LLQvtC0ICR7c2hpcExlbmd0aH0gJHt4Q2VsbH0gJHt5Q2VsbH0gJHtkaXJ9YDtcblx0XHR9XG5cblx0XHRjb25zdCBzaGlwID0gbmV3IFNoaXAoc2hpcExlbmd0aCk7XG5cdFx0Y29uc3Qgc2hpcFBvc2l0aW9uID0gW107XG5cdFx0aWYgKGRpciA9PT0gJ3gnKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dGhpcy5tYXBbeENlbGxdW3lDZWxsICsgaV0gPSBTSElQX0NFTEw7XG5cdFx0XHRcdHNoaXBQb3NpdGlvbi5wdXNoKGAke3hDZWxsfSR7eUNlbGwgKyBpfWApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAneScpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR0aGlzLm1hcFt4Q2VsbCArIGldW3lDZWxsXSA9IFNISVBfQ0VMTDtcblx0XHRcdFx0c2hpcFBvc2l0aW9uLnB1c2goYCR7eENlbGwgKyBpfSR7eUNlbGx9YCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy4jZmlsbEFkamFjZW50Q2VsbHMoc2hpcExlbmd0aCwgeENlbGwsIHlDZWxsLCBkaXIpO1xuXG5cdFx0dGhpcy5saXN0T2ZTaGlwcy5zZXQoc2hpcCwgc2hpcFBvc2l0aW9uKTtcblx0fVxuXG5cdHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSkge1xuXHRcdGNvbnN0IFt4LCB5XSA9IFsuLi5TdHJpbmcoY29vcmRpbmF0ZSldO1xuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXHRcdHRoaXMubWFwW3hdW3ldID09PSBTSElQX0NFTExcblx0XHRcdD8gKHRoaXMuX2hpdFNoaXAoY29vcmRpbmF0ZSksICh0aGlzLm1hcFt4XVt5XSA9IEhJVCkpXG5cdFx0XHQ6ICh0aGlzLm1hcFt4XVt5XSA9IE1JU1MpO1xuXHR9XG5cblx0X2hpdFNoaXAoY29vcmRpbmF0ZSkge1xuXHRcdGxldCBoaXQgPSBmYWxzZTtcblx0XHRmb3IgKGNvbnN0IFtzaGlwLCBjb29yZHNdIG9mIHRoaXMubGlzdE9mU2hpcHMpIHtcblx0XHRcdGlmIChjb29yZHMuaW5jbHVkZXMoY29vcmRpbmF0ZSkpIHtcblx0XHRcdFx0c2hpcC5oaXQoKTtcblx0XHRcdFx0dGhpcy5pc1N1bmtTaGlwKHNoaXAsIGNvb3JkcywgY29vcmRpbmF0ZSk7XG5cdFx0XHRcdGhpdCA9IHRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBoaXQ7XG5cdH1cblxuXHQjZmlsbEFkamFjZW50Q2VsbHMoc2l6ZSwgeENlbGwsIHlDZWxsLCBkaXJlY3Rpb24pIHtcblx0XHRjb25zdCB4U3RhcnQgPSB4Q2VsbCAtIDE7XG5cdFx0Y29uc3QgeEVuZCA9IGRpcmVjdGlvbiA9PT0gJ3gnID8geENlbGwgKyAxIDogeENlbGwgKyBzaXplO1xuXHRcdGNvbnN0IHlTdGFydCA9IHlDZWxsIC0gMTtcblx0XHRjb25zdCB5RW5kID0gZGlyZWN0aW9uID09PSAneScgPyB5Q2VsbCArIDEgOiB5Q2VsbCArIHNpemU7XG5cblx0XHRmb3IgKGxldCB4ID0geFN0YXJ0OyB4IDw9IHhFbmQ7IHgrKykge1xuXHRcdFx0Zm9yIChsZXQgeSA9IHlTdGFydDsgeSA8PSB5RW5kOyB5KyspIHtcblx0XHRcdFx0aWYgKHggPj0gMCAmJiB4IDwgdGhpcy5tYXAubGVuZ3RoICYmIHkgPj0gMCAmJiB5IDwgdGhpcy5tYXAubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dGhpcy5tYXBbeF1beV0gPVxuXHRcdFx0XHRcdFx0dGhpcy5tYXBbeF1beV0gPT09IFNISVBfQ0VMTCA/IFNISVBfQ0VMTCA6IEVNUFRZX0NFTEw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRfY2hlY2tDb25kaXRpb25zKHNoaXBMZW5ndGgsIHhDZWxsLCB5Q2VsbCwgZGlyKSB7XG5cdFx0aWYgKHRoaXMuI2lzQ29ycmVjdENvb3JkaW5hdGUoc2hpcExlbmd0aCwgeENlbGwsIHlDZWxsLCBkaXIpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubGlzdE9mU2hpcHMuc2l6ZSAmJiB0aGlzLiNpc1NoaXBDcm9zc2luZyhgJHt4Q2VsbH0ke3lDZWxsfWApKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0dGhpcy5saXN0T2ZTaGlwcy5zaXplICYmXG5cdFx0XHR0aGlzLiNpc0FkamFjZW50Q3Jvc3Npbmcoc2hpcExlbmd0aCwgeENlbGwsIHlDZWxsLCBkaXIpXG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQjaXNDb3JyZWN0Q29vcmRpbmF0ZShsZW5ndGgsIHgsIHksIGRpcikge1xuXHRcdHJldHVybiAhKGRpciA9PT0gJ3gnXG5cdFx0XHQ/IGxlbmd0aCArIHkgPD0gdGhpcy5tYXAubGVuZ3RoICYmIHggPCB0aGlzLm1hcC5sZW5ndGhcblx0XHRcdDogeSA8IHRoaXMubWFwLmxlbmd0aCAmJiBsZW5ndGggKyB4IDw9IHRoaXMubWFwLmxlbmd0aCk7XG5cdH1cblxuXHQjaXNTaGlwQ3Jvc3NpbmcgPSAoY2VsbCkgPT5cblx0XHRbLi4udGhpcy5saXN0T2ZTaGlwc10uc29tZSgoWywgcG9zaXRpb25dKSA9PiBwb3NpdGlvbi5pbmNsdWRlcyhjZWxsKSk7XG5cblx0I2lzQWRqYWNlbnRDcm9zc2luZyhzaXplLCB4LCB5LCBkaXIpIHtcblx0XHRpZiAodGhpcy5tYXBbeF1beV0gPT09IEVNUFRZX0NFTEwpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGlmIChkaXIgPT09ICd4JyAmJiBzaXplID4gMSkge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBzaXplOyBpKyspIHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMubWFwW3hdW3kgKyBpXSA9PT0gU0hJUF9DRUxMIHx8XG5cdFx0XHRcdFx0dGhpcy5tYXBbeF1beSArIGldID09PSBFTVBUWV9DRUxMXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChkaXIgPT09ICd5JyAmJiBzaXplID4gMSkge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBzaXplOyBpKyspIHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMubWFwW3ggKyBpXVt5XSA9PT0gU0hJUF9DRUxMIHx8XG5cdFx0XHRcdFx0dGhpcy5tYXBbeCArIGldW3ldID09PSBFTVBUWV9DRUxMXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZmlsbENlbGxzKHNoaXBDb29yZHMsIG51bWJlckRlc2spIHtcblx0XHRmb3IgKGNvbnN0IGNvb3Igb2Ygc2hpcENvb3Jkcykge1xuXHRcdFx0Y29uc3QgW3gsIHldID0gY29vcjtcblx0XHRcdHRoaXMuZmlsbFNpbmdsZUNlbGwoTnVtYmVyKHgpLCBOdW1iZXIoeSksIG51bWJlckRlc2spO1xuXHRcdH1cblx0fVxuXG5cdGZpbGxTaW5nbGVDZWxsKHgsIHksIG51bWJlckRlc2spIHtcblx0XHRsZXQgY2VsbDtcblx0XHRjb25zdCBTSVpFID0gdGhpcy5tYXAubGVuZ3RoIC0gMTtcblx0XHRjb25zdCBvZmZzZXRzID0gWy0xLCAwLCAxXTtcblx0XHRmb3IgKGNvbnN0IGR4IG9mIG9mZnNldHMpIHtcblx0XHRcdGZvciAoY29uc3QgZHkgb2Ygb2Zmc2V0cykge1xuXHRcdFx0XHRpZiAoZHggPT09IDAgJiYgZHkgPT09IDApIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG5ld1ggPSB4ICsgZHg7XG5cdFx0XHRcdGNvbnN0IG5ld1kgPSB5ICsgZHk7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRuZXdYID49IDAgJiZcblx0XHRcdFx0XHRuZXdYIDw9IFNJWkUgJiZcblx0XHRcdFx0XHRuZXdZID49IDAgJiZcblx0XHRcdFx0XHRuZXdZIDw9IFNJWkUgJiZcblx0XHRcdFx0XHR0aGlzLm1hcFtuZXdYXVtuZXdZXSA9PT0gRU1QVFlfQ0VMTFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRpZiAobnVtYmVyRGVzayA9PT0gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5tYXBbbmV3WF1bbmV3WV0gPSBNSVNTO1xuXHRcdFx0XHRcdFx0Y29uc3QgY29vciA9IHRoaXMucG9zc2libGVTaG90cy5pbmRleE9mKGAke25ld1h9JHtuZXdZfWApO1xuXHRcdFx0XHRcdFx0dGhpcy5wb3NzaWJsZVNob3RzLnNwbGljZShjb29yLCAxKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgY2VsbC0ke25ld1h9JHtuZXdZfWApW1xuXHRcdFx0XHRcdFx0bnVtYmVyRGVza1xuXHRcdFx0XHRcdF07XG5cdFx0XHRcdFx0Y2VsbC50ZXh0Q29udGVudCA9IE1JU1M7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFBsYXllckJvYXJkIGV4dGVuZHMgR2FtZWJvYXJkIHtcblx0cG9zc2libGVTaG90cyA9IFtdO1xuXHRpc1ByZXZpb3VzQXR0YWNrSGl0ID0gZmFsc2U7XG5cdHByZXZpb3VzQ29vcmQgPSAnICc7XG5cdGZpcnN0SGl0Q29vcmQgPSAnICc7XG5cdGRhbWFnZWRTaGlwID0gbnVsbDtcblx0bGFzdEhpdCA9ICcgJztcblxuXHRjb25zdHJ1Y3RvcihwbGF5ZXIpIHtcblx0XHRzdXBlcihwbGF5ZXIpO1xuXHRcdHRoaXMuZmlsbFBvc3NpYmxlU2hvdHMoKTtcblx0fVxuXG5cdGdldERhbWFnZWRTaGlwKCkge1xuXHRcdGZvciAoY29uc3QgW3NoaXAsIGNvb3Jkc10gb2YgdGhpcy5saXN0T2ZTaGlwcykge1xuXHRcdFx0aWYgKGNvb3Jkcy5pbmNsdWRlcyh0aGlzLnByZXZpb3VzQ29vcmQpICYmICFzaGlwLmlzU3VuaygpKSB7XG5cdFx0XHRcdHRoaXMuZGFtYWdlZFNoaXAgPSBzaGlwO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fSBlbHNlIGlmIChjb29yZHMuaW5jbHVkZXModGhpcy5maXJzdEhpdENvb3JkKSAmJiBzaGlwLmlzU3VuaygpKSB7XG5cdFx0XHRcdHRoaXMuZGFtYWdlZFNoaXAgPSBudWxsO1xuXHRcdFx0XHR0aGlzLmZpcnN0SGl0Q29vcmQgPSAnICc7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZmlsbFBvc3NpYmxlU2hvdHMoKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcblx0XHRcdFx0dGhpcy5wb3NzaWJsZVNob3RzLnB1c2goYCR7aX0ke2p9YCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aXNTdW5rU2hpcChzaGlwLCBjb29yZHMsIGhpdCkge1xuXHRcdGNvbnN0IFt4LCB5XSA9IGhpdDtcblx0XHRsZXQgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKVswXTtcblx0XHRjZWxsLnN0eWxlLmNvbG9yID0gc2hpcC5pc1N1bmsoKSA/ICdyZWQnIDogJ3B1cnBsZSc7XG5cdFx0aWYgKHNoaXAuaXNTdW5rKCkpIHtcblx0XHRcdHRoaXMuZmlsbENlbGxzKGNvb3JkcywgMCk7XG5cdFx0XHRmb3IgKGNvbnN0IGNvb3Igb2YgY29vcmRzKSB7XG5cdFx0XHRcdGNvbnN0IFt4LCB5XSA9IGNvb3I7XG5cdFx0XHRcdGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7eH0ke3l9YClbMF07XG5cdFx0XHRcdGNlbGwuc3R5bGUuY29sb3IgPSAncmVkJztcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbXB1dGVyQm9hcmQgZXh0ZW5kcyBHYW1lYm9hcmQge1xuXHRoaWRkZW5NYXAgPSBbXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdF07XG5cblx0cmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG5cdFx0Y29uc3QgW3gsIHldID0gWy4uLlN0cmluZyhjb29yZGluYXRlKV07XG5cdFx0aWYgKHRoaXMubWFwW3hdW3ldID09PSBTSElQX0NFTEwpIHtcblx0XHRcdHRoaXMuX2hpdFNoaXAoY29vcmRpbmF0ZSk7XG5cdFx0XHR0aGlzLm1hcFt4XVt5XSA9IEhJVDtcblx0XHRcdHRoaXMuaGlkZGVuTWFwW3hdW3ldID0gSElUO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm1hcFt4XVt5XSA9IE1JU1M7XG5cdFx0XHR0aGlzLmhpZGRlbk1hcFt4XVt5XSA9IE1JU1M7XG5cdFx0fVxuXHR9XG5cblx0aXNTdW5rU2hpcChzaGlwLCBjb29yZHMsIGhpdCkge1xuXHRcdGNvbnN0IFt4LCB5XSA9IGhpdDtcblx0XHRsZXQgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKVsxXTtcblx0XHRjZWxsLnN0eWxlLmNvbG9yID0gc2hpcC5pc1N1bmsoKSA/ICdyZWQnIDogJ3B1cnBsZSc7XG5cdFx0aWYgKHNoaXAuaXNTdW5rKCkpIHtcblx0XHRcdHRoaXMuZmlsbENlbGxzKGNvb3JkcywgMSk7XG5cdFx0XHRmb3IgKGNvbnN0IGNvb3Igb2YgY29vcmRzKSB7XG5cdFx0XHRcdGNvbnN0IFt4LCB5XSA9IGNvb3I7XG5cdFx0XHRcdGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7eH0ke3l9YClbMV07XG5cdFx0XHRcdGNlbGwuc3R5bGUuY29sb3IgPSAncmVkJztcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsImNvbnN0IFJPV1MgPSAxMDtcbmNvbnN0IENPTFVNTlMgPSAxMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlU2hlbGwoKSB7XG5cdGNvbnN0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdO1xuXG5cdGNyZWF0ZUVsZW1lbnQoJ2gxJywgJ0JhdHRsZXNoaXAgZ2FtZScsICcnLCBib2R5KTtcblxuXHRjb25zdCBsYWJlbENvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnbGFiZWxDb250YWluZXInLCBib2R5KTtcblx0Y29uc3QgZGl2QnV0dG9uID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdkaXZCdXR0b24nLCBib2R5KTtcblx0Y3JlYXRlRWxlbWVudCgnYnV0dG9uJywgJ1N0YXJ0IEdhbWUnLCAnYnV0dG9uJywgZGl2QnV0dG9uKTtcblx0Y3JlYXRlRWxlbWVudCgnaDInLCAnUGxheWVyMSB3aW4nLCAnd2lubmVyTGFiZWwnLCBkaXZCdXR0b24pO1xuXHRjcmVhdGVFbGVtZW50KCdwJywgJ1lvdScsICdsYWJlbCcsIGxhYmVsQ29udGFpbmVyKTtcblx0Y3JlYXRlRWxlbWVudCgncCcsICdDb21wdXRlcicsICdsYWJlbCcsIGxhYmVsQ29udGFpbmVyKTtcblxuXHRjb25zdCBjb250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2NvbnRhaW5lcicsIGJvZHkpO1xuXHRjb25zdCBsZWZ0Q29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdsZWZ0Q29udGFpbmVyJywgY29udGFpbmVyKTtcblx0Y29uc3QgcmlnaHRDb250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ3JpZ2h0Q29udGFpbmVyJywgY29udGFpbmVyKTtcblxuXHRjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2Zha2UnLCBsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlTGV0dGVyTGluZShsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlTnVtYmVyTGluZShsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlQm9hcmQobGVmdENvbnRhaW5lcik7XG5cblx0Y3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdmYWtlJywgcmlnaHRDb250YWluZXIpO1xuXHRjcmVhdGVMZXR0ZXJMaW5lKHJpZ2h0Q29udGFpbmVyKTtcblx0Y3JlYXRlTnVtYmVyTGluZShyaWdodENvbnRhaW5lcik7XG5cdGNyZWF0ZUJvYXJkKHJpZ2h0Q29udGFpbmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuU2hlbGwoYm9hcmQsIG51bWJlcikge1xuXHRmb3IgKGNvbnN0IFtpLCByb3ddIG9mIGJvYXJkLm1hcC5lbnRyaWVzKCkpIHtcblx0XHRmb3IgKGNvbnN0IGogb2Ygcm93LmtleXMoKSkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHtpfSR7an1gKTtcblx0XHRcdGVsZW1lbnRbbnVtYmVyXS50ZXh0Q29udGVudCA9ICcnO1xuXHRcdFx0ZWxlbWVudFtudW1iZXJdLnN0eWxlLmNvbG9yID0gJ2JsYWNrJztcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxQbGF5ZXJCb2FyZHNET00oYm9hcmQpIHtcblx0Zm9yIChjb25zdCBbaSwgcm93XSBvZiBib2FyZC5tYXAuZW50cmllcygpKSB7XG5cdFx0Zm9yIChjb25zdCBbaiwgY2VsbF0gb2Ygcm93LmVudHJpZXMoKSkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHtpfSR7an1gKTtcblx0XHRcdGVsZW1lbnRbMF0udGV4dENvbnRlbnQgPSBjZWxsID09PSAnTycgfHwgY2VsbCA9PT0gJyAnID8gJyAnIDogY2VsbDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXllclNob3RET00oYm9hcmQsIHNob3QpIHtcblx0Y29uc3QgW3gsIHldID0gc2hvdDtcblx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKTtcblx0ZWxlbWVudFsxXS50ZXh0Q29udGVudCA9IGJvYXJkLm1hcFt4XVt5XTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCB0ZXh0LCBjbGFzc05hbWUsIHBhcmVudCkge1xuXHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblx0ZWxlbWVudC50ZXh0Q29udGVudCA9IHRleHQ7XG5cdGlmIChjbGFzc05hbWUpIHtcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcblx0fVxuXG5cdHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcblx0cmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKHBhcmVudCkge1xuXHRjb25zdCBib2FyZCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnYm9hcmQnLCBwYXJlbnQpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IFJPV1M7IGkrKykge1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgQ09MVU1OUzsgaisrKSB7XG5cdFx0XHRjb25zdCBjZWxsID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdjZWxsJywgYm9hcmQpO1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKGBjZWxsLSR7aX0ke2p9YCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGJvYXJkO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOdW1iZXJMaW5lKHBhcmVudCkge1xuXHRjb25zdCBudW1iZXJMaW5lID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdudW1iZXJMaW5lJywgcGFyZW50KTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBST1dTOyBpKyspIHtcblx0XHRjcmVhdGVFbGVtZW50KCdkaXYnLCBpICsgMSwgJ251bWJlcicsIG51bWJlckxpbmUpO1xuXHR9XG5cblx0cmV0dXJuIG51bWJlckxpbmU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxldHRlckxpbmUocGFyZW50KSB7XG5cdGNvbnN0IGxldHRlckxpbmUgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2xldHRlckxpbmUnLCBwYXJlbnQpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IENPTFVNTlM7IGkrKykge1xuXHRcdGNyZWF0ZUVsZW1lbnQoJ2RpdicsIFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSwgJ2xldHRlcicsIGxldHRlckxpbmUpO1xuXHR9XG5cblx0cmV0dXJuIGxldHRlckxpbmU7XG59XG4iLCJpbXBvcnQge01JU1MsIEhJVH0gZnJvbSAnLi9nYW1lYm9hcmQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGxheWVySHVtYW4oKSB7XG5cdHN0YXJ0TGlzdGVuaW5nUGxheWVyVHVybigpO1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmIChzaG90UGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHJlc29sdmUoc2hvdFBsYXllcik7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXHRcdFx0XHRzaG90UGxheWVyID0gbnVsbDtcblx0XHRcdH1cblx0XHR9LCAxMDApO1xuXHR9KTtcbn1cblxubGV0IHNob3RQbGF5ZXIgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gcGxheWVyQ29tcHV0ZXIoYm9hcmQpIHtcblx0bGV0IHNob3Q7XG5cdGNvbnN0IHNpemUgPSBib2FyZC5tYXAubGVuZ3RoIC0gMTtcblx0aWYgKGJvYXJkLmlzUHJldmlvdXNBdHRhY2tIaXQgfHwgYm9hcmQuZGFtYWdlZFNoaXAgIT09IG51bGwpIHtcblx0XHRsZXQgW3gsIHldID0gYm9hcmQubGFzdEhpdDtcblx0XHR4ID0gTnVtYmVyKHgpO1xuXHRcdHkgPSBOdW1iZXIoeSk7XG5cblx0XHRjb25zdCBjb25kaXRpb25zID0gW1xuXHRcdFx0KHgsIHkpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHkgPiAwICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3hdW3kgLSAxXSAhPT0gTUlTUyAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4XVt5IC0gMV0gIT09IEhJVCAmJlxuXHRcdFx0XHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihgJHt4fSR7eSAtIDF9YCkgIT09IC0xXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiBgJHt4fSR7eSAtIDF9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCh4LCB5KSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR4ID4gMCAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4IC0gMV1beV0gIT09IE1JU1MgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeCAtIDFdW3ldICE9PSBISVQgJiZcblx0XHRcdFx0XHRib2FyZC5wb3NzaWJsZVNob3RzLmluZGV4T2YoYCR7eCAtIDF9JHt5fWApICE9PSAtMVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gYCR7eCAtIDF9JHt5fWA7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQoeCwgeSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0eSA8IHNpemUgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeF1beSArIDFdICE9PSBNSVNTICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3hdW3kgKyAxXSAhPT0gSElUICYmXG5cdFx0XHRcdFx0Ym9hcmQucG9zc2libGVTaG90cy5pbmRleE9mKGAke3h9JHt5ICsgMX1gKSAhPT0gLTFcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGAke3h9JHt5ICsgMX1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0KHgsIHkpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHggPCBzaXplICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3ggKyAxXVt5XSAhPT0gTUlTUyAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4ICsgMV1beV0gIT09IEhJVCAmJlxuXHRcdFx0XHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihgJHt4ICsgMX0ke3l9YCkgIT09IC0xXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiBgJHt4ICsgMX0ke3l9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRdO1xuXG5cdFx0Y29uc3Qgc2h1ZmZsZSA9IGZ1bmN0aW9uIChhcnJheSkge1xuXHRcdFx0bGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcblx0XHRcdGxldCByYW5kb21JbmRleDtcblxuXHRcdFx0d2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuXHRcdFx0XHRyYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG5cdFx0XHRcdGN1cnJlbnRJbmRleC0tO1xuXG5cdFx0XHRcdFthcnJheVtjdXJyZW50SW5kZXhdLCBhcnJheVtyYW5kb21JbmRleF1dID0gW1xuXHRcdFx0XHRcdGFycmF5W3JhbmRvbUluZGV4XSxcblx0XHRcdFx0XHRhcnJheVtjdXJyZW50SW5kZXhdLFxuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fTtcblxuXHRcdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIHNodWZmbGUoY29uZGl0aW9ucykpIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGNvbmRpdGlvbih4LCB5KTtcblxuXHRcdFx0aWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHNob3QgPSByZXN1bHQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzaG90ID09PSB1bmRlZmluZWQgJiYgYm9hcmQuZGFtYWdlZFNoaXAgIT09IG51bGwpIHtcblx0XHRcdGxldCBbeFMsIHlTXSA9IGJvYXJkLmZpcnN0SGl0Q29vcmQ7XG5cdFx0XHR4UyA9IE51bWJlcih4Uyk7XG5cdFx0XHR5UyA9IE51bWJlcih5Uyk7XG5cblx0XHRcdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIHNodWZmbGUoY29uZGl0aW9ucykpIHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gY29uZGl0aW9uKHhTLCB5Uyk7XG5cdFx0XHRcdGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHNob3QgPSByZXN1bHQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc2hvdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBib2FyZC5wb3NzaWJsZVNob3RzLmxlbmd0aCk7XG5cdFx0XHRzaG90ID0gYm9hcmQucG9zc2libGVTaG90c1tyYW5kb21dO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluZGV4ID0gYm9hcmQucG9zc2libGVTaG90cy5pbmRleE9mKHNob3QpO1xuXHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuc3BsaWNlKGluZGV4LCAxKTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJvYXJkLnBvc3NpYmxlU2hvdHMubGVuZ3RoKTtcblx0XHRzaG90ID0gYm9hcmQucG9zc2libGVTaG90c1tyYW5kb21JbmRleF07XG5cdFx0Ym9hcmQucG9zc2libGVTaG90cy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuXHR9XG5cblx0Ym9hcmQucHJldmlvdXNDb29yZCA9IHNob3Q7XG5cdHJldHVybiBzaG90O1xufVxuXG5mdW5jdGlvbiBzdGFydExpc3RlbmluZ1BsYXllclR1cm4oKSB7XG5cdGNvbnN0IGZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9hcmQnKVsxXTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgYmFja2xpZ2h0KTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCByZXNldCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZXIoZSkge1xuXHRjb25zdCBmaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvYXJkJylbMV07XG5cdGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBlLnRhcmdldC50ZXh0Q29udGVudCA9PT0gJycpIHtcblx0XHRzaG90UGxheWVyID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdLnNsaWNlKDUpO1xuXHRcdGZpZWxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gYmFja2xpZ2h0KGUpIHtcblx0aWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKSB7XG5cdFx0ZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEuMDUpJztcblx0XHRlLnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYigyNDUsIDI0NSwgMjQ1KSc7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVzZXQoZSkge1xuXHRpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykpIHtcblx0XHRlLnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG5cdFx0ZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICd3aGl0ZSc7XG5cdH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTaGlwIHtcblx0Y29uc3RydWN0b3IobGVuZ3RoKSB7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0dGhpcy5oaXRzID0gMDtcblx0fVxuXG5cdGhpdCgpIHtcblx0XHR0aGlzLmhpdHMrKztcblx0fVxuXG5cdGlzU3VuaygpIHtcblx0XHRyZXR1cm4gdGhpcy5sZW5ndGggPT09IHRoaXMuaGl0cztcblx0fVxufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xufVxuXG5ib2R5IHtcbiAgYmFja2dyb3VuZDogI2Y1ZjVkYztcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmJvZHkgaDEge1xuICBmb250LWZhbWlseTogXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2U7XG4gIGZvbnQtc2l6ZTogM3JlbTtcbiAgY29sb3I6IGJsdWU7XG4gIG1hcmdpbjogMXJlbSAwO1xufVxuXG4ubGFiZWxDb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgd2lkdGg6IDgwdnc7XG4gIGdhcDogNXJlbTtcbn1cbi5sYWJlbENvbnRhaW5lciAubGFiZWwge1xuICBmb250LXNpemU6IDJyZW07XG4gIGZvbnQtZmFtaWx5OiBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZTtcbiAgY29sb3I6ICM0ZDRkNGQ7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB3aWR0aDogMjV2aDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uZGl2QnV0dG9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxcmVtO1xufVxuLmRpdkJ1dHRvbiAuYnV0dG9uIHtcbiAgZm9udC1zaXplOiAycmVtO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDc3LCA3NywgNzcsIDAuNTY4NjI3NDUxKTtcbn1cbi5kaXZCdXR0b24gLndpbm5lckxhYmVsIHtcbiAgY29sb3I6ICMxMTVmMTM7XG4gIGZvbnQtc2l6ZTogMnJlbTtcbiAgaGVpZ2h0OiAycmVtO1xuICBtYXJnaW4tYm90dG9tOiAycmVtO1xufVxuXG4uY29udGFpbmVyIHtcbiAgaGVpZ2h0OiBhdXRvO1xuICB3aWR0aDogNzB2dztcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZ2FwOiAzcmVtO1xufVxuLmNvbnRhaW5lciAubGVmdENvbnRhaW5lcixcbi5jb250YWluZXIgLnJpZ2h0Q29udGFpbmVyIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxMHB4IDFmcjtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxMHB4IDFmcjtcbiAgZ2FwOiAxcmVtO1xuICBmbGV4OiAxO1xufVxuXG4uYm9hcmQge1xuICBhc3BlY3QtcmF0aW86IDEvMTtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xuICBncmlkLWF1dG8tZmxvdzogZGVuc2U7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IDJweCBzb2xpZCBibHVlO1xufVxuLmJvYXJkIGRpdiB7XG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsdWU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmb250LXNpemU6IDN2dztcbiAgaGVpZ2h0OiBhdXRvO1xuICB3aWR0aDogYXV0bztcbiAgbWluLWhlaWdodDogMDtcbiAgbWluLXdpZHRoOiAwO1xufVxuXG4ubGV0dGVyTGluZSxcbi5udW1iZXJMaW5lIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZm9udC13ZWlnaHQ6IDkwMDtcbiAgZm9udC1zaXplOiAycmVtO1xuICBjb2xvcjogYmx1ZTtcbn1cblxuLmxldHRlckxpbmUge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xufVxuXG4ubnVtYmVyTGluZSB7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4ubGV0dGVyLFxuLm51bWJlciB7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBoZWlnaHQ6IGF1dG87XG4gIHdpZHRoOiBhdXRvO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTEwMHB4KSB7XG4gIC5jb250YWluZXIge1xuICAgIHdpZHRoOiA5NXZ3O1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogODEwcHgpIHtcbiAgaDEge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxuICAuY29udGFpbmVyIHtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XG4gICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gIH1cbiAgLmJvYXJkIGRpdiB7XG4gICAgZm9udC1zaXplOiA3dnc7XG4gIH1cbn0vKiMgc291cmNlTWFwcGluZ1VSTD1zdHlsZS5jc3MubWFwICovYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuc2Nzc1wiLFwid2VicGFjazovLy4vZGlzdC9jc3Mvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0MsU0FBQTtFQUNBLFVBQUE7RUFDQSx5QkFBQTtFQUVBLHNCQUFBO0VBRUEsaUJBQUE7QUNDRDs7QURZQTtFQUNDLG1CQVhlO0VBWWYsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUNURDtBRFdDO0VBQ0MsOENBWks7RUFhTCxlQVpnQjtFQWFoQixXQWxCYTtFQW1CYixjQUFBO0FDVEY7O0FEYUE7RUFDQyxhQUFBO0VBQ0EsNkJBQUE7RUFDQSxXQUFBO0VBQ0EsU0FBQTtBQ1ZEO0FEWUM7RUFDQyxlQXhCZTtFQXlCZiw4Q0EzQks7RUE0QkwsY0EvQlk7RUFnQ1osaUJBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7QUNWRjs7QURjQTtFQUNDLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtBQ1hEO0FEYUM7RUFDQyxlQXhDZTtFQXlDZixtQkFBQTtFQUNBLCtDQTlDYTtBQ21DZjtBRGNDO0VBQ0MsY0FqRGE7RUFrRGIsZUEvQ2U7RUFnRGYsWUFoRGU7RUFpRGYsbUJBakRlO0FDcUNqQjs7QURnQkE7RUFDQyxZQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSw4QkFBQTtFQUNBLHVCQUFBO0VBQ0EsU0FBQTtBQ2JEO0FEZUM7O0VBRUMsYUFBQTtFQUNBLCtCQUFBO0VBQ0EsNEJBQUE7RUFDQSxTQUFBO0VBQ0EsT0FBQTtBQ2JGOztBRGlCQTtFQUNDLGlCQUFBO0VBQ0EsYUFBQTtFQUNBLHNDQUFBO0VBQ0EsbUNBQUE7RUFDQSxxQkFBQTtFQUNBLHVCQUFBO0VBQ0Esc0JBQUE7QUNkRDtBRGdCQztFQUNDLHNCQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxjQUFBO0VBRUEsWUFBQTtFQUNBLFdBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtBQ2ZGOztBRG1CQTs7RUFFQyxhQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQWxHZ0I7RUFtR2hCLFdBekdjO0FDeUZmOztBRG1CQTtFQUNDLDZCQUFBO0VBQ0EscUJBQUE7QUNoQkQ7O0FEbUJBO0VBQ0Msc0JBQUE7RUFDQSw2QkFBQTtFQUNBLG1CQUFBO0FDaEJEOztBRG1CQTs7RUFFQyx5QkFBQTtFQUVBLHNCQUFBO0VBRUEsaUJBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtBQ2hCRDs7QURtQkE7RUFDQztJQUNDLFdBQUE7RUNoQkE7QUFDRjtBRG1CQTtFQUtDO0lBQ0Msa0JBQUE7RUNyQkE7RUR3QkQ7SUFDQyw4QkFBQTtJQUNBLG9CQUFBO0VDdEJBO0VEeUJEO0lBQ0MsY0FBQTtFQ3ZCQTtBQUNGLENBQUEsb0NBQUFcIixcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4uL2Rpc3QvY3NzL3N0eWxlLmNzcyc7XG5pbXBvcnQge0dhbWV9IGZyb20gJy4vZ2FtZSc7XG5pbXBvcnQge2dlbmVyYXRlU2hlbGwsIGNsZWFuU2hlbGx9IGZyb20gJy4vZ2VuZXJhdGVET00nO1xuXG5nZW5lcmF0ZVNoZWxsKCk7XG5jb25zdCBuZXdHYW1lID0gbmV3IEdhbWUoJ1BsYXllcicsICdDb21wdXRlcicpO1xuY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uJylbMF07XG5uZXdHYW1lLnN0YXJ0KCk7XG5cbmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWFsZXJ0XG5cdGNvbnN0IGFzayA9IGNvbmZpcm0oJ1N0YXJ0IGEgbmV3IGdhbWU/Jyk7XG5cdGlmIChhc2spIHtcblx0XHRjbGVhblNoZWxsKG5ld0dhbWUuY29tcHV0ZXJCb2FyZCwgMSk7XG5cdFx0Y2xlYW5TaGVsbChuZXdHYW1lLnBsYXllckJvYXJkLCAwKTtcblx0XHRuZXdHYW1lLnJlc2V0KCk7XG5cdFx0bmV3R2FtZS5zdGFydCgpO1xuXHR9XG59KTtcbiJdLCJuYW1lcyI6WyJDb21wdXRlckJvYXJkIiwiUGxheWVyQm9hcmQiLCJwbGF5ZXJIdW1hbiIsInBsYXllckNvbXB1dGVyIiwiZmlsbFBsYXllckJvYXJkc0RPTSIsInBsYXllclNob3RET00iLCJERUxBWSIsIkdhbWUiLCJjb25zdHJ1Y3RvciIsInBsYXllcjEiLCJwbGF5ZXIyIiwicGxheWVyQm9hcmQiLCJjb21wdXRlckJvYXJkIiwiZmlsbEJvYXJkUGxheWVyIiwiZmlsbEJvYXJkQ29tcHV0ZXIiLCJyZXNldCIsInBsYXllciIsIndpbmVyTGFiZWwiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJ0ZXh0Q29udGVudCIsInN0YXJ0IiwidHVybiIsIndpbm5lciIsImhpdCIsInBsYXllclNob3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJjb21wdXRlclNob3QiLCJjaGVja1dpbm5lciIsInJhbmRvbUdlbmVyYXRpb24iLCIjcmFuZG9tR2VuZXJhdGlvbiIsImJvYXJkIiwic2hpcHNMZW5ndGgiLCJkaXIiLCJsZW5ndGgiLCJzaGlwIiwicGxhY2VkIiwiYXR0ZW1wdHMiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInBvc3NpYmxlU2hvdHMiLCJjb29yZGluYXRlIiwieCIsInkiLCJyYW5kb21EaXIiLCJfY2hlY2tDb25kaXRpb25zIiwiTnVtYmVyIiwicGxhY2VTaGlwIiwic2hpZnQiLCJzaG90IiwicmVjZWl2ZUF0dGFjayIsIm1hcCIsImlzUHJldmlvdXNBdHRhY2tIaXQiLCJkYW1hZ2VkU2hpcCIsImZpcnN0SGl0Q29vcmQiLCJsYXN0SGl0IiwiZ2V0RGFtYWdlZFNoaXAiLCJjaGVja0FsbFNoaXBzU3VuayIsIlNoaXAiLCJTSElQX0NFTEwiLCJFTVBUWV9DRUxMIiwiSElUIiwiTUlTUyIsIkdhbWVib2FyZCIsImxpc3RPZlNoaXBzIiwiTWFwIiwia2V5cyIsImlzU3VuayIsInNoaXBMZW5ndGgiLCJ4Q2VsbCIsInlDZWxsIiwic2hpcFBvc2l0aW9uIiwiaSIsInB1c2giLCJmaWxsQWRqYWNlbnRDZWxscyIsInNldCIsIlN0cmluZyIsIl9oaXRTaGlwIiwiY29vcmRzIiwiaW5jbHVkZXMiLCJpc1N1bmtTaGlwIiwiI2ZpbGxBZGphY2VudENlbGxzIiwic2l6ZSIsImRpcmVjdGlvbiIsInhTdGFydCIsInhFbmQiLCJ5U3RhcnQiLCJ5RW5kIiwiaXNDb3JyZWN0Q29vcmRpbmF0ZSIsImlzU2hpcENyb3NzaW5nIiwiaXNBZGphY2VudENyb3NzaW5nIiwiI2lzQ29ycmVjdENvb3JkaW5hdGUiLCJjZWxsIiwic29tZSIsInBvc2l0aW9uIiwiI2lzQWRqYWNlbnRDcm9zc2luZyIsImZpbGxDZWxscyIsInNoaXBDb29yZHMiLCJudW1iZXJEZXNrIiwiY29vciIsImZpbGxTaW5nbGVDZWxsIiwiU0laRSIsIm9mZnNldHMiLCJkeCIsImR5IiwibmV3WCIsIm5ld1kiLCJpbmRleE9mIiwic3BsaWNlIiwicHJldmlvdXNDb29yZCIsImZpbGxQb3NzaWJsZVNob3RzIiwiaiIsInN0eWxlIiwiY29sb3IiLCJoaWRkZW5NYXAiLCJST1dTIiwiQ09MVU1OUyIsImdlbmVyYXRlU2hlbGwiLCJib2R5IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJjcmVhdGVFbGVtZW50IiwibGFiZWxDb250YWluZXIiLCJkaXZCdXR0b24iLCJjb250YWluZXIiLCJsZWZ0Q29udGFpbmVyIiwicmlnaHRDb250YWluZXIiLCJjcmVhdGVMZXR0ZXJMaW5lIiwiY3JlYXRlTnVtYmVyTGluZSIsImNyZWF0ZUJvYXJkIiwiY2xlYW5TaGVsbCIsIm51bWJlciIsInJvdyIsImVudHJpZXMiLCJlbGVtZW50IiwidHlwZSIsInRleHQiLCJjbGFzc05hbWUiLCJwYXJlbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsIm51bWJlckxpbmUiLCJsZXR0ZXJMaW5lIiwiZnJvbUNoYXJDb2RlIiwic3RhcnRMaXN0ZW5pbmdQbGF5ZXJUdXJuIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInNob3RQbGF5ZXIiLCJjbGVhckludGVydmFsIiwiY29uZGl0aW9ucyIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImNvbmRpdGlvbiIsInJlc3VsdCIsInVuZGVmaW5lZCIsInhTIiwieVMiLCJpbmRleCIsImZpZWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZXIiLCJiYWNrbGlnaHQiLCJlIiwidGFyZ2V0IiwiY29udGFpbnMiLCJzbGljZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ0cmFuc2Zvcm0iLCJiYWNrZ3JvdW5kIiwiaGl0cyIsIm5ld0dhbWUiLCJidXR0b24iLCJhc2siLCJjb25maXJtIl0sInNvdXJjZVJvb3QiOiIifQ==