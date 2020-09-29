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
    <div>
      <label for="size">Number of mines: </label>
      <input
        v-model.number="nMines"
        type="number"
        id="input-mines"
        min="1"
        :max="nMinesMax"
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
        @flag="onFlag"
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
      flagged: [],
    };
  },
  computed: {
    nMinesMax() {
      return Math.floor(this.size ** 2 / 2);
    },
  },
  methods: {
    start() {
      this.gameKey += 1;
      this.state.isFinished = false;
      this.state.isWon = false;
      this.uncovered = [];
      this.flagged = [];

      this.grid = new Grid(this.size).init(this.nMines);
    },
    onUncover(cell) {
      if (!this.uncovered.includes(cell)) this.uncovered.push(cell);

      if (this.uncovered.length === this.grid.size ** 2 - this.nMines) {
        this.state.isFinished = true;
        this.state.isWon = true;
      }
    },
    onFlag(cell) {
      if (!this.flagged.includes(cell)) this.flagged.push(cell);

      if (this.flagged.length === this.nMines && this.flagged.every((c) => c.hasMine)) {
        this.finish();
        this.state.isWon = true;
      }
    },
    onExplode() {
      this.finish();
      this.state.isWon = false;
    },
    finish() {
      this.state.isFinished = true;

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
nav input {
  width: 40px;
  text-align: right;
}
</style>
