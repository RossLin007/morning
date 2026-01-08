import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useHaptics } from '@/hooks/useHaptics';

// Mock group data and messages
const GROUP_DATA: Record<string, any> = {
    'g1': {
        id: 'g1',
        name: '凡人晨读',
        memberCount: 4,
        messages: [
            { id: 'm1', sender: '刘伟伟 连云港', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu', content: '哇呵，Carrie，好久不见', time: '昨天 14:44', isSelf: false },
            { id: 'm2', sender: '刘伟伟 连云港', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu', content: '👍🌹', time: '昨天 14:45', isSelf: false },
            {
                id: 'm3', sender: '你', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me', images: [
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
                    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400'
                ], time: '昨天 14:44', isSelf: true
            }
        ]
    },
    'g2': { name: '灯塔计划学习群', memberCount: 12, messages: [] },
    'g3': { name: '同见同行', memberCount: 8, messages: [] }
};

export const GroupChat: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { trigger: haptic } = useHaptics();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = useState('');

    const group = GROUP_DATA[id || 'g1'] || GROUP_DATA['g1'];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleSend = () => {
        if (!inputText.trim()) return;
        haptic('light');
        // In real app, send message to backend
        setInputText('');
    };

    return (
        <div className="h-screen flex flex-col bg-[#EDEDED] dark:bg-[#0A0A0A]">
            {/* Header */}
            <header className="shrink-0 bg-[#F7F7F7] dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 pt-safe">
                <div className="h-[44px] flex items-center justify-between px-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                        <Icon name="arrow_back" className="text-[20px] text-gray-900 dark:text-white" />
                    </button>
                    <div className="flex-1 text-center">
                        <h1 className="text-[17px] font-medium text-gray-900 dark:text-white">{group.name}({group.memberCount})</h1>
                    </div>
                    <button onClick={() => navigate(`/group/${id}/info`)} className="p-2 -mr-2">
                        <Icon name="more_horiz" className="text-[22px] text-gray-900 dark:text-white" />
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {group.messages.map((msg: any) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
                        {!msg.isSelf && (
                            <img src={msg.avatar} alt="" className="w-10 h-10 rounded-md shrink-0 bg-gray-200" />
                        )}
                        <div className={`flex flex-col gap-1 ${msg.isSelf ? 'items-end' : 'items-start'} max-w-[70%]`}>
                            {!msg.isSelf && (
                                <span className="text-[12px] text-gray-500 px-1">{msg.sender}</span>
                            )}
                            {msg.content && (
                                <div className={`px-3 py-2 rounded-lg ${msg.isSelf
                                        ? 'bg-[#95EC69] text-black'
                                        : 'bg-white dark:bg-[#191919] text-gray-900 dark:text-white'
                                    }`}>
                                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            )}
                            {msg.images && (
                                <div className="grid grid-cols-3 gap-1 max-w-[240px]">
                                    {msg.images.map((img: string, idx: number) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt=""
                                            className="w-full aspect-square object-cover rounded-md cursor-pointer hover:opacity-90"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="shrink-0 bg-[#F7F7F7] dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 pb-safe">
                <div className="flex items-center gap-2 px-3 py-2">
                    <button className="p-2">
                        <Icon name="mic" className="text-[24px] text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className="flex-1 bg-white dark:bg-[#1A1A1A] rounded-md overflow-hidden flex items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="输入消息..."
                            className="flex-1 px-3 py-2 text-[15px] bg-transparent outline-none text-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="p-2">
                        <Icon name="sentiment_satisfied" className="text-[24px] text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2" onClick={handleSend}>
                        <Icon name="add_circle" className="text-[28px] text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );
};
