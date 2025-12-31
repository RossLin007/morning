
import { useCallback, useState, useEffect } from 'react';
import { zhCN } from '@/lib/i18n/zh-CN';
import { enUS } from '@/lib/i18n/en-US';

const translations = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

type LocaleKey = keyof typeof translations;

// Helper to access nested properties safely
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj) || path; // Fallback to key if not found
}

export const useTranslation = () => {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    const saved = localStorage.getItem('mr_locale') as LocaleKey;
    if (saved && translations[saved]) return saved;
    
    // Auto detect
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) return 'zh-CN';
    return 'en-US';
  });

  const changeLanguage = useCallback((lang: LocaleKey) => {
    setLocale(lang);
    localStorage.setItem('mr_locale', lang);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const currentTranslations = translations[locale];
    let value = getNestedValue(currentTranslations, key);

    // If value is exactly the key (not found) or not a string, return key
    if (value === key || typeof value !== 'string') return key;

    // Interpolation: replace {variable} with value
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }

    return value;
  }, [locale]);

  return { t, locale, changeLanguage };
};
