
import { GitHubRepo } from '../types';

// GitHub API 的基础 URL
const GITHUB_API_URL = 'https://api.github.com';

/**
 * 获取一周前的日期，格式为 YYYY-MM-DD。
 * 用于构建 GitHub API 的搜索查询。
 * @returns {string} 格式化后的日期字符串。
 */
const getOneWeekAgoDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 从 GitHub API 获取过去一周内创建的、按星标数排序的最热门项目。
 * 支持分页。
 * @param {number} page - 要获取的页码，默认为 1。
 * @param {number} perPage - 每页的项目数量，默认为 24。
 * @param {string} token - 可选的 GitHub Access Token，用于提高 API 限额。
 * @returns {Promise<{ repos: GitHubRepo[], hasMore: boolean }>} 返回项目数组和是否还有更多页的标志。
 */
export const fetchLatestProjects = async (page: number = 1, perPage: number = 24, token?: string): Promise<{ repos: GitHubRepo[], hasMore: boolean }> => {
  const oneWeekAgo = getOneWeekAgoDate();
  // 构建查询字符串：创建时间在一周内
  const query = `created:>${oneWeekAgo}`;
  const url = `${GITHUB_API_URL}/search/repositories?q=${encodeURIComponent(
    query
  )}&sort=stars&order=desc&per_page=${perPage}&page=${page}`;

  const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
  };

  if (token && token.trim() !== '') {
      headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    if (response.status === 403) {
        throw new Error(`GitHub API Rate Limit Exceeded. Please configure a GitHub Token in settings.`);
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  // 判断是否还有更多数据
  const hasMore = (page * perPage) < data.total_count;
  
  return { repos: data.items, hasMore };
};

/**
 * 根据仓库全名（如 "facebook/react"）获取其 README.md 文件的原始内容。
 * @param {string} repoFullName - 仓库的全名。
 * @param {string} token - 可选的 GitHub Access Token。
 * @returns {Promise<string | null>} 返回 README 的文本内容，如果找不到或发生错误则返回 null。
 */
export const fetchReadme = async (repoFullName: string, token?: string): Promise<string | null> => {
  const url = `${GITHUB_API_URL}/repos/${repoFullName}/readme`;

  const headers: HeadersInit = {
    // 使用 'application/vnd.github.v3.raw' 可以直接获取解码后的原始内容，避免处理 base64
    'Accept': 'application/vnd.github.v3.raw',
  };

  if (token && token.trim() !== '') {
      headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`README not found for ${repoFullName}`);
        return null; // 仓库没有 README 是正常情况
      }
      throw new Error(`Failed to fetch README for ${repoFullName}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error(`Error fetching README for ${repoFullName}:`, error);
    return null;
  }
};
