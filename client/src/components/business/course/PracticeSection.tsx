import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useHaptics } from '@/hooks/useHaptics';
import { useGamification } from '@/contexts/GamificationContext';

// --- Types & Data ---
type Question = {
    id: string;
    type: 'choice' | 'sort';
    prompt: string;
    context?: string;
    options: { id: string; text: string; isCorrect: boolean; feedback: string }[];
};

const PRACTICE_DATA: Record<string, { title: string; questions: Question[] }> = {
    'p2-d2': { 
        title: '语言觉醒练习',
        questions: [
            {
                id: 'q1',
                type: 'choice',
                prompt: '当面对一项艰难的任务时，消极被动的人说：“我不得不做。”，积极主动的人会说：',
                context: '把“不得不”转化为“选择”',
                options: [
                    { id: 'a', text: '没办法，只能硬着头皮上', isCorrect: false, feedback: '这依然是被动的无奈接受。' },
                    { id: 'b', text: '我选择接受挑战，这能锻炼我', isCorrect: true, feedback: '正确！这是基于价值观的主动选择。' }
                ]
            },
            {
                id: 'q2',
                type: 'choice',
                prompt: '如果你被别人误解了，反应型的人会说：“他把我气疯了！”，而你现在会选择说：',
                context: '夺回情绪的主导权',
                options: [
                    { id: 'a', text: '我控制自己的情绪，我选择沟通', isCorrect: true, feedback: '太棒了！没人能伤害你，除非你同意。' },
                    { id: 'b', text: '他怎么能这样对我？', isCorrect: false, feedback: '这把情绪的遥控器交给了别人。' }
                ]
            }
        ]
    }
};

export const PracticeSection: React.FC<{ lessonId: string }> = ({ lessonId }) => {
    const data = PRACTICE_DATA[lessonId];
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
    const { trigger: haptic } = useHaptics();
    const { addXp, addCoins } = useGamification();

    if (!data) return null;
    const question = data.questions[currentStep];

    const handleSelect = (option: any) => {
        if (selectedOption) return;
        setSelectedOption(option.id);
        
        if (option.isCorrect) {
            haptic('success');
            setFeedbackMsg(option.feedback);
            setTimeout(() => {
                if (currentStep < data.questions.length - 1) {
                    setCurrentStep(prev => prev + 1);
                    setSelectedOption(null);
                    setFeedbackMsg(null);
                } else {
                    setIsCompleted(true);
                    addXp(30, '完成练习');
                    addCoins(5, '智慧奖励');
                }
            }, 1500);
        } else {
            haptic('error');
            setFeedbackMsg(option.feedback);
            setTimeout(() => {
                setSelectedOption(null);
                setFeedbackMsg(null);
            }, 1500);
        }
    };

    if (isCompleted) {
        return (
            <div className="mx-6 mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 text-center animate-fade-in-up">
                <div className="size-12 bg-white dark:bg-black rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-green-500">
                    <Icon name="psychology_alt" filled />
                </div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-1">思维升级完成</h3>
                <p className="text-xs text-green-700 dark:text-green-400 mb-0">你已掌握了本课的核心思维模型。</p>
            </div>
        );
    }

    return (
        <div className="mx-6 mt-8 bg-white dark:bg-[#151515] rounded-[24px] border border-primary/20 shadow-lg shadow-primary/5 overflow-hidden animate-fade-in-up">
            <div className="bg-primary/10 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Icon name="fitness_center" className="text-primary text-sm" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{data.title}</span>
                </div>
                <span className="text-[10px] font-mono text-primary/60">{currentStep + 1}/{data.questions.length}</span>
            </div>
            <div className="p-6">
                <div className="mb-6">
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded mb-2 inline-block">{question.context}</span>
                    <h4 className="text-lg font-bold text-text-main dark:text-white leading-relaxed">{question.prompt}</h4>
                </div>
                <div className="space-y-3">
                    {question.options.map(opt => {
                        let btnClass = "bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800";
                        if (selectedOption === opt.id) {
                            btnClass = opt.isCorrect ? "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700" : "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700";
                        }
                        return (
                            <button key={opt.id} onClick={() => handleSelect(opt)} disabled={!!selectedOption} className={`w-full p-4 rounded-xl text-left text-sm font-medium border-2 transition-all active:scale-[0.98] ${btnClass}`}>
                                <div className="flex items-center justify-between">
                                    <span>{opt.text}</span>
                                    {selectedOption === opt.id && <Icon name={opt.isCorrect ? "check_circle" : "cancel"} className={opt.isCorrect ? "text-green-500" : "text-red-500"} filled />}
                                </div>
                            </button>
                        );
                    })}
                </div>
                {feedbackMsg && <div className="mt-4 text-center text-xs font-bold animate-fade-in">{feedbackMsg}</div>}
            </div>
        </div>
    );
};