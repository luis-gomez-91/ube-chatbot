// hooks/useSessionExpiration.ts
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useSessionExpiration() {
  const router = useRouter();

  const handleSessionExpired = useCallback(() => {
    // Toast elegante con sonner
    toast.error('Sesión expirada', {
      description: 'Tu sesión ha expirado. Serás redirigido al inicio de sesión.',
      duration: 4000,
    });
    
    // Limpia el token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    
    // Redirige después de 1 segundo para que vea el toast
    setTimeout(() => {
      router.push('/auth');
    }, 1000);
  }, [router]);

  return { handleSessionExpired };
}