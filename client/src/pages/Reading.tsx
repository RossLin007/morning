import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useProgress } from '@/hooks/useProgress';
import { useThemeColor } from '@/hooks/useThemeColor';
import { courseData } from '@/data/courseData';

export const Reading: React.FC = () => {
    const navigate = useNavigate();
    const { completedLessons, isLoading } = useProgress();

    // Set PWA status bar color to match Native Header
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#111111' : '#EDEDED');

    // Memoize current lesson
    const currentLesson = React.useMemo(() => {
        return courseData.flatMap(c => c.lessons).find(l => !completedLessons.includes(l.id));
    }, [completedLessons]);

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-[#111] font-sans pb-24">

            {/* 1. Header (Native WeChat Style) */}
            <header className="fixed top-0 left-0 right-0 z-40 h-[44px] flex items-center justify-center bg-[#EDEDED] dark:bg-[#111] border-b border-[#D5D5D5] dark:border-gray-800 transition-transform">
                <h1 className="text-[17px] font-medium text-black dark:text-white tracking-wide">晨读</h1>
            </header>

            <div className="pt-[44px] pb-2">

                {/* 2. Current Course Card */}
                <section className="px-5 mb-8 mt-2">
                    <div className="bg-white dark:bg-[#191919] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                        {currentLesson ? (
                            <>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full">进行中</span>
                                        <span className="text-xs text-gray-400">Day {currentLesson.day}</span>
                                    </div>

                                    <h2 className="text-xl font-bold text-text-main dark:text-white mb-3 leading-tight">
                                        {currentLesson.title}
                                    </h2>
                                    <p className="text-[15px] leading-relaxed text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                                        {currentLesson.quote?.text || '开启今天的智慧之旅，重塑你的思维习惯。'}
                                    </p>

                                    <button
                                        onClick={() => navigate(`/course/${currentLesson.id}`)}
                                        className="w-full py-3.5 rounded-xl bg-[#6B8E8E] text-white font-medium text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Icon name="play_arrow" className="text-lg" />
                                        开始今日晨读
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <Icon name="emoji_events" className="text-4xl text-yellow-500 mb-2" />
                                <h3 className="text-lg font-bold text-text-main dark:text-white">所有课程已完成</h3>
                                <p className="text-xs text-gray-400 mt-1">温故而知新，可以回头复习哦</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. Course Directory (Edge-to-Edge, Always Expanded) */}
                <section>
                    <div className="border-t border-gray-100 dark:border-gray-800">
                        {courseData.map((chapter, index) => {
                            const chapterLessons = chapter.lessons;
                            const completedInChapter = chapterLessons.filter(l => completedLessons.includes(l.id)).length;
                            const totalInChapter = chapterLessons.length;
                            const progress = Math.round((completedInChapter / totalInChapter) * 100);
                            const isLocked = chapter.isLocked && completedLessons.length < (index * 7);

                            return (
                                <div key={chapter.id} className="bg-white dark:bg-[#111]">

                                    {/* Chapter Header (Static) */}
                                    <div
                                        className={`px-5 py-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-800
                                            ${isLocked ? 'opacity-60 grayscale' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`size-10 rounded-full flex items-center justify-center text-[11px] font-bold border-2 shrink-0
                                          ${progress === 100
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/20'
                                                    : 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-800 dark:border-gray-700'
                                                }`}>
                                                {isLocked ? <Icon name="lock" className="text-sm" /> : (progress === 100 ? <Icon name="check" className="text-sm" /> : `${progress}%`)}
                                            </div>
                                            <div>
                                                <h4 className="text-[16px] font-medium text-text-main dark:text-white mb-0.5">{chapter.title}</h4>
                                                <p className="text-[12px] text-gray-400">
                                                    {completedInChapter}/{totalInChapter} 节 · {chapterLessons.length * 10} 分钟
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lessons List (Always Visible) */}
                                    <div className="bg-gray-50/50 dark:bg-[#151515]">
                                        <div className="py-1">
                                            {chapterLessons.map((lesson, idx) => {
                                                const isLessonCompleted = completedLessons.includes(lesson.id);
                                                const isLessonCurrent = currentLesson?.id === lesson.id;
                                                // Simplified lock logic for demo
                                                const effectiveLocked = lesson.day > 1 && !isLessonCompleted && !isLessonCurrent && !completedLessons.includes(courseData.flatMap(c => c.lessons).find(l => l.day === lesson.day - 1)?.id || 'none');

                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        onClick={() => !effectiveLocked && navigate(`/course/${lesson.id}`)}
                                                        className={`flex items-center gap-4 px-5 py-3.5 pl-[72px] cursor-pointer active:bg-gray-100 dark:active:bg-white/10 transition-colors
                                                            ${isLessonCurrent ? 'bg-primary/5' : ''}
                                                            ${idx !== chapterLessons.length - 1 ? 'border-b border-gray-100/50 dark:border-gray-800/50' : ''}
                                                        `}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <span className={`text-[15px] ${isLessonCurrent ? 'text-primary font-medium' :
                                                                    isLessonCompleted ? 'text-gray-400 line-through' : 'text-text-main dark:text-gray-300'
                                                                    }`}>
                                                                    {lesson.day}. {lesson.title}
                                                                </span>
                                                                {effectiveLocked && <Icon name="lock" className="text-gray-300 text-xs" />}
                                                                {!effectiveLocked && isLessonCompleted && <Icon name="check" className="text-emerald-500 text-sm" />}
                                                                {!effectiveLocked && !isLessonCompleted && !isLessonCurrent && (
                                                                    <Icon name="play_circle_outline" className="text-gray-300 text-lg opacity-0 group-hover:opacity-100" />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[11px] text-gray-400">{lesson.duration}</span>
                                                                {isLessonCurrent && <span className="text-[10px] text-primary bg-primary/10 px-1.5 rounded">进行中</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
};
