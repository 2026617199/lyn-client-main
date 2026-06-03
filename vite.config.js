import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  // 加载对应模式的环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          // 只在开发环境启用代理
          // target: 'https://lyn-backend2-165954-5-1362504576.sh.run.tcloudbase.com/',
          target: 'http://localhost:3000', // 替换为你的目标API地址
          changeOrigin: true,
          timeout: 300000 // 5分钟超时，确保AI接口有足够时间响应
        }
      }
    },
    // 确保环境变量在构建时可用
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_API_BASE_URL)
    }
  }
});
