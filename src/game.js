import {ComputerBoard, PlayerBoard} from './gameboard';
import {playerHuman, playerComputer} from './player';

export class Game {
	constructor(player1, player2) {
		this.playerBoard = new PlayerBoard(player1);
		this.computerBoard = new ComputerBoard(player2);
		this.fillBoards();
	}

	fillBoards() {
		this.playerBoard.placeShip(4, 0, 0, 'x');
		this.playerBoard.placeShip(3, 2, 0, 'y');
		this.playerBoard.placeShip(3, 5, 5, 'y');
		this.playerBoard.placeShip(2, 0, 5, 'x');
		this.playerBoard.placeShip(2, 4, 2, 'x');
		this.playerBoard.placeShip(2, 7, 3, 'y');
		this.playerBoard.placeShip(1, 0, 9, 'y');
		this.playerBoard.placeShip(1, 9, 9, 'y');
		this.playerBoard.placeShip(1, 3, 8, 'y');
		this.playerBoard.placeShip(1, 9, 1, 'y');
		this.computerBoard.placeShip(4, 0, 0, 'x');
		this.computerBoard.placeShip(3, 2, 0, 'y');
		this.computerBoard.placeShip(3, 5, 5, 'y');
		this.computerBoard.placeShip(2, 0, 5, 'x');
		this.computerBoard.placeShip(2, 4, 2, 'x');
		this.computerBoard.placeShip(2, 7, 3, 'y');
		this.computerBoard.placeShip(1, 0, 9, 'y');
		this.computerBoard.placeShip(1, 9, 9, 'y');
		this.computerBoard.placeShip(1, 3, 8, 'y');
		this.computerBoard.placeShip(1, 9, 1, 'y');
	}

	computerShot() {
		const shot = playerComputer(this.playerBoard);
		this.playerBoard.receiveAttack(shot);
	}

	playerShot() {
		const shot = playerHuman();
		this.computerBoard.receiveAttack(shot);
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
