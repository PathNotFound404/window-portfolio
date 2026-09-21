import '98.css'
import './styles/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { site } from './config/site'

document.title = site.title

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
