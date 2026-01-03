import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useProfile } from '@/hooks/useProfile';
import { useProgress } from '@/hooks/useProgress';
import { useThemeColor } from '@/hooks/useThemeColor';
import { courseData } from '@/data/courseData';
import { SageAvatar } from '@/components/sage/SageAvatar';
import { SmartFeed } from '@/components/dashboard/SmartFeed';

import { FeedCardProps } from '@/components/dashboard/FeedCard';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { profile } = useProfile();
    const { completedLessons } = useProgress();

    // Set PWA status bar color to match Native Header
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#111111' : '#EDEDED');

    // Initial Data Loading
    const totalDays = 22;
    const currentDayNum = Math.min(completedLessons.length + 1, totalDays);
    let currentLesson = null;
    for (const chapter of courseData) {
        const found = chapter.lessons.find(l => l.day === currentDayNum);
        if (found) { currentLesson = found; break; }
    }
    if (!currentLesson && currentDayNum === 0) currentLesson = courseData[0].lessons[0];

    // --- State: The Unified Feed ---
    // We separate Pinned items from the Flow
    const [pinnedItems, setPinnedItems] = useState<FeedCardProps[]>([]);
    const [feedStream, setFeedStream] = useState<FeedCardProps[]>([]);

    useEffect(() => {
        // 1. Initialize Pinned Items (e.g., Today's Reading)
        setPinnedItems([
            {
                type: 'reading',
                isPinned: true,
                title: currentLesson ? `Day ${currentDayNum}: ${currentLesson.title}` : 'All caught up!',
                content: currentLesson?.points?.[0]?.title || 'Start your journey to independence.',
                image: currentLesson?.image,
                meta: `${currentLesson?.duration || '15 min'}`,
                actionLabel: 'Start Session',
                onClick: () => navigate(currentLesson ? `/course/${currentLesson.id}` : '/reading')
            }
        ]);

        // 2. Initialize Stream with Greeting & recent updates
        const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Friend';
        const initialStream: FeedCardProps[] = [

            // --- Growth ---
            { type: 'system', title: '📢 每日晨读分享', content: 'Day 1 金句：积极主动不仅是指行事态度，更意味着人一定要对自己的人生负责。', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80', meta: '07:00' },
            { type: 'system', title: '🔒 课程解锁', content: '恭喜！你已完成基础篇，【公众成功】模块已为你解锁。', icon: 'lock_open', meta: '07:30' },
            { type: 'summary', title: '💡 学习摘要', content: 'Sage 为你总结了今天的要点：1. 刺激与回应之间有选择权 2. 也是自我意识的觉醒。', meta: '07:45' },
            { type: 'system', title: '🧠 间隔复习', content: '还记得 3 天前学习的“情感账户”概念吗？试着说出它的定义。', icon: 'history_edu', meta: '08:00' },

            // --- Awareness ---
            { type: 'reflection', title: '📝 每日一问', content: '今天哪件事让你感到最有掌控感？', icon: 'help_outline', meta: '每日Prompt', actionLabel: '写日记' },
            { type: 'system', title: '🔋 能量检视', content: '此刻你的能量状态是多少？(0-100)', icon: 'battery_full', meta: '轻交互', actionLabel: '记录' },
            { type: 'reflection', title: '🕰️ 那年今日', content: '上个月的今天，你写下：“我想成为一个更耐心的人。”', icon: 'history', meta: '回顾' },
            { type: 'system', title: '💧 微习惯', content: '早起一杯水，滋润身心。', icon: 'water_drop', meta: '提醒' },
            { type: 'system', title: '🧘 呼吸时刻', content: '监测到你似乎有些焦躁，来做 1 分钟深呼吸吧。', icon: 'self_improvement', meta: 'AI 感知' },

            // --- Connect ---
            { type: 'partner', title: '👫 Bookmate Update', content: 'Sarah 刚刚完成了 Day 5 的修习。', meta: '10:00', icon: 'check_circle' },
            { type: 'partner', title: '🤝 共鸣通知', content: 'David 划线了你日记中关于“自由”的段落。', meta: '10:30', icon: 'format_quote' },
            { type: 'partner', title: '❤️ 伙伴能量', content: '你的伙伴 Ben 今天能量较低，送个抱抱鼓励一下？', meta: '关怀提醒', actionLabel: 'Send Hug' },
            { type: 'partner', title: '🔥 社区精选', content: '“我们无法改变风向，但可以调整风帆。” —— 来自社区热帖', meta: '每日精选' },
            { type: 'partner', title: '👋 结伴邀请', content: '有一个新成员希望能成为你的晨读搭子，共同进步。', meta: '新消息', actionLabel: '查看' },

            // --- Sage ---
            { type: 'chat-ai', content: 'Good morning! 根据今天的天气，是个适合去公园晨读的好日子。' },
            { type: 'insight', title: '✨ AI 洞察', content: '通过分析你上周的日记，我发现通过分析你上周的日记，我发现你周日晚上总是容易感到焦虑。', meta: '深度分析' },
            { type: 'feedback', title: '👏 夸夸卡', content: '连续 7 天完成晨读，你的毅力超过了 90% 的用户！', meta: '成就', icon: 'celebration' },
            { type: 'system', title: '⏰ 温柔提醒', content: '今天还没晨读哦，只需要 15 分钟即可完成。', icon: 'schedule', meta: '提醒' },

            // --- System ---
            { type: 'reward', title: '🏅 获得勋章', content: '解锁【早起鸟】徽章！继续保持。', meta: '成就' },
            { type: 'summary', title: '📊 周报推送', content: '本周你的专注时长：5 小时，阅读了 3 个章节。', meta: '周报', icon: 'analytics' },
        ];
        setFeedStream(initialStream.reverse());
    }, [profile, user, currentLesson, currentDayNum, navigate]);



    return (
        <div className="min-h-screen bg-transparent dark:bg-[#0A0A0A] font-sans pb-32 relative">

            {/* Top Bar for Sage Identity (Native Header - extends into safe-area) */}
            <header className="fixed top-0 left-0 right-0 z-40 pt-safe bg-[#EDEDED] dark:bg-[#111]">
                <div className="h-[44px] flex items-center justify-center">
                    <h1 className="text-[17px] font-medium text-black dark:text-white tracking-wide">凡人晨读</h1>
                </div>
            </header>

            <div className="max-w-md mx-auto px-6 pt-[68px]">

                {/* 1. Pinned Section */}
                <div className="mb-8">
                    <SmartFeed items={pinnedItems} />
                </div>
                {/* ... */}
            </div>

            {/* 2. Dynamic Stream */}
            <div className="space-y-6 min-h-[40vh]">
                {/* Stream Header */}
                <div className="flex items-center gap-4 mb-6 opacity-30">
                    <div className="h-px flex-1 bg-black dark:bg-white"></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Live Feed</span>
                    <div className="h-px flex-1 bg-black dark:bg-white"></div>
                </div>

                <SmartFeed items={feedStream} />
            </div>

        </div>
    );
};
