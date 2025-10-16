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
  const [chatId, setChatId] = useState<string | null>(null);  // ✅ Estado para guardar chat_id
  
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  const getUserEmail = (): string => {
    return userData?.email || 'Sin email';
  };

  const getUserAvatar = (): string | null => {
    if (authProvider === 'google' || authProvider === 'facebook') {
      return userData?.user_metadata?.avatar_url || null;
    }
    return null;
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
  };

  return (
    <div className="flex h-screen">
      <div className='hidden lg:flex'>
        <Sidebar 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          themeClasses={themeClasses}
          onQuickAction={handleQuickAction}
          onNewChat={handleNewChat}
          userName={getUserName()}
          userEmail={getUserEmail()}
          userAvatar={getUserAvatar()}
          authProvider={authProvider}
        />
      </div>

      <div className={`flex-1 flex flex-col ${themeClasses.mainArea} transition-colors duration-300`}>
        
        <ChatArea 
          messages={messages} 
          isLoading={isLoading} 
          messagesEndRef={messagesEndRef} 
          themeClasses={themeClasses}
          onQuickAction={handleQuickAction}
        />

        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          sendMessage={sendMessage}
          isLoading={isLoading}
          themeClasses={themeClasses}
        />
      </div>
    </div>
  );
}