import {Input} from 'antd'
import {uploadFile,mergeFile} from '../../api/file'
import SparkMD5 from 'spark-md5'
const AgentFile = () => {
    const getChunk = (file:File) => {
        const chunkSize = 1024 * 1024
        const chunks = []
        for(let i = 0;i<file.size;i+=chunkSize){
            chunks.push(file.slice(i,i+chunkSize))
        }
        return chunks
    }
    const getHash=(file:Blob[])=>{
        const chunks  = [] as Blob[]
        file.forEach((chunk,index)=>{
            if(index === 0||index === file.length-1){
               chunks.push(chunk)
            }
           else {
                chunks.push(file.slice(0,2))
                chunks.push(file.slice(file.length-2,file.length))
                chunks.push(file.slice(file.length/2,file.length/2+2))
             }
        })
        const spark = new SparkMD5.ArrayBuffer()
        const reader = new FileReader()
        reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = (e) => {
            spark.append(e.target?.result)
        }
        return spark.end()
    }
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
                 const hash = getHash(chunks)
                await uploadChunk(chunks,hash)
                await merge(hash,file.name)
            }
        }}
        />
    </div>
   )
}
export default AgentFile