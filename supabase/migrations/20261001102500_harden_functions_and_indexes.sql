-- Trigger and platform helper functions must not be callable through PostgREST.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Cover foreign keys used by joins and cascading deletes.
create index cart_items_product_idx on public.cart_items(product_id);
create index wishlist_items_product_idx on public.wishlist_items(product_id);
create index order_items_product_idx on public.order_items(product_id);
