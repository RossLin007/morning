
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Image } from '@/components/ui/Image';
import { Partner } from '@/types';
import { useHaptics } from '@/hooks/useHaptics';
import { ASSETS } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';

interface DashboardHeaderProps {
  scrolled: boolean;
  isNight: boolean;
  profile: any;
  user: any;
  coins: number;
  buddy: Partner | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  scrolled, 
  isNight, 
  profile, 
  user, 
  coins, 
  buddy 
}) => {
  const navigate = useNavigate();
  const { trigger: haptic } = useHaptics();
  const { t } = useTranslation();

  // Contextual Greeting Logic
  const hour = new Date().getHours();
  let greetingKey = 'dashboard.greeting_morning';
  let quoteKey = 'dashboard.quote_default';

  if (hour < 10) {
      greetingKey = 'dashboard.greeting_morning';
      quoteKey = 'dashboard.quote_morning';
  } else if (hour < 14) {
      greetingKey = 'dashboard.greeting_afternoon';
  } else if (hour < 19) {
      greetingKey = 'dashboard.greeting_evening';
  } else {
      greetingKey = 'dashboard.greeting_late';
      if (isNight) quoteKey = 'dashboard.quote_night';
  }

  const handlePartnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic('light');
    navigate('/relationships');
  };

  const handleCoinClick = () => {
      haptic('medium');
      navigate('/shop');
  };

  return (
    <div className={`sticky top-0 z-40 flex items-center justify-between px-6 py-4 transition-all duration-500 ${scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
      <div className="flex flex-col">
         <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase mb-1 opacity-80">{t('dashboard.subtitle')}</span>
         <h2 className={`text-text-main dark:text-white font-display font-medium transition-all duration-500 ${scrolled ? 'text-lg' : 'text-2xl'}`}>
            {t(greetingKey)}，{profile?.name || user?.email?.split('@')[0] || '书友'}
         </h2>
         {!scrolled && <span className="text-xs text-gray-400 mt-1">{t(quoteKey)}</span>}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Zen Coins Display */}
        <div 
           onClick={handleCoinClick}
           className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-full cursor-pointer hover:bg-yellow-500/20 transition-colors"
        >
           <Icon name="monetization_on" className="text-yellow-500 text-sm" filled />
           <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{coins}</span>
        </div>

        {/* Partner Orb */}
        {buddy ? (
          <div 
            onClick={handlePartnerClick}
            className={`relative flex items-center bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-full pl-1 pr-3 py-1 cursor-pointer transition-all duration-300 border border-white/20 hover:bg-white/60 dark:hover:bg-white/10`}
          >
             <div className="relative">
                <Image 
                  src={buddy.avatar} 
                  className="size-8 rounded-full border border-white dark:border-gray-700 object-cover" 
                  containerClassName="size-8 rounded-full"
                  alt="Partner" 
                />
                
                {buddy.status === 'reading' && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 border border-white dark:border-black rounded-full animate-pulse"></span>
                )}
                
                {!buddy.wateredToday && (
                    <div className="absolute -top-1 -right-1 size-3.5 bg-blue-500 rounded-full border border-white dark:border-black flex items-center justify-center animate-bounce">
                        <Icon name="water_drop" className="text-[8px] text-white" filled />
                    </div>
                )}
             </div>
             <div className="ml-2 flex flex-col">
                <span className="text-[10px] font-bold text-text-main dark:text-white leading-none mb-0.5 max-w-[60px] truncate">{buddy.name}</span>
                <span className={`text-[8px] font-medium leading-none ${!buddy.wateredToday ? 'text-blue-500' : 'text-primary'}`}>
                  {!buddy.wateredToday ? t('dashboard.partner_water_needed') : t('dashboard.partner_watered')}
                </span>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/match')}
            className="relative flex items-center justify-center size-10 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/60 dark:hover:bg-white/10 group"
          >
            <Icon name="person_add" className="text-gray-500 dark:text-gray-300 text-lg group-hover:text-primary transition-colors" />
          </button>
        )}

        {/* Profile Avatar */}
        <div 
          onClick={() => navigate('/profile')}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
          <div className="relative size-10 rounded-full border-2 border-white dark:border-gray-800 shadow-md transition-transform group-hover:scale-105 overflow-hidden">
              <Image 
                  src={profile?.avatar || ASSETS.DEFAULT_AVATAR}
                  className="w-full h-full object-cover"
                  alt="Me"
              />
          </div>
        </div>
      </div>
    </div>
  );
};
