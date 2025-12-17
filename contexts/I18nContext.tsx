import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

// 定义翻译文件的结构
interface Translations {
  [key: string]: string | Translations;
}

// 定义翻译函数的类型
type TFunction = (key: string, options?: { [key: string]: string | number }) => string;

interface I18nContextType {
  t: TFunction;
  language: 'en' | 'zh-CN';
}

// 创建 i18n Context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * 辅助函数，用于通过点 (.) 分割的路径字符串从嵌套对象中获取值。
 * @param obj - 源对象
 * @param path - 路径字符串，例如 'admin.dashboard.title'
 * @returns - 返回找到的值，如果未找到则返回 undefined
 */
const getNestedValue = (obj: any, path: string): string | undefined => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * I18nProvider 组件，为其子组件提供 i18n 功能。
 * 它现在异步获取翻译文件。
 */
export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const language = settings.language || 'zh-CN';
  const [translations, setTranslations] = useState<{ [key: string]: Translations } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true);
      try {
        // 并发获取两个语言文件。路径相对于 index.html。
        const [enResponse, zhResponse] = await Promise.all([
          fetch('./en.json'),
          fetch('./zh-CN.json')
        ]);

        if (!enResponse.ok || !zhResponse.ok) {
          throw new Error('Failed to fetch translation files');
        }

        const en = await enResponse.json();
        const zh = await zhResponse.json();
        
        setTranslations({ 'en': en, 'zh-CN': zh });
      } catch (error) {
        console.error("Error loading translation files:", error);
        // 设置空的翻译以避免应用崩溃
        setTranslations({ 'en': {}, 'zh-CN': {} });
      } finally {
        setLoading(false);
      }
    };
    loadTranslations();
  }, []);

  // 使用 useMemo 优化翻译函数，仅在语言或翻译内容变化时重新创建
  const t = useMemo((): TFunction => (key, options) => {
    if (loading || !translations) {
      return key; // 在加载期间或翻译失败时返回 key 本身
    }
    
    const langFile = translations[language];
    let translation = getNestedValue(langFile, key) || key;

    // 如果提供了选项，则替换占位符
    if (options) {
      Object.keys(options).forEach(optionKey => {
        const regex = new RegExp(`{${optionKey}}`, 'g');
        translation = translation.replace(regex, String(options[optionKey]));
      });
    }

    return translation;
  }, [language, translations, loading]);

  const value = useMemo(() => ({ t, language }), [t, language]);

  // 在翻译加载完成前不渲染子组件，以防止闪烁
  if (loading) {
    return null;
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

/**
 * 自定义 Hook，用于在组件中方便地访问 i18n Context。
 */
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
