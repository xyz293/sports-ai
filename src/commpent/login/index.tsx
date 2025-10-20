import Login from './login'
import Register from './regiser'
import {useState} from 'react'
const Index = () => {
    const [isLogin,setIsLogin] = useState(true)
    const show =()=>{
        switch(isLogin){
            case true:
              return < Login setIsLogin={setIsLogin}/>
            case false:
               return < Register setIsLogin={setIsLogin}/>
        }
    }
  return (
    <>
       {show()}
    </>
  )
}
export default Index