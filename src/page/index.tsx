import {Button,Modal} from 'antd'
import Login from '../commpent/login/index'
import {useState} from 'react'
import {ContentContexts} from '../uilts/content'
import Agent from '../commpent/agent/index'
const Index = () => {
    const [isshow,setIsshow] = useState(false)
  return (
    <>
     <div>
        <div style={{display:'flex',justifyContent:'flex-start'}}>
            <Agent/>
        </div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:20}}>
            <Button type='primary'  
              onClick={()=>setIsshow(true)}
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
        <Modal 
        open={isshow} 
        footer={null}
        width={400}
        onCancel={()=>setIsshow(false)}>
        <ContentContexts.Provider value={{setIsshow}}>
          <Login />
        </ContentContexts.Provider>
        </Modal>
     </div>
    </>
  )
}
export default Index