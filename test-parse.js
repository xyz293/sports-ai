// 简单的性能测试脚本
const { parallelfile } = require('./src/uilts/parallet');
const { parallelSerial } = require('./src/uilts/serial');

// 创建一个模拟的Blob对象用于测试
class MockBlob {
  constructor(size) {
    this.size = size;
    this.name = 'test.xlsx';
  }
  
  slice(start, end) {
    return new MockBlob(end - start);
  }
}

// 生成测试数据
async function runTest() {
  console.log('开始性能测试...');
  
  // 创建5MB的模拟文件
  const fileSize = 5 * 1024 * 1024;
  const file = new MockBlob(fileSize);
  
  console.log(`测试文件大小: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
  
  try {
    // 并行解析测试
    const parallelStart = performance.now();
    const parseParams = { data: file, index: file.name };
    const parallelParams = [parseParams];
    const parallelResult = await parallelfile(parallelParams, 1024, 'excel', file.name);
    const parallelTime = (performance.now() - parallelStart).toFixed(2);
    console.log(`并行解析耗时: ${parallelTime} ms`);
    
    // 串行解析测试
    const serialStart = performance.now();
    const serialResult = await parallelSerial(file, 1024, 'excel', file.name);
    const serialTime = (performance.now() - serialStart).toFixed(2);
    console.log(`串行解析耗时: ${serialTime} ms`);
    
    // 计算性能提升
    const speedUp = Number(parallelTime) > 0 ? (Number(serialTime) / Number(parallelTime)).toFixed(2) : '∞';
    const timeSaved = (Number(serialTime) - Number(parallelTime)).toFixed(2);
    
    console.log('\n性能对比结果:');
    console.log(`性能提升倍数: ${speedUp} 倍`);
    console.log(`节省时间: ${timeSaved} ms`);
    
  } catch (error) {
    console.error('测试出错:', error);
  }
}

// 运行测试
runTest();
