
import React from 'react';

interface DiffViewerProps {
  diff: string;
}

export default function DiffViewer({ diff }: DiffViewerProps) {
  const lines = diff.split('\n');
  
  return (
    <div className="bg-[#020410] rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
      {lines.map((line, i) => (
        <div
          key={i}
          className={`
            ${line.startsWith('+') ? 'bg-green-900/30 text-[#39FF14]' : ''}
            ${line.startsWith('-') ? 'bg-red-900/30 text-red-400' : ''}
            ${line.startsWith('@@') ? 'text-[#0066FF] font-bold' : ''}
            ${!line.startsWith('+') && !line.startsWith('-') && !line.startsWith('@@') ? 'text-gray-400' : ''}
            px-2 py-1
          `}
        >
          {line || ' '}
        </div>
      ))}
    </div>
  );
}
