"use client";

interface TypingIndicatorProps {
  skillName?: string;
}

export function TypingIndicator({ skillName }: TypingIndicatorProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
        AI
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
        {skillName && (
          <span className="text-xs text-gray-400 ml-2">
            Using {skillName}...
          </span>
        )}
      </div>
    </div>
  );
}

export default TypingIndicator;
