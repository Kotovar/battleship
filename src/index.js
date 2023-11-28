import '../dist/css/style.css';
// import {Ship} from './ship';
import {ComputerBoard, PlayerBoard} from './gameboard';
import {playerHuman, playerComputer} from './player';

// создание доски для игрока и компьютера
const playerBoard = new PlayerBoard('human');
const computerBoard = new ComputerBoard('computer');

// размещение кораблей у игрока
playerBoard.placeShip(3, 5, 5, 'x');
playerBoard.placeShip(3, 0, 0, 'y');
playerBoard.placeShip(3, 3, 1, 'x');
playerBoard.placeShip(3, 0, 0, 'x');
playerBoard.placeShip(3, 0, 2, 'y');

// размещение кораблей у компьютера
computerBoard.placeShip(3, 5, 5, 'x');
computerBoard.placeShip(3, 0, 0, 'y');
computerBoard.placeShip(3, 3, 1, 'x');
computerBoard.placeShip(3, 0, 0, 'x');
computerBoard.placeShip(3, 0, 2, 'y');

// выстрелы компьютера

playerBoard.receiveAttack(playerComputer(playerBoard));
playerBoard.receiveAttack(playerComputer(playerBoard));

// выстрелы игрока
computerBoard.receiveAttack(playerHuman());
computerBoard.receiveAttack('01');
computerBoard.receiveAttack('10');

// вывод досок
console.log(computerBoard);
console.log(playerBoard);
