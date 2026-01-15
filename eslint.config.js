import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react' // 新增：react核心校验插件
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// 注意：你的代码里 import { globalIgnores } from 'eslint/config' 是错误的！新版本写法在这
const globalIgnores = {
  ignores: ['dist', 'node_modules', 'build', 'coverage'], // 忽略打包目录/依赖包
}

export default tseslint.config([
  globalIgnores,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat.recommended, // 新增：react推荐规则
      react.configs.flat['jsx-runtime'], // 新增：适配React18+自动导入jsx
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest', // 改为最新版，兼容所有ES语法
      globals: {
        ...globals.browser, // 浏览器全局变量
        ...globals.es2025,  // ES2025全局变量
      },
      parser: tseslint.parser, // 显式指定ts解析器
      parserOptions: {
        project: ['./tsconfig.json'], // 关联tsconfig，必须加！ts语法校验完整
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // ✅ 核心规则修复：解决你的两个报错 + 常用宽松配置
    rules: {
      // ========== 解决：@typescript-eslint/no-explicit-any 报错 ==========
      // 关闭【强制禁止any】，改为【警告】，实习/开发阶段最实用，不报错只提醒
      '@typescript-eslint/no-explicit-any': ['warn', { 
        ignoreRestArgs: true, // 允许函数剩余参数用any
        fixToUnknown: false 
      }],

      // ========== 解决：react-hooks/exhaustive-deps 报错 ==========
      // 保留规则，改为【警告】，避免误报时阻断开发，同时保留提示
      'react-hooks/exhaustive-deps': ['warn'],
      'react-hooks/rules-of-hooks': ['error'], // hooks语法错误必须报错

      // ========== 其他实用宽松配置（开发阶段必备，避免无用报错） ==========
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 允许下划线命名的未使用变量
      '@typescript-eslint/no-empty-object-type': 'warn',
      'react/prop-types': 'off', // ts项目用接口替代prop-types，直接关闭
      'react/no-unescaped-entities': 'off',
    },
    settings: {
      react: { version: 'detect' }, // 自动检测react版本，不用手动写
    },
  },
])