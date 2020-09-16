<template>
  <DashboardItem
    v-for="statistic in stats"
    v-bind:key="statistic.id"
    motto="statistic"
    percent="{{"
    calcWidth(statistic.votes)
    }}
  />
</template>

<script>
import DashboardItem from './DashboardItem';

export default {
  name: 'DashboardItem',
  components: {
    DashboardItem
  },
  props: {
    stats: Array
  },
  methods: {
    calcWidth = function(votes) {
      return votes / this.stats.total-votes
    }
  }
};
</script>

<style scoped></style>
