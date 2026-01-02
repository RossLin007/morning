
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { useHaptics } from '@/hooks/useHaptics';
import { useGamification } from '@/contexts/GamificationContext';
import { useToast } from '@/contexts/ToastContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DiaryEntry {
    id: string;
    date: string;
    day: number;
    situation: string;
    innerReaction: string;
    emotion: string;
    behavior: string;
    awareness: string;
    actionPlan: string[];
    isPublic: boolean;
}

const EMOTIONS = [
    { id: 'calm', label: '平静', icon: '😌' },
    { id: 'happy', label: '喜悦', icon: '😊' },
    { id: 'curious', label: '好奇', icon: '🤔' },
    { id: 'anxious', label: '焦虑', icon: '😰' },
    { id: 'sad', label: '低落', icon: '😔' },
    { id: 'angry', label: '愤怒', icon: '😤' },
];

export const AwarenessDiary: React.FC = () => {
    const navigate = useNavigate();
    const { trigger: haptic } = useHaptics();
    const { addXP, addCoins } = useGamification();
    const { showToast } = useToast();

    const [diaries, setDiaries] = useLocalStorage<DiaryEntry[]>('mr_awareness_diaries', []);

    // Form state
    const [step, setStep] = useState(1);
    const [situation, setSituation] = useState('');
    const [emotion, setEmotion] = useState('');
    const [innerReaction, setInnerReaction] = useState('');
    const [behavior, setBehavior] = useState('');
    const [awareness, setAwareness] = useState('');
    const [actionPlan, setActionPlan] = useState<string[]>(['']);
    const [isPublic, setIsPublic] = useState(false);
    const [saving, setSaving] = useState(false);

    const today = new Date().toLocaleDateString('zh-CN');
    const currentDay = diaries.length + 1;

    const steps = [
        { id: 1, title: '情境描述', icon: 'landscape' },
        { id: 2, title: '内在反应', icon: 'psychology' },
        { id: 3, title: '行为表现', icon: 'directions_run' },
        { id: 4, title: '觉察发现', icon: 'lightbulb' },
        { id: 5, title: '行动计划', icon: 'flag' },
    ];

    const canProceed = () => {
        switch (step) {
            case 1: return situation.trim().length > 10;
            case 2: return emotion && innerReaction.trim().length > 5;
            case 3: return behavior.trim().length > 5;
            case 4: return awareness.trim().length > 10;
            case 5: return actionPlan.some(a => a.trim().length > 0);
            default: return false;
        }
    };

    const handleNext = () => {
        if (step < 5) {
            haptic('light');
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            haptic('light');
            setStep(step - 1);
        }
    };

    const handleAddAction = () => {
        if (actionPlan.length < 3) {
            setActionPlan([...actionPlan, '']);
        }
    };

    const handleActionChange = (index: number, value: string) => {
        const newPlan = [...actionPlan];
        newPlan[index] = value;
        setActionPlan(newPlan);
    };

    const handleSubmit = async () => {
        setSaving(true);
        haptic('medium');

        try {
            const newEntry: DiaryEntry = {
                id: `diary-${Date.now()}`,
                date: today,
                day: currentDay,
                situation,
                innerReaction,
                emotion,
                behavior,
                awareness,
                actionPlan: actionPlan.filter(a => a.trim()),
                isPublic,
            };

            setDiaries([...diaries, newEntry]);

            // Reward user
            addXP(50);
            addCoins(10);

            showToast('觉察日记已保存，获得 50 XP + 10 金币！', 'success');

            setTimeout(() => {
                navigate('/diary');
            }, 1500);
        } catch (error) {
            showToast('保存失败，请重试', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7F5] dark:bg-[#0A0A0A] pb-8">
            {/* Header */}
            <header className="sticky top-0 z-40 px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center">
                        <Icon name="arrow_back" className="text-text-main dark:text-white" />
                    </button>
                    <h1 className="text-lg font-display font-bold text-text-main dark:text-white">
                        Day {currentDay} 觉察日记
                    </h1>
                    <div className="w-10"></div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mt-4 px-2">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > s.id
                                    ? 'bg-primary text-white'
                                    : step === s.id
                                        ? 'bg-primary/20 text-primary border-2 border-primary'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                    }`}
                            >
                                {step > s.id ? <Icon name="check" className="text-sm" /> : s.id}
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-8 h-0.5 mx-1 ${step > s.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </header>

            {/* Content */}
            <div className="px-6 py-6 animate-fade-in">
                {/* Step Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Icon name={steps[step - 1].icon} className="text-primary text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-text-main dark:text-white">
                            {steps[step - 1].title}
                        </h2>
                        <p className="text-sm text-text-sub dark:text-gray-400">
                            {step === 1 && '描述今天让你有所感触的一个情境'}
                            {step === 2 && '这个情境引发了什么内在反应？'}
                            {step === 3 && '你当时是如何表现的？'}
                            {step === 4 && '通过反思，你发现了什么？'}
                            {step === 5 && '接下来你打算怎么做？'}
                        </p>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white dark:bg-[#151515] rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-gray-800">
                    {step === 1 && (
                        <textarea
                            value={situation}
                            onChange={(e) => setSituation(e.target.value)}
                            placeholder="今天发生了什么事情让你有所感触？请详细描述..."
                            className="w-full h-40 bg-transparent resize-none outline-none text-text-main dark:text-white placeholder-gray-400 leading-relaxed"
                        />
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-text-sub dark:text-gray-400 mb-3">选择你当时的情绪</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {EMOTIONS.map((e) => (
                                        <button
                                            key={e.id}
                                            onClick={() => setEmotion(e.id)}
                                            className={`p-3 rounded-2xl border-2 transition-all ${emotion === e.id
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-100 dark:border-gray-700'
                                                }`}
                                        >
                                            <span className="text-2xl">{e.icon}</span>
                                            <p className="text-xs mt-1 text-text-main dark:text-white">{e.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-text-sub dark:text-gray-400 mb-2">内心的想法和感受</p>
                                <textarea
                                    value={innerReaction}
                                    onChange={(e) => setInnerReaction(e.target.value)}
                                    placeholder="当时你心里在想什么？有什么感受？"
                                    className="w-full h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 resize-none outline-none text-text-main dark:text-white placeholder-gray-400"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <textarea
                            value={behavior}
                            onChange={(e) => setBehavior(e.target.value)}
                            placeholder="你当时做了什么？说了什么？或者没做什么？"
                            className="w-full h-40 bg-transparent resize-none outline-none text-text-main dark:text-white placeholder-gray-400 leading-relaxed"
                        />
                    )}

                    {step === 4 && (
                        <div>
                            <div className="bg-accent/10 rounded-2xl p-4 mb-4">
                                <p className="text-sm text-accent">
                                    💡 觉察的关键：不评判，只是看见。试着像一个旁观者一样，看看自己的模式。
                                </p>
                            </div>
                            <textarea
                                value={awareness}
                                onChange={(e) => setAwareness(e.target.value)}
                                placeholder="通过这次反思，你发现了自己什么样的模式或信念？有什么新的认识？"
                                className="w-full h-32 bg-transparent resize-none outline-none text-text-main dark:text-white placeholder-gray-400 leading-relaxed"
                            />
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4">
                            {actionPlan.map((action, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={action}
                                        onChange={(e) => handleActionChange(index, e.target.value)}
                                        placeholder={`行动计划 ${index + 1}`}
                                        className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 outline-none text-text-main dark:text-white placeholder-gray-400"
                                    />
                                </div>
                            ))}
                            {actionPlan.length < 3 && (
                                <button
                                    onClick={handleAddAction}
                                    className="flex items-center gap-2 text-primary text-sm font-medium"
                                >
                                    <Icon name="add_circle" /> 添加更多
                                </button>
                            )}

                            {/* Public toggle */}
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Icon name="visibility" className="text-gray-400" />
                                        <span className="text-sm text-text-main dark:text-white">分享到书友圈</span>
                                    </div>
                                    <div
                                        onClick={() => setIsPublic(!isPublic)}
                                        className={`w-12 h-7 rounded-full transition-colors ${isPublic ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mt-1 ${isPublic ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            className="flex-1"
                        >
                            上一步
                        </Button>
                    )}
                    {step < 5 ? (
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="flex-1"
                        >
                            下一步
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            isLoading={saving}
                            disabled={!canProceed()}
                            className="flex-1"
                        >
                            保存并打卡 ✨
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
