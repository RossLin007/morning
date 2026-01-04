import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ReadingScreen() {
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();

    // Mock data for demo
    const currentSession = {
        id: '1',
        number: 3,
        theme: '改变之门',
        subtitle: '开启与意愿',
        progress: 45,
        totalDays: 21,
        currentDay: 10,
    };

    const chapters = [
        {
            id: 'ch1',
            title: '第一章：认识改变',
            lessons: [
                { id: 'l1', day: 1, title: '什么是真正的改变', duration: '15分钟', done: true },
                { id: 'l2', day: 2, title: '改变的阻力来自哪里', duration: '12分钟', done: true },
                { id: 'l3', day: 3, title: '意愿：改变的起点', duration: '18分钟', done: true },
            ],
        },
        {
            id: 'ch2',
            title: '第二章：觉察内心',
            lessons: [
                { id: 'l4', day: 4, title: '观察情绪的练习', duration: '20分钟', done: true },
                { id: 'l5', day: 5, title: '识别限制性信念', duration: '15分钟', done: true },
                { id: 'l6', day: 6, title: '与恐惧共处', duration: '18分钟', done: false },
            ],
        },
        {
            id: 'ch3',
            title: '第三章：采取行动',
            lessons: [
                { id: 'l7', day: 7, title: '小步前进的智慧', duration: '12分钟', done: false, locked: true },
                { id: 'l8', day: 8, title: '建立新习惯', duration: '15分钟', done: false, locked: true },
            ],
        },
    ];

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark justify-center items-center p-6">
                <Text className="text-gray-600 dark:text-gray-400">请先登录</Text>
                <Pressable
                    onPress={() => router.push('/login')}
                    className="bg-amber-600 px-6 py-2 rounded-lg mt-4"
                >
                    <Text className="text-white font-medium">去登录</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Current Session Header */}
                <View className="px-4 pt-4">
                    <View className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                                    第{currentSession.number}期
                                </Text>
                                <Text className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                    {currentSession.theme}
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                                    {currentSession.subtitle}
                                </Text>
                            </View>
                            <View className="items-center">
                                <View className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-800 items-center justify-center">
                                    <Text className="text-amber-700 dark:text-amber-300 text-xl font-bold">
                                        {currentSession.currentDay}
                                    </Text>
                                    <Text className="text-amber-600 dark:text-amber-400 text-xs">/{currentSession.totalDays}</Text>
                                </View>
                            </View>
                        </View>
                        {/* Progress Bar */}
                        <View className="mt-4">
                            <View className="h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-amber-600 rounded-full"
                                    style={{ width: `${currentSession.progress}%` }}
                                />
                            </View>
                            <Text className="text-amber-600 dark:text-amber-400 text-xs mt-1 text-right">
                                进度 {currentSession.progress}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Chapters */}
                <View className="px-4 mt-6">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        课程章节
                    </Text>

                    {chapters.map((chapter) => (
                        <View key={chapter.id} className="mb-6">
                            <Text className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                {chapter.title}
                            </Text>
                            <View className="space-y-2">
                                {chapter.lessons.map((lesson) => (
                                    <Pressable
                                        key={lesson.id}
                                        disabled={lesson.locked}
                                        className={`flex-row items-center p-4 rounded-xl ${lesson.done
                                                ? 'bg-green-50 dark:bg-green-900/20'
                                                : lesson.locked
                                                    ? 'bg-gray-100 dark:bg-gray-800 opacity-60'
                                                    : 'bg-white dark:bg-gray-800'
                                            }`}
                                    >
                                        <View
                                            className={`w-10 h-10 rounded-full items-center justify-center ${lesson.done
                                                    ? 'bg-green-100 dark:bg-green-800'
                                                    : lesson.locked
                                                        ? 'bg-gray-200 dark:bg-gray-700'
                                                        : 'bg-amber-100 dark:bg-amber-800'
                                                }`}
                                        >
                                            {lesson.done ? (
                                                <Ionicons name="checkmark" size={20} color="#16A34A" />
                                            ) : lesson.locked ? (
                                                <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
                                            ) : (
                                                <Text className="text-amber-700 dark:text-amber-300 font-bold">
                                                    {lesson.day}
                                                </Text>
                                            )}
                                        </View>
                                        <View className="flex-1 ml-3">
                                            <Text
                                                className={`font-medium ${lesson.done
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : lesson.locked
                                                            ? 'text-gray-400 dark:text-gray-500'
                                                            : 'text-gray-900 dark:text-white'
                                                    }`}
                                            >
                                                Day {lesson.day}: {lesson.title}
                                            </Text>
                                            <Text className="text-gray-500 dark:text-gray-400 text-sm">
                                                {lesson.duration}
                                            </Text>
                                        </View>
                                        {!lesson.locked && (
                                            <Ionicons
                                                name={lesson.done ? 'checkmark-circle' : 'play-circle'}
                                                size={28}
                                                color={lesson.done ? '#16A34A' : '#B45309'}
                                            />
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Bottom spacing */}
                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
}
