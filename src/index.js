import UI from "./modules/UI/UI";
import Player from "./modules/player/player";
import "./styles/main.css";

const main = () => {
  const userInterface = UI();
  const player = Player();
  const comp = Player(true);

  const startTheGame = () => {
    comp.placeRandomShips();

    player.setEnemyBoard(comp.playerBoard);
    comp.setEnemyBoard(player.playerBoard);

    userInterface.generateBoards(player, comp, gameLoop);
  };

  const gameLoop = (playerAttacking, enemy, coord, cb) => {
    let enemyBoardNeighbours = [];
    playerAttacking.attack(coord);

    if (
      playerAttacking.enemyBoard.board[coord[0]][coord[1]].hasShip &&
      playerAttacking.enemyBoard.board[coord[0]][coord[1]].ship.isSunk()
    ) {
      enemyBoardNeighbours = playerAttacking.enemyBoard.getNeighbourCoordinates(
        coord,
        playerAttacking.enemyBoard.board[coord[0]][coord[1]].ship.shipLength
      );
    }

    cb("player", "comp", coord, enemyBoardNeighbours);

    if (playerAttacking.enemyBoard.isAllShipsSunk()) {
      setTimeout(() => {
        userInterface.endTheGame("Win");
      }, 500);

      return;
    } else {
      setTimeout(() => {
        let playerBoardNeighbours = [];
        const attackedCoord = enemy.attack();
        const [row, col] = attackedCoord;

        if (
          enemy.enemyBoard.board[row][col].hasShip &&
          enemy.enemyBoard.board[row][col].ship.isSunk()
        ) {
          playerBoardNeighbours = enemy.enemyBoard.getNeighbourCoordinates(
            attackedCoord,
            enemy.enemyBoard.board[row][col].ship.shipLength
          );
        }

        cb("comp", "player", attackedCoord, playerBoardNeighbours);

        if (enemy.enemyBoard.isAllShipsSunk()) {
          setTimeout(() => {
            userInterface.endTheGame("Lose");
          }, 500);
          return;
        }
      }, 1000);
    }
  };

  const renderUI = () => {
    userInterface.generateUI(player, comp, startTheGame);
  };

  return { renderUI };
};

const game = main();

game.renderUI();
