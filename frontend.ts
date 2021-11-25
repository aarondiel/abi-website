import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/app.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('@/pages/index.vue')
		},
		{
			path: '/quotes',
			name: 'quotes',
			component: () => import('@/pages/quotes.vue')
		},
		{
			path: '/rankings',
			name: 'rankings',
			component: () => import('@/pages/rankings/index.vue')
		},
		{
			path: '/rankings/evaluation',
			name: 'rankings/evaluation',
			component: () => import ('@/pages/rankings/evaluation.vue')
		},
		{
			path: '/rankings/submit',
			name: 'rankings/submit',
			component: () => import ('@/pages/rankings/submit.vue')
		}
	]
})

createApp(App)
	.use(router)
	.mount('#app')
