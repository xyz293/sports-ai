import type {RagInfo} from '../type/user'
class IndexDB {
   private DB: Promise<IDBDatabase>
   constructor(name:string,version:number,store:string){
    this.DB = this.init(name,version,store)
   }
   private init(name:string,version:number,store:string):Promise<IDBDatabase>{
       return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(name, version);
        request.onsuccess = (event:Event) => {
          if(event.target instanceof IDBOpenDBRequest){
            resolve(event.target.result);
          }
        };
          request.onupgradeneeded =(event:Event)=>{
           if(event.target instanceof IDBOpenDBRequest){
            const DB =event.target.result
          DB.createObjectStore(store, { keyPath: 'id', autoIncrement: true })
           }
          }
        request.onerror = (event:Event) => {
          console.error('数据库打开失败:', event);
          if(event.target instanceof IDBOpenDBRequest){
            reject(event.target.error);
          }
        };
      });
   }
   public async add(store:string,data:RagInfo){
    const DB = await this.DB
    const transaction = DB.transaction(store, 'readwrite')
    const objectStore = transaction.objectStore(store)
    objectStore.add(data)
   }
   public async get(store:string):Promise<RagInfo[]>{
        const DB = await this.DB
        await this.delete(store)
         return new Promise((resolve, reject) => {
          const transaction = DB.transaction(store, 'readonly')
          const objectStore = transaction.objectStore(store)
          const request = objectStore.getAll()
          request.onsuccess = (event: Event) => {
            if (event.target instanceof IDBRequest) {
              resolve(event.target.result as RagInfo[]);
            }
          };
          request.onerror = (event: Event) => {
            if (event.target instanceof IDBRequest) {
              reject(event.target.error);
            }
          };
        });
   }
   public async delete(store:string){
    const DB = await this.DB
    const transaction = DB.transaction(store, 'readwrite')
    const objectStore = transaction.objectStore(store)
    objectStore.openCursor().onsuccess = (event: Event) => {
      if (event.target instanceof IDBRequest) {
        const cursor = event.target.result
        if (cursor) {
          if (cursor.time<Date.now()) {
            cursor.delete()
          }
          cursor.continue()
        }
      }
    }
   }
}


export default new IndexDB('sports',1,'ai-rag')
