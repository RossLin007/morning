import { useMemo } from 'react';
import { getLocales } from 'expo-localization';

// Simple flat translations for React Native MVP
const translations = {
    'zh-CN': {
        // Tab navigation
        dashboard: '首页',
        reading: '修行',
        community: '共修',
        profile: '我的',

        // Common
        welcome_back: '欢迎回来',
        login: '登录',
        logout: '退出登录',
        loading: '加载中...',
        confirm: '确认',
        cancel: '取消',
        save: '保存',
        back: '返回',

        // Dashboard
        todays_tasks: '今日任务',
        streak_days: '连续学习',
        progress: '进度',

        // Reading
        current_session: '当前期数',
        chapters: '课程章节',

        // Community
        community_feed: '书友圈',
        create_post: '分享你的心得感悟...',
        likes: '赞',
        comments: '评论',

        // Profile
        edit_profile: '编辑资料',
        settings: '设置',
        achievements: '我的成就',
        favorites: '我的收藏',
        history: '学习记录',
        notes: '我的笔记',

        // Login
        phone_input: '请输入手机号',
        get_code: '获取验证码',
        guest_mode: '游客模式体验',
        terms_agreement: '登录即表示您同意我们的《用户协议》和《隐私政策》',
    },
    'en-US': {
        // Tab navigation
        dashboard: 'Home',
        reading: 'Reading',
        community: 'Community',
        profile: 'Profile',

        // Common
        welcome_back: 'Welcome back',
        login: 'Login',
        logout: 'Logout',
        loading: 'Loading...',
        confirm: 'Confirm',
        cancel: 'Cancel',
        save: 'Save',
        back: 'Back',

        // Dashboard
        todays_tasks: "Today's Tasks",
        streak_days: 'Streak Days',
        progress: 'Progress',

        // Reading
        current_session: 'Current Session',
        chapters: 'Chapters',

        // Community
        community_feed: 'Community Feed',
        create_post: 'Share your thoughts...',
        likes: 'Likes',
        comments: 'Comments',

        // Profile
        edit_profile: 'Edit Profile',
        settings: 'Settings',
        achievements: 'Achievements',
        favorites: 'Favorites',
        history: 'History',
        notes: 'My Notes',

        // Login
        phone_input: 'Enter phone number',
        get_code: 'Get Code',
        guest_mode: 'Continue as Guest',
        terms_agreement: 'By logging in, you agree to our Terms of Service and Privacy Policy',
    },
} as const;

type TranslationKey = keyof typeof translations['zh-CN'];
type LocaleKey = keyof typeof translations;

export function useTranslation() {
    const locale = useMemo(() => {
        const deviceLocales = getLocales();
        const deviceLang = deviceLocales[0]?.languageTag || 'zh-CN';

        // Match to available translations
        if (deviceLang.startsWith('zh')) return 'zh-CN' as LocaleKey;
        return 'en-US' as LocaleKey;
    }, []);

    const t = useMemo(() => {
        const currentTranslations = translations[locale] || translations['zh-CN'];

        return (key: TranslationKey): string => {
            return currentTranslations[key] || translations['zh-CN'][key] || key;
        };
    }, [locale]);

    return { t, locale };
}
