import { useEffect, useState, useRef } from 'react'
import { Button, Input, Select } from 'antd'
import { getProductList } from '../../api/product'
import type { ProductList } from '../../type/product/index'
import { useNavigate } from 'react-router-dom'
const ProductListPage = () => {
  const [index, setIndex] = useState<number>(0) 
  const [productList, setProductList] = useState<ProductList[]>([]) // 商品列表
  const divRef = useRef<HTMLDivElement>(null) // 用于获取滚动区域的引用
  const navigate = useNavigate()
  const getProductListData = async () => {
    const res = await getProductList()
    if (res.data.code === 200) {
      setProductList(res.data.data) // 更新商品列表
    }
  }

  const scrollToIndex = () => {
    if (divRef.current) {
      setIndex(Math.floor(divRef.current.scrollTop / 100)) // 每100px滚动一次更新索引
    }
  }

  const listToShow = productList.slice(index, index + Math.floor(480 / 100))

  // 获取商品数据
  useEffect(() => {
    getProductListData()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', backgroundColor: '#f8f8f8', padding: '20px' }}>
      {/* 商品筛选区域 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Input
          placeholder="请输入商品名称"
          style={{
            width: '330px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            paddingLeft: '10px',
            height: '40px',
            fontSize: '14px',
          }}
        />
        <Button 
          type="primary" 
          size="large" 
          style={{
            height: '40px',
            fontSize: '14px',
            borderRadius: '4px',
            backgroundColor: '#1890ff',
            borderColor: '#1890ff'
          }}
        >
          查询
        </Button>
        <Select
          placeholder="请选择商品类型"
          style={{ width: '30%' }}
          dropdownStyle={{ borderRadius: '4px' }}
        >
          <Select.Option value={1}>运动器材</Select.Option>
          <Select.Option value={2}>运动服饰</Select.Option>
          <Select.Option value={3}>运动配件</Select.Option>
        </Select>
      </div>

      <div
        ref={divRef}
        style={{
          height: '480px',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginTop: '20px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        onScroll={scrollToIndex} // 监听滚动事件
      >
        <div style={{ height: productList.length * 100 + 'px' }}>
          <div
            style={{
              position: 'absolute',
              top: index * 100 + 'px',
              left: '0',
              padding: '5px',
            }}
          >
            {listToShow.map((item) => (
              <div
                onClick={()=>{
                  navigate(`/product/detail/${item.id}`)
                }}
                key={item.id}
                style={{
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  borderBottom: '1px solid #f0f0f0', // 增加分隔线
                  padding: '10px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                </div>

                <div style={{ fontSize: '14px', color: '#555' }}>
                  {item.description}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                    ￥{item.price}
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    style={{
                      backgroundColor: '#52c41a',
                      borderColor: '#52c41a',
                      fontSize: '12px',
                      padding: '4px 10px',
                    }}
                  >
                    加入购物车
                  </Button>
                  
                </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                  <div>{item.sales_volume} 销量</div>
                  <div>{new Date(item.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
