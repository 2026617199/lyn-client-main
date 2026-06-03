<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-container">
          <div class="modal-icon" :class="`modal-icon-${type}`">
            <span v-if="type === 'warning'">⚠</span>
            <span v-else-if="type === 'danger'">!</span>
            <span v-else-if="type === 'success'">✓</span>
            <span v-else>?</span>
          </div>
          
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>
          
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button 
              class="btn" 
              :class="confirmBtnClass"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  },
  type: {
    type: String,
    default: 'warning', // warning, danger, info, success
    validator: (val) => ['warning', 'danger', 'info', 'success'].includes(val)
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

const confirmBtnClass = computed(() => {
  return props.type === 'danger' ? 'btn-danger' : 'btn-primary'
})

const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44, 36, 22, 0.5);
  backdrop-filter: blur(var(--blur-sm));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
}

.modal-container {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-2xl);
}

.modal-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto var(--spacing-lg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
}

.modal-icon-warning {
  background: rgba(212, 165, 116, 0.15);
  color: var(--color-warning);
}

.modal-icon-danger {
  background: rgba(201, 112, 100, 0.15);
  color: var(--color-error);
}

.modal-icon-info {
  background: rgba(122, 159, 191, 0.15);
  color: var(--color-info);
}

.modal-icon-success {
  background: rgba(107, 159, 127, 0.15);
  color: var(--color-success);
}

.modal-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.modal-message {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-xl);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.modal-actions .btn {
  min-width: 100px;
}

.btn-danger {
  background: var(--color-error);
  color: var(--color-text-inverse);
}

.btn-danger:hover {
  background: #b8635a;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-base);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}
</style>
