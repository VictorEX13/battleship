const UI = () => {
  const body = document.querySelector("body");

  const generateUI = (player, comp, startTheGame) => {
    body.replaceChildren();
    body.append(header(), main(player, comp, startTheGame), footer());
    configureThePlayerBoard(player);
  };

  const header = () => {
    const header = document.createElement("header");
    const mainHeading = document.createElement("h1");

    mainHeading.textContent = "Okeanos War";

    header.appendChild(mainHeading);

    return header;
  };

  const main = (player, comp, startTheGame) => {
    const main = document.createElement("main");
    const mainDisplay = document.createElement("section");
    const controller = document.createElement("section");

    mainDisplay.classList.add("main-display");
    controller.classList.add("controller");

    // Controller

    const resetBtn = document.createElement("button");
    const startBtn = document.createElement("button");

    resetBtn.classList.add("reset");
    startBtn.classList.add("start");

    resetBtn.toggleAttribute("disabled");
    startBtn.toggleAttribute("disabled");

    resetBtn.textContent = "Reset";
    startBtn.textContent = "Start";

    resetBtn.addEventListener("click", () => {
      player.resetBoard();
      comp.resetBoard();
      configureThePlayerBoard(player);

      resetBtn.toggleAttribute("disabled");
    });

    startBtn.addEventListener("click", () => {
      startTheGame();

      resetBtn.toggleAttribute("disabled");
      startBtn.toggleAttribute("disabled");
    });

    controller.append(startBtn, resetBtn);

    //------------------------------------------------------

    main.append(mainDisplay, controller);

    return main;
  };

  const configureThePlayerBoard = (player) => {
    const mainDisplay = document.querySelector(".main-display");
    const config = document.createElement("div");
    const configControls = document.createElement("div");
    const shipsToPlace = document.createElement("div");
    const startBtn = document.querySelector(".start");

    config.classList.add("config");
    configControls.classList.add("config-controls");
    shipsToPlace.classList.add("ships");

    const randomBtn = document.createElement("button");
    const clearBtn = document.createElement("button");

    clearBtn.toggleAttribute("disabled");

    randomBtn.textContent = "Random";
    clearBtn.textContent = "Clear";

    randomBtn.addEventListener("click", () => {
      player.resetBoard();
      player.placeRandomShips();

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const boardField = document.querySelector(
            `.board-field[data-row="${i}"][data-col="${j}"]`
          );
          boardField.setAttribute(
            "has-ship",
            player.playerBoard.board[i][j].hasShip ? "true" : "false"
          );
        }
      }

      clearBtn.hasAttribute("disabled") && clearBtn.toggleAttribute("disabled");
      startBtn.hasAttribute("disabled") && startBtn.toggleAttribute("disabled");
    });

    clearBtn.addEventListener("click", () => {
      player.resetBoard();

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const boardField = document.querySelector(
            `.board-field[data-row="${i}"][data-col="${j}"]`
          );
          boardField.removeAttribute("has-ship");
        }
      }

      clearBtn.toggleAttribute("disabled");
      startBtn.toggleAttribute("disabled");
    });

    configControls.append(randomBtn, clearBtn);

    config.append(configControls, board("config"), shipsToPlace);

    mainDisplay.replaceChildren();
    mainDisplay.appendChild(config);
  };

  const generateBoards = (player, comp, gameLoop) => {
    const mainDisplay = document.querySelector(".main-display");

    mainDisplay.replaceChildren();
    mainDisplay.append(
      board("player", comp, player),
      board("comp", player, comp, gameLoop, true)
    );
  };

  const board = (boardName, player, enemy, gameLoop, isClickable = false) => {
    const board = document.createElement("div");
    board.classList.add("board", `${boardName}-board`);
    isClickable && board.toggleAttribute("under-attack");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const boardField = document.createElement("div");
        boardField.classList.add("board-field");
        boardField.setAttribute("data-row", i);
        boardField.setAttribute("data-col", j);

        if (player) {
          boardField.setAttribute("hit", "false");
          boardField.setAttribute(
            "has-ship",
            player.enemyBoard.board[i][j].hasShip ? "true" : "false"
          );
        }

        if (isClickable) {
          boardField.addEventListener("click", () => {
            gameLoop(player, enemy, [i, j], updateHittenField);
          });
        }

        board.appendChild(boardField);
      }
    }

    return board;
  };

  const updateHittenField = (playerName, enemyName, coord, neighbours) => {
    const playerBoard = document.querySelector(`.${playerName}-board`);
    const enemyBoard = document.querySelector(`.${enemyName}-board`);
    const fieldToUpdate = document.querySelector(
      `.${enemyName}-board .board-field[data-row="${coord[0]}"][data-col="${coord[1]}"]`
    );

    fieldToUpdate.setAttribute("hit", "true");

    for (const neighbour of neighbours) {
      const neighbourToUpdate = document.querySelector(
        `.${enemyName}-board .board-field[data-row="${neighbour.row}"][data-col="${neighbour.col}"]`
      );

      neighbourToUpdate.setAttribute("hit", "true");
    }

    enemyBoard.toggleAttribute("under-attack");
    playerBoard.toggleAttribute("under-attack");
  };

  const endTheGame = (result) => {
    const mainDisplay = document.querySelector(".main-display");
    const winningMessage = document.createElement("p");

    winningMessage.classList.add("winning-message");

    winningMessage.textContent = `You ${result}!!!`;

    mainDisplay.replaceChildren();
    mainDisplay.appendChild(winningMessage);
  };

  const footer = () => {
    const footer = document.createElement("footer");
    const copyright = document.createElement("small");

    copyright.textContent = "Copyright © 2023 VictorEX13";

    footer.appendChild(copyright);

    return footer;
  };

  return { generateUI, generateBoards, endTheGame };
};

export default UI;
