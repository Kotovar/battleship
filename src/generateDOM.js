const ROWS = 10;
const COLUMNS = 10;

export function generateShell() {
	const body = document.getElementsByTagName('body')[0];

	createElement('h1', 'Battleship game', '', body);

	const labelContainer = createElement('div', '', 'labelContainer', body);
	const divButton = createElement('div', '', 'divButton', body);
	createElement('button', 'Start Game', 'button', divButton);
	createElement('h2', '', 'winnerLabel', divButton);
	createElement('p', 'You', 'label', labelContainer);
	createElement('p', 'Computer', 'label', labelContainer);

	const container = createElement('div', '', 'container', body);
	const leftContainer = createElement('div', '', 'leftContainer', container);
	const rightContainer = createElement('div', '', 'rightContainer', container);

	createElement('div', '', 'fake', leftContainer);
	createLetterLine(leftContainer);
	createNumberLine(leftContainer);
	createBoard(leftContainer);

	createElement('div', '', 'fake', rightContainer);
	createLetterLine(rightContainer);
	createNumberLine(rightContainer);
	createBoard(rightContainer);
}

export function cleanShell(board) {
	for (const [i, row] of board.map.entries()) {
		for (const j of row.keys()) {
			const element = document.getElementsByClassName(`cell-${i}${j}`);
			element[1].textContent = '';
			element[1].style.color = 'black';
		}
	}
}

export function fillPlayerBoardsDOM(board) {
	for (const [i, row] of board.map.entries()) {
		for (const [j, cell] of row.entries()) {
			const element = document.getElementsByClassName(`cell-${i}${j}`);
			element[0].textContent = cell === 'O' || cell === ' ' ? ' ' : cell;
		}
	}
}

export function playerShotDOM(board, shot) {
	const [x, y] = shot;
	const element = document.getElementsByClassName(`cell-${x}${y}`);
	element[1].textContent = board.map[x][y];
}

function createElement(type, text, className, parent) {
	const element = document.createElement(type);
	element.textContent = text;
	if (className) {
		element.classList.add(className);
	}

	parent.appendChild(element);
	return element;
}

function createBoard(parent) {
	const board = createElement('div', '', 'board', parent);
	for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLUMNS; j++) {
			const cell = createElement('div', '', 'cell', board);
			cell.classList.add(`cell-${i}${j}`);
		}
	}

	return board;
}

function createNumberLine(parent) {
	const numberLine = createElement('div', '', 'numberLine', parent);
	for (let i = 0; i < ROWS; i++) {
		createElement('div', i + 1, 'number', numberLine);
	}

	return numberLine;
}

function createLetterLine(parent) {
	const letterLine = createElement('div', '', 'letterLine', parent);
	for (let i = 0; i < COLUMNS; i++) {
		createElement('div', String.fromCharCode(65 + i), 'letter', letterLine);
	}

	return letterLine;
}
