import GameBoard from "../board/gameBoard";

const Player = (name, isComp = false) => {
  let playerBoard = GameBoard();
  let enemyBoard;

  const resetBoard = () => {
    playerBoard = GameBoard();
  };

  const setEnemyBoard = (board) => {
    enemyBoard = board;
  };

  const randomCoord = () => {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  };

  const randomDirectionSwitch = () => {
    if (Math.random() >= 0.5) {
      playerBoard.switchShipDirection();
    }
  };

  const placeRandomShips = () => {
    while (playerBoard.shipsOnTheBoard < 10) {
      randomDirectionSwitch();

      playerBoard.placeShip(
        randomCoord(),
        playerBoard.shipsOnTheBoard < 4
          ? 1
          : playerBoard.shipsOnTheBoard < 7
          ? 2
          : playerBoard.shipsOnTheBoard < 9
          ? 3
          : 4
      );
    }
  };

  const attack = (coord) => {
    if (!isComp) {
      enemyBoard.receiveAttack(coord);
    } else {
      let coordToAttack;
      let attacked = false;

      while (!attacked) {
        coordToAttack = randomCoord();
        if (!enemyBoard.board[coordToAttack[0]][coordToAttack[1]].hitten) {
          enemyBoard.receiveAttack(coordToAttack);
          attacked = true;
        }
      }

      return coordToAttack;
    }
  };

  return {
    name,
    get playerBoard() {
      return playerBoard;
    },
    get enemyBoard() {
      return enemyBoard;
    },
    resetBoard,
    setEnemyBoard,
    placeRandomShips,
    attack,
  };
};

export default Player;
