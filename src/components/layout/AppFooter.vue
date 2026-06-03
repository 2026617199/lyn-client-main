<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">中医体质膳食推荐系统</h3>
          <p class="footer-desc">基于中医体质理论的智能膳食推荐系统</p>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">快速链接</h4>
          <ul class="footer-links">
            <li><router-link to="/ai-diagnosis">养生咨询</router-link></li>
            <li><router-link to="/constitution-diagnosis">体质设置</router-link></li>
            <li><router-link to="/recipe-recommendation">菜谱浏览</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">关于</h4>
          <ul class="footer-links">
            <li><a href="#">关于我们</a></li>
            <li><a href="#">隐私政策</a></li>
            <li><a href="#">使用条款</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© {{ currentYear }} 中医体质膳食推荐系统. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border-light);
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer-title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  margin: 0;
}

.footer-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.footer-heading {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-links a {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  transition: color var(--transition-base);
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
  text-align: center;
}

.copyright {
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
}
</style>
