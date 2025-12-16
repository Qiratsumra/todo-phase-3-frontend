"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import { TypingIndicator } from "./TypingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  pendingSkill?: string;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 px-4 py-2 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
          isUser ? "bg-green-500" : "bg-blue-500"
        }`}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Message content */}
      <div
        className={`flex flex-col gap-1 max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser
              ? "bg-blue-500 text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-800 rounded-tl-sm"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Metadata */}
        <div
          className={`flex items-center gap-2 text-xs text-gray-400 ${
            isUser ? "flex-row-reverse" : ""
          }`}
        >
          <span>{formatTime(message.created_at)}</span>
          {message.skill_used && !isUser && (
            <>
              <span>•</span>
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                {message.skill_used}
              </span>
            </>
          )}
          {message.tool_calls && message.tool_calls.length > 0 && (
            <>
              <span>•</span>
              <span className="text-blue-400">
                {message.tool_calls.length} tool
                {message.tool_calls.length !== 1 ? "s" : ""} used
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function MessageList({
  messages,
  isLoading = false,
  pendingSkill,
}: MessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="font-medium text-gray-700 mb-1">Start a conversation</h3>
          <p className="text-sm">
            Ask me to help manage your tasks, get recommendations, or view analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator skillName={pendingSkill} />}
      <div ref={endOfMessagesRef} />
    </div>
  );
}

export default MessageList;
