# 🎨 MSC Design System - Master Guide

A comprehensive component library built with **Vite + React**, **TypeScript**, and **Tailwind CSS v4**. Modern, responsive, and fully accessible.

---

## 📚 Quick Navigation

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Key Features](#key-features)
- [Documentation Guides](#documentation-guides)
- [Development](#development)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

**MSC Design System** is a comprehensive, modular component library for building modern web applications. It features:

- ✅ **30+ Pre-built Components** - Buttons, cards, dialogs, forms, navigation, carousels, etc.
- ✅ **Responsive Design** - Mobile-first with custom breakpoints (860px footer, 1024px navbar)
- ✅ **Dark Mode Support** - Theme toggle integrated into navbar with context API
- ✅ **Accessibility First** - WCAG 2.1 compliance, semantic HTML, proper ARIA labels
- ✅ **Production Ready** - Type-safe TypeScript, comprehensive error handling
- ✅ **Developer Friendly** - Clear documentation, consistent patterns, single source of truth for navigation

---

## Project Structure

```
msc-official-website/
├── client/                       # React + Vite frontend
│   ├── src/
│   │   ├── globals.css          # Global styles & CSS variables (Tailwind @layer)
│   │   ├── main.tsx             # Vite entry point - mounts React app
│   │   ├── App.tsx              # Main app router with all page routes
│   │   ├── layout.tsx           # GlobalAppLayout - wraps entire app with Navbar & Toaster
│   │   │
│   │   ├── components/
│   │   │   └── ui/              # MSC Design System components
│   │   │       ├── layout/
│   │   │       │   ├── Navbar.tsx         # Top sticky navigation
│   │   │       │   ├── NavbarWrapper.tsx  # Navbar container
│   │   │       │   ├── Footer.tsx         # Page footer (imported per-page)
│   │   │       │   └── ... (other layout components)
│   │   │       ├── custom/      # Custom composed components
│   │   │       └── ... (30+ UI components)
│   │       │   ├── ToastManager.tsx
│   │       │   ├── AlertDialogBasic.tsx
│   │       │   ├── EventHoverCard.tsx
│   │       │   ├── GreenAlertBox.tsx
│   │       │   ├── InputWithButton.tsx
│   │       │   └── SignInDialog.tsx
│   │       ├── registry/        # Component registry
│   │       │   ├── msc-alert-dialog.tsx
│   │       │   └── index.tsx
│   │       ├── button.tsx       # Button component
│   │       ├── card.tsx        # Card component
│   │       ├── dialog.tsx      # Dialog component
│   │       ├── input.tsx       # Input component
│   │       ├── ... (40+ components)
│   │       └── index.tsx        # Component exports
│   │
│   ├── lib/
│   │   └── utils.ts             # Utility functions (cn, etc.)
│   │
│   └── styles/
│       └── typography.css       # Typography utilities
│
├── public/                       # Static assets
│   ├── msclogo.svg
│   ├── msclogofooter.svg
│   └── ... (other assets)
│
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
├── vite.config.ts
├── tsconfig.json
│
├── BASE_PAGE_TEMPLATE.tsx       # Template for new pages
├── COMPONENTS_README.md         # Component documentation
├── BASE_TEMPLATE_README.md      # Template guide
├── TYPOGRAPHY_README.md         # Typography system guide
└── MASTER_README.md             # This file

```

---

## Getting Started

### Installation

```bash
# Clone repository
git clone <repo-url>
cd msc-official-website/client

# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Open browser
open http://localhost:5173
```

### Creating Your First Page

1. **Use BASE_PAGE_TEMPLATE.tsx** as reference
2. **Create file:** `src/pages/YourPage.tsx`
3. **Add route in App.tsx** to render your page component
4. **Copy structure from template:**

```tsx
import { Layout } from '@/components/ui/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function YourPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-[1700px] px-4 py-8">
        <h1>Your Page Content</h1>
      </main>
    </Layout>
  )
}
```

5. **Register in App.tsx:**

```tsx
import YourPage from '@/pages/YourPage'

// Inside your routing logic
<Route path="/your-page" element={<YourPage />} />
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 md:px-12 py-8">
          <h1 className="heading-h1 mb-4">Your Page Title</h1>
          <p className="body-text">Your content here</p>
        </div>
      </main>

      <Footer />
    </>
  )
}
```

4. **Run development server:**

```bash
npm run dev
```

---

## Key Features

### 1. Navbar Component
- Sticky positioning at top
- Responsive hamburger menu on mobile
- Search with category filtering
- Dark mode toggle
- Sign-in button
- Navigation menu with dropdowns

**Location:** `src/components/layout/Navbar.tsx`

### 2. Footer Component
- Company logo
- Contact information
- Social media links
- Partner button
- Copyright notice

**Location:** `src/components/layout/Footer.tsx`

### 3. Typography System
- 6 pre-configured classes (H1-H4, body, small)
- Consistent sizing and spacing
- Professional appearance

**Location:** `src/styles/typography.css`

### 4. Search Dialog
- Modal search interface
- Category-based filtering
- Responsive layout

**Location:** `src/components/layout/SearchDialog.tsx`

### 5. 20+ UI Components
From shadcn/ui:
- Buttons, Cards, Inputs
- Dialogs, Drawers
- Tabs, Accordion
- Progress, Spinners
- Badges, Alerts
- Select, Checkbox
- Toggle, Tooltip
- And more...

**Location:** `src/components/ui/`

---

## Documentation Guides

### 📄 BASE_TEMPLATE_README.md
Learn how to create new pages using the standard template.

**Topics:**
- Template structure explained
- Layout system
- Common page patterns
- Responsive breakpoints
- Accessibility checklist

**When to read:** Creating new pages

### 📚 COMPONENTS_README.md
Complete guide to all available components.

**Topics:**
- Component imports and usage
- Props and customization
- Code examples
- Best practices
- Available components table

**When to read:** Using UI components

### 🔤 TYPOGRAPHY_README.md
Master the typography system.

**Topics:**
- All typography classes
- Font sizes and line heights
- Usage examples
- Responsive typography
- Customization

**When to read:** Styling text content

### 🎨 MASTER_README.md (This File)
Project overview and architecture.

**Topics:**
- Project structure
- Getting started
- All documentation links
- Development workflow
- Deployment

**When to read:** Understanding the project

---

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

### EditorConfig

Both VS Code and ESLint are configured. No manual setup needed.

### TypeScript

Strict type checking enabled. All code is fully type-safe.

### Styling

- **CSS Framework:** Tailwind CSS 4
- **Component Library:** shadcn/ui
- **Icons:** lucide-react
- **CSS Architecture:** Utility-first with component layers

---

## Best Practices

### 1. Component Organization

```tsx
// ✅ Good - Clear imports, sorted
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function Page() {
  const [state, setState] = useState(false)
  
  return (
    <>
      <Navbar logoSrc="/msclogo.svg" />
      <main>{/* Content */}</main>
      <Footer />
    </>
  )
}
```

### 2. Responsive Design

```tsx
// Mobile first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col mobile, 2 col tablet, 3 col desktop */}
</div>

// Responsive padding
<div className="px-4 sm:px-8 md:px-12">
  {/* Adapts to screen size */}
</div>
```

### 3. Typography

Always use semantic HTML with typography classes:

```tsx
<h1 className="heading-h1">Main Title</h1>
<h2 className="heading-h2">Section</h2>
<p className="body-text">Body paragraph</p>
<p className="body-small">Secondary text</p>
```

### 4. Accessibility

```tsx
// ✅ Semantic HTML
<button aria-label="Close menu">×</button>
<nav aria-label="Main navigation">...</nav>
<main>...</main>

// ❌ Avoid
<div onClick={handleClick}>Close</div>
```

### 5. Naming Conventions

- **Components:** PascalCase (Navbar, Footer, MyComponent)
- **Files:** Match component name (Navbar.tsx)
- **Classes:** kebab-case (my-class, main-content)
- **Functions:** camelCase (handleClick, getUserData)
- **Constants:** UPPER_SNAKE_CASE (MAX_WIDTH, API_URL)

### 6. Code Comments

Use meaningful comments explaining WHY, not WHAT:

```tsx
// ✅ Good - explains purpose
// Sticky positioning keeps navbar visible while scrolling
<header className="sticky top-0 z-50">

// ❌ Bad - states obvious
// Set sticky class to header
<header className="sticky top-0">
```

### 7. Imports Organization

Order: React → Libraries → Components → Styles

```tsx
'use client'

// React and built-ins
import { useState } from 'react'
import Image from 'next/image'

// External libraries
import { Button } from '@/components/ui/button'

// Local components
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

// Styles (if needed)
import '@/styles/custom.css'
```

### 8. Error Handling

```tsx
'use client'

import { useState } from 'react'

export default function Page() {
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    try {
      // API call
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## Design System Values

### Design Principles

1. **Clarity First** - Easy to understand and use
2. **Consistency** - Same patterns everywhere
3. **Accessibility** - Works for everyone
4. **Performance** - Fast and efficient
5. **Professional** - Polished, not playful

### Color Palette

- **Primary Blue:** `#2563eb` (blue-600)
- **Secondary Orange:** `#ea580c` (orange-600)
- **Neutral Gray:** `#f9fafb` (gray-50) to `#111827` (gray-900)

### Typography Scale

| Type | Size | Weight | Use |
|------|------|--------|-----|
| H1 | 50px | Bold | Main titles |
| H2 | 30px | Bold | Sections |
| H3 | 25px | Bold | Subsections |
| H4 | 22px | Bold | Card titles |
| Body | 20px | Normal | Paragraphs |
| Small | 16px | Normal | Secondary |
| Tiny | 12px | Normal | Metadata |

---

## Common Questions

### Q: How do I add a new component?
**A:** Install from shadcn/ui or create in `src/components/ui/`

### Q: How do I customize colors?
**A:** Edit `tailwind.config.ts` or use Tailwind utilities in individual components

### Q: How do I change the logo?
**A:** Replace `/public/msclogo.svg` or update `logoSrc` prop in Navbar

### Q: How do I add a new page?
**A:** Create file in `src/app/[page-name]/page.tsx` following BASE_PAGE_TEMPLATE.tsx

### Q: How do I use dark mode?
**A:** Use Tailwind's `dark:` prefix (e.g., `dark:bg-black`)

### Q: How do I deploy?
**A:** See Deployment section below

---

## Troubleshooting

### Issue: Styles not applying
**Solution:** Check that `globals.css` is imported in `layout.tsx` and Tailwind config is in place

### Issue: Components not rendering
**Solution:** Verify `'use client'` directive at top of interactive components

### Issue: Navbar looks wrong
**Solution:** Check that logo path is correct and Navbar component is properly imported

### Issue: Footer doesn't stick to bottom
**Solution:** Verify parent has `flex flex-col min-h-screen` with child `flex-1` on main content

### Issue: TypeScript errors
**Solution:** Run `npm run build` and check error messages in console

---

## Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

The project works on any platform supporting Node.js 18+:

- **AWS Amplify:** Supports Next.js apps natively
- **Netlify:** Use `next build` and configure build settings
- **Docker:** See next.config.ts for standalone output
- **Traditional Server:** Use Node.js 18+ with reverse proxy

---

## Version History

### Latest (Production Ready)
- ✅ All components implemented
- ✅ Responsive design complete
- ✅ Dark mode integrated
- ✅ Typography system established
- ✅ Full documentation

### Previous Phases
- Phase 1: Initial navbar design
- Phase 2: Bug fixes and refinement
- Phase 3: Footer integration
- Phase 4: Component polish
- Phase 5: Final documentation

---

## Contributing

### Adding New Components

1. Create component in `src/components/ui/` or `src/components/layout/`
2. Follow existing patterns
3. Add TypeScript types
4. Document in COMPONENTS_README.md
5. Add to this guide
6. Test on multiple devices

### Reporting Issues

Document:
- What you expected
- What actually happened
- Steps to reproduce
- Your environment (OS, browser, etc.)

### Suggesting improvements

Discuss with the team before starting work.

---

## Learning Resources

### Official Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Related Guides in This Project
- BASE_TEMPLATE_README.md - Page creation
- COMPONENTS_README.md - Component usage
- TYPOGRAPHY_README.md - Typography system

---

## Final Checklist

Before deploying to production:

- ✅ Run `npm run build` with no errors
- ✅ Test all pages on mobile (320px+)
- ✅ Test all pages on tablet (640px+)
- ✅ Test all pages on desktop (1024px+)
- ✅ Verify accessibility with keyboard navigation
- ✅ Check all links are working
- ✅ Verify dark mode is functioning
- ✅ Test search functionality
- ✅ Check Navbar and Footer on all pages
- ✅ Verify forms submit correctly
- ✅ Test on different browsers (Chrome, Firefox, Safari, Edge)
- ✅ Check performance with Lighthouse
- ✅ Review code for console errors/warnings
- ✅ Test with screen reader
- ✅ Verify images have alt text
- ✅ Check mobile navigation drawer
- ✅ Test sign-in button behavior
- ✅ Verify footer sticks to bottom
- ✅ Check max-width constraints (1600px)
- ✅ Verify all colors match design spec

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [BASE_TEMPLATE_README.md](BASE_TEMPLATE_README.md) | How to create pages |
| [COMPONENTS_README.md](COMPONENTS_README.md) | Available components |
| [TYPOGRAPHY_README.md](TYPOGRAPHY_README.md) | Font system |
| [BASE_PAGE_TEMPLATE.tsx](BASE_PAGE_TEMPLATE.tsx) | Page template file |

---

**Last Updated:** January 2024  
**Status:** ✅ Production Ready

For the latest updates and complete architecture overview, start with the guide that matches your task:
- Creating a new page? → BASE_TEMPLATE_README.md
- Using a component? → COMPONENTS_README.md
- Styling text? → TYPOGRAPHY_README.md
- Understanding architecture? → You're reading it!

