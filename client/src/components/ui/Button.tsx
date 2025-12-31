
import React, { useCallback, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        solid: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30",
        outline: "border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary bg-transparent",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400",
        glass: "bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/20 hover:bg-white/60 dark:hover:bg-white/10 text-text-main dark:text-white",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
        input: "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 justify-start px-4 font-normal"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "size-10 p-0"
      },
      fullWidth: {
        true: "w-full",
      }
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      fullWidth: false,
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  VariantProps<typeof buttonVariants> & {
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'none';
  debounce?: number;
};

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant, 
  size, 
  fullWidth, 
  isLoading, 
  leftIcon, 
  rightIcon, 
  children, 
  disabled,
  onClick,
  haptic = 'light',
  debounce = 0,
  ...props 
}) => {
  const { trigger } = useHaptics();
  const [isDebouncing, setIsDebouncing] = useState(false);

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDebouncing || isLoading || disabled) return;

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
  }, [onClick, haptic, debounce, trigger, isDebouncing, isLoading, disabled]);

  return (
    <button 
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={isLoading || disabled || isDebouncing}
      onClick={handleClick}
      {...props}
    >
      {isLoading && <Icon name="progress_activity" className="animate-spin mr-2 text-current" />}
      {!isLoading && leftIcon && <Icon name={leftIcon} className={cn("mr-2 text-lg", children ? "" : "mr-0")} />}
      {children}
      {!isLoading && rightIcon && <Icon name={rightIcon} className="ml-2 text-lg" />}
    </button>
  );
};
