
import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChartBarIcon, DocumentTextIcon, CircleStackIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, GithubIcon, LockClosedIcon } from '../icons';
import { useI18n } from '../../contexts/I18nContext';

interface AdminSidebarProps {
  activeRoute: string;
  onLock?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeRoute, onLock }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  
  const bgColor = settings.theme === 'light' ? 'bg-white border-r border-gray-200' : 'bg-[#161b22] border-r border-gray-800';
  const textColor = settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const textHoverColor = settings.theme === 'light' ? 'text-gray-900 bg-gray-100' : 'text-white bg-gray-800/60';
  const activeColor = settings.theme === 'light' ? 'text-blue-600 bg-blue-50 border-blue-600' : 'text-white bg-blue-600/10 border-blue-500';
  const borderColor = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-800';
  const mainTextColor = settings.theme === 'light' ? 'text-gray-800' : 'text-white';


  const navItems = [
    { href: '#/admin/dashboard', label: t('admin.sidebar.dashboard'), icon: ChartBarIcon, id: 'dashboard' },
    { href: '#/admin/content', label: t('admin.sidebar.content'), icon: DocumentTextIcon, id: 'content' },
    { href: '#/admin/datasources', label: t('admin.sidebar.datasources'), icon: CircleStackIcon, id: 'datasources' },
    { href: '#/admin/settings', label: t('admin.sidebar.settings'), icon: Cog6ToothIcon, id: 'settings' },
  ];

  const handleNavigate = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <aside className={`w-64 flex-shrink-0 flex flex-col transition-colors duration-300 ${bgColor}`}>
      <div className={`flex items-center justify-center h-16 border-b px-4 ${borderColor}`}>
        {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-md" />
        ) : (
            <GithubIcon className="w-8 h-8 text-blue-500" />
        )}
        <span className={`ml-3 font-semibold text-lg ${mainTextColor}`}>{t('admin.title')}</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.href)}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md border-l-4 transition-all duration-200 text-left ${
              activeRoute === item.id 
                ? `${activeColor}`
                : `${textColor} border-transparent hover:${textHoverColor}`
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className={`px-3 py-4 border-t space-y-2 ${borderColor}`}>
        {onLock && (
            <button
                onClick={onLock}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10`}
            >
                <LockClosedIcon className="w-5 h-5 mr-3" />
                <span>{t('admin.lock')}</span>
            </button>
        )}
         <button
            onClick={() => handleNavigate('#')}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 text-left ${textColor} hover:${textHoverColor}`}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
            <span>{t('admin.backToSite')}</span>
          </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
