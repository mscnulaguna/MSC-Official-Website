import { useEffect, useId, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupSuffix } from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import { Search, LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import circleHalfBlackSvg from '@/assets/icons/circle-half-black.svg?raw'
import { SearchDialog } from './SearchDialog'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { getInitials } from '@/lib/utils'
import { useAuth } from '@/context/authContext'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function NavbarRight() {
  const { isLoggedIn, user, logout } = useAuth()
  const userName = user?.fullName ?? ''

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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
          <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <PopoverTrigger asChild>
              <Avatar
                className="h-10 w-10 border-2 border-primary cursor-pointer"
                onMouseEnter={() => setIsProfileOpen(true)}
              >
                <AvatarFallback className="font-semibold">{getInitials(userName)}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-48 p-1 rounded-none"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:text-primary transition-colors"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <div className="h-px bg-border my-1" />
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:text-warning transition-colors"
                onClick={() => {
                  logout()
                  window.location.href = '/'
                }}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </>
  )
}