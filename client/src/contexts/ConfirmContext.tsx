import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType>({
    confirm: () => Promise.resolve(false),
});

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(opts);
            setIsOpen(true);
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        resolvePromise?.(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        resolvePromise?.(false);
    };

    const typeStyles = {
        danger: {
            icon: 'error',
            iconColor: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            confirmBtnClass: 'bg-red-500 hover:bg-red-600 text-white',
        },
        warning: {
            icon: 'warning',
            iconColor: 'text-amber-500',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            confirmBtnClass: 'bg-amber-500 hover:bg-amber-600 text-white',
        },
        info: {
            icon: 'info',
            iconColor: 'text-primary',
            bgColor: 'bg-primary/10',
            confirmBtnClass: 'bg-primary hover:bg-primary-dark text-white',
        },
    };

    const currentType = options?.type || 'danger';
    const styles = typeStyles[currentType];

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Confirm Modal Overlay */}
            {isOpen && options && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
                    onClick={handleCancel}
                >
                    <div
                        className="bg-white dark:bg-[#1A1A1A] rounded-3xl mx-4 w-full max-w-sm shadow-2xl animate-fade-in-up overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center pt-8 pb-4">
                            <div className={`size-16 rounded-full ${styles.bgColor} flex items-center justify-center`}>
                                <Icon name={styles.icon} className={`text-3xl ${styles.iconColor}`} filled />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center px-6 pb-6">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">
                                {options.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                {options.message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-4 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-[0.98]"
                            >
                                {options.cancelText || '取消'}
                            </button>
                            <div className="w-px bg-gray-100 dark:bg-gray-800" />
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 py-4 text-sm font-bold transition-colors active:scale-[0.98] ${currentType === 'danger'
                                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        : currentType === 'warning'
                                            ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                            : 'text-primary hover:bg-primary/10'
                                    }`}
                            >
                                {options.confirmText || '确定'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => useContext(ConfirmContext);
