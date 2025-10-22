import Login from './login'
import Register from './regiser'
import {useState} from 'react'
const Index = ({setIsshow,setIsModalShow}:{setIsshow:(isshow:boolean)=>void,setIsModalShow:(isModalShow:boolean)=>void}) => {
    const [isLogin,setIsLogin] = useState(true)
    const show =()=>{
        switch(isLogin){
            case true:
              return < Login setIsLogin={setIsLogin} setIsshow={setIsshow} setIsModalShow={setIsModalShow} />
            case false:
               return < Register setIsLogin={setIsLogin} />
        }
    }
  return (
    <>
       {show()}
    </>
  )
}
export default Index