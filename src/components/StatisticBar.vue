<template>
  <div class="statistic-bar-wrapper">
    <h1 class="statistic-bar-title">{{ title }}</h1>
    <h2 class="statistic-bar-description">{{ description }}</h2>
    <span class="statistic-bar-percent">{{ Math.ceil(percent) }}%</span>
    <div :style="cssProps" class="statistic-bar"></div>
  </div>
</template>

<script>
export default {
  name: 'StatisticBar',
  props: {
    title: String,
    description: String,
    percent: Number
  },
  computed: {
    cssProps() {
      return {
        "--bar-width": 100 * this.percent + '%'
      };
    }
  }
};
</script>

<style scoped>
div.statistic-bar-wrapper + div.statistic-bar-wrapper {
  margin: 2em 0 0 0;
}

h1.statistic-bar-title {
  margin: 0;
  font-family: 'Roboto Mono';
  font-size: 2em;
}

h2.statistic-bar-description {
  margin: 0.25em 0;
  font-family: 'Caveat';
  font-size: 2.25em;
}

span.statistic-bar-percent {
  font-family: 'Caveat';
  font-size: 1.75em;
}

div.statistic-bar {
  background-color: #00feff;
  width: var(--bar-width);
  height: 2em;
}
</style>
