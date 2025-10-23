import { useOutletContext } from "react-router-dom"
import type { DiscussionList } from '../../type/discussion/index'
import { Avatar, Button } from 'antd'
import { HeartOutlined, MessageOutlined } from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'
import {updateLikeNum} from '../../api/discussion'
const DiscussionBase = () => {
  const { discussionType,setDiscussionType } = useOutletContext<{ discussionType: DiscussionList[],setDiscussionType:(type:DiscussionList[])=>void }>()
    const navigate = useNavigate()
  if (!discussionType || !Array.isArray(discussionType)) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}>暂无讨论内容</div>
  }
  const like = async(id:number,like_count:number)=>{
    const res = await updateLikeNum(id,like_count+1)
    console.log(res);
    if(res.data.code===200){
        setDiscussionType(discussionType.map(item=>item.id===id?{...item,like_num:like_count+1}:item))
    }
  }
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {discussionType?.map(item => (
        <div 
          key={item.id} 
          style={{
            border: '1px solid #ddd',
            borderRadius: 10,
            backgroundColor: '#fff',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            marginBottom: 20,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 15
          }}
        >
          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            <Avatar size={60} src={item.avatar} />
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: 16 }}> {item.author}</p>
              <p style={{ margin: '5px 0', color: '#888', fontSize: 16 }}> {item.title}</p>
             <p style={{ margin: 0, fontWeight: 'bold', fontSize: 16 }}> 查看数: {item.view_num}</p>
            </div>
          </div>

          <p style={{ color: '#333', lineHeight: 1.6 }}>{item.description}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#888' }}>
              <p style={{ margin: 0 }}>评论数: {item.comment_num} | 点赞数: {item.like_num}</p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button 
                onClick={()=>like(item.id,item.like_num)}
                icon={<HeartOutlined />} 
                size="small" 
                style={{
                  color: '#f5222d', 
                  borderColor: '#f5222d',
                  padding: '6px 12px',
                  fontSize: 14
                }}
              >
                点赞
              </Button>
              <Button 
                onClick={()=>navigate(`/discussion/detail/${item.id}`)}
                icon={<MessageOutlined />} 
                size="small" 
                style={{
                  color: '#1890ff', 
                  borderColor: '#1890ff',
                  padding: '6px 12px',
                  fontSize: 14
                }}
              >
                评论
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DiscussionBase
