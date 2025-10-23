import {lazy,Suspense} from 'react'
import {Spin} from 'antd'
const Index = lazy(() => import('../page/index'))
const Guard = lazy(() => import('../router/gurda/index'))
const Agentpage = lazy(() => import('../page/agent'))
const Person = lazy(() => import('../page/person'))
const IntegralLog = lazy(() => import('../commpent/integral/log'))
const Message = lazy(() => import('../commpent/message/index'))
const Discussion = lazy(() => import('../page/discussion'))
const DiscussionBase = lazy(() => import('../commpent/discussion/base'))
const DisscussionDetail = lazy(() => import('../commpent/discussion/detail'))
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
      ),
      children:[
        {
          path:'integral/log',
          element:(
            <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Spin />
            </div>}>
                <IntegralLog />
            </Suspense>
          )
        },
        {
          path:'message',
          element:(
            <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Spin />
            </div>}>
                <Message />
            </Suspense>
          )
        },
      ]
    },{
      path:'/discussion',
      element:(
        <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Spin />
        </div>}>
            <Discussion />
        </Suspense>
      ),children:[
        {
          path:'base',
          element:(
            <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Spin />
            </div>}>
                <DiscussionBase />
            </Suspense>
          )
        },
        {
          path:'detail/:id',
          element:(
            <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Spin />
            </div>}>
                <DisscussionDetail />
            </Suspense>
          )
        }
      ]
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