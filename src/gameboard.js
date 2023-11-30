import {Ship} from './ship';

const SHIP_CELL = '◻';
const EMPTY_CELL = 'O';
const HIT = '▣';
const MISS = '·';

export class Gameboard {
	constructor(player) {
		this.player = player;
	}

	listOfShips = new Map();

	map = [
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	];

	getlistOfShips() {
		return this.listOfShips;
	}

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

		const ship = new Ship(shipLength);
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
		this.map[x][y] === SHIP_CELL
			? (this._hitShip(coordinate), (this.map[x][y] = HIT))
			: (this.map[x][y] = MISS);
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
					this.map[x][y] =
						this.map[x][y] === SHIP_CELL ? SHIP_CELL : EMPTY_CELL;
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

		if (
			this.listOfShips.size &&
			this.#isAdjacentCrossing(shipLength, xCell, yCell, dir)
		) {
			return false;
		}

		return true;
	}

	#isCorrectCoordinate(length, x, y, dir) {
		return !(dir === 'x'
			? length + y <= this.map.length && x < this.map.length
			: y < this.map.length && length + x <= this.map.length);
	}

	#isShipCrossing = (cell) =>
		[...this.listOfShips].some(([, position]) => position.includes(cell));

	#isAdjacentCrossing(size, x, y, dir) {
		if (this.map[x][y] === 'O') {
			return true;
		}

		if (dir === 'x' && size > 1) {
			for (let i = 1; i < size; i++) {
				if (
					this.map[x][y + i] === SHIP_CELL ||
					this.map[x][y + i] === EMPTY_CELL
				) {
					return true;
				}
			}
		} else if (dir === 'y' && size > 1) {
			for (let i = 1; i < size; i++) {
				if (
					this.map[x + i][y] === SHIP_CELL ||
					this.map[x + i][y] === EMPTY_CELL
				) {
					return true;
				}
			}
		}

		return false;
	}
}

export class PlayerBoard extends Gameboard {
	possibleShots = [];
	constructor(player) {
		super(player);
		this.fillPossibleShots();
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
			for (const coor of coords) {
				const [x, y] = coor;
				cell = document.getElementsByClassName(`cell-${x}${y}`)[0];
				cell.style.color = 'red';
			}
		}
	}
}

export class ComputerBoard extends Gameboard {
	hiddenMap = [
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	];

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

	// _hitShip(coordinate) {
	// 	let hit = false;
	// 	for (const [ship, coords] of this.listOfShips) {
	// 		if (coords.includes(coordinate)) {
	// 			ship.hit();
	// 			this.isSunkShip(ship, coords, coordinate);
	// 			hit = true;
	// 			break;
	// 		}
	// 	}

	// 	return hit;
	// }

	isSunkShip(ship, coords, hit) {
		const [x, y] = hit;
		let cell = document.getElementsByClassName(`cell-${x}${y}`)[1];
		cell.style.color = ship.isSunk() ? 'red' : 'purple';
		if (ship.isSunk()) {
			for (const coor of coords) {
				const [x, y] = coor;
				cell = document.getElementsByClassName(`cell-${x}${y}`)[1];
				cell.style.color = 'red';
			}
		}
	}
}
