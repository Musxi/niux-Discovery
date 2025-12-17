
import React from 'react';
import { ToastMessage } from '../types';
import { useToast } from '../contexts/ToastContext';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from './icons';

// 为不同类型的 toast 定义配置（图标、颜色等）
const toastConfig = {
    success: {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        barClass: 'bg-green-500',
        textClass: 'text-gray-800 dark:text-gray-100',
    },
    error: {
        icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
        barClass: 'bg-red-500',
        textClass: 'text-gray-800 dark:text-gray-100',
    },
    info: {
        icon: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
        barClass: 'bg-blue-500',
        textClass: 'text-gray-800 dark:text-gray-100',
    },
    warning: {
        icon: <InformationCircleIcon className="w-6 h-6 text-yellow-500" />,
        barClass: 'bg-yellow-500',
        textClass: 'text-gray-800 dark:text-gray-100',
    },
};

/**
 * 单个 Toast 通知组件。
 * 负责渲染一条具体的通知消息。
 */
const Toast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
    const { removeToast } = useToast();
    // 根据 toast 类型获取对应的样式配置
    const config = toastConfig[toast.type];

    return (
        // `animate-toast-in` 应用一个自定义的入场动画
        <div className="animate-toast-in max-w-sm w-full bg-white dark:bg-[#161b22] shadow-lg rounded-lg pointer-events-auto ring-1 ring-black dark:ring-gray-700 ring-opacity-5 overflow-hidden">
            <div className="relative">
                {/* 左侧的彩色状态条 */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${config.barClass}`}></div>
                <div className="p-4 pl-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">{config.icon}</div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className={`text-sm font-medium ${config.textClass}`}>
                                {toast.message}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;
