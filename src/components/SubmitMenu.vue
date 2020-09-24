<template>
  <div class="submit-menu-wrapper">{{ selection }}</div>
</template>

<script>
export default {
  name: 'SubmitMenu',
  props: {
    selection: Number
  },
  watch: {
    selection: function(oldval, newval) {
      console.log(oldval, newval, this);
    }
  }
};
</script>

<style scoped>
div.submit-menu-wrapper {
}
</style>
