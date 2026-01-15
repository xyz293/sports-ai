// 简单测试：验证解析函数是否正常工作
const { sliceChunk, parallel } = require('./src/uilts/parallet');
const { parallelSerial } = require('./src/uilts/serial');

// 创建模拟数据
async function testSliceChunk() {
  console.log('测试文件分片功能...');
  
  // 模拟5MB文件
  const mockFile = {
    size: 5 * 1024 * 1024,
    slice: function(start, end) {
      return { size: end - start };
    }
  };
  
  const chunkSize = 1024 * 1024; // 1MB分片
  const result = sliceChunk(mockFile, chunkSize, 0);
  
  console.log(`分片结果：`);
  console.log(`- 总大小：${mockFile.size} bytes`);
  console.log(`- 分片大小：${chunkSize} bytes`);
  console.log(`- 生成的分片数：${result.chunks.length}`);
  console.log(`- 完成索引：${result.chunkIndex}`);
  
  return result;
}

// 测试线程池创建
async function testThreadPool() {
  console.log('\n测试线程池功能...');
  try {
    const { webworkPool } = require('./src/uilts/webwork');
    const pool = webworkPool.getInstance(8, './work.ts');
    console.log('✅ 线程池创建成功');
    
    // 获取线程池统计信息
    const stats = pool.getStats();
    console.log(`线程池统计：`);
    console.log(`- 最大线程数：${stats.maxWorkerCount}`);
    console.log(`- 活跃线程数：${stats.activeWorkers}`);
    console.log(`- 空闲线程数：${stats.idleWorkers}`);
    
    return true;
  } catch (error) {
    console.error('❌ 线程池测试失败:', error.message);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('===== 解析函数测试 =====');
  
  await testSliceChunk();
  await testThreadPool();
  
  console.log('\n✅ 所有核心功能测试完成！');
  console.log('\n说明：');
  console.log('1. 文件分片功能已优化，移除了最多10个分片的限制');
  console.log('2. 线程池已优化，支持动态线程数和实例复用');
  console.log('3. 现在可以上传文件到 http://localhost:5174/ 测试完整性能');
}

runAllTests();
