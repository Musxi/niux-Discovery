
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
        <SearchIcon className={`h-4 w-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={inputValue}
        onChange={onInputChange}
        className={`block w-full rounded-xl border-0 h-full pl-9 pr-8 transition-all duration-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm ${
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
        >
          <XMarkIcon className={`h-4 w-4 transition-colors ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-200'}`} />
        </button>
      )}
    </form>
  );
};


interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  isScouting?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, isScouting }) => {
  const { settings } = useSettings();
  const { t } = useI18n();
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const navigate = (hash: string) => { window.location.hash = hash; };

  return (
    <header className={`border-b sticky top-0 z-20 backdrop-blur-xl transition-all duration-300 ${settings.theme === 'light' ? 'bg-white/80 border-gray-200' : 'bg-[#161b22]/80 border-gray-700'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className={`flex-grow justify-between items-center ${mobileSearchVisible ? 'hidden' : 'flex'} sm:flex`}>
          <div onClick={() => navigate('#')} className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="w-9 h-9 object-contain rounded-xl" />
              ) : (
                <div className={`p-2 rounded-xl transition-colors ${settings.theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-white'}`}>
                  <GithubIcon className="w-5 h-5" />
                </div>
              )}
              {isScouting && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
            </div>
            
            <div className="flex flex-col">
              <h1 className={`text-lg font-black tracking-tighter transition-colors ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {settings.siteName}
              </h1>
              {isScouting && <span className="text-[10px] text-green-500 font-bold leading-none animate-pulse">AI SCOUTING...</span>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {settings.isSearchEnabled && (
              <div className="hidden sm:block w-48 lg:w-72 h-9">
                <SearchBar 
                  inputValue={inputValue}
                  onInputChange={(e) => setInputValue(e.target.value)}
                  onSearchSubmit={(e) => { e.preventDefault(); if (inputValue.trim()) navigate(`#/search?q=${encodeURIComponent(inputValue.trim())}`); }}
                  onClearSearch={() => { setInputValue(''); if (window.location.hash.startsWith('#/search')) navigate('#'); }}
                  theme={settings.theme}
                  placeholder={t('searchPlaceholder')}
                />
              </div>
            )}
            
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2 rounded-xl transition-all active:scale-90 ${settings.theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-800 text-gray-300'}`}
              title={t('refresh')}
            >
              <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <LanguageSwitcher />
            <button
              onClick={() => navigate('#/help')}
              className={`p-2 rounded-xl transition-all active:scale-90 ${settings.theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('#/admin')}
              className={`p-2 rounded-xl transition-all active:scale-90 ${settings.theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
