<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Toast from 'primevue/toast'

const { isLoggedIn, fetchMe } = useAuth()

onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchMe()
  }
})
</script>

<template>
  <Toast position="top-right" />
  <RouterView />
</template>
