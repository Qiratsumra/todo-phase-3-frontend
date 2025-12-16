/**
 * Chat-related type definitions for the AI chatbot.
 */

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  skill_used?: string | null;
  tool_calls?: ToolCall[];
  created_at: string;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface ChatRequest {
  message: string;
  conversation_id?: number | null;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls: ToolCall[];
  skill_used?: string | null;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ConversationDetail {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export type ChatStatus = "idle" | "loading" | "error";
