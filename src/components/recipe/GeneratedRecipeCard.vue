<template>
  <div class="generated-recipe-card" :class="{ selected: selected }">
    <!-- 选择框 -->
    <div class="recipe-checkbox">
      <input type="checkbox" :checked="selected" @change="$emit('select')" />
    </div>

    <!-- 菜谱头部 -->
    <div class="recipe-header">
      <div class="recipe-emoji">{{ recipe.emoji || '🍽️' }}</div>
      <div class="recipe-basic">
        <h3 class="recipe-name">{{ recipe.name }}</h3>
        <p class="recipe-category">{{ getCategoryLabel(recipe.category) }}</p>
      </div>
    </div>

    <!-- 菜谱描述 -->
    <div class="recipe-description">
      <p>{{ recipe.description }}</p>
    </div>

    <!-- 中医属性 -->
    <div class="recipe-properties">
      <div class="property-item">
        <span class="property-label">性质:</span>
        <span class="property-value">{{ recipe.nature }}</span>
      </div>
      <div class="property-item">
        <span class="property-label">五味:</span>
        <span class="property-value">{{ recipe.flavors?.join('、') || '-' }}</span>
      </div>
      <div class="property-item">
        <span class="property-label">归经:</span>
        <span class="property-value">{{ recipe.meridians?.join('、') || '-' }}</span>
      </div>
    </div>

    <!-- 制作信息 -->
    <div class="recipe-meta">
      <div class="meta-item">
        <span class="meta-icon">⏱️</span>
        <span>{{ recipe.cookingTime }}分钟</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">📊</span>
        <span>{{ recipe.difficulty }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">⭐</span>
        <span>{{ recipe.baseScore }}分</span>
      </div>
    </div>

    <!-- 适宜体质 -->
    <div class="recipe-constitutions">
      <div class="constitution-group">
        <span class="constitution-label">适宜:</span>
        <div class="constitution-tags">
          <span
            v-for="constitution in recipe.suitableConstitutions?.slice(0, 3)"
            :key="constitution"
            class="constitution-tag suitable"
          >
            {{ getConstitutionLabel(constitution) }}
          </span>
        </div>
      </div>
      <div class="constitution-group">
        <span class="constitution-label">禁忌:</span>
        <div class="constitution-tags">
          <span
            v-for="constitution in recipe.avoidConstitutions?.slice(0, 2)"
            :key="constitution"
            class="constitution-tag avoid"
          >
            {{ getConstitutionLabel(constitution) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 标签 -->
    <div class="recipe-tags">
      <span v-for="tag in recipe.tags?.slice(0, 4)" :key="tag" class="tag">
        {{ tag }}
      </span>
      <span v-if="recipe.tags?.length > 4" class="tag-more">+{{ recipe.tags.length - 4 }}</span>
    </div>

    <!-- 操作按钮 -->
    <div class="recipe-actions">
      <button class="action-btn view-btn" @click="handleView" title="查看详情">
        <span class="btn-icon">👁️</span>
        查看
      </button>
      <button class="action-btn edit-btn" @click="handleEdit" title="编辑">
        <span class="btn-icon">✏️</span>
        编辑
      </button>
      <button class="action-btn save-btn" @click="handleSave" title="保存">
        <span class="btn-icon">💾</span>
        保存
      </button>
    </div>

    <!-- AI生成标识 -->
    <div class="ai-badge">
      <span class="ai-icon">🤖</span>
      <span class="ai-text">AI生成</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'view', 'edit', 'save'])

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

const handleView = () => {
  emit('view', props.recipe)
}

const handleEdit = () => {
  emit('edit', props.recipe)
}

const handleSave = () => {
  emit('save', props.recipe)
}
</script>

<style scoped>
.generated-recipe-card {
  position: relative;
  background: var(--color-bg-elevated);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.generated-recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
}

.generated-recipe-card.selected {
  border-color: var(--color-accent);
  background: var(--color-accent-alpha);
}

/* 选择框 */
.recipe-checkbox {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 2;
  background: var(--color-bg-elevated);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs);
  box-shadow: var(--shadow-sm);
}

.recipe-checkbox input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* 菜谱头部 */
.recipe-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.recipe-emoji {
  font-size: 2.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.recipe-basic {
  flex: 1;
  min-width: 0;
}

.recipe-name {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: var(--leading-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-category {
  font-size: var(--text-sm);
  color: var(--color-accent);
  font-weight: var(--font-medium);
  margin: 0;
}

/* 菜谱描述 */
.recipe-description {
  margin-bottom: var(--spacing-md);
}

.recipe-description p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 中医属性 */
.recipe-properties {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  text-align: center;
}

.property-label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
  text-transform: uppercase;
}

.property-value {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

/* 制作信息 */
.recipe-meta {
  display: flex;
  justify-content: space-around;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.meta-icon {
  font-size: var(--text-base);
}

/* 适宜体质 */
.recipe-constitutions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.constitution-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.constitution-label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
  min-width: 40px;
}

.constitution-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.constitution-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
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

/* 标签 */
.recipe-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-border-light);
}

.tag-more {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-border-medium);
  color: var(--color-text-tertiary);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* 操作按钮 */
.recipe-actions {
  display: flex;
  gap: var(--spacing-xs);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-btn.view-btn:hover {
  background: var(--color-info);
  border-color: var(--color-info);
  color: var(--color-text-inverse);
}

.action-btn.edit-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-text-inverse);
}

.action-btn.save-btn:hover {
  background: var(--color-success);
  border-color: var(--color-success);
  color: var(--color-text-inverse);
}

.btn-icon {
  font-size: var(--text-base);
}

/* AI标识 */
.ai-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--gradient-accent);
  color: var(--color-text-inverse);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-sm);
  z-index: 2;
}

.ai-icon {
  font-size: var(--text-sm);
}

.ai-text {
  font-size: var(--text-xs);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .generated-recipe-card {
    padding: var(--spacing-md);
  }

  .recipe-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .recipe-emoji {
    font-size: 2rem;
  }

  .recipe-properties {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .property-item {
    flex-direction: row;
    justify-content: space-between;
  }

  .recipe-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .constitution-group {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .constitution-label {
    min-width: auto;
  }

  .recipe-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .generated-recipe-card {
    padding: var(--spacing-sm);
  }

  .recipe-emoji {
    font-size: 1.5rem;
  }

  .action-btn {
    padding: var(--spacing-xs);
    font-size: var(--text-xs);
  }

  .btn-icon {
    font-size: var(--text-sm);
  }
}
</style>
