
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
  onSelect?: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, searchQuery, onSelect }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  const isGithub = project.sourceType === 'github';
  
  // 判断是否还在等待 AI 生成
  const isFallback = project.aiSummary.catchyTitle === project.name;

  const cardBg = settings.theme === 'light' ? 'bg-white/80' : 'bg-[#161b22]/80';
  const borderColor = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-800';
  const textColor = settings.theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const mutedTextColor = settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const chipBg = settings.theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

  return (
    <div 
        onClick={() => onSelect && isGithub && onSelect(project.id)}
        className={`relative flex flex-col border rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-500 group cursor-pointer shadow-sm hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 avoid-break ${cardBg} ${borderColor}`}
    >
        {isGithub && project.imageUrl && (
            <div className="relative h-44 w-full overflow-hidden">
                <img
                    src={project.imageUrl}
                    alt={project.name}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
        )}

        <div className="p-5 flex-grow">
            <div className="flex justify-between items-start gap-3 mb-3">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border tracking-wider transition-colors ${chipBg}`}>
                    {project.aiSummary.category}
                </span>
                {isFallback && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-yellow-600 uppercase">Scouting...</span>
                    </div>
                )}
            </div>

            <h2 className={`text-lg font-black leading-tight mb-2 group-hover:text-blue-500 transition-colors ${textColor}`}>
                 <Highlighter text={isGithub ? project.full_name : project.aiSummary.catchyTitle} highlight={searchQuery || ''} />
            </h2>
            
            <p className={`text-sm font-medium leading-relaxed mb-4 line-clamp-3 ${mutedTextColor}`}>
                <Highlighter text={project.aiSummary.introduction} highlight={searchQuery || ''} />
            </p>

            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                {isGithub && (
                    <>
                        <span className="flex items-center gap-1">
                            <StarIcon className="w-3 h-3 text-yellow-500" />
                            {project.stargazers_count.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <CodeIcon className="w-3 h-3" />
                            {project.language || 'N/A'}
                        </span>
                    </>
                )}
                <span className="flex items-center gap-1 ml-auto">
                    <ClockIcon className="w-3 h-3" />
                    {timeAgo(isGithub ? project.collectedAt : project.createdAt, t)}
                </span>
            </div>
        </div>

        <div className={`px-5 py-3 border-t text-[10px] font-black uppercase tracking-widest flex items-center justify-between ${borderColor} ${settings.theme === 'light' ? 'bg-gray-50/50' : 'bg-gray-900/30'}`}>
            <span className={mutedTextColor}>
                {isGithub ? project.owner.login : 'Curated'}
            </span>
            <div className="flex items-center text-blue-500 group-hover:translate-x-1 transition-transform">
                <span>{t('details')}</span>
                <LinkIcon className="w-3 h-3 ml-1" />
            </div>
        </div>
    </div>
  );
};

export default ProjectCard;
