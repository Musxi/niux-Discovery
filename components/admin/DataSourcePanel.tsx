import React, { useState } from 'react';
import { ScraperPlugin } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { timeAgo } from '../../utils/date';
import { RefreshIcon, GithubIcon, GlobeAltIcon, PencilIcon, TrashIcon, PlusIcon } from '../icons';
import LoadingSpinner from '../LoadingSpinner';
import { useI18n } from '../../contexts/I18nContext';

interface DataSourcePanelProps {
  plugins: ScraperPlugin[];
  onRunPlugin: (plugin: ScraperPlugin) => Promise<void>;
  onEditPlugin: (plugin: ScraperPlugin) => void;
  onDeletePlugin: (pluginId: string) => void;
  onCreatePlugin: () => void;
}

const DataSourcePanel: React.FC<DataSourcePanelProps> = ({ plugins, onRunPlugin, onEditPlugin, onDeletePlugin, onCreatePlugin }) => {
  const [runningPluginId, setRunningPluginId] = useState<string | null>(null);
  const { settings } = useSettings();
  const { t } = useI18n();
  
  const cardBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const textColor = settings.theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedTextColor = settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const buttonColor = 'bg-blue-600 hover:bg-blue-700 text-white';
  const borderColor = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  const handleRun = async (plugin: ScraperPlugin) => {
    setRunningPluginId(plugin.id);
    try {
      await onRunPlugin(plugin);
    } finally {
      setRunningPluginId(null);
    }
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>{t('admin.datasources.title')}</h1>
                <p className={`mt-2 text-lg ${mutedTextColor}`}>{t('admin.datasources.description')}</p>
            </div>
            <button
              onClick={onCreatePlugin}
              className={`inline-flex items-center justify-center px-4 py-2 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${buttonColor}`}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {t('admin.dashboard.createNewPlugin')}
            </button>
        </div>
        <div className={`mt-4 text-xs p-3 rounded-md ${settings.theme === 'light' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/50'}`}>
            <strong>{t('admin.datasources.demoNoteTitle')}</strong> {t('admin.datasources.demoNote')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plugins.length > 0 ? (
          plugins.map(plugin => {
            const isBuiltin = plugin.type === 'builtin';
            const isRunning = runningPluginId === plugin.id;

            return (
            <div key={plugin.id} className={`relative p-5 rounded-lg border shadow-lg flex flex-col justify-between ${cardBg} ${borderColor}`}>
                {isRunning && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center rounded-lg z-10">
                        <div className="flex flex-col items-center">
                            <RefreshIcon className="w-8 h-8 text-white animate-spin" />
                            <p className="mt-2 text-sm font-semibold text-white">{t('admin.datasources.running')}</p>
                        </div>
                    </div>
                )}
                <div className="flex-grow">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isBuiltin ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                {isBuiltin ? <GithubIcon className="w-6 h-6" /> : <GlobeAltIcon className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className={`font-semibold ${textColor}`}>{plugin.name}</p>
                                <p className={`text-xs ${mutedTextColor}`}>
                                  {isBuiltin ? t('admin.datasources.pluginTypeBuiltin') : t('admin.datasources.pluginTypeCustom', { time: timeAgo(plugin.createdAt, t) })}
                                </p>
                            </div>
                        </div>
                         <div className="flex items-center space-x-1">
                            <button
                                onClick={() => onEditPlugin(plugin)}
                                title={t('admin.datasources.editAction')}
                                className={`p-2 rounded-md transition-colors ${settings.theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                <PencilIcon className="w-4 h-4"/>
                            </button>
                            {!isBuiltin && (
                                <button
                                    onClick={() => onDeletePlugin(plugin.id)}
                                    title={t('admin.datasources.deleteAction')}
                                    className="p-2 rounded-md transition-colors text-red-500 hover:bg-red-500/10"
                                >
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                    </div>
                    <p className={`text-sm mt-3 ${mutedTextColor} min-h-[40px]`}>{plugin.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => handleRun(plugin)}
                        disabled={isRunning}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        <RefreshIcon className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                        {isRunning ? t('admin.datasources.running') : t('admin.datasources.run')}
                    </button>
                </div>
            </div>
          )})
        ) : (
          <p className={`md:col-span-2 text-sm text-center py-16 ${mutedTextColor}`}>{t('admin.datasources.noPlugins')}</p>
        )}
      </div>
    </div>
  );
};

export default DataSourcePanel;
