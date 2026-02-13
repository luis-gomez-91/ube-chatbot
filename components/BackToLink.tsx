'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type BackToLinkProps = {
  className?: string;
};

export default function BackToLink({ className }: BackToLinkProps) {
  const [href, setHref] = useState<'/auth' | '/chat'>('/auth');
  const [label, setLabel] = useState('Volver al inicio de sesión');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      setHref('/chat');
      setLabel('Volver al chat');
    } else {
      setHref('/auth');
      setLabel('Volver al inicio de sesión');
    }
  }, []);

  return (
    <Link href={href} className={className}>
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
}
