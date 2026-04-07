import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

// PrimeVue components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import ProgressSpinner from 'primevue/progressspinner'
import Chip from 'primevue/chip'
import Divider from 'primevue/divider'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import Menu from 'primevue/menu'
import Tooltip from 'primevue/tooltip'

import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false
    }
  }
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(router)

// Global component registration
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Select', Select)
app.component('Textarea', Textarea)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('Tag', Tag)
app.component('Avatar', Avatar)
app.component('Badge', Badge)
app.component('Skeleton', Skeleton)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Chip', Chip)
app.component('Divider', Divider)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Menu', Menu)

app.directive('tooltip', Tooltip)

app.mount('#app')
