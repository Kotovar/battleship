export function playerHuman() {
	// return prompt('Введи координату');
	return '00';
}

export function playerComputer(board) {
	const randomIndex = Math.floor(Math.random() * board.possibleShots.length);
	const shot = board.possibleShots[randomIndex];
	board.possibleShots.splice(randomIndex, 1);
	return shot;
}
