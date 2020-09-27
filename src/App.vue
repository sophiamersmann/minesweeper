<template>
  <Cell/>
</template>

<script>
import Cell from './components/Cell.vue';

export default {
  name: 'App',
  components: {
    Cell,
  },
};
</script>

<style>
#app {
  margin-top: calc(var(--spacing) * 2);
  text-align: center;
}
</style>
