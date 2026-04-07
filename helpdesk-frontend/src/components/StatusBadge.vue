<script setup>
const props = defineProps({
  status: { type: String, default: '' }
})

const map = {
  'open':        { label: 'Aberto',       cls: 'status-open',     icon: 'pi-circle-fill' },
  'in_progress': { label: 'Em Andamento', cls: 'status-progress',  icon: 'pi-spinner'     },
  'waiting':     { label: 'Aguardando',   cls: 'status-waiting',   icon: 'pi-clock'       },
  'closed':      { label: 'Concluído',    cls: 'status-done',      icon: 'pi-check-circle'},

  // Portuguese fallbacks (backend may return these)
  'Não Iniciado':  { label: 'Não Iniciado',  cls: 'status-open',     icon: 'pi-circle-fill' },
  'Em Andamento':  { label: 'Em Andamento',  cls: 'status-progress', icon: 'pi-spinner'     },
  'Aguardando':    { label: 'Aguardando',    cls: 'status-waiting',  icon: 'pi-clock'       },
  'Concluído':     { label: 'Concluído',     cls: 'status-done',     icon: 'pi-check-circle'},
}

const resolved = (s) => map[s] ?? { label: s, cls: 'status-open', icon: 'pi-circle-fill' }
</script>

<template>
  <span :class="['status-badge', resolved(status).cls]">
    <i :class="['pi text-[9px]', resolved(status).icon]" />
    {{ resolved(status).label }}
  </span>
</template>
