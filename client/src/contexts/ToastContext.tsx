
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 2.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Global Toast Overlay */}
      <div className="fixed top-20 left-0 right-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`animate-fade-in-up flex items-center gap-3 px-5 py-3 rounded-full shadow-xl backdrop-blur-md border transition-all transform scale-100 ${
                toast.type === 'success' ? 'bg-black/80 text-white border-green-500/30' :
                toast.type === 'error' ? 'bg-red-500/90 text-white border-red-500/30' :
                'bg-black/80 text-white border-white/10'
            }`}
          >
             {toast.type === 'success' && <Icon name="check_circle" className="text-green-400 text-lg" filled />}
             {toast.type === 'error' && <Icon name="error" className="text-white text-lg" filled />}
             {toast.type === 'info' && <Icon name="info" className="text-blue-400 text-lg" />}
             
             <span className="text-xs font-bold tracking-wide">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
