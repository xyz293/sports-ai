import { getlist } from '../../api/activity';
import { useEffect, useState, useRef } from 'react';
import type { ActivityInfo } from '../../type/activity/index';
const ITEM_HEIGHT = 100;
const CONTAINER_HEIGHT = 400;
const VISIBLE_ITEMS = Math.floor(CONTAINER_HEIGHT / ITEM_HEIGHT); // 4
interface ActivityListProps {
   setId: (value: number) => void;
  setIsShow: (value: boolean) => void;
}
const ActivityList = ({setId,setIsShow}:ActivityListProps) => {
  const [list, setList] = useState<ActivityInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const divRef = useRef<HTMLDivElement>(null);

  const [startIndex, setStartIndex] = useState(0);
 
  const fetchActivities = async () => {
    try {
      const res = await getlist();
      console.log('API Response:', res);

      if (res?.data?.code === 200) {
        setList(res.data.data || []);
      } else {
        console.warn('API returned non-200 response');
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // 滚动处理
  const handleScroll = () => {
    if (divRef.current) {
      const index = Math.floor(divRef.current.scrollTop / ITEM_HEIGHT);
      setStartIndex(index);
    }
  };

  // 计算当前应渲染的子列表
  const visibleList = list.slice(startIndex, startIndex + VISIBLE_ITEMS);

  // 初始化加载
  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div
      ref={divRef}
      onScroll={handleScroll}
      style={{
        height: CONTAINER_HEIGHT,
        overflowY: 'auto',
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #eee',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* 占位元素：撑开滚动区域 */}
      <div style={{ height: list.length * ITEM_HEIGHT }} />

      {/* 实际渲染内容 */}
      <div
        style={{
          position: 'absolute',
          top: startIndex * ITEM_HEIGHT,
          left: 0,
          width: '100%',
        }}
      >
        {loading ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
            加载中...
          </div>
        ) : visibleList.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
            暂无活动
          </div>
        ) : (
          visibleList.map((item) => (
            <div
              onClick={() => {setId(item.id);setIsShow(false)}}
              key={item.id}
              style={{
                height: ITEM_HEIGHT,
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '14px', color: '#777', lineHeight: 1.4 }}>
                  {item.description?.slice(0, 20) || '暂无描述'}......
                </div>
              </div>

              {/* 状态与时间 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: item.status === 1 ? '#e53e3e' : '#38a169',
                  }}
                >
                  {item.status === 1 ? '线下跑步' : '线上跑步'}
                </span>
                <span style={{ fontSize: '13px', color: '#888' }}>
                 {new Date(item.start_time).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityList;