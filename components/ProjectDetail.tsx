
import React, { useState } from 'react';
import { DisplayItem } from '../types';
import { StarIcon, ForkIcon, CodeIcon, ClockIcon, GithubIcon, GlobeAltIcon, DataSourceIcon, RefreshIcon } from './icons';
import MarkdownRenderer from './MarkdownRenderer';
import { timeAgo } from '../utils/date';
import { useI18n } from '../contexts/I18nContext';
import { translateText } from '../services/geminiService';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';

interface ProjectDetailProps {
  project: DisplayItem;
  isModal?: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isModal = false }) => {
  const isGithub = project.sourceType === 'github';
  const { t } = useI18n();
  const { settings } = useSettings();
  const { addToast } = useToast();
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedReadme, setTranslatedReadme] = useState<string | null>(null);

  const goBack = () => {
    window.location.hash = '#';
  };

  const handleTranslateReadme = async () => {
     if (!isGithub || !project.readmeContent) return;
     if (!settings.apiKeys || settings.apiKeys.length === 0) {
        addToast(t('translation.apiKeyNeeded'), { type: 'warning' });
        return;
     }

     setIsTranslating(true);
     try {
         const result = await translateText(
             project.readmeContent, 
             settings.language, 
             settings.apiKeys, 
             settings.model
         );
         if (result) {
             setTranslatedReadme(result);
             addToast(t('translation.readmeSuccess'), { type: 'success' });
         } else {
             addToast(t('translation.readmeError'), { type: 'error' });
         }
     } catch (e) {
         console.error(e);
         addToast(t('translation.readmeError'), { type: 'error' });
     } finally {
         setIsTranslating(false);
     }
  };

  const bgClass = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const borderClass = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const textClass = settings.theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedTextClass = settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className={`${bgClass} border ${borderClass} rounded-lg shadow-lg overflow-hidden animate-fade-in h-full`}>
        <div className={`p-5 md:p-8 ${isModal ? 'pt-10' : ''}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="pr-12">
                    {!isModal && (
                        <button onClick={goBack} className="inline-block mb-4 text-sm text-blue-400 hover:underline bg-transparent border-none p-0 cursor-pointer">
                            {t('goBack')}
                        </button>
                    )}
                    <h1 className={`text-3xl font-bold ${textClass} break-words`}>{isGithub ? project.full_name : project.aiSummary.catchyTitle}</h1>
                    {isGithub && <p className={`${mutedTextClass} mt-2 text-lg`}>{project.aiSummary.catchyTitle}</p>}
                </div>
                 <a 
                    href={isGithub ? project.html_url : project.originalUrl}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-shrink-0 flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                    {isGithub ? <GithubIcon className="w-5 h-5 mr-2" /> : <GlobeAltIcon className="w-5 h-5 mr-2" />}
                    <span>{isGithub ? t('viewOnGithub') : t('viewOriginal')}</span>
                </a>
            </div>

            {isGithub && (
                <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm border-y py-4 mb-8 ${borderClass} ${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    <span className="flex items-center" title="Language">
                        <CodeIcon className="w-5 h-5 mr-2 text-gray-500" />
                        <strong>Language:</strong><span className="ml-2">{project.language || 'N/A'}</span>
                    </span>
                    <span className="flex items-center" title="Stars">
                        <StarIcon className="w-5 h-5 mr-2 text-yellow-400" />
                        <strong>Stars:</strong><span className="ml-2">{project.stargazers_count.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center" title="Forks">
                        <ForkIcon className="w-5 h-5 mr-2 text-green-400" />
                        <strong>Forks:</strong><span className="ml-2">{project.forks_count.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center" title="Last updated">
                        <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
                        <strong>Last updated:</strong><span className="ml-2">{timeAgo(project.updated_at, t)}</span>
                    </span>
                    <span className="flex items-center" title="Collected at">
                        <DataSourceIcon className="w-5 h-5 mr-2 text-gray-500" />
                        <strong>Collected:</strong><span className="ml-2">{timeAgo(project.collectedAt, t)}</span>
                    </span>
                </div>
            )}
            
            <div className={`prose prose-lg max-w-none ${settings.theme === 'light' ? 'prose-gray' : 'prose-invert'}`}>
                 <h2 className={`text-2xl font-semibold border-b pb-2 mb-4 ${textClass} ${borderClass}`}>{t('aiSummary')}</h2>
                 
                <p className={textClass}>{project.aiSummary.introduction}</p>
                <h3 className={`text-xl font-semibold mt-4 ${textClass}`}>{t('highlights')}</h3>
                <ul className={textClass}>
                    {project.aiSummary.coreFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
                <h3 className={`text-xl font-semibold mt-4 ${textClass}`}>{t('techStack')}</h3>
                <p className={textClass}>{project.aiSummary.techStack}</p>

                {isGithub && project.readmeContent && (
                    <>
                        <div className={`flex items-center justify-between border-b pb-2 mb-4 mt-12 ${borderClass}`}>
                            <h2 className={`text-2xl font-semibold ${textClass}`}>{t('projectReadme')}</h2>
                            <button 
                                onClick={handleTranslateReadme}
                                disabled={isTranslating || !!translatedReadme}
                                className={`flex items-center text-sm px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <RefreshIcon className={`w-4 h-4 mr-2 ${isTranslating ? 'animate-spin' : ''}`} />
                                {isTranslating ? t('translation.translating') : (translatedReadme ? t('translation.translated') : t('translation.translateReadme'))}
                            </button>
                        </div>
                        <MarkdownRenderer content={translatedReadme || project.readmeContent} />
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default ProjectDetail;
