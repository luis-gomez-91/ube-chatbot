// Crea este archivo en: app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'luis';

    console.log('=== PROXY DEBUG START ===');
    console.log('Request body:', body);
    
    // Use environment variable with fallback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ube-assistant-production.up.railway.app';
    const fullUrl = `${apiUrl}/ventas/chat?user_id=${userId}`;
    
    console.log('Calling URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Railway response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Railway error:', errorText);
      return NextResponse.json(
        { error: `Railway error: ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Railway success response:', data);
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy connection failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ube-assistant-production.up.railway.app';
  
  return NextResponse.json({ 
    message: 'Next.js Chat Proxy is working',
    timestamp: new Date().toISOString(),
    apiUrl: apiUrl
  });
}