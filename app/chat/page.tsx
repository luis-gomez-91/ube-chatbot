// app/page.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useChatTheme from '../../hooks/useChatTheme'; 
import useSessionExpiration from '../../hooks/useSessionExpiration';
import Sidebar from '../../components/Sidebar'; 
import ChatArea from '../../components/ChatArea'; 
import ChatInput from '../../components/ChatInput'; 
import { Message } from '../../types/chat'; 

interface UserData {
  id?: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  provider?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authProvider, setAuthProvider] = useState<string>('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const router = useRouter();
  const { isDarkMode, toggleTheme, themeClasses } = useChatTheme(isClient); 
  const { handleSessionExpired } = useSessionExpiration();

  const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  };

  const getUserData = () => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  };

  const getAuthProvider = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('authProvider') || 'drf';
  };

  const checkTokenExpiration = (response: Response) => {
    if (response.status === 403 || response.status === 401) {
      handleSessionExpired();
      return true;
    }
    return false;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    const token = getAccessToken();
    if (!token) {
      router.push('/auth');
      return;
    }

    const user = getUserData();
    const provider = getAuthProvider();
    
    setUserData(user);
    setAuthProvider(provider);
  }, [router]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Bloquear scroll del body cuando el sidebar móvil está abierto
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(t);
    }
  }, [isLoading, scrollToBottom]);

  // Enfocar el cuadro de chat cuando la IA termina de responder
  const prevLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (prevLoadingRef.current && !isLoading) {
      chatInputRef.current?.focus();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  const getUserName = (): string => {
    if (!userData) return 'Usuario';

    if (authProvider === 'google' || authProvider === 'facebook') {
      return userData.user_metadata?.full_name || userData.email || 'Usuario';
    }

    if (authProvider === 'drf') {
      const firstName = userData.first_name || '';
      const lastName = userData.last_name || '';
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      return userData.name || userData.email || 'Usuario';
    }

    return userData.name || userData.email || 'Usuario';
  };

  const sendMessage = async () => {
    const accessToken = getAccessToken();
    
    if (!inputValue.trim() || isLoading) return;

    const timestamp = new Date();
    const userName = getUserName();
    
    const userMessage: Message = {
      id: `user-${timestamp.getTime()}`,
      text: inputValue,
      sender: 'user',
      name: userName,
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/chat/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          message: currentInput,
          provider: authProvider,
          chat_id: chatId  // ✅ Enviar chat_id actual (null si es la primera mensaje)
        })
      });

      if (checkTokenExpiration(response)) {
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch { errorData = { error: await response.text() }; }
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // ✅ Guardar el chat_id de la respuesta si es la primera vez
      if (data.chat_id && !chatId) {
        setChatId(data.chat_id);
        console.log('Chat ID guardado:', data.chat_id);
      }
      
      const botTimestamp = new Date();
      const botMessage: Message = {
        id: `bot-${botTimestamp.getTime()}`,
        text: data.respuesta || data.error || 'Lo siento, no pude procesar tu mensaje.',
        sender: 'bot',
        timestamp: botTimestamp,
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      let errorText = 'Error al comunicarse con el servidor. Por favor, intenta nuevamente.';
      
      if (error instanceof TypeError && (error as TypeError).message.includes('fetch')) {
        errorText = 'Error de conexión. Verifica tu conexión a internet.';
      } else if (error instanceof Error) {
        if (error.message.includes('CORS')) { errorText = 'Error de CORS. El servidor necesita configuración adicional.'; } 
        else if (error.message.includes('404')) { errorText = 'Endpoint no encontrado. Verifica la URL de la API.'; } 
        else if (error.message.includes('500')) { errorText = 'Error interno del servidor. Intenta más tarde.'; }
        else { errorText = `Error: ${(error as Error).message}`; }
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

  const handleQuickAction = (query: string) => {
    const accessToken = getAccessToken();

    setInputValue(query);
    
    setTimeout(() => {
      const timestamp = new Date();
      const userName = getUserName();
      
      const userMessage: Message = {
        id: `user-${timestamp.getTime()}`,
        text: query,
        sender: 'user',
        name: userName,
        timestamp,
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      
      fetch(`/api/chat/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          message: query,
          provider: authProvider,
          chat_id: chatId  // ✅ Enviar chat_id actual
        })
      })
      .then(response => {
        if (checkTokenExpiration(response)) {
          throw new Error('Session expired');
        }
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
      })
      .then(data => {
        // ✅ Guardar el chat_id si es la primera vez
        if (data.chat_id && !chatId) {
          setChatId(data.chat_id);
          console.log('Chat ID guardado:', data.chat_id);
        }
        
        const botTimestamp = new Date();
        const botMessage: Message = {
          id: `bot-${botTimestamp.getTime()}`,
          text: data.respuesta || data.error || 'Lo siento, no pude procesar tu mensaje.',
          sender: 'bot',
          timestamp: botTimestamp,
        };
        setMessages(prev => [...prev, botMessage]);
      })
      .catch(error => {
        if (error.message !== 'Session expired') {
          const errorTimestamp = new Date();
          const errorMessage: Message = {
            id: `error-${errorTimestamp.getTime()}`,
            text: 'Error al comunicarse con el servidor. Por favor, intenta nuevamente.',
            sender: 'bot',
            timestamp: errorTimestamp,
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    }, 100);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setChatId(null);  // ✅ Resetear chat_id para iniciar conversación nueva
    setMobileSidebarOpen(false);
  };

  const handleQuickActionCloseMobile = (query: string) => {
    handleQuickAction(query);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar escritorio: oculto en móvil */}
      <div className="hidden lg:flex">
        <Sidebar 
          themeClasses={themeClasses}
          onQuickAction={handleQuickAction}
          onNewChat={handleNewChat}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      {/* Móvil: overlay del sidebar (estilo Gemini) */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setMobileSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar menú"
          />
          <div className="fixed left-0 top-0 h-screen z-50 w-[280px] max-w-[85vw] lg:hidden shadow-xl sidebar-slide-in">
            <div className="h-full flex flex-col min-h-0">
              <Sidebar
                themeClasses={themeClasses}
                onQuickAction={handleQuickActionCloseMobile}
                onNewChat={handleNewChat}
                onCollapsedChange={setSidebarCollapsed}
                onClose={() => setMobileSidebarOpen(false)}
                forceExpanded
              />
            </div>
          </div>
        </>
      )}

      <div className={`flex-1 flex flex-col min-w-0 ${themeClasses.mainArea} transition-colors duration-300`}>
        
        <ChatArea 
          messages={messages} 
          isLoading={isLoading} 
          messagesEndRef={messagesEndRef} 
          themeClasses={themeClasses}
          onQuickAction={handleQuickAction}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          sidebarCollapsed={sidebarCollapsed}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          sendMessage={sendMessage}
          isLoading={isLoading}
          themeClasses={themeClasses}
          inputRef={chatInputRef}
        />
      </div>
    </div>
  );
}