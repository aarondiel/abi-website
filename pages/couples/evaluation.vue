<script setup lang='ts'>
import Loading from '@/components/loading.vue'
import { ref, inject } from 'vue'
import { frontend_config as config } from '@/config'

const loading = ref(true)
const user: any = inject('user')
const votes = ref<Record<string, any>>([])

async function get_votes() {
	const response = await fetch(`${ config.url }/api/couples/evaluation`, {
		credentials: 'include'
	})

	if (!response.ok)
		return

	votes.value = await response.json()
	loading.value = false
}

get_votes()
</script>

<template>
	<article class='couples-evaluation'>
		<Loading :loading='loading'>
			<ul>
				<li v-for='vote in votes' :key='vote._id'>
					<h3>{{ vote.question }}</h3>

					<ol>
						<li v-for='suggestion in Object.keys(vote.votes)' :key='suggestion'>
							{{ vote.votes[suggestion] }}: {{ suggestion }}
						</li>
					</ol>

					<p
						v-for='submission in Object.keys(vote.submitted_by)'
						:key='submission'
						v-if='user.privileges.includes("admin")'
					>
						<span>{{ submission }}</span>
						<span>→</span>
						<span>{{ vote.submitted_by[submission] }}</span>
					</p>
				</li>
			</ul>
		</Loading>
	</article>
</template>

<style lang='scss'>
.couples-evaluation {
	> ul {
		list-style: none;
		padding: 0;

		> li {
			> ol {
				list-style: none;
			}

			> p {
				display: grid;
				grid-template-columns: repeat(3, 1fr);

				> span:nth-of-type(2) {
					text-align: center;
				}
			}
		}
	}
}
</style>
