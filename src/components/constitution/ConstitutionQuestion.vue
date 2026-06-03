<template>
  <div class="constitution-question">
    <div class="content-main">
      <!-- 问题头部 -->
      <div class="question-header">
        <div class="question-eyebrow">体质问卷 · 逐题作答</div>
        <div class="question-progress">
          <div class="progress-row">
            <span class="progress-text">第 {{ currentQuestionIndex + 1 }} 题 / 共 {{ totalQuestions }} 题</span>
            <span class="answered-count">已完成 {{ answeredCount }} 题</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
        </div>
        <h2 class="question-title">{{ question.question }}</h2>
        <p class="question-tip">请选择最符合您近一段时间身体状态的选项，选择后系统会自动进入下一题。</p>
      </div>

      <!-- 选项列表 -->
      <div class="options-container">
        <div
          v-for="(option, index) in question.options"
          :key="index"
          class="option-item"
          :class="{
            selected: selectedOption === index,
            disabled: disabled
          }"
          @click="selectOption(index)"
        >
          <div class="option-radio">
            <div class="radio-circle" :class="{ checked: selectedOption === index }"></div>
          </div>
          <div class="option-content">
            <div class="option-text">{{ option.text }}</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="question-actions">
        <button class="btn btn-ghost" @click="backToMode" :disabled="disabled">
          返回
        </button>

        <button
          v-if="currentQuestionIndex > 0"
          class="btn btn-ghost"
          @click="previousQuestion"
          :disabled="disabled"
        >
          上一题
        </button>

        <button
          v-if="isLastQuestion"
          class="btn btn-primary"
          @click="submitQuestionnaire"
          :disabled="disabled || !isAllAnswered"
        >
          提交测评
        </button>

        <div v-else class="auto-next-hint">
          {{ selectedOption === null ? '答完本题后自动进入下一题' : '正在进入下一题...' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questions: {
    type: Array,
    required: true
  },
  currentQuestionIndex: {
    type: Number,
    required: true
  },
  answers: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['answer', 'next', 'previous', 'back'])

const selectedOption = ref(null)
let autoNextTimer = null

// 计算属性
const totalQuestions = computed(() => props.questions.length)
const answeredCount = computed(() => props.answers.filter(answer => answer !== null && answer !== undefined).length)
const progressPercentage = computed(() => {
  if (totalQuestions.value === 0) return 0
  return (answeredCount.value / totalQuestions.value) * 100
})
const isLastQuestion = computed(() => props.currentQuestionIndex === totalQuestions.value - 1)
const isAllAnswered = computed(() => answeredCount.value === totalQuestions.value)

// 监听问题变化，重置选择
watch(
  () => props.currentQuestionIndex,
  () => {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer)
      autoNextTimer = null
    }
    const currentAnswer = props.answers[props.currentQuestionIndex]
    selectedOption.value =
      currentAnswer && currentAnswer.optionIndex !== undefined ? currentAnswer.optionIndex : null
  },
  { immediate: true }
)

// 选择选项
const selectOption = optionIndex => {
  if (props.disabled) return

  selectedOption.value = optionIndex
  const answer = {
    questionId: props.question.id,
    optionIndex
  }
  emit('answer', answer)

  if (!isLastQuestion.value) {
    autoNextTimer = setTimeout(() => {
      emit('next')
    }, 280)
  }
}

const submitQuestionnaire = () => {
  if (props.disabled || !isAllAnswered.value) return
  emit('next')
}

// 上一题
const previousQuestion = () => {
  if (props.disabled) return
  emit('previous')
}

const backToMode = () => {
  if (props.disabled) return
  emit('back')
}

onBeforeUnmount(() => {
  if (autoNextTimer) {
    clearTimeout(autoNextTimer)
  }
})
</script>

<style scoped>
.constitution-question {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.content-main {
  position: relative;
  overflow: hidden;
  padding: clamp(24px, 5vw, 48px);
  background:
    radial-gradient(circle at top left, rgba(104, 145, 90, 0.16), transparent 34%),
    linear-gradient(145deg, var(--color-bg-primary), var(--color-bg-secondary));
  border: 1px solid var(--color-border-light);
  border-radius: 28px;
  box-shadow: 0 24px 70px rgba(44, 66, 40, 0.12);
}

.content-main::before {
  content: '';
  position: absolute;
  inset: 14px;
  pointer-events: none;
  border: 1px solid rgba(104, 145, 90, 0.12);
  border-radius: 22px;
}

/* 问题头部 */
.question-header {
  position: relative;
  z-index: 1;
  margin-bottom: var(--spacing-xl);
}

.question-eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary-dark);
  background: var(--color-primary-alpha);
  border: 1px solid rgba(104, 145, 90, 0.18);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: 0.08em;
}

.question-progress {
  margin-bottom: var(--spacing-lg);
}

.progress-row {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.progress-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.answered-count {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: var(--font-semibold);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(104, 145, 90, 0.12);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width 0.42s var(--ease-out);
}

.question-title {
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.question-tip {
  margin: var(--spacing-sm) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

/* 选项容器 */
.options-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(104, 145, 90, 0.16);
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.22s var(--ease-out);
  backdrop-filter: blur(10px);
}

.option-item:hover:not(.disabled) {
  background: var(--color-bg-primary);
  border-color: rgba(104, 145, 90, 0.42);
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(44, 66, 40, 0.1);
}

.option-item.selected {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
  box-shadow: 0 16px 36px rgba(104, 145, 90, 0.18);
}

.option-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.option-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2px; /* 对齐文本 */
  flex-shrink: 0;
}

.radio-circle {
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-full);
  position: relative;
  transition: all var(--transition-base) var(--ease-out);
}

.radio-circle.checked {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.radio-circle.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--color-text-inverse);
  border-radius: var(--radius-full);
}

.option-content {
  flex: 1;
}

.option-text {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
  font-weight: var(--font-medium);
}

/* 操作按钮 */
.question-actions {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.question-actions .btn {
  min-width: 120px;
}

.auto-next-hint {
  margin-left: auto;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

/* 响应式 */
@media (max-width: 768px) {
  .constitution-question {
    padding: var(--spacing-md);
  }

  .question-title {
    font-size: var(--text-lg);
  }

  .option-item {
    padding: var(--spacing-md);
  }

  .option-text {
    font-size: var(--text-sm);
  }

  .question-actions {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .question-actions .btn {
    width: 100%;
    min-width: auto;
  }

  .auto-next-hint {
    margin-left: 0;
    text-align: center;
  }

  .progress-row {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}

</style>
