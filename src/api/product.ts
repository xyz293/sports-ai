import request from '../uilts/request'
export const getProductList = () => {
    return request({
        url:'/product/list',
        method:'get'
    })
}
