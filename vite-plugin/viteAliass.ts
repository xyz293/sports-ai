import type { Plugin } from 'vite'
import fs from 'fs'
const diff =(arrfileDir:string[])=>{
      arrfileDir.forEach((item)=>{
       console.log(item)
      })
}
const getdir =()=>{
      const res =fs.readdirSync('./src')
      diff(res)
}
const Aliass =(): Plugin =>{
   return {
     name:'aliass',
     config(config){
        //config是目前的一个配置对象
        //env是当前的环境变量对象
        console.log(config)
        getdir()
        return {
          
        }
     }
   }
}
export default Aliass