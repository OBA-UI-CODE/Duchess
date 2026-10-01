import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { collections, getCollectionProducts, getDepartmentCollections } from "@/lib/collections";
import { getProducts } from "@/lib/products";
import type { Department } from "@/lib/product-types";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return ["hair", "cosmetics", ...collections.map((collection) => collection.slug)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "hair") return { title: "Shop hair collections", description: "Explore women's wigs, men's hair systems, bundles and attachments at Duchess." };
  if (slug === "cosmetics") return { title: "Shop care & cosmetics", description: "Explore hair care, men's hair care, lashes and beauty essentials at Duchess." };
  const collection = collections.find((item) => item.slug === slug);
  return collection ? { title: collection.title, description: collection.description } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const department = slug === "hair" || slug === "cosmetics" ? slug as Department : collections.find((item) => item.slug === slug)?.department;
  if (!department) notFound();
  const products = await getProducts(department);
  const collection = collections.find((item) => item.slug === slug);
  const departmentCollections = getDepartmentCollections(department);
  const visible = collection ? getCollectionProducts(products, collection) : products;
  const title = collection?.title ?? (department === "hair" ? "Explore Hair | Accessories" : "Explore care & cosmetics");
  const description = collection?.description ?? (department === "hair"
    ? "Choose women's wigs, men's hair systems or styling pieces, then find the texture and fit that feels right."
    : "Discover hair routines, men's scalp care and finishing beauty essentials.");

  return <main>
    <Header department={department} />
    <div className="collection-page">
      <nav className="collection-breadcrumb" aria-label="Breadcrumb">
        <Link href={department === "hair" ? "/hair" : "/cosmetics"}>{department === "hair" ? "Hair" : "Care & cosmetics"}</Link>
        <span aria-hidden="true">/</span>
        {collection ? <><Link href={`/collections/${department}`}>Collections</Link><span aria-hidden="true">/</span><span aria-current="page">{collection.title}</span></> : <span aria-current="page">Collections</span>}
      </nav>
      <header className="collection-intro">
        <p className="eyebrow purple">{department === "hair" ? "Hair | Accessories" : "Hair care & cosmetics"}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <nav className="collection-tabs" aria-label="Browse collections">
        <Link className={!collection ? "is-active" : ""} href={`/collections/${department}`}>All {department === "hair" ? "hair" : "care"}</Link>
        {departmentCollections.map((item) => <Link className={item.slug === slug ? "is-active" : ""} key={item.slug} href={`/collections/${item.slug}`}>{item.title}</Link>)}
      </nav>
      {!collection && <section className="collection-categories" aria-label="Shop by category">
        {departmentCollections.map((item) => <Link className="collection-tile" href={`/collections/${item.slug}`} key={item.slug}>
          <span className="collection-tile-image"><Image src={item.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" /></span>
          <span className="collection-tile-copy"><strong>{item.title}</strong><span>{item.description}</span><span className="collection-tile-action">Explore collection <ArrowRight aria-hidden="true" /></span></span>
        </Link>)}
      </section>}
      <section aria-labelledby="collection-products-title" className="collection-products">
        <div className="collection-products-heading"><div><p className="eyebrow purple">The Duchess edit</p><h2 id="collection-products-title">{collection ? collection.title : "All products"}</h2></div><span>{visible.length} {visible.length === 1 ? "product" : "products"}</span></div>
        {visible.length ? <div className="product-grid">{visible.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <p className="empty-copy">There are no products in this collection yet. <Link href={`/collections/${department}`}>Browse all collections</Link>.</p>}
      </section>
    </div>
  </main>;
}
