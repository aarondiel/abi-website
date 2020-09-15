<template>
  <DashboardItem motto="stats.motto[0]"/>
</template>

<script>
import DashboardItem from './DashboardItem';

export default {
  name: 'DashboardItem',
  components: {
    DashboardItem
  },
  props: {
    stats: Object
  }
};
</script>

<style scoped>
</style>
