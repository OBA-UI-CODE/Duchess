"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Department, Product } from "@/lib/product-types";

export function Catalogue({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<Department | "all">("all");
  const visible = products.filter((product) => (department === "all" || product.department === department) && `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()));
  return <><div className="catalogue-tools"><label><Search /><span className="sr-only">Search catalogue</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search wigs, treatments, lashes…" /></label><div className="filter-tabs">{(["all","hair","cosmetics"] as const).map((item) => <button className={department === item ? "is-active" : ""} onClick={() => setDepartment(item)} key={item}>{item === "all" ? "All products" : item === "hair" ? "Hair & accessories" : "Care & cosmetics"}</button>)}</div></div>{visible.length ? <div className="product-grid">{visible.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <p className="empty-copy">No products match that search.</p>}</>;
}
