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
  options?: string[];
  stock: number;
};

export function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

export function calculateSubtotal(items: Array<{ priceKobo: number; quantity: number }>) {
  return items.reduce((total, item) => total + item.priceKobo * item.quantity, 0);
}
