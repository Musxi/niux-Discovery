
import React, { useState, useEffect } from 'react';
import { useSettings, Settings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import ApiKeyManager from './ApiKeyManager';
import { useI18n } from '../../contexts/I18nContext';

const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode; theme: 'light' | 'dark' }> = ({ title, description, children, theme }) => {
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  return (
    <div className={`rounded-lg border shadow-lg ${cardBg} ${borderColor}`}>
      <div className={`p-6 border-b ${borderColor}`}>
        <h2 className={`text-xl font-bold ${textColor}`}>{title}</h2>
        <p className={`mt-1 text-sm ${mutedTextColor}`}>{description}</p>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

const SettingsPanel: React.FC = () => {
  const { settings, saveSettings } = useSettings();
  const { addToast } = useToast();
  const { t } = useI18n();
  
  const [localSettings, setLocalSettings] = useState<Settings>(() => JSON.parse(JSON.stringify(settings)));
  
  useEffect(() => {
    setLocalSettings(JSON.parse(JSON.stringify(settings)));
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({...prev, [name]: value}));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({...prev, [name]: value === 'true'}));
  };
  
  const handleApiKeysChange = (newKeys: Settings['apiKeys']) => {
    setLocalSettings(prev => ({...prev, apiKeys: newKeys}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(localSettings);
    addToast(t('admin.settings.saveSuccess'), { type: 'success' });
  };
  
  const inputBg = settings.theme === 'light' ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-200';
  const labelColor = settings.theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const buttonColor = 'bg-blue-600 hover:bg-blue-700 text-white';
  const borderColor = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{t('admin.settings.title')}</h1>
        <p className={`mt-2 text-lg ${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          {t('admin.settings.description')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <SettingsCard title={t('admin.settings.aiConfigTitle')} description={t('admin.settings.aiConfigDesc')} theme={settings.theme}>
           <div className="space-y-6">
              <ApiKeyManager apiKeys={localSettings.apiKeys} onApiKeysChange={handleApiKeysChange} />
              
              <div className={`pt-4 border-t border-dashed ${settings.theme === 'light' ? 'border-gray-300' : 'border-gray-700'}`}>
                   <h3 className={`text-sm font-semibold mb-3 ${labelColor}`}>{t('admin.settings.githubTokenTitle')}</h3>
                   <div className="md:w-2/3">
                      <label htmlFor="githubToken" className={`block text-xs font-medium mb-1 ${labelColor}`}>
                        {t('admin.settings.githubToken')}
                      </label>
                      <input
                        type="password" id="githubToken" name="githubToken"
                        value={localSettings.githubToken || ''}
                        onChange={handleInputChange}
                        placeholder="ghp_..."
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                      />
                       <p className={`mt-2 text-xs ${settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                         {t('admin.settings.githubTokenDesc')}
                      </p>
                   </div>
              </div>
           </div>
        </SettingsCard>
        
        <SettingsCard title={t('admin.settings.securityTitle')} description={t('admin.settings.securityDesc')} theme={settings.theme}>
           <div>
              <label htmlFor="adminPassword" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                {t('admin.settings.adminPassword')}
              </label>
              <input
                type="password" id="adminPassword" name="adminPassword"
                value={localSettings.adminPassword || ''}
                onChange={handleInputChange}
                placeholder={t('admin.settings.adminPasswordPlaceholder')}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
              />
              <p className={`mt-2 text-xs ${settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                 {t('admin.settings.adminPasswordNote')}
              </p>
            </div>
        </SettingsCard>
        
        <SettingsCard title={t('admin.settings.appearanceTitle')} description={t('admin.settings.appearanceDesc')} theme={settings.theme}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="siteName" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                    {t('admin.settings.siteName')}
                  </label>
                  <input
                    type="text" id="siteName" name="siteName"
                    value={localSettings.siteName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                  />
                </div>
                <div>
                  <label htmlFor="logoUrl" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                    {t('admin.settings.logoUrl')}
                  </label>
                  <input
                    type="text" id="logoUrl" name="logoUrl"
                    value={localSettings.logoUrl || ''}
                    onChange={handleInputChange}
                    placeholder={t('admin.settings.logoUrlPlaceholder')}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                  />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="theme" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                    {t('admin.settings.theme')}
                  </label>
                  <select
                    id="theme" name="theme"
                    value={localSettings.theme}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                  >
                    <option value="dark">{t('admin.settings.themeDark')}</option>
                    <option value="light">{t('admin.settings.themeLight')}</option>
                  </select>
                </div>
                 <div>
                  <label htmlFor="layout" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                    {t('admin.settings.defaultLayout')}
                  </label>
                  <select
                    id="layout" name="layout"
                    value={localSettings.layout}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                  >
                    <option value="grid">{t('admin.settings.layoutGrid')}</option>
                    <option value="list">{t('admin.settings.layoutList')}</option>
                  </select>
                </div>
            </div>
             <div>
                <label htmlFor="footerText" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                  {t('admin.settings.footerText')}
                </label>
                <textarea
                  id="footerText" name="footerText" rows={2}
                  value={localSettings.footerText}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                />
              </div>
          </div>
        </SettingsCard>

        <SettingsCard title={t('admin.settings.featuresTitle')} description={t('admin.settings.featuresDesc')} theme={settings.theme}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="isSearchEnabled" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                      {t('admin.settings.search')}
                    </label>
                    <select
                      id="isSearchEnabled" name="isSearchEnabled"
                      value={localSettings.isSearchEnabled ? 'true' : 'false'}
                      onChange={handleToggleChange}
                      className={`block w-full md:w-1/2 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                    >
                      <option value="true">{t('admin.settings.searchEnabled')}</option>
                      <option value="false">{t('admin.settings.searchDisabled')}</option>
                    </select>
                </div>
                 <div>
                  <label htmlFor="language" className={`block text-sm font-medium mb-2 ${labelColor}`}>
                    {t('admin.settings.language')}
                  </label>
                  <select
                    id="language" name="language"
                    value={localSettings.language}
                    onChange={handleInputChange}
                    className={`block w-full md:w-1/2 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm ${inputBg}`}
                  >
                    <option value="zh-CN">{t('admin.settings.languageZH')}</option>
                    <option value="en">{t('admin.settings.languageEN')}</option>
                  </select>
                </div>
            </div>
        </SettingsCard>
        
        <div className={`pt-4 pb-2 mt-8 sticky bottom-0 ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'} z-10 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 border-t ${borderColor}`}>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className={`w-full md:w-auto px-8 py-3 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${buttonColor}`}
                >
                    {t('admin.settings.save')}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPanel;
