import {lazy,Suspense} from 'react'
import {Spin} from 'antd'
import{useEffect} from 'react'
const Index = lazy(() => import('../page/index'))
const Guard = lazy(() => import('../router/gurda/index'))
const Agentpage = lazy(() => import('../page/agent'))
const Person = lazy(() => import('../page/person'))
const IntegralLog = lazy(() => import('../commpent/integral/log'))
const Sports = lazy(() => import('../page/sports'))
const Honor = lazy(() => import('../commpent/sports/horon'))
const ProductDetail = lazy(() => import('../commpent/product/detail'))
const OrderItem = lazy(() => import('../commpent/product/order_item'))
const Order = lazy(() => import('../commpent/product/order'))
const MySports = lazy(() => import('../commpent/sports/mysports'))
const ProductPage = lazy(() => import('../page/product'))
const preloadRouteComponents =[
() => import('../page/order'),
() => import('../commpent/message/index'),
() => import('../page/discussion'),
() => import('../commpent/discussion/base'),
() => import('../commpent/discussion/detail'),
() => import('../commpent/product/list')
]
const ComponentPreloader = () => {
  const load =(dealine:any)=>{
    let index =0
     while(index<preloadRouteComponents.length&&dealine.timeRemaining()>1){
      preloadRouteComponents[index]()
      index++
     }
     if(index<preloadRouteComponents.length&&!dealine.didTimeout){
      requestIdleCallback(load)
     }
  }
  useEffect(()=>{
    requestIdleCallback(load)
  },[])
}
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
        },{
          path:'order',
          element:(
            <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Spin />
            </div>}>
                <PersonMessage />
            </Suspense>
          ),
          children:[
            {
              path:'item',
              element:(
                <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <Spin />
                </div>}>
                    <OrderItem />
                </Suspense>
              )
            },
            {
              path:'list',
              element:(
                <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <Spin />
                </div>}>
                    <Order />
                </Suspense>
              )
            }
          ]
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