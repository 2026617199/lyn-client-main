/**
 * IndexedDB 工具模块 - 用于存储养生咨询对话记录
 */

const DB_NAME = 'AIDiagnosisDB'
const STORE_NAME = 'messages'
const DB_VERSION = 1

let db = null

/**
 * 初始化数据库
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * 保存消息列表
 * @param {Array} messages - 消息数组
 */
export const saveMessages = async (messages) => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    // 清空后重新写入
    store.clear()

    // 过滤掉正在流式输出的消息，避免保存不完整内容
    const messagesToSave = messages
      .filter(msg => !msg.isStreaming)
      .map(msg => ({
        id: msg.id || msg.timestamp,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))

    messagesToSave.forEach(msg => store.put(msg))

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * 加载消息列表
 * @returns {Promise<Array>} 消息数组
 */
export const loadMessages = async () => {
  if (!db) await initDB()

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      const messages = request.result || []
      // 按时间戳排序
      messages.sort((a, b) => a.timestamp - b.timestamp)
      resolve(messages)
    }
    request.onerror = () => resolve([])
  })
}

/**
 * 清空消息
 */
export const clearMessages = async () => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export default {
  initDB,
  saveMessages,
  loadMessages,
  clearMessages
}
