import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/components/pages/HomePage.vue'
import CountdownPage from '@/components/pages/CountdownPage.vue'
import SlotsPage from '@/components/pages/SlotsPage.vue'

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/countdown', name: 'Countdown', component: CountdownPage },
    { path: '/slots', component: SlotsPage },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
