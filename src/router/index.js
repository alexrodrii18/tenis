import { createRouter, createWebHistory } from 'vue-router'
import loginVista from '@/views/loginVista.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: loginVista,
    },
  ],
})

export default router
