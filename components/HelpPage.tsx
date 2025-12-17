
import React, { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useI18n } from '../contexts/I18nContext';
import { 
    Cog6ToothIcon, 
    DocumentTextIcon, 
    GlobeAltIcon, 
    ChartBarIcon, 
    LockClosedIcon, 
    RefreshIcon,
    ArrowTopRightOnSquareIcon
} from './icons';

// Mock screenshot component to visualize the UI without actual image files
const MockScreenshot: React.FC<{ icon: React.ReactNode; title: string; desc?: string; theme: 'light' | 'dark' }> = ({ icon, title, desc, theme }) => {
    const bg = theme === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-gray-800 border-gray-700';
    const text = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
    return (
        <div className={`w-full h-48 sm:h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center mb-6 select-none ${bg}`}>
            <div className={`p-4 rounded-full mb-3 ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-700 shadow-md'}`}>
                {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8 opacity-70" })}
            </div>
            <p className={`font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{title}</p>
            {desc && <p className={`text-xs mt-1 max-w-sm ${text}`}>({desc})</p>}
        </div>
    );
};

const Section: React.FC<{ title: string; id: string; children: React.ReactNode; theme: 'light' | 'dark' }> = ({ title, id, children, theme }) => (
    <section id={id} className={`mb-12 scroll-mt-24 p-6 rounded-2xl ${theme === 'light' ? 'bg-white shadow-sm border border-gray-100' : 'bg-[#161b22] border border-gray-800'}`}>
        <h2 className={`text-2xl font-bold mb-6 flex items-center ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
            <span className="mr-2 text-3xl">#</span> {title}
        </h2>
        <div className={`space-y-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {children}
        </div>
    </section>
);

const HelpPage: React.FC = () => {
    const { settings } = useSettings();
    const { t } = useI18n();
    const theme = settings.theme;

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            <div className="container mx-auto px-4 py-8 md:py-12">
                
                {/* Header Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {t('help.intro.title')}
                    </h1>
                    <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {t('help.intro.subtitle')}
                    </p>
                    <p className={`mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {t('help.intro.description')}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation (Sticky) */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className={`sticky top-24 p-4 rounded-xl ${theme === 'light' ? 'bg-white shadow-sm border border-gray-100' : 'bg-[#161b22] border border-gray-800'}`}>
                            <h3 className={`font-bold mb-4 px-2 uppercase text-xs tracking-wider ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Contents</h3>
                            <nav className="space-y-1">
                                {[
                                    { id: 'quick-start', label: t('help.quickStart.title').split('(')[0] },
                                    { id: 'browsing', label: t('help.browsing.title').split(' ')[1] },
                                    { id: 'details', label: t('help.projectDetail.title').split(' ')[1] },
                                    { id: 'admin', label: t('help.admin.title').split(' ')[1] },
                                    { id: 'security', label: t('help.security.title').split(' ')[1] },
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'hover:bg-blue-50 text-gray-600 hover:text-blue-600' : 'hover:bg-blue-900/20 text-gray-300 hover:text-blue-400'}`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 max-w-4xl">
                        {/* 1. Quick Start */}
                        <Section title={t('help.quickStart.title')} id="quick-start" theme={theme}>
                            <p className="mb-4">{t('help.quickStart.desc')}</p>
                            
                            <MockScreenshot 
                                theme={theme}
                                icon={<Cog6ToothIcon />} 
                                title="Settings Panel > AI Configuration" 
                                desc="Add your API Key here. Select 'Google Gemini' or 'OpenAI Compatible'."
                            />

                            <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                                <li className="mb-4 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <Cog6ToothIcon className="w-3 h-3 text-blue-800 dark:text-blue-300" />
                                    </span>
                                    <p className="text-base font-normal">{t('help.quickStart.step1')}</p>
                                </li>
                                <li className="mb-4 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                                        <span className="text-xs font-bold text-green-800 dark:text-green-300">2</span>
                                    </span>
                                    <p className="text-base font-normal">{t('help.quickStart.step2')}</p>
                                </li>
                                <li className="mb-4 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                                        <span className="text-xs font-bold text-green-800 dark:text-green-300">3</span>
                                    </span>
                                    <p className="text-base font-normal">{t('help.quickStart.step3')} & {t('help.quickStart.step4')}</p>
                                    <div className={`mt-2 p-3 rounded text-sm font-mono ${theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-black text-gray-400'}`}>
                                        gemini-2.5-flash <br/>
                                        deepseek-chat (Base URL: https://api.deepseek.com)
                                    </div>
                                </li>
                                <li className="ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                                        <span className="text-xs font-bold text-green-800 dark:text-green-300">✓</span>
                                    </span>
                                    <p className="text-base font-normal">{t('help.quickStart.step6')}</p>
                                </li>
                            </ol>
                        </Section>

                        {/* 2. Browsing */}
                        <Section title={t('help.browsing.title')} id="browsing" theme={theme}>
                             <MockScreenshot 
                                theme={theme}
                                icon={<GlobeAltIcon />} 
                                title="Main Feed UI" 
                                desc="Category Bar (Top) | Project Cards (Center) | Search Bar"
                            />
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>{t('help.browsing.categoryDesc')}</li>
                                <li>{t('help.browsing.viewModeDesc')}</li>
                                <li>{t('help.browsing.searchDesc')}</li>
                            </ul>
                        </Section>

                        {/* 3. Project Detail */}
                        <Section title={t('help.projectDetail.title')} id="details" theme={theme}>
                             <MockScreenshot 
                                theme={theme}
                                icon={<DocumentTextIcon />} 
                                title="Project Detail Modal" 
                                desc="AI Summary | Highlights | Readme Translation Button"
                            />
                            <p className="mb-4">{t('help.projectDetail.desc')}</p>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 text-blue-900' : 'bg-blue-900/20 text-blue-100'}`}>
                                    <span className="text-2xl block mb-2">🤖</span>
                                    <h4 className="font-bold mb-1">AI Summary</h4>
                                    <p className="text-sm opacity-80">Concise introduction & core features extracted by AI.</p>
                                </div>
                                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-purple-50 text-purple-900' : 'bg-purple-900/20 text-purple-100'}`}>
                                    <span className="text-2xl block mb-2">🌐</span>
                                    <h4 className="font-bold mb-1">Translation</h4>
                                    <p className="text-sm opacity-80">Translate lengthy English READMEs with one click.</p>
                                </div>
                                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-gray-100'}`}>
                                    <span className="text-2xl block mb-2">🔗</span>
                                    <h4 className="font-bold mb-1">Source</h4>
                                    <p className="text-sm opacity-80">Direct link to GitHub repository.</p>
                                </div>
                            </div>
                        </Section>

                        {/* 4. Admin */}
                        <Section title={t('help.admin.title')} id="admin" theme={theme}>
                            <p className="mb-4">{t('help.admin.access')}</p>
                            
                            <MockScreenshot 
                                theme={theme}
                                icon={<ChartBarIcon />} 
                                title="Admin Dashboard" 
                                desc="Stats Overview | Quick Actions"
                            />

                            <dl className="space-y-4">
                                <div>
                                    <dt className="font-semibold text-lg mb-1">{t('help.admin.dashboard').split(':')[0]}</dt>
                                    <dd className={`pl-4 border-l-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                                        {t('help.admin.dashboard').split(':')[1]}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-lg mb-1">{t('help.admin.content').split(':')[0]}</dt>
                                    <dd className={`pl-4 border-l-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                                        {t('help.admin.content').split(':')[1]}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-lg mb-1">{t('help.admin.plugins').split(':')[0]}</dt>
                                    <dd className={`pl-4 border-l-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                                        {t('help.admin.plugins').split(':')[1]}
                                    </dd>
                                </div>
                            </dl>
                        </Section>

                        {/* 5. Security */}
                        <Section title={t('help.security.title')} id="security" theme={theme}>
                             <MockScreenshot 
                                theme={theme}
                                icon={<LockClosedIcon />} 
                                title="Security Settings" 
                                desc="Admin Password Configuration"
                            />
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-4 rounded-xl border ${theme === 'light' ? 'bg-green-50 border-green-200' : 'bg-green-900/10 border-green-900'}`}>
                                    <h4 className="font-bold flex items-center mb-2">
                                        <LockClosedIcon className="w-5 h-5 mr-2" />
                                        Privacy First
                                    </h4>
                                    <p className="text-sm">{t('help.security.local').replace('**Local Storage**:', '')}</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${theme === 'light' ? 'bg-orange-50 border-orange-200' : 'bg-orange-900/10 border-orange-900'}`}>
                                    <h4 className="font-bold flex items-center mb-2">
                                        <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                                        Access Control
                                    </h4>
                                    <p className="text-sm">{t('help.security.password').replace('**Admin Lock**:', '')}</p>
                                </div>
                            </div>
                        </Section>

                        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                             <p className="text-sm text-gray-500">
                                Still have questions? Visit our <a href="https://github.com/niux-discovery" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">GitHub Repository</a>.
                             </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
