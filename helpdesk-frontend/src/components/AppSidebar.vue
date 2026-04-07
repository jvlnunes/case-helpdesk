<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  collapsed: Boolean
})

const route = useRoute()
const { currentUser } = useAuth()

const isAdmin = computed(() => currentUser.value?.role === 'admin')

const navItems = [
  { icon: 'pi-home',          label: 'Dashboard',   to: '/',          section: null },
  { icon: 'pi-ticket',        label: 'Helpdesk',    to: '/helpdesk',  section: null },
]

const adminItems = [
  { icon: 'pi-cog',           label: 'Configurações', to: '/admin',   section: 'Admin' },
  { icon: 'pi-building',      label: 'Empresas',    to: '/admin/companies', section: null },
]

function isActive(item) {
  if (item.to === '/') return route.path === '/'
  return route.path.startsWith(item.to)
}
</script>

<template>
  <nav
    class="bg-white border-r border-gray-200 flex flex-col py-3 px-2 gap-0.5 flex-shrink-0 transition-all duration-250 overflow-hidden"
    :class="collapsed ? 'w-12' : 'w-48'"
  >
    <!-- Main nav -->
    <div v-for="(item, i) in navItems" :key="i">
      <!-- Section header -->
      <div
        v-if="item.section && !collapsed"
        class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2.5 pt-3 pb-1"
      >
        {{ item.section }}
      </div>

      <RouterLink
        :to="item.to"
        class="nav-item no-underline"
        :class="{ active: isActive(item) }"
        v-tooltip.right="collapsed ? item.label : undefined"
      >
        <i :class="`pi ${item.icon} text-sm flex-shrink-0`" />
        <span v-if="!collapsed" class="nav-label text-xs">{{ item.label }}</span>
      </RouterLink>
    </div>

    <!-- Admin section -->
    <template v-if="isAdmin">
      <div
        v-if="!collapsed"
        class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2.5 pt-4 pb-1"
      >
        Administração
      </div>
      <div v-if="collapsed" class="border-t border-gray-100 my-2" />

      <RouterLink
        v-for="item in adminItems"
        :key="item.to"
        :to="item.to"
        class="nav-item no-underline"
        :class="{ active: isActive(item) }"
        v-tooltip.right="collapsed ? item.label : undefined"
      >
        <i :class="`pi ${item.icon} text-sm flex-shrink-0`" />
        <span v-if="!collapsed" class="nav-label text-xs">{{ item.label }}</span>
      </RouterLink>
    </template>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Footer -->
    <div v-if="!collapsed" class="px-2 pb-1">
      <div class="text-[10px] text-gray-300 text-center">FlowPilot v1.0</div>
    </div>
  </nav>
</template>
