
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiKeyEntry } from '../types';

// 定义主题类型
type Theme = 'light' | 'dark';
// 定义布局类型
type Layout = 'grid' | 'list';

/**
 * 定义应用设置的结构。
 */
export interface Settings {
  siteName: string;
  logoUrl: string; // 用户自定义的 Logo 图片地址
  theme: Theme;
  apiKeys: ApiKeyEntry[];
  layout: Layout;
  /** @deprecated model 字段已废弃，现在由 apiKeys 中的 defaultModel 控制，保留此字段仅为了兼容性 */
  model: string;
  isSearchEnabled: boolean;
  footerText: string;
  language: 'en' | 'zh-CN';
  adminPassword?: string; // 管理后台密码
  githubToken?: string; // GitHub Personal Access Token 用于提高 API 限额
}

/**
 * 定义 Settings Context 的类型。
 */
interface SettingsContextType {
  settings: Settings;
  saveSettings: (newSettings: Partial<Settings>) => void;
}

// 默认设置对象
const defaultSettings: Settings = {
  siteName: 'Niux-Discovery',
  logoUrl: '',
  theme: 'dark',
  apiKeys: [], // 默认没有 API 密钥
  layout: 'grid',
  model: 'gemini-2.5-flash',
  isSearchEnabled: true,
  footerText: '© 2024 Niux-Discovery. All Rights Reserved.',
  language: 'zh-CN',
  adminPassword: '',
  githubToken: '',
};

// 创建 Settings Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * SettingsProvider 组件，用于向其子组件提供 settings 状态和 saveSettings 函数。
 */
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 使用 useState 初始化 settings 状态，并尝试从 localStorage 加载已保存的设置
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('app-settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        
        // 从旧的单一 apiKey 迁移到新的 apiKeys 数组结构
        if (parsed.apiKey && !parsed.apiKeys) {
          if (parsed.apiKey !== 'USE_MOCK_DATA' && parsed.apiKey.trim() !== '') {
            parsed.apiKeys = [{
              id: `key-${Date.now()}`,
              name: '默认密钥',
              key: parsed.apiKey,
              status: 'unchecked',
              lastChecked: null,
              provider: 'gemini',
              defaultModel: 'gemini-2.5-flash'
            } as ApiKeyEntry];
          } else {
            parsed.apiKeys = [];
          }
          delete parsed.apiKey; // 移除旧字段
        }

        // 确保所有现有的 key 都有 defaultModel (针对从上一版本升级的用户)
        if (parsed.apiKeys && Array.isArray(parsed.apiKeys)) {
            parsed.apiKeys = parsed.apiKeys.map((key: ApiKeyEntry) => {
                if (!key.defaultModel) {
                    // 如果没有模型，根据 provider 给一个默认值
                    return {
                        ...key,
                        defaultModel: key.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.5-flash'
                    };
                }
                return key;
            });
        }

        // 合并默认设置和已保存的设置，以确保所有字段都存在
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    return defaultSettings;
  });

  // 使用 useEffect 监听 settings 的变化
  useEffect(() => {
    try {
      // 将最新的 settings 保存到 localStorage
      const settingsToStore = JSON.stringify(settings);
      localStorage.setItem('app-settings', settingsToStore);
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
    
    // 将当前主题应用到 body 元素，以改变全局背景色
    document.body.className = ''; // 清除旧的主题类
    if (settings.theme === 'light') {
        document.body.style.backgroundColor = '#f3f4f6';
    } else {
        document.body.style.backgroundColor = '#0d1117';
    }

  }, [settings]);

  // 更新设置的函数
  const saveSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * 自定义 Hook，用于在组件中方便地访问 Settings Context。
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
