const createPlayer = (mark) => {
  let playerMark = mark;

  const getMark = () => playerMark;

  return { getMark };
};

const gameBoard = (function () {
  let board = [];
  const createGameBoard = () => {
    const boardSize = 3;
    board = [];

    for (let i = 0; i < boardSize; i++) {
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push("");
      }
      board.push(row);
    }
  };

  const getGameBoard = () => {
    return board.map((row) => [...row]);
  };

  const resetGameBoard = () => {
    createGameBoard();
  };

  const setCell = (row, column, mark) => {
    const targetCell = board[row][column];
    if (targetCell === "") {
      board[row][column] = mark;
      return true;
    }
    return false;
  };

  const winningCombinations = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  const getWinningCombinations = () => winningCombinations;

  createGameBoard();
  return { getGameBoard, resetGameBoard, setCell, getWinningCombinations };
})();

const game = (function () {
  let currentPlayer;
  let board;
  let turn = 0;
  let player1, player2;
  let player1Moves = [];
  let player2Moves = [];

  const startGame = (p1, p2) => {
    player1 = p1;
    player2 = p2;
    initializeBoard();
    currentPlayer = player1;
  };

  const resetGame = () => {
    board.resetGameBoard();
    turn = 0;
    player1Moves = [];
    player2Moves = [];
  };

  const makeMove = (row, column) => {
    const success = board.setCell(row, column, currentPlayer.getMark());
    if (success) {
      addPlayerMove(getPlayerMoves(currentPlayer), row, column);
      increaseTurnCount();
      if (winnerExists(getPlayerMoves(currentPlayer))) {
        resetGame();
      } else if (tieExists()) {
        resetGame();
      } else {
        switchPlayer();
      }
    }
    return success;
  };

  const initializeBoard = () => {
    board = gameBoard;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const increaseTurnCount = () => {
    turn++;
  };

  const addPlayerMove = (playerMoves, row, column) => {
    playerMoves.push([row, column]);
  };

  const getPlayerMoves = (player) => {
    return player === player1 ? player1Moves : player2Moves;
  };

  const tieExists = () => {
    return turn === 9;
  };

  const winnerExists = (playerMoves) => {
    const winningCombinations = board.getWinningCombinations();

    for (const combination of winningCombinations) {
      let isWinner = true;
      for (const [row, column] of combination) {
        if (
          !playerMoves.some(
            ([playerRow, playerColumn]) =>
              playerRow === row && playerColumn === column
          )
        ) {
          isWinner = false;
          break;
        }
      }
      if (isWinner) return true;
    }
    return false;
  };

  return { startGame, makeMove };
})();
