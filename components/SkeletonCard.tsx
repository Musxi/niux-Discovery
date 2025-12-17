
import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

/**
 * 骨架屏卡片组件 (Skeleton Card)。
 * 在真实数据加载完成前，显示一个与真实卡片结构相似的占位符。
 * 这可以改善用户体验，减少感知加载时间。
 */
const SkeletonCard: React.FC = () => {
    const { settings } = useSettings();
    // 根据主题设置不同的背景和脉冲动画颜色
    const cardBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
    const pulseBg = settings.theme === 'light' ? 'bg-gray-200' : 'bg-gray-700';

  return (
    <div className={`border rounded-lg shadow-lg overflow-hidden ${cardBg} ${settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
      <div className="animate-pulse flex flex-col h-full">
        {/* 图片占位符 */}
        <div className={`h-48 w-full ${pulseBg}`}></div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-3">
            {/* 标题占位符 */}
            <div className={`h-5 w-3/5 rounded ${pulseBg}`}></div>
            {/* 分类标签占位符 */}
            <div className={`h-6 w-16 rounded-full ${pulseBg}`}></div>
          </div>
          
          {/* AI 标题占位符 */}
          <div className={`h-4 w-4/5 rounded mb-4 ${pulseBg}`}></div>

          {/* 简介占位符 */}
          <div className="space-y-2 flex-grow">
            <div className={`h-3 w-full rounded ${pulseBg}`}></div>
            <div className={`h-3 w-full rounded ${pulseBg}`}></div>
            <div className={`h-3 w-3/4 rounded ${pulseBg}`}></div>
          </div>
          
           {/* 日期占位符 */}
          <div className={`h-3 w-1/2 rounded mt-4 ${pulseBg}`}></div>
        </div>

        {/* 底部占位符 */}
        <div className={`p-5 mt-auto border-t ${settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
           <div className="flex items-center justify-between">
                {/* 统计数据占位符 */}
                <div className="flex items-center space-x-4 w-3/5">
                    <div className={`h-4 w-1/3 rounded ${pulseBg}`}></div>
                    <div className={`h-4 w-1/3 rounded ${pulseBg}`}></div>
                    <div className={`h-4 w-1/3 rounded ${pulseBg}`}></div>
                </div>
                 {/* 详情链接占位符 */}
                <div className={`h-4 w-1/4 rounded ${pulseBg}`}></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
