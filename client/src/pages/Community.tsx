
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock Classmates Data
const CLASSMATES = [
    // Term 8
    { id: '100', name: '话梅', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaMei', bio: '愿每个人都能长成自己喜欢的样子', term: '第八期' },
    { id: '101', name: '小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', bio: '坚持晨读第5天', term: '第八期' },
    { id: '102', name: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', bio: '在这里遇见更好的自己', term: '第八期' },
    { id: '103', name: '李娜', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow', bio: '慢就是快', term: '第八期' },
    { id: '104', name: '王强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', bio: '终身学习者', term: '第八期' },
    { id: '105', name: 'Lisa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', bio: '早起改变人生', term: '第八期' },
    // Term 7
    { id: '201', name: '老陈', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen', bio: '第七期全勤', term: '第七期' },
    { id: '202', name: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', bio: '保持觉察', term: '第七期' },
    // Term 6
    { id: '301', name: 'Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', bio: '老学员回来复训', term: '第六期' },
];

const Community: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Set PWA status bar color to match Native Header
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#111111' : '#FAFAFA');

    const filteredClassmates = CLASSMATES.filter(c =>
        c.name.includes(searchTerm) || c.bio.includes(searchTerm) || c.term.includes(searchTerm)
    );

    // List of classmates (No grouping)

    return (
        <div className="min-h-full bg-[#FDFDFD] dark:bg-[#0A0A0A] pb-4 font-sans">
            {/* Header */}
            {/* Header (Native Style - extends into safe-area for PWA) */}
            <header className="sticky top-0 z-40 pt-safe bg-[#FAFAFA] dark:bg-[#111] transition-all">
                {!isSearching ? (
                    <div className="relative h-[44px] flex items-center justify-center px-4">
                        <h1 className="text-[17px] font-medium text-black dark:text-white tracking-wide">书友</h1>
                        <button
                            onClick={() => setIsSearching(true)}
                            className="absolute right-4 p-2 text-[#181818] dark:text-white/70 active:opacity-70 transition-opacity"
                        >
                            <Icon name="search" className="text-[22px]" />
                        </button>
                    </div>
                ) : (
                    <div className="h-[44px] flex items-center gap-3 px-4 animate-fade-in">
                        <div className="relative flex-1 h-[32px]">
                            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                autoFocus
                                placeholder="搜索书友..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-full bg-white dark:bg-[#1A1A1A] rounded-[6px] pl-9 pr-4 text-[14px] text-black dark:text-white outline-none focus:ring-1 focus:ring-[#07C160] transition-all placeholder-gray-400"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setIsSearching(false);
                                setSearchTerm('');
                            }}
                            className="text-[15px] font-medium text-[#576B95] dark:text-blue-400 whitespace-nowrap px-1"
                        >
                            取消
                        </button>
                    </div>
                )}
            </header>

            {/* List */}
            <div className="pb-2">
                {filteredClassmates.map((classmate, index) => (
                    <div
                        key={classmate.id}
                        onClick={() => navigate(`/user/${classmate.id}`)}
                        className={`flex items-center gap-4 px-6 py-4 bg-white dark:bg-[#191919] cursor-pointer active:bg-gray-50 dark:active:bg-white/5 transition-colors ${index !== filteredClassmates.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''
                            }`}
                    >
                        <img
                            src={classmate.avatar}
                            alt={classmate.name}
                            className="w-10 h-10 rounded-md object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-text-main dark:text-white text-base truncate leading-tight">{classmate.name}</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{classmate.bio}</p>
                        </div>
                        <Icon name="chevron_right" className="text-gray-300 dark:text-gray-600 text-lg" />
                    </div>
                ))}

                {filteredClassmates.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        没有找到匹配的书友
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
