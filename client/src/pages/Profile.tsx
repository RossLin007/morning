
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Image } from '@/components/ui/Image';
import { RadarChart } from '@/components/business/RadarChart';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext'; 
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/contexts/ToastContext';
import { ASSETS } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { showToast } = useToast();
  const { xp, level, coins, streak } = useGamification(); 
  const { t } = useTranslation();
  
  const { profile, isLoading } = useProfile();
  
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Local fallbacks
  const [completedLessons] = useLocalStorage<string[]>('mr_learning_progress', []);
  const [isVip] = useLocalStorage<boolean>('mr_is_vip', false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userName = profile?.name || user?.user_metadata?.name || 'Loading...';
  const userAvatar = profile?.avatar || user?.user_metadata?.avatar || ASSETS.DEFAULT_AVATAR;
  const userBio = profile?.bio || t('profile.no_bio');
  
  const currentLevel = level;
  const badgesCount = Math.min(5, Math.floor(completedLessons.length / 2)); 
  const totalMinutes = completedLessons.length * 15;

  // --- Calculate Radar Stats (0-100) ---
  const stats = [
      Math.min(streak * 5, 100), // Grit
      Math.min(xp / 10, 100),    // Wisdom
      Math.min(badgesCount * 20, 100), // Insight
      Math.min(coins, 100),      // Influence
      Math.min(totalMinutes / 6, 100), // Focus
  ];
  
  // Radar Labels from i18n
  const radarLabels = [
      t('profile.radar.grit'),
      t('profile.radar.wisdom'),
      t('profile.radar.insight'),
      t('profile.radar.influence'),
      t('profile.radar.focus')
  ];

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
      await signOut();
      showToast(t('profile.toast.logout'), "success");
      setTimeout(() => navigate('/login'), 500);
  };

  if (isLoading && !profile) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#F5F7F5] dark:bg-black">
              <Icon name="spa" className="animate-pulse text-primary text-3xl" filled />
          </div>
      );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-[#F5F7F5] dark:bg-black font-sans">
      
      {/* Immersive Header Background */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#E6EBEB] to-[#F5F7F5] dark:from-[#1C2222] dark:to-black pointer-events-none z-0"></div>
      
      {/* Sticky Top Bar */}
      <header className={`sticky top-0 z-40 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        <div className="w-10 h-10"></div>
        <h1 className={`text-lg font-bold text-text-main dark:text-white transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>{t('profile.title')}</h1>
        <button 
            onClick={() => navigate('/settings')}
            className="flex size-10 items-center justify-center rounded-full text-text-main dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            aria-label={t('common.settings')}
        >
          <Icon name="settings" />
        </button>
      </header>

      {/* Profile Info */}
      <section className="relative z-10 px-6 mt-2 flex flex-col items-center animate-fade-in-up">
        
        {/* Avatar with Edit Trigger */}
        <div className="relative group cursor-pointer" onClick={() => navigate('/profile/edit')}>
          <div className={`absolute inset-0 rounded-full blur-xl transition-all opacity-50 ${isVip ? 'bg-yellow-500/40 group-hover:blur-2xl' : 'bg-primary/20'}`}></div>
          <div className={`relative size-28 rounded-full p-1 shadow-xl ${isVip ? 'bg-gradient-to-br from-yellow-300 to-yellow-600' : 'bg-white dark:bg-[#1A1A1A]'}`}>
             <Image 
                src={userAvatar} 
                alt={userName}
                className="h-full w-full object-cover rounded-full border-2 border-white dark:border-[#1A1A1A]" 
                containerClassName="h-full w-full rounded-full"
              />
          </div>
          
          {/* Edit Badge */}
          <div className="absolute bottom-0 right-0 p-2 bg-white dark:bg-[#2C2C2E] rounded-full shadow-md border border-gray-100 dark:border-gray-700 z-20 text-gray-500 dark:text-gray-300 hover:text-primary transition-colors">
             <Icon name="edit" className="text-xs" />
          </div>

          {/* VIP Badge */}
          {isVip && (
             <div className="absolute -top-2 -right-2 bg-black text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500 flex items-center gap-1 shadow-md z-20">
                <Icon name="diamond" className="text-[10px]" filled /> PRO
             </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          {/* Name */}
          <div onClick={() => navigate('/profile/edit')} className="flex flex-col items-center cursor-pointer group">
            <h2 className={`text-2xl font-display font-bold flex items-center gap-2 ${isVip ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400' : 'text-text-main dark:text-white'}`}>
                {userName}
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">{userBio}</p>
          </div>

          <div className="flex items-center justify-center gap-3 mt-3">
             <p className="text-sm text-text-sub dark:text-gray-400 flex items-center gap-1 bg-white/50 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800">
                <Icon name="workspace_premium" className={isVip ? 'text-yellow-500' : 'text-accent text-sm'} />
                {t('profile.level', { level: currentLevel })}
             </p>
             <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1 font-bold bg-yellow-50 dark:bg-yellow-900/10 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/20">
                <Icon name="monetization_on" className="text-sm" filled />
                {coins}
             </p>
          </div>
        </div>

        {/* Componentized Radar Chart */}
        <div className="mt-8 mb-4">
            <RadarChart stats={stats} color={isVip ? '#EAB308' : '#6B8E8E'} labels={radarLabels} />
        </div>

      </section>

      {/* Menu Sections */}
      <div className="flex flex-col gap-6 relative z-10 px-6 mt-4 md:grid md:grid-cols-2">
        
        {/* VIP Banner */}
        <div 
          onClick={() => navigate('/membership')}
          className={`md:col-span-2 w-full rounded-2xl p-4 flex items-center justify-between cursor-pointer group relative overflow-hidden ${isVip ? 'bg-[#1a1a1a] border border-yellow-900/50' : 'bg-gradient-to-r from-[#1A1A1A] to-[#2C2C2E] shadow-xl'}`}
        >
           {/* Shine Effect */}
           <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]"></div>

           <div className="flex items-center gap-4 relative z-10">
               <div className={`size-12 rounded-full flex items-center justify-center ${isVip ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-yellow-400'}`}>
                  <Icon name="diamond" className="text-2xl" filled={isVip} />
               </div>
               <div>
                  <h3 className={`text-base font-bold ${isVip ? 'text-yellow-500' : 'text-white'}`}>
                      {isVip ? t('profile.vip.active_title') : t('profile.vip.inactive_title')}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                      {isVip ? t('profile.vip.active_desc') : t('profile.vip.inactive_desc')}
                  </p>
               </div>
           </div>
           <div className="bg-white/10 rounded-full p-1 text-gray-300 group-hover:bg-white/20 transition-colors relative z-10">
              <Icon name="chevron_right" />
           </div>
        </div>

        {/* Learning */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="px-1 text-xs font-bold text-text-sub dark:text-gray-500 uppercase tracking-widest mb-3">{t('profile.sections.learning')}</h3>
          <div className="flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#1A1A1A] shadow-soft dark:shadow-none border border-white dark:border-gray-800">
            {[
              { icon: 'bar_chart', title: t('profile.menu.report'), subtitle: t('profile.menu.report_desc'), action: () => navigate('/report'), color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { icon: 'diversity_3', title: t('profile.menu.relationships'), subtitle: t('profile.menu.relationships_desc', { count: 1 }), action: () => navigate('/relationships'), color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
              { icon: 'military_tech', title: t('profile.menu.certificates'), subtitle: t('profile.menu.certificates_desc', { count: badgesCount }), action: () => navigate('/achievements'), color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
            ].map((item, idx) => (
              <button key={item.title} onClick={item.action} className={`flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5 active:bg-gray-100 ${idx !== 2 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                  <Icon name={item.icon} />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <span className="text-sm font-bold text-text-main dark:text-white">{item.title}</span>
                  {item.subtitle && <span className="text-xs text-text-sub dark:text-gray-400">{item.subtitle}</span>}
                </div>
                <Icon name="chevron_right" className="text-gray-300 text-sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="px-1 text-xs font-bold text-text-sub dark:text-gray-500 uppercase tracking-widest mb-3">{t('profile.sections.settings')}</h3>
          <div className="flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#1A1A1A] shadow-soft dark:shadow-none border border-white dark:border-gray-800">
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="flex w-full items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-50 dark:border-gray-800"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
                <Icon name="dark_mode" />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <span className="text-sm font-bold text-text-main dark:text-white">{t('profile.menu.dark_mode')}</span>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`}></span>
              </div>
            </button>

            <button 
              onClick={() => showToast(t('profile.toast.reminder_saved'))}
              className="flex w-full items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
                <Icon name="notifications_active" />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <span className="text-sm font-bold text-text-main dark:text-white">{t('profile.menu.daily_reminder')}</span>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition translate-x-6"></span>
              </div>
            </button>
          </div>
        </div>

        {user && (
            <button 
            onClick={handleLogout}
            className="md:col-span-2 w-full rounded-2xl py-4 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mb-4 border border-transparent hover:border-red-100 dark:hover:border-red-900"
            >
            {t('profile.menu.logout')}
            </button>
        )}
        <p className="md:col-span-2 text-center text-[10px] text-gray-300 mb-8 font-mono">v2.3.1 Build</p>
      </div>
    </div>
  );
};
