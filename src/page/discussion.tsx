import {Outlet} from 'react-router-dom'
import {useEffect,useState} from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
import  {GetDiscussionType} from '../api/discussion' 
import type {DiscussionType} from '../type/discussion/index'
import {GetDiscussionList} from '../api/discussion'
import type {DiscussionList} from '../type/discussion/index'
import {Input,Button,Select} from 'antd'
import {SearchDiscussion} from '../api/discussion'
import {GetDiscussionTypeDetail} from '../api/discussion'
const Discussion = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [typeList,setTypeList] = useState<DiscussionType[]>([])
    const [keyword,setKeyword] = useState<string>('')
    const [discussionType,setDiscussionType] = useState<DiscussionList>()
    const showDiscussionType = async()=>{
        const res = await GetDiscussionType()
        if(res.data.code===200){
            setTypeList(res.data.data)
        }
    }
    const showAll = async()=>{
        const res = await GetDiscussionList()
        console.log(res);
        if(res.data.code===200){
            setDiscussionType(res.data.data)
        }
    }
    const showTypeDetail = async(id:number)=>{
        const res = await GetDiscussionTypeDetail(id)
        console.log(res);
        if(res.data.code===200){
            setDiscussionType(res.data.data)
        }
    }
    const search = async(keyword:string)=>{
      if(!keyword){
        alert('请输入搜索内容')
        return
    }
    const res = await SearchDiscussion(keyword)
    if(res.data.code===200){
        setDiscussionType(res.data.data)
    }
}
    useEffect(()=>{
        showDiscussionType()
        showAll()
        if(location.pathname === '/discussion'){
            navigate('/discussion/base')
        }
    },[])
    return (
        <div>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:20}}>
                 <Input placeholder='请输入搜索内容' style={{width:320}} value={keyword} onChange={(e)=>setKeyword(e.target.value)}></Input>
                 <Button type='link' size='large' onClick={()=>search(keyword)}>搜索</Button>
                 <Select
                 onChange={(value)=>{
                 showTypeDetail(value)
                 }}
                  options={typeList.map(item=>({
                    label:item.type_name,
                    value:item.id
                 }))} style={{width:200}}></Select>
            </div>
            <Outlet context={{discussionType,setDiscussionType}} />
        </div>
    )
}
export default Discussion