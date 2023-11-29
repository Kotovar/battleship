import '../dist/css/style.css';
import {Game} from './game';

// создание игры
const newGame = new Game('Player', 'Computer');

newGame.start();

console.log(newGame);
