import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'javascript', className = '' }: CodeBlockProps) {
  return (
    <div className={`relative bg-gray-900 rounded-lg p-4 overflow-x-auto ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{language}</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
      <pre className="text-sm text-gray-100 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}