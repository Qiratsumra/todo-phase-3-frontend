// ========================================================================
// Priority Select Component
// ========================================================================

"use client";

import * as React from "react";
import {
  AlertCircle,
  Clock,
  Circle,
  ChevronDown,
} from "lucide-react";

export interface PrioritySelectProps {
  value?: "High" | "Medium" | "Low" | "";
  onChange: (value: "High" | "Medium" | "Low" | "") => void;
  className?: string;
  disabled?: boolean;
}

const priorities = [
  { value: "High", label: "High Priority", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: AlertCircle },
  { value: "Medium", label: "Medium Priority", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", icon: Clock },
  { value: "Low", label: "Low Priority", color: "text-green-600", bg: "bg-green-50 border-green-200", icon: Circle },
] as const;

export function PrioritySelect({
  value,
  onChange,
  className = "",
  disabled = false,
}: PrioritySelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedPriority = priorities.find((p) => p.value === value);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2 w-full px-3 py-2 text-sm font-medium
          rounded-lg border transition-all duration-200
          ${selectedPriority
            ? `${selectedPriority.bg} ${selectedPriority.color} border`
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div className="flex items-center gap-2">
          {selectedPriority ? (
            <>
              <selectedPriority.icon className="w-4 h-4" />
              <span>{selectedPriority.label}</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Set priority</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 py-1 bg-white rounded-lg border border-gray-200 shadow-lg animate-fade-in">
          {/* Clear option */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Circle className="w-4 h-4 text-gray-400" />
            <span>No priority</span>
          </button>

          {/* Priority options */}
          {priorities.map((priority) => (
            <button
              key={priority.value}
              type="button"
              onClick={() => {
                onChange(priority.value as "High" | "Medium" | "Low");
                setIsOpen(false);
              }}
              className={`
                flex items-center gap-2 w-full px-3 py-2 text-sm font-medium
                transition-colors
                ${value === priority.value
                  ? `${priority.bg} ${priority.color}`
                  : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <priority.icon className="w-4 h-4" />
              <span>{priority.label}</span>
              {value === priority.value && (
                <span className="ml-auto text-xs opacity-75">Selected</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
