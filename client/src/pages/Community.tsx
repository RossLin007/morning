
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

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

    const filteredClassmates = CLASSMATES.filter(c =>
        c.name.includes(searchTerm) || c.bio.includes(searchTerm) || c.term.includes(searchTerm)
    );

    // List of classmates (No grouping)

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] pb-24 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 px-6 py-4 bg-[#FDFDFD]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-serif font-bold text-text-main dark:text-white">书友通讯录</h1>
                    <span className="text-xs font-bold text-[#6B8E8E] bg-[#E8F2F2] dark:bg-[#1C2C2C] px-3 py-1 rounded-full">
                        共 {CLASSMATES.length} 位书友
                    </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜索书友..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-[#151515] rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main dark:text-white outline-none focus:ring-2 focus:ring-[#6B8E8E]/20 transition-all placeholder-gray-400"
                    />
                </div>
            </header>

            {/* List */}
            <div className="px-6 py-4 space-y-3">
                {filteredClassmates.map((classmate) => (
                    <div
                        key={classmate.id}
                        onClick={() => navigate(`/user/${classmate.id}`)}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-[#151515] rounded-2xl border border-gray-50 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                    >
                        <img
                            src={classmate.avatar}
                            alt={classmate.name}
                            className="w-12 h-12 rounded-full object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-text-main dark:text-white text-base truncate">{classmate.name}</h3>
                            <p className="text-xs text-text-sub dark:text-gray-400 truncate">{classmate.bio}</p>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <Icon name="chevron_right" />
                        </button>
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
