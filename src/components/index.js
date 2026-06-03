/**
 * 组件导出索引
 * 方便统一导入组件
 */

// 布局组件
export { default as AppHeader } from './layout/AppHeader.vue'
export { default as AppFooter } from './layout/AppFooter.vue'

// 通用组件
export { default as LoadingSpinner } from './common/LoadingSpinner.vue'
export { default as Toast } from './common/Toast.vue'

// 体质设置组件
export { default as QuestionOption } from './constitution/QuestionOption.vue'
export { default as ConstitutionCard } from './constitution/ConstitutionCard.vue'
export { default as ConstitutionDetailModal } from './constitution/ConstitutionDetailModal.vue'
export { default as ConstitutionQuestion } from './constitution/ConstitutionQuestion.vue'

// 菜谱相关组件
export { default as RecipeCard } from './recipe/RecipeCard.vue'
export { default as RecipeFilters } from './recipe/RecipeFilters.vue'
export { default as RecipeGrid } from './recipe/RecipeGrid.vue'
export { default as RecipeDetailModal } from './recipe/RecipeDetailModal.vue'
export { default as EmptyState } from './recipe/EmptyState.vue'

// AI推荐相关组件
export { default as AiRecommendPanel } from './recipe/AiRecommendPanel.vue'
export { default as AiAnalysisCard } from './recipe/AiAnalysisCard.vue'
export { default as RecipeSaveModal } from './recipe/RecipeSaveModal.vue'
export { default as MatchScoreIndicator } from './recipe/MatchScoreIndicator.vue'
