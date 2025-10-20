import {Aichat} from '../../api/message'
import {useEffect,useState} from 'react'
import {getId} from '../../uilts/tools'
import type {AichatInfo} from '../../type/message/index'
import {Button,Input} from 'antd'
import AgentFile from './file'
const Agent = () => {
    useEffect(()=>{
       const res =new EventSource(`http://localhost:3000/message/event?id=${getId()}`)
       res.onmessage = (e) => {
       console.log(e)
       }
    },[])
    const [user,setUser] =useState<AichatInfo>({
        content:'',
        id:getId()
    })
    
    const getAi = async () => {
        const res = await Aichat(user)
       console.log(res)
       setUser({...user,content:''})
    }
   return (
    <div>
      <div style={{display:'flex',justifyContent:'center',gap:20}}>
        <Input placeholder='请输入' style={{width:250}} value={user.content} onChange={(e)=>setUser({...user,content:e.target.value})}/>
        <AgentFile />
        <Button type='primary' onClick={()=>getAi()}>发送</Button>
      </div>
    </div>
   )
}
export default Agent