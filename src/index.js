import '../dist/css/style.css';
// import {Ship} from './ship';
import {Gameboard} from './gameboard';

const board = new Gameboard('player1');

board.placeShip(3, 5, 5, 'x');
board.placeShip(3, 0, 0, 'y');
board.placeShip(3, 3, 1, 'x');
board.placeShip(3, 0, 0, 'x');
board.placeShip(3, 0, 2, 'y');
console.log(board.map);

board.receiveAttack('55');
board.receiveAttack('56');
board.receiveAttack('57');
board.receiveAttack('14');
board.receiveAttack('00');
board.receiveAttack('10');
board.receiveAttack('20');
board.receiveAttack('02');
board.receiveAttack('12');
board.receiveAttack('22');
console.log(board.getlistOfShips());
console.log(board.checkAllShipsSunk());
