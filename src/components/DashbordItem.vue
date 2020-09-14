<template>
  <div class="dashbord-item-wrapper">
      <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'DashbordItem',
  props: {
    title: String
  }
};
</script>

<style scoped>
.dashbord-item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #38383d;
  border-radius: 0.4rem;
}

.dashbord-item-wrapper > h1 {
  font-size: 2em;
  font-weight: 500;
  font-family: 'Roboto Mono';
}
</style>
