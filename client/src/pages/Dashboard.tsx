import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Icon } from '@/components/ui/Icon';
import { ImageViewer } from '@/components/ui/ImageViewer';
import { useTranslation } from '@/hooks/useTranslation';

interface StoryItem {
    id: string;
    name: string;
    avatar: string;
    hasNew: boolean;
    ringColor?: string;
}

interface FeedItem {
    id: string;
    source: string;
    sourceAvatar: string;
    sourceBio?: string;  // User signature/bio
    timestamp: string;
    title: string;
    subtitle?: string;
    coverImage?: string;
    images?: string[];  // Multi-image support
    video?: { url: string; thumbnail: string; duration: string };  // Video support
    audio?: { url: string; duration: string; waveform?: number[] };  // Audio/Voice support
    moreCount?: number;
    type?: 'normal' | 'featured' | 'announcement' | 'insight';
    engagement?: { likes: number; comments: number };

    // WeChat-style link preview
    link?: {
        url: string;
        title: string;
        description?: string;
        image?: string;
        source: string;  // e.g., "得到APP", "微信公众号"
    };

    // Quote/Repost another user's content
    quote?: {
        author: string;
        authorAvatar: string;
        content: string;
        originalId?: string;
    };

    // Check-in / Streak tracking
    checkin?: {
        day: number;
        streak: number;
        badge?: string;
    };
}

// Mock Story Data
const STORIES: StoryItem[] = [
    { id: '0', name: '我的故事', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MyStory&backgroundColor=6B8E8E', hasNew: false, ringColor: '#6B8E8E' },
    { id: '1', name: '小楠', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoNan&backgroundColor=b6e3f4', hasNew: true, ringColor: '#FF6B6B' },
    { id: '2', name: '话梅', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaMei&backgroundColor=ffd5dc', hasNew: true, ringColor: '#FFE66D' },
    { id: '3', name: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei&backgroundColor=d1d4f9', hasNew: false },
    { id: '4', name: 'Lisa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=b6e3f4', hasNew: true, ringColor: '#9B59B6' },
    { id: '5', name: '老陈', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen&backgroundColor=c0aede', hasNew: false },
];

// Mock Feed Data
const FEED_DATA: FeedItem[] = [
    {
        id: 'featured-1',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '置顶',
        title: '播下一种思想，收获一种行动；播下一种行动，收获一种习惯',
        coverImage: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80',
        type: 'featured',
    },
    {
        id: '1',
        source: '小楠',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoNan&backgroundColor=b6e3f4',
        sourceBio: '专注当下，感恩每一刻',
        timestamp: '10分钟前',
        title: '今天的觉察日记：面对焦虑，我选择了深呼吸',
        coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
        engagement: { likes: 24, comments: 8 },
    },
    // AI Insight - Weekly report
    {
        id: '2',
        source: '小凡洞察',
        sourceAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=XiaoFan&backgroundColor=c0aede',
        timestamp: '30分钟前',
        title: '✨ 你上周的专注时长比前周提升了 28%',
        subtitle: '保持这种进步速度，你正在重塑一个新的自己。本周建议：尝试在晨读后进行3分钟冥想，巩固学习效果。',
        type: 'insight',
    },
    // AI Insight - Milestone
    {
        id: 'insight-2',
        source: '小凡洞察',
        sourceAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=XiaoFan&backgroundColor=c0aede',
        timestamp: '2小时前',
        title: '🎯 恭喜你完成习惯一的全部课程！',
        subtitle: '你已经掌握了\"积极主动\"的核心理念。接下来，习惯二\"以终为始\"将帮助你找到人生方向。',
        type: 'insight',
    },
    {
        id: '3',
        source: '科维解读',
        sourceAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KW&backgroundColor=0a5b83',
        timestamp: '1小时前',
        title: '习惯一深度解析：积极主动的真正含义',
        subtitle: '在刺激与回应之间，有一个空间。那个空间里，存放着我们选择回应的力量。',
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
        moreCount: 3,
        engagement: { likes: 156, comments: 42 },
    },
    {
        id: '4',
        source: '话梅',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaMei&backgroundColor=ffd5dc',
        sourceBio: '终身学习者 | 每日读书',
        timestamp: '2小时前',
        title: '读书笔记｜以原则为中心的思维方式',
        engagement: { likes: 18, comments: 5 },
    },
    {
        id: '5',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '今天 06:30',
        title: '📢 晨读时间到！今天我们一起读习惯二「以终为始」',
        // No special type - rendered as normal post from official account
    },
    // Meditation announcement - now a normal post
    {
        id: 'ann-2',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '昨天 22:00',
        title: '🧘 明早共修预告：6:30 晨读 + 6:55 五分钟冥想',
        subtitle: '主题：觉察呼吸，回归当下',
    },
    // Camp enrollment - now a normal post
    {
        id: 'ann-3',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '3天前',
        title: '🎉 恭喜你被【高效能人士的七个习惯】第3期晨读营录取！',
        subtitle: '请在 48 小时内完成缴费确认入营资格。开营日期：1月15日',
    },
    {
        id: '6',
        source: '张伟',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei&backgroundColor=d1d4f9',
        sourceBio: '产品经理 | 读书第7天',
        timestamp: '昨天',
        title: '我的第一周总结：从被动到主动的转变',
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80',
        engagement: { likes: 45, comments: 12 },
    },
    {
        id: '7',
        source: '王强',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob&backgroundColor=a3d9ff',
        sourceBio: '创业者 | 思考者',
        timestamp: '昨天',
        title: '关于"积极主动"的深度思考',
        subtitle: '今天读到了关于"积极主动"的章节，深受触动。积极主动不仅仅是采取行动，更是对自己的人生负责。我们要认识到，在刺激与回应之间，我们有选择的自由。这种选择的自由包括了我们的自我意识、想象力、良知和独立意志。当我们能够运用这些天赋去选择回应方式时，我们就掌握了人生的主动权，不再是环境的受害者。',
        engagement: { likes: 32, comments: 15 },
    },
    {
        id: '8',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '昨天',
        title: '本周聊天局｜周日晚 20:00，不见不散',
        subtitle: '主题：如何在忙碌中保持觉察？',
    },
    {
        id: '9',
        source: 'Lisa',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=b6e3f4',
        timestamp: '2天前',
        title: '心得体会：成熟模式图给我的启发',
        moreCount: 2,
        engagement: { likes: 45, comments: 12 },
    },
    // Multi-image examples
    {
        id: '10',
        source: '小楠',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoNan&backgroundColor=b6e3f4',
        timestamp: '3天前',
        title: '周末爬山，两张美景分享～',
        images: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
            'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&q=80',
        ],
        engagement: { likes: 56, comments: 8 },
    },
    {
        id: '11',
        source: '话梅',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaMei&backgroundColor=ffd5dc',
        timestamp: '3天前',
        title: '读书角布置完成！三张图记录过程',
        images: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
            'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=80',
        ],
        engagement: { likes: 78, comments: 15 },
    },
    {
        id: '12',
        source: '张伟',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei&backgroundColor=d1d4f9',
        timestamp: '4天前',
        title: '晨读营线下聚会回顾（6图）',
        images: [
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
            'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80',
            'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80',
            'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&q=80',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
            'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=400&q=80',
        ],
        engagement: { likes: 134, comments: 28 },
    },
    {
        id: '13',
        source: '老陈',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen&backgroundColor=c0aede',
        timestamp: '5天前',
        title: '我的书架整理前后对比（9宫格）',
        images: [
            'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80',
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
            'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&q=80',
            'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80',
            'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80',
        ],
        engagement: { likes: 201, comments: 45 },
    },
    {
        id: '14',
        source: 'Lisa',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=b6e3f4',
        timestamp: '5天前',
        title: '我的一周读书记录（7图）',
        images: [
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
            'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
            'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=80',
        ],
        engagement: { likes: 88, comments: 22 },
    },
    {
        id: '15',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '6天前',
        title: '本周精彩回顾视频',
        video: {
            url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
            duration: '3:42',
        },
        engagement: { likes: 312, comments: 56 },
    },
    {
        id: '16',
        source: '小楠',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoNan&backgroundColor=b6e3f4',
        sourceBio: '专注当下，感恩每一刻',
        timestamp: '1周前',
        title: '今日觉察语音分享',
        audio: {
            url: 'https://sample-audio.com/audio.mp3',
            duration: '2:18',
            waveform: [0.2, 0.4, 0.6, 0.8, 1, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6, 0.8, 0.9, 0.7, 0.5, 0.3, 0.2, 0.4, 0.6, 0.5],
        },
        engagement: { likes: 45, comments: 8 },
    },
    // Poll example
    {
        id: '17',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '1周前',
        title: '📊 本周投票：你最喜欢哪个习惯？',
        subtitle: '习惯一：积极主动\n习惯二：以终为始\n习惯三：要事第一',
        engagement: { likes: 89, comments: 34 },
    },
    // Link preview example  
    {
        id: '18',
        source: '话梅',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaMei&backgroundColor=ffd5dc',
        sourceBio: '终身学习者 | 每日读书',
        timestamp: '1周前',
        title: '推荐一篇关于习惯养成的好文章，值得一读！',
        link: {
            url: 'https://dedao.cn/article/xxx',
            title: '如何在21天内养成一个好习惯',
            description: '习惯的养成需要21天？科学研究告诉你真相，以及更有效的习惯养成方法...',
            image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&q=80',
            source: '得到APP',
        },
        engagement: { likes: 67, comments: 12 },
    },
    // Quote/Repost example
    {
        id: '19',
        source: '老陈',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen&backgroundColor=c0aede',
        sourceBio: '读书第30天 | 坚持就是胜利',
        timestamp: '1周前',
        title: '这段话说得太好了！每次读都有新的感悟。',
        quote: {
            author: '张伟',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei&backgroundColor=d1d4f9',
            content: '积极主动不是冲动行事，而是在刺激与回应之间保持觉察。我们无法控制发生在自己身上的事，但我们可以选择如何回应。',
        },
        engagement: { likes: 23, comments: 5 },
    },
    // Achievement/Badge - now a normal post from晨读营
    {
        id: '20',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '2周前',
        title: '🏆 恭喜 Lisa 获得「连续打卡7天」徽章！',
        subtitle: '坚持是最好的老师，继续加油！',
    },
    // Check-in example
    {
        id: '21',
        source: 'Lisa',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=b6e3f4',
        sourceBio: '设计师 | 读书第14天',
        timestamp: '2周前',
        title: '今天读了习惯三"要事第一"，学会了时间管理四象限。明天继续！',
        checkin: {
            day: 14,
            streak: 14,
            badge: '🔥',
        },
        engagement: { likes: 156, comments: 28 },
    },
];

// Story Bubble Component
const StoryBubble: React.FC<{
    story: StoryItem;
    isFirst?: boolean;
    onClick?: () => void;
}> = ({ story, isFirst, onClick }) => {
    return (
        <div
            className="flex flex-col items-center gap-1.5 min-w-[68px] cursor-pointer group"
            onClick={onClick}
        >
            <div
                className="p-[2.5px] rounded-full transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
                style={{
                    background: story.hasNew
                        ? `linear-gradient(135deg, ${story.ringColor || '#FF9A56'}, #FF6B6B, #FFE66D)`
                        : 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
                }}
            >
                <div className="p-[2px] rounded-full bg-white dark:bg-[#111]">
                    <div className="relative">
                        <img
                            src={story.avatar}
                            alt={story.name}
                            className="w-[52px] h-[52px] rounded-full object-cover"
                        />
                        {isFirst && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white dark:border-[#111] shadow-sm">
                                <Icon name="add" className="text-[10px] text-white" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400 truncate max-w-[60px] text-center font-medium">
                {story.name}
            </span>
        </div>
    );
};

// Expandable Text Component
const ExpandableText: React.FC<{
    text: string;
    limit?: number;
    className?: string;
}> = ({ text, limit = 80, className = '' }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    if (text.length <= limit || isExpanded) {
        return <p className={className}>{text}</p>;
    }

    return (
        <div className={className}>
            <p className="inline">
                {`${text.slice(0, limit)}...`}
            </p>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                }}
                className="inline-block ml-1 text-primary font-medium hover:underline focus:outline-none"
            >
                全文
            </button>
        </div>
    );
};

// Image Grid Component (Twitter/WeChat style)
const ImageGrid: React.FC<{
    images: string[];
    onImageClick?: (index: number) => void;
}> = ({ images, onImageClick }) => {
    const count = images.length;

    // Different layouts based on image count
    const getGridClass = () => {
        switch (count) {
            case 1: return 'grid-cols-1';
            case 2: return 'grid-cols-2';
            case 3: return 'grid-cols-3';
            case 4: return 'grid-cols-2';
            default: return 'grid-cols-3'; // 6, 9+
        }
    };

    const getImageClass = (index: number) => {
        // Special cases for aspect ratios
        if (count === 1) return 'aspect-video';
        if (count === 2) return 'aspect-square';
        if (count === 3) {
            return index === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square';
        }
        return 'aspect-square';
    };

    // Limit to 9 images max, show overlay for more
    const displayImages = images.slice(0, 9);
    const hasMore = images.length > 9;

    return (
        <div className={`mt-2.5 grid ${getGridClass()} gap-1 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800`}>
            {displayImages.map((img, index) => (
                <div
                    key={index}
                    className={`relative ${getImageClass(index)} overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onImageClick?.(index);
                    }}
                >
                    <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {/* Show +N overlay on last image if more than 9 */}
                    {hasMore && index === 8 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">+{images.length - 9}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Video Player Component
const VideoPlayer: React.FC<{ video: { url: string; thumbnail: string; duration: string } }> = ({ video }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
        <div
            className="mt-2.5 relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer group"
            onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
            }}
        >
            {!isPlaying ? (
                <>
                    <img
                        src={video.thumbnail}
                        alt=""
                        className="w-full aspect-video object-cover"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                            <Icon name="play_arrow" className="text-[32px] text-gray-800 ml-1" />
                        </div>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-[12px] font-medium">
                        {video.duration}
                    </div>
                </>
            ) : (
                <video
                    src={video.url}
                    poster={video.thumbnail}
                    controls
                    autoPlay
                    className="w-full aspect-video object-cover"
                />
            )}
        </div>
    );
};

// Audio Player Component (WeChat voice style)
const AudioPlayer: React.FC<{ audio: { url: string; duration: string; waveform?: number[] } }> = ({ audio }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    // Generate waveform bars
    const waveformBars = audio.waveform || Array(20).fill(0).map(() => Math.random() * 0.8 + 0.2);

    return (
        <div
            className="mt-2.5 flex items-center gap-3 p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 cursor-pointer group"
            onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
            }}
        >
            {/* Play/Pause Button */}
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-primary' : 'bg-primary/80'}`}>
                <Icon
                    name={isPlaying ? 'pause' : 'play_arrow'}
                    className="text-[20px] text-white"
                />
            </div>

            {/* Waveform */}
            <div className="flex-1 flex items-center gap-[2px] h-8">
                {waveformBars.map((height, index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-full transition-colors ${isPlaying ? 'bg-primary' : 'bg-primary/50'}`}
                        style={{
                            height: `${height * 100}%`,
                            animationDelay: isPlaying ? `${index * 50}ms` : '0ms'
                        }}
                    />
                ))}
            </div>

            {/* Duration */}
            <span className="shrink-0 text-[13px] font-medium text-primary">
                {audio.duration}
            </span>
        </div>
    );
};

// Card Options Menu Component (Twitter-style)
const CardOptionsMenu: React.FC<{ itemId: string }> = ({ itemId }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleAction = (action: string) => {
        console.log(`Action: ${action} for item ${itemId}`);
        setIsOpen(false);
        // TODO: Implement actual actions (hide, block, report)
    };

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1.5 -mr-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <Icon name="more_vert" className="text-[18px] text-gray-300 dark:text-gray-600" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    />
                    {/* Menu */}
                    <div className="absolute right-0 top-8 z-50 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 animate-fade-in">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAction('hide'); }}
                            className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3"
                        >
                            <Icon name="visibility_off" className="text-[18px] text-gray-400" />
                            隐藏这条内容
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAction('not_interested'); }}
                            className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3"
                        >
                            <Icon name="thumb_down" className="text-[18px] text-gray-400" />
                            对此不感兴趣
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAction('block'); }}
                            className="w-full px-4 py-2.5 text-left text-[14px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3"
                        >
                            <Icon name="block" className="text-[18px] text-gray-400" />
                            屏蔽此用户
                        </button>
                        <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAction('report'); }}
                            className="w-full px-4 py-2.5 text-left text-[14px] text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3"
                        >
                            <Icon name="flag" className="text-[18px]" />
                            举报
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// WeChat-style Link Preview Card Component
const LinkPreviewCard: React.FC<{ link: NonNullable<FeedItem['link']> }> = ({ link }) => {
    return (
        <div
            className="mt-2.5 flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={(e) => {
                e.stopPropagation();
                window.open(link.url, '_blank');
            }}
        >
            {/* Thumbnail */}
            {link.image && (
                <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                        src={link.image}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <h4 className="text-[14px] font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                    {link.title}
                </h4>
                {link.description && (
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {link.description}
                    </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                    <Icon name="link" className="text-[12px] text-gray-400" />
                    <span className="text-[11px] text-gray-400">{link.source}</span>
                </div>
            </div>
        </div>
    );
};

// WeChat-style Quote/Repost Card Component
const QuoteCard: React.FC<{ quote: NonNullable<FeedItem['quote']> }> = ({ quote }) => {
    return (
        <div className="mt-2.5 pl-3 border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 rounded-r-lg py-2.5 pr-3">
            <div className="flex items-center gap-2 mb-1.5">
                <img
                    src={quote.authorAvatar}
                    alt={quote.author}
                    className="w-5 h-5 rounded object-cover"
                />
                <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
                    @{quote.author}
                </span>
            </div>
            <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {quote.content}
            </p>
        </div>
    );
};

// Check-in / Streak Card Component
const CheckinBadge: React.FC<{ checkin: NonNullable<FeedItem['checkin']> }> = ({ checkin }) => {
    return (
        <div className="mt-2.5 flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/50">
            {/* Badge Icon */}
            <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">{checkin.badge || '🎯'}</span>
            </div>
            {/* Stats */}
            <div className="flex-1">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        第{checkin.day}天
                    </span>
                    {checkin.streak > 1 && (
                        <span className="text-[13px] text-amber-500 dark:text-amber-500/80">
                            连续{checkin.streak}天
                        </span>
                    )}
                </div>
                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 w-full bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((checkin.day / 21) * 100, 100)}%` }}
                    />
                </div>
                <p className="mt-1 text-[11px] text-amber-600/70 dark:text-amber-400/70">
                    21天习惯养成进度
                </p>
            </div>
        </div>
    );
};

// Premium Feed Card Component
const FeedCard: React.FC<{
    item: FeedItem;
    onClick?: () => void;
}> = ({ item, onClick }) => {
    const isFeatured = item.type === 'featured';
    const isInsight = item.type === 'insight';
    // announcement no longer has special styling - treated as normal post from 晨读营 account

    // ImageViewer state
    const [viewerOpen, setViewerOpen] = React.useState(false);
    const [viewerIndex, setViewerIndex] = React.useState(0);

    const handleImageClick = (index: number) => {
        setViewerIndex(index);
        setViewerOpen(true);
    };

    if (isFeatured) {
        return (
            <article
                onClick={onClick}
                className={`relative mx-4 mb-5 rounded-2xl overflow-hidden group aspect-video ${onClick ? 'cursor-pointer' : ''}`}
            >
                {/* Background Image - Sunrise */}
                <div className="absolute inset-0">
                    <img
                        src={item.coverImage}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Content - Quote Left, Button Right */}
                {/* Content Container - Min height for aspect ratio, centered content */}
                <div className="relative h-full p-6 flex flex-col justify-center">
                    {/* Quote - Centered */}
                    <div className="pr-12 z-10">
                        <h2 className="text-[17px] font-medium text-white leading-relaxed">
                            {item.title.split(/([，,。.;；?!？！\s])/).map((part, index) => (
                                <React.Fragment key={index}>
                                    {part}
                                    {/[，,。.;；?!？！\s]/.test(part) && <br />}
                                </React.Fragment>
                            ))}
                        </h2>
                    </div>

                    {/* Arrow Icon - Absolute Right Center */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                        <Icon name="chevron_right" className="text-[32px] text-white/90" />
                    </div>
                </div>
            </article>
        );
    }

    if (isInsight) {
        return (
            <article
                onClick={onClick}
                className={`px-4 py-4 ${onClick ? 'cursor-pointer' : ''}
                    border-b border-gray-100 dark:border-gray-800
                    ${onClick ? 'hover:bg-gray-50 dark:hover:bg-white/5' : ''}
                    transition-colors duration-200
                    flex gap-3`}
            >
                {/* Left Column: AI Avatar */}
                <div className="shrink-0">
                    <img
                        src={item.sourceAvatar}
                        alt={item.source}
                        className="w-10 h-10 rounded-lg object-cover ring-2 ring-purple-200 dark:ring-purple-800 shadow-sm"
                    />
                </div>

                {/* Right Column: Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                {item.source}
                            </span>
                            <span className="text-[13px] text-gray-400">· {item.timestamp}</span>
                        </div>
                        <CardOptionsMenu itemId={item.id} />
                    </div>

                    <h3 className="text-[15px] text-gray-800 dark:text-gray-200 leading-snug mb-1">
                        {item.title}
                    </h3>
                    {item.subtitle && (
                        <ExpandableText
                            text={item.subtitle}
                            className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed"
                        />
                    )}
                </div>
            </article>
        );
    }

    // Normal Card (Twitter Style - Flat)
    return (
        <article
            onClick={onClick}
            className={`px-4 py-4 ${onClick ? 'cursor-pointer' : ''}
                border-b border-gray-100 dark:border-gray-800
                ${onClick ? 'hover:bg-gray-50 dark:hover:bg-white/5' : ''}
                transition-colors duration-200
                flex items-start gap-3`}
        >
            {/* Left Column: Avatar */}
            <div className="shrink-0">
                <img
                    src={item.sourceAvatar}
                    alt={item.source}
                    className="w-10 h-10 rounded-md object-cover ring-1 ring-white dark:ring-gray-900 bg-gray-100 dark:bg-gray-800"
                />
            </div>

            {/* Right Column: Content */}
            <div className="flex-1 min-w-0 pt-[2px]">
                {/* Header with Name, Bio, and Menu */}
                <div className="flex items-start justify-between mb-1">
                    {/* Left: Name + Bio */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate leading-none">
                                {item.source}
                            </span>
                            <span className="text-[13px] text-gray-400 shrink-0 leading-none">
                                · {item.timestamp}
                            </span>
                        </div>
                        {/* User Bio/Signature - directly under name */}
                        {item.sourceBio && (
                            <p className="text-[12px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                {item.sourceBio}
                            </p>
                        )}
                    </div>
                    {/* Right: Menu */}
                    <CardOptionsMenu itemId={item.id} />
                </div>

                {/* Text Content - Only show if no cover image, or show above image if no subtitle */}
                {(!item.coverImage || !item.subtitle) && (
                    <div className="mb-2">
                        <h2 className="text-[15px] text-gray-800 dark:text-gray-200 leading-snug mb-1">
                            {item.title}
                        </h2>
                        {item.subtitle && (
                            <ExpandableText
                                text={item.subtitle}
                                className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed"
                            />
                        )}
                    </div>
                )}

                {/* Article Card with Image - Title overlayed on image */}
                {item.coverImage && item.subtitle && (
                    <div className="mt-1 relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <img
                            src={item.coverImage}
                            alt=""
                            className="w-full h-48 object-cover"
                        />
                        {/* Overlay Gradient and Text */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h2 className="text-[15px] font-bold text-white leading-snug mb-1">
                                {item.title}
                            </h2>
                            <p className="text-[13px] text-white/80 line-clamp-2">
                                {item.subtitle}
                            </p>
                        </div>
                    </div>
                )}

                {/* Simple Image without subtitle (user post style) */}
                {item.coverImage && !item.subtitle && !item.images && (
                    <div className="mt-2.5 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <img
                            src={item.coverImage}
                            alt=""
                            className="w-full h-48 object-cover hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                )}

                {/* Multi-image Grid */}
                {item.images && item.images.length > 0 && (
                    <ImageGrid images={item.images} onImageClick={handleImageClick} />
                )}

                {/* Video Player */}
                {item.video && (
                    <VideoPlayer video={item.video} />
                )}

                {/* Audio Player */}
                {item.audio && (
                    <AudioPlayer audio={item.audio} />
                )}

                {/* Link Preview (WeChat-style) */}
                {item.link && (
                    <LinkPreviewCard link={item.link} />
                )}

                {/* Quote/Repost (WeChat-style) */}
                {item.quote && (
                    <QuoteCard quote={item.quote} />
                )}

                {/* Check-in Badge */}
                {item.checkin && (
                    <CheckinBadge checkin={item.checkin} />
                )}
            </div>

            {/* Image Viewer Modal */}
            {item.images && item.images.length > 0 && (
                <ImageViewer
                    images={item.images}
                    initialIndex={viewerIndex}
                    isOpen={viewerOpen}
                    onClose={() => setViewerOpen(false)}
                />
            )}
        </article>
    );
};

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { t, locale } = useTranslation();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#111111' : '#FFFFFF');

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#111] font-sans pb-24">
            {/* Header - 朝友圈模式 */}
            <header className="sticky top-0 z-40 pt-safe bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800/50">
                <div className="h-[44px] flex items-center justify-between px-4">
                    {/* Left: Message Entry (朝友圈模式) */}
                    <button
                        onClick={() => navigate('/interactions')}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    >
                        <Icon name="chat_bubble_outline" className="text-[22px] text-gray-600 dark:text-gray-300" />
                        {/* Red dot for unread */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    <h1 className="text-[17px] font-semibold text-gray-900 dark:text-white tracking-tight">
                        {locale === 'zh-CN' ? '凡人晨读' : 'Morning Reader'}
                    </h1>
                    {/* Right: empty spacer for symmetry */}
                    <div className="w-10" />
                </div>
            </header>

            {/* Feed */}
            <section className="pt-4">
                {FEED_DATA.map((item) => {
                    // Apply interaction rules based on content type
                    // - featured: Navigate to reading page
                    // - insight: Can navigate to detail (deep content)
                    // - announcement: No navigation (lightweight notification)
                    // - normal with long content (subtitle): Can navigate to detail
                    // - normal without subtitle (short/Story-like): No navigation, only image viewer works
                    const isLongContent = item.subtitle && item.subtitle.length > 50;
                    const canNavigate = item.type === 'featured' || item.type === 'insight' || isLongContent;

                    return (
                        <FeedCard
                            key={item.id}
                            item={item}
                            onClick={canNavigate ? () => navigate(`/feed/${item.id}`) : undefined}
                        />
                    );
                })}

                {/* End of Feed */}
                <div className="flex items-center justify-center py-8 text-gray-300 dark:text-gray-700">
                    <Icon name="spa" className="text-xl" />
                    <span className="ml-2 text-xs font-medium tracking-wide">已达彼岸</span>
                </div>
            </section>
        </div>
    );
};
