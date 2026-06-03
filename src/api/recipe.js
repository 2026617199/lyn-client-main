import request, { aiRequest } from './request'

/**
 * 菜谱相关API
 */
export const recipeApi = {
  /**
   * 获取菜谱列表
   * @param {Object} params - 查询参数
   * @param {string} params.category - 分类筛选 (recommended/warming/cooling/quick)
   * @param {string} params.keyword - 搜索关键词
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.sortBy - 排序字段
   * @param {string} params.sortOrder - 排序方向
   * @param {Object} params.filters - 筛选条件
   */
  getRecipes(params = {}) {
    return request.get('/recipes', { params })
  },

  /**
   * 获取菜谱详情
   * @param {string} id - 菜谱ID
   */
  getRecipeById(id) {
    return request.get(`/recipes/${id}`)
  },

  /**
   * 获取推荐菜谱
   * @param {number} limit - 返回数量
   */
  getRecommendedRecipes(limit = 6) {
    return request.get('/recipes/recommend', { params: { limit } })
  },

  /**
   * 获取推荐菜谱（支持更多参数）
   * @param {Object} params - 推荐参数
   */
  getRecommendations(params = {}) {
    return request.get('/recipes/recommend', { params })
  },

  /**
  * AI智能推荐菜谱
   * @param {Object} data - 推荐参数
   * @param {string} data.mealType - 用餐类型
   * @param {number} data.count - 推荐数量
   * @param {string[]} data.excludeIngredients - 排除食材
   * @param {string} data.specialRequirements - 特殊要求
   */
  getAiRecommendations(data) {
    return aiRequest.post('/recipes/ai-recommend', data)
  },

  /**
   * 获取菜谱分类统计
   */
  getCategories() {
    return request.get('/recipes/categories')
  },

  /**
   * 创建新菜谱
   * @param {Object} data - 菜谱数据
   */
  createRecipe(data) {
    return request.post('/recipes', data)
  },

  /**
   * 更新菜谱
   * @param {string} id - 菜谱ID
   * @param {Object} data - 菜谱数据
   */
  updateRecipe(id, data) {
    return request.put(`/recipes/${id}`, data)
  },

  /**
   * 删除菜谱
   * @param {string} id - 菜谱ID
   */
  deleteRecipe(id) {
    return request.delete(`/recipes/${id}`)
  },

  /**
   * AI生成菜谱
   * @param {Object} data - 生成参数
   * @param {string} data.foodName - 食品名称
   * @param {string} data.targetConstitution - 目标体质
   * @param {string} data.specialRequirements - 特殊要求
   */
  generateRecipeByAI(data) {
    return aiRequest.post('/recipes/generate', data)
  },

  /**
   * 保存AI生成的菜谱
   * @param {Object} data - 菜谱数据
   */
  saveAIGeneratedRecipe(data) {
    return aiRequest.post('/recipes/save-generated', data)
  },

  /**
   * 收藏菜谱
   * @param {string} recipeId - 菜谱ID
   */
  addFavorite(recipeId) {
    return request.post(`/recipes/${recipeId}/favorite`)
  },

  /**
   * 取消收藏菜谱
   * @param {string} recipeId - 菜谱ID
   */
  removeFavorite(recipeId) {
    return request.delete(`/recipes/${recipeId}/favorite`)
  },

  /**
   * 获取收藏列表
   * @param {Object} params - 查询参数
   */
  getFavorites(params = {}) {
    return request.get('/recipes/favorites', { params })
  },

  /**
   * 分享菜谱
   * @param {string} recipeId - 菜谱ID
   */
  shareRecipe(recipeId) {
    return request.post(`/recipes/${recipeId}/share`)
  }
}

export default recipeApi

// 导出单独的函数以便直接使用
export const {
  getRecipes,
  getRecipeById,
  getRecommendedRecipes,
  getRecommendations,
  getAiRecommendations,
  getCategories,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  generateRecipeByAI,
  saveAIGeneratedRecipe,
  addFavorite,
  removeFavorite,
  getFavorites,
  shareRecipe
} = recipeApi
