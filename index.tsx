import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { I18nProvider } from './contexts/I18nContext';

// 获取用于挂载 React 应用的根 DOM 元素
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 使用 ReactDOM.createRoot 创建一个新的 React 根，这是 React 18+ 的推荐方式
const root = ReactDOM.createRoot(rootElement);
// 渲染主应用组件 <App />
// <React.StrictMode> 是一个辅助组件，用于识别应用中潜在的问题
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <I18nProvider>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </I18nProvider>
    </SettingsProvider>
  </React.StrictMode>
);