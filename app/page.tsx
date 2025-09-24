'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Moon, Sun, MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';

const ReactMarkdown = dynamic(() => import('react-markdown'), { 
  ssr: false,
  loading: () => <p>Cargando...</p>
});

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  name?: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize client-side only data
  useEffect(() => {
    setIsClient(true);
    
    // Load theme preference from localStorage
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }

    setMessages([
      // {
      //   id: 'welcome',
      //   text: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?',
      //   sender: 'bot',
      //   timestamp: new Date()
      // }
    ]);
  }, []);

  // Save theme preference
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isClient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const timestamp = new Date();
    const userMessage: Message = {
      id: `user-${timestamp.getTime()}`,
      text: inputValue,
      sender: 'user',
      name: 'Luis',
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Enviando mensaje a API proxy...');
      
      const response = await fetch(`/api/chat?user_id=luis`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query: currentInput })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: await response.text() };
        }
        console.error(`HTTP Error ${response.status}:`, errorData);
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      const botTimestamp = new Date();

      const botMessage: Message = {
        id: `bot-${botTimestamp.getTime()}`,
        text: data.respuesta || data.error || 'Lo siento, no pude procesar tu mensaje.',
        sender: 'bot',
        timestamp: botTimestamp,
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error completo:', error);
      
      let errorText = 'Error al comunicarse con el servidor. Por favor, intenta nuevamente.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorText = 'Error de conexión. Verifica tu conexión a internet.';
      } else if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          errorText = 'Error de CORS. El servidor necesita configuración adicional.';
        } else if (error.message.includes('404')) {
          errorText = 'Endpoint no encontrado. Verifica la URL de la API.';
        } else if (error.message.includes('500')) {
          errorText = 'Error interno del servidor. Intenta más tarde.';
        }
      }

      const errorTimestamp = new Date();
      const errorMessage: Message = {
        id: `error-${errorTimestamp.getTime()}`,
        text: errorText,
        sender: 'bot',
        timestamp: errorTimestamp,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Theme-based styles
  const themeClasses = {
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

    // Markdown styles
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
  };

  if (!isClient) {
    return (
      <div className={`h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`w-64 ${themeClasses.sidebar} border-r flex flex-col transition-colors duration-300`}>
        {/* Header */}
        <div className="p-6 border-b border-inherit">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${themeClasses.sidebarText}`}>
                Asistente IA
              </h1>
              <p className={`text-sm ${themeClasses.sidebarSecondary}`}>
                Luis Gómez
              </p>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-inherit">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${themeClasses.themeButton}`}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {isDarkMode ? 'Modo claro' : 'Modo oscuro'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${themeClasses.mainArea} transition-colors duration-300`}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`group px-4 py-6 ${message.sender === 'user' ? '' : themeClasses.messageContainer} transition-colors duration-200`}
              >
                <div className={`flex items-start space-x-4 max-w-full ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {/* Message Content */}
                  <div className={`${message.sender === 'user' ? 'max-w-xs sm:max-w-md' : 'flex-1 min-w-0'}`}>
                    {/* Message Text */}
                    <div className={`${message.sender === 'bot' ? themeClasses.botMessage : ''}`}>
                      {message.sender === 'bot' ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              code: ({ children }) => (
                                <code className={`${themeClasses.markdown.code} px-2 py-1 rounded text-sm`}>{children}</code>
                              ),
                              pre: ({ children }) => (
                                <pre className={`${themeClasses.markdown.pre} p-4 rounded-lg overflow-x-auto text-sm my-3`}>{children}</pre>
                              ),
                              strong: ({ children }) => <strong className={`font-semibold ${themeClasses.markdown.strong}`}>{children}</strong>,
                              em: ({ children }) => <em className={`italic ${themeClasses.markdown.em}`}>{children}</em>,
                              h1: ({ children }) => <h1 className={`text-xl font-bold mb-3 ${themeClasses.markdown.heading}`}>{children}</h1>,
                              h2: ({ children }) => <h2 className={`text-lg font-bold mb-2 ${themeClasses.markdown.heading}`}>{children}</h2>,
                              h3: ({ children }) => <h3 className={`text-base font-bold mb-2 ${themeClasses.markdown.heading}`}>{children}</h3>,
                              blockquote: ({ children }) => (
                                <blockquote className={`border-l-4 ${themeClasses.markdown.blockquote} pl-4 italic my-3`}>{children}</blockquote>
                              ),
                              a: ({ children, href }) => (
                                <a href={href} className={`${themeClasses.markdown.link} underline`} target="_blank" rel="noopener noreferrer">{children}</a>
                              ),
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className={`${themeClasses.userMessage} px-4 py-3 rounded-2xl inline-block`}>
                          <div className="whitespace-pre-wrap leading-relaxed text-sm">
                            {message.text}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className={`group px-4 py-6 ${themeClasses.messageContainer}`}>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold mb-1 ${themeClasses.sidebarText}`}>
                      Asistente IA
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu mensaje aquí..."
                  className={`w-full p-4 pr-12 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${themeClasses.inputArea}`}
                  rows={1}
                  disabled={isLoading}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                />
                
                {/* <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className={`absolute right-2 bottom-2 p-2 ${themeClasses.sendButton} rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100`}
                  title="Enviar mensaje"
                >
                  <Send className="w-5 h-5" />
                </button> */}
              </div>
            </div>
            <div className={`text-xs ${themeClasses.sidebarSecondary} mt-2 text-center`}>
              Presiona Enter para enviar, Shift + Enter para nueva línea
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}