
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/types';
import { useProgress } from '@/hooks/useProgress';
import { useAchievements } from '@/hooks/useAchievements';

const baseBadges: Badge[] = [
  { id: 'b1', name: '初出茅庐', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy-w5py5ErMMk--TYTqz1yuBfwxPyxd8hm4D14F2pApPZh4YiD4Q9r43d63PcCstLdUrb5D_L8I7ZVxC9f6smmRTzd9PYgjJJ7VRyX4XCECFVDGGoWnHcsNdKydLx6PiM-TZjv1fzOm3EiznFL9sNQfwHdYHBnUGvKWWBYKpxc-366_gatXpOwJlUllUCqRnrXMRHdGPxJ3rOty4VVmlpfUxq2BTsbXUzy82iR21MnWFoct-1BjK5QCVCRdARNHP_c-BwssdcHHUs', description: '完成 1 节课程', isUnlocked: false, colorTheme: 'yellow' },
  { id: 'b2', name: '习惯养成', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc0oHkbP1tUc6GsKMprQ6JQ7u3nNvRyMX4yJhYL5toDVFhLW3fgEi155DoFy4D7KzEd8zZnuYXjOprgLxq47QcbQcVZQdjO35JzmgzE0JcrYwQh0-qxe6af1tPPCKAji6lt1VHWL5H4UwDGEKkNvPVg0Djw8G5mp7ZNIJ5_FAMs0XqvaQu3tkuLBOo1jl87JPseW7hlJzqmrLYwhxfk2SQQu9ejZNGWSDxYNSo_JXNQ_SKc_AIrWfDwh46re3OEhYNWzLhx0i6yIY', description: '完成 3 节课程', isUnlocked: false, colorTheme: 'blue' },
  { id: 'b3', name: '晨起鸟', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU0WYt5aJBbWRxE1VBYdtNdiaPZi-bLpCF4o0DmGAlRefFzUNagvrIQYKV3EOSn8yzXMNDsq2qHwMJGsr3HmT6ojezYwaqczBiXfDqoZPeC5b1UC0V2EZmG2J-j30nQWbmAOn7VrAXNEpNxh3aR7op6XB6L8NrTgjCx9txXmrK_kC2i4GlV_GicesP5CpBI3RTJR_9IOg1hA1fe_wm7zm0H60Jo9w4u6ugEGkr1bUlpufhkV7bDQCkfFuojlJ6_M4WYh3ksYkQJRI', description: 'Early Bird', isUnlocked: true, colorTheme: 'green' }, 
  { id: 'b4', name: '笔记达人', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl1_0jgkrRTYKTWtnlADNecqqt6U7jdfM5Va-piKEEL-O1yUP5NPcEEF4_bUX8DoggX1We6AEbbs7oU_TbBP6faKRTHu6BSGKRFHNrmDb6RYU_SENKQFTvnb7UWTu2OzyRsIIfUxWpXfZiG6bu2dSY3HHwbQpBx9eMXS4_Ricu1UHBgd2yREU4ErwC-WCHGcqbOMRgssEpEZ6jsQFwhmf6khniIs66v6iuCx-9zBPW6K_B9t4CCXe_IxAGzojkEDolGzjr6vhnBrE', description: '发布 1 篇笔记', isUnlocked: false, colorTheme: 'purple' },
  { id: 'b5', name: '习惯大师', icon: 'lock', description: '完成 10 节课程', isUnlocked: false, colorTheme: 'gray' },
  { id: 'b6', name: '全勤之王', icon: 'lock', description: '连续打卡 7 天', isUnlocked: false, colorTheme: 'gray' },
];

export const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  // Real Data from hooks
  const { completedLessons, isLoading: isProgressLoading } = useProgress();
  const { unlockedBadges, unlockBadge, isLoading: isAchLoading } = useAchievements();

  // Calculate Badges State
  const badges = baseBadges.map(badge => {
     // Check if remote says it's unlocked
     let unlocked = unlockedBadges.some((ub: any) => ub.achievement_id === badge.id) || badge.isUnlocked;
     
     // Local calculation rules (Real-time detection)
     if (!unlocked) {
        if (badge.id === 'b1' && completedLessons.length >= 1) unlocked = true;
        if (badge.id === 'b2' && completedLessons.length >= 3) unlocked = true;
        if (badge.id === 'b5' && completedLessons.length >= 10) unlocked = true;
        
        // If detected as unlocked locally but not on remote, sync it!
        if (unlocked) {
            unlockBadge(badge.id);
        }
     }
     
     return { ...badge, isUnlocked: unlocked };
  });

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const totalMinutes = completedLessons.length * 15;

  if (isProgressLoading || isAchLoading) return null;

  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-[#F5F7F5] dark:bg-[#0A0A0A] font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-fade-in-up">
          {toast}
        </div>
      )}

      {/* 1. Gallery Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <Icon name="arrow_back" className="text-text-main dark:text-white" />
        </button>
        <span className="text-sm font-bold tracking-[0.2em] uppercase text-text-main dark:text-white">Collection</span>
        <div className="w-10"></div>
      </header>

      <main className="px-6 pt-6">
        
        {/* 2. User Stats - "Ticket Stub" Style */}
        <section className="relative bg-white dark:bg-[#151515] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden">
          {/* Decorative perforations */}
          <div className="absolute top-0 bottom-0 left-[70%] w-[1px] border-l-2 border-dashed border-gray-200 dark:border-gray-700"></div>
          <div className="absolute -top-3 left-[70%] w-6 h-6 bg-[#F5F7F5] dark:bg-[#0A0A0A] rounded-full -translate-x-1/2"></div>
          <div className="absolute -bottom-3 left-[70%] w-6 h-6 bg-[#F5F7F5] dark:bg-[#0A0A0A] rounded-full -translate-x-1/2"></div>
          
          <div className="flex relative z-10">
             <div className="flex-1 pr-6">
                <h1 className="text-xl font-display font-bold text-text-main dark:text-white mb-1">Explorer</h1>
                <p className="text-xs text-gray-400 mb-6">Lv.{1 + Math.floor(completedLessons.length/3)} • 12 Days Active</p>
                <div className="flex gap-4">
                   <div>
                      <p className="text-2xl font-bold font-display text-primary">{unlockedCount}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Badges</p>
                   </div>
                   <div>
                      <p className="text-2xl font-bold font-display text-text-main dark:text-white">{totalMinutes}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Minutes</p>
                   </div>
                </div>
             </div>
             <div className="w-[30%] flex flex-col items-center justify-center pl-4">
                <Icon name="qr_code_2" className="text-6xl text-gray-300 dark:text-gray-700 opacity-50" />
             </div>
          </div>
        </section>

        {/* 3. The Shelf (Badge Display) */}
        <section>
          <div className="flex items-center gap-2 mb-6">
             <Icon name="diamond" className="text-primary text-sm" filled />
             <h3 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Artifacts</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-y-12 gap-x-4">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className="group flex flex-col items-center relative"
                onClick={() => handleBadgeClick(badge)}
              >
                 {/* Spotlight Effect */}
                 {badge.isUnlocked && <div className="absolute top-0 w-20 h-20 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>}
                 
                 {/* The Badge */}
                 <div className={`relative w-20 h-20 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2 ${badge.isUnlocked ? 'cursor-pointer' : 'opacity-40 grayscale'}`}>
                    {badge.isUnlocked ? (
                       <img className="w-16 h-16 object-contain drop-shadow-2xl" src={badge.icon} alt={badge.name} />
                    ) : (
                       <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Icon name="lock" className="text-gray-300" />
                       </div>
                    )}
                 </div>
                 
                 {/* Glass Shelf Base */}
                 <div className="w-full h-3 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mt-2 rounded-[100%] opacity-50 blur-[1px]"></div>
                 
                 <span className={`text-xs font-bold mt-3 transition-colors ${badge.isUnlocked ? 'text-text-main dark:text-white' : 'text-gray-300'}`}>{badge.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Next Milestone */}
        <section className="mt-12">
           <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[40px]"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                 <div className="size-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                    <Icon name="military_tech" className="text-2xl text-yellow-400" filled />
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold font-display text-lg mb-1">Next: Master</h4>
                    <p className="text-xs text-gray-400">Complete {Math.max(0, 10 - completedLessons.length)} more lessons.</p>
                 </div>
                 <button 
                   onClick={() => navigate('/reading')}
                   className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-100 transition-colors active:scale-95"
                 >
                    Go
                 </button>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
};
