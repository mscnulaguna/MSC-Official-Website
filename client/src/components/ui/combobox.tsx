import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Combobox Component
 * ==================
 *
 * Searchable select dropdown.
 * Customized to match MSC Design System.
 * Keyboard navigable with accessible labels.
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

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <div className="w-full relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        {selectedLabel}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-white rounded-lg shadow-lg z-50">
          <Input
            placeholder="Search options..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-0 border-b border-border rounded-none m-0 rounded-t-lg"
          />
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">No options found.</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onValueChange?.(option.value)
                    setOpen(false)
                    setSearchValue("")
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center justify-between transition-colors",
                    value === option.value && "bg-blue-100"
                  )}
                >
                  {option.label}
                  {value === option.value && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
