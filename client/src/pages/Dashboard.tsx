
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { Icon } from '@/components/ui/Icon';
import { Image } from '@/components/ui/Image'; 
import { Announcement, Partner } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useHaptics } from '@/hooks/useHaptics';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useProfile } from '@/hooks/useProfile'; 
import { usePartner } from '@/hooks/usePartner';
import { useProgress } from '@/hooks/useProgress';
import { useTranslation } from '@/hooks/useTranslation';
import { DashboardHeader } from '@/components/business/dashboard/DashboardHeader';
import { QuickActions } from '@/components/business/dashboard/QuickActions';
import { Announcements } from '@/components/business/dashboard/Announcements';

const announcementsData: Announcement[] = [
  {
    id: 'a1',
    title: '晨间冥想',
    content: '明早 6:30，不仅有答疑，我们还将一起进行5分钟的静心冥想。',
    time: '10分钟前',
    type: 'live',
  },
];

const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col gap-6 px-6 pt-20">
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-[24px]"></div>
      <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-[32px]"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
  </div>
);

const SocialTicker = () => {
    const { t } = useTranslation();
    
    // Dynamic messages using translation templates
    const msgs = [
        t('dashboard.social_ticker.checkin', { name: 'Alex', day: 5 }),
        t('dashboard.social_ticker.join', { name: 'Sarah' }),
        t('dashboard.social_ticker.badge', { name: 'David', badge: '晨起鸟' }),
        t('dashboard.social_ticker.focus', { name: 'Momo' })
    ];
    
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setIdx(i => (i + 1) % msgs.length), 4000);
        return () => clearInterval(timer);
    }, [msgs.length]);
    return (
        <div className="fixed bottom-[70px] md:bottom-[90px] left-0 right-0 flex justify-center pointer-events-none z-30">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/90 animate-fade-in transition-all duration-500 transform translate-y-0">
               🔔 {msgs[idx]}
            </div>
        </div>
    )
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { streak, coins } = useGamification(); 
  const { trigger: haptic } = useHaptics();
  const { t } = useTranslation();
  
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { partner: buddy } = usePartner('buddy');
  const { completedLessons, isLoading: isProgressLoading } = useProgress();
  
  const [scrolled, setScrolled] = useState(false);

  // Contextual Data for Background
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 5;

  // Calculate Progress
  const totalDays = 21;
  const currentProgress = Math.min(100, Math.round((completedLessons.length / totalDays) * 100));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if ((isProfileLoading && !profile) || isProgressLoading) return <SkeletonLoader />;

  return (
    <div className={`pb-24 md:pb-32 animate-fade-in min-h-screen relative font-sans transition-colors duration-1000 ${isNight ? 'bg-[#0F1014] text-gray-200' : 'bg-[#F5F7F5] dark:bg-[#0A0A0A]'}`}>
      
      <SocialTicker />

      {/* 1. Mist & Glimmer Background (Dynamic based on time) */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none z-0 overflow-hidden">
          <div className={`absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-60 transition-colors duration-1000 ${isNight ? 'bg-indigo-900/20' : 'bg-primary/10'}`}></div>
          <div className={`absolute top-[10%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-40 transition-colors duration-1000 ${isNight ? 'bg-purple-900/20' : 'bg-accent/5'}`}></div>
      </div>

      {/* Header */}
      <DashboardHeader 
        scrolled={scrolled}
        isNight={isNight}
        profile={profile}
        user={user}
        coins={coins}
        buddy={buddy || null}
      />

      {/* Main Content Grid for Desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-6 md:px-6">
        
        {/* Left Column */}
        <div className="space-y-6">
            {/* 2. Zen Quote - "Parchment" Style */}
            <div className="px-6 md:px-0 mt-4 relative z-10">
                <div className="relative bg-[#FFFDF9] dark:bg-[#151515] p-8 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-stone-100 dark:border-stone-800 overflow-hidden group hover:shadow-[0_8px_40px_rgba(212,163,115,0.1)] transition-all duration-500">
                {/* Subtle Texture */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply dark:mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full opacity-60 transition-opacity group-hover:opacity-100"></div>
                
                <Icon name="format_quote" className="text-accent/60 text-5xl absolute top-6 left-6" />
                
                <div className="relative z-10 text-center mt-4">
                    <p className="text-lg md:text-xl text-text-main dark:text-gray-200 font-display leading-loose italic opacity-90">
                    "{t('dashboard.zen_quote.content')}"
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-8">
                    <div className="h-[1px] w-12 bg-accent/40"></div>
                    <p className="text-[10px] text-text-sub font-bold tracking-[0.2em] uppercase text-accent">{t('dashboard.zen_quote.author')}</p>
                    <div className="h-[1px] w-12 bg-accent/40"></div>
                    </div>
                </div>
                </div>
            </div>

            {/* 3. Hero Task - "Deep Focus" Card */}
            <div className="px-6 md:px-0 mt-10 md:mt-0 relative z-10">
                <div className="flex justify-between items-end mb-5 px-2">
                <h3 className="text-text-main dark:text-white text-lg font-bold font-display flex items-center gap-2">
                    {t('dashboard.todays_practice')}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">{t('dashboard.practice_time')}</span>
                </div>
                
                <div 
                onClick={() => { haptic('light'); navigate('/course/1'); }}
                className="group relative w-full aspect-[16/9] md:aspect-[2/1] rounded-[32px] overflow-hidden shadow-xl shadow-primary/10 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
                >
                <div className="absolute inset-0 bg-gray-900">
                    <Image 
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-80 transition-transform duration-[5s] group-hover:scale-105"
                        alt="Course Cover"
                        priority={true} // High Priority for LCP
                    />
                </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F1F] via-[#0A1F1F]/40 to-transparent opacity-90"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] text-white font-bold tracking-widest uppercase">
                            {t('dashboard.hero_course.tag')}
                        </span>
                        {/* Play Button - Subtle */}
                        <div className="size-10 rounded-full border border-white/30 flex items-center justify-center text-white bg-white/5 backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-all duration-300">
                            <Icon name="play_arrow" className="text-xl" filled />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-2xl text-white font-display font-bold tracking-wide mb-2 text-shadow-sm">{t('dashboard.hero_course.title')}</h4>
                        <div className="flex items-center gap-3">
                            <div className="h-1 w-12 bg-primary rounded-full"></div>
                            <p className="text-gray-300 text-xs font-medium tracking-wide">{t('dashboard.hero_course.subtitle')}</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
            {/* Progress Card */}
            <div className="px-6 md:px-0 mt-10 md:mt-4 relative z-10">
                <div className="bg-white dark:bg-[#151515] rounded-3xl p-6 border border-gray-50 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{t('dashboard.streak_title')}</span>
                        <p className="text-2xl font-display font-bold text-text-main dark:text-white mt-1">Day {streak} <span className="text-sm text-gray-300 font-sans font-normal">/ {totalDays}</span></p>
                    </div>
                    
                    {/* Circular Progress */}
                    <div className="relative size-12 flex items-center justify-center">
                        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                            <path className="text-gray-100 dark:text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-primary" strokeDasharray={`${currentProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span className="text-[10px] font-bold text-primary">{currentProgress}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Icon name="local_fire_department" className="text-orange-400 text-sm" />
                    <p className="text-text-sub dark:text-gray-400 text-xs" dangerouslySetInnerHTML={{ __html: t('dashboard.streak_desc', { days: streak }) }}></p>
                </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 md:px-0 mt-8 md:mt-0 relative z-10">
                <QuickActions />
            </div>

            {/* Announcements */}
            <div className="px-6 md:px-0 mt-10 md:mt-6 mb-6">
                <Announcements data={announcementsData} />
            </div>
        </div>
      </div>
    </div>
  );
};
