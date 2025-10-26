import {getOrderList} from '../../api/product'
import {useEffect, useState} from 'react'
import {useRef} from 'react'
import type {order_item} from '../../type/product/index'
import {getId} from '../../uilts/tools'
import {useNavigate} from 'react-router-dom'
const OrderItem = () => {
    const navigate = useNavigate()
    const [index,setIndex] = useState<number>(0)
    const divRef = useRef<HTMLDivElement>(null)
   const [orderList,setOrderList] = useState<order_item[]>([])
   const Sroll =()=>{
      if(divRef.current){
        setIndex(Math.floor(divRef.current.scrollTop/100))
      }
   }
   const showOrderList = async (id:number) => {
    const res = await getOrderList(id)
      console.log(res)
      if(res.data.code === 200){
        setOrderList(res.data.data)
      }
   }
   useEffect(()=>{
    showOrderList(getId())
   },[])
   const listToShow = orderList.slice(index, index + 200/100)
    return (

        <div ref={divRef} onScroll={Sroll} style={{height:'200px',overflowY:'auto',position:'relative'}}>
            <div style={{height:index*100+'px'}}>
               <div style={{position:'absolute',top:index*100+'px',left:'0'}} >
                  {
                    listToShow.map((item) => (
                        <div key={item.id} onClick={()=>navigate(`/product/detail/${item.product_id}`)}>
                            <p>订单号：{item.id}</p>
                            <p>商品数量：{item.quantity}</p>
                            <p>商品单价：{item.price}</p>
                            <p>商品总价：{item.total_price}</p>
                        </div>
                    ))
                  }
               </div>
            </div>
            
        </div>
    )
}

export default OrderItem