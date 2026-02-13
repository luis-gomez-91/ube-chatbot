'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const TOKEN_API_URL = 'https://sga.ube.edu.ec/api/token/';
  const VERIFY_API_URL = 'https://sga.ube.edu.ec/api/auth/verify';

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      setLoading(false);
      return;
    }
    
    try {
      console.log('1. Intentando obtener tokens...');
      const tokenResponse = await fetch(TOKEN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.detail || 'Credenciales incorrectas o error al obtener tokens.');
      }

      const { access, refresh } = await tokenResponse.json();
      
      // Guardar tokens en localStorage (solo en el cliente)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
      }
      
      console.log('Tokens guardados. Token de Acceso:', access);

      // 2. Llamada para verificar y obtener datos del usuario
      console.log('2. Intentando verificar y obtener datos del usuario...');
      const verifyResponse = await fetch(VERIFY_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
      });

      if (!verifyResponse.ok) {
        throw new Error('Error al verificar el token o al obtener los datos del usuario.');
      }

      const userData = await verifyResponse.json();
      
      // Guardar datos del usuario
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authProvider', 'ube'); // ✅ Guarda el proveedor
        
        // ✅ AQUÍ: Limpia el historial del navegador
        // Reemplaza el estado actual para que no pueda volver atrás al login
        window.history.replaceState(null, '', '/chat');
      }
      
      console.log('Datos del usuario guardados:', userData);
      router.push('/chat');

    } catch (err: any) {
      // Limpiar tokens si hubo un error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
      setError(err.message || 'Ocurrió un error inesperado durante la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
          Usuario
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <User className="h-5 w-5" />
          </span>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            autoComplete="username"
            placeholder="Tu usuario del SGA"
            required
            className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-60"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Contraseña
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock className="h-5 w-5" />
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            autoComplete="current-password"
            placeholder="Tu contraseña"
            required
            className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-3 pl-11 pr-12 text-gray-900 placeholder-gray-400 transition-colors focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-60"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/30"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <span>Iniciar sesión</span>
        )}
      </button>
    </form>
  );
}