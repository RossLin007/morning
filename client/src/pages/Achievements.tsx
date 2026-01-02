import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useGamification } from '@/contexts/GamificationContext';

// --- Mock Data: The Path of Soul Evolution ---
const MILESTONES = [
   {
      id: 1,
      level: 1,
      title: '凡人 (The Sleeper)',
      desc: '沉睡于日常的琐碎，尚未觉察内心的渴望。',
      quote: '“生活不仅是眼前的苟且，还有诗和远方。”',
      icon: 'bedtime',
      color: 'text-gray-400',
      bg: 'bg-gray-100',
      isReached: true
   },
   {
      id: 2,
      level: 3,
      title: '觉醒者 (The Awakened)',
      desc: '第一缕晨光照进心房，开始了向内的探索。',
      quote: '“杀不死我的，终将使我更强大。”',
      icon: 'wb_sunny',
      color: 'text-orange-500',
      bg: 'bg-orange-100',
      isReached: true
   },
   {
      id: 3,
      level: 7,
      title: '初学者 (The Novice)',
      desc: '建立了微习惯，开始在晨读中汲取养分。',
      quote: '“千里之行，始于足下。”',
      icon: 'local_florist',
      color: 'text-green-500',
      bg: 'bg-green-100',
      isReached: true
   },
   {
      id: 4,
      level: 15,
      title: '行者 (The Practitioner)',
      desc: '知行合一，将书中的智慧践行于生活。',
      quote: '“知识若不转化为行动，便是虚妄。”',
      icon: 'hiking',
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      isReached: false
   },
   {
      id: 5,
      level: 30,
      title: '传灯者 (The Guide)',
      desc: '成为他人的光，在互赖中通过教导来学习。',
      quote: '“点亮一盏灯，照亮一大片。”',
      icon: 'auto_awesome',
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      isReached: false
   },
   {
      id: 6,
      level: 50,
      title: '智者 (The Sage)',
      desc: '内心的丰盛溢出，与世界和谐共生。',
      quote: '“无为而无不为。”',
      icon: 'self_improvement',
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      isReached: false
   }
];

export const Achievements: React.FC = () => {
   const navigate = useNavigate();
   const { level } = useGamification();
   const [animate, setAnimate] = useState(false);

   useEffect(() => {
      setAnimate(true);
   }, []);

   return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0A0A0A] font-sans animate-fade-in pb-12 transition-colors duration-500">

         {/* Header */}
         <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
               <Icon name="arrow_back" className="text-text-main dark:text-white" />
            </button>
            <div className="flex flex-col items-center">
               <h1 className="text-lg font-serif font-bold text-text-main dark:text-white">英雄之旅</h1>
               <span className="text-[10px] text-gray-400 uppercase tracking-widest">Milestones</span>
            </div>
            <div className="w-10"></div>
         </header>

         <div className="p-6 max-w-lg mx-auto relative">

            {/* Connecting Line (The Path) */}
            <div className="absolute left-[42px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary/20 via-primary/50 to-gray-200 dark:to-gray-800"></div>

            <div className="space-y-12">
               {MILESTONES.map((milestone, index) => {
                  const isCurrent = milestone.level <= level && (index === MILESTONES.length - 1 || MILESTONES[index + 1].level > level);
                  const isLocked = !milestone.isReached && !isCurrent; // Simplified logic utilizing static fake data for now, but `isReached` hardcoded above handles visuals. 
                  // Let's refine `isLocked` based on actual level context if we wanted dynamic, but for this fake data request, let's use the object property + level check.
                  const actuallyReached = level >= milestone.level;

                  return (
                     <div
                        key={milestone.id}
                        className={`relative flex gap-6 group ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                     >
                        {/* Icon Node */}
                        <div className={`relative z-10 size-12 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-500
                            ${actuallyReached
                              ? `${milestone.bg} ${milestone.color} border-white dark:border-[#0A0A0A] shadow-md`
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-300 border-white dark:border-[#0A0A0A]'
                           }
                            ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}
                        `}>
                           <Icon name={milestone.icon} className="text-xl" filled={actuallyReached} />
                        </div>

                        {/* Content Card */}
                        <div className={`flex-1 rounded-2xl p-5 border transition-all duration-300 ${actuallyReached
                              ? 'bg-white dark:bg-[#151515] border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-md'
                              : 'bg-transparent border-transparent opacity-60 grayscale'
                           }`}>
                           <div className="flex justify-between items-start mb-2">
                              <h3 className={`text-base font-bold font-serif ${actuallyReached ? 'text-text-main dark:text-white' : 'text-gray-400'}`}>
                                 {milestone.title}
                              </h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${actuallyReached ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' : 'text-gray-300'}`}>
                                 Lv.{milestone.level}
                              </span>
                           </div>

                           <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                              {milestone.desc}
                           </p>

                           {actuallyReached && (
                              <div className="relative pl-3 border-l-2 border-primary/30">
                                 <p className="text-xs font-serif italic text-gray-400 dark:text-gray-500">
                                    {milestone.quote}
                                 </p>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>

            <div className="mt-12 text-center">
               <p className="text-xs text-gray-400 font-serif italic">
                  “人生的意义不在于终点，而在于沿途的风景与转变。”
               </p>
            </div>

         </div>
      </div>
   );
};
