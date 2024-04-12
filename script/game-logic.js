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
  let player1Wins = 0;
  let player2Wins = 0;
  let player1Moves = [];
  let player2Moves = [];

  const startGame = (p1, p2) => {
    player1 = p1;
    player2 = p2;
    initializeBoard();
    currentPlayer = player1;
    displayController.displayTurn(currentPlayer.getMark());
    displayController.hideTurn(
      currentPlayer === player1 ? player2.getMark() : player1.getMark()
    );
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
    displayController.displayTurn(currentPlayer.getMark());
    displayController.hideTurn(
      currentPlayer === player1 ? player2.getMark() : player1.getMark()
    );
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

  const incrementWins = (player) => {
    player === player1 ? player1Wins++ : player2Wins++;
    displayController.displayRoundsWon(
      player.getMark(),
      player === player1 ? player1Wins : player2Wins
    );
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
      if (isWinner) {
        incrementWins(currentPlayer);
        return true;
      }
    }
    return false;
  };

  return { startGame, makeMove };
})();

const displayController = (function () {
  const board = document.querySelector(".game-board");
  const cells = document.querySelectorAll(".cell");
  const xMarksContainer = document.querySelector(".x-marks-container");
  const oMarksContainer = document.querySelector(".o-marks-container");
  const pXNameInput = document.querySelector(".x-name");
  const pONameInput = document.querySelector(".o-name");
  const selectXMarkHeader = document.querySelector(".x-select-mark-header");
  const selectOMarkHeader = document.querySelector(".o-select-mark-header");
  const createPlayerXBtn = document.querySelector(".x-create-player-btn");
  const createPlayerOBtn = document.querySelector(".o-create-player-btn");
  const startGameBtn = document.querySelector(".start-btn");
  const quitGameBtn = document.querySelector(".quit-btn");
  let playerX;
  let playerO;

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

  function checkInput(playerNameInput) {
    const player = playerNameInput.value;
    if (!player) {
      playerNameInput.classList.add("input-error");
    } else {
      playerNameInput.classList.remove("input-error");
    }
  }

  function checkMarkSelection(selectedMark, selectMarkHeader) {
    if (!selectedMark) {
      selectMarkHeader.classList.add("select-error");
    } else {
      selectMarkHeader.classList.remove("select-error");
    }
  }

  function enableCreatePlayerBtn(
    playerNameInput,
    selectedMark,
    createPlayerBtn
  ) {
    if (playerNameInput.value && selectedMark) {
      createPlayerBtn.removeAttribute("disabled");
    } else {
      createPlayerBtn.setAttribute("disabled", true);
    }
  }

  function handleInputEvent(playerInput, selectedClass, createPlayerBtn) {
    playerInput.addEventListener("input", function () {
      const selectedMark = document.querySelector(selectedClass);
      checkInput(playerInput);
      enableCreatePlayerBtn(playerInput, selectedMark, createPlayerBtn);
    });
  }

  handleInputEvent(pXNameInput, ".selected-x", createPlayerXBtn);
  handleInputEvent(pONameInput, ".selected-o", createPlayerOBtn);

  xMarksContainer.addEventListener("click", function () {
    checkMarkSelection(
      document.querySelector(".selected-x"),
      selectXMarkHeader
    );
    enableCreatePlayerBtn(
      pXNameInput,
      document.querySelector(".selected-x"),
      createPlayerXBtn
    );
  });

  oMarksContainer.addEventListener("click", function () {
    const selectedOMark = document.querySelector(".selected-o");
    checkMarkSelection(
      document.querySelector(".selected-o"),
      selectOMarkHeader
    );
    enableCreatePlayerBtn(
      pONameInput,
      document.querySelector(".selected-o"),
      createPlayerOBtn
    );
  });

  function createPlayerModule(playerLetter, nameInput) {
    const playerCard = document.querySelector(`.player-${playerLetter}-card`);
    const createPlayerCard = document.querySelector(
      `.create-${playerLetter}-card`
    );

    const playerProfile = document.createElement("div");
    playerProfile.classList.add(`${playerLetter}-card-profile`);
    const profileImg = document.querySelector(`.selected-${playerLetter}`);
    profileImg.classList.add(`${playerLetter}-card-img`);
    playerProfile.appendChild(profileImg);

    const playerName = document.createElement("div");
    playerName.classList.add(`${playerLetter}-card-name`);
    playerName.textContent = nameInput.value;

    const playerTurn = document.createElement("div");
    playerTurn.classList.add(`${playerLetter}-turn-text`);
    playerTurn.textContent = "Your turn!";

    const playerStats = document.createElement("div");
    playerStats.classList.add(`${playerLetter}-stats`);
    playerStats.textContent = "Rounds won: 0";

    playerCard.appendChild(playerProfile);
    playerCard.appendChild(playerName);
    playerCard.appendChild(playerStats);
    playerCard.appendChild(playerTurn);

    createPlayerCard.style.display = "none";
    playerCard.style.display = "flex";
  }
  const toggleTurnVisibility = (playerLetter, isVisible) => {
    const turnText = document.querySelector(`.${playerLetter}-turn-text`);
    const turnProfile = document.querySelector(`.${playerLetter}-card-profile`);
    const turnCard = document.querySelector(`.player-${playerLetter}-card`);
    turnText.classList.toggle("active-turn-text", isVisible);
    turnProfile.classList.toggle("active-turn-profile", isVisible);
    turnCard.classList.toggle("active-turn-card", isVisible);
  };

  const toggleOtherPlayerVisibility = (playerLetter, isVisible) => {
    const otherPlayerCard = document.querySelector(
      `.player-${playerLetter === "x" ? "o" : "x"}-card`
    );
    otherPlayerCard.classList.toggle("hidden", !isVisible);
  };

  const displayTurn = (playerLetter) => {
    toggleTurnVisibility(playerLetter, true);
    toggleOtherPlayerVisibility(playerLetter, false);
  };

  const hideTurn = (playerLetter) => {
    toggleTurnVisibility(playerLetter, false);
    toggleOtherPlayerVisibility(playerLetter, true);
  };

  const displayRoundsWon = (playerLetter, winCount) => {
    const playerStats = document.querySelector(`.${playerLetter}-stats`);
    playerStats.textContent = `Rounds won: ${winCount}`;
  };

  createPlayerXBtn.addEventListener("click", function () {
    createPlayerModule("x", pXNameInput);
    playerX = createPlayer("x");
    enableStartBtn();
  });

  createPlayerOBtn.addEventListener("click", function () {
    createPlayerModule("o", pONameInput);
    playerO = createPlayer("o");
    enableStartBtn();
  });

  function enableStartBtn() {
    if (playerX && playerO) {
      startGameBtn.style.color = "rgb(244, 244, 82)";
      startGameBtn.style.backgroundColor = "transparent";
    }
  }

  function addQuitBtn() {
    startGameBtn.style.display = "none";
    const quitBtn = document.createElement("button");
    quitBtn.textContent = "Quit";
    quitBtn.classList.add("quit-btn");
    gameLayout.appendChild(quitBtn);
  }

  const boardVisible = () => {
    cells.forEach((cell) => {
      cell.style.display = "grid";
    });

    board.removeChild(document.querySelector(".board-lock-overlay"));
  };

  const hideBoard = () => {
    const lockImg = document.createElement("img");
    lockImg.src = "/imgs/ui/lock.png";
    lockImg.alt = "lock icon";
    lockImg.classList.add("board-lock-overlay");
    board.appendChild(lockImg);
  };

  window.addEventListener("load", function () {
    hideBoard();
  });

  startGameBtn.addEventListener("click", function () {
    if (playerX && playerO) {
      game.startGame(playerX, playerO);
      addQuitBtn();
      boardVisible();
    } else {
      alert("Please create both players before starting the game");
    }
  });
  return { displayTurn, hideTurn, displayRoundsWon };

  quitGameBtn.addEventListener("click", function () {
    resetGame();
  });
})();
