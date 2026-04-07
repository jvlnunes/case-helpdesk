<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useTickets } from '@/composables/useTickets'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const props = defineProps({
  visible: Boolean,
  module: { type: Object, default: null }
})

const emit = defineEmits(['update:visible', 'created'])

const toast = useToast()
const { createTicket } = useTickets()

const form = ref({ title: '', description: '', payload_data: {} })
const saving = ref(false)

// Reset form when module changes
watch(() => props.module, () => {
  form.value = { title: '', description: '', payload_data: {} }
})

async function submit() {
  if (!form.value.title.trim()) {
    toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe o título do chamado', life: 3000 })
    return
  }
  saving.value = true
  try {
    await createTicket({
      helpdeskModuleId: props.module.id,
      title: form.value.title,
      description: form.value.description,
      payload_data: form.value.payload_data
    })
    toast.add({ severity: 'success', summary: 'Chamado aberto!', detail: 'Seu chamado foi registrado com sucesso.', life: 3000 })
    emit('update:visible', false)
    emit('created')
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível abrir o chamado.', life: 4000 })
  } finally {
    saving.value = false
  }
}

const sectorIconMap = {
  'TI': 'pi-desktop',
  'RH': 'pi-users',
  'Manutenção': 'pi-wrench',
  'Qualidade': 'pi-verified',
}
const sectorColorMap = {
  'TI':         'bg-blue-100 text-blue-700',
  'RH':         'bg-green-100 text-green-700',
  'Manutenção': 'bg-orange-100 text-orange-700',
  'Qualidade':  'bg-purple-100 text-purple-700',
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    :style="{ width: '560px' }"
    :closable="true"
    :draggable="false"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div
          v-if="module"
          :class="['w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0',
                   sectorColorMap[module.sector?.name] ?? 'bg-gray-100 text-gray-600']"
        >
          <i :class="['pi', sectorIconMap[module.sector?.name] ?? 'pi-tag']" />
        </div>
        <div>
          <div class="text-sm font-bold text-gray-800">Abrir Chamado</div>
          <div class="text-xs text-gray-400">{{ module?.sector?.name }}</div>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <!-- Título -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-gray-600">
          Título do Chamado <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.title"
          placeholder="Descreva brevemente o problema..."
          class="w-full text-sm"
        />
      </div>

      <!-- Descrição -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-semibold text-gray-600">Descrição</label>
        <Textarea
          v-model="form.description"
          placeholder="Forneça mais detalhes sobre o chamado..."
          rows="3"
          class="w-full text-sm resize-none"
        />
      </div>

      <!-- Campos dinâmicos do schema -->
      <template v-if="module?.schema_fields?.length">
        <Divider class="!my-0" />
        <div class="text-xs font-bold text-gray-700">Campos Específicos — {{ module.sector?.name }}</div>

        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="field in module.schema_fields"
            :key="field.name"
            :class="['flex flex-col gap-1.5', field.type === 'textarea' ? 'col-span-2' : '']"
          >
            <label class="text-xs font-semibold text-gray-600">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>

            <!-- Select -->
            <Select
              v-if="field.type === 'select'"
              v-model="form.payload_data[field.name]"
              :options="field.options"
              placeholder="Selecione..."
              class="w-full text-sm"
            />

            <!-- Textarea -->
            <Textarea
              v-else-if="field.type === 'textarea'"
              v-model="form.payload_data[field.name]"
              rows="2"
              class="w-full text-sm resize-none"
              :placeholder="field.placeholder || ''"
            />

            <!-- Default: text / number / date / email -->
            <InputText
              v-else
              v-model="form.payload_data[field.name]"
              :type="field.type || 'text'"
              :placeholder="field.placeholder || ''"
              class="w-full text-sm"
            />
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        severity="secondary"
        text
        @click="emit('update:visible', false)"
      />
      <Button
        label="Abrir Chamado"
        icon="pi pi-check"
        :loading="saving"
        @click="submit"
      />
    </template>
  </Dialog>
</template>
