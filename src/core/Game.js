import chunk_ from 'lodash/chunk';
import random_ from 'lodash/random';

const BASE_CELL = {
  hasMine: false,
  isCovered: true,
  isExploded: true,
};

function getCell(grid) {
  return function gc(row, col) {
    if (grid[row] && grid[row][col]) return grid[row][col];
    return null;
  };
}

function getNeighbourCells(grid, row, col) {
  const gc = getCell(grid);
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
    this.grid = chunk_(this.flat, size);

    this
      .assignNeighbours()
      .placeMines();
  }

  placeMines() {
    while (this.flat.filter((cell) => cell.hasMine).length < this.nMines) {
      this.grid[random_(this.size - 1)][random_(this.size - 1)].hasMine = true;
    }

    for (let i = 0; i < this.flat.length; i += 1) {
      const cell = this.flat[i];
      cell.mineNeighbours = cell.neighbours.filter((c) => c.hasMine);
      cell.nMineNeighbours = cell.mineNeighbours.length;
      cell.isEmpty = !cell.hasMine && cell.nMineNeighbours === 0;
    }

    for (let i = 0; i < this.flat.length; i += 1) {
      const cell = this.flat[i];
      cell.emptyNeighbours = cell.neighbours.filter((c) => c.isEmpty);
    }

    return this;
  }

  assignNeighbours() {
    // compute the number of mines around a cell
    for (let row = 0; row < this.size; row += 1) {
      for (let col = 0; col < this.size; col += 1) {
        this.grid[row][col].neighbours = getNeighbourCells(this.grid, row, col)
          .filter((cell) => cell);
      }
    }
    return this;
  }

  shuffleMines() {
    this
      .reset()
      .placeMines();
    return this;
  }

  static computeEmptyArea(cell, chain = []) {
    if (cell.isEmpty && chain.indexOf(cell) === -1) {
      chain.push(cell);
      cell.emptyNeighbours.forEach((neighbour) => {
        if (neighbour.emptyNeighbours.length) {
          Grid.computeEmptyArea(neighbour, chain);
        }
      });
    }

    chain.forEach((emptyCell) => {
      if (emptyCell.isEmpty) {
        emptyCell.neighbours.forEach((neighbour) => {
          if (!neighbour.hasMine
            && neighbour.mineNeighbours.length
            && chain.indexOf(neighbour) === -1) {
            chain.push(neighbour);
          }
        });
      }
    });

    return chain;
  }

  reset() {
    for (let i = 0; i < this.flat.length; i += 1) {
      const cell = this.flat[i];
      Object.entries(BASE_CELL).forEach(([key, value]) => {
        cell[key] = value;
      });
    }
    return this;
  }
}
