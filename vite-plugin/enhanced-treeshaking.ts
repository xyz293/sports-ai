import type { Plugin, ResolvedConfig } from 'vite';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import type { File } from '@babel/types';
import path from 'path';

// 插件选项类型
interface EnhancedTreeShakingOptions {
  // 需要忽略 Tree-Shaking 的文件/目录（glob 模式）
  exclude?: string[];
  log?: boolean;
}

// 默认选项
const defaultOptions: EnhancedTreeShakingOptions = {
  exclude: ['node_modules/**/*.cjs', '**/*.d.ts'],
  log: true,
};

export function enhancedTreeShaking(
  options: EnhancedTreeShakingOptions = {}
): Plugin {
  const opts = { ...defaultOptions, ...options };
  let config: ResolvedConfig;
  // 记录优化前后的体积，用于量化成果
  const sizeMap = new Map<string, { before: number; after: number }>();

  return {
    name: 'vite-plugin-enhanced-treeshaking',
    enforce: 'pre', // 优先于其他插件执行，确保先清理代码
    apply: 'build', // 仅在构建模式生效（开发模式不影响热更新）
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    // 核心：转换代码，剔除未使用的节点
    async transform(code, id) {
      // 跳过排除的文件（如 CommonJS 模块、类型声明文件）
      if (opts.exclude?.some(pattern => config.createFilter(pattern)(id))) {
        return null;
      }

      // 仅处理 JS/TS/JSX/TSX 文件
      if (!/\.(js|ts|jsx|tsx)$/.test(id)) {
        return null;
      }

      // 记录优化前的代码体积
      const beforeSize = Buffer.byteLength(code, 'utf-8');
      sizeMap.set(id, { before: beforeSize, after: beforeSize });

      try {
        // 1. 解析代码为 AST（抽象语法树）
        const ast: File = parse(code, {
          sourceType: 'module', // 按 ESM 模块解析
          plugins: [
            'jsx',
            'typescript',
            'classProperties',
            'optionalChaining',
            'nullishCoalescingOperator',
          ], // 支持 React/TS 语法
          sourceFilename: id,
        });

        // 2. 遍历 AST，收集未使用的节点
        const unusedNodes = new Set<string>();
        const bindingMap = new Map<string, boolean>(); // 记录变量是否被使用

        traverse(ast, {
          // 收集所有变量/函数声明
          Declaration(path) {
            if (path.isVariableDeclaration() || path.isFunctionDeclaration()) {
              const name = path.node.id?.name;
              if (name) {
                bindingMap.set(name, false); // 初始标记为未使用
              }
            }
          },

          // 标记被引用的变量/函数
          Identifier(path) {
            const name = path.node.name;
            if (bindingMap.has(name) && path.parentPath?.isReferencedIdentifier()) {
              bindingMap.set(name, true); // 标记为已使用
            }
          },

          // 处理导入语句：剔除未使用的导入
          ImportDeclaration(path) {
            const specifiers = path.node.specifiers.filter(spec => {
              if (spec.type === 'ImportSpecifier') {
                const localName = spec.local.name;
                return bindingMap.has(localName) ? bindingMap.get(localName)! : true;
              }
              return true; // 保留默认导入和命名空间导入
            });

            // 如果所有导入都未使用，移除整个导入语句
            if (specifiers.length === 0) {
              path.remove();
            } else {
              path.node.specifiers = specifiers;
            }
          },
        });

        // 3. 移除未使用的变量/函数声明
        traverse(ast, {
          Declaration(path) {
            if (path.isVariableDeclaration() || path.isFunctionDeclaration()) {
              const name = path.node.id?.name;
              if (name && bindingMap.get(name) === false) {
                unusedNodes.add(name);
                path.remove(); // 移除未使用的节点
              }
            }
          },
        });

        // 4. 生成清理后的代码
        const { code: transformedCode } = generate(ast, {
          retainLines: true, // 保留行号，便于调试
          comments: true, // 保留注释
        });

        // 5. 记录优化后的体积
        const afterSize = Buffer.byteLength(transformedCode, 'utf-8');
        sizeMap.set(id, { before: beforeSize, after: afterSize });

        // 输出优化日志
        if (opts.log && beforeSize > afterSize) {
          const reduced = ((beforeSize - afterSize) / beforeSize * 100).toFixed(2);
          this.info(`[Tree-Shaking] 优化 ${path.basename(id)}: 体积从 ${beforeSize}B 降至 ${afterSize}B（减少 ${reduced}%）`);
        }

        return {
          code: transformedCode,
          map: null, // 简化：关闭 sourcemap（如需保留可生成，略复杂）
        };
      } catch (error) {
        this.warn(`[Tree-Shaking] 处理 ${id} 失败：${(error as Error).message}`);
        return null; // 处理失败时返回原代码，不影响构建
      }
    },

    // 构建结束后，输出整体优化报告
    buildEnd() {
      if (!opts.log) return;

      const totalBefore = Array.from(sizeMap.values()).reduce((sum, item) => sum + item.before, 0);
      const totalAfter = Array.from(sizeMap.values()).reduce((sum, item) => sum + item.after, 0);
      const totalReduced = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(2);

      this.info('\n=============================================');
      this.info(`[Tree-Shaking] 整体优化报告：`);
      this.info(`优化前总体积：${(totalBefore / 1024).toFixed(2)}KB`);
      this.info(`优化后总体积：${(totalAfter / 1024).toFixed(2)}KB`);
      this.info(`整体体积减少：${totalReduced}%`);
      this.info('=============================================\n');
    },
  };
}