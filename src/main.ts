import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import Vueform from '@vueform/vueform'
import vueformConfig from './vueform.config'
import '@vueform/vueform/dist/vueform.css'

const app = createApp(App)
app.use(Vueform, vueformConfig)
app.use(createPinia())
app.use(router)
app.mount('#app')
