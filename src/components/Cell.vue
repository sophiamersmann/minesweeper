<template>
  <button
    class="cell"
    :class="classes"
    :disabled="isDisabled"
    @click.left="click"
    @click.right.prevent="flag"
  >
    {{ displayValue }}
  </button>
</template>

<script>
import Grid from '@/core/Grid';

export default {
  name: 'Cell',
  props: ['cell'],
  data() {
    return this.cell;
  },
  computed: {
    displayValue() {
      if (this.hasMine) return '•';
      return this.nMineNeighbours > 0 ? this.nMineNeighbours : null;
    },
    classes() {
      return {
        'is-covered': this.isCovered,
        'is-flagged': this.isFlagged,
      };
    },
  },
  methods: {
    click() {
      const cell = this.$data;

      this.uncover(cell);

      if (this.hasMine) {
        this.isExploded = true;
        this.$emit('explode');
        return;
      }

      if (this.isEmpty) {
        const emptyArea = Grid.computeEmptyArea(cell);
        for (let i = 0; i < emptyArea.length; i += 1) {
          const emptyCell = emptyArea[i];
          this.uncover(emptyCell);
        }
      }
    },
    uncover(cell) {
      // eslint-disable-next-line no-param-reassign
      cell.isCovered = false;
      this.$emit('uncover', cell);
    },
    flag() {
      this.isFlagged = true;
    },
  },
};
</script>

<style scoped>
.cell {
  --size: 1.5rem;

  font-size: 0.8rem;
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  text-align: center;
  vertical-align: middle;
  border: 0;
  position: relative;
}

.cell.is-covered::after {
  --size: 100%;

  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
  content: '';
  background: var(--black);
  outline: 1px solid #fff;
  text-indent: 0;
  /* for debugging only */
  opacity: 0.7;
}

.cell.is-flagged::after {
  content: '⚑';
  color: cornflowerblue;
}
</style>
