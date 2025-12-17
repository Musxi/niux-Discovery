
import React, { useState } from 'react';
import { ScraperPlugin } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { timeAgo } from '../utils/date';
import { RefreshIcon, GithubIcon, GlobeAltIcon, PencilIcon, TrashIcon, PlusIcon } from './icons';
import { useI18n } from '../contexts/I18nContext';

interface DataSourcePageProps {
  plugins: ScraperPlugin[];
  onRunPlugin: (plugin: ScraperPlugin) => Promise<void>;
  onEditPlugin: (plugin: ScraperPlugin) => void;
  onDeletePlugin: (pluginId: string) => void;
  onCreatePlugin: () => void;
}

/**
 * 数据源管理页面组件。
 * 注意：此组件可能是一个旧版本，已被 `AdminDashboard` 框架下的 `DataSourcePanel` 取代。
 * 它提供了一个界面来查看、运行和管理所有数据源插件。
 */
const DataSourcePage: React.FC<DataSourcePageProps> = ({ plugins, onRunPlugin, onEditPlugin, onDeletePlugin, onCreatePlugin }) => {
  // 状态：记录当前正在运行的插件 ID，用于显示加载状态和禁用按钮
  const [runningPluginId, setRunningPluginId] = useState<string | null>(null);
  const { settings } = useSettings();
  // FIX: Import and use the i18n hook to get the translation function.
  const { t } = useI18n();
  
  // 根据主题动态设置样式
  const cardBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const textColor = settings.theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedTextColor = settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const buttonColor = 'bg-blue-600 hover:bg-blue-700 text-white';
  const borderColor = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  // "运行" 按钮的处理函数
  const handleRun = async (plugin: ScraperPlugin) => {
    setRunningPluginId(plugin.id);
    try {
      await onRunPlugin(plugin);
    } finally {
      setRunningPluginId(null); // 无论成功或失败，都清除运行状态
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className={`p-6 md:p-8 rounded-lg border shadow-lg ${cardBg} ${borderColor}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className={`text-2xl font-bold ${textColor}`}>数据源管理</h1>
                <p className={`mt-2 text-sm ${mutedTextColor}`}>
                    管理内置和自定义的数据源插件。可为每个插件独立配置 AI 模型。
                </p>
            </div>
            <button
              onClick={onCreatePlugin}
              className={`inline-flex items-center justify-center px-4 py-2 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${buttonColor}`}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              创建新插件
            </button>
        </div>
        {/* 功能演示说明 */}
        <div className={`mt-4 text-xs p-3 rounded-md ${settings.theme === 'light' ? 'bg-yellow-50 text-yellow-800' : 'bg-yellow-900/30 text-yellow-300'}`}>
          <strong>功能演示说明：</strong> 由于浏览器安全限制，自定义插件目前为模拟运行。点击“运行”将使用预设的示例文本，并调用 AI 进行处理，以完整展示 AI 的内容分析、分类和重写能力。
        </div>

        <div className="mt-6 space-y-4">
          {plugins.length > 0 ? (
            plugins.map(plugin => {
              const isBuiltin = plugin.type === 'builtin';
              return (
              <div key={plugin.id} className={`p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isBuiltin ? (settings.theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-800/30') : (settings.theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50')} ${borderColor}`}>
                <div className="flex-grow">
                   <div className="flex items-center">
                    {isBuiltin ? <GithubIcon className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" /> : <GlobeAltIcon className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />}
                    <p className={`font-semibold ${textColor} break-all`} title={plugin.name}>{plugin.name}</p>
                   </div>
                  <p className={`text-sm mt-1 ${mutedTextColor}`}>{plugin.description}</p>
                   {/* FIX: The `timeAgo` function requires the translation function `t` as its second argument. */}
                   <p className={`text-xs mt-2 ${mutedTextColor}`}>{isBuiltin ? '内置插件' : `创建于 ${timeAgo(plugin.createdAt, t)}`}</p>
                </div>
                <div className="flex items-center space-x-2 self-end md:self-center">
                    <button
                        onClick={() => onEditPlugin(plugin)}
                        title="编辑"
                        className={`p-2 rounded-md transition-colors ${settings.theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        <PencilIcon className="w-5 h-5"/>
                    </button>
                    {/* 内置插件不可删除 */}
                    {!isBuiltin && (
                         <button
                            onClick={() => onDeletePlugin(plugin.id)}
                            title="删除"
                            className={`p-2 rounded-md transition-colors text-red-500 hover:bg-red-500/10`}
                        >
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    )}
                    <button
                        onClick={() => handleRun(plugin)}
                        disabled={runningPluginId === plugin.id}
                        className="flex-shrink-0 flex items-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                        <RefreshIcon className={`w-4 h-4 mr-2 ${runningPluginId === plugin.id ? 'animate-spin' : ''}`} />
                        {runningPluginId === plugin.id ? '运行中...' : '运行'}
                    </button>
                </div>
              </div>
            )})
          ) : (
            <p className={`text-sm text-center py-4 ${mutedTextColor}`}>还没有创建任何插件。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSourcePage;
