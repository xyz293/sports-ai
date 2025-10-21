import  SparkMD5  from 'spark-md5'
self.onmessage = async (e) => {
  const { chunks } = e.data;
   const list =[] 
   chunks.forEach((item:Blob,index:number) => {
    if(index === 0||index === chunks.length-1){
      list.push(item)
    }
    else {
        list.push(chunks.slice(0,2))
        list.push(chunks.slice(chunks.length-2,chunks.length))
        list.push(chunks.slice(chunks.length/2,chunks.length/2+2))
    }
   })

   const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
  reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = (e) => {
            spark.append(e.target?.result)
        }
  self.postMessage({ hash: spark.end() }); // 完成后返回 hash
};