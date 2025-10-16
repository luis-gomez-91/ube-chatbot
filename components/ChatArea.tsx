// components/ChatArea.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import MessageItem from './MessageItem';
import { Bot, Sparkles, User, LogOut, FileText, Shield } from 'lucide-react';
import { ChatAreaProps } from '../types/chat';
import Image from 'next/image';
import { quickActions } from '../public/constants/quickActions';
import { getFullName, getFirstName, getUserEmail, getUserAvatar, UserData } from '../utils/userHelpers';


interface UserData {
  id?: number;
  username?: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  perfil?: string | null;
  photo?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

const ChatArea: React.FC<ChatAreaProps & { onQuickAction?: (text: string) => void }> = ({ 
  messages, 
  isLoading, 
  messagesEndRef, 
  themeClasses,
  onQuickAction 
}) => {
  
  const isEmpty = messages.length === 0 && !isLoading;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authProvider, setAuthProvider] = useState<string>('drf');
  const [imageError, setImageError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // ✅ Obtiene el nombre completo de forma segura
  const getFullName = (): string => {
    if (!userData) return 'Usuario';

    // Google y Facebook
    if (authProvider === 'google' || authProvider === 'facebook') {
      if (userData.user_metadata?.full_name) {
        return userData.user_metadata.full_name;
      }
      return userData.email || 'Usuario';
    }

    // DRF
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

  // ✅ Obtiene el primer nombre de forma segura
  const getFirstName = (): string => {
    const fullName = getFullName();
    return fullName.split(' ')[0] || 'Usuario';
  };

  // ✅ Obtiene la foto de perfil según el proveedor
  const getPhotoUrl = (): string | null => {
    if (authProvider === 'google' || authProvider === 'facebook') {
      return userData?.user_metadata?.avatar_url || null;
    }
    return userData?.photo || null;
  };

  const photoUrl = getPhotoUrl();
  const fullName = getFullName();
  const firstName = getFirstName();

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth relative">
      {/* Header Fixed - Top Bar con Avatar */}
      <div className={`
        fixed top-0 right-0 left-0 lg:left-74 z-40
        h-16 px-4 flex items-center justify-between
        bg-white dark:bg-slate-700
      `}>
        {/* Nombre del usuario (opcional, visible en desktop) */}
        {userData && (
          <div className="hidden md:block">
            <p className={`text-sm font-medium ${themeClasses.sidebarText}`}>
              {fullName}
            </p>
            <p className="text-xs opacity-60">{userData.email}</p>
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
                  {getInitials(userData ? fullName : undefined)}
                </span>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className={`
              absolute right-0 mt-2 w-72 rounded-xl shadow-lg border
              ${themeClasses.sidebar} border-gray-200 dark:border-gray-600
              overflow-hidden z-50
            `}>
              {/* User Info Section */}
              {userData && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
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
                      <p className="text-xs opacity-60 truncate">{userData.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="py-2">
                {/* TÉRMINOS Y CONDICIONES */}
                <a 
                  href="https://ube.edu.ec/terminos-condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm
                    transition-colors duration-200
                    ${themeClasses.sidebarText}
                    hover:bg-gray-100 dark:hover:bg-gray-800
                  `}
                >
                  <FileText className="w-4 h-4 opacity-70" />
                  <span>Términos y Condiciones</span>
                </a>

                {/* POLÍTICA DE PRIVACIDAD */}
                <a 
                  href="https://ube.edu.ec/politica-privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm
                    transition-colors duration-200
                    ${themeClasses.sidebarText}
                    hover:bg-gray-100 dark:hover:bg-gray-800
                  `}
                >
                  <Shield className="w-4 h-4 opacity-70" />
                  <span>Política de Privacidad</span>
                </a>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                {/* Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm
                    transition-colors duration-200
                    text-red-600 dark:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-900/20
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

      {/* Contenido con padding-top para no quedar tapado */}
      <div className="pt-8">
        {/* Estado Vacío - Pantalla de Bienvenida */}
        {isEmpty && (
          <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center space-y-6">
              {/* Título y Descripción */}
              <div className="space-y-3">
                <h1 className={`text-3xl md:text-4xl font-bold ${themeClasses.sidebarText}`}>
                  ¡Bienvenido{userData ? `, ${firstName}` : ''}!
                </h1>
                <p className="text-base md:text-lg opacity-70 max-w-xl mx-auto">
                  Tu asistente virtual para explorar carreras, conocer precios y obtener toda la información sobre la Universidad Bolivariana del Ecuador
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
                      ${themeClasses.messageContainer}
                      hover:scale-105 hover:shadow-md
                      border border-transparent hover:border-red-500/20
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{action.emoji}</span>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
                        <p className="text-xs opacity-60">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Indicador Adicional */}
              <div className="flex items-center justify-center gap-2 mt-6 opacity-50">
                <Sparkles className="w-4 h-4" />
                <p className="text-sm">Escribe tu pregunta abajo para comenzar</p>
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
            
            {/* Indicador de Carga Mejorado */}
            {isLoading && (
              <div className={`
                group px-4 py-6 rounded-2xl transition-all duration-300
                ${themeClasses.messageContainer}
              `}>
                <div className="flex items-start space-x-4">
                  {/* Avatar del Asistente */}
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Contenido de Carga */}
                  <div className="flex-1 pt-1">
                    <div className={`text-sm font-semibold mb-2 ${themeClasses.sidebarText}`}>
                      Asistente UBE
                    </div>
                    
                    {/* Animación de escritura */}
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

                    {/* Líneas de placeholder simulando texto */}
                    <div className="mt-3 space-y-2">
                      <div className={`h-2 rounded-full animate-pulse ${themeClasses.sidebarText} opacity-20 w-3/4`}></div>
                      <div className={`h-2 rounded-full animate-pulse ${themeClasses.sidebarText} opacity-20 w-1/2`}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Referencia para scroll automático */}
            <div ref={messagesEndRef} className="h-1"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;