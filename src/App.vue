<template>
  <div id="app">
    <AppHeader v-if="!hideHeader" />
    
    <main class="main-content" :class="{ 'with-header': !hideHeader }">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <AppFooter v-if="!hideHeader" />
    
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import Toast from '@/components/common/Toast.vue'

const route = useRoute()
const toastRef = ref(null)

// 根据路由元信息决定是否隐藏导航栏
const hideHeader = computed(() => route.meta.hideNavbar)

// 提供全局 toast 方法
provide('toast', {
  success: (msg, duration) => toastRef.value?.success(msg, duration),
  error: (msg, duration) => toastRef.value?.error(msg, duration),
  warning: (msg, duration) => toastRef.value?.warning(msg, duration),
  info: (msg, duration) => toastRef.value?.info(msg, duration)
})
</script>

<style>
/* 导入全局样式 */
@import './styles/variables.css';
@import './styles/reset.css';
@import './styles/global.css';
@import './styles/animations.css';

/* 主内容区域 */
.main-content {
  flex: 1;
  min-height: 100vh;
}

.main-content.with-header {
  padding-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all var(--transition-base);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
