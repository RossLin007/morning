import React, { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import html2canvas from 'html2canvas';

interface SoulCardProps {
    user: any;
    profile: any;
    onClose: () => void;
}

export const SoulCard: React.FC<SoulCardProps> = ({ user, profile, onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!cardRef.current) return;
        setIsSaving(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                backgroundColor: null,
                scale: 2, // Retain high quality
            } as any);

            const link = document.createElement('a');
            link.download = `soul-card-${user?.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Failed to generate card image", err);
        } finally {
            setIsSaving(false);
        }
    };

    const avatarUrl = profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'guest'}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://morning.reader/u/${user?.id || 'guest'}&color=6366f1`;

    // Determine Identity Label
    const identity = profile?.title || "探索者";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-in" onClick={onClose}>

            <div
                className="relative w-full max-w-sm"
                onClick={e => e.stopPropagation()} // Prevent close on card click
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    <Icon name="close" />
                </button>

                {/* The Card to Capture */}
                <div
                    ref={cardRef}
                    className="bg-white dark:bg-[#1A1A1A] rounded-[32px] overflow-hidden shadow-2xl border border-white/20 relative"
                    style={{ aspectRatio: '3/5' }}
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-br from-[#E0EAFC] to-[#CFDEF3] dark:from-[#2C3E50] dark:to-[#4CA1AF]"></div>
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/20 rounded-full blur-[50px]"></div>

                    {/* Content Container */}
                    <div className="relative h-full flex flex-col items-center pt-12 pb-8 px-6 text-center">

                        {/* Avatar Ring */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl scale-110"></div>
                            <div className="relative size-28 rounded-full border-4 border-white dark:border-white/10 shadow-xl overflow-hidden bg-white">
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" crossOrigin="anonymous" />
                            </div>
                            {/* Identity Badge */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap border-2 border-white dark:border-[#1A1A1A]">
                                {identity}
                            </div>
                        </div>

                        {/* Name & Bio */}
                        <div className="mt-2 mb-auto w-full">
                            <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-white mb-2">
                                {profile?.name || user?.nickname || '书友'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-300 italic leading-relaxed px-4 opacity-90">
                                “{profile?.bio || '做一个温暖且有力量的人'}”
                            </p>
                            <div className="mt-4 flex justify-center">
                                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-mono text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                                    ID: {user?.email?.split('@')[0] || user?.id?.slice(0, 8) || '8888'}
                                </span>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="mt-8 bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-white/50 dark:border-white/10 backdrop-blur-md w-full flex items-center justify-between gap-4">
                            <div className="text-left">
                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">Soul ID Card</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">扫描二维码，与我连接<br />开启你的灵魂之旅</p>
                            </div>
                            <div className="bg-white p-1 rounded-lg shrink-0">
                                <img src={qrCodeUrl} alt="QR" className="size-14" crossOrigin="anonymous" />
                            </div>
                        </div>

                        {/* Branding Footer */}
                        <div className="mt-6 flex items-center gap-1 opacity-40">
                            <Icon name="spa" className="text-xs text-gray-500 dark:text-gray-400" />
                            <span className="text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Morning Reader | Soul OS</span>
                        </div>

                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Icon name="refresh" className="animate-spin text-lg" />
                                <span>生成中...</span>
                            </>
                        ) : (
                            <>
                                <Icon name="download" className="text-lg" />
                                <span>保存名片</span>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};
