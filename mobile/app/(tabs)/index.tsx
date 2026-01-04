import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // Mock data for demo
  const todayProgress = {
    completed: 2,
    total: 5,
    streakDays: 7,
  };

  const tasks = [
    { id: '1', title: '晨读打卡', subtitle: '第7天', icon: 'sunny-outline', done: true },
    { id: '2', title: '阅读课程', subtitle: '15分钟', icon: 'book-outline', done: true },
    { id: '3', title: '觉察日记', subtitle: '记录今日感悟', icon: 'journal-outline', done: false },
    { id: '4', title: '社区分享', subtitle: '与书友交流', icon: 'chatbubbles-outline', done: false },
    { id: '5', title: '晚间复习', subtitle: '巩固知识', icon: 'moon-outline', done: false },
  ];

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark justify-center items-center p-6">
        <Ionicons name="book" size={64} color="#B45309" />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          凡人晨读
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mt-2 mb-6">
          开启你的心灵成长之旅
        </Text>
        <Pressable
          onPress={() => router.push('/login')}
          className="bg-amber-600 px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold text-lg">登录 / 注册</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {t('welcome_back')}
              </Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.display_name || '书友'}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/profile')}
              className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 items-center justify-center"
            >
              {user?.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={24} color="#B45309" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Streak Card */}
        <View className="mx-4 mt-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-amber-100 text-sm">连续学习</Text>
              <Text className="text-white text-4xl font-bold">
                {todayProgress.streakDays} <Text className="text-lg">天</Text>
              </Text>
            </View>
            <View className="bg-white/20 rounded-full p-4">
              <Ionicons name="flame" size={32} color="#FFF" />
            </View>
          </View>
          <View className="mt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-amber-100 text-sm">今日进度</Text>
              <Text className="text-white text-sm font-medium">
                {todayProgress.completed}/{todayProgress.total}
              </Text>
            </View>
            <View className="h-2 bg-white/30 rounded-full overflow-hidden">
              <View
                className="h-full bg-white rounded-full"
                style={{ width: `${(todayProgress.completed / todayProgress.total) * 100}%` }}
              />
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            今日任务
          </Text>
          <View className="space-y-3">
            {tasks.map((task) => (
              <Pressable
                key={task.id}
                className={`flex-row items-center p-4 rounded-xl ${task.done
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-white dark:bg-gray-800'
                  }`}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${task.done ? 'bg-green-100' : 'bg-amber-100'
                    }`}
                >
                  <Ionicons
                    name={task.done ? 'checkmark' : (task.icon as any)}
                    size={20}
                    color={task.done ? '#16A34A' : '#B45309'}
                  />
                </View>
                <View className="flex-1 ml-3">
                  <Text
                    className={`font-medium ${task.done
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-gray-900 dark:text-white'
                      }`}
                  >
                    {task.title}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {task.subtitle}
                  </Text>
                </View>
                {!task.done && (
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
