import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { NavBar } from '@/components/layout/NavBar';
import { useGamification } from '@/contexts/GamificationContext';
import { useToast } from '@/contexts/ToastContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';

interface ShopItem {
    id: string;
    icon: string;
    title: string;
    desc: string;
    price: number;
    type: 'consumable' | 'theme' | 'donation';
    color: string;
}

export const ZenShop: React.FC = () => {
    const { coins } = useGamification();
    const { showToast } = useToast();
    const { trigger: haptic } = useHaptics();
    const { t } = useTranslation();
    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    const shopItems: ShopItem[] = [
        { id: 's1', icon: 'history_toggle_off', title: t('shop.items.makeup.title'), desc: t('shop.items.makeup.desc'), price: 50, type: 'consumable', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
        { id: 's2', icon: 'water_drop', title: t('shop.items.rain.title'), desc: t('shop.items.rain.desc'), price: 100, type: 'theme', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
        { id: 's3', icon: 'forest', title: t('shop.items.tree.title'), desc: t('shop.items.tree.desc'), price: 500, type: 'donation', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
        { id: 's4', icon: 'palette', title: t('shop.items.theme.title'), desc: t('shop.items.theme.desc'), price: 200, type: 'theme', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
    ];

    const handleBuy = async (item: ShopItem) => {
        if (coins < item.price) {
            haptic('error');
            showToast(t('shop.balance_error'), "error");
            return;
        }

        setPurchasingId(item.id);
        haptic('medium');

        try {
            await api.shop.buy(item.id, item.price);
            haptic('success');
            if (item.type === 'donation') {
                showToast(t('shop.donation_success'), "success");
            } else {
                showToast(t('shop.redeem_success', { item: item.title }), "success");
            }
            // Note: Profile coins will be updated on next fetch or via Optimistic update if implemented
        } catch (err: any) {
            showToast(err.message || "购买失败", "error");
        } finally {
            setPurchasingId(null);
        }
    };

    return (
        <div className="min-h-full bg-[#F5F7F5] dark:bg-black font-sans animate-fade-in flex flex-col">
            {/* Header */}
            <NavBar
                title={t('shop.title')}
                right={
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                        <Icon name="monetization_on" className="text-yellow-600 dark:text-yellow-400 text-sm" filled />
                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{coins}</span>
                    </div>
                }
            />

            {/* Banner */}
            <div className="p-6 pb-2">
                <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#2C2C2E] to-black p-6 text-white shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-[40px]"></div>
                    <div className="relative z-10 flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-2">
                            <Icon name="local_mall" className="text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Zen Store</span>
                        </div>
                        <h2 className="text-xl font-display font-bold mb-1">{t('shop.subtitle')}</h2>
                        <p className="text-xs text-gray-400">{t('shop.desc')}</p>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="p-6 grid grid-cols-1 gap-4">
                {shopItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`size-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                                <Icon name={item.icon} className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-text-main dark:text-white">{item.title}</h3>
                                <p className="text-[10px] text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleBuy(item)}
                            disabled={purchasingId === item.id}
                            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${purchasingId === item.id
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'
                                }`}
                        >
                            {purchasingId === item.id ? (
                                <Icon name="sync" className="animate-spin text-sm" />
                            ) : (
                                <>
                                    <span className="text-[10px]">🪙</span>
                                    {item.price}
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4 px-8 text-center">
                <p className="text-[10px] text-gray-300">{t('shop.loading_more')}</p>
            </div>
        </div>
    );
};
