<template>
  <h1>{{ motto.motto }}</h1>
  <h2>{{ motto.spruch }}</h2>
  <div>
    <span></span>
    <p></p>
  </div>
</template>

<script>
export default {
  name: 'StatisticItem',
  props: {
    motto: Object,
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
h1 {
  background-color: #00feff;
  width: var('--bar-width');
}
</style>
