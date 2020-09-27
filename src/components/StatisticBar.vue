<template>
  <div class="statistic-bar-wrapper">
    <h1 class="statistic-bar-title">{{ title }} (ID: {{ id }})</h1>
    <h2 class="statistic-bar-description">{{ description }}</h2>
    <!-- <input class="statistic-bar-checkbox" type="radio" :value="id" :checked="id === selection" @change="$emit('update:selection', Number($event.target.value))" /> -->
    <Checkbox
      :value="id"
      :checked="id == selection"
      @update:checked="$emit('update:selection', Number($event))"
    />
    <span class="statistic-bar-percent">{{ Math.ceil(percent * 100) }}%</span>
    <div :style="cssProps" class="statistic-bar"></div>
  </div>
</template>

<script>
import Checkbox from './Checkbox.vue';

export default {
  name: 'StatisticBar',
  props: {
    id: Number,
    title: String,
    description: String,
    percent: Number,
    selection: Number
  },
  components: { Checkbox },
  emits: ['update:selection'],
  computed: {
    cssProps() {
      return {
        '--bar-width': 100 * this.percent + '%'
      };
    }
  },
	methods: {
		shit(stuff) {
			console.log(stuff)
		}
	}
};
</script>

<style scoped>
div.statistic-bar-wrapper {
  display: grid;
  grid-template-columns: 1fr 8fr;
  column-gap: 0.5em;
  padding: 1em;
  border-radius: 0.8em;
  background-color: #4a4a4f;
  box-shadow: inset 0 0 0.5em #2a2a2e;
}

.checkbox-wrapper {
  grid-row: 1 / span 2;
  justify-self: center;
  align-self: center;
}

div.statistic-bar-wrapper + div.statistic-bar-wrapper {
  margin: 2em 0 0 0;
}

h1.statistic-bar-title {
  margin: 0;
  font-family: 'Roboto Mono';
  font-size: 2em;
  grid-column: 2;
  grid-row: 1;
}

h2.statistic-bar-description {
  margin: 0 0 0.2em 0;
  font-family: 'Caveat';
  font-size: 2.25em;
  grid-column: 2;
  grid-row: 2;
}

span.statistic-bar-percent {
  font-family: 'Caveat';
  font-size: 1.75em;
  text-align: center;
  grid-row: 3;
}

div.statistic-bar {
  background-color: #00feff;
  min-width: 0.5%;
  width: var(--bar-width);
  height: 2em;
  border-radius: 0.2em;
  box-shadow: inset 0 0 0.8em #008ea4;
}
</style>
