import {lazy,Suspense} from 'react'
import {Spin} from 'antd'
const Index = lazy(() => import('../page/index'))
const router = [{
  path:'/',
  element:(
    <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Spin />
    </div>}>
      <Index />
    </Suspense>
  )
}

]
export default router