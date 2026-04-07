<script setup>
defineProps({ name: { type: String, default: '' } })

const colorMap = {
  'TI':          'sector-ti',
  'RH':          'sector-rh',
  'Manutenção':  'sector-manut',
  'Qualidade':   'sector-qual',
}

const iconMap = {
  'TI':         'pi-desktop',
  'RH':         'pi-users',
  'Manutenção': 'pi-wrench',
  'Qualidade':  'pi-verified',
}

const cls  = (n) => colorMap[n]  ?? 'bg-gray-100 text-gray-700'
const icon = (n) => iconMap[n]   ?? 'pi-tag'
</script>

<template>
  <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cls(name)]">
    <i :class="['pi text-[10px]', icon(name)]" />
    {{ name }}
  </span>
</template>
