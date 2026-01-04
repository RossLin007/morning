
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/contexts/AuthContext';
import { useAIChat } from '@/hooks/useAIChat';
import { useLiveAI } from '@/hooks/useLiveAI';
import { useHaptics } from '@/hooks/useHaptics';
import { useGamification } from '@/contexts/GamificationContext';
import { useNetwork } from '@/hooks/useNetwork';
import { useTranslation } from '@/hooks/useTranslation';
import { PROMPTS } from '@/lib/prompts';
import { ASSETS } from '@/lib/constants';
import { NavBar } from '@/components/layout/NavBar';

interface FanChatProps {
    initialMessage?: string;
    onClose?: () => void;
    isModal?: boolean;
}

export const FanChat: React.FC<FanChatProps> = ({ initialMessage: propMsg, onClose, isModal }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialMessage = propMsg || location.state?.initialMessage;

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

    // Handle Initial Message
    useEffect(() => {
        if (initialMessage && messages.length === 0 && !isAiThinking) {
            if (!isModal) {
                window.history.replaceState({}, document.title);
            }
            handleSend(initialMessage);
        }
    }, [initialMessage]);

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

        // Check authentication - redirect to login if not authenticated
        if (!user) {
            if (isModal && onClose) {
                onClose();
            }
            navigate('/login', { state: { from: '/fan', message: t('common.login_required') } });
            return;
        }

        haptic('light');
        setInput('');

        const userName = (user as any)?.display_name || '学员';

        // Use Centralized Prompt Generator
        const systemContext = PROMPTS.COACH.SYSTEM_INSTRUCTION(userName, level, streak);

        sendMessage(textToSend, systemContext);
    };

    const handleClear = () => {
        if (window.confirm(t('coach.confirm_clear'))) {
            haptic('medium');
            clearHistory();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate(-1);
        }
    };

    // Quick Topic Cards (Show when history is empty)
    const QuickTopics = () => (
        <div className="grid grid-cols-2 gap-3 mt-4 animate-fade-in-up">
            {[
                { label: '解读核心', question: PROMPTS.COACH.PROMPTS.core, icon: 'menu_book' },
                { label: '克服拖延', question: PROMPTS.COACH.PROMPTS.procrastination, icon: 'schedule' },
                { label: '制定计划', question: PROMPTS.COACH.PROMPTS.plan, icon: 'edit_calendar' },
                { label: '什么是积极主动', question: PROMPTS.COACH.PROMPTS.proactive, icon: 'psychology' }
            ].map((topic, idx) => (
                <button
                    key={idx}
                    onClick={() => handleSend(topic.question)}
                    className="p-3 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800 rounded-2xl text-left hover:shadow-md transition-shadow active:scale-95"
                >
                    <div className="flex items-center gap-2 mb-1 text-primary">
                        <Icon name={topic.icon} className="text-lg" />
                        <span className="text-xs font-bold">{topic.label}</span>
                    </div>
                </button>
            ))}
        </div>
    );

    // --- Voice Interface Render ---
    if (isVoiceMode) {
        return (
            <div className={`flex flex-col ${isModal ? 'h-full rounded-t-[32px]' : 'h-screen'} bg-black text-white font-sans relative overflow-hidden animate-fade-in z-50`}>
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
        <div className={`flex flex-col ${isModal ? 'h-full bg-transparent' : 'h-screen bg-[#F5F7F5] dark:bg-black'} font-sans relative overflow-hidden animate-fade-in`}>

            {!isModal && <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none"></div>}

            {/* Header Area */}
            {isModal ? (
                // Modal Header
                <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-gray-800 rounded-t-[32px]">
                    <div className="flex items-center gap-2">
                        <Icon name="spa" className="text-primary text-xl" filled />
                        <span className="font-bold text-lg text-text-main dark:text-white">小凡</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { haptic('medium'); setIsVoiceMode(true); }} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                            <Icon name="call" filled />
                        </button>
                        <button onClick={handleClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                            <Icon name="close" />
                        </button>
                    </div>
                </header>
            ) : (
                // Page Header (NavBar)
                <NavBar
                    title={
                        <div className="flex items-center gap-2">
                            <Icon name="spa" className="text-primary text-xl" filled />
                            <span className="font-bold text-lg">小凡</span>
                        </div>
                    }
                    right={
                        <div className="flex gap-1 -mr-2">
                            <button onClick={() => { haptic('medium'); setIsVoiceMode(true); }} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <Icon name="call" filled />
                            </button>
                            <button onClick={handleClear} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Icon name="delete_sweep" />
                            </button>
                        </div>
                    }
                />
            )}

            {/* Status Banner - Offline or Unauthenticated */}
            {(!isOnline || !user) && (
                <div className={`mx-4 mt-2 p-3 rounded-2xl flex items-center gap-3 animate-fade-in ${!isOnline ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'}`}>
                    <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${!isOnline ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-500' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-500'}`}>
                        <Icon name={!isOnline ? 'wifi_off' : 'login'} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${!isOnline ? 'text-orange-700 dark:text-orange-300' : 'text-blue-700 dark:text-blue-300'}`}>
                            {!isOnline ? t('common.offline') : t('coach.login_required')}
                        </p>
                        <p className={`text-xs ${!isOnline ? 'text-orange-500 dark:text-orange-400' : 'text-blue-500 dark:text-blue-400'}`}>
                            {!isOnline ? t('coach.offline_hint') : t('coach.login_hint')}
                        </p>
                    </div>
                    {!user && isOnline && (
                        <button
                            onClick={() => {
                                if (isModal && onClose) onClose();
                                navigate('/login', { state: { from: '/fan' } });
                            }}
                            className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors flex-shrink-0"
                        >
                            {t('settings.logout.button').replace('退出', '去')}
                        </button>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-12 opacity-80 animate-fade-in relative">
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse pointer-events-none"></div>

                        <div className="size-24 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-[32px] flex items-center justify-center shadow-xl mb-6 ring-1 ring-white/40 relative z-10">
                            <Icon name="psychology_alt" className="text-5xl text-primary drop-shadow-sm" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-6">{t('coach.intro_title')}</p>

                        {/* Quick Topic Cards */}
                        <div className="w-full max-w-sm px-4">
                            <QuickTopics />
                        </div>
                    </div>
                )}

                {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div key={msg.id} className={`flex flex-col animate-fade-in-up ${isUser ? 'items-end' : 'items-start'}`}>
                            <div className={`flex max-w-[90%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`size-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm mt-1 ${isUser ? 'bg-gray-200' : 'bg-gradient-to-br from-primary to-primary-dark text-white'}`}>
                                    {isUser ? (
                                        <img src={(user as any)?.avatar_url || ASSETS.PLACEHOLDER_IMAGE} className="size-8 rounded-full object-cover" alt="User" />
                                    ) : (
                                        <Icon name="spa" className="text-sm" filled />
                                    )}
                                </div>

                                <div className={`p-4 rounded-2xl shadow-md text-sm leading-relaxed ${isUser
                                    ? 'bg-primary text-white rounded-tr-none shadow-primary/20'
                                    : 'bg-white dark:bg-[#1E1E1E] text-text-main dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-gray-300/30 dark:shadow-black/30'
                                    }`}>
                                    {isUser ? (
                                        msg.content
                                    ) : msg.content === '' ? (
                                        // Typing dots for empty streaming message
                                        <div className="flex items-center gap-1 py-1">
                                            <div className="size-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="size-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="size-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
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

                {/* Thinking indicator removed as it is handled by the streaming message placeholder */}
                <div ref={chatEndRef} />
            </div>

            <div className={`p-4 pb-[calc(env(safe-area-inset-bottom)+20px)] border-t ${isModal ? 'bg-white dark:bg-[#111] border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800'}`}>
                <div className={`relative flex items-end gap-2 p-2 transition-all group ${isModal
                    ? 'bg-gray-50 dark:bg-[#1A1A1A] shadow-inner ring-1 ring-gray-100 dark:ring-gray-800 rounded-2xl'
                    : 'bg-gray-100 dark:bg-[#151515] rounded-3xl focus-within:ring-2 focus-within:ring-primary/20'
                    }`}>

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
                        className="flex-1 bg-transparent border-none outline-none text-text-main dark:text-white max-h-32 min-h-[48px] py-3 px-2 resize-none text-sm placeholder:text-gray-500 font-medium"
                        rows={1}
                        disabled={!isOnline}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isAiThinking || !isOnline}
                        className={`p-2 rounded-xl transition-all duration-300 flex-shrink-0 mb-1 ${input.trim() && !isAiThinking && isOnline
                            ? 'bg-primary text-white shadow-lg active:scale-90 scale-100 hover:shadow-primary/30'
                            : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-400 scale-90'
                            }`}
                    >
                        <Icon name={isAiThinking ? "hourglass_empty" : "arrow_upward"} className={isAiThinking ? "animate-spin" : "text-xl"} />
                    </button>
                </div>
            </div>
        </div>
    );
};
