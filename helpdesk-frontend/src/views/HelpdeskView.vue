<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTickets } from '@/composables/useTickets'
import StatusBadge from '@/components/StatusBadge.vue'
import SectorBadge from '@/components/SectorBadge.vue'
import OpenTicketModal from '@/components/OpenTicketModal.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const router = useRouter()
const { tickets, modules, loading, fetchTickets, fetchModules } = useTickets()

const showModal = ref(false)
const selectedModule = ref(null)
const search = ref('')
const filterStatus = ref(null)
const filterSector = ref(null)

const statusOptions = [
  { label: 'Todos os status', value: null },
  { label: 'Aberto',         value: 'open' },
  { label: 'Em Andamento',   value: 'in_progress' },
  { label: 'Aguardando',     value: 'waiting' },
  { label: 'Concluído',      value: 'closed' },
]

const sectorOptions = computed(() => [
  { label: 'Todos os setores', value: null },
  ...modules.value.map(m => ({ label: m.sector?.name, value: m.sector?.name }))
])

const filtered = computed(() => {
  return tickets.value.filter(t => {
    const matchSearch = !search.value ||
      t.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      t.code?.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filterStatus.value || t.status === filterStatus.value
    const matchSector = !filterSector.value || t.helpdesk_module?.sector?.name === filterSector.value
    return matchSearch && matchStatus && matchSector
  })
})

const stats = computed(() => ({
  total:    tickets.value.length,
  open:     tickets.value.filter(t => ['open','Não Iniciado'].includes(t.status)).length,
  progress: tickets.value.filter(t => ['in_progress','Em Andamento'].includes(t.status)).length,
  done:     tickets.value.filter(t => ['closed','Concluído'].includes(t.status)).length,
}))

function openModal(mod) {
  selectedModule.value = mod
  showModal.value = true
}

function goToTicket(ticket) {
  router.push(`/helpdesk/${ticket.id}`)
}

onMounted(async () => {
  await Promise.all([fetchModules(), fetchTickets()])
})
</script>

<template>
  <div class="p-6 flex flex-col gap-5 min-h-full">

    <!-- Page Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <i class="pi pi-ticket text-blue-600 text-base" />
        </div>
        <div>
          <h1 class="text-base font-bold text-gray-800 leading-tight">Helpdesk</h1>
          <p class="text-xs text-gray-500">Central de chamados por setor</p>
        </div>
      </div>
      <div class="flex gap-2 flex-wrap">
        <Button
          v-for="mod in modules"
          :key="mod.id"
          :label="`+ ${mod.sector?.name}`"
          size="small"
          @click="openModal(mod)"
        />
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div v-for="card in [
        { label: 'Total',        value: stats.total,    color: 'text-gray-800' },
        { label: 'Abertos',      value: stats.open,     color: 'text-blue-600' },
        { label: 'Em Andamento', value: stats.progress, color: 'text-yellow-600' },
        { label: 'Concluídos',   value: stats.done,     color: 'text-green-600' },
      ]" :key="card.label"
        class="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col gap-1 shadow-sm"
      >
        <span class="text-xs text-gray-400 font-medium">{{ card.label }}</span>
        <span :class="['text-2xl font-bold', card.color]">{{ card.value }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 flex-wrap items-center">
      <div class="relative flex-1 min-w-[180px] max-w-xs">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        <InputText
          v-model="search"
          placeholder="Buscar chamado..."
          class="w-full !pl-8 text-xs"
        />
      </div>
      <Select
        v-model="filterStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        class="text-xs min-w-[160px]"
        placeholder="Status"
      />
      <Select
        v-model="filterSector"
        :options="sectorOptions"
        option-label="label"
        option-value="value"
        class="text-xs min-w-[160px]"
        placeholder="Setor"
      />
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <Skeleton v-for="i in 5" :key="i" height="2.5rem" class="rounded-lg" />
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <DataTable
        :value="filtered"
        :row-hover="true"
        @row-click="goToTicket($event.data)"
        class="text-xs cursor-pointer"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <i class="pi pi-inbox text-4xl" />
            <p class="text-sm font-medium">Nenhum chamado encontrado</p>
            <p class="text-xs">Abra um novo chamado usando os botões acima</p>
          </div>
        </template>

        <Column header="ID" style="width:90px">
          <template #body="{ data }">
            <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[11px] font-mono font-semibold">
              {{ data.code }}
            </span>
          </template>
        </Column>

        <Column header="Título">
          <template #body="{ data }">
            <span class="font-semibold text-gray-800 text-xs">{{ data.title }}</span>
          </template>
        </Column>

        <Column header="Status" style="width:145px">
          <template #body="{ data }">
            <StatusBadge :status="data.status" />
          </template>
        </Column>

        <Column header="Setor" style="width:130px">
          <template #body="{ data }">
            <SectorBadge :name="data.helpdesk_module?.sector?.name" />
          </template>
        </Column>

        <Column header="Data" style="width:120px">
          <template #body="{ data }">
            <span class="text-gray-400 text-[11px]">
              {{ new Date(data.created_at).toLocaleDateString('pt-BR') }}
            </span>
          </template>
        </Column>

        <Column header="" style="width:80px">
          <template #body="{ data }">
            <Button
              label="Ver"
              size="small"
              severity="secondary"
              outlined
              class="!text-xs"
              @click.stop="goToTicket(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal -->
    <OpenTicketModal
      v-model:visible="showModal"
      :module="selectedModule"
      @created="fetchTickets"
    />
  </div>
</template>
