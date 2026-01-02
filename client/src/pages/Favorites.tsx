
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { courseData } from '@/data/courseData';

interface FavoriteItem {
    id: string;
    type: 'quote' | 'lesson';
    content: string;
    source: string;
    author?: string;
    date: string;
}

export const Favorites: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'quotes' | 'lessons'>('quotes');
    // Using a new key for favorites
    const [favorites] = useLocalStorage<FavoriteItem[]>('mr_favorites', []);

    // Mock data for display if empty (to show the user what it looks like)
    // In production, we would rely on actual saved data.
    const mockFavorites: FavoriteItem[] = [
        {
            id: 'f1',
            type: 'quote',
            content: "积极主动，是我对自己最大的承诺。",
            source: "Day 1: 品德成功论",
            author: "史蒂芬·柯维",
            date: "2024-03-20"
        },
        {
            id: 'f2',
            type: 'quote',
            content: "只有独立的人才能选择互赖。",
            source: "Day 6: 成熟模式图",
            author: "史蒂芬·柯维",
            date: "2024-03-25"
        },
        {
            id: 'f3',
            type: 'quote',
            content: "除非你愿意，否则没人能伤害你。",
            source: "Day 7: 积极主动的定义",
            author: "埃莉诺·罗斯福",
            date: "2024-03-26"
        }
    ];

    const displayItems = favorites.length > 0 ? favorites : mockFavorites;
    const filteredItems = displayItems.filter(item =>
        activeTab === 'quotes' ? item.type === 'quote' : item.type === 'lesson'
    );

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0A0A0A] font-sans pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Icon name="arrow_back" className="text-xl" />
                </button>
                <h1 className="text-lg font-serif font-bold text-text-main dark:text-white">我的收藏</h1>
            </div>

            {/* Tabs */}
            <div className="px-6 py-4 flex gap-6 border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('quotes')}
                    className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'quotes' ? 'text-text-main dark:text-white' : 'text-gray-400'
                        }`}
                >
                    智慧金句
                    {activeTab === 'quotes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('lessons')}
                    className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'lessons' ? 'text-text-main dark:text-white' : 'text-gray-400'
                        }`}
                >
                    核心课程
                    {activeTab === 'lessons' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                </button>
            </div>

            {/* Content List */}
            <div className="px-6 py-6 space-y-4">
                {activeTab === 'quotes' ? (
                    filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-[#151515] p-6 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 relative group">
                                <Icon name="format_quote" className="text-4xl text-gray-100 dark:text-gray-800 absolute top-4 right-4" />
                                <blockquote className="text-lg font-serif font-medium text-text-main dark:text-white mb-4 relative z-10 leading-relaxed">
                                    "{item.content}"
                                </blockquote>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <cite className="text-sm font-bold text-gray-500 not-italic mb-0.5">— {item.author}</cite>
                                        <span className="text-xs text-primary bg-primary/5 px-2 py-0.5 rounded-full w-fit mt-1">{item.source}</span>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-500 transition-colors">
                                        <Icon name="favorite" className="text-xl text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Icon name="bookmark_border" className="text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-400 mb-2">暂无收藏</h3>
                            <p className="text-sm text-gray-400 max-w-xs">在晨读过程中，点击金句卡片上的收藏按钮，将智慧收入囊中。</p>
                        </div>
                    )
                ) : (
                    // Placeholder for Lessons Tab - assuming we might want to favorite whole lessons later
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Icon name="inventory_2" className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-400 mb-2">暂无课程收藏</h3>
                        <p className="text-sm text-gray-400 max-w-xs">功能开发中... 建议先专注于金句的收集。</p>
                    </div>
                )}
            </div>

            {/* FAB for demo: Add external quote? (Optional, maybe keep clean for now) */}
        </div>
    );
};
