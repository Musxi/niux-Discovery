
import React from 'react';

interface HighlighterProps {
  // 原始文本
  text: string;
  // 需要高亮的关键词
  highlight: string;
}

/**
 * 一个简单的高亮组件。
 * 它会在给定的文本中查找并高亮显示指定的关键词。
 */
const Highlighter: React.FC<HighlighterProps> = ({ text, highlight }) => {
  // 如果没有高亮词或文本，直接返回原始文本
  if (!highlight.trim() || !text) {
    return <>{text}</>;
  }
  
  // 对高亮词中的正则表达式特殊字符进行转义，以安全地创建正则表达式
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 创建一个不区分大小写的全局正则表达式
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  // 使用正则表达式将文本分割成包含高亮词和非高亮词的数组
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        // 如果部分与高亮词匹配（不区分大小写），则用一个带样式的 span 包裹它
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-400 text-black px-0.5 rounded-sm">
            {part}
          </span>
        ) : (
          // 否则直接渲染该部分
          part
        )
      )}
    </span>
  );
};

export default Highlighter;
