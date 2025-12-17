
import React from 'react';
import { DisplayItem } from '../types';
import { StarIcon, ForkIcon, CodeIcon, LinkIcon, ClockIcon, GlobeAltIcon } from './icons';
import { timeAgo } from '../utils/date';
import { useSettings } from '../contexts/SettingsContext';
import Highlighter from './Highlighter';
import { useI18n } from '../contexts/I18nContext';


interface ProjectCardProps {
  project: DisplayItem;
  searchQuery?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, searchQuery }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  const isGithub = project.sourceType === 'github';

  const cardBg = settings.theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#161b22] border-gray-700';
  const textColor = settings.theme === 'light' ? 'text-gray-700' : 'text-gray-100';
  const mutedTextColor = settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const chipBg = settings.theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-gray-700 text-blue-300';
  const footerBg = settings.theme === 'light' ? 'bg-gray-50 border-t border-gray-200' : 'bg-gray-900/50 border-t border-gray-700';

  const navigateToDetail = () => {
    window.location.hash = `#/project/${project.id}`;
  };
  
  return (
    <div 
        onClick={navigateToDetail}
        className={`relative block border rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer w-full avoid-break ${cardBg}`}
    >
        <div className="flex flex-col h-full">
            {isGithub && project.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden border-b border-gray-700">
                <img
                    src={project.imageUrl}
                    alt={`${project.name} preview`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                </div>
            )}
             {!isGithub && (
                <div className={`relative h-10 w-full flex items-center px-6 border-b ${footerBg}`}>
                    <GlobeAltIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-xs text-gray-400 truncate">{t('source', { url: project.originalUrl })}</span>
                </div>
            )}


            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h2
                        title={isGithub ? project.full_name : project.aiSummary.catchyTitle}
                        className={`text-lg font-bold group-hover:underline pr-4 truncate transition-colors duration-300 ${settings.theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}
                    >
                         <Highlighter text={isGithub ? project.full_name : project.aiSummary.catchyTitle} highlight={searchQuery || ''} />
                    </h2>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-colors duration-300 ${chipBg}`}>{project.aiSummary.category}</span>
                </div>

                {isGithub && <h3 className={`font-semibold text-base mb-3 truncate transition-colors duration-300 ${textColor}`}><Highlighter text={project.aiSummary.catchyTitle} highlight={searchQuery || ''} /></h3>}
                
                <p className={`text-sm mb-4 flex-grow transition-colors duration-300 ${mutedTextColor}`}>
                    <Highlighter text={project.aiSummary.introduction} highlight={searchQuery || ''} />
                </p>

                <div className={`flex items-center text-xs mt-2 transition-colors duration-300 ${mutedTextColor}`}>
                    <ClockIcon className="w-4 h-4 mr-1.5"/>
                    <span>
                        {isGithub ? t('collectedAt', { time: timeAgo(project.collectedAt, t)}) : t('collectedAt', { time: timeAgo(project.createdAt, t) })}
                    </span>
                </div>
            </div>

            <div className={`p-5 mt-auto transition-colors duration-300 ${footerBg}`}>
                <div className="flex items-center justify-between text-sm">
                    {isGithub ? (
                        <div className={`flex items-center space-x-4 transition-colors duration-300 ${mutedTextColor}`}>
                            <span className="flex items-center" title="Language">
                              <CodeIcon className="w-4 h-4 mr-1" />
                              {project.language || 'N/A'}
                            </span>
                            <span className="flex items-center" title="Stars">
                              <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                              {project.stargazers_count.toLocaleString()}
                            </span>
                            <span className="flex items-center" title="Forks">
                              <ForkIcon className="w-4 h-4 mr-1 text-green-400" />
                              {project.forks_count.toLocaleString()}
                            </span>
                        </div>
                    ) : <div /> }
                    <div className={`flex items-center transition-colors duration-300 ${settings.theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                        <LinkIcon className="w-4 h-4 mr-1" />
                        <span>{t('details')}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProjectCard;
