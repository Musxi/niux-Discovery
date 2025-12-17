
import React, { useState, useMemo, useEffect } from 'react';
import { DisplayItem, ProcessedRepo, getFallbackSummary } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { PencilIcon, TrashIcon, GithubIcon, GlobeAltIcon, DocumentMagnifyingGlassIcon } from '../icons';
import { useI18n } from '../../contexts/I18nContext';

const EmptyState: React.FC<{ theme: 'light' | 'dark', onActionClick: () => void }> = ({ theme, onActionClick }) => {
    const { t } = useI18n();
    const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/20';
    const textColor = theme === 'light' ? 'text-gray-800' : 'text-white';
    const mutedTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
    const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
    
    return (
        <div className={`text-center py-16 px-6 border rounded-lg ${borderColor} ${bgColor}`}>
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                <DocumentMagnifyingGlassIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className={`mt-4 text-lg font-semibold ${textColor}`}>{t('admin.content.emptyStateTitle')}</h3>
            <p className={`mt-2 text-sm ${mutedTextColor}`}>{t('admin.content.emptyStateDescription')}</p>
             <button
                onClick={onActionClick}
                className="mt-6 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
                {t('admin.content.emptyStateAction')}
            </button>
        </div>
    );
};

interface ContentManagementPanelProps {
  displayItems: DisplayItem[];
  onEditProject: (project: ProcessedRepo) => void;
  onDeleteItem: (itemId: number | string, itemType: 'github' | 'custom') => void;
  onBulkDelete: (selectedIds: Set<string | number>) => void;
}

const ITEMS_PER_PAGE = 10;

const ContentManagementPanel: React.FC<ContentManagementPanelProps> = ({ displayItems, onEditProject, onDeleteItem, onBulkDelete }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'github' | 'custom'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const cardBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const headerBg = settings.theme === 'light' ? 'bg-gray-50' : 'bg-gray-900/50';
  const textColor = settings.theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const mutedTextColor = settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const borderColor = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const inputBg = settings.theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-600';

  const categories = useMemo(() => ['all', ...new Set(displayItems.map(item => item.aiSummary.category))], [displayItems]);

  const filteredItems = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return displayItems.filter((item) => {
        if (sourceFilter !== 'all' && item.sourceType !== sourceFilter) return false;
        if (categoryFilter !== 'all' && item.aiSummary.category !== categoryFilter) return false;
        if (!searchTerm) return true;

        const summary = item.aiSummary;
        const title = item.sourceType === 'github' ? (item as ProcessedRepo).full_name : summary.catchyTitle;
        
        return (
            title.toLowerCase().includes(lowercasedFilter) ||
            summary.introduction.toLowerCase().includes(lowercasedFilter)
        );
    });
  }, [searchTerm, displayItems, sourceFilter, categoryFilter]);
  
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
        const dateA = new Date(a.sourceType === 'github' ? a.collectedAt : a.createdAt).getTime();
        const dateB = new Date(b.sourceType === 'github' ? b.collectedAt : b.createdAt).getTime();
        return dateB - dateA;
    });
  }, [filteredItems]);

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return sortedItems.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedItems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set()); // Reset selection on filter change
  }, [searchTerm, sourceFilter, categoryFilter]);

  const toggleSelection = (id: string | number) => {
      const newSelection = new Set(selectedIds);
      if (newSelection.has(id)) {
          newSelection.delete(id);
      } else {
          newSelection.add(id);
      }
      setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
      if (selectedIds.size === paginatedItems.length && paginatedItems.length > 0) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(paginatedItems.map(i => i.id)));
      }
  };

  const handleBulkDeleteAction = () => {
      onBulkDelete(selectedIds);
      setSelectedIds(new Set());
  };

  const navigateToDataSources = () => {
    window.location.hash = '#/admin/datasources';
  };

  return (
    <div className={`animate-fade-in p-0 md:p-4 rounded-lg`}>
      <div className={`p-4 md:p-6 rounded-t-lg ${cardBg} ${settings.theme === 'light' ? 'border-x border-t' : 'border'} ${borderColor}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${textColor}`}>{t('admin.content.title')}</h1>
            <p className={`mt-1 text-sm ${mutedTextColor}`}>{t('admin.content.description')}</p>
          </div>
          {selectedIds.size > 0 && (
              <div className="flex items-center gap-4 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  <span className={`text-sm font-medium ${settings.theme === 'light' ? 'text-red-700' : 'text-red-400'}`}>
                      {t('admin.content.itemsSelected', { count: selectedIds.size })}
                  </span>
                  <button 
                    onClick={handleBulkDeleteAction}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded shadow-sm transition-colors"
                  >
                      {t('admin.content.bulkDelete', { count: selectedIds.size })}
                  </button>
              </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
                type="text"
                placeholder={t('admin.content.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`lg:col-span-2 w-full px-4 py-2 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${textColor} ${borderColor}`}
            />
            <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as any)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${textColor} ${borderColor}`}
            >
                <option value="all">{t('admin.content.allSources')}</option>
                <option value="github">{t('admin.content.sourceGithub')}</option>
                <option value="custom">{t('admin.content.sourceCustom')}</option>
            </select>
            <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${textColor} ${borderColor}`}
            >
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? t('admin.content.allCategories') : cat}</option>
                ))}
            </select>
        </div>
      </div>
      
      {sortedItems.length > 0 ? (
        <div className={`overflow-x-auto rounded-b-lg ${settings.theme === 'light' ? `border-x border-b ${borderColor}`: ''}`}>
            <div className="hidden md:block">
              <div className={`align-middle inline-block min-w-full ${settings.theme === 'dark' ? `border ${borderColor} rounded-b-lg` : ''}`}>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={`${headerBg}`}>
                      <tr>
                        <th scope="col" className="py-3.5 px-4 w-10">
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th scope="col" className={`py-3.5 px-6 text-left text-xs font-semibold uppercase tracking-wider ${textColor}`}>{t('admin.content.tableTitle')}</th>
                        <th scope="col" className={`py-3.5 px-3 text-left text-xs font-semibold uppercase tracking-wider ${textColor}`}>{t('admin.content.tableSource')}</th>
                        <th scope="col" className={`py-3.5 px-3 text-left text-xs font-semibold uppercase tracking-wider ${textColor}`}>{t('admin.content.tableCategory')}</th>
                        <th scope="col" className={`py-3.5 px-3 text-left text-xs font-semibold uppercase tracking-wider ${textColor}`}>{t('admin.content.tableCollectedAt')}</th>
                        <th scope="col" className={`relative py-3.5 px-6`}>
                           <span className="sr-only">{t('admin.content.tableActions')}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${borderColor} ${cardBg}`}>
                      {paginatedItems.map((item) => {
                        const summary = item.aiSummary || getFallbackSummary();
                        const isSelected = selectedIds.has(item.id);
                        return (
                        <tr key={item.id} className={`${isSelected ? (settings.theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20') : (settings.theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800/50')} transition-colors`}>
                           <td className="py-4 px-4">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={isSelected}
                                    onChange={() => toggleSelection(item.id)}
                                />
                           </td>
                          <td className="py-4 px-6 text-sm">
                            <div className={`font-medium ${textColor} max-w-xs xl:max-w-md break-words`}>{item.sourceType === 'github' ? (item as ProcessedRepo).full_name : summary.catchyTitle}</div>
                            <div className={`mt-1 ${mutedTextColor} max-w-xs xl:max-w-md truncate`} title={summary.introduction}>{summary.introduction}</div>
                          </td>
                          <td className="py-4 px-3 text-sm">
                            <span className={`inline-flex items-center gap-x-1.5 px-2 py-1 text-xs font-medium rounded-full ${item.sourceType === 'github' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                              {item.sourceType === 'github' ? t('admin.content.sourceGithub') : t('admin.content.sourceCustom')}
                            </span>
                          </td>
                          <td className={`whitespace-nowrap py-4 px-3 text-sm ${mutedTextColor}`}>{summary.category}</td>
                          <td className={`whitespace-nowrap py-4 px-3 text-sm ${mutedTextColor}`}>{new Date(item.sourceType === 'github' ? item.collectedAt : item.createdAt).toLocaleString()}</td>
                          <td className={`whitespace-nowrap py-4 px-6 text-right text-sm font-medium`}>
                            <div className="flex items-center justify-end space-x-3">
                              {item.sourceType === 'github' && (
                                <button onClick={() => onEditProject(item as ProcessedRepo)} title="Edit" className="p-1.5 rounded-md text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition-colors">
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => onDeleteItem(item.id, item.sourceType)} title="Delete" className="p-1.5 rounded-md text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
              </div>
            </div>

            <div className={`md:hidden space-y-4 p-4 ${cardBg} rounded-b-lg ${settings.theme === 'dark' ? `border border-t-0 ${borderColor}` : ''}`}>
               {paginatedItems.map((item) => {
                  const summary = item.aiSummary || getFallbackSummary();
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <div key={item.id} className={`p-4 border rounded-lg ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : borderColor} ${settings.theme === 'light' ? 'bg-white' : 'bg-gray-800/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start gap-3 flex-1 pr-2">
                                <input 
                                    type="checkbox" 
                                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={isSelected}
                                    onChange={() => toggleSelection(item.id)}
                                />
                                <div>
                                    <h3 className={`font-medium break-all ${textColor}`}>{item.sourceType === 'github' ? (item as ProcessedRepo).full_name : summary.catchyTitle}</h3>
                                    <p className={`mt-1 text-sm ${mutedTextColor} line-clamp-2`} title={summary.introduction}>{summary.introduction}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                {item.sourceType === 'github' && (
                                    <button onClick={() => onEditProject(item as ProcessedRepo)} title="Edit" className={`p-2 rounded-md ${settings.theme === 'light' ? 'text-blue-600 hover:bg-blue-50' : 'text-blue-400 hover:bg-gray-700'}`}>
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                )}
                                <button onClick={() => onDeleteItem(item.id, item.sourceType)} title="Delete" className={`p-2 rounded-md ${settings.theme === 'light' ? 'text-red-600 hover:bg-red-50' : 'text-red-500 hover:bg-red-500/20'}`}>
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className={`mt-3 pt-3 border-t ${borderColor} text-xs flex flex-wrap items-center gap-x-4 gap-y-1 ${mutedTextColor}`}>
                            <div className="flex items-center">
                                {item.sourceType === 'github' ? <GithubIcon className="w-4 h-4 mr-1.5" /> : <GlobeAltIcon className="w-4 h-4 mr-1.5" />}
                                <span>{item.sourceType === 'github' ? t('admin.content.sourceGithub') : t('admin.content.sourceCustom')}</span>
                            </div>
                            <div>
                                <span className="font-semibold">{t('admin.content.tableCategory')}:</span> {summary.category}
                            </div>
                        </div>
                    </div>
                )})}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={`px-4 py-3 flex items-center justify-between border-t ${borderColor} ${cardBg} rounded-b-lg`}>
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            {t('admin.content.previous')}
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            {t('admin.content.next')}
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className={`text-sm ${mutedTextColor}`}>
                                {t('admin.content.pageInfo', { current: currentPage, total: totalPages })}
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${settings.theme === 'light' ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'} disabled:opacity-50`}
                                >
                                    <span>{t('admin.content.previous')}</span>
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            currentPage === i + 1
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : `${settings.theme === 'light' ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'}`
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${settings.theme === 'light' ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'} disabled:opacity-50`}
                                >
                                    <span>{t('admin.content.next')}</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
      ) : (
        <div className={`p-4 md:p-0 rounded-b-lg ${cardBg} ${settings.theme === 'dark' ? `border border-t-0 ${borderColor}` : ''}`}>
           <EmptyState theme={settings.theme} onActionClick={navigateToDataSources} />
        </div>
      )}
    </div>
  );
};

export default ContentManagementPanel;
