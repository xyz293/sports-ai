import request from '../uilts/request'
export const GetDiscussionList = async()=>{
    return request({
        url:'/discussion/all',
        method:'GET',
    })
}

export const GetDiscussionType = async()=>{
    return request({
        url:'/discussion/types',
        method:'GET',
    })
}

export const GetDiscussionTypeDetail = async(id:number)=>{
    return request({
        url:`/discussion/type/${id}`,
        method:'GET',
    })
}

export const SearchDiscussion = async(keyword:string)=>{
    return request({
        url:'/discussion/search',
        method:'GET',
        params:{
            keyword:keyword
        }
    })
}

export const updateLikeNum = async(discussion_id:number,like_count:number)=>{
    return request({
        url:'/discussion/updateLikeCount',
        method:'POST',
        data:{
            discussion_id:discussion_id,
            like_count:like_count
        }
    })
}