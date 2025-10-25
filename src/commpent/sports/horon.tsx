import {getmyHonor} from '../../api/activity'
import {useEffect,useState} from 'react'
import type {Honor} from '../../type/activity/index'
import {getId} from '../../uilts/tools'
import {useRef} from 'react'
const Honor = () => {
    const [honorList,setHonorList] = useState<Honor[]>([])
    const user_id = getId()
    const [index,setIndex] = useState<number>(0)
    const scrollToIndex = () => {
       if(divRef.current){
        setIndex(Math.floor(divRef.current.scrollTop/60))
       }
    }
    const divRef = useRef<HTMLDivElement>(null)
    const showHonor = async ()=>{
        try{
            const res = await getmyHonor(user_id,1)
          if(res.data.code===200){
            setHonorList(res.data.data)
          }
        }catch(err){
            console.log(err)
        }
    }
    const list = honorList.slice(index,index+Math.floor(200/60))
    useEffect(()=>{
        showHonor()
    },[])
    return (
        <div ref={divRef} onScroll={scrollToIndex} style={{height:200,overflowY:'auto',backgroundColor:'#fff',borderRadius:8,position:'relative'}}>
           <div style={{height:honorList.length*60+'px'}}>
                <div style={{position:'absolute',top:index*60,left:0}}>
                    {
                        list.map((item)=>{
                            return (
                                <div key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:382,gap:10,height:50,backgroundColor:'#f9f9f9',borderRadius:6,boxShadow:'0 2px 4px rgba(0, 0, 0, 0.1)',padding:10,marginBottom:10}}>
                                  <div style={{display:'flex',flexDirection:'column',gap:4}}>
                                     <div style={{fontSize:16,fontWeight:600,color:'#333'}}>{item.name}</div>
                                     <div 
                                     style={{fontSize:14,fontWeight:400,color:'#666'}}>{item.description}</div>
                                    </div>
                                    <div>
                                         <div style={{fontSize:14,fontWeight:400,color:'#666'}}>{new Date(item.award_date).toLocaleDateString()}</div>
                                        </div>
                                </div>
                            )
                        })
                    }
                </div>
           </div>
        </div>
    )
}
export default Honor