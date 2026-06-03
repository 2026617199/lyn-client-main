import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useUserStore } from './stores/user'

// 创建Vue应用
const app = createApp(App)

// 使用Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 在应用启动时初始化用户会话
const initApp = async () => {
  const userStore = useUserStore()

  // 尝试恢复已有会话的用户信息
  if (userStore.sessionId) {
    try {
      await userStore.initSession()
    } catch (error) {
      console.warn('Failed to restore session on app startup:', error)
      // 如果会话恢复失败，清除无效的sessionId
      userStore.clearSession()
    }
  }

  // 挂载应用
  app.mount('#app')
}

// 启动应用
initApp()
