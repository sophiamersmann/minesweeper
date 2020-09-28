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
      />
    </div>
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
    };
  },
  methods: {
    start() {
      this.game.shuffleMines();
    },
  },
};
</script>

<style scoped>
nav {
  margin: var(--spacing) 0;
}
</style>
