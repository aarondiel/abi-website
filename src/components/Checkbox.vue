<template>
  <div :style="cssProps" @click="check()" class="checkbox-wrapper">
    <img v-if="checked" src="../assets/checkmark.svg" />
    <span class="checkbox-box" />
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    value: [String, Number],
    checked: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:checked'],
  methods: {
    check() {
      this.$emit('update:checked', this.value);
    }
  }
};
</script>

<style scoped lang="scss">
div.checkbox-wrapper {
  z-index: 0;
  position: relative;
  width: 5em;
  height: 5em;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    z-index: 1;
    width: 70%;
    height: 70%;
  }

  span {
    width: 40%;
    height: 40%;
    position: absolute;
    z-index: -1;
    border: dashed 0.4em #38383d;
    border-radius: 0.5em;
  }
}
</style>
