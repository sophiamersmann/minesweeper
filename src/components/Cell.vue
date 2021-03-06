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
      const classes = {
        'is-covered': this.isCovered,
        'is-flagged': this.isFlagged,
        'has-mine': this.hasMine,
      };
      classes[`has-${this.nMineNeighbours}-mine-neighbours`] = true;
      return classes;
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

      // eslint-disable-next-line no-param-reassign
      if (cell.isFlagged) cell.isFlagged = false;

      this.$emit('uncover', cell);
    },
    flag() {
      if (this.isCovered) {
        this.isFlagged = !this.isFlagged;
      } else if (this.isFlagged) {
        this.isFlagged = false;
      }
      this.$emit('flag', this.$data);
    },
  },
};
</script>

<style scoped>
.cell {
  --size: 1.5rem;

  font-family: 'Courier Prime', monospace;
  font-weight: bold;
  font-size: 0.8rem;
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  text-align: center;
  vertical-align: middle;
  border: 1px solid #fff;
  border-radius: 25%;
  position: relative;
  background-color: var(--primary-light);
}

.cell.has-1-mine-neighbours {
  color: #979A9B;
}
.cell.has-2-mine-neighbours {
  color: var(--primary);
}
.cell.has-3-mine-neighbours,
.cell.has-4-mine-neighbours {
  color: hsl(0 100% 41%);
}
.cell.has-5-mine-neighbours,
.cell.has-6-mine-neighbours,
.cell.has-7-mine-neighbours,
.cell.has-8-mine-neighbours {
  color: hsl(358 97% 31%);
}

.cell:disabled {
  background-color: var(--primary-light);
}
.cell.has-mine:disabled {
  color: var(--black);
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
  background: var(--primary);
  text-indent: 0;
  border-radius: inherit;
}

.cell.is-flagged::after {
  content: '⚑';
  color: var(--accent);
  background-color: var(--accent-light);
}

.cell:not(.is-covered).is-flagged,
.cell:not(.is-covered).is-flagged::after {
  background-color: var(--primary-light);
}

.cell.has-mine {
  background-color: var(--accent);
}

.grid.is-finished.is-lost .cell.has-mine::after {
  content: '';
}
.grid.is-finished.is-lost .cell.has-mine {
  background-color: var(--accent);
}
</style>
