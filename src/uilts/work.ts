// 处理文件分片的worker
self.onmessage = async(event) => {
  try {
    const { chunk: arrayBuffer } = event.data.data;
    
    // 将arrayBuffer转换为Blob
    const chunkBlob = new Blob([new Uint8Array(arrayBuffer)]);
    
    // 模拟文件解析过程（与主线程相同的处理逻辑）
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(chunkBlob);
    });
    
    // 简单处理，将内容按行分割
    const lines = content.split('\n');
    
    // 返回处理结果
    self.postMessage({
      res: lines,
      message: 'success'
    });
  } catch(error) {
    console.error('Worker error:', error);
    self.postMessage({
      error: error.message,
      message: 'error'
    });
  }
}

