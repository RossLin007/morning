
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useHaptics } from '@/hooks/useHaptics';

// Mock Data for Discovery
const FEATURED_CAMPS = [
    {
        id: 'c1',
        theme: '心流之境·第九期',
        book: '《心流：最优体验心理学》',
        cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        startDate: '2026-02-01',
        spotsLeft: 3,
        price: 1800,
        author: { name: 'Dr. C', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=DrC' }
    },
    {
        id: 'c2',
        theme: '习惯的力量',
        book: '《原子习惯》',
        cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80',
        startDate: '2026-02-05',
        spotsLeft: 8,
        price: 99,
        author: { name: 'Lisa', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Lisa' }
    }
];

const BOOKS = [
    { id: 'b1', title: '原子习惯', author: 'James Clear', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80', count: 12 },
    { id: 'b2', title: '当下的力量', author: 'Eckhart Tolle', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80', count: 8 },
    { id: 'b3', title: '被讨厌的勇气', author: '岸见一郎', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80', count: 25 },
    { id: 'b4', title: '纳瓦尔宝典', author: 'Eric Jorgenson', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80', count: 15 },
];

// New: Painting & Cooking sections
const PAINTING_CAMPS = [
    { id: 'p1', title: '水彩入门21天', cover: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80', campsCount: 8 },
    { id: 'p2', title: '素描基础', cover: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80', campsCount: 5 },
];

const COOKING_CAMPS = [
    { id: 'c1', title: '家常菜精进', cover: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80', campsCount: 12 },
    { id: 'c2', title: '烘焙乐趣', cover: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=400&q=80', campsCount: 6 },
];

const CATEGORIES = ['全部', '个人成长', '心灵', '商业', '哲学'];

export const CampExplore: React.FC = () => {
    const navigate = useNavigate();
    const { trigger: haptic } = useHaptics();
    const [selectedCategory, setSelectedCategory] = useState('全部');

    const handleCampClick = (id: string) => {
        haptic('light');
        navigate(`/camps/${id}`);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#050505] pb-24 font-sans">
            {/* Header */}
            <NavBar
                title={<span className="font-serif font-bold text-lg">发现晨读</span>}
                left={<button onClick={() => navigate(-1)}><Icon name="arrow_back" className="text-xl" /></button>}
                right={<Icon name="search" className="text-xl text-gray-500" />}
                className="bg-transparent"
            />

            <div className="px-4 space-y-8 pt-4">

                {/* 1. Hero Spotlight (Featured) */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            🔥 正在热招
                        </h2>
                        <span className="text-xs text-secondary font-medium">查看全部</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        {FEATURED_CAMPS.map(camp => (
                            <div
                                key={camp.id}
                                onClick={() => handleCampClick(camp.id)}
                                className="shrink-0 w-[280px] bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-xl shadow-gray-100 dark:shadow-none active:scale-95 transition-transform"
                            >
                                <div className="h-36 relative">
                                    <img src={camp.cover} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">
                                        仅剩 {camp.spotsLeft} 席
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                                        <div className="text-white font-bold text-lg leading-tight truncate">{camp.theme}</div>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                                        共读 {camp.book}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <img src={camp.author.avatar} className="w-5 h-5 rounded-full bg-gray-100" />
                                            <span className="text-xs text-gray-600 dark:text-gray-300">{camp.author.name}</span>
                                        </div>
                                        <div className="flex items-baseline gap-0.5 text-primary">
                                            <span className="text-xs">¥</span>
                                            <span className="font-bold text-lg">{camp.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Book Library (Classics) */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            📚 经典书库
                        </h2>
                        <span className="text-xs text-gray-400">所有书籍</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {BOOKS.map(book => (
                            <div key={book.id} className="group relative">
                                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800 relative mb-2">
                                    <img src={book.cover} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur text-xs px-2 py-1 rounded-md inline-block shadow-sm">
                                            {book.count} 个晨读营
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{book.title}</h3>
                                <p className="text-xs text-gray-500">{book.author}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Painting Section */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            🎨 画画
                        </h2>
                        <button
                            onClick={() => navigate('/category/painting')}
                            className="text-xs text-secondary font-medium"
                        >
                            查看全部
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {PAINTING_CAMPS.map(item => (
                            <div
                                key={item.id}
                                className="group relative cursor-pointer"
                                onClick={() => navigate('/category/painting')}
                            >
                                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800 relative mb-2">
                                    <img src={item.cover} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur text-xs px-2 py-1 rounded-md inline-block shadow-sm">
                                            {item.campsCount} 个晨读营
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Cooking Section */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            🍳 料理
                        </h2>
                        <button
                            onClick={() => navigate('/category/cooking')}
                            className="text-xs text-secondary font-medium"
                        >
                            查看全部
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {COOKING_CAMPS.map(item => (
                            <div
                                key={item.id}
                                className="group relative cursor-pointer"
                                onClick={() => navigate('/category/cooking')}
                            >
                                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800 relative mb-2">
                                    <img src={item.cover} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur text-xs px-2 py-1 rounded-md inline-block shadow-sm">
                                            {item.campsCount} 个晨读营
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Interest Groups (Mock UI) */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            ✨ 主题探索
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { haptic('light'); setSelectedCategory(cat); }}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white dark:bg-[#1A1A1A] text-gray-500 border border-gray-100 dark:border-gray-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Placeholder List */}
                    <div className="mt-4 space-y-3">
                        {/* Just duplicate featured camps as vertical list for demo */}
                        {[...FEATURED_CAMPS, ...FEATURED_CAMPS].map((camp, i) => (
                            <div key={i + 'list'} className="flex gap-4 p-3 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-50 dark:border-white/5">
                                <img src={camp.cover} className="w-20 h-20 rounded-lg object-cover bg-gray-200" />
                                <div className="flex-1 flex flex-col justify-between py-0.5">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{camp.theme}</h3>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">共读 {camp.book}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">正在招募</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">¥ {camp.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};
