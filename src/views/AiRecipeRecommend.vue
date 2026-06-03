<template>
  <div class="ai-recommend-page">
    <div class="page-content">
      <div class="content-layout">
        <!-- 左侧：推荐配置面板 -->
        <div class="config-section">
          <AiRecommendPanel :is-recommending="isRecommending" @recommend="handleRecommend" />
        </div>

        <!-- 右侧：推荐结果 -->
        <div class="results-section">
          <!-- AI分析卡片 -->
          <AiAnalysisCard v-if="aiAnalysis" :analysis="aiAnalysis" class="analysis-card" />

          <!-- 推荐状态 -->
          <div v-if="!hasRecommended && !isRecommending" class="empty-state">
            <div class="empty-icon">🎯</div>
            <h3>开始您的智能推荐之旅</h3>
            <p>配置您的偏好条件，AI将为您推荐最适合的健康菜谱</p>
          </div>

          <!-- 推荐中状态 -->
          <div v-if="isRecommending" class="loading-state">
            <div class="loading-animation">
              <div class="ai-thinking">
                <span class="thinking-icon">🧠</span>
                <div class="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <h3>AI 正在为您分析推荐</h3>
              <p>基于您的体质特征和偏好，寻找最适合的菜谱...</p>
            </div>
          </div>
        </div>

        <!-- 推荐结果 -->
        <div v-if="hasRecommended && !isRecommending" class="recommendations-content">
          <!-- 结果头部 -->
          <div class="results-header">
            <div class="results-info">
              <h3>推荐结果</h3>
              <p>为您找到 {{ recommendedRecipes.length }} 道适合的菜谱</p>
            </div>
            <div class="results-actions">
              <button class="action-btn refresh-btn" @click="handleRefresh">
                <span class="btn-icon">🔄</span>
               重新推荐
              </button>
            </div>
          </div>

          <!-- 菜谱网格 -->
          <div class="recipes-grid">
            <div
              v-for="(recipe, index) in recommendedRecipes"
              :key="recipe._id"
              class="recipe-card-wrapper"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <RecipeCard
                :recipe="recipe"
                :is-featured="recipe.matchScore >= 90"
                @click="handleRecipeClick"
                @favorite-toggle="handleFavoriteToggle"
                @share="handleRecipeShare"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜谱详情弹窗 -->
    <RecipeDetailModal
      :recipe="detailRecipe"
      :is-visible="isDetailModalVisible"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/utils/toast'
import { useRecipeStore } from '@/stores/recipe'
import { useUserStore } from '@/stores/user'
import {
  staggerAnimation,
  viewportAnimation,
  batchViewportAnimation,
  fadeIn,
  slideIn,
  scale
} from '@/utils/animations'

// 组件导入
import AiRecommendPanel from '@/components/recipe/AiRecommendPanel.vue'
import AiAnalysisCard from '@/components/recipe/AiAnalysisCard.vue'
import RecipeCard from '@/components/recipe/RecipeCard.vue'
import RecipeDetailModal from '@/components/recipe/RecipeDetailModal.vue'

const router = useRouter()
const toast = useToast()
const recipeStore = useRecipeStore()
const userStore = useUserStore()

// 响应式状态
const isRecommending = computed(() => recipeStore.aiRecommendLoading)
const recommendedRecipes = computed(() => recipeStore.aiRecommendedRecipes)
const aiAnalysis = computed(() => recipeStore.aiAnalysis)
const detailRecipe = ref(null)
const isDetailModalVisible = ref(false)

// 计算属性
const hasRecommended = computed(() => recommendedRecipes.value.length > 0)

// 处理AI推荐
const handleRecommend = async params => {
  try {
    // 调用API获取AI推荐
    const response = await recipeStore.fetchAiRecommendations(params)

    if (response && response.data) {
      // 提取推荐菜谱列表
      const recipes = response.data.list || []

      if (recipes.length > 0) {
        // 提取AI分析数据
        if (!response.data.aiAnalysis) {
          // 如果API没有返回aiAnalysis，使用默认值
          recipeStore.aiAnalysis = {
            userProfile:
              '基于您的体质特征和饮食偏好分析，您适合温和调理型菜谱，注重营养均衡和口感清淡。',
            recommendStrategy:
              '推荐以温补为主、营养均衡的菜谱，注重易消化和季节适应性，符合您的体质调理需求。',
            nutritionBalance:
              '推荐菜谱营养搭配均衡，蛋白质、维生素、膳食纤维含量适中，有助于增强体质和改善消化。'
          }
        }

        toast.success(`AI为您推荐了 ${recipes.length} 道菜谱`)
      } else {
        toast.warning('暂无符合条件的推荐，请调整推荐条件')
      }
    } else {
      toast.warning('推荐服务暂时不可用，请稍后重试')
    }
  } catch (error) {
    console.error('AI推荐失败:', error)
    toast.error('用户偏好数据不存在，请先设置偏好')
  }
}

// 处理菜谱点击
const handleRecipeClick = recipe => {
  detailRecipe.value = recipe
  isDetailModalVisible.value = true
}

// 处理收藏切换
const handleFavoriteToggle = (recipe, isFavorited) => {
  recipeStore.toggleFavorite(recipe._id, isFavorited)
}

// 处理菜谱分享
const handleRecipeShare = recipe => {
  recipeStore.shareRecipe(recipe._id)
}

// 处理刷新推荐
const handleRefresh = () => {
  recipeStore.clearAiRecommendations()

  // 触发重新推荐（这里可以保存之前的参数）
  toast.info('请重新配置推荐条件')
}

// 关闭详情弹窗
const closeDetailModal = () => {
  isDetailModalVisible.value = false
  detailRecipe.value = null
}

// 组件挂载时的初始化
onMounted(async () => {
  // 检查用户登录状态
  if (!userStore.isLoggedIn) {
    toast.warning('请先登录以获得更好的推荐体验')
  }

  // 初始化动画
  await nextTick()
  initializeAnimations()
})

// 初始化动画效果
const initializeAnimations = () => {
  // 视口动画
  const analysisCard = document.querySelector('.analysis-card')
  if (analysisCard) {
    viewportAnimation(analysisCard, slideIn, { direction: 'right' })
  }

  // 菜谱卡片批量动画
  observeRecipeCards()
}

// 监听菜谱卡片的出现
const observeRecipeCards = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            fadeIn(entry.target)
            slideIn(entry.target, 'up')
          }, index * 100)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  // 监听推荐结果的变化
  const watchRecipes = () => {
    const cards = document.querySelectorAll('.recipe-card-wrapper')
    cards.forEach(card => {
      // 重置动画状态
      card.style.opacity = '0'
      observer.observe(card)
    })
  }

  // 使用MutationObserver监听DOM变化
  const mutationObserver = new MutationObserver(() => {
    watchRecipes()
  })

  const gridContainer = document.querySelector('.recipes-grid')
  if (gridContainer) {
    mutationObserver.observe(gridContainer, {
      childList: true,
      subtree: true
    })
  }

  watchRecipes()
}
</script>

<style scoped>
.ai-recommend-page {
  min-height: calc(100vh - var(--header-height));
  background: linear-gradient(135deg, var(--color-bg-primary), #f8f9fa);
  overflow: hidden;
}

/* 页面内容 */
.page-content {
  padding: var(--spacing-xl) 0;
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  overflow-x: hidden;
}

.content-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: var(--spacing-xl);
  align-items: start;
  min-height: 100%;
}

.config-section {
  display: flex;
  align-self: start;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  min-height: 100%;
}

.analysis-card {
  animation: slideInRight 0.6s ease-out;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--color-border-medium);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.7;
}

.empty-state h3 {
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state p {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  margin: 0;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
}

.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.ai-thinking {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.thinking-icon {
  font-size: 3rem;
  animation: pulse 2s infinite;
}

.thinking-dots {
  display: flex;
  gap: var(--spacing-xs);
}

.thinking-dots span {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.thinking-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.thinking-dots span:nth-child(2) {
  animation-delay: -0.16s;
}
.thinking-dots span:nth-child(3) {
  animation-delay: 0;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 推荐结果 */
.recommendations-content {
  grid-column: 1 / -1;
  animation: fadeIn 0.6s ease-out;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.results-info h3 {
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.results-info p {
  color: var(--color-text-secondary);
  margin: 0;
}

.results-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.refresh-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-medium);
}

.refresh-btn:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-text-secondary);
}

.btn-icon {
  font-size: var(--text-base);
}

/* 菜谱网格 */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.recipe-card-wrapper {
  position: relative;
  animation: slideInUp 0.6s ease-out backwards;
}

/* .recipe-actions {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 2;
} */

/* 动画 */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .config-section {
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .content-layout {
    padding: 0 var(--spacing-lg);
  }

  .recipes-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .results-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
