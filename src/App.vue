<template>
  <Grid/>
</template>

<script>
import Grid from './components/Grid.vue';

export default {
  name: 'App',
  components: {
    Grid,
  },
};
</script>

<style>
#app {
  margin-top: calc(var(--spacing) * 2);
  text-align: center;
}
</style>
