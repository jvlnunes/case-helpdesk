import { ref } from 'vue'
import api from '@/services/api'

const tickets = ref([])
const modules = ref([])
const loading = ref(false)

export function useTickets() {
  async function fetchModules() {
    const res = await api.get('/helpdesk-modules')
    modules.value = res.data
  }

  async function fetchTickets() {
    loading.value = true
    try {
      const res = await api.get('/tickets')
      tickets.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function createTicket(payload) {
    const res = await api.post('/tickets', payload)
    await fetchTickets()
    return res.data
  }

  async function updateTicketStatus(ticketId, status) {
    const res = await api.patch(`/tickets/${ticketId}`, { status })
    const idx = tickets.value.findIndex(t => t.id === ticketId)
    if (idx !== -1) tickets.value[idx] = res.data
    return res.data
  }

  async function fetchComments(ticketId) {
    const res = await api.get(`/tickets/${ticketId}/comments`)
    return res.data
  }

  async function postComment(ticketId, text) {
    const res = await api.post('/tickets/comment', { ticketId, text })
    return res.data
  }

  return {
    tickets,
    modules,
    loading,
    fetchModules,
    fetchTickets,
    createTicket,
    updateTicketStatus,
    fetchComments,
    postComment
  }
}
