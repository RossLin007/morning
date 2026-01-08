import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useToast } from '@/contexts/ToastContext';
import { CampDailySchedule } from '@/types';

// Step 1: Basic Configuration
interface CampBasicConfig {
    period: number;
    theme: string;
    startDate: string;
    endDate: string;
    dailyStartTime: string;
    dailyEndTime: string;
    price: number;
    enrollmentCap: number;
}

export const CampCreatorWizard: React.FC = () => {
    const navigate = useNavigate();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    useThemeColor(isDark ? '#000000' : '#FFFFFF');
    const { showToast } = useToast();

    const [currentStep, setCurrentStep] = useState(1);
    const [config, setConfig] = useState<CampBasicConfig>({
        period: 9,
        theme: '心流之境·第九期', // Default theme for testing
        startDate: '2026-02-01', // Default start date
        endDate: '2026-02-23', // Default end date (23 days)
        dailyStartTime: '06:00',
        dailyEndTime: '07:00',
        price: 1800,
        enrollmentCap: 10,
    });

    const [schedule, setSchedule] = useState<CampDailySchedule[]>([]);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);

    // Step 3: Marketing & Team
    const [marketing, setMarketing] = useState({
        heroImage: '',
        corePhilosophy: '',
        features: ['小班深度 (10人/班)', '专业用心陪伴', '安全支持场域', '每日心行修炼'],
        agreements: ['不评判：没有对错，只有不同视角', '保密性：出营即忘，守护安全场域', '真诚性：允许不完美，真实的连接'],
    });

    const handleMarketingChange = (field: keyof typeof marketing, value: string | string[]) => {
        setMarketing(prev => ({ ...prev, [field]: value }));
    };

    // Generate schedule template
    const generateScheduleTemplate = (startDate: string, endDate: string): CampDailySchedule[] => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

        const schedule: CampDailySchedule[] = [];
        for (let i = 0; i < days; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);

            // Pre-fill first 3 days for testing convenience
            const isPreFilled = i < 3;

            schedule.push({
                day: i + 1,
                date: currentDate.toISOString().split('T')[0],
                title: isPreFilled ? `Day ${i + 1}: ${['品德成功论', '由内而外', '积极主动'][i]}` : `Day ${i + 1}: `,
                readingMaterial: isPreFilled ? `第${['一', '二', '三'][i]}章` : '',
                themeFocus: isPreFilled ? ['品德成功论', '由内而外的改变', '积极主动的习惯'][i] : '',
                reflectionQuestion: isPreFilled ? '你对今天的内容有什么思考？' : '',
            });
        }
        return schedule;
    };

    const handleInputChange = (field: keyof CampBasicConfig, value: string | number) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleScheduleChange = (dayIndex: number, field: keyof CampDailySchedule, value: string) => {
        setSchedule(prev => {
            const updated = [...prev];
            updated[dayIndex] = { ...updated[dayIndex], [field]: value };
            return updated;
        });
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (!config.theme.trim()) {
                showToast('请输入晨读营主题', 'error');
                return;
            }
            if (!config.startDate || !config.endDate) {
                showToast('请选择起止日期', 'error');
                return;
            }

            const days = Math.ceil(
                (new Date(config.endDate).getTime() - new Date(config.startDate).getTime()) / (1000 * 3600 * 24)
            ) + 1;

            if (days < 21 || days > 30) {
                showToast(`时长应在21-30天之间，当前为${days}天`, 'error');
                return;
            }

            const generatedSchedule = generateScheduleTemplate(config.startDate, config.endDate);
            setSchedule(generatedSchedule);

            showToast('基础配置已保存，进入下一步', 'success');
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Step 2 Validation - relaxed for testing (only first 3 days required)
            const incompleteDays = schedule.slice(0, 3).filter(day => !day.title.trim() || !day.themeFocus.trim());
            if (incompleteDays.length > 0) {
                showToast(`前3天必须配置完整`, 'error');
                return;
            }

            showToast('内容排期已保存', 'success');
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // Step 3 Validation
            if (!marketing.corePhilosophy.trim()) {
                showToast('请输入核心理念', 'error');
                return;
            }

            // TODO: Save to database
            showToast('晨读营创建成功！', 'success');
            navigate('/reading'); // Navigate to reading page
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#111] pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 dark:text-gray-400">
                        <Icon name="arrow_back" className="text-[24px]" />
                    </button>
                    <h1 className="text-[17px] font-bold text-gray-900 dark:text-white">创建晨读营</h1>
                    <div className="w-10" />
                </div>
            </header>

            <div className="max-w-md mx-auto p-5">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary">
                            步骤 {currentStep}/3
                        </span>
                        <span className="text-xs text-gray-400">
                            {currentStep === 1 ? '基础配置' : currentStep === 2 ? '内容排期' : '团队与宣发'}
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${currentStep * 33.33}%` }} />
                    </div>
                </div>

                {/* Step 1: Basic Config */}
                {currentStep === 1 && (
                    <div className="space-y-6 pb-24">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">期数</label>
                                <input
                                    type="number"
                                    value={config.period}
                                    onChange={(e) => handleInputChange('period', parseInt(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                        text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">主题 *</label>
                                <input
                                    type="text"
                                    placeholder="如：心流之境"
                                    value={config.theme}
                                    onChange={(e) => handleInputChange('theme', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                        text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">起止日期 *</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    value={config.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                        text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <input
                                    type="date"
                                    value={config.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                        text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">建议21-23天</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">每日共修时间</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="time"
                                    value={config.dailyStartTime}
                                    onChange={(e) => handleInputChange('dailyStartTime', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                        text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <input
                                    type="time"
                                    value={config.dailyEndTime}
                                    onChange={(e) => handleInputChange('dailyEndTime', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                        text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">招募人数</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={config.enrollmentCap}
                                        onChange={(e) => handleInputChange('enrollmentCap', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                            text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">人</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">费用</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={config.price}
                                        onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                            text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">元</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4">
                            <div className="flex gap-3">
                                <Icon name="info" className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-900 dark:text-blue-200">
                                    <p className="font-medium mb-1">SOP 建议</p>
                                    <ul className="space-y-1 text-xs opacity-90">
                                        <li>• 小班深度：建议10人/班</li>
                                        <li>• 时长：21-23天为最佳</li>
                                        <li>• 定价：基于价值交付，参考1800元/人</li>
                                        <li>• 时间：清晨6:00-7:00最有仪式感</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Schedule Editor */}
                {currentStep === 2 && (
                    <div className="space-y-4 pb-24">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                已生成 <span className="font-bold text-primary">{schedule.length} 天</span> 的内容排期模板
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                点击每一天进行编辑，建议填写标题和主题焦点
                            </p>
                        </div>

                        {schedule.map((day, index) => (
                            <div key={index} className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary">{day.day}</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {day.title || `Day ${day.day}`}
                                            </p>
                                            <p className="text-xs text-gray-400">{day.date}</p>
                                        </div>
                                    </div>
                                    <Icon
                                        name="expand_more"
                                        className={`text-gray-400 transition-transform ${expandedDay === index ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {expandedDay === index && (
                                    <div className="p-4 pt-0 space-y-3 border-t border-gray-100 dark:border-white/5">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                                标题 *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="如: Day 1: 品德成功论"
                                                value={day.title}
                                                onChange={(e) => handleScheduleChange(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg
                                                    text-sm text-gray-900 dark:text-white placeholder-gray-400
                                                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                                阅读材料
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="如: 第一章, pp. 10-25"
                                                value={day.readingMaterial}
                                                onChange={(e) => handleScheduleChange(index, 'readingMaterial', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg
                                                    text-sm text-gray-900 dark:text-white placeholder-gray-400
                                                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                                主题焦点 *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="如: 由内而外"
                                                value={day.themeFocus}
                                                onChange={(e) => handleScheduleChange(index, 'themeFocus', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg
                                                    text-sm text-gray-900 dark:text-white placeholder-gray-400
                                                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                                反思问题
                                            </label>
                                            <textarea
                                                rows={2}
                                                placeholder="如: 你认为什么是成功？"
                                                value={day.reflectionQuestion}
                                                onChange={(e) => handleScheduleChange(index, 'reflectionQuestion', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg
                                                    text-sm text-gray-900 dark:text-white placeholder-gray-400
                                                    focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 3: Marketing & Team */}
                {currentStep === 3 && (
                    <div className="space-y-6 pb-24">
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-xl p-4 mb-6">
                            <p className="text-sm font-medium text-green-900 dark:text-green-200">
                                🎉 即将完成！
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                配置好营销内容后，您的晨读营就可以发布招募了
                            </p>
                        </div>

                        {/* Hero Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                封面图片 URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={marketing.heroImage}
                                onChange={(e) => handleMarketingChange('heroImage', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                    text-gray-900 dark:text-white placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">建议比例 16:9，体现晨读主题</p>
                        </div>

                        {/* Core Philosophy */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                核心理念 *
                            </label>
                            <textarea
                                rows={3}
                                placeholder="如: 早起 · 读书 · 谈心&#10;基于《高效能人士的七个习惯》，打造由内而外的成长之道。"
                                value={marketing.corePhilosophy}
                                onChange={(e) => handleMarketingChange('corePhilosophy', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl
                                    text-gray-900 dark:text-white placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            />
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                特色亮点 (4项)
                            </label>
                            <div className="space-y-2">
                                {marketing.features.map((feature, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={feature}
                                        onChange={(e) => {
                                            const newFeatures = [...marketing.features];
                                            newFeatures[index] = e.target.value;
                                            handleMarketingChange('features', newFeatures);
                                        }}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg
                                            text-sm text-gray-900 dark:text-white
                                            focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Agreements */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                我们的约定 (3项)
                            </label>
                            <div className="space-y-2">
                                {marketing.agreements.map((agreement, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={agreement}
                                        onChange={(e) => {
                                            const newAgreements = [...marketing.agreements];
                                            newAgreements[index] = e.target.value;
                                            handleMarketingChange('agreements', newAgreements);
                                        }}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg
                                            text-sm text-gray-900 dark:text-white
                                            focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Preview Card */}
                        <div className="bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/20 rounded-2xl p-5">
                            <div className="flex items-start gap-3 mb-4">
                                <Icon name="visibility" className="text-primary text-xl mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">预览效果</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        这就是用户在招募页面看到的内容
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-4 border border-gray-100 dark:border-white/5">
                                {marketing.heroImage && (
                                    <img
                                        src={marketing.heroImage}
                                        alt="封面"
                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line mb-2">
                                    {marketing.corePhilosophy || '（核心理念将在此显示）'}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {marketing.features.filter(f => f.trim()).map((f, i) => (
                                        <span key={i} className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 p-4 pb-safe">
                <div className="max-w-md mx-auto flex gap-3">
                    <button
                        onClick={handleBack}
                        className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium
                            hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                        {currentStep > 1 ? '上一步' : '取消'}
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 py-3.5 rounded-xl bg-primary text-white font-medium
                            hover:bg-primary-dark transition-all shadow-lg shadow-primary/20
                            flex items-center justify-center gap-2"
                    >
                        {currentStep === 1 ? '下一步：内容排期' : currentStep === 2 ? '下一步：团队与宣发' : '完成创建'}
                        <Icon name="arrow_forward" className="text-lg" />
                    </button>
                </div>
            </div>
        </div >
    );
};
