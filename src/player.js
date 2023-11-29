export function playerHuman() {
	startListeningPlayerTurn();
	return new Promise((resolve) => {
		const interval = setInterval(() => {
			if (shotPlayer !== null) {
				resolve(shotPlayer);
				clearInterval(interval);
				shotPlayer = null;
			}
		}, 1000);
	});
}

let shotPlayer = null;

export function playerComputer(board) {
	const randomIndex = Math.floor(Math.random() * board.possibleShots.length);
	const shot = board.possibleShots[randomIndex];
	board.possibleShots.splice(randomIndex, 1);
	return shot;
}

function startListeningPlayerTurn() {
	const field = document.getElementsByClassName('board')[1];
	field.addEventListener('click', handler);
}

function handler(e) {
	const field = document.getElementsByClassName('board')[1];
	if (e.target.classList.contains('cell') && e.target.textContent === '') {
		console.log(e.target.textContent);
		shotPlayer = e.target.classList[1].slice(5);
		field.removeEventListener('click', handler);
	}
}
// ДОБАВИТЬ ВОЗМОЖНОСТЬ ЕЩЁ ОДНОГО ВЫСТРЕЛА, ЕСЛИ БЫЛО ПОПАДАНИЕ
