import React from 'react';
import { ProcessedRepo } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { PencilIcon, TrashIcon } from './icons';

interface AdminProps {
  projects: ProcessedRepo[];
  onEdit: (project: ProcessedRepo) => void;
  onDelete: (projectId: number) => void;
}

/**
 * 管理页面组件。
 * 注意：此组件可能是一个旧版本，已被 `AdminDashboard` 及其子组件取代，
 * 提供一个简单的表格来管理已发现的项目。
 */
const Admin: React.FC<AdminProps> = ({ projects, onEdit, onDelete }) => {
  const { settings } = useSettings();

  // 根据主题动态设置样式
  const cardBg = settings.theme === 'light' ? 'bg-white' : 'bg-[#161b22]';
  const headerBg = settings.theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50';
  const textColor = settings.theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const mutedTextColor = settings.theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const borderColor = settings.theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  // 导航回主页
  const navigateToHome = () => {
    window.location.hash = '#';
  };

  return (
    <div className={`p-6 md:p-8 rounded-lg border shadow-lg transition-colors duration-300 ${cardBg} ${borderColor}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className={`text-2xl font-bold ${textColor}`}>内容管理</h1>
            <p className={`mt-1 text-sm ${mutedTextColor}`}>
            在这里编辑或删除已发现的项目。
            </p>
        </div>
        <button
            onClick={navigateToHome}
            className="text-sm text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
            &larr; 返回主页
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full align-middle">
          <div className={`border rounded-lg overflow-hidden ${borderColor}`}>
            <table className={`min-w-full divide-y ${borderColor}`}>
              <thead className={`${headerBg}`}>
                <tr>
                  <th scope="col" className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${textColor} sm:pl-6`}>项目名称</th>
                  <th scope="col" className={`px-3 py-3.5 text-left text-sm font-semibold ${textColor}`}>分类</th>
                  <th scope="col" className={`px-3 py-3.5 text-left text-sm font-semibold ${textColor}`}>采集时间</th>
                  <th scope="col" className={`relative py-3.5 pl-3 pr-4 sm:pr-6`}>
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${borderColor}`}>
                {/* 按照采集时间倒序排列项目 */}
                {[...projects].sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()).map((project) => (
                  <tr key={project.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className={`py-4 pl-4 pr-3 text-sm sm:pl-6`}>
                        <div className={`font-medium ${textColor}`}>{project.full_name}</div>
                        <div className={`mt-1 ${mutedTextColor} max-w-xs truncate`} title={project.aiSummary.catchyTitle}>{project.aiSummary.catchyTitle}</div>
                    </td>
                    <td className={`whitespace-nowrap px-3 py-4 text-sm ${mutedTextColor}`}>{project.aiSummary.category}</td>
                    <td className={`whitespace-nowrap px-3 py-4 text-sm ${mutedTextColor}`}>{new Date(project.collectedAt).toLocaleString()}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end space-x-3">
                        <button onClick={() => onEdit(project)} title="编辑" className="p-1.5 rounded-md text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition-colors">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(project.id)} title="删除" className="p-1.5 rounded-md text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {projects.length === 0 && (
            <div className="text-center py-10">
                <p className={`${mutedTextColor}`}>暂无项目数据。</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
