<template>
  <div class="recipe-grid">
    <!-- 视图切换和排序 -->
    <div class="grid-header">
      <div class="view-controls">
        <div class="view-toggle">
          <button
            :class="['view-btn', { 'is-active': viewMode === 'grid' }]"
            @click="setViewMode('grid')"
          >
            <span class="view-icon">⊞</span>
            <span class="view-label">网格</span>
          </button>
          <button
            :class="['view-btn', { 'is-active': viewMode === 'list' }]"
            @click="setViewMode('list')"
          >
            <span class="view-icon">☰</span>
            <span class="view-label">列表</span>
          </button>
        </div>
      </div>

      <div class="sort-controls">
        <label class="sort-label">排序：</label>
        <select v-model="sortBy" class="sort-select" @change="handleSort">
          <option value="matchScore">匹配度</option>
          <option value="createdAt">最新发布</option>
          <option value="name">名称</option>
          <option value="cookingTime">烹饪时间</option>
          <option value="difficulty">难度</option>
        </select>
        <button
          :class="['sort-direction', { 'is-desc': sortOrder === 'desc' }]"
          @click="toggleSortOrder"
        >
          <span class="sort-icon">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
        </button>
      </div>
    </div>

    <!-- 菜谱展示区域 -->
    <div class="grid-content">
      <!-- 加载状态 -->
      <div v-if="loading && recipes.length === 0" class="loading-state">
        <div class="loading-skeletons">
          <div v-for="i in loadingCount" :key="i" :class="['recipe-skeleton', `view-${viewMode}`]">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-title"></div>
              <div class="skeleton-meta"></div>
              <div class="skeleton-description"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 网格视图 -->
      <div
        v-else-if="viewMode === 'grid'"
        :class="['recipes-grid', { 'is-loading': loading && recipes.length > 0 }]"
      >
        <RecipeCard
          v-for="recipe in sortedRecipes"
          :key="recipe.id"
          :recipe="recipe"
          :is-featured="recipe.featured"
          :is-loading="loading && isLoadingRecipe(recipe.id)"
          @click="handleRecipeClick"
          @favorite-toggle="handleFavoriteToggle"
          @share="handleShare"
        />
      </div>

      <!-- 列表视图 -->
      <div v-else :class="['recipes-list', { 'is-loading': loading && recipes.length > 0 }]">
        <div
          v-for="recipe in sortedRecipes"
          :key="recipe.id"
          :class="['recipe-list-item', { 'is-featured': recipe.featured }]"
          @click="handleRecipeClick(recipe)"
        >
          <div class="list-item-image">
            <img
              v-if="recipe.image && !getImageError(recipe.id)"
              :src="recipe.image"
              :alt="recipe.name"
              @error="setImageError(recipe.id)"
              loading="lazy"
            />
            <div v-else class="image-placeholder">
              <div class="placeholder-icon">
                <span>{{ recipe.emoji || '🍽️' }}</span>
              </div>
            </div>

            <!-- 匹配度 -->
            <div v-if="recipe.matchScore !== undefined" class="match-badge">
              {{ recipe.matchScore }}%
            </div>
          </div>

          <div class="list-item-content">
            <div class="list-item-header">
              <h3 class="list-item-title">{{ recipe.name }}</h3>
              <div class="list-item-meta">
                <span v-if="recipe.cookingTime" class="meta-item">
                  ⏱️ {{ recipe.cookingTime }}分钟
                </span>
                <span v-if="recipe.difficulty" class="meta-item">
                  <!-- 📊 {{ getDifficultyLabel(recipe.difficulty) }} -->
                  📊 {{ recipe.difficulty }}
                </span>
                <span v-if="recipe.category" class="meta-item category-tag">
                  {{ getCategoryLabel(recipe.category) }}
                </span>
              </div>
            </div>

            <p class="list-item-description">{{ recipe.description }}</p>

            <div class="list-item-tags">
              <!-- 营养标签 -->
              <div
                v-if="recipe.nutritionTags && recipe.nutritionTags.length"
                class="nutrition-tags"
              >
                <span
                  v-for="tag in recipe.nutritionTags.slice(0, 3)"
                  :key="tag"
                  class="nutrition-tag"
                >
                  {{ getNutritionLabel(tag) }}
                </span>
              </div>

              <!-- 体质适配 -->
              <div
                v-if="recipe.suitableConstitutions && recipe.suitableConstitutions.length"
                class="constitutions"
              >
                <span
                  v-for="constitution in recipe.suitableConstitutions.slice(0, 2)"
                  :key="constitution"
                  class="constitution-tag"
                  :style="{ backgroundColor: getConstitutionColor(constitution) }"
                >
                  {{ getConstitutionLabel(constitution) }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="loading && recipes.length > 0" class="loading-more">
        <LoadingSpinner size="sm" />
        <span>加载更多...</span>
      </div>
    </div>

    <!-- 空状态 -->
    <EmptyState
      v-if="!loading && recipes.length === 0"
      :type="emptyStateType"
      :search-keyword="searchKeyword"
      @reset="handleReset"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from '@/utils/toast'
import RecipeCard from './RecipeCard.vue'
import EmptyState from './EmptyState.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  recipes: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  searchKeyword: {
    type: String,
    default: ''
  },
  loadingRecipeIds: {
    type: Set,
    default: () => new Set()
  }
})

const emit = defineEmits([
  'recipe-click',
  'favorite-toggle',
  'share',
  'sort-change',
  'view-mode-change',
  'reset'
])

const toast = useToast()

// 视图模式
const viewMode = ref('grid')
const sortBy = ref('matchScore')
const sortOrder = ref('desc')

// 加载状态
const loadingCount = computed(() => {
  if (viewMode.value === 'grid') {
    return 6
  } else {
    return 3
  }
})

// 图片错误状态
const imageErrorIds = ref(new Set())
const favoriteIds = ref(new Set())

// 排序后的菜谱
const sortedRecipes = computed(() => {
  if (!props.recipes.length) return []

  const sorted = [...props.recipes].sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]

    // 处理特殊字段
    if (sortBy.value === 'difficulty') {
      aValue = aValue || 0
      bValue = bValue || 0
    } else if (sortBy.value === 'cookingTime') {
      aValue = aValue || 0
      bValue = bValue || 0
    } else if (sortBy.value === 'matchScore') {
      aValue = aValue || 0
      bValue = bValue || 0
    } else {
      // 字符串比较
      aValue = String(aValue || '').toLowerCase()
      bValue = String(bValue || '').toLowerCase()
    }

    let result = 0
    if (typeof aValue === 'string') {
      result = aValue.localeCompare(bValue)
    } else {
      result = aValue - bValue
    }

    return sortOrder.value === 'desc' ? -result : result
  })

  return sorted
})

// 空状态类型
const emptyStateType = computed(() => {
  if (props.searchKeyword) return 'search'
  return 'default'
})

// 获取分类标签
const getCategoryLabel = category => {
  const categoryMap = {
    recommended: '推荐',
    warming: '温补',
    cooling: '清热',
    quick: '快手菜'
  }
  return categoryMap[category] || category
}

// 获取难度标签
const getDifficultyLabel = difficulty => {
  const difficultyMap = {
    1: '简单',
    2: '中等',
    3: '困难'
  }
  return difficultyMap[difficulty] || '未知'
}

// 获取营养标签
const getNutritionLabel = tag => {
  const nutritionMap = {
    'low-calorie': '低卡',
    'high-protein': '高蛋白',
    'low-fat': '低脂',
    'high-fiber': '高纤维',
    'vitamin-rich': '维生素丰富',
    'mineral-rich': '矿物质丰富'
  }
  return nutritionMap[tag] || tag
}

// 获取体质标签
const getConstitutionLabel = constitution => {
  const constitutionMap = {
    balanced: '平和质',
    qi_deficiency: '气虚质',
    yang_deficiency: '阳虚质',
    yin_deficiency: '阴虚质',
    phlegm_dampness: '痰湿质',
    damp_heat: '湿热质',
    blood_stasis: '血瘀质',
    qi_stagnation: '气郁质',
    special: '特禀质'
  }
  return constitutionMap[constitution] || constitution
}

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

// 图片错误处理
const getImageError = id => {
  return imageErrorIds.value.has(id)
}

const setImageError = id => {
  imageErrorIds.value.add(id)
}

// 收藏状态
const isFavorited = id => {
  return favoriteIds.value.has(id)
}

// 设置视图模式
const setViewMode = mode => {
  viewMode.value = mode
  emit('view-mode-change', mode)
}

// 排序处理
const handleSort = () => {
  emit('sort-change', {
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  handleSort()
}

// 菜谱操作
const handleRecipeClick = recipe => {
  emit('recipe-click', recipe)
}

const handleFavoriteToggle = recipe => {
  const isFav = favoriteIds.value.has(recipe.id)
  if (isFav) {
    favoriteIds.value.delete(recipe.id)
    toast.info('已取消收藏')
  } else {
    favoriteIds.value.add(recipe.id)
    toast.success('已添加到收藏')
  }
  emit('favorite-toggle', recipe, !isFav)
}

const handleShare = recipe => {
  const shareUrl = `${window.location.origin}/recipe/${recipe.id}`
  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      toast.success('链接已复制到剪贴板')
    })
    .catch(() => {
      toast.error('复制失败，请手动复制链接')
    })
  emit('share', recipe)
}

const handleReset = () => {
  emit('reset')
}

const isLoadingRecipe = id => {
  return props.loadingRecipeIds.has(id)
}
</script>

<style scoped>
.recipe-grid {
  width: 100%;
}

/* 网格头部 */
.grid-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.view-controls {
  display: flex;
  align-items: center;
}

.view-toggle {
  display: flex;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.view-btn:hover {
  background: var(--color-bg-tertiary);
}

.view-btn.is-active {
  background: var(--color-primary);
  color: white;
}

.view-icon {
  font-size: var(--text-base);
}

.view-label {
  font-size: var(--text-sm);
}

/* 排序控制 */
.sort-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.sort-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.sort-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background: var(--color-bg-elevated);
  cursor: pointer;
  transition: all var(--transition-base);
}

.sort-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.sort-direction {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.sort-direction:hover {
  background: var(--color-bg-tertiary);
}

.sort-direction.is-desc {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.sort-icon {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

/* 网格内容 */
.grid-content {
  position: relative;
}

/* 加载骨架屏 */
.loading-state {
  margin-bottom: var(--spacing-xl);
}

.loading-skeletons {
  display: grid;
  gap: var(--spacing-lg);
}

.view-grid .loading-skeletons {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.view-list .loading-skeletons {
  grid-template-columns: 1fr;
}

.recipe-skeleton {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.recipe-skeleton.view-grid {
  display: flex;
  flex-direction: column;
  height: 400px;
}

.recipe-skeleton.view-list {
  display: flex;
  height: 120px;
}

.skeleton-image {
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 25%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.view-grid .skeleton-image {
  aspect-ratio: 16/10;
}

.view-list .skeleton-image {
  width: 160px;
  height: 120px;
  flex-shrink: 0;
}

.skeleton-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.view-list .skeleton-content {
  padding: var(--spacing-md);
}

.skeleton-title,
.skeleton-meta,
.skeleton-description {
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 25%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-sm);
}

.skeleton-title {
  height: 20px;
  width: 70%;
}

.skeleton-meta {
  height: 16px;
  width: 50%;
}

.skeleton-description {
  height: 14px;
  width: 90%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 网格布局 */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  transition: opacity var(--transition-base);
}

.recipes-grid.is-loading {
  opacity: 0.7;
}

/* 列表布局 */
.recipes-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: opacity var(--transition-base);
}

.recipes-list.is-loading {
  opacity: 0.7;
}

.recipe-list-item {
  display: flex;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
}

.recipe-list-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.recipe-list-item.is-featured {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-alpha);
}

.list-item-image {
  position: relative;
  width: 160px;
  height: 120px;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--color-bg-tertiary);
}

.list-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.recipe-list-item:hover .list-item-image img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
}

.placeholder-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.placeholder-icon span {
  display: inline-block;
}

.match-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: var(--gradient-accent);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  z-index: 1;
}

.list-item-content {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.list-item-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.list-item-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.list-item-meta {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.category-tag {
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.list-item-description {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-item-tags {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.nutrition-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.nutrition-tag {
  background: var(--color-bg-tertiary);
  color: var(--color-accent);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-accent-alpha);
}

.constitutions {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.constitution-tag {
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.list-item-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  align-items: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.recipe-list-item:hover .list-item-actions {
  opacity: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
}

.action-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.action-icon {
  font-size: var(--text-sm);
}

/* 加载更多 */
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .recipes-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .grid-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .view-controls {
    justify-content: center;
  }

  .sort-controls {
    justify-content: center;
  }

  .recipes-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }

  .recipe-list-item {
    flex-direction: column;
    height: auto;
  }

  .list-item-image {
    width: 100%;
    height: 200px;
  }

  .list-item-actions {
    flex-direction: row;
    opacity: 1;
    padding: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .recipes-grid {
    grid-template-columns: 1fr;
  }

  .view-toggle {
    width: 100%;
  }

  .view-btn {
    flex: 1;
    justify-content: center;
  }

  .sort-controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .sort-select {
    flex: 1;
    min-width: 120px;
  }
}
</style>
