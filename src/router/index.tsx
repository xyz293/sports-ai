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
const Sports = lazy(() => import('../page/sports'))
const Honor = lazy(() => import('../commpent/sports/horon'))
const ProductDetail = lazy(() => import('../commpent/product/detail'))
const MySports = lazy(() => import('../commpent/sports/mysports'))
const ProductPage = lazy(() => import('../page/product'))
const ProductList = lazy(() => import('../commpent/product/list'))
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
            path:'sports',
            element:(
                <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <Spin />
                </div>}>
                    <Sports />
                </Suspense>
            ),
            children:[
              {
                path:'honor',
                element:(
                    <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Spin />
                    </div>}>
                        <Honor />
                    </Suspense>
                )
              },
              {
                path:'mysports',
                element:(
                    <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Spin />
                    </div>}>
                        <MySports />
                    </Suspense>
                )
              }
            ]
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
    },
    {
      path:'/product',
      element:( <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Spin />
        </div>}>
             <ProductPage />
        </Suspense>
        ),
        children:[
          {
            path:'list',
            element:(
              <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <Spin />
              </div>}>
                  <ProductList />
              </Suspense>
            )
          },{
            path:'detail/:id',
            element:(
              <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <Spin />
              </div>}>
                  <ProductDetail />
              </Suspense>
            )
          }
        ]
    },
    {
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