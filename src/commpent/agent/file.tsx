import {Input} from 'antd'
import {uploadFile,mergeFile,verifyFile} from '../../api/file'
import { getFile} from '../../api/file'
import {Aichat} from '../../api/message'
import {getId} from '../../uilts/tools'
import type { AImessageInfo } from '../../type/message/index'
interface AgentFileProps {
  messages: AImessageInfo[];
  setMessages: (messages: AImessageInfo[]) => void;
}
const AgentFile = ({messages,setMessages}:AgentFileProps) => {
    const getChunk = (file:File) => {
        const chunkSize = 1024 * 1024
        const chunks = []
        for(let i = 0;i<file.size;i+=chunkSize){
            chunks.push({
                chunk:file.slice(i,i+chunkSize),
                index:i
            })
        }
        return chunks
    }
    const getcontext =async (key:string)=>{
        const res = await Aichat({
            id:getId(),
            content:key
        })
        return res.data.content
    }
const getHashByWorker = (chunks: {chunk:Blob,index:number}[]): Promise<string> => {
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
   const getNeed =async (chunks:{chunk:Blob,index:number}[],rechunk:number[]): Promise<{chunk:Blob,index:number}[]> =>{
            return new Promise((resolve,reject)=>{
              try{
                  const need = chunks.filter((item)=>!rechunk.includes(item.index))
                resolve(need)
              }
               catch(err){
                  reject(err)
               }
            })
   }
   const verity=async (filename:string,hash:string,chunks:{chunk:Blob,index:number}[])=>{
    const res = await verifyFile(filename)
   
          if(res.data.code === 200){
            await uploadChunk(chunks,hash)
             const context = await merge(hash,filename)
              const res = await getcontext(context)
              setMessages([...messages,{role:'assistant',content:res,id:Date.now(),user_id:getId(),create_time:new Date().toLocaleString()}])
          }
          else {
            alert('文件成功')
          }
   }
    const getFileByHash = (hash:string):Promise<number[]> => {
         return new Promise((resolve,reject)=>{
            getFile(hash).then((res)=>{
                try{
                  resolve(res.data.chunkFiles)
                }
                catch(err){
                    reject(err)
                }
            }).catch((err)=>{
                reject(err)
            })
         })
    }

    const uploadChunk =async (chunk:{chunk:Blob,index:number}[],hash:string)=>{
        const data = new FormData()
          chunk.forEach(async (item)=>{
            data.append('file',item.chunk)
            data.append('hash',hash)
            data.append('index',item.index.toString())
          await  uploadFile(data)
          })
    }
    const merge = async (hash:string,fileName:string) :Promise<string> => {
      return new Promise((resolve,reject)=>{
        mergeFile(hash,fileName).then((res)=>{
          try{
            resolve(res.data.context)
          }
          catch(err){
            reject(err)
          }
        }).catch((err)=>{
          reject(err)
        })
      })
    }
   return (
    <div>
        <Input placeholder='请上传文件' type='file' style={{width:180}} 
         onChange={async (e)=>{
            const file = e.target.files?.[0]
            if(file){
                const chunks = getChunk(file)
                const hash = await getHashByWorker(chunks)
                const chunkfile = await getFileByHash(hash)
                const need = await getNeed(chunks,chunkfile)
               await verity(file.name,hash,need)
            }
        }}
        />
    </div>
   )
}
export default AgentFile