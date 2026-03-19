# 📚 Components Guide

Welcome! This guide explains how to use all the components in the MSC Design System.

---

## 🧭 Quick Navigation

- [Navbar](#navbar) - Top navigation
- [Footer](#footer) - Bottom footer section
- [Dialog/Search](#dialog--search) - Modal dialog for search
- [Buttons](#buttons) - Action buttons
- [Forms](#forms) - Input fields and forms
- [Tables](#tables) - Data display
- [Status Indicators](#status-indicators) - Progress, spinners
- [Feedback](#feedback) - Alerts, toasts
- [Content](#content) - Tabs, accordion, cards

---

## Navbar

**Location:** `src/components/layout/Navbar.tsx`

**What it does:** Sticky navigation bar at the top of every page

**How to use:**

```tsx
import { Navbar } from '@/components/layout/Navbar'

export default function Page() {
  return (
    <>
      <Navbar logoSrc="/msclogo.svg" />
      {/* Your page content */}
    </>
  )
}
```

**Props:**
- `logoSrc` - Path to logo (default: `/msclogo.svg`)
- `logoAlt` - Logo alt text (default: `Logo`)
- `className` - Additional CSS classes

**Features:**
- ✅ Sticky positioning
- ✅ Responsive menu
- ✅ Search with categories
- ✅ Theme toggle
- ✅ Sign-in button
- ✅ Mobile hamburger menu

**Customization:**
Change logo path → Update `logoSrc` prop
Change menu items → Edit `NavbarCenter.tsx` `menuItems` array
Add more controls → Add to `NavbarRight` component

---

## Footer

**Location:** `src/components/layout/Footer.tsx`

**What it does:** Footer with company info, social links, and contact details

**How to use:**

```tsx
import { Footer } from '@/components/layout/Footer'

export default function Page() {
  return (
    <>
      {/* Page content */}
      <Footer />
    </>
  )
}
```

**Sections:**
- **Left:** MSC Logo
- **Center-Left:** Contact Us (address, email)
- **Center-Right:** Follow Us (social media icons)
- **Right:** Partner with Us button
- **Bottom:** Copyright notice (blue background)

**Customization:**
Update email → Edit the email link in `src/components/layout/Footer.tsx`
Update address → Find the MapPin link section
Add social media → Add new icon link in the Follow Us section
Change button text → Find "Partner with Us" text

---

## Dialog & Search

**Location:** `src/components/layout/SearchDialog.tsx`

**What it does:** Modal search interface with category filtering

**How it works:**
1. User clicks search icon in navbar
2. Dialog opens with category buttons
3. User selects a category
4. User types search query
5. User clicks search

**Categories:**
- Home
- About
- Activities
- Learn
- Partners

**Customization:**
Add more categories → Edit `SEARCH_CATEGORIES` array
Change dialog title → Update `DialogTitle` text
Connect to API → Update `handleSearch` function

---

## Buttons

**How to use:**

```tsx
import { Button } from '@/components/ui/button'

// Default button
<Button>Click me</Button>

// Outlined button
<Button variant="outline">Outline</Button>

// Ghost button (minimal)
<Button variant="ghost">Ghost</Button>

// Destructive button (red)
<Button variant="destructive">Delete</Button>

// Size variants
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

---

## Forms

### Input

```tsx
import { Input } from '@/components/ui/input'

<Input 
  type="email" 
  placeholder="Enter your email"
/>
```

### Textarea

```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea 
  placeholder="Enter your message"
  rows={5}
/>
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Pick an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">Option 1</SelectItem>
    <SelectItem value="opt2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox

```tsx
import { Checkbox } from '@/components/ui/checkbox'

<Checkbox id="terms" />
<label htmlFor="terms">I agree to terms</label>
```

---

## Tables

**Location:** Implementation is custom

```tsx
// Use HTML table structure
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

---

## Status Indicators

### Progress Bar

```tsx
import { Progress } from '@/components/ui/progress'

<Progress value={65} className="w-full" />
```

### Spinner

```tsx
import { Spinner } from '@/components/ui/spinner'

<Spinner />
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>New</Badge>
<Badge variant="secondary">Secondary</Badge>
```

---

## Feedback

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Message here</AlertDescription>
</Alert>
```

### Toast

Uses Sonner - already integrated:

```tsx
import { toast } from 'sonner'

toast.success('Success message')
toast.error('Error message')
toast.info('Info message')
```

---

## Content

### Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Accordion

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    Content
  </DialogContent>
</Dialog>
```

---

## Navigation Menu

**Location:** `src/components/ui/navigation-menu`

Used in navbar center. Has dropdown support for Activities and Learn sections.

---

## Available Components

| Component | File | Use Case |
|-----------|------|----------|
| Navbar | `layout/Navbar` | Top navigation |
| Footer | `layout/Footer` | Bottom footer |
| SearchDialog | `layout/SearchDialog` | Search interface |
| Button | `ui/button` | Actions |
| Input | `ui/input` | Text input |
| Card | `ui/card` | Content container |
| Dialog | `ui/dialog` | Modal |
| Tabs | `ui/tabs` | Tabbed content |
| Accordion | `ui/accordion` | Collapsible items |
| Progress | `ui/progress` | Progress bar |
| Badge | `ui/badge` | Labels |
| Toast | `sonner` | Notifications |
| Alert | `ui/alert` | Messages |
| Spinner | `ui/spinner` | Loading |
| Toggle | `ui/toggle` | On/off buttons |
| Tooltip | `ui/tooltip` | Hover hints |
| Separator | `ui/separator` | Dividers |
| Avatar | `ui/avatar` | User images |
| Checkbox | `ui/checkbox` | Selection |
| Label | `ui/label` | Form labels |
| Textarea | `ui/textarea` | Multi-line input |
| Select | `ui/select` | Dropdown select |

---

## Best Practices

1. **Use semantic HTML** - Use dialog for modals, not divs
2. **Import from UI folder** - `@/components/ui/button`
3. **Add aria-labels** - For accessibility
4. **Keep dark mode ready** - Use theme colors, not hardcoded colors
5. **Test on mobile** - Check responsiveness
6. **Use consistent spacing** - Reference spacing guidelines
7. **Follow design rules** - No overly rounded corners, structured layouts
8. **Comment complex components** - Explain what and why

---

## Getting Help

- Check the reference images attached to the design brief
- Review the MASTER_README.md for architecture overview
- Look at BASE_PAGE_TEMPLATE.tsx for layout examples
- Check individual component files for usage

