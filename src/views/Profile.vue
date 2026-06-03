<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">📋</span>
        个人信息
      </h1>
      <p class="page-subtitle">查看和管理您的个人资料、体质信息和饮食偏好</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载个人信息...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="fetchData">
        <span>重试</span>
      </button>
    </div>

    <div v-else class="cards-container">
      <!-- 第一行：基本信息和体质信息 -->
      <div class="cards-row">
        <BasicInfoCard class="card-item" />
        <ConstitutionInfoCard class="card-item" />
      </div>

      <!-- 第二行：偏好设置 -->
      <div class="cards-row">
        <PreferenceSummaryCard class="card-item full-width" />
      </div>

      <!-- 操作区域 -->
      <div class="actions-section">
        <h3 class="actions-title">
          <span class="title-icon">⚡</span>
          快捷操作
        </h3>
        <div class="actions-grid">
          <button v-if="userStore.isRegisteredUser" class="action-btn" @click="goToPreferences">
            <span class="btn-icon">🎯</span>
            <span class="btn-text">编辑偏好</span>
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            v-if="!userStore.hasConstitution"
            class="action-btn primary"
            @click="goToDiagnosis"
          >
            <span class="btn-icon">🧘</span>
            <span class="btn-text">体质诊断</span>
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button v-if="userStore.hasConstitution" class="action-btn" @click="goToDiagnosis">
            <span class="btn-icon">🔄</span>
            <span class="btn-text">重新诊断</span>
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button class="action-btn recommend" @click="goToRecommendation">
            <span class="btn-icon">🍽️</span>
            <span class="btn-text">获取推荐</span>
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button v-if="userStore.isRegisteredUser" class="action-btn danger" @click="handleLogout">
            <span class="btn-icon">🚪</span>
            <span class="btn-text">退出登录</span>
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 提示信息 -->
      <div v-if="!userStore.hasConstitution || !preferenceStore.hasPreference" class="tips-section">
        <h3 class="tips-title">
          <span class="title-icon">💡</span>
          温馨提示
        </h3>
        <ul class="tips-list">
          <li v-if="!userStore.hasConstitution" class="tip-item">
            <span class="tip-icon">🧘</span>
            <span>完成体质诊断可以帮助我们根据您的体质特点推荐更合适的膳食</span>
          </li>
          <li v-if="!preferenceStore.hasPreference" class="tip-item">
            <span class="tip-icon">🍳</span>
            <span>设置饮食偏好可以让推荐更符合您的口味和需求</span>
          </li>
          <li class="tip-item">
            <span class="tip-icon">📊</span>
            <span>所有数据都经过加密保护，您可以随时修改或删除</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePreferenceStore } from '@/stores/preference'
import { useToast } from '@/utils/toast'
import BasicInfoCard from '@/components/profile/BasicInfoCard.vue'
import ConstitutionInfoCard from '@/components/profile/ConstitutionInfoCard.vue'
import PreferenceSummaryCard from '@/components/profile/PreferenceSummaryCard.vue'

const router = useRouter()
const userStore = useUserStore()
const preferenceStore = usePreferenceStore()
const toast = useToast()

const loading = ref(true)
const error = ref(null)

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    // 获取用户信息（如果已登录）
    if (userStore.sessionId) {
      await userStore.fetchUserInfo()
    }

    // 如果有体质，获取体质详情
    if (userStore.constitution?.type && !userStore.constitutionInfo) {
      await userStore.fetchConstitutionInfo(userStore.constitution.type)
    }

    // 获取用户偏好
    await preferenceStore.fetchPreference()
  } catch (err) {
    console.error('Failed to fetch profile data:', err)
    error.value = err.message || '加载个人信息失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const goToPreferences = () => {
  router.push('/preference-settings')
}

const goToDiagnosis = () => {
  router.push('/constitution-diagnosis')
}

const goToRecommendation = () => {
  router.push('/recipe-recommendation')
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    toast.success('已退出登录')
    router.push('/home')
  } catch (err) {
    console.error('Failed to logout:', err)
    toast.error('退出登录失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.profile-page {
  padding: var(--spacing-3xl) 0;
  min-height: calc(100vh - var(--header-height));
  background: linear-gradient(135deg, #faf5f0 0%, #fff9f0 50%, #ffffff 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #5a3a22;
  margin: 0 0 12px 0;
}

.title-icon {
  font-size: 36px;
}

.page-subtitle {
  font-size: 16px;
  color: #8b6f47;
  margin: 0;
  line-height: 1.6;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 24px;
  border: 4px solid rgba(139, 69, 19, 0.1);
  border-top-color: #8b6f47;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p,
.error-message {
  font-size: 16px;
  color: #8b6f47;
  margin: 0;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.retry-btn {
  margin-top: 24px;
  padding: 12px 32px;
  background: linear-gradient(135deg, #8b6f47 0%, #6b5b45 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 111, 71, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 111, 71, 0.4);
}

.cards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card-item {
  animation: slideInUp 0.6s ease;
}

.card-item:nth-child(1) {
  animation-delay: 0.1s;
}

.card-item:nth-child(2) {
  animation-delay: 0.2s;
}

.full-width {
  grid-column: 1 / -1;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.actions-section {
  padding: 24px;
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(139, 69, 19, 0.08);
  animation: slideInUp 0.6s ease 0.3s backwards;
}

.actions-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #5a3a22;
  margin: 0 0 20px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  color: #5a3a22;
  border: 2px solid rgba(139, 69, 19, 0.15);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: #8b6f47;
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
}

.action-btn.primary {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border-color: #4caf50;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.action-btn.recommend {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border-color: #ff9800;
}

.action-btn.recommend:hover {
  background: linear-gradient(135deg, #ffb74d 0%, #ef6c00 100%);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.3);
}

.action-btn.danger {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  border-color: #f44336;
}

.action-btn.danger:hover {
  background: linear-gradient(135deg, #ef5350 0%, #c62828 100%);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.3);
}

.action-btn .btn-icon {
  font-size: 24px;
}

.action-btn .btn-text {
  flex: 1;
  text-align: left;
}

.action-btn .btn-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  color: inherit;
}

.action-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.tips-section {
  padding: 24px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 16px;
  border: 2px solid rgba(255, 193, 7, 0.3);
  animation: slideInUp 0.6s ease 0.4s backwards;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #5a3a22;
  margin: 0 0 16px 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: #6b5b45;
  line-height: 1.6;
}

.tip-icon {
  font-size: 20px;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .cards-row {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: 1;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .profile-page {
    padding: var(--spacing-2xl) 0;
  }

  .page-title {
    font-size: 24px;
  }

  .title-icon {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .cards-container {
    padding: 0 16px;
    gap: 24px;
  }

  .action-btn {
    padding: 14px 16px;
  }

  .action-btn .btn-text {
    font-size: 14px;
  }
}
</style>
