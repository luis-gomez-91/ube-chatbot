// components/ChatInput.tsx
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatInputProps } from '../types/chat';

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, setInputValue, sendMessage, isLoading, themeClasses }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className={`w-full p-4 pr-12 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${themeClasses.inputArea}`}
              rows={1}
              disabled={isLoading}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
            
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className={`absolute right-2 bottom-4 p-2 ${themeClasses.sendButton} rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100`}
              title="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className={`text-xs ${themeClasses.sidebarSecondary} mt-2 text-center`}>
          Presiona Enter para enviar, Shift + Enter para nueva línea
        </div>
      </div>
    </div>
  );
};

export default ChatInput;