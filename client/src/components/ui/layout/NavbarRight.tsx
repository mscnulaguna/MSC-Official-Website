import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupSuffix } from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import { Search } from 'lucide-react'
import circleHalfBlackSvg from '@/assets/icons/circle-half-black.svg?raw'
import { SearchDialog } from './SearchDialog'
import { useTheme } from '@/context/ThemeContext'

/**
 * NavbarRight Component
 * ====================
 * Right section of navbar:
 * - Search input with Ctrl+K shortcut
 * - Theme toggle
 * - Sign In button
 *
 * FEATURES:
 * - Desktop: Search input with KBD shortcut
 * - Mobile: Search icon button
 * - Keyboard shortcut: Ctrl+K or Cmd+K
 */

export function NavbarRight() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown)
    return () => globalThis.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSignIn = () => {
    console.log('Sign in clicked')
  }

  return (
    <>
      {/* Search Dialog - Controlled by Ctrl+K */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop Search Input Group */}
        <button
          type="button"
          className="hidden sm:flex"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Open search"
        >
          <InputGroup className="w-32 lg:w-40 xl:w-56 cursor-pointer">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <span className="w-full flex-1 pl-9 pr-14 text-left text-sm text-muted-foreground select-none">
              Search...
            </span>
            <InputGroupSuffix className="absolute right-2 pointer-events-none">
              <Kbd>Ctrl K</Kbd>
            </InputGroupSuffix>
          </InputGroup>
        </button>

        {/* Mobile Search Icon Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden h-10 w-10"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className={
            `inline-flex h-10 w-10 items-center justify-center cursor-pointer bg-transparent transition-colors duration-200 ` +
            `hover:text-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ` +
            `text-foreground`
          }
        >
          <span
            className={
              `inline-flex transition-transform duration-300 [&_svg]:h-5 [&_svg]:w-5 ` +
              (isDarkMode ? 'rotate-180' : 'rotate-0')
            }
            // SVG uses `currentColor` so Tailwind `text-*` tokens apply.
            dangerouslySetInnerHTML={{ __html: circleHalfBlackSvg }}
          />
        </button>

        {/* Desktop Sign In */}
        <Button
          onClick={handleSignIn}
          className="cursor-pointer ml-2 hidden sm:inline-flex"
        >
          Sign In
        </Button>

        {/* Mobile Sign In */}
        <Button
          onClick={handleSignIn}
          size="sm"
          className="ml-1 sm:hidden"
        >
          Sign In
        </Button>
      </div>
    </>
  )
}