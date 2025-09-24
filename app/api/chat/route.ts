// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId } = body;

    if (!message) return NextResponse.json({ error: 'El mensaje es requerido' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'El userId es requerido' }, { status: 400 });

    // Llamada a FastAPI
    const response = await fetch(`${process.env.FASTAPI_BASE_URL}/ventas/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId }),
    });

    const fastApiResponse = await response.json();

    return NextResponse.json({
      response: fastApiResponse.respuesta || null,
      error: fastApiResponse.error || null,
      metadata: { timestamp: new Date().toISOString(), userId }
    });
    
  } catch (error) {
    console.error('Error en API de chat:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'API de chat funcionando correctamente',
    timestamp: new Date().toISOString()
  });
}
