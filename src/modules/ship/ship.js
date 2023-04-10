const Ship = (shipLength) => {
  let hits = 0;

  const hit = () => {
    hits++;
  };

  const isSunk = () => {
    return shipLength === hits;
  };

  return {
    shipLength,
    get hits() {
      return hits;
    },
    hit,
    isSunk,
  };
};

export default Ship;
