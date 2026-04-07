<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

const props = defineProps({
  sidebarCollapsed: Boolean
})
const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const { currentUser, userInitials, logout } = useAuth()
const menu = ref()

const menuItems = ref([
  {
    label: 'Minha conta',
    items: [
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => { logout(); router.push('/login') }
      }
    ]
  }
])

const today = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  })
})

const toggleMenu = (event) => menu.value.toggle(event)
</script>

<template>
  <header class="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0 z-50">

    <!-- Logo + toggle -->
    <div class="flex items-center gap-2 flex-shrink-0" :style="{ width: sidebarCollapsed ? '48px' : '192px' }">
      <div class="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <transition name="fade">
        <div v-if="!sidebarCollapsed">
          <div class="text-[12px] font-bold text-gray-800 leading-tight">FlowPilot</div>
          <div class="text-[9px] text-gray-400">Raposo Plásticos</div>
        </div>
      </transition>
    </div>

    <!-- Hamburger -->
    <button
      class="flex flex-col justify-center gap-[4px] cursor-pointer w-6 h-6 shrink-0"
      @click="emit('toggle-sidebar')"
    >
      <span class="h-[2px] bg-gray-400 rounded-full transition-all" :class="sidebarCollapsed ? 'w-4' : 'w-4'" />
      <span class="h-[2px] w-3 bg-gray-400 rounded-full transition-all" />
    </button>

    <!-- Date -->
    <div class="hidden md:block text-xs text-gray-400 font-medium border-l border-gray-200 pl-3 capitalize">
      {{ today }}
    </div>

    <!-- Right -->
    <div class="ml-auto flex items-center gap-2">
      <!-- Notification bell -->
      <button class="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
        <i class="pi pi-bell text-xs" />
      </button>

      <!-- Avatar + menu -->
      <div class="flex items-center gap-2 cursor-pointer" @click="toggleMenu">
        <Avatar
          :label="userInitials"
          shape="circle"
          class="!w-8 !h-8 !text-xs font-bold !bg-blue-600 !text-white"
        />
        <span class="hidden md:block text-xs font-medium text-gray-700">{{ currentUser?.name }}</span>
        <i class="pi pi-chevron-down text-[10px] text-gray-400" />
      </div>
      <Menu ref="menu" :model="menuItems" popup />
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
