
import React, { useState, useEffect } from 'react';
import { DisplayItem, ProcessedRepo, ScraperPlugin } from '../types';
import AdminSidebar from './admin/AdminSidebar';
import DashboardPanel from './admin/DashboardPanel';
import ContentManagementPanel from './admin/ContentManagementPanel';
import DataSourcePanel from './admin/DataSourcePanel';
import SettingsPanel from './admin/SettingsPanel';
import { useSettings } from '../contexts/SettingsContext';
import { useI18n } from '../contexts/I18nContext';
import { Cog6ToothIcon, ArrowLeftOnRectangleIcon } from './icons';

interface AdminDashboardProps {
  activeSubRoute: string;
  displayItems: DisplayItem[];
  plugins: ScraperPlugin[];
  onDeleteItem: (itemId: number | string, itemType: 'github' | 'custom') => void;
  onBulkDelete: (selectedIds: Set<string | number>) => void;
  onEditProject: (project: ProcessedRepo) => void;
  onRunPlugin: (plugin: ScraperPlugin) => Promise<void>;
  onEditPlugin: (plugin: ScraperPlugin) => void;
  onDeletePlugin: (pluginId: string) => void;
  onCreatePlugin: () => void;
}

const AdminLogin: React.FC<{ onLogin: (success: boolean) => void }> = ({ onLogin }) => {
    const { settings } = useSettings();
    const { t } = useI18n();
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === settings.adminPassword) {
            onLogin(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    const navigateHome = () => {
        window.location.hash = '#';
    };

    const cardBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
    const textColor = settings.theme === 'light' ? 'text-gray-900' : 'text-white';
    const inputBg = settings.theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-200';

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${settings.theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
            <div className={`w-full max-w-md p-8 rounded-xl shadow-2xl ${cardBg}`}>
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-600/10 rounded-full">
                         <Cog6ToothIcon className="w-10 h-10 text-blue-500" />
                    </div>
                </div>
                <h2 className={`text-2xl font-bold text-center mb-2 ${textColor}`}>{t('admin.loginTitle')}</h2>
                <p className={`text-center mb-8 text-sm ${settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('admin.loginDesc')}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('admin.passwordPlaceholder')}
                            className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${inputBg} ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            autoFocus
                        />
                         {error && <p className="mt-2 text-xs text-red-500 text-center animate-pulse">{t('admin.wrongPassword')}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform active:scale-95"
                    >
                        {t('admin.unlock')}
                    </button>
                </form>
                
                <button 
                    onClick={navigateHome}
                    className={`mt-6 w-full flex items-center justify-center text-sm ${settings.theme === 'light' ? 'text-gray-500 hover:text-gray-800' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                    {t('admin.backToSite')}
                </button>
            </div>
        </div>
    );
};

/**
 * 管理后台的主布局组件。
 * 它包含一个侧边栏导航和主内容区域，并根据路由动态渲染不同的管理面板。
 * 现在增加了密码保护功能。
 */
const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { settings } = useSettings();
  
  // 如果没有设置密码，默认已认证。如果设置了，默认未认证（除非利用 sessionStorage 优化体验，这里简化为每次刷新锁住）
  const [isAuthenticated, setIsAuthenticated] = useState(() => !settings.adminPassword);

  useEffect(() => {
      // 监听 settings 变化，如果用户刚刚清除了密码，自动解锁
      if (!settings.adminPassword) {
          setIsAuthenticated(true);
      }
  }, [settings.adminPassword]);

  // 根据 activeSubRoute 渲染对应的面板组件
  const renderPanel = () => {
    switch(props.activeSubRoute) {
      case 'content':
        return <ContentManagementPanel displayItems={props.displayItems} onDeleteItem={props.onDeleteItem} onBulkDelete={props.onBulkDelete} onEditProject={props.onEditProject} />;
      case 'datasources':
        return <DataSourcePanel plugins={props.plugins} onRunPlugin={props.onRunPlugin} onEditPlugin={props.onEditPlugin} onDeletePlugin={props.onDeletePlugin} onCreatePlugin={props.onCreatePlugin} />;
      case 'settings':
        return <SettingsPanel />;
      case 'dashboard':
      default:
        return <DashboardPanel displayItems={props.displayItems} plugins={props.plugins} onRunPlugin={props.onRunPlugin} onCreatePlugin={props.onCreatePlugin} />;
    }
  };
  
  const handleLock = () => {
      setIsAuthenticated(false);
  };

  // 根据主题设置背景和文本颜色
  const bgColor = settings.theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const textColor = settings.theme === 'light' ? 'text-gray-900' : 'text-white';

  if (!isAuthenticated) {
      return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <div className={`flex flex-grow ${bgColor} ${textColor}`}>
      {/* 侧边栏导航 */}
      <AdminSidebar activeRoute={props.activeSubRoute} onLock={settings.adminPassword ? handleLock : undefined} />
      {/* 主内容区域 */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {renderPanel()}
      </main>
    </div>
  );
};

export default AdminDashboard;
