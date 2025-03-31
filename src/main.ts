import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Layui from '@layui/layui-vue'
import App from './App.vue'
import router from './router'
import '@layui/layui-vue/lib/index.css'
import './assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Layui)

app.mount('#app')

declare global {
  interface Window {
    layui: any
  }
}

window.onload = () => {
  if (window.layui) {
    window.layui.use(['element', 'layer', 'form'], () => {
      console.log('Layui 初始化成功')
    })
  }
} 