import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/pages/HomePage.vue'
import CountdownPage from '@/components/pages/CountdownPage.vue'
import SlotsPage from '@/components/pages/SlotsPage.vue'

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/countdown', name: 'Countdown', component: CountdownPage },
    { path: '/slots', name: 'Slots', component: SlotsPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
