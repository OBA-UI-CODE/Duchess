# Duchess design guide

This is the quick reference for Duchess's current storefront. The detailed design specification and token table live in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md); that file remains the source of truth for new components.

## Product experience

Duchess is a beauty shop with two entry paths: **Hair & Accessories** and **Hair Care & Cosmetics**. The first screen asks shoppers which collection to enter. Department pages then provide an editorial introduction, product selection, care guidance and a route into the full catalogue. Search, account, saved products, cart and checkout are shared across both departments. Product listings should make it clear which pieces and care products suit different customers without assigning products to a gender by default.

Each department introduces three clear collections. Hair has **Women's wigs**, **Men's wigs & hair systems**, and **Bundles & attachments**. Care & Cosmetics has **Hair care & treatments**, **Men's hair care**, and **Lashes & beauty**. Every collection hub also offers **All products** so a shopper can skip categories. New arrivals show products explicitly marked `New`.

## Visual language

The direction is warm, confident and restrained. Deep purple anchors the identity (`--purple-950`, `--purple-900`, `--purple-800`); cream (`--cream-50`) provides the base canvas; pale lavender (`--purple-50`, `--purple-100`) separates editorial areas. Use semantic CSS variables in `src/app/globals.css` and add reusable values there instead of scattering new colours in components.

**Sora** is used for display headlines, page titles, prices and prominent calls to action. **DM Sans** is used for navigation, body copy, labels and forms. Campaign titles have the largest scale; category labels are short uppercase eyebrows; product and checkout information remains easy to scan. Normal body text stays at least 14px.

The core spacing scale starts at 4px and progresses through 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 and 120px. Product images share a 4:5 ratio and should show the item clearly without stretching or placeholder imagery. Buttons and icon actions have at least a 44px touch target; main actions are usually 48–52px tall. Interactive controls need visible focus states and clear labels.

## Layout and navigation

| Reference | Composition | Page gutter | Product grid |
| --- | --- | --- | --- |
| 1440px desktop | 12 columns | 64px | 4 columns |
| 898px tablet | 8 columns | 32px | 3 columns |
| 393px mobile | 4 columns | 20px | 2 columns |

Content generally caps at 1312px. Composition changes around 1100px and 600px; the reference widths are test targets, not hard breakpoints. At 320px, product cards may move to one column to preserve legibility. Mobile navigation keeps the menu, centred brand, search and cart within a 64px bar; secondary links live in the menu. The desktop header is 80px tall.

Department pages link to relevant catalogue sections. The Journal collects practical hair and care guidance, and New Arrivals lists products marked `New` in the catalogue. Both routes must remain reachable through descriptive links and work with keyboard navigation. If no products are marked `New`, show a useful empty state and a link to shop all products.

## Commerce and content rules

Product cards show real imagery, a concise category cue, product name, price and meaningful availability. Ratings appear only if backed by real reviews. Products that need a length, shade or other choice route to product detail before adding to cart. The cart and saved products belong to the current shopper; signed-in data must be separated by account. Checkout keeps the order summary and delivery costs visible before submission. Prices shown to customers are formatted from integer kobo values, while the server validates product prices and stock for order creation.

Copy should be concise, helpful and inclusive. Use **Cosmetics** consistently. Avoid unsupported product claims, invented reviews and implied payment functionality before payment processing is active. Product and article photography needs specific, useful alt text; decorative images can be hidden from assistive technology.

Guest cart and wishlist data use a guest-only browser storage key. Signing in transfers that guest selection once into the signed-in account. Authenticated carts and wishlists are loaded from Supabase, with RLS limiting each customer to their own rows. Signing out or switching accounts clears the previous shopper's visible selection immediately. The legacy shared browser storage key is discarded.

## Validation

Before handing off an interface change, check it at 1440px, 898px, 393px and 320px, including keyboard access, focus visibility and horizontal overflow. Run lint, type checking, relevant tests and a production build. Review the route from discovery through product detail, cart and checkout after changing navigation or product taxonomy.
