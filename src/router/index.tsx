import {lazy,Suspense} from 'react'
import {Spin} from 'antd'
const Index = lazy(() => import('../page/index'))
const Guard = lazy(() => import('../router/gurda/index'))
const Agentpage = lazy(() => import('../page/agent'))
const Person = lazy(() => import('../page/person'))
const router = [{
  path:'/',
  element:(
    <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Spin />
    </div>}>
    
        <Index />

    </Suspense>
  ),
  children:[
    {
      path:'/person',
      element:(
        <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Spin />
        </div>}>
         
            <Person />
        </Suspense>
      )
    },
    {
  path:'/agent',
  element:(
    <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Spin />
    </div>}>
        <Agentpage />

    </Suspense>
  )
}
  ]
},


]
export default router