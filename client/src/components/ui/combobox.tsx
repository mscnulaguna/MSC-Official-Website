import * as React from "react"
import { createPortal } from "react-dom"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Combobox Component
 * ==================
 *
 * Searchable select dropdown with Portal rendering.
 * Customized to match MSC Design System.
 * Fully keyboard navigable with ARIA accessibility.
 * 
 * Features:
 * - Portal rendering to avoid z-index issues
 * - Arrow Up/Down for keyboard navigation
 * - Enter to select, Escape to close
 * - ARIA attributes for screen readers
 * - aria-activedescendant for current selection
 */

interface ComboboxOption {
  label: string
  value: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [keyboardIndex, setKeyboardIndex] = React.useState(-1)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Reset keyboard index when filtered options change
  React.useEffect(() => {
    setKeyboardIndex(-1)
  }, [searchValue])

  // Focus input when dropdown opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setKeyboardIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setKeyboardIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (keyboardIndex >= 0 && filteredOptions[keyboardIndex]) {
          onValueChange?.(filteredOptions[keyboardIndex].value)
          setOpen(false)
          setSearchValue("")
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        setKeyboardIndex(-1)
        break
      default:
        break
    }
  }

  // Get trigger button position for dropdown positioning
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null)

  React.useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect())
    }
  }, [open])

  const dropdownContent = open && (
    <div
      ref={dropdownRef}
      role="listbox"
      className="border border-border bg-white rounded-none shadow-lg z-50 w-full"
      style={
        triggerRect
          ? {
              position: "fixed",
              top: `${triggerRect.bottom + 8}px`,
              left: `${triggerRect.left}px`,
              width: `${triggerRect.width}px`,
            }
          : undefined
      }
    >
      <Input
        ref={inputRef}
        placeholder="Search options..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border-0 border-b border-border rounded-none m-0"
        aria-label="Search options"
        aria-controls="combobox-options"
        aria-autocomplete="list"
      />
      <div
        id="combobox-options"
        className="max-h-48 overflow-y-auto"
        role="region"
        aria-label="Available options"
      >
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            No options found.
          </div>
        ) : (
          filteredOptions.map((option, index) => (
            <button
              key={option.value}
              id={`option-${option.value}`}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onValueChange?.(option.value)
                setOpen(false)
                setSearchValue("")
                setKeyboardIndex(-1)
              }}
              onMouseEnter={() => setKeyboardIndex(index)}
              className={cn(
                "w-full px-4 py-2 text-left text-sm flex items-center justify-between transition-colors focus:outline-none",
                index === keyboardIndex && "bg-gray-100",
                value === option.value && "bg-blue-100 font-medium"
              )}
            >
              {option.label}
              {value === option.value && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-controls="combobox-options"
        aria-activedescendant={
          keyboardIndex >= 0
            ? `option-${filteredOptions[keyboardIndex]?.value}`
            : undefined
        }
        aria-haspopup="listbox"
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        {selectedLabel}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Portal rendering to avoid z-index and overflow issues */}
      {typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </>
  )
}
