import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { Menu, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import placeholdersnowSvg from '@/assets/shapes/placeholdersnow.svg'
import mscLogoFooterBlack from '@/assets/logos/msclogofooterblack.svg'
import mscLogoFooterWhite from '@/assets/logos/msclogofooterwhite.svg'
import circleHalfBlackSvg from '@/assets/icons/circle-half-black.svg?raw'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupSuffix } from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import { SidebarNav } from '@/components/ui/sidebar'
import { SearchDialog } from './SearchDialog'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTheme } from '@/context/ThemeContext'
import { getInitials } from '@/lib/utils'

type AdminNavItem = Readonly<{
  label: string
  href?: string
}>

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: 'Dashboard' },
  { label: 'Members', href: '/admin/members' },
  { label: 'Guilds' },
  { label: 'Events', href: '/admin/event-status' },
  { label: 'Partners', href: '/admin/add-partners' },
]

const ADMIN_DRAWER_STATE_KEY = 'msc-admin-drawer-open'

function AdminNavIcon({ className = '' }: { className?: string }) {
  return (
    <img src={placeholdersnowSvg} alt="" aria-hidden="true" className={className} />
  )
}

function AdminDrawerLogo() {
  const { isDarkMode } = useTheme()

  return <img src={isDarkMode ? mscLogoFooterWhite : mscLogoFooterBlack} alt="Microsoft Student Community" className="h-10 w-auto object-contain" />
}

function AdminNavLinks({
  pathname,
  onNavigate,
  mobile = false,
}: Readonly<{
  pathname: string
  onNavigate?: () => void
  mobile?: boolean
}>) {
  return (
    <SidebarNav className="space-y-2">
      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive = item.href
          ? pathname === item.href || pathname.startsWith(`${item.href}/`)
          : false

        const baseClasses = [
          'flex items-center gap-3 rounded-none px-4 py-3 text-sm font-medium transition-colors',
          isActive
            ? 'bg-muted text-[var(--color-brand-blue)]'
            : 'text-foreground/90 hover:bg-muted/70 hover:text-foreground',
          !item.href ? 'cursor-default opacity-60' : '',
          mobile ? 'px-5 py-4 text-base' : '',
        ]
          .filter(Boolean)
          .join(' ')

        if (!item.href) {
          return (
            <div key={item.label} className={baseClasses} aria-disabled="true">
              <AdminNavIcon className="h-6 w-6 shrink-0" />
              <span>{item.label}</span>
            </div>
          )
        }

        return (
          <Link
            key={item.label}
            to={item.href}
            onClick={onNavigate}
            className={baseClasses}
          >
            <AdminNavIcon className="h-6 w-6 shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </SidebarNav>
  )
}

function ThemeToggleButton() {
  // TS6133 fix: removed unused isDarkMode
  const { toggleDarkMode } = useTheme()
  const instanceId = useId()

  const scopedCircleHalfBlackSvg = useMemo(() => {
    const originalId = 'path-1-inside-1_477_561'
    const safeScope = `msc-${instanceId.replaceAll(':', '')}`
    return circleHalfBlackSvg.replaceAll(originalId, `${safeScope}-${originalId}`)
  }, [instanceId])

  return (
    <Button
      type="button"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      variant="ghost"
      size="icon"
      className={
        `bg-transparent transition-colors duration-200 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground`
      }
    >
      <span
        // SVG uses `currentColor` so Tailwind `text-*` tokens apply.
        dangerouslySetInnerHTML={{ __html: scopedCircleHalfBlackSvg }}
      />
    </Button>
  )
}

export function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const isMobile = useIsMobile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false

    const savedState = window.localStorage.getItem(ADMIN_DRAWER_STATE_KEY)
    return savedState === 'true'
  })
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
      window.localStorage.removeItem(ADMIN_DRAWER_STATE_KEY)
      return
    }

    const savedState = window.localStorage.getItem(ADMIN_DRAWER_STATE_KEY)
    if (savedState !== null) {
      setIsMobileMenuOpen(savedState === 'true')
    }
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) {
      window.localStorage.setItem(ADMIN_DRAWER_STATE_KEY, String(isMobileMenuOpen))
    }
  }, [isMobileMenuOpen, isMobile])

  const searchItems = pathname.startsWith('/admin') ? ADMIN_NAV_ITEMS : undefined

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown)
    return () => globalThis.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavigate = () => {
    if (isMobile) setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen overflow-x-hidden">
        <aside
          className={`border-r border-border bg-background transition-[width,left] duration-300 ease-out overflow-hidden ${
            isMobileMenuOpen
              ? 'fixed inset-x-0 top-16 z-40 h-[calc(100vh-4rem)] w-full md:relative md:top-0 md:z-auto md:h-auto md:w-72 md:shrink-0'
              : 'hidden w-0 md:relative md:top-0 md:z-auto md:block md:h-auto md:w-0 md:shrink-0'
          }`}
        >
          <div className="flex h-full min-h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-6 py-3">
              <AdminDrawerLogo />
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5">
              <AdminNavLinks
                pathname={pathname}
                onNavigate={handleNavigate}
                mobile={isMobile}
              />
            </div>

          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                aria-label="Toggle admin menu"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2 sm:gap-3">
                <SearchDialog
                  open={isSearchOpen}
                  onOpenChange={setIsSearchOpen}
                  items={searchItems}
                />

                <Button
                  type="button"
                  variant="ghost"
                  className="hidden sm:flex"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open search"
                >
                  <InputGroup className="w-32 cursor-pointer lg:w-40 xl:w-56">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <span className="w-full flex-1 select-none pl-9 pr-14 text-left text-sm text-muted-foreground">
                      Search...
                    </span>
                    <InputGroupSuffix className="pointer-events-none absolute right-2">
                      <Kbd>Ctrl K</Kbd>
                    </InputGroupSuffix>
                  </InputGroup>
                </Button>

                <Button
                  type="button"
                    variant="ghost"
                    size="icon"
                    className="sm:hidden"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </Button>

                <ThemeToggleButton />

                  <Button
                  type="button"
                    variant="ghost"
                    className="flex items-center gap-3 pl-3 transition-opacity hover:opacity-80"
                  aria-label="Open profile menu"
                >
                  <Avatar>
                    <AvatarFallback>
                      {getInitials('Carl')}
                    </AvatarFallback>
                  </Avatar>
                  </Button>
              </div>
            </div>
          </header>

          <main className="min-h-[calc(100vh-4rem)] bg-background">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}