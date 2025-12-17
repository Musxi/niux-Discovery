import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { FlagCNIcon, FlagUSIcon, ChevronDownIcon } from './icons';
import { useI18n } from '../contexts/I18nContext';

const LanguageSwitcher: React.FC = () => {
  const { settings, saveSettings } = useSettings();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // State for the currently selected language in the UI
  const [currentLang, setCurrentLang] = useState<'zh-CN' | 'en'>('zh-CN');

  // Effect to initialize and sync language state from Google's cookie on mount.
  // This ensures the flag icon is correct after a page reload.
  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
      if (match) return match[2];
      return null;
    };

    const cookieValue = getCookie('googtrans');
    if (cookieValue && cookieValue.endsWith('/en')) {
      setCurrentLang('en');
    } else {
      setCurrentLang('zh-CN');
    }
  }, []);

  const languageOptions = {
    'zh-CN': { name: '中文', icon: <FlagCNIcon className="w-5 h-5 rounded-sm" /> },
    'en': { name: 'English', icon: <FlagUSIcon className="w-5 h-5 rounded-sm" /> },
  };

  const handleLanguageChange = (lang: 'zh-CN' | 'en') => {
    setIsOpen(false);
    if (currentLang === lang) {
      return; // Do nothing if language is already selected
    }

    // Save language to global settings to persist preference for AI generation
    saveSettings({ language: lang });

    // --- Method 1: Direct DOM Manipulation (for instant translation without reload) ---
    const googleTranslateSelect = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null;
    
    if (googleTranslateSelect) {
      googleTranslateSelect.value = lang;
      googleTranslateSelect.dispatchEvent(new Event('change'));
    } else {
        // Fallback if the select element is not found
        console.warn("Google Translate dropdown not found. Falling back to cookie and reload method.");
        document.cookie = `googtrans=/auto/${lang}; path=/`;
        window.location.reload();
        return;
    }

    // --- Method 2: Set cookie for persistence on next page load/visit ---
    // If we're switching back to the original language, we should clear the cookie
    // to prevent re-translation on the next visit.
    if (lang === 'zh-CN') {
        document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } else {
        document.cookie = `googtrans=/auto/${lang}; path=/`;
    }

    // Update our component's state to show the correct flag
    setCurrentLang(lang);
  };

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonClass = `flex items-center space-x-1 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${settings.theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`;
  const dropdownBg = settings.theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1e242c] border-gray-700';

  return (
    <div className="relative" ref={wrapperRef}>
      <button onClick={() => setIsOpen(!isOpen)} title={t('changeLanguage')} className={`${buttonClass} h-10`}>
        <div className="w-6 h-6 flex items-center justify-center">
            {React.cloneElement(languageOptions[currentLang].icon, { className: "w-6 h-6 rounded-sm" })}
        </div>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div 
            className={`absolute right-0 mt-2 w-40 origin-top-right rounded-md shadow-lg border ring-1 ring-black ring-opacity-5 focus:outline-none z-30 ${dropdownBg}`} 
            role="menu" 
            aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {Object.entries(languageOptions).map(([langCode, { name, icon }]) => (
              <button
                key={langCode}
                onClick={() => handleLanguageChange(langCode as 'zh-CN' | 'en')}
                className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors duration-150 ${settings.theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-200 hover:bg-gray-800'}`}
                role="menuitem"
              >
                  {icon}
                  <span className="ml-3">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;