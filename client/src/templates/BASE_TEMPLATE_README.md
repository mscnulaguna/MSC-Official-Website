# 📄 Base Template Guide

Learn how to create new pages using the BASE_PAGE_TEMPLATE.

> **Note:** This template is for a **Vite + React + React Router** app. The app is wrapped globally with `AppLayout` (from `src/layout.tsx`), which provides the Navbar and Toaster on every page.

---

## What is the Base Template?

**File:** [BASE_PAGE_TEMPLATE.tsx](./BASE_PAGE_TEMPLATE.tsx)

**What it does:** Provides the standard layout structure for all pages. Includes:
- **Sticky Navbar** (provided by global AppLayout - already on every page)
- **Footer** (imported per-page, positioned sticky at bottom)
- Proper responsive spacing and breakpoints
- Correct max-width (1700px section-container)
- Flexible content area that pushes footer down
- Dark mode support via ThemeContext

---

## Quick Start

### Creating a New Page

1. **Open BASE_PAGE_TEMPLATE.tsx** to use as reference
2. **Create file:** `src/pages/YourPageName.tsx`
3. **Copy structure:**

```tsx
import { Footer } from '@/components/ui/layout/Footer'

export default function YourPageName() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="section-container py-8">
          {/* Your page content here */}
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

4. **Register the route** in `src/App.tsx` using React Router

**Note:** The **Navbar is already provided** by `AppLayout` in `src/layout.tsx`, so you don't import it in your page.

---

## Template Structure Explained

### 1. Wrapper Container
```tsx
<div className="flex flex-col min-h-screen">
  <main className="flex-1">...</main>
  <Footer />
</div>
```
**Why:** Ensures footer sticks to bottom on short pages
- `min-h-screen` - Container takes full viewport height
- `flex-1` on main - Content expands to fill available space
- Footer positioned last

**Note:** This is NOT a 'use client' component - React Router handles client-side rendering in Vite

### 2. Main Content Area
```tsx
<main className="flex-1">
  <div className="section-container py-8">
    {/* Content */}
  </div>
</main>
```
**What it does:** 
- `<main>` - Semantic HTML for page content
- `flex-1` - Expands to fill available space (footer stays at bottom)
- `section-container` - Global max-width class (defined in globals.css)
- `py-8` - Vertical padding (32px top/bottom)

**Note:** Navbar is NOT here - it's provided globally by AppLayout in `src/layout.tsx`

### 3. Main Content Area
```tsx
<main className="flex-1">
  <div className="mx-auto max-w-[1600px] px-4 sm:px-8 md:px-12 py-8">
    {/* Content */}
  </div>
</main>
```

**`flex-1`** - Fills available space (footer stays at bottom)  
**`mx-auto`** - Centers content  
**`max-w-[1600px]`** - Maximum width constraint  
**`px-4 sm:px-8 md:px-12`** - Responsive padding:
- Mobile (< 640px): 16px padding
- Tablet (640px+): 32px padding
- Desktop (768px+): 48px padding

### 3. Footer
```tsx
<Footer />
```
**What it does:** 
- Located at bottom of page
- Has separate components: Logo | Contact Us | Follow Us | Partner Button
- Responsive breakpoints:
  - Below 860px: Mobile stacked layout
  - 860px+: Desktop 4-column grid
- Address text wraps below 1190px
- Dark mode logo variants

**Customization:**
See [Footer Component Documentation](#footer) for details.

### 4. Global AppLayout

Every page is wrapped by this hierarchy (in `src/main.tsx`):

```tsx
<AppLayout>
  <App />  {/* Your routes */}
</AppLayout>
```

**AppLayout provides:**
- **NavbarWrapper** - Sticky navigation (on every page automatically)
- **Toaster** - Sonner notifications (bottom-right)
- Consistent global styling

**You don't need to import Navbar** on your page - it's already there!

---

## Layout System

### Responsive Breakpoints

Standard Tailwind breakpoints - mobile-first approach:

```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

/* 
- Default (mobile): < 640px - 1 column
- sm: 640px+
- md: 768px+ (2 columns)
- lg: 1024px+ (3 columns)
- xl: 1280px+
- 2xl: 1536px+
*/
```

**Custom breakpoints** (in Footer.tsx and other components):
- `860px` - Footer mobile/desktop toggle
- `1024px (lg:)` - Navbar menu toggle  
- `1190px` - Address text wrapping
- `1700px` - section-container max-width

### Spacing Scale

Use Tailwind spacing classes:

```tsx
// Margins: m-4 (16px), m-8 (32px), m-12 (48px)
// Padding: p-4, p-8, p-12
// Gap: gap-4, gap-8, gap-12
```

### Typography

Use Tailwind text utilities with responsive sizing:

```tsx
// Responsive headings
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">Title</h1>
<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Subtitle</h2>

// Body text
<p className="text-sm md:text-base lg:text-lg">Body text</p>
<p className="text-xs sm:text-sm md:text-base">Small text</p>

// Special utilities
.gradient-text - 4-color Microsoft gradient
.section-container - Max-width container (1700px)
.section-padding - Responsive padding
```

**Font system** (from globals.css):
- Font family: `--font-inter` (Inter font)
- Color tokens: `text-foreground`, `text-muted-foreground`, etc.
- All inherit from CSS variables for dark mode support

---

## Common Page Patterns

### Hero Section

```tsx
<section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
  <div className="mx-auto max-w-[1600px] px-4 sm:px-8 md:px-12">
    <h1 className="heading-h1 mb-4">Welcome</h1>
    <p className="body-text">Description here</p>
  </div>
</section>
```

### Feature Grid

```tsx
<section className="py-12">
  <div className="mx-auto max-w-[1600px] px-4 sm:px-8 md:px-12">
    <h2 className="heading-h2 mb-8">Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Card 1 */}
      {/* Card 2 */}
      {/* Card 3 */}
    </div>
  </div>
</section>
```

### Content with Sidebar

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <main className="lg:col-span-2">
    {/* Main content */}
  </main>
  <aside className="lg:col-span-1">
    {/* Sidebar */}
  </aside>
</div>
```

---

## Footer Behavior

**Important:** Footer should stick to bottom of viewport, even on short pages.

**How it works:**
- Use `flex flex-col min-h-screen` on root container
- Navbar and main get flex-1 to fill space
- Footer is last and stays at bottom

**Structure:**
```tsx
<div className="flex flex-col min-h-screen">
  <Navbar />
  <main className="flex-1">{/* Content */}</main>
  <Footer />
</div>
```

---

## Adding Interactivity

### State Management

```tsx
'use client'

import { useState } from 'react'

export default function Page() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Effects

```tsx
'use client'

import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    // Runs once on mount
    console.log('Page loaded')
  }, [])
  
  return <div>Content</div>
}
```

---

## Styling Guidelines

### Colors

Use Tailwind color utilities:
- **Primary Blue:** `bg-blue-600`, `text-blue-600`
- **Secondary Orange:** `bg-orange-600`
- **Neutral Gray:** `bg-gray-50`, `text-gray-900`
- **Success:** `text-green-600`
- **Error:** `text-red-600`

### Rounded Corners

Keep design sharp, not overly rounded:
```tsx
// ✅ Good
className="rounded" // 4px

// ❌ Avoid
className="rounded-full" // For special cases only
```

### Shadows

Use subtle shadows:
```tsx
className="shadow-sm"  // Small shadow
className="shadow"     // Medium shadow
className="shadow-lg"  // Large shadow
```

---

## Accessibility Checklist

- ✅ Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<footer>`)
- ✅ Add alt text to images
- ✅ Label form inputs
- ✅ Add ARIA labels where needed
- ✅ Ensure sufficient color contrast
- ✅ Make interactive elements keyboard accessible
- ✅ Test with screen readers

---

## Performance Tips

1. **Use dynamic imports for large components:**
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/Heavy'))
```

2. **Optimize images:**
```tsx
import Image from 'next/image'

<Image src="/image.jpg" alt="Description" width={1200} height={600} />
```

3. **Lazy load below-the-fold content**
4. **Memoize expensive components:**
```tsx
import { memo } from 'react'

export default memo(function Component() {
  return <div>Content</div>
})
```

---

## Common Issues & Solutions

### Issue: Footer doesn't stick to bottom
**Solution:** Use `min-h-screen` with flex layout

### Issue: Content is too narrow/wide
**Solution:** Adjust `max-w-[1600px]` or update px-* padding

### Issue: Mobile layout looks awkward
**Solution:** Test all breakpoints, use responsive padding (px-4 sm:px-8 md:px-12)

### Issue: Text is too small on mobile
**Solution:** Use responsive text sizes: `text-sm md:text-base lg:text-lg`

---

## Next Steps

1. Create your page based on this template
2. Customize content using UI components from COMPONENTS_README.md
3. Test on mobile, tablet, and desktop
4. Check accessibility with keyboard navigation
5. Deploy!

