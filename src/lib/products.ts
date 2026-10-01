import { createClient } from "@/lib/supabase/server";
import type { Department, Product } from "@/lib/product-types";
export type { Department, Product } from "@/lib/product-types";
export { formatNaira } from "@/lib/product-types";

export const sampleProducts: Product[] = [
  { id:"11111111-1111-4111-8111-111111111111", slug:"amara-body-wave", name:"The Amara Body Wave", department:"hair", category:"Premium wig · 24 inch", description:"A full, soft body-wave unit with natural movement and a refined lace finish.", priceKobo:18500000, image:"/images/product-body-wave.png", badge:"Bestseller", options:["20 inch","22 inch","24 inch"], stock:12 },
  { id:"22222222-2222-4222-8222-222222222222", slug:"silky-straight-bundles", name:"Silky Straight Bundles", department:"hair", category:"Human hair · 3 bundles", description:"Three smooth, true-to-length bundles with healthy density from weft to ends.", priceKobo:6850000, image:"/images/product-straight-bundles.png", options:["18 inch","20 inch","22 inch"], stock:18 },
  { id:"33333333-3333-4333-8333-333333333333", slug:"naya-blunt-bob", name:"The Naya Blunt Bob", department:"hair", category:"Lace bob wig · 14 inch", description:"A sharp, polished bob with a realistic part and effortless everyday shape.", priceKobo:11200000, image:"/images/product-bob-wig.png", badge:"New", options:["12 inch","14 inch"], stock:8 },
  { id:"44444444-4444-4444-8444-444444444444", slug:"zola-deep-curl", name:"Zola Deep Curl", department:"hair", category:"Premium wig · 26 inch", description:"Defined, touchable curls with generous volume and a natural-looking hairline.", priceKobo:21000000, image:"/images/product-curly-wig.png", options:["22 inch","24 inch","26 inch"], stock:7 },
  { id:"55555555-5555-4555-8555-555555555555", slug:"auburn-water-wave", name:"Auburn Water Wave", department:"hair", category:"Braiding attachment · 3 packs", description:"Lightweight water-wave attachment in a warm auburn tone for expressive protective styles.", priceKobo:2450000, image:"/images/product-auburn-attachment.png", options:["Auburn","Natural black"], stock:25 },
  { id:"66666666-6666-4666-8666-666666666666", slug:"melt-hd-frontal", name:"Melt HD Frontal", department:"hair", category:"13×4 lace · Loose wave", description:"Fine transparent lace and softly waved human hair for a seamless custom install.", priceKobo:5200000, image:"/images/product-lace-frontal.png", options:["Natural black"], stock:10 },
  { id:"77777777-7777-4777-8777-777777777777", slug:"nourish-growth-ritual", name:"Nourish Growth Ritual", department:"cosmetics", category:"Oil, mask & leave-in", description:"A three-step moisture and scalp-care ritual designed for consistent weekly use.", priceKobo:2750000, image:"/images/product-hair-care.png", badge:"Bestseller", stock:20 },
  { id:"88888888-8888-4888-8888-888888888888", slug:"featherlight-lash-set", name:"Featherlight Lash Set", department:"cosmetics", category:"Reusable lashes · 2 pairs", description:"Soft, flexible lash bands with airy volume that remains comfortable all day.", priceKobo:900000, image:"/images/product-lashes.png", stock:30 },
  { id:"99999999-9999-4999-8999-999999999999", slug:"silk-hold-edge-control", name:"Silk Hold Edge Control", department:"cosmetics", category:"Styling gel · 120ml", description:"A clear, flake-free styling gel for smooth finishing and controlled definition.", priceKobo:850000, image:"/images/product-edge-control.png", badge:"New", stock:22 },
  { id:"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", slug:"gentle-relaxer-system", name:"Gentle Relaxer System", department:"cosmetics", category:"Complete care kit", description:"A measured smoothing system with neutralising care for an even, salon-ready result.", priceKobo:1950000, image:"/images/product-relaxer-kit.png", options:["Regular","Sensitive scalp"], stock:14 },
  { id:"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", slug:"moisture-wash-duo", name:"Moisture Wash Duo", department:"cosmetics", category:"Shampoo & conditioner", description:"A gentle cleansing and conditioning pair that leaves textured hair soft and manageable.", priceKobo:1650000, image:"/images/product-shampoo-set.png", stock:19 },
  { id:"cccccccc-cccc-4ccc-8ccc-cccccccccccc", slug:"vanilla-hair-mist", name:"Vanilla Hair Mist", department:"cosmetics", category:"Finishing mist · 100ml", description:"A lightweight finishing veil with a warm vanilla scent and luminous softness.", priceKobo:1100000, image:"/images/product-hair-mist.png", stock:24 },
  { id:"dddddddd-dddd-4ddd-8ddd-dddddddddddd", slug:"kairo-textured-hair-system", name:"Kairo Textured Hair System", department:"hair", category:"Men's lace wig · Natural curl", description:"A short, natural-looking lace hair system with defined texture and a realistic front hairline.", priceKobo:9800000, image:"/images/product-mens-textured-hair-system.png", badge:"New", options:["Natural black","Dark brown"], stock:10 },
  { id:"eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", slug:"atlas-salt-pepper-system", name:"Atlas Salt & Pepper System", department:"hair", category:"Men's hair system · Grey blend", description:"A refined salt-and-pepper hair system with balanced density and a discreet lace front.", priceKobo:10500000, image:"/images/product-mens-salt-pepper-system.png", badge:"New", options:["Grey blend","Natural black"], stock:8 },
  { id:"ffffffff-ffff-4fff-8fff-ffffffffffff", slug:"mens-scalp-wash-duo", name:"Men's Scalp Wash Duo", department:"cosmetics", category:"Men's hair care · Shampoo & conditioner", description:"A gentle cleansing and conditioning pair for short hair, protective styles and hair systems.", priceKobo:1800000, image:"/images/product-mens-wash-duo.png", badge:"New", stock:16 },
  { id:"10101010-1010-4010-8010-101010101010", slug:"mens-scalp-serum", name:"Men's Scalp Serum", department:"cosmetics", category:"Men's hair care · Scalp serum", description:"A lightweight serum for a comfortable scalp and a simple daily grooming routine.", priceKobo:1450000, image:"/images/product-mens-scalp-serum.png", badge:"New", stock:20 },
];

function mapRow(row: Record<string, unknown>): Product {
  return { id:String(row.id), slug:String(row.slug), name:String(row.name), department:row.department as Department, category:String(row.category), description:String(row.description), priceKobo:Number(row.price_kobo), image:String(row.image_url), badge:row.badge ? String(row.badge) : undefined, options:Array.isArray(row.options) ? row.options.map(String) : undefined, stock:Number(row.stock_quantity) };
}

export async function getProducts(department?: Department) {
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("id,slug,name,department,category,description,price_kobo,image_url,badge,options,stock_quantity").eq("is_active",true).order("sort_order");
    if (department) query = query.eq("department",department);
    const { data, error } = await query;
    if (!error && data?.length) return data.map((row) => mapRow(row));
  } catch { /* Migration may not be applied yet; retain a complete preview catalogue. */ }
  return department ? sampleProducts.filter((product) => product.department === department) : sampleProducts;
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

