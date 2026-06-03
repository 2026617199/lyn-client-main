/**
 * Toast 工具函数
 * 用于在组件中方便地调用 toast 提示
 */

import { inject } from 'vue'

export function useToast() {
  const toast = inject('toast')
  
  if (!toast) {
    console.warn('Toast not provided. Make sure Toast component is mounted in App.vue')
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {}
    }
  }
  
  return toast
}
