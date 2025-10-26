import { Form, Input, Button, InputNumber } from 'antd'
import { useState } from 'react'
import type {order_item} from '../../type/product/index'
import type {address} from '../../type/product/index'
import {getId,getNickname,getPhone} from '../../uilts/tools'
import {createOrder,createAddress} from '../../api/product'
const ProductModal = ({ productDetail,id ,setVisible}: { productDetail: number,id:number,setVisible: (value: boolean) => void }) => {
   const [orderItem,setOrderItem] = useState<order_item>({
    product_id: id,
    quantity: 0,
    price: 0,
    total_price: 0,
    user_id: getId(),
   })
   const [address,setAddress] = useState<address>({
    user_id: getId(),
    user_nickname: getNickname(),
    phone: getPhone(),
    postcode: '',
    address: '',
   })
   const handleSubmit = async () => {
   const res = await createOrder(orderItem)
   const res2 = await createAddress(address)
     if(res.data.code === 200 && res2.data.code === 200){
        alert('购买成功')
        setVisible(false)
     }
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
      }}>
        <Form layout="vertical">
          {/* 商品名称 */}
          <Form.Item name="name" label="个人地址">
            <Input 
              value={address.address}
              onChange={(value) => setAddress({...address,address:value})}
              placeholder="请输入地址" 
              style={{ 
                borderRadius: '4px', 
                padding: '10px', 
                marginBottom: '15px' 
              }} 
            />
          </Form.Item>
          <Form.Item name="sales_volume" label="邮政号">
            <Input 
              value={address.postcode}
              onChange={(value) => setAddress({...address,postcode:value})}
              placeholder="请输入邮政号" 
              style={{ 
                borderRadius: '4px', 
                padding: '10px', 
                marginBottom: '15px' 
              }} 
            />
          </Form.Item>

          {/* 数量选择 */}
          <Form.Item name="description" label="购买数量">
            <InputNumber
              min={1}
              value={orderItem.quantity}
              onChange={(value) => setOrderItem({...orderItem,quantity:value,
                price: productDetail,
                total_price: productDetail * orderItem.quantity,
              })}
              style={{
                width: '100%',
                borderRadius: '4px',
                padding: '10px',
                fontSize: '16px',
                marginBottom: '15px',
              }}
            />
          </Form.Item>

          {/* 商品图片 */}
          <Form.Item name="avatar">
            <div style={{
              backgroundColor: '#f7f7f7',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
            }}>
              {productDetail}
            </div>
          </Form.Item>

          {/* 价格计算 */}
          <Form.Item label="总价格">
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1890ff',
              marginBottom: '20px',
            }}>
              ￥{productDetail * orderItem.quantity}
            </div>
          </Form.Item>
          {/* 购买按钮 */}
          <Form.Item>
            <Button type="primary" block size="large" style={{ fontSize: '16px' }} onClick={handleSubmit}>
              购买
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default ProductModal
