import '../dist/css/style.css';
import {Game} from './game';
import {generateShell, cleanShell} from './generateDOM';

generateShell();
const newGame = new Game('Player', 'Computer');
const button = document.getElementsByClassName('button')[0];
newGame.start();
button.addEventListener('click', () => {
	const ask = confirm('Start a new game?');
	if (ask) {
		cleanShell(newGame.computerBoard);
		newGame.reset();
		newGame.start();
	}
});
