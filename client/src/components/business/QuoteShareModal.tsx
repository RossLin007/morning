
import React, { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import html2canvas from 'html2canvas';

interface QuoteShareModalProps {
    visible: boolean;
    onClose: () => void;
    lesson: {
        day: number;
        title: string;
        quote?: { text: string; author: string };
        image: string;
    };
    user?: {
        nickname?: string;
        avatar_url?: string;
    };
}

export const QuoteShareModal: React.FC<QuoteShareModalProps> = ({ visible, onClose, lesson, user }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!visible) return null;

    const handleSaveImage = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            // Wait for images to load if needed, but here we assume they are loaded
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 2, // Retina quality
                backgroundColor: null,
            });

            const image = canvas.toDataURL("image/png");

            // Trigger download
            const link = document.createElement('a');
            link.href = image;
            link.download = `morning-reader-day${lesson.day}-quote.png`;
            link.click();
        } catch (error) {
            console.error("Failed to generate image", error);
            alert("图片生成失败，请尝试直接截图");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 flex flex-col items-center">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-6 md:right-0 bg-white/10 rounded-full p-2 text-white hover:bg-white/20 transition-colors z-50"
                >
                    <Icon name="close" />
                </button>

                {/* Card Container - Designed for 3:4 or similar mobile ratio */}
                <div
                    ref={cardRef}
                    className="w-full aspect-[3/5] max-h-[70vh] rounded-[24px] overflow-hidden relative bg-white shadow-2xl flex flex-col"
                >
                    {/* Background Image */}
                    <img
                        src={lesson.image}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover"
                        crossOrigin="anonymous"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 z-0"></div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 flex flex-col justify-between p-8 text-white">

                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-4xl font-display font-bold text-[#F4B942] opacity-90">DAY {lesson.day < 10 ? `0${lesson.day}` : lesson.day}</span>
                                <span className="text-sm font-bold tracking-widest uppercase opacity-80 mt-1">Morning Reader</span>
                            </div>
                            {/* Date or other info */}
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono">
                                {new Date().toLocaleDateString()}
                            </div>
                        </div>

                        {/* Quote - Centerpiece */}
                        <div className="my-auto">
                            <Icon name="format_quote" className="text-4xl text-[#F4B942] opacity-80 mb-4" />
                            <p className="text-2xl md:text-3xl font-serif font-medium leading-relaxed tracking-wide drop-shadow-md">
                                {lesson.quote?.text || "今天也要加油哦！"}
                            </p>
                            <div className="h-1 w-12 bg-[#F4B942] mt-6 mb-3 rounded-full"></div>
                            <p className="text-lg font-serif italic opacity-90">
                                {lesson.quote?.author ? `— ${lesson.quote.author}` : ''}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-4">
                            <div className="flex items-center gap-3">
                                {user?.avatar_url && (
                                    <img
                                        src={user.avatar_url}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full border-2 border-white/50"
                                        crossOrigin="anonymous" // Important for CORS
                                    />
                                )}
                                <div>
                                    <p className="text-sm font-bold">{user?.nickname || '晨读书友'}</p>
                                    <p className="text-xs opacity-70">正在参加《高效能人士的七个习惯》晨读营</p>
                                </div>
                            </div>

                            {/* QR Code Placeholder */}
                            <div className="bg-white p-1 rounded-lg">
                                <Icon name="qr_code_2" className="text-black text-3xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleSaveImage}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-[#F4B942] hover:bg-[#E3A831] text-black px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95"
                    >
                        {isGenerating ? (
                            <>
                                <Icon name="refresh" className="animate-spin" />
                                <span>生成中...</span>
                            </>
                        ) : (
                            <>
                                <Icon name="download" />
                                <span>保存图片</span>
                            </>
                        )}
                    </button>
                    {/* Add a secondary "Share" button for native share if we want later */}
                </div>

                <p className="text-white/50 text-xs mt-4">Tip: 如果保存失败，请直接截图分享</p>
            </div>
        </div>
    );
};
