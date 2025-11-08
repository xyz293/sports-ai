import { useEffect, useState, useRef } from 'react'
import { Button, Input } from 'antd'
import { Aichat, getAiMessage } from '../../api/message'
import { getId } from '../../uilts/tools'
import AgentFile from './file'
import Center from './centece'
import type { AImessageInfo } from '../../type/message/index'
import {Spin} from 'antd'
const Agent = () => {
  const userId = getId()
  const [messages, setMessages] = useState<AImessageInfo[]>([])
  const [userInput, setUserInput] = useState<string>('')
  const [isshow, setIsshow] = useState<boolean>(false)
  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const [progress, setProgress] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fetchHistory = async () => {
    try {
      const res = await getAiMessage(userId)
      setMessages(res.data.data)
    } catch (err) {
      console.error('获取历史消息失败', err)
    }
  }

  useEffect(() => {
    fetchHistory()

    const eventSource = new EventSource(`http://localhost:3000/message/event?id=${userId}`)

    eventSource.onmessage = (e) => {
      const data = e.data
      if (!data) return
      const newMsg: AImessageInfo = {
        id: Date.now(),
        user_id: userId,
        role: 'ai',
        content: data,
        create_time: new Date().toLocaleString()
      }
      setMessages([...messagesRef.current, newMsg])
      setLoading(false)
      // 滚动到底部
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }, 50)
    }

    eventSource.onerror = (err) => {
      console.error('EventSource error', err)
      eventSource.close()
    }

    return () => eventSource.close()
  }, [userId])

  const sendMessage = async () => {
    if (!userInput.trim()) return
    const newUserMsg: AImessageInfo = {
      id: Date.now(),
      user_id: userId,
      role: 'user',
      content: userInput,
      create_time: new Date().toLocaleString()
    }
    setLoading(true)
    setMessages([...messagesRef.current, newUserMsg])
    setUserInput('')

    try {
      await Aichat({ content: userInput, id: userId })
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert('请先登录')
      } else {
        console.error('AI 请求失败', err)
      }
    }
  }

  return (
    <div
      style={{
        width: 600,
        height: '85vh',
        margin: '40px auto',
        borderRadius: 12,
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'relative'
      }}
    >
      {/* 消息列表 */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 25px',
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          scrollbarWidth: 'thin'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#1890ff' : '#f0f0f0',
              color: msg.role === 'user' ? '#fff' : '#000',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
              maxWidth: '75%',
              lineHeight: 1.5,
              fontSize: 15,
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              wordBreak: 'break-word'
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
      

      <div
        style={{
          position: 'absolute',
          bottom: -15,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 580,
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: 10,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: 10,
          alignItems: 'center'
        }}
      >
        {loading && (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          <Spin />
        </div>
      )}
       <div style={{display:'flex',flexDirection:'column'}}>
        <div>
          {isshow && <Center progress={progress} />}
        </div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:20}}>
           <Input
          placeholder="请输入内容..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onPressEnter={sendMessage}
          style={{ flex: 1 ,width:'300px'}}
        />
        <AgentFile setMessages={setMessages}  messages={messages} setIsshow={setIsshow}  setProgress={setProgress}/>
        <Button type="primary" onClick={sendMessage}>
          发送
        </Button>
        </div>
       </div>
      </div>
    </div>
  )
}

export default Agent
