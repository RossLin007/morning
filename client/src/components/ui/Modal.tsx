
import React, { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  type?: 'center' | 'bottom';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'center',
  className 
}) => {
  const [show, setShow] = useState(isOpen);

  // Handle animation delay for unmounting
  useEffect(() => {
    if (isOpen) setShow(true);
    else setTimeout(() => setShow(false), 300); // Match animation duration
  }, [isOpen]);

  if (!show && !isOpen) return null;

  const isBottom = type === 'bottom';

  return (
    <div 
        className={cn(
            "fixed inset-0 z-50 flex justify-center transition-all duration-300",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible",
            isBottom ? "items-end" : "items-center bg-black/60 backdrop-blur-sm"
        )}
        onClick={onClose}
    >
      {/* For bottom sheet, the backdrop is handled slightly differently to look nice */}
      {isBottom && (
          <div className={cn("absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}></div>
      )}

      <div 
        className={cn(
            "bg-white dark:bg-[#1A1A1A] w-full transition-all duration-300 ease-out shadow-2xl relative",
            isBottom 
                ? "rounded-t-[32px] max-w-md mx-auto" 
                : "rounded-[32px] max-w-sm mx-4",
            isBottom && (isOpen ? "translate-y-0" : "translate-y-full"),
            !isBottom && (isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"),
            className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || !isBottom) && (
            <div className={cn("flex items-center p-6 pb-2", title ? "justify-between" : "justify-end")}>
                {title && <h3 className="text-lg font-bold text-text-main dark:text-white">{title}</h3>}
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                    <Icon name="close" className="text-gray-500" />
                </button>
            </div>
        )}
        
        <div className={cn("p-6", (title || !isBottom) ? "pt-2" : "")}>
            {children}
        </div>
      </div>
    </div>
  );
};
