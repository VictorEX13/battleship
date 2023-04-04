import { describe, expect, test, beforeEach } from "@jest/globals";
import Player from "./player";

describe("Player", () => {
  let player;
  let comp;

  beforeEach(() => {
    player = Player("test");
    comp = Player("enemy", true);
  });

  test("resetBoard() should set the playerBoard to it's default state", () => {
    player.playerBoard.placeShip([3, 6], 4);

    expect(
      player.playerBoard.board.flat().every((x) => !x.hasShip && !x.hitten)
    ).toEqual(false);

    player.resetBoard();

    expect(
      player.playerBoard.board.flat().every((x) => !x.hasShip && !x.hitten)
    ).toEqual(true);
  });

  test("setEnemyBoard() points the enemyBoard prop to the enemy's playerBoard", () => {
    comp.playerBoard.placeShip([5, 5], 3);
    player.setEnemyBoard(comp.playerBoard);

    expect(player.enemyBoard).toEqual(comp.playerBoard);
  });

  test("placeRandomShips() places 10 ships randomically on the board", () => {
    comp.placeRandomShips();

    expect(comp.playerBoard.shipsOnTheBoard).toBe(10);
  });

  test("attack shots a coord on the enemyBoard", () => {
    player.setEnemyBoard(comp.playerBoard);
    player.attack([3, 3]);

    expect(player.enemyBoard.board[3][3].hitten).toBe(true);
  });

  test("the computer attacks a unhit random coord", () => {
    comp.setEnemyBoard(player.playerBoard);
    const attackedCoord = comp.attack();

    expect(
      comp.enemyBoard.board[attackedCoord[0]][attackedCoord[1]].hitten
    ).toBe(true);
  });
});
