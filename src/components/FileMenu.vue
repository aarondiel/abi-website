<template>
	<div class='fileMenu'>
		<img :src='filePath' alt='file image'/>
		<span>
			<slot/>
		</span>
	</div>
</template>

<script>
import { ref } from 'vue';

export default {
	name: 'FileMenu',
	props: {
		fileType: String,
		text: String
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
@use '../scss/colors';

.fileMenu {
	display: flex;
	align-items: center;
	height: 40px;
	background-color: colors.$grey;
	border-radius: 5px;
	box-shadow: 0 2px 2px #000000;

	img {
		margin: 0 0.5rem;
		height: 75%;
	}
}
</style>
