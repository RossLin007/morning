import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DiaryEntry {
    id: string;
    date: string;
    day: number;
    situation: string;
    innerReaction: string;
    emotion: string;
    behavior: string;
    awareness: string;
    actionPlan: string[];
    isPublic: boolean;
}

const EMOTION_ICONS: Record<string, string> = {
    calm: '😌',
    happy: '😊',
    curious: '🤔',
    anxious: '😰',
    sad: '😔',
    angry: '😤',
};

export const DiaryList: React.FC = () => {
    const navigate = useNavigate();
    const [diaries] = useLocalStorage<DiaryEntry[]>('mr_awareness_diaries', []);

    return (
        <div className="min-h-full bg-[#FDFDFD] dark:bg-[#0A0A0A] pb-6 font-sans">
            {/* Header */}
            <NavBar
                title="觉察日记"
                right={
                    <div className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        共 {diaries.length} 篇
                    </div>
                }
            />

            {/* List */}
            <div className="px-6 space-y-4">
                {diaries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-4xl">
                            📝
                        </div>
                        <p className="text-gray-500 mb-6">还没有写过觉察日记</p>
                        <button
                            onClick={() => navigate('/diary/new')}
                            className="px-6 py-3 bg-[#6B8E8E] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
                        >
                            开始第一篇
                        </button>
                    </div>
                ) : (
                    [...diaries].reverse().map((diary) => (
                        <div
                            key={diary.id}
                            onClick={() => navigate(`/diary/${diary.id}`, { state: { diary } })}
                            className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold bg-[#E8F2F2] dark:bg-[#1C2C2C] text-[#6B8E8E] px-2 py-1 rounded-md">
                                        Day {diary.day}
                                    </span>
                                    <span className="text-xs text-gray-400">{diary.date}</span>
                                </div>
                                <span className="text-xl" title={diary.emotion}>
                                    {EMOTION_ICONS[diary.emotion] || '😐'}
                                </span>
                            </div>
                            <p className="text-text-main dark:text-gray-300 font-medium line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
                                {diary.situation}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => navigate('/diary/new')}
                className="fixed bottom-8 right-6 w-14 h-14 bg-[#6B8E8E] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#5A7A7A] transition-colors active:scale-90 z-40"
            >
                <Icon name="edit" className="text-2xl" />
            </button>
        </div>
    );
};
