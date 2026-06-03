<template>
  <div class="preference-settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">
            <span class="title-icon">⚙️</span>
            偏好设置
          </h1>
          <p class="page-subtitle">个性化您的饮食偏好，获得更精准的膳食推荐</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" @click="handleReset" :disabled="loading">
            <span class="btn-icon">🔄</span>
            重置默认
          </button>
          <button class="btn btn-primary" @click="handleSave" :disabled="loading || !hasChanges">
            <span class="btn-icon" v-if="!loading">💾</span>
            <LoadingSpinner v-else size="sm" />
            {{ loading ? '保存中...' : '保存设置' }}
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- 加载状态 -->
      <div v-if="loading && !hasLoaded" class="loading-container">
        <LoadingSpinner size="lg" />
        <p class="loading-text">正在加载偏好设置...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <h3 class="error-title">加载失败</h3>
          <p class="error-message">{{ error }}</p>
          <button class="btn btn-primary" @click="retryLoad">
            <span class="btn-icon">🔄</span>
            重试
          </button>
        </div>
      </div>

      <!-- 主要内容 -->
      <div v-else class="preference-grid">
        <!-- 五味偏好 -->
        <div class="preference-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">👅</span>
              五味偏好
            </h2>
            <p class="card-description">调节您对酸、甜、苦、辣、咸的喜好程度</p>
          </div>
          <div class="card-content">
            <div class="flavor-sliders">
              <div
                v-for="(flavor, key) in flavorPreferences"
                :key="key"
                class="flavor-slider"
                :data-flavor="key"
              >
                <div class="slider-header">
                  <span class="flavor-label">
                    <span class="flavor-icon" :style="{ color: flavor.color }">
                      {{ flavor.icon }}
                    </span>
                    {{ flavor.name }}
                  </span>
                  <span class="flavor-value">{{ preference.flavorPreference[key] }}%</span>
                  <span class="flavor-emoji">
                    {{ getFlavorEmoji(preference.flavorPreference[key]) }}
                  </span>
                </div>
                <div
                  class="slider-container"
                  :style="{
                    background: `linear-gradient(to right, ${flavor.color} 0%, ${flavor.color} ${preference.flavorPreference[key]}%, #E5DFD4 ${preference.flavorPreference[key]}%, #E5DFD4 100%)`
                  }"
                >
                  <input
                    type="range"
                    :id="`flavor-${key}`"
                    class="flavor-input"
                    v-model="preference.flavorPreference[key]"
                    min="0"
                    max="100"
                    @input="handleFlavorChange(key, $event.target.value)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 饮食禁忌 -->
        <div class="preference-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">🚫</span>
              饮食禁忌
            </h2>
            <p class="card-description">选择您的饮食限制和禁忌</p>
          </div>
          <div class="card-content">
            <div class="option-grid">
              <div
                v-for="option in restrictionOptions"
                :key="option.value"
                class="option-card"
                :class="{ active: preference.dietaryRestrictions.includes(option.value) }"
                @click="toggleRestriction(option.value)"
              >
                <span class="option-icon">{{ option.icon }}</span>
                <span class="option-label">{{ option.label }}</span>
                <div class="option-check">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前身体状况 -->
        <div class="preference-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">🏥</span>
              当前身体状况
            </h2>
            <p class="card-description">特殊时期的饮食需求（可多选）</p>
          </div>
          <div class="card-content">
            <div class="option-grid">
              <div
                v-for="option in conditionOptions"
                :key="option.value"
                class="option-card"
                :class="{ active: preference.currentConditions.includes(option.value) }"
                @click="toggleCondition(option.value)"
              >
                <span class="option-icon">{{ option.icon }}</span>
                <span class="option-label">{{ option.label }}</span>
                <div class="option-check">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 用餐场景偏好 -->
        <div class="preference-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">🍽️</span>
              用餐场景
            </h2>
            <p class="card-description">您常遇到的用餐场景（可多选）</p>
          </div>
          <div class="card-content">
            <div class="option-grid">
              <div
                v-for="option in scenarioOptions"
                :key="option.value"
                class="option-card"
                :class="{ active: preference.mealScenarios.includes(option.value) }"
                @click="toggleScenario(option.value)"
              >
                <span class="option-icon">{{ option.icon }}</span>
                <span class="option-label">{{ option.label }}</span>
                <div class="option-check">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 烹饪偏好 -->
        <div class="preference-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">👨‍🍳</span>
              烹饪偏好
            </h2>
            <p class="card-description">设置烹饪难度和时间限制</p>
          </div>
          <div class="card-content">
            <div class="cooking-settings">
              <div class="setting-group">
                <label class="setting-label">烹饪难度</label>
                <div class="difficulty-selector">
                  <div
                    v-for="level in 5"
                    :key="level"
                    class="difficulty-level"
                    :class="{ active: preference.cookingDifficulty >= level }"
                    @click="setDifficulty(level)"
                  >
                    {{ level }}
                  </div>
                </div>
                <div class="difficulty-text">
                  {{ getDifficultyText(preference.cookingDifficulty) }}
                </div>
              </div>

              <div class="setting-group">
                <label class="setting-label">最大烹饪时间</label>
                <div class="time-selector">
                  <input
                    type="range"
                    v-model="preference.maxCookingTime"
                    min="15"
                    max="180"
                    step="15"
                    class="time-slider"
                  />
                  <div class="time-display">{{ preference.maxCookingTime }} 分钟</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 过敏原管理 -->
        <div class="preference-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">⚠️</span>
              过敏原
            </h2>
            <p class="card-description">添加您过敏的食材，系统将自动避免推荐</p>
          </div>
          <div class="card-content">
            <div class="allergy-manager">
              <div class="allergy-input">
                <input
                  type="text"
                  v-model="newAllergy"
                  placeholder="输入过敏原名称..."
                  @keypress.enter="addAllergy"
                  class="input-field"
                />
                <button
                  class="btn btn-sm btn-primary"
                  @click="addAllergy"
                  :disabled="!newAllergy.trim()"
                >
                  添加
                </button>
              </div>
              <div class="allergy-list" v-if="preference.allergies.length > 0">
                <div
                  v-for="(allergy, index) in preference.allergies"
                  :key="index"
                  class="allergy-tag"
                >
                  <span class="tag-text">{{ allergy }}</span>
                  <button class="tag-remove" @click="removeAllergy(allergy)">✕</button>
                </div>
              </div>
              <div class="empty-state" v-else>
                <span class="empty-icon">🌿</span>
                <span class="empty-text">暂无过敏原记录</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 不喜欢的食材 -->
        <div class="preference-card">
          <div class="card-header">
            <h2 class="card-title">
              <span class="card-icon">😕</span>
              不喜欢的食材
            </h2>
            <p class="card-description">添加您不喜欢的食材，推荐时将尽量避开</p>
          </div>
          <div class="card-content">
            <div class="disliked-manager">
              <div class="disliked-input">
                <input
                  type="text"
                  v-model="newDisliked"
                  placeholder="输入不喜欢的食材名称..."
                  @keypress.enter="addDisliked"
                  class="input-field"
                />
                <button
                  class="btn btn-sm btn-primary"
                  @click="addDisliked"
                  :disabled="!newDisliked.trim()"
                >
                  添加
                </button>
              </div>
              <div class="disliked-list" v-if="preference.dislikedIngredients.length > 0">
                <div
                  v-for="(ingredient, index) in preference.dislikedIngredients"
                  :key="index"
                  class="disliked-tag"
                >
                  <span class="tag-text">{{ ingredient }}</span>
                  <button class="tag-remove" @click="removeDisliked(ingredient)">✕</button>
                </div>
              </div>
              <div class="empty-state" v-else>
                <span class="empty-icon">🥬</span>
                <span class="empty-text">暂无不喜欢的食材</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-actions">
          <button class="btn btn-primary bottom-save-btn" @click="handleSave" :disabled="loading || !hasChanges">
            <span class="btn-icon" v-if="!loading">💾</span>
            <LoadingSpinner v-else size="sm" />
            {{ loading ? '保存中...' : '保存设置' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePreferenceStore } from '../stores/preference'
import { useToast } from '../utils/toast'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

// 获取偏好 store 和 toast
const preferenceStore = usePreferenceStore()
const toast = useToast()

// 响应式数据
const loading = ref(false)
const newAllergy = ref('')
const newDisliked = ref('')

// 原始偏好数据（用于检测变化）
const originalPreference = ref({})

// Store 的加载和错误状态
const storeLoading = computed(() => preferenceStore.loading)
const storeError = computed(() => preferenceStore.error)
const hasLoaded = computed(() => preferenceStore.hasLoaded)

// 当前偏好数据
const preference = computed({
  get: () => preferenceStore.preference,
  set: value => (preferenceStore.preference = value)
})

// 五味偏好数据
const flavorPreferences = computed(() => preferenceStore.flavorLabels)

// 选项数据
const restrictionOptions = computed(() => preferenceStore.restrictionOptions)
const conditionOptions = computed(() => preferenceStore.conditionOptions)
const scenarioOptions = computed(() => preferenceStore.scenarioOptions)

// 检查是否有变化
const hasChanges = computed(() => {
  return JSON.stringify(preference.value) !== JSON.stringify(originalPreference.value)
})

// 获取五味表情
const getFlavorEmoji = value => {
  if (value < 20) return '😖'
  if (value < 40) return '😕'
  if (value < 60) return '😐'
  if (value < 80) return '😊'
  return '😍'
}

// 获取难度文本
const getDifficultyText = level => {
  const texts = ['非常简单', '简单', '适中', '困难', '非常困难']
  return texts[level - 1] || '适中'
}

// 处理五味变化
const handleFlavorChange = (flavor, value) => {
  preferenceStore.setLocalFlavorPreference(flavor, parseInt(value))
}

// 切换饮食禁忌
const toggleRestriction = async restriction => {
  const restrictions = [...preference.value.dietaryRestrictions]
  const index = restrictions.indexOf(restriction)
  if (index > -1) {
    restrictions.splice(index, 1)
  } else {
    restrictions.push(restriction)
  }
  preference.value.dietaryRestrictions = restrictions
}

// 切换身体状况
const toggleCondition = async condition => {
  const conditions = [...preference.value.currentConditions]
  const index = conditions.indexOf(condition)
  if (index > -1) {
    conditions.splice(index, 1)
  } else {
    conditions.push(condition)
  }
  preference.value.currentConditions = conditions
}

// 切换用餐场景
const toggleScenario = async scenario => {
  const scenarios = [...preference.value.mealScenarios]
  const index = scenarios.indexOf(scenario)
  if (index > -1) {
    scenarios.splice(index, 1)
  } else {
    scenarios.push(scenario)
  }
  preference.value.mealScenarios = scenarios
}

// 设置烹饪难度
const setDifficulty = level => {
  preference.value.cookingDifficulty = level
}

// 添加过敏原
const addAllergy = async () => {
  const allergy = newAllergy.value.trim()
  if (!allergy) return

  if (!preference.value.allergies.includes(allergy)) {
    preference.value.allergies.push(allergy)
    newAllergy.value = ''
    toast.success(`已添加过敏原：${allergy}`)
  } else {
    toast.warning('该过敏原已存在')
  }
}

// 移除过敏原
const removeAllergy = allergy => {
  const index = preference.value.allergies.indexOf(allergy)
  if (index > -1) {
    preference.value.allergies.splice(index, 1)
    toast.info(`已移除过敏原：${allergy}`)
  }
}

// 添加不喜欢的食材
const addDisliked = async () => {
  const ingredient = newDisliked.value.trim()
  if (!ingredient) return

  if (!preference.value.dislikedIngredients.includes(ingredient)) {
    preference.value.dislikedIngredients.push(ingredient)
    newDisliked.value = ''
    toast.success(`已添加不喜欢的食材：${ingredient}`)
  } else {
    toast.warning('该食材已存在')
  }
}

// 移除不喜欢的食材
const removeDisliked = ingredient => {
  const index = preference.value.dislikedIngredients.indexOf(ingredient)
  if (index > -1) {
    preference.value.dislikedIngredients.splice(index, 1)
    toast.info(`已移除不喜欢的食材：${ingredient}`)
  }
}

// 保存设置
const handleSave = async () => {
  try {
    loading.value = true
    const success = await preferenceStore.updatePreference(preference.value)

    if (success) {
      originalPreference.value = JSON.parse(JSON.stringify(preference.value))
      toast.success('偏好设置已保存')
    } else {
      toast.error('保存失败，请重试')
    }
  } catch (error) {
    console.error('Save preference error:', error)
    toast.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

// 重置设置
const handleReset = async () => {
  try {
    loading.value = true
    const success = await preferenceStore.resetPreference()

    if (success) {
      originalPreference.value = JSON.parse(JSON.stringify(preference.value))
      toast.success('已重置为默认设置')
    } else {
      toast.error('重置失败，请重试')
    }
  } catch (error) {
    console.error('Reset preference error:', error)
    toast.error('重置失败，请重试')
  } finally {
    loading.value = false
  }
}

// 重试加载
const retryLoad = async () => {
  await preferenceStore.fetchPreference()
  originalPreference.value = JSON.parse(JSON.stringify(preference.value))
}

// 错误状态
const error = computed(() => storeError.value)

// 页面加载时获取偏好
onMounted(async () => {
  try {
    await preferenceStore.fetchPreference()
    originalPreference.value = JSON.parse(JSON.stringify(preference.value))
  } catch (error) {
    console.error('Load preference error:', error)
    toast.error('加载偏好设置失败')
  }
})

// 监听页面离开事件
window.addEventListener('beforeunload', event => {
  if (hasChanges.value) {
    event.preventDefault()
    event.returnValue = '您有未保存的更改，确定要离开吗？'
  }
})
</script>

<style scoped>
.preference-settings {
  min-height: calc(100vh - var(--header-height));
  background: var(--color-bg-primary);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  border-bottom: 1px solid var(--color-border-light);
  padding: var(--spacing-2xl) 0 var(--spacing-xl);
}

.header-content {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-family: var(--font-serif);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.title-icon {
  font-size: var(--text-3xl);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn-icon {
  margin-right: var(--spacing-xs);
}

/* 容器 */
.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* 偏好网格 */
.preference-grid {
  display: grid;
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl) 0;
}

.bottom-actions {
  display: flex;
  justify-content: center;
  padding: var(--spacing-sm) 0 var(--spacing-2xl);
}

.bottom-save-btn {
  min-width: 180px;
  justify-content: center;
}

/* 偏好卡片 */
.preference-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: all var(--transition-base);
}

.preference-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
}

.card-title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.card-icon {
  font-size: var(--text-lg);
}

.card-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

.card-content {
  padding: var(--spacing-xl);
}

/* 五味滑块 */
.flavor-sliders {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.flavor-slider {
  position: relative;
}

/* 动态滑块边框颜色 */
.flavor-slider[data-flavor='sour'] .flavor-input::-webkit-slider-thumb,
.flavor-slider[data-flavor='sour'] .flavor-input::-moz-range-thumb {
  border-color: #ffd700;
}

.flavor-slider[data-flavor='sweet'] .flavor-input::-webkit-slider-thumb,
.flavor-slider[data-flavor='sweet'] .flavor-input::-moz-range-thumb {
  border-color: #ff69b4;
}

.flavor-slider[data-flavor='bitter'] .flavor-input::-webkit-slider-thumb,
.flavor-slider[data-flavor='bitter'] .flavor-input::-moz-range-thumb {
  border-color: #228b22;
}

.flavor-slider[data-flavor='spicy'] .flavor-input::-webkit-slider-thumb,
.flavor-slider[data-flavor='spicy'] .flavor-input::-moz-range-thumb {
  border-color: #ff4500;
}

.flavor-slider[data-flavor='salty'] .flavor-input::-webkit-slider-thumb,
.flavor-slider[data-flavor='salty'] .flavor-input::-moz-range-thumb {
  border-color: #4169e1;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  position: relative;
}

.flavor-emoji {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.flavor-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.flavor-icon {
  font-size: var(--text-lg);
  transition: transform var(--transition-base);
}

.flavor-value {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
}

.slider-container {
  position: relative;
  height: 25px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.flavor-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  z-index: 2;
  position: relative;
}

/* Webkit 浏览器滑块样式 */
.flavor-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-bg-elevated);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  margin-top: -8px; /* 居中对齐 */
}

/* Firefox 滑块样式 */
.flavor-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-bg-elevated);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  border: none;
}

/* 滑块轨道样式 */
.flavor-input::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  background: transparent;
  border-radius: var(--radius-full);
}

.flavor-input::-moz-range-track {
  width: 100%;
  height: 8px;
  background: transparent;
  border-radius: var(--radius-full);
}

.flavor-input:hover::-webkit-slider-thumb {
  transform: scale(1.1);
}

.flavor-input:hover::-moz-range-thumb {
  transform: scale(1.1);
}

.slider-emoji {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--text-2xl);
  transition: transform var(--transition-base);
  pointer-events: none;
}

/* 选项网格 */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md);
}

.option-card {
  position: relative;
  padding: var(--spacing-lg);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;
  background: var(--color-bg-primary);
}

.option-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.option-card.active {
  border-color: var(--color-accent);
  background: var(--color-accent-alpha);
  box-shadow: var(--shadow-md);
}

.option-icon {
  display: block;
  font-size: var(--text-2xl);
  margin-bottom: var(--spacing-sm);
}

.option-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  display: block;
}

.option-check {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  width: 20px;
  height: 20px;
  background: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0);
  transition: all var(--transition-base);
}

.option-card.active .option-check {
  opacity: 1;
  transform: scale(1);
}

.option-check svg {
  width: 12px;
  height: 12px;
  color: white;
}

/* 烹饪设置 */
.cooking-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.setting-label {
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  font-size: var(--text-base);
}

.difficulty-selector {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.difficulty-level {
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: var(--color-bg-primary);
}

.difficulty-level:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.difficulty-level.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.difficulty-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-left: var(--spacing-md);
}

.time-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.time-slider {
  flex: 1;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-bg-tertiary);
  outline: none;
  -webkit-appearance: none;
}

.time-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  cursor: pointer;
  box-shadow: var(--shadow-md);
}

.time-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  border: none;
}

.time-display {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  min-width: 100px;
  text-align: center;
}

/* 过敏原和不喜欢的食材管理 */
.allergy-manager,
.disliked-manager {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.allergy-input,
.disliked-input {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.input-field {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all var(--transition-base);
  background: var(--color-bg-primary);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-alpha);
}

.allergy-list,
.disliked-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.allergy-tag,
.disliked-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-warning-alpha);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

.tag-text {
  font-weight: var(--font-medium);
}

.tag-remove {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--text-sm);
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.tag-remove:hover {
  background: var(--color-warning);
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-2xl);
  color: var(--color-text-tertiary);
  text-align: center;
}

.empty-icon {
  font-size: var(--text-3xl);
  opacity: 0.5;
}

.empty-text {
  font-size: var(--text-sm);
}

/* 加载和错误状态 */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl);
  text-align: center;
  min-height: 400px;
}

.loading-text {
  margin-top: var(--spacing-lg);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}

.error-content {
  background: var(--color-bg-elevated);
  border: 2px solid var(--color-error);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
  max-width: 400px;
}

.error-icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-lg);
  display: block;
}

.error-title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md);
}

.error-message {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xl);
  line-height: var(--leading-relaxed);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-md);
  }

  .page-header {
    padding: var(--spacing-xl) 0 var(--spacing-lg);
  }

  .page-title {
    font-size: var(--text-2xl);
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .bottom-save-btn {
    width: 100%;
  }

  .option-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--spacing-sm);
  }

  .option-card {
    padding: var(--spacing-md);
  }

  .time-selector {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .time-display {
    text-align: center;
  }

  .allergy-input,
  .disliked-input {
    flex-direction: column;
    align-items: stretch;
  }

  .card-header,
  .card-content {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .option-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .difficulty-selector {
    justify-content: center;
  }
}
</style>
