import chunk_ from 'lodash/chunk';
import random_ from 'lodash/random';

const BASE_CELL = {
  hasMine: false,
  isCovered: true,
};

function getCell(matrix) {
  return function gc(row, col) {
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
    this.size = size;
    this.nMines = nMines;

    // initialise grid
    this.flat = Array(size ** 2)
      .fill()
      .map(() => ({ ...BASE_CELL }));
    this.matrix = chunk_(this.flat, size);

    this.placeMines();
  }

  placeMines() {
    while (this.flat.filter((cell) => cell.hasMine).length < this.nMines) {
      this.matrix[random_(this.size - 1)][random_(this.size - 1)].hasMine = true;
    }

    // compute the number of mines around a cell
    for (let row = 0; row < this.size; row += 1) {
      for (let col = 0; col < this.size; col += 1) {
        this.matrix[row][col].nMines = getNeighbourCells(this.matrix, row, col)
          .filter((cell) => cell && cell.hasMine).length;
      }
    }

    return this;
  }

  clearMines() {
    for (let i = 0; i < this.flat.length; i += 1) {
      const cell = this.flat[i];
      cell.hasMine = false;
      cell.nMines = null;
    }
    return this;
  }

  shuffleMines() {
    this
      .clearMines()
      .placeMines();
    return this;
  }
}
