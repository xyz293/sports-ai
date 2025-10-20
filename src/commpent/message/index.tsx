import Ssemessage from './Ssemessage'
import Unmessage from './unmessage'
import {useState} from 'react'
import {Button} from 'antd'
const Index = () => {
    const [isSsemessage,setIsSsemessage] = useState(true)
    const show =()=>{
        switch(isSsemessage){
            case true:
              return < Ssemessage/>
            case false:
               return < Unmessage/>
        }
    }
   return (
    <div>
       <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:20}}>
        <Button type='link' size='small' onClick={()=>setIsSsemessage(true)}>消息列表</Button>
        <Button type='link' size='small' onClick={()=>setIsSsemessage(false)}>查看未读消息</Button>
       </div>
       <div>
        {show()}
       </div>
    </div>
   )
}
export default Index