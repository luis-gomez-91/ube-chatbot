// app/auth/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtiene la sesión actual después del redirect de OAuth
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw new Error(sessionError?.message || 'No se pudo obtener la sesión');
        }

        const { access_token, refresh_token, user } = session;

        // Guarda los tokens en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          localStorage.setItem('userData', JSON.stringify(user));
          
          // ✅ Guarda el proveedor de autenticación
          const provider = user.app_metadata?.provider || 'google';
          localStorage.setItem('authProvider', provider);
          
          // Limpia el historial
          window.history.replaceState(null, '', '/chat');
        }

        console.log('Usuario autenticado con Google:', user.email);
        
        // Redirige al chat
        router.push('/chat');
      } catch (err: any) {
        console.error('Error en callback:', err);
        setError(err.message || 'Error al procesar la autenticación');
        setLoading(false);
        
        // Redirige al login después de 3 segundos
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-700">Autenticando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">Serás redirigido al login en 3 segundos...</p>
        </div>
      </div>
    );
  }

  return null;
}