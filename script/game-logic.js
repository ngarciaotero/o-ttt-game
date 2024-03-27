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

