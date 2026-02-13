// components/Sidebar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { SidebarProps } from '../types/chat';
import Image from 'next/image';
import { getQuickActions, type QuickAction } from '../public/constants/quickActions';

interface HistoryItem {
  id: number;
  title: string;
}

const Sidebar: React.FC<SidebarProps & { onQuickAction?: (text: string) => void; onNewChat?: () => void }> = ({ 
  themeClasses,
  onQuickAction,
  onNewChat
}) => {
  const isDarkMode = themeClasses.sidebar.includes('bg-slate-900');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [authProvider, setAuthProvider] = useState<string>('drf');
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);

  useEffect(() => {
    const loadUsername = () => {
      const userDataString = localStorage.getItem('userData');
      const provider = localStorage.getItem('authProvider') || 'drf'; // ✅ Obtener proveedor
      
      if (userDataString) {
        try {
          JSON.parse(userDataString);
          setAuthProvider(provider);
          setQuickActions(getQuickActions(provider));
        } catch (e) {
          console.error('Error al parsear los datos de usuario de localStorage', e);
        }
      }
    };

    loadUsername();
  }, []);

  useEffect(() => {
    const getAccessToken = () => {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('accessToken');
    };

    const fetchChatHistory = async () => {
      try {
        setLoadingHistory(true);
        const accessToken = getAccessToken();
        
        if (!accessToken) {
          console.error('No hay token de acceso disponible');
          setHistoryItems([]);
          setLoadingHistory(false);
          return;
        }

        const response = await fetch('/api/chat/history/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.status === 403 || response.status === 401) {
          console.error('Token expirado o no autorizado');
          setHistoryItems([]);
          setLoadingHistory(false);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setHistoryItems(data);
        } else {
          console.error('Error al cargar el historial de chats:', response.status);
          setHistoryItems([]);
        }
      } catch (error) {
        console.error('Error al obtener el historial:', error);
        setHistoryItems([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, []);

  const handleHistoryClick = (chatId: number) => {
    console.log('Abriendo chat:', chatId);
  };

  return (
    <div className={`w-74 ${themeClasses.sidebar} border-r flex flex-col transition-colors duration-300`}>
      {/* Header con Logo */}
      <div className="p-6 border-b border-inherit">
        <div className="relative w-full h-12 flex items-center justify-center"> 
          <Image 
            src="https://ube.edu.ec/img/platilla/logo.png"
            alt="Logo UBE"
            fill
            sizes="(max-width: 768px) 100px, 120px"
            style={{ objectFit: 'contain' }} 
            priority 
          />
        </div>
      </div>
      
      {/* Botón Nueva Conversación */}
      <div className="p-4 flex-shrink-0">
        <button
          type="button"
          onClick={onNewChat}
          className={`
            w-full px-3 py-2.5 rounded-lg
            flex items-center gap-3
            text-sm font-medium text-left
            transition-all duration-200
            ${isDarkMode 
              ? 'hover:bg-gray-800 active:bg-gray-700 text-gray-300' 
              : 'hover:bg-gray-100 active:bg-gray-200 text-gray-600'
            }
          `}
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span className="truncate">Nueva Conversación</span>
        </button>
      </div>

      {/* Accesos Rápidos - ✅ USANDO QUICKACTIONS DINÁMICOS */}
      <div className="px-4 flex-shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2 px-1">
          {authProvider === 'ube' ? 'Mis Accesos' : 'Accesos Rápidos'}
        </h3>
        <div className="flex flex-col gap-1">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onQuickAction?.(action.query)}
                className={`
                  w-full px-3 py-2 rounded-lg
                  flex items-center gap-3
                  text-sm font-medium text-left
                  transition-all duration-200
                  ${isDarkMode 
                    ? 'hover:bg-gray-800 active:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 active:bg-gray-200 text-gray-600'
                  }
                `}
                title={action.description}
              >
                <Icon className="w-4 h-4 opacity-70 flex-shrink-0" />
                <span className="truncate">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Historial de Conversaciones - Con scroll independiente */}
      <div className="flex-1 flex flex-col min-h-0 px-4 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2 px-1 flex-shrink-0">
          Historial
        </h3>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-0.5">
            {loadingHistory ? (
              <p className="text-xs text-gray-400 px-3 py-2">Cargando historial...</p>
            ) : historyItems.length > 0 ? (
              historyItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleHistoryClick(item.id)}
                  className={`
                    w-full px-3 py-2.5 rounded-lg
                    text-xs text-left
                    transition-all duration-200
                    ${isDarkMode
                      ? 'hover:bg-gray-800/50 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  <span className="line-clamp-2 leading-relaxed">
                    {item.title}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-400 px-3 py-2">No hay conversaciones</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;