import request from './request'
import { authApi } from './auth'

/**
 * 认证相关API
 */
export { authApi }

/**
 * 会话相关API
 */
export const sessionApi = {
  // 创建新会话
  createSession() {
    return request.post('/session')
  },

  // 获取会话信息
  getSession(sessionId) {
    return request.get(`/session/${sessionId}`)
  },

  // 删除会话
  deleteSession(sessionId) {
    return request.delete(`/session/${sessionId}`)
  }
}

/**
 * 偏好相关API
 */
export const preferenceApi = {
  // 获取用户偏好
  getPreference() {
    return request.get('/preferences')
  },

  // 更新用户偏好
  updatePreference(data) {
    return request.put('/preferences', data)
  },

  // 重置用户偏好
  resetPreference() {
    return request.delete('/preferences')
  }
}

/**
 * 体质相关API
 */
export const constitutionApi = {
  // 获取所有体质类型
  getConstitutions() {
    return request.get('/constitutions')
  },

  // 获取指定体质详情
  getConstitutionByType(type) {
    return request.get(`/constitutions/${type}`)
  },

  // 设置用户体质
  setUserConstitution(sessionId, constitutionType, diagnosisMethod = 'manual') {
    return request.put(`/session/${sessionId}/constitution`, {
      constitutionType,
      diagnosisMethod
    })
  },

  // 获取用户体质信息
  getUserConstitution(sessionId) {
    return request.get(`/session/${sessionId}/constitution`)
  }
}

/**
 * 菜谱相关API
 */
export const recipeApi = {
  // 获取菜谱列表
  getRecipes(params = {}) {
    return request.get('/recipes', { params })
  },

  // 获取菜谱详情
  getRecipeById(id) {
    return request.get(`/recipes/${id}`)
  },

  // 获取推荐菜谱
  getRecommendedRecipes(limit = 6) {
    return request.get('/recipes/recommend', { params: { limit } })
  },

  // 获取菜谱分类统计
  getCategories() {
    return request.get('/recipes/categories')
  },

  // 创建新菜谱
  createRecipe(data) {
    return request.post('/recipes', data)
  },

  // 更新菜谱
  updateRecipe(id, data) {
    return request.put(`/recipes/${id}`, data)
  },

  // 删除菜谱
  deleteRecipe(id) {
    return request.delete(`/recipes/${id}`)
  },

  // AI生成菜谱
  generateRecipeByAI(data) {
    return request.post('/recipes/generate', data)
  },

  // 保存AI生成的菜谱
  saveAIGeneratedRecipe(data) {
    return request.post('/recipes/save-generated', data)
  }
}

export default {
  authApi,
  sessionApi,
  preferenceApi,
  constitutionApi,
  recipeApi
}
