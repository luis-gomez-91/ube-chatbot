// hooks/useChatTheme.ts
import { useState, useEffect } from 'react';
import { UseChatThemeResult, ThemeClasses } from '../types/chat';

const getThemeClasses = (isDarkMode: boolean): ThemeClasses => ({
    sidebar: isDarkMode 
      ? 'bg-slate-900 border-slate-700'
      : 'bg-slate-50 border-slate-200',
    mainArea: isDarkMode
      ? 'bg-slate-800'
      : 'bg-white',
    sidebarText: isDarkMode
      ? 'text-slate-100'
      : 'text-slate-900',
    sidebarSecondary: isDarkMode
      ? 'text-slate-400'
      : 'text-slate-600',
    themeButton: isDarkMode
      ? 'hover:bg-slate-800 text-slate-300 hover:text-slate-100'
      : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900',
    messageContainer: isDarkMode
      ? 'hover:bg-slate-700/50'
      : 'hover:bg-slate-50',
    userMessage: isDarkMode
      ? 'bg-slate-600 text-slate-100'
      : 'bg-slate-200 text-slate-900',
    botMessage: isDarkMode
      ? 'text-slate-100'
      : 'text-slate-900',
    inputArea: isDarkMode
      ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500',
    sendButton: isDarkMode
      ? 'bg-slate-600 hover:bg-slate-500 text-slate-100'
      : 'bg-slate-600 hover:bg-slate-700 text-white',
    markdown: {
      code: isDarkMode
        ? 'bg-slate-700 text-slate-100'
        : 'bg-slate-200 text-slate-800',
      pre: isDarkMode
        ? 'bg-slate-700 text-slate-100'
        : 'bg-slate-200 text-slate-800',
      strong: isDarkMode
        ? 'text-slate-50'
        : 'text-slate-900',
      em: isDarkMode
        ? 'text-slate-200'
        : 'text-slate-700',
      heading: isDarkMode
        ? 'text-slate-50'
        : 'text-slate-900',
      blockquote: isDarkMode
        ? 'border-slate-500 text-slate-300'
        : 'border-slate-300 text-slate-600',
      link: isDarkMode
        ? 'text-blue-400 hover:text-blue-300'
        : 'text-blue-600 hover:text-blue-500',
    }
});

export default function useChatTheme(isClient: boolean): UseChatThemeResult {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (isClient) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isClient]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const themeClasses: ThemeClasses = getThemeClasses(isDarkMode);

  return { isDarkMode, toggleTheme, themeClasses };
}