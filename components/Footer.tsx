import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

/**
 * 网站的页脚组件。
 * 显示版权信息等内容，文本内容从全局设置中获取。
 */
const Footer: React.FC = () => {
  const { settings } = useSettings();
  
  const footerText = settings.footerText;

  return (
    <footer className={`py-8 text-center transition-colors duration-300 ${
      settings.theme === 'light' 
        ? 'text-gray-500 bg-gray-100' 
        : 'text-gray-500 bg-gray-900'
    }`}>
      <div className="container mx-auto px-4">
        <p className="text-sm">{footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;
