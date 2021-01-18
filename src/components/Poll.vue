<template>
	<div class="poll-wrapper">
		<div class="poll-content">
			<span>
				<hr />
				<h1>{{ title }}</h1>
				<hr />
			</span>
			<StatisticBar
				v-for="item in top_options"
				ref="statisticbar"
				:key="item.key"
				:id="item.key"
				:title="item.title"
				:description="item.description"
				:percent="ratio(item.votes)"
				v-model:selection="selection"
			/>
		</div>
		<SubmitMenu
			:selection="selection"
			url="https://schoolvote.vincentscode.de/api/vote"
			@submit="$emit('submit')"
		/>
	</div>
</template>

<script>
import StatisticBar from './StatisticBar.vue';
import SubmitMenu from './SubmitMenu.vue';

export default {
	name: 'Poll',
	components: {
		StatisticBar,
		SubmitMenu
	},
	emits: ['submit'],
	data() {
		return {
			selection: -1
		};
	},
	props: {
		title: String,
		data: Object,
		count: Number
	},
	methods: {
		ratio(votes) {
			return votes / this.data.votes;
		}
	},
	computed: {
		top_options() {
			if (!this.data) return null;
			return [...this.data.options]
				.sort((a, b) => {
					return b.votes - a.votes;
				})
				.slice(0, this.count);
		},

		selected() {
			return this.selection != -1;
		}
	}
};
</script>

<style scoped lang="scss">
@mixin heading {
	display: flex;
	justify-content: center;
	align-items: center;

	h1, h2, h3, h4, h5, h6 {
		margin: 0 0.25em 0.75em 0.25em;
		text-align: center;
		font-family: 'Roboto Mono';
	}

	hr {
		height: 0;
		color: transparent;
		background: transparent;
		margin: 0 0 1em 0;
		flex-grow: 2;
		border: dashed 0.2em #ffffff;
	}
}

div.poll-wrapper {
	z-index: 0;
}

div.poll-content {
	border: solid 2em #2a2a2e;
	margin: 0;
	padding: 2em 0;
	border-radius: 2em;
	background-color: #2a2a2e;
	height: 70vh;
	overflow-y: scroll;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		width: 0.75em;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(249, 249, 250, 0.6);
		border-radius: 0.5em;
	}

	&::-webkit-scrollbar-track {
		display: none;
	}

	span {
		font-size: 2em;
		@include heading;
	}
}
</style>
