---
name: Vivid Pulse
colors:
  surface: '#fff8f8'
  surface-dim: '#ffcdd8'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f2'
  surface-container: '#ffe8ec'
  surface-container-high: '#ffe1e6'
  surface-container-highest: '#ffd9e0'
  on-surface: '#380a1a'
  on-surface-variant: '#5b3f44'
  inverse-surface: '#521f2f'
  inverse-on-surface: '#ffecef'
  outline: '#8f6f74'
  outline-variant: '#e4bdc3'
  surface-tint: '#bc0051'
  primary: '#b7004f'
  on-primary: '#ffffff'
  primary-container: '#e40a65'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb1c0'
  secondary: '#a23760'
  on-secondary: '#ffffff'
  secondary-container: '#fe7faa'
  on-secondary-container: '#77123f'
  tertiary: '#9721ac'
  on-tertiary: '#ffffff'
  tertiary-container: '#b441c7'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#ffb1c0'
  on-primary-fixed: '#3f0017'
  on-primary-fixed-variant: '#90003d'
  secondary-fixed: '#ffd9e2'
  secondary-fixed-dim: '#ffb1c7'
  on-secondary-fixed: '#3e001c'
  on-secondary-fixed-variant: '#831e48'
  tertiary-fixed: '#ffd6fe'
  tertiary-fixed-dim: '#f9abff'
  on-tertiary-fixed: '#35003f'
  on-tertiary-fixed-variant: '#7b008f'
  background: '#fff8f8'
  on-background: '#380a1a'
  surface-variant: '#ffd9e0'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered to evoke a sense of high-energy creativity and modern dynamism. Targeted at creative professionals and social platforms, it balances a high-vibrancy palette with soft, approachable geometry.

The design style is a hybrid of **Modern Minimalism** and **Glassmorphism**. It utilizes heavy whitespace to allow the intense pink tones to breathe, while employing translucent, frosted-glass layers for overlays to maintain a sense of lightness and depth. The interface should feel "bouncy" and alive—utilizing smooth transitions and soft-touch surfaces that respond to user interaction with energetic confidence.

## Colors

The palette is anchored by **Electric Pink (#FF2D78)**, a high-chroma primary used for critical actions and brand expression. 

- **Primary:** Electric Pink for buttons, active states, and brand-defining elements.
- **Secondary:** Soft Rose (#FF80AB) used for subtle accents and secondary interactive elements.
- **Tertiary:** Magenta (#9C27B0) reserved for deep contrast, notifications, or specific data visualization categories.
- **Backgrounds:** The primary workspace uses a "Soft Rose Tint" (#FFF5F8) to reduce eye strain compared to pure white, while maintaining a bright, airy feel.
- **Surfaces:** Cards and containers use pure White (#FFFFFF) to create a clear "lift" from the tinted background.
- **Text:** The neutral is a deep, warm plum (#3D0E1E) rather than black, ensuring typography feels integrated with the pink-skewed environment.

## Typography

This design system exclusively uses **Plus Jakarta Sans** for its modern, geometric construction and friendly, open apertures. 

Typography is treated with a hierarchy that emphasizes bold, thick headlines to drive the "energetic" narrative. Display sizes use a tighter letter-spacing to create a "locked-in" editorial look. Body text maintains a medium weight (500) where possible to ensure legibility against vibrant backgrounds. All labels and functional text use slightly increased tracking for clarity at smaller sizes.

## Layout & Spacing

The layout follows a **Fluid Grid** model based on an 8px base unit. 

- **Desktop:** 12-column grid with 24px gutters. Outer margins are generous (48px) to emphasize the "Minimalist" brand pillar.
- **Mobile:** 4-column grid with 16px margins. 
- **Philosophy:** Use "negative space as a feature." Content blocks should be separated by large gaps (lg/xl spacing) to prevent the vibrant colors from feeling cluttered. Alignment should be strictly kept to the grid to balance the "playful" rounded corners with structural discipline.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows**. 

1.  **Level 0 (Background):** Soft Rose (#FFF5F8) - the canvas.
2.  **Level 1 (Cards/Surface):** White (#FFFFFF) with a very soft, diffused shadow. The shadow color is not black; it is a low-opacity Magenta (#9C27B0) to keep the depth "warm."
3.  **Level 2 (Overlays/Modals):** Pure White with a "Glassmorphism" backdrop blur (20px) on the layers beneath. 

Avoid harsh borders. Instead, use thin, 1px strokes in a slightly darker pink tint (#FFD1E1) to define boundaries where shadows aren't appropriate.

## Shapes

The shape language is defined by **Pill-shaped (Extra Round)** geometry. 

All primary buttons, input fields, and tags must use the full pill radius. Large containers and cards should use `rounded-xl` (3rem) to maintain a soft, non-threatening, and highly modern aesthetic. This extreme roundness is the primary counterweight to the intense primary color, ensuring the "friendly" brand attribute is felt in every interaction.

## Components

### Interactive Elements
- **Buttons:** High-energy Electric Pink with white text. Hover states should include a slight scale-up (1.05x) to feel "bouncy." 
- **Inputs:** White surfaces with a Soft Rose border. On focus, the border thickens and turns Electric Pink with a subtle outer glow.
- **Avatars:** Strictly no profile photos. Use a circle with a Magenta-to-Pink gradient background and white centered initials or a minimalist icon.

### Data Visualization
- **Charts:** Use a "Vivid Gradient" approach. Data series should utilize a palette of Electric Pink, Magenta, and Deep Purple. 
- **Grid Lines:** Use very faint Rose strokes. 
- **Tooltips:** Use the Level 2 Elevation style (Glassmorphism) with high backdrop blur to float over data points.

### Feedback & Navigation
- **Chips:** Small, pill-shaped tags. Use Soft Rose backgrounds with Deep Plum text for a "subtle but clear" categorization.
- **Navigation:** Top-tier navigation uses "Active Indicator" dots in Electric Pink underneath the label, rather than highlighting the whole tab.