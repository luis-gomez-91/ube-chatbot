'use client';

import React, { useState } from 'react';
import AuthForm from '../../components/AuthForm';
import { GoogleIcon, FacebookIcon } from '../../components/Icons';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AuthPage() {
  const [showUbeForm, setShowUbeForm] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');

  const handleUbeLogin = () => {
    setShowUbeForm(true);
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // La redirección se maneja automáticamente por Supabase
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google');
      setLoadingGoogle(false);
    }
  };

  const _handleFacebookLogin = async () => {
    setLoadingGoogle(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Facebook');
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-gray-900 bg-gray-50 relative">
      <div className="absolute w-50 h-15 md:flex hidden top-5 start-5"> 
        <Image 
          src="https://ube.edu.ec/img/platilla/logo.png"
          alt="Logo UBE"
          fill
          style={{ objectFit: 'contain' }} 
          priority 
        />
      </div>
      <div className="w-full max-w-sm p-8 space-y-6">
        <div className="relative justify-center w-50 h-30 md:hidden flex items-center m-auto"> 
          <Image 
            src="https://ube.edu.ec/img/platilla/logo.png"
            alt="Logo UBE"
            fill
            style={{ objectFit: 'contain' }} 
            priority 
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {!showUbeForm ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 text-center">
              <h2 className="text-lg font-semibold text-gray-900">Elige cómo iniciar sesión</h2>
              <p className="text-xs text-gray-500 mt-1">UBE o Google</p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleUbeLogin}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-500/50 hover:bg-red-50/50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-0"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Universidad_Bolivariana_del_Ecuador_logo_1.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="object-contain shrink-0"
                />
                <span>Iniciar sesión con UBE</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loadingGoogle}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-500/50 hover:bg-red-50/50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-0 disabled:pointer-events-none disabled:opacity-60"
              >
                {loadingGoogle ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                ) : (
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                )}
                <span>{loadingGoogle ? 'Conectando...' : 'Iniciar sesión con Google'}</span>
              </button>

              <button
                type="button"
                disabled
                onClick={_handleFacebookLogin}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3.5 text-sm font-medium text-gray-400 cursor-not-allowed"
              >
                <FacebookIcon className="w-5 h-5 shrink-0" />
                <span>Iniciar sesión con Facebook</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-5">
            <button
              type="button"
              onClick={() => setShowUbeForm(false)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors py-1 -ml-1 rounded-md hover:bg-gray-100 px-2"
              aria-label="Volver a las opciones de inicio de sesión"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Volver a las opciones de inicio de sesión</span>
            </button>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Universidad_Bolivariana_del_Ecuador_logo_1.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Credenciales UBE</h2>
                  <p className="text-xs text-gray-500">Usuario y contraseña del SGA</p>
                </div>
              </div>
              <AuthForm />
            </div>
          </div>
        )}

        {/* Enlaces de términos y privacidad */}
        <div className="text-center text-xs text-gray-500 flex gap-4 justify-center align-middle">
            <Link href="/terms" className="text-gray-600 underline hover:text-red-600">
              Términos de uso
            </Link>{' '}
            |
            <Link href="/privacy" className="text-gray-600 underline hover:text-red-600">
              Política de privacidad
            </Link>
        </div>
      </div>
    </div>
  );
}