
import React, { useState, useEffect } from 'react';
import { GithubIcon, RefreshIcon, Cog6ToothIcon, SearchIcon, XMarkIcon, QuestionMarkCircleIcon } from './icons';
import { useSettings } from '../contexts/SettingsContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../contexts/I18nContext';

interface SearchBarProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  theme: 'light' | 'dark';
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ inputValue, onInputChange, onSearchSubmit, onClearSearch, theme, placeholder }) => {
  return (
    <form onSubmit={onSearchSubmit} className="relative w-full h-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className={`h-5 w-5 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={inputValue}
        onChange={onInputChange}
        className={`block w-full rounded-md border-0 h-full pl-10 pr-8 transition-colors duration-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm ${
          theme === 'light'
            ? 'bg-gray-100 text-gray-900 placeholder:text-gray-400'
            : 'bg-gray-800 text-gray-200 placeholder:text-gray-500'
        }`}
      />
      {inputValue && (
        <button
          type="button"
          onClick={onClearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          aria-label="Clear search"
        >
          <XMarkIcon className={`h-5 w-5 transition-colors ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-200'}`} />
        </button>
      )}
    </form>
  );
};


interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated?: Date | null;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, lastUpdated }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash;
        const match = hash.match(/#\/search\?q=([^&]*)/);
        if (match && match[1]) {
            setInputValue(decodeURIComponent(match[1]));
        } else {
            if (!hash.startsWith('#/search')) {
                setInputValue('');
            }
        }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      window.location.hash = `#/search?q=${encodeURIComponent(inputValue.trim())}`;
      if (mobileSearchVisible) {
        setMobileSearchVisible(false);
      }
    }
  };
  
  const handleClearSearch = () => {
    setInputValue('');
    if (window.location.hash.startsWith('#/search')) {
        window.location.hash = '#';
    }
  }

  const navigate = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <header className={`border-b sticky top-0 z-20 transition-colors duration-300 ${settings.theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#161b22] border-gray-700'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className={`flex-grow justify-between items-center ${mobileSearchVisible ? 'hidden' : 'flex'} sm:flex`}>
          <div
            onClick={() => navigate('#')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="w-9 h-9 object-contain rounded-md" />
            ) : (
                <GithubIcon className={`w-9 h-9 transition-colors duration-300 ${settings.theme === 'light' ? 'text-gray-800' : 'text-white'}`} />
            )}
            
            <div className="flex flex-col">
                <h1 className={`text-xl font-bold tracking-wider transition-colors duration-300 hidden sm:block ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {settings.siteName}
                </h1>
                {lastUpdated && (
                    <span className={`text-[10px] hidden sm:block ${settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t('lastUpdated', { time: lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
                    </span>
                )}
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-3">
            {settings.isSearchEnabled && (
              <>
                <div className="hidden sm:block w-48 lg:w-64 h-10">
                    <SearchBar 
                        inputValue={inputValue}
                        onInputChange={(e) => setInputValue(e.target.value)}
                        onSearchSubmit={handleSearchSubmit}
                        onClearSearch={handleClearSearch}
                        theme={settings.theme}
                        placeholder={t('searchPlaceholder')}
                    />
                </div>
                <button
                    onClick={() => setMobileSearchVisible(true)}
                    className={`p-2 h-10 w-10 flex items-center justify-center rounded-lg sm:hidden ${settings.theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`}
                >
                    <SearchIcon className="w-6 h-6" />
                </button>
              </>
            )}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`flex items-center h-10 px-4 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              ${settings.theme === 'light' 
                ? 'bg-transparent hover:bg-gray-200 disabled:bg-gray-100 text-gray-800 disabled:text-gray-400' 
                : 'bg-transparent hover:bg-gray-700 disabled:bg-gray-800 text-white disabled:cursor-not-allowed'
              }`}
            >
              <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="ml-2 hidden sm:inline">{isLoading ? t('refreshing') : t('refresh')}</span>
            </button>
            <LanguageSwitcher />
            <div id="google_translate_element"></div>
             <button
              onClick={() => navigate('#/help')}
              title={t('helpCenter')}
              className={`p-2 h-10 w-10 flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${settings.theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`}
            >
              <QuestionMarkCircleIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('#/admin')}
              title={t('adminDashboard')}
              className={`p-2 h-10 w-10 flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${settings.theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`}
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {settings.isSearchEnabled && (
          <div className={`w-full items-center gap-x-2 ${mobileSearchVisible ? 'flex' : 'hidden'} sm:hidden`}>
            <div className="flex-grow h-10">
               <SearchBar 
                  inputValue={inputValue}
                  onInputChange={(e) => setInputValue(e.target.value)}
                  onSearchSubmit={handleSearchSubmit}
                  onClearSearch={handleClearSearch}
                  theme={settings.theme}
                  placeholder={t('searchPlaceholder')}
              />
            </div>
            <button
              onClick={() => setMobileSearchVisible(false)}
              className="p-2 h-10 w-10 flex items-center justify-center rounded-lg"
              aria-label="Close search"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
