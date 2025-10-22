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
export const getAiMessage = (id: number) => {
  const now = new Date()
  const time = now.toISOString().slice(0, 19).replace('T', ' ')

  return request({
    url: '/message/AImessage',
    method: 'post',
    data: {
      user_id: id,
      time
    }
  })
}