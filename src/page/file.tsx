import { useState } from 'react';

const File = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 生成文件分片
  const generateChunks = (file: Blob, chunkSize: number): Blob[] => {
    const chunks: Blob[] = [];
    let currentIndex = 0;
    while (currentIndex < file.size) {
      const endIndex = Math.min(currentIndex + chunkSize, file.size);
      chunks.push(file.slice(currentIndex, endIndex));
      currentIndex = endIndex;
    }
    return chunks;
  };

  // 实际的文件处理函数（使用简单的文本解析模拟Excel解析）
  const processFileChunk = async (chunk: Blob): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // 模拟文件解析，实际项目中这里会调用Excel解析库
          const content = e.target?.result as string;
          // 简单处理，将内容按行分割
          const lines = content.split('\n');
          resolve(lines);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(chunk);
    });
  };

  // 并行处理文件
  const runParallelProcessing = async (file: File, chunkSize: number) => {
    const chunks = generateChunks(file, chunkSize);
    console.log(`并行处理: ${chunks.length} 个分片`);
    
    const { webworkPool } = await import('../uilts/webwork');
    const pool = webworkPool.getInstance(Math.min(navigator.hardwareConcurrency || 8, 16), './work.ts');
    
    try {
      const tasks = chunks.map(async (chunk, index) => {
        // 将chunk转换为可序列化的数据
        return pool.run({ chunk: await chunk.arrayBuffer() }, 'file-chunk');
      });
      
      return await Promise.allSettled(tasks);
    } finally {
      // 不销毁线程池
    }
  };

  // 串行处理文件
  const runSerialProcessing = async (file: File, chunkSize: number) => {
    const chunks = generateChunks(file, chunkSize);
    console.log(`串行处理: ${chunks.length} 个分片`);
    
    const results = [];
    for (const chunk of chunks) {
      try {
        const result = await processFileChunk(chunk);
        results.push({ status: 'fulfilled' as const, value: result });
      } catch (error) {
        results.push({ status: 'rejected' as const, reason: error });
      }
    }
    return results;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const startPerformanceTest = async () => {
    if (!selectedFile || isParsing) return;
    
    setIsParsing(true);
    
    try {
      const chunkSize = 1024 * 100; // 100KB chunks (增大分片大小，减少任务数量)
      
      console.log('=== 开始性能对比测试 ===');
      const fileSizeKB = (selectedFile.size / 1024).toFixed(2);
      console.log('文件:', selectedFile.name, ', 大小:', fileSizeKB, 'KB');
      
      // 并行处理
      const parallelStart = performance.now();
      await runParallelProcessing(selectedFile, chunkSize);
      const parallelTime = (performance.now() - parallelStart).toFixed(2);
      
      // 串行处理
      const serialStart = performance.now();
      await runSerialProcessing(selectedFile, chunkSize);
      const serialTime = (performance.now() - serialStart).toFixed(2);
      
      // 计算性能提升
      const speedUp = Number(parallelTime) > 0 ? (Number(serialTime) / Number(parallelTime)).toFixed(2) : '∞';
      const timeSaved = (Number(serialTime) - Number(parallelTime)).toFixed(2);
      
      // 保存结果
      setTestResults({
        filename: selectedFile.name,
        fileSize: (selectedFile.size / 1024).toFixed(2),
        parallelTime,
        serialTime,
        speedUp,
        timeSaved
      });
      
      // 控制台输出
      console.log('=== 解析时间对比结果 ===');
      console.log('文件:', selectedFile.name);
      console.log('文件大小:', fileSizeKB, 'KB');
      console.log('并行解析时间:', parallelTime, 'ms');
      console.log('串行解析时间:', serialTime, 'ms');
      console.log('性能提升:', speedUp, '倍');
      console.log('节省时间:', timeSaved, 'ms');
      console.log('====================');
      
    } catch (error) {
      console.error('测试失败:', error);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>文件解析性能对比</h1>
      
      <div style={{ margin: '30px 0', textAlign: 'center' }}>
        <input
          type="file"
          accept=".txt,.csv,.xlsx,.xls"
          onChange={handleFileUpload}
          disabled={isParsing}
          style={{ marginRight: '10px' }}
        />
        
        {selectedFile && (
          <button
            onClick={startPerformanceTest}
            disabled={isParsing}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              cursor: isParsing ? 'not-allowed' : 'pointer',
              backgroundColor: isParsing ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isParsing ? '解析中...' : '开始性能对比'}
          </button>
        )}
        
        {selectedFile && (
          <div style={{ marginTop: '10px', color: '#666' }}>
            已选择文件: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </div>

      {testResults && (
        <div style={{ 
          border: '1px solid #ccc', 
          borderRadius: 8, 
          padding: 20, 
          margin: '20px 0',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ marginTop: 0, color: '#333', textAlign: 'center' }}>解析时间对比结果</h2>
          
          <div style={{ margin: '15px 0', textAlign: 'center' }}>
            <p><strong>文件名:</strong> {testResults.filename}</p>
            <p><strong>文件大小:</strong> {testResults.fileSize} KB</p>
          </div>
          
          <div style={{ display: 'flex', gap: 30, margin: '30px 0', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#4CAF50' }}>
                {testResults.parallelTime} ms
              </div>
              <div style={{ fontSize: 18, color: '#666', marginTop: '10px' }}>并行解析</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f44336' }}>
                {testResults.serialTime} ms
              </div>
              <div style={{ fontSize: 18, color: '#666', marginTop: '10px' }}>串行解析</div>
            </div>
          </div>
          
          <div style={{ margin: '30px 0', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>
              性能提升: {testResults.speedUp} 倍
            </div>
            <div style={{ fontSize: 16, color: '#1976d2', textAlign: 'center', marginTop: '10px' }}>
              节省时间: {testResults.timeSaved} ms
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default File;
