<script setup lang='ts'>
import { ref, inject } from 'vue'
import { frontend_config as config } from '@/config'
import Loading from '@/components/loading.vue'

const rankings: any = ref({})
const loading = ref(true)
const user: any = inject('user')

function ordered(votes: string[]) {
	const count = new Map()

	votes.forEach(vote => {
		count.set(vote, (count.get(vote) ?? 0) + 1)
	})

	return [...count.keys()].map(v => {
		return {
			name: v,
			num: count.get(v)
		}
	}).sort((a, b) => b.num - a.num)
}

async function get_rankings() {
	const response = await fetch(`${ config.url }/api/rankings/evaluation`, {
		credentials: 'include'
	})

	if (!response.ok)
		return
	
	const data = await response.json()

	rankings.value = data
	loading.value = false
}

get_rankings()
</script>

<template>
	<article v-if='user.privileges.includes("admin")' class='rankings-evaluation'>
		<Loading :loading='loading'>
			<ul>
				<li v-for='ranking in rankings' :key='ranking.question'>
					<h3>{{ ranking.question }}</h3>

					<ol>
						<li v-for='student in ordered(ranking.votes.map((v: any) => v.vote))' :key='student.name'>
							{{ student.num }}: {{ student.name }}
						</li>
					</ol>

					<p v-for='vote in ranking.votes' :key='vote.submitted_by'>
						<span>{{ vote.submitted_by }}</span>
						<span>→</span>
						<span>{{ vote.vote }}</span>
					</p>
				</li>
			</ul>
		</Loading>
	</article>
	<article class='rankings-evaluation' v-else>
		<Loading :loading='loading'>
			<ul>
				<li v-for='ranking in rankings' :key='ranking.question'>
					<h3>{{ ranking.question }}</h3>

					<ol>
						<li v-for='student in ordered(ranking.votes)' :key='student.name'>
							{{ student.num }}: {{ student.name }}
						</li>
					</ol>
				</li>
			</ul>
		</Loading>
	</article>
</template>

<style lang='scss'>
.rankings-evaluation {
	> ul {
		list-style: none;
		padding: 0;

		> li {
			> p {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;

				> span:nth-of-type(2) {
					text-align: center;
				}
			}

			> ol {
				list-style: none;
			}
		}
	}
}
</style>
