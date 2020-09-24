<template>
  <div class="submit-menu-wrapper">this is a test</div>
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
	display: none;
}
</style>
