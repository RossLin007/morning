import { MorningCamp } from '@/types';

export const currentCamp: MorningCamp = {
    id: 'camp-008',
    period: 8,
    theme: '勇敢的心',
    startDate: '2025-10-11',
    endDate: '2025-11-02',
    dailyStartTime: '06:00',
    dailyEndTime: '07:00',
    price: 1800,
    enrollmentCap: 10,
    status: 'recruiting',

    marketing: {
        heroImage: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2070&auto=format&fit=crop',
        corePhilosophy: '早起 · 读书 · 谈心\n基于《高效能人士的七个习惯》，打造由内而外的成长之道。',
        features: [
            '小班深度 (10人/班)',
            '专业用心陪伴',
            '安全支持场域',
            '每日心行修炼'
        ],
        agreements: [
            '不评判：没有对错，只有不同视角',
            '保密性：出营即忘，守护安全场域',
            '真诚性：允许不完美，真实的连接'
        ]
    },

    team: [
        { userId: 'u1', name: '小凡', role: 'leader', avatar: '/avatars/fan.jpg' },
        { userId: 'u2', name: '康康', role: 'leader' },
    ],

    schedule: [
        { day: 1, date: '2025-10-11', title: 'Day 1: 品德成功论', readingMaterial: '第一章', themeFocus: '由内而外', reflectionQuestion: '你认为什么是成功？' },
        { day: 2, date: '2025-10-12', title: 'Day 2: 思维方式的力量', readingMaterial: '第一章', themeFocus: '思维转换', reflectionQuestion: '你有过思维转换的时刻吗？' },
        { day: 3, date: '2025-10-13', title: 'Day 3: 以原则为中心的思维方式', readingMaterial: '第一章', themeFocus: '原则', reflectionQuestion: '你生活的中心是什么？' },
        { day: 4, date: '2025-10-14', title: 'Day 4: 成长和改变的原则', readingMaterial: '第一章', themeFocus: '过程', reflectionQuestion: '由于缺乏耐心，你错过了什么？' },
        { day: 5, date: '2025-10-15', title: 'Day 5: 品德是习惯的合成', readingMaterial: '第二章', themeFocus: '习惯', reflectionQuestion: '你想改变的一个习惯是什么？' },
        { day: 6, date: '2025-10-16', title: 'Day 6: 成熟模式图', readingMaterial: '第二章', themeFocus: '成熟', reflectionQuestion: '你在哪个阶段（依赖/独立/互赖）？' },
        { day: 7, date: '2025-10-17', title: 'Day 7: 积极主动', readingMaterial: '习惯一', themeFocus: '选择的自由', reflectionQuestion: '在刺激和回应之间，你有选择吗？' },
        // ... Simplified for brevity, usually 23 days
        { day: 23, date: '2025-11-02', title: 'Day 23: 结营仪式', readingMaterial: '全书回顾', themeFocus: '新的开始', reflectionQuestion: '这23天，你最大的收获是什么？' }
    ]
};
