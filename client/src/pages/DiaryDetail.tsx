
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

export const DiaryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Try to get data from state, otherwise use mock/empty
    const diary = location.state?.diary || {
        id: id,
        date: '2026-01-01',
        day: 5,
        content: '数据加载失败',
        emotion: '😐',
        situation: '...',
        innerReaction: '...',
        behavior: '...',
        awareness: '无法找到该日记详情。',
        actionPlan: []
    };

    // Helper to render content if it's the structured format or simple string
    const isStructured = !!diary.situation;

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] pb-24 font-sans">
            {/* Header */}
            <div className="px-6 pt-12 pb-6 sticky top-0 bg-[#FDFDFD]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md z-30 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Icon name="arrow_back" />
                </button>
                <span className="font-bold text-lg dark:text-white">日记详情</span>
                <div className="w-10"></div>
            </div>

            <div className="px-6">
                {/* Meta Card */}
                <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Icon name="auto_stories" className="text-8xl text-[#6B8E8E]" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm font-bold bg-[#E8F2F2] dark:bg-[#1C2C2C] text-[#6B8E8E] px-3 py-1 rounded-full">
                                Day {diary.day}
                            </span>
                            <span className="text-gray-400 font-medium">{diary.date}</span>
                        </div>

                        <div className="flex items-center gap-2 text-2xl font-serif text-text-main dark:text-white mb-2">
                            <span>{diary.emotion}</span>
                            <span>今日心情</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {isStructured ? (
                        <>
                            <Section title="发生了什么" icon="event_note" content={diary.situation} />
                            <Section title="我的反应" icon="psychology" content={diary.innerReaction} />
                            <Section title="我的行为" icon="directions_run" content={diary.behavior} />
                            <Section title="深度觉察" icon="visibility" content={diary.awareness} isHighlight />

                            {diary.actionPlan && diary.actionPlan.length > 0 && (
                                <div className="bg-[#6B8E8E]/5 dark:bg-[#6B8E8E]/10 p-6 rounded-3xl">
                                    <h3 className="flex items-center gap-2 font-bold text-[#6B8E8E] mb-4">
                                        <Icon name="flag" />
                                        行动计划
                                    </h3>
                                    <ul className="space-y-3">
                                        {diary.actionPlan.map((plan: string, idx: number) => (
                                            <li key={idx} className="flex gap-3">
                                                <span className="w-6 h-6 rounded-full bg-[#6B8E8E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-text-main dark:text-gray-300 text-sm leading-relaxed">{plan}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-gray-50 dark:border-gray-800">
                            <p className="text-lg leading-loose text-text-main dark:text-gray-200">
                                {diary.content}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; icon: string; content: string; isHighlight?: boolean }> = ({ title, icon, content, isHighlight }) => (
    <div className={`p-6 rounded-3xl border ${isHighlight ? 'bg-primary/5 border-primary/10 dark:bg-primary/10' : 'bg-white dark:bg-[#151515] border-gray-50 dark:border-gray-800'}`}>
        <h3 className={`flex items-center gap-2 font-bold mb-3 ${isHighlight ? 'text-primary' : 'text-gray-400'}`}>
            <Icon name={icon} />
            {title}
        </h3>
        <p className="text-text-main dark:text-gray-200 leading-relaxed">
            {content}
        </p>
    </div>
);
