import type {parse,parseresult} from '../type/result.ts'
import {Excel} from './factory.ts'
import {webworkPool} from './webwork.ts'
import {LRU} from './cash.ts'

export const parallelfile =async(list:parse[] ,size:number,type:string,filename:string)=>{
            let success =0
            let failed =0
            const results:parseresult[] =[]
            if(!type){
              return{
                 success:0,
                 failed:0,
                 results:[]
              }
            }
           const res =await Promise.allSettled(list.map(async(item)=>{
            if(item.data){
                const fileKey = `${filename}_${item.index}`
                const filedata =await parallel(item.data,size,type,fileKey)
                  if(filedata){
                    success++
                  }
                  else {
                    failed++
                  }
                return  {
                    data:filedata,
                    index:item.index
                  }
                }
           }))
            return {
                success:success,
                failed:failed,
                results:res.filter(item=>item.status==='fulfilled').map(item=>item.value)
            }
}

export const sliceChunk = (blob: Blob, chunkSize: number, startIndex: number) => {
  const chunks: Blob[] = [];
  let currentIndex = startIndex;

  // 移除每次最多10个分片的限制，生成尽可能多的分片
  while (currentIndex < blob.size) {
    const endIndex = Math.min(currentIndex + chunkSize, blob.size);
    const chunk = blob.slice(currentIndex, endIndex);
    chunks.push(chunk);
    currentIndex = endIndex;
  }

  return {
    chunkIndex: currentIndex,
    chunks: chunks
  };
};

export const parallel =async(content:Blob,size:number,type:string,filenme:string):Promise<any>=>{  
    try{
         const lru =LRU.getInstance()
         
         // 检查LRU缓存
         if(lru.has(filenme)){
            const cached = lru.get(filenme)
            return cached?.data || null
         }
         else {
            const chuncksize:number =1024*size
            let index =0
            
            // 一次性分片所有文件
            const {chunks: allChunks} = sliceChunk(content, chuncksize, index)
            console.log('生成的分片数量:', allChunks.length)
            
            // 一次性处理所有分片，不进行分批
            const results = await getchunck(allChunks,type)
            
            // 缓存结果
            lru.set(filenme,results)
            
            return results
         }
    }catch(error){
        console.error('❌ 文件解析异常:', error)
        return []
    }
}

export const promise =async(chunck:Blob|undefined)=>{
    const factory =new Excel()
    if(chunck){
       const data =await factory.parse(chunck)
       return data
    }
    return ['']
}

// 线程池实例复用，避免重复创建和销毁
const getWorkerPool = () => {
  // 根据系统CPU核心数动态调整线程数，最多16个
  const threadCount = Math.min(navigator.hardwareConcurrency || 8, 16);
  return webworkPool.getInstance(threadCount, './work.ts');
};

const getchunck =async(list:Blob[],type:string)=>{
    try{
      // 获取线程池实例（单例复用）
      const workerpool = getWorkerPool()
      
      // 一次性分配所有任务
      const chuncklist = list.map(item => workerpool.run(item,type))
      
      // 等待所有任务完成
      const data =await Promise.allSettled(chuncklist)
      
      // 处理结果
      const result:string[] = []
      console.log('线程池任务结果数量:', data.length)
      
      data.forEach((item, index)=>{
        console.log(`任务 ${index} 状态:`, item.status)
        
        if(item.status==='fulfilled' && item.value){
          // 检查是否为错误响应
          if (typeof item.value === 'object' && item.value?.message === 'error') {
            console.error(`任务 ${index} 执行失败:`, item.value.error)
            return
          }
          
          // Check if it's a worker response object with success message
          let actualData = item.value
          if (typeof actualData === 'object' && actualData?.message === 'success' && actualData?.res) {
            actualData = actualData.res
          }
          
          console.log(`任务 ${index} 数据类型:`, Array.isArray(actualData) ? 'array' : typeof actualData)
          
          // Ensure data is iterable before spreading
          if (Array.isArray(actualData)) {
            result.push(...actualData)
          } else if (typeof actualData === 'string') {
            result.push(actualData)
          } else if (actualData) {
            console.log(`任务 ${index} 数据格式异常:`, actualData)
          }
        } else if (item.status==='rejected') {
          console.error(`任务 ${index} 被拒绝:`, item.reason)
        }
      })
      
      console.log('最终解析结果数量:', result.length)
        
      return result
    }catch(error){
        console.error('❌ 线程池处理异常:', error)
        return []
    }
}