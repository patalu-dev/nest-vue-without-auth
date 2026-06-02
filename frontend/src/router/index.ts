import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('../pages/Dashboard.vue'),
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('../pages/users/Index.vue'),
        },
    ],
})

export default router
