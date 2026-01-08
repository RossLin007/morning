import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/hooks/useTranslation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { currentCamp } from '@/data/campData';
import { CampDailySchedule } from '@/types';

export const CampEnrollment: React.FC = () => {
    const navigate = useNavigate();
    // const { t } = useTranslation(); // Unused
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#000000' : '#FFFFFF');

    const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);

    // Helper to group schedule into weeks
    const weeks = React.useMemo(() => {
        const grouped: { week: string; days: CampDailySchedule[] }[] = [];
        const days = currentCamp.schedule;

        for (let i = 0; i < days.length; i += 7) {
            const weekNum = Math.floor(i / 7) + 1;
            const weekDays = days.slice(i, i + 7);

            // Determine week theme from the first day or specific logic
            // For now, using a generic title or the themeFocus of the first day
            const weekTitle = `第 ${weekNum} 周：${weekDays[0]?.themeFocus || '进阶修炼'}`;

            grouped.push({
                week: weekTitle,
                days: weekDays
            });
        }
        return grouped;
    }, []);

    // Format Date Range
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#111] pb-10">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 dark:text-gray-400">
                        <Icon name="arrow_back" className="text-[24px]" />
                    </button>
                    <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">晨读招募</h1>
                    <div className="w-10" />
                </div>
            </header>

            <div className="max-w-md mx-auto p-5 space-y-8">
                {/* Hero Section */}
                <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg">
                    <img
                        src={currentCamp.marketing.heroImage}
                        alt="Camp Theme"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">{currentCamp.period ? `第${currentCamp.period}期：` : ''}{currentCamp.theme}</h2>
                        <p className="text-white/90 text-sm font-medium whitespace-pre-line">{currentCamp.marketing.corePhilosophy.split('\n')[1] || '由内而外的成长之道'}</p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon name="calendar_today" className="text-primary text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">第{currentCamp.period}期晨读营</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(currentCamp.startDate)} - {formatDate(currentCamp.endDate)}
                                <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                                    {Math.round((new Date(currentCamp.endDate).getTime() - new Date(currentCamp.startDate).getTime()) / (1000 * 3600 * 24))}天
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                            <Icon name="schedule" className="text-orange-600 dark:text-orange-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">每日共修</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                每天 {currentCamp.dailyStartTime} - {currentCamp.dailyEndTime}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                            <Icon name="groups" className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">小班深度</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {currentCamp.enrollmentCap}人/班 ·
                                <span className="mx-1">{currentCamp.marketing.features[1]}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                            <Icon name="payments" className="text-green-600 dark:text-green-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">费用</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ¥ {currentCamp.price} / 人
                            </p>
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

                {/* Content Preview (Dynamic) */}
                <div className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
                        className="w-full p-4 bg-gray-50 dark:bg-white/5 flex items-center justify-between"
                    >
                        <span className="font-bold text-gray-900 dark:text-white">{currentCamp.schedule.length}天共读内容预览</span>
                        <Icon
                            name="expand_more"
                            className={`text-gray-400 transition-transform duration-300 ${isScheduleExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <div className={`bg-white dark:bg-[#111] transition-all duration-300 ease-in-out ${isScheduleExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-5 space-y-6 overflow-y-auto max-h-[60vh]">
                            {weeks.map((week, idx) => (
                                <div key={idx}>
                                    <h4 className="font-bold text-primary mb-3 text-sm sticky top-0 bg-white dark:bg-[#111] py-1">{week.week}</h4>
                                    <div className="space-y-3 pl-3 border-l-2 border-gray-100 dark:border-gray-800">
                                        {week.days.map((day) => (
                                            <div key={day.day}>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{day.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">焦点：{day.themeFocus} | {day.readingMaterial}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">如有疑问，请联系我们</p>
                    <button className="text-primary font-medium text-sm hover:underline">联系主理人微信</button>
                </div>
            </div>
        </div>
    );
};
