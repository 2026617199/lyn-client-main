<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="recipe-save-modal" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          <span class="title-icon">💾</span>
          保存菜谱
        </h3>
        <button class="close-btn" @click="closeModal">
          <span>×</span>
        </button>
      </div>

      <div class="modal-content">
        <div class="recipe-preview" v-if="recipe">
          <div class="preview-header">
            <h4>{{ recipe.name }}</h4>
            <div class="match-info" v-if="recipe.matchScore">
              <span class="match-score">{{ recipe.matchScore }}%</span>
              <span class="match-label">匹配度</span>
            </div>
          </div>
          <p class="recipe-desc">{{ recipe.description }}</p>

          <div class="recipe-tags" v-if="recipeTags.length">
            <span v-for="tag in recipeTags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="edit-form">
          <!-- 菜谱名称 -->
          <div class="form-group">
            <label class="form-label">菜谱名称 *</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="请输入菜谱名称"
              maxlength="50"
            />
            <div class="input-hint">{{ formData.name.length }}/50</div>
          </div>

          <!-- 菜谱描述 -->
          <div class="form-group">
            <label class="form-label">菜谱描述 *</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              placeholder="请描述菜谱的特点、口感、功效等..."
              rows="3"
              maxlength="200"
            ></textarea>
            <div class="input-hint">{{ formData.description.length }}/200</div>
          </div>

          <!-- 性味选择 -->
          <div class="form-group">
            <label class="form-label">性味 *</label>
            <div class="nature-selector">
              <button
                v-for="nature in natureOptions"
                :key="nature.value"
                class="nature-btn"
                :class="{ 'is-active': formData.nature === nature.value }"
                @click="formData.nature = nature.value"
              >
                <span class="nature-emoji">{{ nature.emoji }}</span>
                <span class="nature-name">{{ nature.label }}</span>
              </button>
            </div>
          </div>

          <!-- 食材列表 -->
          <div class="form-group">
            <label class="form-label">食材列表 *</label>
            <div class="ingredients-input">
              <div class="ingredient-tags">
                <span
                  v-for="(ingredient, index) in formData.ingredients"
                  :key="index"
                  class="ingredient-tag"
                >
                  {{ ingredient }}
                  <button class="remove-btn" @click="removeIngredient(index)">×</button>
                </span>
              </div>
              <input
                v-model="ingredientInput"
                type="text"
                class="ingredient-field"
                placeholder="输入食材，按回车或逗号添加"
                @keyup.enter="addIngredient"
                @keyup.188="addIngredient"
              />
            </div>
          </div>

          <!-- 烹饪步骤 -->
          <div class="form-group">
            <label class="form-label">烹饪步骤 *</label>
            <div class="steps-input">
              <div v-for="(step, index) in formData.steps" :key="index" class="step-item">
                <div class="step-number">{{ index + 1 }}</div>
                <textarea
                  v-model="formData.steps[index]"
                  class="step-textarea"
                  placeholder="请描述这一步的操作..."
                  rows="2"
                ></textarea>
                <button
                  v-if="formData.steps.length > 1"
                  class="remove-step-btn"
                  @click="removeStep(index)"
                >
                  删除
                </button>
              </div>
              <button class="add-step-btn" @click="addStep">
                <span>+</span>
                添加步骤
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">取消</button>
        <button class="save-btn" :disabled="!isFormValid || isSaving" @click="handleSave">
          <span v-if="!isSaving" class="btn-content">
            <span class="btn-icon">💾</span>
            保存菜谱
          </span>
          <span v-else class="btn-content is-loading">
            <LoadingSpinner size="sm" />
            保存中...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useToast } from '@/utils/toast'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  recipe: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const toast = useToast()
const isSaving = ref(false)
const ingredientInput = ref('')

// 性味选项
const natureOptions = [
  { value: '寒', label: '寒性', emoji: '❄️' },
  { value: '凉', label: '凉性', emoji: '🌬️' },
  { value: '平', label: '平性', emoji: '⚖️' },
  { value: '温', label: '温性', emoji: '🔥' },
  { value: '热', label: '热性', emoji: '🌶️' }
]

// 表单数据
const formData = reactive({
  name: '',
  description: '',
  nature: '平',
  ingredients: [],
  steps: ['']
})

// 菜谱标签
const recipeTags = computed(() => {
  if (!props.recipe) return []

  const tags = []
  if (props.recipe.aiRecommendation?.nutritionTags) {
    tags.push(...props.recipe.aiRecommendation.nutritionTags)
  }
  if (props.recipe.matchScore) {
    tags.push(`匹配度${props.recipe.matchScore}%`)
  }
  return tags
})

// 表单验证
const isFormValid = computed(() => {
  return (
    formData.name.trim() &&
    formData.description.trim() &&
    formData.nature &&
    formData.ingredients.length > 0 &&
    formData.steps.some(step => step.trim())
  )
})

// 监听recipe变化，初始化表单
watch(
  () => props.recipe,
  newRecipe => {
    if (newRecipe) {
      formData.name = newRecipe.name || ''
      formData.description = newRecipe.description || ''
      formData.nature = newRecipe.nature || '平'

      // 尝试从AI推荐中提取食材
      if (newRecipe.aiRecommendation?.reason) {
        // 简单的食材提取逻辑，实际应该更智能
        const ingredients = extractIngredients(newRecipe.aiRecommendation.reason)
        formData.ingredients = ingredients
      } else {
        formData.ingredients = []
      }

      // 初始化步骤
      formData.steps = newRecipe.steps?.length ? [...newRecipe.steps] : ['']
    }
  },
  { immediate: true }
)

// 从文本中提取食材
const extractIngredients = text => {
  // 简单的食材提取，实际应该使用更智能的方法
  const commonIngredients = [
    '鸡肉',
    '猪肉',
    '牛肉',
    '鱼',
    '虾',
    '豆腐',
    '白菜',
    '萝卜',
    '冬瓜',
    '南瓜',
    '西红柿',
    '黄瓜',
    '姜',
    '蒜',
    '葱',
    '香菜',
    '枸杞',
    '红枣'
  ]

  const found = []
  commonIngredients.forEach(ingredient => {
    if (text.includes(ingredient)) {
      found.push(ingredient)
    }
  })

  return found.length > 0 ? found : ['主料', '配料']
}

// 添加食材
const addIngredient = () => {
  const ingredient = ingredientInput.value.trim()
  if (ingredient && !formData.ingredients.includes(ingredient)) {
    formData.ingredients.push(ingredient)
    ingredientInput.value = ''
  }
}

// 移除食材
const removeIngredient = index => {
  formData.ingredients.splice(index, 1)
}

// 添加步骤
const addStep = () => {
  formData.steps.push('')
}

// 移除步骤
const removeStep = index => {
  formData.steps.splice(index, 1)
}

// 处理保存
const handleSave = async () => {
  if (!isFormValid.value) {
    toast.error('请完善必填信息')
    return
  }

  isSaving.value = true

  try {
    const saveData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      nature: formData.nature,
      ingredients: formData.ingredients.filter(ing => ing.trim()),
      steps: formData.steps.filter(step => step.trim())
    }

    await emit('save', saveData)
    toast.success('菜谱保存成功！')
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
    toast.error('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 处理遮罩点击
const handleOverlayClick = () => {
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(var(--blur-sm));
}

.recipe-save-modal {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 模态框头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.title-icon {
  font-size: var(--text-xl);
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  transition: all var(--transition-base);
}

.close-btn:hover {
  background: var(--color-error);
  color: white;
}

/* 模态框内容 */
.modal-content {
  padding: var(--spacing-xl);
  overflow-y: auto;
  flex: 1;
}

/* 菜谱预览 */
.recipe-preview {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border: 1px solid var(--color-border-light);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.preview-header h4 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
}

.match-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.match-score {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-accent);
}

.match-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.recipe-desc {
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--spacing-md) 0;
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-accent-alpha);
  color: var(--color-accent);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 编辑表单 */
.edit-form {
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
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

.form-input,
.form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  background: var(--color-bg-secondary);
  transition: all var(--transition-base);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  background: var(--color-bg-elevated);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.input-hint {
  text-align: right;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

/* 性味选择器 */
.nature-selector {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.nature-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.nature-btn:hover {
  border-color: var(--color-accent);
}

.nature-btn.is-active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.nature-emoji {
  font-size: var(--text-base);
}

.nature-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

/* 食材输入 */
.ingredients-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
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
}

/* 烹饪步骤 */
.steps-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step-item {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: var(--color-accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.step-textarea {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  background: var(--color-bg-secondary);
  resize: vertical;
  min-height: 60px;
}

.remove-step-btn {
  flex-shrink: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--transition-base);
}

.remove-step-btn:hover {
  background: #d32f2f;
}

.add-step-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 2px dashed var(--color-border-medium);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  align-self: flex-start;
}

.add-step-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* 模态框底部 */
.modal-footer {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

.cancel-btn {
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

.cancel-btn:hover {
  border-color: var(--color-text-secondary);
}

.save-btn {
  flex: 2;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-accent);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  color: white;
  cursor: pointer;
  transition: all var(--transition-base);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.save-btn:disabled {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .recipe-save-modal {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--spacing-lg);
  }

  .nature-selector {
    flex-direction: column;
  }

  .nature-btn {
    justify-content: center;
  }

  .step-item {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .remove-step-btn {
    align-self: flex-start;
  }
}
</style>
