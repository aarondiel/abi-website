<template>
  <div
    :style="cssProps"
    class="checkbox-wrapper"
    @click="$emit('toggled', $event.target)"
  ></div>
</template>

<script>
export default {
  name: 'Checkbox',
  data() {
    return {
      checked: false,
      colors: {
        idle: 'red',
        checked: 'rgba(249, 249, 250, 0.8)' 
      }
    };
  }
};
</script>

<style scoped>
div.checkbox-wrapper {
  background-color: var(--checkbox-color);
  width: 3em;
  height: 3em;
}
</style>
