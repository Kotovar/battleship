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
    --font-size-main: 1rem;
    --font-size-small: 0.5rem;
  }
  h1 {
    text-align: center;
  }
  .container {
    flex-direction: column-reverse;
    align-items: center;
  }
  .board div {
    font-size: 7vw;
  }
  .main {
    max-height: 100%;
  }
  .labelContainer {
    margin: 0 auto;
  }
  .leftContainer,
  .rightContainer {
    width: 75%;
  }
}
@media (max-width: 500px) {
  .container {
    width: 80vw;
    height: -moz-max-content;
    height: max-content;
  }
  .container .leftContainer,
  .container .rightContainer {
    gap: 0.5rem;
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
}/*# sourceMappingURL=style.css.map */`, "",{"version":3,"sources":["webpack://./src/style.scss","webpack://./dist/css/style.css"],"names":[],"mappings":"AAAA;EACC,SAAA;EACA,UAAA;EACA,yBAAA;EAEA,sBAAA;EAEA,iBAAA;ACCD;;ADEA;EACC,wBAAA;EACA,oBAAA;EACA,sBAAA;EACA,yBAAA;EACA,uBAAA;EACA,yCAAA;EACA,uBAAA;EACA,sBAAA;EACA,uBAAA;ACCD;;ADEA;EACC,gCAAA;EACA,aAAA;EACA,sBAAA;EACA,mBAAA;ACCD;ADCC;EACC,wBAAA;EACA,iCAAA;EACA,0BAAA;EACA,cAAA;EACA,kBAAA;ACCF;;ADGA;EACC,aAAA;EACA,6BAAA;EACA,WAAA;EACA,SAAA;ACAD;ADEC;EACC,gCAAA;EACA,wBAAA;EACA,yBAAA;EACA,iBAAA;EACA,WAAA;EACA,kBAAA;ACAF;;ADIA;EACC,aAAA;EACA,sBAAA;EACA,mBAAA;EACA,SAAA;ACDD;ADGC;EACC,gCAAA;EACA,mBAAA;EACA,qCAAA;ACDF;ADIC;EACC,0BAAA;EACA,gCAAA;EACA,6BAAA;EACA,oCAAA;ACFF;;ADMA;EACC,cAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;ACHD;;ADMA;EACC,YAAA;EACA,WAAA;EACA,aAAA;EACA,8BAAA;EACA,uBAAA;EACA,SAAA;EACA,cAAA;ACHD;ADKC;;EAEC,aAAA;EACA,+BAAA;EACA,4BAAA;EACA,SAAA;EACA,OAAA;ACHF;;ADOA;EACC,iBAAA;EACA,aAAA;EACA,sCAAA;EACA,mCAAA;EACA,qBAAA;EACA,uBAAA;EACA,qCAAA;ACJD;ADMC;EACC,qCAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,cAAA;EAEA,YAAA;EACA,WAAA;EACA,aAAA;EACA,YAAA;ACLF;;ADSA;;EAEC,aAAA;EACA,gBAAA;EACA,gCAAA;EACA,0BAAA;ACND;;ADSA;EACC,6BAAA;EACA,qBAAA;ACND;;ADSA;EACC,sBAAA;EACA,6BAAA;EACA,mBAAA;ACND;;ADSA;;EAEC,yBAAA;EAEA,sBAAA;EAEA,iBAAA;EACA,YAAA;EACA,WAAA;ACND;;ADSA;EACC;IACC,WAAA;ECNA;AACF;ADSA;EACC;IACC,yBAAA;IACA,sBAAA;IACA,yBAAA;ECPA;EDSD;IACC,kBAAA;ECPA;EDUD;IACC,8BAAA;IACA,mBAAA;ECRA;EDWD;IACC,cAAA;ECTA;EDYD;IACC,gBAAA;ECVA;EDaD;IACC,cAAA;ECXA;EDcD;;IAEC,UAAA;ECZA;AACF;ADeA;EACC;IACC,WAAA;IACA,wBAAA;IAAA,mBAAA;ECbA;EDeA;;IAEC,WAAA;ECbD;EDiBD;IACC,kBAAA;IACA,aAAA;IACA,sBAAA;IACA,mBAAA;ECfA;EDkBD;;;IAGC,YAAA;EChBA;EDmBD;IACC,YAAA;ECjBA;EDoBD;IACC,SAAA;EClBA;AACF,CAAA,oCAAA","sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQ2xELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQ2xEO0VBRURNLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ25CLEtBQUssTUFBTXhCLElBQUksSUFBSSxJQUFJLENBQUMrQixXQUFXLENBQUNFLElB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QUFTLENBQUM7RUFDNUNtRCxTQUFTLEdBQUcsQ0FDWCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUNsRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxF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QUFHLENBQUNULENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEtBQUtrQiwyQ0FBRyxJQUMzQmhDLEtBQUssQ0FBQ1csYUFBYSxDQUFDbUUsT0FBTyxDQUFFLEdBQUVqRSxDQUFDLEdBQUcsQ0FBRSxHQUFFQyxDQUFFLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNqRDtRQUNELE9BQVEsR0FBRUQsQ0FBQyxHQUFHLENBQUUsR0FBRUMsQ0FBRSxFQUFDO01BQ3RCO0lBQ0QsQ0FBQyxFQUNELENBQUNELENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ1QsSUFDQ0EsQ0FBQyxHQUFHdUMsSUFBSSxJQUNSckQsS0FBSyxDQUFDc0IsR0FBRyxDQUFDVCxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLbUIsNENBQUksSUFDNUJqQyxLQUFLLENBQUNzQixHQUFHLENBQUNULENBQUMsQ0FBQyxDQUFDQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUtrQiwyQ0FBRyxJQUMzQmhDLEtBQUssQ0FBQ1csYUFBYSxDQUFDbUUsT0FBTyxDQUFFLEdBQUVqRSxDQUFFLEdBQUVDLENBQUMsR0FBRyxDQUFFLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNqRDtRQUNELE9BQVEsR0FBRUQsQ0FBRSxHQUFFQyxDQUFDLEdBQUcsQ0FBRSxFQUFDO01BQ3RCO0lBQ0QsQ0FBQyxFQUNELENBQUNELENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ1QsSUFDQ0QsQ0FBQyxHQUFHd0MsSUFBSSxJQUNSckQsS0FBSyxDQUFDc0IsR0FBRyxDQUFDVCxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUNDLENBQUMsQ0FBQyxLQUFLbUIsNENBQUksSUFDNUJqQyxLQUFLLENBQUNzQixHQUFHLENBQUNULENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEtBQUtrQiwyQ0FBRyxJQUMzQmhDLEtBQUssQ0FBQ1csYUFBYSxDQUFDbUUsT0FBTyxDQUFFLEdBQUVqRSxDQUFDLEdBQUcsQ0FBRSxHQUFF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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw0Q0FBNEMsa0hBQWtILFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsVUFBVSxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxNQUFNLEtBQUssVUFBVSxXQUFXLFVBQVUsVUFBVSxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsTUFBTSxLQUFLLFVBQVUsV0FBVyxXQUFXLFVBQVUsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUsV0FBVyxXQUFXLE1BQU0sS0FBSyxVQUFVLFVBQVUs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LE9BQU8sQ0FBQ2pLLEtBQUssQ0FBQyxDQUFDO0lBQ2ZpSyxPQUFPLENBQUMzSixLQUFLLENBQUMsQ0FBQztFQUNoQjtBQUNELENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9zcmMvZ2VuZXJhdGVET00uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9kaXN0L2Nzcy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9kaXN0L2Nzcy9zdHlsZS5jc3M/ZjE2ZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcF9vZGluL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwX29kaW4vd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXBfb2Rpbi8uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcHV0ZXJCb2FyZCwgUGxheWVyQm9hcmR9IGZyb20gJy4vZ2FtZWJvYXJkJztcbmltcG9ydCB7cGxheWVySHVtYW4sIHBsYXllckNvbXB1dGVyfSBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQge2ZpbGxQbGF5ZXJCb2FyZHNET00sIHBsYXllclNob3RET019IGZyb20gJy4vZ2VuZXJhdGVET00nO1xuXG5jb25zdCBERUxBWSA9IDgwMDtcblxuZXhwb3J0IGNsYXNzIEdhbWUge1xuXHRjb25zdHJ1Y3RvcihwbGF5ZXIxLCBwbGF5ZXIyKSB7XG5cdFx0dGhpcy5wbGF5ZXJCb2FyZCA9IG5ldyBQbGF5ZXJCb2FyZChwbGF5ZXIxKTtcblx0XHR0aGlzLmNvbXB1dGVyQm9hcmQgPSBuZXcgQ29tcHV0ZXJCb2FyZChwbGF5ZXIyKTtcblx0XHR0aGlzLmZpbGxCb2FyZFBsYXllcigpO1xuXHRcdHRoaXMuZmlsbEJvYXJkQ29tcHV0ZXIoKTtcblx0XHRmaWxsUGxheWVyQm9hcmRzRE9NKHRoaXMucGxheWVyQm9hcmQpO1xuXHR9XG5cblx0cmVzZXQoKSB7XG5cdFx0dGhpcy5wbGF5ZXJCb2FyZCA9IG5ldyBQbGF5ZXJCb2FyZCh0aGlzLnBsYXllckJvYXJkLnBsYXllcik7XG5cdFx0dGhpcy5jb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyQm9hcmQodGhpcy5jb21wdXRlckJvYXJkLnBsYXllcik7XG5cdFx0dGhpcy5maWxsQm9hcmRQbGF5ZXIoKTtcblx0XHR0aGlzLmZpbGxCb2FyZENvbXB1dGVyKCk7XG5cdFx0ZmlsbFBsYXllckJvYXJkc0RPTSh0aGlzLnBsYXllckJvYXJkKTtcblx0XHRjb25zdCB3aW5lckxhYmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2lubmVyTGFiZWwnKVswXTtcblx0XHR3aW5lckxhYmVsLnRleHRDb250ZW50ID0gJyc7XG5cdH1cblxuXHRhc3luYyBzdGFydCgpIHtcblx0XHRsZXQgdHVybiA9ICdwbGF5ZXInO1xuXHRcdGxldCB3aW5uZXIgPSBudWxsO1xuXHRcdHdoaWxlICghd2lubmVyKSB7XG5cdFx0XHRpZiAodHVybiA9PT0gJ3BsYXllcicpIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3Bcblx0XHRcdFx0Y29uc3QgaGl0ID0gYXdhaXQgdGhpcy5wbGF5ZXJTaG90KCk7XG5cdFx0XHRcdGlmIChoaXQpIHtcblx0XHRcdFx0XHR0dXJuID0gJ2NvbXB1dGVyJztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh0dXJuID09PSAnY29tcHV0ZXInKSB7XG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG5cdFx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRcdFx0c2V0VGltZW91dChyZXNvbHZlLCBERUxBWSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjb25zdCBoaXQgPSB0aGlzLmNvbXB1dGVyU2hvdCgpO1xuXG5cdFx0XHRcdGlmIChoaXQpIHtcblx0XHRcdFx0XHR0dXJuID0gJ3BsYXllcic7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0d2lubmVyID0gdGhpcy5jaGVja1dpbm5lcigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHdpbmVyTGFiZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5uZXJMYWJlbCcpWzBdO1xuXHRcdHdpbmVyTGFiZWwudGV4dENvbnRlbnQgPSBgJHt3aW5uZXJ9IHdvbiB0aGUgZ2FtZSFgO1xuXHR9XG5cblx0ZmlsbEJvYXJkUGxheWVyKCkge1xuXHRcdHRoaXMuI3JhbmRvbUdlbmVyYXRpb24odGhpcy5wbGF5ZXJCb2FyZCk7XG5cdH1cblxuXHRmaWxsQm9hcmRDb21wdXRlcigpIHtcblx0XHR0aGlzLiNyYW5kb21HZW5lcmF0aW9uKHRoaXMuY29tcHV0ZXJCb2FyZCk7XG5cdH1cblxuXHQjcmFuZG9tR2VuZXJhdGlvbihib2FyZCkge1xuXHRcdGNvbnN0IHNoaXBzTGVuZ3RoID0gWzQsIDMsIDMsIDIsIDIsIDIsIDEsIDEsIDEsIDFdO1xuXHRcdGNvbnN0IGRpciA9IFsneCcsICd5J107XG5cdFx0d2hpbGUgKHNoaXBzTGVuZ3RoLmxlbmd0aCA+IDApIHtcblx0XHRcdGNvbnN0IHNoaXAgPSBzaGlwc0xlbmd0aFswXTtcblx0XHRcdGxldCBwbGFjZWQgPSBmYWxzZTtcblx0XHRcdGxldCBhdHRlbXB0cyA9IDA7XG5cdFx0XHR3aGlsZSAoIXBsYWNlZCAmJiBhdHRlbXB0cyA8IDEwMCkge1xuXHRcdFx0XHRjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoXG5cdFx0XHRcdFx0TWF0aC5yYW5kb20oKSAqIHRoaXMucGxheWVyQm9hcmQucG9zc2libGVTaG90cy5sZW5ndGgsXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IGNvb3JkaW5hdGUgPSB0aGlzLnBsYXllckJvYXJkLnBvc3NpYmxlU2hvdHNbcmFuZG9tSW5kZXhdO1xuXHRcdFx0XHRjb25zdCBbeCwgeV0gPSBjb29yZGluYXRlO1xuXHRcdFx0XHRjb25zdCByYW5kb21EaXIgPSBkaXJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMildO1xuXHRcdFx0XHRpZiAoYm9hcmQuX2NoZWNrQ29uZGl0aW9ucyhzaGlwLCBOdW1iZXIoeCksIE51bWJlcih5KSwgcmFuZG9tRGlyKSkge1xuXHRcdFx0XHRcdGJvYXJkLnBsYWNlU2hpcChzaGlwLCBOdW1iZXIoeCksIE51bWJlcih5KSwgcmFuZG9tRGlyKTtcblx0XHRcdFx0XHRzaGlwc0xlbmd0aC5zaGlmdCgpO1xuXHRcdFx0XHRcdHBsYWNlZCA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhdHRlbXB0cysrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXBsYWNlZCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjb21wdXRlclNob3QoKSB7XG5cdFx0Y29uc3Qgc2hvdCA9IHBsYXllckNvbXB1dGVyKHRoaXMucGxheWVyQm9hcmQpO1xuXHRcdHRoaXMucGxheWVyQm9hcmQucmVjZWl2ZUF0dGFjayhzaG90KTtcblx0XHRmaWxsUGxheWVyQm9hcmRzRE9NKHRoaXMucGxheWVyQm9hcmQpO1xuXHRcdGNvbnN0IFt4LCB5XSA9IHNob3Q7XG5cdFx0aWYgKHRoaXMucGxheWVyQm9hcmQubWFwW3hdW3ldID09PSAn4piSJykge1xuXHRcdFx0dGhpcy5wbGF5ZXJCb2FyZC5pc1ByZXZpb3VzQXR0YWNrSGl0ID0gdHJ1ZTtcblx0XHRcdGlmICh0aGlzLnBsYXllckJvYXJkLmRhbWFnZWRTaGlwID09PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMucGxheWVyQm9hcmQuZmlyc3RIaXRDb29yZCA9IHNob3Q7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMucGxheWVyQm9hcmQubGFzdEhpdCA9IHNob3Q7XG5cdFx0XHR0aGlzLnBsYXllckJvYXJkLmdldERhbWFnZWRTaGlwKCk7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLnBsYXllckJvYXJkLmlzUHJldmlvdXNBdHRhY2tIaXQgPSBmYWxzZTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGFzeW5jIHBsYXllclNob3QoKSB7XG5cdFx0Y29uc3Qgc2hvdCA9IGF3YWl0IHBsYXllckh1bWFuKCk7XG5cdFx0dGhpcy5jb21wdXRlckJvYXJkLnJlY2VpdmVBdHRhY2soc2hvdCk7XG5cdFx0cGxheWVyU2hvdERPTSh0aGlzLmNvbXB1dGVyQm9hcmQsIHNob3QpO1xuXHRcdGNvbnN0IFt4LCB5XSA9IHNob3Q7XG5cdFx0aWYgKHRoaXMuY29tcHV0ZXJCb2FyZC5tYXBbeF1beV0gPT09ICfimJInKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRjaGVja1dpbm5lcigpIHtcblx0XHRpZiAodGhpcy5wbGF5ZXJCb2FyZC5jaGVja0FsbFNoaXBzU3VuaygpKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb21wdXRlckJvYXJkLnBsYXllcjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5jb21wdXRlckJvYXJkLmNoZWNrQWxsU2hpcHNTdW5rKCkpIHtcblx0XHRcdHJldHVybiB0aGlzLnBsYXllckJvYXJkLnBsYXllcjtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuIiwiaW1wb3J0IHtTaGlwfSBmcm9tICcuL3NoaXAnO1xuXG5jb25zdCBTSElQX0NFTEwgPSAn4piQJztcbmNvbnN0IEVNUFRZX0NFTEwgPSAnTyc7XG5leHBvcnQgY29uc3QgSElUID0gJ+KYkic7XG5leHBvcnQgY29uc3QgTUlTUyA9ICfCtyc7XG5cbmV4cG9ydCBjbGFzcyBHYW1lYm9hcmQge1xuXHRjb25zdHJ1Y3RvcihwbGF5ZXIpIHtcblx0XHR0aGlzLnBsYXllciA9IHBsYXllcjtcblx0fVxuXG5cdGxpc3RPZlNoaXBzID0gbmV3IE1hcCgpO1xuXG5cdG1hcCA9IFtcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XHRbJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnXSxcblx0XTtcblxuXHRjaGVja0FsbFNoaXBzU3VuaygpIHtcblx0XHRmb3IgKGNvbnN0IHNoaXAgb2YgdGhpcy5saXN0T2ZTaGlwcy5rZXlzKCkpIHtcblx0XHRcdGlmICghc2hpcC5pc1N1bmsoKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRwbGFjZVNoaXAoc2hpcExlbmd0aCwgeENlbGwsIHlDZWxsLCBkaXIpIHtcblx0XHRpZiAoIXRoaXMuX2NoZWNrQ29uZGl0aW9ucyhzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcikpIHtcblx0XHRcdHJldHVybiBg0JjQt9C80LXQvdC40YLQtSDQstCy0L7QtCAke3NoaXBMZW5ndGh9ICR7eENlbGx9ICR7eUNlbGx9ICR7ZGlyfWA7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2hpcCA9IG5ldyBTaGlwKHNoaXBMZW5ndGgpO1xuXHRcdGNvbnN0IHNoaXBQb3NpdGlvbiA9IFtdO1xuXHRcdGlmIChkaXIgPT09ICd4Jykge1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHRoaXMubWFwW3hDZWxsXVt5Q2VsbCArIGldID0gU0hJUF9DRUxMO1xuXHRcdFx0XHRzaGlwUG9zaXRpb24ucHVzaChgJHt4Q2VsbH0ke3lDZWxsICsgaX1gKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3knKSB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dGhpcy5tYXBbeENlbGwgKyBpXVt5Q2VsbF0gPSBTSElQX0NFTEw7XG5cdFx0XHRcdHNoaXBQb3NpdGlvbi5wdXNoKGAke3hDZWxsICsgaX0ke3lDZWxsfWApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuI2ZpbGxBZGphY2VudENlbGxzKHNoaXBMZW5ndGgsIHhDZWxsLCB5Q2VsbCwgZGlyKTtcblxuXHRcdHRoaXMubGlzdE9mU2hpcHMuc2V0KHNoaXAsIHNoaXBQb3NpdGlvbik7XG5cdH1cblxuXHRyZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGUpIHtcblx0XHRjb25zdCBbeCwgeV0gPSBbLi4uU3RyaW5nKGNvb3JkaW5hdGUpXTtcblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0XHR0aGlzLm1hcFt4XVt5XSA9PT0gU0hJUF9DRUxMXG5cdFx0XHQ/ICh0aGlzLl9oaXRTaGlwKGNvb3JkaW5hdGUpLCAodGhpcy5tYXBbeF1beV0gPSBISVQpKVxuXHRcdFx0OiAodGhpcy5tYXBbeF1beV0gPSBNSVNTKTtcblx0fVxuXG5cdF9oaXRTaGlwKGNvb3JkaW5hdGUpIHtcblx0XHRsZXQgaGl0ID0gZmFsc2U7XG5cdFx0Zm9yIChjb25zdCBbc2hpcCwgY29vcmRzXSBvZiB0aGlzLmxpc3RPZlNoaXBzKSB7XG5cdFx0XHRpZiAoY29vcmRzLmluY2x1ZGVzKGNvb3JkaW5hdGUpKSB7XG5cdFx0XHRcdHNoaXAuaGl0KCk7XG5cdFx0XHRcdHRoaXMuaXNTdW5rU2hpcChzaGlwLCBjb29yZHMsIGNvb3JkaW5hdGUpO1xuXHRcdFx0XHRoaXQgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gaGl0O1xuXHR9XG5cblx0I2ZpbGxBZGphY2VudENlbGxzKHNpemUsIHhDZWxsLCB5Q2VsbCwgZGlyZWN0aW9uKSB7XG5cdFx0Y29uc3QgeFN0YXJ0ID0geENlbGwgLSAxO1xuXHRcdGNvbnN0IHhFbmQgPSBkaXJlY3Rpb24gPT09ICd4JyA/IHhDZWxsICsgMSA6IHhDZWxsICsgc2l6ZTtcblx0XHRjb25zdCB5U3RhcnQgPSB5Q2VsbCAtIDE7XG5cdFx0Y29uc3QgeUVuZCA9IGRpcmVjdGlvbiA9PT0gJ3knID8geUNlbGwgKyAxIDogeUNlbGwgKyBzaXplO1xuXG5cdFx0Zm9yIChsZXQgeCA9IHhTdGFydDsgeCA8PSB4RW5kOyB4KyspIHtcblx0XHRcdGZvciAobGV0IHkgPSB5U3RhcnQ7IHkgPD0geUVuZDsgeSsrKSB7XG5cdFx0XHRcdGlmICh4ID49IDAgJiYgeCA8IHRoaXMubWFwLmxlbmd0aCAmJiB5ID49IDAgJiYgeSA8IHRoaXMubWFwLmxlbmd0aCkge1xuXHRcdFx0XHRcdHRoaXMubWFwW3hdW3ldID1cblx0XHRcdFx0XHRcdHRoaXMubWFwW3hdW3ldID09PSBTSElQX0NFTEwgPyBTSElQX0NFTEwgOiBFTVBUWV9DRUxMO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0X2NoZWNrQ29uZGl0aW9ucyhzaGlwTGVuZ3RoLCB4Q2VsbCwgeUNlbGwsIGRpcikge1xuXHRcdGlmICh0aGlzLiNpc0NvcnJlY3RDb29yZGluYXRlKHNoaXBMZW5ndGgsIHhDZWxsLCB5Q2VsbCwgZGlyKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmxpc3RPZlNoaXBzLnNpemUgJiYgdGhpcy4jaXNTaGlwQ3Jvc3NpbmcoYCR7eENlbGx9JHt5Q2VsbH1gKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdHRoaXMubGlzdE9mU2hpcHMuc2l6ZSAmJlxuXHRcdFx0dGhpcy4jaXNBZGphY2VudENyb3NzaW5nKHNoaXBMZW5ndGgsIHhDZWxsLCB5Q2VsbCwgZGlyKVxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0I2lzQ29ycmVjdENvb3JkaW5hdGUobGVuZ3RoLCB4LCB5LCBkaXIpIHtcblx0XHRyZXR1cm4gIShkaXIgPT09ICd4J1xuXHRcdFx0PyBsZW5ndGggKyB5IDw9IHRoaXMubWFwLmxlbmd0aCAmJiB4IDwgdGhpcy5tYXAubGVuZ3RoXG5cdFx0XHQ6IHkgPCB0aGlzLm1hcC5sZW5ndGggJiYgbGVuZ3RoICsgeCA8PSB0aGlzLm1hcC5sZW5ndGgpO1xuXHR9XG5cblx0I2lzU2hpcENyb3NzaW5nID0gKGNlbGwpID0+XG5cdFx0Wy4uLnRoaXMubGlzdE9mU2hpcHNdLnNvbWUoKFssIHBvc2l0aW9uXSkgPT4gcG9zaXRpb24uaW5jbHVkZXMoY2VsbCkpO1xuXG5cdCNpc0FkamFjZW50Q3Jvc3Npbmcoc2l6ZSwgeCwgeSwgZGlyKSB7XG5cdFx0aWYgKHRoaXMubWFwW3hdW3ldID09PSBFTVBUWV9DRUxMKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoZGlyID09PSAneCcgJiYgc2l6ZSA+IDEpIHtcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgc2l6ZTsgaSsrKSB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLm1hcFt4XVt5ICsgaV0gPT09IFNISVBfQ0VMTCB8fFxuXHRcdFx0XHRcdHRoaXMubWFwW3hdW3kgKyBpXSA9PT0gRU1QVFlfQ0VMTFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZGlyID09PSAneScgJiYgc2l6ZSA+IDEpIHtcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgc2l6ZTsgaSsrKSB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLm1hcFt4ICsgaV1beV0gPT09IFNISVBfQ0VMTCB8fFxuXHRcdFx0XHRcdHRoaXMubWFwW3ggKyBpXVt5XSA9PT0gRU1QVFlfQ0VMTFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZpbGxDZWxscyhzaGlwQ29vcmRzLCBudW1iZXJEZXNrKSB7XG5cdFx0Zm9yIChjb25zdCBjb29yIG9mIHNoaXBDb29yZHMpIHtcblx0XHRcdGNvbnN0IFt4LCB5XSA9IGNvb3I7XG5cdFx0XHR0aGlzLmZpbGxTaW5nbGVDZWxsKE51bWJlcih4KSwgTnVtYmVyKHkpLCBudW1iZXJEZXNrKTtcblx0XHR9XG5cdH1cblxuXHRmaWxsU2luZ2xlQ2VsbCh4LCB5LCBudW1iZXJEZXNrKSB7XG5cdFx0bGV0IGNlbGw7XG5cdFx0Y29uc3QgU0laRSA9IHRoaXMubWFwLmxlbmd0aCAtIDE7XG5cdFx0Y29uc3Qgb2Zmc2V0cyA9IFstMSwgMCwgMV07XG5cdFx0Zm9yIChjb25zdCBkeCBvZiBvZmZzZXRzKSB7XG5cdFx0XHRmb3IgKGNvbnN0IGR5IG9mIG9mZnNldHMpIHtcblx0XHRcdFx0aWYgKGR4ID09PSAwICYmIGR5ID09PSAwKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBuZXdYID0geCArIGR4O1xuXHRcdFx0XHRjb25zdCBuZXdZID0geSArIGR5O1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0bmV3WCA+PSAwICYmXG5cdFx0XHRcdFx0bmV3WCA8PSBTSVpFICYmXG5cdFx0XHRcdFx0bmV3WSA+PSAwICYmXG5cdFx0XHRcdFx0bmV3WSA8PSBTSVpFICYmXG5cdFx0XHRcdFx0dGhpcy5tYXBbbmV3WF1bbmV3WV0gPT09IEVNUFRZX0NFTExcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0aWYgKG51bWJlckRlc2sgPT09IDApIHtcblx0XHRcdFx0XHRcdHRoaXMubWFwW25ld1hdW25ld1ldID0gTUlTUztcblx0XHRcdFx0XHRcdGNvbnN0IGNvb3IgPSB0aGlzLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihgJHtuZXdYfSR7bmV3WX1gKTtcblx0XHRcdFx0XHRcdHRoaXMucG9zc2libGVTaG90cy5zcGxpY2UoY29vciwgMSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHtuZXdYfSR7bmV3WX1gKVtcblx0XHRcdFx0XHRcdG51bWJlckRlc2tcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHRcdGNlbGwudGV4dENvbnRlbnQgPSBNSVNTO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBQbGF5ZXJCb2FyZCBleHRlbmRzIEdhbWVib2FyZCB7XG5cdHBvc3NpYmxlU2hvdHMgPSBbXTtcblx0aXNQcmV2aW91c0F0dGFja0hpdCA9IGZhbHNlO1xuXHRwcmV2aW91c0Nvb3JkID0gJyAnO1xuXHRmaXJzdEhpdENvb3JkID0gJyAnO1xuXHRkYW1hZ2VkU2hpcCA9IG51bGw7XG5cdGxhc3RIaXQgPSAnICc7XG5cblx0Y29uc3RydWN0b3IocGxheWVyKSB7XG5cdFx0c3VwZXIocGxheWVyKTtcblx0XHR0aGlzLmZpbGxQb3NzaWJsZVNob3RzKCk7XG5cdH1cblxuXHRnZXREYW1hZ2VkU2hpcCgpIHtcblx0XHRmb3IgKGNvbnN0IFtzaGlwLCBjb29yZHNdIG9mIHRoaXMubGlzdE9mU2hpcHMpIHtcblx0XHRcdGlmIChjb29yZHMuaW5jbHVkZXModGhpcy5wcmV2aW91c0Nvb3JkKSAmJiAhc2hpcC5pc1N1bmsoKSkge1xuXHRcdFx0XHR0aGlzLmRhbWFnZWRTaGlwID0gc2hpcDtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH0gZWxzZSBpZiAoY29vcmRzLmluY2x1ZGVzKHRoaXMuZmlyc3RIaXRDb29yZCkgJiYgc2hpcC5pc1N1bmsoKSkge1xuXHRcdFx0XHR0aGlzLmRhbWFnZWRTaGlwID0gbnVsbDtcblx0XHRcdFx0dGhpcy5maXJzdEhpdENvb3JkID0gJyAnO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZpbGxQb3NzaWJsZVNob3RzKCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG5cdFx0XHRcdHRoaXMucG9zc2libGVTaG90cy5wdXNoKGAke2l9JHtqfWApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlzU3Vua1NoaXAoc2hpcCwgY29vcmRzLCBoaXQpIHtcblx0XHRjb25zdCBbeCwgeV0gPSBoaXQ7XG5cdFx0bGV0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7eH0ke3l9YClbMF07XG5cdFx0Y2VsbC5zdHlsZS5jb2xvciA9IHNoaXAuaXNTdW5rKCkgPyAncmVkJyA6ICdwdXJwbGUnO1xuXHRcdGlmIChzaGlwLmlzU3VuaygpKSB7XG5cdFx0XHR0aGlzLmZpbGxDZWxscyhjb29yZHMsIDApO1xuXHRcdFx0Zm9yIChjb25zdCBjb29yIG9mIGNvb3Jkcykge1xuXHRcdFx0XHRjb25zdCBbeCwgeV0gPSBjb29yO1xuXHRcdFx0XHRjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgY2VsbC0ke3h9JHt5fWApWzBdO1xuXHRcdFx0XHRjZWxsLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wdXRlckJvYXJkIGV4dGVuZHMgR2FtZWJvYXJkIHtcblx0aGlkZGVuTWFwID0gW1xuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRcdFsnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICcsICcgJywgJyAnLCAnICddLFxuXHRdO1xuXG5cdHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSkge1xuXHRcdGNvbnN0IFt4LCB5XSA9IFsuLi5TdHJpbmcoY29vcmRpbmF0ZSldO1xuXHRcdGlmICh0aGlzLm1hcFt4XVt5XSA9PT0gU0hJUF9DRUxMKSB7XG5cdFx0XHR0aGlzLl9oaXRTaGlwKGNvb3JkaW5hdGUpO1xuXHRcdFx0dGhpcy5tYXBbeF1beV0gPSBISVQ7XG5cdFx0XHR0aGlzLmhpZGRlbk1hcFt4XVt5XSA9IEhJVDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5tYXBbeF1beV0gPSBNSVNTO1xuXHRcdFx0dGhpcy5oaWRkZW5NYXBbeF1beV0gPSBNSVNTO1xuXHRcdH1cblx0fVxuXG5cdGlzU3Vua1NoaXAoc2hpcCwgY29vcmRzLCBoaXQpIHtcblx0XHRjb25zdCBbeCwgeV0gPSBoaXQ7XG5cdFx0bGV0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBjZWxsLSR7eH0ke3l9YClbMV07XG5cdFx0Y2VsbC5zdHlsZS5jb2xvciA9IHNoaXAuaXNTdW5rKCkgPyAncmVkJyA6ICdwdXJwbGUnO1xuXHRcdGlmIChzaGlwLmlzU3VuaygpKSB7XG5cdFx0XHR0aGlzLmZpbGxDZWxscyhjb29yZHMsIDEpO1xuXHRcdFx0Zm9yIChjb25zdCBjb29yIG9mIGNvb3Jkcykge1xuXHRcdFx0XHRjb25zdCBbeCwgeV0gPSBjb29yO1xuXHRcdFx0XHRjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgY2VsbC0ke3h9JHt5fWApWzFdO1xuXHRcdFx0XHRjZWxsLnN0eWxlLmNvbG9yID0gJ3JlZCc7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJjb25zdCBST1dTID0gMTA7XG5jb25zdCBDT0xVTU5TID0gMTA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVNoZWxsKCkge1xuXHRjb25zdCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcblxuXHRjb25zdCBtYWluID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdtYWluJywgYm9keSk7XG5cblx0Y3JlYXRlRWxlbWVudCgnaDEnLCAnQmF0dGxlc2hpcCBnYW1lJywgJycsIG1haW4pO1xuXG5cdGNvbnN0IGxhYmVsQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdsYWJlbENvbnRhaW5lcicsIG1haW4pO1xuXHRjb25zdCBkaXZCdXR0b24gPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2RpdkJ1dHRvbicsIG1haW4pO1xuXHRjcmVhdGVFbGVtZW50KCdidXR0b24nLCAnU3RhcnQgR2FtZScsICdidXR0b24nLCBkaXZCdXR0b24pO1xuXHRjcmVhdGVFbGVtZW50KCdoMicsICcnLCAnd2lubmVyTGFiZWwnLCBkaXZCdXR0b24pO1xuXHRjcmVhdGVFbGVtZW50KCdwJywgJ1lvdScsICdsYWJlbCcsIGxhYmVsQ29udGFpbmVyKTtcblx0Y3JlYXRlRWxlbWVudCgncCcsICdDb21wdXRlcicsICdsYWJlbCcsIGxhYmVsQ29udGFpbmVyKTtcblxuXHRjb25zdCBjb250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2NvbnRhaW5lcicsIG1haW4pO1xuXHRjb25zdCBsZWZ0Q29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdsZWZ0Q29udGFpbmVyJywgY29udGFpbmVyKTtcblx0Y29uc3QgcmlnaHRDb250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ3JpZ2h0Q29udGFpbmVyJywgY29udGFpbmVyKTtcblxuXHRjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2Zha2UnLCBsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlTGV0dGVyTGluZShsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlTnVtYmVyTGluZShsZWZ0Q29udGFpbmVyKTtcblx0Y3JlYXRlQm9hcmQobGVmdENvbnRhaW5lcik7XG5cblx0Y3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdmYWtlJywgcmlnaHRDb250YWluZXIpO1xuXHRjcmVhdGVMZXR0ZXJMaW5lKHJpZ2h0Q29udGFpbmVyKTtcblx0Y3JlYXRlTnVtYmVyTGluZShyaWdodENvbnRhaW5lcik7XG5cdGNyZWF0ZUJvYXJkKHJpZ2h0Q29udGFpbmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuU2hlbGwoYm9hcmQsIG51bWJlcikge1xuXHRmb3IgKGNvbnN0IFtpLCByb3ddIG9mIGJvYXJkLm1hcC5lbnRyaWVzKCkpIHtcblx0XHRmb3IgKGNvbnN0IGogb2Ygcm93LmtleXMoKSkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHtpfSR7an1gKTtcblx0XHRcdGVsZW1lbnRbbnVtYmVyXS50ZXh0Q29udGVudCA9ICcnO1xuXHRcdFx0ZWxlbWVudFtudW1iZXJdLnN0eWxlLmNvbG9yID0gJ2JsYWNrJztcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxQbGF5ZXJCb2FyZHNET00oYm9hcmQpIHtcblx0Zm9yIChjb25zdCBbaSwgcm93XSBvZiBib2FyZC5tYXAuZW50cmllcygpKSB7XG5cdFx0Zm9yIChjb25zdCBbaiwgY2VsbF0gb2Ygcm93LmVudHJpZXMoKSkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHtpfSR7an1gKTtcblx0XHRcdGVsZW1lbnRbMF0udGV4dENvbnRlbnQgPSBjZWxsID09PSAnTycgfHwgY2VsbCA9PT0gJyAnID8gJyAnIDogY2VsbDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXllclNob3RET00oYm9hcmQsIHNob3QpIHtcblx0Y29uc3QgW3gsIHldID0gc2hvdDtcblx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYGNlbGwtJHt4fSR7eX1gKTtcblx0ZWxlbWVudFsxXS50ZXh0Q29udGVudCA9IGJvYXJkLm1hcFt4XVt5XTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCB0ZXh0LCBjbGFzc05hbWUsIHBhcmVudCkge1xuXHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblx0ZWxlbWVudC50ZXh0Q29udGVudCA9IHRleHQ7XG5cdGlmIChjbGFzc05hbWUpIHtcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcblx0fVxuXG5cdHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcblx0cmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKHBhcmVudCkge1xuXHRjb25zdCBib2FyZCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsICcnLCAnYm9hcmQnLCBwYXJlbnQpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IFJPV1M7IGkrKykge1xuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgQ09MVU1OUzsgaisrKSB7XG5cdFx0XHRjb25zdCBjZWxsID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdjZWxsJywgYm9hcmQpO1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKGBjZWxsLSR7aX0ke2p9YCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGJvYXJkO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOdW1iZXJMaW5lKHBhcmVudCkge1xuXHRjb25zdCBudW1iZXJMaW5lID0gY3JlYXRlRWxlbWVudCgnZGl2JywgJycsICdudW1iZXJMaW5lJywgcGFyZW50KTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBST1dTOyBpKyspIHtcblx0XHRjcmVhdGVFbGVtZW50KCdkaXYnLCBpICsgMSwgJ251bWJlcicsIG51bWJlckxpbmUpO1xuXHR9XG5cblx0cmV0dXJuIG51bWJlckxpbmU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxldHRlckxpbmUocGFyZW50KSB7XG5cdGNvbnN0IGxldHRlckxpbmUgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCAnJywgJ2xldHRlckxpbmUnLCBwYXJlbnQpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IENPTFVNTlM7IGkrKykge1xuXHRcdGNyZWF0ZUVsZW1lbnQoJ2RpdicsIFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKSwgJ2xldHRlcicsIGxldHRlckxpbmUpO1xuXHR9XG5cblx0cmV0dXJuIGxldHRlckxpbmU7XG59XG4iLCJpbXBvcnQge01JU1MsIEhJVH0gZnJvbSAnLi9nYW1lYm9hcmQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGxheWVySHVtYW4oKSB7XG5cdHN0YXJ0TGlzdGVuaW5nUGxheWVyVHVybigpO1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmIChzaG90UGxheWVyICE9PSBudWxsKSB7XG5cdFx0XHRcdHJlc29sdmUoc2hvdFBsYXllcik7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXHRcdFx0XHRzaG90UGxheWVyID0gbnVsbDtcblx0XHRcdH1cblx0XHR9LCAxMDApO1xuXHR9KTtcbn1cblxubGV0IHNob3RQbGF5ZXIgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gcGxheWVyQ29tcHV0ZXIoYm9hcmQpIHtcblx0bGV0IHNob3Q7XG5cdGNvbnN0IHNpemUgPSBib2FyZC5tYXAubGVuZ3RoIC0gMTtcblx0aWYgKGJvYXJkLmlzUHJldmlvdXNBdHRhY2tIaXQgfHwgYm9hcmQuZGFtYWdlZFNoaXAgIT09IG51bGwpIHtcblx0XHRsZXQgW3gsIHldID0gYm9hcmQubGFzdEhpdDtcblx0XHR4ID0gTnVtYmVyKHgpO1xuXHRcdHkgPSBOdW1iZXIoeSk7XG5cblx0XHRjb25zdCBjb25kaXRpb25zID0gW1xuXHRcdFx0KHgsIHkpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHkgPiAwICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3hdW3kgLSAxXSAhPT0gTUlTUyAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4XVt5IC0gMV0gIT09IEhJVCAmJlxuXHRcdFx0XHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihgJHt4fSR7eSAtIDF9YCkgIT09IC0xXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiBgJHt4fSR7eSAtIDF9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCh4LCB5KSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR4ID4gMCAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4IC0gMV1beV0gIT09IE1JU1MgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeCAtIDFdW3ldICE9PSBISVQgJiZcblx0XHRcdFx0XHRib2FyZC5wb3NzaWJsZVNob3RzLmluZGV4T2YoYCR7eCAtIDF9JHt5fWApICE9PSAtMVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gYCR7eCAtIDF9JHt5fWA7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQoeCwgeSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0eSA8IHNpemUgJiZcblx0XHRcdFx0XHRib2FyZC5tYXBbeF1beSArIDFdICE9PSBNSVNTICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3hdW3kgKyAxXSAhPT0gSElUICYmXG5cdFx0XHRcdFx0Ym9hcmQucG9zc2libGVTaG90cy5pbmRleE9mKGAke3h9JHt5ICsgMX1gKSAhPT0gLTFcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGAke3h9JHt5ICsgMX1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0KHgsIHkpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHggPCBzaXplICYmXG5cdFx0XHRcdFx0Ym9hcmQubWFwW3ggKyAxXVt5XSAhPT0gTUlTUyAmJlxuXHRcdFx0XHRcdGJvYXJkLm1hcFt4ICsgMV1beV0gIT09IEhJVCAmJlxuXHRcdFx0XHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuaW5kZXhPZihgJHt4ICsgMX0ke3l9YCkgIT09IC0xXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiBgJHt4ICsgMX0ke3l9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRdO1xuXG5cdFx0Y29uc3Qgc2h1ZmZsZSA9IGZ1bmN0aW9uIChhcnJheSkge1xuXHRcdFx0bGV0IGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcblx0XHRcdGxldCByYW5kb21JbmRleDtcblxuXHRcdFx0d2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuXHRcdFx0XHRyYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG5cdFx0XHRcdGN1cnJlbnRJbmRleC0tO1xuXG5cdFx0XHRcdFthcnJheVtjdXJyZW50SW5kZXhdLCBhcnJheVtyYW5kb21JbmRleF1dID0gW1xuXHRcdFx0XHRcdGFycmF5W3JhbmRvbUluZGV4XSxcblx0XHRcdFx0XHRhcnJheVtjdXJyZW50SW5kZXhdLFxuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fTtcblxuXHRcdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIHNodWZmbGUoY29uZGl0aW9ucykpIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGNvbmRpdGlvbih4LCB5KTtcblxuXHRcdFx0aWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHNob3QgPSByZXN1bHQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChzaG90ID09PSB1bmRlZmluZWQgJiYgYm9hcmQuZGFtYWdlZFNoaXAgIT09IG51bGwpIHtcblx0XHRcdGxldCBbeFMsIHlTXSA9IGJvYXJkLmZpcnN0SGl0Q29vcmQ7XG5cdFx0XHR4UyA9IE51bWJlcih4Uyk7XG5cdFx0XHR5UyA9IE51bWJlcih5Uyk7XG5cblx0XHRcdGZvciAoY29uc3QgY29uZGl0aW9uIG9mIHNodWZmbGUoY29uZGl0aW9ucykpIHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gY29uZGl0aW9uKHhTLCB5Uyk7XG5cdFx0XHRcdGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHNob3QgPSByZXN1bHQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc2hvdCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBib2FyZC5wb3NzaWJsZVNob3RzLmxlbmd0aCk7XG5cdFx0XHRzaG90ID0gYm9hcmQucG9zc2libGVTaG90c1tyYW5kb21dO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluZGV4ID0gYm9hcmQucG9zc2libGVTaG90cy5pbmRleE9mKHNob3QpO1xuXHRcdGJvYXJkLnBvc3NpYmxlU2hvdHMuc3BsaWNlKGluZGV4LCAxKTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGJvYXJkLnBvc3NpYmxlU2hvdHMubGVuZ3RoKTtcblx0XHRzaG90ID0gYm9hcmQucG9zc2libGVTaG90c1tyYW5kb21JbmRleF07XG5cdFx0Ym9hcmQucG9zc2libGVTaG90cy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuXHR9XG5cblx0Ym9hcmQucHJldmlvdXNDb29yZCA9IHNob3Q7XG5cdHJldHVybiBzaG90O1xufVxuXG5mdW5jdGlvbiBzdGFydExpc3RlbmluZ1BsYXllclR1cm4oKSB7XG5cdGNvbnN0IGZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9hcmQnKVsxXTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgYmFja2xpZ2h0KTtcblx0ZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCByZXNldCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZXIoZSkge1xuXHRjb25zdCBmaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvYXJkJylbMV07XG5cdGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBlLnRhcmdldC50ZXh0Q29udGVudCA9PT0gJycpIHtcblx0XHRzaG90UGxheWVyID0gZS50YXJnZXQuY2xhc3NMaXN0WzFdLnNsaWNlKDUpO1xuXHRcdGZpZWxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG5cdH1cbn1cblxuZnVuY3Rpb24gYmFja2xpZ2h0KGUpIHtcblx0aWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpKSB7XG5cdFx0ZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEuMDUpJztcblx0XHRlLnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYigyNDUsIDI0NSwgMjQ1KSc7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVzZXQoZSkge1xuXHRpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykpIHtcblx0XHRlLnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG5cdFx0ZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICd3aGl0ZSc7XG5cdH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTaGlwIHtcblx0Y29uc3RydWN0b3IobGVuZ3RoKSB7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdFx0dGhpcy5oaXRzID0gMDtcblx0fVxuXG5cdGhpdCgpIHtcblx0XHR0aGlzLmhpdHMrKztcblx0fVxuXG5cdGlzU3VuaygpIHtcblx0XHRyZXR1cm4gdGhpcy5sZW5ndGggPT09IHRoaXMuaGl0cztcblx0fVxufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCoge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xufVxuXG46cm9vdCB7XG4gIC0tY29sb3ItcHJpbWFyeTogI2Y1ZjVkYztcbiAgLS1jb2xvci1ib3JkZXI6IGJsdWU7XG4gIC0tY29sb3ItbGFiZWw6ICM0ZDRkNGQ7XG4gIC0tY29sb3ItYnV0dG9uOiAjNGQ0ZDRkOTE7XG4gIC0tY29sb3Itd2lubmVyOiAjMTE1ZjEzO1xuICAtLWZvbnQ6IFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlO1xuICAtLWZvbnQtc2l6ZS1sYXJnZTogM3JlbTtcbiAgLS1mb250LXNpemUtbWFpbjogMnJlbTtcbiAgLS1mb250LXNpemUtc21hbGw6IDFyZW07XG59XG5cbmJvZHkge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1jb2xvci1wcmltYXJ5KTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmJvZHkgaDEge1xuICBmb250LWZhbWlseTogdmFyKC0tZm9udCk7XG4gIGZvbnQtc2l6ZTogdmFyKC0tZm9udC1zaXplLWxhcmdlKTtcbiAgY29sb3I6IHZhcigtLWNvbG9yLWJvcmRlcik7XG4gIG1hcmdpbjogMXJlbSAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5sYWJlbENvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICB3aWR0aDogODB2dztcbiAgZ2FwOiA1cmVtO1xufVxuLmxhYmVsQ29udGFpbmVyIC5sYWJlbCB7XG4gIGZvbnQtc2l6ZTogdmFyKC0tZm9udC1zaXplLW1haW4pO1xuICBmb250LWZhbWlseTogdmFyKC0tZm9udCk7XG4gIGNvbG9yOiB2YXIoLS1jb2xvci1sYWJlbCk7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB3aWR0aDogMjV2aDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uZGl2QnV0dG9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxcmVtO1xufVxuLmRpdkJ1dHRvbiAuYnV0dG9uIHtcbiAgZm9udC1zaXplOiB2YXIoLS1mb250LXNpemUtbWFpbik7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yLWJ1dHRvbik7XG59XG4uZGl2QnV0dG9uIC53aW5uZXJMYWJlbCB7XG4gIGNvbG9yOiB2YXIoLS1jb2xvci13aW5uZXIpO1xuICBmb250LXNpemU6IHZhcigtLWZvbnQtc2l6ZS1tYWluKTtcbiAgaGVpZ2h0OiB2YXIoLS1mb250LXNpemUtbWFpbik7XG4gIG1hcmdpbi1ib3R0b206IHZhcigtLWZvbnQtc2l6ZS1tYWluKTtcbn1cblxuLm1haW4ge1xuICBoZWlnaHQ6IDEwMGR2aDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5jb250YWluZXIge1xuICBoZWlnaHQ6IGF1dG87XG4gIHdpZHRoOiA3MHZ3O1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBnYXA6IDNyZW07XG4gIG1hcmdpbjogMCBhdXRvO1xufVxuLmNvbnRhaW5lciAubGVmdENvbnRhaW5lcixcbi5jb250YWluZXIgLnJpZ2h0Q29udGFpbmVyIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxMHB4IDFmcjtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxMHB4IDFmcjtcbiAgZ2FwOiAxcmVtO1xuICBmbGV4OiAxO1xufVxuXG4uYm9hcmQge1xuICBhc3BlY3QtcmF0aW86IDEvMTtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xuICBncmlkLWF1dG8tZmxvdzogZGVuc2U7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb2xvci1ib3JkZXIpO1xufVxuLmJvYXJkIGRpdiB7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWNvbG9yLWJvcmRlcik7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmb250LXNpemU6IDN2dztcbiAgaGVpZ2h0OiBhdXRvO1xuICB3aWR0aDogYXV0bztcbiAgbWluLWhlaWdodDogMDtcbiAgbWluLXdpZHRoOiAwO1xufVxuXG4ubGV0dGVyTGluZSxcbi5udW1iZXJMaW5lIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZm9udC13ZWlnaHQ6IDkwMDtcbiAgZm9udC1zaXplOiB2YXIoLS1mb250LXNpemUtbWFpbik7XG4gIGNvbG9yOiB2YXIoLS1jb2xvci1ib3JkZXIpO1xufVxuXG4ubGV0dGVyTGluZSB7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG59XG5cbi5udW1iZXJMaW5lIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5sZXR0ZXIsXG4ubnVtYmVyIHtcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIGhlaWdodDogYXV0bztcbiAgd2lkdGg6IGF1dG87XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxMTAwcHgpIHtcbiAgLmNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDk1dnc7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA4MTBweCkge1xuICA6cm9vdCB7XG4gICAgLS1mb250LXNpemUtbGFyZ2U6IDEuNXJlbTtcbiAgICAtLWZvbnQtc2l6ZS1tYWluOiAxcmVtO1xuICAgIC0tZm9udC1zaXplLXNtYWxsOiAwLjVyZW07XG4gIH1cbiAgaDEge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxuICAuY29udGFpbmVyIHtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuICAuYm9hcmQgZGl2IHtcbiAgICBmb250LXNpemU6IDd2dztcbiAgfVxuICAubWFpbiB7XG4gICAgbWF4LWhlaWdodDogMTAwJTtcbiAgfVxuICAubGFiZWxDb250YWluZXIge1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICB9XG4gIC5sZWZ0Q29udGFpbmVyLFxuICAucmlnaHRDb250YWluZXIge1xuICAgIHdpZHRoOiA3NSU7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAuY29udGFpbmVyIHtcbiAgICB3aWR0aDogODB2dztcbiAgICBoZWlnaHQ6IC1tb3otbWF4LWNvbnRlbnQ7XG4gICAgaGVpZ2h0OiBtYXgtY29udGVudDtcbiAgfVxuICAuY29udGFpbmVyIC5sZWZ0Q29udGFpbmVyLFxuICAuY29udGFpbmVyIC5yaWdodENvbnRhaW5lciB7XG4gICAgZ2FwOiAwLjVyZW07XG4gIH1cbiAgLm1haW4ge1xuICAgIG1heC1oZWlnaHQ6IDEwMGR2aDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuICAubGFiZWxDb250YWluZXIsXG4gIC5kaXZCdXR0b24sXG4gIGJvZHkgaDEge1xuICAgIGhlaWdodDogNWR2aDtcbiAgfVxuICAuYnV0dG9uIHtcbiAgICB3aWR0aDogMzBkdnc7XG4gIH1cbiAgYm9keSBoMSB7XG4gICAgbWFyZ2luOiAwO1xuICB9XG59LyojIHNvdXJjZU1hcHBpbmdVUkw9c3R5bGUuY3NzLm1hcCAqL2AsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLnNjc3NcIixcIndlYnBhY2s6Ly8uL2Rpc3QvY3NzL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNDLFNBQUE7RUFDQSxVQUFBO0VBQ0EseUJBQUE7RUFFQSxzQkFBQTtFQUVBLGlCQUFBO0FDQ0Q7O0FERUE7RUFDQyx3QkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSx5QkFBQTtFQUNBLHVCQUFBO0VBQ0EseUNBQUE7RUFDQSx1QkFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7QUNDRDs7QURFQTtFQUNDLGdDQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7QUNDRDtBRENDO0VBQ0Msd0JBQUE7RUFDQSxpQ0FBQTtFQUNBLDBCQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0FDQ0Y7O0FER0E7RUFDQyxhQUFBO0VBQ0EsNkJBQUE7RUFDQSxXQUFBO0VBQ0EsU0FBQTtBQ0FEO0FERUM7RUFDQyxnQ0FBQTtFQUNBLHdCQUFBO0VBQ0EseUJBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtBQ0FGOztBRElBO0VBQ0MsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0FDREQ7QURHQztFQUNDLGdDQUFBO0VBQ0EsbUJBQUE7RUFDQSxxQ0FBQTtBQ0RGO0FESUM7RUFDQywwQkFBQTtFQUNBLGdDQUFBO0VBQ0EsNkJBQUE7RUFDQSxvQ0FBQTtBQ0ZGOztBRE1BO0VBQ0MsY0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLHVCQUFBO0FDSEQ7O0FETUE7RUFDQyxZQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSw4QkFBQTtFQUNBLHVCQUFBO0VBQ0EsU0FBQTtFQUNBLGNBQUE7QUNIRDtBREtDOztFQUVDLGFBQUE7RUFDQSwrQkFBQTtFQUNBLDRCQUFBO0VBQ0EsU0FBQTtFQUNBLE9BQUE7QUNIRjs7QURPQTtFQUNDLGlCQUFBO0VBQ0EsYUFBQTtFQUNBLHNDQUFBO0VBQ0EsbUNBQUE7RUFDQSxxQkFBQTtFQUNBLHVCQUFBO0VBQ0EscUNBQUE7QUNKRDtBRE1DO0VBQ0MscUNBQUE7RUFDQSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLGNBQUE7RUFFQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSxZQUFBO0FDTEY7O0FEU0E7O0VBRUMsYUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0NBQUE7RUFDQSwwQkFBQTtBQ05EOztBRFNBO0VBQ0MsNkJBQUE7RUFDQSxxQkFBQTtBQ05EOztBRFNBO0VBQ0Msc0JBQUE7RUFDQSw2QkFBQTtFQUNBLG1CQUFBO0FDTkQ7O0FEU0E7O0VBRUMseUJBQUE7RUFFQSxzQkFBQTtFQUVBLGlCQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7QUNORDs7QURTQTtFQUNDO0lBQ0MsV0FBQTtFQ05BO0FBQ0Y7QURTQTtFQUNDO0lBQ0MseUJBQUE7SUFDQSxzQkFBQTtJQUNBLHlCQUFBO0VDUEE7RURTRDtJQUNDLGtCQUFBO0VDUEE7RURVRDtJQUNDLDhCQUFBO0lBQ0EsbUJBQUE7RUNSQTtFRFdEO0lBQ0MsY0FBQTtFQ1RBO0VEWUQ7SUFDQyxnQkFBQTtFQ1ZBO0VEYUQ7SUFDQyxjQUFBO0VDWEE7RURjRDs7SUFFQyxVQUFBO0VDWkE7QUFDRjtBRGVBO0VBQ0M7SUFDQyxXQUFBO0lBQ0Esd0JBQUE7SUFBQSxtQkFBQTtFQ2JBO0VEZUE7O0lBRUMsV0FBQTtFQ2JEO0VEaUJEO0lBQ0Msa0JBQUE7SUFDQSxhQUFBO0lBQ0Esc0JBQUE7SUFDQSxtQkFBQTtFQ2ZBO0VEa0JEOzs7SUFHQyxZQUFBO0VDaEJBO0VEbUJEO0lBQ0MsWUFBQTtFQ2pCQTtFRG9CRDtJQUNDLFNBQUE7RUNsQkE7QUFDRixDQUFBLG9DQUFBXCIsXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0ICcuLi9kaXN0L2Nzcy9zdHlsZS5jc3MnO1xuaW1wb3J0IHtHYW1lfSBmcm9tICcuL2dhbWUnO1xuaW1wb3J0IHtnZW5lcmF0ZVNoZWxsLCBjbGVhblNoZWxsfSBmcm9tICcuL2dlbmVyYXRlRE9NJztcblxuZ2VuZXJhdGVTaGVsbCgpO1xuY29uc3QgbmV3R2FtZSA9IG5ldyBHYW1lKCdQbGF5ZXInLCAnQ29tcHV0ZXInKTtcbmNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbicpWzBdO1xubmV3R2FtZS5zdGFydCgpO1xuXG5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hbGVydFxuXHRjb25zdCBhc2sgPSBjb25maXJtKCdTdGFydCBhIG5ldyBnYW1lPycpO1xuXHRpZiAoYXNrKSB7XG5cdFx0Y2xlYW5TaGVsbChuZXdHYW1lLmNvbXB1dGVyQm9hcmQsIDEpO1xuXHRcdGNsZWFuU2hlbGwobmV3R2FtZS5wbGF5ZXJCb2FyZCwgMCk7XG5cdFx0bmV3R2FtZS5yZXNldCgpO1xuXHRcdG5ld0dhbWUuc3RhcnQoKTtcblx0fVxufSk7XG4iXSwibmFtZXMiOlsiQ29tcHV0ZXJCb2FyZCIsIlBsYXllckJvYXJkIiwicGxheWVySHVtYW4iLCJwbGF5ZXJDb21wdXRlciIsImZpbGxQbGF5ZXJCb2FyZHNET00iLCJwbGF5ZXJTaG90RE9NIiwiREVMQVkiLCJHYW1lIiwiY29uc3RydWN0b3IiLCJwbGF5ZXIxIiwicGxheWVyMiIsInBsYXllckJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsImZpbGxCb2FyZFBsYXllciIsImZpbGxCb2FyZENvbXB1dGVyIiwicmVzZXQiLCJwbGF5ZXIiLCJ3aW5lckxhYmVsIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwidGV4dENvbnRlbnQiLCJzdGFydCIsInR1cm4iLCJ3aW5uZXIiLCJoaXQiLCJwbGF5ZXJTaG90IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiY29tcHV0ZXJTaG90IiwiY2hlY2tXaW5uZXIiLCJyYW5kb21HZW5lcmF0aW9uIiwiI3JhbmRvbUdlbmVyYXRpb24iLCJib2FyZCIsInNoaXBzTGVuZ3RoIiwiZGlyIiwibGVuZ3RoIiwic2hpcCIsInBsYWNlZCIsImF0dGVtcHRzIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJwb3NzaWJsZVNob3RzIiwiY29vcmRpbmF0ZSIsIngiLCJ5IiwicmFuZG9tRGlyIiwiX2NoZWNrQ29uZGl0aW9ucyIsIk51bWJlciIsInBsYWNlU2hpcCIsInNoaWZ0Iiwic2hvdCIsInJlY2VpdmVBdHRhY2siLCJtYXAiLCJpc1ByZXZpb3VzQXR0YWNrSGl0IiwiZGFtYWdlZFNoaXAiLCJmaXJzdEhpdENvb3JkIiwibGFzdEhpdCIsImdldERhbWFnZWRTaGlwIiwiY2hlY2tBbGxTaGlwc1N1bmsiLCJTaGlwIiwiU0hJUF9DRUxMIiwiRU1QVFlfQ0VMTCIsIkhJVCIsIk1JU1MiLCJHYW1lYm9hcmQiLCJsaXN0T2ZTaGlwcyIsIk1hcCIsImtleXMiLCJpc1N1bmsiLCJzaGlwTGVuZ3RoIiwieENlbGwiLCJ5Q2VsbCIsInNoaXBQb3NpdGlvbiIsImkiLCJwdXNoIiwiZmlsbEFkamFjZW50Q2VsbHMiLCJzZXQiLCJTdHJpbmciLCJfaGl0U2hpcCIsImNvb3JkcyIsImluY2x1ZGVzIiwiaXNTdW5rU2hpcCIsIiNmaWxsQWRqYWNlbnRDZWxscyIsInNpemUiLCJkaXJlY3Rpb24iLCJ4U3RhcnQiLCJ4RW5kIiwieVN0YXJ0IiwieUVuZCIsImlzQ29ycmVjdENvb3JkaW5hdGUiLCJpc1NoaXBDcm9zc2luZyIsImlzQWRqYWNlbnRDcm9zc2luZyIsIiNpc0NvcnJlY3RDb29yZGluYXRlIiwiY2VsbCIsInNvbWUiLCJwb3NpdGlvbiIsIiNpc0FkamFjZW50Q3Jvc3NpbmciLCJmaWxsQ2VsbHMiLCJzaGlwQ29vcmRzIiwibnVtYmVyRGVzayIsImNvb3IiLCJmaWxsU2luZ2xlQ2VsbCIsIlNJWkUiLCJvZmZzZXRzIiwiZHgiLCJkeSIsIm5ld1giLCJuZXdZIiwiaW5kZXhPZiIsInNwbGljZSIsInByZXZpb3VzQ29vcmQiLCJmaWxsUG9zc2libGVTaG90cyIsImoiLCJzdHlsZSIsImNvbG9yIiwiaGlkZGVuTWFwIiwiUk9XUyIsIkNPTFVNTlMiLCJnZW5lcmF0ZVNoZWxsIiwiYm9keSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwibWFpbiIsImNyZWF0ZUVsZW1lbnQiLCJsYWJlbENvbnRhaW5lciIsImRpdkJ1dHRvbiIsImNvbnRhaW5lciIsImxlZnRDb250YWluZXIiLCJyaWdodENvbnRhaW5lciIsImNyZWF0ZUxldHRlckxpbmUiLCJjcmVhdGVOdW1iZXJMaW5lIiwiY3JlYXRlQm9hcmQiLCJjbGVhblNoZWxsIiwibnVtYmVyIiwicm93IiwiZW50cmllcyIsImVsZW1lbnQiLCJ0eXBlIiwidGV4dCIsImNsYXNzTmFtZSIsInBhcmVudCIsImNsYXNzTGlzdCIsImFkZCIsImFwcGVuZENoaWxkIiwibnVtYmVyTGluZSIsImxldHRlckxpbmUiLCJmcm9tQ2hhckNvZGUiLCJzdGFydExpc3RlbmluZ1BsYXllclR1cm4iLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwic2hvdFBsYXllciIsImNsZWFySW50ZXJ2YWwiLCJjb25kaXRpb25zIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwiY29uZGl0aW9uIiwicmVzdWx0IiwidW5kZWZpbmVkIiwieFMiLCJ5UyIsImluZGV4IiwiZmllbGQiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlciIsImJhY2tsaWdodCIsImUiLCJ0YXJnZXQiLCJjb250YWlucyIsInNsaWNlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInRyYW5zZm9ybSIsImJhY2tncm91bmQiLCJoaXRzIiwibmV3R2FtZSIsImJ1dHRvbiIsImFzayIsImNvbmZpcm0iXSwic291cmNlUm9vdCI6IiJ9