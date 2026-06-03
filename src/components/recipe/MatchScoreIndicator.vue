<template>
  <div class="match-score-indicator">
    <div class="score-ring" :class="getScoreClass()">
      <svg class="ring-svg" viewBox="0 0 100 100">
        <!-- 背景圆环 -->
        <circle
          class="ring-background"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--color-bg-tertiary)"
          stroke-width="8"
        />
        <!-- 进度圆环 -->
        <circle
          class="ring-progress"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          :stroke="getScoreColor()"
          stroke-width="8"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div class="score-content">
        <div class="score-value">{{ displayScore }}</div>
        <div class="score-label">{{ getScoreLabel() }}</div>
      </div>
    </div>

    <div class="score-details" v-if="showDetails">
      <div class="detail-item">
        <span class="detail-label">匹配等级</span>
        <span class="detail-value" :style="{ color: getScoreColor() }">
          {{ getScoreLevel() }}
        </span>
      </div>
      <div class="detail-item" v-if="matchReason">
        <span class="detail-label">匹配理由</span>
        <span class="detail-text">{{ matchReason }}</span>
      </div>
      <div class="score-bars">
        <div v-for="bar in scoreBreakdown" :key="bar.label" class="score-bar-item">
          <span class="bar-label">{{ bar.label }}</span>
          <div class="bar-container">
            <div
              class="bar-fill"
              :style="{ width: bar.value + '%', backgroundColor: bar.color }"
            ></div>
          </div>
          <span class="bar-value">{{ bar.value }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 100
  },
  matchReason: {
    type: String,
    default: ''
  },
  showDetails: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large'].includes(value)
  }
})

// 圆环周长
const circumference = computed(() => 2 * Math.PI * 45)

// 显示分数（四舍五入）
const displayScore = computed(() => Math.round(props.score))

// 圆环偏移量
const dashOffset = computed(() => {
  const progress = props.score / 100
  return circumference.value * (1 - progress)
})

// 获取分数颜色
const getScoreColor = () => {
  if (props.score >= 90) return '#4CAF50' // 优秀 - 绿色
  if (props.score >= 80) return '#8BC34A' // 良好 - 浅绿
  if (props.score >= 70) return '#FFC107' // 中等 - 黄色
  if (props.score >= 60) return '#FF9800' // 及格 - 橙色
  return '#F44336' // 不及格 - 红色
}

// 获取分数等级
const getScoreLevel = () => {
  if (props.score >= 90) return '优秀匹配'
  if (props.score >= 80) return '良好匹配'
  if (props.score >= 70) return '中等匹配'
  if (props.score >= 60) return '一般匹配'
  return '低匹配度'
}

// 获取分数标签
const getScoreLabel = () => {
  if (props.score >= 80) return '高匹配'
  if (props.score >= 60) return '中匹配'
  return '低匹配'
}

// 获取分数样式类
const getScoreClass = () => {
  if (props.score >= 80) return 'score-high'
  if (props.score >= 60) return 'score-medium'
  return 'score-low'
}

// 分数细分（模拟数据，实际应该从API获取）
const scoreBreakdown = computed(() => {
  // 基于总分生成细分数据
  const base = props.score * 0.6
  const variance = props.score * 0.2

  return [
    {
      label: '体质适配',
      value: Math.min(100, Math.round(base + Math.random() * variance)),
      color: '#4CAF50'
    },
    {
      label: '营养均衡',
      value: Math.min(100, Math.round(base + Math.random() * variance)),
      color: '#2196F3'
    },
    {
      label: '口味偏好',
      value: Math.min(100, Math.round(base + Math.random() * variance)),
      color: '#FF9800'
    },
    {
      label: '烹饪难度',
      value: Math.min(100, Math.round(base + Math.random() * variance)),
      color: '#9C27B0'
    }
  ]
})
</script>

<style scoped>
.match-score-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

/* 分数圆环 */
.score-ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-ring.score-high .ring-progress {
  filter: drop-shadow(0 0 8px rgba(76, 175, 80, 0.4));
}

.score-ring.score-medium .ring-progress {
  filter: drop-shadow(0 0 8px rgba(255, 152, 0, 0.4));
}

.score-ring.score-low .ring-progress {
  filter: drop-shadow(0 0 8px rgba(244, 67, 54, 0.4));
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-background {
  opacity: 0.2;
}

.ring-progress {
  transition:
    stroke-dashoffset 1s ease-out,
    stroke 0.3s ease;
}

.score-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.score-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: 1;
}

.score-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

/* 分数详情 */
.score-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
  text-align: center;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
}

.detail-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.detail-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.detail-text {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-align: left;
  flex: 1;
  line-height: var(--leading-relaxed);
}

/* 分数条形图 */
.score-bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.score-bar-item {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  align-items: center;
  gap: var(--spacing-sm);
}

.bar-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-align: left;
}

.bar-container {
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s ease-out;
}

.bar-value {
  font-size: var(--text-xs);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
  text-align: right;
}

/* 尺寸变化 */
.score-ring {
  width: 120px;
  height: 120px;
}

.score-value {
  font-size: var(--text-2xl);
}

/* 小尺寸 */
.match-score-indicator[data-size='small'] .score-ring {
  width: 80px;
  height: 80px;
}

.match-score-indicator[data-size='small'] .score-value {
  font-size: var(--text-lg);
}

.match-score-indicator[data-size='small'] .score-label {
  font-size: 10px;
}

/* 大尺寸 */
.match-score-indicator[data-size='large'] .score-ring {
  width: 160px;
  height: 160px;
}

.match-score-indicator[data-size='large'] .score-value {
  font-size: var(--text-3xl);
}

.match-score-indicator[data-size='large'] .score-label {
  font-size: var(--text-sm);
}

/* 动画效果 */
.score-ring {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 悬停效果 */
.score-ring:hover .ring-progress {
  filter: brightness(1.2) drop-shadow(0 0 12px currentColor);
}

.detail-item:hover .detail-value {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .score-ring {
    width: 100px;
    height: 100px;
  }

  .score-value {
    font-size: var(--text-xl);
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .score-bar-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-xs);
  }

  .bar-container {
    height: 8px;
  }
}

/* 脉冲动画（高分数时） */
.score-ring.score-high {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
