'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * SearchPopover Component
 * ========================
 * Displays a search icon button that opens a popover with:
 * - Search input field
 * - Selectable search categories
 *
 * Categories include: Articles, Events, Courses, Partners
 * This component is fully accessible and keyboard-friendly.
 */

interface SearchCategory {
  id: string
  label: string
}

const SEARCH_CATEGORIES: SearchCategory[] = [
  { id: 'articles', label: 'Articles' },
  { id: 'events', label: 'Events' },
  { id: 'courses', label: 'Courses' },
  { id: 'partners', label: 'Partners' },
]

export function SearchPopover() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('articles')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual search functionality
    console.log('Search:', { query: searchQuery, category: selectedCategory })
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex flex-col">
          {/* Search Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold">Search</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="border-b p-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" size="sm">
              Search
            </Button>
          </form>

          {/* Category Selection */}
          <div className="p-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Search in:
            </p>
            <div className="space-y-2">
              {SEARCH_CATEGORIES.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-muted"
                >
                  <input
                    type="radio"
                    name="search-category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4"
                    aria-label={`Search in ${category.label}`}
                  />
                  <span className="text-sm">{category.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
