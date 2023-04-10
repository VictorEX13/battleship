import { describe, expect, test, beforeEach } from "@jest/globals";
import GameBoard from "./gameBoard";

describe("GameBoard", () => {
  let gameBoard;

  beforeEach(() => {
    gameBoard = GameBoard();
  });

  test("placing a ship on a valid coordinate returns true", () => {
    expect(gameBoard.isAValidCoordinate([6, 3], 2)).toBe(true);
  });

  test("if a coordinate is outside of the board then return false", () => {
    gameBoard.switchShipDirection();
    expect(gameBoard.isAValidCoordinate([7, 0], 4)).toBe(false);
  });

  test("placing a ship on a coordinate that already has a ship returns false", () => {
    gameBoard.placeShip([5, 5], 1);
    expect(gameBoard.isAValidCoordinate([5, 5], 1)).toBe(false);
  });

  test("placing a ship on a coordinate neighbour to a ship returns false", () => {
    gameBoard.placeShip([5, 5], 4);
    expect(gameBoard.isAValidCoordinate([4, 4], 1)).toBe(false);
  });

  test("getNeighbourCoordinates returns coordinates neighbour to a ship", () => {
    gameBoard.placeShip([5, 5], 4);

    expect(gameBoard.getNeighbourCoordinates([5, 8], 4)).toEqual([
      gameBoard.board[5][4],
      gameBoard.board[5][9],
      gameBoard.board[4][4],
      gameBoard.board[6][4],
      gameBoard.board[4][5],
      gameBoard.board[6][5],
      gameBoard.board[4][6],
      gameBoard.board[6][6],
      gameBoard.board[4][7],
      gameBoard.board[6][7],
      gameBoard.board[4][8],
      gameBoard.board[6][8],
      gameBoard.board[4][9],
      gameBoard.board[6][9],
    ]);
  });

  test("getShipCoordinates returns all the coordinates a ship occupies", () => {
    expect(gameBoard.getShipCoordinates([2, 3], 4)).toEqual([
      gameBoard.board[2][3],
      gameBoard.board[2][4],
      gameBoard.board[2][5],
      gameBoard.board[2][6],
    ]);
  });

  test("placing a ship modify hasShip, ship, shipIndex and shipOnVertical properties of a coordinate", () => {
    gameBoard.placeShip([4, 5], 3);
    for (let i = 0; i < 3; i++) {
      expect(gameBoard.board[4][5 + i]).toMatchObject({
        hasShip: true,
        hitten: false,
        ship: {
          shipLength: 3,
        },
        shipIndex: i,
        shipOnVertical: false,
      });
    }
  });

  test("placing a ship add ...neighbour property to neighbour coordinates", () => {
    gameBoard.placeShip([3, 4], 3);

    expect(gameBoard.getNeighbourCoordinates([3, 4], 3)).toMatchObject(
      Array(12).fill({ hasShip: false, hitten: false, firstNeighbour: {} })
    );
  });

  test("switchShipDirection switches the direction of the new ships", () => {
    gameBoard.switchShipDirection();
    expect(gameBoard.placeVertically).toBe(true);
    gameBoard.switchShipDirection();
    expect(gameBoard.placeVertically).toBe(false);
  });

  test("receiveAttack updates only the hitten property of a coordinate if misses a shot", () => {
    gameBoard.receiveAttack([3, 4]);
    expect(gameBoard.board[3][4]).toEqual({
      hasShip: false,
      hitten: true,
      row: 3,
      col: 4,
    });
  });

  test("receiveAttack call hit() on a ship if the shot hits it", () => {
    gameBoard.placeShip([5, 5], 4);
    gameBoard.receiveAttack([5, 5]);
    gameBoard.receiveAttack([5, 6]);
    gameBoard.receiveAttack([5, 7]);

    for (let i = 0; i < 3; i++) {
      expect(gameBoard.board[5][5 + i]).toMatchObject({
        hasShip: true,
        hitten: true,
        ship: {
          shipLength: 4,
          hits: 3,
        },
      });
    }
  });

  test("update the hitten property of neighbour coordinates of sunken ships", () => {
    gameBoard.switchShipDirection();
    gameBoard.placeShip([5, 5], 3);

    gameBoard.receiveAttack([5, 5]);
    gameBoard.receiveAttack([6, 5]);
    gameBoard.receiveAttack([7, 5]);

    const neighbours = gameBoard.board
      .flat()
      .filter(
        (coord) =>
          coord.firstNeighbour === gameBoard.board[5][5].ship ||
          coord.secondNeighbour === gameBoard.board[5][5].ship ||
          coord.thirdNeighbour === gameBoard.board[5][5].ship
      );

    for (const neighbour of neighbours) {
      expect(neighbour.hitten).toBe(true);
    }
  });

  test("isAllShipsSunk returns false if there is ships that have not been sunk", () => {
    gameBoard.placeShip([1, 2], 2);
    gameBoard.placeShip([5, 3], 1);
    gameBoard.placeShip([7, 4], 4);

    gameBoard.receiveAttack([1, 2]);
    gameBoard.receiveAttack([1, 3]);
    gameBoard.receiveAttack([5, 3]);
    gameBoard.receiveAttack([7, 4]);
    gameBoard.receiveAttack([7, 5]);
    gameBoard.receiveAttack([7, 6]);

    expect(gameBoard.isAllShipsSunk()).toBe(false);
  });

  test("isAllShipsSunk returns true if all the ships have been sunk", () => {
    gameBoard.placeShip([2, 3], 1);
    gameBoard.placeShip([8, 5], 4);

    gameBoard.receiveAttack([2, 3]);
    gameBoard.receiveAttack([8, 5]);
    gameBoard.receiveAttack([8, 6]);
    gameBoard.receiveAttack([8, 7]);
    gameBoard.receiveAttack([8, 8]);

    expect(gameBoard.isAllShipsSunk()).toBe(true);
  });
});
