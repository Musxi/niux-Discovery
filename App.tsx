
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchLatestProjects, fetchReadme, extractFirstImage } from './services/githubService';
import { generateProjectSummary } from './services/geminiService';
import { GitHubRepo, ProcessedRepo, getFallbackSummary } from './types';
import Header from './components/Header';
import { useSettings } from './contexts/SettingsContext';
import { useToast } from './contexts/ToastContext';
import { XMarkIcon, ExclamationTriangleIcon } from './components/icons';
import SkeletonCard from './components/SkeletonCard';
import AdminDashboard from './components/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import SearchResultsPage from './components/SearchResultsPage';
import Footer from './components/Footer';
import { useI18n } from './contexts/I18nContext';
import MasonryGrid from './components/MasonryGrid';
import BackToTop from './components/BackToTop';
import HelpPage from './components/HelpPage';
import ProjectDetail from './components/ProjectDetail';

const PROJECTS_STORAGE_KEY = 'github-ai-projects-v4';
const PROJECTS_PER_PAGE = 20; // 增加每页条数，减少请求次数

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProcessedRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const { settings } = useSettings();
  const { addToast } = useToast();
  const { t } = useI18n();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const processingQueueRef = useRef<number[]>([]); // 待处理的 Repo ID 队列

  // 1. 标签排序优化：固定“全部”在第一位
  const categories = useMemo(() => {
    const cats = projects.map(p => p.aiSummary?.category).filter(Boolean);
    const uniqueCats = Array.from(new Set(cats)).sort();
    return ['all', ...uniqueCats];
  }, [projects]);

  // 2. 后台静默处理 AI 摘要的任务调度器
  const startBackgroundProcessing = useCallback(async (newRepos: GitHubRepo[]) => {
    // 将新 ID 加入待处理队列
    const idsToProcess = newRepos.map(r => r.id);
    processingQueueRef.current = [...processingQueueRef.current, ...idsToProcess];

    // 如果已经在处理中，则直接返回
    if (processingQueueRef.current.length > idsToProcess.length) return;

    while (processingQueueRef.current.length > 0) {
      const targetId = processingQueueRef.current[0];
      const targetRepo = newRepos.find(r => r.id === targetId);

      if (targetRepo) {
        try {
          // 串行执行抓取与 AI 生成
          const readme = await fetchReadme(targetRepo.full_name, settings.githubToken);
          const imageUrl = extractFirstImage(readme) || extractFirstImage(targetRepo.description);
          const summary = await generateProjectSummary(
            targetRepo.name,
            readme || targetRepo.description || '',
            settings.apiKeys,
            settings.model,
            undefined,
            settings.language
          );

          setProjects(prev => prev.map(p => p.id === targetId ? {
            ...p,
            aiSummary: summary || p.aiSummary,
            imageUrl: imageUrl || p.imageUrl,
            readmeContent: readme,
          } : p));

          // 保护性间隔，防止触发 API 二级限流
          await new Promise(r => setTimeout(r, 600)); 
        } catch (err) {
          console.warn(`Background processing failed for ${targetId}:`, err);
        }
      }
      // 弹出已处理的任务
      processingQueueRef.current.shift();
    }
  }, [settings, projects]);

  // 3. 极速加载逻辑：展示 metadata 优先
  const loadMore = useCallback(async (isInitial = false) => {
    if (isLoadingMore || (!hasMore && !isInitial)) return;
    
    setIsLoadingMore(true);
    setIsRateLimited(false);
    
    try {
      const currentPage = isInitial ? 1 : page;
      const { repos, hasMore: more } = await fetchLatestProjects(currentPage, PROJECTS_PER_PAGE, settings.githubToken);
      
      // 过滤掉本地已有的重复项目
      const newRepos = repos.filter(r => !projects.some(p => p.id === r.id));
      
      if (newRepos.length > 0) {
        const placeholderProjects: ProcessedRepo[] = newRepos.map((repo, index) => ({
          ...repo,
          sourceType: 'github',
          rank: projects.length + index + 1,
          aiSummary: getFallbackSummary(repo), // 初始使用占位符摘要
          readmeContent: null,
          collectedAt: new Date().toISOString(),
          modificationHistory: [],
        }));

        setProjects(prev => isInitial ? placeholderProjects : [...prev, ...placeholderProjects]);
        
        // 立即展示后再启动后台任务
        startBackgroundProcessing(newRepos);
      }

      setHasMore(more);
      setPage(currentPage + 1);
    } catch (e: any) {
      if (e.message === 'LIMIT_EXCEEDED') {
        setIsRateLimited(true);
        addToast(t('githubRateLimitError'), { type: 'error' });
      } else {
        addToast(t('loadingMoreError'), { type: 'error' });
      }
    } finally {
      setIsLoadingMore(false);
      setIsLoading(false);
    }
  }, [page, hasMore, isLoadingMore, settings, t, projects, startBackgroundProcessing]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 当滚动到底部且当前不在“过滤查看”状态时触发加载
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading && !isRateLimited && activeCategory === 'all') {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '600px' } // 提前预加载
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoadingMore, isLoading, isRateLimited, activeCategory]);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);

    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
        setIsLoading(false);
        if (parsed.length < 5) loadMore(true);
      } catch {
        loadMore(true);
      }
    } else {
      loadMore(true);
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.location.hash = '#/';
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      // 存储时保留最近的数据，确保下次打开秒开
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects.slice(-100)));
    }
  }, [projects]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter(p => p.aiSummary?.category === activeCategory);
  }, [projects, activeCategory]);

  const isProjectModal = route.startsWith('#/project/');
  const isAdmin = route.startsWith('#/admin');
  const isSearch = route.startsWith('#/search');
  const isHelp = route.startsWith('#/help');

  const selectedItem = useMemo(() => {
    if (!isProjectModal) return null;
    const match = route.match(/\/project\/([^?]+)/);
    const id = match ? match[1] : null;
    return projects.find(p => String(p.id) === id);
  }, [route, projects, isProjectModal]);

  const closeDetail = () => {
    window.location.hash = '#/';
  };

  return (
    <div className={`min-h-screen flex flex-col ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-[#0d1117]'}`}>
      <Header onRefresh={() => { setIsLoading(true); setProjects([]); setPage(1); loadMore(true); }} isLoading={isLoadingMore} />
      
      <div className="flex-grow">
        {!isAdmin && !isSearch && !isHelp && (
          <div className="animate-in fade-in duration-300">
            <div className={`sticky top-[64px] z-10 py-4 border-b backdrop-blur-md ${settings.theme === 'light' ? 'bg-white/80' : 'bg-[#0d1117]/80 border-gray-800'}`}>
              <div className="container mx-auto px-4 overflow-x-auto no-scrollbar flex gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 text-sm font-bold rounded-full transition-all whitespace-nowrap shadow-sm transform active:scale-95 ${
                      activeCategory === cat 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : settings.theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {cat === 'all' ? t('allCategories') : cat}
                  </button>
                ))}
              </div>
            </div>

            <main className="container mx-auto px-4 py-8">
              {isLoading && projects.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <MasonryGrid items={filteredItems} key={activeCategory} />
              )}
              
              <div ref={loadMoreRef} className="h-40 flex flex-col items-center justify-center gap-4">
                {isLoadingMore && <LoadingSpinner />}
                
                {isRateLimited && (
                  <div className="flex flex-col items-center p-6 bg-red-900/10 border border-red-900/30 rounded-2xl max-w-md text-center">
                    <ExclamationTriangleIcon className="w-10 h-10 text-red-500 mb-2" />
                    <p className="text-red-400 font-bold mb-3">{t('githubRateLimitError')}</p>
                    <button 
                      onClick={() => window.location.hash = '#/admin/settings'}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all"
                    >
                      {t('admin.settings.githubTokenTitle')}
                    </button>
                  </div>
                )}

                {!hasMore && projects.length > 0 && (
                  <p className="text-gray-500 text-sm font-medium">{t('noMoreContent')}</p>
                )}
              </div>
            </main>
          </div>
        )}

        {isProjectModal && selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={closeDetail}></div>
            <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-[#0d1117] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-200">
              <button 
                onClick={closeDetail}
                className="absolute top-5 right-5 z-[70] p-2 bg-gray-800/80 hover:bg-red-600 rounded-full text-white shadow-lg transition-all"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="h-full overflow-y-auto">
                <ProjectDetail project={selectedItem} isModal={true} />
              </div>
            </div>
          </div>
        )}

        {isAdmin && <AdminDashboard activeSubRoute={route.split('/')[2] || 'dashboard'} displayItems={projects} plugins={[]} onDeleteItem={() => {}} onBulkDelete={() => {}} onEditProject={() => {}} onRunPlugin={async () => {}} onEditPlugin={() => {}} onDeletePlugin={() => {}} onCreatePlugin={() => {}} />}
        {isSearch && <SearchResultsPage items={projects} query={new URLSearchParams(route.split('?')[1] || '').get('q') || ''} />}
        {isHelp && <HelpPage />}
      </div>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default App;
