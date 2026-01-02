"use client";
import React from "react";
import { LayoutList } from "lucide-react";
import TaskItem from "./Task-item";
import { Task } from "@/types";

interface MainContentProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  title?: string;
}

const MainContent = ({
  tasks,
  onTaskSelect,
  onToggleComplete,
  title = "Tasks"
}: MainContentProps) => {
  return (
    <main className="px-4 md:px-8 pb-8 bg-gray-50 min-h-full">
      {/* Task List */}
      <div className="space-y-3 pb-20 md:pb-0">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onSelect={onTaskSelect}
              onToggleComplete={onToggleComplete}
            />
          ))
        ) : (
          /* Empty State for better UX */
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
            <LayoutList className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Create a new task to get started</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;