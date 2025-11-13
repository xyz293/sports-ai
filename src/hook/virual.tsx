import type {DiscussionList } from '../type/discussion/index'
interface virual<T extends DiscussionList> {
    data:T[]
    setItem:(item:T[])=>void
    type:string
}
const Virual =<T extends DiscussionList >({data,setItem,type}:virual<T>)=>{  //之后使用的时候需要使用泛型的方法进行限定

    const istype =(item:T[],type:string)=>{
        switch(type){
            case 'diss':
                return <div>

                </div>
            default:
                return <div>

                </div>
        }
    }
    return (
        <div>
           {istype(data,type)}
        </div>
    )
}
export default Virual