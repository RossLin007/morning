
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useHaptics } from '@/hooks/useHaptics';

// Mock Detail Data (In real app, fetch by ID)
const CAMP_DETAILS: Record<string, any> = {
    'c1': {
        id: 'c1',
        theme: '心流之境·第九期',
        book: {
            title: '《心流：最优体验心理学》',
            author: 'Mihaly Csikszentmihalyi',
            cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'
        },
        cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        startDate: '2026-02-01',
        endDate: '2026-02-23',
        duration: 21,
        dailyTime: '06:00 - 07:00',
        spotsLeft: 3,
        totalSpots: 10,
        price: 1800,
        host: {
            name: 'Dr. C',
            avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=DrC',
            title: '正念教练 · 第八期主理人',
            bio: '专注于心流状态研究，带领过 200+ 位学员找到专注之道。'
        },
        philosophy: `在这21天里，我们将一起探索"心流"的奥秘——那种全身心投入、时间飞逝的最优体验状态。

每天清晨6点，我们共读一小节，分享觉察，互相激励。

这不仅是读书，更是一场关于"专注力"与"内在秩序"的修行。`,
        features: [
            '🌅 每日6点晨读打卡',
            '📖 21天深度共读',
            '💬 小群互动（限10人）',
            '🎙️ 每周语音分享会',
            '📝 专属阅读手册'
        ],
        agreements: [
            '准时参与每日晨读',
            '尊重每位书友的分享',
            '保持开放与好奇的心态',
            '完成每日反思日记'
        ]
    },
    'c2': {
        id: 'c2',
        theme: '习惯的力量',
        book: {
            title: '《原子习惯》',
            author: 'James Clear',
            cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80'
        },
        cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80',
        startDate: '2026-02-05',
        endDate: '2026-02-26',
        duration: 21,
        dailyTime: '06:30 - 07:30',
        spotsLeft: 8,
        totalSpots: 12,
        price: 99,
        host: {
            name: 'Lisa',
            avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Lisa',
            title: '习惯养成达人',
            bio: '坚持晨读 500+ 天，相信微小改变能带来巨大蜕变。'
        },
        philosophy: `原子习惯告诉我们：改变不必轰轰烈烈，每天进步1%，一年后你将成长37倍。

我们将用21天，一起打造属于自己的"原子级"好习惯。`,
        features: [
            '🌱 每日微习惯挑战',
            '📊 习惯追踪系统',
            '👥 书友互助小组',
            '🎯 个性化习惯设计'
        ],
        agreements: [
            '每日完成晨读分享',
            '积极参与习惯打卡',
            '互相鼓励，不做评判'
        ]
    }
};

export const CampDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { trigger: haptic } = useHaptics();

    const camp = CAMP_DETAILS[id || 'c1'] || CAMP_DETAILS['c1'];

    const handleEnroll = () => {
        haptic('medium');
        navigate('/camp/enroll', { state: { campId: camp.id } });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pb-28">
            {/* Sticky Header (Transparent -> Solid on Scroll) */}
            <header className="fixed top-0 left-0 right-0 z-50 pt-safe">
                <div className="h-[44px] flex items-center justify-between px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white"
                    >
                        <Icon name="arrow_back" className="text-xl" />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white">
                        <Icon name="share" className="text-lg" />
                    </button>
                </div>
            </header>

            {/* Hero Image */}
            <div className="relative h-[45vh] min-h-[300px]">
                <img src={camp.cover} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-red-500/90 text-white text-[11px] px-2.5 py-1 rounded-full font-bold">
                            仅剩 {camp.spotsLeft} 席
                        </span>
                        <span className="bg-white/20 text-white/90 text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm">
                            {camp.duration}天
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">{camp.theme}</h1>
                    <p className="text-white/70 text-sm">共读 {camp.book.title}</p>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 py-6 space-y-8">

                {/* Quick Info Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-xl p-3 text-center">
                        <Icon name="calendar_month" className="text-primary text-xl mb-1" />
                        <p className="text-[11px] text-gray-500">开营日期</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{camp.startDate.slice(5)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-xl p-3 text-center">
                        <Icon name="schedule" className="text-primary text-xl mb-1" />
                        <p className="text-[11px] text-gray-500">晨读时间</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{camp.dailyTime.split(' - ')[0]}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-xl p-3 text-center">
                        <Icon name="group" className="text-primary text-xl mb-1" />
                        <p className="text-[11px] text-gray-500">营地人数</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{camp.totalSpots}人小班</p>
                    </div>
                </div>

                {/* Book Info */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📖 共读书籍</h2>
                    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl">
                        <img src={camp.book.cover} alt="" className="w-20 h-28 rounded-lg object-cover shadow-md" />
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{camp.book.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{camp.book.author}</p>
                            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                                一本关于如何在日常生活中寻找最佳体验的经典之作。
                            </p>
                        </div>
                    </div>
                </section>

                {/* Host Profile */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👤 主理人</h2>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl">
                        <img src={camp.host.avatar} alt="" className="w-14 h-14 rounded-full bg-gray-200" />
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{camp.host.name}</h3>
                            <p className="text-xs text-primary mt-0.5">{camp.host.title}</p>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{camp.host.bio}</p>
                        </div>
                    </div>
                </section>

                {/* Philosophy */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💫 营地理念</h2>
                    <div className="p-5 bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/10 rounded-2xl">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {camp.philosophy}
                        </p>
                    </div>
                </section>

                {/* Features */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">✨ 营地特色</h2>
                    <div className="space-y-3">
                        {camp.features.map((feat: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl">
                                <span className="text-base">{feat.slice(0, 2)}</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{feat.slice(2)}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Agreements */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🤝 营地公约</h2>
                    <div className="space-y-2">
                        {camp.agreements.map((item: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Icon name="check_circle" className="text-emerald-500 text-lg shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-4 pb-safe z-50">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-500">费用</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-primary">¥</span>
                            <span className="text-2xl font-bold text-primary">{camp.price}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleEnroll}
                        className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <Icon name="how_to_reg" className="text-lg" />
                        立即报名
                    </button>
                </div>
            </div>
        </div>
    );
};
