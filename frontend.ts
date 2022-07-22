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
			component: () => import('@/pages/quotes/index.vue')
		},
		{
			path: '/quotes/submit',
			name: 'quotes/submit',
			component: () => import('@/pages/quotes/submit.vue')
		},
		{
			path: '/gallery',
			name: 'gallery',
			component: () => import('@/pages/gallery/index.vue')
		},
		{
			path: '/gallery/submit',
			name: 'gallery/submit',
			component: () => import('@/pages/gallery/submit.vue')
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
		},
		{
			path: '/couples',
			name: 'couples',
			component: () => import('@/pages/couples/index.vue')
		},
		{
			path: '/couples/submit',
			name: 'couples/submit',
			component: () => import('@/pages/couples/submit.vue')
		},
		{
			path: '/couples/evaluation',
			name: 'couples/evaluation',
			component: () => import('@/pages/couples/evaluation.vue')
		}
	]
})

createApp(App)
	.use(router)
	.mount('#app')
