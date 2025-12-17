
import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ChartBarIcon, DocumentTextIcon, CircleStackIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, GithubIcon, LockClosedIcon, CheckCircleIcon } from '../icons';
import { useI18n } from '../../contexts/I18nContext';

interface AdminSidebarProps {
  activeRoute: string;
  onLock?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeRoute, onLock }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  
  const isDark = settings.theme === 'dark';
  const bgColor = isDark ? 'bg-[#0d1117]/80' : 'bg-white/80';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const activeBg = isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500' : 'bg-blue-50 text-blue-600 border-blue-600';
  const inactiveText = isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-900';

  const navItems = [
    { href: '#/admin/dashboard', label: t('admin.sidebar.dashboard'), icon: ChartBarIcon, id: 'dashboard' },
    { href: '#/admin/content', label: t('admin.sidebar.content'), icon: DocumentTextIcon, id: 'content' },
    { href: '#/admin/datasources', label: t('admin.sidebar.datasources'), icon: CircleStackIcon, id: 'datasources' },
    { href: '#/admin/settings', label: t('admin.sidebar.settings'), icon: Cog6ToothIcon, id: 'settings' },
  ];

  return (
    <aside className={`w-72 flex-shrink-0 flex flex-col border-r backdrop-blur-2xl transition-all duration-500 ${bgColor} ${borderColor}`}>
      <div className={`p-8 border-b ${borderColor} flex items-center gap-3`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <GithubIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`font-black text-lg tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('admin.title')}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
             <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Online</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => window.location.hash = item.href}
            className={`group w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl border-l-4 transition-all duration-300 ${
              activeRoute === item.id 
                ? activeBg
                : `border-transparent ${inactiveText} hover:bg-gray-500/5`
            }`}
          >
            <item.icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${activeRoute === item.id ? 'text-blue-500' : ''}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className={`p-6 border-t ${borderColor} space-y-4`}>
        {/* Health Indicators */}
        <div className="space-y-3 px-2 mb-6">
           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-gray-500">
              <span>GitHub API</span>
              <span className="text-green-500">99.9%</span>
           </div>
           <div className="w-full h-1 bg-gray-500/10 rounded-full overflow-hidden">
              <div className="h-full w-[90%] bg-green-500"></div>
           </div>
        </div>

        <div className="flex flex-col gap-2">
          {onLock && (
            <button onClick={onLock} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
              <LockClosedIcon className="w-5 h-5" />
              {t('admin.lock')}
            </button>
          )}
          <button onClick={() => window.location.hash = '#'} className={`flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${inactiveText}`}>
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            {t('admin.backToSite')}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
