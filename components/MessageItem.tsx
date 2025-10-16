// components/MessageItem.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import { Bot } from 'lucide-react';
import { MessageItemProps } from '../types/chat';

const ReactMarkdown = dynamic(() => import('react-markdown'), { 
  ssr: false,
  loading: () => <p>Cargando...</p>
});

const MessageItem: React.FC<MessageItemProps> = ({ message, themeClasses }) => {
  return (
    <div
      key={message.id}
      // className={`group px-4 py-6 ${message.sender === 'user' ? '' : themeClasses.messageContainer} transition-colors duration-200`} AQUI
      className={`group px-4 py-6 transition-colors duration-200`}
    >
      <div className={`flex items-start space-x-4 max-w-full ${message.sender === 'user' ? 'justify-end' : ''}`}>
        
        {/* Ícono del Bot */}
        {message.sender === 'bot' && (
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Message Content */}
        <div className={`${message.sender === 'user' ? 'max-w-xs sm:max-w-md' : 'flex-1 min-w-0'}`}>
          {/* Nombre del remitente */}
          {message.sender === 'bot' && (
             <div className={`text-sm font-semibold mb-1 ${themeClasses.sidebarText}`}>
               Asistente UBE
             </div>
          )}

          {/* Message Text */}
          <div className={`${message.sender === 'bot' ? themeClasses.botMessage : ''}`}>
            {message.sender === 'bot' ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    code: ({ node, children, ...props }) => (
                      <code className={`${themeClasses.markdown.code} px-2 py-1 rounded text-sm`} {...props}>{children}</code>
                    ),
                    pre: ({ children, ...props }) => (
                      <pre className={`${themeClasses.markdown.pre} p-4 rounded-lg overflow-x-auto text-sm my-3`} {...props}>{children}</pre>
                    ),
                    strong: ({ children }) => <strong className={`font-semibold ${themeClasses.markdown.strong}`}>{children}</strong>,
                    em: ({ children }) => <em className={`italic ${themeClasses.markdown.em}`}>{children}</em>,
                    h1: ({ children }) => <h1 className={`text-xl font-bold mb-3 ${themeClasses.markdown.heading}`}>{children}</h1>,
                    h2: ({ children }) => <h2 className={`text-lg font-bold mb-2 ${themeClasses.markdown.heading}`}>{children}</h2>,
                    h3: ({ children }) => <h3 className={`text-base font-bold mb-2 ${themeClasses.markdown.heading}`}>{children}</h3>,
                    blockquote: ({ children }) => (
                      <blockquote className={`border-l-4 ${themeClasses.markdown.blockquote} pl-4 italic my-3`}>{children}</blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a href={href} className={`${themeClasses.markdown.link} underline`} target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            ) : (
              // Mensaje de usuario
              <div className={`${themeClasses.userMessage} px-4 py-3 rounded-2xl inline-block`}>
                <div className="whitespace-pre-wrap leading-relaxed text-sm">
                  {message.text}
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MessageItem;