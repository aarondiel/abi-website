<template>
	<span class='filePath'>
		<img :src='filePath' alt='file image'/>
	</span>
</template>

<script>
import { ref } from 'vue';

export default {
	name: 'FileMenu',
	props: {
		fileType: String
	},
	setup(props) {
		let filePath = ref('');
		switch (props.fileType) {
			case 'pdf':
				filePath = require('@/assets/pdfFile.svg');
				break;
		}

		return {
			filePath
		}
	}
}
</script>

<style lang="scss" scoped>
.filePath {
	margin: 1rem;
	background-color: $grey;
}
</style>
