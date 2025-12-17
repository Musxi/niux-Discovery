
import React, { useState, useEffect } from 'react';
import { ScraperPlugin, AISummary } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';
import { XMarkIcon, ChevronDownIcon, RefreshIcon } from './icons';
import { processScrapedContent } from '../services/geminiService';
import { useI18n } from '../contexts/I18nContext';

interface PluginEditModalProps {
  pluginToEdit: ScraperPlugin | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (plugin: ScraperPlugin) => void;
}

const PluginEditModal: React.FC<PluginEditModalProps> = ({ pluginToEdit, isOpen, onClose, onSave }) => {
  const [pluginData, setPluginData] = useState<Partial<ScraperPlugin>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { settings } = useSettings();
  const { addToast } = useToast();
  const { t } = useI18n();

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<AISummary | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const isNew = !pluginToEdit;
  const isBuiltin = pluginToEdit?.type === 'builtin';

  useEffect(() => {
    if (isOpen) {
      if (isNew) {
        setPluginData({
          type: 'custom',
          name: '',
          description: '',
          url: '',
          instruction: '',
          apiKey: '',
          model: '',
          provider: 'gemini'
        });
      } else {
        setPluginData(pluginToEdit);
      }
      setShowAdvanced(!!pluginToEdit?.apiKey || !!pluginToEdit?.model || !!pluginToEdit?.baseUrl);
      setTestResult(null);
      setTestError(null);
    }
  }, [isOpen, pluginToEdit, isNew]);

  if (!isOpen) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPluginData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pluginData.type === 'custom' && (!pluginData.name || !pluginData.url || !pluginData.instruction)) {
        addToast(t('modals.editPlugin.validationError'), { type: 'error' });
        return;
    }

    const finalPlugin: ScraperPlugin = {
        id: pluginData.id || `plugin-${Date.now()}`,
        type: pluginData.type || 'custom',
        name: pluginData.name || '',
        description: pluginData.description || (pluginData.type === 'custom' ? `Scraping instruction: ${pluginData.instruction}` : ''),
        url: pluginData.url,
        instruction: pluginData.instruction,
        createdAt: pluginData.createdAt || new Date().toISOString(),
        apiKey: pluginData.apiKey?.trim() || undefined,
        provider: pluginData.provider || 'gemini',
        baseUrl: pluginData.baseUrl?.trim() || undefined,
        model: pluginData.model?.trim() || undefined,
    };
    onSave(finalPlugin);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setTestError(null);
    
    // Construct a temporary API key entry for testing
    // If plugin has specific key, use it. Otherwise use global keys.
    let keysToUse = settings.apiKeys;
    
    if (pluginData.apiKey && pluginData.apiKey.trim() !== '') {
        keysToUse = [{
            id: 'temp-test-key',
            name: 'Temp Plugin Key',
            key: pluginData.apiKey,
            provider: pluginData.provider || 'gemini',
            baseUrl: pluginData.baseUrl,
            status: 'unchecked',
            lastChecked: null
        }];
    }

    if (!keysToUse || keysToUse.length === 0) {
        setTestError("No API keys available for testing.");
        setIsTesting(false);
        return;
    }

    const modelToUse = pluginData.model || settings.model;
    const mockContent = "This is a sample content for testing purposes. It simulates a scraped webpage content.";

    try {
        const result = await processScrapedContent(
            mockContent,
            pluginData.instruction || "Summarize this",
            keysToUse,
            modelToUse,
            settings.language
        );
        if (result) {
            setTestResult(result);
        } else {
            setTestError("AI returned no result.");
        }
    } catch (e: any) {
        setTestError(e.message || "Unknown error occurred");
    } finally {
        setIsTesting(false);
    }
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
          <h2 className={`text-xl font-bold ${textColor}`}>{isNew ? t('modals.editPlugin.createTitle') : t('modals.editPlugin.editTitle', { name: pluginToEdit.name })}</h2>
          <button onClick={onClose} className={`p-1 rounded-full ${settings.theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'}`}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editPlugin.name')}</label>
                <input
                  type="text" id="name" name="name"
                  value={pluginData.name || ''}
                  onChange={handleInputChange}
                  placeholder={isBuiltin ? '' : t('modals.editPlugin.namePlaceholder')}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
              <div>
                <label htmlFor="description" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editPlugin.description')}</label>
                <textarea
                  id="description" name="description" rows={2}
                  value={pluginData.description || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
              {!isBuiltin && (
                <>
                    <div>
                        <label htmlFor="url" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editPlugin.targetURL')}</label>
                        <input
                            type="url" id="url" name="url"
                            value={pluginData.url || ''}
                            onChange={handleInputChange}
                            placeholder={t('modals.editPlugin.urlPlaceholder')}
                            required
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                        />
                    </div>
                     <div>
                        <label htmlFor="instruction" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editPlugin.instruction')}</label>
                        <textarea
                            id="instruction" name="instruction" rows={3}
                            value={pluginData.instruction || ''}
                            onChange={handleInputChange}
                            placeholder={t('modals.editPlugin.instructionPlaceholder')}
                            required
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                        />
                    </div>
                </>
              )}
            </div>

             {/* Testing Section */}
             {!isBuiltin && (
                <div className={`px-6 pb-6`}>
                    <div className={`p-4 rounded-md border ${settings.theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800/50 border-gray-700'}`}>
                        <div className="flex justify-between items-center mb-2">
                             <h4 className={`text-sm font-medium ${textColor}`}>{t('modals.editPlugin.testConfig')}</h4>
                             <button
                                type="button"
                                onClick={handleTest}
                                disabled={isTesting}
                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                             >
                                <RefreshIcon className={`w-3 h-3 mr-1 ${isTesting ? 'animate-spin' : ''}`} />
                                {isTesting ? t('modals.editPlugin.testing') : 'Test Run'}
                             </button>
                        </div>
                        {testError && <p className="text-xs text-red-500 mt-2">{t('modals.editPlugin.testError')} {testError}</p>}
                        {testResult && (
                            <div className="mt-2 text-xs">
                                <p className="text-green-500 font-semibold mb-1">{t('modals.editPlugin.testSuccess')}</p>
                                <div className={`p-2 rounded border overflow-auto max-h-32 ${settings.theme === 'light' ? 'bg-white border-gray-300' : 'bg-black border-gray-600'}`}>
                                    <pre className={textColor}>{JSON.stringify(testResult, null, 2)}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


            <div className={`border-y ${sectionBorder}`}>
                <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className={`w-full flex justify-between items-center p-4 text-left font-semibold ${textColor}`}>
                    {t('modals.editPlugin.advancedConfig')}
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
                {showAdvanced && (
                    <div className="p-6 pt-2 space-y-4 border-t border-dashed border-gray-700">
                         <p className={`text-xs ${mutedTextColor}`}>
                            {t('modals.editPlugin.advancedNote')}
                        </p>
                         <div>
                            <label htmlFor="provider" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editPlugin.provider')}</label>
                             <select
                                id="provider" name="provider"
                                value={pluginData.provider || 'gemini'}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                            >
                                <option value="gemini">Google Gemini</option>
                                <option value="openai">OpenAI Compatible</option>
                            </select>
                        </div>
                        {pluginData.provider === 'openai' && (
                            <div>
                                <label htmlFor="baseUrl" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editPlugin.baseUrl')}</label>
                                <input
                                    type="text" id="baseUrl" name="baseUrl"
                                    value={pluginData.baseUrl || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://api.openai.com/v1"
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="apiKey" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editPlugin.apiKey')}</label>
                            <input
                                type="password" id="apiKey" name="apiKey"
                                value={pluginData.apiKey || ''}
                                onChange={handleInputChange}
                                placeholder={t('modals.editPlugin.apiKeyPlaceholder')}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                            />
                        </div>
                         <div>
                            <label htmlFor="model" className={`block text-sm font-medium mb-1 ${labelColor}`}>{t('modals.editPlugin.model')}</label>
                             <input
                                list="model-suggestions-plugin"
                                id="model" name="model"
                                value={pluginData.model || ''}
                                onChange={handleInputChange}
                                placeholder={t('modals.editPlugin.modelGlobal', { model: settings.model })}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                            />
                             <datalist id="model-suggestions-plugin">
                                <option value="gemini-2.5-flash" />
                                <option value="gemini-2.5-pro" />
                                <option value="gpt-4o" />
                                <option value="deepseek-chat" />
                            </datalist>
                        </div>
                    </div>
                )}
            </div>
            
            <div className={`p-4 flex justify-end space-x-3 sticky bottom-0 ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-gray-900/50'} border-t ${sectionBorder}`}>
              <button
                type="button" onClick={onClose}
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${settings.theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
              >
                {t('modals.editPlugin.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t('modals.editPlugin.save')}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PluginEditModal;
