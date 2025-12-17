
import React from 'react';

/**
 * 一个简单的加载中动画组件（Spinner）。
 * 用于在数据获取期间向用户提供视觉反馈。
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
