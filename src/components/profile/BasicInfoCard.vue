<template>
  <div class="basic-info-card">
    <div class="card-header">
      <h3 class="card-title">
        <span class="icon">👤</span>
        基本信息
      </h3>
      <span v-if="userStore.isRegisteredUser" class="badge registered">注册用户</span>
      <span v-else class="badge anonymous">匿名用户</span>
    </div>

    <div class="card-content">
      <div class="info-row">
        <label class="label">用户名</label>
        <span class="value">{{ userStore.username }}</span>
      </div>

      <div class="info-row">
        <label class="label">账号类型</label>
        <span class="value">{{ userTypeText }}</span>
      </div>

      <div v-if="userStore.isRegisteredUser" class="info-row">
        <label class="label">登录次数</label>
        <span class="value">{{ userInfo?.loginCount || 0 }} 次</span>
      </div>

      <div class="info-row">
        <label class="label">账号时长</label>
        <span class="value">{{ accountDuration }}</span>
      </div>

      <div v-if="userInfo?.lastLoginAt" class="info-row">
        <label class="label">最后登录</label>
        <span class="value">{{ formatDate(userInfo.lastLoginAt) }}</span>
      </div>

      <div class="info-row">
        <label class="label">最后活跃</label>
        <span class="value">{{ formatDate(userInfo?.lastActiveAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

const userTypeText = computed(() => {
  if (!userInfo.value) return '未知'
  const typeMap = {
    anonymous: '匿名用户',
    registered: '注册用户',
    admin: '管理员'
  }
  return typeMap[userInfo.value.userType] || '未知'
})

const accountDuration = computed(() => {
  if (!userInfo.value?.createdAt) return '未知'
  const created = new Date(userInfo.value.createdAt)
  const now = new Date()
  const diffMs = now - created
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天创建'
  if (diffDays === 1) return '昨天创建'
  if (diffDays < 7) return `${diffDays} 天`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月`
  return `${Math.floor(diffDays / 365)} 年`
})

const formatDate = date => {
  if (!date) return '未知'
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} 小时前`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} 天前`

  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.basic-info-card {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(139, 69, 19, 0.08);
  transition: all 0.3s ease;
}

.basic-info-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(139, 69, 19, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #5a3a22;
  margin: 0;
}

.card-title .icon {
  font-size: 24px;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.badge.registered {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.badge.anonymous {
  background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
  color: white;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(139, 69, 19, 0.04);
  border-radius: 10px;
  transition: background 0.2s ease;
}

.info-row:hover {
  background: rgba(139, 69, 19, 0.08);
}

.label {
  font-size: 14px;
  color: #8b6f47;
  font-weight: 500;
}

.value {
  font-size: 15px;
  color: #5a3a22;
  font-weight: 500;
}
</style>
