import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/contexts/ToastContext';

// Predefined templates for Story captions
const CAPTION_TEMPLATES = [
    { emoji: '🌅', text: '早起第{day}天，感觉特别清醒' },
    { emoji: '💡', text: '今天的觉察：' },
    { emoji: '📖', text: '这句话让我想了很久...' },
    { emoji: '🙏', text: '感恩今天的' },
    { emoji: '✨', text: '此刻的感受：' },
];

export const StoryPublish: React.FC = () => {
    const navigate = useNavigate();
    const { trigger: haptic } = useHaptics();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            haptic('light');
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTemplateClick = (template: typeof CAPTION_TEMPLATES[0]) => {
        haptic('light');
        setCaption(template.text);
    };

    const handlePublish = async () => {
        if (!selectedImage) {
            showToast('请先选择一张图片', 'error');
            return;
        }

        haptic('medium');
        setIsPublishing(true);

        // Simulate publish delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        haptic('success');
        showToast('Story 发布成功！', 'success');
        navigate('/');
    };

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-900 to-black flex flex-col">
            {/* Header */}
            <NavBar
                title={<span className="text-white font-semibold">发布 Story</span>}
                left={
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-white/80 hover:text-white transition-colors"
                    >
                        <Icon name="close" className="text-2xl" />
                    </button>
                }
                right={
                    <button
                        onClick={handlePublish}
                        disabled={!selectedImage || isPublishing}
                        className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:bg-primary/90 active:scale-95 transition-all"
                    >
                        {isPublishing ? (
                            <Icon name="sync" className="animate-spin" />
                        ) : (
                            '发布'
                        )}
                    </button>
                }
                className="bg-transparent border-none"
            />

            {/* Image Preview Area */}
            <div className="flex-1 flex items-center justify-center p-6">
                {selectedImage ? (
                    <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Caption on Image */}
                        {caption && (
                            <div className="absolute bottom-8 left-4 right-4">
                                <p className="text-white text-lg font-medium leading-relaxed drop-shadow-lg">
                                    {caption}
                                </p>
                            </div>
                        )}

                        {/* Remove Image Button */}
                        <button
                            onClick={() => {
                                haptic('light');
                                setSelectedImage(null);
                            }}
                            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors"
                        >
                            <Icon name="close" className="text-lg" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-sm aspect-[9/16] rounded-3xl border-2 border-dashed border-gray-600 
                            flex flex-col items-center justify-center gap-4
                            hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon name="add_a_photo" className="text-4xl text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 font-medium">点击选择图片</p>
                            <p className="text-gray-600 text-sm mt-1">或拍摄此刻的觉察瞬间</p>
                        </div>
                    </button>
                )}
            </div>

            {/* Caption Input & Templates */}
            <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 p-4 pb-safe">
                {/* Caption Input */}
                <div className="relative mb-4">
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="写下你的觉察..."
                        maxLength={200}
                        rows={2}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-4 py-3 
                            text-white placeholder-gray-500 text-base
                            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                            resize-none transition-all"
                    />
                    <span className="absolute bottom-3 right-3 text-xs text-gray-500">
                        {caption.length}/200
                    </span>
                </div>

                {/* Templates */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CAPTION_TEMPLATES.map((template, index) => (
                        <button
                            key={index}
                            onClick={() => handleTemplateClick(template)}
                            className="flex-shrink-0 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full 
                                text-sm text-gray-300 hover:text-white transition-colors
                                border border-gray-700 hover:border-gray-600"
                        >
                            {template.emoji} {template.text.slice(0, 10)}...
                        </button>
                    ))}
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
            />
        </div>
    );
};
