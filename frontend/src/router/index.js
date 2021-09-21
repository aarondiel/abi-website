import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/Home.vue')
	},
	{
		path: '/gbr',
		name: 'gbr-vote',
		component: () => import('@/views/Gbr.vue')
	},
	{
		path: '/quotes:page?',
		name: 'quotes',
		component: () => import('@/views/Quotes.vue'),
		props: true
	},
	{
		path: '/gallery:page?',
		name: 'quotes',
		component: () => import('@/views/Gallery.vue'),
		props: true
	},
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('@/views/NotFound.vue')
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router
