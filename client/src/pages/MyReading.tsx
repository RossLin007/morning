import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// --- Fake Data: My Course Library ---
const SEASONS = [
    {
        id: 's8',
        title: '第八期：高效能人士的七个习惯',
        author: 'Stephen R. Covey',
        cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300',
        totalDays: 21,
        status: 'ongoing',
        description: '从依赖到独立，再到互赖的个人效能修行。'
    },
    {
        id: 's7',
        title: '第七期：原子习惯',
        author: 'James Clear',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300',
        totalDays: 14,
        status: 'completed',
        description: '细微改变汇聚惊人力量，系统化打造好习惯。'
    },
    {
        id: 's6',
        title: '第六期：当下的力量',
        author: 'Eckhart Tolle',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300',
        totalDays: 10,
        status: 'completed',
        description: '摆脱思维认同，进入当下的临在状态。'
    }
];

export const MyReading: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');
    const [completedLessons] = useLocalStorage<string[]>('mr_learning_progress', []);

    // Filter Logic
    const ongoingCourses = SEASONS.filter(s => s.status === 'ongoing');
    const completedCourses = SEASONS.filter(s => s.status === 'completed');

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0A0A0A] font-sans pb-24">

            {/* Header */}
            <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Icon name="arrow_back" className="text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-lg font-serif font-bold text-gray-800 dark:text-white">我的晨读</h1>
                <div className="w-10"></div>
            </header>

            <div className="p-6 max-w-lg mx-auto">

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 dark:bg-[#151515] rounded-xl mb-8">
                    {['ongoing', 'completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                                    ? 'bg-white dark:bg-[#252525] text-emerald-600 dark:text-emerald-400 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab === 'ongoing' ? '正在修习' : '已结业'}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {activeTab === 'ongoing' ? (
                        ongoingCourses.map(course => {
                            const progress = Math.floor((completedLessons.length / course.totalDays) * 100);
                            return (
                                <div
                                    key={course.id}
                                    onClick={() => navigate('/reading')}
                                    className="group bg-white dark:bg-[#151515] rounded-3xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex gap-5 cursor-pointer transition-all"
                                >
                                    <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden shadow-sm relative bg-gray-100">
                                        <img src={course.cover} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center py-1">
                                        <h3 className="font-serif font-bold text-lg text-gray-800 dark:text-white leading-tight mb-1">
                                            {course.title.split('：')[1]}
                                        </h3>
                                        <p className="text-xs text-gray-400 mb-5">{course.author}</p>

                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div style={{ width: `${progress}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        completedCourses.map(course => (
                            <div key={course.id} className="group flex items-center gap-5 p-4 rounded-3xl hover:bg-white dark:hover:bg-[#151515] transition-colors cursor-default">
                                <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100">
                                    <img src={course.cover} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-base text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors mb-1">
                                        {course.title.split('：')[1]}
                                    </h3>
                                    <p className="text-xs text-gray-300 group-hover:text-gray-500 transition-colors">{course.author}</p>
                                </div>
                                <Icon name="check_circle" className="text-gray-200 group-hover:text-emerald-500 transition-colors text-xl" />
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};
