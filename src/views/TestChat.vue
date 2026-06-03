<template>
  <div class="test-page">
    <div class="container">
      <h1>Chat Store 测试页面</h1>
      
      <div class="test-section">
        <h2>Store 状态</h2>
        <pre>{{ storeInfo }}</pre>
      </div>

      <div class="test-section">
        <h2>方法测试</h2>
        <button @click="testSendMessage" class="btn btn-primary">
          测试 sendMessage
        </button>
        <button @click="testSendStreamMessage" class="btn btn-accent">
          测试 sendStreamMessage
        </button>
      </div>

      <div class="test-section">
        <h2>测试结果</h2>
        <pre>{{ testResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()
const testResult = ref('')

const storeInfo = computed(() => {
  return {
    hasStore: !!chatStore,
    methods: Object.keys(chatStore).filter(key => typeof chatStore[key] === 'function'),
    hasSendMessage: typeof chatStore.sendMessage === 'function',
    hasSendStreamMessage: typeof chatStore.sendStreamMessage === 'function'
  }
})

const testSendMessage = () => {
  testResult.value = 'Testing sendMessage...\n'
  testResult.value += `Type: ${typeof chatStore.sendMessage}\n`
  testResult.value += `Exists: ${!!chatStore.sendMessage}\n`
  
  if (chatStore.sendMessage) {
    testResult.value += 'sendMessage method exists! ✅\n'
  } else {
    testResult.value += 'sendMessage method NOT found! ❌\n'
  }
}

const testSendStreamMessage = () => {
  testResult.value = 'Testing sendStreamMessage...\n'
  testResult.value += `Type: ${typeof chatStore.sendStreamMessage}\n`
  testResult.value += `Exists: ${!!chatStore.sendStreamMessage}\n`
  
  if (chatStore.sendStreamMessage) {
    testResult.value += 'sendStreamMessage method exists! ✅\n'
  } else {
    testResult.value += 'sendStreamMessage method NOT found! ❌\n'
    testResult.value += '\nAvailable methods:\n'
    testResult.value += Object.keys(chatStore)
      .filter(key => typeof chatStore[key] === 'function')
      .join('\n')
  }
}

onMounted(() => {
  console.log('Chat Store:', chatStore)
  console.log('sendStreamMessage:', chatStore.sendStreamMessage)
  console.log('All keys:', Object.keys(chatStore))
})
</script>

<style scoped>
.test-page {
  padding: var(--spacing-3xl);
  min-height: 100vh;
}

.test-section {
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-xl);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
}

.test-section h2 {
  margin-bottom: var(--spacing-lg);
}

pre {
  background: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

button {
  margin-right: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}
</style>
