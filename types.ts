
/**
 * API 密钥条目的结构。
 */
export type AiProvider = 'gemini' | 'openai';

export interface ApiKeyEntry {
  /** 唯一标识符。 */
  id: string;
  /** 用户为密钥指定的名称。 */
  name: string;
  /** API 密钥值。 */
  key: string;
  /** AI 提供商类型 */
  provider: AiProvider;
  /** 自定义 API 基础地址 (仅用于 OpenAI 兼容模式) */
  baseUrl?: string;
  /** 该密钥对应的默认模型 (例如: gemini-2.5-flash 或 deepseek-chat) */
  defaultModel?: string;
  /** 密钥的验证状态。 */
  status: 'valid' | 'invalid' | 'unchecked';
  /** 上次验证密钥的时间。 */
  lastChecked: string | null;
}


/**
 * AI 生成的项目摘要内容结构。
 */
export interface AISummary {
  /** 吸引人的、类似自媒体风格的中文标题。 */
  catchyTitle: string;
  /** 项目所属的技术分类。 */
  category: string;
  /** 对项目的一到两句话的生动介绍。 */
  introduction: string;
  /** 2-3 个核心功能亮点的字符串数组。 */
  coreFeatures: string[];
  /** 项目使用的主要技术栈或编程语言。 */
  techStack: string;
}

/**
 * 从 GitHub API 获取的原始仓库数据结构。
 */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics?: string[]; // Add topics support
  updated_at: string;
}

/**
 * 项目摘要的修改历史版本。
 */
export interface SummaryVersion {
  /** 历史版本的摘要内容。 */
  summary: AISummary;
  /** 该版本的修改时间。 */
  modifiedAt: string;
}

/**
 * 经过应用处理后的 GitHub 仓库数据结构，包含了 AI 摘要等额外信息。
 */
export interface ProcessedRepo extends GitHubRepo {
  /** 类型区分符，用于区分不同来源的内容。 */
  sourceType: 'github';
  /** AI 生成的项目摘要。 */
  aiSummary: AISummary;
  /** 项目在列表中的排名。 */
  rank: number;
  /** 从 README 中提取的预览图片 URL (可选)。 */
  imageUrl?: string;
  /** 项目的 README.md 文件原始内容 (可能为 null)。 */
  readmeContent: string | null;
  /** 本应用采集该项目的时间。 */
  collectedAt: string;
  /** 用户对 AI 摘要的修改历史记录。 */
  modificationHistory: SummaryVersion[];
}

/**
 * 自定义内容抓取插件的结构。
 */
export interface ScraperPlugin {
  /** 插件的唯一标识符。 */
  id: string;
  /** 插件类型：'builtin' 为内置，'custom' 为用户自定义。 */
  type: 'builtin' | 'custom';
  /** 插件名称。 */
  name: string;
  /** 插件的描述信息。 */
  description: string;
  /** (自定义插件) 目标抓取网址。 */
  url?: string;
  /** (自定义插件) 给 AI 的抓取和总结指令。 */
  instruction?: string;
  /** 插件创建时间。 */
  createdAt: string;
  /** (可选) 该插件专属的 Gemini API 密钥，会覆盖全局设置。 */
  apiKey?: string;
  /** (可选) 插件专属的提供商 */
  provider?: AiProvider;
  /** (可选) 插件专属的 Base URL */
  baseUrl?: string;
  /** (可选) 该插件专属的 AI 模型，会覆盖全局设置。 */
  model?: string;
}

/**
 * 通过自定义插件抓取并生成的内容项。
 */
export interface CustomContentItem {
  /** 内容项的唯一标识符。 */
  id: string;
  /** 类型区分符。 */
  sourceType: 'custom';
  /** 内容的原始来源 URL。 */
  originalUrl: string;
  /** AI 生成的内容摘要。 */
  aiSummary: AISummary;
  /** 内容的创建时间。 */
  createdAt: string;
}

/**
 * 用于在 UI 中统一展示的条目类型，可以是处理过的 GitHub 项目或自定义内容。
 */
export type DisplayItem = ProcessedRepo | CustomContentItem;

/**
 * 当 AI 摘要生成失败或未配置 Key 时，使用原始 GitHub 数据生成回退内容。
 * @param repo - 可选的 GitHub 原始数据
 * @returns - 返回一个 AISummary 对象
 */
export const getFallbackSummary = (repo?: GitHubRepo): AISummary => {
  if (repo) {
    return {
      catchyTitle: repo.name, // 使用仓库名作为标题
      category: repo.language || "GitHub", // 使用语言作为分类
      introduction: repo.description || "暂无描述 (No description provided)", // 使用原始描述
      coreFeatures: repo.topics && repo.topics.length > 0 
        ? repo.topics.slice(0, 3) // 使用 GitHub Topics 作为特性
        : ["View source code for details"],
      techStack: repo.language || "Unknown",
    };
  }
  
  return {
    catchyTitle: "AI 摘要生成失败",
    category: "未知",
    introduction: "无法加载此项目的 AI 生成介绍。请稍后刷新重试。",
    coreFeatures: ["内容分析时出现错误。"],
    techStack: "未知",
  };
};


/**
 * Toast 通知的类型定义。
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast 通知消息的结构。
 */
export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
