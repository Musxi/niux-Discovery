
import { GitHubRepo } from '../types';

const GITHUB_API_URL = 'https://api.github.com';

const getOneWeekAgoDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const extractFirstImage = (content: string | null): string | undefined => {
  if (!content) return undefined;
  const mdImgRegex = /!\[.*?\]\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif|webp|svg|bmp).*?)\)/i;
  const htmlImgRegex = /<img.*?src=["'](https?:\/\/.*?\.(?:png|jpg|jpeg|gif|webp|svg|bmp).*?)["']/i;
  const mdMatch = content.match(mdImgRegex);
  if (mdMatch) return mdMatch[1];
  const htmlMatch = content.match(htmlImgRegex);
  if (htmlMatch) return htmlMatch[1];
  return undefined;
};

export const fetchLatestProjects = async (page: number = 1, perPage: number = 10, token?: string): Promise<{ repos: GitHubRepo[], hasMore: boolean }> => {
  const oneWeekAgo = getOneWeekAgoDate();
  // 增加语言过滤或者更精准的搜索词可以降低结果总量，提高质量
  const query = `created:>${oneWeekAgo}`;
  const url = `${GITHUB_API_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}&page=${page}`;

  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
  if (token?.trim()) headers['Authorization'] = `token ${token}`;

  const response = await fetch(url, { headers });
  
  if (response.status === 403) {
      // 检查是否是由于限流引起的
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      if (rateLimitRemaining === '0') throw new Error('LIMIT_EXCEEDED');
  }

  if (!response.ok) {
    throw new Error(`GitHub error: ${response.statusText}`);
  }

  const data = await response.json();
  return { repos: data.items || [], hasMore: (page * perPage) < (data.total_count || 0) };
};

export const fetchReadme = async (repoFullName: string, token?: string): Promise<string | null> => {
  const url = `${GITHUB_API_URL}/repos/${repoFullName}/readme`;
  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3.raw' };
  if (token?.trim()) headers['Authorization'] = `token ${token}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
};
