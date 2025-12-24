# Design Guidelines: Goal Bingo Tracker

## Design Approach
**Selected Approach:** Design System (Utility-Focused) with Creative Customization Layer

This is a productivity tool for personal goal tracking that requires intuitive usability with optional visual customization. Drawing inspiration from modern productivity tools like Notion and Trello, combined with the playful aesthetic of bingocardcreator.com.

**Core Principles:**
- Immediate clarity: Users should instantly understand how to create, customize, and track
- Touch-first interactions: Large tap targets for mobile goal marking
- Delightful customization: Make personalization fun and rewarding
- Clean hierarchy: Customization shouldn't overwhelm the core tracking experience

---

## Typography System

**Font Stack:** 
- Primary: 'Inter' or 'DM Sans' (Google Fonts) - clean, modern readability
- Fallback: system-ui, sans-serif

**Hierarchy:**
- App Title: text-2xl md:text-3xl, font-bold
- Section Headers: text-xl md:text-2xl, font-semibold
- Bingo Tile Text: text-sm md:text-base, font-medium (scales based on content length)
- Control Labels: text-sm, font-medium
- Helper Text: text-xs, font-normal
- Timestamps: text-xs, font-normal, opacity-75

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Tight spacing: p-2, gap-2 (within controls)
- Standard spacing: p-4, gap-4 (between related elements)
- Section spacing: p-6 md:p-8 (major sections)
- Large spacing: mb-8, mt-8 (between distinct areas)

**Container Structure:**
- Main wrapper: max-w-7xl mx-auto px-4 md:px-6
- Bingo grid container: max-w-2xl mx-auto (keeps grid manageable)
- Customization panel: max-w-md (sidebar or modal)

**Responsive Breakpoints:**
- Mobile-first design
- Grid adjusts: Single column controls stack at mobile, side-by-side at md+
- Bingo tiles: Minimum touch target 60px × 60px on mobile

---

## Component Library

### 1. Bingo Grid
**Structure:**
- 5×5 grid using CSS Grid (grid-cols-5)
- Equal aspect ratio squares (aspect-square)
- Gap between tiles: gap-2 md:gap-3
- Each tile is clickable with hover state
- Completed tiles show marker overlay (image icon: 32×32px or 40×40px)

**Tile States:**
- Default: Border, subtle shadow
- Hover: Slight scale (transform scale-105), elevated shadow
- Editing: Border emphasis, cursor text
- Completed: Marker image overlay positioned center, slight opacity on tile content

### 2. Customization Controls Panel
**Layout Options:**
- Desktop: Fixed sidebar (w-80) on right side
- Mobile: Bottom sheet or accordion sections

**Control Groups:**
1. **Image Uploads**
   - Board background upload button with preview thumbnail
   - Tile background upload button with preview
   - Clear/remove image buttons (small, subtle)

2. **Marker Selection**
   - Radio button group with icon previews
   - Options: Circle, Star, Checkmark, Heart
   - Each option shows visual preview (24×24px icon)

3. **Color Pickers**
   - Board background color
   - Tile background color  
   - Tile text color
   - Simple color input with preview swatch

### 3. Header Section
**Elements:**
- App title/logo (left aligned)
- Save/Share buttons (right aligned)
- Clear visual separation with bottom border

### 4. Action Buttons
**Primary Actions:**
- Share button: Icon + "Share" text
- Download button: Icon + "Download Image" text
- Reset button: Ghost style, "Start New Card"

**Button Sizing:**
- Standard: px-4 py-2 md:px-6 md:py-3
- Icon buttons: p-2 md:p-3 (square)

### 5. Share Modal/Sheet
**Contents:**
- Download as PNG option (large button with icon)
- Copy shareable link (input field with copy button)
- Close/dismiss button

### 6. Timestamp Display
**Implementation:**
- Small text below tile content or on hover
- Format: "Completed: Jan 15, 2:30 PM"
- Only visible when tile is marked complete

---

## Interaction Patterns

### Tile Editing Flow
1. Click empty tile → Text input appears inline
2. Type goal text → Auto-save on blur/enter
3. Long text truncates with ellipsis, full text on hover tooltip

### Goal Completion
1. Click tile → Instant marker overlay appears
2. Timestamp records automatically
3. Subtle animation: marker fades in (duration-200)
4. Click again to unmark (toggle behavior)

### Customization Flow
1. Upload image → Instant preview in grid
2. Select marker → Shows across all completed tiles immediately  
3. Change colors → Live preview updates

### Mobile Interactions
- All controls accordion/collapsible on mobile
- Bingo grid full width with generous tap targets
- Swipe gestures optional for marker selection

---

## Images

### Board Background Image
- Full coverage behind grid with slight opacity overlay for readability
- Upload accepts: JPG, PNG, max 2MB
- Position: center, cover

### Tile Background Images
- Applied uniformly to all tiles (not individual)
- Maintain text readability with subtle overlay if needed
- Position: center, cover per tile

### Marker Icons
- Provided as icon library (Heroicons or similar)
- Circle: Simple ring outline
- Star: Filled star shape
- Checkmark: Bold check
- Heart: Filled heart
- Size: 32×32px or 40×40px overlaid on completed tiles

---

## Accessibility

- All clickable tiles: role="button", aria-label with goal text
- Color pickers: Include labels, not color-only indicators
- Keyboard navigation: Tab through tiles, Enter to mark/edit
- Focus visible states on all interactive elements
- Sufficient contrast between text and backgrounds (min 4.5:1)

---

## Mobile Optimization

- Grid scales down gracefully (60×60px minimum tile size)
- Customization controls in expandable bottom drawer
- Stack all controls vertically on mobile
- Large, thumb-friendly buttons (min 44px height)
- Simplified header with hamburger menu for settings