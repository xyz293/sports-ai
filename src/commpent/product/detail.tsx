import { useParams } from 'react-router-dom'
import { getProductDetail } from '../../api/product'
import type { ProductList } from '../../type/product/index'
import { useState, useEffect } from 'react'
import ProductModal from './product'
import { Button,Modal } from 'antd'
const ProductDetailPage = () => {
  const params = useParams()
  const { id } = params
  const [visible, setVisible] = useState(false)
  const [productDetail, setProductDetail] = useState<ProductList>({
    id: 0,
    name: '',
    description: '',
    category_id: 0,
    price: 0,
    sales_volume: 0,
    avatar: '',
    created_at: '',
  })

  const show = async () => {
    const res = await getProductDetail(Number(id))
    console.log(res)
    if (res.data.code === 200) {
      setProductDetail(res.data.data)
    }
  }

  useEffect(() => {
    show()
  }, [id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '20px', backgroundColor: '#f8f8f8' }}>
      {/* 商品图片 */}
      <div style={{ width: '630px', height: 'auto', marginBottom: '20px' }}>
        <img
          src={productDetail.avatar}
          alt={productDetail.name}
          style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
        />
      </div>

      <div style={{ width: '630px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{productDetail.name}</h1>
      </div>

      <div style={{ width: '630px', padding: '10px 20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>商品描述：</h3>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{productDetail.description}</p>
      </div>
      
        <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        width={600}
        footer={null}
        >
          <ProductModal productDetail={productDetail.price} id={Number(id)} setVisible={setVisible}/>
        </Modal>
      <div style={{ width: '630px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
          ￥{productDetail.price}
        </div>
        <div style={{ fontSize: '14px', color: '#888' }}>
       <div>
           销量: {productDetail.sales_volume}
       </div>
      <div>
          <Button type="primary" onClick={() => setVisible(true)}>加入购物车</Button>
      </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
