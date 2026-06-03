<template>
  <div class="ai-recommend-panel">
    <div class="panel-header">
      <div class="panel-icon">
        <span class="ai-icon">🤖</span>
      </div>
      <div class="panel-title">
        <h3>AI 智能推荐配置</h3>
        <p>根据您的体质和偏好，为您量身定制健康菜谱</p>
      </div>
    </div>

    <div class="preference-note">
      本页填写内容只用于本次推荐，不会覆盖偏好设置；过敏原和饮食禁忌仍会优先生效。
    </div>

    <div class="panel-content">
      <!-- 用餐类型选择 -->
      <div class="form-group">
        <label class="form-label">
          <span class="label-icon">🍽️</span>
          用餐类型
        </label>
        <div class="meal-type-selector">
          <button
            v-for="meal in mealTypes"
            :key="meal.value"
            class="meal-type-btn"
            :class="{ 'is-active': form.mealType === meal.value }"
            @click="form.mealType = meal.value"
          >
            <span class="meal-emoji">{{ meal.emoji }}</span>
            <span class="meal-name">{{ meal.label }}</span>
          </button>
        </div>
      </div>

      <!-- 推荐数量 -->
      <div class="form-group">
        <label class="form-label">
          <span class="label-icon">📊</span>
          推荐数量
        </label>
        <div class="count-selector">
          <input v-model.number="form.count" type="range" min="1" max="12" class="count-slider" />
          <div class="count-display">
            <span class="count-value">{{ form.count }}</span>
            <span class="count-unit">道菜</span>
          </div>
        </div>
      </div>

      <!-- 排除食材 -->
      <div class="form-group">
        <label class="form-label">
          <span class="label-icon">🚫</span>
          排除食材
        </label>
        <div class="ingredient-input">
          <div class="ingredient-tags">
            <span
              v-for="(ingredient, index) in form.excludeIngredients"
              :key="index"
              class="ingredient-tag"
            >
              {{ ingredient }}
              <button class="remove-btn" @click="removeIngredient(index)">×</button>
            </span>
          </div>
          <input
            v-model="form.ingredientInput"
            type="text"
            class="ingredient-field"
            placeholder="输入本次不想要的食材，按回车添加"
            @keyup.enter="addIngredient"
            @keyup.188="addIngredient"
          />
        </div>
      </div>

      <!-- 特殊要求 -->
      <div class="form-group">
        <label class="form-label">
          <span class="label-icon">💭</span>
          特殊要求
        </label>
        <textarea
          v-model="form.specialRequirements"
          class="requirements-textarea"
          placeholder="比如：希望菜谱清淡易消化，适合晚餐食用，不要过于油腻。请勿填写与过敏原或饮食禁忌冲突的要求。"
          rows="3"
        ></textarea>
      </div>
    </div>

    <div class="panel-actions">
      <button class="reset-btn" @click="resetForm">重置配置</button>
      <button class="recommend-btn" :disabled="isRecommending" @click="handleRecommend">
        <span v-if="!isRecommending" class="btn-content">
          <span class="btn-icon">🎯</span>
          开始推荐
        </span>
        <span v-else class="btn-content is-loading">
          <LoadingSpinner size="sm" />
          AI思考中...
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useToast } from '@/utils/toast'
import { useRecipeStore } from '@/stores/recipe'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  isRecommending: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['recommend'])

const toast = useToast()
const recipeStore = useRecipeStore()

// 用餐类型选项
const mealTypes = [
  { value: 'breakfast', label: '早餐', emoji: '🌅' },
  { value: 'lunch', label: '午餐', emoji: '☀️' },
  { value: 'dinner', label: '晚餐', emoji: '🌙' },
  { value: 'snack', label: '加餐', emoji: '🍎' }
]

// 表单数据
const form = reactive({
  mealType: recipeStore.aiRecommendForm.mealType,
  count: recipeStore.aiRecommendForm.count,
  excludeIngredients: [...recipeStore.aiRecommendForm.excludeIngredients],
  ingredientInput: recipeStore.aiRecommendForm.ingredientInput,
  specialRequirements: recipeStore.aiRecommendForm.specialRequirements
})

watch(
  form,
  value => {
    recipeStore.updateAiRecommendForm({
      mealType: value.mealType,
      count: value.count,
      excludeIngredients: value.excludeIngredients,
      ingredientInput: value.ingredientInput,
      specialRequirements: value.specialRequirements
    })
  },
  { deep: true }
)

// 添加排除食材
const addIngredient = () => {
  const ingredient = form.ingredientInput.trim()
  if (ingredient && !form.excludeIngredients.includes(ingredient)) {
    form.excludeIngredients.push(ingredient)
    form.ingredientInput = ''
  }
}

// 移除排除食材
const removeIngredient = index => {
  form.excludeIngredients.splice(index, 1)
}

// 重置表单
const resetForm = () => {
  recipeStore.resetAiRecommendForm()
  Object.assign(form, {
    mealType: recipeStore.aiRecommendForm.mealType,
    count: recipeStore.aiRecommendForm.count,
    excludeIngredients: [...recipeStore.aiRecommendForm.excludeIngredients],
    ingredientInput: recipeStore.aiRecommendForm.ingredientInput,
    specialRequirements: recipeStore.aiRecommendForm.specialRequirements
  })

  toast.info('配置已重置')
}

// 处理推荐
const handleRecommend = async () => {
  if (props.isRecommending) return

  try {
    addIngredient()

    // 构建推荐参数
    const recommendParams = {
      mealType: form.mealType,
      count: form.count,
      excludeIngredients: [...form.excludeIngredients],
      specialRequirements: form.specialRequirements.trim()
    }

    // 触发推荐事件
    await emit('recommend', recommendParams)
  } catch (error) {
    console.error('推荐失败:', error)
    toast.error('推荐失败，请重试')
  }
}
</script>

<style scoped>
.ai-recommend-panel {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-light);
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.ai-recommend-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-accent);
}

.preference-note {
  margin: calc(var(--spacing-md) * -1) 0 var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.panel-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  background: var(--gradient-accent);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.ai-icon {
  font-size: 2rem;
  filter: brightness(1.2);
}

.panel-title h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.panel-title p {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* 面板内容 */
.panel-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

.label-icon {
  font-size: var(--text-base);
}

/* 用餐类型选择 */
.meal-type-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-sm);
}

.meal-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-sm);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.meal-type-btn:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.meal-type-btn.is-active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.meal-emoji {
  font-size: var(--text-xl);
}

.meal-name {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 推荐数量选择 */
.count-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.count-slider {
  flex: 1;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  outline: none;
  -webkit-appearance: none;
}

.count-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-accent);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.count-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.count-display {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  min-width: 60px;
  text-align: center;
}

.count-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-accent);
}

.count-unit {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* 排除食材输入 */
.ingredient-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  min-height: 32px;
}

.ingredient-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  font-size: var(--text-base);
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-base);
}

.remove-btn:hover {
  background: var(--color-error);
  color: white;
}

.ingredient-field {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  background: var(--color-bg-secondary);
  transition: all var(--transition-base);
}

.ingredient-field:focus {
  outline: none;
  border-color: var(--color-accent);
  background: var(--color-bg-elevated);
}

/* 特殊要求输入 */
.requirements-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  background: var(--color-bg-secondary);
  resize: vertical;
  min-height: 80px;
  transition: all var(--transition-base);
}

.requirements-textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  background: var(--color-bg-elevated);
}

/* 面板操作 */
.panel-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.reset-btn {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.reset-btn:hover {
  border-color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
}

.recommend-btn {
  flex: 2;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-accent);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  color: white;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.recommend-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.recommend-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.btn-icon {
  font-size: var(--text-base);
}

.btn-content.is-loading {
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-recommend-panel {
    padding: var(--spacing-lg);
  }

  .panel-header {
    gap: var(--spacing-md);
  }

  .panel-icon {
    width: 48px;
    height: 48px;
  }

  .ai-icon {
    font-size: 1.5rem;
  }

  .meal-type-selector {
    grid-template-columns: repeat(2, 1fr);
  }

  .count-selector {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .panel-actions {
    flex-direction: column;
  }
}
</style>
