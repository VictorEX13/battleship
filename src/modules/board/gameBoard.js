import Ship from "../ship/ship";

const GameBoard = () => {
  let shipsOnTheBoard = 0;
  let placeVertically = false;

  const incrementNumberOfShips = () => {
    shipsOnTheBoard++;
  };

  const switchShipDirection = () => {
    placeVertically ? (placeVertically = false) : (placeVertically = true);
  };

  const generateBoard = () => {
    const defaultBoard = [];

    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push({ hasShip: false, hitten: false });
      }
      defaultBoard.push(row);
    }

    return defaultBoard;
  };

  const board = generateBoard();

  const getNeighbourCoordinates = (coord, shipLength) => {
    const result = [];
    let rowOffset;
    let columnOffset;
    let mainAxis;
    let crossAxis;

    if (!placeVertically) {
      mainAxis = coord[0];
      crossAxis = coord[1];

      if (crossAxis - 1 >= 0) {
        result.push(board[coord[0]][coord[1] - 1]);
      }
      if (crossAxis + shipLength < 10) {
        result.push(board[coord[0]][coord[1] + shipLength]);
      }
    } else {
      mainAxis = coord[1];
      crossAxis = coord[0];

      if (crossAxis - 1 >= 0) {
        result.push(board[coord[0] - 1][coord[1]]);
      }
      if (crossAxis + shipLength < 10) {
        result.push(board[coord[0] + shipLength][coord[1]]);
      }
    }

    for (let i = -1; i <= shipLength; i++) {
      if (crossAxis + i >= 0 && crossAxis + i < 10) {
        if (!placeVertically) {
          rowOffset = -1;
          columnOffset = i;
        } else {
          rowOffset = i;
          columnOffset = -1;
        }

        if (mainAxis - 1 >= 0) {
          result.push(board[coord[0] + rowOffset][coord[1] + columnOffset]);
        }
        if (mainAxis + 1 < 10) {
          result.push(
            board[
              coord[0] + (!placeVertically ? Math.abs(rowOffset) : rowOffset)
            ][
              coord[1] +
                (placeVertically ? Math.abs(columnOffset) : columnOffset)
            ]
          );
        }
      }
    }

    return result;
  };

  const isAValidCoordinate = (coord, shipLength) => {
    if (
      !board[coord[0]][coord[1]].hasShip &&
      !board[coord[0]][coord[1]].firstNeighbour &&
      !board[coord[0]][coord[1]].secondNeighbour &&
      !board[coord[0]][coord[1]].thirdNeighbour &&
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

      if (!placeVertically) {
        for (let i = 1; i < shipLength; i++) {
          board[row][column + i].hasShip = true;
          board[row][column + i].ship = board[row][column].ship;
        }
      } else {
        for (let i = 1; i < shipLength; i++) {
          board[row + i][column].hasShip = true;
          board[row + i][column].ship = board[row][column].ship;
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
    isAValidCoordinate,
    getNeighbourCoordinates,
    placeShip,
    switchShipDirection,
    receiveAttack,
    isAllShipsSunk,
  };
};

export default GameBoard;
