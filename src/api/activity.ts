import request from '../uilts/request'
export const getlist = ()=>{
    return request({
        url:'/activity/list',
        method:'get'
    })
}

export const getdetail = (id:number)=>{
    return request({
        url:'/activity/detail',
        method:'get',
        params:{
            id:id
        }
    })
}

export const join = (activity_id:number,user_id:number)=>{
    return request({
        url:'/activity/join',
        method:'post',
        data:{
            activity_id:activity_id,
            user_id:user_id
        }
    })
}