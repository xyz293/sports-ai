import { Form, Input, Button } from 'antd';
import { getCode } from '../../api/user'
import { useState } from 'react'
import { register } from '../../api/user'
import type { RegisterInfo } from '../../type/user'
import { useContext } from 'react'
import {ContentContexts} from '../../uilts/content'
interface RegisterProps {
  setIsLogin: (isLogin: boolean) => void;
}

const Register = ({ setIsLogin }: RegisterProps) => {
    const {setIsshow} = useContext(ContentContexts)
    const [value,setValue] =useState<RegisterInfo>({
        username:'',
        password:'',
        nickname:'',
        code:'',
    })
    const getCodeClick = async () => {
        const res = await getCode(value.username)
      console.log(res) 
    }
    const registerClick = async () => {
        const res = await register(value)
        console.log(res)
        if(res.data.code === 200){
            setValue({
                username:'',
                password:'',
                nickname:'',
                code:'',
            })
            alert(res.data.message)
            setIsshow(false)
        }
    }
  return (
    <>
      <Form>
        <Form.Item label="电话号码">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Input placeholder="请输入电话号码" style={{ width: 200 }} value={value.username} onChange={(e) => setValue({ ...value, username: e.target.value })} />
          </div>
        </Form.Item>
        <Form.Item label='用户名'>
              <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Input placeholder='请输入用户名' style={{ width: 200 }} value={value.nickname} onChange={(e) => setValue({ ...value, nickname: e.target.value })} />
              </div>
        </Form.Item>
        <Form.Item label="密码">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Input.Password placeholder="请输入密码" style={{ width: 200 }} value={value.password} onChange={(e) => setValue({ ...value, password: e.target.value })} />
          </div>
        </Form.Item>

        <Form.Item label="验证码">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Input.Password placeholder="请输入验证码" style={{ width: 200 }} value={value.code} onChange={(e) => setValue({ ...value, code: e.target.value })} />
            <Button type="link" onClick={getCodeClick}>获取验证码</Button>
          </div>
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <Button type="link" onClick={registerClick}>注册</Button>
            <Button type="link" onClick={() => setIsLogin(true)}>
              去登录?
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default Register;
