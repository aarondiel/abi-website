<template>
  <div class="poll-wrapper">
    <h1 class="poll-title">{{ title }}</h1>
    <StatisticBar
      v-for="item in top_options"
      v-bind:key="item.key"
      v-bind:title="item.title"
      v-bind:description="item.description"
      v-bind:percent="ratio(item.votes)"
    />
  </div>
</template>

<script>
import StatisticBar from './StatisticBar.vue';

export default {
  name: 'Poll',
  components: {
    StatisticBar
  },
  props: {
    title: String,
    data: Object,
    count: Number
  },
  methods: {
    ratio: function(votes) {
      return votes / this.data.votes;
    }
  },
  computed: {
    top_options: function() {
      return [...this.data.options].sort((a, b) => {
        return b.votes - a.votes;
      }).slice(0, this.count);
    }
  }
};
</script>

<style scoped>
div.poll-wrapper {
  margin: 2em 1em 0 2em;
  padding: 2em;
  border-radius: 2em;
  background-color: #2a2a2e;
}

h1.poll-title {
  margin: 0 0 0.5em 0;
  text-align: center;
  font-family: 'Roboto Mono';
  font-size: 5em;
}
</style>
