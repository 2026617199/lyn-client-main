<template>
  <div class="recipe-filters">
    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索菜名、描述或食材..."
          class="search-input"
          @input="handleSearch"
          @keyup.enter="handleSearch"
        />
        <div class="search-icon">🔍</div>
        <button v-if="searchKeyword" class="clear-btn" @click="clearSearch">✕</button>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-section">
      <h3 class="filter-title">分类</h3>
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.key"
          :class="['category-tab', { 'is-active': selectedCategory === category.key }]"
          @click="selectCategory(category.key)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-label">{{ category.label }}</span>
        </button>
      </div>
    </div>

    <!-- 高级筛选 -->
    <div class="filter-section" v-if="showAdvanced">
      <h3 class="filter-title">
        高级筛选
        <button class="toggle-btn" @click="toggleAdvanced">
          {{ showAdvanced ? '收起' : '展开' }}
        </button>
      </h3>

      <transition name="slide-down">
        <div v-if="showAdvanced" class="advanced-filters">
          <!-- 烹饪时间 -->
          <div class="filter-group">
            <label class="filter-label">烹饪时间</label>
            <div class="time-range">
              <select v-model="filters.maxTime" class="filter-select" @change="handleFilterChange">
                <option value="">不限</option>
                <option value="15">15分钟内</option>
                <option value="30">30分钟内</option>
                <option value="60">1小时内</option>
                <option value="120">2小时内</option>
              </select>
            </div>
          </div>

          <!-- 难度等级 -->
          <div class="filter-group">
            <label class="filter-label">难度等级</label>
            <div class="difficulty-options">
              <label
                v-for="difficulty in difficultyOptions"
                :key="difficulty.value"
                class="difficulty-option"
              >
                <input
                  v-model="filters.difficulty"
                  type="radio"
                  :value="difficulty.value"
                  @change="handleFilterChange"
                />
                <span class="difficulty-label">
                  <span class="difficulty-stars">{{ difficulty.stars }}</span>
                  {{ difficulty.label }}
                </span>
              </label>
            </div>
          </div>

          <!-- 体质类型 -->
          <div class="filter-group">
            <label class="filter-label">适合体质</label>
            <div class="constitution-options">
              <label
                v-for="constitution in constitutionOptions"
                :key="constitution.key"
                class="constitution-option"
              >
                <input
                  v-model="filters.constitutions"
                  type="checkbox"
                  :value="constitution.key"
                  @change="handleFilterChange"
                />
                <span class="constitution-label">{{ constitution.label }}</span>
              </label>
            </div>
          </div>

          <!-- 营养标签 -->
          <div class="filter-group">
            <label class="filter-label">营养特点</label>
            <div class="nutrition-options">
              <label
                v-for="nutrition in nutritionOptions"
                :key="nutrition.key"
                class="nutrition-option"
              >
                <input
                  v-model="filters.nutritionTags"
                  type="checkbox"
                  :value="nutrition.key"
                  @change="handleFilterChange"
                />
                <span class="nutrition-label">{{ nutrition.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 筛选操作 -->
    <div class="filter-actions">
      <button class="btn btn-secondary btn-sm" @click="resetFilters">重置筛选</button>
      <button class="btn btn-primary btn-sm" @click="applyFilters">
        应用筛选 ({{ getActiveFilterCount() }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from '@/utils/toast'

const emit = defineEmits(['search', 'filter-change', 'category-change', 'reset'])

const toast = useToast()

// 搜索相关
const searchKeyword = ref('')
const selectedCategory = ref('warming')

// 高级筛选展开状态
const showAdvanced = ref(false)

// 筛选条件
const filters = ref({
  maxTime: '',
  difficulty: '',
  constitutions: [],
  nutritionTags: []
})

// 分类数据
const categories = ref([
  { key: 'warming', label: '温补', icon: '🔥', count: 0 },
  { key: 'cooling', label: '清润', icon: '❄️', count: 0 },
  { key: 'neutral', label: '平和', icon: '🌿', count: 0 },
  { key: 'quick', label: '快手菜', icon: '⚡', count: 0 }
])

// 难度选项
const difficultyOptions = [
  { value: '', label: '不限', stars: '' },
  { value: 1, label: '简单', stars: '⭐' },
  { value: 2, label: '中等', stars: '⭐⭐' },
  { value: 3, label: '困难', stars: '⭐⭐⭐' }
]

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

// 营养选项
const nutritionOptions = [
  { key: 'low-calorie', label: '低卡路里' },
  { key: 'high-protein', label: '高蛋白' },
  { key: 'low-fat', label: '低脂肪' },
  { key: 'high-fiber', label: '高纤维' },
  { key: 'vitamin-rich', label: '维生素丰富' },
  { key: 'mineral-rich', label: '矿物质丰富' }
]

// 获取体质颜色
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

// 获取活跃筛选数量
const getActiveFilterCount = () => {
  let count = 0
  if (filters.value.maxTime) count++
  if (filters.value.difficulty) count++
  if (filters.value.constitutions.length) count++
  if (filters.value.nutritionTags.length) count++
  return count
}

// 搜索处理
const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const clearSearch = () => {
  searchKeyword.value = ''
  handleSearch()
}

// 分类选择
const selectCategory = category => {
  selectedCategory.value = category
  emit('category-change', category)
}

// 筛选变化处理
const handleFilterChange = () => {
  // 实时更新筛选
  emit('filter-change', filters.value)
}

// 切换高级筛选
const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// 应用筛选
const applyFilters = () => {
  emit('filter-change', filters.value)
  toast.success('筛选条件已应用')
}

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = 'warming'
  filters.value = {
    maxTime: '',
    difficulty: '',
    constitutions: [],
    nutritionTags: []
  }

  emit('reset')
  toast.info('筛选条件已重置')
}

// 更新分类数量
const updateCategoryCounts = counts => {
  categories.value.forEach(category => {
    category.count = counts[category.key] || 0
  })
}

// 暴露方法给父组件
defineExpose({
  updateCategoryCounts
})
</script>

<style scoped>
.recipe-filters {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

/* 搜索区域 */
.search-section {
  margin-bottom: var(--spacing-lg);
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-3xl) var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--color-bg-primary);
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-alpha);
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-lg);
  color: var(--color-text-tertiary);
}

.clear-btn {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: var(--color-text-tertiary);
  color: white;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  transition: all var(--transition-base);
}

.clear-btn:hover {
  background: var(--color-text-secondary);
}

/* 筛选区域 */
.filter-section {
  margin-bottom: var(--spacing-lg);
}

.filter-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.toggle-btn:hover {
  background: var(--color-accent-alpha);
}

/* 分类标签 */
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.category-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.category-tab:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.category-tab.is-active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.category-icon {
  font-size: var(--text-base);
}

.category-label {
  font-size: var(--text-sm);
}

/* 高级筛选 */
.advanced-filters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background: var(--color-bg-elevated);
  cursor: pointer;
  transition: all var(--transition-base);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

/* 难度选项 */
.difficulty-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.difficulty-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.difficulty-option:hover {
  background: var(--color-bg-secondary);
}

.difficulty-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.difficulty-stars {
  color: var(--color-warning);
}

/* 体质选项 */
.constitution-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-xs);
}

.constitution-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.constitution-option:hover {
  background: var(--color-bg-secondary);
}

.constitution-option input:checked + .constitution-label {
  color: var(--constitution-color);
  font-weight: var(--font-medium);
}

.constitution-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-base);
}

/* 营养选项 */
.nutrition-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.nutrition-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.nutrition-option:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-accent);
}

.nutrition-option input:checked + .nutrition-label {
  color: var(--color-accent);
  font-weight: var(--font-medium);
}

.nutrition-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition-base);
}

/* 筛选操作 */
.filter-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

/* 过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-base);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recipe-filters {
    padding: var(--spacing-md);
  }

  .category-tabs {
    justify-content: center;
  }

  .constitution-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-actions {
    flex-direction: column;
  }

  .filter-actions .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .search-input {
    padding: var(--spacing-sm) var(--spacing-2xl) var(--spacing-sm) var(--spacing-md);
    font-size: var(--text-sm);
  }

  .category-tab {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--text-xs);
  }

  .constitution-options {
    grid-template-columns: 1fr;
  }
}
</style>
