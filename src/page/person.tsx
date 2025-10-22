import { GetUserInfo } from '../api/user';
import { useEffect, useState } from 'react';
import { GetIntergal ,UpdateIntergal} from '../api/intergal';
import { getId } from '../uilts/tools';
import { Outlet } from 'react-router-dom';
import type { Intergal } from '../type/intergal/index';
import type { UserInfo } from '../type/user/index';
import { Avatar ,Button} from 'antd';
import {SignIn} from '../api/user'
const Base = () => {
  const id = getId();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [intergal, setIntergal] = useState<Intergal>();
  const signIn = async () => {
   try{
       await SignIn(id);
     const res = await UpdateIntergal(id, 2);
     if(res.data.code===200){
       setIntergal(prev => {
     if (prev) {
     return { ...prev, total_integral: prev.total_integral + 2 };
  } else {
    // 如果 prev 为 undefined，提供一个默认值
    return { total_integral: 2 };
  }
});
     }
   }
   catch(err:any){
    if(err.status===500){
       alert('您已签到过');
    }
   }
   
  }
  const showUserInfo = async () => {
    const res = await GetUserInfo(id);
    const res1 = await GetIntergal(id);
    console.log(res1);
    console.log(res);
    setUserInfo(res.data.message);
    setIntergal(res1.data.message);
  };

  useEffect(() => {
    showUserInfo();
  }, [id]);

  return (
    <div
      style={{
        backgroundColor: '#f4f4f9', // 页面背景色
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Avatar
          style={{
            width: 120,
            height: 120,
            border: '4px solid #4CAF50', // Avatar 边框颜色
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Avatar 阴影效果
          }}
          src={userInfo?.avatar}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: '#fff', // 背景色为白色，突出显示用户信息
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
          昵称: {userInfo?.nickname}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              marginTop: '10px',
              fontSize: 16,
              color: '#555',
            }}
          >
            <div>电话:{userInfo?.username}</div>
            <div>注册时间:{new Date(userInfo?.create_time || '').toLocaleString()}</div>
          </div>
           <div>
               <Button type='link' size='large' onClick={signIn}>
                    签到
               </Button>
            </div>
         <div>
             {`积分: ${intergal?.total_integral}`}
         </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap:10,
            alignItems: 'center',
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '5px',
            fontWeight: 'bold',
          }}
        >
            <Button>消息中心</Button>
            <Button>我的订单</Button>
            <Button>我的比赛</Button>
            <Button>我的积分</Button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Base;
