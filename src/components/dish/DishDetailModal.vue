<template>
  <teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <!-- 模态框头部 -->
        <div class="modal-header">
          <h2 class="modal-title">菜谱详情</h2>
          <button class="close-btn" @click="close">
            <span class="close-icon">✕</span>
          </button>
        </div>

        <!-- 模态框内容 -->
        <div class="modal-content">
          <div v-if="dish" class="dish-detail">
            <!-- 基本信息 -->
            <div class="detail-section">
              <div class="dish-header">
                <div class="dish-image-large">
                  <img
                    v-if="dish.image && !imageError"
                    :src="dish.image"
                    :alt="dish.name"
                    @error="imageError = true"
                  />
                  <div v-else class="image-placeholder-large">
                    <span class="placeholder-emoji">{{ dish.emoji || '🍽️' }}</span>
                  </div>
                </div>

                <div class="dish-basic-info">
                  <h3 class="dish-title">{{ dish.name }}</h3>
                  <p class="dish-description-full">{{ dish.description }}</p>

                  <div class="dish-meta-grid">
                    <div class="meta-item">
                      <span class="meta-label">性质</span>
                      <span class="meta-value">{{ dish.nature || '-' }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">五味</span>
                      <span class="meta-value">{{ dish.flavors?.join('、') || '-' }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">归经</span>
                      <span class="meta-value">
                        {{ dish.meridianText || dish.meridians?.join('、') || '-' }}
                      </span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">分类</span>
                      <span class="meta-value category-badge" :class="dish.category">
                        {{ getCategoryLabel(dish.category) }}
                      </span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">烹饪时间</span>
                      <span class="meta-value">{{ dish.cookingTime }}分钟</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">难度</span>
                      <span class="meta-value">{{ dish.difficulty }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">基础评分</span>
                      <span class="meta-value score">{{ dish.baseScore || 0 }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">状态</span>
                      <span class="meta-value status" :class="{ active: dish.isActive }">
                        {{ dish.isActive ? '启用' : '禁用' }}
                      </span>
                    </div>
                  </div>

                  <div class="dish-tags-section">
                    <h4 class="section-title">标签</h4>
                    <div class="tags-list">
                      <span v-for="tag in dish.tags" :key="tag" class="tag">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 适宜体质 -->
            <div class="detail-section">
              <h4 class="section-title">适宜体质</h4>
              <div class="constitutions-grid">
                <span
                  v-for="constitution in dish.suitableConstitutions"
                  :key="constitution"
                  class="constitution-tag suitable"
                  :style="{ backgroundColor: getConstitutionColor(constitution) }"
                >
                  {{ getConstitutionLabel(constitution) }}
                </span>
              </div>
            </div>

            <!-- 禁忌体质 -->
            <div class="detail-section">
              <h4 class="section-title">禁忌体质</h4>
              <div class="constitutions-grid">
                <span
                  v-for="constitution in dish.avoidConstitutions"
                  :key="constitution"
                  class="constitution-tag avoid"
                  :style="{ backgroundColor: getConstitutionColor(constitution) }"
                >
                  {{ getConstitutionLabel(constitution) }}
                </span>
              </div>
            </div>

            <!-- 食材列表 -->
            <div class="detail-section">
              <h4 class="section-title">食材清单</h4>
              <div class="ingredients-list">
                <div
                  v-for="ingredient in dish.ingredients"
                  :key="ingredient.name"
                  class="ingredient-item"
                >
                  <span class="ingredient-icon">{{ ingredient.icon || '🥘' }}</span>
                  <span class="ingredient-name">{{ ingredient.name }}</span>
                  <span class="ingredient-amount">{{ ingredient.amount }}</span>
                </div>
              </div>
            </div>

            <!-- 烹饪步骤 -->
            <div class="detail-section">
              <h4 class="section-title">烹饪步骤</h4>
              <div class="steps-list">
                <div v-for="step in dish.steps" :key="step.order" class="step-item">
                  <div class="step-number">{{ step.order }}</div>
                  <div class="step-content">{{ step.content }}</div>
                </div>
              </div>
            </div>

            <!-- 中医分析 -->
            <div class="detail-section">
              <h4 class="section-title">中医分析</h4>
              <div class="analysis-content">
                {{ dish.analysis || '暂无分析内容' }}
              </div>
            </div>

            <!-- 系统信息 -->
            <div class="detail-section">
              <h4 class="section-title">系统信息</h4>
              <div class="system-info-grid">
                <div class="info-item">
                  <span class="info-label">ID</span>
                  <span class="info-value">{{ dish.id || dish._id }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">排序</span>
                  <span class="info-value">{{ dish.sortOrder || 0 }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">创建时间</span>
                  <span class="info-value">{{ formatDate(dish.createdAt) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">更新时间</span>
                  <span class="info-value">{{ formatDate(dish.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 模态框底部 -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="close">关闭</button>
          <button class="btn btn-primary" @click="editDish">编辑菜谱</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  dish: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'edit'])

const imageError = ref(false)

// 计算属性
const getCategoryLabel = category => {
  const categoryMap = {
    recommended: '推荐',
    warming: '温补',
    cooling: '清热',
    quick: '快手菜'
  }
  return categoryMap[category] || category
}

const getConstitutionLabel = constitution => {
  const constitutionMap = {
    balanced: '平和质',
    qi_deficiency: '气虚质',
    yang_deficiency: '阳虚质',
    yin_deficiency: '阴虚质',
    phlegm_dampness: '痰湿质',
    damp_heat: '湿热质',
    blood_stasis: '血瘀质',
    qi_stagnation: '气郁质',
    special: '特禀质'
  }
  return constitutionMap[constitution] || constitution
}

const getConstitutionColor = constitution => {
  const colorMap = {
    balanced: 'var(--color-constitution-balanced)',
    qi_deficiency: 'var(--color-constitution-qi)',
    yang_deficiency: 'var(--color-constitution-yang)',
    yin_deficiency: 'var(--color-constitution-yin)',
    phlegm_dampness: 'var(--color-constitution-phlegm)',
    damp_heat: 'var(--color-constitution-damp)',
    blood_stasis: 'var(--color-constitution-blood)',
    qi_stagnation: 'var(--color-constitution-qi-stagnation)',
    special: 'var(--color-constitution-special)'
  }
  return colorMap[constitution] || 'var(--color-text-tertiary)'
}

const formatDate = dateString => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 方法
const close = () => {
  emit('close')
}

const editDish = () => {
  emit('edit', props.dish)
  close()
}

const handleOverlayClick = () => {
  close()
}

// 监听dish变化，重置图片错误状态
watch(
  () => props.dish,
  () => {
    imageError.value = false
  }
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(var(--blur-sm));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-lg);
}

.modal-container {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-light);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-serif);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-bg-tertiary);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
}

.close-btn:hover {
  background: var(--color-error);
  color: var(--color-text-inverse);
}

.close-icon {
  font-size: var(--text-lg);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
}

.dish-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

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
  position: relative;
  padding-left: var(--spacing-md);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: var(--gradient-accent);
  border-radius: var(--radius-sm);
}

.dish-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.dish-image-large {
  aspect-ratio: 16/12;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.dish-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder-large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
}

.placeholder-emoji {
  font-size: 4rem;
  opacity: 0.5;
}

.dish-basic-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.dish-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-serif);
}

.dish-description-full {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.dish-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.meta-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
}

.meta-value {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.category-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-inverse);
  display: inline-block;
}

.category-badge.recommended {
  background: var(--gradient-accent);
}

.category-badge.warming {
  background: var(--gradient-warm);
}

.category-badge.cooling {
  background: var(--gradient-cool);
}

.category-badge.quick {
  background: linear-gradient(135deg, #7a9fbf, #5a9f8f);
}

.meta-value.score {
  font-size: var(--text-lg);
  color: var(--color-accent);
  font-weight: var(--font-bold);
}

.meta-value.status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  display: inline-block;
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}

.meta-value.status.active {
  background: var(--color-success);
  color: var(--color-text-inverse);
}

.dish-tags-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  background: var(--color-bg-tertiary);
  color: var(--color-accent);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-accent-alpha);
}

.constitutions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.constitution-tag {
  color: var(--color-text-inverse);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.constitution-tag.suitable {
  opacity: 1;
}

.constitution-tag.avoid {
  opacity: 0.7;
  text-decoration: line-through;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.ingredient-icon {
  font-size: var(--text-xl);
  width: 32px;
  text-align: center;
}

.ingredient-name {
  flex: 1;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.ingredient-amount {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step-item {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
  padding-top: var(--spacing-xs);
}

.analysis-content {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: var(--leading-relaxed);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-accent);
}

.system-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
}

.info-value {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-sans);
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-medium);
}

.btn-secondary:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-accent);
}

/* 响应式设计 */
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

  .dish-header {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .dish-image-large {
    max-width: 100%;
  }

  .dish-title {
    font-size: var(--text-2xl);
  }

  .dish-meta-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .system-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--spacing-md);
  }

  .dish-title {
    font-size: var(--text-xl);
  }

  .dish-meta-grid {
    grid-template-columns: 1fr;
  }

  .system-info-grid {
    grid-template-columns: 1fr;
  }

  .ingredient-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .step-item {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
