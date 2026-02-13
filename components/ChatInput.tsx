// components/ChatInput.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Send, Mic, MicOff, AlertCircle } from 'lucide-react';
import { ChatInputProps } from '../types/chat';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  inputValue, 
  setInputValue, 
  sendMessage, 
  isLoading, 
  themeClasses 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [error, setError] = useState<string>('');
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const interimTranscriptRef = useRef<string>('');

  // Inicializar Speech Recognition
  useEffect(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.log('❌ Speech Recognition no soportado');
        setVoiceSupported(false);
        return;
      }

      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('✅ Escuchando...');
        setIsListening(true);
        setError('');
        finalTranscriptRef.current = '';
        interimTranscriptRef.current = '';
      };

      recognition.onresult = (event: any) => {
        let newInterimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript + ' ';
            console.log('Final:', transcript);
          } else {
            newInterimTranscript += transcript;
            console.log('Interim:', transcript);
          }
        }

        // Actualizar solo el interim, el final ya está guardado
        interimTranscriptRef.current = newInterimTranscript;

        // Mostrar el texto completo (final + interim)
        const displayText = (finalTranscriptRef.current + interimTranscriptRef.current).trim();
        setInputValue(displayText);

        // Limpiar timeout anterior
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        // Detener después de silencio
        if (finalTranscriptRef.current.trim()) {
          silenceTimeoutRef.current = setTimeout(() => {
            console.log('⏸️ Silencio detectado, deteniendo...');
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, 1500);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Error de reconocimiento:', event.error);
        
        if (event.error === 'no-speech') {
          setError('No se detectó sonido. Intenta hablar más cerca.');
        } else if (event.error === 'network') {
          setError('Error de red. Verifica tu conexión.');
        } else if (event.error === 'not-allowed') {
          setError('Permiso de micrófono denegado.');
        } else {
          setError(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('⏹️ Reconocimiento terminado');
        setIsListening(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
      };

      recognitionRef.current = recognition;

    } catch (err) {
      console.error('Error inicializando:', err);
      setVoiceSupported(false);
      setError('No se pudo inicializar el reconocimiento de voz');
    }

    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Cleanup - no se pudo detener');
        }
      }
    };
  }, [setInputValue]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        sendMessage();
      }
    }
  };

  const toggleVoiceInput = () => {
    setError(''); // Limpiar error al intentar de nuevo
    if (!recognitionRef.current) {
      setError('Micrófono no disponible');
      return;
    }

    try {
      if (isListening) {
        console.log('Deteniendo escucha...');
        finalTranscriptRef.current = '';
        interimTranscriptRef.current = '';
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        console.log('Iniciando escucha...');
        finalTranscriptRef.current = '';
        interimTranscriptRef.current = '';
        setInputValue('');
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error('Error al controlar micrófono:', err);
      setError('Error al controlar el micrófono');
    }
  };

  // Limpiar error de voz cuando el usuario escribe
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={isListening ? "El texto aparecerá aquí mientras hablas..." : "Escribe tu mensaje aquí..."}
              className={`w-full p-4 pr-24 border rounded-2xl resize-none focus:outline-none focus:ring-2 transition-all duration-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                isListening 
                  ? 'focus:ring-red-500 border-red-500 bg-red-50 dark:bg-red-900/10' 
                  : 'focus:ring-red-500'
              } ${themeClasses.inputArea}`}
              rows={1}
              disabled={isLoading}
              style={{ minHeight: '56px', maxHeight: '120px', overflow: 'auto' }}
            />
            
            {/* Botón de Micrófono */}
            {voiceSupported && (
              <button
                onClick={toggleVoiceInput}
                disabled={isLoading}
                type="button"
                aria-label={isListening ? 'Detener reconocimiento de voz' : 'Hablar con el micrófono'}
                className={`absolute right-14 bottom-4 p-2.5 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-1 ${
                  isListening 
                    ? 'bg-red-500 text-white scale-110 shadow-lg ring-2 ring-red-400/50' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white'
                }`}
                title={isListening ? "Detener (o espera un momento de silencio)" : "Toca para hablar"}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            )}
            
            {/* Botón de Enviar */}
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              type="button"
              className={`absolute right-2 bottom-4 p-2 ${themeClasses.sendButton} rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100`}
              title="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Errores de voz */}
        {error && (
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Indicaciones */}
        <div className={`text-xs ${themeClasses.sidebarSecondary} mt-2 text-center`}>
          {isListening ? (
            <span className="flex items-center justify-center gap-2 flex-wrap">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden />
              <span>Habla ahora. Se detiene solo tras un momento de silencio, o toca el micrófono para terminar.</span>
            </span>
          ) : (
            <span>
              Enter para enviar
              {voiceSupported && ' · Toca el micrófono para hablar'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;