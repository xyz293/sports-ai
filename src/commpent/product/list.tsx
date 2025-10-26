import { useEffect, useState, useRef } from 'react'
import { Button, Input, Select } from 'antd'
import { getProductList } from '../../api/product'
import type { ProductList } from '../../type/product/index'
import { useNavigate } from 'react-router-dom'
import { SearchProduct } from '../../api/product'

const ProductListPage = () => {
  const [index, setIndex] = useState<number>(0) 
  const [productList, setProductList] = useState<ProductList[]>([]) // 商品列表
  const divRef = useRef<HTMLDivElement>(null) // 用于获取滚动区域的引用
  const [searchKey, setSearchKey] = useState<string>('')

  const Search = async () => {
    if (searchKey) {
      const res = await SearchProduct(searchKey)
      if (res.data.code === 200) {
        setProductList(res.data.data)
        setSearchKey('')
      }
    } else {
      alert('请输入搜索关键词')
    }
  }

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
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <Input
          placeholder="请输入商品名称"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
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
          onClick={Search}
          style={{
            height: '40px',
            fontSize: '14px',
            borderRadius: '4px',
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            padding: '0 20px',
          }}
        >
          查询
        </Button>
        <Select
          placeholder="请选择商品类型"
          style={{ width: '200px' }}
          dropdownStyle={{ borderRadius: '4px' }}
        >
          <Select.Option value={1}>运动器材</Select.Option>
          <Select.Option value={2}>运动服饰</Select.Option>
          <Select.Option value={3}>运动配件</Select.Option>
        </Select>
      </div>

      {/* 商品列表区域 */}
      <div
        ref={divRef}
        style={{
          height: '510px',
          width: '800px',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginTop: '20px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        onScroll={scrollToIndex}
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
                onClick={() => {
                  navigate(`/product/detail/${item.id}`)
                }}
                key={item.id}
                style={{
                  height: '100px',
                  display: 'flex',
                  gap: '15px',
                  padding: '10px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  marginBottom: '10px',
                  cursor: 'pointer',
                }}
              >
                {/* 商品图片 */}
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
                
                {/* 商品信息部分 */}
                <div style={{ flex: 1 }}>
                  {/* 商品名称与描述 */}
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>
                    {item.description}
                  </div>

                  {/* 商品底部信息（价格和销量） */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                      ￥{item.price}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      销量: {item.sales_volume}
                    </div>
                  </div>
                </div>

                {/* 加入购物车按钮 */}
                <Button
                  type="primary"
                  size="small"
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    fontSize: '12px',
                    padding: '4px 10px',
                    alignSelf: 'flex-start', // 将按钮定位到右上角
                  }}
                >
                  加入购物车
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
