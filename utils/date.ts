/**
 * 将 ISO 格式的日期字符串转换为“多久以前”的相对时间描述。
 * @param dateString - 一个有效的日期字符串（如 ISO 8601 格式）。
 * @param t - i18n 翻译函数。
 * @returns - 返回一个相对时间字符串，例如“5 天前”。
 */
export const timeAgo = (dateString: string, t: (key: string, options?: { [key: string]: string | number }) => string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000; // 年
  if (interval > 1) {
    return t('timeAgo.years', { count: Math.floor(interval) });
  }
  interval = seconds / 2592000; // 月
  if (interval > 1) {
    return t('timeAgo.months', { count: Math.floor(interval) });
  }
  interval = seconds / 86400; // 天
  if (interval > 1) {
    return t('timeAgo.days', { count: Math.floor(interval) });
  }
  interval = seconds / 3600; // 小时
  if (interval > 1) {
    return t('timeAgo.hours', { count: Math.floor(interval) });
  }
  interval = seconds / 60; // 分钟
  if (interval > 1) {
    return t('timeAgo.minutes', { count: Math.floor(interval) });
  }
  return t('timeAgo.justNow');
};
