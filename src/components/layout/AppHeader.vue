<template>
  <header class="app-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo 和品牌 -->
        <router-link to="/" class="brand">
          <div class="brand-icon">
            <img src="@/png/logo.png" alt="Logo" />
          </div>
          <span class="brand-name">中医体质膳食推荐系统</span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="nav-menu" v-if="!isMobile">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            active-class="is-active"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <!-- 用户操作区 -->
        <div class="header-actions">
          <template v-if="userStore.sessionId">
            <div class="user-info">
              <span class="user-badge" v-if="userStore.isAdmin">管理员</span>
              <button class="btn btn-ghost btn-sm" @click="handleProfile">
                {{ userStore.username }}
              </button>
            </div>
            <button class="btn btn-secondary btn-sm" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-ghost btn-sm">登录</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm">注册</router-link>
          </template>

          <!-- 移动端菜单按钮 -->
          <button
            v-if="isMobile"
            class="menu-toggle"
            @click="toggleMobileMenu"
            aria-label="Toggle menu"
          >
            <span class="menu-icon"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition name="slide-down">
      <div v-if="isMobile && showMobileMenu" class="mobile-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="mobile-menu-item"
          @click="closeMobileMenu"
        >
          {{ item.label }}
        </router-link>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const isScrolled = ref(false)
const isMobile = ref(false)
const showMobileMenu = ref(false)

const menuItems = computed(() => {
  if (!userStore.isLoggedIn && !userStore.sessionId) return []

  const items = [
    { path: '/ai-diagnosis', label: '养生咨询' },
    { path: '/constitution-diagnosis', label: '体质设置' },
    { path: '/preference-settings', label: '偏好设置' },
    { path: '/recipe-recommendation', label: '菜谱浏览' },
    { path: '/ai-recipe-recommend', label: '智能推荐' }
  ]

  // 管理员才能看到菜谱管理
  if (userStore.isAdmin) {
    items.push({ path: '/dish-management', label: '菜谱管理' })
  }

  return items
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleProfile = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', checkMobile)
  checkMobile()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--color-bg-elevated);
  border-bottom: 1px solid transparent;
  transition: all var(--transition-base);
  z-index: var(--z-sticky);
}

.app-header.is-scrolled {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(var(--blur-md));
  border-bottom-color: var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
}

/* 品牌 */
.brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  transition: all var(--transition-base);
}

.brand:hover {
  color: var(--color-primary);
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.brand-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-name {
  letter-spacing: 0.05em;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.nav-item {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  position: relative;
}

.nav-item:hover {
  color: var(--color-primary);
  background: var(--color-bg-secondary);
}

.nav-item.is-active {
  color: var(--color-primary);
}

.nav-item.is-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}

/* 用户操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.user-info .btn-ghost {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-xs);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-full);
}

.user-info .btn-ghost:hover {
  background: var(--color-primary-dark);
}

.user-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-full);
}

/* 移动端菜单按钮 */
.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  margin-left: var(--spacing-sm);
}

.menu-icon {
  position: relative;
  width: 20px;
  height: 2px;
  background: var(--color-text-primary);
  transition: all var(--transition-base);
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-text-primary);
  transition: all var(--transition-base);
}

.menu-icon::before {
  top: -6px;
}

.menu-icon::after {
  bottom: -6px;
}

/* 移动端菜单 */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md);
}

.mobile-menu-item {
  display: block;
  padding: var(--spacing-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.mobile-menu-item:hover {
  color: var(--color-primary);
  background: var(--color-bg-secondary);
}

/* 过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-base);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
}
</style>
