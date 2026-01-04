import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { Icon } from '@/components/ui/Icon';

export const InsightDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    // Try to get data from state
    const insight = location.state?.insight || {
        id: id,
        date: '2026-01-01',
        title: '未能加载洞察',
        content: '无法找到该洞察详情。',
        tags: []
    };

    return (
        <div className="min-h-full bg-[#FDFDFD] dark:bg-[#0A0A0A] pb-6 font-sans">
            {/* Header */}
            <NavBar title="小凡看见" />

            <div className="px-6">
                <div className="bg-white dark:bg-[#151515] p-8 rounded-3xl shadow-lg shadow-purple-500/5 border border-purple-100 dark:border-purple-900/20 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                <Icon name="auto_awesome" className="text-sm" />
                            </span>
                            <span className="text-sm font-bold text-purple-600">AI 深度洞察</span>
                        </div>

                        <h1 className="text-2xl font-serif font-bold text-text-main dark:text-white mb-4 leading-relaxed">
                            {insight.title}
                        </h1>

                        <p className="text-gray-400 text-sm mb-8">{insight.date}</p>

                        <div className="prose dark:prose-invert prose-p:text-text-main dark:prose-p:text-gray-300 prose-p:leading-loose">
                            {insight.content}
                        </div>

                        {/* Tags */}
                        {insight.tags && insight.tags.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-2">
                                {insight.tags.map((tag: string) => (
                                    <span key={tag} className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Feedback Actions */}
                <div className="mt-8 flex justify-center gap-6">
                    <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-[#151515] shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-800">
                            <Icon name="thumb_up" />
                        </div>
                        <span className="text-xs">有启发</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-[#151515] shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-800">
                            <Icon name="share" />
                        </div>
                        <span className="text-xs">分享</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
