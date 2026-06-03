<template>
  <div class="empty-state">
    <div class="empty-content">
      <!-- 空状态图标 -->
      <div class="empty-icon">
        <span class="icon-emoji">{{ iconEmoji }}</span>
      </div>

      <!-- 空状态标题和描述 -->
      <h2 class="empty-title">{{ title }}</h2>
      <p class="empty-description">{{ description }}</p>

      <!-- 操作按钮 -->
      <div v-if="showActions" class="empty-actions">
        <button v-if="type === 'search'" class="btn btn-primary" @click="handleClearSearch">
          清除搜索
        </button>
        <button v-else-if="type === 'filter'" class="btn btn-secondary" @click="handleResetFilters">
          重置筛选
        </button>
        <button v-else class="btn btn-primary" @click="handleExplore">开始探索</button>
      </div>

      <!-- 建议内容 -->
      <div v-if="showSuggestions" class="empty-suggestions">
        <h3 class="suggestions-title">{{ suggestionsTitle }}</h3>
        <div class="suggestions-list">
          <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-item"
            @click="handleSuggestionClick(suggestion)"
          >
            <span class="suggestion-icon">{{ suggestion.icon }}</span>
            <span class="suggestion-text">{{ suggestion.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 装饰性背景元素 -->
    <div class="empty-decoration">
      <div class="decoration-circle decoration-1"></div>
      <div class="decoration-circle decoration-2"></div>
      <div class="decoration-circle decoration-3"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: value => ['default', 'search', 'filter', 'error'].includes(value)
  },
  searchKeyword: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['reset', 'clear-search', 'suggestion-click'])

// 空状态图标 emoji
const iconEmoji = computed(() => {
  switch (props.type) {
    case 'search':
      return '🔍'
    case 'filter':
      return '🎯'
    case 'error':
      return '⚠️'
    default:
      return '🍽️'
  }
})

// 标题和描述
const title = computed(() => {
  switch (props.type) {
    case 'search':
      return `未找到"${props.searchKeyword}"相关菜谱`
    case 'filter':
      return '没有符合条件的菜谱'
    case 'error':
      return '加载失败'
    default:
      return '暂无菜谱'
  }
})

const description = computed(() => {
  switch (props.type) {
    case 'search':
      return '尝试使用其他关键词搜索，或浏览推荐菜谱'
    case 'filter':
      return '调整筛选条件或查看所有菜谱'
    case 'error':
      return '网络连接出现问题，请稍后重试'
    default:
      return '开始探索美味的健康菜谱吧'
  }
})

// 是否显示操作按钮
const showActions = computed(() => {
  return ['search', 'filter', 'default'].includes(props.type)
})

// 是否显示建议
const showSuggestions = computed(() => {
  return props.type === 'default'
})

// 建议标题
const suggestionsTitle = '热门推荐'

// 建议列表
const suggestions = [
  { icon: '🔥', text: '温补菜谱', keyword: 'warming' },
  { icon: '❄️', text: '清热菜谱', keyword: 'cooling' },
  { icon: '⚡', text: '快手菜谱', keyword: 'quick' },
  { icon: '⭐', text: '推荐菜谱', keyword: 'recommended' }
]

// 操作处理
const handleClearSearch = () => {
  emit('clear-search')
}

const handleResetFilters = () => {
  emit('reset')
}

const handleExplore = () => {
  emit('reset')
}

const handleSuggestionClick = suggestion => {
  emit('suggestion-click', suggestion.keyword)
}
</script>

<style scoped>
.empty-state {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: var(--spacing-3xl) var(--spacing-lg);
  text-align: center;
}

.empty-content {
  position: relative;
  z-index: 1;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

/* 空状态图标 */
.empty-icon {
  font-size: 4rem;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
}

.icon-emoji {
  display: inline-block;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 标题和描述 */
.empty-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.empty-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

/* 操作按钮 */
.empty-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
}

/* 建议内容 */
.empty-suggestions {
  width: 100%;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.suggestions-title {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
  text-align: center;
}

.suggestions-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.suggestion-item:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.suggestion-icon {
  font-size: var(--text-lg);
  flex-shrink: 0;
}

.suggestion-text {
  font-weight: var(--font-medium);
}

/* 装饰性背景元素 */
.empty-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: var(--radius-full);
  opacity: 0.1;
  background: var(--gradient-accent);
}

.decoration-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -50px;
  animation: float-slow 8s ease-in-out infinite;
}

.decoration-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -30px;
  animation: float-slow 6s ease-in-out infinite reverse;
}

.decoration-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: 10%;
  animation: float-slow 7s ease-in-out infinite 2s;
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .empty-state {
    min-height: 300px;
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  .empty-content {
    max-width: 320px;
    gap: var(--spacing-md);
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-title {
    font-size: var(--text-xl);
  }

  .empty-description {
    font-size: var(--text-sm);
  }

  .empty-actions {
    flex-direction: column;
    width: 100%;
  }

  .empty-actions .btn {
    width: 100%;
  }

  .suggestions-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .empty-content {
    gap: var(--spacing-sm);
  }

  .empty-icon {
    font-size: 2.5rem;
  }

  .suggestion-item {
    padding: var(--spacing-md);
  }

  .decoration-circle {
    opacity: 0.05;
  }
}

/* 深色主题适配 */
[data-theme='dark'] .empty-state {
  background: var(--color-bg-primary);
}

[data-theme='dark'] .decoration-circle {
  opacity: 0.05;
}

/* 动画延迟 */
.decoration-1 {
  animation-delay: 0s;
}

.decoration-2 {
  animation-delay: 1s;
}

.decoration-3 {
  animation-delay: 2s;
}

/* 特殊状态的样式 */
.empty-state[data-type='error'] .empty-icon {
  color: var(--color-error);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.empty-state[data-type='search'] .empty-icon {
  color: var(--color-info);
}

.empty-state[data-type='filter'] .empty-icon {
  color: var(--color-warning);
}

/* 加载状态的空状态 */
.empty-state.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

.empty-state.is-loading .empty-icon {
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
</style>
