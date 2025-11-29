import {useRoutes} from 'react-router-dom'
import routeConfig from './router/index'
import {useEffect} from 'react'
import {useRef} from 'react'
function App() {
 const element = useRoutes(routeConfig.router)
 let index  = useRef(0).current
 const load =(deadline: IdleDeadline)=>{
   while(index<routeConfig.preloadRouteComponents.length && deadline.timeRemaining() > 1){
    routeConfig.preloadRouteComponents[index]()
    index++
   }
   if(index<routeConfig.preloadRouteComponents.length && !deadline.didTimeout){
    requestIdleCallback(load)
 }
}
    useEffect(()=>{
      requestIdleCallback(load)
    },[])
  return (
    <>
      {element}
    </>
  )
}

export default App
