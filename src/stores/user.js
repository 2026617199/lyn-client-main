import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sessionApi, constitutionApi, authApi } from '../api'

export const useUserStore = defineStore('user', () => {
  // 从localStorage恢复状态
  const getStoredUserInfo = () => {
    try {
      const stored = localStorage.getItem('userInfo')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to parse userInfo from localStorage:', error)
      return null
    }
  }

  const getStoredConstitution = () => {
    try {
      const stored = localStorage.getItem('constitution')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to parse constitution from localStorage:', error)
      return null
    }
  }

  const getStoredConstitutionInfo = () => {
    try {
      const stored = localStorage.getItem('constitutionInfo')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to parse constitutionInfo from localStorage:', error)
      return null
    }
  }

  // 状态
  const sessionId = ref(localStorage.getItem('sessionId') || null)
  const userInfo = ref(getStoredUserInfo())
  const constitution = ref(getStoredConstitution())
  const constitutionInfo = ref(getStoredConstitutionInfo())
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const isLoggedIn = computed(() => !!sessionId.value)
  const isRegisteredUser = computed(() => userInfo.value?.userType === 'registered')
  const isAdmin = computed(
    () => userInfo.value?.role === 'admin' && userInfo.value?.userType === 'admin'
  )
  const hasConstitution = computed(() => !!constitution.value?.type)
  const username = computed(() => {
    if (isAdmin.value) return userInfo.value?.username || '管理员'
    return userInfo.value?.username === 'admin' ? '用户' : userInfo.value?.username || '用户'
  })

  // 初始化会话（仅恢复已有会话，不创建新会话）
  const initSession = async () => {
    try {
      // 如果已有sessionId，尝试获取会话信息
      if (sessionId.value) {
        try {
          loading.value = true
          const response = await authApi.getCurrentUser()
          if (response.code === 0) {
            console.log('Session restored using /api/auth/me:', response.data)
            userInfo.value = response.data.user
            constitution.value = response.data.user.constitution

            // 保存到localStorage
            if (userInfo.value) {
              localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
            }
            if (constitution.value) {
              localStorage.setItem('constitution', JSON.stringify(constitution.value))
            }

            // 如果有体质，获取体质详情
            if (constitution.value?.type) {
              await fetchUserConstitution()
            }
            return true
          }
        } catch (err) {
          console.warn('Session not found or expired, clearing local storage')
          // 会话无效，清除本地存储
          clearSession()
        }
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // 创建新会话
  const createSession = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await sessionApi.createSession()
      console.log('Create session response:', response.code, response.data)
      if (response.code === 0) {
        sessionId.value = response.data.sessionId
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution

        // 保存到localStorage
        localStorage.setItem('sessionId', sessionId.value)
        if (userInfo.value) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
        if (constitution.value) {
          localStorage.setItem('constitution', JSON.stringify(constitution.value))
        }
      }
    } catch (err) {
      error.value = err.message
      console.error('Failed to create session:', err)
    } finally {
      loading.value = false
    }
  }

  // 用户注册
  const register = async data => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.register(data.username, data.password)
      if (response.code === 0) {
        // 注册成功后自动登录
        sessionId.value = response.data.sessionId
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution

        // 保存到localStorage
        localStorage.setItem('sessionId', sessionId.value)
        if (userInfo.value) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
        if (constitution.value) {
          localStorage.setItem('constitution', JSON.stringify(constitution.value))
        }

        return response.data
      } else {
        throw new Error(response.message || '注册失败')
      }
    } catch (err) {
      error.value = err.message || err.response?.data?.message || '注册失败'
      console.error('Failed to register:', err)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  // 用户登录
  const login = async data => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.login(data.username, data.password)
      if (response.code === 0) {
        sessionId.value = response.data.sessionId
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution

        // 保存到localStorage
        localStorage.setItem('sessionId', sessionId.value)
        if (userInfo.value) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
        if (constitution.value) {
          localStorage.setItem('constitution', JSON.stringify(constitution.value))
        }

        return response.data
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (err) {
      error.value = err.message || err.response?.data?.message || '登录失败'
      console.error('Failed to login:', err)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  // 用户登出
  const logout = async () => {
    try {
      if (sessionId.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Failed to logout:', err)
    } finally {
      // 无论请求是否成功，都清除本地状态
      clearSession()
    }
  }

  // 获取当前用户信息
  const fetchUserInfo = async () => {
    if (!sessionId.value) return null

    try {
      const response = await authApi.getCurrentUser()
      if (response.code === 0) {
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution

        // 保存到localStorage
        if (userInfo.value) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
        if (constitution.value) {
          localStorage.setItem('constitution', JSON.stringify(constitution.value))
        }

        return response.data.user
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err)
      return null
    }
  }

  // 修改密码
  const changePassword = async (currentPassword, newPassword) => {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.changePassword(currentPassword, newPassword)
      if (response.code === 0) {
        return { success: true, message: '密码修改成功' }
      } else {
        return { success: false, message: response.message || '密码修改失败' }
      }
    } catch (err) {
      error.value = err.message || err.data?.message || '密码修改失败'
      console.error('Failed to change password:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // 刷新会话
  const refreshSession = async () => {
    if (!sessionId.value) return false

    try {
      const response = await authApi.refreshSession()
      return response.code === 0
    } catch (err) {
      console.error('Failed to refresh session:', err)
      return false
    }
  }

  // 检查登录状态
  const checkAuthStatus = async () => {
    if (!sessionId.value) return false

    try {
      const response = await authApi.checkAuthStatus()
      if (response.code === 0) {
        userInfo.value = response.data.user
        constitution.value = response.data.user.constitution

        // 保存到localStorage
        if (userInfo.value) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
        if (constitution.value) {
          localStorage.setItem('constitution', JSON.stringify(constitution.value))
        }

        return response.data.authenticated
      }
      return false
    } catch (err) {
      console.error('Failed to check auth status:', err)
      return false
    }
  }

  // 设置体质
  const setConstitution = async (constitutionType, method = 'manual') => {
    if (!sessionId.value) {
      console.warn('No session found, cannot set constitution')
      return false
    }

    try {
      loading.value = true
      error.value = null
      const response = await constitutionApi.setUserConstitution(
        sessionId.value,
        constitutionType,
        method
      )
      if (response.code === 0) {
        // 直接设置体质类型，因为API可能不返回完整对象
        constitution.value = {
          type: constitutionType,
          diagnosisMethod: method,
          diagnosedAt: new Date().toISOString()
        }

        // 保存到localStorage
        if (constitution.value) {
          localStorage.setItem('constitution', JSON.stringify(constitution.value))
        }

        return true
      }
      return false
    } catch (err) {
      error.value = err.message
      console.error('Failed to set constitution:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // 获取体质详情
  const fetchConstitutionInfo = async type => {
    try {
      const response = await constitutionApi.getConstitutionByType(type)
      if (response.code === 0) {
        constitutionInfo.value = response.data

        // 保存到localStorage
        if (constitutionInfo.value) {
          localStorage.setItem('constitutionInfo', JSON.stringify(constitutionInfo.value))
        }
      }
    } catch (err) {
      console.error('Failed to fetch constitution info:', err)
    }
  }

  // 获取用户体质信息（通过会话ID）
  const fetchUserConstitution = async () => {
    if (!sessionId.value) {
      console.warn('No session found, cannot fetch user constitution')
      return null
    }

    try {
      const response = await constitutionApi.getUserConstitution(sessionId.value)
      if (response.code === 0) {
        constitution.value = response.data.constitution
        constitutionInfo.value = response.data.constitutionInfo

        // 保存到localStorage
        if (constitution.value) {
          localStorage.setItem('constitution', JSON.stringify(constitution.value))
        }
        if (constitutionInfo.value) {
          localStorage.setItem('constitutionInfo', JSON.stringify(constitutionInfo.value))
        }

        return response.data
      }
      return null
    } catch (err) {
      console.error('Failed to fetch user constitution:', err)
      return null
    }
  }

  // 清除会话
  const clearSession = () => {
    sessionId.value = null
    userInfo.value = null
    constitution.value = null
    constitutionInfo.value = null

    // 清除所有相关的localStorage数据
    localStorage.removeItem('sessionId')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('constitution')
    localStorage.removeItem('constitutionInfo')
  }

  return {
    // 状态
    sessionId,
    userInfo,
    constitution,
    constitutionInfo,
    loading,
    error,
    // 计算属性
    isLoggedIn,
    isRegisteredUser,
    isAdmin,
    hasConstitution,
    username,
    user: userInfo,
    // 方法
    initSession,
    createSession,
    register,
    login,
    logout,
    fetchUserInfo,
    changePassword,
    refreshSession,
    checkAuthStatus,
    setConstitution,
    fetchConstitutionInfo,
    fetchUserConstitution,
    clearSession
  }
})
