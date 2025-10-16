// app/api/chat/history/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    console.log('=== PROXY HISTORY DEBUG START ===');
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      console.error('Missing authorization header');
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const fullUrl = `${apiUrl}/chat/history/`;

    console.log('Calling URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend success response:', data);
    console.log('=== PROXY HISTORY DEBUG END ===');

    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    console.log('=== PROXY HISTORY DEBUG END (ERROR) ===');
    return NextResponse.json(
      { error: 'Proxy connection failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return NextResponse.json({ 
    message: 'Next.js Chat History Proxy is working',
    timestamp: new Date().toISOString(),
    apiUrl
  });
}