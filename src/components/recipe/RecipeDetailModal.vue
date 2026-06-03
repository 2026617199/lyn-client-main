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
          <!-- 基本信息 -->
          <div class="recipe-basic-info">
            <div class="recipe-header">
              <div class="recipe-emoji">{{ recipe.emoji || '🍽️' }}</div>
              <div class="recipe-title-section">
                <h3 class="recipe-name">{{ recipe.name }}</h3>
                <p class="recipe-category">{{ getCategoryLabel(recipe.category) }}</p>
              </div>
            </div>

            <div class="recipe-description">
              <h4 class="section-title">菜谱描述</h4>
              <p class="description-text">{{ recipe.description }}</p>
            </div>

            <!-- AI生成信息 -->
            <div v-if="recipe.generatedBy === 'AI'" class="ai-info">
              <div class="ai-badge">
                <span class="ai-icon">🤖</span>
                <span class="ai-text">AI生成菜谱</span>
              </div>
              <div class="generation-params">
                <h5 class="params-title">生成参数</h5>
                <div class="param-list">
                  <div class="param-item">
                    <span class="param-label">菜谱描述:</span>
                    <span class="param-value">{{ recipe.inputParams?.dishDescription }}</span>
                  </div>
                  <div class="param-item">
                    <span class="param-label">目标体质:</span>
                    <span class="param-value">
                      {{ getConstitutionLabel(recipe.inputParams?.targetConstitution) }}
                    </span>
                  </div>
                  <div class="param-item">
                    <span class="param-label">特殊要求:</span>
                    <span class="param-value">
                      {{ recipe.inputParams?.specialRequirements || '无' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 中医属性 -->
          <div class="tcm-properties">
            <h4 class="section-title">中医属性</h4>
            <div class="properties-grid">
              <div class="property-item">
                <span class="property-label">性质</span>
                <span class="property-value">{{ recipe.nature }}</span>
              </div>
              <div class="property-item">
                <span class="property-label">五味</span>
                <span class="property-value">{{ recipe.flavors?.join('、') || '-' }}</span>
              </div>
              <div class="property-item">
                <span class="property-label">归经</span>
                <span class="property-value">{{ recipe.meridians?.join('、') || '-' }}</span>
              </div>
              <div class="property-item">
                <span class="property-label">基础评分</span>
                <span class="property-value">{{ recipe.baseScore }}分</span>
              </div>
            </div>
          </div>

          <!-- 体质适配 -->
          <div class="constitution-info">
            <h4 class="section-title">体质适配</h4>
            <div class="constitution-sections">
              <div class="constitution-group">
                <h5 class="group-title">适宜体质</h5>
                <div class="constitution-tags">
                  <span
                    v-for="constitution in recipe.suitableConstitutions"
                    :key="constitution"
                    class="constitution-tag suitable"
                  >
                    {{ getConstitutionLabel(constitution) }}
                  </span>
                </div>
              </div>
              <div class="constitution-group">
                <h5 class="group-title">禁忌体质</h5>
                <div class="constitution-tags">
                  <span
                    v-for="constitution in recipe.avoidConstitutions"
                    :key="constitution"
                    class="constitution-tag avoid"
                  >
                    {{ getConstitutionLabel(constitution) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 制作信息 -->
          <div class="cooking-info">
            <h4 class="section-title">制作信息</h4>
            <div class="cooking-grid">
              <div class="cooking-item">
                <span class="cooking-label">烹饪时间</span>
                <span class="cooking-value">{{ recipe.cookingTime }}分钟</span>
              </div>
              <div class="cooking-item">
                <span class="cooking-label">难度等级</span>
                <span class="cooking-value">{{ recipe.difficulty }}</span>
              </div>
              <div class="cooking-item">
                <span class="cooking-label">基础评分</span>
                <span class="cooking-value">{{ recipe.baseScore }}分</span>
              </div>
            </div>
          </div>

          <!-- 食材清单 -->
          <div class="ingredients-section">
            <h4 class="section-title">食材清单</h4>
            <div class="ingredients-grid">
              <div
                v-for="(ingredient, index) in recipe.ingredients"
                :key="index"
                class="ingredient-item"
              >
                <span class="ingredient-icon">{{ ingredient.icon || '🥘' }}</span>
                <div class="ingredient-info">
                  <span class="ingredient-name">{{ ingredient.name }}</span>
                  <span class="ingredient-amount">{{ ingredient.amount }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 制作步骤 -->
          <div class="steps-section">
            <h4 class="section-title">制作步骤</h4>
            <div class="steps-list">
              <div v-for="(step, index) in recipe.steps" :key="index" class="step-item">
                <div class="step-header">
                  <span class="step-number">步骤 {{ step.order }}</span>
                </div>
                <div class="step-content">
                  <p class="step-text">{{ step.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div class="tags-section">
            <h4 class="section-title">标签</h4>
            <div class="tags-list">
              <span v-for="tag in recipe.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 中医分析 -->
          <div v-if="recipe.analysis" class="analysis-section">
            <h4 class="section-title">中医分析</h4>
            <div class="analysis-content">
              <p class="analysis-text">{{ recipe.analysis }}</p>
            </div>
          </div>
        </div>

        <!-- 模态框底部 -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="close">关闭</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// 体质映射
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

// 分类映射
const categoryMap = {
  recommended: '推荐',
  warming: '温补',
  cooling: '清热',
  quick: '快手菜',
  neutral: '中性'
}

// 方法
const getCategoryLabel = category => {
  return categoryMap[category] || category
}

const getConstitutionLabel = constitution => {
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

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  close()
}
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* 基本信息 */
.recipe-basic-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.recipe-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.recipe-emoji {
  font-size: 4rem;
  line-height: 1;
  flex-shrink: 0;
}

.recipe-title-section {
  flex: 1;
  min-width: 0;
}

.recipe-name {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: var(--leading-tight);
  font-family: var(--font-serif);
}

.recipe-category {
  font-size: var(--text-lg);
  color: var(--color-accent);
  font-weight: var(--font-medium);
  margin: 0;
}

.recipe-description {
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.description-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* AI生成信息 */
.ai-info {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-accent);
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.ai-icon {
  font-size: var(--text-xl);
}

.ai-text {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-accent);
}

.generation-params {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.params-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.param-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.param-item {
  display: flex;
  gap: var(--spacing-sm);
}

.param-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
  min-width: 80px;
}

.param-value {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  flex: 1;
}

/* 中医属性 */
.tcm-properties {
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.property-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
}

.property-value {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

/* 体质适配 */
.constitution-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.constitution-sections {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.constitution-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.group-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.constitution-tags {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.constitution-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--constitution-color, var(--color-text-primary));
  background: var(--constitution-color, var(--color-bg-tertiary));
  background-opacity: 0.1;
  border: 1px solid var(--constitution-color, var(--color-border-light));
}

.constitution-tag.suitable {
  background: var(--constitution-color, var(--color-bg-tertiary));
  background-opacity: 0.15;
}

.constitution-tag.avoid {
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  border-color: var(--color-border-medium);
  opacity: 0.7;
}

/* 制作信息 */
.cooking-info {
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.cooking-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.cooking-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  text-align: center;
}

.cooking-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
}

.cooking-value {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

/* 食材清单 */
.ingredients-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
}

.ingredient-icon {
  font-size: var(--text-xl);
  flex-shrink: 0;
}

.ingredient-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.ingredient-name {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.ingredient-amount {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* 制作步骤 */
.steps-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
}

.step-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
}

.step-number {
  font-size: var(--text-sm);
  text-align: center;
}

.step-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.step-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* 标签 */
.tags-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.tags-list {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-border-light);
}

/* 中医分析 */
.analysis-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.analysis-content {
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.analysis-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* 模态框底部 */
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

  .recipe-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .recipe-emoji {
    font-size: 3rem;
  }

  .properties-grid {
    grid-template-columns: 1fr;
  }

  .constitution-sections {
    grid-template-columns: 1fr;
  }

  .cooking-grid {
    grid-template-columns: 1fr;
  }

  .cooking-item {
    flex-direction: row;
    justify-content: space-between;
  }

  .ingredients-grid {
    grid-template-columns: 1fr;
  }

  .step-item {
    flex-direction: column;
  }

  .step-header {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .modal-header,
  .modal-content,
  .modal-footer {
    padding: var(--spacing-md);
  }

  .recipe-emoji {
    font-size: 2.5rem;
  }

  .step-header {
    width: 50px;
    height: 50px;
  }

  .step-number {
    font-size: var(--text-xs);
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
