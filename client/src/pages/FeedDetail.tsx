import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/contexts/ToastContext';

interface FeedItem {
    id: string;
    type: 'featured' | 'insight' | 'announcement' | 'normal';
    source: string;
    sourceAvatar: string;
    timestamp: string;
    title: string;
    subtitle?: string;
    content?: string;
    coverImage?: string;
    engagement?: { likes: number; comments: number };
}

// Mock Detail Data
const MOCK_FEED_DETAILS: Record<string, FeedItem> = {
    'featured-1': {
        id: 'featured-1',
        type: 'featured',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '今天 06:00',
        title: '📢 Day 5 开启：品德是习惯的合成',
        subtitle: '今日金句',
        content: `### 今日导读

**"播下一种思想，收获一种行动；播下一种行动，收获一种习惯；播下一种习惯，收获一种性格；播下一种性格，收获一种命运。"**
—— 塞缪尔·斯迈尔斯

---

### 📖 阅读任务

今天我们将深入探讨《高效能人士的七个习惯》中关于"品德伦理"的核心理念。

**核心要点：**
1. 习惯是知识、技能和意愿的交集
2. 品德伦理vs个性伦理
3. 由内而外的改变

### ⏰ 晨读安排

- **06:30** 晨读开始
- **06:45** 分享交流
- **07:00** 自由讨论

### 🎯 今日挑战

完成一篇觉察日记，记录今天你观察到的一个"习惯"。`,
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
        engagement: { likes: 234, comments: 56 },
    },
    '1': {
        id: '1',
        type: 'normal',
        source: '小楠',
        sourceAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoNan&backgroundColor=b6e3f4',
        timestamp: '10分钟前',
        title: '今天的觉察日记：面对焦虑，我选择了深呼吸',
        content: `今天早上醒来，发现自己心跳加速，满脑子都是工作的deadline。

以前的我会立刻抓起手机，开始焦虑地刷消息。

但今天，我选择了不同的方式——

我闭上眼睛，做了三次深呼吸。

奇妙的是，当我把注意力放回呼吸上时，那些"必须立刻处理"的想法慢慢退去了。

这让我想起了书中说的：**在刺激与回应之间，有一个空间。**

那个空间，就是我们选择的权利。

今天，我选择了平静。

#觉察日记 #Day5 #积极主动`,
        coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        engagement: { likes: 24, comments: 8 },
    },
    '2': {
        id: '2',
        type: 'insight',
        source: '小凡洞察',
        sourceAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=XiaoFan&backgroundColor=c0aede',
        timestamp: '30分钟前',
        title: '✨ 你上周的专注时长比前周提升了 28%',
        content: `### 📊 你的成长数据

**专注时长**
上周：12.5 小时
前周：9.8 小时
提升：**+28%** 🎉

---

### 🌟 亮点发现

1. **早起习惯形成中**
   连续6天在6:30前起床，比月初提升了40%

2. **阅读深度增加**
   笔记字数增加了35%，说明你在更认真地思考

3. **社区互动活跃**
   本周给书友的评论获得了23个赞

---

### 💡 小凡建议

根据你的学习节奏，建议这周尝试：
- 把晨读时间从15分钟延长到20分钟
- 尝试在觉察日记中加入"感恩"元素
- 找一个学习伙伴互相督促

**保持这种进步速度，你正在重塑一个新的自己！**`,
        engagement: { likes: 45, comments: 12 },
    },
    '3': {
        id: '3',
        type: 'normal',
        source: '科维解读',
        sourceAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KW&backgroundColor=0a5b83',
        timestamp: '1小时前',
        title: '习惯一深度解析：积极主动的真正含义',
        subtitle: '在刺激与回应之间，有一个空间。那个空间里，存放着我们选择回应的力量。',
        content: `### 积极主动 ≠ 盲目乐观

很多人误解了"积极主动"这个概念。

积极主动并不是说要永远保持乐观，也不是说要忽视问题。

真正的积极主动是：**对自己的选择负责**。

---

### 刺激与回应之间的空间

维克多·弗兰克尔在纳粹集中营的经历告诉我们：

> 在刺激与回应之间，有一个空间。在那个空间里，存放着我们选择回应的力量。而我们回应的方式，决定了我们的成长和自由。

这意味着什么？

**我们无法控制发生在我们身上的事情，但我们可以控制我们如何回应。**

---

### 关注圈 vs 影响圈

积极主动的人把精力放在"影响圈"——那些他们能够改变的事情上。

消极被动的人则把精力浪费在"关注圈"——那些他们无能为力的事情上。

**问问自己：今天，你把多少精力放在了影响圈里？**`,
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
        engagement: { likes: 156, comments: 42 },
    },
    '5': {
        id: '5',
        type: 'announcement',
        source: '晨读营',
        sourceAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChenDuYing&backgroundColor=6B8E8E',
        timestamp: '今天 06:30',
        title: '📢 晨读时间到！今天我们一起读习惯二',
        content: `### 习惯二：以终为始

今天我们开始学习第二个习惯——**以终为始**。

---

### 📅 活动安排

| 时间 | 内容 |
|------|------|
| 06:30 | 晨读开始 |
| 06:45 | 主题分享 |
| 07:00 | 互动讨论 |
| 07:15 | 结束 |

---

### 🎯 核心问题

在开始之前，请思考这个问题：

**如果你的人生只剩下一天，你会做什么？**

这个问题的答案，将帮助你理解"以终为始"的真正含义。

---

### 📍 参与方式

腾讯会议：123-456-789
密码：morning

期待你的参与！`,
        engagement: { likes: 89, comments: 23 },
    },
};

export const FeedDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { trigger: haptic } = useHaptics();
    const { showToast } = useToast();

    const [isLiked, setIsLiked] = React.useState(false);

    const feedItem = MOCK_FEED_DETAILS[id || ''] || location.state?.item;

    const handleLike = () => {
        haptic('light');
        setIsLiked(!isLiked);
        showToast(isLiked ? '已取消点赞' : '已点赞', isLiked ? 'info' : 'success');
    };

    const handleShare = () => {
        haptic('medium');
        showToast('分享链接已复制', 'success');
    };

    const handleBookmark = () => {
        haptic('medium');
        showToast('已收藏', 'success');
    };

    if (!feedItem) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-gray-500 gap-4">
                <Icon name="search_off" className="text-4xl opacity-50" />
                <p>内容不存在或已被删除</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-bold"
                >
                    返回
                </button>
            </div>
        );
    }

    const getTypeStyles = () => {
        switch (feedItem.type) {
            case 'featured':
                return {
                    badge: '置顶',
                    badgeClass: 'bg-primary text-white',
                    iconName: 'push_pin',
                };
            case 'insight':
                return {
                    badge: 'AI 洞察',
                    badgeClass: 'bg-purple-500 text-white',
                    iconName: 'auto_awesome',
                };
            case 'announcement':
                return {
                    badge: '公告',
                    badgeClass: 'bg-amber-500 text-white',
                    iconName: 'campaign',
                };
            default:
                return {
                    badge: '',
                    badgeClass: '',
                    iconName: '',
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <div className="min-h-full bg-white dark:bg-[#0A0A0A] font-sans animate-fade-in flex flex-col pb-24">
            {/* Header */}
            <NavBar
                title={
                    <div className="flex items-center gap-2">
                        <img
                            src={feedItem.sourceAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full ring-2 ring-gray-100 dark:ring-gray-800"
                        />
                        <span className="text-sm font-semibold text-text-main dark:text-white">
                            {feedItem.source}
                        </span>
                        {typeStyles.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyles.badgeClass}`}>
                                {typeStyles.badge}
                            </span>
                        )}
                    </div>
                }
                right={
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Icon name="share" className="text-gray-600 dark:text-gray-300" />
                    </button>
                }
            />

            {/* Cover Image */}
            {feedItem.coverImage && (
                <div className="relative w-full h-56 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    <img
                        src={feedItem.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Title Overlay on Image for Featured */}
                    {feedItem.type === 'featured' && (
                        <div className="absolute bottom-4 left-4 right-4">
                            <h1 className="text-xl font-bold text-white leading-snug drop-shadow-lg">
                                {feedItem.title}
                            </h1>
                            <p className="text-white/70 text-sm mt-1">{feedItem.timestamp}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="p-6">
                {/* Title (if not featured with cover) */}
                {!(feedItem.type === 'featured' && feedItem.coverImage) && (
                    <div className="mb-4">
                        <h1 className="text-xl font-bold text-text-main dark:text-white leading-snug mb-2">
                            {feedItem.title}
                        </h1>
                        {feedItem.subtitle && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {feedItem.subtitle}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{feedItem.timestamp}</p>
                    </div>
                )}

                {/* Insight Card Special Header */}
                {feedItem.type === 'insight' && (
                    <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/10 rounded-2xl border border-purple-100/50 dark:border-purple-800/30">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg">
                            <Icon name="auto_awesome" className="text-white text-xl" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400">
                                小凡为你生成的洞察
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                基于你的学习数据分析
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:text-text-main dark:prose-headings:text-white
                    prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-strong:text-text-main dark:prose-strong:text-white
                    prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                    prose-ul:text-gray-600 dark:prose-ul:text-gray-300
                    prose-li:marker:text-primary
                ">
                    {feedItem.content?.split('\n').map((line, i) => {
                        if (line.startsWith('### ')) {
                            return <h3 key={i} className="text-lg font-bold mt-6 mb-3">{line.slice(4)}</h3>;
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
                        }
                        if (line.startsWith('> ')) {
                            return (
                                <blockquote key={i} className="border-l-4 border-primary bg-gray-50 dark:bg-gray-900 py-2 px-4 rounded-r-lg my-4 italic">
                                    {line.slice(2)}
                                </blockquote>
                            );
                        }
                        if (line.startsWith('---')) {
                            return <hr key={i} className="my-6 border-gray-200 dark:border-gray-800" />;
                        }
                        if (line.trim() === '') {
                            return <br key={i} />;
                        }
                        return <p key={i} className="mb-3">{line}</p>;
                    })}
                </div>

                {/* Engagement Stats */}
                {feedItem.engagement && (
                    <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Icon name="favorite" className="text-lg" filled={isLiked} />
                            <span className="text-sm">{feedItem.engagement.likes + (isLiked ? 1 : 0)} 点赞</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Icon name="chat_bubble_outline" className="text-lg" />
                            <span className="text-sm">{feedItem.engagement.comments} 评论</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50">
                <div className="flex items-center justify-around py-3 px-6 pb-safe">
                    <button
                        onClick={handleLike}
                        className={`flex flex-col items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                    >
                        <Icon name="favorite" className="text-xl" filled={isLiked} />
                        <span className="text-[10px] font-medium">喜欢</span>
                    </button>
                    <button
                        onClick={() => navigate(`/post/${id}`)}
                        className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                    >
                        <Icon name="chat_bubble_outline" className="text-xl" />
                        <span className="text-[10px] font-medium">评论</span>
                    </button>
                    <button
                        onClick={handleBookmark}
                        className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                    >
                        <Icon name="bookmark_border" className="text-xl" />
                        <span className="text-[10px] font-medium">收藏</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                    >
                        <Icon name="share" className="text-xl" />
                        <span className="text-[10px] font-medium">分享</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
