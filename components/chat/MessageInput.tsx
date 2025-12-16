"use client";

import { useState, useRef, useEffect, KeyboardEvent, FormEvent } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage("");
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
  <form 
  onSubmit={handleSubmit} 
  className="border-t border-gray-100 bg-white p-4 md:p-6"
>
  <div className="mx-auto flex max-w-4xl items-end gap-3">
    <div className="relative flex-1">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500 disabled:placeholder:text-gray-300"
        style={{ maxHeight: "200px" }}
      />
    </div>
    
    <button
      type="submit"
      disabled={disabled || !message.trim()}
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
      aria-label="Send message"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    </button>
  </div>
  
  <p className="mt-3 text-center text-xs text-gray-500">
    Press <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.7rem]">Enter</kbd> to send,{" "}
    <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.7rem]">Shift</kbd> +{" "}
    <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.7rem]">Enter</kbd> for new line
  </p>
</form>
  );
}

export default MessageInput;






