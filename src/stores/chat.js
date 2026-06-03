import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  sendMessage as sendMessageApi,
  sendMessageStream as sendMessageStreamApi
} from '../api/chat.js'

export const useChatStore = defineStore('chat', () => {
  // 聊天消息列表
  const messages = ref([])

  // 是否正在加载
  const loading = ref(false)

  // 当前正在输入的回复（用于流式显示）
  const currentReply = ref('')

  // 当前流式任务，避免页面切换后重复发起
  const streamTask = ref(null)

  // 计算属性：是否有消息
  const hasMessages = computed(() => messages.value.length > 0)

  // 格式化历史记录（用于发送给 API）
  const formattedHistory = computed(() => {
    return messages.value.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  })

  /**
   * 添加消息
   * @param {'user' | 'assistant'} role - 角色
   * @param {string} content - 内容
   */
  const addMessage = (role, content) => {
    messages.value.push({
      id: Date.now(),
      role,
      content,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * 发送消息（普通模式）
   * @param {string} content - 消息内容
   * @param {Array} history - 历史记录
   */
  const sendMessage = async (content, history = []) => {
    if (!content.trim() || loading.value) {
      console.warn('消息为空或正在加载中')
      return null
    }

    loading.value = true

    try {
      console.log('发送消息到 AI:', { content, historyLength: history.length })
      const response = await sendMessageApi(content, history)
      console.log('AI 响应:', response)

      // API 返回的数据结构是 { code, message, data: { reply } }
      // 响应拦截器已经返回了 response.data，所以这里的 response 就是后端返回的完整对象
      if (response && response.code === 0 && response.data) {
        return response
      } else {
        throw new Error(response?.message || 'AI 响应格式错误')
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      // 如果是网络错误或其他错误，抛出更友好的错误信息
      if (error.message === 'Network Error') {
        throw new Error('网络连接失败，请检查网络设置')
      } else if (error.response) {
        throw new Error(error.response.data?.message || '服务器错误')
      } else {
        throw new Error(error.message || 'AI 服务暂时不可用')
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 发送消息（流式模式）
   * @param {string} content - 消息内容
   * @param {Array} history - 历史记录
   * @param {Object} callbacks - 回调函数
   */
  const sendStreamMessage = async (content, history = [], callbacks = {}) => {
    if (!content.trim() || loading.value) {
      console.warn('消息为空或正在加载中')
      return
    }

    loading.value = true
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      isStreaming: true
    }

    messages.value.push(userMessage, assistantMessage)
    streamTask.value = {
      content,
      assistantMessageId: assistantMessage.id,
      startedAt: Date.now()
    }

    try {
      console.log('发送流式消息到 AI:', { content, historyLength: history.length })

      await sendMessageStreamApi(content, history, {
        onMessage: chunk => {
          assistantMessage.content += chunk
          currentReply.value = assistantMessage.content
          callbacks.onMessage?.(chunk)
        },
        onError: error => {
          console.error('流式消息错误:', error)
          assistantMessage.content = assistantMessage.content || '抱歉，AI 服务暂时不可用，请稍后再试。'
          assistantMessage.isStreaming = false
          callbacks.onError?.(error)
        },
        onComplete: () => {
          console.log('流式消息完成')
          assistantMessage.isStreaming = false
          currentReply.value = ''
          callbacks.onComplete?.()
        }
      })
    } catch (error) {
      console.error('发送流式消息失败:', error)
      assistantMessage.content = assistantMessage.content || '抱歉，AI 服务暂时不可用，请稍后再试。'
      assistantMessage.isStreaming = false
      callbacks.onError?.(error)
    } finally {
      loading.value = false
      streamTask.value = null
    }
  }

  /**
   * 清空聊天记录
   */
  const clearMessages = () => {
    messages.value = []
    currentReply.value = ''
    streamTask.value = null
  }

  return {
    messages,
    loading,
    currentReply,
    streamTask,
    hasMessages,
    addMessage,
    sendMessage,
    sendStreamMessage,
    clearMessages
  }
})
