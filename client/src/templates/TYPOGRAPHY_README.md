# 🔤 Typography System Guide

Master the typography utilities for consistent text styling across the MSC Design System.

---

## What is the Typography System?

**File:** `src/styles/typography.css`

**What it does:** Provides pre-configured typography utility classes for headings, body text, and more.

**Why use it:** 
- Consistent sizing across the entire platform
- Easy to maintain and update
- Responsive sizing built-in
- Professional appearance

---

## Typography Classes

### Headings

#### Heading H1 (Main Title)
```tsx
<h1 className="heading-h1">Page Title</h1>
```
- **Font Size:** 50px (text-5xl)
- **Font Weight:** Bold
- **Line Height:** 60px
- **Use for:** Main page titles, hero sections

#### Heading H2 (Section Title)
```tsx
<h2 className="heading-h2">Section Title</h2>
```
- **Font Size:** 30px (text-3xl)
- **Font Weight:** Bold
- **Line Height:** 60px
- **Use for:** Major section headers

#### Heading H3 (Subsection Title)
```tsx
<h3 className="heading-h3">Subsection Title</h3>
```
- **Font Size:** 25px (text-2xl)
- **Font Weight:** Bold
- **Line Height:** 60px
- **Use for:** Subsection headers, feature titles

#### Heading H4 (Small Heading)
```tsx
<h4 className="heading-h4">Small Heading</h4>
```
- **Font Size:** 22px (text-xl)
- **Font Weight:** Bold
- **Line Height:** 30px
- **Use for:** Card titles, small section headers

### Body Text

#### Body Text (Default)
```tsx
<p className="body-text">Regular paragraph text goes here...</p>
```
- **Font Size:** 20px (text-base)
- **Line Height:** 35px
- **Use for:** Main body content, paragraphs

#### Body Small
```tsx
<p className="body-small">Smaller body text</p>
```
- **Font Size:** 16px (text-sm)
- **Line Height:** 24px
- **Use for:** Secondary text, descriptions, captions

#### Body Tiny
```tsx
<p className="body-tiny">Very small text</p>
```
- **Font Size:** 12px (text-xs)
- **Line Height:** 18px
- **Use for:** Metadata, timestamps, copyright notice

---

## Spacing Reference

### Line Height
Proper line height ensures readability:

| Type | Font Size | Line Height |
|------|-----------|-------------|
| H1 | 50px | 60px |
| H2 | 30px | 60px |
| H3 | 25px | 60px |
| H4 | 22px | 30px |
| Body | 20px | 35px |
| Body Small | 16px | 24px |
| Body Tiny | 12px | 18px |

### Line Height Ratios
- H1, H2, H3: 1.2x (60px line on 50px/30px/25px text)
- H4: 1.36x (30px line on 22px text)
- Body: 1.75x (35px line on 20px text)
- Small: 1.5x (24px line on 16px text)
- Tiny: 1.5x (18px line on 12px text)

---

## Usage Examples

### Page Structure

```tsx
'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function Page() {
  return (
    <>
      <Navbar logoSrc="/msclogo.svg" />
      
      <main className="flex-1">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 md:px-12 py-8">
          
          {/* Main title */}
          <h1 className="heading-h1 mb-4">Welcome to Our Platform</h1>
          <p className="body-text mb-12">
            This is your main introduction text explaining the page purpose.
            It uses the body-text class for proper sizing and spacing.
          </p>

          {/* Section 1 */}
          <h2 className="heading-h2 mb-6">Featured Section</h2>
          <p className="body-text mb-8">
            Section introduction paragraph goes here.
          </p>
          
          {/* Feature card example */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="rounded shadow p-6">
              <h3 className="heading-h3 mb-2">Feature One</h3>
              <p className="body-small text-gray-600">
                Brief description of the feature using body-small for less emphasis.
              </p>
            </div>
            {/* More cards... */}
          </div>

          {/* Section 2 */}
          <h2 className="heading-h2 mb-6">Another Section</h2>
          <div className="space-y-4">
            <h4 className="heading-h4">Item 1</h4>
            <p className="body-text">Description here</p>
          </div>

          {/* Footer text */}
          <div className="border-t pt-8 mt-12">
            <p className="body-tiny text-gray-500">
              © 2024 MSC. All rights reserved. | Updated January 2024
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
```

### Blog/Article Layout

```tsx
<article className="max-w-3xl mx-auto">
  <h1 className="heading-h1 mb-4">Article Title</h1>
  
  <div className="prose">
    <p className="body-text mb-6">
      Opening paragraph of the article providing context...
    </p>

    <h2 className="heading-h2 mt-8 mb-4">Key Section</h2>
    <p className="body-text mb-6">
      Main content explaining the topic in detail.
    </p>

    <h3 className="heading-h3 mt-6 mb-3">Subsection</h3>
    <p className="body-text mb-4">
      More detailed information about the subsection.
    </p>

    <p className="body-small text-gray-600 italic mt-8">
      Author: Name | Published: January 1, 2024 | Read time: 5 min
    </p>
  </div>
</article>
```

### Card/Component Layout

```tsx
<div className="border rounded-lg p-6 hover:shadow-lg transition">
  <h3 className="heading-h3 mb-2">Card Title</h3>
  <p className="body-text mb-4">
    Main description that explains the card content in detail.
  </p>
  <p className="body-small text-gray-500">
    Additional info or metadata
  </p>
</div>
```

---

## Font Weight

All typography classes use **Bold (700)** for headings and normal weight for body text.

If you need different weights, use Tailwind utilities:

```tsx
<p className="body-text font-bold">Emphasized text</p>
<p className="body-small font-light">Light text</p>
```

---

## Color Usage

### Heading Colors

```tsx
{/* Default (inherit parent color) */}
<h1 className="heading-h1">Title</h1>

{/* With color */}
<h1 className="heading-h1 text-blue-600">Blue Title</h1>
<h2 className="heading-h2 text-gray-900">Dark Title</h2>
```

### Body Text Colors

```tsx
{/* Default */}
<p className="body-text">Regular text</p>

{/* Emphasis */}
<p className="body-text text-blue-600">Important</p>

{/* Secondary */}
<p className="body-small text-gray-500">Subtle text</p>

{/* Error */}
<p className="body-text text-red-600">Error message</p>
```

---

## Responsive Typography

The typography system is already responsive through Tailwind's responsive utilities:

```tsx
{/* Text can be different sizes at different breakpoints */}
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
  Responsive Title
</h1>

{/* Or use the typography classes (already optimized) */}
<h1 className="heading-h1">Already responsive</h1>
```

---

## Line Length

Recommended line length for readability: **50-75 characters**

```tsx
{/* Good - contained width */}
<div className="max-w-2xl">
  <p className="body-text">
    Text that stays readable because it doesn't stretch too wide.
  </p>
</div>

{/* Better - use max-w-3xl or 4xl for body text */}
<div className="max-w-3xl mx-auto">
  <p className="body-text">Best readability with constrained width.</p>
</div>
```

---

## HTML Semantic Elements

Always use proper semantic HTML:

```tsx
{/* ✅ Correct */}
<h1 className="heading-h1">Main Page Title</h1>
<h2 className="heading-h2">Section</h2>
<h3 className="heading-h3">Subsection</h3>
<h4 className="heading-h4">Small heading</h4>
<p className="body-text">Paragraph</p>

{/* ❌ Avoid */}
<div className="heading-h1">Not semantic</div>
<span className="body-text">Span for text</span>
```

---

## Common Patterns

### Hero Section

```tsx
<section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
  <h1 className="heading-h1 mb-2">Hero Title</h1>
  <p className="body-text">Hero subtitle or description</p>
</section>
```

### Feature List

```tsx
<div className="space-y-6">
  {features.map((feature) => (
    <div key={feature.id}>
      <h3 className="heading-h3 mb-2">{feature.title}</h3>
      <p className="body-text">{feature.description}</p>
    </div>
  ))}
</div>
```

### Sidebar

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
    <h1 className="heading-h1 mb-4">Main Content</h1>
    <p className="body-text">Article content here</p>
  </div>
  <aside>
    <h3 className="heading-h3 mb-4">Related</h3>
    <p className="body-small">Sidebar content</p>
  </aside>
</div>
```

---

## Typography Best Practices

1. **Hierarchy:** Use H1 > H2 > H3 in order, not H1 > H3 (skip H2)
2. **Consistency:** Use same class for same purpose across pages
3. **Readability:** Ensure sufficient contrast (dark text on light, or vice versa)
4. **Line Length:** Keep content to `max-w-3xl` or 4xl for readability
5. **Spacing:** Use mb-4, mb-6, mb-8 to space text sections
6. **Scanning:** Use headings to break up long text
7. **Mobile:** Typography classes are already optimized for mobile

---

## Customizing Typography

To change typography styling globally:

**Edit:** `src/styles/typography.css`

```css
@layer components {
  .heading-h1 {
    @apply text-5xl font-bold leading-[60px];
    /* Add custom properties */
    letter-spacing: -0.02em;
  }
}
```

Then clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

---

## Font Size Reference

| Class | Tailwind | Pixels | Line Height |
|-------|----------|--------|------------|
| heading-h1 | text-5xl | 50px | 60px |
| heading-h2 | text-3xl | 30px | 60px |
| heading-h3 | text-2xl | 25px | 60px |
| heading-h4 | text-xl | 22px | 30px |
| body-text | text-base | 20px | 35px |
| body-small | text-sm | 16px | 24px |
| body-tiny | text-xs | 12px | 18px |

---

## Getting Started

1. Use `heading-h1` for page titles
2. Use `heading-h2` for major sections
3. Use `heading-h3` for subsections
4. Use `body-text` for regular paragraphs
5. Use `body-small` for secondary text
6. Use `body-tiny` for metadata, copyright

That's it! Your typography is now consistent and professional.

