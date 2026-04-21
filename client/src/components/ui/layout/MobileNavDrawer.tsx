import { useId, useMemo, useState } from 'react'
import { ChevronDown, Menu, Search, LogOut } from 'lucide-react'
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import circleHalfBlackSvg from '@/assets/icons/circle-half-black.svg?raw'
import { useTheme } from '@/context/ThemeContext'
import { NAV_ITEMS, type NavItem } from '@/config/navigation'
import { Separator } from '@/components/ui/separator'
import { InputGroup } from '../input-group'
import { SearchDialog } from './SearchDialog'

interface MobileNavDrawerProps {
  onNavigate?: () => void
  isLoggedIn?: boolean
}

type CollapsibleNavItemProps = Readonly<{
  item: NavItem
  onNavigate?: () => void
}>

function CollapsibleNavItem({
  item,
  onNavigate,
}: CollapsibleNavItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubmenu = 'submenu' in item

  if (!hasSubmenu) {
    return (
      <a
        href={item.href}
        className="block w-full px-4 py-3 text-base font-normal border-b border-border/40 hover:bg-muted/50 transition-colors"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    )
  }

  return (
    <div className="border-b border-border/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-base font-normal hover:bg-muted/50 transition-colors"
      >
        {item.label}
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="bg-muted/20 space-y-0">
          {item.submenu.map((subitem) => (
            <a
              key={subitem.href}
              href={subitem.href}
              className="block w-full pl-8 pr-4 py-3 text-sm font-normal text-foreground/80 hover:bg-muted/50 hover:text-foreground transition-colors border-b border-border/40 last:border-b-0"
              onClick={onNavigate}
            >
              {subitem.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export function MobileNavDrawer({
  onNavigate,
  isLoggedIn = false,
}: Readonly<MobileNavDrawerProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const instanceId = useId()

  const scopedCircleHalfBlackSvg = useMemo(() => {
    const originalId = 'path-1-inside-1_477_561'
    const safeScope = `msc-${instanceId.replaceAll(':', '')}`
    return circleHalfBlackSvg.replaceAll(originalId, `${safeScope}-${originalId}`)
  }, [instanceId])

  const handleNavigate = () => {
    onNavigate?.()
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      {/* Hamburger Menu Button - Toggles open/close */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 pl-2 sm:pl-0"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Dialog - Same as desktop */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Drawer Content with built-in animation */}
      <DrawerContent
        className="flex flex-col"
      >
        <Separator />
        {/* Search and Theme Toggle Row */}
        <div className="flex items-center gap-3 p-4 border-b border-border/40">
          {/* Search Input - Same as desktop, opens SearchDialog */}
          <button
            type="button"
            className="flex-1"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
          >
            <InputGroup className="w-full bg-muted/50 border border-border/40 cursor-pointer">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <span className="w-full flex-1 pl-9 pr-3 text-left text-sm text-muted-foreground select-none">
                Search...
              </span>
            </InputGroup>
          </button>
          
          {/* Dark/Light toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center cursor-pointer bg-transparent text-foreground transition-colors duration-200"
          >
            <span
              className={
                `inline-flex transition-transform duration-300 [&_svg]:h-5 [&_svg]:w-5 ` +
                (isDarkMode ? 'rotate-180' : 'rotate-0')
              }
              dangerouslySetInnerHTML={{ __html: scopedCircleHalfBlackSvg }}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-0">
            {NAV_ITEMS.map((item) => (
              <CollapsibleNavItem
                key={item.label}
                item={item}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>
        </div>

        {/* Sign Up / Log Out Button - Bottom */}
        <div className="p-4 border-t border-border/40">
          <DrawerClose asChild>
            {!isLoggedIn ? (
              <Button className="w-full" onClick={handleNavigate}>
                Sign Up
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full flex items-center gap-2"
                onClick={handleNavigate}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            )}
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
