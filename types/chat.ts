// types/chat.ts
import { RefObject } from 'react';

// Tipificación de Mensaje
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  name?: string;
  timestamp: Date;
}

// Tipificación de Clases de Tema
export interface ThemeClasses {
  sidebar: string;
  mainArea: string;
  sidebarText: string;
  textPrimary: string;
  textSecondary: string;
  sidebarSecondary: string;
  themeButton: string;
  messageContainer: string;
  userMessage: string;
  botMessage: string;
  inputArea: string;
  sendButton: string;
  markdown: {
    code: string;
    pre: string;
    strong: string;
    em: string;
    heading: string;
    blockquote: string;
    link: string;
  };
}

// Tipificación del Retorno del Hook
export interface UseChatThemeResult {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeClasses: ThemeClasses;
}

// Tipificación de Props para Sidebar
export interface SidebarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeClasses: ThemeClasses;
  onQuickAction?: (text: string) => void;
}

// Tipificación de Props para ChatArea
export interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
  themeClasses: ThemeClasses;
}

// Tipificación de Props para ChatInput
export interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: () => Promise<void>;
  isLoading: boolean;
  themeClasses: ThemeClasses;
}

// Tipificación de Props para MessageItem
export interface MessageItemProps {
  message: Message;
  themeClasses: ThemeClasses;
}