
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useGamification } from '@/contexts/GamificationContext';

// --- Mock Data ---
const MOCK_DIMENSIONS = [
    { label: '智识', value: 85, angle: 0 },    // Top
    { label: '情感', value: 70, angle: 60 },   // Top Right
    { label: '社交', value: 65, angle: 120 },  // Bottom Right
    { label: '身体', value: 60, angle: 180 },  // Bottom
    { label: '精神', value: 90, angle: 240 },  // Bottom Left
    { label: '职业', value: 75, angle: 300 },  // Top Left
];

const WEEKLY_ACTIVITY = [
    { day: 'Mon', hours: 1.5, score: 80 },
    { day: 'Tue', hours: 2.0, score: 90 },
    { day: 'Wed', hours: 0.5, score: 60 },
    { day: 'Thu', hours: 1.2, score: 75 },
    { day: 'Fri', hours: 2.5, score: 95 }, // Peak
    { day: 'Sat', hours: 3.0, score: 100 },
    { day: 'Sun', hours: 1.0, score: 70 },
];

const AI_INSIGHT = {
    summary: "这周你的能量主要集中在「精神」与「智识」领域，晨读习惯维持得极好。周五达到了心流巅峰，但周三出现明显波动。",
    suggestion: "建议下周关注「身体」维度的平衡，尝试在晨读前进行5分钟冥想或拉伸。保持这种向上的势头，你正在重塑一个新的自我。",
    tags: ['心流大师', '卓越思辨', '需补足行动力']
};

export const LearningReport: React.FC = () => {
    const navigate = useNavigate();
    const { level } = useGamification();

    // Radar Chart Logic
    const RADIUS = 80;
    const CENTER = 100;

    const getPoint = (value: number, angle: number) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const r = (value / 100) * RADIUS;
        return {
            x: CENTER + r * Math.cos(rad),
            y: CENTER + r * Math.sin(rad)
        };
    };

    const polyPoints = MOCK_DIMENSIONS.map(d => {
        const p = getPoint(d.value, d.angle);
        return `${p.x},${p.y}`;
    }).join(' ');

    const bgPoints = MOCK_DIMENSIONS.map(d => {
        const p = getPoint(100, d.angle);
        return `${p.x},${p.y}`;
    }).join(' ');

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0A0A0A] font-sans animate-fade-in pb-12 transition-colors duration-500">

            {/* Header */}
            {/* Header */}
            <NavBar
                title="成长回顾"
                right={
                    <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <Icon name="ios_share" className="text-text-main dark:text-white" />
                    </button>
                }
            />

            <div className="p-6 space-y-6 max-w-lg mx-auto">

                {/* 1. Soul Passport Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#2C3E50] to-[#000000] dark:from-[#151515] dark:to-[#000000] rounded-[32px] p-8 text-white shadow-2xl shadow-slate-200 dark:shadow-none group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all duration-1000"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="mb-4 relative">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                            <Icon name="auto_awesome" className="text-5xl text-yellow-300 relative z-10" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold mb-1">Week 12</h2>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-8">Soul Operating System</p>

                        <div className="grid grid-cols-3 gap-8 w-full border-t border-white/10 pt-6">
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold font-display">12.5</span>
                                <span className="text-[10px] text-white/40 uppercase mt-1">Hours</span>
                            </div>
                            <div className="flex flex-col items-center border-x border-white/10">
                                <span className="text-2xl font-bold font-display">Lv.{level}</span>
                                <span className="text-[10px] text-white/40 uppercase mt-1">Rank</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold font-display">92%</span>
                                <span className="text-[10px] text-white/40 uppercase mt-1">Focus</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Six Dimensions Radar */}
                <div className="bg-white dark:bg-[#151515] rounded-[24px] p-6 shadow-soft border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="font-bold text-sm text-text-main dark:text-white flex items-center gap-2 font-serif">
                            <Icon name="radar" className="text-primary" />
                            六维成长模型
                        </h3>
                    </div>

                    <div className="flex justify-center relative py-4">
                        <svg width="220" height="220" viewBox="0 0 200 200" className="rotate-0">
                            {/* Background Grid */}
                            {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
                                <polygon
                                    key={scale}
                                    points={MOCK_DIMENSIONS.map(d => {
                                        const p = getPoint(100 * scale, d.angle);
                                        return `${p.x},${p.y}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="1"
                                    className="dark:stroke-gray-800"
                                />
                            ))}

                            {/* Axis Lines */}
                            {MOCK_DIMENSIONS.map((d, i) => {
                                const p = getPoint(100, d.angle);
                                return (
                                    <line
                                        key={i} x1="100" y1="100" x2={p.x} y2={p.y}
                                        stroke="#E5E7EB" strokeWidth="1"
                                        className="dark:stroke-gray-800"
                                    />
                                );
                            })}

                            {/* Data Polygon */}
                            <polygon
                                points={polyPoints}
                                fill="rgba(107, 142, 142, 0.2)"
                                stroke="#6B8E8E"
                                strokeWidth="2"
                                className="drop-shadow-lg"
                            />

                            {/* Data Points */}
                            {MOCK_DIMENSIONS.map((d, i) => {
                                const p = getPoint(d.value, d.angle);
                                return (
                                    <g key={i}>
                                        <circle cx={p.x} cy={p.y} r="3" className="fill-primary stroke-white dark:stroke-[#151515] stroke-2" />
                                        {/* Label */}
                                        <text
                                            x={getPoint(115, d.angle).x}
                                            y={getPoint(115, d.angle).y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="text-[10px] fill-gray-500 dark:fill-gray-400 font-bold"
                                        >
                                            {d.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* 3. Weekly Flow Chart */}
                <div className="bg-white dark:bg-[#151515] rounded-[24px] p-6 shadow-soft border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-sm text-text-main dark:text-white font-serif">心流时刻分布</h3>
                        <div className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full font-bold">
                            <Icon name="bolt" className="text-xs" />
                            <span>Best: Saturday</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between h-32 gap-3 px-2">
                        {WEEKLY_ACTIVITY.map((item, idx) => {
                            const maxHours = Math.max(...WEEKLY_ACTIVITY.map(i => i.hours));
                            const heightPct = (item.hours / maxHours) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="relative w-full bg-gray-100 dark:bg-gray-900 rounded-full flex items-end overflow-hidden h-full">
                                        <div
                                            style={{ height: `${heightPct}%` }}
                                            className={`w-full transition-all duration-1000 ease-out rounded-full ${item.hours === maxHours ? 'bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]' : 'bg-primary/30 group-hover:bg-primary/50'
                                                }`}
                                        ></div>
                                    </div>
                                    <span className="text-[9px] text-gray-400 font-bold font-mono group-hover:text-primary transition-colors">{item.day.charAt(0)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. Sage's Commentary */}
                <div className="bg-[#FFFDF9] dark:bg-[#1A1A1A] p-6 rounded-[32px] border border-orange-100 dark:border-orange-900/20 shadow-sm relative overflow-hidden">
                    {/* Decorative Quote Mark */}
                    <Icon name="format_quote" className="absolute top-4 right-6 text-6xl text-orange-500/10 rotate-12" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center border border-white shadow-sm">
                                <Icon name="self_improvement" className="text-orange-600 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-text-main dark:text-white">Sage 的深度洞察</h3>
                                <p className="text-[10px] text-gray-400">基于你的 Soul OS 数据生成</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-serif">
                                {AI_INSIGHT.summary}
                            </p>

                            <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/20">
                                <h4 className="text-xs font-bold text-orange-700 dark:text-orange-400 mb-1 flex items-center gap-1">
                                    <Icon name="tips_and_updates" className="text-sm" />
                                    下周建议
                                </h4>
                                <p className="text-xs text-orange-800/80 dark:text-orange-300/80 leading-relaxed">
                                    {AI_INSIGHT.suggestion}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {AI_INSIGHT.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
