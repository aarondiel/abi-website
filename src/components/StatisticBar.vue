<template>
  <h1 class="statistic-bar-title">{{ title }}</h1>
  <h2 class="statistic-bar-description">{{ description}}</h2>
  <span class="statistic-bar-percent">{{ Math.ceil(percent) }}</span>
  <span class="statistic-bar"></span>
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
        '--bar-width': this.percent
      };
    }
  }
};
</script>

<style scoped>
h1.statistic-bar-title {
  font-family: "Roboto Mono"
}


</style>
