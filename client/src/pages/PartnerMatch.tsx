
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Partner } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useTranslation } from '@/hooks/useTranslation';

export const PartnerMatch: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { role: string } | null;
    const { user } = useAuth();
    const { trigger: haptic } = useHaptics();
    const { t } = useTranslation();

    const targetRole = state?.role || 'buddy';
    const roleName = t(`roles.${targetRole}`);

    const [stage, setStage] = useState<'scan' | 'found' | 'pledge'>('scan');
    const [displayPartner, setDisplayPartner] = useState<Partner | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!user) return;

        if (stage === 'scan') {
            const timer = setTimeout(() => {
                findMatch();
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [stage, user]);

    const findMatch = async () => {
        if (!user) return;

        try {
            const profile = await api.match.find();
            setMatchedProfile(profile);
        } catch (err) {
            console.error("Failed to find match", err);
            // Fallback handled in backend but just in case
        }
    };

    const setMatchedProfile = (profile: any) => {
        const match: Partner = {
            id: profile.id,
            relationshipId: 'pending',
            name: profile.name || 'Unknown',
            avatar: profile.avatar || '',
            level: profile.level || 1,
            relationType: targetRole as any,
            relationDays: 0,
            syncRate: Math.floor(Math.random() * 15) + 85,
            status: 'online',
            lastInteraction: '刚刚',
            treeLevel: 0
        };
        setDisplayPartner(match);
        setStage('found');
        haptic('success');
    };

    const startPledge = () => {
        setStage('pledge');
    };

    const handleConnect = async () => {
        if (!user || !displayPartner) return;
        setIsCreating(true);

        try {
            await api.match.connect({
                partner_id: displayPartner.id,
                type: targetRole,
                sync_rate: displayPartner.syncRate
            });
            navigate('/relationships');
        } catch (err) {
            console.error("Failed to connect", err);
            alert(t('match.connect_fail'));
            setIsCreating(false);
        }
    };

    const handleReset = () => {
        setDisplayPartner(null);
        setStage('scan');
    };

    return (
        <div className="h-screen w-full bg-[#F5F7F5] dark:bg-[#0A0A0A] text-text-main dark:text-white flex flex-col relative overflow-hidden font-sans transition-colors duration-500">

            {/* Ambient Background (Zen/Morning Style) */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-orange-100/20 dark:from-primary/5 dark:to-blue-900/10"></div>

            {/* Organic Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-200/20 dark:bg-purple-900/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            {/* Header */}
            <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-30 p-3 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/20 dark:border-white/5 hover:bg-white/60 transition-colors shadow-sm">
                <Icon name="close" className="text-text-main dark:text-white text-lg" />
            </button>

            {stage === 'scan' && (
                <div className="flex-1 flex flex-col items-center justify-center relative z-20 animate-fade-in">
                    <div className="text-center mb-16 relative">
                        <h2 className="text-2xl font-display font-bold mb-3 tracking-wide text-text-main dark:text-white">
                            {t('match.title')}
                        </h2>
                        <p className="text-primary font-medium text-xs tracking-[0.3em] uppercase opacity-80">
                            {t('match.subtitle')}
                        </p>
                    </div>

                    {/* Zen Ripple Animation */}
                    <div className="relative size-64 flex items-center justify-center">
                        {/* Expanding Ripples */}
                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="absolute inset-0 rounded-full border border-primary/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute inset-0 rounded-full border border-orange-400/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '2s' }}></div>

                        {/* Core Circle (Breathing) */}
                        <div className="relative z-10 size-24 rounded-full bg-white dark:bg-[#151515] shadow-[0_0_40px_rgba(107,142,142,0.2)] flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                            <div className="size-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <Icon name="graphic_eq" className="text-primary text-3xl animate-bounce" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-xs text-gray-400 font-serif italic">
                            {t('match.scan_quote')}
                        </p>
                    </div>
                </div>
            )}

            {stage === 'found' && displayPartner && (
                <div className="flex-1 flex flex-col items-center justify-center relative z-20 animate-fade-in-up p-6">

                    {/* The Reveal Card */}
                    <div className="relative w-full max-w-sm">
                        <div className="relative bg-white/80 dark:bg-[#1A1A1A]/90 backdrop-blur-xl rounded-[40px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-white dark:border-gray-800">

                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-8 bg-orange-50 dark:bg-orange-900/10 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/20">
                                    <Icon name="auto_awesome" className="text-orange-400 text-xs" filled />
                                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 tracking-wider uppercase">{t('match.high_match')}</span>
                                </div>

                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform scale-110"></div>
                                    <img src={displayPartner.avatar} className="relative size-28 rounded-full border-4 border-white dark:border-[#2C2C2E] shadow-xl object-cover" alt="Match" />
                                </div>

                                <h3 className="text-2xl font-display font-bold text-text-main dark:text-white mb-2">{displayPartner.name}</h3>
                                <p className="text-gray-400 text-xs mb-8 flex items-center gap-2">
                                    <span>Lv.{displayPartner.level}</span>
                                    <span className="size-1 bg-gray-300 rounded-full"></span>
                                    <span>{t('match.similarity', { rate: displayPartner.syncRate })}</span>
                                </p>

                                <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-8"></div>

                                <div className="flex gap-4 w-full">
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 py-4 rounded-2xl font-bold text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        {t('match.keep_looking')}
                                    </button>
                                    <button
                                        onClick={startPledge}
                                        className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Icon name="handshake" className="text-lg" />
                                        <span>{t('match.establish_pledge', { role: roleName })}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {stage === 'pledge' && displayPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in px-6">
                    <div className="w-full max-w-sm bg-[#FFFDF9] dark:bg-[#151515] p-8 rounded-[32px] relative animate-fade-in-up">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Icon name="history_edu" className="text-8xl text-primary" />
                        </div>

                        <h2 className="text-2xl font-display font-bold text-text-main dark:text-white mb-2">{t('match.pledge_title')}</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">{t('match.pledge_subtitle')}</p>

                        <div className="space-y-4 mb-8">
                            <p
                                className="text-sm text-text-main dark:text-gray-300 font-serif leading-loose"
                                dangerouslySetInnerHTML={{ __html: t('match.pledge_content', { name: displayPartner.name, role: roleName }) }}
                            >
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 uppercase">{t('match.signature')}</span>
                                <span className="font-handwriting text-lg text-text-main dark:text-white font-bold italic">{user?.nickname || 'Me'}</span>
                            </div>
                            <button
                                onClick={handleConnect}
                                disabled={isCreating}
                                className="size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                            >
                                {isCreating ? <Icon name="sync" className="animate-spin" /> : <Icon name="fingerprint" className="text-2xl" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
