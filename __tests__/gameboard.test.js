/* eslint-disable */
import {Gameboard, EMPTY} from '../src/gameboard';

let board;

beforeEach(() => {
	board = new Gameboard('player');
});

test('На клетку [2][1] поставлен Корабль S', () => {
	board.placeShip(1, 2, 1, 'x');
	expect(board.map).toEqual([
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['O', 'O', 'O', '.', '.', '.', '.', '.', '.', '.'],
		['O', 'S', 'O', '.', '.', '.', '.', '.', '.', '.'],
		['O', 'O', 'O', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
		['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	]);
});

test('После размещения 2х кораблей, поле знает что кораблей на поле = 2', () => {
	board.placeShip(3, 1, 1, 'x');
	board.placeShip(4, 4, 7, 'y');
	expect(board.listOfShips.size).toBe(2);
});

test('После размещения 2х кораблей, у поля есть список из 2х кораблей с их координатами', () => {
	board.placeShip(2, 5, 5, 'x');
	board.placeShip(3, 4, 3, 'y');
	expect(board.listOfShips.size).toBe(2);
});

test('Неправильное размещение выводит сообщение об ошибке', () => {
	expect(board.placeShip(4, 0, 8, 'x')).toBe(`Измените ввод 4 0 8 x`);
});

test('Неправильное размещение выводит не увеличивает количество размещённых кораблей на поле', () => {
	board.placeShip(2, 5, 9, 'x');
	board.placeShip(2, 5, 5, 'x');
	board.placeShip(3, 9, 3, 'y');
	expect(board.listOfShips.size).toBe(1);
});

test('Если корабли пересекаются - вернуть ошибку', () => {
	board.placeShip(3, 0, 0, 'x');
	expect(board.placeShip(3, 0, 2, 'y')).toBe(`Измените ввод 3 0 2 y`);
	board.placeShip(3, 2, 2, 'y');
	expect(board.listOfShips.size).toBe(2);
});

test('Если корабли близко - вернуть ошибку', () => {
	board.placeShip(3, 0, 0, 'y');
	expect(board.placeShip(3, 3, 1, 'x')).toBe(`Измените ввод 3 3 1 x`);

	expect(board.listOfShips.size).toBe(1);
});
