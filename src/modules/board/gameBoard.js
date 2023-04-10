import Ship from "../ship/ship";

const GameBoard = () => {
  let shipsOnTheBoard = 0;
  let placeVertically = false;

  const incrementNumberOfShips = () => {
    shipsOnTheBoard++;
  };

  const switchShipDirection = () => {
    if (placeVertically) {
      placeVertically = false;
    } else {
      placeVertically = true;
    }
  };

  const generateBoard = () => {
    const defaultBoard = [];

    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push({ hasShip: false, hitten: false, row: i, col: j });
      }
      defaultBoard.push(row);
    }

    return defaultBoard;
  };

  const board = generateBoard();

  const getNeighbourCoordinates = (coord, shipLength) => {
    const result = [];
    const shipIndex = board[coord[0]][coord[1]].shipIndex;
    const placingVertically = board[coord[0]][coord[1]].shipOnVertical;
    let rowOffset;
    let columnOffset;
    let mainAxis;
    let crossAxis;

    if (!placingVertically) {
      mainAxis = coord[0];
      crossAxis = coord[1] - shipIndex;

      if (crossAxis - 1 >= 0) {
        result.push(board[coord[0]][coord[1] - shipIndex - 1]);
      }
      if (crossAxis + shipLength < 10) {
        result.push(board[coord[0]][coord[1] - shipIndex + shipLength]);
      }
    } else {
      mainAxis = coord[1];
      crossAxis = coord[0] - shipIndex;

      if (crossAxis - 1 >= 0) {
        result.push(board[coord[0] - shipIndex - 1][coord[1]]);
      }
      if (crossAxis + shipLength < 10) {
        result.push(board[coord[0] - shipIndex + shipLength][coord[1]]);
      }
    }

    for (let i = -1; i <= shipLength; i++) {
      if (crossAxis + i >= 0 && crossAxis + i < 10) {
        if (!placingVertically) {
          rowOffset = -1;
          columnOffset = i - shipIndex;
        } else {
          rowOffset = i - shipIndex;
          columnOffset = -1;
        }

        if (mainAxis - 1 >= 0) {
          result.push(board[coord[0] + rowOffset][coord[1] + columnOffset]);
        }
        if (mainAxis + 1 < 10) {
          result.push(
            board[
              coord[0] + (!placingVertically ? Math.abs(rowOffset) : rowOffset)
            ][
              coord[1] +
                (placingVertically ? Math.abs(columnOffset) : columnOffset)
            ]
          );
        }
      }
    }

    return result;
  };

  const getShipCoordinates = (coord, shipLength) => {
    const result = [];

    for (let i = 0; i < shipLength; i++) {
      if (placeVertically && coord[0] + i < 10) {
        result.push(board[coord[0] + i][coord[1]]);
      } else if (!placeVertically && coord[1] + i < 10) {
        result.push(board[coord[0]][coord[1] + i]);
      }
    }

    return result;
  };

  const isAValidCoordinate = (coord, shipLength) => {
    if (
      getShipCoordinates(coord, shipLength).every(
        (coord) =>
          !coord.hasShip &&
          !coord.firstNeighbour &&
          !coord.secondNeighbour &&
          !coord.thirdNeighbour
      ) &&
      coord[0] >= 0 &&
      coord[1] >= 0 &&
      ((placeVertically && coord[0] + shipLength - 1 < 10 && coord[1] < 10) ||
        (!placeVertically && coord[0] < 10 && coord[1] + shipLength - 1 < 10))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const placeShip = (coord, shipLength) => {
    if (isAValidCoordinate(coord, shipLength)) {
      const row = coord[0];
      const column = coord[1];

      board[row][column].hasShip = true;
      board[row][column].ship = Ship(shipLength);
      board[row][column].shipIndex = 0;
      board[row][column].shipOnVertical = placeVertically;

      if (!placeVertically) {
        for (let i = 1; i < shipLength; i++) {
          board[row][column + i].hasShip = true;
          board[row][column + i].ship = board[row][column].ship;
          board[row][column + i].shipIndex = i;
          board[row][column + i].shipOnVertical = placeVertically;
        }
      } else {
        for (let i = 1; i < shipLength; i++) {
          board[row + i][column].hasShip = true;
          board[row + i][column].ship = board[row][column].ship;
          board[row + i][column].shipIndex = i;
          board[row + i][column].shipOnVertical = placeVertically;
        }
      }

      const neighbours = getNeighbourCoordinates(coord, shipLength);

      for (const neighbour of neighbours) {
        !neighbour.firstNeighbour
          ? (neighbour.firstNeighbour = board[row][column].ship)
          : !neighbour.secondNeighbour
          ? (neighbour.secondNeighbour = board[row][column].ship)
          : (neighbour.thirdNeighbour = board[row][column].ship);
      }

      incrementNumberOfShips();
    }
  };

  const receiveAttack = (coord) => {
    if (!board[coord[0]][coord[1]].hitten) {
      board[coord[0]][coord[1]].hitten = true;

      if (board[coord[0]][coord[1]].hasShip) {
        board[coord[0]][coord[1]].ship.hit();

        if (board[coord[0]][coord[1]].ship.isSunk()) {
          const hitShip = board[coord[0]][coord[1]].ship;

          const neighbours = board
            .flat()
            .filter(
              (coord) =>
                coord.firstNeighbour === hitShip ||
                coord.secondNeighbour === hitShip ||
                coord.thirdNeighbour === hitShip
            );

          for (const neighbour of neighbours) {
            neighbour.hitten = true;
          }
        }
      }
    }
  };

  const isAllShipsSunk = () => {
    const coordinatesWithShips = board
      .flat()
      .filter((coordinate) => coordinate.ship);

    return coordinatesWithShips.every((coordinate) => coordinate.ship.isSunk());
  };

  return {
    get board() {
      return board;
    },
    get shipsOnTheBoard() {
      return shipsOnTheBoard;
    },
    get placeVertically() {
      return placeVertically;
    },
    getShipCoordinates,
    isAValidCoordinate,
    getNeighbourCoordinates,
    placeShip,
    switchShipDirection,
    receiveAttack,
    isAllShipsSunk,
  };
};

export default GameBoard;
