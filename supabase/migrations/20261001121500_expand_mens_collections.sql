-- Add the first men's hair and care edit. Keep IDs stable so carts and wishlists
-- retain their product references across catalogue refreshes.
insert into public.products
  (id, slug, name, department, category, description, price_kobo, image_url, badge, options, stock_quantity, sort_order)
values
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'kairo-textured-hair-system',
    'Kairo Textured Hair System',
    'hair',
    'Men''s lace wig · Natural curl',
    'A short, natural-looking lace hair system with defined texture and a realistic front hairline.',
    9800000,
    '/images/product-mens-textured-hair-system.png',
    'New',
    '["Natural black", "Dark brown"]'::jsonb,
    10,
    13
  ),
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    'atlas-salt-pepper-system',
    'Atlas Salt & Pepper System',
    'hair',
    'Men''s hair system · Grey blend',
    'A refined salt-and-pepper hair system with balanced density and a discreet lace front.',
    10500000,
    '/images/product-mens-salt-pepper-system.png',
    'New',
    '["Grey blend", "Natural black"]'::jsonb,
    8,
    14
  ),
  (
    'ffffffff-ffff-4fff-8fff-ffffffffffff',
    'mens-scalp-wash-duo',
    'Men''s Scalp Wash Duo',
    'cosmetics',
    'Men''s hair care · Shampoo & conditioner',
    'A gentle cleansing and conditioning pair for short hair, protective styles and hair systems.',
    1800000,
    '/images/product-mens-wash-duo.png',
    'New',
    '[]'::jsonb,
    16,
    15
  ),
  (
    '10101010-1010-4010-8010-101010101010',
    'mens-scalp-serum',
    'Men''s Scalp Serum',
    'cosmetics',
    'Men''s hair care · Scalp serum',
    'A lightweight serum for a comfortable scalp and a simple daily grooming routine.',
    1450000,
    '/images/product-mens-scalp-serum.png',
    'New',
    '[]'::jsonb,
    20,
    16
  )
on conflict (slug) do nothing;
