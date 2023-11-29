import {ComputerBoard, PlayerBoard} from './gameboard';
import {playerHuman, playerComputer} from './player';
import {fillPlayerBoardsDOM, generateShell, playerShot} from './generateDOM';

export class Game {
	constructor(player1, player2) {
		this.playerBoard = new PlayerBoard(player1);
		this.computerBoard = new ComputerBoard(player2);
		this.fillBoardPlayer();
		this.fillBoardComputer();
		generateShell();
		fillPlayerBoardsDOM(this.playerBoard);
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
				const randomIndex = Math.floor(
					Math.random() * this.playerBoard.possibleShots.length,
				);
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
		const shot = playerComputer(this.playerBoard);
		this.playerBoard.receiveAttack(shot);
		fillPlayerBoardsDOM(this.playerBoard);
		this.checkWinner();
	}

	async playerShot() {
		const shot = await playerHuman();
		this.computerBoard.receiveAttack(shot);
		playerShot(this.computerBoard, shot);
		this.checkWinner();
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
