import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 添加全局加载指示器
const app = createApp(App)
app.directive('loading', {
  mounted(el, binding) {
    el.innerHTML = `
      <div class="global-loading">
        <div class="spinner"></div>
        <p>${binding.value || '加载中...'}</p>
      </div>
    `
  }
})

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')