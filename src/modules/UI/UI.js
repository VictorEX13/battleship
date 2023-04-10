const UI = () => {
  const body = document.querySelector("body");

  const generateUI = () => {
    body.append(header(), main(), footer());
  };

  const header = () => {
    const header = document.createElement("header");
    const mainHeading = document.createElement("h1");

    mainHeading.textContent = "Okeanos War";

    header.appendChild(mainHeading);

    return header;
  };

  const main = () => {
    const main = document.createElement("main");
    const boardsContainer = document.createElement("section");
    const controller = document.createElement("section");

    boardsContainer.classList.add("boards");
    controller.classList.add("controller");

    // Boards

    boardsContainer.append(board("player"), board("comp"));

    //------------------------------------------------------

    // Controller

    const startButton = document.createElement("button");

    startButton.textContent = "Start";

    controller.appendChild(startButton);

    //------------------------------------------------------

    main.append(boardsContainer, controller);

    return main;
  };

  const board = (playerName) => {
    const board = document.createElement("div");
    board.classList.add("board", `${playerName}-board`);
    board.setAttribute("being-attacked", "false");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const boardField = document.createElement("div");
        boardField.classList.add("board-field");
        boardField.setAttribute("data-row", i);
        boardField.setAttribute("data-col", j);
        boardField.setAttribute("hit", "false");
        boardField.setAttribute("has-ship", "false");

        board.appendChild(boardField);
      }
    }

    return board;
  };

  const footer = () => {
    const footer = document.createElement("footer");
    const copyright = document.createElement("small");

    copyright.textContent = "Copyright © 2023 VictorEX13";

    footer.appendChild(copyright);

    return footer;
  };

  return { generateUI };
};

export default UI;
