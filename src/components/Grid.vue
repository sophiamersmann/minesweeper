<template>
  <nav>
    <button @click="start">Restart!</button>
  </nav>
  <div class="grid">
    <div
      class="grid__row"
      v-for="(row, i) in game.grid"
      :key="i"
    >
      <Cell
        class="grid__cell"
        v-for="(cell, j) in row"
        :key="j"
        :cell="cell"
        @uncover="onUncover"
      />
    </div>
  </div>
  <div v-if="isFinished">
    <div v-if="isWon">You won!</div>
    <div v-else>You lost!</div>
  </div>
</template>

<script>
import Game from '@/core/Game';
import Cell from './Cell.vue';

const INIT = {
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
      game: new Game(INIT.size, INIT.nMines),
      isFinished: false,
      isWon: false,
      uncovered: [],
    };
  },
  methods: {
    start() {
      this.game.shuffleMines();
    },
    onUncover(cell) {
      if (!this.uncovered.includes(cell)) this.uncovered.push(cell);

      if (this.uncovered.length === this.game.size ** 2 - this.game.nMines) {
        this.isFinished = true;
        this.isWon = true;
      }
    },
  },
};
</script>

<style scoped>
nav {
  margin: var(--spacing) 0;
}
</style>
