
import React, { useState, useMemo, useEffect } from 'react';
import { DisplayItem, ProcessedRepo, getFallbackSummary } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { PencilIcon, TrashIcon, GithubIcon, GlobeAltIcon, DocumentMagnifyingGlassIcon, RefreshIcon } from '../icons';
import { useI18n } from '../../contexts/I18nContext';

const ContentManagementPanel: React.FC<{ displayItems: DisplayItem[], onEditProject: any, onDeleteItem: any, onBulkDelete: any }> = ({ displayItems, onEditProject, onDeleteItem, onBulkDelete }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const isDark = settings.theme === 'dark';

  const filteredItems = useMemo(() => {
    if (!searchTerm) return displayItems;
    const q = searchTerm.toLowerCase();
    return displayItems.filter(i => 
      (i.aiSummary.catchyTitle.toLowerCase().includes(q)) || 
      (i.sourceType === 'github' && (i as any).full_name.toLowerCase().includes(q))
    );
  }, [searchTerm, displayItems]);

  const toggleAll = () => {
    if (selectedIds.size === filteredItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredItems.map(i => i.id)));
  };

  const handleToggleOne = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const panelBg = isDark ? 'bg-[#161b22]' : 'bg-white';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textColor}`}>{t('admin.content.title')}</h1>
          <p className="text-gray-500 font-medium">全量数据资产管理中心</p>
        </div>
        
        {/* Search & Actions Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="搜标题、全名..." 
            className={`flex-grow md:w-64 px-5 py-3 rounded-2xl border text-sm focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 animate-in zoom-in duration-300">
               <button onClick={() => onBulkDelete(selectedIds)} className="px-5 py-3 bg-red-600/10 text-red-500 font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
                  <TrashIcon className="w-5 h-5" /> 批量删除 ({selectedIds.size})
               </button>
               <button className="px-5 py-3 bg-blue-600/10 text-blue-500 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
                  <RefreshIcon className="w-5 h-5" /> 批量 AI 重写
               </button>
            </div>
          )}
        </div>
      </div>

      <div className={`overflow-hidden rounded-3xl border shadow-sm ${panelBg} ${borderColor}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
              <th className="p-5 w-10">
                <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300 text-blue-600" onChange={toggleAll} checked={selectedIds.size === filteredItems.length && filteredItems.length > 0} />
              </th>
              <th className={`p-5 text-xs font-black uppercase tracking-widest text-gray-500`}>内容标题与实体</th>
              <th className={`p-5 text-xs font-black uppercase tracking-widest text-gray-500 hidden md:table-cell`}>所属分类</th>
              <th className={`p-5 text-xs font-black uppercase tracking-widest text-gray-500 hidden lg:table-cell`}>采集时间</th>
              <th className={`p-5 text-right text-xs font-black uppercase tracking-widest text-gray-500`}>操作流</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500/10">
            {filteredItems.map(item => (
              <tr key={item.id} className={`group transition-colors ${selectedIds.has(item.id) ? (isDark ? 'bg-blue-500/5' : 'bg-blue-50') : 'hover:bg-gray-500/5'}`}>
                <td className="p-5">
                   <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300 text-blue-600" checked={selectedIds.has(item.id)} onChange={() => handleToggleOne(item.id)} />
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.sourceType === 'github' ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-500'}`}>
                       {item.sourceType === 'github' ? <GithubIcon className="w-5 h-5" /> : <GlobeAltIcon className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold truncate ${textColor}`}>{item.sourceType === 'github' ? (item as any).full_name : item.aiSummary.catchyTitle}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{item.aiSummary.introduction}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5 hidden md:table-cell">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    {item.aiSummary.category}
                  </span>
                </td>
                <td className="p-5 hidden lg:table-cell text-xs font-medium text-gray-500">
                  {new Date(item.sourceType === 'github' ? item.collectedAt : item.createdAt).toLocaleDateString()}
                </td>
                <td className="p-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => item.sourceType === 'github' && onEditProject(item)} className="p-2.5 rounded-xl text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDeleteItem(item.id, item.sourceType)} className="p-2.5 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="p-20 text-center">
             <DocumentMagnifyingGlassIcon className="w-16 h-16 text-gray-500/20 mx-auto" />
             <p className="text-gray-500 font-bold mt-4 uppercase tracking-widest text-sm">No items found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementPanel;
