const Ship = (length) => {
  let hits = 0;

  const hit = () => {
    hits++;
  };

  const isSunk = () => {
    return length === hits;
  };

  return {
    length,
    get hits() {
      return hits;
    },
    hit,
    isSunk,
  };
};

export default Ship;
