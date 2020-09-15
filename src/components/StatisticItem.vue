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
    total: Number
  },
  computed: {
    cssProps() {
      return {
        '--bar-width': this.motto.votes / this.total + '%'
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
