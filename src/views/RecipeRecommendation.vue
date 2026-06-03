<template>
  <div class="recipe-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <p class="page-description">基于您的体质和偏好，为您推荐最适合的健康菜谱</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-main">
      <!-- 菜谱网格 -->
      <div class="recipe-content">
        <RecipeGrid
          :recipes="recipeStore.recipes"
          :loading="recipeStore.loading"
          :loading-recipe-ids="loadingRecipeIds"
          @recipe-click="handleRecipeClick"
          @favorite-toggle="handleFavoriteToggle"
          @share="handleShare"
          ref="gridRef"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <RecipeDetailModal
      :is-visible="showDetailModal"
      :recipe="selectedRecipe"
      :loading="detailLoading"
      @close="closeDetailModal"
      @favorite-toggle="handleFavoriteToggle"
      @share="handleShare"
      @retry="retryLoadDetail"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useRecipeStore } from '@/stores/recipe'
import { useToast } from '@/utils/toast'
import { RecipeGrid, RecipeDetailModal } from '@/components'

const router = useRouter()
const userStore = useUserStore()
const recipeStore = useRecipeStore()
const toast = useToast()

// 响应式数据
const showDetailModal = ref(false)
const selectedRecipe = ref(null)
const detailLoading = ref(false)
const loadingRecipeIds = ref(new Set())

// 组件引用
const gridRef = ref(null)

// 初始化数据
onMounted(async () => {
  try {
    await loadInitialData()
  } catch (error) {
    console.error('初始化失败:', error)
    toast.error('页面初始化失败，请刷新重试')
  }
})

// 加载初始数据
const loadInitialData = async () => {
  // 获取推荐菜谱
  await loadRecipes()
}

// 加载菜谱列表
const loadRecipes = async () => {
  try {
    await recipeStore.fetchRecommendations({ limit: 12 })
  } catch (error) {
    console.error('加载菜谱失败:', error)
    toast.error('加载菜谱失败，请稍后重试')
  }
}

// 处理菜谱点击
const handleRecipeClick = async recipe => {
  selectedRecipe.value = recipe
  showDetailModal.value = true

  // 标记为加载中
  loadingRecipeIds.value.add(recipe.id)

  try {
    detailLoading.value = true
    await recipeStore.fetchRecipeDetail(recipe.id)
  } catch (error) {
    console.error('加载菜谱详情失败:', error)
    toast.error('加载菜谱详情失败')
  } finally {
    detailLoading.value = false
    loadingRecipeIds.value.delete(recipe.id)
  }
}

// 处理收藏切换
const handleFavoriteToggle = async (recipe, isFavorited) => {
  if (!userStore.isLoggedIn) {
    toast.warning('请先登录后再进行收藏')
    router.push('/login')
    return
  }

  try {
    await recipeStore.toggleFavorite(recipe.id, isFavorited)
  } catch (error) {
    console.error('收藏操作失败:', error)
    toast.error('收藏操作失败，请稍后重试')
  }
}

// 处理分享
const handleShare = recipe => {
  // 分享逻辑已在组件中实现
  console.log('分享菜谱:', recipe.name)
}

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedRecipe.value = null
}

// 重试加载详情
const retryLoadDetail = async () => {
  if (selectedRecipe.value) {
    await handleRecipeClick(selectedRecipe.value)
  }
}
</script>

<style scoped>
.recipe-page {
  min-height: 100vh;
  background: var(--color-bg-primary);
}

/* 页面头部 */
.page-header {
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-light);
  padding: var(--spacing-xl) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  backdrop-filter: blur(var(--blur-sm));
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

/* 标题区域 */
.title-section {
  text-align: center;
}

.page-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

/* 主要内容区 */
.page-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* 菜谱内容区 */
.recipe-content {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-header {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .page-description {
    font-size: var(--text-sm);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .page-description {
    font-size: var(--text-sm);
  }

  .page-main {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: var(--spacing-sm);
  }

  .page-description {
    font-size: var(--text-xs);
    text-align: center;
  }
}

/* 加载状态 */
.recipe-page.is-loading {
  pointer-events: none;
}

.recipe-page.is-loading .recipe-content {
  opacity: 0.6;
}

/* 骨架屏动画 */
.skeleton-fade {
  animation: skeletonFade 1s ease-in-out infinite alternate;
}

@keyframes skeletonFade {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.7;
  }
}

/* 空状态增强 */
.recipe-content:has(.empty-state) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

/* 页面切换动画 */
.page-header,
.page-main {
  animation: pageFadeIn 0.6s ease-out;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .page-header {
    backdrop-filter: blur(var(--blur-md));
  }
}

/* 滚动条美化 */
.recipe-page::-webkit-scrollbar {
  width: 8px;
}

.recipe-page::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

.recipe-page::-webkit-scrollbar-thumb {
  background: var(--color-border-medium);
  border-radius: var(--radius-full);
}

.recipe-page::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
}

/* 打印样式 */
@media print {
  .page-header {
    position: static;
    box-shadow: none;
    border-bottom: 1px solid #000;
  }

  .recipe-content {
    padding: 0;
  }
}
</style>
