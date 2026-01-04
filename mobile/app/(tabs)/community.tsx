import { View, Text, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function CommunityScreen() {
    const { isAuthenticated, user } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // Mock data for demo
    const posts = [
        {
            id: '1',
            user: { name: '静心书友', avatar: null, level: 5 },
            content:
                '今天读到"真正的改变不是努力成为别人，而是回归真实的自己"，突然明白了为什么过去的努力总是感觉很累。不再对抗自己，反而轻松了很多。',
            likes: 23,
            comments: 5,
            time: '10分钟前',
            isLiked: true,
        },
        {
            id: '2',
            user: { name: '晨曦', avatar: null, level: 3 },
            content:
                '坚持晨读第21天打卡！从最开始的抗拒到现在的期待，感谢这个平台和一起成长的书友们 🌅',
            likes: 45,
            comments: 12,
            time: '1小时前',
            image: null,
            isLiked: false,
        },
        {
            id: '3',
            user: { name: '心灵花园', avatar: null, level: 8 },
            content:
                '觉察日记写了一周，发现自己很多自动化反应模式。原来很多烦恼都是源于对"应该"的执着。分享给大家一个小技巧：每次想说"应该"的时候，换成"可以"试试。',
            likes: 67,
            comments: 18,
            time: '3小时前',
            isLiked: false,
        },
    ];

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

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
            {/* Header */}
            <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    书友圈
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Create Post */}
                <Pressable className="flex-row items-center px-4 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <View className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 items-center justify-center">
                        <Ionicons name="person" size={20} color="#B45309" />
                    </View>
                    <Text className="flex-1 ml-3 text-gray-400 dark:text-gray-500">
                        分享你的心得感悟...
                    </Text>
                    <Ionicons name="create-outline" size={24} color="#B45309" />
                </Pressable>

                {/* Posts */}
                {posts.map((post) => (
                    <View
                        key={post.id}
                        className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-4"
                    >
                        {/* Post Header */}
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center">
                                <Ionicons name="person" size={20} color="#9CA3AF" />
                            </View>
                            <View className="flex-1 ml-3">
                                <View className="flex-row items-center">
                                    <Text className="font-semibold text-gray-900 dark:text-white">
                                        {post.user.name}
                                    </Text>
                                    <View className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900 rounded">
                                        <Text className="text-amber-700 dark:text-amber-300 text-xs">
                                            Lv.{post.user.level}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                                    {post.time}
                                </Text>
                            </View>
                        </View>

                        {/* Post Content */}
                        <Text className="mt-3 text-gray-800 dark:text-gray-200 leading-6">
                            {post.content}
                        </Text>

                        {/* Post Actions */}
                        <View className="flex-row items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <Pressable className="flex-row items-center mr-6">
                                <Ionicons
                                    name={post.isLiked ? 'heart' : 'heart-outline'}
                                    size={20}
                                    color={post.isLiked ? '#EF4444' : '#9CA3AF'}
                                />
                                <Text
                                    className={`ml-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'
                                        }`}
                                >
                                    {post.likes}
                                </Text>
                            </Pressable>
                            <Pressable className="flex-row items-center mr-6">
                                <Ionicons name="chatbubble-outline" size={18} color="#9CA3AF" />
                                <Text className="ml-1 text-gray-500">{post.comments}</Text>
                            </Pressable>
                            <Pressable className="flex-row items-center">
                                <Ionicons name="share-outline" size={20} color="#9CA3AF" />
                            </Pressable>
                        </View>
                    </View>
                ))}

                {/* Bottom spacing */}
                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
}
