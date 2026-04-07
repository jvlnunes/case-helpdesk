import { ref, computed } from 'vue'
import api from '@/services/api'

const currentUser = ref(null)
const isLoggedIn = ref(!!localStorage.getItem('@FlowPilot:token'))

export function useAuth() {
  const userInitials = computed(() => {
    if (!currentUser.value?.name) return '?'
    return currentUser.value.name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase()
  })

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('@FlowPilot:token', res.data.access_token)
    currentUser.value = res.data.user
    isLoggedIn.value = true
    return res.data
  }

  function logout() {
    localStorage.removeItem('@FlowPilot:token')
    currentUser.value = null
    isLoggedIn.value = false
  }

  async function fetchMe() {
    try {
      const res = await api.get('/auth/me')
      currentUser.value = res.data
    } catch {
      logout()
    }
  }

  return { currentUser, isLoggedIn, userInitials, login, logout, fetchMe }
}
