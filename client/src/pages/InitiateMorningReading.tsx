import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/hooks/useTranslation';
import { useThemeColor } from '@/hooks/useThemeColor';

export const InitiateMorningReading: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#000000' : '#FFFFFF');

    const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);

    const schedule = [
        {
            week: '第一周：看见内在的基础', days: [
                'Day 1: 品德成功论', 'Day 2: 思维方式的力量', 'Day 3: 以原则为中心的思维方式',
                'Day 4: 成长和改变的原则', 'Day 5: 品德是习惯的合成', 'Day 6: 成熟模式图', 'Day 7: 积极主动'
            ]
        },
        {
            week: '第二周：掌握选择与方向', days: [
                'Day 8: 爱是动词', 'Day 9: 关注圈与影响圈', 'Day 10: 以终为始',
                'Day 11: 领导与管理', 'Day 12: 改写人生剧本', 'Day 13: 各种生活中心', 'Day 14: 要事第一'
            ]
        },
        {
            week: '第三周：深化关系与持续更新', days: [
                'Day 15: 一对一的人际关系', 'Day 16: 哪一种最好？', 'Day 17: 双赢品德',
                'Day 18: 移情聆听', 'Day 19: 和而不同', 'Day 20: 转型者', 'Day 21: 日日新生'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#111] pb-10">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 dark:text-gray-400">
                        <Icon name="arrow_back" className="text-[24px]" />
                    </button>
                    <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">发起晨读</h1>
                    <div className="w-10" />
                </div>
            </header>

            <div className="max-w-md mx-auto p-5 space-y-8">
                {/* Hero Section */}
                <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2070&auto=format&fit=crop"
                        alt="Morning light"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">勇敢的心</h2>
                        <p className="text-white/90 text-sm font-medium">愿每个凡人都能看见自己的不凡</p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon name="calendar_today" className="text-primary text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">第八期晨读营</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">2025/10/11 - 11/02 (23天)</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                            <Icon name="schedule" className="text-orange-600 dark:text-orange-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">每日共修</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">每天清晨 6:00 - 7:00</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                            <Icon name="groups" className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">小班深度</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">10人/班 · 深度连接 · 用心陪伴</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        <Icon name="add_circle" className="text-xl" />
                        立即报名加入
                    </button>
                    <button
                        onClick={() => navigate('/understand')}
                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Icon name="info" className="text-xl" />
                        了解晨读模式
                    </button>
                </div>

                {/* Content Preview */}
                <div className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
                        className="w-full p-4 bg-gray-50 dark:bg-white/5 flex items-center justify-between"
                    >
                        <span className="font-bold text-gray-900 dark:text-white">21天共读内容预览</span>
                        <Icon
                            name="expand_more"
                            className={`text-gray-400 transition-transform duration-300 ${isScheduleExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <div className={`bg-white dark:bg-[#111] transition-all duration-300 ease-in-out ${isScheduleExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-5 space-y-6">
                            {schedule.map((week, idx) => (
                                <div key={idx}>
                                    <h4 className="font-bold text-primary mb-3 text-sm">{week.week}</h4>
                                    <div className="space-y-2 pl-3 border-l-2 border-gray-100 dark:border-gray-800">
                                        {week.days.map((day, dIdx) => (
                                            <p key={dIdx} className="text-sm text-gray-600 dark:text-gray-400">{day}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">如有疑问，请联系小凡</p>
                    <button className="text-primary font-medium text-sm hover:underline">联系主理人微信</button>
                </div>
            </div>
        </div>
    );
};
