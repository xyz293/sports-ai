import {Form,Input,Button} from 'antd'
import type {LoginInfo } from '../../type/user'
import {useState} from 'react'
import {login} from '../../api/user'
import useUserStore from '../../store/index'
import {CreateIntergal} from '../../api/intergal'
interface LoginProps{
    setIsLogin:(isLogin:boolean)=>void
    setIsshow:(isshow:boolean)=>void
    setIsModalShow:(isModalShow:boolean)=>void
}
const Login = ({setIsLogin,setIsshow,setIsModalShow}:LoginProps) => {
     const initIntergal = async (user_id: number) => {
        await CreateIntergal(user_id, 0)
     }
    const {setToken,setId} = useUserStore()
    const [value,setValue] = useState<LoginInfo>({
        username:'',
        password:'',
        nickname:'',
    })
    const loginClick = async () => {
        const res = await login(value)
        console.log(res)
        if(res.data.code === 200){
            setValue({
                username:'',
                password:'',
                nickname:'',
            })
            await initIntergal(res.data.data.id)
            setToken(res.data.token)
            setId(res.data.data.id)
            setIsshow(false)
            setIsModalShow(false)
        }
    }
  return (
    <>
     <Form>
        <Form.Item label='电话号码'>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
              <Input placeholder='请输入电话号码' style={{ width: 200 }}  value={value.username} onChange={(e)=>setValue({...value,username:e.target.value})}/>
        </div>
        </Form.Item>
        
        <Form.Item label='用户名'>
              <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Input placeholder='请输入用户名' style={{ width: 200 }}  value={value.nickname} onChange={(e)=>setValue({...value,nickname:e.target.value})}/>
              </div>
        </Form.Item>
        <Form.Item label='密码'>
         <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
             <Input.Password placeholder='请输入密码'style={{ width: 200 }}  value={value.password} onChange={(e)=>setValue({...value,password:e.target.value})}/>
         </div>
        </Form.Item>
        <Form.Item>
         <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:20}}>
             <Button type='link' onClick={()=>setIsLogin(false)}>去注册?</Button>
             <Button type='link' onClick={loginClick}>登录</Button>
         </div>
        </Form.Item>
      </Form>
    </>
  )
}
export default Login