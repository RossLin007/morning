import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { NavBar } from '@/components/layout/NavBar';
import { useHaptics } from '@/hooks/useHaptics';
import { useAuth } from '@/contexts/AuthContext';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';
import { useGamification } from '@/contexts/GamificationContext';
import { usePartner } from '@/hooks/usePartner';
import { LearningPlanModal } from '@/components/business/LearningPlanModal';
import { Modal } from '@/components/ui/Modal';

// Skeleton Component
const RelationshipSkeleton = () => (
    <div className="flex flex-col items-center w-full px-6 animate-pulse mt-6">
        <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-[40px] mb-6"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mb-8"></div>
        <div className="flex gap-3 w-full mb-8">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="size-12 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-3xl h-40"></div>
    </div>
);

export const Relationships: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { trigger: haptic } = useHaptics();
    const { showToast } = useToast();
    const { addXp } = useGamification();


    const [activeRole, setActiveRole] = useState<'buddy' | 'mentor' | 'mentee'>('buddy');

    const { partner, logs, loading, waterTree, sendMessage, assignPlan } = usePartner(activeRole);

    const [showPostcardModal, setShowPostcardModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedPostcard, setSelectedPostcard] = useState(0);

    const isWatered = partner?.wateredToday || false;

    const postcards = [
        { id: 0, text: "理解：我听到了你心底的声音。", bg: "bg-gradient-to-br from-orange-100 to-yellow-200" },
        { id: 1, text: "守信：说提到做到，是我的承诺。", bg: "bg-gradient-to-br from-blue-100 to-purple-200" },
        { id: 2, text: "支持：在你需要的时候，我都在。", bg: "bg-gradient-to-br from-green-100 to-teal-200" },
        { id: 3, text: "道歉：对不起，我希望能弥补。", bg: "bg-gradient-to-br from-pink-100 to-red-100" },
    ];

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const handleWater = async () => {
        if (!partner || !user || isWatered) return;
        haptic('success');
        await waterTree(partner.relationshipId, partner.treeLevel);
        showToast(`已存入关注与善意`, 'success');
        addXp(10, '情感存款');
    };

    const handleSendPostcard = async () => {
        if (!partner || !user) return;
        haptic('medium');
        setShowPostcardModal(false);

        const card = postcards[selectedPostcard];
        await sendMessage(partner.relationshipId, `存入了一笔款项：「${card.text}」`, 'interaction');

        showToast("存款凭证已发送", "success");
    };

    const handleAssignPlan = async (lessonId: string, title: string, note: string) => {
        if (!partner || !user) return;
        haptic('medium');
        await assignPlan(partner.relationshipId, { lessonId, title, note });
        showToast("期望已明确", "success");
    };



    const getTreeIcon = (level: number = 0) => {
        if (level < 5) return 'psychiatry'; // Seed
        if (level < 15) return 'potted_plant'; // Sapling
        if (level < 30) return 'nature'; // Tree
        if (level < 50) return 'forest'; // Forest
        return 'park'; // Zen Garden
    };

    const treeIcon = getTreeIcon(partner?.treeLevel);

    const roleConfig = {
        mentor: { label: '导师', desc: '指引方向的灯塔', icon: 'school', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        buddy: { label: '书友', desc: '共同成长的伙伴', icon: 'spa', color: 'text-primary', bg: 'bg-primary/10' },
        mentee: { label: '学友', desc: '传递火炬的接力', icon: 'psychology', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' }
    };

    const activeConfig = roleConfig[activeRole];

    return (
        <div className="min-h-full bg-[#F9F9F9] dark:bg-[#0A0A0A] flex flex-col font-sans relative animate-fade-in pb-10 transition-colors duration-500">

            {/* Header */}
            <NavBar
                title="情感账户"
                onBack={handleBack}
                right={<IconButton icon="person_add" onClick={() => navigate('/match', { state: { role: activeRole } })} variant="ghost" label="Add" />}
            />

            {/* Role Switcher */}
            <div className="px-6 mt-4 mb-2">
                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                    {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => (
                        <button key={role} onClick={() => { haptic('light'); setActiveRole(role); }} className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${activeRole === role ? 'bg-white dark:bg-[#1A1A1A] text-text-main dark:text-white shadow-sm' : 'text-gray-400'}`}>
                            {roleConfig[role].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center w-full max-w-lg mx-auto px-6">
                {loading ? (
                    <RelationshipSkeleton />
                ) : partner ? (
                    <div className="w-full flex flex-col gap-6 animate-fade-in mt-4">

                        {/* Account Card */}
                        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-emerald-50 to-white dark:from-[#151515] dark:to-black rounded-3xl shadow-soft border border-emerald-100/50 dark:border-gray-800 flex items-center justify-center overflow-hidden">

                            {/* Balance Indicator */}
                            <div className="absolute top-6 right-6 flex flex-col items-end">
                                <span className="text-[10px] uppercase text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">Trust Balance</span>
                                <span className="text-2xl font-serif font-bold text-text-main dark:text-white">{partner.treeLevel * 100} CR</span>
                            </div>

                            {/* Partner Avatar */}
                            <div className="absolute top-6 left-6 flex items-center gap-3">
                                <div className="relative">
                                    <img src={partner.avatar} className="size-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" alt={partner.name} />
                                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black p-0.5 rounded-full">
                                        <Icon name={activeConfig.icon} className={`text-sm ${activeConfig.color}`} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-main dark:text-white">{partner.name}</h3>
                                    <p className="text-xs text-gray-400">Since 2024</p>
                                </div>
                            </div>

                            {/* Visual Metaphor: Tree */}
                            <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${isWatered ? 'scale-105 filter brightness-110' : ''}`}>
                                <Icon name={treeIcon} className={`text-[100px] ${isWatered ? 'text-emerald-500' : 'text-emerald-400/80'} drop-shadow-2xl transition-colors duration-1000`} filled />
                                <p className="mt-4 text-xs font-serif italic text-gray-400 dark:text-gray-500">"信任是人际关系的基石"</p>
                            </div>
                        </div>

                        {/* Deposit Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={handleWater} disabled={isWatered} className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${isWatered ? 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400' : 'bg-white dark:bg-[#151515] border-emerald-100 dark:border-emerald-900/30 text-emerald-600 hover:shadow-md'}`}>
                                <Icon name="water_drop" className="text-2xl" filled={!isWatered} />
                                <div className="text-center">
                                    <span className="text-sm font-bold block">关注小节</span>
                                    <span className="text-[10px] opacity-70">每日签到</span>
                                </div>
                            </button>

                            <button onClick={() => setShowPostcardModal(true)} className="h-20 rounded-2xl bg-white dark:bg-[#151515] border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all">
                                <Icon name="volunteer_activism" className="text-2xl" />
                                <div className="text-center">
                                    <span className="text-sm font-bold block">情感存款</span>
                                    <span className="text-[10px] opacity-70">理解/守信/道歉</span>
                                </div>
                            </button>
                        </div>

                        {/* Mentor Action: Investment */}
                        {activeRole === 'mentor' && (
                            <button onClick={() => setShowPlanModal(true)} className="w-full h-16 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800/30 flex items-center justify-between px-6 hover:shadow-md transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-white dark:bg-[#151515] flex items-center justify-center text-orange-500 shadow-sm">
                                        <Icon name="assignment_add" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm font-bold text-orange-900 dark:text-orange-100 block">发布成长任务</span>
                                        <span className="text-[10px] text-orange-600 dark:text-orange-300 opacity-80">指引方向，助其成长</span>
                                    </div>
                                </div>
                                <Icon name="chevron_right" className="text-orange-300" />
                            </button>
                        )}

                        {/* Transaction Log */}
                        <div className="bg-white dark:bg-[#151515] rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                                <span>情感交易记录</span>
                                <Icon name="receipt_long" />
                            </h3>

                            <div className="space-y-6 relative ml-2">
                                <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gray-100 dark:bg-gray-800"></div>

                                {logs.length > 0 ? logs.map((log) => (
                                    <div key={log.id} className="flex gap-4 relative">
                                        <div className="relative z-10 size-4 rounded-full border-2 border-white dark:border-[#151515] bg-gray-200 dark:bg-gray-700 mt-1 shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                    {log.actor_id === user?.id ? '我' : partner.name}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-mono">{formatRelativeTime(log.created_at)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-50 dark:border-gray-800 block">
                                                {log.content}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-4 text-center text-gray-400 text-xs italic">
                                        暂无交易记录，试着存入第一笔信任吧。
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className={`size-24 rounded-full ${activeConfig.bg} flex items-center justify-center mb-6`}>
                            <Icon name="account_balance" className={`text-4xl ${activeConfig.color} opacity-80`} />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-text-main dark:text-white mb-2">开通情感账户</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xs mx-auto">
                            与{activeConfig.label}建立深厚的关系，通过理解、守信和真诚沟通，不断存入信任，收获丰盛的互赖人生。
                        </p>
                        <button
                            onClick={() => navigate('/match', { state: { role: activeRole } })}
                            className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-soft hover:bg-primary-dark transition-all flex items-center gap-2"
                        >
                            <Icon name="person_add" />
                            即刻开户
                        </button>
                    </div>
                )}
            </div>

            {/* Postcard/Deposit Modal */}
            <Modal
                isOpen={showPostcardModal}
                onClose={() => setShowPostcardModal(false)}
                title="选择存款类型"
                type="bottom"
                className="max-h-[85vh] flex flex-col"
            >
                <div className="pb-6">
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {postcards.map((card, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedPostcard(index)}
                                className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all border ${selectedPostcard === index ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${card.bg}`}>
                                    <span className="text-lg">💌</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-text-main dark:text-white mb-0.5">{card.text.split('：')[0]}</p>
                                    <p className="text-xs text-gray-500">{card.text.split('：')[1]}</p>
                                </div>
                                {selectedPostcard === index && <Icon name="check_circle" className="text-primary" />}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSendPostcard}
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-soft active:scale-95 transition-all"
                    >
                        确认存款
                    </button>
                </div>
            </Modal>

            <LearningPlanModal
                isOpen={showPlanModal}
                onClose={() => setShowPlanModal(false)}
                onAssign={handleAssignPlan}
            />

        </div>
    );
};
