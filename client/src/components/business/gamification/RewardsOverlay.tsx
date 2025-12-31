
import React from 'react';
import { useGamification } from '@/contexts/GamificationContext';
import { Icon } from '@/components/ui/Icon';

export const RewardsOverlay: React.FC = () => {
  const { rewardQueue, showLevelUp, dismissLevelUp } = useGamification();

  return (
    <>
      {/* 1. Reward Toasts (Stacked) */}
      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
          {rewardQueue.map((reward) => (
             <div key={reward.id} className="animate-fade-in-up bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 p-3 rounded-2xl shadow-xl flex items-center gap-3 min-w-[160px]">
                 <div className={`size-10 rounded-full flex items-center justify-center shadow-inner ${reward.type === 'coin' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Icon name={reward.type === 'coin' ? 'monetization_on' : 'auto_awesome'} filled />
                 </div>
                 <div>
                    <div className={`text-lg font-black font-display ${reward.type === 'coin' ? 'text-yellow-600' : 'text-blue-600'}`}>
                        +{reward.amount}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">{reward.reason}</div>
                 </div>
             </div>
          ))}
      </div>

      {/* 2. Level Up Modal */}
      {showLevelUp && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={dismissLevelUp}>
              <div className="relative w-full max-w-xs bg-gradient-to-br from-[#1A1A1A] to-black p-8 rounded-[32px] text-center border border-white/10 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                  
                  {/* Sunburst effect */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[60px] pointer-events-none"></div>

                  <div className="relative mb-6">
                      <Icon name="military_tech" className="text-8xl text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" filled />
                      <div className="absolute top-0 right-10 text-4xl animate-bounce">✨</div>
                      <div className="absolute bottom-0 left-10 text-4xl animate-bounce delay-100">✨</div>
                  </div>

                  <h2 className="text-3xl font-black text-white font-display mb-2 uppercase tracking-wide">Level Up!</h2>
                  <div className="flex items-center justify-center gap-4 text-gray-400 font-mono text-lg mb-8">
                      <span>Lv.{showLevelUp.oldLv}</span>
                      <Icon name="arrow_forward" />
                      <span className="text-yellow-400 font-bold text-2xl">Lv.{showLevelUp.newLv}</span>
                  </div>

                  <button 
                    onClick={dismissLevelUp}
                    className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform"
                  >
                      继续修行
                  </button>
              </div>
          </div>
      )}
    </>
  );
};
