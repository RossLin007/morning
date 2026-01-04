
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { getLessonById } from '@/data/courseData';
import ReactMarkdown from 'react-markdown';
import { useHaptics } from '@/hooks/useHaptics';
import { QuoteShareModal } from '@/components/business/QuoteShareModal';
import { NavBar } from '@/components/layout/NavBar';

export const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { markLessonComplete, isLessonCompleted } = useProgress();
    const { trigger: haptic } = useHaptics();

    // State
    const [isPlaying, setIsPlaying] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false);

    const lesson = getLessonById(id);
    const isCompleted = isLessonCompleted(id || '');

    // Scroll listener for header effect
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const maxScroll = 300;
            const progress = Math.min(scrolled / maxScroll, 1);
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">课程未找到</p>
            </div>
        );
    }

    const handleComplete = async () => {
        if (!lesson.id) return;
        haptic('heavy');
        await markLessonComplete(lesson.id);
        navigate('/reading'); // Or show celebration logic
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pb-32 relative font-sans">


            {/* 1. Immersive Header */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
                    style={{ backgroundImage: `url(${lesson.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0A] via-transparent to-black/30"></div>

                {/* Navbar */}
                <NavBar
                    className={`transition-all duration-300 ${scrollProgress > 0.8 ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm' : 'bg-transparent border-transparent'}`}
                    showBack={false}
                    left={
                        <button
                            onClick={() => navigate(-1)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${scrollProgress > 0.8 ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'bg-black/20 backdrop-blur-md text-white'}`}
                        >
                            <Icon name="arrow_back" />
                        </button>
                    }
                    right={
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${scrollProgress > 0.8 ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'bg-black/20 backdrop-blur-md text-white'}`}
                            >
                                <Icon name="ios_share" />
                            </button>
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center ${scrollProgress > 0.8 ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'bg-black/20 backdrop-blur-md text-white'}`}>
                                <Icon name="text_fields" />
                            </button>
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center ${scrollProgress > 0.8 ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'bg-black/20 backdrop-blur-md text-white'}`}>
                                <Icon name="dark_mode" />
                            </button>
                        </div>
                    }
                />

                {/* Header Content */}
                <div className="absolute bottom-16 left-6 right-6">
                    <span className="inline-block px-3 py-1 bg-[#F4B942] text-black text-xs font-bold rounded-md tracking-wider mb-4">
                        DAY {lesson.day < 10 ? `0${lesson.day}` : lesson.day}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-text-main dark:text-white mb-2 leading-tight drop-shadow-sm">
                        {lesson.title.includes('：') ? lesson.title.split('：')[1] : lesson.title}
                    </h1>
                    <div className="flex items-center gap-2 text-text-main/80 dark:text-gray-300 text-sm">
                        <Icon name="schedule" className="text-base" />
                        <span>预计阅读 {lesson.duration}</span>
                    </div>
                </div>
            </div>

            {/* 2. Floating Audio Player */}
            <div className="-mt-10 px-6 relative z-20">
                <div className="bg-white dark:bg-[#151515] rounded-[24px] p-4 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-[#F4B942] text-black' : 'bg-[#6B8E8E] text-white'}`}
                    >
                        <Icon name={isPlaying ? "pause" : "play_arrow"} className="text-2xl" />
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-text-main dark:text-white mb-1">{lesson.title}</p>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#6B8E8E] w-1/3 rounded-full"></div>
                        </div>
                    </div>
                    <span className="text-xs text-text-sub dark:text-gray-500 font-mono">15:00</span>
                </div>
            </div>

            {/* 3. Content Body */}
            <div className="px-6 py-8 space-y-8">

                {/* Key Points */}
                {lesson.points && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Icon name="psychology_alt" className="text-[#6B8E8E]" />
                            <h2 className="text-lg font-bold font-serif text-text-main dark:text-white">本课要点</h2>
                        </div>
                        <div className="bg-[#FFFBF0] dark:bg-yellow-900/10 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-900/20 space-y-4">
                            {lesson.points.map((point, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="mt-0.5 text-[#D9A42F]">
                                        <Icon name={point.icon} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#8C6B1F] dark:text-[#E6C670] text-sm mb-1">{point.title}</h3>
                                        <p className="text-sm text-[#8C6B1F]/80 dark:text-[#E6C670]/80 leading-relaxed">{point.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quote */}
                {lesson.quote && (
                    <div className="relative py-6 px-4 bg-gray-50 dark:bg-[#121212] rounded-2xl group">
                        <Icon name="format_quote" className="text-4xl text-gray-200 dark:text-gray-700 absolute top-2 left-2" />
                        <div className="relative z-10 pl-6 border-l-2 border-gray-300 dark:border-gray-700">
                            <p className="text-lg font-serif italic text-text-main dark:text-gray-300 leading-relaxed mb-3">
                                {lesson.quote.text}
                            </p>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold text-primary">— {lesson.quote.author}</p>
                                {/* Inline Share Button */}
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="text-xs flex items-center gap-1 text-text-sub hover:text-primary transition-colors bg-white dark:bg-black px-2 py-1 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm"
                                >
                                    <Icon name="ios_share" className="text-xs" /> 分享
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Main Markdown Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown
                        components={{
                            h3: ({ node, ...props }) => (
                                <div className="mt-12 mb-6 flex items-center gap-4">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-700"></div>
                                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[#6B8E8E] dark:text-[#8AAFAF] m-0 px-4 py-2 bg-[#F0F7F7] dark:bg-[#1A2E2E] rounded-full tracking-wide">
                                        {props.children}
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gray-200 dark:to-gray-700"></div>
                                </div>
                            ),
                            p: ({ node, ...props }) => (
                                <p className="text-gray-700 dark:text-gray-300 leading-8 text-[17px] tracking-wide mb-6 text-justify">
                                    {props.children}
                                </p>
                            ),
                            ol: ({ node, ...props }) => (
                                <ol className="space-y-6 list-none p-0 m-0">
                                    {props.children}
                                </ol>
                            ),
                            li: ({ node, ...props }) => {
                                // Checking if it's an ordered list item to apply number styling
                                // ReactMarkdown separates the numbering logic, but standard <li> inside <ol> works
                                return (
                                    <li className="relative pl-0">
                                        <div className="flex gap-4 items-start group hover:bg-[#F9FAFA] dark:hover:bg-[#121212] p-2 rounded-xl transition-colors -mx-2">
                                            {/* Number Badge */}
                                            {/* Note: Getting exact index in ReactMarkdown can be tricky, relying on CSS counters or passed props depends on version.
                                                Simpler approach: Let standard styling handle it or use specific class. 
                                                Actually, 'list-decimal' is standard. 
                                                To do custom "Paragraph Numbering" style requested:
                                            */}
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E8F2F2] dark:bg-[#1C2C2C] text-[#6B8E8E] dark:text-[#8AAFAF] font-serif font-bold italic flex items-center justify-center text-lg mt-0.5 border border-[#6B8E8E]/20">
                                                •
                                            </span>
                                            <div className="flex-1 text-gray-800 dark:text-gray-200 leading-8 text-[17px] tracking-wide text-justify">
                                                {props.children}
                                            </div>
                                        </div>
                                    </li>
                                );
                            },
                            strong: ({ node, ...props }) => (
                                <strong className="font-bold text-[#2C3E50] dark:text-white bg-yellow-100/50 dark:bg-yellow-900/30 px-1 rounded mx-0.5 box-decoration-clone">
                                    {props.children}
                                </strong>
                            ),
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-[#F4B942] pl-4 py-2 italic text-gray-600 dark:text-gray-400 my-6 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
                                    {props.children}
                                </blockquote>
                            )
                        }}
                    >
                        {lesson.content}
                    </ReactMarkdown>
                </div>

            </div >

            {/* 4. Sticky Footer */}
            < div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 z-40 md:pl-64" >
                {/* Note: md:pl-64 handles sidebar on desktop if sidebar exists, simplified here for mobile focus */}
                < div className="max-w-lg mx-auto flex items-center gap-4" >
                    <div className="hidden md:block">
                        <p className="text-xs text-text-sub">今日任务</p>
                        <p className="text-sm font-bold text-text-main dark:text-white">阅读并打卡</p>
                    </div>
                    <button
                        onClick={handleComplete}
                        disabled={isCompleted}
                        className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-bold text-white transition-all ${isCompleted ? 'bg-green-600/50 cursor-not-allowed' : 'bg-[#6B8E8E] hover:bg-[#5A7A7A] active:scale-95'}`}
                    >
                        {isCompleted ? (
                            <>
                                <Icon name="check_circle" />
                                <span>已完成打卡</span>
                            </>
                        ) : (
                            <>
                                <Icon name="check_circle" />
                                <span>完成打卡</span>
                            </>
                        )}
                    </button>
                </div >
            </div >

            <QuoteShareModal
                visible={showShareModal}
                onClose={() => setShowShareModal(false)}
                lesson={lesson}
                user={{ nickname: (user as any)?.user_metadata?.name || (user as any)?.email, avatar_url: (user as any)?.user_metadata?.avatar }}
            />

        </div >
    );
};
