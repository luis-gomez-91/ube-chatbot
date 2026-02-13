import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mi Chatbot IA',
  description: 'Chatbot inteligente construido con Next.js y Tailwind CSS',
  keywords: 'chatbot, IA, inteligencia artificial, asistente virtual',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased min-h-screen font-sans">
        {/* Header opcional */}
        {/* <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Mi Asistente IA
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Inicio
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Ayuda
                </a>
              </nav>
            </div>
          </div>
        </header> */}

        {/* Contenido principal */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer opcional */}
        {/* <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-600">
                © 2024 Mi Chatbot IA. Todos los derechos reservados.
              </div>
              <div className="flex space-x-6 text-sm text-gray-600">
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Política de Privacidad
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Términos de Uso
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </footer> */}
      </body>
    </html>
  );
}