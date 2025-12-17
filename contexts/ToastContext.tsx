
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType } from '../types';

// 定义 Toast Context 的类型
interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, options?: { type?: ToastType; duration?: number }) => void;
  removeToast: (id: string) => void;
}

// 创建 Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * ToastProvider 组件，用于向其子组件提供全局的 toast 通知功能。
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 状态：存储当前所有活动的 toast 消息
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 移除一个 toast 消息（通常在动画结束后或用户点击关闭时调用）
  const removeToast = useCallback((id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  // 添加一个新的 toast 消息
  const addToast = useCallback((message: string, options: { type?: ToastType; duration?: number } = {}) => {
    const { type = 'info', duration = 5000 } = options;
    // 为每个 toast 生成一个唯一的 ID
    const id = `toast-${Date.now()}-${Math.random()}`;
    
    const newToast: ToastMessage = { id, message, type, duration };
    // 将新 toast 添加到数组末尾
    setToasts(currentToasts => [...currentToasts, newToast]);

    // 如果设置了持续时间，则在超时后自动移除 toast
    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * 自定义 Hook，用于在组件中方便地访问 Toast Context 的功能。
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
