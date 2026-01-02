import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useProgress } from '@/hooks/useProgress';
import { courseData } from '@/data/courseData';

export const Reading: React.FC = () => {
    const navigate = useNavigate();
    const { completedLessons, isLoading } = useProgress();

    // State for expanded chapters (default to first chapter or current chapter)
    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

    // Memoize current lesson and initial expansion
    const currentLesson = React.useMemo(() => {
        return courseData.flatMap(c => c.lessons).find(l => !completedLessons.includes(l.id));
    }, [completedLessons]);

    // Initial expansion logic - expand the chapter containing the current lesson
    React.useEffect(() => {
        if (currentLesson) {
            const chapterId = courseData.find(c => c.lessons.some(l => l.id === currentLesson.id))?.id;
            if (chapterId) {
                setExpandedChapters(prev => ({ ...prev, [chapterId]: true }));
            }
        } else {
            // If all completed, expand the last one or none
            if (courseData.length > 0) {
                setExpandedChapters(prev => ({ ...prev, [courseData[0].id]: true }));
            }
        }
    }, [currentLesson]);

    const toggleChapter = (id: string) => {
        setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-[#F5F7F5] dark:bg-[#0A0A0A] font-sans pb-24">

            {/* 1. Header */}
            <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between bg-[#F5F7F5]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Icon name="arrow_back" className="text-text-main dark:text-white" />
                </button>
                <h1 className="text-lg font-serif font-bold text-text-main dark:text-white">晨读</h1>
                <div className="w-10"></div>
            </header>

            <div className="px-6 py-4 space-y-8">

                {/* 2. Current Course Card */}
                <section>
                    <div className="bg-white dark:bg-[#151515] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                        {/* Decor Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>

                        {currentLesson ? (
                            <>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full uppercase tracking-wider">当前课程</span>
                                        <span className="text-xs text-gray-400">Day {currentLesson.day}</span>
                                    </div>

                                    <h2 className="text-xl font-display font-bold text-text-main dark:text-white mb-2 leading-tight">
                                        {currentLesson.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                                        {currentLesson.quote?.text || '开启今天的智慧之旅，重塑你的思维习惯。'}
                                    </p>

                                    <button
                                        onClick={() => navigate(`/course/${currentLesson.id}`)}
                                        className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <Icon name="play_arrow" />
                                        继续学习
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

                {/* 3. Course Directory */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Icon name="list_alt" className="text-gray-400" />
                        <h3 className="text-sm font-bold text-text-main dark:text-white text-gray-500">课程目录</h3>
                    </div>

                    <div className="space-y-4">
                        {courseData.map((chapter, index) => {
                            const chapterLessons = chapter.lessons;
                            const completedInChapter = chapterLessons.filter(l => completedLessons.includes(l.id)).length;
                            const totalInChapter = chapterLessons.length;
                            const progress = Math.round((completedInChapter / totalInChapter) * 100);
                            const isExpanded = expandedChapters[chapter.id];
                            const isLocked = chapter.isLocked && completedLessons.length < (index * 7); // Simple mock lock logic

                            return (
                                <div key={chapter.id} className={`bg-white dark:bg-[#151515] rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-primary/20 shadow-sm' : 'border-gray-100 dark:border-gray-800'}`}>

                                    {/* Accordion Header */}
                                    <div
                                        onClick={() => !isLocked && toggleChapter(chapter.id)}
                                        className={`p-4 flex items-center justify-between cursor-pointer ${isLocked ? 'opacity-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 
                                          ${progress === 100
                                                    ? 'bg-green-100 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-900/20'
                                                    : isLocked
                                                        ? 'bg-gray-100 text-gray-400 border-gray-100 dark:bg-gray-800 dark:border-gray-800'
                                                        : 'bg-primary/10 text-primary border-primary/10'
                                                }`}>
                                                {isLocked ? <Icon name="lock" className="text-xs" /> : (progress === 100 ? <Icon name="check" className="text-xs" /> : `${progress}%`)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-text-main dark:text-white">{chapter.title}</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5">
                                                    {completedInChapter}/{totalInChapter} 完成
                                                </p>
                                            </div>
                                        </div>
                                        <Icon name={isExpanded ? "expand_less" : "expand_more"} className="text-gray-400" />
                                    </div>

                                    {/* Accordion Body */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] border-t border-gray-50 dark:border-gray-800' : 'max-h-0'}`}>
                                        <div className="p-2 space-y-1">
                                            {chapterLessons.map(lesson => {
                                                const isLessonCompleted = completedLessons.includes(lesson.id);
                                                const isLessonCurrent = currentLesson?.id === lesson.id;
                                                const isLessonLocked = !isLessonCompleted && !isLessonCurrent && !completedLessons.includes(courseData.flatMap(c => c.lessons).find(l => l.day === lesson.day - 1)?.id || 'none'); // Simple sequential lock

                                                // Override lock for first lesson
                                                const effectiveLocked = lesson.day === 1 ? false : isLessonLocked;

                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        onClick={() => !effectiveLocked && navigate(`/course/${lesson.id}`)}
                                                        className={`flex items-center justify-between p-3 rounded-xl transition-colors
                                                    ${isLessonCurrent
                                                                ? 'bg-primary/5'
                                                                : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                                            }
                                                    ${effectiveLocked ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}
                                                `}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isLessonCompleted ? (
                                                                <Icon name="check_circle" className="text-green-500 text-lg" filled />
                                                            ) : isLessonCurrent ? (
                                                                <Icon name="play_circle" className="text-primary text-lg" filled />
                                                            ) : (
                                                                <div className="size-4 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                                                            )}

                                                            <div className="flex flex-col">
                                                                <span className={`text-sm font-medium ${isLessonCurrent ? 'text-primary font-bold' : 'text-text-main dark:text-white'}`}>
                                                                    {lesson.day}. {lesson.title}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">{lesson.duration}</span>
                                                            </div>
                                                        </div>

                                                        {isLessonCurrent && (
                                                            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">进行中</span>
                                                        )}
                                                        {effectiveLocked && <Icon name="lock" className="text-gray-300 text-xs" />}
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
