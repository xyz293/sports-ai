import {Input} from 'antd'
import {uploadFile,mergeFile} from '../../api/file'
const AgentFile = () => {
    const getChunk = (file:File) => {
        const chunkSize = 1024 * 1024
        const chunks = []
        for(let i = 0;i<file.size;i+=chunkSize){
            chunks.push(file.slice(i,i+chunkSize))
        }
        return chunks
    }
const getHashByWorker = (chunks: Blob[]): Promise<string> => {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('../../../public/hashWorker', import.meta.url),{
      type:'module'
    });
    worker.postMessage({ chunks }); // 把分片发送给 worker

    worker.onmessage = (e) => {
      const { hash, progress } = e.data;
      if (progress) console.log('hash进度', progress); 
      if (hash) {
        worker.terminate(); // 计算完成，关闭 worker
        resolve(hash);      // 返回最终 hash
      }
    };
  });
};
  
    const uploadChunk =async (chunk:Blob[],hash:string)=>{
        const data = new FormData()
          chunk.forEach(async (item,index)=>{
            const chunkHash = `${hash}-${index}`
            data.append('file',item)
            data.append('hash',hash)
            data.append('chunkHash',chunkHash)
          await  uploadFile(data)
          })
    }
    const merge = async (hash:string,fileName:string) => {
        await mergeFile(hash,fileName)
    }
   return (
    <div>
        <Input placeholder='请上传文件' type='file' style={{width:180}} 
         onChange={async (e)=>{
            const file = e.target.files?.[0]
            if(file){
                const chunks = getChunk(file)
                const hash = await getHashByWorker(chunks)
                await uploadChunk(chunks,hash)
                await merge(hash,file.name)
            }
        }}
        />
    </div>
   )
}
export default AgentFile