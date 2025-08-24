# Uplist Design System

A comprehensive guide to the visual design language and component patterns used throughout the Uplist application.

## 🎨 Color Palette

### Primary Background
- **Base**: `bg-white` - Clean white background as the primary foundation
- **Usage**: Main page backgrounds, card backgrounds, form elements

### Neutral Shades (Functional Grays)
Our neutral palette uses Tailwind's neutral scale strategically:

```css
/* Light Neutrals - Backgrounds & Subtle Elements */
bg-neutral-50   /* Very light gray for subtle backgrounds */
bg-neutral-100  /* Light gray for inactive states, disabled elements */
bg-neutral-200  /* Border colors, subtle separators */

/* Mid Neutrals - Text & Interactive Elements */
text-neutral-400  /* Placeholder text, secondary content */
text-neutral-500  /* Muted text, icons in inactive state */
text-neutral-600  /* Body text, secondary headings */
text-neutral-700  /* Primary text, active form labels */

/* Dark Neutrals - High Contrast & Emphasis */
text-neutral-800  /* Primary headings, important content */
text-neutral-900  /* Maximum contrast text (sparingly used) */
text-neutral-950  /* Ultra-high contrast for critical emphasis */
```

### Orange Accent (Brand Color)
Orange is used **minimally** and strategically for:
- Primary action buttons: `bg-orange-500`
- Hover states: `hover:bg-orange-600`
- Focus rings: `focus:ring-orange-200`
- Brand elements: Logo containers, accent dots
- Interactive states: `hover:text-orange-500`

**Principle**: Orange should never dominate - it's used as a subtle accent to guide user attention.

## 🔲 Border Philosophy

### Border Strategy
- **Primary Borders**: `border-neutral-200` for most elements
- **Thickness**: Predominantly `border-2` for form elements and important containers
- **Usage**: Subtle definition without heavy visual weight

### Border Applications
```css
/* Form Elements */
border-2 border-neutral-200  /* Input fields, containers */

/* Cards & Containers */
border border-neutral-200    /* Subtle card separation */

/* Interactive States */
focus:border-orange-400      /* Orange focus indication */
hover:border-orange-100      /* Subtle orange hover */
```

## 🎯 Border Radius (Rounded Design Language)

### Primary Radius: `rounded-3xl`
Our signature rounded aesthetic uses `rounded-3xl` (24px) as the primary radius for:
- Major containers and cards
- Navigation elements
- Primary buttons
- Form containers
- Modal and overlay elements

### Secondary Radius: `rounded-2xl`
Used for:
- Form input fields
- Secondary buttons
- Smaller cards and components
- Tab navigation elements

### Accent Radius: `rounded-xl`
For smaller elements:
- Icons containers
- Small badges
- Compact buttons

### Full Rounded: `rounded-full`
Reserved for:
- Profile images
- Icon buttons
- Decorative dots and indicators

## 🌟 Shadow System

### Standard Shadows
```css
/* Subtle Elevation */
shadow-sm     /* Minimal shadow for slight elevation */
shadow-md     /* Medium shadow for cards and containers */
shadow-lg     /* Pronounced shadow for primary buttons */
shadow-xl     /* High elevation for modals, dropdowns */
shadow-2xl    /* Maximum elevation for critical overlays */
```

### Inset Shadows
Used sparingly for **depth and texture**:
```css
inset-shadow-sm   /* Subtle inner depth */
```
**Applications**: 
- Navigation bars for subtle depth
- Active/pressed button states
- Input field focus states

### Colored Shadows
Orange shadows for brand consistency:
```css
shadow-orange-500/10   /* Subtle orange glow */
shadow-orange-500/5    /* Very light orange shadow */
```

## 🚫 What We Don't Use

### No Gradients Policy
- **Strict Rule**: No `bg-gradient-*` classes anywhere
- **Rationale**: Maintains clean, professional appearance
- **Alternative**: Use solid colors with subtle shadows for depth

### Minimal Color Usage
- Avoid colorful backgrounds
- No heavy use of blues, greens, or other brand colors
- Keep color palette restricted to white, neutrals, and orange accents

## 📐 Component Patterns

### Form Elements
```tsx
// Standard Input Pattern
<input 
  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
/>

// Primary Button Pattern
<button 
  className="w-full py-4 px-6 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 shadow-lg hover:shadow-xl"
/>
```

### Card Components
```tsx
// Standard Card Container
<div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-md">
  {/* Card content */}
</div>

// Interactive Card
<div className="bg-white rounded-3xl p-6 border border-neutral-200 hover:shadow-lg transition-all duration-200">
  {/* Interactive content */}
</div>
```

### Navigation Elements
```tsx
// Tab Navigation
<div className="flex bg-neutral-100 rounded-3xl p-1.5">
  <button className="flex-1 py-3 px-6 rounded-2xl bg-white text-neutral-800 shadow-lg">
    Active Tab
  </button>
  <button className="flex-1 py-3 px-6 rounded-2xl text-neutral-500 hover:text-neutral-700">
    Inactive Tab
  </button>
</div>
```

## 🎨 Landing Page Reference Patterns

### Hero Section
- Large rounded containers: `rounded-3xl`
- White backgrounds with subtle shadows
- Orange accent buttons for CTAs
- Neutral text hierarchy (600, 700, 800)

### Feature Cards
- Consistent `rounded-2xl` or `rounded-3xl`
- `border border-neutral-200`
- White backgrounds
- Hover states with shadow elevation

### Navigation Bar
- Floating rounded navigation: `rounded-2xl sm:rounded-3xl`
- White background with subtle border
- Inset shadows for depth: `inset-shadow-sm`
- Orange accents on active/hover states

## 🔧 Implementation Guidelines

### CSS Class Patterns
1. **Start with base**: `bg-white`
2. **Add borders**: `border-2 border-neutral-200`
3. **Apply radius**: `rounded-3xl` (primary) or `rounded-2xl` (secondary)
4. **Include shadows**: `shadow-md` or appropriate level
5. **Add interactions**: `hover:shadow-lg transition-all duration-200`
6. **Orange accents**: Only for focus, hover, and primary actions

### Typography Hierarchy
```css
/* Headers */
text-neutral-800 font-bold font-dm-sans  /* Primary headings */
text-neutral-700 font-semibold          /* Secondary headings */

/* Body Text */
text-neutral-600  /* Primary body text */
text-neutral-500  /* Secondary/muted text */
text-neutral-400  /* Placeholder text */
```

### Spacing & Layout
- Consistent padding: `p-4`, `p-6`, `p-8` for different container sizes
- Generous white space for breathing room
- `gap-4`, `gap-6` for flex/grid layouts

## 🎯 Design Principles

1. **Minimalism**: Clean, uncluttered interfaces
2. **Consistency**: Repeated patterns across all components
3. **Accessibility**: High contrast ratios, clear focus states
4. **Professionalism**: Subtle, business-appropriate aesthetics
5. **Warmth**: Orange accents add personality without overwhelming

## 📱 Responsive Considerations

- Maintain rounded corners across all breakpoints
- Adjust padding/margins for mobile: `p-4 lg:p-6`
- Keep shadow system consistent on all devices
- Orange accents remain subtle on touch interfaces

---

This design system ensures a cohesive, professional, and accessible user experience across the entire Uplist application. All components should follow these established patterns for visual consistency and brand integrity.
