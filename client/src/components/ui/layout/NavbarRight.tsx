import { useEffect, useId, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupSuffix } from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import circleHalfBlackSvg from '@/assets/icons/circle-half-black.svg?raw'
import { SearchDialog } from './SearchDialog'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { getInitials } from '@/lib/utils'

export function NavbarRight({
  isLoggedIn = false,
  userName = '',
}: Readonly<{ isLoggedIn?: boolean; userName?: string }>) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const instanceId = useId()

  const scopedCircleHalfBlackSvg = useMemo(() => {
    const originalId = 'path-1-inside-1_477_561'
    const safeScope = `msc-${instanceId.replaceAll(':', '')}`
    return circleHalfBlackSvg.replaceAll(originalId, `${safeScope}-${originalId}`)
  }, [instanceId])

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

  const navigate = useNavigate()
  const handleSignIn = () => {
    navigate('/login')
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
            dangerouslySetInnerHTML={{ __html: scopedCircleHalfBlackSvg }}
          />
        </button>

        {/* Desktop Sign In / User Avatar */}
        {!isLoggedIn ? (
          <>
            <Button
              variant="default"
              onClick={handleSignIn}
            >
              Sign In
            </Button>

            {/* Mobile Sign In */}
            <Button
              variant="default"
              onClick={handleSignIn}
              size="sm"
              className="ml-1 sm:hidden"
            >
              Sign In
            </Button>
          </>
        ) : (
          /* User Avatar Circle - Shows when logged in */
          <Avatar className="h-10 w-10 border-2 border-primary cursor-pointer">
            <AvatarFallback className="font-semibold">{getInitials(userName)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </>
  )
}