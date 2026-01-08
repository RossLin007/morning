import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useProgress } from '@/hooks/useProgress';
import { useThemeColor } from '@/hooks/useThemeColor';
import { courseData } from '@/data/courseData';

// Standard List Cell Component
interface LessonCellProps {
    lesson: any;
    isCompleted: boolean;
    isCurrent: boolean;
    isLocked: boolean;
    onClick: () => void;
    isLast: boolean;
}

const LessonCell: React.FC<LessonCellProps> = ({ lesson, isCompleted, isCurrent, isLocked, onClick, isLast }) => {
    return (
        <div
            onClick={!isLocked ? onClick : undefined}
            className={`
                flex items-center gap-4 px-5 py-4 bg-white dark:bg-[#191919] 
                ${!isLocked ? 'cursor-pointer active:bg-gray-50 dark:active:bg-white/5' : 'opacity-60'}
                transition-colors
                ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''}
            `}
        >
            {/* Status Icon */}
            <div className="shrink-0">
                {isCompleted ? (
                    <Icon name="check_circle" className="text-[22px] text-emerald-500" />
                ) : isCurrent ? (
                    <Icon name="play_circle" className="text-[22px] text-primary" />
                ) : isLocked ? (
                    <Icon name="lock" className="text-[20px] text-gray-300 dark:text-gray-600" />
                ) : (
                    <Icon name="radio_button_unchecked" className="text-[20px] text-gray-300 dark:text-gray-600" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`text-[18px] font-bold leading-tight ${isCurrent ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                        {lesson.title}
                    </h3>
                    {isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">进行中</span>
                    )}
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate">
                    Day {lesson.day} · {lesson.duration}
                </p>
            </div>

            {/* Right Arrow */}
            {!isLocked && (
                <Icon name="chevron_right" className="text-gray-300 dark:text-gray-600 text-lg shrink-0" />
            )}
        </div>
    );
};

// Header Menu Component
const HeaderMenu: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: string) => {
        console.log(`Menu Action: ${action}`);
        setIsOpen(false);
        if (action === 'start') {
            navigate('/camp/create'); // Navigate to Camp Creator Wizard
        } else if (action === 'join') {
            navigate('/camps/explore');
        } else if (action === 'mode') {
            navigate('/understand');
        }
    };

    return (
        <div className="absolute right-4 top-1/2 -translate-y-[calc(50%-4px)] flex items-center" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 text-gray-400 dark:text-gray-500 active:scale-95 transition-transform rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
            >
                <Icon name="more_vert" className="text-[22px]" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-auto whitespace-nowrap bg-white dark:bg-[#222] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    <button
                        onClick={() => handleAction('join')}
                        className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2.5"
                    >
                        <Icon name="explore" className="text-[18px]" style={{ color: '#bfcad4', fontVariationSettings: "'wght' 300" }} />
                        加入晨读
                    </button>
                    <div className="h-[1px] bg-gray-100 dark:bg-gray-800 mx-3.5" />
                    <button
                        onClick={() => handleAction('start')}
                        className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2.5"
                    >
                        <Icon name="add_circle_outline" className="text-[18px]" style={{ color: '#bfcad4', fontVariationSettings: "'wght' 300" }} />
                        发起晨读
                    </button>
                    <div className="h-[1px] bg-gray-100 dark:bg-gray-800 mx-3.5" />
                    <button
                        onClick={() => handleAction('mode')}
                        className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2.5"
                    >
                        <Icon name="info" className="text-[18px]" style={{ color: '#bfcad4', fontVariationSettings: "'wght' 300" }} />
                        了解模式
                    </button>
                </div>
            )}
        </div>
    );
};

export const Reading: React.FC = () => {
    const navigate = useNavigate();
    const { completedLessons, isLoading } = useProgress();

    // Set Header Color
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#191919' : '#FFFFFF');

    // Memoize current lesson
    const currentLesson = useMemo(() => {
        return courseData.flatMap(c => c.lessons).find(l => !completedLessons.includes(l.id));
    }, [completedLessons]);

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#111] font-sans pb-24">

            <header className="sticky top-0 z-40 pt-safe bg-white dark:bg-[#191919] border-b border-gray-100 dark:border-[#222]">
                <div className="h-[44px] flex items-center justify-center relative px-4">
                    <h1 className="text-[17px] font-medium text-black dark:text-white tracking-wide">晨读</h1>
                    <HeaderMenu />
                </div>
            </header>

            {/* 2. Today's Hero Card */}
            {currentLesson && (
                <div className="px-4 mt-4 mb-4">
                    <div
                        onClick={() => navigate(`/course/${currentLesson.id}`)}
                        className="relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform shadow-lg aspect-video"
                    >
                        {/* Background Image - Bright Nature */}
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </div>

                        {/* Content Container */}
                        <div className="relative h-full px-6 flex flex-col justify-center">
                            {/* Left Content - Bottom Aligned */}
                            <div className="pr-12 z-10">
                                <h2 className="text-[22px] font-bold text-white leading-tight mb-2 mt-2">
                                    {currentLesson.title}
                                </h2>
                                <p className="text-[14px] text-white/70 mb-3 leading-relaxed">
                                    {(currentLesson.quote?.text || '每一个清晨，都是重塑自我的开始').split(/([，,。.;；?!？！\s])/).map((part, index) => (
                                        <React.Fragment key={index}>
                                            {part}
                                            {/[，,。.;；?!？！\s]/.test(part) && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                                <span className="text-[12px] text-white/60">Day {currentLesson.day} · {currentLesson.duration || '约10分钟'}</span>
                            </div>

                            {/* Right Arrow Icon (Absolute Center Right) */}
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                                <Icon name="chevron_right" className="text-[32px] text-white/90" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Course List (Grouped) */}
            <div className="pb-10">
                {courseData.map((chapter) => {
                    const chapterLessons = chapter.lessons;
                    // Determine lock state based on previous chapter completion
                    // Simplified logic: Check if all lessons in previous chapters are done
                    const firstLessonDay = chapterLessons[0].day;
                    const isChapterLocked = chapter.isLocked && completedLessons.length < (firstLessonDay - 1);

                    // Simple Stats
                    const completedInChapter = chapterLessons.filter(l => completedLessons.includes(l.id)).length;

                    return (
                        <div key={chapter.id} className="mb-2">
                            {/* Section Header */}
                            <div className="px-5 py-2 flex items-center justify-between text-[13px] text-gray-400 dark:text-gray-600 font-normal">
                                <span>{chapter.title}</span>
                                <span>{completedInChapter}/{chapterLessons.length}</span>
                            </div>

                            {/* Grouped List Background */}
                            <div className="bg-white dark:bg-[#191919]">
                                {chapterLessons.map((lesson, index) => {
                                    const isLessonCompleted = completedLessons.includes(lesson.id);
                                    const isLessonCurrent = currentLesson?.id === lesson.id;
                                    // Lock logic considering visual flow
                                    const isEffectiveLocked = isChapterLocked || (lesson.day > 1 && !isLessonCompleted && !isLessonCurrent && !completedLessons.includes(courseData.flatMap(c => c.lessons).find(l => l.day === lesson.day - 1)?.id || 'none'));

                                    return (
                                        <LessonCell
                                            key={lesson.id}
                                            lesson={lesson}
                                            isCompleted={isLessonCompleted}
                                            isCurrent={isLessonCurrent}
                                            isLocked={!!isEffectiveLocked}
                                            onClick={() => navigate(`/course/${lesson.id}`)}
                                            isLast={index === chapterLessons.length - 1}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 4. Footer Placeholder/Padding */}
            <div className="text-center py-6 text-[12px] text-gray-400 dark:text-gray-600">
                每一步都算数
            </div>

        </div>
    );
};
