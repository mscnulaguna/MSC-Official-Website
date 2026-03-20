/**
 * Navigation Configuration
 * =======================
 * Single source of truth for all navigation items across desktop, tablet, and mobile.
 * Update this file once, and all navbar implementations automatically use the same structure.
 */

export interface NavItem {
  label: string
  href?: string
  submenu?: NavItem[]
}

export const NAV_ITEMS: NavItem[] = [
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
