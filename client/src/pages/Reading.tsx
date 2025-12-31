
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useProgress } from '@/hooks/useProgress';
import { courseData } from '@/data/courseData';
import { useTranslation } from '@/hooks/useTranslation';

export const Reading: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completedLessons, isLoading: isProgressLoading } = useProgress();
  
  const [scrolled, setScrolled] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({ 'c1': true, 'c2': false });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate total lessons and completed count
  const totalLessons = courseData.reduce((acc, chapter) => acc + chapter.lessons.length, 0);

  // Filter Logic
  const filteredChapters = courseData.map(chapter => {
      // If chapter title matches, return all lessons
      if (chapter.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return chapter;
      }
      // Otherwise, filter lessons
      const matchingLessons = chapter.lessons.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
      if (matchingLessons.length > 0) {
          return { ...chapter, lessons: matchingLessons };
      }
      return null;
  }).filter(Boolean);

  // Auto expand chapters when searching
  useEffect(() => {
      if (searchQuery) {
          const allExpanded: Record<string, boolean> = {};
          courseData.forEach(c => allExpanded[c.id] = true);
          setExpandedChapters(allExpanded);
      }
  }, [searchQuery]);

  if (isProgressLoading) return null;

  return (
    <div className="pb-24 animate-fade-in min-h-screen flex flex-col bg-[#F5F7F5] dark:bg-[#0A0A0A] font-sans">
      
      {/* Dynamic Header */}
      <header className={`sticky top-0 z-40 px-6 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50 dark:border-gray-800' : 'bg-transparent'}`}>
        {showSearch ? (
            <div className="flex-1 flex items-center gap-2 animate-fade-in">
                 <div className="flex-1 bg-white/50 dark:bg-white/10 rounded-full px-4 py-1.5 flex items-center border border-gray-100 dark:border-white/5">
                     <Icon name="search" className="text-gray-400 text-sm mr-2" />
                     <input 
                        autoFocus
                        type="text" 
                        placeholder={t('reading.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full text-text-main dark:text-white placeholder-gray-400"
                     />
                 </div>
                 <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-sm font-bold text-gray-500">{t('common.cancel')}</button>
             </div>
        ) : (
            <>
                <div className="w-10"></div>
                <h2 className={`text-lg font-display font-bold text-text-main dark:text-white transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>{t('reading.title')}</h2>
                <div className="flex gap-2">
                    <button 
                    onClick={() => setShowSearch(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                    >
                        <Icon name="search" className="text-text-main dark:text-white" />
                    </button>
                    <button 
                    onClick={() => navigate('/history')}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                    >
                        <Icon name="history" className="text-text-main dark:text-white" />
                    </button>
                </div>
            </>
        )}
      </header>

      {/* Zen Hero Card */}
      {!showSearch && (
        <div className="px-6 py-2 relative z-10 animate-fade-in">
            <h1 className="text-text-main dark:text-white font-display text-3xl font-bold leading-tight mb-6 pl-2 border-l-4 border-primary/50">{t('reading.title')}</h1>
            
            <div className="relative overflow-hidden bg-[#2C3E3E] dark:bg-[#1A1A1A] rounded-[32px] p-8 text-white shadow-xl shadow-[#2C3E3E]/20 group">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/40 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse"></div>
                <div className="size-16 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md relative z-10">
                    <Icon name="spa" className="text-3xl text-white drop-shadow-md" filled />
                </div>
                </div>
                
                <h3 className="text-2xl font-display font-medium mb-1 tracking-wide">{t('reading.hero.title')}</h3>
                <p className="text-white/60 text-xs font-light mb-6">{t('reading.hero.progress', { completed: completedLessons.length, total: totalLessons })}</p>
                
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-4 max-w-[180px]">
                <div className="h-full bg-gradient-to-r from-primary to-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${(completedLessons.length / Math.max(1, totalLessons)) * 100}%` }}></div>
                </div>
                
                <p className="text-white/80 text-[10px] font-medium tracking-[0.2em] uppercase opacity-60">
                {t('reading.hero.level', { level: 1 + Math.floor(completedLessons.length / 3) })}
                </p>
            </div>
            </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="flex-1 px-6 flex flex-col gap-8 mt-10 relative">
        {/* Continuous Line (Background) */}
        <div className="absolute top-6 bottom-10 left-[43px] w-[2px] bg-gray-200 dark:bg-gray-800"></div>
        {/* Active Gradient Line - dynamic height simulation */}
        <div className="absolute top-6 left-[43px] w-[2px] h-[220px] bg-gradient-to-b from-primary via-primary to-transparent z-0"></div>

        {filteredChapters.length > 0 ? (
            filteredChapters.map((chapter: any, cIndex: number) => {
            const isExpanded = expandedChapters[chapter.id];
            return (
                <div key={chapter.id} className="relative z-10">
                
                {/* Chapter Header */}
                <div 
                    onClick={() => toggleChapter(chapter.id)}
                    className="flex items-center gap-6 mb-6 cursor-pointer group"
                >
                    <div className={`size-9 rounded-full border-[3px] flex items-center justify-center text-xs font-bold shadow-sm z-10 transition-colors duration-300 ${
                    chapter.isLocked 
                        ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400' 
                        : 'bg-white dark:bg-black border-primary text-primary group-hover:scale-110 transform'
                    }`}>
                    {chapter.isLocked ? <Icon name="lock" className="text-[14px]" /> : `0${cIndex + 1}`}
                    </div>
                    <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h3 className={`text-lg font-bold font-display transition-colors ${chapter.isLocked ? 'text-gray-400' : 'text-text-main dark:text-white'}`}>{chapter.title}</h3>
                        <Icon name={isExpanded ? "expand_less" : "expand_more"} className="text-gray-300" />
                    </div>
                    {isExpanded && <p className="text-xs text-text-sub mt-1 animate-fade-in">{chapter.desc}</p>}
                    </div>
                </div>

                {/* Days List */}
                <div className={`pl-4 space-y-6 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {chapter.lessons.map((lesson: any, lIndex: number) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    
                    // Determine if locked
                    let isLocked = chapter.isLocked;
                    if (!isLocked && lIndex > 0) {
                        const prevLessonId = chapter.lessons[lIndex - 1].id;
                        if (!completedLessons.includes(prevLessonId)) isLocked = true;
                    }

                    // Force unlock if searching
                    if (searchQuery) isLocked = false;

                    const isCurrent = !isCompleted && !isLocked;

                    // Special Active Card Design (Current Task)
                    if (isCurrent && !isLocked && !searchQuery) {
                        return (
                            <div key={lesson.day} onClick={() => navigate(`/course/${lesson.day}`)} className="relative pl-10 pr-2 py-2">
                            {/* Pulsing Node */}
                            <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 z-20">
                                <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
                                <div className="relative size-6 rounded-full bg-primary border-4 border-white dark:border-[#0A0A0A] shadow-md flex items-center justify-center">
                                    <div className="size-1.5 bg-white rounded-full"></div>
                                </div>
                            </div>

                            {/* Active Card */}
                            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 shadow-lg shadow-primary/10 border-l-4 border-primary transform transition-all hover:scale-[1.02] cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Current Lesson</span>
                                    <span className="text-xs text-gray-400 font-mono">{lesson.duration}</span>
                                </div>
                                <h4 className="text-xl text-text-main dark:text-white font-display font-bold mb-4">{lesson.title}</h4>
                                <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                                    {t('reading.action.start')} <Icon name="arrow_forward" className="text-base" />
                                </button>
                            </div>
                            </div>
                        );
                    }

                    // Standard / Locked Card
                    return (
                        <div 
                            key={lesson.day} 
                            onClick={() => !isLocked && navigate(`/course/${lesson.day}`)}
                            className={`relative pl-10 pr-2 transition-all ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:translate-x-1'}`}
                        >
                            {/* Node */}
                            <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 size-4 rounded-full border-[3px] border-[#F5F7F5] dark:border-[#0A0A0A] z-20 ${
                            isCompleted ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                            }`}>
                            {isCompleted && <Icon name="check" className="text-[8px] text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                            </div>

                            <div className={`py-4 pr-4 border-b border-gray-100 dark:border-gray-800 ${isLocked ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-center">
                                <div className={`flex flex-col ${isLocked ? 'blur-[2px] select-none' : ''}`}>
                                    <h4 className="text-base text-text-main dark:text-white font-medium">{lesson.title}</h4>
                                    {!isLocked && <span className="text-xs text-gray-400 mt-1">Day {lesson.day}</span>}
                                </div>
                                <div className="flex items-center">
                                    {isLocked && <Icon name="lock" className="text-gray-300 text-sm" />}
                                    {isCompleted && <span className="text-xs text-primary font-bold">{t('reading.action.review')}</span>}
                                </div>
                            </div>
                            </div>
                        </div>
                    );
                    })}
                </div>
                </div>
            );
            })
        ) : (
            <div className="text-center py-20 text-gray-400">
                <Icon name="search_off" className="text-4xl mb-2 opacity-50" />
                <p>{t('community.empty_search')}</p>
            </div>
        )}
        
        {/* End of Journey Indicator */}
        {!searchQuery && (
            <div className="relative pl-10 py-8 opacity-50">
            <div className="absolute left-[39px] top-0 bottom-0 w-[2px] border-l-2 border-dashed border-gray-300 dark:border-gray-800"></div>
            <div className="absolute left-[-4px] top-8 size-4 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-[#F5F7F5] dark:bg-[#0A0A0A] z-20"></div>
            <p className="text-xs text-gray-400 italic">{t('reading.chapter.locked_desc')}</p>
            </div>
        )}
      </div>
    </div>
  );
};
