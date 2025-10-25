import {Outlet} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
import {useEffect} from 'react'
const ProductPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(()=>{
       if(location.pathname === '/product'){
        navigate('/product/list')
       }
    },[])
    return (
        <div>
            <Outlet />
        </div>
    )
}
export default ProductPage