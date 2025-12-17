
import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { ApiKeyEntry, AiProvider } from '../../types';
import { validateApiKey } from '../../services/geminiService';
import { PlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon, RefreshIcon, ChevronUpIcon, ChevronDownIcon } from '../icons';
import { useI18n } from '../../contexts/I18nContext';

interface ApiKeyManagerProps {
    apiKeys: ApiKeyEntry[];
    onApiKeysChange: (newKeys: ApiKeyEntry[]) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKeys, onApiKeysChange }) => {
    const { settings } = useSettings();
    const { addToast } = useToast();
    const { t } = useI18n();
    const [validatingKeyId, setValidatingKeyId] = useState<string | null>(null);

    const inputBg = settings.theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-gray-200';
    const labelColor = settings.theme === 'light' ? 'text-gray-700' : 'text-gray-300';
    const buttonHover = settings.theme === 'light' ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-gray-700 text-gray-400';

    const handleUpdateKey = (id: string, field: keyof ApiKeyEntry, value: string) => {
        const newKeys = apiKeys.map(k => k.id === id ? { ...k, [field]: value, status: 'unchecked' } as ApiKeyEntry : k);
        onApiKeysChange(newKeys);
    };

    const handleProviderChange = (id: string, newProvider: AiProvider) => {
        const newKeys = apiKeys.map(k => {
            if (k.id === id) {
                // If switching provider, assume the old model might be invalid for the new provider.
                // Reset to a sensible default if it looks like a default model, or if it's empty.
                const oldDefault = k.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.5-flash';
                let newModel = k.defaultModel;
                
                if (!newModel || newModel === oldDefault) {
                    newModel = newProvider === 'openai' ? 'gpt-4o' : 'gemini-2.5-flash';
                }
                
                return { 
                    ...k, 
                    provider: newProvider, 
                    defaultModel: newModel,
                    status: 'unchecked' 
                } as ApiKeyEntry;
            }
            return k;
        });
        onApiKeysChange(newKeys);
    };

    const handleAddKey = () => {
        const newKey: ApiKeyEntry = {
            id: `key-${Date.now()}`,
            name: `${t('admin.settings.apiKeyNameDefault')} ${apiKeys.length + 1}`,
            key: '',
            provider: 'gemini',
            defaultModel: 'gemini-2.5-flash',
            status: 'unchecked',
            lastChecked: null,
        };
        onApiKeysChange([...apiKeys, newKey]);
    };

    const handleRemoveKey = (id: string) => {
        const keyToRemove = apiKeys.find(k => k.id === id);
        if (keyToRemove && window.confirm(t('admin.settings.confirmDeleteKey', { name: keyToRemove.name }))) {
             onApiKeysChange(apiKeys.filter(k => k.id !== id));
        }
    };
    
    const handleMove = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === apiKeys.length - 1)) {
            return;
        }
        const newKeys = [...apiKeys];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newKeys[index], newKeys[targetIndex]] = [newKeys[targetIndex], newKeys[index]];
        onApiKeysChange(newKeys);
    };

    const handleValidateKey = async (id: string) => {
        const keyToValidate = apiKeys.find(k => k.id === id);
        if (!keyToValidate || !keyToValidate.key) {
            addToast(t('admin.settings.keyValidationWarning'), { type: 'warning' });
            return;
        }
        setValidatingKeyId(id);
        
        const modelToTest = keyToValidate.defaultModel || (keyToValidate.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.5-flash');
        
        const isValid = await validateApiKey(keyToValidate.key, keyToValidate.provider, keyToValidate.baseUrl, modelToTest);
        
        const newStatus: 'valid' | 'invalid' = isValid ? 'valid' : 'invalid';
        const newKeys = apiKeys.map(k => k.id === id ? {
            ...k,
            status: newStatus,
            lastChecked: new Date().toISOString()
        } : k);
        onApiKeysChange(newKeys);
        setValidatingKeyId(null);
        addToast(isValid 
            ? t('admin.settings.keyValidationSuccess', { name: keyToValidate.name }) 
            : t('admin.settings.keyValidationFailure', { name: keyToValidate.name }), 
            { type: isValid ? 'success' : 'error' });
    };

    const getStatusIcon = (status: ApiKeyEntry['status']) => {
        switch (status) {
            case 'valid':
                return <span title={t('admin.settings.keyStatusValid')}><CheckCircleIcon className="w-5 h-5 text-green-500" /></span>;
            case 'invalid':
                return <span title={t('admin.settings.keyStatusInvalid')}><XCircleIcon className="w-5 h-5 text-red-500" /></span>;
            default:
                 return <span title={t('admin.settings.keyStatusUnchecked')}><div className="w-5 h-5"></div></span>; 
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                    {t('admin.settings.globalApiKeys')}
                </label>
                <p className={`text-xs ${settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('admin.settings.apiKeysDescription')}
                </p>
            </div>
            <div className="space-y-4">
                {apiKeys.map((k, index) => (
                    <div key={k.id} className="flex gap-2 p-3 border rounded-lg border-gray-200 dark:border-gray-700 items-start transition-colors duration-200 hover:border-blue-500/30">
                         <div className="flex flex-col items-center justify-center pt-2 gap-1">
                           <button type="button" onClick={() => handleMove(index, 'up')} disabled={index === 0} className={`p-1 rounded-md disabled:opacity-30 ${buttonHover}`}>
                             <ChevronUpIcon className="w-4 h-4" />
                           </button>
                           <button type="button" onClick={() => handleMove(index, 'down')} disabled={index === apiKeys.length - 1} className={`p-1 rounded-md disabled:opacity-30 ${buttonHover}`}>
                             <ChevronDownIcon className="w-4 h-4" />
                           </button>
                        </div>
                        
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-3">
                            {/* Line 1: Basic Info */}
                             <div className="md:col-span-3">
                                <label className="block text-xs text-gray-500 mb-1">Provider</label>
                                <select 
                                    value={k.provider || 'gemini'} 
                                    onChange={(e) => handleProviderChange(k.id, e.target.value as AiProvider)}
                                    className={`w-full px-2 py-1.5 border rounded-md shadow-sm text-sm ${inputBg}`}
                                >
                                    <option value="gemini">{t('admin.settings.providerGemini')}</option>
                                    <option value="openai">{t('admin.settings.providerOpenAI')}</option>
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs text-gray-500 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={k.name}
                                    onChange={(e) => handleUpdateKey(k.id, 'name', e.target.value)}
                                    placeholder={t('admin.settings.apiKeyNamePlaceholder')}
                                    className={`w-full px-2 py-1.5 border rounded-md shadow-sm text-sm ${inputBg}`}
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-xs text-gray-500 mb-1">Model (Required)</label>
                                <input
                                    list={`model-suggestions-${k.id}`}
                                    type="text"
                                    value={k.defaultModel || ''}
                                    onChange={(e) => handleUpdateKey(k.id, 'defaultModel', e.target.value)}
                                    placeholder={k.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o'}
                                    className={`w-full px-2 py-1.5 border rounded-md shadow-sm text-sm ${inputBg}`}
                                />
                                <datalist id={`model-suggestions-${k.id}`}>
                                    {k.provider === 'gemini' ? (
                                        <>
                                            <option value="gemini-2.5-flash" />
                                            <option value="gemini-2.5-pro" />
                                        </>
                                    ) : (
                                        <>
                                            <option value="gpt-4o" />
                                            <option value="gpt-4o-mini" />
                                            <option value="deepseek-chat" />
                                            <option value="deepseek-coder" />
                                            <option value="moonshot-v1-8k" />
                                            <option value="claude-3-5-sonnet" />
                                        </>
                                    )}
                                </datalist>
                            </div>
                            <div className="md:col-span-2 flex items-end justify-end space-x-2 pb-1">
                                {getStatusIcon(k.status)}
                                <button
                                    type="button"
                                    onClick={() => handleValidateKey(k.id)}
                                    disabled={validatingKeyId === k.id}
                                    className={`p-1.5 rounded-md transition-colors ${settings.theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-gray-700'}`}
                                    title={t('admin.settings.validateKey')}
                                >
                                    <RefreshIcon className={`w-5 h-5 ${validatingKeyId === k.id ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveKey(k.id)}
                                    className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10"
                                    title={t('admin.settings.deleteKey')}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Line 2: Details */}
                            {k.provider === 'openai' && (
                                <div className="md:col-span-6">
                                    <label className="block text-xs text-gray-500 mb-1">Base URL (e.g. https://api.deepseek.com)</label>
                                    <input
                                        type="text"
                                        value={k.baseUrl || ''}
                                        onChange={(e) => handleUpdateKey(k.id, 'baseUrl', e.target.value)}
                                        placeholder={t('admin.settings.baseUrlPlaceholder')}
                                        className={`w-full px-2 py-1.5 border rounded-md shadow-sm text-sm ${inputBg}`}
                                    />
                                </div>
                            )}
                            <div className={k.provider === 'openai' ? 'md:col-span-6' : 'md:col-span-12'}>
                                <label className="block text-xs text-gray-500 mb-1">API Key</label>
                                <input
                                    type="password"
                                    value={k.key}
                                    onChange={(e) => handleUpdateKey(k.id, 'key', e.target.value)}
                                    placeholder={t('admin.settings.apiKeyInputPlaceholder')}
                                    className={`w-full px-2 py-1.5 border rounded-md shadow-sm text-sm ${inputBg}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="pt-2">
                <button
                    type="button"
                    onClick={handleAddKey}
                    className="flex items-center text-sm font-medium text-blue-500 hover:text-blue-400"
                >
                    <PlusIcon className="w-5 h-5 mr-1" />
                    {t('admin.settings.addApiKey')}
                </button>
            </div>
        </div>
    );
};

export default ApiKeyManager;
