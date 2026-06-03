<template>
  <div
    class="option-item"
    :class="{ selected: modelValue }"
    @click="$emit('update:modelValue', true)"
  >
    <div class="option-radio">
      <div class="radio-circle" :class="{ checked: modelValue }"></div>
    </div>
    <div class="option-content">
      <span class="option-label">{{ option.label }}</span>
      <span class="option-text">{{ option.text }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  option: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.option-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-out);
}

.option-item:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-medium);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.option-item.selected {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.option-radio {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-circle {
  width: 20px;
  height: 20px;
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.option-label {
  font-weight: var(--font-semibold);
  color: var(--color-primary);
  font-size: var(--text-sm);
}

.option-text {
  color: var(--color-text-primary);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}
</style>
