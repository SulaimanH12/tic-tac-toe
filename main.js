// Fixes issue with warning of using ES6 syntax
/*jshint esversion: 6 */

var origBoard;
const huPlayer = 'X'; // Player set as 'X'
const aiPlayer = 'O'; // Computer set as 'O'

// All possible winning combinations
const winCombos = [ 
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    // Makes sure that after game is finished and restart button is clicked. Endgame is set to display none again
    document.querySelector(".endgame").style.display = 'none'; 
    origBoard = Array.from(Array(9).keys()); // Makes an array from 0 to 9 like ids for td
    // console.log(origBoard);
    // Remove the 'X' and 'O' from board when restart
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        // Winning combo is highlighted, this removes the highlight
        cells[i].style.removeProperty('background-color'); 
        // Every time a cell is clicked the turnClick functon is called
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    // Makes it that a clicked square can't be clicked again
    // If the id of a certain square is a number that means it hasn't been clicked
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

// Board is clickable and 'X' appears on which ever square is clicked
function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    // Check which player has won and display end of game
    let gameWon = checkWin(origBoard, player);
    // If game is won then gameOver will run otherwise gameWon stays as null
    if(gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    // Check if game has been won by looping through the winning combos
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            // If game it won then it will know which player won and the combo
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver (gameWon) {
    // Highlight the winning combo
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
        // If game is won by human then background color will be blue and red for AI
        gameWon.player == huPlayer ? "#6bf" : "red";
    }
    // Cells are not clickable after game has finished
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    // If game is won by human, text is you win. If lose then you lose.
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
    // Initially the endgame is display none. When winner is declared its display block
    document.querySelector(".endgame").style.display = 'block';
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    // All the squares that are empty will return a number and vice versa
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return emptySquares()[0];
}

function checkTie() {
    // If every square is filled up and no one has won = tie
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);

        } 
        // If the if statement is true then it will return true, if not then false
        declareWinner('Tie Game!');
        return true;  
    }
    return false;
}
