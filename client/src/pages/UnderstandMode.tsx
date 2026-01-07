import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/hooks/useTranslation';
import { useThemeColor } from '@/hooks/useThemeColor';

export const UnderstandMode: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#000000' : '#FFFFFF');

    return (
        <div className="min-h-screen bg-white dark:bg-[#111] pb-10">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 dark:text-gray-400">
                        <Icon name="arrow_back" className="text-[24px]" />
                    </button>
                    <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">了解晨读模式</h1>
                    <div className="w-10" />
                </div>
            </header>

            <div className="max-w-md mx-auto p-5 space-y-10">
                {/* 1. Core Philosophy */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">核心理念</h2>
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 text-center space-y-3">
                        <p className="text-2xl font-serif text-primary">早起 · 读书 · 谈心</p>
                        <div className="h-px w-20 bg-primary/20 mx-auto" />
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            基于《高效能人士的七个习惯》<br />
                            打造由内而外的成长之道<br />
                            品德是地基，行为是外墙
                        </p>
                    </div>
                </section>

                {/* 2. Seven Habits Framework */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">成长路径</h2>
                    <div className="grid gap-3">
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                            <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-2">个人领域的成功</h3>
                            <ul className="text-sm text-orange-600/80 dark:text-orange-300/80 space-y-1">
                                <li>• 习惯一：积极主动</li>
                                <li>• 习惯二：以终为始</li>
                                <li>• 习惯三：要事第一</li>
                            </ul>
                            <div className="mt-3 text-xs font-medium text-orange-500 bg-white dark:bg-black/20 inline-block px-2 py-1 rounded">
                                从依赖 → 独立
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">公众领域的成功</h3>
                            <ul className="text-sm text-blue-600/80 dark:text-blue-300/80 space-y-1">
                                <li>• 习惯四：双赢思维</li>
                                <li>• 习惯五：知彼解己</li>
                                <li>• 习惯六：统合综效</li>
                            </ul>
                            <div className="mt-3 text-xs font-medium text-blue-500 bg-white dark:bg-black/20 inline-block px-2 py-1 rounded">
                                从独立 → 互赖
                            </div>
                        </div>

                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                            <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">自我更新</h3>
                            <ul className="text-sm text-green-600/80 dark:text-green-300/80 space-y-1">
                                <li>• 习惯七：不断更新 (身心灵智)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. Daily Flow (10 Steps) */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">每日心行修炼 (6:00-7:00)</h2>
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10" />

                        <div className="space-y-6 relative z-10">
                            {[
                                { step: 1, title: '【早起】', desc: '对自己承诺，从“我必须”到“我选择”' },
                                { step: 2, title: '【等待】', desc: '5:50等候，安住当下，练习耐心' },
                                { step: 3, title: '【静心】', desc: '呼吸冥想，收摄心神，练习专注' },
                                { step: 4, title: '【共读】', desc: '空杯心态，集体朗读，感受能量' },
                                { step: 5, title: '【倾听】', desc: '为理解而听，不打断，练习同理' },
                                { step: 6, title: '【分享】', desc: '真实的表达，展现脆弱，练习勇气' },
                                { step: 7, title: '【回应】', desc: '肯定式回应，不评判，练习慈悲' },
                                { step: 8, title: '【总结】', desc: '提炼共性，整合碎片，系统理解' },
                                { step: 9, title: '【祝福】', desc: '正向仪式，开启一天，练习感恩' },
                                { step: 10, title: '【回顾】', desc: '觉察日记，反省内化，知行合一' },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Our Agreements */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">我们的约定</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10">
                            <Icon name="visibility" className="text-purple-500" />
                            <div>
                                <h4 className="font-bold text-purple-700 dark:text-purple-400">不评判</h4>
                                <p className="text-xs text-purple-600/70 dark:text-purple-400/70">没有对错，只有不同视角</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/10">
                            <Icon name="lock" className="text-cyan-500" />
                            <div>
                                <h4 className="font-bold text-cyan-700 dark:text-cyan-400">保密性</h4>
                                <p className="text-xs text-cyan-600/70 dark:text-cyan-400/70">出营即忘，守护安全场域</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10">
                            <Icon name="favorite" className="text-rose-500" />
                            <div>
                                <h4 className="font-bold text-rose-700 dark:text-rose-400">真诚性</h4>
                                <p className="text-xs text-rose-600/70 dark:text-rose-400/70">允许不完美，真实的连接</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Journal Guide */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">觉察日记指南</h2>
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-2xl p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium italic">
                            “觉察笔记是记录当下觉察的工具，是自省的素材库。”
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-yellow-600 dark:text-yellow-400">1. 情境：</span>
                                发生了什么？
                            </li>
                            <li className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-yellow-600 dark:text-yellow-400">2. 反应：</span>
                                我怎么想？感受到了什么？
                            </li>
                            <li className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-yellow-600 dark:text-yellow-400">3. 行为：</span>
                                我做了什么？
                            </li>
                            <li className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-yellow-600 dark:text-yellow-400">4. 觉察：</span>
                                我看见了什么模式？
                            </li>
                            <li className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-yellow-600 dark:text-yellow-400">5. 计划：</span>
                                下次可以怎么做？
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Footer CTA */}
                <div className="pt-4">
                    <button
                        onClick={() => navigate('/initiate')}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                        加入我们，开启改变
                    </button>
                </div>
            </div>
        </div>
    );
};
