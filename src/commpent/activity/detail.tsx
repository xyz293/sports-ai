import {getdetail} from '../../api/activity'
import {Button} from 'antd'
import {join} from '../../api/activity'
import {useState,useEffect} from 'react'
import type {ActivityInfo} from '../../type/activity/index'
interface ActivityDetailProps {
    id: number;
}
const ActivityDetail = ({id}:ActivityDetailProps) => {
    const [detail,setDetail] = useState<ActivityInfo>({
        id:id,
    title:'',
    description:'',
    start_time:'',
    end_time:'',
    location:'',
    number_limit:0,
    status:0,
    })
    useEffect(()=>{
       
    },[id])
    return (
        <div>
         
        </div>
    )
}
export default ActivityDetail