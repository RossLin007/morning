import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useThemeColor } from '@/hooks/useThemeColor';

interface InteractionItem {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'water' | 'mention';
    user: string;
    userAvatar: string;
    content?: string;
    targetTitle?: string;
    time: string;
    read: boolean;
    targetId?: string;
}

const MOCK_INTERACTIONS: InteractionItem[] = [
    { id: '1', type: 'like', user: 'Lisa', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=b6e3f4', targetTitle: '《积极主动的核心定义》', time: '10分钟前', read: false },
    { id: '2', type: 'comment', user: '话梅', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaMei&backgroundColor=ffd5dc', content: '写得真好，收藏了！', time: '30分钟前', read: false },
    { id: '3', type: 'water', user: '小楠', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoNan&backgroundColor=b6e3f4', time: '1小时前', read: false },
    { id: '4', type: 'follow', user: '老陈', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen&backgroundColor=c0aede', time: '2小时前', read: true },
    { id: '5', type: 'mention', user: '张伟', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei&backgroundColor=d1d4f9', content: '这个观点和你昨天说的很像', time: '3小时前', read: true },
    { id: '6', type: 'like', user: 'Alex', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=a3d9ff', targetTitle: '《成熟模式图给我的启发》', time: '昨天', read: true },
    { id: '7', type: 'comment', user: '王强', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob&backgroundColor=a3d9ff', content: '深有同感，我也是这么想的！', time: '昨天', read: true },
    { id: '8', type: 'like', user: '小凡', userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=XiaoFan&backgroundColor=c0aede', targetTitle: '《今日觉察日记》', time: '2天前', read: true },
];

const getInteractionIcon = (type: InteractionItem['type']) => {
    switch (type) {
        case 'like': return { icon: 'favorite', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
        case 'comment': return { icon: 'chat_bubble', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
        case 'follow': return { icon: 'person_add', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
        case 'water': return { icon: 'water_drop', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' };
        case 'mention': return { icon: 'alternate_email', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' };
    }
};

const getInteractionText = (item: InteractionItem) => {
    switch (item.type) {
        case 'like': return <>赞了你的 <span className="font-medium text-gray-700 dark:text-gray-300">{item.targetTitle}</span></>;
        case 'comment': return <>评论了你："{item.content}"</>;
        case 'follow': return <>关注了你</>;
        case 'water': return <>给你的成长树浇水啦 🌱</>;
        case 'mention': return <>在分享中提到了你</>;
    }
};

export const Interactions: React.FC = () => {
    const navigate = useNavigate();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#0A0A0A' : '#F5F7F5');

    const [interactions, setInteractions] = useState(MOCK_INTERACTIONS);
    const unreadCount = interactions.filter(i => !i.read).length;

    const handleMarkAllRead = () => {
        setInteractions(prev => prev.map(i => ({ ...i, read: true })));
    };

    const handleItemClick = (item: InteractionItem) => {
        // Mark as read
        setInteractions(prev => prev.map(i => i.id === item.id ? { ...i, read: true } : i));

        // Navigate based on type
        if (item.type === 'follow') {
            navigate(`/user/${item.user}`);
        } else if (item.targetId) {
            navigate(`/feed/${item.targetId}`);
        }
    };

    return (
        <div className="min-h-full bg-[#F5F7F5] dark:bg-[#0A0A0A] font-sans animate-fade-in flex flex-col">
            <NavBar
                title="消息"
                right={
                    unreadCount > 0 ? (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-[14px] text-primary font-medium"
                        >
                            全部已读
                        </button>
                    ) : undefined
                }
            />

            {/* Message List */}
            <div className="flex-1 overflow-y-auto">
                {interactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Icon name="notifications_none" className="text-5xl mb-3 opacity-50" />
                        <p className="text-[15px]">暂无消息</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {interactions.map(item => {
                            const { icon, color, bg } = getInteractionIcon(item.type);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className={`flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors
                                        ${!item.read ? 'bg-primary/5' : 'bg-white dark:bg-transparent'}
                                        hover:bg-gray-50 dark:hover:bg-gray-800/50`}
                                >
                                    {/* Avatar with type badge */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={item.userAvatar}
                                            alt={item.user}
                                            className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
                                        />
                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${bg} flex items-center justify-center ring-2 ring-white dark:ring-[#0A0A0A]`}>
                                            <Icon name={icon} className={`text-[14px] ${color}`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className="text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed">
                                            <span className="font-bold">{item.user}</span>
                                            {' '}
                                            {getInteractionText(item)}
                                        </p>
                                        <p className="text-[13px] text-gray-400 mt-1">{item.time}</p>
                                    </div>

                                    {/* Unread dot */}
                                    {!item.read && (
                                        <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-red-500 mt-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
