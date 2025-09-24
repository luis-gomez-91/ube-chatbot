'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, Moon, Sun } from 'lucide-react';
import Image from "next/image";
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

    setMessages([{
      id: 'welcome',
      text: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }]);
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
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
      
      // Use local API route instead of direct call to Railway
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
      
      // More specific error messages
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

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      text: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  // Theme-based styles
  const themeClasses = {
    container: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100'
      : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900',
    
    chatContainer: isDarkMode
      ? 'bg-slate-800/80 backdrop-blur-sm border-slate-700 shadow-slate-900/50'
      : 'bg-white/90 backdrop-blur-sm border-slate-200 shadow-slate-300/30',
    
    header: isDarkMode
      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
      : 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    
    headerButton: isDarkMode
      ? 'bg-white/20 hover:bg-white/30 focus:ring-white/50'
      : 'bg-white/20 hover:bg-white/30 focus:ring-white/50',
    
    messagesArea: isDarkMode
      ? 'bg-slate-900/50'
      : 'bg-slate-50/50',
    
    userMessage: isDarkMode
      ? 'bg-slate-800 text-slate-100 border-slate-500/50'
      : 'bg-slate-100 text-slate-900 border-slate-300/50',
    
    botMessage: isDarkMode
      ? 'bg-slate-700/80 text-slate-100 border-slate-600/50'
      : 'bg-white text-slate-900 border-slate-200/50',
    
    userAvatar: isDarkMode
      ? 'bg-slate-600 text-slate-100'
      : 'bg-slate-300 text-slate-800',
    
    botAvatar: isDarkMode
      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
      : 'bg-gradient-to-br from-red-400 to-red-500 text-white',
    
    timestamp: isDarkMode
      ? 'text-slate-400'
      : 'text-slate-500',
    
    inputArea: isDarkMode
      ? 'bg-slate-800/90 backdrop-blur-sm border-slate-700'
      : 'bg-white/90 backdrop-blur-sm border-slate-200',
    
    textarea: isDarkMode
      ? 'border-slate-600 focus:ring-red-500 focus:border-red-500 bg-slate-700/80 text-slate-100 placeholder-slate-400'
      : 'border-slate-300 focus:ring-red-500 focus:border-red-500 bg-white text-slate-900 placeholder-slate-500',
    
    sendButton: isDarkMode
      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-500'
      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-400 disabled:to-slate-500',
    
    loadingText: isDarkMode
      ? 'text-slate-400'
      : 'text-slate-500',
    
    helpText: isDarkMode
      ? 'text-slate-400'
      : 'text-slate-500',
    
    subtitle: isDarkMode
      ? 'text-slate-400'
      : 'text-slate-600',

    // Markdown styles
    markdown: {
      code: isDarkMode
        ? 'bg-slate-600 text-slate-100'
        : 'bg-slate-200 text-slate-800',
      pre: isDarkMode
        ? 'bg-slate-600 text-slate-100'
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
        ? 'text-red-400 hover:text-red-300'
        : 'text-red-600 hover:text-red-500',
    }
  };

  if (!isClient) {
    return (
      <div className={`h-screen flex items-center justify-center ${themeClasses.container}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen ${themeClasses.container} flex flex-col transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 flex flex-col h-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-6 flex-shrink-0">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
              Asistente IA Inteligente
            </h1>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full ${themeClasses.headerButton} transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50`}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
          <p className={`text-sm ${themeClasses.subtitle} mb-6`}>
            Conversa con nuestra IA avanzada y obtén respuestas instantáneas
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col w-full min-h-0">
          <div className={`${themeClasses.chatContainer} rounded-lg shadow-2xl overflow-hidden border flex flex-col h-full transition-all duration-300`}>
            {/* Chat Header */}
            <div className={`${themeClasses.header} p-4 flex-shrink-0`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Universidad_Bolivariana_del_Ecuador_logo_1.svg/1024px-Universidad_Bolivariana_del_Ecuador_logo_1.svg.png"
                      alt="Logo de la UBE"
                      width={30}
                      height={30}
                      className="object-contain object-center"
                      priority
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Asistente IA</h3>
                    <p className="text-sm text-red-100">
                      {isLoading ? 'Escribiendo...' : 'En línea'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className={`flex items-center space-x-2 ${themeClasses.headerButton} px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2`}
                  title="Limpiar conversación"
                  aria-label="Limpiar conversación"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Limpiar</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${themeClasses.messagesArea} min-h-0 transition-colors duration-300`}>
              {!isClient ? (
                <div className={`flex items-center justify-center h-full ${themeClasses.loadingText}`}>
                  <p>Cargando...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className={`flex items-center justify-center h-full ${themeClasses.loadingText}`}>
                  <p>No hay mensajes aún</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 animate-fade-in ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        message.sender === 'user'
                          ? themeClasses.userAvatar
                          : themeClasses.botAvatar
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <span className="text-xs font-bold">
                          {message.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    <div
                      className={`max-w-xs sm:max-w-md lg:max-w-2xl ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl backdrop-blur-sm border transition-colors duration-300 ${
                          message.sender === 'user'
                            ? `${themeClasses.userMessage} rounded-br-sm`
                            : `${themeClasses.botMessage} rounded-bl-sm`
                        }`}
                      >
                        {message.sender === 'bot' ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                code: ({ children }) => (
                                  <code className={`${themeClasses.markdown.code} px-1 py-0.5 rounded text-sm`}>{children}</code>
                                ),
                                pre: ({ children }) => (
                                  <pre className={`${themeClasses.markdown.pre} p-3 rounded-lg overflow-x-auto text-sm my-2`}>{children}</pre>
                                ),
                                strong: ({ children }) => <strong className={`font-semibold ${themeClasses.markdown.strong}`}>{children}</strong>,
                                em: ({ children }) => <em className={`italic ${themeClasses.markdown.em}`}>{children}</em>,
                                h1: ({ children }) => <h1 className={`text-lg font-bold mb-2 ${themeClasses.markdown.heading}`}>{children}</h1>,
                                h2: ({ children }) => <h2 className={`text-base font-bold mb-2 ${themeClasses.markdown.heading}`}>{children}</h2>,
                                h3: ({ children }) => <h3 className={`text-sm font-bold mb-1 ${themeClasses.markdown.heading}`}>{children}</h3>,
                                blockquote: ({ children }) => (
                                  <blockquote className={`border-l-4 ${themeClasses.markdown.blockquote} pl-3 italic my-2`}>{children}</blockquote>
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
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.text}
                          </p>
                        )}
                      </div>
                      {isClient && (
                        <p className={`text-xs ${themeClasses.timestamp} mt-1 px-2`}>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input Area */}
            <div className={`p-4 ${themeClasses.inputArea} backdrop-blur-sm border-t flex-shrink-0 transition-colors duration-300`}>
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe tu mensaje aquí..."
                    className={`w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 transition-all duration-200 max-h-32 backdrop-blur-sm overflow-y-auto ${themeClasses.textarea}`}
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className={`p-3 ${themeClasses.sendButton} text-white rounded-xl disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500/50`}
                  title="Enviar mensaje"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className={`text-xs ${themeClasses.helpText} mt-2 text-center`}>
                Presiona Enter para enviar, Shift + Enter para nueva línea
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}