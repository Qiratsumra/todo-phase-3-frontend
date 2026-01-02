// ========================================================================
// Task Filters Component
// ========================================================================

"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, ArrowUpDown, Search, X, Plus } from "lucide-react";

export interface TaskFilters {
  status: "all" | "pending" | "completed";
  priority: "all" | "high" | "medium" | "low";
  sortBy: "date" | "title" | "priority" | "created";
  sortOrder: "asc" | "desc";
  searchQuery: string;
  hasDueDate: boolean | null;
  tags: string[];
  dueDateRange: { from: string; to: string } | null;
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onSearch?: (query: string) => void;
  onAddTask?: () => void;
  className?: string;
}

const statusOptions = [
  { value: "all", label: "All Tasks" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
];

const sortOptions = [
  { value: "date", label: "Due Date" },
  { value: "title", label: "Title" },
  { value: "priority", label: "Priority" },
  { value: "created", label: "Created" },
];

export function TaskFilters({
  filters,
  onFiltersChange,
  onSearch,
  onAddTask,
  className = "",
}: TaskFiltersProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const updateFilter = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      priority: "all",
      sortBy: "date",
      sortOrder: "desc",
      searchQuery: "",
      hasDueDate: null,
      tags: [],
      dueDateRange: null,
    });
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.searchQuery ||
    filters.hasDueDate !== null ||
    filters.dueDateRange !== null ||
    filters.tags.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.searchQuery}
          onChange={(e) => {
            updateFilter("searchQuery", e.target.value);
            onSearch?.(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {filters.searchQuery && (
          <button
            onClick={() => updateFilter("searchQuery", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter("status", value as TaskFilters["status"])}
        >
          <SelectTrigger className="w-[140px] text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority}
          onValueChange={(value) => updateFilter("priority", value as TaskFilters["priority"])}
        >
          <SelectTrigger className="w-[160px] text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter("sortBy", value as TaskFilters["sortBy"])}
        >
          <SelectTrigger className="w-[140px] text-sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Order Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")
          }
          className="text-sm"
        >
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </Button>

        {/* Advanced Filters Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm"
        >
          <Filter className="w-4 h-4 mr-1" />
          More
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}

        {/* Add Task Button */}
        {onAddTask && (
          <Button
            onClick={onAddTask}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Due Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <Select
                value={filters.hasDueDate === null ? "all" : filters.hasDueDate ? "yes" : "no"}
                onValueChange={(value) =>
                  updateFilter(
                    "hasDueDate",
                    value === "all" ? null : value === "yes"
                  )
                }
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="yes">Has due date</SelectItem>
                  <SelectItem value="no">No due date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Date Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quick Dates
              </label>
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const today = new Date().toISOString().split("T")[0];
                    updateFilter("dueDateRange", { from: today, to: today });
                  }}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    updateFilter("dueDateRange", {
                      from: tomorrow.toISOString().split("T")[0],
                      to: tomorrow.toISOString().split("T")[0],
                    });
                  }}
                >
                  Tomorrow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const sevenDaysFromNow = new Date(today);
                    sevenDaysFromNow.setDate(today.getDate() + 7);
                    sevenDaysFromNow.setHours(23, 59, 59, 999);
                    updateFilter("dueDateRange", {
                      from: today.toISOString().split("T")[0],
                      to: sevenDaysFromNow.toISOString().split("T")[0],
                    });
                  }}
                >
                  Due Soon (7 days)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const endOfWeek = new Date(today);
                    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
                    endOfWeek.setHours(23, 59, 59, 999);
                    updateFilter("dueDateRange", {
                      from: today.toISOString().split("T")[0],
                      to: endOfWeek.toISOString().split("T")[0],
                    });
                  }}
                >
                  This Week
                </Button>
              </div>
            </div>

            {/* Active Filters Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Active Filters
              </label>
              <div className="flex flex-wrap gap-1">
                {filters.status !== "all" && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">
                    Status: {filters.status}
                  </span>
                )}
                {filters.priority !== "all" && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">
                    Priority: {filters.priority}
                  </span>
                )}
                {filters.hasDueDate !== null && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-700">
                    Due Date: {filters.hasDueDate ? "Set" : "Not set"}
                  </span>
                )}
                {filters.dueDateRange && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700">
                    {filters.dueDateRange.from === filters.dueDateRange.to
                      ? filters.dueDateRange.from
                      : `${filters.dueDateRange.from} to ${filters.dueDateRange.to}`}
                  </span>
                )}
                {filters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-green-100 text-green-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
