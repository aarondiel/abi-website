<template>
  <div class="dashboard-wrapper">
    <DashboardItem title="Mottos" />
    <DashboardItem title="Zitate" />
    <DashboardItem title="Random Stuff" />
  </div>
</template>

<script>
import DashboardItem from './DashboardItem.vue';

export default {
  name: 'Dashboard',
  components: {
    DashboardItem
  }
};
</script>

<style scoped>
.dashboard-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 8em;
}
</style>
