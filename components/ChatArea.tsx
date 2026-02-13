// components/ChatArea.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import MessageItem from './MessageItem';
import { Bot, Sparkles, LogOut, FileText, Shield, Moon, Sun } from 'lucide-react';
import { ChatAreaProps } from '../types/chat';
import Image from 'next/image';
import { getQuickActions } from '../public/constants/quickActions';
import { 
  getFullName, 
  getFirstName, 
  getUserEmail, 
  getUserAvatar, 
  UserData 
} from '../utils/userHelpers';

const ChatArea: React.FC<ChatAreaProps & { onQuickAction?: (text: string) => void }> = ({ 
  messages, 
  isLoading, 
  messagesEndRef, 
  themeClasses,
  onQuickAction,
  isDarkMode = false,
  toggleTheme
}) => {
  
  const isEmpty = messages.length === 0 && !isLoading;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authProvider, setAuthProvider] = useState<string>('drf');
  const [imageError, setImageError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quickActions, setQuickActions] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const loadUserData = () => {
      const userDataString = localStorage.getItem('userData');
      const provider = localStorage.getItem('authProvider') || 'drf';
      
      if (userDataString) {
        try {
          const data = JSON.parse(userDataString) as UserData;
          setUserData(data);
          setAuthProvider(provider);
          setQuickActions(getQuickActions(provider));
          setImageError(false);
        } catch (e) {
          console.error('Error al parsear userData:', e);
        }
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authProvider');
    window.location.href = '/auth';
  };

  const getInitials = (name: string | undefined): string => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // ✅ Usar funciones del utility
  const fullName = getFullName(userData, authProvider);
  const firstName = getFirstName(userData, authProvider);
  const photoUrl = getUserAvatar(userData, authProvider);

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth relative">
      {/* Header Fixed - Top Bar con Avatar */}
      <div className={`
        fixed top-0 right-0 left-0 lg:left-74 z-40
        h-16 px-4 flex items-center justify-between
        transition-colors duration-300
        ${themeClasses.mainArea}
      `}>
        {userData && (
          <div className="hidden md:block">
            <p className={`text-sm font-medium ${themeClasses.sidebarText}`}>
              {fullName}
            </p>
            <p className={`${themeClasses.sidebarSecondary} text-sm`}>{userData.email}</p>
          </div>
        )}

        {/* Avatar del usuario con Dropdown */}
        <div className="ml-auto relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="focus:outline-none"
          >
            {photoUrl && !imageError ? (
              <div 
                className="relative w-11 h-11 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform duration-200 cursor-pointer overflow-hidden shadow-md"
                title={fullName}
              >
                <Image
                  src={photoUrl}
                  alt={fullName || 'Usuario'}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div 
                className="w-11 h-11 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform duration-200 cursor-pointer shadow-md bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center"
                title={fullName || 'Usuario'}
              >
                <span className="text-white font-semibold text-sm">
                  {getInitials(fullName)}
                </span>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className={`
              absolute right-0 mt-2 w-72 rounded-xl shadow-lg border
              ${themeClasses.sidebar}
              overflow-hidden z-50
            `}>
              {userData && (
                <div className={`
                  p-4 border-b
                  ${themeClasses.sidebar}
                  border-opacity-40
                `}>
                  <div className="flex items-center gap-3 mb-2">
                    {photoUrl && !imageError ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={photoUrl}
                          alt={fullName}
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={() => setImageError(true)}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {getInitials(fullName)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${themeClasses.sidebarText}`}>
                        Hola, {firstName}
                      </p>
                      <p className={`text-xs ${themeClasses.sidebarSecondary} truncate`}>
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="py-2">
                <Link 
                  href="/terms"
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm
                    transition-colors duration-200
                    ${themeClasses.sidebarText}
                    ${isDarkMode ? 'hover:bg-slate-700/80 hover:text-red-400' : 'hover:bg-slate-200 hover:text-red-600'}
                  `}
                >
                  <FileText className="w-4 h-4 opacity-70" />
                  <span>Términos y Condiciones</span>
                </Link>

                <Link 
                  href="/privacy"
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm
                    transition-colors duration-200
                    ${themeClasses.sidebarText}
                    ${isDarkMode ? 'hover:bg-slate-700/80 hover:text-red-400' : 'hover:bg-slate-200 hover:text-red-600'}
                  `}
                >
                  <Shield className="w-4 h-4 opacity-70" />
                  <span>Política de Privacidad</span>
                </Link>

                {toggleTheme && (
                  <button
                    type="button"
                    onClick={() => { toggleTheme(); }}
                    className={`
                      w-full flex items-center justify-between gap-3 px-4 py-3 text-sm
                      transition-colors duration-200
                      ${themeClasses.sidebarText}
                      ${isDarkMode ? 'hover:bg-slate-700/80 hover:text-red-400' : 'hover:bg-slate-200 hover:text-red-600'}
                    `}
                    title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                  >
                    <span className="flex items-center gap-3">
                      {isDarkMode ? <Sun className="w-4 h-4 opacity-70" /> : <Moon className="w-4 h-4 opacity-70" />}
                      <span>{isDarkMode ? 'Modo claro' : 'Modo oscuro'}</span>
                    </span>
                    <div className={`
                      w-9 h-5 rounded-full relative transition-colors duration-200 shrink-0
                      ${isDarkMode ? 'bg-red-600' : 'bg-gray-300 dark:bg-slate-600'}
                    `}>
                      <div className={`
                        absolute top-0.5 w-4 h-4 rounded-full bg-white
                        transition-transform duration-200
                        ${isDarkMode ? 'translate-x-4' : 'translate-x-0.5'}
                      `} />
                    </div>
                  </button>
                )}

                <div className={`
                  border-t my-2
                  border-opacity-20
                  ${themeClasses.sidebar.includes('bg-slate-900') 
                    ? 'border-slate-600' 
                    : 'border-slate-300'
                  }
                `}></div>

                <button
                  onClick={handleLogout}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm
                    transition-colors duration-200
                    ${isDarkMode ? 'text-red-400 hover:bg-slate-700/80 hover:text-red-300' : 'text-red-600 hover:bg-red-50'}
                  `}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8">
        {/* Estado Vacío - Pantalla de Bienvenida */}
        {isEmpty && (
          <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center space-y-6">
              <div className="space-y-3">
                <h1 className={`text-3xl md:text-4xl font-bold ${themeClasses.sidebarText}`}>
                  ¡Bienvenido{userData ? `, ${firstName}` : ''}!
                </h1>
                <p className={`text-base md:text-lg opacity-70 max-w-xl mx-auto ${themeClasses.textPrimary}`}>
                  {authProvider === 'ube' 
                    ? 'Tu asistente personal para gestionar todo lo relacionado con tu vida universitaria en la UBE'
                    : 'Tu asistente virtual para explorar carreras, conocer precios y obtener toda la información sobre la Universidad Bolivariana del Ecuador'
                  }
                </p>
              </div>

              {/* Sugerencias de Consulta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-2xl mx-auto">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onQuickAction?.(action.query)}
                    className={`
                      p-4 rounded-xl text-left transition-all duration-200
                      ${themeClasses.textSecondary}
                      hover:scale-105
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{action.emoji}</span>
                      <div>
                        <h3 className={`font-semibold text-sm mb-1 ${themeClasses.sidebarText}`}>{action.label}</h3>
                        <p className={`text-xs opacity-60 ${themeClasses.messageContainer}`}>{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 mt-6 opacity-50">
                <Sparkles className="w-4 h-4" />
                <p className={`text-sm ${themeClasses.textPrimary}`}>Escribe tu pregunta abajo para comenzar</p>
              </div>
            </div>
          </div>
        )}

        {/* Área de Mensajes */}
        {!isEmpty && (
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-1">
            {messages.map((message) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                themeClasses={themeClasses}
              />
            ))}
            
            {isLoading && (
              <div className={`
                group px-4 py-6 rounded-2xl transition-all duration-300
                ${themeClasses.messageContainer}
              `}>
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 pt-1">
                    <div className={`text-sm font-semibold mb-2 ${themeClasses.sidebarText}`}>
                      Asistente UBE
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div 
                          className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce" 
                          style={{ animationDelay: '0ms', animationDuration: '1s' }}
                        ></div>
                        <div 
                          className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce" 
                          style={{ animationDelay: '150ms', animationDuration: '1s' }}
                        ></div>
                        <div 
                          className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce" 
                          style={{ animationDelay: '300ms', animationDuration: '1s' }}
                        ></div>
                      </div>
                      <span className="text-sm opacity-60 animate-pulse">
                        Pensando...
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className={`h-2 rounded-full animate-pulse ${themeClasses.sidebarText} opacity-20 w-3/4`}></div>
                      <div className={`h-2 rounded-full animate-pulse ${themeClasses.sidebarText} opacity-20 w-1/2`}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-1"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;