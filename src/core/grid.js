import chunk_ from 'lodash/chunk';
import random_ from 'lodash/random';

const BASE_FIELD = {
  hasMine: false,
  isCovered: true,
};

function getCell(matrix) {
  return function (row, col) {
    if (matrix[row] && matrix[row][col]) return matrix[row][col];
    return null;
  };
}

function getNeighbourCells(matrix, row, col) {
  const gc = getCell(matrix);
  return [
    gc(row - 1, col),
    gc(row - 1, col + 1),
    gc(row, col + 1),
    gc(row + 1, col + 1),
    gc(row + 1, col),
    gc(row + 1, col - 1),
    gc(row, col - 1),
    gc(row - 1, col - 1),
  ];
}

export default class Grid {
  constructor(size, nMines) {
    // initialise grid
    this.flat = Array(size ** 2)
      .fill()
      .map(() => ({ ...BASE_FIELD }));
    this.matrix = chunk_(this.flat, size);

    // place mines into the grid
    while (this.flat.filter((cell) => cell.hasMine).length < nMines) {
      this.matrix[random_(size - 1)][random_(size - 1)].hasMine = true;
    }

    // compute the number of mines around a cell
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        this.matrix[row][col].nMines = getNeighbourCells(this.matrix, row, col)
          .filter((cell) => cell && cell.hasMine).length;
      }
    }
  }
}
