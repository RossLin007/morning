import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { Partner } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/contexts/ToastContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useTimer } from '@/hooks/useTimer';
import { formatDuration } from '@/lib/utils';
import { useLiveChat } from '@/hooks/useLiveChat'; 
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useHaptics } from '@/hooks/useHaptics';
import { ASSETS } from '@/lib/constants';

const ROOM_BG_OPTIONS = [
    { id: 'zen', name: '晨曦山林', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2500&auto=format&fit=crop' },
    { id: 'cyber', name: '数字虚空', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2500&auto=format&fit=crop' },
    { id: 'study', name: '深夜书房', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2500&auto=format&fit=crop' }
];

const AMBIENCE_OPTIONS = [
    { id: 'none', name: '静音', src: '' },
    { id: 'rain', name: '雨声', src: ASSETS.AMBIENT_RAIN },
    { id: 'forest', name: '鸟鸣', src: ASSETS.AMBIENT_FOREST }
];

export const LiveRoom: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { trigger: haptic } = useHaptics();
  const { addCoins, addXp } = useGamification();
  const { showToast } = useToast();
  
  // Room Settings
  const [currentBg, setCurrentBg] = useState(ROOM_BG_OPTIONS[0]);
  const [ambience, setAmbience] = useState(AMBIENCE_OPTIONS[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer Hook
  const { time, isRunning, start, pause, reset } = useTimer({ 
      initialTime: 1500, // 25 mins
      type: 'countdown',
      onComplete: () => handleSessionComplete()
  });
  
  // UI State
  const [showChat, setShowChat] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Realtime Chat Hook (Mocked in current architecture)
  const { messages, onlineCount, status: connectionStatus, sendMessage } = useLiveChat('morning_live');
  
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Data Persistence
  const [hasPartner] = useLocalStorage<boolean>('mr_has_partner', false);
  const [currentPartner] = useLocalStorage<Partner | null>('mr_partner_data', null);

  // Auto-scroll chat
  useEffect(() => {
      if (showChat && chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [messages, showChat]);

  // Audio Control
  useEffect(() => {
      if (ambience.src) {
          if (!audioRef.current) {
              audioRef.current = new Audio(ambience.src);
              audioRef.current.loop = true;
          } else {
              audioRef.current.src = ambience.src;
          }
          if (isRunning) {
              audioRef.current.play().catch(e => console.log("Audio play prevented", e));
          }
      } else {
          audioRef.current?.pause();
      }
      return () => { audioRef.current?.pause(); };
  }, [ambience, isRunning]);

  const handleSessionComplete = () => {
      haptic('success');
      addXp(30, '完成专注');
      addCoins(5, '专注奖励');
      setShowCelebration(true);
  };

  const handleSend = () => {
      if (!inputText.trim()) return;
      sendMessage(inputText);
      setInputText('');
  };

  const toggleTimer = () => {
      haptic('light');
      if (isRunning) pause();
      else start();
  };

  return (
    <div className="h-screen w-full bg-[#0F1115] text-white flex flex-col relative overflow-hidden font-sans">
       
       {/* Background Ambience */}
       <div className="absolute inset-0 opacity-40 bg-cover bg-center transition-all duration-[2s] hover:scale-105 pointer-events-none"
         style={{ backgroundImage: `url("${currentBg.url}")` }}></div>
       <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0F1115] pointer-events-none"></div>

       {/* Top Bar */}
       <div className="relative z-50 flex justify-between items-center p-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors pointer-events-auto">
             <Icon name="expand_more" className="text-white" />
          </button>
          
          <div className="flex flex-col items-center pointer-events-none">
             <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <div className={`size-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span className="text-xs font-medium font-mono">
                    {connectionStatus === 'connecting' ? t('live.status_connecting') : t('live.status_online', { count: onlineCount })}
                </span>
             </div>
          </div>

          <button onClick={() => setShowSettings(true)} className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors pointer-events-auto">
             <Icon name="tune" className="text-white" />
          </button>
       </div>

       {/* Visualizer & Timer */}
       <div className={`relative z-10 flex-1 flex flex-col items-center justify-center transition-all duration-300 ${showChat ? '-translate-y-20 scale-90 opacity-50' : ''}`}>
          {/* Visualizer */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full border border-primary/20 pointer-events-none transition-all duration-[4000ms] ease-in-out ${isRunning ? 'scale-125 opacity-40' : 'scale-100 opacity-0'}`}></div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-primary/10 pointer-events-none transition-all duration-[4000ms] ease-in-out delay-100 ${isRunning ? 'scale-110 opacity-30' : 'scale-90 opacity-0'}`}></div>

          {/* Ring Timer */}
          <div className="relative size-72 flex items-center justify-center mb-8">
             <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="2" />
                <circle 
                   cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" 
                   className="text-primary transition-all duration-1000"
                   strokeDasharray="283"
                   strokeDashoffset={283 - (283 * (1500 - time) / 1500)}
                   strokeLinecap="round"
                />
             </svg>
             <div className="text-center flex flex-col items-center z-10">
                <span className="text-6xl font-light font-mono tracking-wider">{formatDuration(time)}</span>
                <span className="text-sm text-gray-400 mt-2 font-medium tracking-widest uppercase">{t('live.focus_label')}</span>
             </div>
          </div>

          <button 
             onClick={toggleTimer}
             className={`px-10 py-3 rounded-full font-bold text-sm tracking-widest transition-all ${
               isRunning ? 'bg-transparent border border-white/30 text-white hover:bg-white/10' : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'
             }`}
          >
             {isRunning ? t('live.btn_pause') : t('live.btn_start')}
          </button>
          
          {isRunning && <div className="absolute bottom-[-60px] text-primary/60 text-xs font-mono animate-pulse tracking-widest">{t('live.breathe_hint')}</div>}
       </div>

       {/* Chat Drawer */}
       <div className={`absolute bottom-0 left-0 right-0 bg-[#0F1115]/95 backdrop-blur-xl border-t border-white/10 transition-transform duration-300 z-30 flex flex-col ${showChat ? 'h-[60vh] translate-y-0' : 'h-0 translate-y-full'}`}>
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {messages.map((msg, index) => (
                   <div key={`${msg.id}-${index}`} className={`flex flex-col ${msg.user === 'Me' ? 'items-end' : 'items-start'} animate-fade-in`}>
                       {msg.isSystem ? (
                           <div className="w-full flex justify-center my-1"><span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{msg.content}</span></div>
                       ) : (
                           <>
                               <div className="flex items-end gap-2 mb-1">
                                   {msg.user !== 'Me' && msg.avatar && (
                                       <img src={msg.avatar} className="size-4 rounded-full" alt="" />
                                   )}
                                   <span className="text-[10px] text-gray-500">{msg.user}</span>
                               </div>
                               <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm break-words ${msg.user === 'Me' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>{msg.content}</div>
                           </>
                       )}
                   </div>
               ))}
               <div ref={chatEndRef} />
           </div>
           <div className="p-4 border-t border-white/10 flex gap-2">
               <input className="flex-1 bg-white/5 border-none rounded-full px-4 text-sm text-white focus:ring-1 focus:ring-primary placeholder-gray-500" placeholder={t('common.send') + "..."} value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
               <button onClick={handleSend} className="p-2 bg-primary rounded-full text-white"><Icon name="send" className="text-sm" /></button>
           </div>
       </div>

       {/* Bottom Controls */}
       <div className="relative z-20 p-8 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex justify-between items-end">
             {/* Partner Info */}
             {hasPartner && currentPartner ? (
                <div className="flex flex-col gap-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('live.partner_with')}</p>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={currentPartner.avatar} className="size-12 rounded-full border-2 border-white/20" alt="" />
                            <div className={`absolute -bottom-1 -right-1 size-3 rounded-full border border-black ${currentPartner.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">{currentPartner.name}</span>
                            <span className="text-xs text-primary">{t('live.partner_focus')} (Sync: {currentPartner.syncRate}%)</span>
                        </div>
                        <button onClick={() => showToast(t('live.partner_nudge_sent'))} className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors ml-2"><Icon name="waving_hand" className="text-sm" /></button>
                    </div>
                </div>
             ) : (
                <div className="flex flex-col gap-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('live.solo_mode')}</p>
                    <button onClick={() => navigate('/match')} className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors"><Icon name="person_add" /><span>{t('live.find_partner')}</span></button>
                </div>
             )}

             <div className="flex gap-4">
                <button onClick={() => setShowChat(!showChat)} className={`size-12 rounded-full flex items-center justify-center transition-colors relative ${showChat ? 'bg-primary text-white' : 'bg-white/20 text-white'}`}>
                   <Icon name="chat" />
                   {!showChat && <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-[#0F1115]"></span>}
                </button>
                <button onClick={() => { 
                    const nextIdx = (AMBIENCE_OPTIONS.findIndex(a => a.id === ambience.id) + 1) % AMBIENCE_OPTIONS.length;
                    const next = AMBIENCE_OPTIONS[nextIdx]; 
                    setAmbience(next); 
                    showToast(`${t('live.setting_ambience')}: ${next.name}`); 
                }} className={`size-12 rounded-full flex items-center justify-center transition-colors ${ambience.id !== 'none' ? 'bg-white/20 text-blue-300' : 'bg-white/10 text-gray-400'}`}>
                   <Icon name={ambience.id === 'none' ? "volume_off" : "water_drop"} filled={ambience.id !== 'none'} />
                </button>
             </div>
          </div>
       </div>

       {/* Settings Modal */}
       <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title={t('live.settings_title')} type="bottom">
           <div className="space-y-6 pb-6">
               <div>
                   <label className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-3">{t('live.setting_scene')}</label>
                   <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                       {ROOM_BG_OPTIONS.map(bg => (
                           <div key={bg.id} onClick={() => setCurrentBg(bg)} className={`relative w-28 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${currentBg.id === bg.id ? 'border-primary' : 'border-transparent opacity-60'}`}>
                               <img src={bg.url} className="w-full h-full object-cover" alt={bg.name} />
                               <div className="absolute inset-0 flex items-center justify-center bg-black/20"><span className="text-xs font-bold text-white shadow-sm">{bg.name}</span></div>
                           </div>
                       ))}
                   </div>
               </div>
               <div>
                   <label className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-3">{t('live.setting_ambience')}</label>
                   <div className="flex gap-3">
                       {AMBIENCE_OPTIONS.map(opt => (
                           <button key={opt.id} onClick={() => setAmbience(opt)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${ambience.id === opt.id ? 'bg-white text-black' : 'bg-white/10 text-gray-400'}`}>{opt.name}</button>
                       ))}
                   </div>
               </div>
           </div>
       </Modal>

       {/* Celebration Modal */}
       <Modal isOpen={showCelebration} onClose={() => setShowCelebration(false)} type="center">
           <div className="text-center p-4">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1A1A1A] p-4 rounded-full shadow-lg border border-white/10">
                <Icon name="self_improvement" className="text-6xl text-green-400 drop-shadow-md" filled />
              </div>
              <div className="mt-8">
                <h2 className="text-2xl font-black text-white mb-2 font-display">{t('live.celebration_title')}</h2>
                <p className="text-gray-400 text-sm mb-8">{t('live.celebration_desc')}</p>
                <div className="flex justify-center gap-4 mb-8">
                  <div className="flex flex-col items-center bg-white/5 p-3 rounded-2xl w-24">
                    <span className="text-xl font-black text-white">25</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Mins</span>
                  </div>
                   <div className="flex flex-col items-center bg-white/5 p-3 rounded-2xl w-24">
                    <span className="text-xl font-black text-yellow-500">+30</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Exp</span>
                  </div>
                </div>
                <button onClick={() => { setShowCelebration(false); reset(1500); }} className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-transform">{t('live.btn_next_round')}</button>
                <button onClick={() => navigate(-1)} className="mt-4 text-sm text-gray-500 hover:text-white transition-colors">{t('live.btn_finish')}</button>
              </div>
           </div>
       </Modal>
    </div>
  );
};