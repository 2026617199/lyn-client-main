<template>
  <div class="dish-list-item" :class="{ selected: selected }" @click="$emit('select', dish.id)">
    <!-- 选择框 -->
    <div class="item-checkbox">
      <input type="checkbox" :checked="selected" @change="$emit('select', dish.id)" @click.stop />
    </div>

    <!-- 菜谱图片 -->
    <div class="item-image">
      <img
        v-if="dish.image && !dish.imageError"
        :src="dish.image"
        :alt="dish.name"
        @error="dish.imageError = true"
      />
      <div v-else class="image-placeholder">
        <span class="placeholder-emoji">{{ dish.emoji || '🍽️' }}</span>
      </div>
    </div>

    <!-- 菜谱信息 -->
    <div class="item-content">
      <div class="content-header">
        <h4 class="item-name">{{ dish.name }}</h4>
        <div class="item-status" :class="{ active: dish.isActive }">
          <span class="status-dot"></span>
          <span class="status-text">{{ dish.isActive ? '启用' : '禁用' }}</span>
        </div>
      </div>

      <p class="item-description">{{ dish.description }}</p>

      <div class="item-meta">
        <span class="meta-item">
          <span class="meta-icon">⏱️</span>
          {{ dish.cookingTime }}分钟
        </span>
        <span class="meta-item">
          <span class="meta-icon">📊</span>
          {{ dish.difficulty }}
        </span>
        <span class="meta-item">
          <span class="meta-icon">🏷️</span>
          {{ getCategoryLabel(dish.category) }}
        </span>
        <span class="meta-item">
          <span class="meta-icon">🥘</span>
          {{ dish.ingredients?.length || 0 }}种食材
        </span>
        <span class="meta-item">
          <span class="meta-icon">📝</span>
          {{ dish.steps?.length || 0 }}个步骤
        </span>
      </div>

      <div class="item-tags">
        <span v-for="tag in dish.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <!-- 体质适配信息 -->
      <div class="constitution-info">
        <div class="constitution-group">
          <span class="constitution-label">适宜:</span>
          <div class="constitution-tags">
            <span
              v-for="type in dish.suitableConstitutions?.slice(0, 3)"
              :key="type"
              class="constitution-tag suitable"
            >
              {{ getConstitutionLabel(type) }}
            </span>
            <span v-if="dish.suitableConstitutions?.length > 3" class="constitution-more">
              +{{ dish.suitableConstitutions.length - 3 }}
            </span>
          </div>
        </div>
        <div class="constitution-group" v-if="dish.avoidConstitutions?.length > 0">
          <span class="constitution-label">禁忌:</span>
          <div class="constitution-tags">
            <span
              v-for="type in dish.avoidConstitutions?.slice(0, 2)"
              :key="type"
              class="constitution-tag avoid"
            >
              {{ getConstitutionLabel(type) }}
            </span>
            <span v-if="dish.avoidConstitutions?.length > 2" class="constitution-more">
              +{{ dish.avoidConstitutions.length - 2 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="item-actions">
      <button class="action-btn view-btn" @click.stop="$emit('view', dish)" title="查看详情">
        👁️
      </button>
      <button class="action-btn edit-btn" @click.stop="$emit('edit', dish)" title="编辑">✏️</button>
      <button
        class="action-btn status-btn"
        @click.stop="$emit('toggle-status', dish)"
        :title="dish.isActive ? '禁用' : '启用'"
      >
        {{ dish.isActive ? '⏸️' : '▶️' }}
      </button>
      <button class="action-btn delete-btn" @click.stop="$emit('delete', dish)" title="删除">
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dish: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select', 'view', 'edit', 'toggle-status', 'delete'])

const getCategoryLabel = category => {
  const categoryMap = {
    recommended: '推荐',
    warming: '温补',
    cooling: '清热',
    quick: '快手菜'
  }
  return categoryMap[category] || category
}

const getConstitutionLabel = type => {
  const typeMap = {
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
  return typeMap[type] || type
}

const getConstitutionColor = type => {
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
  return colorMap[type] || 'var(--color-text-tertiary)'
}
</script>

<style scoped>
.dish-list-item {
  display: flex;
  align-items: stretch;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  cursor: pointer;
}

.dish-list-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
}

.dish-list-item.selected {
  border-color: var(--color-accent);
  background: var(--color-accent-alpha);
}

/* 选择框 */
.item-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  flex-shrink: 0;
}

.item-checkbox input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* 图片区域 */
.item-image {
  width: 120px;
  height: 90px;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--color-bg-tertiary);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.dish-list-item:hover .item-image img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
}

.placeholder-emoji {
  font-size: 2rem;
  opacity: 0.5;
}

/* 内容区域 */
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  min-width: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.item-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
  flex: 1;
}

.item-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  flex-shrink: 0;
}

.item-status.active {
  color: var(--color-success);
}

.item-status:not(.active) {
  color: var(--color-text-tertiary);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: currentColor;
}

.item-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.meta-icon {
  font-size: var(--text-xs);
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  background: var(--color-bg-tertiary);
  color: var(--color-accent);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-accent-alpha);
}

/* 体质适配信息 */
.constitution-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.constitution-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.constitution-label {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
  min-width: 40px;
}

.constitution-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.constitution-tag {
  background: var(--constitution-color);
  color: var(--color-text-inverse);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  opacity: 0.8;
}

.constitution-tag.suitable {
  background: var(--constitution-color);
}

.constitution-tag.avoid {
  background: var(--color-error);
  opacity: 0.7;
}

.constitution-more {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
}

/* 操作按钮 */
.item-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-lg);
  border-left: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--text-sm);
}

.action-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.action-btn.edit-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.action-btn.status-btn:hover {
  background: var(--color-warning);
  border-color: var(--color-warning);
}

.action-btn.delete-btn:hover {
  background: var(--color-error);
  border-color: var(--color-error);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dish-list-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 180px;
  }

  .item-checkbox {
    position: absolute;
    top: var(--spacing-md);
    left: var(--spacing-md);
    z-index: 2;
    background: var(--color-bg-elevated);
    border-radius: var(--radius-full);
    padding: var(--spacing-xs);
    box-shadow: var(--shadow-sm);
  }

  .content-header {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .item-status {
    align-self: flex-start;
  }

  .item-actions {
    flex-direction: row;
    justify-content: center;
    border-left: none;
    border-top: 1px solid var(--color-border-light);
    padding-top: var(--spacing-md);
  }

  .constitution-group {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .constitution-label {
    min-width: auto;
  }
}
</style>
