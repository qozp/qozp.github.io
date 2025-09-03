import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/content/HomePage.vue'
import CountdownPage from '@/components/content/CountdownPage.vue'

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/countdown', name: 'Countdown', component: CountdownPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
