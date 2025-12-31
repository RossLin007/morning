
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { useAIChat } from '@/hooks/useAIChat';
import { useLiveAI } from '@/hooks/useLiveAI';
import { useHaptics } from '@/hooks/useHaptics';
import { useGamification } from '@/contexts/GamificationContext';
import { useNetwork } from '@/hooks/useNetwork';
import { ASSETS } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { PROMPTS } from '@/lib/prompts'; // Import Prompts

export const AICoach: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { level, streak } = useGamification();
  const { trigger: haptic } = useHaptics();
  const isOnline = useNetwork();
  const { t } = useTranslation();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [input, setInput] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  // Use Persistent Chat Hook
  const { messages, isAiThinking, sendMessage, clearHistory } = useAIChat();
  
  // Use Gemini Live Hook
  const { connect, disconnect, isConnected, isSpeaking, volume, error: liveError } = useLiveAI();

  const QUICK_PROMPTS = [
    t('coach.prompts.core'),
    t('coach.prompts.procrastination'),
    t('coach.prompts.plan'),
    t('coach.prompts.proactive')
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // Handle Voice Mode Toggle
  useEffect(() => {
      if (isVoiceMode) {
          connect();
      } else {
          disconnect();
      }
  }, [isVoiceMode, connect, disconnect]);

  const handleSend = (textOverride?: string) => {
    if (!isOnline) return;
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isAiThinking) return;

    haptic('light');
    setInput('');

    const userName = user?.user_metadata?.name || '学员';
    
    // Use Centralized Prompt Generator
    const systemContext = PROMPTS.COACH.SYSTEM_INSTRUCTION(userName, level, streak);

    sendMessage(textToSend, systemContext);
  };

  const handleClear = () => {
      if(window.confirm(t('coach.confirm_clear'))) {
          haptic('medium');
          clearHistory();
      }
  };

  // --- Voice Interface Render ---
  if (isVoiceMode) {
      return (
          <div className="flex flex-col h-screen bg-black text-white font-sans relative overflow-hidden animate-fade-in">
              {/* Background Ambience */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-black z-0"></div>
              
              {/* Top Controls */}
              <div className="relative z-10 flex justify-between items-center p-6">
                  <button onClick={() => setIsVoiceMode(false)} className="size-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors rotate-180">
                      <Icon name="logout" className="text-white text-lg" />
                  </button>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                      <div className={`size-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                      <span className="text-xs font-mono text-gray-400">{isConnected ? t('coach.voice_connected') : t('coach.voice_connecting')}</span>
                  </div>
                  <div className="size-10"></div> {/* Spacer */}
              </div>

              {/* Main Visualizer */}
              <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  {liveError ? (
                      <div className="text-center px-8">
                          <Icon name="error_outline" className="text-red-500 text-4xl mb-4" />
                          <p className="text-red-400">{liveError}</p>
                          <button onClick={() => setIsVoiceMode(false)} className="mt-6 px-6 py-2 bg-white text-black rounded-full font-bold">{t('common.back')}</button>
                      </div>
                  ) : (
                      <>
                        {/* The Orb */}
                        <div className="relative size-64 flex items-center justify-center">
                            {/* Inner Core */}
                            <div className={`absolute size-40 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full blur-md transition-transform duration-100 ease-out`} 
                                 style={{ transform: `scale(${1 + volume / 100})` }}>
                            </div>
                            {/* Outer Glow */}
                            <div className={`absolute size-64 bg-primary/30 rounded-full blur-[60px] transition-opacity duration-500 ${isSpeaking ? 'opacity-100' : 'opacity-30'}`}></div>
                            
                            {/* Icon overlay */}
                            <Icon name="graphic_eq" className="text-white/80 text-4xl relative z-10 mix-blend-overlay" />
                        </div>

                        <div className="mt-12 text-center h-20">
                            {isSpeaking ? (
                                <p className="text-yellow-400 text-sm font-medium tracking-widest uppercase animate-pulse">{t('coach.voice_speaking')}</p>
                            ) : (
                                <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">{t('coach.voice_listening')}</p>
                            )}
                            <p className="text-white/40 text-xs mt-2">{t('coach.voice_hangup_hint')}</p>
                        </div>
                      </>
                  )}
              </div>

              {/* Bottom Controls */}
              <div className="relative z-10 p-10 flex justify-center pb-safe">
                  <button 
                    onClick={() => setIsVoiceMode(false)}
                    className="size-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                      <Icon name="call_end" className="text-white text-2xl" filled />
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F5F7F5] dark:bg-black font-sans relative overflow-hidden animate-fade-in">
      
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none"></div>
      
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <Icon name="arrow_back" className="text-text-main dark:text-white" />
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-base font-bold text-text-main dark:text-white flex items-center gap-2">
                <Icon name="smart_toy" className="text-yellow-500" />
                {t('coach.title')}
            </h1>
            <span className={`text-[10px] flex items-center gap-1 ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                <Icon name={isOnline ? "cloud_sync" : "cloud_off"} className="text-[10px]" />
                {isOnline ? t('coach.status_sync') : t('coach.status_offline')}
            </span>
        </div>
        <div className="flex gap-2 -mr-2">
            <button onClick={() => { haptic('medium'); setIsVoiceMode(true); }} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title="Start Call">
                <Icon name="call" filled />
            </button>
            <button onClick={handleClear} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Icon name="delete_sweep" />
            </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 opacity-60">
                <div className="size-20 bg-white dark:bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-lg mb-4">
                    <Icon name="psychology" className="text-4xl text-yellow-500" />
                </div>
                <p className="text-sm text-gray-500">{t('coach.intro_title')}</p>
                <div className="flex gap-4 mt-4">
                    <button onClick={() => { haptic('medium'); setIsVoiceMode(true); }} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                        <Icon name="mic" className="text-sm" /> {t('coach.action_voice')}
                    </button>
                </div>
            </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex flex-col animate-fade-in-up ${isUser ? 'items-end' : 'items-start'}`}>
               <div className={`flex max-w-[90%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`size-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm mt-1 ${isUser ? 'bg-gray-200' : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'}`}>
                     {isUser ? (
                        <img src={user?.user_metadata?.avatar || ASSETS.DEFAULT_AVATAR} className="size-8 rounded-full object-cover" alt="User" />
                     ) : (
                        <Icon name="smart_toy" className="text-sm" filled />
                     )}
                  </div>

                  <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white dark:bg-[#1A1A1A] text-text-main dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-800'
                  }`}>
                      {isUser ? (
                          msg.content
                      ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-6 prose-p:mb-2 last:prose-p:mb-0 prose-a:text-blue-500 prose-ul:list-disc prose-ul:pl-4">
                             <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                      )}
                  </div>
               </div>
               
               {/* Search Sources Display */}
               {!isUser && msg.sources && msg.sources.length > 0 && (
                   <div className="mt-2 ml-11 max-w-[85%] flex flex-wrap gap-2">
                       {msg.sources.map((source, idx) => (
                           <a 
                             key={idx} 
                             href={source.uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-1 bg-white/50 dark:bg-white/5 px-2 py-1 rounded-md text-[10px] text-gray-500 hover:text-primary transition-colors border border-gray-100 dark:border-gray-700 truncate max-w-[200px]"
                           >
                               <Icon name="link" className="text-[10px]" />
                               <span className="truncate">{source.title}</span>
                           </a>
                       ))}
                   </div>
               )}
            </div>
          );
        })}
        
        {isAiThinking && (
            <div className="flex justify-start animate-fade-in">
                <div className="flex gap-3 max-w-[85%]">
                    <div className="size-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex-shrink-0 flex items-center justify-center mt-1">
                        <Icon name="smart_toy" className="text-sm animate-spin" />
                    </div>
                    <div className="bg-white dark:bg-[#1A1A1A] px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 flex items-center gap-1">
                        <div className="size-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="size-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="size-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 pb-safe">
          {/* Quick Prompts */}
          {!isAiThinking && messages.length < 2 && isOnline && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                      >
                          {prompt}
                      </button>
                  ))}
              </div>
          )}

          <div className={`relative flex items-end gap-2 bg-gray-100 dark:bg-[#151515] rounded-3xl p-2 transition-all focus-within:ring-2 focus-within:ring-primary/20 ${!isOnline ? 'opacity-50 pointer-events-none' : ''}`}>
             <button onClick={() => setIsVoiceMode(true)} className="p-2 text-gray-400 hover:text-primary transition-colors rounded-full" title="Switch to Voice Mode">
                <Icon name="mic" />
             </button>
             <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder={isOnline ? t('coach.placeholder_online') : t('coach.placeholder_offline')}
                className="flex-1 bg-transparent border-none outline-none text-text-main dark:text-white max-h-32 min-h-[44px] py-2.5 resize-none text-sm"
                rows={1}
                disabled={!isOnline}
             />
             <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isAiThinking || !isOnline}
                className={`p-2 rounded-full transition-all ${
                    input.trim() && !isAiThinking && isOnline
                        ? 'bg-primary text-white shadow-lg scale-100' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 scale-90'
                }`}
             >
                <Icon name={isAiThinking ? "hourglass_empty" : "arrow_upward"} className={isAiThinking ? "animate-spin" : ""} />
             </button>
          </div>
      </div>
    </div>
  );
};
