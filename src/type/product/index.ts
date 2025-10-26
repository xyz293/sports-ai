export interface ProductList {
    id: number
    name: string
    description: string
    category_id: number
    price: number
    sales_volume: number
    avatar: string
    created_at: string
}

export interface order_item{
    id?: number
    product_id: number
    quantity: number
    price: number
    total_price: number
    user_id: number
}
export interface address{
    user_id: number
    user_nickname: string
    address: string
    phone: string
    postcode: string
}