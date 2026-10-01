create or replace function public.create_pending_order(
  p_email text,
  p_shipping_address jsonb,
  p_items jsonb,
  p_delivery_kobo integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_order_number text := 'DUC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
  v_subtotal integer := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
  v_option text;
begin
  if p_email is null or length(trim(p_email)) < 5 or position('@' in p_email) < 2 then
    raise exception 'A valid email address is required';
  end if;
  if p_shipping_address is null or not (p_shipping_address ?& array['full_name','phone','line1','city','state']) then
    raise exception 'A complete delivery address is required';
  end if;
  if p_delivery_kobo not in (350000, 650000) then
    raise exception 'Invalid delivery charge';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 20 then
    raise exception 'An order must contain between 1 and 20 items';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;
    v_option := coalesce(v_item ->> 'option', 'Standard');
    if v_quantity < 1 or v_quantity > 20 then raise exception 'Invalid item quantity'; end if;

    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::uuid and is_active
      for share;
    if not found then raise exception 'A selected product is unavailable'; end if;
    if v_product.stock_quantity < v_quantity then raise exception 'Insufficient stock for %', v_product.name; end if;
    if jsonb_array_length(v_product.options) > 0 and not (v_product.options ? v_option) then
      raise exception 'Invalid option for %', v_product.name;
    end if;
    v_subtotal := v_subtotal + (v_product.price_kobo * v_quantity);
  end loop;

  insert into public.orders(id, order_number, user_id, email, status, subtotal_kobo, delivery_kobo, total_kobo, shipping_address)
  values(v_order_id, v_order_number, auth.uid(), lower(trim(p_email)), 'pending', v_subtotal, p_delivery_kobo, v_subtotal + p_delivery_kobo, p_shipping_address);

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select * into v_product from public.products where id = (v_item ->> 'product_id')::uuid;
    insert into public.order_items(order_id, product_id, product_name, selected_option, unit_price_kobo, quantity, image_url)
    values(v_order_id, v_product.id, v_product.name, coalesce(v_item ->> 'option', 'Standard'), v_product.price_kobo, (v_item ->> 'quantity')::integer, v_product.image_url);
  end loop;

  return jsonb_build_object('order_id', v_order_id, 'order_number', v_order_number, 'subtotal_kobo', v_subtotal, 'delivery_kobo', p_delivery_kobo, 'total_kobo', v_subtotal + p_delivery_kobo);
end;
$$;

revoke all on function public.create_pending_order(text,jsonb,jsonb,integer) from public;
grant execute on function public.create_pending_order(text,jsonb,jsonb,integer) to anon, authenticated;
