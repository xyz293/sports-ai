import { getLog } from '../../api/intergal';
import { useState, useEffect } from 'react';
import type { IntegralLog } from '../../type/intergal/index';
import { getId } from '../../uilts/tools';
import { useRef } from 'react';

const IntegralLog = () => {
    const id = getId();
    const [log, setLog] = useState<IntegralLog[]>([]);
    const [index, setIndex] = useState<number>(0);

    const showLog = async () => {
        const res = await getLog(id); //1000w
        console.log(res);
        setLog(res.data.data);
    };

    const containerRef = useRef<HTMLDivElement>(null);

    const Sroll = () => {
        if (containerRef.current) {
            setIndex(Math.floor(containerRef.current.scrollTop / 50));
        }
    };

    const list = log.slice(index, index + 200 / 50);

    useEffect(() => {
        showLog();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                height: '200px',
                overflowY: 'auto',
                position: 'relative',
                border: '1px solid #ddd', // Border color is soft
                borderRadius: '8px', // Rounded corners
                backgroundColor: '#f9f9f9', // Light gray background
                padding: '10px',
            }}
            onScroll={Sroll}
        >
            <div style={{ height: log.length * 50 + 'px' }}>
                <div style={{ position: 'absolute', top: index * 50 + 'px', left: '0' }}>
                    {list?.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '382px',
                                gap: '10px',
                                height: '50px',
                                backgroundColor: '#fff', // White background for items
                                borderRadius: '6px', // Rounded corners for items
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Soft shadow for items
                                padding: '10px',
                                marginBottom: '10px', // Spacing between items
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        color: '#333', // Dark text for better readability
                                    }}
                                >
                                    活动任务： {item.action}
                                </div>
                                <div
                                    style={{
                                        fontSize: '12px',
                                        color: '#777', // Lighter color for time
                                    }}
                                >
                                    时间：{new Date(item.create_time).toLocaleString()}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        color: '#4caf50', // Green for positive integral usage
                                    }}
                                >
                                    积分使用：{item.integral}
                                </div>
                                <div
                                    style={{
                                        fontSize: '12px',
                                        color: '#888', // Lighter gray for balance
                                    }}
                                >
                                    积分余额：
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IntegralLog;
