
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchLatestProjects, fetchReadme } from './services/githubService';
import { generateProjectSummary, isImageRelevant } from './services/geminiService';
import { GitHubRepo, ProcessedRepo, getFallbackSummary, DisplayItem, ApiKeyEntry } from './types';
import Header from './components/Header';
import { useSettings } from './contexts/SettingsContext';
import { useToast } from './contexts/ToastContext';
import { GridIcon, ListIcon, ArrowDownIcon } from './components/icons';
import ProjectListItem from './components/ProjectListItem';
import SkeletonCard from './components/SkeletonCard';
import PluginEditModal from './components/PluginEditModal';
import AdminDashboard from './components/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import SearchResultsPage from './components/SearchResultsPage';
import Footer from './components/Footer';
import { useI18n } from './contexts/I18nContext';
import MasonryGrid from './components/MasonryGrid';
import BackToTop from './components/BackToTop';
import HelpPage from './components/HelpPage';
import EditProjectModal from './components/EditProjectModal';
// Fix: Import the ProjectDetail component used in the modal view
import ProjectDetail from './components/ProjectDetail';

const PROJECTS_STORAGE_KEY = 'github-ai-projects';
const PROJECTS_PER_PAGE = 15;
const MAX_STORED_PROJECTS = 100;

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProcessedRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [route, setRoute] = useState(window.location.hash);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { settings, saveSettings } = useSettings();
  const { addToast } = useToast();
  const { t } = useI18n();
  const { layout, apiKeys, model, language, githubToken } = settings;

  // 路由解析
  const hashParts = route.split('?');
  const pathParts = hashParts[0].split('/');
  const rootPath = pathParts[1]; 
  const paramId = pathParts[2];
  
  const isProjectModal = rootPath === 'project' && !!paramId;
  const isAdmin = rootPath === 'admin';
  const isSearch = rootPath === 'search';
  const isHelp = rootPath === 'help';
  const isFeedVisible = !rootPath || rootPath === '' || isProjectModal;

  // 动态提取分类，修复标签切换同步问题
  const categories = useMemo(() => {
    const cats = projects
      .map(p => p.aiSummary?.category?.trim())
      .filter((cat): cat is string => !!cat);
    return ['all', ...new Set(cats)];
  }, [projects]);

  // 处理新抓取的项目
  const processNewRepos = async (repos: GitHubRepo[], currentRank: number): Promise<ProcessedRepo[]> => {
    const results = await Promise.allSettled(
      repos.map(async (repo, index) => {
        const readmeContent = await fetchReadme(repo.full_name, githubToken);
        const summary = await generateProjectSummary(
          repo.name, 
          readmeContent || repo.description || '', 
          apiKeys, 
          model, 
          undefined, 
          language
        );
        
        return {
          ...repo,
          sourceType: 'github',
          rank: currentRank + index + 1,
          aiSummary: summary || getFallbackSummary(repo),
          readmeContent,
          collectedAt: new Date().toISOString(),
          modificationHistory: [],
        } as ProcessedRepo;
      })
    );

    return results
      .filter((r): r is PromiseFulfilledResult<ProcessedRepo> => r.status === 'fulfilled')
      .map(r => r.value);
  };

  const handleRefresh = useCallback(async (isAuto = false) => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null);

    try {
      const { repos, hasMore: newHasMore } = await fetchLatestProjects(1, PROJECTS_PER_PAGE, githubToken);
      const existingIds = new Set(projects.map(p => p.id));
      const newRepos = repos.filter(repo => !existingIds.has(repo.id));

      if (newRepos.length > 0) {
        const processed = await processNewRepos(newRepos, 0);
        setProjects(prev => {
          const combined = [...processed, ...prev];
          return combined.slice(0, MAX_STORED_PROJECTS);
        });
        if (!isAuto) addToast(t('translation.success', { count: processed.length }), { type: 'success' });
      }
      setLastUpdated(new Date());
      setHasMore(newHasMore);
      setPage(2);
    } catch (e: any) {
      setError(e.message || t('loadingError'));
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [projects, githubToken, apiKeys, model, language, t]);

  // 初始化加载与自动抓取
  useEffect(() => {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setProjects(parsed);
      setIsLoading(false);
      // 后台静默刷新
      handleRefresh(true);
    } else {
      handleRefresh(false);
    }

    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 持久化
  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // 筛选逻辑 - 修复匹配精度
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter(p => p.aiSummary?.category?.trim() === activeCategory);
  }, [projects, activeCategory]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const { repos, hasMore: newHasMore } = await fetchLatestProjects(page, PROJECTS_PER_PAGE, githubToken);
      const processed = await processNewRepos(repos, projects.length);
      setProjects(prev => [...prev, ...processed]);
      setPage(p => p + 1);
      setHasMore(newHasMore);
    } catch (e) {
      addToast(t('loadingMoreError'), { type: 'error' });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const selectedItem = useMemo(() => 
    isProjectModal ? projects.find(p => String(p.id) === paramId) : null
  , [isProjectModal, paramId, projects]);

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${settings.theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <Header onRefresh={() => handleRefresh()} isLoading={isRefreshing} lastUpdated={lastUpdated} />
      
      <div className="flex-grow">
          {!isAdmin && !isSearch && !isHelp && (
            <div className="animate-in fade-in duration-500">
              {/* 标签切换栏 */}
              <div className={`sticky top-[64px] z-10 py-3 mb-6 border-b backdrop-blur-md ${settings.theme === 'light' ? 'bg-gray-100/90 border-gray-200' : 'bg-gray-900/90 border-gray-800'}`}>
                   <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center overflow-x-auto no-scrollbar gap-2">
                        {categories.map(cat => (
                          <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)} 
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${ 
                              activeCategory === cat 
                                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                                : settings.theme === 'light' ? 'bg-white text-gray-600 hover:bg-gray-200' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {cat === 'all' ? t('allCategories') : cat}
                          </button>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <button onClick={() => saveSettings({ layout: 'grid' })} className={`p-2 rounded ${layout === 'grid' ? 'bg-blue-600' : 'bg-gray-700'}`}><GridIcon className="w-5 h-5" /></button>
                      <button onClick={() => saveSettings({ layout: 'list' })} className={`p-2 rounded ${layout === 'list' ? 'bg-blue-600' : 'bg-gray-700'}`}><ListIcon className="w-5 h-5" /></button>
                    </div>
                  </div>
              </div>

              <main className="container mx-auto px-4 pb-12">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  ) : filteredItems.length > 0 ? (
                    layout === 'grid' ? <MasonryGrid items={filteredItems} /> : 
                    <div className="space-y-4">{filteredItems.map(p => <ProjectListItem key={p.id} project={p} />)}</div>
                  ) : (
                    <div className="text-center py-20 opacity-50">{t('admin.content.noMatchingContent')}</div>
                  )}
                  
                  {activeCategory === 'all' && hasMore && !isLoading && (
                    <div className="mt-12 text-center">
                      <button onClick={loadMore} disabled={isLoadingMore} className="px-8 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-700 flex items-center mx-auto transition-transform active:scale-95">
                        {isLoadingMore ? <LoadingSpinner /> : <><ArrowDownIcon className="w-5 h-5 mr-2" />{t('admin.content.next')}</>}
                      </button>
                    </div>
                  )}
              </main>
            </div>
          )}
          
          {isAdmin && <AdminDashboard activeSubRoute={pathParts[2] || 'dashboard'} displayItems={projects} plugins={[]} onDeleteItem={() => {}} onBulkDelete={() => {}} onEditProject={() => {}} onRunPlugin={async () => {}} onEditPlugin={() => {}} onDeletePlugin={() => {}} onCreatePlugin={() => {}} />}
          {isSearch && <SearchResultsPage items={projects} query={new URLSearchParams(hashParts[1] || '').get('q') || ''} />}
          {isHelp && <HelpPage />}

          {isProjectModal && selectedItem && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => window.location.hash = '#'}></div>
                <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-[#0d1117] border border-gray-800">
                    <ProjectDetail project={selectedItem} isModal={true} />
                </div>
            </div>
          )}
      </div>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default App;
