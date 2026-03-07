"use client"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

/**
 * NavbarCenter Component
 * ======================
 * Displays the main navigation menu in the center of the navbar.
 * Features:
 * - Uses shadcn NavigationMenu component
 * - Supports dropdown menus (Activities, Learn)
 * - Works on hover (desktop) and click (mobile)
 * - Fully responsive and accessible
 *
 * Menu Items:
 * - Home (simple link)
 * - About (simple link)
 * - Activities (with dropdown)
 * - Learn (with dropdown)
 * - Partners (simple link)
 *
 * Fix:
 * - Uses asChild on NavigationMenuLink to avoid <a> inside <a> HTML error
 */

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Activities',
    submenu: [
      { label: 'Community Events', href: '/activities/events' },
      { label: 'Workshops', href: '/activities/workshops' },
      { label: 'Network Meetups', href: '/activities/meetups' },
    ],
  },
  {
    label: 'Learn',
    submenu: [
      { label: 'Tutorials', href: '/learn/tutorials' },
      { label: 'Documentation', href: '/learn/docs' },
      { label: 'Resources', href: '/learn/resources' },
    ],
  },
  { label: 'Partners', href: '/partners' },
]

/**
 * Helper component to render submenu items
 * Fix: Uses NavigationMenuLink with asChild to avoid nested <a>
 */
function SubmenuItem({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <NavigationMenuLink asChild>
      <a
        href={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none">{label}</div>
      </a>
    </NavigationMenuLink>
  )
}

export function NavbarCenter() {
  return (
    <nav className="hidden lg:block" suppressHydrationWarning>
      {/* Navigation Menu - Only visible on large screens */}
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          {menuItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              {/* Simple Link Item */}
              {'href' in item && item.href ? (
                <NavigationMenuLink asChild>
                  <a href={item.href} className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </a>
                </NavigationMenuLink>
              ) : (
                <>
                  {/* Dropdown Trigger */}
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>

                  {/* Dropdown Content */}
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.submenu?.map((subitem) => (
                        <SubmenuItem
                          key={subitem.href}
                          href={subitem.href}
                          label={subitem.label}
                        />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}