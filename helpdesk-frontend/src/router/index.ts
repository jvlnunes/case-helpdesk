import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MainLayout from '@/views/MainLayout.vue'
import HelpdeskView from '@/views/HelpdeskView.vue'
import TicketDetailView from '@/views/TicketDetailView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/helpdesk' },
      { path: 'helpdesk', name: 'helpdesk', component: HelpdeskView },
      { path: 'helpdesk/:id', name: 'ticket', component: TicketDetailView, props: true }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('@FlowPilot:token')
  if (to.meta.requiresAuth && !token) return '/login'
  if (to.path === '/login' && token) return '/helpdesk'
})

export default router
