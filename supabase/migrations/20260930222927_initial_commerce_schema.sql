create extension if not exists pgcrypto;

create type public.department as enum ('hair','cosmetics');
create type public.order_status as enum ('pending','awaiting_payment','paid','processing','shipped','delivered','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  department public.department not null,
  category text not null,
  description text not null,
  price_kobo integer not null check (price_kobo >= 0),
  image_url text not null,
  badge text,
  options jsonb not null default '[]'::jsonb,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home', full_name text not null, phone text not null,
  line1 text not null, line2 text, city text not null, state text not null, country text not null default 'Nigeria',
  is_default boolean not null default false, created_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade, selected_option text not null default '',
  quantity integer not null check (quantity between 1 and 20), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id,product_id,selected_option)
);

create table public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(user_id,product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null, email text not null,
  status public.order_status not null default 'pending', subtotal_kobo integer not null check(subtotal_kobo >= 0),
  delivery_kobo integer not null check(delivery_kobo >= 0), total_kobo integer not null check(total_kobo >= 0),
  shipping_address jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null, product_name text not null,
  selected_option text not null default '', unit_price_kobo integer not null check(unit_price_kobo >= 0),
  quantity integer not null check(quantity > 0), image_url text not null
);

create index products_department_active_idx on public.products(department,sort_order) where is_active;
create index cart_items_user_idx on public.cart_items(user_id);
create index addresses_user_idx on public.addresses(user_id);
create index orders_user_created_idx on public.orders(user_id,created_at desc);
create index order_items_order_idx on public.order_items(order_id);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Public catalogue is readable" on public.products for select to anon,authenticated using (is_active);
create policy "Users read own profile" on public.profiles for select to authenticated using ((select auth.uid())=id);
create policy "Users update own profile" on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "Users manage own addresses" on public.addresses for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Users manage own cart" on public.cart_items for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Users manage own wishlist" on public.wishlist_items for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Users read own orders" on public.orders for select to authenticated using ((select auth.uid())=user_id);
create policy "Users read own order items" on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and o.user_id=(select auth.uid())));

grant select on public.products to anon,authenticated;
grant select,insert,update,delete on public.profiles,public.addresses,public.cart_items,public.wishlist_items to authenticated;
grant select on public.orders,public.order_items to authenticated;

insert into public.products(id,slug,name,department,category,description,price_kobo,image_url,badge,options,stock_quantity,sort_order) values
('11111111-1111-4111-8111-111111111111','amara-body-wave','The Amara Body Wave','hair','Premium wig · 24 inch','A full, soft body-wave unit with natural movement and a refined lace finish.',18500000,'/images/product-body-wave.png','Bestseller','["20 inch","22 inch","24 inch"]',12,1),
('22222222-2222-4222-8222-222222222222','silky-straight-bundles','Silky Straight Bundles','hair','Human hair · 3 bundles','Three smooth, true-to-length bundles with healthy density from weft to ends.',6850000,'/images/product-straight-bundles.png',null,'["18 inch","20 inch","22 inch"]',18,2),
('33333333-3333-4333-8333-333333333333','naya-blunt-bob','The Naya Blunt Bob','hair','Lace bob wig · 14 inch','A sharp, polished bob with a realistic part and effortless everyday shape.',11200000,'/images/product-bob-wig.png','New','["12 inch","14 inch"]',8,3),
('44444444-4444-4444-8444-444444444444','zola-deep-curl','Zola Deep Curl','hair','Premium wig · 26 inch','Defined, touchable curls with generous volume and a natural-looking hairline.',21000000,'/images/product-curly-wig.png',null,'["22 inch","24 inch","26 inch"]',7,4),
('55555555-5555-4555-8555-555555555555','auburn-water-wave','Auburn Water Wave','hair','Braiding attachment · 3 packs','Lightweight water-wave attachment in a warm auburn tone.',2450000,'/images/product-auburn-attachment.png',null,'["Auburn","Natural black"]',25,5),
('66666666-6666-4666-8666-666666666666','melt-hd-frontal','Melt HD Frontal','hair','13×4 lace · Loose wave','Fine transparent lace and softly waved human hair.',5200000,'/images/product-lace-frontal.png',null,'["Natural black"]',10,6),
('77777777-7777-4777-8777-777777777777','nourish-growth-ritual','Nourish Growth Ritual','cosmetics','Oil, mask & leave-in','A three-step moisture and scalp-care ritual.',2750000,'/images/product-hair-care.png','Bestseller','[]',20,7),
('88888888-8888-4888-8888-888888888888','featherlight-lash-set','Featherlight Lash Set','cosmetics','Reusable lashes · 2 pairs','Soft flexible lash bands with airy volume.',900000,'/images/product-lashes.png',null,'[]',30,8),
('99999999-9999-4999-8999-999999999999','silk-hold-edge-control','Silk Hold Edge Control','cosmetics','Styling gel · 120ml','A clear flake-free styling gel.',850000,'/images/product-edge-control.png','New','[]',22,9),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','gentle-relaxer-system','Gentle Relaxer System','cosmetics','Complete care kit','A measured smoothing system with neutralising care.',1950000,'/images/product-relaxer-kit.png',null,'["Regular","Sensitive scalp"]',14,10),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','moisture-wash-duo','Moisture Wash Duo','cosmetics','Shampoo & conditioner','A gentle cleansing and conditioning pair.',1650000,'/images/product-shampoo-set.png',null,'[]',19,11),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc','vanilla-hair-mist','Vanilla Hair Mist','cosmetics','Finishing mist · 100ml','A lightweight finishing veil with warm vanilla scent.',1100000,'/images/product-hair-mist.png',null,'[]',24,12)
on conflict(slug) do nothing;
