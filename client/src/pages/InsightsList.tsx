
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';

// Mock Data for Insights
const MOCK_INSIGHTS = [
    {
        id: '100',
        date: '2026-01-01',
        title: '统合综效：从“教育”到“看见”',
        summary: '话梅，你将“统合综效”与“爱的四种美”深度融合，在与表妹的互动中，你从“教育者”转变为“陪伴者”，这正是统合综效的生命力所在。',
        tags: ['统合综效', '爱的四种美', '深度觉察'],
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
    {
        id: '1',
        date: '2026-01-01',
        title: '关于“拖延”的深层看见',
        summary: '你对完成任务的抗拒，其实来源于对完美的过度追求。试着允许自己“先完成，再完美”。',
        tags: ['心理模式', '行动建议'],
        content: '你对完成任务的抗拒，其实来源于对完美的过度追求。试着允许自己“先完成，再完美”。'
    },
    {
        id: '2',
        date: '2025-12-30',
        title: '在冲突中看见“期待”',
        summary: '在与同事的争执中，我看到你渴望被尊重和认可。这份期待是正当的，但表达方式可以更柔软。',
        tags: ['人际关系', '情绪觉察']
    },
    {
        id: '3',
        date: '2025-12-28',
        title: '焦虑背后的力量',
        summary: '你的焦虑其实是一种未被引导的创造力。当你开始行动，焦虑就会转化为心流。',
        tags: ['能量转化']
    }
];

export const InsightsList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0A0A0A] pb-24 font-sans">
            {/* Header */}
            <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#FDFDFD]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Icon name="arrow_back" />
                    </button>
                    <h1 className="text-2xl font-serif font-bold text-text-main dark:text-white">小凡看见</h1>
                </div>
                <div className="w-10"></div>
            </div>

            {/* List */}
            <div className="px-6 space-y-4">
                {MOCK_INSIGHTS.map((insight) => (
                    <div
                        key={insight.id}
                        className="bg-white dark:bg-[#151515] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg text-text-main dark:text-white group-hover:text-purple-500 transition-colors">
                                {insight.title}
                            </h3>
                            <span className="text-xs text-gray-400">{insight.date}</span>
                        </div>
                        <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed mb-4">
                            {insight.summary}
                        </p>
                        <div className="flex gap-2">
                            {insight.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-md font-bold">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-10">
                <p className="text-xs text-gray-300">更多看见正在生成中...</p>
            </div>
        </div>
    );
};
