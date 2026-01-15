import type { Basework } from '../type/parse.ts'
import type {Task} from '../type/result.ts'
export class webworkPool{
  private workerList :Basework[] = [] //为空闲的worker队列
  private taskQueue :Task[] = [] //为等待中的任务队列
  private maxWorkerCount : number
  private path: string
  private static instanc : webworkPool
  
  // 线程池统计信息
  private stats = {
    totalTasks: 0,           // 总任务数
    completedTasks: 0,       // 完成任务数
    rejectedTasks: 0,        // 拒绝任务数
    maxQueueLength: 0,       // 最大队列长度
    poolCreateTime: Date.now() // 线程池创建时间
  }
  
  static getInstance(maxWorkerCount : number,path: string):webworkPool{
    if(!webworkPool.instanc){
      webworkPool.instanc =new webworkPool(maxWorkerCount,path)
    }
    return webworkPool.instanc
  }
  
  constructor(maxWorkerCount : number,path: string){
    this.maxWorkerCount = maxWorkerCount
    this.path = path
     for(let index = 0; index < this.maxWorkerCount; index++) {
      this.workerList.push(this.createWorker(index))
    }
  }
  private createWorker(index: number): Basework {
    const worker = {
      work: new Worker(
        new URL(this.path, import.meta.url), 
        { 
          type: 'module',
        }
      ),
      isActive: false,
      id: index
    }
    return worker
  }
  private getTask(){
     return this.taskQueue.shift()
  }
  private assignTaskToWorkerDirectly(item:Basework,task:Task){
    item.isActive = true
    
    item.work.postMessage({
      data:task.data,
      type:task.type
    })
    
    const onmessage = (e:MessageEvent) => {
      item.isActive = false
      this.stats.completedTasks++
      
      if(e.data.message === 'success'){
        task.resolve(e.data)
      }
      
      if(this.taskQueue.length > 0){
        const nextTask = this.getTask()
        if(nextTask){
          this.assignTaskToWorkerDirectly(item,nextTask)
        }
      }
    }
    
    const err =(errorEvent: ErrorEvent)=>{
      this.stats.rejectedTasks++
      item.isActive = false
      
      console.error(`worker ${item.id} 执行任务失败:`, errorEvent.message)
      console.log(`线程池统计: 总任务${this.stats.totalTasks}, 已完成${this.stats.completedTasks}, 失败${this.stats.rejectedTasks}`)
      
      if(this.taskQueue.length > 0){
        const nextTask = this.getTask()
        if(nextTask){
          this.assignTaskToWorkerDirectly(item, nextTask)
        }
      }
      
      task.reject(new Error("worker error: " + errorEvent.message))
    }
     
    // 只监听一次消息和错误
    item.work.addEventListener('message', onmessage, {once: true})
    item.work.addEventListener('error', err, {once: true})
  }
  
  public run(data: any,type:string){
    return new Promise((resolve, reject) => {
      let hasAssigned = false
      
      this.stats.totalTasks++
      
      // 尝试分配给空闲的worker
      for(let item of this.workerList){
        if(item.isActive === false){
          hasAssigned = true
          this.assignTaskToWorkerDirectly(item,{data,type,resolve,reject})
          break
        }
      }
      
      // 如果没有空闲worker，加入队列
      if(!hasAssigned){
        this.taskQueue.push({data,type,resolve,reject})
        
        // 更新最大队列长度
        if(this.taskQueue.length > this.stats.maxQueueLength){
          this.stats.maxQueueLength = this.taskQueue.length
        }
      }
    })
  }
  
  // 获取线程池统计信息
  public getStats(){
    // 计算当前活跃线程数
    const activeWorkers = this.workerList.filter(worker => worker.isActive).length
    const idleWorkers = this.maxWorkerCount - activeWorkers
    
    return {
      ...this.stats,
      currentQueueLength: this.taskQueue.length,
      activeWorkers,
      idleWorkers,
      maxWorkerCount: this.maxWorkerCount,
      poolUptime: Date.now() - this.stats.poolCreateTime
    }
  }
  
  // 重置统计信息
  public resetStats(){
    this.stats = {
      totalTasks: 0,
      completedTasks: 0,
      rejectedTasks: 0,
      maxQueueLength: 0,
      poolCreateTime: Date.now()
    }
  }
  
  // 销毁线程池
  public destroy() {
    console.log('销毁线程池')
    
    // 终止所有worker
    this.workerList.forEach(worker => {
      try {
        worker.work.terminate()
        console.log(`终止worker ${worker.id}`)
      } catch (error) {
        console.error('销毁worker出错:', error)
      }
    })
    
    // 清空队列
    this.taskQueue = []
    this.workerList = []
    
    // 重置单例实例
    if (webworkPool.instanc === this) {
      webworkPool.instanc = null as any
    }
  }
}
export default webworkPool

