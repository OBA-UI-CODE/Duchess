-- Publish authenticated cart changes so web and mobile clients can reconcile.
-- FULL preserves the ownership key in DELETE events for filtered subscriptions.
alter table public.cart_items replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'cart_items'
  ) then
    alter publication supabase_realtime add table public.cart_items;
  end if;
end
$$;
