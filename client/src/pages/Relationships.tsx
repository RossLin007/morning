
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { useHaptics } from '@/hooks/useHaptics';
import { useAuth } from '@/contexts/AuthContext';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';
import { useGamification } from '@/contexts/GamificationContext';
import { usePartner } from '@/hooks/usePartner';
import { useTranslation } from '@/hooks/useTranslation';
import { LearningPlanModal } from '@/components/business/LearningPlanModal';
import { Modal } from '@/components/ui/Modal';

// Skeleton Component
const RelationshipSkeleton = () => (
    <div className="flex flex-col items-center w-full px-6 animate-pulse mt-6">
        <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-[40px] mb-6"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mb-8"></div>
        <div className="flex gap-3 w-full mb-8">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="size-12 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-3xl h-40"></div>
    </div>
);

export const Relationships: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trigger: haptic } = useHaptics();
  const { showToast } = useToast();
  const { addXp } = useGamification();
  const { t } = useTranslation();
  
  const [activeRole, setActiveRole] = useState<'buddy' | 'mentor' | 'mentee'>('buddy');
  
  const { partner, logs, loading, waterTree, sendMessage, assignPlan } = usePartner(activeRole);

  const [showPostcardModal, setShowPostcardModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPostcard, setSelectedPostcard] = useState(0);

  const isWatered = partner?.wateredToday || false;

  const postcards = [
      { id: 0, text: t('relationships.cards.morning'), bg: "bg-gradient-to-br from-orange-100 to-yellow-200" },
      { id: 1, text: t('relationships.cards.persistence'), bg: "bg-gradient-to-br from-blue-100 to-purple-200" },
      { id: 2, text: t('relationships.cards.company'), bg: "bg-gradient-to-br from-green-100 to-teal-200" },
      { id: 3, text: t('relationships.cards.care'), bg: "bg-gradient-to-br from-pink-100 to-red-100" },
  ];

  const handleBack = () => {
      // Robust back navigation: if no history, go to home
      if (window.history.length > 1) {
          navigate(-1);
      } else {
          navigate('/');
      }
  };

  const handleWater = async () => {
    if (!partner || !user || isWatered) return;
    haptic('success');
    
    // Call hook function
    await waterTree(partner.relationshipId, partner.treeLevel);
    
    showToast(t('relationships.water_success', { name: partner.name }), 'success');
    addXp(10, '共修树浇水');
  };

  const handleSendPostcard = async () => {
      if (!partner || !user) return;
      haptic('medium');
      setShowPostcardModal(false);

      const card = postcards[selectedPostcard];
      await sendMessage(partner.relationshipId, `寄出了一张明信片：「${card.text}」`, 'interaction');
      
      showToast(t('relationships.postcard_sent'), "success");
  };

  const handleAssignPlan = async (lessonId: string, title: string, note: string) => {
      if (!partner || !user) return;
      haptic('medium');
      await assignPlan(partner.relationshipId, { lessonId, title, note });
      showToast(t('relationships.plan_sent'), "success");
  };

  const handleNudge = async () => {
    if (!partner || !user) return;
    haptic('light');
    showToast(t('relationships.nudge_toast', { name: partner.name }));
    await sendMessage(partner.relationshipId, `拍了拍你，提醒你该学习啦`, 'interaction');
  };

  const getTreeIcon = (level: number = 0) => {
    if (level < 5) return 'psychiatry'; // Seed
    if (level < 15) return 'potted_plant'; // Sapling
    if (level < 30) return 'nature'; // Tree
    if (level < 50) return 'forest'; // Forest
    return 'park'; // Zen Garden
  };

  const treeIcon = getTreeIcon(partner?.treeLevel);
  const progressToNext = partner ? ((partner.treeLevel % 15) / 15 * 100) : 0;

  const roleConfig = {
      mentor: { label: t('roles.mentor'), desc: t('roles_desc.mentor'), icon: 'school', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
      buddy: { label: t('roles.buddy'), desc: t('roles_desc.buddy'), icon: 'spa', color: 'text-primary', bg: 'bg-primary/10' },
      mentee: { label: t('roles.mentee'), desc: t('roles_desc.mentee'), icon: 'psychology', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' }
  };

  const activeConfig = roleConfig[activeRole];

  return (
    <div className="min-h-screen bg-[#F2F4F2] dark:bg-[#050505] flex flex-col font-sans relative animate-fade-in pb-10 transition-colors duration-500">
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-[#F2F4F2]/80 dark:bg-[#050505]/80 backdrop-blur-md">
        <IconButton icon="arrow_back" onClick={handleBack} variant="glass" label="Back" />
        <h1 className="text-base font-bold text-text-main dark:text-white tracking-widest uppercase">{t('relationships.title')}</h1>
        <IconButton icon="person_add" onClick={() => navigate('/match', { state: { role: activeRole } })} variant="glass" label="Add Partner" />
      </header>

      <div className="relative z-40 px-6 mt-2">
        <div className="flex bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl p-1 shadow-sm">
           {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => (
             <button key={role} onClick={() => { haptic('light'); setActiveRole(role); }} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 ${activeRole === role ? 'bg-white dark:bg-[#1A1A1A] text-text-main dark:text-white shadow-sm scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}>
                <Icon name={roleConfig[role].icon} className={`text-lg mb-0.5 ${activeRole === role ? roleConfig[role].color : ''}`} filled={activeRole === role} />
                <span className={`text-[10px] font-bold ${activeRole === role ? '' : 'font-medium'}`}>{roleConfig[role].label}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 relative z-10 flex flex-col items-center justify-start w-full max-w-lg mx-auto">
         {loading ? (
             <RelationshipSkeleton />
         ) : partner ? (
            <div className="flex flex-col items-center w-full px-6 animate-fade-in mt-6">
               
               {/* Tree Visualization Card */}
               <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-blue-50 to-white dark:from-[#1A1A1A] dark:to-black rounded-[40px] shadow-lg border border-white dark:border-gray-800 flex items-center justify-center mb-6 overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-t from-transparent to-transparent rounded-full blur-3xl opacity-40 ${activeRole === 'mentor' ? 'from-orange-500/20' : activeRole === 'mentee' ? 'from-blue-500/20' : 'from-primary/20'}`}></div>
                  
                  {/* Weather Element */}
                  <div className="absolute top-6 right-6 text-yellow-500 animate-[pulse_4s_infinite] bg-yellow-500/10 p-2 rounded-full">
                      <Icon name="sunny" className="text-2xl" filled />
                  </div>

                  {/* Partner Info Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-md p-1.5 pr-3 rounded-full border border-white/20 shadow-sm z-20">
                      <img src={partner.avatar} className="size-8 rounded-full" alt={partner.name} />
                      <div className="flex flex-col">
                          <span className="text-xs font-bold text-text-main dark:text-white leading-none">{partner.name}</span>
                          <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">Lv.{partner.level}</span>
                      </div>
                  </div>

                  {/* The Tree */}
                  <div className={`relative transition-all duration-1000 z-10 flex flex-col items-center ${isWatered ? 'scale-110 drop-shadow-[0_0_30px_rgba(107,142,142,0.4)]' : 'scale-100 drop-shadow-xl'}`}>
                     <Icon name={treeIcon} className={`text-[120px] ${activeConfig.color} transition-all duration-1000`} filled />
                  </div>

                  {/* Progress Ring */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <svg className="size-64 -rotate-90 opacity-20" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" className={activeConfig.color} strokeDasharray="283" strokeDashoffset={283 - (283 * progressToNext / 100)} strokeLinecap="round" />
                       </svg>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-2 z-20">
                      <Icon name="change_history" className={`text-xs ${activeConfig.color}`} />
                      <span className="text-[10px] text-gray-500 dark:text-gray-300 font-bold uppercase tracking-wide">Growth Lv.{partner.treeLevel}</span>
                  </div>
               </div>

               {/* Action Grid */}
               <div className="flex w-full gap-4 mb-8">
                   <button onClick={handleWater} disabled={isWatered} className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 shadow-sm border border-transparent transition-all ${isWatered ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/30 active:scale-95'}`}>
                       <Icon name={isWatered ? "check" : "water_drop"} filled={!isWatered} />
                       <span className="text-xs font-bold">{isWatered ? t('relationships.watered_button') : t('relationships.water_button')}</span>
                   </button>
                   <button onClick={() => setShowPostcardModal(true)} className="flex-1 h-14 rounded-2xl bg-white dark:bg-[#1A1A1A] text-text-main dark:text-white border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all">
                       <Icon name="mark_email_unread" className="text-orange-400" />
                       <span className="text-xs font-bold">{t('relationships.postcard_button')}</span>
                   </button>
                   
                   {/* Mentor Specific Action */}
                   {activeRole === 'mentor' ? (
                       <button onClick={() => setShowPlanModal(true)} className="size-14 rounded-2xl bg-white dark:bg-[#1A1A1A] text-text-main dark:text-white border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all">
                           <Icon name="assignment_add" className="text-blue-500" />
                       </button>
                   ) : (
                       <button onClick={handleNudge} className="size-14 rounded-2xl bg-white dark:bg-[#1A1A1A] text-text-main dark:text-white border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all">
                           <Icon name="touch_app" className="text-gray-400" />
                       </button>
                   )}
               </div>

               {/* Logs List */}
               <div className="w-full bg-white dark:bg-[#1A1A1A] rounded-[32px] p-6 shadow-sm border border-gray-50 dark:border-gray-800">
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Icon name="history" className="text-sm" /> History
                   </h3>
                   
                   <div className="space-y-6 relative">
                       {/* Timeline Line */}
                       <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gray-100 dark:bg-gray-800"></div>

                       {logs.length > 0 ? logs.map((log) => (
                           <div key={log.id} className="flex gap-4 relative animate-fade-in-up">
                               <div className="relative z-10 size-4 rounded-full border-2 border-white dark:border-[#1A1A1A] bg-gray-200 dark:bg-gray-700 mt-1 shrink-0"></div>
                               <div className="flex-1">
                                   <div className="flex justify-between items-start mb-1">
                                       <span className="text-xs font-bold text-gray-500 dark:text-gray-300">
                                           {log.actor_id === user?.id ? '我' : partner.name}
                                       </span>
                                       <span className="text-[10px] text-gray-400">{formatRelativeTime(log.created_at)}</span>
                                   </div>
                                   <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl rounded-tl-none text-sm text-text-main dark:text-gray-300 border border-gray-100 dark:border-gray-800/50">
                                       {log.content}
                                   </div>
                               </div>
                           </div>
                       )) : (
                           <div className="py-8 text-center text-gray-400 text-xs italic">
                               {t('relationships.no_logs')}
                           </div>
                       )}
                   </div>
               </div>

            </div>
         ) : (
             // Empty State
             <div className="flex flex-col items-center justify-center flex-1 w-full px-8 text-center animate-fade-in">
                 <div className={`size-32 rounded-full ${activeConfig.bg} flex items-center justify-center mb-6`}>
                     <Icon name={activeConfig.icon} className={`text-6xl ${activeConfig.color} opacity-80`} />
                 </div>
                 <h2 className="text-xl font-display font-bold text-text-main dark:text-white mb-2">{t('relationships.no_partner', { role: activeConfig.label })}</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-xs">
                     {t('relationships.no_partner_desc', { desc: activeConfig.desc })}
                 </p>
                 <button 
                    onClick={() => navigate('/match', { state: { role: activeRole } })}
                    className="w-full py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                 >
                     <Icon name="person_search" />
                     {t('relationships.find_partner', { role: activeConfig.label })}
                 </button>
             </div>
         )}
      </div>

      {/* Postcard Modal */}
      <Modal 
        isOpen={showPostcardModal} 
        onClose={() => setShowPostcardModal(false)} 
        title={t('relationships.postcard_title')} 
        type="bottom"
        className="max-h-[85vh] flex flex-col"
      >
          <div className="pb-6">
              <p className="text-xs text-gray-400 mb-4">{t('relationships.postcard_subtitle')}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                  {postcards.map((card, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedPostcard(index)}
                        className={`aspect-[4/3] rounded-2xl p-4 flex items-center justify-center text-center cursor-pointer transition-all border-2 relative overflow-hidden group ${
                            selectedPostcard === index ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent opacity-80 hover:opacity-100'
                        } ${card.bg}`}
                      >
                          <p className="text-xs font-serif text-black/80 font-bold relative z-10 leading-relaxed">{card.text}</p>
                          {selectedPostcard === index && (
                              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                                  <Icon name="check" className="text-xs" />
                              </div>
                          )}
                      </div>
                  ))}
              </div>
              <button 
                onClick={handleSendPostcard}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all"
              >
                  {t('relationships.send_postcard_action')}
              </button>
          </div>
      </Modal>

      {/* Learning Plan Modal */}
      <LearningPlanModal 
         isOpen={showPlanModal}
         onClose={() => setShowPlanModal(false)}
         onAssign={handleAssignPlan}
      />

    </div>
  );
};
