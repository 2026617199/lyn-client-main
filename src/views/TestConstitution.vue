<template>
  <div class="test-page">
    <h1>体质设置功能测试</h1>

    <div class="test-section">
      <h2>API测试</h2>
      <button @click="testGetConstitutions" class="btn btn-primary">测试获取体质列表</button>
      <button @click="testSetConstitution" class="btn btn-primary">测试设置体质</button>
      <button @click="testCalculateResult" class="btn btn-primary">测试计算逻辑</button>
    </div>

    <div class="test-section">
      <h2>当前状态</h2>
      <pre>{{ JSON.stringify(currentState, null, 2) }}</pre>
    </div>

    <div class="test-section" v-if="testResult">
      <h2>测试结果</h2>
      <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { constitutionApi } from '@/api'
import {
  constitutionQuestions,
  calculateConstitution,
  generateQuestionnaireQuestions
} from '@/data/constitutionQuestions'

const userStore = useUserStore()

const currentState = ref({})
const testResult = ref(null)

const testGetConstitutions = async () => {
  try {
    const response = await constitutionApi.getConstitutions()
    testResult.value = response
    console.log('体质列表:', response)
  } catch (error) {
    console.error('获取体质列表失败:', error)
    testResult.value = { error: error.message }
  }
}

const testSetConstitution = async () => {
  try {
    const success = await userStore.setConstitution('qi_deficiency', 'manual')
    testResult.value = { success, constitution: userStore.constitution }
    console.log('设置体质结果:', success)
  } catch (error) {
    console.error('设置体质失败:', error)
    testResult.value = { error: error.message }
  }
}

const testCalculateResult = () => {
  const sampleQuestions = generateQuestionnaireQuestions({ count: 50 })
  const mockAnswers = [
    { questionId: 1, optionIndex: 1 }, // 容易疲劳
    { questionId: 2, optionIndex: 0 }, // 怕冷
    { questionId: 3, optionIndex: 1 }, // 面色苍白
    { questionId: 4, optionIndex: 2 }, // 体型偏胖
    { questionId: 5, optionIndex: 1 } // 食欲不振
  ]

  const result = calculateConstitution(mockAnswers)
  testResult.value = {
    ...result,
    totalQuestions: constitutionQuestions.length,
    sampledQuestions: sampleQuestions.length
  }
  console.log('计算结果:', result)
}

// 更新当前状态
const updateCurrentState = () => {
  currentState.value = {
    sessionId: userStore.sessionId,
    constitution: userStore.constitution,
    hasConstitution: userStore.hasConstitution,
    questionsCount: constitutionQuestions.length
  }
}

// 监听状态变化
import { watch } from 'vue'
watch([() => userStore.sessionId, () => userStore.constitution], updateCurrentState, {
  immediate: true
})
</script>

<style scoped>
.test-page {
  padding: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.test-section h2 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--spacing-md);
}

.test-section .btn {
  margin-right: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

pre {
  background: var(--color-bg-tertiary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}
</style>
