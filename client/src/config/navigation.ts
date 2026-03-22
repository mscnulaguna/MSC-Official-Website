/**
 * Navigation Configuration
 * =======================
 * Single source of truth for all navigation items across desktop, tablet, and mobile.
 * Update this file once, and all navbar implementations automatically use the same structure.
 * 
 * Uses discriminated unions to ensure type safety:
 * - NavLink: top-level links with required href
 * - NavGroup: dropdown items with submenu containing NavLink[] (all hrefs required)
 * 
 * This guarantees stable React keys and prevents # navigations.
 */

export interface NavLink {
  type?: 'link'
  label: string
  href: string
}

export interface NavGroup {
  type: 'group'
  label: string
  submenu: NavLink[]
}

export type NavItem = NavLink | NavGroup

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    type: 'group',
    label: 'Activities',
    submenu: [
      { label: 'Community Events', href: '/activities/events' },
      { label: 'Workshops', href: '/activities/workshops' },
      { label: 'Network Meetups', href: '/activities/meetups' },
    ],
  },
  {
    type: 'group',
    label: 'Learn',
    submenu: [
      { label: 'Tutorials', href: '/learn/tutorials' },
      { label: 'Documentation', href: '/learn/docs' },
      { label: 'Resources', href: '/learn/resources' },
    ],
  },
  { label: 'Partners', href: '/partners' },
]
