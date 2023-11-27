import '../dist/css/style.css';
// import {Ship} from './ship';
import {Gameboard} from './gameboard';
import {player} from './player';

const playerBoard = new Gameboard('human');
const computerBoard = new Gameboard('computer');

playerBoard.placeShip(3, 5, 5, 'x');
playerBoard.placeShip(3, 0, 0, 'y');
playerBoard.placeShip(3, 3, 1, 'x');
playerBoard.placeShip(3, 0, 0, 'x');
playerBoard.placeShip(3, 0, 2, 'y');
let playerTurn = player('human');
let computerTurn = player('computer');

computerBoard.receiveAttack(playerTurn);
console.log(computerBoard);
playerBoard.receiveAttack(computerTurn);
console.log(computerTurn);
console.log(playerBoard.map);
console.log(playerBoard.getlistOfShips());
console.log(playerBoard.checkAllShipsSunk());
