<template>
  <Teleport to="body">
    <div class="modal-overlay" v-if="isVisible" @click="closeModal">
      <div class="modal-container" @click.stop>
        <!-- 模态头部 -->
        <div class="modal-header">
          <div class="constitution-info">
            <div class="constitution-icon" :style="{ backgroundColor: constitutionDetail.color }">
              {{ constitutionDetail.icon || constitutionDetail.name?.charAt(0) }}
            </div>
            <div class="constitution-meta">
              <h2 class="constitution-name">{{ constitutionDetail.name }}</h2>
              <p class="constitution-type">{{ constitutionDetail.type }}</p>
            </div>
          </div>
          <button class="close-button" @click="closeModal">
            <span class="close-icon">×</span>
          </button>
        </div>

        <!-- 模态内容 -->
        <div class="modal-content" v-if="!isLoading">
          <!-- 体质描述 -->
          <section class="detail-section">
            <h3 class="section-title">
              <span class="title-icon">📝</span>
              体质描述
            </h3>
            <p class="section-content">{{ constitutionDetail.description }}</p>
          </section>

          <!-- 主要特征 -->
          <section class="detail-section">
            <h3 class="section-title">
              <span class="title-icon">⭐</span>
              主要特征
            </h3>
            <div class="characteristics-grid">
              <div
                v-for="(characteristic, index) in constitutionDetail.characteristics"
                :key="index"
                class="characteristic-item"
              >
                <span class="item-icon">✓</span>
                <span class="item-text">{{ characteristic }}</span>
              </div>
            </div>
          </section>

          <!-- 饮食指南 -->
          <section class="detail-section">
            <h3 class="section-title">
              <span class="title-icon">🍽️</span>
              饮食指南
            </h3>
            <div class="dietary-guidelines">
              <!-- 推荐食物 -->
              <div class="guideline-group">
                <h4 class="group-title">
                  <span class="group-icon">👍</span>
                  推荐食物
                </h4>
                <div class="food-tags recommended">
                  <span
                    v-for="(food, index) in constitutionDetail.recommendedIngredients"
                    :key="index"
                    class="food-tag"
                  >
                    {{ food }}
                  </span>
                </div>
              </div>

              <!-- 饮食建议 -->
              <div class="guideline-group">
                <h4 class="group-title">
                  <span class="group-icon">💡</span>
                  饮食建议
                </h4>
                <div class="advice-tags">
                  <span
                    v-for="(advice, index) in constitutionDetail.dietaryGuidelines?.recommended"
                    :key="index"
                    class="advice-tag"
                  >
                    {{ advice }}
                  </span>
                </div>
              </div>

              <!-- 避免食物 -->
              <div class="guideline-group">
                <h4 class="group-title">
                  <span class="group-icon">⚠️</span>
                  避免食物
                </h4>
                <div class="avoid-tags">
                  <span
                    v-for="(food, index) in constitutionDetail.dietaryGuidelines?.avoided"
                    :key="index"
                    class="avoid-tag"
                  >
                    {{ food }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- 口味偏好 -->
          <section class="detail-section">
            <h3 class="section-title">
              <span class="title-icon">👅</span>
              口味偏好
            </h3>
            <div class="flavor-preferences">
              <div
                class="flavor-item"
                v-for="(value, flavor) in constitutionDetail.flavorPreference"
                :key="flavor"
              >
                <div class="flavor-label">{{ getFlavorName(flavor) }}</div>
                <div class="flavor-bar">
                  <div class="flavor-fill" :style="{ width: `${value}%` }"></div>
                </div>
                <div class="flavor-value">{{ value }}%</div>
              </div>
            </div>
          </section>
        </div>

        <!-- 加载状态 -->
        <div class="loading-state" v-else>
          <div class="loading-spinner"></div>
          <p class="loading-text">正在加载体质详情...</p>
        </div>

        <!-- 模态底部 -->
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="closeModal">关闭</button>
          <button class="btn btn-primary" @click="selectConstitution" v-if="onSelect">
            选择此体质
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { constitutionApi } from '@/api/index'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  constitution: {
    type: Object,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  onSelect: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['close'])

// 用户 store
const userStore = useUserStore()

// 响应式数据
const isLoading = ref(false)
const constitutionDetail = ref({})

// 口味名称映射
const getFlavorName = flavor => {
  const flavorNames = {
    sour: '酸味',
    sweet: '甜味',
    bitter: '苦味',
    spicy: '辣味',
    salty: '咸味'
  }
  return flavorNames[flavor] || flavor
}

// 监听可见性变化，加载详情数据
watch(
  () => props.isVisible,
  async newVal => {
    if (newVal && props.constitution?.type) {
      await loadConstitutionDetail()
    }
  }
)

// 加载体质详情
const loadConstitutionDetail = async () => {
  try {
    isLoading.value = true
    const response = await constitutionApi.getConstitutionByType(props.constitution.type)

    if (response.code === 0 && response.data) {
      constitutionDetail.value = response.data
    } else {
      throw new Error(response.message || '获取体质详情失败')
    }
  } catch (error) {
    console.error('加载体质详情失败:', error)
    // 使用本地数据作为备用
    constitutionDetail.value = {
      ...props.constitution,
      dietaryGuidelines: {
        recommended: props.constitution.dietAdvice || [],
        avoided: props.constitution.avoidFoods || []
      },
      flavorPreference: {
        sour: 50,
        sweet: 50,
        bitter: 50,
        spicy: 50,
        salty: 50
      },
      recommendedIngredients: []
    }
  } finally {
    isLoading.value = false
  }
}

// 关闭模态框
const closeModal = () => {
  emit('close')
}

// 选择体质
const selectConstitution = async () => {
  try {
    isLoading.value = true
    const constitutionType = constitutionDetail.value.type || props.constitution.type
    
    // 调用 API 更新用户体质
    const success = await userStore.setConstitution(constitutionType, 'manual')
    
    if (success) {
      // 获取体质详情以更新 store
      await userStore.fetchConstitutionInfo(constitutionType)
      
      // 调用回调函数（如果有）
      if (props.onSelect) {
        props.onSelect(constitutionDetail.value)
      }
      closeModal()
    } else {
      console.error('设置体质失败')
    }
  } catch (error) {
    console.error('选择体质时出错:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 模态框遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
  backdrop-filter: blur(4px);
}

/* 模态框容器 */
.modal-container {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s var(--ease-out);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 模态框头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg-secondary);
}

.constitution-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.constitution-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  color: white;
  flex-shrink: 0;
  box-shadow: var(--shadow-lg);
}

.constitution-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.constitution-name {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.constitution-type {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  align-self: flex-start;
}

.close-button {
  background: none;
  border: none;
  font-size: var(--text-2xl);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base) var(--ease-out);
  line-height: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.close-icon {
  display: block;
  line-height: 1;
}

/* 模态框内容 */
.modal-content {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* 详情区块 */
.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: var(--text-xl);
}

.section-content {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* 特征网格 */
.characteristics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.characteristic-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.item-icon {
  color: var(--color-success);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  flex-shrink: 0;
}

.item-text {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
}

/* 饮食指南 */
.dietary-guidelines {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.guideline-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.group-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.group-icon {
  font-size: var(--text-lg);
}

/* 食物标签 */
.food-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.food-tag {
  background: var(--color-primary-alpha);
  color: var(--color-primary-dark);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-primary-light);
}

.food-tags.recommended .food-tag {
  background: var(--color-success-alpha);
  color: var(--color-success-dark);
  border-color: var(--color-success-light);
}

/* 饮食建议标签 */
.advice-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.advice-tag {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #2e7d32;
  backdrop-filter: blur(8px);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  box-shadow:
    0 1px 3px rgba(76, 175, 80, 0.12),
    0 1px 2px rgba(76, 175, 80, 0.24);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.advice-tag:hover {
  transform: translateY(-1px);
  box-shadow:
    0 4px 8px rgba(76, 175, 80, 0.15),
    0 2px 4px rgba(76, 175, 80, 0.3);
}

/* 避免食物标签 */
.avoid-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.avoid-tag {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #d32f2f;
  backdrop-filter: blur(8px);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  box-shadow:
    0 1px 3px rgba(239, 68, 68, 0.12),
    0 1px 2px rgba(239, 68, 68, 0.24);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.avoid-tag:hover {
  transform: translateY(-1px);
  box-shadow:
    0 4px 8px rgba(239, 68, 68, 0.15),
    0 2px 4px rgba(239, 68, 68, 0.3);
}

/* 建议列表 */
.advice-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.advice-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-success);
}

.advice-item.avoid {
  border-left-color: var(--color-error);
}

.advice-icon {
  color: var(--color-success);
  font-weight: var(--font-bold);
  flex-shrink: 0;
  margin-top: 2px;
}

.advice-item.avoid .advice-icon {
  color: var(--color-error);
}

.advice-text {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
}

/* 口味偏好 */
.flavor-preferences {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.flavor-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.flavor-label {
  min-width: 60px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.flavor-bar {
  flex: 1;
  height: 8px;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.flavor-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-base) var(--ease-out);
}

.flavor-value {
  min-width: 50px;
  text-align: right;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
}

/* 加载状态 */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border-light);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
}

/* 模态框底部 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-md);
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--spacing-lg);
  }

  .constitution-info {
    gap: var(--spacing-md);
  }

  .constitution-icon {
    width: 48px;
    height: 48px;
    font-size: var(--text-xl);
  }

  .characteristics-grid {
    grid-template-columns: 1fr;
  }

  .flavor-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .flavor-bar {
    width: 100%;
    margin: var(--spacing-xs) 0;
  }

  .modal-footer {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .modal-footer .btn {
    width: 100%;
  }
}
</style>
