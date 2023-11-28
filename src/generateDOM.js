export function generateShell() {
	const body = document.getElementsByTagName('body')[0];
	const h1 = document.createElement('h1');
	const container = document.createElement('div');
	const divBoardPlayer = document.createElement('div');
	const divBoardComputer = document.createElement('div');
	const labelContainer = document.createElement('div');
	const labelPlayer1 = document.createElement('p');
	const labelPlayer2 = document.createElement('p');
	h1.textContent = 'Battleship game';
	labelPlayer1.textContent = 'You';
	labelPlayer2.textContent = 'Computer';

	divBoardPlayer.id = 'boardPlayer';
	divBoardComputer.id = 'boardComputer';
	container.id = 'container';
	labelContainer.id = 'labelContainer';
	labelPlayer1.classList.add('label');
	labelPlayer2.classList.add('label');

	body.appendChild(h1);
	body.appendChild(labelContainer);
	labelContainer.appendChild(labelPlayer1);
	labelContainer.appendChild(labelPlayer2);
	body.appendChild(container);
	container.appendChild(divBoardPlayer);
	container.appendChild(divBoardComputer);

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			const cell = document.createElement('div');
			const cell2 = document.createElement('div');
			cell.style.width = 'auto';
			cell.style.height = 'auto';
			cell2.style.width = 'auto';
			cell2.style.height = 'auto';
			divBoardPlayer.appendChild(cell);
			divBoardComputer.appendChild(cell2);
			cell.classList.add(`cell-${i}${j}`);
			cell2.classList.add(`cell-${i}${j}`);
		}
	}
}

export function fillPlayerBoardsDOM(board) {
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			const cell = document.getElementsByClassName(`cell-${i}${j}`);
			cell[0].textContent =
				board.map[i][j] === 'O' || board.map[i][j] === '.'
					? ' '
					: board.map[i][j];
		}
	}
}

export function playerShot(board, shot) {
	const [x, y] = shot;
	const cell = document.getElementsByClassName(`cell-${x}${y}`);
	cell[1].textContent = board.map[x][y];
}
