import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProfileScreen() {
    const { user, isAuthenticated, signOut, isGuest } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();

    // Mock stats for demo
    const stats = {
        streak: 21,
        lessons: 45,
        diaries: 18,
        insights: 32,
    };

    const menuItems = [
        { id: 'achievements', icon: 'trophy-outline', label: '我的成就', badge: '3' },
        { id: 'favorites', icon: 'bookmark-outline', label: '我的收藏' },
        { id: 'history', icon: 'time-outline', label: '学习记录' },
        { id: 'notes', icon: 'document-text-outline', label: '我的笔记' },
        { id: 'settings', icon: 'settings-outline', label: '设置' },
    ];

    const handleLogout = () => {
        Alert.alert('退出登录', '确定要退出登录吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '确定',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                },
            },
        ]);
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark justify-center items-center p-6">
                <View className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center mb-4">
                    <Ionicons name="person-outline" size={48} color="#9CA3AF" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    未登录
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                    登录后查看个人资料和学习数据
                </Text>
                <Pressable
                    onPress={() => router.push('/login')}
                    className="bg-amber-600 px-8 py-3 rounded-xl mt-6"
                >
                    <Text className="text-white font-semibold">登录 / 注册</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="px-4 pt-4 pb-6">
                    <View className="flex-row items-center">
                        <View className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900 items-center justify-center">
                            {user?.avatar_url ? (
                                <Image
                                    source={{ uri: user.avatar_url }}
                                    className="w-20 h-20 rounded-full"
                                />
                            ) : (
                                <Ionicons name="person" size={40} color="#B45309" />
                            )}
                        </View>
                        <View className="flex-1 ml-4">
                            <View className="flex-row items-center">
                                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                                    {user?.display_name || '书友'}
                                </Text>
                                {isGuest && (
                                    <View className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                                        <Text className="text-gray-600 dark:text-gray-400 text-xs">
                                            游客
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                {user?.email || user?.phone || 'ID: ' + user?.id?.slice(0, 8)}
                            </Text>
                            <Pressable className="flex-row items-center mt-2">
                                <Text className="text-amber-600 dark:text-amber-400 text-sm">
                                    编辑资料
                                </Text>
                                <Ionicons name="chevron-forward" size={14} color="#B45309" />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Stats Cards */}
                <View className="flex-row px-4 gap-3">
                    <View className="flex-1 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 items-center">
                        <Text className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                            {stats.streak}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            连续天数
                        </Text>
                    </View>
                    <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 items-center">
                        <Text className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                            {stats.lessons}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            已完成课程
                        </Text>
                    </View>
                    <View className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 items-center">
                        <Text className="text-2xl font-bold text-green-700 dark:text-green-400">
                            {stats.diaries}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            觉察日记
                        </Text>
                    </View>
                    <View className="flex-1 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 items-center">
                        <Text className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                            {stats.insights}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            洞见数
                        </Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="px-4 mt-6">
                    <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                        {menuItems.map((item, index) => (
                            <Pressable
                                key={item.id}
                                className={`flex-row items-center px-4 py-4 ${index < menuItems.length - 1
                                        ? 'border-b border-gray-100 dark:border-gray-700'
                                        : ''
                                    }`}
                            >
                                <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center">
                                    <Ionicons
                                        name={item.icon as any}
                                        size={18}
                                        color="#6B7280"
                                    />
                                </View>
                                <Text className="flex-1 ml-3 text-gray-900 dark:text-white">
                                    {item.label}
                                </Text>
                                {item.badge && (
                                    <View className="bg-red-500 rounded-full px-2 py-0.5 mr-2">
                                        <Text className="text-white text-xs font-medium">
                                            {item.badge}
                                        </Text>
                                    </View>
                                )}
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Logout Button */}
                <View className="px-4 mt-6 mb-8">
                    <Pressable
                        onPress={handleLogout}
                        className="bg-red-50 dark:bg-red-900/20 rounded-xl py-4 items-center"
                    >
                        <Text className="text-red-600 dark:text-red-400 font-medium">
                            退出登录
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
