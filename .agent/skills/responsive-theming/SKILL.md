---
name: responsive-theming
description: >-
  Standards and implementation patterns for Dark/Light theme switching and mobile-first
  responsive layouts across First Touch web and dashboard interfaces.
---

# Responsive & Theming Engineering Skill

This skill defines the exact standards for building mobile-first, high-performance interfaces with complete Light and Dark theme support.

---

## 1. Dark & Light Theme System

### Architecture
- The theme is powered by Tailwind CSS using semantic CSS variables defined in HSL format.
- Modes supported: `light`, `dark`, and `system` (matches OS preference).
- Persistent state saved to `localStorage` under key `first_touch_theme`.

### Semantic Color Variables (defined in `index.css`)
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 142.1 76.2% 36.3%; /* Pitch Grass Green */
    --primary-foreground: 355.7 100% 97.3%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 7%;
    --card-foreground: 210 40% 98%;
    --primary: 142.1 70.6% 45.3%; /* Vibrant Green */
    --primary-foreground: 144.9 80.4% 10%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border: 217.2 32.6% 17.5%;
  }
}
```

### Theming Guidelines
- **NEVER** use hardcoded color values like `bg-white` or `text-black` in components.
- **ALWAYS** use semantic classes: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`.
- When custom colors are needed, provide explicit dark variants: e.g. `bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300`.

---

## 2. Mobile-First Responsive Design

Because coaches manage drills on the pitch and trainees check workouts on phones:

### Breakpoint Strategy
- Base (No prefix): Mobile portrait (`< 640px`) - Single column, full width, large touch targets.
- `sm:` (`>= 640px`): Large phones / small tablets - 2 columns for card grids.
- `md:` (`>= 768px`): Tablets - Sidebar transforms from bottom bar / drawer to slim rail.
- `lg:` (`>= 1024px`): Laptops - Full sidebar, multi-panel layouts (e.g., tactics tools + pitch canvas).
- `xl:` (`>= 1280px`): Desktops - Expanded analytics and multiple views.

### Key UX Patterns
1. **Collapsible Sidebar**:
   - On desktop (`lg:`): Sticky left navigation.
   - On mobile: Bottom navigation bar for primary actions (Home, Tactics, Plans, Profile), plus hamburger sheet for secondary actions.
2. **Tactical Board Adaptability**:
   - Touch drag events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) must be supported alongside mouse events.
   - Canvas maintains aspect ratio `16:9` with automatic scaling container.
3. **Data Tables & Lists**:
   - On desktop: Full table with multiple columns.
   - On mobile: Stacked card view or horizontal scroll with sticky identifier column.
