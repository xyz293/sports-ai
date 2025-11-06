import request from '../uilts/request'
import type {order_item,address} from '../type/product/index'
export const getProductList = () => {
    return request({
        url:'/product/list',
        method:'get'
    })
}

export const SearchProduct = (key:string) => {
    return request({
        url:'/product/search',
        method:'get',
        params:{
            keyword:key
        }
    })
}
export const getProductDetail = (id:number) => {
    return request({
        url:'/product/detail',
        method:'get',
        params:{
            id:id
        }
    })
}


export const createOrder = (data:order_item) => {
    return request({
        url:'/product/create/order',
        method:'post',
        data:{
            product_id:data.product_id,
            quantity:data.quantity,
            price:data.price,
            total_price:data.total_price,
            user_id:data.user_id,
        }
    })
}


export const createAddress = (data:address) => {
    return request({
        url:'/product/create/address',
        method:'post',
        data:{
            user_id:data.user_id,
            user_nickname:data.user_nickname,
            address:data.address,
            phone:data.phone,
            postcode:data.postcode,
        }
    })
}

export const getOrderList = (id:number) => {
    return request({
        url:'/product/myorder',
        method:'get',
        params:{
            user_id:id
        }
    })
}