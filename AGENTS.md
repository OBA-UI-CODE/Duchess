# Duchess Agent Instructions

These instructions apply to the entire repository. Duchess is a responsive
beauty-commerce product selling hair, wigs, attachments, lashes, hair care,
and cosmetics. It serves shoppers of every gender. The visual identity is
premium, contemporary, warm, and inclusive; never childish or excessively
ornamental.

## Product foundations

- The storefront has two primary departments: **Hair & Accessories** and
  **Hair Care & Cosmetics**. Marketing may shorten these to **Hair** and
  **Cosmetics**.
- The homepage begins with a two-path Hair/Cosmetics experience inspired by
  the decision simplicity of Bimbo Oni Studio, not a visual copy of that site.
- The primary viewport references are 1440px desktop, 898px tablet, and 393px
  mobile. All layouts must also remain usable between and beyond those widths.
- Sora is the display typeface. DM Sans is the interface and body typeface.
- `docs/DESIGN_SYSTEM.md` is the visual and interaction source of truth.

## Expected architecture

- Use Next.js App Router with TypeScript and strict type checking.
- Use server components by default. Add `"use client"` only where browser
  state, effects, or interaction requires it.
- Use Supabase for Postgres, authentication, Google OAuth, and product media.
- Use Paystack for payments. Prices and order totals must be calculated and
  verified on the server; never trust totals submitted by the browser.
- Use Mailgun for transactional messages. Email failure must be recorded and
  retried without rolling back an otherwise valid paid order.
- Keep secrets server-only. Never expose the Supabase service-role key,
  Paystack secret key, Mailgun API key, or webhook secrets to client bundles.

## Data and security rules

- Every database change must be represented by a forward-only migration.
- Enable Row-Level Security on every exposed table and explicitly define who
  can select, insert, update, and delete records.
- Store money in integer minor units (kobo), never floating-point values.
- Use immutable order-item snapshots for name, variant, quantity, and price so
  historical orders do not change when the catalogue changes.
- Create orders and reserve/deduct stock atomically. Prevent negative stock,
  duplicate payment fulfillment, and webhook replay.
- Verify Paystack webhook signatures and re-fetch transactions from Paystack
  before marking orders paid. Make webhook processing idempotent.
- Validate all external input on the server, including Server Actions, route
  handlers, webhooks, query strings, and uploaded files.
- Authorize administrative operations on the server. Hidden controls are not
  authorization.
- Do not log passwords, tokens, full addresses, or payment data.

## Design implementation rules

- Use semantic design tokens; do not scatter raw colours, spacing, shadows,
  radii, or arbitrary font sizes through components.
- Preserve the hierarchy and responsive behavior defined in
  `docs/DESIGN_SYSTEM.md`.
- Minimum interactive target: 44x44px. Primary buttons and form controls are
  normally 48px or 52px high.
- Every interactive element needs visible hover, active, focus-visible,
  disabled, loading, error, and success states where applicable.
- Never communicate status through colour alone.
- Product photography must retain a consistent aspect ratio and never stretch.
- Mobile behavior must be designed explicitly; desktop layouts may not simply
  be scaled down.
- Respect `prefers-reduced-motion`. Animation must clarify state, not delay use.

## Commerce UX rules

- Search, account, wishlist, and cart must remain discoverable without
  competing with the Hair/Cosmetics homepage decision.
- Product cards display department-relevant essentials only: image, brand or
  category eyebrow when useful, product name, price, relevant price state,
  rating only when genuine, and availability.
- Quick-add is allowed only when no choice is required. Products with wigs,
  shades, lengths, sizes, or other variants must open a selection experience.
- Clearly show when a listing is already in the cart.
- Checkout must support guest checkout. Account creation is optional and may
  be offered after purchase.
- Keep checkout linear and show the order summary throughout. Do not surprise
  customers with delivery charges at the final action.
- The final action must state the consequence clearly, for example
  **Pay ₦42,000**, rather than **Continue**.

## Accessibility and content

- Target WCAG 2.2 AA. Text contrast is at least 4.5:1 for normal text and 3:1
  for large text; meaningful UI boundaries and states meet 3:1.
- Use semantic HTML, real labels, logical heading order, descriptive link text,
  keyboard support, focus management, and appropriate live regions.
- Error messages explain what happened and how to fix it. Preserve valid form
  values when another field fails.
- Use concise, warm, inclusive language. Avoid assuming the shopper's gender.
- Use **Cosmetics**, never the misspelling “costmetics”.

## Testing and validation

- Every feature includes proportionate tests. Critical pricing, discount,
  inventory, payment, and order-state logic requires unit tests.
- Add integration tests for authenticated/unauthenticated database access,
  Row-Level Security, API endpoints, webhooks, and checkout transitions.
- Cover duplicate webhook delivery, failed email delivery, out-of-stock races,
  invalid prices, cancelled payments, and unauthorized admin actions.
- Before handing off: run formatting, linting, type checking, tests, and the
  production build.
- Browser-test affected journeys at 1440px, 898px, and 393px, plus one narrow
  320px check. Confirm keyboard operation and absence of horizontal overflow.
- After deployment, verify the production URL and inspect runtime/build logs.

## Git and change discipline

- Preserve unrelated user changes and never commit credentials or `.env`
  files.
- Keep commits focused and describe user-visible behavior or risk addressed.
- Do not apply production migrations until compatible application code is
  deployed when ordering affects availability.
- Update documentation when architecture, tokens, schema, or business rules
  change.

