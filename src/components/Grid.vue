<template>
  <nav>
    <div>
      <label for="size">Grid size: </label>
      <input
        v-model.number="size"
        type="number"
        id="input-size"
        min="4"
        max="32"
        @change="start">
    </div>
    <button @click="start">Restart!</button>
  </nav>
  <div class="grid">
    <div
      class="grid__row"
      v-for="(row, i) in grid.matrix"
      :key="[gameKey, i]"
    >
      <Cell
        class="grid__cell"
        v-for="(cell, j) in row"
        :key="[gameKey, i, j]"
        :cell="cell"
        @uncover="onUncover"
        @explode="onExplode"
      />
    </div>
  </div>
  <div v-if="state.isFinished">
    <div v-if="state.isWon">You won!</div>
    <div v-else>You lost!</div>
  </div>
</template>

<script>
import Grid from '@/core/Grid';
import Cell from './Cell.vue';

const INIT = {
  gameKey: 0,
  size: 9,
  nMines: 10,
};

export default {
  name: 'Grid',
  components: {
    Cell,
  },
  data() {
    return {
      gameKey: INIT.gameKey,
      size: INIT.size,
      nMines: INIT.nMines,
      grid: new Grid(INIT.size).init(INIT.nMines),
      state: {
        isFinished: false,
        isWon: false,
      },
      uncovered: [],
    };
  },
  methods: {
    start() {
      this.gameKey += 1;
      this.state.isFinished = false;
      this.state.isWon = false;
      this.uncovered = [];

      this.grid = new Grid(this.size).init(this.nMines);
    },
    onUncover(cell) {
      if (!this.uncovered.includes(cell)) this.uncovered.push(cell);

      if (this.uncovered.length === this.grid.size ** 2 - this.nMines) {
        this.state.isFinished = true;
        this.state.isWon = true;
      }
    },
    onExplode() {
      this.state.isFinished = true;
      this.state.isWon = false;

      // uncover all mines
      for (let i = 0; i < this.grid.mines.length; i += 1) {
        const mineCell = this.grid.mines[i];
        mineCell.isCovered = false;
      }

      // disable all cells
      for (let i = 0; i < this.grid.flat.length; i += 1) {
        const cell = this.grid.flat[i];
        cell.isDisabled = true;
      }
    },
  },
};
</script>

<style scoped>
nav {
  margin: var(--spacing) 0;
}
#input-size {
  width: 40px;
  text-align: right;
}
</style>
