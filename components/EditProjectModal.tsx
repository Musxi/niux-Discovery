import React, { useState, useEffect } from 'react';
import { ProcessedRepo, AISummary, SummaryVersion, getFallbackSummary } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';
import { XMarkIcon, RefreshIcon } from './icons';
import { generateProjectSummary } from '../services/geminiService';
import { useI18n } from '../contexts/I18nContext';


interface EditProjectModalProps {
  project: ProcessedRepo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: ProcessedRepo) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, isOpen, onClose, onSave }) => {
  const { settings } = useSettings();
  const { addToast } = useToast();
  const { t } = useI18n();
  
  const [summary, setSummary] = useState<AISummary>(project.aiSummary || getFallbackSummary());
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  useEffect(() => {
    setSummary(project.aiSummary || getFallbackSummary());
    setShowHistory(false);
    setCustomPrompt('');
  }, [project]);

  if (!isOpen) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSummary(prev => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const features = e.target.value.split('\n');
    setSummary(prev => ({ ...prev, coreFeatures: features }));
  };
  
  const handleRegenerate = async () => {
    if (!settings.apiKeys || settings.apiKeys.length === 0) {
        addToast(t('modals.editProject.apiKeyWarning'), { type: 'warning' });
        return;
    }
    setIsRegenerating(true);
    try {
        const newSummary = await generateProjectSummary(
            project.name,
            project.readmeContent || project.description || '',
            settings.apiKeys,
            settings.model,
            customPrompt,
            settings.language // Pass current language
        );
        if(newSummary) {
          setSummary(newSummary);
        } else {
          addToast(t('modals.editProject.regenerateFail'), { type: 'error' });
        }
    } catch (error) {
        console.error('Failed to regenerate summary:', error);
        addToast(t('modals.editProject.regenerateError'), { type: 'error' });
    } finally {
        setIsRegenerating(false);
    }
  };

  const handleRestoreVersion = (version: SummaryVersion) => {
    setSummary(version.summary);
    setShowHistory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...project, aiSummary: summary });
  };

  const modalBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#1e242c]';
  const inputBg = settings.theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-200';
  const labelColor = settings.theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const textColor = settings.theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedTextColor = settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const sectionBorder = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className={`relative rounded-lg shadow-xl border w-full max-w-2xl max-h-[90vh] flex flex-col ${modalBg} ${sectionBorder}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center p-4 border-b ${sectionBorder}`}>
          <h2 className={`text-xl font-bold ${textColor}`}>{t('modals.editProject.title')}</h2>
          <button onClick={onClose} className={`p-1 rounded-full ${settings.theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'}`}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="catchyTitle" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editProject.catchyTitle')}</label>
                <input
                  type="text"
                  id="catchyTitle"
                  name="catchyTitle"
                  value={summary.catchyTitle}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
               <div>
                <label htmlFor="category" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editProject.category')}</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={summary.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
              <div>
                <label htmlFor="introduction" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editProject.introduction')}</label>
                <textarea
                  id="introduction"
                  name="introduction"
                  rows={3}
                  value={summary.introduction}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
              <div>
                <label htmlFor="coreFeatures" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editProject.coreFeatures')}</label>
                <textarea
                  id="coreFeatures"
                  name="coreFeatures"
                  rows={4}
                  value={summary.coreFeatures.join('\n')}
                  onChange={handleFeaturesChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
               <div>
                <label htmlFor="techStack" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editProject.techStack')}</label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={summary.techStack}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
            </div>

            <div className={`p-6 space-y-4 border-y ${sectionBorder}`}>
              <h3 className={`text-lg font-semibold ${textColor}`}>{t('modals.editProject.aiOptimize')}</h3>
              <div>
                <label htmlFor="customPrompt" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editProject.optimizePrompt')}</label>
                 <textarea
                  id="customPrompt"
                  name="customPrompt"
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t('modals.editProject.optimizePlaceholder')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                <RefreshIcon className={`w-5 h-5 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? t('modals.editProject.regenerating') : t('modals.editProject.regenerate')}
              </button>
            </div>
            
            <div className={`p-6 border-b ${sectionBorder}`}>
                <button type="button" onClick={() => setShowHistory(!showHistory)} className={`text-sm font-medium w-full text-left ${labelColor}`}>
                    {showHistory ? '▼' : '►'} {t('modals.editProject.history', { count: project.modificationHistory?.length || 0 })}
                </button>
                {showHistory && (
                    <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
                        {project.modificationHistory && project.modificationHistory.length > 0 ? (
                            project.modificationHistory.map((version, index) => (
                                <div key={index} className={`p-3 rounded-md border flex justify-between items-center ${settings.theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800/50 border-gray-700'}`}>
                                    <div>
                                        <p className={`text-xs font-semibold ${textColor}`}>{t('modals.editProject.modifiedAt', { time: new Date(version.modifiedAt).toLocaleString() })}</p>
                                        <p className={`text-xs mt-1 truncate ${mutedTextColor}`} title={version.summary.catchyTitle}>{version.summary.catchyTitle}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRestoreVersion(version)}
                                        className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                                    >
                                        {t('modals.editProject.restoreVersion')}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className={`text-xs ${mutedTextColor}`}>{t('modals.editProject.noHistory')}</p>
                        )}
                    </div>
                )}
            </div>
            
            <div className={`p-4 flex justify-end space-x-3 sticky bottom-0 ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-gray-900/50'} border-t ${sectionBorder}`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${settings.theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
              >
                {t('modals.editProject.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t('modals.editProject.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;