<template>
  <h1>Minesweeper</h1>
  <nav>
    <div>
      <label class="label-top" for="input-size">Size</label>
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
      <label class="label-top" for="input-size">Level</label>
      <div>
        <input
          type="radio"
          id="input-easy"
          value="easy"
          v-model="difficulty"
          @change="start"
        />
        <label class="as-button" for="input-easy">EASY</label>
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
        <label class="as-button" for="input-intermediate">REASONABLE</label>
      </div>
      <div>
        <input
          type="radio"
          id="input-hard"
          value="hard"
          v-model="difficulty"
          @change="start"
        />
        <label class="as-button" for="input-hard">HARD</label>
      </div>
      <div>
        <input
          type="radio"
          id="input-death"
          value="death"
          v-model="difficulty"
          @change="start"
        />
        <label class="as-button" for="input-death">DEATH</label>
      </div>
    </div>
    <div>
      <div class="label-top">&nbsp;</div>
      <button class="dice" @click="start">🎲</button>
    </div>
  </nav>
  <div class="grid" :class="classes">
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
  <div class="match-state" v-if="state.isFinished">
    <div v-if="state.isWon">You won! 🎉</div>
    <div v-else>Sorry! 😢</div>
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
      return Math.floor(this.size ** 2 / {
        easy: 16,
        intermediate: 8,
        hard: 4,
        death: 2,
      }[this.difficulty]);
    },
    classes() {
      return {
        'is-finished': this.state.isFinished,
        'is-lost': !this.state.isWon,
      };
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
      this.checkState();
    },
    onFlag(cell) {
      if (!this.flagged.includes(cell)) this.flagged.push(cell);
      this.checkState();
    },
    onExplode() {
      this.finish();
      this.state.isWon = false;
    },
    checkState() {
      if (this.uncovered.length === this.grid.size ** 2 - this.nMines) {
        this.state.isFinished = true;
        this.state.isWon = true;
      }
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
  text-align: center;
  border: 0;
  border-bottom: 2px solid var(--accent);
  font-size: 0.9rem;
}

.label-top {
  display: block;
  text-align: left;
  margin-bottom: calc((var(--spacing) / 8));
  font-size: 0.8rem;
}

#select-difficulty div {
  display: inline;
}
#select-difficulty input {
  display: none;
}
#select-difficulty .as-button {
  margin: calc(var(--spacing) / 8);
  background-color: var(--accent-light);
  padding: calc(var(--spacing) / 16) calc(var(--spacing) / 8);
  border-radius: 5px;
  color: var(--accent);
  font-weight: bold;
  font-size: 0.8rem;
}
#select-difficulty input:checked + label {
  background-color: var(--accent);
  color: hsla(0, 100%, 100%, 0.9);
}
#select-difficulty .label-top {
  margin-left: calc((var(--spacing) / 8));
}

.match-state {
  margin: var(--spacing) 0 ;
}

.dice {
  background: 0;
  border: 0;
}
.dice:active {
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>
