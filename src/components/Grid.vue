<template>
  <h1>Minesweeper</h1>
  <nav>
    <div>
      <label for="input-size">Size</label>
      <input
        v-model.number="size"
        type="number"
        id="input-size"
        min="4"
        max="32"
        @change="start"
      />
    </div>
    <div id="select-difficulty">
      <div>
        <input
          type="radio"
          id="input-easy"
          value="easy"
          v-model="difficulty"
          @change="start"
        />
        <label for="input-easy">Easy</label>
      </div>
      <div>
        <input
          type="radio"
          id="input-intermediate"
          value="intermediate"
          v-model="difficulty"
          @change="start"
          checked
        />
        <label for="input-intermediate">Reasonable</label>
      </div>
      <div>
        <input
          type="radio"
          id="input-hard"
          value="hard"
          v-model="difficulty"
          @change="start"
        />
        <label for="input-hard">Hard</label>
      </div>
      <div>
        <input
          type="radio"
          id="input-death"
          value="death"
          v-model="difficulty"
          @change="start"
        />
        <label for="input-death">Death</label>
      </div>
    </div>
    <button @click="start">Restart!</button>
  </nav>
  <div class="grid">
    <div class="grid__row" v-for="(row, i) in grid.matrix" :key="[gameKey, i]">
      <Cell
        class="grid__cell"
        v-for="(cell, j) in row"
        :key="[gameKey, i, j]"
        :cell="cell"
        @uncover="onUncover"
        @explode="onExplode"
        @flag="onFlag"
      />
    </div>
  </div>
  <div v-if="state.isFinished">
    <div v-if="state.isWon">You won!</div>
    <div v-else>You lost!</div>
  </div>
</template>

<script>
import Grid from '@/core/Grid';
import Cell from './Cell.vue';

const DEFAULT = {
  gameKey: 0,
  size: 9,
  difficulty: 'intermediate',
};

export default {
  name: 'Grid',
  components: {
    Cell,
  },
  data() {
    return {
      gameKey: DEFAULT.gameKey,
      size: DEFAULT.size,
      difficulty: DEFAULT.difficulty,
      state: {
        hasStarted: false,
        isFinished: false,
        isWon: false,
      },
      grid: null,
      uncovered: [],
      flagged: [],
    };
  },
  created() {
    this.start();
  },
  computed: {
    nMines() {
      return this.size ** 2 / {
        easy: 16,
        intermediate: 8,
        hard: 4,
        death: 2,
      }[this.difficulty];
    },
  },
  methods: {
    start() {
      this.gameKey += 1;

      this.state.isFinished = false;
      this.state.isWon = false;

      this.grid = new Grid(this.size, this.nMines);

      this.uncovered = [];
      this.flagged = [];
    },
    onUncover(cell) {
      if (!this.uncovered.includes(cell)) this.uncovered.push(cell);

      if (this.uncovered.length === this.grid.size ** 2 - this.nMines) {
        this.state.isFinished = true;
        this.state.isWon = true;
      }
    },
    onFlag(cell) {
      if (!this.flagged.includes(cell)) this.flagged.push(cell);

      if (
        this.flagged.length === this.nMines
        && this.flagged.every((c) => c.hasMine)
      ) {
        this.finish();
        this.state.isWon = true;
      }
    },
    onExplode() {
      this.finish();
      this.state.isWon = false;
    },
    finish() {
      this.state.isFinished = true;

      // uncover all mines
      for (let i = 0; i < this.grid.mines.length; i += 1) {
        const mineCell = this.grid.mines[i];
        mineCell.isCovered = false;
      }

      // disable all cells
      for (let i = 0; i < this.grid.flat.length; i += 1) {
        const cell = this.grid.flat[i];
        cell.isDisabled = true;
      }
    },
  },
};
</script>

<style scoped>
nav {
  margin: var(--spacing) 0;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: calc(var(--spacing) / 2);
}
nav input {
  width: 40px;
  text-align: right;
}
#select-difficulty div {
  display: inline;
}
#select-difficulty input {
  display: none;
}
#select-difficulty label {
  margin: calc(var(--spacing) / 8);
  background-color: var(--accent-light);
  padding: calc(var(--spacing) / 16) calc(var(--spacing) / 8);
  border-radius: 5px;
  color: var(--accent);
  font-weight: bold;
}
#select-difficulty input:checked + label {
  background-color: var(--accent);
  color: hsla(0, 100%, 100%, 0.9);
}
</style>
