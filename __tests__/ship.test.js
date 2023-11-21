/* eslint-disable */
import {Ship} from '../src/ship';

const mockHit = jest.fn(function () {
	this.hits++;
});

Ship.prototype.hit = mockHit;

let ship;
let shipSmall;

beforeEach(() => {
	ship = new Ship(4);
	shipSmall = new Ship(1);
});

afterEach(() => {
	mockHit.mockClear();
});

test('Корабль длиной 4 не потонет после 3 выстрелов', () => {
	for (let i = 0; i < 3; i++) {
		ship.hit();
	}
	expect(mockHit).toHaveBeenCalledTimes(3);
	expect(ship.isSunk()).toBe(false);
	expect(ship.hits).toBe(3);
});

test('Корабль длиной 4 потонет после 4 выстрелов', () => {
	for (let i = 0; i < 4; i++) {
		ship.hit();
	}
	expect(mockHit).toHaveBeenCalledTimes(4);
	expect(ship.isSunk()).toBe(true);
	expect(ship.hits).toBe(4);
});

test('Корабль длиной 1 потонет после 1 выстрела', () => {
	shipSmall.hit();
	expect(mockHit).toHaveBeenCalledTimes(1);
	expect(shipSmall.isSunk()).toBe(true);
	expect(shipSmall.hits).toBe(1);
});

test('Корабль длиной 1 по умолчанию не тонет', () => {
	expect(shipSmall.isSunk()).toBe(false);
	expect(shipSmall.hits).toBe(0);
});
