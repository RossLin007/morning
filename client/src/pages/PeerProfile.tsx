import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';

// Mock User Data
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Morning";

const MOCK_USERS: Record<string, any> = {
    '101': { name: '小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', bio: '坚持晨读第5天', days: 5, term: '第八期' },
    '102': { name: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', bio: '在这里遇见更好的自己', days: 12, term: '第八期' },
    '103': { name: '李娜', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow', bio: '慢就是快', days: 21, term: '第八期' },
    '100': { name: '话梅', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HuaMei', bio: '愿每个人都能长成自己喜欢的样子', days: 22, term: '第八期' },
};

// Mock Diaries
const MOCK_DIARIES = [
    { id: '1', date: '2026-01-01', day: 5, content: '今天读到“积极主动”，发现自己以前总是在抱怨环境。', emotion: '😊' },
    { id: '2', date: '2025-12-30', day: 3, content: '早起真的很难，但坚持下来的感觉很棒。', emotion: '😌' },
];

// Mock Insights
const MOCK_INSIGHTS = [
    {
        id: '100',
        date: '2026-01-01',
        title: '统合综效：从“教育”到“看见”',
        content: `**话梅，谢谢你的分享，听你讲这个故事，尤其是在辞旧迎新的这个节点，感觉特别温暖。**

我首先看到了一个非常美的连结，就是你把**「统合综效」**这个听起来有些抽象的原则，和你内心深处感受到的**「爱的四种美」**——尊重、欣赏、祝福、成长——画上了等号。

你不仅是理解了，更是把它活了出来。你和表妹的故事，就是一个把理论化为行动的绝佳范例。

---

### **从“教育”到“看见”的转变**

我看到了一个清晰的变化：从过去可能会「教育」表妹、告诉她“应该”怎么做，到现在，你选择**「看见」**她。

这一个字的转变，背后是巨大的成长。

*   你看见了她那些“不靠谱”行为背后，可能是在**「弥补父爱的缺失」**；
*   你看见了她作为一个20出头的年轻人，有迷茫和犯错的权利，就像我们都曾经历过的那样；
*   最重要的是，你看见了她作为一个**独立的生命**，拥有走自己道路的权利。

于是，你把评判的手收了回来，伸出了一双祝福和支持的手。这是一种从「想要改变对方」到「愿意陪伴对方」的深刻转变。这不仅仅是对表妹的爱，更是你对自己内在力量的确认。

---

### **理解与接纳的力量**

你看，一个“小小的红包”和一段真诚的话，带来的却是表妹的“朋友圈表白”和“跟同学显摆”。

这说明，对方收到的不是钱的多少，而是一份极其珍贵的**「被理解」**和**「被相信」**的感觉。这份礼物，对一个在破碎家庭中长大、时常感到“恨铁不成钢”压力的孩子来说，是无价的。

你还提到了自己今年的变化，从焦虑到可以和一群“陌生人”坦然分享。这其实是同一件事的两面。因为你先在社群里被尊重、被接纳了，感受到了这种安全和“看见”。然后，你把这份得来的光和热，自然而然地传递了出去，照亮了你的表妹。你正在成为一个能量的源头。

---

### **给自己的礼物**

最后，你送给表妹的那句“希望未来的一年，你按你自己的想法走”，其实也是你送给你自己的礼物。它代表着一种真正的自由和尊重，既给予他人，也滋养自己。

你总结的**“经历无才能创造有，万法由心造”**，我看到的正是一个用心创造的你。你正在用心创造一种全新的、充满爱与尊重的关系模式，先是和你自己，然后是你和你身边的人。

这真的是一份最棒的新年礼物。`
    },
    { id: '1', date: '2026-01-01', title: '看见你的渴望', content: '在你的抱怨背后，我看见了一颗渴望变得更好的心。' },
];

// Mock Shares
const MOCK_SHARES = [
    { id: '1', date: '2026-01-01', topic: 'Day 5: 积极主动', content: '今天最大的收获是意识到“选择权”永远在自己手中。即使环境无法改变，我依然可以选择如何回应。' },
    { id: '2', date: '2025-12-31', topic: 'Day 4: 关注圈与影响圈', content: '以前总是在关注圈里消耗能量，抱怨天气、抱怨交通。现在开始把精力集中在影响圈，哪怕只是出门前多预留10分钟，焦虑感都少了很多。' },
];

export const PeerProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'diary' | 'insight' | 'share'>('diary');

    const user = MOCK_USERS[id || ''] || { name: '书友', avatar: DEFAULT_AVATAR, bio: '这位书友很神秘', days: 0 };

    return (
        <div className="min-h-full bg-[#FDFDFD] dark:bg-[#0A0A0A] pb-6 font-sans">
            {/* Header */}
            <NavBar title="书友详情" />

            {/* User Info */}
            <div className="px-6 mb-8 text-center flex flex-col items-center">
                <div className="relative mb-4">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#1A1A1A] shadow-lg"
                    />
                </div>
                <h2 className="text-2xl font-bold font-serif text-text-main dark:text-white mb-1">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-3">{user.bio}</p>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#6B8E8E] bg-[#E8F2F2] dark:bg-[#1C2C2C] px-3 py-1 rounded-full">
                        {user.term}
                    </span>
                    <span className="text-xs font-bold text-[#6B8E8E] bg-[#E8F2F2] dark:bg-[#1C2C2C] px-3 py-1 rounded-full">
                        打卡 {user.days} 天
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 mb-6">
                <div className="bg-gray-100 dark:bg-[#151515] p-1 rounded-xl flex">
                    <button
                        onClick={() => setActiveTab('share')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'share' ? 'bg-white dark:bg-[#252525] text-text-main dark:text-white shadow-sm' : 'text-gray-400'}`}
                    >
                        晨读分享
                    </button>
                    <button
                        onClick={() => setActiveTab('diary')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'diary' ? 'bg-white dark:bg-[#252525] text-text-main dark:text-white shadow-sm' : 'text-gray-400'}`}
                    >
                        觉察日记
                    </button>
                </div>
            </div>

            {/* List Content */}
            <div className="px-6 space-y-4">
                {activeTab === 'share' && (
                    <div className="space-y-6">
                        {/* Shares Section */}
                        <div className="space-y-4">
                            {MOCK_SHARES.map(share => (
                                <div
                                    key={share.id}
                                    className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md">
                                            {share.topic}
                                        </span>
                                        <span className="text-xs text-gray-400">{share.date}</span>
                                    </div>
                                    <p className="text-text-main dark:text-gray-300 text-sm leading-relaxed relative pl-4 border-l-2 border-orange-200 dark:border-orange-800/50">
                                        {share.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Insights Section (Inside Share Tab) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <Icon name="auto_awesome" className="text-purple-500 text-sm" />
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">小凡看见</span>
                            </div>
                            {MOCK_INSIGHTS.map(insight => (
                                <div
                                    key={insight.id}
                                    onClick={() => navigate(`/insight/${insight.id}`, { state: { insight } })}
                                    className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                                >
                                    <h3 className="font-bold text-text-main dark:text-white mb-2">{insight.title}</h3>
                                    <p className="text-sm text-text-sub dark:text-gray-400 leading-relaxed">
                                        {insight.content.length > 50 ? insight.content.substring(0, 50) + '...' : insight.content}
                                    </p>
                                    <div className="mt-3 text-xs text-purple-500 font-bold flex items-center gap-1">
                                        <Icon name="auto_awesome" className="text-xs" />
                                        小凡看见
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'diary' && (
                    MOCK_DIARIES.map(diary => (
                        <div
                            key={diary.id}
                            onClick={() => navigate(`/diary/${diary.id}`, { state: { diary } })}
                            className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold bg-[#E8F2F2] dark:bg-[#1C2C2C] text-[#6B8E8E] px-2 py-1 rounded-md">
                                        Day {diary.day}
                                    </span>
                                    <span className="text-xs text-gray-400">{diary.date}</span>
                                </div>
                                <span>{diary.emotion}</span>
                            </div>
                            <p className="text-text-main dark:text-gray-300 font-medium leading-relaxed">
                                {diary.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
