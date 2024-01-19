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
  const main = createElement('div', '', 'main', body);
  createElement('h1', 'Battleship game', '', main);
  const labelContainer = createElement('div', '', 'labelContainer', main);
  const divButton = createElement('div', '', 'divButton', main);
  createElement('button', 'Start Game', 'button', divButton);
  createElement('h2', '', 'winnerLabel', divButton);
  createElement('p', 'You', 'label', labelContainer);
  createElement('p', 'Computer', 'label', labelContainer);
  const container = createElement('div', '', 'container', main);
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
  text-align: center;
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

.main {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.container {
  height: auto;
  width: 70vw;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;
  margin: 0 auto;
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
    --font-size-main: 1.2rem;
    --font-size-small: 0.5rem;
  }
  .container {
    width: 60dvw;
    flex-direction: column-reverse;
    align-items: center;
  }
  .board div {
    font-size: 3.5vw;
  }
  .leftContainer,
  .rightContainer {
    width: 75%;
  }
}
@media (max-width: 500px) {
  .container {
    height: -moz-max-content;
    height: max-content;
  }
  .container .leftContainer,
  .container .rightContainer {
    gap: 0.5rem;
    width: 75dvw;
  }
  .main {
    max-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .labelContainer,
  .divButton,
  body h1 {
    height: 5dvh;
  }
  .button {
    width: 30dvw;
  }
  body h1 {
    margin: 0;
  }
  .board div {
    font-size: 5vw;
  }
}/*# sourceMappingURL=style.css.map */`, "",{"version":3,"sources":["webpack://./src/style.scss","webpack://./dist/css/style.css"],"names":[],"mappings":"AAAA;EACC,SAAA;EACA,UAAA;EACA,yBAAA;EAEA,sBAAA;EAEA,iBAAA;ACCD;;ADEA;EACC,wBAAA;EACA,oBAAA;EACA,sBAAA;EACA,yBAAA;EACA,uBAAA;EACA,yCAAA;EACA,uBAAA;EACA,sBAAA;EACA,uBAAA;ACCD;;ADEA;EACC,gCAAA;EACA,aAAA;EACA,sBAAA;EACA,mBAAA;ACCD;ADCC;EACC,wBAAA;EACA,iCAAA;EACA,0BAAA;EACA,cAAA;EACA,kBAAA;ACCF;;ADGA;EACC,aAAA;EACA,6BAAA;EACA,WAAA;EACA,SAAA;ACAD;ADEC;EACC,gCAAA;EACA,wBAAA;EACA,yBAAA;EACA,iBAAA;EACA,WAAA;EACA,kBAAA;ACAF;;ADIA;EACC,aAAA;EACA,sBAAA;EACA,mBAAA;EACA,SAAA;ACDD;ADGC;EACC,gCAAA;EACA,mBAAA;EACA,qCAAA;ACDF;ADIC;EACC,0BAAA;EACA,gCAAA;EACA,6BAAA;EACA,oCAAA;ACFF;;ADMA;EACC,cAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;ACHD;;ADMA;EACC,YAAA;EACA,WAAA;EACA,aAAA;EACA,8BAAA;EACA,uBAAA;EACA,SAAA;EACA,cAAA;ACHD;ADKC;;EAEC,aAAA;EACA,+BAAA;EACA,4BAAA;EACA,SAAA;EACA,OAAA;ACHF;;ADOA;EACC,iBAAA;EACA,aAAA;EACA,sCAAA;EACA,mCAAA;EACA,qBAAA;EACA,uBAAA;EACA,qCAAA;ACJD;ADMC;EACC,qCAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,cAAA;EAEA,YAAA;EACA,WAAA;EACA,aAAA;EACA,YAAA;ACLF;;ADSA;;EAEC,aAAA;EACA,gBAAA;EACA,gCAAA;EACA,0BAAA;ACND;;ADSA;EACC,6BAAA;EACA,qBAAA;ACND;;ADSA;EACC,sBAAA;EACA,6BAAA;EACA,mBAAA;ACND;;ADSA;;EAEC,yBAAA;EAEA,sBAAA;EAEA,iBAAA;EACA,YAAA;EACA,WAAA;ACND;;ADSA;EACC;IACC,WAAA;ECNA;AACF;ADSA;EACC;IACC,yBAAA;IACA,wBAAA;IACA,yBAAA;ECPA;EDUD;IACC,YAAA;IACA,8BAAA;IACA,mBAAA;ECRA;EDWD;IACC,gBAAA;ECTA;EDYD;;IAEC,UAAA;ECVA;AACF;ADaA;EACC;IACC,wBAAA;IAAA,mBAAA;ECXA;EDaA;;IAEC,WAAA;IACA,YAAA;ECXD;EDeD;IACC,kBAAA;IACA,aAAA;IACA,sBAAA;IACA,mBAAA;ECbA;EDgBD;;;IAGC,YAAA;ECdA;EDiBD;IACC,YAAA;ECfA;EDkBD;IACC,SAAA;EChBA;EDmBD;IACC,cAAA;ECjBA;AACF,CAAA,oCAAA","sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQ2xEO0VBRURNLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ25CLEtBQUssTUFBTXhCLElBQUksSUFBSSxJQUFJLENBQUMrQixXQUFXLENBQUNFLElB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QUFTLENBQUM7RUFDNUNtRCxTQUFTLEdBQUcsQ0FDWCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUNsRDtFQUVEaEUsYUFBYUEsQ0FBQ1QsVUFBVSxFQUFFO0lBQ3pCLE1BQU0sQ0FBQ0MsQ0FBQyxFQUFFQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUdpQyxNQUFNLENBQUNuQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxJQUFJLElBQUksQ0FBQ1UsR0FBRyxDQUFDVCxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEtBQUtnQixTQUFTLEVBQUU7TUFDakMsSUFBSSxDQUFDa0IsUUFBUSxDQUFDcEMsVUFBVSxDQUFDO01BQ3pCLElBQUksQ0FBQ1UsR0FBRyxDQUFDVCxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEdBQUdrQixHQUFHO01BQ3BCLElBQUksQ0FBQ3FELFNBQVMsQ0FBQ3hFLENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsR0FBR2tCLEdBQUc7SUFDM0IsQ0FBQyxNQUFNO01BQ04sSUFBSSxDQUFDVixHQUFHLENBQUNULENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUMsR0FBR21CLElBQUk7TUFDckIsSUFBSSxDQUFDb0QsU0FBUyxDQUFDeEUsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxHQUFHbUIsSUFBSTtJQUM1QjtFQUNEO0VBRUFrQixVQUFVQSxDQUFDL0MsSUFBSSxFQUFFNkMsTUFBTSxFQUFFMUQsR0FBRyxFQUFFO0lBQzdCLE1BQU0sQ0FBQ3NCLENBQUMsRUFBRUMsQ0FBQyxDQUFDLEdBQUd2QixHQUFHO0lBQ2xCLElBQUl3RSxJQUFJLEdBQUc5RSxRQUFRLENBQUNDLHNCQUFzQixDQUFFLFFBQU8yQixDQUFFLEdBQUVDLENBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlEaUQsSUFBSSxDQUFDb0IsS0FBSyxDQUFDQyxLQUFLLEdBQUdoRixJQUFJLENBQUNrQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxRQUFRO0lBQ25ELElBQUlsQyxJQUFJLENBQUNrQyxNQUFNLENBQUMsQ0FBQyxFQUFFO01BQ2xCLElBQUksQ0FBQzZCLFNBQVMsQ0FBQ2xCLE1BQU0sRUFBRSxDQUFDLENBQUM7TUFDekIsS0FBSyxNQUFNcUIsSUFBSSxJQUFJckIsTUFBTSxFQUFFO1FBQzFCLE1BQU0sQ0FBQ3BDLENBQUMsRUFBRUMsQ0FBQyxDQUFDLEdBQUd3RCxJQUFJO1FBQ25CUCxJQUFJLEdBQUc5RSxRQUFRLENBQUNDLHNCQUFzQixDQUFFLFFBQU8yQixDQUFFLEdBQUVDLENBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFEaUQsSUFBSSxDQUFDb0IsS0FBSyxDQUFDQyxLQUFLLEdBQUcsS0FBSztNQUN6QjtJQUNEO0VBQ0Q7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5UkEsTUFBTUUsSUFBSSxHQUFHLEVBQUU7QUFDZixNQUFNQyxPQUFPLEdBQUcsRUFBRTtBQUVYLFNBQVNDLGFBQWFBLENBQUEsRUFBRztFQUMvQixNQUFNQyxJQUFJLEdBQUd4RyxRQUFRLENBQUN5RyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFFckQsTUFBTUMsSUFBSSxHQUFHQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUVILElBQUksQ0FBQztFQUVuREcsYUFBYSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEVBQUVELElBQUksQ0FBQztFQUVoRCxNQUFNRSxjQUFjLEdBQUdELGFBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLGdCQUFnQixFQUFFRCxJQUFJLENBQUM7RUFDdkUsTUFBTUcsU0FBUyxHQUFHRixhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUVELElBQUksQ0FBQztFQUM3REMsYUFBYSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFRSxTQUFTLENBQUM7RUFDMURGLGFBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLGFBQWEsRUFBRUUsU0FBUyxDQUFDO0VBQ2pERixhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUVDLGNBQWMsQ0FBQztFQUNsREQsYUFBYSxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFQyxjQUFjLENBQUM7RUFFdkQsTUFBTUUsU0FBUyxHQUFHSCxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUVELElBQUksQ0FBQztFQUM3RCxNQUFNSyxhQUFhLEdBQUdKLGFBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRUcsU0FBUyxDQUFDO0VBQzFFLE1BQU1FLGNBQWMsR0FBR0wsYUFBYSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUVHLFNBQVMsQ0FBQztFQUU1RUgsYUFBYSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFSSxhQUFhLENBQUM7RUFDL0NFLGdCQUFnQixDQUFDRixhQUFhLENBQUM7RUFDL0JHLGdCQUFnQixDQUFDSCxhQUFhLENBQUM7RUFDL0JJLFdBQVcsQ0FBQ0osYUFBYSxDQUFDO0VBRTFCSixhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUVLLGNBQWMsQ0FBQztFQUNoREMsZ0JBQWdCLENBQUNELGNBQWMsQ0FBQztFQUNoQ0UsZ0JBQWdCLENBQUNGLGNBQWMsQ0FBQztFQUNoQ0csV0FBVyxDQUFDSCxjQUFjLENBQUM7QUFDNUI7QUFFTyxTQUFTSSxVQUFVQSxDQUFDckcsS0FBSyxFQUFFc0csTUFBTSxFQUFFO0VBQ3pDLEtBQUssTUFBTSxDQUFDM0QsQ0FBQyxFQUFFNEQsR0FBRyxDQUFDLElBQUl2RyxLQUFLLENBQUNzQixHQUFHLENBQUNrRixPQUFPLENBQUMsQ0FBQyxFQUFFO0lBQzNDLEtBQUssTUFBTXRCLENBQUMsSUFBSXFCLEdBQUcsQ0FBQ2xFLElBQUksQ0FBQyxDQUFDLEVBQUU7TUFDM0IsTUFBTW9FLE9BQU8sR0FBR3hILFFBQVEsQ0FBQ0Msc0JBQXNCLENBQUUsUUFBT3lELENBQUUsR0FBRXVDLENBQUUsRUFBQyxDQUFDO01BQ2hFdUIsT0FBTyxDQUFDSCxNQUFNLENBQUMsQ0FBQ25ILFdBQVcsR0FBRyxFQUFFO01BQ2hDc0gsT0FBTyxDQUFDSCxNQUFNLENBQUMsQ0FBQ25CLEtBQUssQ0FBQ0MsS0FBSyxHQUFHLE9BQU87SUFDdEM7RUFDRDtBQUNEO0FBRU8sU0FBU2pILG1CQUFtQkEsQ0FBQzZCLEtBQUssRUFBRTtFQUMxQyxLQUFLLE1BQU0sQ0FBQzJDLENBQUMsRUFBRTRELEdBQUcsQ0FBQyxJQUFJdkcsS0FBSyxDQUFDc0IsR0FBRyxDQUFDa0YsT0FBTyxDQUFDLENBQUMsRUFBRTtJQUMzQyxLQUFLLE1BQU0sQ0FBQ3RCLENBQUMsRUFBRW5CLElBQUksQ0FBQyxJQUFJd0MsR0FBRyxDQUFDQyxPQUFPLENBQUMsQ0FBQyxFQUFFO01BQ3RDLE1BQU1DLE9BQU8sR0FBR3hILFFBQVEsQ0FBQ0Msc0JBQXNCLENBQUUsUUFBT3lELENBQUUsR0FBRXVDLENBQUUsRUFBQyxDQUFDO01BQ2hFdUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDdEgsV0FBVyxHQUFHNEUsSUFBSSxLQUFLLEdBQUcsSUFBSUEsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUdBLElBQUk7SUFDbkU7RUFDRDtBQUNEO0FBRU8sU0FBUzNGLGFBQWFBLENBQUM0QixLQUFLLEVBQUVvQixJQUFJLEVBQUU7RUFDMUMsTUFBTSxDQUFDUCxDQUFDLEVBQUVDLENBQUMsQ0FBQyxHQUFHTSxJQUFJO0VBQ25CLE1BQU1xRixPQUFPLEdBQUd4SCxRQUFRLENBQUNDLHNCQUFzQixDQUFFLFFBQU8yQixDQUFFLEdBQUVDLENBQUUsRUFBQyxDQUFDO0VBQ2hFMkYsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDdEgsV0FBVyxHQUFHYSxLQUFLLENBQUNzQixHQUFHLENBQUNULENBQUMsQ0FBQyxDQUFDQyxDQUFDLENBQUM7QUFDekM7QUFFQSxTQUFTOEUsYUFBYUEsQ0FBQ2MsSUFBSSxFQUFFQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsTUFBTSxFQUFFO0VBQ3JELE1BQU1KLE9BQU8sR0FBR3hILFFBQVEsQ0FBQzJHLGFBQWEsQ0FBQ2MsSUFBSSxDQUFDO0VBQzVDRCxPQUFPLENBQUN0SCxXQUFXLEdBQUd3SCxJQUFJO0VBQzFCLElBQUlDLFNBQVMsRUFBRTtJQUNkSCxPQUFPLENBQUNLLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDSCxTQUFTLENBQUM7RUFDakM7RUFFQUMsTUFBTSxDQUFDRyxXQUFXLENBQUNQLE9BQU8sQ0FBQztFQUMzQixPQUFPQSxPQUFPO0FBQ2Y7QUFFQSxTQUFTTCxXQUFXQSxDQUFDUyxNQUFNLEVBQUU7RUFDNUIsTUFBTTdHLEtBQUssR0FBRzRGLGFBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRWlCLE1BQU0sQ0FBQztFQUN2RCxLQUFLLElBQUlsRSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcyQyxJQUFJLEVBQUUzQyxDQUFDLEVBQUUsRUFBRTtJQUM5QixLQUFLLElBQUl1QyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdLLE9BQU8sRUFBRUwsQ0FBQyxFQUFFLEVBQUU7TUFDakMsTUFBTW5CLElBQUksR0FBRzZCLGFBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTVGLEtBQUssQ0FBQztNQUNwRCtELElBQUksQ0FBQytDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFFLFFBQU9wRSxDQUFFLEdBQUV1QyxDQUFFLEVBQUMsQ0FBQztJQUNwQztFQUNEO0VBRUEsT0FBT2xGLEtBQUs7QUFDYjtBQUVBLFNBQVNtRyxnQkFBZ0JBLENBQUNVLE1BQU0sRUFBRTtFQUNqQyxNQUFNSSxVQUFVLEdBQUdyQixhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUVpQixNQUFNLENBQUM7RUFDakUsS0FBSyxJQUFJbEUsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHMkMsSUFBSSxFQUFFM0MsQ0FBQyxFQUFFLEVBQUU7SUFDOUJpRCxhQUFhLENBQUMsS0FBSyxFQUFFakQsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUVzRSxVQUFVLENBQUM7RUFDbEQ7RUFFQSxPQUFPQSxVQUFVO0FBQ2xCO0FBRUEsU0FBU2YsZ0JBQWdCQSxDQUFDVyxNQUFNLEVBQUU7RUFDakMsTUFBTUssVUFBVSxHQUFHdEIsYUFBYSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFaUIsTUFBTSxDQUFDO0VBQ2pFLEtBQUssSUFBSWxFLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzRDLE9BQU8sRUFBRTVDLENBQUMsRUFBRSxFQUFFO0lBQ2pDaUQsYUFBYSxDQUFDLEtBQUssRUFBRTdDLE1BQU0sQ0FBQ29FLFlBQVksQ0FBQyxFQUFFLEdBQUd4RSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUV1RSxVQUFVLENBQUM7RUFDeEU7RUFFQSxPQUFPQSxVQUFVO0FBQ2xCOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEdzQztBQUUvQixTQUFTakosV0FBV0EsQ0FBQSxFQUFHO0VBQzdCbUosd0JBQXdCLENBQUMsQ0FBQztFQUMxQixPQUFPLElBQUkzSCxPQUFPLENBQUVDLE9BQU8sSUFBSztJQUMvQixNQUFNMkgsUUFBUSxHQUFHQyxXQUFXLENBQUMsTUFBTTtNQUNsQyxJQUFJQyxVQUFVLEtBQUssSUFBSSxFQUFFO1FBQ3hCN0gsT0FBTyxDQUFDNkgsVUFBVSxDQUFDO1FBQ25CQyxhQUFhLENBQUNILFFBQVEsQ0FBQztRQUN2QkUsVUFBVSxHQUFHLElBQUk7TUFDbEI7SUFDRCxDQUFDLEVBQUUsR0FBRyxDQUFDO0VBQ1IsQ0FBQyxDQUFDO0FBQ0g7QUFFQSxJQUFJQSxVQUFVLEdBQUcsSUFBSTtBQUVkLFNBQVNySixjQUFjQSxDQUFDOEIsS0FBSyxFQUFFO0VBQ3JDLElBQUlvQixJQUFJO0VBQ1IsTUFBTWlDLElBQUksR0FBR3JELEtBQUssQ0FBQ3NCLEdBQUcsQ0FBQ25CLE1BQU0sR0FBRyxDQUFDO0VBQ2pDLElBQUlILEtBQUssQ0FBQ3VCLG1CQUFtQixJQUFJdkIsS0FBSyxDQUFDd0IsV0FBVyxLQUFLLElBQUksRUFBRTtJQUM1RCxJQUFJLENBQUNYLENBQUMsRUFBRUMsQ0FBQyxDQUFDLEdBQUdkLEtBQUssQ0FBQzBCLE9BQU87SUFDMUJiLENBQUMsR0FBR0ksTUFBTSxDQUFDSixDQUFDLENBQUM7SUFDYkMsQ0FBQyxHQUFHRyxNQUFNLENBQUNILENBQUMsQ0FBQztJQUViLE1BQU0yRyxVQUFVLEdBQUcsQ0FDbEIsQ0FBQzVHLENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ1QsSUFDQ0EsQ0FBQyxHQUFHLENBQUMsSUFDTGQsS0FBSyxDQUFDc0IsR0FBRyxDQUFDVCxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLbUIsNENBQUksSUFDNUJqQyxLQUFLLENBQUNzQixHQUFHLENBQUNULENBQUMsQ0FBQyxDQUFDQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUtrQiwyQ0FBRyxJQUMzQmhDLEtBQUssQ0FBQ1csYUFBYSxDQUFDbUUsT0FBTyxDQUFFLEdBQUVqRSxDQUFFLEdBQUVDLENBQUMsR0FBRyxDQUFFLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNqRDtRQUNELE9BQVEsR0FBRUQsQ0FBRSxHQUFFQyxDQUFDLEdBQUcsQ0FBRSxFQUFDO01BQ3RCO0lBQ0QsQ0FBQyxFQUNELENBQUNELENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ1QsSUFDQ0QsQ0FBQyxHQUFHLENBQUMsSUFDTGIsS0FBSyxDQUFDc0IsR0FBRyxDQUFDVCxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLbUIsNENBQUksSUFDNUJqQyxLQUFLLENBQUNzQixHQUFHLENBQUNULENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEtBQUtrQiwyQ0FBRyxJQUMzQmhDLEtBQUssQ0FBQ1csYUFBYSxDQUFDbUUsT0FBTyxDQUFFLEdBQUVqRSxDQUFDLEdBQUcsQ0FBRSxHQUFFQyxDQUFFLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNqRDtRQUNELE9BQVEsR0FBRUQsQ0FBQyxHQUFHLENBQUUsR0FBRUMsQ0FBRSxFQUFDO01BQ3RCO0lBQ0QsQ0FBQyxFQUNELENBQUNELENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ1QsSUFDQ0EsQ0FBQyxHQUFHdUMsSUFBSSxJQUNSckQsS0FBSyxDQUFDc0IsR0FBRyxDQUFDVCxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLbUIsNENBQUksSUFDNUJqQyxLQUFLLENBQUNzQixHQUFHLENBQUNULENBQUMsQ0FBQyxDQUFDQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUtrQiwyQ0FBRyxJQUMzQmhDLEtBQUssQ0FBQ1csYUFBYSxDQUFDbUUsT0FBTyxDQUFFLEdBQUVqRSxDQUFFLEdBQUVDLENBQUMsR0FBRyxDQUFFLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNqRDtRQUNELE9BQVEsR0FBRUQsQ0FBRSxHQUFFQyxDQUFDLEdBQUcsQ0FBRSxFQUFDO01BQ3RCO0lBQ0QsQ0FBQyxFQUNELENBQUNELENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ1QsSUFDQ0QsQ0FBQyxHQUFHd0MsSUFBSSxJQUNSckQsS0FBSyxDQUFDc0IsR0FBRyxDQUFDVCxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLbUIsNENBQUksSUFDNUJqQyxLQUFLLENBQUNzQixHQUFHLENBQUNULENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEtBQUtrQiwyQ0FBRyxJQUMzQmhDLEtBQUssQ0FBQ1csYUFBYSxDQUFDbUUsT0FBTyxDQUFFLEdBQUVqRSxDQUFDLEdBQUcsQ0FBRSxHQUFF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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDRDQUE0QyxrSEFBa0gsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxVQUFVLFdBQVcsV0FBVyxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLE1BQU0sS0FBSyxVQUFVLFdBQVcsVUFBVSxVQUFVLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxNQUFNLEtBQUssVUFBVSxXQUFXLFdBQVcsVUFBVSxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxVQUFVLFVBQVUs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SyxDQUFDLENBQUM7RUFDaEI7QUFDRCxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vc3JjL2dlbmVyYXRlRE9NLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vZGlzdC9jc3Mvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vZGlzdC9jc3Mvc3R5bGUuY3NzP2YxNmUiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXB1dGVyQm9hcmQsIFBsYXllckJvYXJkfSBmcm9tICcuL2dhbWVib2FyZCc7XG5pbXBvcnQge3BsYXllckh1bWFuLCBwbGF5ZXJDb21wdXRlcn0gZnJvbSAnLi9wbGF5ZXInO1xuaW1wb3J0IHtmaWxsUGxheWVyQm9hcmRzRE9NLCBwbGF5ZXJTaG90RE9NfSBmcm9tICcuL2dlbmVyYXRlRE9NJztcblxuY29uc3QgREVMQVkgPSA4MDA7XG5cbmV4cG9ydCBjbGFzcyBHYW1lIHtcblx0Y29uc3RydWN0b3IocGxheWVyMSwgcGxheWVyMikge1xuXHRcdHRoaXMucGxheWVyQm9hcmQgPSBuZXcgUGxheWVyQm9hcmQocGxheWVyMSk7XG5cdFx0dGhpcy5jb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyQm9hcmQocGxheWVyMik7XG5cdFx0dGhpcy5maWxsQm9hcmRQbGF5ZXIoKTtcblx0XHR0aGlzLmZpbGxCb2FyZENvbXB1dGVyKCk7XG5cdFx0ZmlsbFBsYXllckJvYXJkc0RPTSh0aGlzLnBsYXllckJvYXJkKTtcblx0fVxuXG5cdHJlc2V0KCkge1xuXHRcdHRoaXMucGxheWVyQm9hcmQgPSBuZXcgUGxheWVyQm9hcmQodGhpcy5wbGF5ZXJCb2FyZC5wbGF5ZXIpO1xuXHRcdHRoaXMuY29tcHV0ZXJCb2FyZCA9IG5ldyBDb21wdXRlckJvYXJkKHRoaXMuY29tcHV0ZXJCb2FyZC5wbGF5ZXIpO1xuXHRcdHRoaXMuZmlsbEJvYXJkUGxheWVyKCk7XG5cdFx0dGhpcy5maWxsQm9hcmRDb21wdXRlcigpO1xuXHRcdGZpbGxQbGF5ZXJCb2FyZHNET00odGhpcy5wbGF5ZXJCb2FyZCk7XG5cdFx0Y29uc3Qgd2luZXJMYWJlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbm5lckxhYmVsJylbMF07XG5cdFx0d2luZXJMYWJlbC50ZXh0Q29udGVudCA9ICcnO1xuXHR9XG5cblx0YXN5bmMgc3RhcnQoKSB7XG5cdFx0bGV0IHR1cm4gPSAncGxheWVyJztcblx0XHRsZXQgd2lubmVyID0gbnVsbDtcblx0XHR3aGlsZSAoIXdpbm5lcikge1xuXHRcdFx0aWYgKHR1cm4gPT09ICdwbGF5ZXInKSB7XG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG5cdFx0XHRcdGNvbnN0IGhpdCA9IGF3YWl0IHRoaXMucGxheWVyU2hvdCgpO1xuXHRcdFx0XHRpZiAoaGl0KSB7XG5cdFx0XHRcdFx0dHVybiA9ICdjb21wdXRlcic7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodHVybiA9PT0gJ2NvbXB1dGVyJykge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuXHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQocmVzb2x2ZSwgREVMQVkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y29uc3QgaGl0ID0gdGhpcy5jb21wdXRlclNob3QoKTtcblxuXHRcdFx0XHRpZiAoaGl0KSB7XG5cdFx0XHRcdFx0dHVybiA9ICdwbGF5ZXInO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHdpbm5lciA9IHRoaXMuY2hlY2tXaW5uZXIoKTtcblx0XHR9XG5cblx0XHRjb25zdCB3aW5lckxhYmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2lubmVyTGFiZWwnKVswXTtcblx0XHR3aW5lckxhYmVsLnRleHRDb250ZW50ID0gYCR7d2lubmVyfSB3b24gdGhlIGdhbWUhYDtcblx0fVxuXG5cdGZpbGxCb2FyZFBsYXllcigpIHtcblx0XHR0aGlzLiNyYW5kb21HZW5lcmF0aW9uKHRoaXMucGxheWVyQm9hcmQpO1xuXHR9XG5cblx0ZmlsbEJvYXJkQ29tcHV0ZXIoKSB7XG5cdFx0dGhpcy4jcmFuZG9tR2VuZXJhdGlvbih0aGlzLmNvbXB1dGVyQm9hcmQpO1xuXHR9XG5cblx0I3JhbmRvbUdlbmVyYXRpb24oYm9hcmQpIHtcblx0XHRjb25zdCBzaGlwc0xlbmd0aCA9IFs0LCAzLCAzLCAyLCAyLCAyLCAxLCAxLCAxLCAxXTtcblx0XHRjb25zdCBkaXIgPSBbJ3gnLCAneSddO1xuXHRcdHdoaWxlIChzaGlwc0xlbmd0aC5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBzaGlwID0gc2hpcHNMZW5ndGhbMF07XG5cdFx0XHRsZXQgcGxhY2VkID0gZmFsc2U7XG5cdFx0XHRsZXQgYXR0ZW1wdHMgPSAwO1xuXHRcdFx0d2hpbGUgKCFwbGFjZWQgJiYgYXR0ZW1wdHMgPCAxMDApIHtcblx0XHRcdFx0Y29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKFxuXHRcdFx0XHRcdE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllckJvYXJkLnBvc3NpYmxlU2hvdHMubGVuZ3RoLFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRjb25zdCBjb29yZGluYXRlID0gdGhpcy5wbGF5ZXJCb2FyZC5wb3NzaWJsZVNob3RzW3JhbmRvbUluZGV4XTtcblx0XHRcdFx0Y29uc3QgW3gsIHldID0gY29vcmRpbmF0ZTtcblx0XHRcdFx0Y29uc3QgcmFuZG9tRGlyID0gZGlyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpXTtcblx0XHRcdFx0aWYgKGJvYXJkLl9jaGVja0NvbmRpdGlvbnMoc2hpcCwgTnVtYmVyKHgpLCBOdW1iZXIoeSksIHJhbmRvbURpcikpIHtcblx0XHRcdFx0XHRib2FyZC5wbGFjZVNoaXAoc2hpcCwgTnVtYmVyKHgpLCBOdW1iZXIoeSksIHJhbmRvbURpcik7XG5cdFx0XHRcdFx0c2hpcHNMZW5ndGguc2hpZnQoKTtcblx0XHRcdFx0XHRwbGFjZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YXR0ZW1wdHMrKztcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFwbGFjZWQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29tcHV0ZXJTaG90KCkge1xuXHRcdGNvbnN0IHNob3QgPSBwbGF5ZXJDb21wdXRlcih0aGlzLnBsYXllckJvYXJkKTtcblx0XHR0aGlzLnBsYXllckJvYXJkLnJlY2VpdmVBdHRhY2soc2hvdCk7XG5cdFx0ZmlsbFBsYXllckJvYXJkc0RPTSh0aGlzLnBsYXllckJvYXJkKTtcblx0XHRjb25zdCBbeCwgeV0gPSBzaG90O1xuXHRcdGlmICh0aGlzLnBsYXllckJvYXJkLm1hcFt4XVt5XSA9PT0gJ+KYkicpIHtcblx0XHRcdHRoaXMucGxheWVyQm9hcmQuaXNQcmV2aW91c0F0dGFja0hpdCA9IHRydWU7XG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJCb2FyZC5kYW1hZ2VkU2hpcCA9PT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnBsYXllckJvYXJkLmZpcnN0SGl0Q29vcmQgPSBzaG90O1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnBsYXllckJvYXJkLmxhc3RIaXQgPSBzaG90O1xuXHRcdFx0dGhpcy5wbGF5ZXJCb2FyZC5nZXREYW1hZ2VkU2hpcCgpO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5wbGF5ZXJCb2FyZC5pc1ByZXZpb3VzQXR0YWNrSGl0ID0gZmFsc2U7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRhc3luYyBwbGF5ZXJTaG90KCkge1xuXHRcdGNvbnN0IHNob3QgPSBhd2FpdCBwbGF5ZXJIdW1hbigpO1xuXHRcdHRoaXMuY29tcHV0ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHNob3QpO1xuXHRcdHBsYXllclNob3RET00odGhpcy5jb21wdXRlckJvYXJkLCBzaG90KTtcblx0XHRjb25zdCBbeCwgeV0gPSBzaG90O1xuXHRcdGlmICh0aGlzLmNvbXB1dGVyQm9hcmQubWFwW3hdW3ldID09PSAn4piSJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Y2hlY2tXaW5uZXIoKSB7XG5cdFx0aWYgKHRoaXMucGxheWVyQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY29tcHV0ZXJCb2FyZC5wbGF5ZXI7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuY29tcHV0ZXJCb2FyZC5jaGVja0FsbFNoaXBzU3VuaygpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wbGF5ZXJCb2FyZC5wbGF5ZXI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cbiIsImltcG9ydCB7U2hpcH0gZnJvbSAnLi9zaGlwJztcblxuY29uc3QgU0hJUF9DRUxMID0gJ+KYkCc7XG5jb25zdCBFTVBUWV9DRUxMID0gJ08nO1xuZXhwb3J0IGNvbnN0IEhJVCA9ICfimJInO1xuZXhwb3J0IGNvbnN0IE1JU1MgPSAnwrcnO1xuXG5leHBvcnQgY2xhc3MgR2FtZWJvYXJkIHtcblx0Y29uc3RydWN0b3IocGxheWVyKSB7XG5cdFx0dGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG5cdH1cblxuXHRsaXN0T2ZTaGlwcyA9IG5ldyBNYXAoKTtcblxuXHRtYXAgPSBbXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdFx0WycgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJ10sXG5cdF07XG5cblx0Y2hlY2tBbGxTaGlwc1N1bmsoKSB7XG5cdFx0Zm9yIChjb25zdCBzaGlwIG9mIHRoaXMubGlzdE9mU2hpcHMua2V5cygpKSB7XG5cdFx0XHRpZiAoIXNoaXAuaXNTdW5rKCkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cGxhY2VTaGlwKHNoaXBMZW5ndGgsIHhDZWxsLCB5Q2VsbCwgZGlyKSB7XG5cdFx0aWYgKCF0aGlzLl9jaGVja0NvbmRpdGlvbnMoc2hpcExlbmd0aCwgeENlbGwsIHlDZWxsLCBkaXIpKSB7XG5cdFx0XHRyZXR1cm4gYNCY0LfQvNC10L3QuNGC0LUg0LLQstC+0LQgJHtzaGlwTGVuZ3RofSAke3hDZWxsfSAke3lDZWxsfSAke2Rpcn1gO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNoaXAgPSBuZXcgU2hpcChzaGlwTGVuZ3RoKTtcblx0XHRjb25zdCBzaGlwUG9zaXRpb24gPSBbXTtcblx0XHRpZiAoZGlyID09PSAneCcpIHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR0aGlzLm1hcFt4Q2VsbF1beUNlbGwgKyBpXSA9IFNISVBfQ0VMTDtcblx0XHRcdFx0c2hpcFBvc2l0aW9uLnB1c2goYCR7eENlbGx9JHt5Q2VsbCArIGl9YCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChkaXIgPT09ICd5Jykge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHRoaXMubWFwW3hDZWxsICsgaV1beUNlbGxdID0gU0hJUF9DRUxMO1xuXHRcdFx0XHRzaGlwUG9zaXRpb24ucHVzaChgJHt4Q2VsbCArIGl9JHt5Q2VsbH1gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLiNmaWxsQWRqYWNlbnRDZWxscyhzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcik7XG5cblx0XHR0aGlzLmxpc3RPZlNoaXBzLnNldChzaGlwLCBzaGlwUG9zaXRpb24pO1xuXHR9XG5cblx0cmVjZWl2ZUF0dGFjayhjb29yZGluYXRlKSB7XG5cdFx0Y29uc3QgW3gsIHldID0gWy4uLlN0cmluZyhjb29yZGluYXRlKV07XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdFx0dGhpcy5tYXBbeF1beV0gPT09IFNISVBfQ0VMTFxuXHRcdFx0PyAodGhpcy5faGl0U2hpcChjb29yZGluYXRlKSwgKHRoaXMubWFwW3hdW3ldID0gSElUKSlcblx0XHRcdDogKHRoaXMubWFwW3hdW3ldID0gTUlTUyk7XG5cdH1cblxuXHRfaGl0U2hpcChjb29yZGluYXRlKSB7XG5cdFx0bGV0IGhpdCA9IGZhbHNlO1xuXHRcdGZvciAoY29uc3QgW3NoaXAsIGNvb3Jkc10gb2YgdGhpcy5saXN0T2ZTaGlwcykge1xuXHRcdFx0aWYgKGNvb3Jkcy5pbmNsdWRlcyhjb29yZGluYXRlKSkge1xuXHRcdFx0XHRzaGlwLmhpdCgpO1xuXHRcdFx0XHR0aGlzLmlzU3Vua1NoaXAoc2hpcCwgY29vcmRzLCBjb29yZGluYXRlKTtcblx0XHRcdFx0aGl0ID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhpdDtcblx0fVxuXG5cdCNmaWxsQWRqYWNlbnRDZWxscyhzaXplLCB4Q2VsbCwgeUNlbGwsIGRpcmVjdGlvbikge1xuXHRcdGNvbnN0IHhTdGFydCA9IHhDZWxsIC0gMTtcblx0XHRjb25zdCB4RW5kID0gZGlyZWN0aW9uID09PSAneCcgPyB4Q2VsbCArIDEgOiB4Q2VsbCArIHNpemU7XG5cdFx0Y29uc3QgeVN0YXJ0ID0geUNlbGwgLSAxO1xuXHRcdGNvbnN0IHlFbmQgPSBkaXJlY3Rpb24gPT09ICd5JyA/IHlDZWxsICsgMSA6IHlDZWxsICsgc2l6ZTtcblxuXHRcdGZvciAobGV0IHggPSB4U3RhcnQ7IHggPD0geEVuZDsgeCsrKSB7XG5cdFx0XHRmb3IgKGxldCB5ID0geVN0YXJ0OyB5IDw9IHlFbmQ7IHkrKykge1xuXHRcdFx0XHRpZiAoeCA+PSAwICYmIHggPCB0aGlzLm1hcC5sZW5ndGggJiYgeSA+PSAwICYmIHkgPCB0aGlzLm1hcC5sZW5ndGgpIHtcblx0XHRcdFx0XHR0aGlzLm1hcFt4XVt5XSA9XG5cdFx0XHRcdFx0XHR0aGlzLm1hcFt4XVt5XSA9PT0gU0hJUF9DRUxMID8gU0hJUF9DRUxMIDogRU1QVFlfQ0VMTDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdF9jaGVja0NvbmRpdGlvbnMoc2hpcExlbmd0aCwgeENlbGwsIHlDZWxsLCBkaXIpIHtcblx0XHRpZiAodGhpcy4jaXNDb3JyZWN0Q29vcmRpbmF0ZShzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcikpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5saXN0T2ZTaGlwcy5zaXplICYmIHRoaXMuI2lzU2hpcENyb3NzaW5nKGAke3hDZWxsfSR7eUNlbGx9YCkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHR0aGlzLmxpc3RPZlNoaXBzLnNpemUgJiZcblx0XHRcdHRoaXMuI2lzQWRqYWNlbnRDcm9zc2luZyhzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcilcblx0XHQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdCNpc0NvcnJlY3RDb29yZGluYXRlKGxlbmd0aCwgeCwgeSwgZGlyKSB7XG5cdFx0cmV0dXJuICEoZGlyID09PSAneCdcblx0XHRcdD8gbGVuZ3RoICsgeSA8PSB0aGlzLm1hcC5sZW5ndGggJiYgeCA8IHRoaXMubWFwLmxlbmd0aFxuXHRcdFx0OiB5IDwgdGhpcy5tYXAubGVuZ3RoICYmIGxlbmd0aCArIHggPD0gdGhpcy5tYXAubGVuZ3RoKTtcblx0fVxuXG5cdCNpc1NoaXBDcm9zc2luZyA9IChjZWxsKSA9PlxuXHRcdFsuLi50aGlzLmxpc3RPZlNoaXBzXS5zb21lKChbLCBwb3NpdGlvbl0pID0+IHBvc2l0aW9uLmluY2x1ZGVzKGNlbGwpKTtcblxuXHQjaXNBZGphY2VudENyb3NzaW5nKHNpemUsIHgsIHksIGRpcikge1xuXHRcdGlmICh0aGlzLm1hcFt4XVt5XSA9PT0gRU1QVFlfQ0VMTCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKGRpciA9PT0gJ3gnICYmIHNpemUgPiAxKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHNpemU7IGkrKykge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5tYXBbeF1beSArIGldID09PSBTSElQX0NFTEwgfHxcblx0XHRcdFx0XHR0aGlzLm1hcFt4XVt5ICsgaV0gPT09IEVNUFRZX0NFTExcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3knICYmIHNpemUgPiAxKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHNpemU7IGkrKykge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5tYXBbeCArIGldW3ldID09PSBTSElQX0NFTEwgfHxcblx0XHRcdFx0XHR0aGlzLm1hcFt4ICsgaV1beV0gPT09IEVNUFRZX0NFTExcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRmaWxsQ2VsbHMoc2hpcENvb3JkcywgbnVtYmVyRGVzaykge1xuXHRcdGZvciAoY29uc3QgY29vciBvZiBzaGlwQ29vcmRzKSB7XG5cdFx0XHRjb25zdCBbeCwgeV0gPSBjb29yO1xuXHRcdFx0dGhpcy5maWxsU2luZ2xlQ2VsbChOdW1iZXIoeCksIE51bWJlcih5KSwgbnVtYmVyRGVzayk7XG5cdFx0fVxuXHR9XG5cblx0ZmlsbFNpbmdsZUNlbGwoeCwgeSwgbnVtYmVyRGVzaykge1xuXHRcdGxldCBjZWxsO1xuXHRcdGNvbnN0IFNJWkUgPSB0aGlzLm1hcC5sZW5ndGggLSAxO1xuXHRcdGNvbnN0IG9mZnNldHMgPSBbLTEsIDAsIDFdO1xuXHRcdGZvciAoY29uc3QgZHggb2Ygb2Zmc2V0cykge1xuXHRcdFx0Zm9yIChjb25zdCBkeSBvZiBvZmZzZXRzKSB7XG5cdFx0XHRcdGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbmV3WCA9IHggKyBkeDtcblx0XHRcdFx0Y29uc3QgbmV3WSA9IHkgKyBkeTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG5ld1ggPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1ggPD0gU0laRSAmJlxuXHRcdFx0XHRcdG5ld1kgPj0gMCAmJlxuXHRcdFx0XHRcdG5ld1kgPD0gU0laRSAmJlxuXHRcdFx0XHRcdHRoaXMubWFwW25ld1hdW25ld1ldID09PSBFTVBUWV9DRUxMXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlmIChudW1iZXJEZXNrID09PSAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLm1hcFtuZXdYXVtuZXdZXSA9IE1JU1M7XG5cdFx0XHRcdFx0XHRjb25zdCBjb29yID0gdGhpcy5wb3NzaWJsZVNob3RzLmluZGV4T2YoYCR7bmV3WH0ke25ld1l9YCk7XG5cdFx0XHRcdFx0XHR0aGlzLnBvc3NpYmxlU2hvdHMuc3BsaWNlKGNvb3IsIDEpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7bmV3WH0ke25ld1l9YClbXG5cdFx0XHRcdFx0XHRudW1iZXJEZXNrXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0XHRjZWxsLnRleHRDb250ZW50ID0gTUlTUztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgUGxheWVyQm9hcmQgZXh0ZW5kcyBHYW1lYm9hcmQge1xuXHRwb3NzaWJsZVNob3RzID0gW107XG5cdGlzUHJldmlvdXNBdHRhY2tIaXQgPSBmYWxzZTtcblx0cHJldmlvdXNDb29yZCA9ICcgJztcblx0Zmlyc3RIaXRDb29yZCA9ICcgJztcblx0ZGFtYWdlZFNoaXAgPSBudWxsO1xuXHRsYXN0SGl0ID0gJyAnO1xuXG5cdGNvbnN0cnVjdG9yKHBsYXllcikge1xuXHRcdHN1cGVyKHBsYXllcik7XG5cdFx0dGhpcy5maWxsUG9zc2libGVTaG90cygpO1xuXHR9XG5cblx0Z2V0RGFtYWdlZFNoaXAoKSB7XG5cdFx0Zm9yIChjb25zdCBbc2hpcCwgY29vcmRzXSBvZiB0aGlzLmxpc3RPZlNoaXBzKSB7XG5cdFx0XHRpZiAoY29vcmRzLmluY2x1ZGVzKHRoaXMucHJldmlvdXNDb29yZCkgJiYgIXNoaXAuaXNTdW5rKCkpIHtcblx0XHRcdFx0dGhpcy5kYW1hZ2VkU2hpcCA9IHNoaXA7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9IGVsc2UgaWYgKGNvb3Jkcy5pbmNsdWRlcyh0aGlzLmZpcnN0SGl0Q29vcmQpICYmIHNoaXAuaXNTdW5rKCkpIHtcblx0XHRcdFx0dGhpcy5kYW1hZ2VkU2hpcCA9IG51bGw7XG5cdFx0XHRcdHRoaXMuZmlyc3RIaXRDb29yZCA9ICcgJztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmaWxsUG9zc2libGVTaG90cygpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuXHRcdFx0XHR0aGlzLnBvc3NpYmxlU2hvdHMucHVzaChgJHtpfSR7an1gKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpc1N1bmtTaGlwKHNoaXAsIGNvb3JkcywgaGl0KSB7XG5cdFx0Y29uc3QgW3gsIHldID0gaGl0O1xuXHRcdGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgY2VsbC0ke3h9JHt5fWApWzBdO1xuXHRcdGNlbGwuc3R5bGUuY29sb3IgPSBzaGlwLmlzU3VuaygpID8gJ3JlZCcgOiAncHVycGxlJztcblx0XHRpZiAoc2hpcC5pc1N1bmsoKSkge1xuXHRcdFx0dGhpcy5maWxsQ2VsbHMoY29vcmRzLCAwKTtcblx0XHRcdGZvciAoY29uc3QgY29vciBvZiBjb29yZHMpIHtcblx0XHRcdFx0Y29uc3QgW3gsIHldID0gY29vcjtcblx0XHRcdFx0Y2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKVswXTtcblx0XHRcdFx0Y2VsbC5zdHlsZS5jb2xvciA9ICdyZWQnO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcHV0ZXJCb2FyZCBleHRlbmRzIEdhbWVib2FyZCB7XG5cdGhpZGRlbk1hcCA9IFtcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XTtcblxuXHRyZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcblx0XHRjb25zdCBbeCwgeV0gPSBbLi4uU3RyaW5nKGNvb3JkaW5hdGUpXTtcblx0XHRpZiAodGhpcy5tYXBbeF1beV0gPT09IFNISVBfQ0VMTCkge1xuXHRcdFx0dGhpcy5faGl0U2hpcChjb29yZGluYXRlKTtcblx0XHRcdHRoaXMubWFwW3hdW3ldID0gSElUO1xuXHRcdFx0dGhpcy5oaWRkZW5NYXBbeF1beV0gPSBISVQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubWFwW3hdW3ldID0gTUlTUztcblx0XHRcdHRoaXMuaGlkZGVuTWFwW3hdW3ldID0gTUlTUztcblx0XHR9XG5cdH1cblxuXHRpc1N1bmtTaGlwKHNoaXAsIGNvb3JkcywgaGl0KSB7XG5cdFx0Y29uc3QgW3gsIHldID0gaGl0O1xuXHRcdGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgY2VsbC0ke3h9JHt5fWApWzFdO1xuXHRcdGNlbGwuc3R5bGUuY29sb3IgPSBzaGlwLmlzU3VuaygpID8gJ3JlZCcgOiAncHVycGxlJztcblx0XHRpZiAoc2hpcC5pc1N1bmsoKSkge1xuXHRcdFx0dGhpcy5maWxsQ2VsbHMoY29vcmRzLCAxKTtcblx0XHRcdGZvciAoY29uc3QgY29vciBvZiBjb29yZHMpIHtcblx0XHRcdFx0Y29uc3QgW3gsIHldID0gY29vcjtcblx0XHRcdFx0Y2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKVsxXTtcblx0XHRcdFx0Y2VsbC5zdHlsZS5jb2xvciA9ICdyZWQnO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwiY29uc3QgUk9XUyA9IDEwO1xuY29uc3QgQ09MVU1OUyA9IDEwO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTaGVsbCgpIHtcblx0Y29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF07XG5cblx0Y29uc3QgbWFpbiA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnbWFpbicsIGJvZHkpO1xuXG5cdGNyZWF0ZUVsZW1lbnQoJ2gxJywgJ0JhdHRsZXNoaXAgZ2FtZScsICcnLCBtYWluKTtcblxuXHRjb25zdCBsYWJlbENvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnbGFiZWxDb250YWluZXInLCBtYWluKTtcblx0Y29uc3QgZGl2QnV0dG9uID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdkaXZCdXR0b24nLCBtYWluKTtcblx0Y3JlYXRlRWxlbWVudCgnYnV0dG9uJywgJ1N0YXJ0IEdhbWUnLCAnYnV0dG9uJywgZGl2QnV0dG9uKTtcblx0Y3JlYXRlRWxlbWVudCgnaDInLCAnJywgJ3dpbm5lckxhYmVsJywgZGl2QnV0dG9uKTtcblx0Y3JlYXRlRWxlbWVudCgncCcsICdZb3UnLCAnbGFiZWwnLCBsYWJlbENvbnRhaW5lcik7XG5cdGNyZWF0ZUVsZW1lbnQoJ3AnLCAnQ29tcHV0ZXInLCAnbGFiZWwnLCBsYWJlbENvbnRhaW5lcik7XG5cblx0Y29uc3QgY29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdjb250YWluZXInLCBtYWluKTtcblx0Y29uc3QgbGVmdENvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnbGVmdENvbnRhaW5lcicsIGNvbnRhaW5lcik7XG5cdGNvbnN0IHJpZ2h0Q29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdyaWdodENvbnRhaW5lcicsIGNvbnRhaW5lcik7XG5cblx0Y3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdmYWtlJywgbGVmdENvbnRhaW5lcik7XG5cdGNyZWF0ZUxldHRlckxpbmUobGVmdENvbnRhaW5lcik7XG5cdGNyZWF0ZU51bWJlckxpbmUobGVmdENvbnRhaW5lcik7XG5cdGNyZWF0ZUJvYXJkKGxlZnRDb250YWluZXIpO1xuXG5cdGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnZmFrZScsIHJpZ2h0Q29udGFpbmVyKTtcblx0Y3JlYXRlTGV0dGVyTGluZShyaWdodENvbnRhaW5lcik7XG5cdGNyZWF0ZU51bWJlckxpbmUocmlnaHRDb250YWluZXIpO1xuXHRjcmVhdGVCb2FyZChyaWdodENvbnRhaW5lcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhblNoZWxsKGJvYXJkLCBudW1iZXIpIHtcblx0Zm9yIChjb25zdCBbaSwgcm93XSBvZiBib2FyZC5tYXAuZW50cmllcygpKSB7XG5cdFx0Zm9yIChjb25zdCBqIG9mIHJvdy5rZXlzKCkpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7aX0ke2p9YCk7XG5cdFx0XHRlbGVtZW50W251bWJlcl0udGV4dENvbnRlbnQgPSAnJztcblx0XHRcdGVsZW1lbnRbbnVtYmVyXS5zdHlsZS5jb2xvciA9ICdibGFjayc7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxsUGxheWVyQm9hcmRzRE9NKGJvYXJkKSB7XG5cdGZvciAoY29uc3QgW2ksIHJvd10gb2YgYm9hcmQubWFwLmVudHJpZXMoKSkge1xuXHRcdGZvciAoY29uc3QgW2osIGNlbGxdIG9mIHJvdy5lbnRyaWVzKCkpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7aX0ke2p9YCk7XG5cdFx0XHRlbGVtZW50WzBdLnRleHRDb250ZW50ID0gY2VsbCA9PT0gJ08nIHx8IGNlbGwgPT09ICcgJyA/ICcgJyA6IGNlbGw7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGF5ZXJTaG90RE9NKGJvYXJkLCBzaG90KSB7XG5cdGNvbnN0IFt4LCB5XSA9IHNob3Q7XG5cdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7eH0ke3l9YCk7XG5cdGVsZW1lbnRbMV0udGV4dENvbnRlbnQgPSBib2FyZC5tYXBbeF1beV07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodHlwZSwgdGV4dCwgY2xhc3NOYW1lLCBwYXJlbnQpIHtcblx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cdGVsZW1lbnQudGV4dENvbnRlbnQgPSB0ZXh0O1xuXHRpZiAoY2xhc3NOYW1lKSB7XG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG5cdH1cblxuXHRwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cdHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCb2FyZChwYXJlbnQpIHtcblx0Y29uc3QgYm9hcmQgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2JvYXJkJywgcGFyZW50KTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBST1dTOyBpKyspIHtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IENPTFVNTlM7IGorKykge1xuXHRcdFx0Y29uc3QgY2VsbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnY2VsbCcsIGJvYXJkKTtcblx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZChgY2VsbC0ke2l9JHtqfWApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBib2FyZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTnVtYmVyTGluZShwYXJlbnQpIHtcblx0Y29uc3QgbnVtYmVyTGluZSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnbnVtYmVyTGluZScsIHBhcmVudCk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgUk9XUzsgaSsrKSB7XG5cdFx0Y3JlYXRlRWxlbWVudCgnZGl2JywgaSArIDEsICdudW1iZXInLCBudW1iZXJMaW5lKTtcblx0fVxuXG5cdHJldHVybiBudW1iZXJMaW5lO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMZXR0ZXJMaW5lKHBhcmVudCkge1xuXHRjb25zdCBsZXR0ZXJMaW5lID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdsZXR0ZXJMaW5lJywgcGFyZW50KTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBDT0xVTU5TOyBpKyspIHtcblx0XHRjcmVhdGVFbGVtZW50KCdkaXYnLCBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSksICdsZXR0ZXInLCBsZXR0ZXJMaW5lKTtcblx0fVxuXG5cdHJldHVybiBsZXR0ZXJMaW5lO1xufVxuIiwiaW1wb3J0IHtNSVNTLCBISVR9IGZyb20gJy4vZ2FtZWJvYXJkJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXllckh1bWFuKCkge1xuXHRzdGFydExpc3RlbmluZ1BsYXllclR1cm4oKTtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0Y29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZiAoc2hvdFBsYXllciAhPT0gbnVsbCkge1xuXHRcdFx0XHRyZXNvbHZlKHNob3RQbGF5ZXIpO1xuXHRcdFx0XHRjbGVhckludGVydmFsKGludGVydmFsKTtcblx0XHRcdFx0c2hvdFBsYXllciA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fSwgMTAwKTtcblx0fSk7XG59XG5cbmxldCBzaG90UGxheWVyID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXllckNvbXB1dGVyKGJvYXJkKSB7XG5cdGxldCBzaG90O1xuXHRjb25zdCBzaXplID0gYm9hcmQubWFwLmxlbmd0aCAtIDE7XG5cdGlmIChib2FyZC5pc1ByZXZpb3VzQXR0YWNrSGl0IHx8IGJvYXJkLmRhbWFnZWRTaGlwICE9PSBudWxsKSB7XG5cdFx0bGV0IFt4LCB5XSA9IGJvYXJkLmxhc3RIaXQ7XG5cdFx0eCA9IE51bWJlcih4KTtcblx0XHR5ID0gTnVtYmVyKHkpO1xuXG5cdFx0Y29uc3QgY29uZGl0aW9ucyA9IFtcblx0XHRcdCh4LCB5KSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR5ID4gMCAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4XVt5IC0gMV0gIT09IE1JU1MgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeF1beSAtIDFdICE9PSBISVQgJiZcblx0XHRcdFx0XHRib2FyZC5wb3NzaWJsZVNob3RzLmluZGV4T2YoYCR7eH0ke3kgLSAxfWApICE9PSAtMVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gYCR7eH0ke3kgLSAxfWA7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQoeCwgeSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0eCA+IDAgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeCAtIDFdW3ldICE9PSBNSVNTICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3ggLSAxXVt5XSAhPT0gSElUICYmXG5cdFx0XHRcdFx0Ym9hcmQucG9zc2libGVTaG90cy5pbmRleE9mKGAke3ggLSAxfSR7eX1gKSAhPT0gLTFcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGAke3ggLSAxfSR7eX1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0KHgsIHkpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHkgPCBzaXplICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3hdW3kgKyAxXSAhPT0gTUlTUyAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4XVt5ICsgMV0gIT09IEhJVCAmJlxuXHRcdFx0XHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihgJHt4fSR7eSArIDF9YCkgIT09IC0xXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiBgJHt4fSR7eSArIDF9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCh4LCB5KSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR4IDwgc2l6ZSAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4ICsgMV1beV0gIT09IE1JU1MgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeCArIDFdW3ldICE9PSBISVQgJiZcblx0XHRcdFx0XHRib2FyZC5wb3NzaWJsZVNob3RzLmluZGV4T2YoYCR7eCArIDF9JHt5fWApICE9PSAtMVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gYCR7eCArIDF9JHt5fWA7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XTtcblxuXHRcdGNvbnN0IHNodWZmbGUgPSBmdW5jdGlvbiAoYXJyYXkpIHtcblx0XHRcdGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XG5cdFx0XHRsZXQgcmFuZG9tSW5kZXg7XG5cblx0XHRcdHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcblx0XHRcdFx0cmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuXHRcdFx0XHRjdXJyZW50SW5kZXgtLTtcblxuXHRcdFx0XHRbYXJyYXlbY3VycmVudEluZGV4XSwgYXJyYXlbcmFuZG9tSW5kZXhdXSA9IFtcblx0XHRcdFx0XHRhcnJheVtyYW5kb21JbmRleF0sXG5cdFx0XHRcdFx0YXJyYXlbY3VycmVudEluZGV4XSxcblx0XHRcdFx0XTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGFycmF5O1xuXHRcdH07XG5cblx0XHRmb3IgKGNvbnN0IGNvbmRpdGlvbiBvZiBzaHVmZmxlKGNvbmRpdGlvbnMpKSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjb25kaXRpb24oeCwgeSk7XG5cblx0XHRcdGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRzaG90ID0gcmVzdWx0O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc2hvdCA9PT0gdW5kZWZpbmVkICYmIGJvYXJkLmRhbWFnZWRTaGlwICE9PSBudWxsKSB7XG5cdFx0XHRsZXQgW3hTLCB5U10gPSBib2FyZC5maXJzdEhpdENvb3JkO1xuXHRcdFx0eFMgPSBOdW1iZXIoeFMpO1xuXHRcdFx0eVMgPSBOdW1iZXIoeVMpO1xuXG5cdFx0XHRmb3IgKGNvbnN0IGNvbmRpdGlvbiBvZiBzaHVmZmxlKGNvbmRpdGlvbnMpKSB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGNvbmRpdGlvbih4UywgeVMpO1xuXHRcdFx0XHRpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRzaG90ID0gcmVzdWx0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHNob3QgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYm9hcmQucG9zc2libGVTaG90cy5sZW5ndGgpO1xuXHRcdFx0c2hvdCA9IGJvYXJkLnBvc3NpYmxlU2hvdHNbcmFuZG9tXTtcblx0XHR9XG5cblx0XHRjb25zdCBpbmRleCA9IGJvYXJkLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihzaG90KTtcblx0XHRib2FyZC5wb3NzaWJsZVNob3RzLnNwbGljZShpbmRleCwgMSk7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBib2FyZC5wb3NzaWJsZVNob3RzLmxlbmd0aCk7XG5cdFx0c2hvdCA9IGJvYXJkLnBvc3NpYmxlU2hvdHNbcmFuZG9tSW5kZXhdO1xuXHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcblx0fVxuXG5cdGJvYXJkLnByZXZpb3VzQ29vcmQgPSBzaG90O1xuXHRyZXR1cm4gc2hvdDtcbn1cblxuZnVuY3Rpb24gc3RhcnRMaXN0ZW5pbmdQbGF5ZXJUdXJuKCkge1xuXHRjb25zdCBmaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvYXJkJylbMV07XG5cdGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG5cdGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGJhY2tsaWdodCk7XG5cdGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgcmVzZXQpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVyKGUpIHtcblx0Y29uc3QgZmllbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2FyZCcpWzFdO1xuXHRpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykgJiYgZS50YXJnZXQudGV4dENvbnRlbnQgPT09ICcnKSB7XG5cdFx0c2hvdFBsYXllciA9IGUudGFyZ2V0LmNsYXNzTGlzdFsxXS5zbGljZSg1KTtcblx0XHRmaWVsZC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGJhY2tsaWdodChlKSB7XG5cdGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSkge1xuXHRcdGUudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgxLjA1KSc7XG5cdFx0ZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICdyZ2IoMjQ1LCAyNDUsIDI0NSknO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlc2V0KGUpIHtcblx0aWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKSB7XG5cdFx0ZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ25vbmUnO1xuXHRcdGUudGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAnd2hpdGUnO1xuXHR9XG59XG4iLCJleHBvcnQgY2xhc3MgU2hpcCB7XG5cdGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuXHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXHRcdHRoaXMuaGl0cyA9IDA7XG5cdH1cblxuXHRoaXQoKSB7XG5cdFx0dGhpcy5oaXRzKys7XG5cdH1cblxuXHRpc1N1bmsoKSB7XG5cdFx0cmV0dXJuIHRoaXMubGVuZ3RoID09PSB0aGlzLmhpdHM7XG5cdH1cbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuOnJvb3Qge1xuICAtLWNvbG9yLXByaW1hcnk6ICNmNWY1ZGM7XG4gIC0tY29sb3ItYm9yZGVyOiBibHVlO1xuICAtLWNvbG9yLWxhYmVsOiAjNGQ0ZDRkO1xuICAtLWNvbG9yLWJ1dHRvbjogIzRkNGQ0ZDkxO1xuICAtLWNvbG9yLXdpbm5lcjogIzExNWYxMztcbiAgLS1mb250OiBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZTtcbiAgLS1mb250LXNpemUtbGFyZ2U6IDNyZW07XG4gIC0tZm9udC1zaXplLW1haW46IDJyZW07XG4gIC0tZm9udC1zaXplLXNtYWxsOiAxcmVtO1xufVxuXG5ib2R5IHtcbiAgYmFja2dyb3VuZDogdmFyKC0tY29sb3ItcHJpbWFyeSk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5ib2R5IGgxIHtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQpO1xuICBmb250LXNpemU6IHZhcigtLWZvbnQtc2l6ZS1sYXJnZSk7XG4gIGNvbG9yOiB2YXIoLS1jb2xvci1ib3JkZXIpO1xuICBtYXJnaW46IDFyZW0gMDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4ubGFiZWxDb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgd2lkdGg6IDgwdnc7XG4gIGdhcDogNXJlbTtcbn1cbi5sYWJlbENvbnRhaW5lciAubGFiZWwge1xuICBmb250LXNpemU6IHZhcigtLWZvbnQtc2l6ZS1tYWluKTtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQpO1xuICBjb2xvcjogdmFyKC0tY29sb3ItbGFiZWwpO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgd2lkdGg6IDI1dmg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLmRpdkJ1dHRvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMXJlbTtcbn1cbi5kaXZCdXR0b24gLmJ1dHRvbiB7XG4gIGZvbnQtc2l6ZTogdmFyKC0tZm9udC1zaXplLW1haW4pO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2xvci1idXR0b24pO1xufVxuLmRpdkJ1dHRvbiAud2lubmVyTGFiZWwge1xuICBjb2xvcjogdmFyKC0tY29sb3Itd2lubmVyKTtcbiAgZm9udC1zaXplOiB2YXIoLS1mb250LXNpemUtbWFpbik7XG4gIGhlaWdodDogdmFyKC0tZm9udC1zaXplLW1haW4pO1xuICBtYXJnaW4tYm90dG9tOiB2YXIoLS1mb250LXNpemUtbWFpbik7XG59XG5cbi5tYWluIHtcbiAgaGVpZ2h0OiAxMDBkdmg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uY29udGFpbmVyIHtcbiAgaGVpZ2h0OiBhdXRvO1xuICB3aWR0aDogNzB2dztcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZ2FwOiAzcmVtO1xuICBtYXJnaW46IDAgYXV0bztcbn1cbi5jb250YWluZXIgLmxlZnRDb250YWluZXIsXG4uY29udGFpbmVyIC5yaWdodENvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMTBweCAxZnI7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMTBweCAxZnI7XG4gIGdhcDogMXJlbTtcbiAgZmxleDogMTtcbn1cblxuLmJvYXJkIHtcbiAgYXNwZWN0LXJhdGlvOiAxLzE7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcbiAgZ3JpZC1hdXRvLWZsb3c6IGRlbnNlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tY29sb3ItYm9yZGVyKTtcbn1cbi5ib2FyZCBkaXYge1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvci1ib3JkZXIpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZm9udC1zaXplOiAzdnc7XG4gIGhlaWdodDogYXV0bztcbiAgd2lkdGg6IGF1dG87XG4gIG1pbi1oZWlnaHQ6IDA7XG4gIG1pbi13aWR0aDogMDtcbn1cblxuLmxldHRlckxpbmUsXG4ubnVtYmVyTGluZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZvbnQtd2VpZ2h0OiA5MDA7XG4gIGZvbnQtc2l6ZTogdmFyKC0tZm9udC1zaXplLW1haW4pO1xuICBjb2xvcjogdmFyKC0tY29sb3ItYm9yZGVyKTtcbn1cblxuLmxldHRlckxpbmUge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xufVxuXG4ubnVtYmVyTGluZSB7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4ubGV0dGVyLFxuLm51bWJlciB7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBoZWlnaHQ6IGF1dG87XG4gIHdpZHRoOiBhdXRvO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTEwMHB4KSB7XG4gIC5jb250YWluZXIge1xuICAgIHdpZHRoOiA5NXZ3O1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogODEwcHgpIHtcbiAgOnJvb3Qge1xuICAgIC0tZm9udC1zaXplLWxhcmdlOiAxLjVyZW07XG4gICAgLS1mb250LXNpemUtbWFpbjogMS4ycmVtO1xuICAgIC0tZm9udC1zaXplLXNtYWxsOiAwLjVyZW07XG4gIH1cbiAgLmNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDYwZHZ3O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW4tcmV2ZXJzZTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB9XG4gIC5ib2FyZCBkaXYge1xuICAgIGZvbnQtc2l6ZTogMy41dnc7XG4gIH1cbiAgLmxlZnRDb250YWluZXIsXG4gIC5yaWdodENvbnRhaW5lciB7XG4gICAgd2lkdGg6IDc1JTtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5jb250YWluZXIge1xuICAgIGhlaWdodDogLW1vei1tYXgtY29udGVudDtcbiAgICBoZWlnaHQ6IG1heC1jb250ZW50O1xuICB9XG4gIC5jb250YWluZXIgLmxlZnRDb250YWluZXIsXG4gIC5jb250YWluZXIgLnJpZ2h0Q29udGFpbmVyIHtcbiAgICBnYXA6IDAuNXJlbTtcbiAgICB3aWR0aDogNzVkdnc7XG4gIH1cbiAgLm1haW4ge1xuICAgIG1heC1oZWlnaHQ6IDEwMGR2aDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuICAubGFiZWxDb250YWluZXIsXG4gIC5kaXZCdXR0b24sXG4gIGJvZHkgaDEge1xuICAgIGhlaWdodDogNWR2aDtcbiAgfVxuICAuYnV0dG9uIHtcbiAgICB3aWR0aDogMzBkdnc7XG4gIH1cbiAgYm9keSBoMSB7XG4gICAgbWFyZ2luOiAwO1xuICB9XG4gIC5ib2FyZCBkaXYge1xuICAgIGZvbnQtc2l6ZTogNXZ3O1xuICB9XG59LyojIHNvdXJjZU1hcHBpbmdVUkw9c3R5bGUuY3NzLm1hcCAqL2AsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLnNjc3NcIixcIndlYnBhY2s6Ly8uL2Rpc3QvY3NzL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNDLFNBQUE7RUFDQSxVQUFBO0VBQ0EseUJBQUE7RUFFQSxzQkFBQTtFQUVBLGlCQUFBO0FDQ0Q7O0FERUE7RUFDQyx3QkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSx5QkFBQTtFQUNBLHVCQUFBO0VBQ0EseUNBQUE7RUFDQSx1QkFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7QUNDRDs7QURFQTtFQUNDLGdDQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUNDRDtBRENDO0VBQ0Msd0JBQUE7RUFDQSxpQ0FBQTtFQUNBLDBCQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0FDQ0Y7O0FER0E7RUFDQyxhQUFBO0VBQ0EsNkJBQUE7RUFDQSxXQUFBO0VBQ0EsU0FBQTtBQ0FEO0FERUM7RUFDQyxnQ0FBQTtFQUNBLHdCQUFBO0VBQ0EseUJBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtBQ0FGOztBRElBO0VBQ0MsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0FDREQ7QURHQztFQUNDLGdDQUFBO0VBQ0EsbUJBQUE7RUFDQSxxQ0FBQTtBQ0RGO0FESUM7RUFDQywwQkFBQTtFQUNBLGdDQUFBO0VBQ0EsNkJBQUE7RUFDQSxvQ0FBQTtBQ0ZGOztBRE1BO0VBQ0MsY0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLHVCQUFBO0FDSEQ7O0FETUE7RUFDQyxZQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSw4QkFBQTtFQUNBLHVCQUFBO0VBQ0EsU0FBQTtFQUNBLGNBQUE7QUNIRDtBREtDOztFQUVDLGFBQUE7RUFDQSwrQkFBQTtFQUNBLDRCQUFBO0VBQ0EsU0FBQTtFQUNBLE9BQUE7QUNIRjs7QURPQTtFQUNDLGlCQUFBO0VBQ0EsYUFBQTtFQUNBLHNDQUFBO0VBQ0EsbUNBQUE7RUFDQSxxQkFBQTtFQUNBLHVCQUFBO0VBQ0EscUNBQUE7QUNKRDtBRE1DO0VBQ0MscUNBQUE7RUFDQSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLGNBQUE7RUFFQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSxZQUFBO0FDTEY7O0FEU0E7O0VBRUMsYUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0NBQUE7RUFDQSwwQkFBQTtBQ05EOztBRFNBO0VBQ0MsNkJBQUE7RUFDQSxxQkFBQTtBQ05EOztBRFNBO0VBQ0Msc0JBQUE7RUFDQSw2QkFBQTtFQUNBLG1CQUFBO0FDTkQ7O0FEU0E7O0VBRUMseUJBQUE7RUFFQSxzQkFBQTtFQUVBLGlCQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7QUNORDs7QURTQTtFQUNDO0lBQ0MsV0FBQTtFQ05BO0FBQ0Y7QURTQTtFQUNDO0lBQ0MseUJBQUE7SUFDQSx3QkFBQTtJQUNBLHlCQUFBO0VDUEE7RURVRDtJQUNDLFlBQUE7SUFDQSw4QkFBQTtJQUNBLG1CQUFBO0VDUkE7RURXRDtJQUNDLGdCQUFBO0VDVEE7RURZRDs7SUFFQyxVQUFBO0VDVkE7QUFDRjtBRGFBO0VBQ0M7SUFDQyx3QkFBQTtJQUFBLG1CQUFBO0VDWEE7RURhQTs7SUFFQyxXQUFBO0lBQ0EsWUFBQTtFQ1hEO0VEZUQ7SUFDQyxrQkFBQTtJQUNBLGFBQUE7SUFDQSxzQkFBQTtJQUNBLG1CQUFBO0VDYkE7RURnQkQ7OztJQUdDLFlBQUE7RUNkQTtFRGlCRDtJQUNDLFlBQUE7RUNmQTtFRGtCRDtJQUNDLFNBQUE7RUNoQkE7RURtQkQ7SUFDQyxjQUFBO0VDakJBO0FBQ0YsQ0FBQSxvQ0FBQVwiLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi4vZGlzdC9jc3Mvc3R5bGUuY3NzJztcbmltcG9ydCB7R2FtZX0gZnJvbSAnLi9nYW1lJztcbmltcG9ydCB7Z2VuZXJhdGVTaGVsbCwgY2xlYW5TaGVsbH0gZnJvbSAnLi9nZW5lcmF0ZURPTSc7XG5cbmdlbmVyYXRlU2hlbGwoKTtcbmNvbnN0IG5ld0dhbWUgPSBuZXcgR2FtZSgnUGxheWVyJywgJ0NvbXB1dGVyJyk7XG5jb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24nKVswXTtcbm5ld0dhbWUuc3RhcnQoKTtcblxuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYWxlcnRcblx0Y29uc3QgYXNrID0gY29uZmlybSgnU3RhcnQgYSBuZXcgZ2FtZT8nKTtcblx0aWYgKGFzaykge1xuXHRcdGNsZWFuU2hlbGwobmV3R2FtZS5jb21wdXRlckJvYXJkLCAxKTtcblx0XHRjbGVhblNoZWxsKG5ld0dhbWUucGxheWVyQm9hcmQsIDApO1xuXHRcdG5ld0dhbWUucmVzZXQoKTtcblx0XHRuZXdHYW1lLnN0YXJ0KCk7XG5cdH1cbn0pO1xuIl0sIm5hbWVzIjpbIkNvbXB1dGVyQm9hcmQiLCJQbGF5ZXJCb2FyZCIsInBsYXllckh1bWFuIiwicGxheWVyQ29tcHV0ZXIiLCJmaWxsUGxheWVyQm9hcmRzRE9NIiwicGxheWVyU2hvdERPTSIsIkRFTEFZIiwiR2FtZSIsImNvbnN0cnVjdG9yIiwicGxheWVyMSIsInBsYXllcjIiLCJwbGF5ZXJCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJmaWxsQm9hcmRQbGF5ZXIiLCJmaWxsQm9hcmRDb21wdXRlciIsInJlc2V0IiwicGxheWVyIiwid2luZXJMYWJlbCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInRleHRDb250ZW50Iiwic3RhcnQiLCJ0dXJuIiwid2lubmVyIiwiaGl0IiwicGxheWVyU2hvdCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsImNvbXB1dGVyU2hvdCIsImNoZWNrV2lubmVyIiwicmFuZG9tR2VuZXJhdGlvbiIsIiNyYW5kb21HZW5lcmF0aW9uIiwiYm9hcmQiLCJzaGlwc0xlbmd0aCIsImRpciIsImxlbmd0aCIsInNoaXAiLCJwbGFjZWQiLCJhdHRlbXB0cyIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicG9zc2libGVTaG90cyIsImNvb3JkaW5hdGUiLCJ4IiwieSIsInJhbmRvbURpciIsIl9jaGVja0NvbmRpdGlvbnMiLCJOdW1iZXIiLCJwbGFjZVNoaXAiLCJzaGlmdCIsInNob3QiLCJyZWNlaXZlQXR0YWNrIiwibWFwIiwiaXNQcmV2aW91c0F0dGFja0hpdCIsImRhbWFnZWRTaGlwIiwiZmlyc3RIaXRDb29yZCIsImxhc3RIaXQiLCJnZXREYW1hZ2VkU2hpcCIsImNoZWNrQWxsU2hpcHNTdW5rIiwiU2hpcCIsIlNISVBfQ0VMTCIsIkVNUFRZX0NFTEwiLCJISVQiLCJNSVNTIiwiR2FtZWJvYXJkIiwibGlzdE9mU2hpcHMiLCJNYXAiLCJrZXlzIiwiaXNTdW5rIiwic2hpcExlbmd0aCIsInhDZWxsIiwieUNlbGwiLCJzaGlwUG9zaXRpb24iLCJpIiwicHVzaCIsImZpbGxBZGphY2VudENlbGxzIiwic2V0IiwiU3RyaW5nIiwiX2hpdFNoaXAiLCJjb29yZHMiLCJpbmNsdWRlcyIsImlzU3Vua1NoaXAiLCIjZmlsbEFkamFjZW50Q2VsbHMiLCJzaXplIiwiZGlyZWN0aW9uIiwieFN0YXJ0IiwieEVuZCIsInlTdGFydCIsInlFbmQiLCJpc0NvcnJlY3RDb29yZGluYXRlIiwiaXNTaGlwQ3Jvc3NpbmciLCJpc0FkamFjZW50Q3Jvc3NpbmciLCIjaXNDb3JyZWN0Q29vcmRpbmF0ZSIsImNlbGwiLCJzb21lIiwicG9zaXRpb24iLCIjaXNBZGphY2VudENyb3NzaW5nIiwiZmlsbENlbGxzIiwic2hpcENvb3JkcyIsIm51bWJlckRlc2siLCJjb29yIiwiZmlsbFNpbmdsZUNlbGwiLCJTSVpFIiwib2Zmc2V0cyIsImR4IiwiZHkiLCJuZXdYIiwibmV3WSIsImluZGV4T2YiLCJzcGxpY2UiLCJwcmV2aW91c0Nvb3JkIiwiZmlsbFBvc3NpYmxlU2hvdHMiLCJqIiwic3R5bGUiLCJjb2xvciIsImhpZGRlbk1hcCIsIlJPV1MiLCJDT0xVTU5TIiwiZ2VuZXJhdGVTaGVsbCIsImJvZHkiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIm1haW4iLCJjcmVhdGVFbGVtZW50IiwibGFiZWxDb250YWluZXIiLCJkaXZCdXR0b24iLCJjb250YWluZXIiLCJsZWZ0Q29udGFpbmVyIiwicmlnaHRDb250YWluZXIiLCJjcmVhdGVMZXR0ZXJMaW5lIiwiY3JlYXRlTnVtYmVyTGluZSIsImNyZWF0ZUJvYXJkIiwiY2xlYW5TaGVsbCIsIm51bWJlciIsInJvdyIsImVudHJpZXMiLCJlbGVtZW50IiwidHlwZSIsInRleHQiLCJjbGFzc05hbWUiLCJwYXJlbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsIm51bWJlckxpbmUiLCJsZXR0ZXJMaW5lIiwiZnJvbUNoYXJDb2RlIiwic3RhcnRMaXN0ZW5pbmdQbGF5ZXJUdXJuIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInNob3RQbGF5ZXIiLCJjbGVhckludGVydmFsIiwiY29uZGl0aW9ucyIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImNvbmRpdGlvbiIsInJlc3VsdCIsInVuZGVmaW5lZCIsInhTIiwieVMiLCJpbmRleCIsImZpZWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZXIiLCJiYWNrbGlnaHQiLCJlIiwidGFyZ2V0IiwiY29udGFpbnMiLCJzbGljZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ0cmFuc2Zvcm0iLCJiYWNrZ3JvdW5kIiwiaGl0cyIsIm5ld0dhbWUiLCJidXR0b24iLCJhc2siLCJjb25maXJtIl0sInNvdXJjZVJvb3QiOiIifQ==