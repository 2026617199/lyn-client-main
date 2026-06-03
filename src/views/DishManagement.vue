<template>
  
  <div class="dish-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">菜谱管理</h1>
          <p class="page-subtitle">管理所有菜谱信息，维护系统数据库</p>
        </div>
        <div class="header-actions">
          <!-- 布局切换 -->
          <div class="view-toggle">
            <button
              :class="{ active: viewMode === 'grid' }"
              @click="setViewMode('grid')"
              class="toggle-btn"
              title="网格视图"
            >
              <span class="view-icon">⊞</span>
            </button>
            <button
              :class="{ active: viewMode === 'list' }"
              @click="setViewMode('list')"
              class="toggle-btn"
              title="列表视图"
            >
              <span class="view-icon">☰</span>
            </button>
          </div>

          <button class="btn btn-accent" @click="goToAiGenerate">
            <span class="btn-icon">🤖</span>
            AI生成菜谱
          </button>
          <button class="btn btn-primary" @click="openCreateModal">
            <span class="btn-icon">➕</span>
            新增菜谱
          </button>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">总菜谱数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.active }}</div>
            <div class="stat-label">已启用</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon inactive">⏸️</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.inactive }}</div>
            <div class="stat-label">已禁用</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏷️</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.categories }}</div>
            <div class="stat-label">分类数量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="filter-header">
        <h3 class="filter-title">筛选条件</h3>
        <button class="filter-toggle" @click="toggleFilters">
          {{ showFilters ? '收起' : '展开' }}
          <span class="toggle-icon">{{ showFilters ? '▲' : '▼' }}</span>
        </button>
      </div>

      <transition name="filter-slide">
        <div v-show="showFilters" class="filter-content">
          <!-- 搜索框 -->
          <div class="search-group">
            <div class="search-input-wrapper">
              <input
                v-model="searchParams.keyword"
                type="text"
                placeholder="搜索菜名、描述或食材..."
                class="search-input"
                @input="handleSearch"
              />
              <button v-if="searchParams.keyword" class="clear-btn" @click="clearSearch">✕</button>
            </div>
          </div>

          <!-- 筛选选项 -->
          <div class="filter-options">
            <div class="filter-group">
              <label class="filter-label">分类</label>
              <select
                v-model="searchParams.category"
                class="filter-select"
                @change="handleFilterChange"
              >
                <option value="">全部分类</option>
                <option value="recommended">推荐</option>
                <option value="warming">温补</option>
                <option value="cooling">清热</option>
                <option value="quick">快手菜</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">状态</label>
              <select
                v-model="searchParams.isActive"
                class="filter-select"
                @change="handleFilterChange"
              >
                <option value="">全部状态</option>
                <option value="true">已启用</option>
                <option value="false">已禁用</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">每页显示</label>
              <select
                v-model="searchParams.pageSize"
                class="filter-select"
                @change="handlePageSizeChange"
              >
                <option :value="12">12条</option>
                <option :value="24">24条</option>
                <option :value="48">48条</option>
                <option :value="96">96条</option>
              </select>
            </div>
          </div>

          <div class="filter-actions">
            <button class="btn btn-secondary" @click="resetFilters">重置</button>
            <button class="btn btn-primary" @click="applyFilters">应用筛选</button>
          </div>
        </div>
      </transition>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedItems.length > 0" class="bulk-actions">
      <div class="bulk-info">
        <span class="bulk-text">已选择 {{ selectedItems.length }} 个菜谱</span>
        <button class="link-btn" @click="clearSelection">清除选择</button>
      </div>
      <div class="bulk-buttons">
        <button class="btn btn-success" @click="bulkToggleStatus(true)">批量启用</button>
        <button class="btn btn-warning" @click="bulkToggleStatus(false)">批量禁用</button>
        <button class="btn btn-danger" @click="bulkDelete">批量删除</button>
      </div>
    </div>

    <!-- 菜谱列表 -->
    <div class="dishes-section">
      <!-- 全选控件 -->
      <div class="select-all-bar">
        <label class="checkbox-wrapper">
          <input
            type="checkbox"
            :checked="isAllSelected"
            :indeterminate="isPartiallySelected"
            @change="toggleSelectAll"
          />
          <span class="checkbox-text">全选</span>
        </label>
        <div class="list-info">
          <span class="total-count">共 {{ pagination.total }} 条记录</span>
          <span class="page-info">第 {{ pagination.page }} 页</span>
        </div>
      </div>

      <!-- 布局切换动画 -->
      <transition name="layout-switch" mode="out-in">
        <div class="layout-wrapper">
          <!-- 网格布局 -->
          <div
            v-if="!loading && dishes.length > 0 && viewMode === 'grid'"
            key="grid"
            class="dishes-grid"
          >
            <div
              v-for="dish in dishes"
              :key="dish.id"
              class="dish-card"
              :class="{ selected: selectedItems.includes(dish.id) }"
            >
              <!-- 选择框 -->
              <div class="dish-checkbox">
                <input
                  type="checkbox"
                  :checked="selectedItems.includes(dish.id)"
                  @change="toggleItemSelection(dish.id)"
                />
              </div>

              <!-- 状态标识 -->
              <div class="dish-status" :class="{ active: dish.isActive }">
                <span class="status-dot"></span>
                <span class="status-text">{{ dish.isActive ? '启用' : '禁用' }}</span>
              </div>

              <!-- 菜谱图片 -->
              <div class="dish-image">
                <img
                  v-if="dish.image && !dish.imageError"
                  :src="dish.image"
                  :alt="dish.name"
                  @error="dish.imageError = true"
                />
                <div v-else class="image-placeholder">
                  <span class="placeholder-emoji">{{ dish.emoji || '🍽️' }}</span>
                </div>
              </div>

              <!-- 菜谱信息 -->
              <div class="dish-content">
                <h4 class="dish-name">{{ dish.name }}</h4>
                <p class="dish-description">{{ dish.description }}</p>

                <div class="dish-meta">
                  <span class="meta-item">
                    <span class="meta-icon">⏱️</span>
                    {{ dish.cookingTime }}分钟
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">📊</span>
                    {{ dish.difficulty }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">🏷️</span>
                    {{ getCategoryLabel(dish.category) }}
                  </span>
                </div>

                <div class="dish-tags">
                  <span v-for="tag in dish.tags?.slice(0, 3)" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="dish-actions">
                <button class="action-btn view-btn" @click="viewDish(dish)" title="查看详情">
                  👁️
                </button>
                <button class="action-btn edit-btn" @click="editDish(dish)" title="编辑">✏️</button>
                <button
                  class="action-btn status-btn"
                  @click="toggleDishStatus(dish)"
                  :title="dish.isActive ? '禁用' : '启用'"
                >
                  {{ dish.isActive ? '⏸️' : '▶️' }}
                </button>
                <button class="action-btn delete-btn" @click="deleteDish(dish)" title="删除">
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <!-- 列表布局 -->
          <div
            v-if="!loading && dishes.length > 0 && viewMode === 'list'"
            key="list"
            class="dishes-list"
          >
            <DishListItem
              v-for="dish in dishes"
              :key="dish.id"
              :dish="dish"
              :selected="selectedItems.includes(dish.id)"
              @select="toggleItemSelection"
              @view="viewDish"
              @edit="editDish"
              @toggle-status="toggleDishStatus"
              @delete="deleteDish"
            />
          </div>
        </div>
      </transition>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">⟳</div>
        <p>正在加载菜谱数据...</p>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && dishes.length === 0" class="empty-state">
        <div class="empty-icon">🍽️</div>
        <h3>暂无菜谱数据</h3>
        <p>点击上方"新增菜谱"按钮添加第一个菜谱</p>
        <button class="btn btn-primary" @click="openCreateModal">立即添加</button>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="pagination.total > 0" class="pagination-section">
      <div class="pagination-info">
        <span>
          显示第 {{ (pagination.page - 1) * pagination.pageSize + 1 }} -
          {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} 条，共
          {{ pagination.total }} 条
        </span>
      </div>
      <div class="pagination-controls">
        <button
          class="pagination-btn"
          :disabled="pagination.page <= 1"
          @click="changePage(pagination.page - 1)"
        >
          上一页
        </button>
        <div class="pagination-pages">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="pagination-page"
            :class="{ active: page === pagination.page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        <button
          class="pagination-btn"
          :disabled="pagination.page >= totalPages"
          @click="changePage(pagination.page + 1)"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 菜谱详情模态框 -->
    <DishDetailModal
      v-if="showDetailModal"
      :dish="currentDish"
      :is-visible="showDetailModal"
      @close="showDetailModal = false"
      @edit="editDish"
    />

    <!-- 菜谱表单模态框 -->
    <DishFormModal
      v-if="showFormModal"
      :dish="editingDish"
      :is-edit="!!editingDish"
      :is-visible="showFormModal"
      @close="closeFormModal"
      @saved="handleDishSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/utils/toast'
import { recipeApi } from '@/api/index.js'
import DishDetailModal from '@/components/dish/DishDetailModal.vue'
import DishFormModal from '@/components/dish/DishFormModal.vue'
import DishListItem from '@/components/dish/DishListItem.vue'

const router = useRouter()
const toast = useToast()

// 响应式数据
const dishes = ref([])
const loading = ref(false)
const showFilters = ref(false)
const selectedItems = ref([])
const currentDish = ref(null)
const editingDish = ref(null)
const showDetailModal = ref(false)
const showFormModal = ref(false)
const viewMode = ref('grid') // 'grid' | 'list'

// 搜索参数
const searchParams = ref({
  keyword: '',
  category: '',
  isActive: '',
  page: 1,
  pageSize: 12
})

// 分页信息
const pagination = ref({
  page: 1,
  pageSize: 12,
  total: 0
})

// 统计数据
const stats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  categories: 0
})

// 计算属性
const isAllSelected = computed(() => {
  return dishes.value.length > 0 && selectedItems.value.length === dishes.value.length
})

const isPartiallySelected = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < dishes.value.length
})

const totalPages = computed(() => {
  return Math.ceil(pagination.value.total / pagination.value.pageSize)
})

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = totalPages.value
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else if (total > 1) {
    rangeWithDots.push(total)
  }

  return rangeWithDots.filter(page => page !== '...' || rangeWithDots.length > 1)
})

// 方法
const fetchDishes = async () => {
  loading.value = true
  try {
    const params = {
      ...searchParams.value,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    }

    // 清理空值参数
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await recipeApi.getRecipes(params)

    if (response.code === 0) {
      dishes.value = response.data.list.map(dish => ({
        ...dish,
        imageError: false
      }))
      pagination.value = response.data.pagination

      // 更新统计
      updateStats()
    } else {
      throw new Error(response.message || '获取菜谱列表失败')
    }
  } catch (error) {
    console.error('获取菜谱列表失败:', error)
    toast.error('获取菜谱列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const updateStats = async () => {
  try {
    // 获取总数统计
    const totalResponse = await recipeApi.getRecipes({ pageSize: 1 })
    if (totalResponse.code === 0) {
      stats.value.total = totalResponse.data.pagination.total
    }

    // 获取启用数量
    const activeResponse = await recipeApi.getRecipes({ isActive: true, pageSize: 1 })
    if (activeResponse.code === 0) {
      stats.value.active = activeResponse.data.pagination.total
    }

    // 获取禁用数量
    const inactiveResponse = await recipeApi.getRecipes({ isActive: false, pageSize: 1 })
    if (inactiveResponse.code === 0) {
      stats.value.inactive = inactiveResponse.data.pagination.total
    }

    // 分类数量固定为4个
    stats.value.categories = 4
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const handleSearch = () => {
  // 防抖搜索
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    pagination.value.page = 1
    fetchDishes()
  }, 500)
}

const handleFilterChange = () => {
  pagination.value.page = 1
  fetchDishes()
}

const handlePageSizeChange = () => {
  pagination.value.page = 1
  pagination.value.pageSize = searchParams.value.pageSize
  fetchDishes()
}

const clearSearch = () => {
  searchParams.value.keyword = ''
  handleSearch()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const resetFilters = () => {
  searchParams.value = {
    keyword: '',
    category: '',
    isActive: '',
    page: 1,
    pageSize: 12
  }
  pagination.value.page = 1
  fetchDishes()
  toast.info('筛选条件已重置')
}

const applyFilters = () => {
  pagination.value.page = 1
  fetchDishes()
  toast.success('筛选条件已应用')
}

const changePage = page => {
  if (page >= 1 && page <= totalPages.value) {
    pagination.value.page = page
    searchParams.value.page = page
    fetchDishes()
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = dishes.value.map(dish => dish.id)
  }
}

const toggleItemSelection = dishId => {
  const index = selectedItems.value.indexOf(dishId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(dishId)
  }
}

const clearSelection = () => {
  selectedItems.value = []
}

const getCategoryLabel = category => {
  const categoryMap = {
    recommended: '推荐',
    warming: '温补',
    cooling: '清热',
    quick: '快手菜'
  }
  return categoryMap[category] || category
}

const viewDish = dish => {
  currentDish.value = dish
  showDetailModal.value = true
}

const editDish = async dish => {
  try {
    // 先获取菜谱详情
    const response = await recipeApi.getRecipeById(dish.id)
    if (response.code === 0) {
      editingDish.value = { ...response.data }
      showFormModal.value = true
    } else {
      throw new Error(response.message || '获取菜谱详情失败')
    }
  } catch (error) {
    console.error('获取菜谱详情失败:', error)
    toast.error('获取菜谱详情失败: ' + error.message)
  }
}

const openCreateModal = () => {
  editingDish.value = null
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  editingDish.value = null
}

const handleDishSaved = async () => {
  await fetchDishes()
  if (editingDish.value) {
    closeFormModal()
  }
  toast.success('菜谱保存成功')
}

const toggleDishStatus = async dish => {
  try {
    const newStatus = !dish.isActive
    const response = await recipeApi.updateRecipe(dish.id, { ...dish, isActive: newStatus })

    if (response.code === 0) {
      dish.isActive = newStatus
      toast.success(`菜谱已${newStatus ? '启用' : '禁用'}`)
      updateStats()
    } else {
      throw new Error(response.message || '状态更新失败')
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    toast.error('状态更新失败: ' + error.message)
  }
}

const deleteDish = async dish => {
  if (!confirm(`确定要删除菜谱"${dish.name}"吗？此操作不可恢复。`)) {
    return
  }

  try {
    const response = await recipeApi.deleteRecipe(dish.id)

    if (response.code === 0) {
      toast.success('菜谱删除成功')
      fetchDishes()
    } else {
      throw new Error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    toast.error('删除失败: ' + error.message)
  }
}

const bulkToggleStatus = async isActive => {
  if (selectedItems.value.length === 0) return

  const action = isActive ? '启用' : '禁用'
  if (!confirm(`确定要${action}选中的 ${selectedItems.value.length} 个菜谱吗？`)) {
    return
  }

  try {
    const promises = selectedItems.value.map(dishId => {
      const dish = dishes.value.find(d => d.id === dishId)
      return recipeApi.updateRecipe(dishId, { ...dish, isActive })
    })

    const results = await Promise.allSettled(promises)
    const successCount = results.filter(result => result.value?.code === 0).length

    if (successCount > 0) {
      toast.success(`成功${action} ${successCount} 个菜谱`)
      clearSelection()
      fetchDishes()
    } else {
      throw new Error('批量操作失败')
    }
  } catch (error) {
    console.error('批量操作失败:', error)
    toast.error('批量操作失败: ' + error.message)
  }
}

const bulkDelete = async () => {
  if (selectedItems.value.length === 0) return

  if (!confirm(`确定要删除选中的 ${selectedItems.value.length} 个菜谱吗？此操作不可恢复。`)) {
    return
  }

  try {
    const promises = selectedItems.value.map(dishId => recipeApi.deleteRecipe(dishId))
    const results = await Promise.allSettled(promises)
    const successCount = results.filter(result => result.value?.code === 0).length

    if (successCount > 0) {
      toast.success(`成功删除 ${successCount} 个菜谱`)
      clearSelection()
      fetchDishes()
    } else {
      throw new Error('批量删除失败')
    }
  } catch (error) {
    console.error('批量删除失败:', error)
    toast.error('批量删除失败: ' + error.message)
  }
}

// 跳转到AI生成页面
const goToAiGenerate = () => {
  router.push('/ai-add-dish')
}

// 布局切换方法
const setViewMode = mode => {
  viewMode.value = mode
  localStorage.setItem('dish-view-mode', mode)
}

// 搜索防抖
const searchTimeout = ref(null)

// 生命周期
onMounted(() => {
  // 读取保存的布局偏好
  const savedMode = localStorage.getItem('dish-view-mode')
  if (savedMode && ['grid', 'list'].includes(savedMode)) {
    viewMode.value = savedMode
  }

  fetchDishes()
})

// 监听搜索参数变化
watch(
  searchParams,
  () => {
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
  },
  { deep: true }
)
</script>

<style scoped>
.dish-management {
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

/* 布局切换 */
.view-toggle {
  display: flex;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-bg-primary);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-lg);
  color: var(--color-text-tertiary);
}

.toggle-btn:hover {
  background: var(--color-bg-secondary);
}

.toggle-btn.active {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
}

.toggle-btn:first-child {
  border-right: 1px solid var(--color-border-light);
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

.btn-icon {
  font-size: var(--text-lg);
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
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

.btn-success {
  background: var(--color-success);
  color: var(--color-text-inverse);
}

.btn-warning {
  background: var(--color-warning);
  color: var(--color-text-inverse);
}

.btn-danger {
  background: var(--color-error);
  color: var(--color-text-inverse);
}

.btn-accent {
  background: var(--gradient-accent);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-md);
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 统计概览 */
.stats-section {
  margin-bottom: var(--spacing-2xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--gradient-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  color: var(--color-text-inverse);
}

.stat-icon.inactive {
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

/* 筛选区域 */
.filter-section {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.filter-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--color-accent);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.filter-toggle:hover {
  background: var(--color-accent-alpha);
}

.toggle-icon {
  transition: transform var(--transition-base);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.search-group {
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
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

.clear-btn {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: var(--color-text-tertiary);
  color: var(--color-text-inverse);
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

.filter-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  /* border-color: var(--color-accent); */
}

.filter-actions {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: all var(--transition-base);
  overflow: hidden;
}

.filter-slide-enter-from,
.filter-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
  padding-top: 0;
  margin-bottom: 0;
}

.filter-slide-enter-to,
.filter-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

/* 批量操作 */
.bulk-actions {
  background: var(--gradient-accent);
  color: var(--color-text-inverse);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.bulk-text {
  font-weight: var(--font-medium);
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-text-inverse);
  text-decoration: underline;
  cursor: pointer;
  font-size: var(--text-sm);
  transition: opacity var(--transition-base);
}

.link-btn:hover {
  opacity: 0.8;
}

.bulk-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.bulk-buttons .btn {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-sm);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(var(--blur-sm));
}

.bulk-buttons .btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 菜谱列表 */
.dishes-section {
  margin-bottom: var(--spacing-2xl);
}

.select-all-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  border: 1px solid var(--color-border-light);
  border-bottom: none;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.checkbox-wrapper input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-text {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.list-info {
  display: flex;
  gap: var(--spacing-lg);
}

.total-count,
.page-info {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-light);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* 列表布局 */
.dishes-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-light);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* 布局切换动画 */
.layout-switch-enter-active,
.layout-switch-leave-active {
  transition: all var(--transition-slow);
  overflow: hidden;
}

.layout-switch-enter-from,
.layout-switch-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.layout-switch-enter-to,
.layout-switch-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.dish-card {
  position: relative;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
}

.dish-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
}

.dish-card.selected {
  border-color: var(--color-accent);
  background: var(--color-accent-alpha);
}

.dish-checkbox {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 2;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs);
  box-shadow: var(--shadow-sm);
}

.dish-checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.dish-status {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.dish-status.active {
  color: var(--color-success);
}

.dish-status:not(.active) {
  color: var(--color-text-tertiary);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: currentColor;
}

.dish-image {
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--color-bg-tertiary);
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.dish-card:hover .dish-image img {
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

.placeholder-emoji {
  font-size: 3rem;
  opacity: 0.5;
}

.dish-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.dish-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dish-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dish-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.meta-icon {
  font-size: var(--text-xs);
}

.dish-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  background: var(--color-bg-tertiary);
  color: var(--color-accent);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-accent-alpha);
}

.dish-actions {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.action-btn {
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
  font-size: var(--text-sm);
}

.action-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.action-btn.edit-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.action-btn.delete-btn:hover {
  background: var(--color-error);
  border-color: var(--color-error);
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: var(--spacing-4xl);
  color: var(--color-text-secondary);
}

.loading-spinner {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
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
  margin: 0 0 var(--spacing-xl) 0;
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.pagination-info {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.pagination-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-base);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-text-inverse);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: var(--spacing-xs);
}

.pagination-page {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-base);
}

.pagination-page:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-text-inverse);
}

.pagination-page.active {
  background: var(--gradient-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .dishes-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .dish-management {
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

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .filter-options {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
  }

  .bulk-actions {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .bulk-buttons {
    justify-content: stretch;
  }

  .bulk-buttons .btn {
    flex: 1;
  }

  .dishes-grid {
    grid-template-columns: 1fr;
    padding: var(--spacing-md);
  }

  .select-all-bar {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .pagination-section {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .pagination-controls {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dish-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .dish-actions {
    justify-content: center;
  }
}
</style>
