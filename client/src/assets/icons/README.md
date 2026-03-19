# Icon System

This directory contains custom project icons used throughout the MSC Design System.

## Icon Files

### Social Media Icons
- `icon-facebook.svg` - Facebook icon
- `icon-instagram.svg` - Instagram icon  
- `icon-twitter.svg` - Twitter/X icon
- `icon-linkedin.svg` - LinkedIn icon
- `icon-github.svg` - GitHub icon
- `icon-discord.svg` - Discord icon
- `icon-tiktok.svg` - TikTok icon

## Usage

### In React Components

```tsx
import Image from 'next/image'

<Image
  src="/icons/icon-facebook.svg"
  alt="Facebook"
  width={20}
  height={20}
/>
```

### With Tailwind Styling

```tsx
<img 
  src="/icons/icon-facebook.svg" 
  alt="Facebook" 
  className="w-5 h-5 hover:opacity-75 transition-opacity"
/>
```

## Design Guidelines

- **Size**: All icons are designed as square SVGs (24x24)
- **Style**: Sharp, clean lines with no rounded corners
- **Color**: Uses `currentColor` for easy theming
- **Stroke**: Optimized for 5px viewing size
- **Accessibility**: Always include `alt` attributes on img tags

## Adding New Icons

1. Create a new SVG file: `icon-[name].svg`
2. Ensure the SVG uses `currentColor` for fill/stroke
3. Keep it simple and sharp (no excessive detail)
4. Test at multiple sizes (20px, 24px, 32px)
5. Update this README with the new icon description

## Updating Existing Icons

1. Edit the SVG file directly
2. Changes apply globally across all pages
3. No component updates needed
4. Test in Footer and any other components using the icon

## Related Files

- **Footer Component**: `/src/components/layout/Footer.tsx` - Uses social media icons
- **Logo System**: `/public/logos/` - For brand logomarks (separate from icon system)

## Color Application

Icons inherit color from their context:

```tsx
// Blue icons
<img src="/icons/icon-facebook.svg" className="text-blue-600" />

// White icons (on dark background)
<img src="/icons/icon-facebook.svg" className="text-white" />

// Gray on hover
<img src="/icons/icon-facebook.svg" className="text-gray-400 hover:text-gray-600" />
```
