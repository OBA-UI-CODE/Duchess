# Duchess

Duchess is a responsive beauty-commerce storefront and companion mobile app
for wigs, hair systems, attachments, lashes, hair care, treatments, and
cosmetics. The catalogue is organized around two departments: **Hair &
Accessories** and **Hair Care & Cosmetics**, with dedicated women's and men's
collections.

- Production website: [https://duchess.johta.click](https://duchess.johta.click)
- Web application: Next.js 16, React 19, TypeScript
- Mobile application: Expo SDK 57, React Native, Expo Router
- Backend: Supabase Auth, Postgres, Row Level Security, and Realtime
- Transactional email: Resend
- Hosting and builds: Vercel and EAS Build

## Project status

The responsive website and the first installable Android mobile client are
implemented. Both clients use the same Supabase project, accounts, product
catalogue, and signed-in shopping cart. The website is deployed to Vercel, and
the mobile project is connected to the `johtaapps` EAS account.

Online payment is intentionally disabled. Checkout currently creates a secure
pending order and sends an order-received email, but it does not charge the
customer. Paystack remains the planned payment provider.

## Implemented features

### Website

- Responsive storefront layouts for desktop, tablet, and mobile.
- Landing, shop, department, collection, new-arrivals, journal, and individual
  product pages.
- Women's wigs, men's wigs and hair systems, bundles and attachments, hair
  care, men's hair care, lashes, and beauty collections.
- Product options, quantity controls, product badges, Nigerian-naira pricing,
  and catalogue images.
- Guest cart and wishlist stored locally in the browser.
- Account cart and wishlist stored in Supabase with ownership enforced through
  Row Level Security.
- One-time guest cart/wishlist transfer when a guest signs into an account.
- Realtime cart updates with polling, focus, and visibility refresh fallbacks.
- Cart, wishlist, checkout, and account pages.
- Email/password signup and login with password visibility controls.
- Email confirmation, Google OAuth, password-reset email, and sign-out flows.
- Pending-order checkout with server-side product, option, quantity, address,
  delivery-price, and origin validation.
- Order confirmation email delivery through Resend, including retry handling
  for temporary provider failures.
- Shipping and returns, privacy, and terms pages.
- Generated metadata, Open Graph image, robots rules, and sitemap.

### Mobile app

The Expo application lives in [`mobile/`](mobile/).

- Native shop, bag, and account routes using Expo Router.
- Shared Supabase email/password and Google authentication.
- Persistent native sessions through AsyncStorage and automatic token refresh.
- `duchess://auth/callback` deep-link route for Google OAuth.
- Shared Supabase product catalogue with department filters and pull-to-refresh.
- Product detail sheet with option and quantity selection.
- Signed-in cart shared with the website.
- Supabase Realtime cart subscription plus a four-second polling fallback and
  refresh whenever the app returns to the foreground.
- Quantity controls, cart subtotal, cart badge, and illustrated shopping hero.
- Custom typography, app icons, adaptive Android icons, and splash assets.
- EAS development, preview, and production build profiles. Preview Android
  builds produce installable APK files.

Google OAuth must be tested with an installable EAS build. Expo Go cannot own
the custom `duchess://` URL scheme required to return authentication to the
Duchess app.

## Current limitations and planned work

- The website has a complete wishlist; a dedicated mobile wishlist screen has
  not been implemented yet.
- On some Android devices, Google authentication completes and persists the
  session but leaves the browser in the foreground. Reopening Duchess shows the
  signed-in account. The automatic return-to-app experience still needs device
  testing and refinement.
- Mobile checkout and order history are not part of the current mobile client.
- Paystack is not connected, so no online payment is collected.
- EAS artifact download links are temporary and should not be treated as a
  permanent public app-distribution URL.

## Repository structure

```text
.
|-- mobile/                  Expo/React Native application
|   |-- assets/              App icons, splash art, and shopping illustration
|   |-- src/app/             Expo Router screens and OAuth callback
|   |-- App.tsx              Mobile catalogue, auth, cart, and account UI
|   |-- app.json             Native identifiers, scheme, plugins, and EAS link
|   `-- eas.json             Development, preview, and production profiles
|-- public/images/           Website product and editorial imagery
|-- src/app/                 Next.js App Router pages and order API
|-- src/components/          Storefront, auth, cart, wishlist, and checkout UI
|-- src/lib/                 Catalogue, commerce, Supabase, and email logic
|-- supabase/migrations/     Database schema, catalogue data, orders, and Realtime
|-- docs/DESIGN_SYSTEM.md    Visual design foundations
`-- AGENTS.md                Repository development instructions
```

## Database and security

The Supabase migrations define:

- User profiles and addresses.
- Products and inventory.
- Cart and wishlist items.
- Orders and order items.
- Seed catalogue data, including expanded men's collections.
- A server-side `create_pending_order` function that recalculates prices from
  trusted database records rather than accepting totals from the browser.
- Row Level Security policies that restrict customer records to their owner
  while allowing public reads of active catalogue products.
- Supporting indexes and restricted execution privileges for helper functions.
- `cart_items` Realtime publication and `REPLICA IDENTITY FULL` for reliable
  cross-client cart updates, including delete events.

Never expose a Supabase secret/service-role key in either client. The website
and mobile app use only the public publishable key; privileged order creation
is constrained by the database function and its validation.

## Authentication configuration

Supabase Auth must be configured with:

- Email signup enabled.
- Email confirmation enabled.
- Google provider enabled with its client credentials.
- Production site URL set to `https://duchess.johta.click`.
- Web callback URLs for the production site and local development.
- Native redirect URL `duchess://auth/callback`.

The mobile application uses package/bundle identifier `com.duchess.store` and
the native scheme `duchess`.

## Email configuration

Duchess uses email in two separate ways:

1. **Supabase Auth SMTP** sends signup confirmations and password-reset emails.
   The verified Resend sending subdomain is `mail.duchess.johta.click`. SMTP
   credentials are configured in the Supabase dashboard and are not stored in
   this repository.
2. **The order API** uses the Resend SDK and the server-only `RESEND_API_KEY`
   and `RESEND_FROM` variables to send pending-order acknowledgements.

The Resend API key, SMTP password, Supabase credentials, and local `.env` files
must never be committed.

## Local website setup

Prerequisites:

- Node.js and npm
- A Supabase project
- A Resend account for transactional email

Install dependencies:

```powershell
npm install
```

Copy `.env.example` to `.env.local` and set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://duchess.johta.click
RESEND_API_KEY=
RESEND_FROM=Duchess <orders@example.com>
```

Run the development server:

```powershell
npm run dev
```

The default local address is `http://localhost:3000`.

## Supabase setup

Link the Supabase CLI to the intended project and apply the migrations in
`supabase/migrations/`. Review the target project before applying database
changes.

For a new project, the migrations must run in timestamp order. They create the
commerce schema, security policies, seed products, pending-order function, and
cart Realtime publication.

Dashboard-only configuration—Google credentials, redirect allow-list, email
confirmation, and Resend SMTP—must be completed separately because it is not
contained in SQL migrations.

## Mobile setup

Install the mobile dependencies:

```powershell
cd mobile
npm install
```

Copy `mobile/.env.example` to `mobile/.env` and set the same public Supabase
project used by the website:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_SITE_URL=https://duchess.johta.click
```

Start local development:

```powershell
npm start
```

Use Expo Go only for non-OAuth UI development. Build an installable client for
Google authentication:

```powershell
npx eas-cli@latest build --platform android --profile preview
```

The project is linked to EAS project `@johtaapps/duchess-mobile`. EAS
environment variables must be configured for each build environment; local
`.env` files are not a substitute for remote build variables.

## Quality checks

Run website checks from the repository root:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Run mobile checks from `mobile/`:

```powershell
npm run typecheck
npm run doctor
```

The website test suite covers catalogue collections, account/guest commerce
ownership, product totals and currency formatting, and Resend order-email
behavior.

## Deployment

- The production website is hosted by Vercel at
  `https://duchess.johta.click`.
- Vercel production environment variables must match `.env.example`.
- The Android app is built through EAS using `mobile/eas.json`.
- Supabase remains the shared source of truth for authenticated users, products,
  carts, wishlists, and orders.

## Design references

- [Design system](docs/DESIGN_SYSTEM.md)
- [AI agent instructions](AGENTS.md)

Primary responsive design references are 1440px desktop, 898px tablet, and
393px mobile.
