# 智膳 - 智能体质膳食推荐系统前端

基于 Vue 3 + Element Plus 的智能体质膳食推荐系统前端应用。

## 功能特性

### 🏠 首页

- 系统介绍和功能概览
- 推荐菜谱展示
- 中医体质理论介绍
- 快速导航到各个功能模块

### 🤖 AI 营养师

- 实时 AI 对话咨询
- 流式回复显示
- 快捷问题推荐
- 对话历史管理

### 🍳 菜谱管理

- 菜谱浏览和搜索
- 分类筛选（推荐、温补、清补、快手）
- 菜谱详情查看
- 体质匹配度显示
- 相关菜谱推荐

### 🧬 体质测试

- 中医体质辨识测试
- 个性化体质分析
- 养生建议推荐
- 体质信息保存

### ⚙️ 偏好设置

- 五味偏好调节（酸、甜、苦、辣、咸）
- 饮食禁忌设置
- 当前身体状态选择
- 用餐场景配置
- 烹饪难度和时间限制
- 过敏信息和不喜欢的食材管理

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **状态管理**: Pinia
- **UI 组件库**: Element Plus
- **HTTP 客户端**: Axios
- **路由管理**: Vue Router 4
- **构建工具**: Vite
- **开发工具**: unplugin-auto-import, unplugin-vue-components

## 项目结构

```
src/
├── api/                    # API接口定义
│   ├── index.js           # 主要API接口
│   ├── chat.js            # AI聊天接口
│   ├── recipe.js          # 菜谱相关接口
│   └── request.js         # Axios请求配置
├── components/            # 组件目录
│   ├── admin/            # 管理后台组件
│   ├── chat/             # 聊天相关组件
│   ├── preference/       # 偏好设置组件
│   └── recipe/           # 菜谱相关组件
├── stores/               # Pinia状态管理
│   ├── chat.js          # 聊天状态
│   ├── preference.js    # 用户偏好状态
│   ├── recipe.js        # 菜谱状态
│   └── user.js          # 用户状态
├── router/               # 路由配置
│   └── index.js         # 路由定义
├── views/                # 页面视图
│   ├── Home.vue         # 首页
│   ├── Chat.vue         # AI聊天页面
│   ├── Recipes.vue      # 菜谱列表页面
│   ├── RecipeDetail.vue # 菜谱详情页面
│   ├── Constitution.vue # 体质测试页面
│   └── Preference.vue   # 偏好设置页面
├── App.vue              # 根组件
└── main.js              # 应用入口
```

## 开发环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## API 配置

开发环境下，API 请求会通过 Vite 代理转发到后端服务器：

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

确保后端服务运行在 `http://localhost:3000` 端口。

## 主要功能说明

### 用户会话管理

- 自动创建匿名用户会话
- 会话 ID 本地存储
- 支持会话状态恢复

### AI 聊天功能

- 支持普通和流式两种模式
- 自动维护对话历史
- 实时显示 AI 回复
- 错误处理和重试机制

### 菜谱推荐

- 基于用户体质的个性化推荐
- 支持多种筛选条件
- 分页加载和无限滚动
- 菜谱详情完整展示

### 体质辨识

- 基于中医九种体质理论
- 问答式测试流程
- 实时进度显示
- 个性化养生建议

### 偏好管理

- 实时本地更新
- 批量保存机制
- 丰富的配置选项
- 直观的操作界面

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 开发注意事项

1. **API 调用**: 所有 API 调用都通过统一的 request 拦截器处理，自动添加 sessionId
2. **错误处理**: 统一的错误处理机制，包括网络错误和业务错误
3. **状态管理**: 使用 Pinia 进行状态管理，支持持久化和恢复
4. **响应式设计**: 所有页面都支持移动端和桌面端
5. **性能优化**: 组件懒加载、图片懒加载、API 缓存等

## 部署说明

### 环境变量

创建 `.env.production` 文件配置生产环境变量：

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### 构建部署

```bash
npm run build
```

构建后的文件在 `dist` 目录中，可以部署到任何静态文件服务器。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。
