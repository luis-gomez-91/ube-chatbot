// hooks/useSessionExpiration.ts
'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function useSessionExpiration() {
  const router = useRouter();

  const handleSessionExpired = useCallback(() => {
    // Muestra alerta
    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    
    // Limpia el token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    
    // Redirige al login
    router.push('/auth');
  }, [router]);

  return { handleSessionExpired };
}