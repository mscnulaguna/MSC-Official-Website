'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/mscui/button'
import { ChevronDown } from 'lucide-react'

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
      { label: 'Community Events', href: '/activities/events' },
      { label: 'Workshops', href: '/activities/workshops' },
    ],
  },
  {
    label: 'Learn',
    href: '#',
    submenu: [
      { label: 'Tutorials', href: '/learn/tutorials' },
      { label: 'Documentation', href: '/learn/docs' },
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
        className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
      >
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && item.submenu && (
        <div className="ml-4 space-y-1 border-l border-muted pl-3">
          {item.submenu.map((subitem) => (
            <a
              key={subitem.href}
              href={subitem.href}
              className="block rounded-md px-2 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
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

  const handleNavigate = () => {
    onNavigate?.()
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Drawer Content */}
      <DrawerContent className="max-h-[60vh]">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <CollapsibleNavItem
                key={item.label}
                item={item}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
