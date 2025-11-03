import request from '../uilts/request'
export const uploadFile = (data: FormData) => {
    return request({
        url: '/file/upload',
        method: 'post',
        data,
    })
}

export const mergeFile = (hash:string,fileName:string) => {
    return request({
        url: '/file/merge',
        method: 'post',
        data:{
            hash:hash,
            fileName:fileName
        }
    })
}

export const verifyFile = (fileName:string) => {
    return request({
        url: '/file/verify',
        method: 'post',
        data:{
            fileName:fileName
        }
    })
}