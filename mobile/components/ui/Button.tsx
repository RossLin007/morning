import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-amber-600 active:bg-amber-700',
    secondary: 'bg-gray-200 dark:bg-gray-700 active:bg-gray-300',
    outline: 'border border-amber-600 bg-transparent active:bg-amber-50',
    ghost: 'bg-transparent active:bg-gray-100',
};

const textStyles: Record<ButtonVariant, string> = {
    primary: 'text-white',
    secondary: 'text-gray-800 dark:text-gray-100',
    outline: 'text-amber-600',
    ghost: 'text-gray-700 dark:text-gray-200',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3.5',
};

const textSizeStyles: Record<ButtonSize, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
};

export const Button = forwardRef<View, ButtonProps>(
    (
        {
            children,
            onPress,
            variant = 'primary',
            size = 'md',
            disabled = false,
            loading = false,
            icon,
            fullWidth = false,
        },
        ref
    ) => {
        return (
            <Pressable
                ref={ref}
                onPress={onPress}
                disabled={disabled || loading}
                className={`
          flex-row items-center justify-center rounded-xl
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled ? 'opacity-50' : ''}
        `}
            >
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={variant === 'primary' ? '#fff' : '#B45309'}
                    />
                ) : (
                    <>
                        {icon && <View className="mr-2">{icon}</View>}
                        <Text
                            className={`font-semibold ${textStyles[variant]} ${textSizeStyles[size]}`}
                        >
                            {children}
                        </Text>
                    </>
                )}
            </Pressable>
        );
    }
);

Button.displayName = 'Button';
