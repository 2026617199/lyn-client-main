<template>
  <div class="ai-add-dish">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">AI生成菜谱</h1>
          <p class="page-subtitle">基于中医体质理论，智能生成个性化菜谱</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="goBack">
            <span class="btn-icon">←</span>
            返回菜谱管理
          </button>
        </div>
      </div>
    </div>

    <!-- AI生成表单 -->
    <div class="generation-form-section">
      <div class="form-card">
        <div class="form-header">
          <h2 class="form-title">生成设置</h2>
          <p class="form-description">填写菜谱生成需求，AI将为您智能生成符合要求的菜谱</p>
        </div>

        <form @submit.prevent="handleGenerate" class="generation-form">
          <!-- 菜谱描述 -->
          <div class="form-group">
            <label class="form-label required">菜谱描述</label>
            <textarea
              v-model="generateForm.dishDescription"
              class="form-textarea"
              placeholder="请详细描述您想要制作的菜谱特点、功效、烹饪方式等..."
              rows="4"
              required
            ></textarea>
            <div class="form-hint">例如：清淡的汤品，希望有养胃功效，适合晚餐食用</div>
          </div>

          <!-- 目标体质 -->
          <div class="form-group">
            <label class="form-label required">目标体质</label>
            <select v-model="generateForm.targetConstitution" class="form-select" required>
              <option value="">请选择目标体质</option>
              <option
                v-for="constitution in constitutionOptions"
                :key="constitution.key"
                :value="constitution.key"
              >
                {{ constitution.label }}
              </option>
            </select>
            <div class="form-hint">选择菜谱主要针对的体质类型进行调理</div>
          </div>

          <!-- 特殊要求 -->
          <div class="form-group">
            <label class="form-label">特殊要求</label>
            <textarea
              v-model="generateForm.specialRequirements"
              class="form-textarea"
              placeholder="如过敏原、饮食禁忌、口味偏好、烹饪时间限制等..."
              rows="3"
            ></textarea>
            <div class="form-hint">
              例如：不要放葱，少吃盐，希望口感偏甜，烹饪时间控制在30分钟内
            </div>
          </div>

          <!-- 生成数量 -->
          <div class="form-group">
            <label class="form-label required">生成数量</label>
            <div class="quantity-selector">
              <button
                v-for="num in quantityOptions"
                :key="num"
                type="button"
                class="quantity-btn"
                :class="{ active: generateForm.count === num }"
                @click="generateForm.count = num"
              >
                {{ num }}个
              </button>
            </div>
            <div class="form-hint">一次性生成多个菜谱供您选择</div>
          </div>

          <!-- 生成按钮 -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary btn-large"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="loading-spinner">⟳</span>
              <span v-else class="btn-icon">🤖</span>
              {{ loading ? '生成中...' : '开始生成' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 生成结果 -->
    <div v-if="generatedRecipes.length > 0" class="results-section">
      <div class="results-header">
        <h2 class="results-title">
          生成结果
          <span class="results-count">({{ generatedRecipes.length }}个菜谱)</span>
        </h2>
        <div class="results-actions">
          <button class="btn btn-secondary" @click="selectAll">
            {{ isAllSelected ? '取消全选' : '全选' }}
          </button>
          <button
            class="btn btn-accent"
            @click="batchSave"
            :disabled="selectedRecipes.length === 0"
          >
            <span class="btn-icon">💾</span>
            批量保存 ({{ selectedRecipes.length }})
          </button>
        </div>
      </div>

      <div class="recipes-grid">
        <GeneratedRecipeCard
          v-for="(recipe, index) in generatedRecipes"
          :key="index"
          :recipe="recipe"
          :selected="selectedRecipes.includes(index)"
          @select="toggleRecipeSelection(index)"
          @view="viewRecipe"
          @edit="editRecipe"
          @save="saveRecipe"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && generatedRecipes.length === 0 && hasGenerated" class="empty-state">
      <div class="empty-icon">🤖</div>
      <h3>暂无生成结果</h3>
      <p>请调整生成参数后重新尝试</p>
    </div>

    <!-- 菜谱详情模态框 -->
    <RecipeDetailModal
      v-if="showDetailModal"
      :recipe="currentRecipe"
      :is-visible="showDetailModal"
      @close="showDetailModal = false"
    />

    <!-- 菜谱编辑模态框 -->
    <RecipeEditModal
      v-if="showEditModal"
      :recipe="editingRecipe"
      :is-visible="showEditModal"
      @close="showEditModal = false"
      @saved="handleRecipeSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/utils/toast'
import { recipeApi } from '@/api/index.js'
import { useRecipeStore } from '@/stores/recipe'
import GeneratedRecipeCard from '@/components/recipe/GeneratedRecipeCard.vue'
import RecipeDetailModal from '@/components/recipe/RecipeDetailModal.vue'
import RecipeEditModal from '@/components/recipe/RecipeEditModal.vue'

const router = useRouter()
const toast = useToast()
const recipeStore = useRecipeStore()

// 响应式数据
const loading = computed(() => recipeStore.aiGenerateLoading)
const hasGenerated = computed(() => recipeStore.hasAiGenerated)
const generatedRecipes = computed(() => recipeStore.aiGeneratedRecipes)
const selectedRecipes = computed({
  get: () => recipeStore.selectedGeneratedRecipes,
  set: value => {
    recipeStore.selectedGeneratedRecipes = value
  }
})
const currentRecipe = ref(null)
const editingRecipe = ref(null)
const showDetailModal = ref(false)
const showEditModal = ref(false)

// 生成表单数据
const generateForm = ref({
  dishDescription: '',
  targetConstitution: '',
  specialRequirements: '',
  count: 3
})

// 体质选项
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

// 数量选项
const quantityOptions = [1, 3, 5, 8, 10]

// 计算属性
const isFormValid = computed(() => {
  return (
    generateForm.value.dishDescription.trim() &&
    generateForm.value.targetConstitution &&
    generateForm.value.count > 0
  )
})

const isAllSelected = computed(() => {
  return (
    generatedRecipes.value.length > 0 &&
    selectedRecipes.value.length === generatedRecipes.value.length
  )
})

// 方法
const goBack = () => {
  router.push('/dish-management')
}

const handleGenerate = async () => {
  if (!isFormValid.value) {
    toast.error('请填写所有必填字段')
    return
  }

  const startTime = Date.now()

  try {
    console.log('🤖 开始AI生成菜谱请求...', {
      dishDescription: generateForm.value.dishDescription.trim(),
      targetConstitution: generateForm.value.targetConstitution,
      count: generateForm.value.count
    })

    const generatedData = await recipeStore.generateRecipeByAI({
      dishDescription: generateForm.value.dishDescription.trim(),
      targetConstitution: generateForm.value.targetConstitution,
      specialRequirements: generateForm.value.specialRequirements.trim(),
      count: generateForm.value.count
    })

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    console.log(`✅ AI生成菜谱成功，耗时: ${duration}秒`)

    const generatedCount = Array.isArray(generatedData) ? generatedData.length : 1
    toast.success(`成功生成 ${generatedCount} 个菜谱（耗时${duration}秒）`)
  } catch (error) {
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)
    console.error(`❌ AI生成菜谱失败，已耗时: ${duration}秒`, error)

    // 区分不同类型的错误
    let errorMessage = '生成失败'
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = '请求超时，AI生成需要较长时间，请稍后重试'
    } else if (error.message === 'Network Error') {
      errorMessage = '网络连接错误，请检查网络连接'
    } else if (error.response) {
      errorMessage = `服务器错误: ${error.response.status} - ${error.response.data?.message || error.message}`
    } else {
      errorMessage = error.message || '生成失败'
    }

    toast.error(errorMessage)
  }
}

const selectAll = () => {
  if (isAllSelected.value) {
    selectedRecipes.value = []
  } else {
    selectedRecipes.value = generatedRecipes.value.map((_, index) => index)
  }
}

const toggleRecipeSelection = index => {
  const selectedIndex = selectedRecipes.value.indexOf(index)
  if (selectedIndex > -1) {
    selectedRecipes.value.splice(selectedIndex, 1)
  } else {
    selectedRecipes.value.push(index)
  }
}

const viewRecipe = recipe => {
  currentRecipe.value = recipe
  showDetailModal.value = true
}

const editRecipe = recipe => {
  editingRecipe.value = { ...recipe }
  showEditModal.value = true
}

const saveRecipe = async recipe => {
  try {
    const response = await recipeApi.saveAIGeneratedRecipe(recipe)
    if (response.code === 0) {
      toast.success('菜谱保存成功')
      // 从生成列表中移除已保存的菜谱
      const index = generatedRecipes.value.findIndex(r => r === recipe)
      if (index > -1) {
        generatedRecipes.value.splice(index, 1)
        // 更新选择状态
        selectedRecipes.value = selectedRecipes.value
          .filter(i => i !== index)
          .map(i => (i > index ? i - 1 : i))
      }
    } else {
      throw new Error(response.message || '保存失败')
    }
  } catch (error) {
    console.error('保存菜谱失败:', error)
    toast.error('保存失败: ' + error.message)
  }
}

const batchSave = async () => {
  if (selectedRecipes.value.length === 0) {
    toast.error('请先选择要保存的菜谱')
    return
  }

  const confirmed = confirm(`确定要批量保存选中的 ${selectedRecipes.value.length} 个菜谱吗？`)
  if (!confirmed) return

  try {
    const promises = selectedRecipes.value.map(index =>
      recipeApi.saveAIGeneratedRecipe(generatedRecipes.value[index])
    )

    const results = await Promise.allSettled(promises)
    const successCount = results.filter(result => result.value?.code === 0).length

    if (successCount > 0) {
      toast.success(`成功保存 ${successCount} 个菜谱`)

      // 移除成功保存的菜谱
      const indicesToRemove = selectedRecipes.value
        .filter((index, i) => results[i].value?.code === 0)
        .sort((a, b) => b - a)

      indicesToRemove.forEach(index => {
        generatedRecipes.value.splice(index, 1)
      })

      selectedRecipes.value = []
    } else {
      throw new Error('批量保存失败')
    }
  } catch (error) {
    console.error('批量保存失败:', error)
    toast.error('批量保存失败: ' + error.message)
  }
}

const handleRecipeSaved = () => {
  showEditModal.value = false
  editingRecipe.value = null
  // 从生成列表中移除已保存的菜谱
  const index = generatedRecipes.value.findIndex(r => r === editingRecipe.value)
  if (index > -1) {
    generatedRecipes.value.splice(index, 1)
  }
}

// 生命周期
onMounted(() => {
  // 页面初始化
})
</script>

<style scoped>
.ai-add-dish {
  max-width: var(--container-2xl);
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-lg);
  min-height: calc(100vh - var(--header-height));
}

/* 页面头部 */
.page-header {
  margin-bottom: var(--spacing-2xl);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-xl);
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  font-family: var(--font-serif);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

/* 生成表单区域 */
.generation-form-section {
  margin-bottom: var(--spacing-2xl);
}

.form-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-md);
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.form-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
  font-family: var(--font-serif);
}

.form-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

.generation-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.form-label.required::after {
  content: ' *';
  color: var(--color-error);
}

.form-textarea,
.form-select {
  padding: var(--spacing-md);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--color-bg-primary);
  transition: all var(--transition-base);
  font-family: var(--font-sans);
  width: 100%;
}

.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-alpha);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-select {
  cursor: pointer;
}

.form-hint {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
  line-height: var(--leading-relaxed);
}

/* 数量选择器 */
.quantity-selector {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.quantity-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.quantity-btn:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-alpha);
}

.quantity-btn.active {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-text-inverse);
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
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

.btn-large {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--text-lg);
}

.btn-icon {
  font-size: var(--text-lg);
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
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

.btn-accent {
  background: var(--gradient-accent);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-md);
}

.btn-accent:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 生成结果区域 */
.results-section {
  margin-bottom: var(--spacing-2xl);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.results-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.results-count {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  color: var(--color-text-secondary);
}

.results-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-4xl);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.empty-state h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state p {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-add-dish {
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
  }

  .page-title {
    font-size: var(--text-3xl);
  }

  .form-card {
    padding: var(--spacing-lg);
  }

  .quantity-selector {
    justify-content: center;
  }

  .results-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .results-actions {
    justify-content: center;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .form-card {
    padding: var(--spacing-md);
  }

  .quantity-selector {
    gap: var(--spacing-xs);
  }

  .quantity-btn {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--text-sm);
  }

  .btn-large {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--text-base);
  }
}
</style>
