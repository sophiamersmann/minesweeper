<template>
  <button class="cell">1</button>
</template>

<script>
export default {
  name: 'Cell',
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
  border: 0;
}
</style>
