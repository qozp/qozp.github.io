// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';

import Button from 'primevue/button'

import './style.css'


export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.use(PrimeVue, {
      theme: {
        preset: Aura
      }
    });

    app.component('Button', Button)
  }
} satisfies Theme

