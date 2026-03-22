import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupContent, InputGroupSuffix } from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import circleHalfBlack from "@/assets/icons/circle-half-black.svg"
import { Search } from 'lucide-react'
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
  const iconFilter = isDarkMode ? 'brightness(0) invert(1)' : 'none'

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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
        <div className="hidden sm:flex" onClick={() => setIsSearchOpen(true)}>
          <InputGroup className="w-32 lg:w-40 xl:w-56 cursor-pointer">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <InputGroupContent
              placeholder="Search..."
              className="pl-9 pr-14 cursor-pointer"
              readOnly
            />
            <InputGroupSuffix className="absolute right-2 pointer-events-none">
              <Kbd>Ctrl K</Kbd>
            </InputGroupSuffix>
          </InputGroup>
        </div>

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
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="h-10 w-10"
        >
          <img
            src={circleHalfBlack}
            alt="Theme toggle icon"
            width={24}
            height={24}
            className="object-contain"
            style={{ filter: iconFilter }}
          />
        </Button>

        {/* Desktop Sign In */}
        <Button
          onClick={handleSignIn}
          className="ml-2 hidden px-4 sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white"
        >
          Sign In
        </Button>

        {/* Mobile Sign In */}
        <Button
          onClick={handleSignIn}
          className="ml-1 px-3 sm:hidden bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Sign In
        </Button>
      </div>
    </>
  )
}