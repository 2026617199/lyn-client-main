/**
 * 动画工具函数
 */

/**
 * 延迟执行函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Promise}
 */
export const delay = delay => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * 创建交错动画
 * @param {Array} elements - DOM元素数组
 * @param {Function} animation - 动画函数
 * @param {number} staggerDelay - 交错延迟时间
 */
export const staggerAnimation = (elements, animation, staggerDelay = 100) => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      animation(element)
    }, index * staggerDelay)
  })
}

/**
 * 滚动到元素
 * @param {HTMLElement} element - 目标元素
 * @param {Object} options - 滚动选项
 */
export const scrollToElement = (element, options = {}) => {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  }

  element.scrollIntoView({ ...defaultOptions, ...options })
}

/**
 * 创建淡入动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} duration - 动画持续时间（毫秒）
 */
export const fadeIn = (element, duration = 300) => {
  element.style.opacity = '0'
  element.style.transition = `opacity ${duration}ms ease-out`

  // 强制重绘
  element.offsetHeight

  element.style.opacity = '1'

  // 动画结束后清理
  setTimeout(() => {
    element.style.transition = ''
  }, duration)
}

/**
 * 创建淡出动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} duration - 动画持续时间（毫秒）
 */
export const fadeOut = (element, duration = 300) => {
  element.style.opacity = '1'
  element.style.transition = `opacity ${duration}ms ease-out`

  // 强制重绘
  element.offsetHeight

  element.style.opacity = '0'

  // 动画结束后隐藏元素
  setTimeout(() => {
    element.style.display = 'none'
    element.style.transition = ''
  }, duration)
}

/**
 * 创建滑入动画
 * @param {HTMLElement} element - 目标元素
 * @param {string} direction - 滑入方向 ('up', 'down', 'left', 'right')
 * @param {number} duration - 动画持续时间（毫秒）
 */
export const slideIn = (element, direction = 'up', duration = 300) => {
  const transforms = {
    up: 'translateY(20px)',
    down: 'translateY(-20px)',
    left: 'translateX(20px)',
    right: 'translateX(-20px)'
  }

  element.style.transform = transforms[direction]
  element.style.opacity = '0'
  element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`

  // 强制重绘
  element.offsetHeight

  element.style.transform = 'translate(0, 0)'
  element.style.opacity = '1'

  // 动画结束后清理
  setTimeout(() => {
    element.style.transition = ''
  }, duration)
}

/**
 * 创建缩放动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} scale - 缩放比例
 * @param {number} duration - 动画持续时间（毫秒）
 */
export const scale = (element, scale = 1.1, duration = 200) => {
  element.style.transform = 'scale(1)'
  element.style.transition = `transform ${duration}ms ease-out`

  // 强制重绘
  element.offsetHeight

  element.style.transform = `scale(${scale})`

  // 恢复原始大小
  setTimeout(() => {
    element.style.transform = 'scale(1)'
  }, duration)

  // 动画结束后清理
  setTimeout(() => {
    element.style.transition = ''
  }, duration * 2)
}

/**
 * 创建震动效果
 * @param {HTMLElement} element - 目标元素
 * @param {number} intensity - 震动强度
 * @param {number} duration - 动画持续时间（毫秒）
 */
export const shake = (element, intensity = 5, duration = 300) => {
  const originalTransform = element.style.transform
  const shakeCount = 6
  const shakeDuration = duration / shakeCount

  let currentShake = 0

  const shakeStep = () => {
    if (currentShake >= shakeCount) {
      element.style.transform = originalTransform
      element.style.transition = ''
      return
    }

    const offset = currentShake % 2 === 0 ? intensity : -intensity
    element.style.transform = `translateX(${offset}px)`

    currentShake++
    setTimeout(shakeStep, shakeDuration)
  }

  element.style.transition = 'transform 0.05s ease-out'
  shakeStep()
}

/**
 * 创建脉冲效果
 * @param {HTMLElement} element - 目标元素
 * @param {number} scale - 缩放比例
 * @param {number} duration - 动画持续时间（毫秒）
 * @param {number} iterations - 重复次数
 */
export const pulse = (element, scale = 1.05, duration = 1000, iterations = 2) => {
  const originalTransform = element.style.transform
  let currentIteration = 0

  const pulseStep = () => {
    if (currentIteration >= iterations * 2) {
      element.style.transform = originalTransform
      element.style.transition = ''
      return
    }

    const currentScale = currentIteration % 2 === 0 ? scale : 1
    element.style.transform = `scale(${currentScale})`

    currentIteration++
    setTimeout(pulseStep, duration / 2)
  }

  element.style.transition = `transform ${duration / 2}ms ease-in-out`
  pulseStep()
}

/**
 * 创建打字机效果
 * @param {HTMLElement} element - 目标元素
 * @param {string} text - 要显示的文本
 * @param {number} speed - 打字速度（字符/秒）
 */
export const typewriter = (element, text, speed = 50) => {
  element.textContent = ''
  let currentIndex = 0

  const typeChar = () => {
    if (currentIndex >= text.length) {
      return
    }

    element.textContent += text[currentIndex]
    currentIndex++

    setTimeout(typeChar, 1000 / speed)
  }

  typeChar()
}

/**
 * 创建数字递增动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} endValue - 结束值
 * @param {number} duration - 动画持续时间（毫秒）
 * @param {number} startValue - 开始值
 */
export const countUp = (element, endValue, duration = 1000, startValue = 0) => {
  const startTime = Date.now()
  const valueDiff = endValue - startValue

  const updateCounter = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 使用easeOutCubic缓动函数
    const easeOutCubic = progress => {
      return 1 - Math.pow(1 - progress, 3)
    }

    const currentValue = Math.round(startValue + valueDiff * easeOutCubic(progress))
    element.textContent = currentValue

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  updateCounter()
}

/**
 * 检查元素是否在视口内
 * @param {HTMLElement} element - 目标元素
 * @param {number} threshold - 阈值（0-1）
 * @returns {boolean}
 */
export const isInViewport = (element, threshold = 0.1) => {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  const verticalThreshold = windowHeight * threshold
  const horizontalThreshold = windowWidth * threshold

  return (
    rect.top >= -verticalThreshold &&
    rect.left >= -horizontalThreshold &&
    rect.bottom <= windowHeight + verticalThreshold &&
    rect.right <= windowWidth + horizontalThreshold
  )
}

/**
 * 创建视口动画
 * @param {HTMLElement} element - 目标元素
 * @param {Function} animation - 动画函数
 * @param {Object} options - 选项
 */
export const viewportAnimation = (element, animation, options = {}) => {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animation(entry.target)

          if (once) {
            observer.unobserve(entry.target)
          }
        }
      })
    },
    {
      threshold,
      rootMargin
    }
  )

  observer.observe(element)

  return observer
}

/**
 * 批量创建视口动画
 * @param {NodeList|Array} elements - 元素列表
 * @param {Function} animation - 动画函数
 * @param {Object} options - 选项
 */
export const batchViewportAnimation = (elements, animation, options = {}) => {
  const { threshold = 0.1, rootMargin = '0px', once = true, staggerDelay = 100 } = options

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            animation(entry.target)
          }, index * staggerDelay)

          if (once) {
            observer.unobserve(entry.target)
          }
        }
      })
    },
    {
      threshold,
      rootMargin
    }
  )

  elements.forEach(element => {
    observer.observe(element)
  })

  return observer
}
