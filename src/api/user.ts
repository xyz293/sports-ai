import request from '../uilts/request'
import type { RegisterInfo } from '../type/user/index'
import type { LoginInfo } from '../type/user/index'

export const getCode = (number:string) => {
    return request({
        url:'/user/getCode',
        method:'get',
        params:{
            identifier:number
        }
    })
}
export const register = (data:RegisterInfo) => {
    return request({
        url:'/user/register',
        method:'post',
        data:{
            username:data.username,
            password:data.password,
            nickname:data.nickname,
            code:data.code,
        }
    })
}

export const login = (data:LoginInfo) => {
    return request({
        url:'/user/login',
        method:'post',
        data:{
            username:data.username,
            password:data.password,
            nickname:data.nickname,
        }
    })
}
export const Verify = () => {
    return request({
        url:'/user/verify',
        method:'post',
        data:{
            
        }
    })
}

export const GetUserInfo = (id:number) => {
    return request({
        url:'/user/userinfo',
        method:'get',
        params:{
            id:id
        }
    })
}

export const SignIn = (id:number) => {
    return request({
        url:'/user/sign',
        method:'post',
        data:{
             user_id:id
        }
    })
}