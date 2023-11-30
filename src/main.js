import '../dist/css/style.css';
import {Game} from './game';
import {generateShell, cleanShell} from './generateDOM';

generateShell();
const newGame = new Game('Player', 'Computer');
const button = document.getElementsByClassName('button')[0];
newGame.start();
console.log(newGame);

button.addEventListener('click', () => {
	// eslint-disable-next-line no-alert
	const ask = confirm('Start a new game?');
	if (ask) {
		cleanShell(newGame.computerBoard, 1);
		cleanShell(newGame.playerBoard, 0);
		newGame.reset();
		newGame.start();
	}
});
