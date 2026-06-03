import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recipeApi } from '../api/recipe.js'

export const useRecipeStore = defineStore('recipe', () => {
  // ========== 状态 ==========
  const recipes = ref([])
  const currentRecipe = ref(null)
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(true)

  // 筛选和分页状态
  const currentCategory = ref('recommended')
  const searchKeyword = ref('')
  const pagination = ref({
    page: 1,
    pageSize: 12,
    total: 0
  })

  // 收藏状态
  const favorites = ref(new Set())

  // AI智能推荐状态
  const aiRecommendLoading = ref(false)
  const aiRecommendedRecipes = ref([])
  const aiAnalysis = ref(null)
  const aiRecommendError = ref(null)
  const lastAiRecommendParams = ref(null)
  const aiRecommendForm = ref({
    mealType: 'dinner',
    count: 6,
    excludeIngredients: [],
    ingredientInput: '',
    specialRequirements: ''
  })
  let aiRecommendPromise = null

  // AI生成菜谱状态
  const aiGenerateLoading = ref(false)
  const aiGeneratedRecipes = ref([])
  const selectedGeneratedRecipes = ref([])
  const hasAiGenerated = ref(false)
  const aiGenerateError = ref(null)
  const lastAiGenerateParams = ref(null)
  let aiGeneratePromise = null

  // ========== 计算属性 ==========
  const isEmpty = computed(() => {
    return !loading.value && recipes.value.length === 0
  })

  const filteredRecipes = computed(() => {
    return recipes.value
  })

  // ========== 方法 ==========

  /**
   * 获取菜谱列表
   * @param {Object} params - 查询参数
   */
  const fetchRecipes = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = {
        page: params.page || pagination.value.page,
        pageSize: params.pageSize || pagination.value.pageSize,
        keyword: params.keyword || searchKeyword.value,
        category: params.category || currentCategory.value,
        sortBy: params.sortBy || 'matchScore',
        sortOrder: params.sortOrder || 'desc',
        ...params.filters
      }

      const response = await recipeApi.getRecipes(queryParams)

      if (response.code === 0) {
        const newRecipes = response.data.list || []

        // 如果是追加（加载更多），合并数据
        if (params.append) {
          recipes.value = [...recipes.value, ...newRecipes]
        } else {
          recipes.value = newRecipes
        }

        pagination.value = response.data.pagination || {
          page: queryParams.page,
          pageSize: queryParams.pageSize,
          total: newRecipes.length
        }

        hasMore.value = recipes.value.length < pagination.value.total

        return response.data
      } else {
        throw new Error(response.message || '获取菜谱失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('获取菜谱列表失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取菜谱详情
   * @param {string} id - 菜谱ID
   */
  const fetchRecipeDetail = async id => {
    loading.value = true
    error.value = null

    try {
      const response = await recipeApi.getRecipeById(id)

      if (response.code === 0) {
        currentRecipe.value = response.data

        // 更新列表中的菜谱数据
        const index = recipes.value.findIndex(recipe => recipe.id === id)
        if (index !== -1) {
          recipes.value[index] = { ...recipes.value[index], ...response.data }
        }

        return response.data
      } else {
        throw new Error(response.message || '获取菜谱详情失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('获取菜谱详情失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取推荐菜谱
   * @param {Object} params - 推荐参数
   */
  const fetchRecommendations = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await recipeApi.getRecommendations({
        limit: params.limit || 6,
        ...params
      })

      if (response.code === 0) {
        const recipeList = response.data.list || []
        // 设置到 recipes 状态中
        recipes.value = recipeList
        return recipeList
      } else {
        throw new Error(response.message || '获取推荐菜谱失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('获取推荐菜谱失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取AI智能推荐
   * @param {Object} params - AI推荐参数
   */
  const fetchAiRecommendations = async (params = {}) => {
    if (aiRecommendPromise) return aiRecommendPromise

    aiRecommendLoading.value = true
    aiRecommendError.value = null
    lastAiRecommendParams.value = params

    aiRecommendPromise = (async () => {
      const response = await recipeApi.getAiRecommendations({
        mealType: params.mealType || 'dinner',
        count: params.count || 6,
        excludeIngredients: params.excludeIngredients || [],
        specialRequirements: params.specialRequirements || '',
        ...params
      })

      if (response?.data) {
        aiRecommendedRecipes.value = response.data.list || []
        aiAnalysis.value = response.data.aiAnalysis || null
      }

      // 返回完整的API响应，让组件自己处理数据提取
      return response
    })()

    try {
      return await aiRecommendPromise
    } catch (err) {
      aiRecommendError.value = err.message
      console.error('AI推荐失败:', err)
      throw err
    } finally {
      aiRecommendLoading.value = false
      aiRecommendPromise = null
    }
  }

  const clearAiRecommendations = () => {
    if (aiRecommendLoading.value) return
    aiRecommendedRecipes.value = []
    aiAnalysis.value = null
    aiRecommendError.value = null
    lastAiRecommendParams.value = null
  }

  const updateAiRecommendForm = form => {
    aiRecommendForm.value = {
      ...aiRecommendForm.value,
      ...form,
      excludeIngredients: [...(form.excludeIngredients || aiRecommendForm.value.excludeIngredients || [])]
    }
  }

  const resetAiRecommendForm = () => {
    aiRecommendForm.value = {
      mealType: 'dinner',
      count: 6,
      excludeIngredients: [],
      ingredientInput: '',
      specialRequirements: ''
    }
  }

  /**
   * 获取个性化推荐
   */
  const fetchPersonalizedRecommendations = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await recipeApi.getRecommendations({
        limit: 6
      })

      if (response.code === 0) {
        const personalizedRecipes = response.data.list || []

        // 如果当前是推荐分类，更新列表
        if (currentCategory.value === 'recommended') {
          recipes.value = personalizedRecipes
        }

        return personalizedRecipes
      } else {
        throw new Error(response.message || '获取个性化推荐失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('获取个性化推荐失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取分类统计
   */
  const fetchCategories = async () => {
    try {
      const response = await recipeApi.getCategories()

      if (response.code === 0) {
        categories.value = response.data.categories || []
        return response.data.categories
      }
    } catch (err) {
      console.error('获取分类统计失败:', err)
      return []
    }
  }

  /**
   * 切换收藏状态
   * @param {string} recipeId - 菜谱ID
   * @param {boolean} isFavorited - 是否收藏
   */
  const toggleFavorite = async (recipeId, isFavorited) => {
    try {
      if (isFavorited) {
        favorites.value.add(recipeId)
        // 这里可以调用API添加收藏
        // await recipeApi.addFavorite(recipeId)
      } else {
        favorites.value.delete(recipeId)
        // 这里可以调用API取消收藏
        // await recipeApi.removeFavorite(recipeId)
      }
    } catch (err) {
      console.error('收藏操作失败:', err)
      throw err
    }
  }

  /**
   * 检查菜谱是否已收藏
   * @param {string} recipeId - 菜谱ID
   */
  const isFavorited = recipeId => {
    return favorites.value.has(recipeId)
  }

  /**
   * 分享菜谱
   * @param {string} recipeId - 菜谱ID
   */
  const shareRecipe = async recipeId => {
    try {
      // 这里可以调用API记录分享行为
      // await recipeApi.shareRecipe(recipeId)

      const recipe = recipes.value.find(r => r.id === recipeId)
      if (recipe) {
        const shareUrl = `${window.location.origin}/recipe/${recipeId}`

        if (navigator.share) {
          await navigator.share({
            title: recipe.name,
            text: recipe.description,
            url: shareUrl
          })
        } else {
          await navigator.clipboard.writeText(shareUrl)
          return { type: 'clipboard', url: shareUrl }
        }
      }
    } catch (err) {
      console.error('分享失败:', err)
      throw err
    }
  }

  /**
   * 加载更多
   */
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return

    try {
      await fetchRecipes({
        page: pagination.value.page + 1,
        append: true
      })
    } catch (err) {
      console.error('加载更多失败:', err)
    }
  }

  /**
   * 搜索菜谱
   * @param {string} keyword - 搜索关键词
   */
  const search = async keyword => {
    searchKeyword.value = keyword
    await fetchRecipes({
      keyword,
      page: 1
    })
  }

  /**
   * 重置状态
   */
  const reset = () => {
    recipes.value = []
    currentRecipe.value = null
    currentCategory.value = 'recommended'
    searchKeyword.value = ''
    pagination.value = {
      page: 1,
      pageSize: 12,
      total: 0
    }
    error.value = null
    hasMore.value = true
  }

  /**
   * 清除当前菜谱
   */
  const clearCurrentRecipe = () => {
    currentRecipe.value = null
  }

  /**
   * AI生成菜谱
   * @param {Object} params - 生成参数
   */
  const generateRecipeByAI = async params => {
    if (aiGeneratePromise) return aiGeneratePromise

    aiGenerateLoading.value = true
    aiGenerateError.value = null
    lastAiGenerateParams.value = params

    aiGeneratePromise = (async () => {
      const response = await recipeApi.generateRecipeByAI(params)

      if (response.code === 0) {
        const generated = Array.isArray(response.data) ? response.data : [response.data]
        aiGeneratedRecipes.value = generated
        selectedGeneratedRecipes.value = []
        hasAiGenerated.value = true
        return response.data
      } else {
        throw new Error(response.message || 'AI生成菜谱失败')
      }
    })()

    try {
      return await aiGeneratePromise
    } catch (err) {
      aiGenerateError.value = err.message
      console.error('AI生成菜谱失败:', err)
      throw err
    } finally {
      aiGenerateLoading.value = false
      aiGeneratePromise = null
    }
  }

  const clearAiGeneratedRecipes = () => {
    if (aiGenerateLoading.value) return
    aiGeneratedRecipes.value = []
    selectedGeneratedRecipes.value = []
    hasAiGenerated.value = false
    aiGenerateError.value = null
  }

  /**
   * 保存AI生成的菜谱
   * @param {Object} data - 菜谱数据
   */
  const saveAIGeneratedRecipe = async data => {
    loading.value = true
    error.value = null

    try {
      const response = await recipeApi.saveAIGeneratedRecipe(data)

      if (response.code === 0) {
        // 保存成功后刷新菜谱列表
        await fetchRecipes()
        return response.data
      } else {
        throw new Error(response.message || '保存菜谱失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('保存菜谱失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    recipes,
    currentRecipe,
    categories,
    loading,
    error,
    hasMore,
    currentCategory,
    searchKeyword,
    pagination,
    favorites,
    aiRecommendLoading,
    aiRecommendedRecipes,
    aiAnalysis,
    aiRecommendError,
    lastAiRecommendParams,
    aiRecommendForm,
    aiGenerateLoading,
    aiGeneratedRecipes,
    selectedGeneratedRecipes,
    hasAiGenerated,
    aiGenerateError,
    lastAiGenerateParams,

    // 计算属性
    isEmpty,
    filteredRecipes,

    // 方法
    fetchRecipes,
    fetchRecipeDetail,
    fetchRecommendations,
    fetchAiRecommendations,
    clearAiRecommendations,
    updateAiRecommendForm,
    resetAiRecommendForm,
    fetchPersonalizedRecommendations,
    fetchCategories,
    toggleFavorite,
    isFavorited,
    shareRecipe,
    loadMore,
    search,
    reset,
    clearCurrentRecipe,
    generateRecipeByAI,
    clearAiGeneratedRecipes,
    saveAIGeneratedRecipe
  }
})

export default useRecipeStore
