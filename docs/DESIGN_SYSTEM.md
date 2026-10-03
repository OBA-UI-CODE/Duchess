# Duchess Design System

Version 0.1 — foundational direction before interface design.

## 1. Principles

1. **Two departments, one Duchess.** Hair and Cosmetics can have different
   imagery and tonal emphasis, but share one navigation, catalogue, account,
   cart, checkout, and component language.
2. **Editorial at discovery, practical at purchase.** Campaign areas may be
   expressive. Product comparison, forms, cart, and checkout prioritize speed
   and clarity.
3. **Premium through restraint.** Hierarchy, spacing, photography, and type do
   the work. Avoid excessive gradients, shadows, pills, and decorative motion.
4. **Inclusive beauty.** Imagery and language should represent different
   genders, skin tones, hair textures, ages, and personal styles.
5. **Responsive by composition.** Components rearrange at each target rather
   than shrinking a desktop canvas.

## 2. Responsive model

The design reference frames are:

| Mode | Reference width | Working range | Content behavior |
|---|---:|---:|---|
| Mobile | 393px | 0–599px | One column; 18px gutters (15px at 340px and below) |
| Tablet | 898px | 600–1099px | 8-column grid; 32px gutters |
| Desktop | 1440px | 1100px+ | 12-column grid; 64px gutters |

Implementation breakpoints should begin where composition changes, currently
`600px` and `1100px`. The three reference widths are validation targets, not
CSS breakpoint values. Content is capped at `1312px` on desktop
(`1440 - 2 × 64`) and remains centred on wider screens.

### Grid

| Mode | Columns | Gutter | Gap |
|---|---:|---:|---:|
| Mobile | 4 | 18px | 12px |
| Tablet | 8 | 32px | 20px |
| Desktop | 12 | 64px | 24px |

- Long reading text: maximum 65–72 characters per line.
- Forms: maximum 560px, except checkout's deliberate two-column composition.
- Product grids: 2 columns mobile, 3 tablet, 4 desktop. At 320px, allow one
  column only when a two-column card cannot preserve readable content.

## 3. Colour system

Final values must be contrast-tested in the actual UI.

| Token | Value | Use |
|---|---|---|
| `purple-950` | `#24102F` | Dark campaign surfaces |
| `purple-900` | `#321040` | Deep plum |
| `purple-800` | `#4B176D` | Brand foundation |
| `purple-700` | `#642294` | Primary hover |
| `purple-600` | `#7832AD` | Primary action |
| `purple-200` | `#D9C2EB` | Decorative lavender |
| `purple-100` | `#EEE4F5` | Selected/soft surfaces |
| `purple-50` | `#F8F3FB` | Page tint |
| `cream-50` | `#FFF9F2` | Warm editorial surface |
| `neutral-950` | `#1F1A21` | Primary text |
| `neutral-700` | `#514A54` | Secondary text |
| `neutral-500` | `#756D78` | Muted text; verify by size |
| `neutral-300` | `#CEC8D0` | Strong borders |
| `neutral-200` | `#E4DFE5` | Default borders |
| `neutral-100` | `#F3F0F3` | Subtle surfaces |
| `white` | `#FFFFFF` | Base surface |
| `success-700` | `#176B4B` | Success text/actions |
| `warning-700` | `#8A5100` | Low-stock warnings |
| `danger-700` | `#A8243A` | Errors/destructive actions |

Never use `purple-600` for small text on white until contrast verification.
Body text defaults to `neutral-950` or `neutral-700`.

## 4. Typography

### Families

- **Sora:** display headings, campaign copy, page titles, prices, key totals,
  and prominent calls to action.
- **DM Sans:** navigation, body copy, labels, inputs, descriptions, metadata,
  validation, and transactional UI.

Use variable fonts when possible and preload only the weights actually used.

### Semantic type scale

| Token | Mobile | Tablet | Desktop | Family / weight | Use |
|---|---|---|---|---|---|
| `display-xl` | 35/38 | 64/68 | 80/84 | Sora 600 | Split hero headline |
| `display-lg` | 34/36 | 48/54 | 64/70 | Sora 600 | Campaign headline |
| `heading-1` | 30–32/34 | 40/48 | 48/56 | Sora 600 | Page title |
| `heading-2` | 26/30 | 32/40 | 40/48 | Sora 600 | Major section |
| `heading-3` | 22–25/29 | 28/36 | 32/40 | Sora 600 | Subsection |
| `heading-4` | 20/26 | 22/28 | 24/32 | Sora 600 | Card/modal title |
| `body-lg` | 16/24 | 18/28 | 18/28 | DM Sans 400 | Introductory copy |
| `body-md` | 16/24 | 16/24 | 16/24 | DM Sans 400 | Default body/input |
| `body-sm` | 14/20 | 14/20 | 14/20 | DM Sans 400 | Metadata/support |
| `label-lg` | 16/20 | 16/20 | 16/20 | DM Sans 600 | Buttons/navigation |
| `label-md` | 14/18 | 14/18 | 14/18 | DM Sans 600 | Field labels/chips |
| `caption` | 12/16 | 12/16 | 12/16 | DM Sans 500 | Tertiary metadata |
| `price-lg` | 24/30 | 28/34 | 32/40 | Sora 600 | Product/checkout total |
| `price-md` | 18/24 | 18/24 | 20/26 | Sora 600 | Product-card price |

The notation is font-size/line-height in pixels. Use `clamp()` only for display
roles; transactional text should stay predictable. Body text never drops below
14px, and form inputs remain 16px to avoid mobile browser zoom.

## 5. Spacing and sizing

Use a 4px base with a deliberately small semantic scale:

| Token | Value | Typical use |
|---|---:|---|
| `space-0` | 0 | Reset |
| `space-1` | 4px | Icon/internal micro-gap |
| `space-2` | 8px | Label-to-control, tight stack |
| `space-3` | 12px | Compact card content |
| `space-4` | 16px | Default component padding |
| `space-5` | 18px | Mobile page gutter |
| `space-6` | 24px | Card padding/grid gap |
| `space-8` | 32px | Component groups |
| `space-10` | 40px | Small section spacing |
| `space-12` | 48px | Mobile section spacing |
| `space-16` | 64px | Tablet section spacing |
| `space-20` | 80px | Desktop section spacing |
| `space-24` | 96px | Large editorial separation |
| `space-30` | 120px | Desktop campaign rhythm |

Avoid arbitrary gaps unless reproducing a deliberate optical alignment. Record
any new reusable value as a token.

## 6. Shape, border, and elevation

- `radius-sm`: 6px — chips and compact controls
- `radius-md`: 10px — inputs and buttons
- `radius-lg`: 16px — cards and drawers
- `radius-xl`: 24px — editorial panels
- `radius-full`: 999px — status badges only
- Default border: 1px `neutral-200`
- Focus ring: 2px white separation + 3px `purple-700`
- Shadows are used for overlays and floating navigation, not every card.
- Product cards are borderless by default on tablet and desktop. Mobile cards
  use one restrained bordered surface around the image, metadata, title, price,
  and action so every collection has the same rhythm.

## 7. Buttons

### Sizes

| Size | Height | Horizontal padding | Label |
|---|---:|---:|---|
| Small | 40px | 16px | `label-md` |
| Medium | 48px | 20px | `label-lg` |
| Large | 52px | 24px | `label-lg` |

Variants: primary purple, secondary outlined, tertiary/text, destructive, and
icon-only. Full-width is common on mobile checkout and drawers, not the default
on desktop. Loading buttons retain their width, disable repeat submission, and
keep an accessible loading label.

## 8. Inputs and forms

- Default input height: 52px; multiline fields have at least 120px height.
- Labels are persistent above controls. Placeholder text is an example, never
  the only label.
- 8px label-to-control gap; 8px control-to-help/error gap; 20–24px between
  fields.
- Required/optional state is written explicitly where ambiguity exists.
- Validate on blur and submission, not every keystroke unless feedback is
  genuinely helpful.
- Error state combines icon, border, and explanatory text. Move focus to the
  first invalid field after submission.
- Address forms use sensible autocomplete attributes and Nigerian address/
  phone formats without preventing international customers where supported.

## 9. Navigation

### Desktop

- Optional announcement bar: 32px.
- Main navigation: 80px, logo left, departments/categories centred, search,
  account, wishlist, and cart right.
- Search becomes a visible field where catalogue size warrants it; otherwise a
  clearly labelled control opens search.
- Sticky behavior begins only after the hero and uses a compact 64px state.

### Tablet

- 72px navigation with menu, logo, search, account, and cart.
- Department navigation may use a full-width drawer or horizontal category
  row when it fits without truncation.

### Mobile

- 24px announcement bar with 8px text and a 62px top navigation with a centred
  Duchess mark.
- The header uses dedicated 44px menu, search, and cart targets so icons never
  overlap the wordmark at 393px or 320px.
- Account and wishlist live in the drawer; cart remains directly available.
- Drawer traps focus, closes via close button, backdrop, Escape, and navigation.

## 10. Product cards

- Image aspect ratio: 4:5 for wigs/editorial products; product-pack photography
  must be composed within the same card ratio using `object-fit: contain`.
- Card content order: optional badge, name, concise variant cue, price state,
  rating only when backed by reviews, availability/action.
- Clamp names to two lines in grids without hiding essential variant meaning.
- Sale price is primary; previous price uses strikethrough plus a textual sale
  cue. Never indicate discount through colour alone.
- Wishlist target is at least 44px and does not obstruct product imagery.
- On mobile the visible wishlist disc is 28px inside a 40px control. Badges use
  compact type and reserve enough image space so they never collide.
- Quick-add uses a compact 28px rounded-square visual rather than an oversized
  circular button.
- Show an “In cart” state after addition. Quick-add only when no selection is
  required; otherwise use “Choose options”.
- Skeletons match the card geometry to prevent layout shift.

## 11. Commerce layouts

- Product detail: two-column gallery/details desktop, balanced tablet, stacked
  mobile with purchase information immediately following the first image.
- Cart: line items plus sticky summary desktop; stacked items and persistent
  checkout action mobile.
- Checkout: customer/delivery/payment progression plus persistent order summary.
  Mobile may collapse the summary but must keep total visible.
- Confirmation: order number, payment state, next step, delivery summary, and
  email expectation. Do not rely on email as the only receipt.

## 12. Interaction states and motion

Every component specifies default, hover, pressed, focus-visible, disabled,
loading, error, success, empty, and unavailable states where relevant.

- Micro transitions: 120–180ms.
- Drawer/modal transitions: 200–280ms.
- Use opacity and transform where possible.
- Disable nonessential motion under `prefers-reduced-motion`.
- Do not hide critical information behind hover; touch and keyboard users need
  equivalent access.

## 13. Accessibility acceptance criteria

- WCAG 2.2 AA contrast and semantics.
- 44x44px minimum targets, with comfortable spacing between adjacent targets.
- Visible focus on every control; focus is never obscured by sticky UI.
- Logical keyboard order and managed focus for drawers, dialogs, and errors.
- Alternative text describes the product and meaningful visual differences;
  decorative campaign elements use empty alt text.
- Zoom to 200% and reflow to 320px without loss of function or horizontal page
  scrolling.

## 14. Research basis

The system adapts established guidance rather than copying another brand:

- Shopify recommends a robust typography hierarchy, prominent discoverable
  navigation, and consistency in scale, spacing, components, and layouts.
- Material Design provides a useful precedent for semantic type roles rather
  than page-specific font declarations.
- WCAG 2.2 informs contrast, focus, reflow, and target sizing.
- Baymard's ecommerce studies inform product-list recognition, predictable
  checkout, form clarity, and avoidance of unnecessary checkout friction.

