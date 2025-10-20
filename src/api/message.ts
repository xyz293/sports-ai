import request from '../uilts/request'
import type {AichatInfo} from '../type/message/index'
export const Aichat =(data:AichatInfo)=>{
    return request({
        url:'/message/AIchat',
        method:'post',
        data:{
            content:data.content,
            id:data.id
        }
    })
}