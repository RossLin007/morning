import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useHaptics } from '@/hooks/useHaptics';

interface StoryItem {
    id: string;
    imageUrl: string;
    caption?: string;
    duration?: number; // seconds
}

interface StoryUser {
    id: string;
    name: string;
    avatar: string;
    stories: StoryItem[];
}

// Mock Story Data
const MOCK_STORIES: StoryUser[] = [
    {
        id: '0',
        name: '我的故事',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MyStory&backgroundColor=6B8E8E',
        stories: [
            {
                id: 's0-1',
                imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
                caption: '今天的晨读主题：积极主动',
                duration: 5,
            },
        ],
    },
    {
        id: '1',
        name: '小楠',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoNan&backgroundColor=b6e3f4',
        stories: [
            {
                id: 's1-1',
                imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
                caption: '分享今天的读书笔记 📚',
                duration: 5,
            },
            {
                id: 's1-2',
                imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
                caption: '这句话让我思考了很久...',
                duration: 5,
            },
        ],
    },
    {
        id: '2',
        name: '话梅',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaMei&backgroundColor=ffd5dc',
        stories: [
            {
                id: 's2-1',
                imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
                caption: '品德是习惯的合成 ✨',
                duration: 5,
            },
        ],
    },
    {
        id: '3',
        name: '张伟',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei&backgroundColor=d1d4f9',
        stories: [
            {
                id: 's3-1',
                imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
                caption: '第一周学习总结',
                duration: 5,
            },
        ],
    },
    {
        id: '4',
        name: 'Lisa',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=b6e3f4',
        stories: [
            {
                id: 's4-1',
                imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80',
                caption: '早起的第7天 🌅',
                duration: 5,
            },
        ],
    },
    {
        id: '5',
        name: '老陈',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen&backgroundColor=c0aede',
        stories: [
            {
                id: 's5-1',
                imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
                caption: '今天的觉察日记',
                duration: 5,
            },
        ],
    },
];

export const StoryViewer: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { trigger: haptic } = useHaptics();

    // Find user index
    const initialUserIndex = MOCK_STORIES.findIndex(u => u.id === id);
    const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex >= 0 ? initialUserIndex : 0);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const currentUser = MOCK_STORIES[currentUserIndex];
    const currentStory = currentUser?.stories[currentStoryIndex];
    const storyDuration = (currentStory?.duration || 5) * 1000;

    // Progress bar animation
    useEffect(() => {
        if (isPaused || !currentStory) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    goToNextStory();
                    return 0;
                }
                return prev + (100 / (storyDuration / 50));
            });
        }, 50);

        return () => clearInterval(interval);
    }, [currentUserIndex, currentStoryIndex, isPaused, storyDuration]);

    const goToNextStory = useCallback(() => {
        haptic('light');
        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setProgress(0);
        } else if (currentUserIndex < MOCK_STORIES.length - 1) {
            setCurrentUserIndex(prev => prev + 1);
            setCurrentStoryIndex(0);
            setProgress(0);
        } else {
            navigate(-1);
        }
    }, [currentStoryIndex, currentUserIndex, currentUser, navigate, haptic]);

    const goToPrevStory = useCallback(() => {
        haptic('light');
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setProgress(0);
        } else if (currentUserIndex > 0) {
            setCurrentUserIndex(prev => prev - 1);
            const prevUser = MOCK_STORIES[currentUserIndex - 1];
            setCurrentStoryIndex(prevUser.stories.length - 1);
            setProgress(0);
        }
    }, [currentStoryIndex, currentUserIndex, haptic]);

    const handleTap = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        if (x < width * 0.3) {
            goToPrevStory();
        } else {
            goToNextStory();
        }
    };

    const handleClose = () => {
        haptic('medium');
        navigate(-1);
    };

    if (!currentUser || !currentStory) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <Icon name="sync" className="animate-spin text-white text-2xl" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3 pt-safe">
                {currentUser.stories.map((story, index) => (
                    <div
                        key={story.id}
                        className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden"
                    >
                        <div
                            className="h-full bg-white rounded-full transition-all duration-50"
                            style={{
                                width: index < currentStoryIndex ? '100%' :
                                    index === currentStoryIndex ? `${progress}%` : '0%'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 pt-safe">
                <div className="flex items-center justify-between p-4 pt-8">
                    <div className="flex items-center gap-3">
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-full ring-2 ring-white/30"
                        />
                        <div>
                            <h3 className="text-white font-semibold text-sm">{currentUser.name}</h3>
                            <span className="text-white/60 text-xs">刚刚</span>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <Icon name="close" className="text-white text-xl" />
                    </button>
                </div>
            </div>

            {/* Story Content */}
            <div
                className="flex-1 relative"
                onClick={handleTap}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={currentStory.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                </div>

                {/* Caption */}
                {currentStory.caption && (
                    <div className="absolute bottom-24 left-0 right-0 px-6 z-10">
                        <p className="text-white text-lg font-medium leading-relaxed text-center drop-shadow-lg">
                            {currentStory.caption}
                        </p>
                    </div>
                )}

                {/* Tap zones indicator (only show on pause) */}
                {isPaused && (
                    <div className="absolute inset-0 flex pointer-events-none">
                        <div className="w-1/3 flex items-center justify-center">
                            <Icon name="chevron_left" className="text-white/50 text-4xl" />
                        </div>
                        <div className="w-1/3 flex items-center justify-center">
                            <Icon name="pause" className="text-white/50 text-4xl" />
                        </div>
                        <div className="w-1/3 flex items-center justify-center">
                            <Icon name="chevron_right" className="text-white/50 text-4xl" />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 pb-safe z-10">
                <div className="flex items-center justify-center gap-6 p-6">
                    <button
                        onClick={(e) => { e.stopPropagation(); haptic('medium'); }}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        <Icon name="favorite_border" className="text-lg" />
                        <span className="text-sm font-medium">喜欢</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); haptic('medium'); }}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        <Icon name="send" className="text-lg" />
                        <span className="text-sm font-medium">发送消息</span>
                    </button>
                </div>
            </div>

            {/* User Navigation Dots */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-10">
                {MOCK_STORIES.map((user, index) => (
                    <button
                        key={user.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            haptic('light');
                            setCurrentUserIndex(index);
                            setCurrentStoryIndex(0);
                            setProgress(0);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentUserIndex
                                ? 'bg-white scale-125'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
