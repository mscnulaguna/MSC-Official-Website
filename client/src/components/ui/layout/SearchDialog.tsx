import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupContent,
  InputGroupPrefix,
  InputGroupSuffix,
} from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import { ChevronDown, Check, Search } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

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

type SearchDialogProps = Readonly<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>

export function SearchDialog({
  open,
  onOpenChange,
}: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Use controlled state if provided, otherwise use internal state
  const dialogOpen = open ?? isOpen
  const setDialogOpen = onOpenChange ?? setIsOpen

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
  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
      <DialogContent className="max-w-2xl px-6 pb-6 pt-10">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search through components, hooks, icons, and patterns
        </DialogDescription>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* SEARCH INPUT */}
          <InputGroup className="h-12 border border-input px-0 py-0 transition-colors duration-200 focus-within:border-2 focus-within:border-ring focus-within:ring-0 focus-within:ring-offset-0">
            <InputGroupPrefix>
              <Search className="h-4 w-4 text-muted-foreground" />
            </InputGroupPrefix>
            <InputGroupContent
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="px-0 pl-9 pr-14 text-base"
            />
            <InputGroupSuffix>
              <Kbd>ESC</Kbd>
            </InputGroupSuffix>
          </InputGroup>

          <Separator />

          {/* FILTER SECTION */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-sm text-foreground transition-colors duration-200 hover:text-primary cursor-pointer outline-none ring-0 ring-offset-0 focus:outline-none focus-visible:outline-none"
              aria-expanded={isDropdownOpen}
            >
              <span className="font-medium">Filter:</span>
              <span className="text-muted-foreground font-normal">{selectedCategoryLabel}</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-none bg-background border border-border/40 shadow-none">
                <div className="py-1">
                  {SEARCH_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategorySelect(category.id)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors outline-none ring-0 ring-offset-0 focus:outline-none focus-visible:outline-none ${
                        selectedCategory === category.id
                          ? 'text-primary font-medium'
                          : 'text-foreground hover:text-primary'
                      }`}
                    >
                      {category.label}
                      {selectedCategory === category.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help text */}
          <p className="pt-2 text-xs text-muted-foreground">
            Filter results by category or search across all
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}