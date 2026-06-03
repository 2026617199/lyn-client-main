# 样式系统使用指南

## 概述

本项目采用基于 CSS Variables 的主题系统，提供了完整的设计令牌（Design Tokens）和工具类。

## 文件结构

```
src/styles/
├── variables.css    # CSS 变量定义（颜色、间距、字体等）
├── reset.css        # CSS Reset
├── global.css       # 全局样式和工具类
├── animations.css   # 动画定义
└── README.md        # 本文档
```

## 使用方法

### 1. 颜色系统

```css
/* 主色调 */
background: var(--color-primary);
color: var(--color-primary-light);

/* 强调色 */
background: var(--color-accent);

/* 文字色 */
color: var(--color-text-primary);
color: var(--color-text-secondary);
color: var(--color-text-tertiary);

/* 背景色 */
background: var(--color-bg-primary);
background: var(--color-bg-elevated);

/* 状态色 */
color: var(--color-success);
color: var(--color-error);
color: var(--color-warning);
```

### 2. 间距系统

```css
/* 使用预定义间距 */
padding: var(--spacing-md);
margin: var(--spacing-lg);
gap: var(--spacing-sm);

/* 可用值：xs, sm, md, lg, xl, 2xl, 3xl, 4xl */
```

### 3. 圆角系统

```css
border-radius: var(--radius-md);
border-radius: var(--radius-lg);
border-radius: var(--radius-full);

/* 可用值：sm, md, lg, xl, 2xl, full */
```

### 4. 阴影系统

```css
box-shadow: var(--shadow-sm);
box-shadow: var(--shadow-md);
box-shadow: var(--shadow-lg);

/* 可用值：sm, md, lg, xl, 2xl, inner */
```

### 5. 字体系统

```css
/* 字体族 */
font-family: var(--font-sans);   /* 正文 */
font-family: var(--font-serif);  /* 标题 */
font-family: var(--font-mono);   /* 代码 */

/* 字体大小 */
font-size: var(--text-base);
font-size: var(--text-lg);
font-size: var(--text-2xl);

/* 字重 */
font-weight: var(--font-normal);
font-weight: var(--font-medium);
font-weight: var(--font-bold);
```

### 6. 过渡动画

```css
transition: all var(--transition-base);
transition: all var(--transition-fast);
transition: all var(--transition-slow);

/* 缓动函数 */
transition: all 300ms var(--ease-in-out);
```

## 工具类

### 布局类

```html
<!-- Flex 布局 -->
<div class="flex items-center justify-between gap-md">
  <div>内容</div>
</div>

<!-- 容器 -->
<div class="container">
  <!-- 内容会自动居中，最大宽度 1280px -->
</div>
```

### 按钮类

```html
<!-- 主按钮 -->
<button class="btn btn-primary">主按钮</button>

<!-- 强调按钮 -->
<button class="btn btn-accent">强调按钮</button>

<!-- 次级按钮 -->
<button class="btn btn-secondary">次级按钮</button>

<!-- 幽灵按钮 -->
<button class="btn btn-ghost">幽灵按钮</button>

<!-- 尺寸变体 -->
<button class="btn btn-primary btn-sm">小按钮</button>
<button class="btn btn-primary btn-lg">大按钮</button>
```

### 卡片类

```html
<!-- 基础卡片 -->
<div class="card">
  <h3>卡片标题</h3>
  <p>卡片内容</p>
</div>

<!-- 扁平卡片 -->
<div class="card card-flat">
  <p>无阴影卡片</p>
</div>
```

### 输入框类

```html
<!-- 基础输入框 -->
<input type="text" class="input" placeholder="请输入内容" />

<!-- 错误状态 -->
<input type="text" class="input input-error" />
```

### 标签类

```html
<!-- 基础标签 -->
<span class="tag">标签</span>

<!-- 主色标签 -->
<span class="tag tag-primary">主色标签</span>

<!-- 强调色标签 -->
<span class="tag tag-accent">强调标签</span>
```

### 动画类

```html
<!-- 淡入动画 -->
<div class="animate-fade-in">内容</div>

<!-- 从下方淡入 -->
<div class="animate-fade-in-up">内容</div>

<!-- 脉动动画 -->
<div class="animate-pulse">加载中...</div>

<!-- 旋转动画 -->
<div class="animate-spin">⟳</div>

<!-- 浮动动画 -->
<div class="animate-float">🎈</div>
```

## 体质色彩映射

系统为九种中医体质定义了专属颜色：

```css
/* 在组件中使用 */
.constitution-balanced {
  background: var(--color-constitution-balanced);
}

.constitution-qi {
  background: var(--color-constitution-qi);
}

/* 其他体质类型：
   - yang (阳虚质)
   - yin (阴虚质)
   - phlegm (痰湿质)
   - damp (湿热质)
   - blood (血瘀质)
   - qi-stagnation (气郁质)
   - special (特禀质)
*/
```

## 响应式设计

系统内置了响应式断点：

```css
/* 移动端 */
@media (max-width: 768px) {
  /* 样式 */
}

/* 平板 */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 样式 */
}

/* 桌面端 */
@media (min-width: 1024px) {
  /* 样式 */
}
```

## 暗色主题（可选）

系统支持暗色主题，通过在根元素添加 `data-theme="dark"` 属性即可切换：

```javascript
// 切换到暗色主题
document.documentElement.setAttribute('data-theme', 'dark')

// 切换回亮色主题
document.documentElement.removeAttribute('data-theme')
```

## 最佳实践

1. **优先使用 CSS 变量**：避免硬编码颜色值和尺寸
2. **使用工具类**：对于简单的样式，优先使用工具类
3. **保持一致性**：使用统一的间距、圆角、阴影等
4. **语义化命名**：自定义类名要有明确的语义
5. **响应式优先**：考虑移动端体验

## 示例

完整的组件示例：

```vue
<template>
  <div class="card animate-fade-in-up">
    <h3 class="text-2xl font-semibold mb-md">卡片标题</h3>
    <p class="text-secondary mb-lg">这是一段描述文字</p>
    <div class="flex gap-sm">
      <button class="btn btn-primary">确认</button>
      <button class="btn btn-secondary">取消</button>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
.card {
  max-width: 500px;
}
</style>
```
