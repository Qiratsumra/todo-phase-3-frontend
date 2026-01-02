
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id?: number;
  name?: string;
  size?: string;
  file_name?: string;
  file_url?: string;
  created_at?: string;
}

export interface ApiTask {
  id: number;
  title: string;
  description?: string;
  status: "pending" | "completed";
  due_date?: string;
  priority: string; // "low", "medium", "high"
  project?: { id: number; name: string };
  tags?: string[];
  subtasks?: ApiTask[];
  attachments?: { id: number; file_name: string; file_url: string; created_at: string }[];
  comments?: { id: number; content: string; user_id: number; created_at: string }[];
  recurrence?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  parent_task_id?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority?: "High" | "Medium" | "Low";
  project?: string;
  tags?: string[];
  subtasks?: Subtask[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export type FilterType = "all" | "completed" | "pending" | "dueSoon" | "highPriority" | "High" | "Medium" | "Low";

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
}

export * from './chat';