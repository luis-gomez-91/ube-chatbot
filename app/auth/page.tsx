'use client';

import React, { useState } from 'react';
import AuthForm from '../../components/AuthForm';
import { GoogleIcon, FacebookIcon } from '../../components/Icons';
import Link from 'next/link';
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // La redirección se maneja automáticamente por Supabase
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
      setLoadingGoogle(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoadingGoogle(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Facebook');
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

        <div className="flex flex-col items-center space-y-4 mt-5">
          <h1 className="text-3xl font-semibold text-center">Inicia sesión</h1>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {!showUbeForm ? (
          <div className="space-y-4">
            <button
              onClick={handleUbeLogin}
              className="w-full px-4 py-3 border border-gray-300 rounded-full flex items-center justify-center space-x-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Universidad_Bolivariana_del_Ecuador_logo_1.svg"
                  alt="Logo UBE"
                  width={20}
                  height={20}
                  className="mr-2"
              />
              <span>Iniciar sesión con UBE</span>
            </button>

            <button
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
              className="w-full px-4 py-3 border border-gray-300 rounded-full flex items-center justify-center space-x-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>{loadingGoogle ? 'Conectando...' : 'Iniciar sesión con Google'}</span>
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={loadingGoogle}
              className="w-full px-4 py-3 border border-gray-300 rounded-full flex items-center justify-center space-x-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FacebookIcon className="w-5 h-5" />
              <span>{loadingGoogle ? 'Conectando...' : 'Iniciar sesión con Facebook'}</span>
            </button>
          </div>
        ) : (
          <AuthForm />
        )}

        {/* Enlaces de términos y privacidad */}
        <div className="text-center text-xs text-gray-500 flex gap-4 justify-center align-middle">
            <Link href="/terms" className="text-gray-600 underline hover:text-sky-500">
              Términos de uso
            </Link>{' '}
            |
            <Link href="/privacy" className="text-gray-600 underline hover:text-sky-500">
              Política de privacidad
            </Link>
        </div>
      </div>
    </div>
  );
}