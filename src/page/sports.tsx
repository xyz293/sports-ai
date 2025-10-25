import {Button} from 'antd'
import {Outlet} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
import {useEffect} from 'react'
const SportsPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(()=>{
        if(location.pathname==='/person/sports/honor'){
            navigate('/person/sports/honor')
        }
    },[])
    return (
        <div>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:30}}>
                <Button type="link" onClick={() => navigate('/person/sports/honor')}>
                    我的荣誉
                </Button>
                 <Button type="link" onClick={() => navigate('/person/sports/mysports')}>
                    我的运动
                </Button>
            </div>
           <Outlet />
        </div>
    )
}
export default SportsPage