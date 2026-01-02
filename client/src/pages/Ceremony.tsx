
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface CeremonyProps {
    type: 'opening' | 'closing';
}

// Opening Ceremony (Day 0) - 开营仪式
export const OpeningCeremony: React.FC = () => {
    const navigate = useNavigate();

    const commitments = [
        '每日早起，给自己15分钟的晨读时光',
        '用觉察日记记录内心的发现',
        '与书友互相看见，彼此支持',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-40 right-10 w-48 h-48 bg-accent/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 py-12 flex flex-col items-center min-h-screen">
                {/* Header */}
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6">
                    <Icon name="close" className="text-white/60" />
                </button>

                {/* Session Badge */}
                <span className="text-xs font-bold text-primary bg-primary/20 px-4 py-1.5 rounded-full mt-8">
                    第八期 · 开营仪式
                </span>

                {/* Title */}
                <h1 className="text-3xl font-display font-bold text-center mt-8 mb-2">
                    静水深流
                </h1>
                <p className="text-white/60 text-center mb-8">
                    平静与深度 · 2025.9.20 - 10.10
                </p>

                {/* Quote */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 max-w-sm w-full mb-8">
                    <p className="text-lg text-center italic text-white/80 leading-relaxed">
                        "事实上，我们越能在心中反省什么是重要的事，就越有能力去做接下来重要的事。"
                    </p>
                    <p className="text-center text-white/40 text-sm mt-4">
                        — 史蒂芬·柯维
                    </p>
                </div>

                {/* Commitments */}
                <div className="w-full max-w-sm mb-8">
                    <h3 className="text-sm font-bold text-white/60 mb-4 text-center">21天约定</h3>
                    <div className="space-y-3">
                        {commitments.map((commitment, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 bg-white/5 rounded-xl p-4"
                            >
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                                </div>
                                <p className="text-sm text-white/80 flex-1">{commitment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* CTA */}
                <div className="w-full max-w-sm space-y-3 mb-8">
                    <Button
                        onClick={() => navigate('/reading')}
                        className="w-full"
                    >
                        🌱 开启晨读之旅
                    </Button>
                    <p className="text-center text-white/40 text-xs">
                        Day 1 将于明天早上开始
                    </p>
                </div>
            </div>
        </div>
    );
};

// Closing Ceremony (Day 22) - 结营仪式
export const ClosingCeremony: React.FC = () => {
    const navigate = useNavigate();

    const stats = {
        days: 21,
        diaries: 18,
        insights: 5,
        shares: 12,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2C3E3E] to-[#1A1A1A] text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 py-12 flex flex-col items-center min-h-screen">
                {/* Header */}
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6">
                    <Icon name="close" className="text-white/60" />
                </button>

                {/* Celebration Icon */}
                <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center mt-8 mb-4">
                    <span className="text-4xl">🎉</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-display font-bold text-center mb-2">
                    恭喜结营！
                </h1>
                <p className="text-white/60 text-center mb-8">
                    第八期 · 静水深流
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                        <p className="text-3xl font-bold text-primary">{stats.days}</p>
                        <p className="text-xs text-white/60 mt-1">完成天数</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                        <p className="text-3xl font-bold text-primary">{stats.diaries}</p>
                        <p className="text-xs text-white/60 mt-1">觉察日记</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                        <p className="text-3xl font-bold text-accent">{stats.insights}</p>
                        <p className="text-xs text-white/60 mt-1">小凡洞见</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
                        <p className="text-3xl font-bold text-accent">{stats.shares}</p>
                        <p className="text-xs text-white/60 mt-1">书友看见</p>
                    </div>
                </div>

                {/* Certificate Preview */}
                <div className="w-full max-w-sm bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Icon name="workspace_premium" className="text-primary text-3xl" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white">结营证书已生成</h3>
                            <p className="text-xs text-white/60 mt-1">可分享至朋友圈留念</p>
                        </div>
                        <Icon name="chevron_right" className="text-white/40" />
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* CTAs */}
                <div className="w-full max-w-sm space-y-3 mb-8">
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full"
                    >
                        🏠 返回首页
                    </Button>
                    <button
                        onClick={() => navigate('/sessions')}
                        className="w-full py-3 text-sm font-bold text-white/60 hover:text-white transition-colors"
                    >
                        查看我的晨读历程
                    </button>
                </div>
            </div>
        </div>
    );
};
