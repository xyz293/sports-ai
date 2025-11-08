import SparkMD5 from 'spark-md5';

self.onmessage = async (e) => {
  const { chunks } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  let completed = 0; // 计算进度

  // 逐片读取并计算 hash
  const calculateHash = async () => {
    for (const { chunk } of chunks) {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(chunk); // 读取当前分片
        reader.onload = (event) => {
          spark.append(event.target?.result); // 添加到 hash 计算
          completed++;
          // 发送进度（前端可展示）
          self.postMessage({ progress: completed / chunks.length });
          resolve();
        };
      });
    }
    // 所有分片计算完成，返回最终 hash
    self.postMessage({ hash: spark.end(), progress: 1 });
    self.close(); // 关闭 worker
  };

  calculateHash().catch((err) => {
    console.error('hash 计算失败：', err);
    self.postMessage({ error: err.message });
    self.close();
  });
};