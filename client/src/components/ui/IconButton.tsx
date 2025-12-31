import React, { useCallback, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

const iconButtonVariants = cva(
  "flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50",
  {
    variants: {
      variant: {
        ghost: "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400",
        glass: "bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/20 hover:bg-white/60 dark:hover:bg-white/10 text-text-main dark:text-white",
        solid: "bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/30",
        outline: "border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary bg-transparent",
        surface: "bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800 text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/5",
      },
      size: {
        sm: "size-8 p-1.5",
        md: "size-10 p-2",
        lg: "size-12 p-3",
        xl: "size-14 p-4",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  }
);

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants> & {
  icon: string;
  label?: string; // Optional for flexibility, but recommended for A11y
  filled?: boolean;
  iconClassName?: string;
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'none';
  debounce?: number;
};

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  label, 
  filled = false, 
  className, 
  iconClassName,
  variant,
  size,
  onClick,
  haptic = 'light',
  debounce = 0,
  disabled,
  ...props 
}) => {
  const { trigger } = useHaptics();
  const [isDebouncing, setIsDebouncing] = useState(false);

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDebouncing || disabled) return;

    // Haptic Feedback
    if (haptic !== 'none') {
      trigger(haptic);
    }

    if (onClick) {
      if (debounce > 0) {
        setIsDebouncing(true);
        try {
          await Promise.resolve(onClick(e));
        } finally {
          setTimeout(() => setIsDebouncing(false), debounce);
        }
      } else {
        onClick(e);
      }
    }
  }, [onClick, haptic, debounce, trigger, isDebouncing, disabled]);

  return (
    <button 
      type="button"
      aria-label={label || icon}
      title={label || icon}
      className={cn(iconButtonVariants({ variant, size, className }))}
      onClick={handleClick}
      disabled={disabled || isDebouncing}
      {...props}
    >
      <Icon name={icon} filled={filled} className={iconClassName} />
    </button>
  );
};