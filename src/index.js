import '../dist/css/style.css';
// import {Ship} from './ship';
import {Gameboard} from './gameboard';

const board = new Gameboard('player1');

board.placeShip(4, 4, 3, 'y');
board.placeShip(3, 0, 3, 'x');
board.placeShip(1, 0, 0, 'x');
console.log(board.map);
console.log(board.getlistOfShips());
console.log(board.searchShip('05'));
