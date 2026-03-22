# 📄 Base Template Guide

Learn how to create new pages using the BASE_PAGE_TEMPLATE.

> **Note:** This template is designed for a Vite + React app (see `client/package.json` and `src/main.tsx`). 
> Adjust any React Router or component import paths based on your project's actual routing configuration.

---

## What is the Base Template?

**File:** `BASE_PAGE_TEMPLATE.tsx`

**What it does:** Provides the standard layout structure for all pages in the design system. Includes:
- Navbar at top
- Footer at bottom
- Proper responsive spacing
- Correct max-width (1600px)
- Flexible content area

---

## Quick Start

### Creating a New Page

1. **Open BASE_PAGE_TEMPLATE.tsx** to use as reference
2. **Create file:** `src/pages/YourPageName.tsx`
3. **Copy structure:**

```tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function YourPageName() {
  return (
    <>
      <Navbar logoSrc="/msclogo.svg" />
      
      <main className="flex-1">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 md:px-12 py-8">
          {/* Your content goes here */}
        </div>
      </main>

      <Footer />
    </>
  )
}
```

4. **Register the route** in `src/App.tsx` using React Router or your routing library

---

## Template Structure Explained

### 1. Client Component Declaration
```tsx
'use client'
```
**Why:** Allows use of React hooks like `useState`, `useEffect`  
**When to remove:** If page has no interactivity

### 2. Navbar
```tsx
<Navbar logoSrc="/msclogo.svg" />
```
**What it does:** Sticky header with navigation, search, theme toggle  
**Props:**
- `logoSrc` - Path to logo file
- Optional: customize in layout components

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

**`py-8`** - Vertical padding (32px top/bottom)

### 4. Footer
```tsx
<Footer />
```
**What it does:** Company info, social links, copyright

---

## Layout System

### Responsive Breakpoints

Use Tailwind breakpoints for responsive design:

```tsx
// Mobile first approach
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

/* 
- grid-cols-1: Mobile (< 640px) - 1 column
- md:grid-cols-2: Tablet (640px+) - 2 columns
- lg:grid-cols-3: Desktop (1024px+) - 3 columns
*/
```

### Spacing Scale

Use Tailwind spacing classes:

```tsx
// Margins: m-4 (16px), m-8 (32px), m-12 (48px)
// Padding: p-4, p-8, p-12
// Gap: gap-4, gap-8, gap-12
```

### Typography

Use typography utilities from `src/styles/typography.css`:

```tsx
<h1 className="heading-h1">Main Title (50px)</h1>
<h2 className="heading-h2">Section Title (30px)</h2>
<h3 className="heading-h3">Subsection (25px)</h3>
<h4 className="heading-h4">Small heading (22px)</h4>
<p className="body-text">Regular text (20px)</p>
<p className="body-small">Small text (16px)</p>
<p className="body-tiny">Tiny text (12px)</p>
```

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

