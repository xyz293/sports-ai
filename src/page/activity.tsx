import Activity from '../commpent/activity/list'
import {useState} from 'react'
import ActivityDetail from '../commpent/activity/detail'

const ActivityPage = () => {
    const [isShow,setIsShow] = useState(true)
    const [id,setId] = useState<number>(0)
    const show =()=>{
        switch(isShow){
            case true:
                return <Activity setId={setId} setIsShow={setIsShow} />
            case false:
                return <ActivityDetail id={id} setIsShow={setIsShow}/>
        }
    }
    return (
        <div>
           {show()}
        </div>
    )
}
export default ActivityPage