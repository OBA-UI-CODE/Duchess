export type Department = "hair" | "cosmetics";

export type Product = {
  id: string;
  slug: string;
  name: string;
  department: Department;
  category: string;
  description: string;
  priceKobo: number;
  image: string;
  badge?: string;
  options: string[];
  stock: number;
};

export type CartItem = { product: Product; quantity: number; option: string };

export function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    department: row.department as Department,
    category: String(row.category),
    description: String(row.description),
    priceKobo: Number(row.price_kobo),
    image: String(row.image_url),
    badge: row.badge ? String(row.badge) : undefined,
    options: Array.isArray(row.options) ? row.options.map(String) : [],
    stock: Number(row.stock_quantity),
  };
}

export function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}
