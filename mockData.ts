import { ProcessedRepo } from './types';

/**
 * 这是一个模拟项目数据数组。
 * 主要用于以下场景：
 * 1. 在开发和调试阶段，无需频繁请求 API。
 * 2. 当用户没有配置 Gemini API 密钥时，提供一些示例内容进行展示。
 */
export const mockProjects: ProcessedRepo[] = [
  {
    id: 1,
    name: 'shadcn-ui',
    full_name: 'shadcn/ui',
    owner: { login: 'shadcn', avatar_url: 'https://avatars.githubusercontent.com/u/124599?v=4' },
    html_url: 'https://github.com/shadcn/ui',
    description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    stargazers_count: 98765,
    forks_count: 4321,
    language: 'TypeScript',
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    rank: 1,
    imageUrl: 'https://shadcn.com/_next/image?url=%2Fopengraph-image.png&w=1200&q=75',
    readmeContent: '# shadcn/ui\n\nThis is NOT a component library. It\'s a collection of re-usable components that you can copy and paste into your apps.\n\n- Radix UI Primitives\n- Tailwind CSS\n- Accessibility First',
    sourceType: 'github',
    aiSummary: {
      catchyTitle: '告别轮子！复制粘贴即可拥有顶级 UI 组件库',
      category: '前端',
      introduction: '一个可组合、可访问的组件集合，让你能直接复制粘贴到你的应用中，快速构建精美的用户界面。',
      coreFeatures: [
        '无需安装依赖，直接复制使用',
        '基于 Radix UI 和 Tailwind CSS 构建，高度可定制',
        '完全开源，社区驱动'
      ],
      techStack: 'TypeScript, React, Radix UI, Tailwind CSS'
    },
    collectedAt: new Date().toISOString(),
    modificationHistory: [],
  },
  {
    id: 2,
    name: 'lobe-chat',
    full_name: 'lobehub/lobe-chat',
    owner: { login: 'lobehub', avatar_url: 'https://avatars.githubusercontent.com/u/101736830?v=4' },
    html_url: 'https://github.com/lobehub/lobe-chat',
    description: 'An open-source, extensible (Function Calling), high-performance chatbot framework. It supports one-click free deployment of your private ChatGPT/LLM web application.',
    stargazers_count: 75321,
    forks_count: 8765,
    language: 'TypeScript',
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    rank: 2,
    imageUrl: 'https://raw.githubusercontent.com/lobehub/lobe-chat/main/public/images/og/cover.png',
    readmeContent: '## Lobe Chat\n\n**🤖 Lobe Chat** is an open-source, extensible (Function Calling), high-performance chatbot framework. It supports one-click free deployment of your private ChatGPT/LLM web application.\n\n- Supports multiple LLM providers\n- Plugin ecosystem\n- High performance and beautiful UI',
    sourceType: 'github',
    aiSummary: {
      catchyTitle: '一键部署私有 ChatGPT！你的专属 AI 聊天应用',
      category: '人工智能',
      introduction: '一个开源、高性能的聊天机器人框架，支持一键免费部署私有的 AI 聊天应用，并可通过插件系统无限扩展。',
      coreFeatures: [
        '支持 OpenAI, Anthropic, Google Gemini 等多种大语言模型',
        '强大的插件系统，支持函数调用和自定义工具',
        '精美的 UI 设计和流畅的用户体验'
      ],
      techStack: 'TypeScript, Next.js, Zustand, Ant Design'
    },
    collectedAt: new Date().toISOString(),
    modificationHistory: [],
  },
  {
    id: 3,
    name: 'lazygit',
    full_name: 'jesseduffield/lazygit',
    owner: { login: 'jesseduffield', avatar_url: 'https://avatars.githubusercontent.com/u/843277?v=4' },
    html_url: 'https://github.com/jesseduffield/lazygit',
    description: 'A simple terminal UI for git commands.',
    stargazers_count: 45678,
    forks_count: 1234,
    language: 'Go',
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    rank: 3,
    imageUrl: 'https://raw.githubusercontent.com/jesseduffield/lazygit/master/docs/resources/lazygit_demo.gif',
    readmeContent: '# Lazygit\n\nA simple terminal UI for git commands.\n\n- Stage and commit changes easily\n- Interactive rebase\n- View commit history and diffs',
    sourceType: 'github',
    aiSummary: {
      catchyTitle: 'Git 命令恐惧症？这款终端神器让你爱上版本控制',
      category: '命令行工具',
      introduction: '一个为 Git 命令打造的简单终端界面，让你无需记住复杂命令，即可轻松完成提交、变基、查看历史等所有操作。',
      coreFeatures: [
        '全键盘操作，无需鼠标，效率极高',
        '交互式的 rebase 流程，解决冲突更直观',
        '清晰展示提交历史、文件差异和分支图'
      ],
      techStack: 'Go, Gocui'
    },
    collectedAt: new Date().toISOString(),
    modificationHistory: [],
  },
  {
    id: 4,
    name: 'appwrite',
    full_name: 'appwrite/appwrite',
    owner: { login: 'appwrite', avatar_url: 'https://avatars.githubusercontent.com/u/25229648?v=4' },
    html_url: 'https://github.com/appwrite/appwrite',
    description: 'A backend platform for building Web, Mobile, and Flutter applications. Appwrite provides developers with all the core APIs needed to build any application.',
    stargazers_count: 67890,
    forks_count: 5432,
    language: 'PHP',
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    rank: 4,
    imageUrl: 'https://raw.githubusercontent.com/appwrite/appwrite/master/public/images/open-graph.png',
    readmeContent: '# Appwrite\n\nAppwrite is a secure open-source backend server for web, mobile, and flutter developers that is packaged as a set of Docker containers for easy deployment.\n\n- Authentication\n- Databases\n- Storage\n- Functions',
    sourceType: 'github',
    aiSummary: {
      catchyTitle: '后端开发太复杂？Appwrite 让你几分钟搞定一切',
      category: '后端',
      introduction: '一个开源的后端即服务（BaaS）平台，为 Web、移动和 Flutter 开发者提供认证、数据库、存储和云函数等所有核心 API。',
      coreFeatures: [
        '一键式 Docker 部署，快速启动',
        '提供多种认证方式，如邮箱、OAuth2 和匿名登录',
        '内置实时数据库和文件存储服务'
      ],
      techStack: 'PHP, Docker, MariaDB, Redis'
    },
    collectedAt: new Date().toISOString(),
    modificationHistory: [],
  }
];
