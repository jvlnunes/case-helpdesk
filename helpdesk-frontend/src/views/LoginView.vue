<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuth } from '@/composables/useAuth'
import { useTickets } from '@/composables/useTickets'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const toast = useToast()
const { login } = useAuth()
const { fetchModules, fetchTickets } = useTickets()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha e-mail e senha', life: 3000 })
    return
  }
  loading.value = true
  try {
    await login(email.value, password.value)
    await Promise.all([fetchModules(), fetchTickets()])
    router.push('/helpdesk')
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Erro no login',
      detail: err.response?.data?.message || 'Verifique suas credenciais e tente novamente.',
      life: 4000
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Full-screen gradient background -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-700 to-blue-400 relative overflow-hidden">

    <!-- Decorative blobs -->
    <div class="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
    <div class="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-blue-300/10 blur-3xl pointer-events-none" />

    <!-- Card -->
    <div class="relative z-10 bg-white rounded-2xl shadow-2xl w-[360px] px-9 py-10">

      <!-- Logo -->
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div class="text-base font-bold text-gray-800 leading-tight">FlowPilot</div>
          <div class="text-[11px] text-gray-400 font-normal">Raposo Plásticos</div>
        </div>
      </div>

      <h1 class="text-xl font-bold text-gray-800 mb-1">Bem-vindo de volta</h1>
      <p class="text-xs text-gray-500 mb-6">Faça login para acessar o Helpdesk</p>

      <!-- Form -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-600">E-mail</label>
          <InputText
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            class="w-full text-sm"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-600">Senha</label>
          <Password
            v-model="password"
            placeholder="••••••••"
            :feedback="false"
            toggle-mask
            input-class="w-full text-sm"
            class="w-full"
            @keyup.enter="handleLogin"
          />
        </div>

        <Button
          label="Entrar"
          icon="pi pi-sign-in"
          :loading="loading"
          class="w-full mt-1"
          @click="handleLogin"
        />
      </div>

      <p class="text-center text-[11px] text-gray-400 mt-5">
        Central de chamados — acesso restrito
      </p>
    </div>
  </div>
</template>
