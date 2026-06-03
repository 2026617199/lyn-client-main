import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页 - 智膳 - 中医体质膳食推荐系统'
    }
  },
  {
    path: '/ai-diagnosis',
    name: 'AiDiagnosis',
    component: () => import('../views/AiDiagnosis.vue'),
    meta: {
      title: '养生小助手 - 中医体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/constitution-diagnosis',
    name: 'ConstitutionDiagnosis',
    component: () => import('../views/ConstitutionDiagnosis.vue'),
    meta: {
      title: '体质诊断 - 中医体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/taste-optimization',
    name: 'TasteOptimization',
    component: () => import('../views/TasteOptimization.vue'),
    meta: {
      title: '口味调优 - 中医体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/recipe-recommendation',
    name: 'RecipeRecommendation',
    component: () => import('../views/RecipeRecommendation.vue'),
    meta: {
      title: '至膳推荐 - 中医体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/dish-management',
    name: 'DishManagement',
    component: () => import('../views/DishManagement.vue'),
    meta: {
      title: '菜谱管理 - 中医体质膳食推荐系统',
      requiresAuth: true, // 需要登录
      requiresAdmin: true // 需要管理员权限
    }
  },
  {
    path: '/ai-add-dish',
    name: 'AiAddDish',
    component: () => import('../views/AiAddDish.vue'),
    meta: {
      title: 'AI生成菜谱 - 中医体质膳食推荐系统',
      requiresAuth: true, // 需要登录
      requiresAdmin: true // 需要管理员权限
    }
  },
  {
    path: '/ai-recipe-recommend',
    name: 'AiRecipeRecommend',
    component: () => import('../views/AiRecipeRecommend.vue'),
    meta: {
      title: 'AI智能推荐 - 中医体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  // 认证相关路由 - 使用全屏布局
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '用户登录 - 中医体质膳食推荐系统',
      hideNavbar: true // 隐藏导航栏
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: '用户注册 - 中医体质膳食推荐系统',
      hideNavbar: true // 隐藏导航栏
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: '个人信息 - 中医体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/preference-settings',
    name: 'PreferenceSettings',
    component: () => import('../views/PreferenceSettings.vue'),
    meta: {
      title: '偏好设置 - 中医体质膳食推荐系统',
      requiresAuth: true // 需要登录
    }
  },
  {
    path: '/test-chat',
    name: 'TestChat',
    component: () => import('../views/TestChat.vue'),
    meta: {
      title: '测试页面 - 中医体质膳食推荐系统'
    }
  },
  {
    path: '/test-constitution',
    name: 'TestConstitution',
    component: () => import('../views/TestConstitution.vue'),
    meta: {
      title: '体质设置测试 - 中医体质膳食推荐系统'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫：设置页面标题和权限控制
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '智膳 - 中医体质膳食推荐系统'

  // 动态导入用户store，避免循环依赖
  const { useUserStore } = await import('../stores/user')
  const userStore = useUserStore()

  // 如果localStorage中有sessionId但userInfo为空，尝试恢复会话（仅在需要时）
  if (to.meta.requiresAuth && !userStore.isLoggedIn && localStorage.getItem('sessionId')) {
    await userStore.initSession()
  }

  // 检查登录状态
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 需要登录但未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存重定向路径
      })
      return
    }

    // 检查管理员权限
    if (to.meta.requiresAdmin && !userStore.isAdmin) {
      // 需要管理员权限但不是管理员，跳转到首页并提示
      next({
        path: '/ai-diagnosis',
        replace: true
      })
      return
    }
  }

  next()
})

export default router
