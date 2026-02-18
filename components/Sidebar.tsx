// components/Sidebar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { BadgePlus, Menu, CirclePlus, Search, X } from 'lucide-react';
import { SidebarProps } from '../types/chat';
import { getQuickActions, type QuickAction } from '../public/constants/quickActions';

const SIDEBAR_COLLAPSED_KEY = 'ube-chat-sidebar-collapsed';

interface HistoryItem {
  id: number;
  title: string;
}

const Sidebar: React.FC<SidebarProps & { onQuickAction?: (text: string) => void; onNewChat?: () => void }> = ({ 
  themeClasses,
  onQuickAction,
  onNewChat,
  onCollapsedChange,
  onClose,
  forceExpanded = false
}) => {
  const isDarkMode = themeClasses.sidebar.includes('bg-slate-900');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const effectiveCollapsed = forceExpanded ? false : isCollapsed;
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [authProvider, setAuthProvider] = useState<string>('drf');
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (saved !== null) {
        const value = saved === 'true';
        setIsCollapsed(value);
        onCollapsedChange?.(value);
      }
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run only on mount to read persisted state
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        // ignore
      }
      onCollapsedChange?.(next);
      return next;
    });
  };

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

  const iconBtnClass = `
    flex items-center justify-center rounded-lg
    text-sm font-medium
    transition-all duration-200 flex-shrink-0
    ${isDarkMode 
      ? 'hover:bg-gray-800 active:bg-gray-700 text-gray-300' 
      : 'hover:bg-gray-100 active:bg-gray-200 text-gray-600'
    }
  `;

  return (
    <div 
      className={`flex flex-col border-r transition-all duration-300 ease-in-out ${themeClasses.sidebar} ${effectiveCollapsed ? 'w-16' : 'w-64'} ${onClose ? 'h-full min-h-0' : ''}`}
    >
      {/* Header: cerrar (móvil) / hamburguesa + UBE (escritorio) */}
      <div className={`flex-shrink-0 border-b border-inherit flex items-center gap-2 overflow-hidden ${effectiveCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-3'}`}>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 transition-colors ${iconBtnClass}`}
            title="Cerrar menú"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleCollapsed}
            className={`rounded-lg p-2 transition-colors ${iconBtnClass}`}
            title={isCollapsed ? 'Abrir menú' : 'Cerrar menú'}
            aria-label={isCollapsed ? 'Abrir menú' : 'Cerrar menú'}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {!effectiveCollapsed && (
          <h3 className={`text-xs font-semibold tracking-wider opacity-60 ${themeClasses.sidebarText}`}>
            Universidad Bolivariana del Ecuador
          </h3>
        )}
      </div>

      {/* Nueva Conversación */}
      <div className={`flex-shrink-0 text-left ${effectiveCollapsed ? 'px-2 pt-3 flex justify-center' : 'pt-4 px-2'}`}>
        <button
          type="button"
          onClick={onNewChat}
          className={effectiveCollapsed 
            ? `w-10 h-10 rounded-lg ${iconBtnClass}` 
            : `w-full px-3 py-2.5 rounded-lg flex items-center justify-start gap-3 text-left ${iconBtnClass}`
          }
          title="Nuevo Chat"
        >
          <BadgePlus className="w-5 h-5 flex-shrink-0" />
          {!effectiveCollapsed && <span className="truncate text-sm">Nuevo Chat</span>}
        </button>
      </div>

      <div className={`pb-3 flex-shrink-0 text-left ${effectiveCollapsed ? 'px-2 flex justify-center' : 'px-2'}`}>
        <button
          type="button"
          onClick={onNewChat}
          className={effectiveCollapsed 
            ? `w-10 h-10 rounded-lg ${iconBtnClass}` 
            : `w-full px-3 py-2.5 rounded-lg flex items-center justify-start gap-3 text-left ${iconBtnClass}`
          }
          title="Buscar Chats"
        >
          <Search className="w-5 h-5 flex-shrink-0" />
          {!effectiveCollapsed && <span className="truncate text-sm">Buscar Chats</span>}
        </button>
      </div>

      {/* Accesos Rápidos - misma sangría que botones (px-3) */}
      <div className={`flex-shrink-0 overflow-hidden text-left ${effectiveCollapsed ? 'px-2 flex flex-col items-center gap-1' : 'px-2'}`}>
        {!effectiveCollapsed && (
          <h3 className={`text-xs font-semibold uppercase tracking-wider opacity-60 mb-2 px-3 text-left ${themeClasses.sidebarText}`}>
            {authProvider === 'ube' ? 'Mis Accesos' : 'Accesos Rápidos'}
          </h3>
        )}
        <div className="flex flex-col gap-1 items-stretch">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => onQuickAction?.(action.query)}
                className={effectiveCollapsed 
                  ? `w-10 h-10 rounded-lg ${iconBtnClass}` 
                  : `w-full px-3 py-1 rounded-lg flex items-center justify-start gap-3 text-left ${iconBtnClass}`
                }
                title={action.label}
              >
                <Icon className="w-4 h-4 opacity-70 flex-shrink-0" />
                {!effectiveCollapsed && <span className="truncate text-sm">{action.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chats - solo cuando está expandido */}
      {!effectiveCollapsed && (
        <div className="flex-1 flex flex-col min-h-0 px-2 pt-4">
          <h3 className={`text-xs font-semibold uppercase tracking-wider opacity-60 mb-2 px-1 flex-shrink-0 ${themeClasses.sidebarText}`}>
            Chats
          </h3>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-0">
              {loadingHistory ? (
                <p className={`text-xs px-3 py-1 ${themeClasses.sidebarSecondary}`}>Cargando historial...</p>
              ) : historyItems.length > 0 ? (
                historyItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleHistoryClick(item.id)}
                    className={`
                      w-full px-3 py-1.5 rounded-md text-xs text-left
                      transition-all duration-200
                      ${isDarkMode
                        ? 'hover:bg-gray-800/50 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    <span className="line-clamp-2 leading-snug">
                      {item.title}
                    </span>
                  </button>
                ))
              ) : (
                <p className={`text-xs px-3 py-2 ${themeClasses.sidebarSecondary}`}>No hay conversaciones</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;