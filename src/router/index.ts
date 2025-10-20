import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
// import CountdownPage from '@/pages/CountdownPage.vue'
import SlotsPage from '@/pages/SlotsPage.vue'

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    // { path: '/countdown', name: 'Countdown', component: CountdownPage },
    { path: '/slots', name: 'Slots', component: SlotsPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
