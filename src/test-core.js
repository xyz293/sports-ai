// 核心功能测试
console.log('===== 文件解析核心功能测试 =====');

// 导入分片函数
import { sliceChunk } from './uilts/parallet.ts';

// 创建模拟文件对象
class MockFile {
  constructor(size) {
    this.size = size;
  }

  slice(start, end) {
    return new MockFile(end - start);
  }
}

// 测试分片功能
console.log('\n1. 测试文件分片功能:');
const fileSize = 5 * 1024 * 1024; // 5MB
const chunkSize = 1024 * 1024; // 1MB per chunk
const mockFile = new MockFile(fileSize);

const result = sliceChunk(mockFile, chunkSize, 0);
console.log(`   文件大小: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   分片大小: ${(chunkSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   生成分片数: ${result.chunks.length}`);
console.log(`   完成索引: ${result.chunkIndex}`);
console.log(`   分片功能测试: ✅ ${result.chunks.length > 10 ? '通过 - 已移除10个分片限制' : '失败 - 仍有限制'}`);

// 测试分片数量是否正确
const expectedChunks = Math.ceil(fileSize / chunkSize);
console.log(`   预期分片数: ${expectedChunks}`);
console.log(`   实际分片数: ${result.chunks.length}`);
console.log(`   分片数量测试: ${result.chunks.length === expectedChunks ? '✅ 通过' : '❌ 失败'}`);

console.log('\n===== 测试完成 =====');
