// ========================================================================
// Tag Input Component
// ========================================================================

"use client";

import * as React from "react";
import { X, Tag } from "lucide-react";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Add tags...",
  maxTags = 10,
  maxLength = 50,
  className = "",
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Validate tag format
  const validateTag = (tag: string): string | null => {
    const trimmed = tag.trim();

    if (!trimmed) {
      return "Tag cannot be empty";
    }

    if (!trimmed.startsWith("#")) {
      return "Tag must start with #";
    }

    if (trimmed.length > maxLength) {
      return `Tag must be ${maxLength} characters or less`;
    }

    if (value.length >= maxTags) {
      return `Maximum ${maxTags} tags allowed`;
    }

    if (value.map(t => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      return "Tag already exists";
    }

    // Allow only letters, numbers, and underscores after #
    const tagPattern = /^#[a-zA-Z0-9_]+$/;
    if (!tagPattern.test(trimmed)) {
      return "Tag can only contain letters, numbers, and underscores";
    }

    return null;
  };

  const addTag = () => {
    setError(null);

    if (!inputValue.trim()) return;

    const validationError = validateTag(inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newTag = inputValue.trim().startsWith("#")
      ? inputValue.trim()
      : `#${inputValue.trim()}`;

    onChange([...value, newTag]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    // Handle multiple tags pasted (comma or space separated)
    const potentialTags = pastedText
      .split(/[,\s]+/)
      .filter((tag) => tag.trim());

    let addedCount = 0;
    for (const tag of potentialTags) {
      if (value.length + addedCount >= maxTags) break;

      const tagToAdd = tag.startsWith("#") ? tag : `#${tag}`;
      if (!validateTag(tagToAdd)) {
        onChange([...value, tagToAdd]);
        addedCount++;
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Existing tags */}
        {value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className={`
              inline-flex items-center gap-1 px-2 py-1 text-sm font-medium
              rounded-md bg-blue-50 text-blue-700 border border-blue-200
              animate-fade-in
            `}
          >
            <Tag className="w-3 h-3" />
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 p-0.5 rounded hover:bg-blue-100 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {/* Input field */}
        {!disabled && value.length < maxTags && (
          <div className="flex-1 min-w-[120px]">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={addTag}
              placeholder={value.length === 0 ? placeholder : ""}
              className={`
                w-full px-3 py-1.5 text-sm bg-transparent border rounded-md
                placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${error ? "border-red-300 focus:ring-red-500" : "border-gray-300"}
              `}
            />
          </div>
        )}
      </div>

      {/* Help text and error */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {value.length}/{maxTags} tags • Press Enter or comma to add
        </p>

        {error && (
          <p className="text-xs text-red-600 animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// Preset Tags Quick Add
// ========================================================================

interface PresetTagsProps {
  onSelect: (tag: string) => void;
  disabled?: boolean;
}

const presetTags = [
  { tag: "#urgent", color: "bg-red-100 text-red-700 border-red-200" },
  { tag: "#meeting", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { tag: "#personal", color: "bg-green-100 text-green-700 border-green-200" },
  { tag: "#work", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { tag: "#ideas", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
];

export function PresetTags({ onSelect, disabled }: PresetTagsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {presetTags.map(({ tag, color }) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(tag)}
          disabled={disabled}
          className={`
            inline-flex items-center px-2 py-0.5 text-xs font-medium rounded
            border transition-colors
            ${color}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}
          `}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
