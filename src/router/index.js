import { createRouter, createWebHistory } from 'vue-router'
import loginVista from '@/views/loginVista.vue'
import usuarioVista from '@/views/usuarioVista.vue'
import adminVista from '@/views/adminVista.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: loginVista },
    { path: '/usuario', name: 'usuario', component: usuarioVista },
    { path: '/admin', name: 'admin', component: adminVista }
  ],
})

export default router