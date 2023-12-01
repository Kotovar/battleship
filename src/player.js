import {MISS} from './gameboard';

export function playerHuman() {
	startListeningPlayerTurn();
	return new Promise((resolve) => {
		const interval = setInterval(() => {
			if (shotPlayer !== null) {
				resolve(shotPlayer);
				clearInterval(interval);
				shotPlayer = null;
			}
		}, 100);
	});
}

let shotPlayer = null;

export function playerComputer(board) {
	let shot;
	const size = board.map.length - 1;
	if (board.isPreviousAttackHit) {
		let [x, y] = board.previousCoord;
		x = Number(x);
		y = Number(y);

		const conditions = [
			// проверка клетки слева
			(x, y) => {
				if (
					y > 0 &&
					board.map[x][y - 1] !== MISS &&
					board.possibleShots.indexOf(`${x}${y - 1}`) !== -1
				) {
					return `${x}${y - 1}`;
				}
			},
			// проверка клетки выше
			(x, y) => {
				if (
					x > 0 &&
					board.map[x - 1][y] !== MISS &&
					board.possibleShots.indexOf(`${x - 1}${y}`) !== -1
				) {
					return `${x - 1}${y}`;
				}
			},
			// проверка клетки правее
			(x, y) => {
				if (
					y < size &&
					board.map[x][y + 1] !== MISS &&
					board.possibleShots.indexOf(`${x}${y + 1}`) !== -1
				) {
					return `${x}${y + 1}`;
				}
			},
			// проверка клетки ниже
			(x, y) => {
				if (
					x < size &&
					board.map[x + 1][y] !== MISS &&
					board.possibleShots.indexOf(`${x + 1}${y}`) !== -1
				) {
					return `${x + 1}${y}`;
				}
			},
		];

		const shuffle = function (array) {
			let currentIndex = array.length;
			let randomIndex;

			while (currentIndex !== 0) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				[array[currentIndex], array[randomIndex]] = [
					array[randomIndex],
					array[currentIndex],
				];
			}

			return array;
		};

		for (const condition of shuffle(conditions)) {
			const result = condition(x, y);

			if (result !== undefined) {
				shot = result;
				break;
			}
		}

		if (shot === undefined) {
			const random = Math.floor(Math.random() * board.possibleShots.length);
			shot = board.possibleShots[random];
		}

		const index = board.possibleShots.indexOf(shot);
		board.possibleShots.splice(index, 1);
	} else {
		const randomIndex = Math.floor(Math.random() * board.possibleShots.length);
		shot = board.possibleShots[randomIndex];
		board.possibleShots.splice(randomIndex, 1);
	}

	board.previousCoord = shot;
	return shot;
}

function startListeningPlayerTurn() {
	const field = document.getElementsByClassName('board')[1];
	field.addEventListener('click', handler);
}

function handler(e) {
	const field = document.getElementsByClassName('board')[1];
	if (e.target.classList.contains('cell') && e.target.textContent === '') {
		shotPlayer = e.target.classList[1].slice(5);
		field.removeEventListener('click', handler);
	}
}
