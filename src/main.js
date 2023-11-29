import '../dist/css/style.css';
import {Game} from './game';

// создание игры
const newGame = new Game('Игрок-человек', 'Компьютер');

newGame.computerShot();
newGame.computerShot();
newGame.playerShot();

console.log(newGame);
