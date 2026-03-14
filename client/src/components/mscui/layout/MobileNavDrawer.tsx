'use client'

import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/mscui/button'
import { ChevronDown } from 'lucide-react'
import circleHalfWhite from '@/assets/icons/circle-half-white.svg'
import circleHalfBlack from '@/assets/icons/circle-half-black.svg'

/**
 * MobileNavDrawer Component
 * ========================
 * Mobile navigation menu that appears as a drawer.
 * Features:
 * - Hamburger menu button that opens a drawer
 * - Collapsible menu items with dropdown support
 * - Close button and swipe-to-close gesture
 * - Maintains navigation structure from desktop menu
 */

interface NavItem {
  label: string
  href: string
  submenu?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Activities',
    href: '#',
    submenu: [
      { label: 'Events', href: '/activities/events' },
    ],
  },
  {
    label: 'Learn',
    href: '#',
    submenu: [
      { label: 'Guilds', href: '/learn/guilds' },
    ],
  },
  { label: 'Partners', href: '/partners' },
]

interface MobileNavDrawerProps {
  onNavigate?: () => void
}

function CollapsibleNavItem({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubmenu = item.submenu && item.submenu.length > 0

  if (!hasSubmenu) {
    return (
      <a
        href={item.href}
        className="block w-full px-4 py-3 text-base font-medium border-b border-border/40 hover:bg-muted/50 transition-colors"
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
        className="flex w-full items-center justify-between px-4 py-3 text-base font-medium hover:bg-muted/50 transition-colors"
      >
        {item.label}
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && item.submenu && (
        <div className="bg-muted/20 space-y-0">
          {item.submenu.map((subitem) => (
            <a
              key={subitem.href}
              href={subitem.href}
              className="block w-full pl-8 pr-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/50 hover:text-foreground transition-colors border-b border-border/40 last:border-b-0"
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

export function MobileNavDrawer({ onNavigate }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleNavigate = () => {
    onNavigate?.()
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      {/* Hamburger Menu Button - Larger touch target on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 -ml-2 sm:ml-0"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Drawer Content - Full screen sliding panel appearing below navbar */}
      <DrawerContent className="fixed !inset-y-auto !top-16 !left-0 !h-[calc(100vh-64px)] !w-full !max-w-none rounded-none flex flex-col !border-l-0">
        {/* Search and Theme Toggle Row */}
        <div className="flex items-center gap-3 p-4 border-b border-border/40">
          {/* Search bar - 3/4 width */}
          <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent outline-none text-sm flex-1 placeholder-muted-foreground"
            />
          </div>
          
          {/* Dark/Light toggle - 1/4 width */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <img
                src={circleHalfWhite}
                alt="Dark mode"
                width={20}
                height={20}
                className="object-contain"
              />
            ) : (
              <img
                src={circleHalfBlack}
                alt="Light mode"
                width={20}
                height={20}
                className="object-contain"
              />
            )}
          </Button>
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

        {/* Close Button - Bottom */}
        <div className="p-4 border-t border-border/40">
          <DrawerClose asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
