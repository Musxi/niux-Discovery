
import React from 'react';
import { useToast } from '../contexts/ToastContext';
import Toast from './Toast';

/**
 * Toast 容器组件。
 * 负责在屏幕的固定位置（通常是右上角）渲染所有当前活动的 Toast 通知。
 */
const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div
      aria-live="assertive" // 辅助功能属性，通知屏幕阅读器内容有更新
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {/* 遍历并渲染所有 toast 消息 */}
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
