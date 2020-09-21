<template>
  <div>
  <h1 class="poll-title">{{ title }}</h1>
  <StatisticBar 
    v-for="item in data.options" 
    v-bind:key="item.key"
    v-bind:title="item.title"
    v-bind:description="item.description"
    v-bind:percent="ratio(item.votes)"
  />
  </div>
</template>

<script>
import StatisticBar from './StatisticBar.vue'

export default {
  name: 'Poll',
  components: {
      StatisticBar
  },
  props: {
    title: String,
    data: Object
  },
  methods: {
    ratio: function(votes) {
      return votes / this.data.votes
    }
  }
};

</script>
<style scoped></style>

