<template>
  <div class="constitution-card">
    <div class="card-header">
      <h3 class="card-title">
        <span class="icon">🌿</span>
        体质信息
      </h3>
      <span v-if="userStore.hasConstitution" class="badge diagnosed">已诊断</span>
      <span v-else class="badge undiagnosed">未诊断</span>
    </div>

    <!-- 未诊断状态 -->
    <div v-if="!userStore.hasConstitution" class="empty-state">
      <div class="empty-icon">🧘</div>
      <p class="empty-text">您还没有进行体质诊断</p>
      <p class="empty-hint">了解您的体质有助于我们为您提供更精准的膳食建议</p>
      <button class="diagnose-btn" @click="goToDiagnosis">
        <span>立即诊断</span>
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- 已诊断状态 -->
    <div v-else class="card-content">
      <div class="constitution-header">
        <div class="constitution-type" :class="constitutionClass">
          <span class="type-icon">{{ constitutionIcon }}</span>
          <span class="type-name">{{ constitutionName }}</span>
        </div>
        <div class="diagnosis-info">
          <div class="diagnosis-item">
            <span class="label">诊断方式</span>
            <span class="value">{{ diagnosisMethodText }}</span>
          </div>
          <div class="diagnosis-item">
            <span class="label">诊断时间</span>
            <span class="value">{{ formatDate(userStore.constitution.diagnosedAt) }}</span>
          </div>
        </div>
      </div>

      <div v-if="userStore.constitutionInfo" class="constitution-details">
        <div class="section">
          <h4 class="section-title">
            <span class="section-icon">📝</span>
            体质描述
          </h4>
          <p class="description">{{ userStore.constitutionInfo.description }}</p>
        </div>

        <div class="section">
          <h4 class="section-title">
            <span class="section-icon">✨</span>
            主要特征
          </h4>
          <div class="characteristics-list">
            <span
              v-for="(char, index) in userStore.constitutionInfo.characteristics"
              :key="index"
              class="characteristic-tag"
            >
              {{ char }}
            </span>
          </div>
        </div>

        <div v-if="userStore.constitutionInfo.dietaryGuidelines" class="section">
          <h4 class="section-title">
            <span class="section-icon">🍲</span>
            饮食指导
          </h4>
          <div class="guidelines-list">
            <p
              v-for="(guide, index) in userStore.constitutionInfo.dietaryGuidelines"
              :key="index"
              class="guideline-item"
            >
              <span class="bullet">•</span>
              {{ guide }}
            </p>
          </div>
        </div>
      </div>

      <button class="re-diagnose-btn" @click="goToDiagnosis">
        <span>重新诊断</span>
        <svg class="refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const constitutionConfig = {
  balanced: {
    name: '平和质',
    icon: '🌱',
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)'
  },
  qi_deficiency: {
    name: '气虚质',
    icon: '🌬️',
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, #ffb74d 0%, #f57c00 100%)'
  },
  yang_deficiency: {
    name: '阳虚质',
    icon: '☀️',
    color: '#ff5722',
    gradient: 'linear-gradient(135deg, #ff8a65 0%, #e64a19 100%)'
  },
  yin_deficiency: {
    name: '阴虚质',
    icon: '🌙',
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #ba68c8 0%, #7b1fa2 100%)'
  },
  phlegm_dampness: {
    name: '痰湿质',
    icon: '💧',
    color: '#03a9f4',
    gradient: 'linear-gradient(135deg, #4fc3f7 0%, #039be5 100%)'
  },
  damp_heat: {
    name: '湿热质',
    icon: '🔥',
    color: '#e91e63',
    gradient: 'linear-gradient(135deg, #f06292 0%, #c2185b 100%)'
  },
  blood_stasis: {
    name: '血瘀质',
    icon: '💜',
    color: '#673ab7',
    gradient: 'linear-gradient(135deg, #9575cd 0%, #512da8 100%)'
  },
  qi_stagnation: {
    name: '气郁质',
    icon: '🌸',
    color: '#ec407a',
    gradient: 'linear-gradient(135deg, #f48fb1 0%, #d81b60 100%)'
  },
  special: {
    name: '特禀质',
    icon: '🌟',
    color: '#ffc107',
    gradient: 'linear-gradient(135deg, #ffca28 0%, #ffa000 100%)'
  }
}

const constitutionName = computed(() => {
  if (!userStore.constitution?.type) return '未知'
  return constitutionConfig[userStore.constitution.type]?.name || '未知'
})

const constitutionIcon = computed(() => {
  if (!userStore.constitution?.type) return '❓'
  return constitutionConfig[userStore.constitution.type]?.icon || '❓'
})

const constitutionClass = computed(() => {
  if (!userStore.constitution?.type) return ''
  return `type-${userStore.constitution.type}`
})

const diagnosisMethodText = computed(() => {
  if (!userStore.constitution?.diagnosisMethod) return '未知'
  const methodMap = {
    manual: '手动诊断',
    ai: 'AI 智能诊断'
  }
  return methodMap[userStore.constitution.diagnosisMethod] || '未知'
})

const formatDate = date => {
  if (!date) return '未知'
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const goToDiagnosis = () => {
  router.push('/constitution-diagnosis')
}
</script>

<style scoped>
.constitution-card {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(139, 69, 19, 0.08);
  transition: all 0.3s ease;
}

.constitution-card:hover {
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

.badge.diagnosed {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.badge.undiagnosed {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-text {
  font-size: 16px;
  color: #5a3a22;
  margin-bottom: 8px;
  font-weight: 500;
}

.empty-hint {
  font-size: 14px;
  color: #8b6f47;
  margin-bottom: 24px;
  line-height: 1.6;
}

.diagnose-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.diagnose-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.diagnose-btn .arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.diagnose-btn:hover .arrow-icon {
  transform: translateX(4px);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.constitution-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.constitution-type {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  background: #f5f5f5;
  font-size: 18px;
  font-weight: 600;
  color: #5a3a22;
  transition: all 0.3s ease;
}

.constitution-type.type-balanced {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
}

.constitution-type.type-qi_deficiency {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #ef6c00;
}

.constitution-type.type-yang_deficiency {
  background: linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%);
  color: #d84315;
}

.constitution-type.type-yin_deficiency {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  color: #7b1fa2;
}

.constitution-type.type-phlegm_dampness {
  background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
  color: #0277bd;
}

.constitution-type.type-damp_heat {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  color: #c2185b;
}

.constitution-type.type-blood_stasis {
  background: linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%);
  color: #512da8;
}

.constitution-type.type-qi_stagnation {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  color: #ad1457;
}

.constitution-type.type-special {
  background: linear-gradient(135deg, #fffde7 0%, #fff9c4 100%);
  color: #f57f17;
}

.type-icon {
  font-size: 28px;
}

.diagnosis-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.diagnosis-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: rgba(139, 69, 19, 0.04);
  border-radius: 10px;
}

.diagnosis-item .label {
  font-size: 12px;
  color: #8b6f47;
}

.diagnosis-item .value {
  font-size: 14px;
  color: #5a3a22;
  font-weight: 500;
}

.constitution-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  padding: 16px;
  background: rgba(139, 69, 19, 0.02);
  border-radius: 12px;
  border-left: 3px solid #8b6f47;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #5a3a22;
  margin: 0 0 12px 0;
}

.section-icon {
  font-size: 18px;
}

.description {
  font-size: 14px;
  color: #6b5b45;
  line-height: 1.7;
  margin: 0;
}

.characteristics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.characteristic-tag {
  padding: 6px 14px;
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border: 1px solid rgba(139, 69, 19, 0.15);
  border-radius: 20px;
  font-size: 13px;
  color: #5a3a22;
  font-weight: 500;
  transition: all 0.2s ease;
}

.characteristic-tag:hover {
  background: rgba(139, 69, 19, 0.08);
  transform: scale(1.05);
}

.guidelines-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.guideline-item {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: #6b5b45;
  line-height: 1.6;
  margin: 0;
}

.guideline-item .bullet {
  color: #8b6f47;
  font-weight: bold;
}

.re-diagnose-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #8b6f47 0%, #6b5b45 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 111, 71, 0.3);
}

.re-diagnose-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 111, 71, 0.4);
  background: linear-gradient(135deg, #9d8158 0%, #7d6b55 100%);
}

.re-diagnose-btn .refresh-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.5s ease;
}

.re-diagnose-btn:hover .refresh-icon {
  transform: rotate(180deg);
}
</style>
