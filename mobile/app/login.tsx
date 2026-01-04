import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';

export default function LoginScreen() {
    const { loginAsGuest, setAuthData } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();

    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleSendCode = async () => {
        if (!phone || phone.length < 11) {
            // TODO: Show error toast
            return;
        }

        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCodeSent(true);
        setCountdown(60);
        setLoading(false);

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleLogin = async () => {
        if (!code || code.length < 4) {
            // TODO: Show error toast
            return;
        }

        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock successful login
        await setAuthData(
            {
                id: 'demo-user-id',
                phone: phone,
                display_name: '书友',
                avatar_url: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            'mock-access-token'
        );

        setLoading(false);
        router.back();
    };

    const handleGuestLogin = () => {
        loginAsGuest();
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="flex-row items-center px-4 py-3">
                    <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                        <Ionicons name="close" size={28} color="#6B7280" />
                    </Pressable>
                </View>

                <View className="flex-1 px-6 pt-8">
                    {/* Logo */}
                    <View className="items-center mb-8">
                        <View className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900 items-center justify-center mb-4">
                            <Ionicons name="book" size={40} color="#B45309" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                            凡人晨读
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 mt-2">
                            开启心灵成长之旅
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View className="space-y-4">
                        {/* Phone Input */}
                        <View>
                            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                手机号
                            </Text>
                            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4">
                                <Text className="text-gray-500 dark:text-gray-400">+86</Text>
                                <TextInput
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="请输入手机号"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="phone-pad"
                                    maxLength={11}
                                    className="flex-1 py-4 px-3 text-gray-900 dark:text-white"
                                />
                            </View>
                        </View>

                        {/* Code Input */}
                        {codeSent && (
                            <View>
                                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                    验证码
                                </Text>
                                <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4">
                                    <TextInput
                                        value={code}
                                        onChangeText={setCode}
                                        placeholder="请输入验证码"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        className="flex-1 py-4 text-gray-900 dark:text-white"
                                    />
                                    <Pressable
                                        onPress={handleSendCode}
                                        disabled={countdown > 0}
                                        className={countdown > 0 ? 'opacity-50' : ''}
                                    >
                                        <Text className="text-amber-600 dark:text-amber-400 font-medium">
                                            {countdown > 0 ? `${countdown}s` : '重新发送'}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}

                        {/* Action Button */}
                        <View className="pt-4">
                            {codeSent ? (
                                <Button onPress={handleLogin} loading={loading} fullWidth>
                                    登录
                                </Button>
                            ) : (
                                <Button onPress={handleSendCode} loading={loading} fullWidth>
                                    获取验证码
                                </Button>
                            )}
                        </View>

                        {/* Divider */}
                        <View className="flex-row items-center py-6">
                            <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <Text className="mx-4 text-gray-400 dark:text-gray-500">或</Text>
                            <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </View>

                        {/* Guest Login */}
                        <Button
                            onPress={handleGuestLogin}
                            variant="outline"
                            fullWidth
                            icon={<Ionicons name="person-outline" size={18} color="#B45309" />}
                        >
                            游客模式体验
                        </Button>
                    </View>
                </View>

                {/* Footer */}
                <View className="px-6 pb-6">
                    <Text className="text-center text-gray-400 dark:text-gray-500 text-xs">
                        登录即表示您同意我们的
                        <Text className="text-amber-600">《用户协议》</Text>和
                        <Text className="text-amber-600">《隐私政策》</Text>
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
