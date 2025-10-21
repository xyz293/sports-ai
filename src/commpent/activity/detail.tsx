import { getdetail, join } from '../../api/activity'
import { Button } from 'antd'
import { useState, useEffect } from 'react'
import type { ActivityInfo } from '../../type/activity/index'
import {getId} from '../../uilts/tools'
interface ActivityDetailProps {
  id: number
  setIsShow: (isShow: boolean) => void
}

const ActivityDetail = ({ id,setIsShow }: ActivityDetailProps) => {
  const [detail, setDetail] = useState<ActivityInfo>({
    id,
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    number_limit: 0,
    status: 0
  })
  const user_id = getId()
  const joinActivity = async () => {
    try {
      const res = await join(id,user_id)
      console.log(res)
      if(res.data.data.code === 200){
       alert(res.data.data.message)
       setIsShow(false)
      }
      else {
        alert(res.data.data.message)
      }
    } catch (err) {
      console.error('报名失败', err)
    }
  }
  // 获取活动详情
  const showDetail = async () => {
    try {
      const res = await getdetail(id)
      setDetail(res.data.data)
    } catch (err) {
      console.error('获取活动详情失败', err)
    }
  }
  useEffect(() => {
    showDetail()
  }, [id])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        maxWidth: 600,
        margin: '0 auto',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        backgroundColor: '#fff'
      }}
    >

      <h3 style={{ marginBottom: 16 }}>{detail.title}</h3>

      <p style={{ width: '100%', marginBottom: 24 }}>{detail.description}</p>

      {/* 活动信息 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>活动时间：{new Date(detail.start_time).toLocaleString()} - {new Date(detail.end_time).toLocaleString()}</div>
          <div>活动地点：{detail.location}</div>
        </div>

        {/* 右侧信息 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div>人数限制：{detail.number_limit}人</div>
          <div>活动状态：{detail.status === 0 ? '线上' : '线下'}</div>
          <Button type="primary" onClick={joinActivity}>报名</Button>
        </div>
      </div>
    </div>
  )
}

export default ActivityDetail
