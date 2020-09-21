<template>
  <h1>{{ title }}</h1>
</template>

<script>
import DashboardItem from './DashboardItem.vue';

export default {
  name: 'Dashboard',
};
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #38383d;
  border-radius: 0.4rem;
}

h1 {
  font-size: 2em;
  font-weight: 500;
  font-family: 'Roboto Mono';
}
</style>
