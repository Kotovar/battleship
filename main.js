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
  createElement('h2', '', 'winnerLabel', divButton);
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

:root {
  --color-primary: #f5f5dc;
  --color-border: blue;
  --color-label: #4d4d4d;
  --color-button: #4d4d4d91;
  --color-winner: #115f13;
  --font: "Courier New", Courier, monospace;
  --font-size-large: 3rem;
  --font-size-main: 2rem;
  --font-size-small: 1rem;
}

body {
  background: var(--color-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
}
body h1 {
  font-family: var(--font);
  font-size: var(--font-size-large);
  color: var(--color-border);
  margin: 1rem 0;
}

.labelContainer {
  display: flex;
  justify-content: space-evenly;
  width: 80vw;
  gap: 5rem;
}
.labelContainer .label {
  font-size: var(--font-size-main);
  font-family: var(--font);
  color: var(--color-label);
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
  font-size: var(--font-size-main);
  border-radius: 10px;
  background-color: var(--color-button);
}
.divButton .winnerLabel {
  color: var(--color-winner);
  font-size: var(--font-size-main);
  height: var(--font-size-main);
  margin-bottom: var(--font-size-main);
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
  border: 2px solid var(--color-border);
}
.board div {
  border: 2px solid var(--color-border);
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
  font-size: var(--font-size-main);
  color: var(--color-border);
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
  :root {
    --font-size-large: 1.5rem;
    --font-size-main: 1rem;
    --font-size-small: 0.5rem;
  }
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
}
@media (max-width: 500px) {
  .container {
    width: 80vw;
    max-height: 80dvh;
  }
}/*# sourceMappingURL=style.css.map */`, "",{"version":3,"sources":["webpack://./src/style.scss","webpack://./dist/css/style.css"],"names":[],"mappings":"AAAA;EACC,SAAA;EACA,UAAA;EACA,yBAAA;EAEA,sBAAA;EAEA,iBAAA;ACCD;;ADEA;EACC,wBAAA;EACA,oBAAA;EACA,sBAAA;EACA,yBAAA;EACA,uBAAA;EACA,yCAAA;EACA,uBAAA;EACA,sBAAA;EACA,uBAAA;ACCD;;ADEA;EACC,gCAAA;EACA,aAAA;EACA,sBAAA;EACA,mBAAA;ACCD;ADCC;EACC,wBAAA;EACA,iCAAA;EACA,0BAAA;EACA,cAAA;ACCF;;ADGA;EACC,aAAA;EACA,6BAAA;EACA,WAAA;EACA,SAAA;ACAD;ADEC;EACC,gCAAA;EACA,wBAAA;EACA,yBAAA;EACA,iBAAA;EACA,WAAA;EACA,kBAAA;ACAF;;ADIA;EACC,aAAA;EACA,sBAAA;EACA,mBAAA;EACA,SAAA;ACDD;ADGC;EACC,gCAAA;EACA,mBAAA;EACA,qCAAA;ACDF;ADIC;EACC,0BAAA;EACA,gCAAA;EACA,6BAAA;EACA,oCAAA;ACFF;;ADMA;EACC,YAAA;EACA,WAAA;EACA,aAAA;EACA,8BAAA;EACA,uBAAA;EACA,SAAA;ACHD;ADKC;;EAEC,aAAA;EACA,+BAAA;EACA,4BAAA;EACA,SAAA;EACA,OAAA;ACHF;;ADOA;EACC,iBAAA;EACA,aAAA;EACA,sCAAA;EACA,mCAAA;EACA,qBAAA;EACA,uBAAA;EACA,qCAAA;ACJD;ADMC;EACC,qCAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,cAAA;EAEA,YAAA;EACA,WAAA;EACA,aAAA;EACA,YAAA;ACLF;;ADSA;;EAEC,aAAA;EACA,gBAAA;EACA,gCAAA;EACA,0BAAA;ACND;;ADSA;EACC,6BAAA;EACA,qBAAA;ACND;;ADSA;EACC,sBAAA;EACA,6BAAA;EACA,mBAAA;ACND;;ADSA;;EAEC,yBAAA;EAEA,sBAAA;EAEA,iBAAA;EACA,YAAA;EACA,WAAA;ACND;;ADSA;EACC;IACC,WAAA;ECNA;AACF;ADSA;EACC;IACC,yBAAA;IACA,sBAAA;IACA,yBAAA;ECPA;EDSD;IACC,kBAAA;ECPA;EDUD;IACC,8BAAA;IACA,oBAAA;ECRA;EDWD;IACC,cAAA;ECTA;AACF;ADYA;EACC;IACC,WAAA;IACA,iBAAA;ECVA;AACF,CAAA,oCAAA","sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUF1RDtBQUNGO0FBQ1k7QUFFakUsTUFBTU0sS0FBSyxHQUFHLEdBQUc7QUFFVixNQUFNQyxJQUFJLENBQUM7RUFDakJDLFdBQVdBLENBQUNDLE9BQU8sRUFBRUMsT0FBTyxFQUFFO0lBQzdCLElBQUksQ0FBQ0MsV0FBVyxHQUFHLElBQUlWLG1EQUFXLENBQUNRLE9BQU8sQ0FBQztJQUMzQyxJQUFJLENBQUNHLGFBQWEsR0FBRyxJQUFJWixxREFBYSxDQUFDVSxPQUFPLENBQUM7SUFDL0MsSUFBSSxDQUFDRyxlQUFlLENBQUMsQ0FBQztJQUN0QixJQUFJLENBQUNDLGlCQUFpQixDQUFDLENBQUM7SUFDeEJWLGlFQUFtQixDQUFDLElBQUksQ0FBQ08sV0FBVyxDQUFDO0VBQ3RDO0VBRUFJLEtBQUtBLENBQUEsRUFBRztJQUNQLElBQUksQ0FBQ0osV0FBVyxHQUFHLElBQUlWLG1EQUFXLENBQUMsSUFBSSxDQUFDVSxXQUFXLENBQUNLLE1BQU0sQ0FBQztJQUMzRCxJQUFJLENBQUNKLGFBQWEsR0FBRyxJQUFJWixxREFBYSxDQUFDLElBQUksQ0FBQ1ksYUFBYSxDQUFDSSxNQUFNLENBQUM7SUFDakUsSUFBSSxDQUFDSCxlQUFlLENBQUMsQ0FBQztJQUN0QixJQUFJLENBQUNDLGlCQUFpQixDQUFDLENBQUM7SUFDeEJWLGlFQUFtQixDQUFDLElBQUksQ0FBQ08sV0FBVyxDQUFDO0lBQ3JDLE1BQU1NLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEVGLFVBQVUsQ0FBQ0csV0FBVyxHQUFHLEVBQUU7RUFDNUI7RUFFQSxNQUFNQyxLQUFLQSxDQUFBLEVBQUc7SUFDYixJQUFJQyxJQUFJLEdBQUcsUUFBUTtJQUNuQixJQUFJQyxNQUFNLEdBQUcsSUFBSTtJQUNqQixPQUFPLENBQUNBLE1BQU0sRUFBRTtNQUNmLElBQUlELElBQUksS0FBSyxRQUFRLEVBQUU7UUFDdEI7UUFDQSxNQUFNRSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUNDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLElBQUlELEdBQUcsRUFBRTtVQUNSRixJQUFJLEdBQUcsVUFBVTtRQUNsQjtNQUNELENBQUMsTUFBTSxJQUFJQSxJQUFJLEtBQUssVUFBVSxFQUFFO1FBQy9CO1FBQ0EsTUFBTSxJQUFJSSxPQUFPLENBQUVDLE9BQU8sSUFBSztVQUM5QkMsVUFBVSxDQUFDRCxPQUFPLEVBQUVyQixLQUFLLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBQ0YsTUFBTWtCLEdBQUcsR0FBRyxJQUFJLENBQUNLLFlBQVksQ0FBQyxDQUFDO1FBRS9CLElBQUlMLEdBQUcsRUFBRTtVQUNSRixJQUFJLEdBQUcsUUFBUTtRQUNoQjtNQUNEO01BRUFDLE1BQU0sR0FBRyxJQUFJLENBQUNPLFdBQVcsQ0FBQyxDQUFDO0lBQzVCO0lBRUEsTUFBTWIsVUFBVSxHQUFHQyxRQUFRLENBQUNDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRUYsVUFBVSxDQUFDRyxXQUFXLEdBQUksR0FBRUcsTUFBTyxnQkFBZTtFQUNuRDtFQUVBVixlQUFlQSxDQUFBLEVBQUc7SUFDakIsSUFBSSxDQUFDLENBQUNrQixnQkFBZ0IsQ0FBQyxJQUFJLENBQUNwQixXQUFXLENBQUM7RUFDekM7RUFFQUcsaUJBQWlCQSxDQUFBLEVBQUc7SUFDbkIsSUFBSSxDQUFDLENBQUNpQixnQkFBZ0IsQ0FBQyxJQUFJLENBQUNuQixhQUFhLENBQUM7RUFDM0M7RUFFQSxDQUFDbUIsZ0JBQWdCQyxDQUFDQyxLQUFLLEVBQUU7SUFDeEIsTUFBTUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELE1BQU1DLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDdEIsT0FBT0QsV0FBVyxDQUFDRSxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQzlCLE1BQU1DLElBQUksR0FBR0gsV0FBVyxDQUFDLENBQUMsQ0FBQztNQUMzQixJQUFJSSxNQUFNLEdBQUcsS0FBSztNQUNsQixJQUFJQyxRQUFRLEdBQUcsQ0FBQztNQUNoQixPQUFPLENBQUNELE1BQU0sSUFBSUMsUUFBUSxHQUFHLEdBQUcsRUFBRTtRQUNqQyxNQUFNQyxXQUFXLEdBQUdDLElBQUksQ0FBQ0MsS0FBSyxDQUM3QkQsSUFBSSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQ2hDLFdBQVcsQ0FBQ2lDLGFBQWEsQ0FBQ1IsTUFDaEQsQ0FBQztRQUNELE1BQU1TLFVBQVUsR0FBRyxJQUFJLENBQUNsQyxXQUFXLENBQUNpQyxhQUFhLENBQUNKLFdBQVcsQ0FBQztRQUM5RCxNQUFNLENBQUNNLENBQUMsRUFBRUMsQ0FBQyxDQUFDLEdBQUdGLFVBQVU7UUFDekIsTUFBTUcsU0FBUyxHQUFHYixHQUFHLENBQUNNLElBQUksQ0FBQ0MsS0FBSyxDQUFDRCxJQUFJLENBQUNFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSVYsS0FBSyxDQUFDZ0IsZ0JBQWdCLENBQUNaLElBQUksRUFBRWEsTUFBTSxDQUFDSixDQUFDLENBQUMsRUFBRUksTUFBTSxDQUFDSCxDQUFDLENBQUMsRUFBRUMsU0FBUyxDQUFDLEVBQUU7VUFDbEVmLEtBQUssQ0FBQ2tCLFNBQVMsQ0FBQ2QsSUFBSSxFQUFFYSxNQUFNLENBQUNKLENBQUMsQ0FBQyxFQUFFSSxNQUFNLENBQUNILENBQUMsQ0FBQyxFQUFFQyxTQUFTLENBQUM7VUFDdERkLFdBQVcsQ0FBQ2tCLEtBQUssQ0FBQyxDQUFDO1VBQ25CZCxNQUFNLEdBQUcsSUFBSTtRQUNkO1FBRUFDLFFBQVEsRUFBRTtNQUNYO01BRUEsSUFBSSxDQUFDRCxNQUFNLEVBQUU7UUFDWjtNQUNEO0lBQ0Q7RUFDRDtFQUVBVCxZQUFZQSxDQUFBLEVBQUc7SUFDZCxNQUFNd0IsSUFBSSxHQUFHbEQsdURBQWMsQ0FBQyxJQUFJLENBQUNRLFdBQVcsQ0FBQztJQUM3QyxJQUFJLENBQUNBLFdBQVcsQ0FBQzJDLGFBQWEsQ0FBQ0QsSUFBSSxDQUFDO0lBQ3BDakQsaUVBQW1CLENBQUMsSUFBSSxDQUFDTyxXQUFXLENBQUM7SUFDckMsTUFBTSxDQUFDbUMsQ0FBQyxFQUFFQyxDQUFDLENBQUMsR0FBR00sSUFBSTtJQUNuQixJQUFJLElBQUksQ0FBQzFDLFdBQVcsQ0FBQzRDLEdBQUcsQ0FBQ1QsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtNQUN2QyxJQUFJLENBQUNwQyxXQUFXLENBQUM2QyxtQkFBbUIsR0FBRyxJQUFJO01BQzNDLElBQUksSUFBSSxDQUFDN0MsV0FBVyxDQUFDOEMsV0FBVyxLQUFLLElBQUksRUFBRTtRQUMxQyxJQUFJLENBQUM5QyxXQUFXLENBQUMrQyxhQUFhLEdBQUdMLElBQUk7TUFDdEM7TUFFQSxJQUFJLENBQUMxQyxXQUFXLENBQUNnRCxPQUFPLEdBQUdOLElBQUk7TUFDL0IsSUFBSSxDQUFDMUMsV0FBVyxDQUFDaUQsY0FBYyxDQUFDLENBQUM7TUFFakMsT0FBTyxLQUFLO0lBQ2I7SUFFQSxJQUFJLENBQUNqRCxXQUFXLENBQUM2QyxtQkFBbUIsR0FBRyxLQUFLO0lBQzVDLE9BQU8sSUFBSTtFQUNaO0VBRUEsTUFBTS9CLFVBQVVBLENBQUEsRUFBRztJQUNsQixNQUFNNEIsSUFBSSxHQUFHLE1BQU1uRCxvREFBVyxDQUFDLENBQUM7SUFDaEMsSUFBSSxDQUFDVSxhQUFhLENBQUMwQyxhQUFhLENBQUNELElBQUksQ0FBQztJQUN0Q2hELDJEQUFhLENBQUMsSUFBSSxDQUFDTyxhQUFhLEVBQUV5QyxJQUFJLENBQUM7SUFDdkMsTUFBTSxDQUFDUCxDQUFDLEVBQUVDLENBQUMsQ0FBQyxHQUFHTSxJQUFJO0lBQ25CLElBQUksSUFBSSxDQUFDekMsYUFBYSxDQUFDMkMsR0FBRyxDQUFDVCxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO01BQ3pDLE9BQU8sS0FBSztJQUNiO0lBRUEsT0FBTyxJQUFJO0VBQ1o7RUFFQWpCLFdBQVdBLENBQUEsRUFBRztJQUNiLElBQUksSUFBSSxDQUFDbkIsV0FBVyxDQUFDa0QsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO01BQ3pDLE9BQU8sSUFBSSxDQUFDakQsYUFBYSxDQUFDSSxNQUFNO0lBQ2pDO0lBRUEsSUFBSSxJQUFJLENBQUNKLGFBQWEsQ0FBQ2lELGlCQUFpQixDQUFDLENBQUMsRUFBRTtNQUMzQyxPQUFPLElBQUksQ0FBQ2xELFdBQVcsQ0FBQ0ssTUFBTTtJQUMvQjtJQUVBLE9BQU8sSUFBSTtFQUNaO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2STRCO0FBRTVCLE1BQU0rQyxTQUFTLEdBQUcsR0FBRztBQUNyQixNQUFNQyxVQUFVLEdBQUcsR0FBRztBQUNmLE1BQU1DLEdBQUcsR0FBRyxHQUFHO0FBQ2YsTUFBTUMsSUFBSSxHQUFHLEdBQUc7QUFFaEIsTUFBTUMsU0FBUyxDQUFDO0VBQ3RCM0QsV0FBV0EsQ0FBQ1EsTUFBTSxFQUFFO0lBQ25CLElBQUksQ0FBQ0EsTUFBTSxHQUFHQSxNQUFNO0VBQ3JCO0VBRUFvRCxXQUFXLEdBQUcsSUFBSUMsR0FBRyxDQUFDLENBQUM7RUFFdkJkLEdBQUcsR0FBRyxDQUNMLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQ2xEO0VBRURNLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ25CLEtBQUssTUFBTXhCLElBQUksSUFBSSxJQUFJLENBQUMrQixXQUFXLENBQUNFLElB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QUFTLENBQUM7RUFDNUNtRCxTQUFTLEdBQUcsQ0FDWCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxF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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsNENBQTRDLGtIQUFrSCxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFVBQVUsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxVQUFVLE1BQU0sS0FBSyxVQUFVLFdBQVcsVUFBVSxVQUFVLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxNQUFNLEtBQUssVUFBVSxXQUFXLFdBQVcsVUFBVSxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxVQUFVLEtBQUssTUFBTSxVQUFVLFdBQVcsV0FBVyxVQUFVLFVBQVUsTUFBTSxLQUFLLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsVUFBVSxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLE1BQU0sTUFBTSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsTUFBTSxLQUFLLEtBQUssVUFBVSxLQUFLLEtBQUssS0FBSyxLQUFLLFdBQVcs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Ozs7Ozs7O0FDQStCO0FBQ0g7QUFDNEI7QUFFeERyRCwyREFBYSxDQUFDLENBQUM7QUFDZixNQUFNc0QsT0FBTyxHQUFHLElBQUl4Syx1Q0FBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUM7QUFDOUMsTUFBTXlLLE1BQU0sR0FBRzlKLFFBQVEsQ0FBQ0Msc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNENEosT0FBTyxDQUFDMUosS0FBSyxDQUFDLENBQUM7QUFFZjJKLE1BQU0sQ0FBQ1osZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07RUFDdEM7RUFDQSxNQUFNYSxHQUFHLEdBQUdDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztFQUN4QyxJQUFJRCxHQUFHLEVBQUU7SUFDUjVDLHdEQUFVLENBQUMwQyxPQUFPLENBQUNuSyxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDeUgsd0RBQVUsQ0FBQzBDLE9BQU8sQ0FBQ3BLLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDbENvSyxPQUFPLENBQUNoSyxLQUFLLENBQUMsQ0FBQztJQUNmZ0ssT0FBTyxDQUFDMUosS0FBSyxDQUFDLENBQUM7RUFDaEI7QUFDRCxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vc3JjL2dlbmVyYXRlRE9NLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vZGlzdC9jc3Mvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vZGlzdC9jc3Mvc3R5bGUuY3NzP2YxNmUiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXB1dGVyQm9hcmQsIFBsYXllckJvYXJkfSBmcm9tICcuL2dhbWVib2FyZCc7XG5pbXBvcnQge3BsYXllckh1bWFuLCBwbGF5ZXJDb21wdXRlcn0gZnJvbSAnLi9wbGF5ZXInO1xuaW1wb3J0IHtmaWxsUGxheWVyQm9hcmRzRE9NLCBwbGF5ZXJTaG90RE9NfSBmcm9tICcuL2dlbmVyYXRlRE9NJztcblxuY29uc3QgREVMQVkgPSA4MDA7XG5cbmV4cG9ydCBjbGFzcyBHYW1lIHtcblx0Y29uc3RydWN0b3IocGxheWVyMSwgcGxheWVyMikge1xuXHRcdHRoaXMucGxheWVyQm9hcmQgPSBuZXcgUGxheWVyQm9hcmQocGxheWVyMSk7XG5cdFx0dGhpcy5jb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyQm9hcmQocGxheWVyMik7XG5cdFx0dGhpcy5maWxsQm9hcmRQbGF5ZXIoKTtcblx0XHR0aGlzLmZpbGxCb2FyZENvbXB1dGVyKCk7XG5cdFx0ZmlsbFBsYXllckJvYXJkc0RPTSh0aGlzLnBsYXllckJvYXJkKTtcblx0fVxuXG5cdHJlc2V0KCkge1xuXHRcdHRoaXMucGxheWVyQm9hcmQgPSBuZXcgUGxheWVyQm9hcmQodGhpcy5wbGF5ZXJCb2FyZC5wbGF5ZXIpO1xuXHRcdHRoaXMuY29tcHV0ZXJCb2FyZCA9IG5ldyBDb21wdXRlckJvYXJkKHRoaXMuY29tcHV0ZXJCb2FyZC5wbGF5ZXIpO1xuXHRcdHRoaXMuZmlsbEJvYXJkUGxheWVyKCk7XG5cdFx0dGhpcy5maWxsQm9hcmRDb21wdXRlcigpO1xuXHRcdGZpbGxQbGF5ZXJCb2FyZHNET00odGhpcy5wbGF5ZXJCb2FyZCk7XG5cdFx0Y29uc3Qgd2luZXJMYWJlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbm5lckxhYmVsJylbMF07XG5cdFx0d2luZXJMYWJlbC50ZXh0Q29udGVudCA9ICcnO1xuXHR9XG5cblx0YXN5bmMgc3RhcnQoKSB7XG5cdFx0bGV0IHR1cm4gPSAncGxheWVyJztcblx0XHRsZXQgd2lubmVyID0gbnVsbDtcblx0XHR3aGlsZSAoIXdpbm5lcikge1xuXHRcdFx0aWYgKHR1cm4gPT09ICdwbGF5ZXInKSB7XG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG5cdFx0XHRcdGNvbnN0IGhpdCA9IGF3YWl0IHRoaXMucGxheWVyU2hvdCgpO1xuXHRcdFx0XHRpZiAoaGl0KSB7XG5cdFx0XHRcdFx0dHVybiA9ICdjb21wdXRlcic7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodHVybiA9PT0gJ2NvbXB1dGVyJykge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuXHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQocmVzb2x2ZSwgREVMQVkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y29uc3QgaGl0ID0gdGhpcy5jb21wdXRlclNob3QoKTtcblxuXHRcdFx0XHRpZiAoaGl0KSB7XG5cdFx0XHRcdFx0dHVybiA9ICdwbGF5ZXInO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHdpbm5lciA9IHRoaXMuY2hlY2tXaW5uZXIoKTtcblx0XHR9XG5cblx0XHRjb25zdCB3aW5lckxhYmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2lubmVyTGFiZWwnKVswXTtcblx0XHR3aW5lckxhYmVsLnRleHRDb250ZW50ID0gYCR7d2lubmVyfSB3b24gdGhlIGdhbWUhYDtcblx0fVxuXG5cdGZpbGxCb2FyZFBsYXllcigpIHtcblx0XHR0aGlzLiNyYW5kb21HZW5lcmF0aW9uKHRoaXMucGxheWVyQm9hcmQpO1xuXHR9XG5cblx0ZmlsbEJvYXJkQ29tcHV0ZXIoKSB7XG5cdFx0dGhpcy4jcmFuZG9tR2VuZXJhdGlvbih0aGlzLmNvbXB1dGVyQm9hcmQpO1xuXHR9XG5cblx0I3JhbmRvbUdlbmVyYXRpb24oYm9hcmQpIHtcblx0XHRjb25zdCBzaGlwc0xlbmd0aCA9IFs0LCAzLCAzLCAyLCAyLCAyLCAxLCAxLCAxLCAxXTtcblx0XHRjb25zdCBkaXIgPSBbJ3gnLCAneSddO1xuXHRcdHdoaWxlIChzaGlwc0xlbmd0aC5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBzaGlwID0gc2hpcHNMZW5ndGhbMF07XG5cdFx0XHRsZXQgcGxhY2VkID0gZmFsc2U7XG5cdFx0XHRsZXQgYXR0ZW1wdHMgPSAwO1xuXHRcdFx0d2hpbGUgKCFwbGFjZWQgJiYgYXR0ZW1wdHMgPCAxMDApIHtcblx0XHRcdFx0Y29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKFxuXHRcdFx0XHRcdE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllckJvYXJkLnBvc3NpYmxlU2hvdHMubGVuZ3RoLFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRjb25zdCBjb29yZGluYXRlID0gdGhpcy5wbGF5ZXJCb2FyZC5wb3NzaWJsZVNob3RzW3JhbmRvbUluZGV4XTtcblx0XHRcdFx0Y29uc3QgW3gsIHldID0gY29vcmRpbmF0ZTtcblx0XHRcdFx0Y29uc3QgcmFuZG9tRGlyID0gZGlyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpXTtcblx0XHRcdFx0aWYgKGJvYXJkLl9jaGVja0NvbmRpdGlvbnMoc2hpcCwgTnVtYmVyKHgpLCBOdW1iZXIoeSksIHJhbmRvbURpcikpIHtcblx0XHRcdFx0XHRib2FyZC5wbGFjZVNoaXAoc2hpcCwgTnVtYmVyKHgpLCBOdW1iZXIoeSksIHJhbmRvbURpcik7XG5cdFx0XHRcdFx0c2hpcHNMZW5ndGguc2hpZnQoKTtcblx0XHRcdFx0XHRwbGFjZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YXR0ZW1wdHMrKztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFwbGFjZWQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29tcHV0ZXJTaG90KCkge1xuXHRcdGNvbnN0IHNob3QgPSBwbGF5ZXJDb21wdXRlcih0aGlzLnBsYXllckJvYXJkKTtcblx0XHR0aGlzLnBsYXllckJvYXJkLnJlY2VpdmVBdHRhY2soc2hvdCk7XG5cdFx0ZmlsbFBsYXllckJvYXJkc0RPTSh0aGlzLnBsYXllckJvYXJkKTtcblx0XHRjb25zdCBbeCwgeV0gPSBzaG90O1xuXHRcdGlmICh0aGlzLnBsYXllckJvYXJkLm1hcFt4XVt5XSA9PT0gJ+KYkicpIHtcblx0XHRcdHRoaXMucGxheWVyQm9hcmQuaXNQcmV2aW91c0F0dGFja0hpdCA9IHRydWU7XG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJCb2FyZC5kYW1hZ2VkU2hpcCA9PT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnBsYXllckJvYXJkLmZpcnN0SGl0Q29vcmQgPSBzaG90O1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnBsYXllckJvYXJkLmxhc3RIaXQgPSBzaG90O1xuXHRcdFx0dGhpcy5wbGF5ZXJCb2FyZC5nZXREYW1hZ2VkU2hpcCgpO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5wbGF5ZXJCb2FyZC5pc1ByZXZpb3VzQXR0YWNrSGl0ID0gZmFsc2U7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRhc3luYyBwbGF5ZXJTaG90KCkge1xuXHRcdGNvbnN0IHNob3QgPSBhd2FpdCBwbGF5ZXJIdW1hbigpO1xuXHRcdHRoaXMuY29tcHV0ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHNob3QpO1xuXHRcdHBsYXllclNob3RET00odGhpcy5jb21wdXRlckJvYXJkLCBzaG90KTtcblx0XHRjb25zdCBbeCwgeV0gPSBzaG90O1xuXHRcdGlmICh0aGlzLmNvbXB1dGVyQm9hcmQubWFwW3hdW3ldID09PSAn4piSJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Y2hlY2tXaW5uZXIoKSB7XG5cdFx0aWYgKHRoaXMucGxheWVyQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY29tcHV0ZXJCb2FyZC5wbGF5ZXI7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY29tcHV0ZXJCb2FyZC5jaGVja0FsbFNoaXBzU3VuaygpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wbGF5ZXJCb2FyZC5wbGF5ZXI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cbiIsImltcG9ydCB7U2hpcH0gZnJvbSAnLi9zaGlwJztcblxuY29uc3QgU0hJUF9DRUxMID0gJ+KYkCc7XG5jb25zdCBFTVBUWV9DRUxMID0gJ08nO1xuZXhwb3J0IGNvbnN0IEhJVCA9ICfimJInO1xuZXhwb3J0IGNvbnN0IE1JU1MgPSAnwrcnO1xuXG5leHBvcnQgY2xhc3MgR2FtZWJvYXJkIHtcblx0Y29uc3RydWN0b3IocGxheWVyKSB7XG5cdFx0dGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG5cdH1cblxuXHRsaXN0T2ZTaGlwcyA9IG5ldyBNYXAoKTtcblxuXHRtYXAgPSBbXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdF07XG5cblx0Y2hlY2tBbGxTaGlwc1N1bmsoKSB7XG5cdFx0Zm9yIChjb25zdCBzaGlwIG9mIHRoaXMubGlzdE9mU2hpcHMua2V5cygpKSB7XG5cdFx0XHRpZiAoIXNoaXAuaXNTdW5rKCkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cGxhY2VTaGlwKHNoaXBMZW5ndGgsIHhDZWxsLCB5Q2VsbCwgZGlyKSB7XG5cdFx0aWYgKCF0aGlzLl9jaGVja0NvbmRpdGlvbnMoc2hpcExlbmd0aCwgeENlbGwsIHlDZWxsLCBkaXIpKSB7XG5cdFx0XHRyZXR1cm4gYNCY0LfQvNC10L3QuNGC0LUg0LLQstC+0LQgJHtzaGlwTGVuZ3RofSAke3hDZWxsfSAke3lDZWxsfSAke2Rpcn1gO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNoaXAgPSBuZXcgU2hpcChzaGlwTGVuZ3RoKTtcblx0XHRjb25zdCBzaGlwUG9zaXRpb24gPSBbXTtcblx0XHRpZiAoZGlyID09PSAneCcpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR0aGlzLm1hcFt4Q2VsbF1beUNlbGwgKyBpXSA9IFNISVBfQ0VMTDtcblx0XHRcdFx0c2hpcFBvc2l0aW9uLnB1c2goYCR7eENlbGx9JHt5Q2VsbCArIGl9YCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChkaXIgPT09ICd5Jykge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHRoaXMubWFwW3hDZWxsICsgaV1beUNlbGxdID0gU0hJUF9DRUxMO1xuXHRcdFx0XHRzaGlwUG9zaXRpb24ucHVzaChgJHt4Q2VsbCArIGl9JHt5Q2VsbH1gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLiNmaWxsQWRqYWNlbnRDZWxscyhzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcik7XG5cblx0XHR0aGlzLmxpc3RPZlNoaXBzLnNldChzaGlwLCBzaGlwUG9zaXRpb24pO1xuXHR9XG5cblx0cmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG5cdFx0Y29uc3QgW3gsIHldID0gWy4uLlN0cmluZyhjb29yZGluYXRlKV07XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdFx0dGhpcy5tYXBbeF1beV0gPT09IFNISVBfQ0VMTFxuXHRcdFx0PyAodGhpcy5faGl0U2hpcChjb29yZGluYXRlKSwgKHRoaXMubWFwW3hdW3ldID0gSElUKSlcblx0XHRcdDogKHRoaXMubWFwW3hdW3ldID0gTUlTUyk7XG5cdH1cblxuXHRfaGl0U2hpcChjb29yZGluYXRlKSB7XG5cdFx0bGV0IGhpdCA9IGZhbHNlO1xuXHRcdGZvciAoY29uc3QgW3NoaXAsIGNvb3Jkc10gb2YgdGhpcy5saXN0T2ZTaGlwcykge1xuXHRcdFx0aWYgKGNvb3Jkcy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xuXHRcdFx0XHRzaGlwLmhpdCgpO1xuXHRcdFx0XHR0aGlzLmlzU3Vua1NoaXAoc2hpcCwgY29vcmRzLCBjb29yZGluYXRlKTtcblx0XHRcdFx0aGl0ID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhpdDtcblx0fVxuXG5cdCNmaWxsQWRqYWNlbnRDZWxscyhzaXplLCB4Q2VsbCwgeUNlbGwsIGRpcmVjdGlvbikge1xuXHRcdGNvbnN0IHhTdGFydCA9IHhDZWxsIC0gMTtcblx0XHRjb25zdCB4RW5kID0gZGlyZWN0aW9uID09PSAneCcgPyB4Q2VsbCArIDEgOiB4Q2VsbCArIHNpemU7XG5cdFx0Y29uc3QgeVN0YXJ0ID0geUNlbGwgLSAxO1xuXHRcdGNvbnN0IHlFbmQgPSBkaXJlY3Rpb24gPT09ICd5JyA/IHlDZWxsICsgMSA6IHlDZWxsICsgc2l6ZTtcblxuXHRcdGZvciAobGV0IHggPSB4U3RhcnQ7IHggPD0geEVuZDsgeCsrKSB7XG5cdFx0XHRmb3IgKGxldCB5ID0geVN0YXJ0OyB5IDw9IHlFbmQ7IHkrKykge1xuXHRcdFx0XHRpZiAoeCA+PSAwICYmIHggPCB0aGlzLm1hcC5sZW5ndGggJiYgeSA+PSAwICYmIHkgPCB0aGlzLm1hcC5sZW5ndGgpIHtcblx0XHRcdFx0XHR0aGlzLm1hcFt4XVt5XSA9XG5cdFx0XHRcdFx0XHR0aGlzLm1hcFt4XVt5XSA9PT0gU0hJUF9DRUxMID8gU0hJUF9DRUxMIDogRU1QVFlfQ0VMTDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdF9jaGVja0NvbmRpdGlvbnMoc2hpcExlbmd0aCwgeENlbGwsIHlDZWxsLCBkaXIpIHtcblx0XHRpZiAodGhpcy4jaXNDb3JyZWN0Q29vcmRpbmF0ZShzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5saXN0T2ZTaGlwcy5zaXplICYmIHRoaXMuI2lzU2hpcENyb3NzaW5nKGAke3hDZWxsfSR7eUNlbGx9YCkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHR0aGlzLmxpc3RPZlNoaXBzLnNpemUgJiZcblx0XHRcdHRoaXMuI2lzQWRqYWNlbnRDcm9zc2luZyhzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcilcblx0XHQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdCNpc0NvcnJlY3RDb29yZGluYXRlKGxlbmd0aCwgeCwgeSwgZGlyKSB7XG5cdFx0cmV0dXJuICEoZGlyID09PSAneCdcblx0XHRcdD8gbGVuZ3RoICsgeSA8PSB0aGlzLm1hcC5sZW5ndGggJiYgeCA8IHRoaXMubWFwLmxlbmd0aFxuXHRcdFx0OiB5IDwgdGhpcy5tYXAubGVuZ3RoICYmIGxlbmd0aCArIHggPD0gdGhpcy5tYXAubGVuZ3RoKTtcblx0fVxuXG5cdCNpc1NoaXBDcm9zc2luZyA9IChjZWxsKSA9PlxuXHRcdFsuLi50aGlzLmxpc3RPZlNoaXBzXS5zb21lKChbLCBwb3NpdGlvbl0pID0+IHBvc2l0aW9uLmluY2x1ZGVzKGNlbGwpKTtcblxuXHQjaXNBZGphY2VudENyb3NzaW5nKHNpemUsIHgsIHksIGRpcikge1xuXHRcdGlmICh0aGlzLm1hcFt4XVt5XSA9PT0gRU1QVFlfQ0VMTCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKGRpciA9PT0gJ3gnICYmIHNpemUgPiAxKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHNpemU7IGkrKykge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5tYXBbeF1beSArIGldID09PSBTSElQX0NFTEwgfHxcblx0XHRcdFx0XHR0aGlzLm1hcFt4XVt5ICsgaV0gPT09IEVNUFRZX0NFTExcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3knICYmIHNpemUgPiAxKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHNpemU7IGkrKykge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5tYXBbeCArIGldW3ldID09PSBTSElQX0NFTEwgfHxcblx0XHRcdFx0XHR0aGlzLm1hcFt4ICsgaV1beV0gPT09IEVNUFRZX0NFTExcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRmaWxsQ2VsbHMoc2hpcENvb3JkcywgbnVtYmVyRGVzaykge1xuXHRcdGZvciAoY29uc3QgY29vciBvZiBzaGlwQ29vcmRzKSB7XG5cdFx0XHRjb25zdCBbeCwgeV0gPSBjb29yO1xuXHRcdFx0dGhpcy5maWxsU2luZ2xlQ2VsbChOdW1iZXIoeCksIE51bWJlcih5KSwgbnVtYmVyRGVzayk7XG5cdFx0fVxuXHR9XG5cblx0ZmlsbFNpbmdsZUNlbGwoeCwgeSwgbnVtYmVyRGVzaykge1xuXHRcdGxldCBjZWxsO1xuXHRcdGNvbnN0IFNJWkUgPSB0aGlzLm1hcC5sZW5ndGggLSAxO1xuXHRcdGNvbnN0IG9mZnNldHMgPSBbLTEsIDAsIDFdO1xuXHRcdGZvciAoY29uc3QgZHggb2Ygb2Zmc2V0cykge1xuXHRcdFx0Zm9yIChjb25zdCBkeSBvZiBvZmZzZXRzKSB7XG5cdFx0XHRcdGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbmV3WCA9IHggKyBkeDtcblx0XHRcdFx0Y29uc3QgbmV3WSA9IHkgKyBkeTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG5ld1ggPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1ggPD0gU0laRSAmJlxuXHRcdFx0XHRcdG5ld1kgPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1kgPD0gU0laRSAmJlxuXHRcdFx0XHRcdHRoaXMubWFwW25ld1hdW25ld1ldID09PSBFTVBUWV9DRUxMXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlmIChudW1iZXJEZXNrID09PSAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLm1hcFtuZXdYXVtuZXdZXSA9IE1JU1M7XG5cdFx0XHRcdFx0XHRjb25zdCBjb29yID0gdGhpcy5wb3NzaWJsZVNob3RzLmluZGV4T2YoYCR7bmV3WH0ke25ld1l9YCk7XG5cdFx0XHRcdFx0XHR0aGlzLnBvc3NpYmxlU2hvdHMuc3BsaWNlKGNvb3IsIDEpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7bmV3WH0ke25ld1l9YClbXG5cdFx0XHRcdFx0XHRudW1iZXJEZXNrXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0XHRjZWxsLnRleHRDb250ZW50ID0gTUlTUztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgUGxheWVyQm9hcmQgZXh0ZW5kcyBHYW1lYm9hcmQge1xuXHRwb3NzaWJsZVNob3RzID0gW107XG5cdGlzUHJldmlvdXNBdHRhY2tIaXQgPSBmYWxzZTtcblx0cHJldmlvdXNDb29yZCA9ICcgJztcblx0Zmlyc3RIaXRDb29yZCA9ICcgJztcblx0ZGFtYWdlZFNoaXAgPSBudWxsO1xuXHRsYXN0SGl0ID0gJyAnO1xuXG5cdGNvbnN0cnVjdG9yKHBsYXllcikge1xuXHRcdHN1cGVyKHBsYXllcik7XG5cdFx0dGhpcy5maWxsUG9zc2libGVTaG90cygpO1xuXHR9XG5cblx0Z2V0RGFtYWdlZFNoaXAoKSB7XG5cdFx0Zm9yIChjb25zdCBbc2hpcCwgY29vcmRzXSBvZiB0aGlzLmxpc3RPZlNoaXBzKSB7XG5cdFx0XHRpZiAoY29vcmRzLmluY2x1ZGVzKHRoaXMucHJldmlvdXNDb29yZCkgJiYgIXNoaXAuaXNTdW5rKCkpIHtcblx0XHRcdFx0dGhpcy5kYW1hZ2VkU2hpcCA9IHNoaXA7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9IGVsc2UgaWYgKGNvb3Jkcy5pbmNsdWRlcyh0aGlzLmZpcnN0SGl0Q29vcmQpICYmIHNoaXAuaXNTdW5rKCkpIHtcblx0XHRcdFx0dGhpcy5kYW1hZ2VkU2hpcCA9IG51bGw7XG5cdFx0XHRcdHRoaXMuZmlyc3RIaXRDb29yZCA9ICcgJztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmaWxsUG9zc2libGVTaG90cygpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuXHRcdFx0XHR0aGlzLnBvc3NpYmxlU2hvdHMucHVzaChgJHtpfSR7an1gKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpc1N1bmtTaGlwKHNoaXAsIGNvb3JkcywgaGl0KSB7XG5cdFx0Y29uc3QgW3gsIHldID0gaGl0O1xuXHRcdGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgY2VsbC0ke3h9JHt5fWApWzBdO1xuXHRcdGNlbGwuc3R5bGUuY29sb3IgPSBzaGlwLmlzU3VuaygpID8gJ3JlZCcgOiAncHVycGxlJztcblx0XHRpZiAoc2hpcC5pc1N1bmsoKSkge1xuXHRcdFx0dGhpcy5maWxsQ2VsbHMoY29vcmRzLCAwKTtcblx0XHRcdGZvciAoY29uc3QgY29vciBvZiBjb29yZHMpIHtcblx0XHRcdFx0Y29uc3QgW3gsIHldID0gY29vcjtcblx0XHRcdFx0Y2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKVswXTtcblx0XHRcdFx0Y2VsbC5zdHlsZS5jb2xvciA9ICdyZWQnO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcHV0ZXJCb2FyZCBleHRlbmRzIEdhbWVib2FyZCB7XG5cdGhpZGRlbk1hcCA9IFtcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XTtcblxuXHRyZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcblx0XHRjb25zdCBbeCwgeV0gPSBbLi4uU3RyaW5nKGNvb3JkaW5hdGUpXTtcblx0XHRpZiAodGhpcy5tYXBbeF1beV0gPT09IFNISVBfQ0VMTCkge1xuXHRcdFx0dGhpcy5faGl0U2hpcChjb29yZGluYXRlKTtcblx0XHRcdHRoaXMubWFwW3hdW3ldID0gSElUO1xuXHRcdFx0dGhpcy5oaWRkZW5NYXBbeF1beV0gPSBISVQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubWFwW3hdW3ldID0gTUlTUztcblx0XHRcdHRoaXMuaGlkZGVuTWFwW3hdW3ldID0gTUlTUztcblx0XHR9XG5cdH1cblxuXHRpc1N1bmtTaGlwKHNoaXAsIGNvb3JkcywgaGl0KSB7XG5cdFx0Y29uc3QgW3gsIHldID0gaGl0O1xuXHRcdGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgY2VsbC0ke3h9JHt5fWApWzFdO1xuXHRcdGNlbGwuc3R5bGUuY29sb3IgPSBzaGlwLmlzU3VuaygpID8gJ3JlZCcgOiAncHVycGxlJztcblx0XHRpZiAoc2hpcC5pc1N1bmsoKSkge1xuXHRcdFx0dGhpcy5maWxsQ2VsbHMoY29vcmRzLCAxKTtcblx0XHRcdGZvciAoY29uc3QgY29vciBvZiBjb29yZHMpIHtcblx0XHRcdFx0Y29uc3QgW3gsIHldID0gY29vcjtcblx0XHRcdFx0Y2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKVsxXTtcblx0XHRcdFx0Y2VsbC5zdHlsZS5jb2xvciA9ICdyZWQnO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwiY29uc3QgUk9XUyA9IDEwO1xuY29uc3QgQ09MVU1OUyA9IDEwO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTaGVsbCgpIHtcblx0Y29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF07XG5cblx0Y3JlYXRlRWxlbWVudCgnaDEnLCAnQmF0dGxlc2hpcCBnYW1lJywgJycsIGJvZHkpO1xuXG5cdGNvbnN0IGxhYmVsQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdsYWJlbENvbnRhaW5lcicsIGJvZHkpO1xuXHRjb25zdCBkaXZCdXR0b24gPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2RpdkJ1dHRvbicsIGJvZHkpO1xuXHRjcmVhdGVFbGVtZW50KCdidXR0b24nLCAnU3RhcnQgR2FtZScsICdidXR0b24nLCBkaXZCdXR0b24pO1xuXHRjcmVhdGVFbGVtZW50KCdoMicsICcnLCAnd2lubmVyTGFiZWwnLCBkaXZCdXR0b24pO1xuXHRjcmVhdGVFbGVtZW50KCdwJywgJ1lvdScsICdsYWJlbCcsIGxhYmVsQ29udGFpbmVyKTtcblx0Y3JlYXRlRWxlbWVudCgncCcsICdDb21wdXRlcicsICdsYWJlbCcsIGxhYmVsQ29udGFpbmVyKTtcblxuXHRjb25zdCBjb250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2NvbnRhaW5lcicsIGJvZHkpO1xuXHRjb25zdCBsZWZ0Q29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdsZWZ0Q29udGFpbmVyJywgY29udGFpbmVyKTtcblx0Y29uc3QgcmlnaHRDb250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ3JpZ2h0Q29udGFpbmVyJywgY29udGFpbmVyKTtcblxuXHRjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2Zha2UnLCBsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlTGV0dGVyTGluZShsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlTnVtYmVyTGluZShsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlQm9hcmQobGVmdENvbnRhaW5lcik7XG5cblx0Y3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdmYWtlJywgcmlnaHRDb250YWluZXIpO1xuXHRjcmVhdGVMZXR0ZXJMaW5lKHJpZ2h0Q29udGFpbmVyKTtcblx0Y3JlYXRlTnVtYmVyTGluZShyaWdodENvbnRhaW5lcik7XG5cdGNyZWF0ZUJvYXJkKHJpZ2h0Q29udGFpbmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuU2hlbGwoYm9hcmQsIG51bWJlcikge1xuXHRmb3IgKGNvbnN0IFtpLCByb3ddIG9mIGJvYXJkLm1hcC5lbnRyaWVzKCkpIHtcblx0XHRmb3IgKGNvbnN0IGogb2Ygcm93LmtleXMoKSkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHtpfSR7an1gKTtcblx0XHRcdGVsZW1lbnRbbnVtYmVyXS50ZXh0Q29udGVudCA9ICcnO1xuXHRcdFx0ZWxlbWVudFtudW1iZXJdLnN0eWxlLmNvbG9yID0gJ2JsYWNrJztcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxQbGF5ZXJCb2FyZHNET00oYm9hcmQpIHtcblx0Zm9yIChjb25zdCBbaSwgcm93XSBvZiBib2FyZC5tYXAuZW50cmllcygpKSB7XG5cdFx0Zm9yIChjb25zdCBbaiwgY2VsbF0gb2Ygcm93LmVudHJpZXMoKSkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHtpfSR7an1gKTtcblx0XHRcdGVsZW1lbnRbMF0udGV4dENvbnRlbnQgPSBjZWxsID09PSAnTycgfHwgY2VsbCA9PT0gJyAnID8gJyAnIDogY2VsbDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXllclNob3RET00oYm9hcmQsIHNob3QpIHtcblx0Y29uc3QgW3gsIHldID0gc2hvdDtcblx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKTtcblx0ZWxlbWVudFsxXS50ZXh0Q29udGVudCA9IGJvYXJkLm1hcFt4XVt5XTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCB0ZXh0LCBjbGFzc05hbWUsIHBhcmVudCkge1xuXHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblx0ZWxlbWVudC50ZXh0Q29udGVudCA9IHRleHQ7XG5cdGlmIChjbGFzc05hbWUpIHtcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcblx0fVxuXG5cdHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcblx0cmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKHBhcmVudCkge1xuXHRjb25zdCBib2FyZCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnYm9hcmQnLCBwYXJlbnQpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IFJPV1M7IGkrKykge1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgQ09MVU1OUzsgaisrKSB7XG5cdFx0XHRjb25zdCBjZWxsID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdjZWxsJywgYm9hcmQpO1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKGBjZWxsLSR7aX0ke2p9YCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGJvYXJkO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOdW1iZXJMaW5lKHBhcmVudCkge1xuXHRjb25zdCBudW1iZXJMaW5lID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdudW1iZXJMaW5lJywgcGFyZW50KTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBST1dTOyBpKyspIHtcblx0XHRjcmVhdGVFbGVtZW50KCdkaXYnLCBpICsgMSwgJ251bWJlcicsIG51bWJlckxpbmUpO1xuXHR9XG5cblx0cmV0dXJuIG51bWJlckxpbmU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxldHRlckxpbmUocGFyZW50KSB7XG5cdGNvbnN0IGxldHRlckxpbmUgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2xldHRlckxpbmUnLCBwYXJlbnQpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IENPTFVNTlM7IGkrKykge1xuXHRcdGNyZWF0ZUVsZW1lbnQoJ2RpdicsIFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSwgJ2xldHRlcicsIGxldHRlckxpbmUpO1xuXHR9XG5cblx0cmV0dXJuIGxldHRlckxpbmU7XG59XG4iLCJpbXBvcnQge01JU1MsIEhJVH0gZnJvbSAnLi9nYW1lYm9hcmQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGxheWVySHVtYW4oKSB7XG5cdHN0YXJ0TGlzdGVuaW5nUGxheWVyVHVybigpO1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmIChzaG90UGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHJlc29sdmUoc2hvdFBsYXllcik7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXHRcdFx0XHRzaG90UGxheWVyID0gbnVsbDtcblx0XHRcdH1cblx0XHR9LCAxMDApO1xuXHR9KTtcbn1cblxubGV0IHNob3RQbGF5ZXIgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gcGxheWVyQ29tcHV0ZXIoYm9hcmQpIHtcblx0bGV0IHNob3Q7XG5cdGNvbnN0IHNpemUgPSBib2FyZC5tYXAubGVuZ3RoIC0gMTtcblx0aWYgKGJvYXJkLmlzUHJldmlvdXNBdHRhY2tIaXQgfHwgYm9hcmQuZGFtYWdlZFNoaXAgIT09IG51bGwpIHtcblx0XHRsZXQgW3gsIHldID0gYm9hcmQubGFzdEhpdDtcblx0XHR4ID0gTnVtYmVyKHgpO1xuXHRcdHkgPSBOdW1iZXIoeSk7XG5cblx0XHRjb25zdCBjb25kaXRpb25zID0gW1xuXHRcdFx0KHgsIHkpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHkgPiAwICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3hdW3kgLSAxXSAhPT0gTUlTUyAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4XVt5IC0gMV0gIT09IEhJVCAmJlxuXHRcdFx0XHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihgJHt4fSR7eSAtIDF9YCkgIT09IC0xXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiBgJHt4fSR7eSAtIDF9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCh4LCB5KSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR4ID4gMCAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4IC0gMV1beV0gIT09IE1JU1MgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeCAtIDFdW3ldICE9PSBISVQgJiZcblx0XHRcdFx0XHRib2FyZC5wb3NzaWJsZVNob3RzLmluZGV4T2YoYCR7eCAtIDF9JHt5fWApICE9PSAtMVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gYCR7eCAtIDF9JHt5fWA7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQoeCwgeSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0eSA8IHNpemUgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeF1beSArIDFdICE9PSBNSVNTICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3hdW3kgKyAxXSAhPT0gSElUICYmXG5cdFx0XHRcdFx0Ym9hcmQucG9zc2libGVTaG90cy5pbmRleE9mKGAke3h9JHt5ICsgMX1gKSAhPT0gLTFcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGAke3h9JHt5ICsgMX1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0KHgsIHkpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHggPCBzaXplICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3ggKyAxXVt5XSAhPT0gTUlTUyAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4ICsgMV1beV0gIT09IEhJVCAmJlxuXHRcdFx0XHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihgJHt4ICsgMX0ke3l9YCkgIT09IC0xXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiBgJHt4ICsgMX0ke3l9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRdO1xuXG5cdFx0Y29uc3Qgc2h1ZmZsZSA9IGZ1bmN0aW9uIChhcnJheSkge1xuXHRcdFx0bGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcblx0XHRcdGxldCByYW5kb21JbmRleDtcblxuXHRcdFx0d2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuXHRcdFx0XHRyYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG5cdFx0XHRcdGN1cnJlbnRJbmRleC0tO1xuXG5cdFx0XHRcdFthcnJheVtjdXJyZW50SW5kZXhdLCBhcnJheVtyYW5kb21JbmRleF1dID0gW1xuXHRcdFx0XHRcdGFycmF5W3JhbmRvbUluZGV4XSxcblx0XHRcdFx0XHRhcnJheVtjdXJyZW50SW5kZXhdLFxuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fTtcblxuXHRcdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIHNodWZmbGUoY29uZGl0aW9ucykpIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGNvbmRpdGlvbih4LCB5KTtcblxuXHRcdFx0aWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHNob3QgPSByZXN1bHQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzaG90ID09PSB1bmRlZmluZWQgJiYgYm9hcmQuZGFtYWdlZFNoaXAgIT09IG51bGwpIHtcblx0XHRcdGxldCBbeFMsIHlTXSA9IGJvYXJkLmZpcnN0SGl0Q29vcmQ7XG5cdFx0XHR4UyA9IE51bWJlcih4Uyk7XG5cdFx0XHR5UyA9IE51bWJlcih5Uyk7XG5cblx0XHRcdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIHNodWZmbGUoY29uZGl0aW9ucykpIHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gY29uZGl0aW9uKHhTLCB5Uyk7XG5cdFx0XHRcdGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHNob3QgPSByZXN1bHQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc2hvdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBib2FyZC5wb3NzaWJsZVNob3RzLmxlbmd0aCk7XG5cdFx0XHRzaG90ID0gYm9hcmQucG9zc2libGVTaG90c1tyYW5kb21dO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluZGV4ID0gYm9hcmQucG9zc2libGVTaG90cy5pbmRleE9mKHNob3QpO1xuXHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuc3BsaWNlKGluZGV4LCAxKTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJvYXJkLnBvc3NpYmxlU2hvdHMubGVuZ3RoKTtcblx0XHRzaG90ID0gYm9hcmQucG9zc2libGVTaG90c1tyYW5kb21JbmRleF07XG5cdFx0Ym9hcmQucG9zc2libGVTaG90cy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuXHR9XG5cblx0Ym9hcmQucHJldmlvdXNDb29yZCA9IHNob3Q7XG5cdHJldHVybiBzaG90O1xufVxuXG5mdW5jdGlvbiBzdGFydExpc3RlbmluZ1BsYXllclR1cm4oKSB7XG5cdGNvbnN0IGZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9hcmQnKVsxXTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgYmFja2xpZ2h0KTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCByZXNldCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZXIoZSkge1xuXHRjb25zdCBmaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvYXJkJylbMV07XG5cdGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBlLnRhcmdldC50ZXh0Q29udGVudCA9PT0gJycpIHtcblx0XHRzaG90UGxheWVyID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdLnNsaWNlKDUpO1xuXHRcdGZpZWxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gYmFja2xpZ2h0KGUpIHtcblx0aWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKSB7XG5cdFx0ZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEuMDUpJztcblx0XHRlLnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYigyNDUsIDI0NSwgMjQ1KSc7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVzZXQoZSkge1xuXHRpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykpIHtcblx0XHRlLnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG5cdFx0ZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICd3aGl0ZSc7XG5cdH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTaGlwIHtcblx0Y29uc3RydWN0b3IobGVuZ3RoKSB7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0dGhpcy5oaXRzID0gMDtcblx0fVxuXG5cdGhpdCgpIHtcblx0XHR0aGlzLmhpdHMrKztcblx0fVxuXG5cdGlzU3VuaygpIHtcblx0XHRyZXR1cm4gdGhpcy5sZW5ndGggPT09IHRoaXMuaGl0cztcblx0fVxufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xufVxuXG46cm9vdCB7XG4gIC0tY29sb3ItcHJpbWFyeTogI2Y1ZjVkYztcbiAgLS1jb2xvci1ib3JkZXI6IGJsdWU7XG4gIC0tY29sb3ItbGFiZWw6ICM0ZDRkNGQ7XG4gIC0tY29sb3ItYnV0dG9uOiAjNGQ0ZDRkOTE7XG4gIC0tY29sb3Itd2lubmVyOiAjMTE1ZjEzO1xuICAtLWZvbnQ6IFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlO1xuICAtLWZvbnQtc2l6ZS1sYXJnZTogM3JlbTtcbiAgLS1mb250LXNpemUtbWFpbjogMnJlbTtcbiAgLS1mb250LXNpemUtc21hbGw6IDFyZW07XG59XG5cbmJvZHkge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1jb2xvci1wcmltYXJ5KTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmJvZHkgaDEge1xuICBmb250LWZhbWlseTogdmFyKC0tZm9udCk7XG4gIGZvbnQtc2l6ZTogdmFyKC0tZm9udC1zaXplLWxhcmdlKTtcbiAgY29sb3I6IHZhcigtLWNvbG9yLWJvcmRlcik7XG4gIG1hcmdpbjogMXJlbSAwO1xufVxuXG4ubGFiZWxDb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgd2lkdGg6IDgwdnc7XG4gIGdhcDogNXJlbTtcbn1cbi5sYWJlbENvbnRhaW5lciAubGFiZWwge1xuICBmb250LXNpemU6IHZhcigtLWZvbnQtc2l6ZS1tYWluKTtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQpO1xuICBjb2xvcjogdmFyKC0tY29sb3ItbGFiZWwpO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgd2lkdGg6IDI1dmg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLmRpdkJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMXJlbTtcbn1cbi5kaXZCdXR0b24gLmJ1dHRvbiB7XG4gIGZvbnQtc2l6ZTogdmFyKC0tZm9udC1zaXplLW1haW4pO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci1idXR0b24pO1xufVxuLmRpdkJ1dHRvbiAud2lubmVyTGFiZWwge1xuICBjb2xvcjogdmFyKC0tY29sb3Itd2lubmVyKTtcbiAgZm9udC1zaXplOiB2YXIoLS1mb250LXNpemUtbWFpbik7XG4gIGhlaWdodDogdmFyKC0tZm9udC1zaXplLW1haW4pO1xuICBtYXJnaW4tYm90dG9tOiB2YXIoLS1mb250LXNpemUtbWFpbik7XG59XG5cbi5jb250YWluZXIge1xuICBoZWlnaHQ6IGF1dG87XG4gIHdpZHRoOiA3MHZ3O1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBnYXA6IDNyZW07XG59XG4uY29udGFpbmVyIC5sZWZ0Q29udGFpbmVyLFxuLmNvbnRhaW5lciAucmlnaHRDb250YWluZXIge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEwcHggMWZyO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDEwcHggMWZyO1xuICBnYXA6IDFyZW07XG4gIGZsZXg6IDE7XG59XG5cbi5ib2FyZCB7XG4gIGFzcGVjdC1yYXRpbzogMS8xO1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDFmcik7XG4gIGdyaWQtYXV0by1mbG93OiBkZW5zZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yLWJvcmRlcik7XG59XG4uYm9hcmQgZGl2IHtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3ItYm9yZGVyKTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogM3Z3O1xuICBoZWlnaHQ6IGF1dG87XG4gIHdpZHRoOiBhdXRvO1xuICBtaW4taGVpZ2h0OiAwO1xuICBtaW4td2lkdGg6IDA7XG59XG5cbi5sZXR0ZXJMaW5lLFxuLm51bWJlckxpbmUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXdlaWdodDogOTAwO1xuICBmb250LXNpemU6IHZhcigtLWZvbnQtc2l6ZS1tYWluKTtcbiAgY29sb3I6IHZhcigtLWNvbG9yLWJvcmRlcik7XG59XG5cbi5sZXR0ZXJMaW5lIHtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbn1cblxuLm51bWJlckxpbmUge1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmxldHRlcixcbi5udW1iZXIge1xuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgaGVpZ2h0OiBhdXRvO1xuICB3aWR0aDogYXV0bztcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDExMDBweCkge1xuICAuY29udGFpbmVyIHtcbiAgICB3aWR0aDogOTV2dztcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDgxMHB4KSB7XG4gIDpyb290IHtcbiAgICAtLWZvbnQtc2l6ZS1sYXJnZTogMS41cmVtO1xuICAgIC0tZm9udC1zaXplLW1haW46IDFyZW07XG4gICAgLS1mb250LXNpemUtc21hbGw6IDAuNXJlbTtcbiAgfVxuICBoMSB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG4gIC5jb250YWluZXIge1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW4tcmV2ZXJzZTtcbiAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgfVxuICAuYm9hcmQgZGl2IHtcbiAgICBmb250LXNpemU6IDd2dztcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5jb250YWluZXIge1xuICAgIHdpZHRoOiA4MHZ3O1xuICAgIG1heC1oZWlnaHQ6IDgwZHZoO1xuICB9XG59LyojIHNvdXJjZU1hcHBpbmdVUkw9c3R5bGUuY3NzLm1hcCAqL2AsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLnNjc3NcIixcIndlYnBhY2s6Ly8uL2Rpc3QvY3NzL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNDLFNBQUE7RUFDQSxVQUFBO0VBQ0EseUJBQUE7RUFFQSxzQkFBQTtFQUVBLGlCQUFBO0FDQ0Q7O0FERUE7RUFDQyx3QkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSx5QkFBQTtFQUNBLHVCQUFBO0VBQ0EseUNBQUE7RUFDQSx1QkFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7QUNDRDs7QURFQTtFQUNDLGdDQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUNDRDtBRENDO0VBQ0Msd0JBQUE7RUFDQSxpQ0FBQTtFQUNBLDBCQUFBO0VBQ0EsY0FBQTtBQ0NGOztBREdBO0VBQ0MsYUFBQTtFQUNBLDZCQUFBO0VBQ0EsV0FBQTtFQUNBLFNBQUE7QUNBRDtBREVDO0VBQ0MsZ0NBQUE7RUFDQSx3QkFBQTtFQUNBLHlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7QUNBRjs7QURJQTtFQUNDLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtBQ0REO0FER0M7RUFDQyxnQ0FBQTtFQUNBLG1CQUFBO0VBQ0EscUNBQUE7QUNERjtBRElDO0VBQ0MsMEJBQUE7RUFDQSxnQ0FBQTtFQUNBLDZCQUFBO0VBQ0Esb0NBQUE7QUNGRjs7QURNQTtFQUNDLFlBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsdUJBQUE7RUFDQSxTQUFBO0FDSEQ7QURLQzs7RUFFQyxhQUFBO0VBQ0EsK0JBQUE7RUFDQSw0QkFBQTtFQUNBLFNBQUE7RUFDQSxPQUFBO0FDSEY7O0FET0E7RUFDQyxpQkFBQTtFQUNBLGFBQUE7RUFDQSxzQ0FBQTtFQUNBLG1DQUFBO0VBQ0EscUJBQUE7RUFDQSx1QkFBQTtFQUNBLHFDQUFBO0FDSkQ7QURNQztFQUNDLHFDQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxjQUFBO0VBRUEsWUFBQTtFQUNBLFdBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtBQ0xGOztBRFNBOztFQUVDLGFBQUE7RUFDQSxnQkFBQTtFQUNBLGdDQUFBO0VBQ0EsMEJBQUE7QUNORDs7QURTQTtFQUNDLDZCQUFBO0VBQ0EscUJBQUE7QUNORDs7QURTQTtFQUNDLHNCQUFBO0VBQ0EsNkJBQUE7RUFDQSxtQkFBQTtBQ05EOztBRFNBOztFQUVDLHlCQUFBO0VBRUEsc0JBQUE7RUFFQSxpQkFBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0FDTkQ7O0FEU0E7RUFDQztJQUNDLFdBQUE7RUNOQTtBQUNGO0FEU0E7RUFDQztJQUNDLHlCQUFBO0lBQ0Esc0JBQUE7SUFDQSx5QkFBQTtFQ1BBO0VEU0Q7SUFDQyxrQkFBQTtFQ1BBO0VEVUQ7SUFDQyw4QkFBQTtJQUNBLG9CQUFBO0VDUkE7RURXRDtJQUNDLGNBQUE7RUNUQTtBQUNGO0FEWUE7RUFDQztJQUNDLFdBQUE7SUFDQSxpQkFBQTtFQ1ZBO0FBQ0YsQ0FBQSxvQ0FBQVwiLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi4vZGlzdC9jc3Mvc3R5bGUuY3NzJztcbmltcG9ydCB7R2FtZX0gZnJvbSAnLi9nYW1lJztcbmltcG9ydCB7Z2VuZXJhdGVTaGVsbCwgY2xlYW5TaGVsbH0gZnJvbSAnLi9nZW5lcmF0ZURPTSc7XG5cbmdlbmVyYXRlU2hlbGwoKTtcbmNvbnN0IG5ld0dhbWUgPSBuZXcgR2FtZSgnUGxheWVyJywgJ0NvbXB1dGVyJyk7XG5jb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24nKVswXTtcbm5ld0dhbWUuc3RhcnQoKTtcblxuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYWxlcnRcblx0Y29uc3QgYXNrID0gY29uZmlybSgnU3RhcnQgYSBuZXcgZ2FtZT8nKTtcblx0aWYgKGFzaykge1xuXHRcdGNsZWFuU2hlbGwobmV3R2FtZS5jb21wdXRlckJvYXJkLCAxKTtcblx0XHRjbGVhblNoZWxsKG5ld0dhbWUucGxheWVyQm9hcmQsIDApO1xuXHRcdG5ld0dhbWUucmVzZXQoKTtcblx0XHRuZXdHYW1lLnN0YXJ0KCk7XG5cdH1cbn0pO1xuIl0sIm5hbWVzIjpbIkNvbXB1dGVyQm9hcmQiLCJQbGF5ZXJCb2FyZCIsInBsYXllckh1bWFuIiwicGxheWVyQ29tcHV0ZXIiLCJmaWxsUGxheWVyQm9hcmRzRE9NIiwicGxheWVyU2hvdERPTSIsIkRFTEFZIiwiR2FtZSIsImNvbnN0cnVjdG9yIiwicGxheWVyMSIsInBsYXllcjIiLCJwbGF5ZXJCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJmaWxsQm9hcmRQbGF5ZXIiLCJmaWxsQm9hcmRDb21wdXRlciIsInJlc2V0IiwicGxheWVyIiwid2luZXJMYWJlbCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInRleHRDb250ZW50Iiwic3RhcnQiLCJ0dXJuIiwid2lubmVyIiwiaGl0IiwicGxheWVyU2hvdCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsImNvbXB1dGVyU2hvdCIsImNoZWNrV2lubmVyIiwicmFuZG9tR2VuZXJhdGlvbiIsIiNyYW5kb21HZW5lcmF0aW9uIiwiYm9hcmQiLCJzaGlwc0xlbmd0aCIsImRpciIsImxlbmd0aCIsInNoaXAiLCJwbGFjZWQiLCJhdHRlbXB0cyIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicG9zc2libGVTaG90cyIsImNvb3JkaW5hdGUiLCJ4IiwieSIsInJhbmRvbURpciIsIl9jaGVja0NvbmRpdGlvbnMiLCJOdW1iZXIiLCJwbGFjZVNoaXAiLCJzaGlmdCIsInNob3QiLCJyZWNlaXZlQXR0YWNrIiwibWFwIiwiaXNQcmV2aW91c0F0dGFja0hpdCIsImRhbWFnZWRTaGlwIiwiZmlyc3RIaXRDb29yZCIsImxhc3RIaXQiLCJnZXREYW1hZ2VkU2hpcCIsImNoZWNrQWxsU2hpcHNTdW5rIiwiU2hpcCIsIlNISVBfQ0VMTCIsIkVNUFRZX0NFTEwiLCJISVQiLCJNSVNTIiwiR2FtZWJvYXJkIiwibGlzdE9mU2hpcHMiLCJNYXAiLCJrZXlzIiwiaXNTdW5rIiwic2hpcExlbmd0aCIsInhDZWxsIiwieUNlbGwiLCJzaGlwUG9zaXRpb24iLCJpIiwicHVzaCIsImZpbGxBZGphY2VudENlbGxzIiwic2V0IiwiU3RyaW5nIiwiX2hpdFNoaXAiLCJjb29yZHMiLCJpbmNsdWRlcyIsImlzU3Vua1NoaXAiLCIjZmlsbEFkamFjZW50Q2VsbHMiLCJzaXplIiwiZGlyZWN0aW9uIiwieFN0YXJ0IiwieEVuZCIsInlTdGFydCIsInlFbmQiLCJpc0NvcnJlY3RDb29yZGluYXRlIiwiaXNTaGlwQ3Jvc3NpbmciLCJpc0FkamFjZW50Q3Jvc3NpbmciLCIjaXNDb3JyZWN0Q29vcmRpbmF0ZSIsImNlbGwiLCJzb21lIiwicG9zaXRpb24iLCIjaXNBZGphY2VudENyb3NzaW5nIiwiZmlsbENlbGxzIiwic2hpcENvb3JkcyIsIm51bWJlckRlc2siLCJjb29yIiwiZmlsbFNpbmdsZUNlbGwiLCJTSVpFIiwib2Zmc2V0cyIsImR4IiwiZHkiLCJuZXdYIiwibmV3WSIsImluZGV4T2YiLCJzcGxpY2UiLCJwcmV2aW91c0Nvb3JkIiwiZmlsbFBvc3NpYmxlU2hvdHMiLCJqIiwic3R5bGUiLCJjb2xvciIsImhpZGRlbk1hcCIsIlJPV1MiLCJDT0xVTU5TIiwiZ2VuZXJhdGVTaGVsbCIsImJvZHkiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImNyZWF0ZUVsZW1lbnQiLCJsYWJlbENvbnRhaW5lciIsImRpdkJ1dHRvbiIsImNvbnRhaW5lciIsImxlZnRDb250YWluZXIiLCJyaWdodENvbnRhaW5lciIsImNyZWF0ZUxldHRlckxpbmUiLCJjcmVhdGVOdW1iZXJMaW5lIiwiY3JlYXRlQm9hcmQiLCJjbGVhblNoZWxsIiwibnVtYmVyIiwicm93IiwiZW50cmllcyIsImVsZW1lbnQiLCJ0eXBlIiwidGV4dCIsImNsYXNzTmFtZSIsInBhcmVudCIsImNsYXNzTGlzdCIsImFkZCIsImFwcGVuZENoaWxkIiwibnVtYmVyTGluZSIsImxldHRlckxpbmUiLCJmcm9tQ2hhckNvZGUiLCJzdGFydExpc3RlbmluZ1BsYXllclR1cm4iLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwic2hvdFBsYXllciIsImNsZWFySW50ZXJ2YWwiLCJjb25kaXRpb25zIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwiY29uZGl0aW9uIiwicmVzdWx0IiwidW5kZWZpbmVkIiwieFMiLCJ5UyIsImluZGV4IiwiZmllbGQiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlciIsImJhY2tsaWdodCIsImUiLCJ0YXJnZXQiLCJjb250YWlucyIsInNsaWNlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInRyYW5zZm9ybSIsImJhY2tncm91bmQiLCJoaXRzIiwibmV3R2FtZSIsImJ1dHRvbiIsImFzayIsImNvbmZpcm0iXSwic291cmNlUm9vdCI6IiJ9