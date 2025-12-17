
import React, { useMemo } from 'react';
import { DisplayItem, ScraperPlugin, ProcessedRepo } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { DocumentTextIcon, GithubIcon, CircleStackIcon, RefreshIcon, PlusIcon, GlobeAltIcon, ArrowTopRightOnSquareIcon, CircleStackIcon as StorageIcon, ChartBarIcon } from '../icons';
import { timeAgo } from '../../utils/date';
import { useI18n } from '../../contexts/I18nContext';

const DashboardPanel: React.FC<{ displayItems: DisplayItem[], plugins: ScraperPlugin[], onRunPlugin: any, onCreatePlugin: any }> = ({ displayItems, plugins, onRunPlugin, onCreatePlugin }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  const isDark = settings.theme === 'dark';

  const stats = useMemo(() => ({
    total: displayItems.length,
    github: displayItems.filter(i => i.sourceType === 'github').length,
    custom: displayItems.filter(i => i.sourceType === 'custom').length,
    languages: [...new Set(displayItems.map(i => i.sourceType === 'github' ? (i as any).language : null).filter(Boolean))].length
  }), [displayItems]);

  const recentItems = useMemo(() => [...displayItems].sort((a, b) => 
    new Date(b.sourceType === 'github' ? b.collectedAt : b.createdAt).getTime() - 
    new Date(a.sourceType === 'github' ? a.collectedAt : a.createdAt).getTime()
  ).slice(0, 6), [displayItems]);

  const panelBg = isDark ? 'bg-[#161b22]' : 'bg-white';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${textColor}`}>{t('admin.dashboard.title')}</h1>
          <p className="text-gray-500 font-medium mt-1">系统全量监控与内容自动化流水线</p>
        </div>
        <div className="flex gap-3">
           <button onClick={onCreatePlugin} className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95">
              <PlusIcon className="w-5 h-5 mr-2" /> {t('admin.dashboard.createNewPlugin')}
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '内容库总量', value: stats.total, color: 'blue', icon: DocumentTextIcon },
          { label: 'GitHub 趋势', value: stats.github, color: 'green', icon: GithubIcon },
          { label: '自定义聚合', value: stats.custom, color: 'purple', icon: GlobeAltIcon },
          { label: '技术领域', value: stats.languages, color: 'orange', icon: ChartBarIcon },
        ].map(s => (
          <div key={s.label} className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${panelBg} ${borderColor}`}>
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-${s.color}-500/10 text-${s.color}-500`}>
                <s.icon className="w-6 h-6" />
             </div>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
             <p className={`text-4xl font-black mt-1 ${textColor}`}>{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Items with Detailed UI */}
        <div className={`lg:col-span-2 p-8 rounded-3xl border ${panelBg} ${borderColor} shadow-sm`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className={`text-xl font-black ${textColor}`}>最近采集流水线</h3>
            <button onClick={() => window.location.hash = '#/admin/content'} className="text-blue-500 font-bold text-sm hover:underline">查看全量表单 &rarr;</button>
          </div>
          <div className="space-y-4">
            {recentItems.map(item => (
              <div key={item.id} className={`group flex items-center p-4 rounded-2xl border transition-all hover:bg-gray-500/5 ${borderColor}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${item.sourceType === 'github' ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-500'}`}>
                   {item.sourceType === 'github' ? <GithubIcon className="w-6 h-6" /> : <GlobeAltIcon className="w-6 h-6" />}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className={`font-bold truncate ${textColor}`}>{item.sourceType === 'github' ? (item as any).full_name : item.aiSummary.catchyTitle}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-500 uppercase">{item.aiSummary.category}</span>
                    <span className="text-[10px] text-gray-500 font-medium italic">{timeAgo(item.sourceType === 'github' ? item.collectedAt : item.createdAt, t)}</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => window.location.hash = `#/project/${item.id}`} className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health / Scout Monitor */}
        <div className="space-y-6">
           <div className={`p-8 rounded-3xl border ${panelBg} ${borderColor}`}>
              <h3 className={`text-xl font-black mb-6 ${textColor}`}>AI Scout 状态</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                      <span className="text-sm font-bold text-gray-500">正在嗅探趋势...</span>
                   </div>
                   <span className="text-xs font-black text-blue-500">IDLE</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-500/5 border border-dashed border-gray-500/30">
                   <p className="text-xs text-gray-500 leading-relaxed font-medium">
                     当前正在背景巡逻 GitHub API。<br/>
                     队列积压: <span className="text-blue-500 font-bold">0</span><br/>
                     下一次全局拉取: <span className="text-blue-500 font-bold">24 分钟后</span>
                   </p>
                </div>
              </div>
           </div>

           <div className={`p-8 rounded-3xl border ${panelBg} ${borderColor}`}>
              <h3 className={`text-xl font-black mb-6 ${textColor}`}>存储负载 (LS)</h3>
              <div className="relative h-4 bg-gray-500/10 rounded-full overflow-hidden">
                 <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500 w-[65%]"></div>
              </div>
              <p className="text-[10px] font-bold text-gray-500 mt-3 uppercase tracking-widest text-right">3.2MB / 5.0MB (65%)</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
