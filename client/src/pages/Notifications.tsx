import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useHaptics } from '@/hooks/useHaptics';

export const Notifications: React.FC = () => {
    const { trigger: haptic } = useHaptics();
    const [filter, setFilter] = useState<'all' | 'system' | 'interaction'>('all');

    // Mock Notifications
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'system', title: '晨间冥想公告', content: '明早 6:30，不仅有答疑，我们还将一起进行5分钟的静心冥想。', time: '10分钟前', read: false },
        { id: 2, type: 'interaction', title: '获得徽章', content: '恭喜你解锁【初出茅庐】徽章！', time: '2小时前', read: true },
        { id: 3, type: 'system', title: '版本更新', content: 'v2.6 版本已发布，AI 教练现在支持联网搜索啦！', time: '1天前', read: true },
        { id: 4, type: 'interaction', title: '新的点赞', content: 'Alex 赞了你的笔记《积极主动的核心定义》', time: '2天前', read: true },
    ]);

    const filtered = notifications.filter(n => filter === 'all' || n.type === filter);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        haptic('success');
    };

    return (
        <div className="min-h-full bg-[#F5F7F5] dark:bg-black font-sans animate-fade-in flex flex-col">
            <NavBar
                title="消息中心"
                right={
                    <button onClick={markAllRead} className="p-2 text-gray-400 hover:text-primary transition-colors" title="Mark all read">
                        <Icon name="done_all" />
                    </button>
                }
            />

            {/* Tabs */}
            <div className="px-6 mt-4 mb-2">
                <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-1">
                    <button onClick={() => setFilter('all')} className={`pb-2 text-sm font-bold transition-colors ${filter === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>全部</button>
                    <button onClick={() => setFilter('system')} className={`pb-2 text-sm font-bold transition-colors ${filter === 'system' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>系统</button>
                    <button onClick={() => setFilter('interaction')} className={`pb-2 text-sm font-bold transition-colors ${filter === 'interaction' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>互动</button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-4">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Icon name="notifications_off" className="text-4xl mb-2 opacity-50" />
                        <p>暂无消息</p>
                    </div>
                ) : (
                    filtered.map(item => (
                        <div key={item.id} className={`bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl border transition-all ${item.read ? 'border-transparent opacity-80' : 'border-primary/20 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {item.type === 'system' ? (
                                        <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-bold">公告</span>
                                    ) : (
                                        <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-bold">通知</span>
                                    )}
                                    <h3 className="text-sm font-bold text-text-main dark:text-white">{item.title}</h3>
                                    {!item.read && <span className="size-2 rounded-full bg-red-500"></span>}
                                </div>
                                <span className="text-[10px] text-gray-400">{item.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
