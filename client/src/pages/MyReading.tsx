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
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0A0A0A] font-sans animate-fade-in pb-12 transition-colors duration-500">

            {/* Header */}
            <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Icon name="arrow_back" className="text-text-main dark:text-white" />
                </button>
                <h1 className="text-lg font-serif font-bold text-text-main dark:text-white">我的晨读</h1>
                <div className="w-10"></div>
            </header>

            <div className="p-6 max-w-lg mx-auto">

                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveTab('ongoing')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'ongoing' ? 'bg-white dark:bg-[#151515] text-text-main dark:text-white shadow-sm' : 'text-gray-400'}`}
                    >
                        正在修习
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'completed' ? 'bg-white dark:bg-[#151515] text-text-main dark:text-white shadow-sm' : 'text-gray-400'}`}
                    >
                        已结业
                    </button>
                </div>

                <div className="space-y-4">
                    {activeTab === 'ongoing' ? (
                        ongoingCourses.map(course => (
                            <div key={course.id} onClick={() => navigate('/reading')} className="bg-white dark:bg-[#151515] rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-800 flex gap-4 cursor-pointer hover:shadow-md transition-all group">
                                <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden shadow-sm relative">
                                    <img src={course.cover} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/10"></div>
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2 inline-block">Current Season</span>
                                        <h3 className="font-bold text-base text-text-main dark:text-white leading-tight mb-1">{course.title.split('：')[1]}</h3>
                                        <p className="text-xs text-gray-400">{course.author}</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[10px] text-gray-400">Progress</span>
                                            <span className="text-xs font-bold text-text-main dark:text-white">{Math.floor((completedLessons.length / course.totalDays) * 100)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div style={{ width: `${(completedLessons.length / course.totalDays) * 100}%` }} className="h-full bg-primary rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        completedCourses.map(course => (
                            <div key={course.id} className="bg-white dark:bg-[#151515] rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-800 flex gap-4 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden shadow-sm grayscale hover:grayscale-0 transition-all">
                                    <img src={course.cover} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="font-bold text-sm text-text-main dark:text-white leading-tight mb-1">{course.title}</h3>
                                    <p className="text-xs text-gray-400 mb-2">{course.author}</p>
                                    <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 w-fit px-2 py-0.5 rounded text-[10px] font-bold">
                                        <Icon name="check_circle" className="text-xs" />
                                        <span>Completed</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};
