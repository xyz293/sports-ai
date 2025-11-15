import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { enhancedTreeShaking } from './vite-plugin/enhanced-treeshaking';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    enhancedTreeShaking({
      exclude: [
        'node_modules/**/*.cjs', // 跳过 CommonJS 模块（避免解析错误）
        '**/*.d.ts', // 跳过类型声明文件
        'node_modules/react/**/*',
        'node_modules/antd/**/*',
        'node_modules/axios/**/*',
      ],
      log: true, // 开启优化日志，便于查看优化效果（生产构建可关闭）
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    target: 'es2020', // 2. 指定 ES 目标版本：支持 ESM 模块，让 Tree-Shaking 更有效
    rollupOptions: {
      treeshake: {
        // 3. 开启 Rollup 原生 Tree-Shaking，与自定义插件互补
        moduleSideEffects: false, // 假设模块无副作用（如需保留副作用，可配置具体路径）
        propertyReadSideEffects: false,
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 手动分包逻辑不变：拆分核心库，提升缓存命中率
            if (id.includes('axios')) {
              return 'axios';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react'; // 合并 react + react-dom 为一个 chunk，减少请求数
            }
            if (id.includes('antd')) {
              return 'antd';
            }
            // 其他第三方库合并为 vendor
            return 'vendor';
          }
        },
      },
    },
  },
});