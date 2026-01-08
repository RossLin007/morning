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

type ContentType = 'image' | 'text' | 'video';

export const StoryPublish: React.FC = () => {
    const navigate = useNavigate();
    const { trigger: haptic } = useHaptics();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [contentType, setContentType] = useState<ContentType>('image');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [caption, setCaption] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [hasDraft, setHasDraft] = useState(false);

    // Initialize from LocalStorage
    React.useEffect(() => {
        const savedDraft = localStorage.getItem('story_draft');
        if (savedDraft) {
            try {
                const { contentType: ct, selectedImages: imgs, caption: cap, timestamp } = JSON.parse(savedDraft);
                // Only restore if less than 24 hours old
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    if (ct) setContentType(ct);
                    if (imgs) setSelectedImages(imgs);
                    if (cap) setCaption(cap);
                    if (imgs?.length > 0 || cap?.trim()) {
                        setHasDraft(true);
                        showToast('已恢复上次未发布的草稿', 'success');
                    }
                } else {
                    localStorage.removeItem('story_draft');
                }
            } catch (e) {
                console.error('Failed to parse draft', e);
            }
        }
    }, []);

    // Autosave to LocalStorage
    React.useEffect(() => {
        // Debounce simple implementation via effect dependency
        const timer = setTimeout(() => {
            if (selectedImages.length > 0 || caption.trim()) {
                const draft = {
                    contentType,
                    selectedImages,
                    caption,
                    timestamp: Date.now()
                };
                localStorage.setItem('story_draft', JSON.stringify(draft));
            } else {
                // Clear if empty
                localStorage.removeItem('story_draft');
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [contentType, selectedImages, caption]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const filesToProcess = files.slice(0, 9 - selectedImages.length);
        haptic('light');

        const newImages: string[] = [];
        let processed = 0;

        filesToProcess.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result as string);
                processed++;

                if (processed === filesToProcess.length) {
                    setSelectedImages(prev => [...prev, ...newImages]);
                    if (contentType === 'text') setContentType('image');
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        haptic('light');
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleTemplateClick = (template: typeof CAPTION_TEMPLATES[0]) => {
        haptic('light');
        setCaption(template.text);
    };

    const handlePublish = async () => {
        if (contentType === 'image' && selectedImages.length === 0) {
            showToast('请先选择图片或切换到纯文字模式', 'error');
            return;
        }

        if (contentType === 'text' && !caption.trim()) {
            showToast('请输入文字内容', 'error');
            return;
        }

        haptic('medium');
        setIsPublishing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        haptic('success');
        // Clear draft
        localStorage.removeItem('story_draft');

        // Removed generic toast to focus on the success page experience
        navigate('/story/success');
    };

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-900 to-black flex flex-col">
            {/* Header */}
            <NavBar
                title={<span className="text-white font-semibold">发布 Story</span>}
                left={
                    <button onClick={() => navigate(-1)} className="p-2 text-white/80 hover:text-white transition-colors">
                        <Icon name="close" className="text-2xl" />
                    </button>
                }
                right={
                    <button
                        onClick={handlePublish}
                        disabled={(contentType === 'image' && selectedImages.length === 0 && !caption.trim()) || isPublishing}
                        className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:bg-primary/90 active:scale-95 transition-all"
                    >
                        {isPublishing ? <Icon name="sync" className="animate-spin" /> : '发布'}
                    </button>
                }
                className="bg-transparent border-none"
            />

            {/* Content Type Tabs */}
            <div className="flex gap-1 px-6 pt-2 pb-4">
                {(['image', 'text'] as ContentType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            haptic('light');
                            setContentType(type);
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${contentType === type
                            ? 'bg-white/20 text-white backdrop-blur-sm'
                            : 'text-white/50 hover:text-white/70'
                            }`}
                    >
                        {type === 'image' ? '📸 图文' : '📝 纯文字'}
                    </button>
                ))}
            </div>

            {/* Content Preview Area */}
            <div className="flex-1 flex items-center justify-center p-6">
                {contentType === 'image' ? (
                    selectedImages.length > 0 ? (
                        <div className="w-full max-w-sm">
                            {/* Multi-image grid */}
                            <div className={`grid gap-2 ${selectedImages.length === 1 ? 'grid-cols-1' :
                                selectedImages.length === 2 ? 'grid-cols-2' :
                                    selectedImages.length <= 4 ? 'grid-cols-2' :
                                        'grid-cols-3'
                                }`}>
                                {selectedImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                                        <button
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Icon name="close" className="text-sm" />
                                        </button>
                                    </div>
                                ))}
                                {selectedImages.length < 9 && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-2xl border-2 border-dashed border-gray-600 hover:border-primary flex items-center justify-center transition-all"
                                    >
                                        <Icon name="add" className="text-3xl text-gray-400" />
                                    </button>
                                )}
                            </div>
                            <p className="text-center text-white/50 text-xs mt-3">
                                {selectedImages.length}/9 张图片
                            </p>
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
                                <p className="text-gray-600 text-sm mt-1">最多选择 9 张</p>
                            </div>
                        </button>
                    )
                ) : (
                    <div className="w-full max-w-sm aspect-[9/16] rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex items-center justify-center border border-gray-700">
                        <p className="text-white text-lg text-center leading-relaxed whitespace-pre-wrap">
                            {caption || '在下方输入文字...'}
                        </p>
                    </div>
                )}
            </div>

            {/* Caption Input & Templates */}
            <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 p-4 pb-safe">
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

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
            />
        </div>
    );
};
