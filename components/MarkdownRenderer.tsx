
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * 一个非常基础的 Markdown 到 HTML 的渲染器。
 * 注意：这个实现是基于正则表达式的，仅支持有限的 Markdown 语法。
 * 它不是一个功能完备的 Markdown 解析器，仅用于本项目中的简单展示。
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // 将 Markdown 字符串转换为 HTML 字符串的函数
  const toHtml = (markdown: string) => {
    let html = markdown
      // 标题 (h1, h2, h3)
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 引用块
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      // 图片，并添加样式
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' style='max-width:100%; border-radius: 8px; margin-top: 1rem; margin-bottom: 1rem;' />")
      // 链接
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' rel='noopener noreferrer'>$1</a>")
      // 加粗和斜体
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // 代码块
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
      // 行内代码
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
       // 无序列表
      .replace(/^\s*[-*] (.*)/gim, '<li>$1</li>')
      .replace(/<\/li>\n<li>/gim, '</li><li>') // 修复列表项之间的换行
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      // 段落和换行
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      // 清理空的 p 标签
      .replace(/<p><\/p>/g, '');

      // 用 p 标签包裹整个内容，以处理没有双换行的文本
      return `<p>${html}</p>`;
  };

  const processedHtml = toHtml(content);

  return (
    <div
      className="markdown-body"
      // 使用 dangerouslySetInnerHTML 来渲染 HTML 字符串
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
};

export default MarkdownRenderer;
