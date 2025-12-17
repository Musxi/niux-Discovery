
import React, { useMemo } from 'react';
import { DisplayItem, ScraperPlugin, ProcessedRepo } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { DocumentTextIcon, GithubIcon, CircleStackIcon, RefreshIcon, PlusIcon, GlobeAltIcon, ArrowTopRightOnSquareIcon, CircleStackIcon as StorageIcon, ChartBarIcon } from '../icons';
import { timeAgo } from '../../utils/date';
import { useI18n } from '../../contexts/I18nContext';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string; theme: 'light' | 'dark' }> = ({ icon, label, value, theme }) => {
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  return (
    <div className={`p-5 rounded-lg border shadow-lg flex items-center gap-4 ${cardBg} ${borderColor}`}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${mutedTextColor}`}>{label}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  );
};

// Simple Bar Chart Component for "Top Languages"
const SimpleBarChart: React.FC<{ data: { label: string; value: number }[]; theme: 'light' | 'dark'; title: string }> = ({ data, theme, title }) => {
    const cardBg = theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
    const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
    const barColor = 'bg-blue-500';

    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className={`p-6 rounded-lg border shadow-lg ${cardBg} ${borderColor} h-full`}>
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                        <div className={`w-24 truncate ${textColor}`}>{item.label}</div>
                        <div className="flex-1 mx-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${barColor}`} 
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <div className={`w-8 text-right ${textColor}`}>{item.value}</div>
                    </div>
                ))}
                {data.length === 0 && <p className="text-gray-500 text-sm">No data available.</p>}
            </div>
        </div>
    );
};

interface DashboardPanelProps {
  displayItems: DisplayItem[];
  plugins: ScraperPlugin[];
  onRunPlugin: (plugin: ScraperPlugin) => Promise<void>;
  onCreatePlugin: () => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ displayItems, plugins, onRunPlugin, onCreatePlugin }) => {
  const { settings } = useSettings();
  const { t } = useI18n();

  const githubItemsCount = displayItems.filter(item => item.sourceType === 'github').length;
  const customItemsCount = displayItems.filter(item => item.sourceType === 'custom').length;
  const totalItems = displayItems.length;
  const totalPlugins = plugins.length;
  
  const recentItems = [...displayItems].sort((a, b) => {
      const dateA = new Date(a.sourceType === 'github' ? a.collectedAt : a.createdAt).getTime();
      const dateB = new Date(b.sourceType === 'github' ? b.collectedAt : b.createdAt).getTime();
      return dateB - dateA;
  }).slice(0, 5);

  const cardBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const textColor = settings.theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedTextColor = settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderColor = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  const githubPlugin = plugins.find(p => p.type === 'builtin');
  
  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  // Calculate local storage usage
  const storageStats = useMemo(() => {
    let totalSize = 0;
    try {
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += (localStorage[key].length * 2);
            }
        }
    } catch (e) {
        console.error("Error accessing localStorage", e);
    }
    
    // Convert to KB or MB
    const totalSizeKB = totalSize / 1024;
    const maxApprox = 5 * 1024; // 5MB is typical browser limit
    const percentage = Math.min(100, Math.round((totalSizeKB / maxApprox) * 100));
    const displayValue = totalSizeKB > 1024 ? `${(totalSizeKB / 1024).toFixed(2)} MB` : `${totalSizeKB.toFixed(2)} KB`;
    
    return { percentage, displayValue, total: '5 MB' };
  }, [displayItems, plugins]);

  // Analytics: Top Languages (from GitHub repos)
  const topLanguages = useMemo(() => {
      const counts: Record<string, number> = {};
      displayItems.forEach(item => {
          if (item.sourceType === 'github') {
              const lang = (item as ProcessedRepo).language || 'Unknown';
              counts[lang] = (counts[lang] || 0) + 1;
          }
      });
      return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([label, value]) => ({ label, value }));
  }, [displayItems]);

  // Analytics: Top Categories
  const topCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    displayItems.forEach(item => {
        const cat = item.aiSummary.category || 'Unknown';
        counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }));
}, [displayItems]);

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      <div>
        <h1 className={`text-3xl font-bold ${textColor}`}>{t('admin.dashboard.title')}</h1>
        <p className={`mt-2 text-lg ${mutedTextColor}`}>{t('admin.dashboard.welcome')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard theme={settings.theme} label={t('admin.dashboard.totalContent')} value={totalItems} icon={<div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400"><DocumentTextIcon className="w-6 h-6" /></div>} />
        <StatCard theme={settings.theme} label={t('admin.dashboard.githubProjects')} value={githubItemsCount} icon={<div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 text-green-400"><GithubIcon className="w-6 h-6" /></div>} />
        <StatCard theme={settings.theme} label={t('admin.dashboard.customContent')} value={customItemsCount} icon={<div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400"><GlobeAltIcon className="w-6 h-6" /></div>} />
        <StatCard theme={settings.theme} label={t('admin.dashboard.dataSourcePlugins')} value={totalPlugins} icon={<div className="w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-500/10 text-yellow-400"><CircleStackIcon className="w-6 h-6" /></div>} />
      </div>

      {/* Real Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SimpleBarChart 
            title={t('admin.dashboard.topLanguages')}
            data={topLanguages}
            theme={settings.theme}
          />
           <SimpleBarChart 
            title={t('admin.dashboard.topCategories')}
            data={topCategories}
            theme={settings.theme}
          />
      </div>

      <div className={`p-6 rounded-lg border shadow-lg ${cardBg} ${borderColor}`}>
        <div className="flex items-center mb-2 gap-2">
            <StorageIcon className="w-5 h-5 text-gray-500" />
            <h3 className={`text-lg font-semibold ${textColor}`}>{t('admin.dashboard.storageUsage')}</h3>
        </div>
        <p className={`text-sm mb-4 ${mutedTextColor}`}>{t('admin.dashboard.storageDesc')}</p>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div 
                className={`h-4 rounded-full transition-all duration-500 ${storageStats.percentage > 80 ? 'bg-red-500' : storageStats.percentage > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                style={{ width: `${storageStats.percentage}%` }}
            ></div>
        </div>
        <p className={`text-xs mt-2 text-right ${mutedTextColor}`}>
            {t('admin.dashboard.storageUsed', { percentage: storageStats.percentage, used: storageStats.displayValue, total: storageStats.total })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 p-6 rounded-lg border shadow-lg ${cardBg} ${borderColor}`}>
          <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${textColor}`}>{t('admin.dashboard.recentAdditions')}</h2>
              <button onClick={() => navigateTo('#/admin/content')} className={`text-sm font-medium ${settings.theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'}`}>
                {t('admin.dashboard.viewAll')}
              </button>
          </div>
           <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentItems.length > 0 ? recentItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${item.sourceType === 'github' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                           {item.sourceType === 'github' ? <GithubIcon className="w-5 h-5" /> : <GlobeAltIcon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium truncate max-w-xs sm:max-w-md ${textColor}`} title={item.sourceType === 'github' ? item.full_name : item.aiSummary.catchyTitle}>
                                {item.sourceType === 'github' ? item.full_name : item.aiSummary.catchyTitle}
                            </p>
                            <p className={`text-xs ${mutedTextColor}`}>{t(item.sourceType === 'github' ? 'timeAgo.collected' : 'timeAgo.createdAt', { time: timeAgo(item.sourceType === 'github' ? item.collectedAt : item.createdAt, t) })}</p>
                        </div>
                    </div>
                    <a href={`#/project/${item.id}`} className={`p-2 rounded-lg ${settings.theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'}`} title={t('details')}>
                       <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </a>
                </div>
            )) : (
                <p className={`text-sm text-center py-8 ${mutedTextColor}`}>{t('admin.dashboard.noRecentItems')}</p>
            )}
           </div>
        </div>
        <div className={`p-6 rounded-lg border shadow-lg ${cardBg} ${borderColor}`}>
          <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>{t('admin.dashboard.quickActions')}</h2>
          <div className="flex flex-col gap-4">
            {githubPlugin && (
              <button
                onClick={() => onRunPlugin(githubPlugin)}
                className="w-full flex items-center justify-center px-4 py-2.5 font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
              >
                <RefreshIcon className="w-5 h-5 mr-2" />
                {t('admin.dashboard.refreshGithub')}
              </button>
            )}
            <button
              onClick={onCreatePlugin}
              className={`w-full flex items-center justify-center px-4 py-2.5 font-semibold rounded-lg transition-colors duration-200 ${settings.theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {t('admin.dashboard.createNewPlugin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
