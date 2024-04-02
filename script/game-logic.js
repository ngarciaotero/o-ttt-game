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

const displayController = (function () {
  const board = document.querySelector(".game-board");
  const cells = document.querySelectorAll(".cell");

  const renderBoard = () => {
    cells.forEach((cell, index) => {
      cell.textContent =
        gameBoard.getGameBoard()[getRowIndex(index)][getColumnIndex(index)];
    });
  };

  const handleUserMove = (index) => {
    const successfulMove = game.makeMove(
      getRowIndex(index),
      getColumnIndex(index)
    );
    if (successfulMove) {
      renderBoard();
    }
  };

  const getRowIndex = (index) => Math.floor(index / 3);

  const getColumnIndex = (index) => index % 3;

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleUserMove(index));
  });

  function addMarkOptions(
    markOptions,
    markContainerSelector,
    profileContainerSelector,
    selectedClass,
    profileImgClass
  ) {
    const marksContainer = document.querySelector(markContainerSelector);
    const profileContainer = document.querySelector(profileContainerSelector);
    markOptions.forEach((mark) => {
      const img = createImg(mark);
      img.addEventListener("click", function () {
        addSelectedClass(img, selectedClass);
        addMarkToProfile(mark.imgSrc, profileContainer, profileImgClass);
      });
      marksContainer.appendChild(img);
    });
  }

  function addSelectedClass(imgElement, selectedClass) {
    document.querySelectorAll(".mark-item").forEach((item) => {
      item.classList.remove(selectedClass);
    });
    imgElement.classList.add(selectedClass);
  }

  function addMarkToProfile(imgSrc, profileContainer, profileImgClass) {
    const previousImgProfile = profileContainer.querySelector(
      `.${profileImgClass}`
    );
    if (previousImgProfile) {
      profileContainer.removeChild(previousImgProfile);
    }
    const imgProfile = document.createElement("img");
    imgProfile.classList.add(profileImgClass);
    imgProfile.src = imgSrc;
    profileContainer.appendChild(imgProfile);
  }

  function createImg(mark) {
    const imgName = document.createElement("img");
    imgName.classList.add("mark-item");
    imgName.classList.add(mark.area);
    imgName.src = mark.imgSrc;
    imgName.alt = mark.imgAlt;
    return imgName;
  }

  const xMarkOptions = [
    {
      imgAlt: "letter x",
      imgSrc: "imgs/x-marks/letter-x.png",
      area: "letter-x",
    },
    {
      imgAlt: "windmill",
      imgSrc: "imgs/x-marks/windmill.png",
      area: "windmill",
    },
    {
      imgAlt: "skull cross bones",
      imgSrc: "imgs/x-marks/bone.png",
      area: "skull",
    },
    {
      imgAlt: "satellite",
      imgSrc: "imgs/x-marks/satellite.png",
      area: "satellite",
    },
    { imgAlt: "dna", imgSrc: "imgs/x-marks/dna.png", area: "dna" },
  ];

  const oMarkOptions = [
    {
      imgAlt: "letter o",
      imgSrc: "imgs/o-marks/letter-o.png",
      area: "letter-o",
    },
    {
      imgAlt: "compass",
      imgSrc: "imgs/o-marks/compass.png",
      area: "compass",
    },
    { imgAlt: "target", imgSrc: "imgs/o-marks/target.png", area: "target" },
    { imgAlt: "orbit", imgSrc: "imgs/o-marks/orbit.png", area: "orbit" },
    {
      imgAlt: "turntable",
      imgSrc: "imgs/o-marks/turntable.png",
      area: "turntable",
    },
  ];

  window.addEventListener("load", function () {
    addMarkOptions(
      xMarkOptions,
      ".x-marks-container",
      ".profile-x-container",
      "selected-x",
      "x-profile-img"
    );
    addMarkOptions(
      oMarkOptions,
      ".o-marks-container",
      ".profile-o-container",
      "selected-o",
      "o-profile-img"
    );
  });
})();
