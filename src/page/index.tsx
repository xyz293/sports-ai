import {Button} from 'antd'
import Login from '../commpent/login/index'
import {useState} from 'react'
import Activity from './activity'
import Modals from '../commpent/modal/index'
import {useNavigate} from 'react-router-dom'
const AgentPage = () => {
      const [isshow,setIsshow] = useState(1)
      const navigate = useNavigate()
      const [isModalShow,setIsModalShow] = useState(false)
    const show = () => {
        switch(isshow){
            case 1:
                return <Activity />
            case 2:
                return <Login setIsshow={setIsshow} />
        }
    }
  return (
    <>
     <div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:20}}>
            <Button type='primary' 
            size='small'
              onClick={()=>{navigate('/agent')}}
              onMouseEnter={(e)=>{
               e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'
               e.currentTarget.style.boxShadow = '0 5px 10px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e)=>{
                e.currentTarget.style.transform = 'scale(1) translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'
              }}
            >ai建议</Button>
            
            <Button type='primary' 
            size='small'
              onClick={()=>{setIsshow(1);setIsModalShow(true)}}
              onMouseEnter={(e)=>{
               e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'
               e.currentTarget.style.boxShadow = '0 5px 10px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e)=>{
                e.currentTarget.style.transform = 'scale(1) translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'
              }}
            >活动消息</Button>
            
            <Button type='primary'  
            size='small'
              onClick={()=>{setIsshow(2);setIsModalShow(true)}}
              onMouseEnter={(e)=>{
               e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'
               e.currentTarget.style.boxShadow = '0 5px 10px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e)=>{
                e.currentTarget.style.transform = 'scale(1) translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'
              }}
            >登录</Button>
        </div>
       {isModalShow && (
        <Modals open={isModalShow} setIsModalShow={setIsModalShow}>
            {show()}
        </Modals>
       )}
     </div>
    </>
  )
}
export default AgentPage