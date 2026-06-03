<template>
  <teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <!-- 模态框头部 -->
        <div class="modal-header">
          <h2 class="modal-title">{{ isEdit ? '编辑菜谱' : '新增菜谱' }}</h2>
          <button class="close-btn" @click="close">
            <span class="close-icon">✕</span>
          </button>
        </div>

        <!-- 模态框内容 -->
        <div class="modal-content">
          <form @submit.prevent="handleSubmit" class="dish-form">
            <!-- 基本信息 -->
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label required">菜谱名称</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="form-input"
                    placeholder="请输入菜谱名称"
                    required
                  />
                  <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">表情符号</label>
                  <input
                    v-model="formData.emoji"
                    type="text"
                    class="form-input"
                    placeholder="选择一个代表菜谱的表情符号"
                    maxlength="2"
                  />
                </div>

                <div class="form-group full-width">
                  <label class="form-label required">菜谱描述</label>
                  <textarea
                    v-model="formData.description"
                    class="form-textarea"
                    placeholder="请输入菜谱描述"
                    rows="3"
                    required
                  ></textarea>
                  <span v-if="errors.description" class="form-error">{{ errors.description }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">图片链接</label>
                  <input
                    v-model="formData.image"
                    type="url"
                    class="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <!-- 中医属性 -->
            <div class="form-section">
              <h3 class="section-title">中医属性</h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label required">性质</label>
                  <select v-model="formData.nature" class="form-select" required>
                    <option value="">请选择</option>
                    <option value="寒">寒</option>
                    <option value="凉">凉</option>
                    <option value="平">平</option>
                    <option value="温">温</option>
                    <option value="热">热</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label required">分类</label>
                  <select v-model="formData.category" class="form-select" required>
                    <option value="">请选择</option>
                    <option value="recommended">推荐</option>
                    <option value="warming">温补</option>
                    <option value="cooling">清热</option>
                    <option value="quick">快手菜</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">五味</label>
                  <div class="checkbox-group">
                    <label
                      v-for="flavor in flavorOptions"
                      :key="flavor.value"
                      class="checkbox-label"
                    >
                      <input v-model="formData.flavors" type="checkbox" :value="flavor.value" />
                      <span class="checkbox-text">{{ flavor.label }}</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">归经</label>
                  <div class="checkbox-group">
                    <label
                      v-for="meridian in meridianOptions"
                      :key="meridian.value"
                      class="checkbox-label"
                    >
                      <input v-model="formData.meridians" type="checkbox" :value="meridian.value" />
                      <span class="checkbox-text">{{ meridian.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 体质适配 -->
            <div class="form-section">
              <h3 class="section-title">体质适配</h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">适宜体质</label>
                  <div class="constitution-grid">
                    <label
                      v-for="constitution in constitutionOptions"
                      :key="constitution.key"
                      class="constitution-label"
                    >
                      <input
                        v-model="formData.suitableConstitutions"
                        type="checkbox"
                        :value="constitution.key"
                      />
                      <span class="constitution-text">{{ constitution.label }}</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">禁忌体质</label>
                  <div class="constitution-grid">
                    <label
                      v-for="constitution in constitutionOptions"
                      :key="constitution.key"
                      class="constitution-label"
                    >
                      <input
                        v-model="formData.avoidConstitutions"
                        type="checkbox"
                        :value="constitution.key"
                      />
                      <span class="constitution-text">{{ constitution.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 制作信息 -->
            <div class="form-section">
              <h3 class="section-title">制作信息</h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label required">烹饪时间（分钟）</label>
                  <input
                    v-model.number="formData.cookingTime"
                    type="number"
                    class="form-input"
                    placeholder="60"
                    min="1"
                    required
                  />
                  <span v-if="errors.cookingTime" class="form-error">{{ errors.cookingTime }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label required">难度</label>
                  <select v-model="formData.difficulty" class="form-select" required>
                    <option value="">请选择</option>
                    <option value="简单">简单</option>
                    <option value="中等">中等</option>
                    <option value="困难">困难</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">基础评分</label>
                  <input
                    v-model.number="formData.baseScore"
                    type="number"
                    class="form-input"
                    placeholder="80"
                    min="0"
                    max="100"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">排序序号</label>
                  <input
                    v-model.number="formData.sortOrder"
                    type="number"
                    class="form-input"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <!-- 标签 -->
            <div class="form-section">
              <h3 class="section-title">标签</h3>

              <div class="form-group">
                <label class="form-label">菜谱标签</label>
                <div class="tags-input">
                  <input
                    v-model="tagInput"
                    type="text"
                    class="form-input"
                    placeholder="输入标签后按回车添加"
                    @keydown.enter.prevent="addTag"
                  />
                  <button type="button" class="btn btn-secondary" @click="addTag">添加</button>
                </div>
                <div class="tags-list">
                  <span v-for="(tag, index) in formData.tags" :key="index" class="tag-item">
                    {{ tag }}
                    <button type="button" class="tag-remove" @click="removeTag(index)">✕</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- 食材清单 -->
            <div class="form-section">
              <h3 class="section-title">食材清单</h3>

              <div class="ingredients-section">
                <div
                  v-for="(ingredient, index) in formData.ingredients"
                  :key="index"
                  class="ingredient-item"
                >
                  <div class="ingredient-fields">
                    <input
                      v-model="ingredient.name"
                      type="text"
                      class="form-input"
                      placeholder="食材名称"
                    />
                    <input
                      v-model="ingredient.amount"
                      type="text"
                      class="form-input"
                      placeholder="用量"
                    />
                    <input
                      v-model="ingredient.icon"
                      type="text"
                      class="form-input"
                      placeholder="表情符号"
                      maxlength="2"
                    />
                  </div>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeIngredient(index)"
                  >
                    删除
                  </button>
                </div>
                <button type="button" class="btn btn-secondary" @click="addIngredient">
                  添加食材
                </button>
              </div>
            </div>

            <!-- 烹饪步骤 -->
            <div class="form-section">
              <h3 class="section-title">烹饪步骤</h3>

              <div class="steps-section">
                <div v-for="(step, index) in formData.steps" :key="index" class="step-item">
                  <div class="step-header">
                    <span class="step-number">步骤 {{ index + 1 }}</span>
                    <button type="button" class="btn btn-danger btn-sm" @click="removeStep(index)">
                      删除
                    </button>
                  </div>
                  <textarea
                    v-model="step.content"
                    class="form-textarea"
                    placeholder="请描述这一步的操作"
                    rows="2"
                  ></textarea>
                </div>
                <button type="button" class="btn btn-secondary" @click="addStep">添加步骤</button>
              </div>
            </div>

            <!-- 中医分析 -->
            <div class="form-section">
              <h3 class="section-title">中医分析</h3>

              <div class="form-group">
                <textarea
                  v-model="formData.analysis"
                  class="form-textarea"
                  placeholder="请输入中医分析内容"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <!-- 系统设置 -->
            <div class="form-section">
              <h3 class="section-title">系统设置</h3>

              <div class="form-group">
                <label class="checkbox-label">
                  <input v-model="formData.isActive" type="checkbox" />
                  <span class="checkbox-text">启用该菜谱</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <!-- 模态框底部 -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">取消</button>
          <button type="button" class="btn btn-primary" @click="handleSubmit" :disabled="loading">
            {{ loading ? '保存中...' : isEdit ? '更新' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useToast } from '@/utils/toast'
import { recipeApi } from '@/api/index.js'

const props = defineProps({
  dish: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const toast = useToast()

// 表单数据
const formData = ref({
  name: '',
  description: '',
  image: '',
  emoji: '',
  nature: '',
  flavors: [],
  meridians: [],
  category: '',
  suitableConstitutions: [],
  avoidConstitutions: [],
  ingredients: [],
  steps: [],
  tags: [],
  cookingTime: 60,
  difficulty: '',
  analysis: '',
  baseScore: 80,
  isActive: true,
  sortOrder: 0
})

// 选项数据
const flavorOptions = [
  { value: '酸', label: '酸' },
  { value: '苦', label: '苦' },
  { value: '甘', label: '甘' },
  { value: '辛', label: '辛' },
  { value: '咸', label: '咸' }
]

const meridianOptions = [
  { value: '心', label: '心经' },
  { value: '肝', label: '肝经' },
  { value: '脾', label: '脾经' },
  { value: '肺', label: '肺经' },
  { value: '肾', label: '肾经' },
  { value: '胃', label: '胃经' },
  { value: '胆', label: '胆经' },
  { value: '小肠', label: '小肠经' },
  { value: '大肠', label: '大肠经' },
  { value: '膀胱', label: '膀胱经' }
]

const constitutionOptions = [
  { key: 'balanced', label: '平和质' },
  { key: 'qi_deficiency', label: '气虚质' },
  { key: 'yang_deficiency', label: '阳虚质' },
  { key: 'yin_deficiency', label: '阴虚质' },
  { key: 'phlegm_dampness', label: '痰湿质' },
  { key: 'damp_heat', label: '湿热质' },
  { key: 'blood_stasis', label: '血瘀质' },
  { key: 'qi_stagnation', label: '气郁质' },
  { key: 'special', label: '特禀质' }
]

// 临时数据
const tagInput = ref('')
const loading = ref(false)
const errors = ref({})

// 计算属性
const isEdit = computed(() => !!props.dish)

// 方法
const getConstitutionColor = constitution => {
  const colorMap = {
    balanced: 'var(--color-constitution-balanced)',
    qi_deficiency: 'var(--color-constitution-qi)',
    yang_deficiency: 'var(--color-constitution-yang)',
    yin_deficiency: 'var(--color-constitution-yin)',
    phlegm_dampness: 'var(--color-constitution-phlegm)',
    damp_heat: 'var(--color-constitution-damp)',
    blood_stasis: 'var(--color-constitution-blood)',
    qi_stagnation: 'var(--color-constitution-qi-stagnation)',
    special: 'var(--color-constitution-special)'
  }
  return colorMap[constitution] || 'var(--color-text-tertiary)'
}

const initializeForm = () => {
  if (props.dish) {
    formData.value = {
      ...props.dish,
      flavors: props.dish.flavors || [],
      meridians: props.dish.meridians || [],
      suitableConstitutions: props.dish.suitableConstitutions || [],
      avoidConstitutions: props.dish.avoidConstitutions || [],
      tags: props.dish.tags || [],
      ingredients: props.dish.ingredients || [],
      steps: props.dish.steps || []
    }
  } else {
    resetForm()
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    image: '',
    emoji: '',
    nature: '',
    flavors: [],
    meridians: [],
    category: '',
    suitableConstitutions: [],
    avoidConstitutions: [],
    ingredients: [],
    steps: [],
    tags: [],
    cookingTime: 60,
    difficulty: '',
    analysis: '',
    baseScore: 80,
    isActive: true,
    sortOrder: 0
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.name?.trim()) {
    errors.value.name = '请输入菜谱名称'
  }

  if (!formData.value.description?.trim()) {
    errors.value.description = '请输入菜谱描述'
  }

  if (!formData.value.nature) {
    errors.value.nature = '请选择性质'
  }

  if (!formData.value.category) {
    errors.value.category = '请选择分类'
  }

  if (!formData.value.cookingTime || formData.value.cookingTime < 1) {
    errors.value.cookingTime = '请输入有效的烹饪时间'
  }

  if (!formData.value.difficulty) {
    errors.value.difficulty = '请选择难度'
  }

  return Object.keys(errors.value).length === 0
}

const addTag = () => {
  const tag = tagInput.value?.trim()
  if (tag && Array.isArray(formData.value.tags) && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = index => {
  formData.value.tags.splice(index, 1)
}

const addIngredient = () => {
  formData.value.ingredients.push({
    name: '',
    amount: '',
    icon: '🥘'
  })
}

const removeIngredient = index => {
  formData.value.ingredients.splice(index, 1)
}

const addStep = () => {
  formData.value.steps.push({
    order: formData.value.steps.length + 1,
    content: ''
  })
}

const removeStep = index => {
  formData.value.steps.splice(index, 1)
  // 重新编号
  formData.value.steps.forEach((step, i) => {
    step.order = i + 1
  })
}

const close = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('请填写所有必填字段')
    return
  }

  loading.value = true
  try {
    let response
    if (isEdit.value) {
      response = await recipeApi.updateRecipe(props.dish.id, formData.value)
    } else {
      response = await recipeApi.createRecipe(formData.value)
    }

    if (response.code === 0) {
      toast.success(`菜谱${isEdit.value ? '更新' : '创建'}成功`)
      emit('saved')
    } else {
      throw new Error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('保存菜谱失败:', error)
    toast.error('保存失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleOverlayClick = () => {
  close()
}

// 监听props变化
watch(
  () => props.isVisible,
  isVisible => {
    if (isVisible) {
      nextTick(() => {
        initializeForm()
      })
    }
  },
  { immediate: true }
)

watch(
  () => props.dish,
  newDish => {
    if (props.isVisible && newDish) {
      initializeForm()
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(var(--blur-sm));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-lg);
}

.modal-container {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-light);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-serif);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-bg-tertiary);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
}

.close-btn:hover {
  background: var(--color-error);
  color: var(--color-text-inverse);
}

.close-icon {
  font-size: var(--text-lg);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
}

.dish-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
  position: relative;
  padding-left: var(--spacing-md);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: var(--gradient-accent);
  border-radius: var(--radius-sm);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.form-label.required::after {
  content: ' *';
  color: var(--color-error);
}

.form-input,
.form-textarea,
.form-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--color-bg-elevated);
  transition: all var(--transition-base);
  font-family: var(--font-sans);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-alpha);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  cursor: pointer;
}

.form-error {
  font-size: var(--text-xs);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.checkbox-label:hover {
  background: var(--color-bg-secondary);
}

.checkbox-text {
  user-select: none;
}

.constitution-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-xs);
}

.constitution-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.constitution-label:hover {
  background: var(--color-bg-secondary);
}

.constitution-label input:checked + .constitution-text {
  color: var(--constitution-color);
  font-weight: var(--font-medium);
}

.constitution-text {
  user-select: none;
}

.tags-input {
  display: flex;
  gap: var(--spacing-sm);
}

.tags-input .form-input {
  flex: 1;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.tag-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-accent);
  color: var(--color-text-inverse);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
}

.tag-remove {
  background: none;
  border: none;
  color: var(--color-text-inverse);
  cursor: pointer;
  font-size: var(--text-xs);
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.2);
}

.ingredients-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.ingredient-item {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.ingredient-fields {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: var(--spacing-sm);
  flex: 1;
}

.steps-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-number {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-sans);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-medium);
}

.btn-secondary:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-accent);
}

.btn-danger {
  background: var(--color-error);
  color: var(--color-text-inverse);
}

.btn-danger:hover {
  background: var(--color-error);
  transform: translateY(-1px);
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-md);
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--spacing-lg);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .ingredient-fields {
    grid-template-columns: 1fr;
  }

  .checkbox-group {
    grid-template-columns: repeat(2, 1fr);
  }

  .constitution-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--spacing-md);
  }

  .tags-input {
    flex-direction: column;
  }

  .ingredient-item {
    flex-direction: column;
  }

  .modal-footer .btn {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>
