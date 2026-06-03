<template>
  <div class="loading-spinner" :class="sizeClass">
    <div class="spinner-ring"></div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  text: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => `size-${props.size}`)
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.spinner-ring {
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.size-sm .spinner-ring {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.size-md .spinner-ring {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.size-lg .spinner-ring {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

.loading-text {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
