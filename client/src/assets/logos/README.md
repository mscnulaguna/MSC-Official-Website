# Logo System

This directory contains all logo assets for the MSC - NU Laguna Design System.

## Files

### `msclogo.svg`
**Purpose:** Primary logo for navbar

**Dimensions:** Responsive (h-8 on mobile, h-10 on tablets+)

**Usage:**
```tsx
import { Navbar } from '@/components/layout/Navbar'

<Navbar logoSrc="/logos/msclogo.svg" />
```

**Locations:**
- Navbar (top-left)
- Page headers
- Brand identity

### `msclogofooter.svg`
**Purpose:** Logo variant for footer

**Dimensions:** 32x24w (h-24 w-32)

**Usage:**
```tsx
import { Footer } from '@/components/layout/Footer'

<Footer /> {/* Uses /logos/msclogofooter.svg automatically */}
```

**Locations:**
- Footer (left section)
- Print materials
- Brand identity

## Naming Convention

All logos follow this pattern:
- `msc` = Microsoft Student Community
- `logo` = primary logo
- `logofooter` = footer variant

## Adding New Logos

1. Place SVG file in this directory
2. Update the filename to follow naming convention
3. Update imports in component files
4. Update this README with usage information
5. Test responsive behavior

## Best Practices

✓ Use SVG format for scalability
✓ Keep file sizes reasonable (< 100KB)
✓ Test on all screen sizes
✓ Use consistent naming
✓ Document usage in this file
✓ Update imports when moving/renaming files

## Related Files

- [Navbar.tsx](../../src/components/layout/Navbar.tsx) - Uses `/logos/msclogo.svg`
- [NavbarLeft.tsx](../../src/components/layout/NavbarLeft.tsx) - Displays logo
- [Footer.tsx](../../src/components/layout/Footer.tsx) - Uses `/logos/msclogofooter.svg`

## Support

For questions about logos, see MASTER_README.md in project root.
