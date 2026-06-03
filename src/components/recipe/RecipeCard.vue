<template>
  <div
    class="recipe-card"
    :class="{ 'is-featured': isFeatured, 'is-loading': isLoading }"
    @click="handleClick"
  >
    <!-- 卡片图片 -->
    <div class="card-image">
      <img
        v-if="recipe.image && !imageError"
        :src="recipe.image"
        :alt="recipe.name"
        @error="imageError = true"
        loading="lazy"
      />
      <div v-else class="image-placeholder">
        <div class="placeholder-icon">
          <span>{{ recipe.emoji || '🍽️' }}</span>
        </div>
      </div>

      <!-- 匹配度标签 -->
      <div v-if="recipe.matchScore !== undefined" class="match-score">
        <span class="score-value">{{ recipe.matchScore }}%</span>
        <span class="score-label">匹配</span>
      </div>

      <!-- 分类标签 -->
      <div v-if="recipe.category" class="category-tag">
        {{ getCategoryLabel(recipe.category) }}
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <div class="card-header">
        <h3 class="recipe-name">{{ recipe.name }}</h3>
        <div class="recipe-meta">
          <span v-if="recipe.cookingTime" class="meta-item">
            <span class="meta-icon">⏱️</span>
            {{ recipe.cookingTime }}分钟
          </span>
          <span v-if="recipe.difficulty" class="meta-item">
            <span class="meta-icon">📊</span>
            {{ recipe.difficulty }}
          </span>
        </div>
      </div>

      <p class="recipe-description">{{ recipe.description }}</p>

      <!-- 营养标签 -->
      <div v-if="displayNutritionTags && displayNutritionTags.length" class="nutrition-tags">
        <span v-for="tag in displayNutritionTags.slice(0, 3)" :key="tag" class="nutrition-tag">
          {{ getNutritionLabel(tag) }}
        </span>
      </div>

      <!-- 体质适配 -->
      <div
        v-if="recipe.suitableConstitutions && recipe.suitableConstitutions.length"
        class="constitutions"
      >
        <span class="constitutions-label">适合：</span>
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

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <LoadingSpinner size="sm" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/utils/toast'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'favorite-toggle', 'share'])

const router = useRouter()
const toast = useToast()

const imageError = ref(false)
const isFavorited = ref(false)

// 计算属性：显示营养标签（优先使用AI推荐的营养标签）
const displayNutritionTags = computed(() => {
  // 如果有AI推荐的营养标签，优先显示
  if (props.recipe.aiRecommendation && props.recipe.aiRecommendation.nutritionTags) {
    return props.recipe.aiRecommendation.nutritionTags
  }
  // 否则使用原有的营养标签
  return props.recipe.nutritionTags || []
})

const getCategoryLabel = category => {
  const categoryMap = {
    recommended: '推荐',
    warming: '温补',
    cooling: '清热',
    quick: '快手菜'
  }
  return categoryMap[category] || category
}

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

const handleClick = () => {
  if (props.isLoading) return
  emit('click', props.recipe)
}

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  emit('favorite-toggle', props.recipe, isFavorited.value)

  toast.info(isFavorited.value ? '已添加到收藏' : '已取消收藏')
}

const handleShare = () => {
  emit('share', props.recipe)

  // 复制链接到剪贴板
  const shareUrl = `${window.location.origin}/recipe/${props.recipe.id}`
  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      toast.success('链接已复制到剪贴板')
    })
    .catch(() => {
      toast.error('复制失败，请手动复制链接')
    })
}
</script>

<style scoped>
.recipe-card {
  position: relative;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent);
}

.recipe-card.is-featured {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent-alpha);
}

.recipe-card.is-loading {
  pointer-events: none;
  opacity: 0.7;
}

/* 卡片图片 */
.card-image {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--color-bg-tertiary);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.recipe-card:hover .card-image img {
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
  font-size: 3rem;
  opacity: 0.5;
}

.placeholder-icon span {
  display: inline-block;
}

/* 匹配度标签 */
.match-score {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: var(--gradient-accent);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-align: center;
  box-shadow: var(--shadow-md);
  z-index: 1;
}

.score-value {
  display: block;
  font-size: var(--text-sm);
}

.score-label {
  font-size: var(--text-xs);
  opacity: 0.9;
}

/* 分类标签 */
.category-tag {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  z-index: 1;
}

/* 卡片内容 */
.card-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: var(--spacing-md);
}

.recipe-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: var(--leading-tight);
}

.recipe-meta {
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

.meta-icon {
  font-size: var(--text-sm);
}

.recipe-description {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--spacing-md) 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 营养标签 */
.nutrition-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
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

/* 体质适配 */
.constitutions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-top: auto;
}

.constitutions-label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
}

.constitution-tag {
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 卡片操作 */
.card-actions {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.recipe-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  backdrop-filter: blur(var(--blur-sm));
}

.action-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.action-icon {
  font-size: var(--text-sm);
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(var(--blur-sm));
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-content {
    padding: var(--spacing-md);
  }

  .recipe-name {
    font-size: var(--text-base);
  }

  .recipe-description {
    -webkit-line-clamp: 3;
  }

  .card-actions {
    opacity: 1;
    bottom: var(--spacing-sm);
    right: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .match-score {
    top: var(--spacing-xs);
    right: var(--spacing-xs);
    padding: 2px var(--spacing-xs);
  }

  .category-tag {
    top: var(--spacing-xs);
    left: var(--spacing-xs);
    padding: 2px var(--spacing-xs);
  }
}
</style>
