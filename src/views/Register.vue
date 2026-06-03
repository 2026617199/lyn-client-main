<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card card animate-scale-in">
        <div class="auth-header">
          <h1 class="auth-title">创建账号</h1>
          <p class="auth-subtitle">开启您的养生之旅</p>
        </div>

        <form class="auth-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input
              v-model="formData.username"
              type="text"
              class="input"
              placeholder="3-20位字母数字下划线"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <input
              v-model="formData.password"
              type="password"
              class="input"
              placeholder="至少6位字符"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">确认密码</label>
            <input
              v-model="formData.confirmPassword"
              type="password"
              class="input"
              placeholder="再次输入密码"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>

        <div class="auth-footer">
          <p class="text-secondary">
            已有账号？
            <router-link to="/login" class="text-primary font-medium">
              立即登录
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/utils/toast'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const loading = ref(false)
const formData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    toast.error('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await userStore.register({
      username: formData.value.username,
      password: formData.value.password
    })
    toast.success('注册成功')
    router.push('/ai-diagnosis')
  } catch (error) {
    toast.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-mesh);
  padding: var(--spacing-xl);
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  padding: var(--spacing-3xl);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.auth-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.auth-form .btn {
  width: 100%;
  margin-top: var(--spacing-md);
}

.auth-footer {
  margin-top: var(--spacing-xl);
  text-align: center;
}
</style>
