import {Outlet} from 'react-router-dom'
import {Button} from 'antd'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useLocation} from 'react-router-dom'

const Order = () => {
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(()=>{
        if(location.pathname==='/person/order'){
            navigate('/person/order/item')
        }
    },[])
    return (
        <div>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'5px'}}>
                <Button type='link' size='large' onClick={()=>navigate('/person/order/item')}>购买订单</Button>
                <Button type='link' size='large' onClick={()=>navigate('/person/order/list')}>支付订单</Button>
            </div>
            <Outlet />
        </div>
    )
}
export default Order