import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { NAV_ITEMS } from '@/config/navigation'

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
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
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
          {NAV_ITEMS.map((item) => (
            <NavigationMenuItem key={item.label}>
              {/* Simple Link Item */}
              {!item.submenu || item.submenu.length === 0 ? (
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
                          href={subitem.href || '#'}
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