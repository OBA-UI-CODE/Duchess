# Duchess

Duchess is a responsive beauty-commerce storefront for wigs, attachments,
lashes, hair products, treatments, and cosmetics. Its discovery experience is
organized around two connected departments: **Hair & Accessories** and
**Hair Care & Cosmetics**.

## Current status

The responsive web storefront and the first Expo mobile client are implemented.
The mobile client shares Supabase authentication, catalogue data, and the
signed-in cart with the website. Payment processing remains intentionally
disabled until Paystack is connected and verified.

- [Design system](docs/DESIGN_SYSTEM.md)
- [AI agent instructions](AGENTS.md)

The storefront uses Supabase and Google authentication, with Resend handling
transactional order email. Paystack remains the planned payment provider.
Primary design references are 1440px desktop, 898px tablet, and 393px mobile.

## Mobile app

The Expo application lives in `mobile/`. To run it on a phone:

1. Copy `mobile/.env.example` to `mobile/.env`.
2. Add the same Supabase URL and publishable key used by the website.
3. Apply the pending Supabase migrations, including the cart Realtime
   publication migration.
4. Run `npm install` and `npm start` from `mobile/` for local development.
5. Use an EAS development or preview build when testing Google authentication.

Email/password and Google authentication are available. Google OAuth uses the
`duchess://auth/callback` deep link, which must remain registered in Supabase
Auth. Expo Go cannot test this custom-scheme OAuth flow; use an installable EAS
build instead.
