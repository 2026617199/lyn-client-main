/**
 * 性能优化工具
 */

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function}
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func.apply(this, args)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function}
 */
export const throttle = (func, limit) => {
  let inThrottle

  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 懒加载图片
 * @param {string} selector - 图片选择器
 * @param {Object} options - 懒加载选项
 */
export const lazyLoadImages = (selector = 'img[data-src]', options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  }

  const config = { ...defaultOptions, ...options }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target

        // 加载图片
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute('data-src')

          // 图片加载完成后的处理
          img.onload = () => {
            img.classList.add('loaded')
          }

          img.onerror = () => {
            img.classList.add('error')
          }
        }

        // 停止观察已加载的图片
        observer.unobserve(img)
      }
    })
  }, config)

  // 开始观察所有目标图片
  document.querySelectorAll(selector).forEach(img => {
    observer.observe(img)
  })

  return observer
}

/**
 * 虚拟滚动基础实现
 * @param {HTMLElement} container - 容器元素
 * @param {Array} items - 数据项
 * @param {Function} renderItem - 渲染函数
 * @param {Object} options - 选项
 */
export class VirtualScroll {
  constructor(container, items, renderItem, options = {}) {
    this.container = container
    this.items = items
    this.renderItem = renderItem
    this.options = {
      itemHeight: 50,
      bufferSize: 5,
      ...options
    }

    this.visibleStart = 0
    this.visibleEnd = 0
    this.scrollTop = 0

    this.init()
  }

  init() {
    this.container.style.overflow = 'auto'
    this.container.style.position = 'relative'

    // 创建内容容器
    this.contentContainer = document.createElement('div')
    this.contentContainer.style.position = 'relative'
    this.container.appendChild(this.contentContainer)

    // 绑定滚动事件
    this.handleScroll = throttle(this.updateVisibleRange.bind(this), 16)
    this.container.addEventListener('scroll', this.handleScroll)

    // 初始渲染
    this.updateVisibleRange()
  }

  updateVisibleRange() {
    const { itemHeight, bufferSize } = this.options
    const containerHeight = this.container.clientHeight

    this.scrollTop = this.container.scrollTop

    // 计算可见范围
    const startIndex = Math.max(0, Math.floor(this.scrollTop / itemHeight) - bufferSize)
    const endIndex = Math.min(
      this.items.length - 1,
      Math.ceil((this.scrollTop + containerHeight) / itemHeight) + bufferSize
    )

    // 只有范围变化时才重新渲染
    if (startIndex !== this.visibleStart || endIndex !== this.visibleEnd) {
      this.visibleStart = startIndex
      this.visibleEnd = endIndex
      this.render()
    }
  }

  render() {
    const { itemHeight } = this.options

    // 清空容器
    this.contentContainer.innerHTML = ''

    // 设置容器高度
    this.contentContainer.style.height = `${this.items.length * itemHeight}px`

    // 渲染可见项
    for (let i = this.visibleStart; i <= this.visibleEnd; i++) {
      const item = this.items[i]
      const itemElement = this.renderItem(item, i)

      // 设置位置
      itemElement.style.position = 'absolute'
      itemElement.style.top = `${i * itemHeight}px`
      itemElement.style.width = '100%'

      this.contentContainer.appendChild(itemElement)
    }
  }

  updateItems(newItems) {
    this.items = newItems
    this.updateVisibleRange()
  }

  destroy() {
    this.container.removeEventListener('scroll', this.handleScroll)
    this.contentContainer.remove()
  }
}

/**
 * 内存缓存管理
 */
export class MemoryCache {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  get(key) {
    const item = this.cache.get(key)
    if (item) {
      // 移到最后（LRU）
      this.cache.delete(key)
      this.cache.set(key, item)
      return item.value
    }
    return null
  }

  set(key, value) {
    // 如果已存在，删除旧的
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
    // 如果超过最大大小，删除最旧的
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  has(key) {
    return this.cache.has(key)
  }

  delete(key) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }

  // 清理过期缓存
  cleanup(maxAge = 300000) {
    // 默认5分钟
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > maxAge) {
        this.cache.delete(key)
      }
    }
  }
}

/**
 * 异步任务队列
 */
export class TaskQueue {
  constructor(concurrency = 3) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject
      })
      this.run()
    })
  }

  async run() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return
    }

    this.running++
    const { task, resolve, reject } = this.queue.shift()

    try {
      const result = await task()
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      this.running--
      this.run()
    }
  }
}

/**
 * 批量请求优化
 * @param {Array} requests - 请求数组
 * @param {number} batchSize - 批次大小
 * @param {number} delay - 批次间延迟
 * @returns {Promise<Array>}
 */
export const batchRequests = async (requests, batchSize = 5, delay = 100) => {
  const results = []

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch)
    results.push(...batchResults)

    // 批次间延迟
    if (i + batchSize < requests.length) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return results
}

/**
 * 图片压缩
 * @param {File} file - 图片文件
 * @param {Object} options - 压缩选项
 * @returns {Promise<Blob>}
 */
export const compressImage = (file, options = {}) => {
  const defaultOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    mimeType: 'image/jpeg'
  }

  const config = { ...defaultOptions, ...options }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // 计算新尺寸
      let { width, height } = img
      const { maxWidth, maxHeight } = config

      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (maxHeight / height) * width
        height = maxHeight
      }

      // 设置画布尺寸
      canvas.width = width
      canvas.height = height

      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height)

      // 转换为Blob
      canvas.toBlob(resolve, config.mimeType, config.quality)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 预加载资源
 * @param {Array} resources - 资源URL数组
 * @returns {Promise<Array>}
 */
export const preloadResources = resources => {
  const promises = resources.map(url => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url

      // 根据URL确定资源类型
      if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        link.as = 'image'
      } else if (url.match(/\.(css)$/i)) {
        link.as = 'style'
      } else if (url.match(/\.(js)$/i)) {
        link.as = 'script'
      } else if (url.match(/\.(woff|woff2|ttf|eot)$/i)) {
        link.as = 'font'
        link.crossOrigin = 'anonymous'
      }

      link.onload = resolve
      link.onerror = reject

      document.head.appendChild(link)
    })
  })

  return Promise.all(promises)
}

/**
 * 性能监控
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = []
  }

  startMeasure(name) {
    if (performance.mark) {
      performance.mark(`${name}-start`)
    } else {
      this.metrics[name] = { start: Date.now() }
    }
  }

  endMeasure(name) {
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)

      const entries = performance.getEntriesByName(name, 'measure')
      if (entries.length > 0) {
        const duration = entries[entries.length - 1].duration
        this.metrics[name] = { duration }
      }
    } else if (this.metrics[name]) {
      this.metrics[name].duration = Date.now() - this.metrics[name].start
    }

    return this.metrics[name]?.duration
  }

  getMeasure(name) {
    return this.metrics[name]
  }

  getAllMeasures() {
    return this.metrics
  }

  // 监控长任务
  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          console.warn('Long task detected:', {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          })
        }
      })

      try {
        observer.observe({ entryTypes: ['longtask'] })
        this.observers.push(observer)
      } catch (e) {
        console.warn('Long task observation not supported')
      }
    }
  }

  // 监控内存使用
  observeMemory() {
    if ('memory' in performance) {
      const memory = performance.memory
      this.metrics.memory = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      }
    }
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 创建默认的性能监控实例
export const performanceMonitor = new PerformanceMonitor()

/**
 * Web Worker 管理
 */
export class WorkerManager {
  constructor() {
    this.workers = new Map()
    this.taskId = 0
  }

  createWorker(script, options = {}) {
    const worker = new Worker(script, options)
    const id = this.taskId++

    this.workers.set(id, {
      worker,
      busy: false,
      taskQueue: []
    })

    return id
  }

  async executeTask(workerId, task, data) {
    const workerInfo = this.workers.get(workerId)
    if (!workerInfo) {
      throw new Error('Worker not found')
    }

    return new Promise((resolve, reject) => {
      const taskId = this.taskId++

      const handleMessage = event => {
        if (event.data.taskId === taskId) {
          workerInfo.worker.removeEventListener('message', handleMessage)
          workerInfo.busy = false

          if (event.data.error) {
            reject(new Error(event.data.error))
          } else {
            resolve(event.data.result)
          }

          // 处理队列中的下一个任务
          this.processQueue(workerId)
        }
      }

      workerInfo.worker.addEventListener('message', handleMessage)
      workerInfo.worker.postMessage({
        taskId,
        task,
        data
      })

      workerInfo.busy = true
    })
  }

  processQueue(workerId) {
    const workerInfo = this.workers.get(workerId)
    if (!workerInfo || workerInfo.busy || workerInfo.taskQueue.length === 0) {
      return
    }

    const { task, data, resolve, reject } = workerInfo.taskQueue.shift()
    this.executeTask(workerId, task, data).then(resolve).catch(reject)
  }

  destroyWorker(workerId) {
    const workerInfo = this.workers.get(workerId)
    if (workerInfo) {
      workerInfo.worker.terminate()
      this.workers.delete(workerId)
    }
  }

  destroyAll() {
    for (const [id] of this.workers) {
      this.destroyWorker(id)
    }
  }
}

// 创建默认的Worker管理实例
export const workerManager = new WorkerManager()
