import React from 'react';
import { DisplayItem } from '../types';
import { StarIcon, CodeIcon, ClockIcon, GithubIcon, GlobeAltIcon } from './icons';
import { timeAgo } from '../utils/date';
import { useSettings } from '../contexts/SettingsContext';
import Highlighter from './Highlighter';
import { useI18n } from '../contexts/I18nContext';

interface ProjectListItemProps {
    project: DisplayItem;
    searchQuery?: string;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, searchQuery }) => {
    const { settings } = useSettings();
    const { t } = useI18n();
    const isGithub = project.sourceType === 'github';

    const cardBg = settings.theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#161b22] border-gray-700';
    const textColor = settings.theme === 'light' ? 'text-gray-800' : 'text-gray-100';
    const mutedTextColor = settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400';
    const chipBg = settings.theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-gray-700 text-blue-300';
    const hoverBg = settings.theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800/50';

    const navigateToDetail = () => {
        window.location.hash = `#/project/${project.id}`;
    };

    return (
        <div 
            onClick={navigateToDetail} 
            className={`flex items-center p-4 border rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${cardBg} ${hoverBg}`}
        >
            <div className="flex-shrink-0 mr-4">
                {isGithub ? <GithubIcon className="w-8 h-8 text-gray-500" /> : <GlobeAltIcon className="w-8 h-8 text-gray-500" />}
            </div>
            <div className="flex-grow grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-8 lg:col-span-9">
                    <div className="flex items-center mb-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap mr-3 ${chipBg}`}>{project.aiSummary.category}</span>
                        <h2 className={`text-base font-bold truncate ${settings.theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} title={isGithub ? project.full_name : project.aiSummary.catchyTitle}>
                           <Highlighter text={isGithub ? project.full_name : project.aiSummary.catchyTitle} highlight={searchQuery || ''} />
                        </h2>
                    </div>
                    {isGithub && <p className={`text-sm font-semibold truncate mb-1 ${textColor}`}><Highlighter text={project.aiSummary.catchyTitle} highlight={searchQuery || ''} /></p>}
                    <p className={`text-xs text-ellipsis overflow-hidden h-8 ${mutedTextColor}`}>
                        <Highlighter text={project.aiSummary.introduction} highlight={searchQuery || ''} />
                    </p>
                </div>

                <div className="col-span-12 md:col-span-4 lg:col-span-3">
                     {isGithub ? (
                        <div className={`flex flex-wrap items-center justify-start md:justify-end text-xs space-x-4 ${mutedTextColor}`}>
                            <span className="flex items-center" title="Language">
                              <CodeIcon className="w-4 h-4 mr-1" />
                              {project.language || 'N/A'}
                            </span>
                            <span className="flex items-center" title="Stars">
                              <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                              {project.stargazers_count.toLocaleString()}
                            </span>
                            <span className="flex items-center" title={t('admin.content.tableCollectedAt')}>
                                <ClockIcon className="w-4 h-4 mr-1"/>
                               {timeAgo(project.collectedAt, t)}
                            </span>
                        </div>
                    ) : (
                         <div className={`flex flex-wrap items-center justify-start md:justify-end text-xs space-x-4 ${mutedTextColor}`}>
                            <span className="flex items-center" title="Collected At">
                                <ClockIcon className="w-4 h-4 mr-1"/>
                               {timeAgo(project.createdAt, t)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectListItem;