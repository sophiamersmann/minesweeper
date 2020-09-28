<template>
  <button
    class="cell"
    :class="classes"
  >
    {{ displayValue }}
  </button>
</template>

<script>
export default {
  name: 'Cell',
  props: ['cell'],
  data() {
    return this.cell;
  },
  computed: {
    displayValue() {
      if (this.hasMine) return '•';
      return this.nMines > 0 ? this.nMines : null;
    },
    classes() {
      return {
        'is-covered': true,
      };
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
}
</style>
