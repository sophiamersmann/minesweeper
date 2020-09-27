<template>
  <div class="grid">
    <div
      class="grid__row"
      v-for="(row, i) in size"
      :key="i"
    >
      <Cell
        class="grid__cell"
        v-for="(cell, j) in size"
        :key="j"
      />
    </div>
  </div>
</template>

<script>
import Cell from './Cell.vue';

export default {
  name: 'Grid',
  components: {
    Cell,
  },
  data() {
    return {
      size: 4,
    };
  },
};
</script>
