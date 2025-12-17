
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchLatestProjects, fetchReadme, extractFirstImage } from './services/githubService';
import { generateProjectSummary } from './services/geminiService';
import { GitHubRepo, ProcessedRepo, getFallbackSummary } from './types';
import Header from './components/Header';
import { useSettings } from './contexts/SettingsContext';
import { useToast } from './contexts/ToastContext';
import { XMarkIcon } from './components/icons';
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

const PROJECTS_STORAGE_KEY = 'github-ai-projects-v6';
const LAST_FETCH_TIMESTAMP_KEY = 'last-auto-fetch-time';
const MAX_LOCAL_STORAGE_ITEMS = 150;

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProcessedRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isScouting, setIsScouting] = useState(false);

  const { settings } = useSettings();
  const { addToast } = useToast();
  const { t } = useI18n();
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const processingQueue = useRef<number[]>([]); 
  const priorityQueue = useRef<number[]>([]); // 优先队列
  const isQueueProcessing = useRef<boolean>(false);

  const categories = useMemo(() => {
    const cats = projects
      .map(p => p.aiSummary?.category)
      .filter(Boolean) as string[];
    const uniqueCats = Array.from(new Set(cats)).sort();
    return ['all', ...uniqueCats];
  }, [projects]);

  // 改进的配额调度算法
  const processNextInQueue = useCallback(async () => {
    // 优先从优先队列取，如果没有再从普通队列取
    let targetId: number | undefined;
    if (priorityQueue.current.length > 0) {
      targetId = priorityQueue.current.shift();
    } else if (processingQueue.current.length > 0) {
      targetId = processingQueue.current.shift();
    }

    if (!targetId) {
      isQueueProcessing.current = false;
      setIsScouting(false);
      return;
    }

    isQueueProcessing.current = true;
    setIsScouting(true);
    
    const project = projects.find(p => p.id === targetId);
    
    // 如果还没处理过（或者是回退内容）
    if (project && (!project.readmeContent || project.aiSummary.catchyTitle === project.name)) {
      try {
        const readme = await fetchReadme(project.full_name, settings.githubToken);
        const imageUrl = extractFirstImage(readme) || extractFirstImage(project.description);
        const summary = await generateProjectSummary(
          project.name,
          readme || project.description || '',
          settings.apiKeys,
          settings.model,
          undefined,
          settings.language
        );

        if (summary) {
          setProjects(prev => prev.map(p => p.id === targetId ? {
            ...p,
            aiSummary: summary,
            imageUrl: imageUrl || p.imageUrl,
            readmeContent: readme,
          } : p));
        }
      } catch (err) {
        console.warn(`Scouting failed for ${targetId}`, err);
      }
    }

    const delay = settings.githubToken ? 1000 : 65000;
    setTimeout(processNextInQueue, delay);
  }, [projects, settings]);

  const autoFetchMetadata = useCallback(async (isInitial = false) => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const currentPage = isInitial ? 1 : page;
      const { repos, hasMore: more } = await fetchLatestProjects(currentPage, 15, settings.githubToken);
      const newRepos = repos.filter(r => !projects.some(p => p.id === r.id));
      
      if (newRepos.length > 0) {
        const placeholderProjects: ProcessedRepo[] = newRepos.map((repo, index) => ({
          ...repo,
          sourceType: 'github',
          rank: projects.length + index + 1,
          aiSummary: getFallbackSummary(repo),
          readmeContent: null,
          collectedAt: new Date().toISOString(),
          modificationHistory: [],
        }));

        setProjects(prev => isInitial ? placeholderProjects : [...prev, ...placeholderProjects]);
        
        newRepos.forEach(r => {
          if (!processingQueue.current.includes(r.id)) {
            processingQueue.current.push(r.id);
          }
        });

        if (!isQueueProcessing.current) {
          processNextInQueue();
        }
      }

      setHasMore(more);
      setPage(currentPage + 1);
      localStorage.setItem(LAST_FETCH_TIMESTAMP_KEY, Date.now().toString());
    } catch (e: any) {
      console.error("Auto fetch failed", e);
    } finally {
      setIsLoadingMore(false);
      setIsLoading(false);
    }
  }, [page, projects, settings, processNextInQueue]);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    let lastTime = 0;
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
        setIsLoading(false);
        lastTime = parseInt(localStorage.getItem(LAST_FETCH_TIMESTAMP_KEY) || '0');
      } catch (e) {}
    }
    const thirtyMinutes = 30 * 60 * 1000;
    if (Date.now() - lastTime > thirtyMinutes || !stored) {
      autoFetchMetadata(true);
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore && activeCategory === 'all') {
        autoFetchMetadata();
      }
    }, { threshold: 0.1, rootMargin: '800px' });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [autoFetchMetadata, hasMore, isLoadingMore, activeCategory]);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects.slice(0, MAX_LOCAL_STORAGE_ITEMS)));
    }
  }, [projects]);

  // 当用户打开项目时，将其推入优先队列
  const handleProjectSelect = (id: number) => {
    if (!priorityQueue.current.includes(id)) {
      priorityQueue.current.unshift(id); // 插队到最前面
      if (!isQueueProcessing.current) {
        processNextInQueue();
      }
    }
    window.location.hash = `#/project/${id}`;
  };

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

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-[#0d1117]'}`}>
      <Header 
        onRefresh={() => { setProjects([]); setPage(1); autoFetchMetadata(true); }} 
        isLoading={isLoadingMore} 
        isScouting={isScouting}
      />
      
      <div className="flex-grow">
        {!isAdmin && !isSearch && !isHelp && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className={`sticky top-[64px] z-10 py-4 border-b backdrop-blur-xl ${settings.theme === 'light' ? 'bg-white/70 border-gray-200' : 'bg-[#0d1117]/70 border-gray-800'}`}>
              <div className="container mx-auto px-4 overflow-x-auto no-scrollbar flex gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap shadow-sm transform active:scale-95 ${
                      activeCategory === cat 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' 
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
                <MasonryGrid items={filteredItems} onSelect={handleProjectSelect} key={activeCategory} />
              )}
              
              <div ref={loadMoreRef} className="h-48 flex flex-col items-center justify-center gap-4">
                {isLoadingMore && <LoadingSpinner />}
                {!hasMore && projects.length > 0 && (
                  <p className="text-gray-500 text-sm font-medium">{t('noMoreContent')}</p>
                )}
              </div>
            </main>
          </div>
        )}

        {isProjectModal && selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => window.location.hash = '#/'}></div>
            <div className="relative w-full max-w-5xl max-h-[96vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0d1117] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => window.location.hash = '#/'}
                className="absolute top-4 right-4 z-[70] p-2 bg-gray-800/80 hover:bg-red-600 rounded-full text-white shadow-lg transition-all active:scale-90"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div className="h-full overflow-y-auto custom-scrollbar">
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
