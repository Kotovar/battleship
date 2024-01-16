# battleship

implementation of the game Sea Battle in javaScript

![1](https://github.com/Kotovar/battleship_Odin/assets/77914431/47b5d388-dc59-471b-b1ea-0c46e29c8e93)


## How to use

To use battleship, you need to have `Node.js` and `npm` installed on your system. You can then clone this repository and run the following commands:

```bash
- npm install -g webpack # to install webpack globally
- npm link webpack-cli # to link webpack-cli in the project directory
- webpack # to bundle the project filesbattleship
- open the dist/index.html file in your browser
```

[Live preview](https://kotovar.github.io/battleship_Odin/)

## How it works

To create this application I used the following technologies:

- HTML
- CSS + SASS
- JavaScript
- Webpack
- Eslint
- Jest
- Babel

---

This implementation of the game uses the standard rules:

- Ships: 1 four-deck, 2 three-deck, 3 two-deck, 4 one-deck
- Ships cannot be adjacent, including diagonally
- Game boards are numbered with digits and letters
- The current version only provides random generation of boards for the player and the computer, taking into account all the placement rules

The moves are taken in turns, if someone hits a ship, they can make another attempt until they miss

The computer has a delay between each move for clarity.

A wounded ship is highlighted with a certain color, a sunk ship - with another color. The area around the sunk ship is painted in fields where you can no longer shoot. The computer takes this into account and does not try to shoot there.

Also, if the computer hits a ship and wounds it, it will try to finish it off in the next moves, and until this ship is sunk, it will not start making random moves again.

## Credits

This project was inspired by [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship), which is an open source curriculum for learning web development.
