
import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { ApiKeyEntry } from '../types';

const Settings: React.FC = () => {
  const { settings, saveSettings } = useSettings();
  const [siteName, setSiteName] = useState(settings.siteName);
  const [theme, setTheme] = useState(settings.theme);
  
  // Initialize state from the first API key if available, or fallback to deprecated global settings
  const firstKey = settings.apiKeys?.[0];
  const [apiKey, setApiKey] = useState(firstKey?.key || '');
  // Ensure we have a valid model selected
  const [model, setModel] = useState(firstKey?.defaultModel || settings.model || 'gemini-2.5-flash');
  
  const [showSuccess, setShowSuccess] = useState(false);

  const cardBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const inputBg = settings.theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-200';
  const labelColor = settings.theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const buttonColor = 'bg-blue-600 hover:bg-blue-700 text-white';
  const successColor = settings.theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/50 text-green-300';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the API key entry with the selected model explicitly set
    const newApiKeys: ApiKeyEntry[] = apiKey.trim()
        ? [{
            id: firstKey?.id || `key-${Date.now()}`,
            name: firstKey?.name || '默认密钥',
            key: apiKey.trim(),
            provider: firstKey?.provider || 'gemini',
            defaultModel: model, // Explicitly save the selected model to the key
            status: 'unchecked',
            lastChecked: null
        }]
        : [];

    saveSettings({ 
        ...settings, 
        siteName, 
        theme, 
        apiKeys: newApiKeys, 
        model // Keep global model for backward compatibility/fallback
    });
    setShowSuccess(true);
  };
  
  const navigate = (hash: string) => {
    window.location.hash = hash;
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className={`max-w-2xl mx-auto p-6 md:p-8 rounded-lg border shadow-lg transition-colors duration-300 ${cardBg} ${settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'}`}>设置</h1>
        <p className={`mt-1 text-sm ${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          自定义您的应用体验。所有设置将保存在您的浏览器中。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="siteName" className={`block text-sm font-medium mb-2 ${labelColor}`}>
            网站名称
          </label>
          <input
            type="text"
            id="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-300 ${inputBg}`}
          />
        </div>

        <div>
          <label htmlFor="apiKey" className={`block text-sm font-medium mb-2 ${labelColor}`}>
            Gemini API 密钥
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="在此输入您的 API 密钥"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-300 ${inputBg}`}
          />
          <p className={`mt-2 text-xs ${settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            您的密钥将安全地存储在浏览器本地，不会上传到任何服务器。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="model" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                AI 模型
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-300 ${inputBg}`}
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (推荐)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              </select>
            </div>
            <div>
              <label htmlFor="theme" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                页面风格
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-300 ${inputBg}`}
              >
                <option value="dark">深色模式</option>
                <option value="light">浅色模式</option>
              </select>
            </div>
        </div>
        
        <div className="border-t pt-6 mt-6 flex items-center justify-between border-gray-200 dark:border-gray-700">
            <button type="button" onClick={() => navigate('#')} className="text-sm text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer">
             &larr; 返回主页
            </button>
            <div className="flex items-center">
                 {showSuccess && (
                    <div className={`text-sm font-medium mr-4 px-3 py-1 rounded-md transition-opacity duration-300 ${successColor}`}>
                        设置已保存！
                    </div>
                )}
                <button
                    type="submit"
                    className={`px-6 py-2 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${buttonColor}`}
                >
                    保存设置
                </button>
            </div>
        </div>
      </form>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
         <h2 className={`text-lg font-semibold ${settings.theme === 'light' ? 'text-gray-800' : 'text-white'}`}>高级</h2>
         <div className="mt-4 flex justify-between items-center">
            <p className={`text-sm ${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>管理已发现的项目内容。</p>
            <button
                onClick={() => navigate('#/admin')}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 ${settings.theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
            >
                进入内容管理
            </button>
         </div>
      </div>
    </div>
  );
};

export default Settings;
