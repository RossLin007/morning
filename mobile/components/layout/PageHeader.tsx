import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface PageHeaderProps {
    title: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
}

export function PageHeader({ title, showBack = false, rightAction }: PageHeaderProps) {
    const router = useRouter();

    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <View className="flex-row items-center">
                {showBack && (
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-3 p-1"
                        hitSlop={10}
                    >
                        <Ionicons name="chevron-back" size={24} color="#374151" />
                    </Pressable>
                )}
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    {title}
                </Text>
            </View>
            {rightAction && <View>{rightAction}</View>}
        </View>
    );
}
