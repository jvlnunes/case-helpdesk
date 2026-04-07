<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useTickets } from '@/composables/useTickets'
import { useAuth } from '@/composables/useAuth'
import StatusBadge from '@/components/StatusBadge.vue'
import SectorBadge from '@/components/SectorBadge.vue'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Avatar from 'primevue/avatar'

const props = defineProps({ id: String })
const router = useRouter()
const toast = useToast()
const { tickets, fetchTickets, fetchComments, postComment, updateTicketStatus } = useTickets()
const { userInitials } = useAuth()

const ticket = computed(() => tickets.value.find(t => t.id === props.id) ?? null)
const comments = ref([])
const commentText = ref('')
const loadingComments = ref(false)
const sendingComment = ref(false)
const updatingStatus = ref(false)

const statusOptions = [
  { label: 'Aberto',       value: 'open' },
  { label: 'Em Andamento', value: 'in_progress' },
  { label: 'Aguardando',   value: 'waiting' },
  { label: 'Concluído',    value: 'closed' },
]

const selectedStatus = ref('open')

function formatComment(text) {
  return text.replace(/@(\w+)/g, '<span class="text-blue-600 font-semibold">@$1</span>')
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase()
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'agora'
  if (diff < 3600) return Math.floor(diff/60) + 'min atrás'
  if (diff < 86400) return Math.floor(diff/3600) + 'h atrás'
  return date.toLocaleDateString('pt-BR')
}

async function loadComments() {
  loadingComments.value = true
  try { comments.value = await fetchComments(props.id) }
  finally { loadingComments.value = false }
}

async function sendComment() {
  const text = commentText.value.trim()
  if (!text) return
  sendingComment.value = true
  try {
    const c = await postComment(props.id, text)
    comments.value.push(c)
    commentText.value = ''
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível enviar o comentário.', life: 3000 })
  } finally { sendingComment.value = false }
}

async function changeStatus(val) {
  updatingStatus.value = true
  try {
    await updateTicketStatus(props.id, val)
    toast.add({ severity: 'success', summary: 'Status atualizado', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Erro ao atualizar status', life: 3000 })
  } finally { updatingStatus.value = false }
}

const payloadFields = computed(() => {
  if (!ticket.value?.payload_data) return []
  return Object.entries(ticket.value.payload_data).map(([k,v]) => ({ key: k, value: v }))
})

onMounted(async () => {
  if (!tickets.value.length) await fetchTickets()
  await loadComments()
  if (ticket.value) selectedStatus.value = ticket.value.status
})
</script>

<template>
  <div class="p-6 flex flex-col gap-5">

    <!-- Back -->
    <div class="flex items-center gap-2">
      <Button icon="pi pi-arrow-left" label="Voltar" size="small" severity="secondary" text @click="router.push('/helpdesk')" />
      <span class="text-gray-300">/</span>
      <span class="text-xs text-gray-400 font-mono">{{ ticket?.code }}</span>
    </div>

    <div v-if="!ticket" class="flex flex-col gap-4">
      <Skeleton height="2rem" width="60%" class="rounded-lg" />
      <Skeleton height="1.2rem" width="30%" class="rounded-lg" />
    </div>

    <template v-else>
      <!-- Ticket header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex flex-col gap-2">
          <h1 class="text-lg font-bold text-gray-800">{{ ticket.title }}</h1>
          <div class="flex items-center gap-2 flex-wrap">
            <StatusBadge :status="ticket.status" />
            <SectorBadge :name="ticket.helpdesk_module?.sector?.name" />
            <span class="text-[11px] text-gray-400">Aberto em {{ new Date(ticket.created_at).toLocaleDateString('pt-BR') }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 font-medium">Status:</span>
          <Select
            v-model="selectedStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            class="text-xs min-w-[160px]"
            @change="changeStatus(selectedStatus)"
          />
        </div>
      </div>

      <!-- Body -->
      <div class="flex gap-5 items-start">
        <!-- Main -->
        <div class="flex-1 min-w-0 flex flex-col gap-4">

          <!-- Description -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div class="text-xs font-bold text-gray-700 mb-2">Descrição</div>
            <p class="text-xs text-gray-600 leading-relaxed">{{ ticket.description || 'Sem descrição.' }}</p>
            <template v-if="payloadFields.length">
              <div class="border-t border-gray-100 mt-3 pt-3 grid grid-cols-2 gap-x-6 gap-y-2">
                <div v-for="f in payloadFields" :key="f.key" class="flex flex-col gap-0.5">
                  <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{{ f.key }}</span>
                  <span class="text-xs text-gray-700 font-medium">{{ f.value || '—' }}</span>
                </div>
              </div>
            </template>
          </div>

          <!-- Comments -->
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <i class="pi pi-comments text-gray-400 text-sm" />
              <span class="text-xs font-bold text-gray-700">Comentários</span>
              <span class="ml-auto text-[11px] text-gray-400">{{ comments.length }}</span>
            </div>

            <div class="px-4 py-3 flex flex-col gap-4 max-h-96 overflow-y-auto">
              <div v-if="loadingComments" class="flex flex-col gap-3">
                <Skeleton v-for="i in 3" :key="i" height="3rem" class="rounded-lg" />
              </div>
              <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-400">
                <i class="pi pi-comment text-2xl mb-2 block" />
                <p class="text-xs">Nenhum comentário ainda.</p>
              </div>
              <div v-for="c in comments" :key="c.id" class="flex gap-3">
                <Avatar :label="initials(c.user?.name)" shape="circle"
                  class="!w-7 !h-7 !text-[10px] font-bold !bg-blue-600 !text-white flex-shrink-0" />
                <div class="flex-1 bg-gray-50 rounded-lg rounded-tl-none p-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-gray-700">{{ c.user?.name ?? 'Usuário' }}</span>
                    <span class="text-[10px] text-gray-400">{{ timeAgo(c.created_at) }}</span>
                  </div>
                  <div class="text-xs text-gray-600 leading-relaxed" v-html="formatComment(c.text)" />
                </div>
              </div>
            </div>

            <div class="px-4 py-3 border-t border-gray-100 flex gap-3 items-end">
              <Avatar :label="userInitials" shape="circle"
                class="!w-7 !h-7 !text-[10px] !bg-blue-600 !text-white flex-shrink-0" />
              <Textarea
                v-model="commentText"
                placeholder="Escreva um comentário... Use @nome para mencionar"
                rows="2"
                class="flex-1 text-xs resize-none"
                @keydown.ctrl.enter="sendComment"
              />
              <Button icon="pi pi-send" label="Enviar" size="small"
                :loading="sendingComment" :disabled="!commentText.trim()" @click="sendComment" />
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="w-60 flex-shrink-0 flex flex-col gap-3">
          <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div class="text-xs font-bold text-gray-700 mb-3">Detalhes</div>
            <div class="flex flex-col gap-2.5">
              <div v-for="row in [
                { label: 'Código',  value: ticket.code },
                { label: 'Abertura', value: new Date(ticket.created_at).toLocaleDateString('pt-BR') },
              ]" :key="row.label" class="flex flex-col gap-0.5">
                <span class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{{ row.label }}</span>
                <span class="text-xs text-gray-700 font-mono">{{ row.value }}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Setor</span>
                <SectorBadge :name="ticket.helpdesk_module?.sector?.name" />
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Status</span>
                <StatusBadge :status="ticket.status" />
              </div>
              <div v-if="ticket.user" class="flex flex-col gap-0.5">
                <span class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Solicitante</span>
                <div class="flex items-center gap-1.5">
                  <Avatar :label="initials(ticket.user?.name)" shape="circle"
                    class="!w-5 !h-5 !text-[9px] !bg-blue-600 !text-white" />
                  <span class="text-xs text-gray-700">{{ ticket.user?.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div class="text-xs font-bold text-gray-700 mb-3">Histórico</div>
            <div class="flex gap-2">
              <div class="w-0.5 bg-blue-500 rounded-full flex-shrink-0" />
              <div>
                <div class="text-xs font-semibold text-gray-700">Chamado Criado</div>
                <div class="text-[10px] text-gray-400">{{ new Date(ticket.created_at).toLocaleDateString('pt-BR') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
