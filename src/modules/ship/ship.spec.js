import { describe, test, expect, beforeEach } from "@jest/globals";
import Ship from "./ship";

describe("Ship methods", () => {
  let ship;

  beforeEach(() => {
    ship = Ship(2);
  });

  test("increases the number of hits in the ship by 1 when hit() is called", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test("ship is not sunk if hits in the ship < ship length", () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("ship is sunk if hits in the ship === ship length", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
