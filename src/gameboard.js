import {Ship} from './ship';

const SHIP = 'S';
// const HIT = 'X';

export class Gameboard {
	constructor(player) {
		this.player = player;
	}

	countShips = 0;

	ships = [];
	// ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1].map(length => new Ship(length));

	listOfShips = new Map();

	map = [
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
		['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
	];

	getlistOfShips() {
		return this.listOfShips;
	}

	placeShip(shipLength, xCell, yCell, dir) {
		if (this.checkConditions(shipLength, xCell, yCell, dir)) {
			return 'Некорректный ввод';
		}

		if (this.countShips > 0 && this.searchShip(`${xCell}${yCell}`)) {
			return 'Пересечение с другим кораблём';
		}

		const ship = new Ship(shipLength);
		const shipPosition = [];
		if (dir === 'x') {
			for (let i = 0; i < ship.length; i++) {
				this.map[xCell][yCell + i] = SHIP;
				shipPosition.push(`${xCell}${yCell + i}`);
			}
		} else if (dir === 'y') {
			for (let i = 0; i < ship.length; i++) {
				this.map[xCell + i][yCell] = SHIP;
				shipPosition.push(`${xCell + i}${yCell}`);
			}
		}

		this.listOfShips.set(ship, shipPosition);
		this.countShips++;
	}

	checkConditions(length, x, y, dir) {
		if (dir === 'x' && length + y < this.map.length && x < this.map.length) {
			return false;
		}

		if (dir === 'y' && y < this.map.length && length + x < this.map.length) {
			return false;
		}

		return true;
	}

	searchShip(cell) {
		return [...this.listOfShips].some(([, position]) =>
			position.includes(cell),
		);
	}
}
