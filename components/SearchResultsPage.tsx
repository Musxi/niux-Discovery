import React, { useMemo } from 'react';
import { DisplayItem, ProcessedRepo } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import ProjectCard from './ProjectCard';
import ProjectListItem from './ProjectListItem';
import { GridIcon, ListIcon } from './icons';

interface SearchResultsPageProps {
  items: DisplayItem[];
  query: string;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ items, query }) => {
  const { settings, saveSettings } = useSettings();
  const { layout, theme } = settings;

  const filteredItems = useMemo(() => {
    if (!query) {
      return [];
    }
    const lowercasedQuery = query.toLowerCase();
    return items.filter(item => {
        const isGithub = item.sourceType === 'github';
        const summary = item.aiSummary;
        if (!summary) return false;
        
        const searchableContent = [
            summary.catchyTitle,
            summary.introduction,
            summary.techStack,
            summary.category,
            ...summary.coreFeatures,
            ...(isGithub ? [
                (item as ProcessedRepo).name, 
                (item as ProcessedRepo).full_name, 
                (item as ProcessedRepo).description
            ] : [])
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableContent.includes(lowercasedQuery);
    });
  }, [items, query]);

  const goBack = () => {
    window.location.hash = '#';
  };

  return (
    <main className="container mx-auto p-4 md:p-6 animate-fade-in">
      <div className="mb-6">
         <button onClick={goBack} className={`inline-block mb-4 text-sm ${theme === 'light' ? 'text-blue-600 hover:underline' : 'text-blue-400 hover:underline'} bg-transparent border-none p-0 cursor-pointer`}>
            ← 返回列表
        </button>
        <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          搜索结果: <span className="text-blue-500">{query}</span>
        </h1>
        <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            找到了 {filteredItems.length} 个相关项目。
        </p>
      </div>

      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-2">
            <button
              onClick={() => saveSettings({ layout: 'grid' })}
              className={`p-2 rounded-lg ${layout === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="网格视图"
            >
              <GridIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => saveSettings({ layout: 'list' })}
              className={`p-2 rounded-lg ${layout === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="列表视图"
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
      </div>

      {filteredItems.length > 0 ? (
        layout === 'grid' ? (
          <div className="md:columns-2 lg:columns-3 gap-6">
            {filteredItems.map(item => <ProjectCard key={item.id} project={item} searchQuery={query} />)}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map(item => <ProjectListItem key={item.id} project={item} searchQuery={query} />)}
          </div>
        )
      ) : (
        <div className="text-center py-20">
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                没有找到关于 “{query}” 的结果。
            </p>
        </div>
      )}
    </main>
  );
};

export default SearchResultsPage;
