'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/mscui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, Check, Search } from 'lucide-react'

/**
 * SearchDialog Component
 * =======================
 * Minimal search dialog with category filtering.
 *
 * Layout:
 * 1. Search Input
 * 2. Divider
 * 3. Filter Dropdown
 * 4. Help Text
 *
 * Fix Applied:
 * - Added top padding to avoid overlap with Dialog close button
 * - Improved spacing and alignment
 */

const SEARCH_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'blocks', label: 'Blocks' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'icons', label: 'Icons' },
  { id: 'patterns', label: 'Patterns' },
]

export function SearchDialog({ 
  open, 
  onOpenChange 
}: { 
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Use controlled state if provided, otherwise use internal state
  const dialogOpen = open !== undefined ? open : isOpen
  const setDialogOpen = onOpenChange || setIsOpen

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedCategoryLabel =
    SEARCH_CATEGORIES.find((cat) => cat.id === selectedCategory)?.label || 'All'

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  /**
   * Keyboard shortcut handling
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false)
      setDialogOpen(false)
    }
  }

  /**
   * Handle search submit
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Search:', {
      query: searchQuery,
      category: selectedCategory,
    })

    setDialogOpen(false)
    setSearchQuery('')
  }

  /**
   * Select category
   */
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsDropdownOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* Search Icon Button - Only show when not controlled externally */}
      {open === undefined && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </DialogTrigger>
      )}

      {/* Search Dialog */}
      <DialogContent className="max-w-2xl sm:rounded-lg px-6 pb-6 pt-10">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search through components, hooks, icons, and patterns
        </DialogDescription>

        <div className="space-y-4">

          {/* SEARCH INPUT */}
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center h-12">

              {/* Search Icon */}
              <div className="absolute left-3 pointer-events-none flex items-center">
                <Search className="h-5 w-5 opacity-60" />
              </div>

              {/* Input */}
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full pl-10 pr-12 h-12 text-base border border-border/60 rounded-sm bg-background focus:border-primary focus:outline-none"
              />

              {/* ESC Indicator */}
              <div className="absolute right-3 text-xs text-muted-foreground font-medium pointer-events-none">
                ESC
              </div>
            </div>
          </form>

          {/* Divider */}
          <div className="border-t border-border/30" />

          {/* FILTER SECTION */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-expanded={isDropdownOpen}
            >
              <span className="font-medium">Filter:</span>

              <span className="text-muted-foreground">
                {selectedCategoryLabel}
              </span>

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 rounded-sm border border-border/60 bg-background shadow-md z-50">
                <div className="py-1">
                  {SEARCH_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category.label}

                      {selectedCategory === category.id && (
                        <Check size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help text */}
          <p className="text-xs text-muted-foreground pt-2">
            Filter results by category or search across all
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}