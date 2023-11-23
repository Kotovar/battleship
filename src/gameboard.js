import {Ship} from './ship';

const SHIP_CELL = 'S';
const EMPTY_CELL = 'O';
// const HIT = 'X';

export class Gameboard {
	constructor(player) {
		this.player = player;
	}

	listOfShips = new Map();

	map = [
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	];

	getlistOfShips() {
		return this.listOfShips;
	}

	placeShip(shipLength, xCell, yCell, dir) {
		if (!this.#checkConditions(shipLength, xCell, yCell, dir)) {
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

	receiveAttack(coordinate) {}

	#fillAdjacentCells(size, xCell, yCell, direction) {
		let xStart = xCell - 1;
		let xEnd = direction === 'x' ? xCell + 1 : xCell + size;
		let yStart = yCell - 1;
		let yEnd = direction === 'y' ? yCell + 1 : yCell + size;

		for (let x = xStart; x <= xEnd; x++) {
			for (let y = yStart; y <= yEnd; y++) {
				if (x >= 0 && x < this.map.length && y >= 0 && y < this.map.length) {
					this.map[x][y] =
						this.map[x][y] === SHIP_CELL ? SHIP_CELL : EMPTY_CELL;
				}
			}
		}
	}

	#checkConditions(shipLength, xCell, yCell, dir) {
		if (this.#isCorrectCoordinate(shipLength, xCell, yCell, dir)) {
			console.log('Некорректный ввод');
			return false;
		}

		if (this.listOfShips.size && this.#isShipCrossing(`${xCell}${yCell}`)) {
			console.log('Пересечение с другим кораблём');
			return false;
		}

		if (this.listOfShips.size && this.#isAdjacentCrossing(xCell, yCell)) {
			console.log('Близкое расположение к другому кораблю');
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

	#isAdjacentCrossing = (x, y) => (this.map[x][y] === 'O' ? true : false);
}
