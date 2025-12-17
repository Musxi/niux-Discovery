
import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './icons';
import { useSettings } from '../contexts/SettingsContext';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSettings();

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        settings.theme === 'light'
          ? 'bg-blue-600 text-white hover:bg-blue-700 ring-blue-500'
          : 'bg-blue-600 text-white hover:bg-blue-500 ring-blue-400'
      }`}
      aria-label="Back to top"
    >
      <ArrowUpIcon className="w-6 h-6" />
    </button>
  );
};

export default BackToTop;
