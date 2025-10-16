'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          disabled={loading}
        />
      </div>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <button
        type="submit"
        className="w-full px-4 py-3 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}