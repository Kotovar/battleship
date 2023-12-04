import {ComputerBoard, PlayerBoard} from './gameboard';
import {playerHuman, playerComputer} from './player';
import {fillPlayerBoardsDOM, playerShotDOM} from './generateDOM';

export class Game {
	constructor(player1, player2) {
		this.playerBoard = new PlayerBoard(player1);
		this.computerBoard = new ComputerBoard(player2);
		this.fillBoardPlayer();
		this.fillBoardComputer();
		fillPlayerBoardsDOM(this.playerBoard);
	}

	reset() {
		this.playerBoard = new PlayerBoard(this.playerBoard.player);
		this.computerBoard = new ComputerBoard(this.computerBoard.player);
		this.fillBoardPlayer();
		this.fillBoardComputer();
		fillPlayerBoardsDOM(this.playerBoard);
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
		const shot = await playerHuman();
		this.computerBoard.receiveAttack(shot);
		playerShotDOM(this.computerBoard, shot);
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
