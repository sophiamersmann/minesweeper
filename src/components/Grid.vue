<template>
  <div class="grid">
    <div
      class="grid__row"
      v-for="(row, i) in grid.matrix"
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
import Grid from '@/core/grid';
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
      size: INIT.size,
      nMines: INIT.nMines,
      grid: new Grid(INIT.size, INIT.nMines),
    };
  },
};
</script>
