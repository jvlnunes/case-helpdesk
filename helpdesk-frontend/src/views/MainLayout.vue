<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const collapsed = ref(false)
const toggleSidebar = () => (collapsed.value = !collapsed.value)
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
    <AppHeader :sidebar-collapsed="collapsed" @toggle-sidebar="toggleSidebar" />

    <div class="flex flex-1 overflow-hidden">
      <AppSidebar :collapsed="collapsed" />
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
